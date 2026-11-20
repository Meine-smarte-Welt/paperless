# SHA256 (Inhalt ab Zeile 2, d.h. dieser Datei ohne diese erste Zeile): 2fc54df66218bcb9ca5d8a75a93f0235b3eef35f24fbfa442e317e2a490e372e
"""Manager: hält den Zustand, fragt Paperless-ngx ab und führt Änderungen aus."""
from __future__ import annotations

import asyncio
import re
from collections.abc import Callable
from datetime import date, datetime, timedelta, timezone
from typing import Any

import aiohttp
from pypaperless import Paperless
from pypaperless.exceptions import (
    JsonResponseWithError,
    PaperlessConnectionError,
    PaperlessError,
    PaperlessForbiddenError,
    PaperlessInactiveOrDeletedError,
    PaperlessInvalidTokenError,
)

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.event import async_track_time_interval

from .const import (
    CLASSIFIER_PATHS,
    CONTENT_PREVIEW_CHARS,
    DEFAULT_MAX_DOCUMENTS,
    DEFAULT_SCAN_INTERVAL,
    EXPERIMENTAL_FEATURES,
    LOGGER,
    MAX_NAME_LEN,
    MAX_TITLE_LEN,
    OPT_EXPERIMENTAL,
    OPT_MAX_DOCUMENTS,
    OPT_SCAN_INTERVAL,
    VERSION,
)
from .update_check import UpdateChecker

_HEX_COLOR = re.compile(r"^#[0-9a-fA-F]{3,8}$")
_DOC_FIELDS = (
    "id,title,correspondent,document_type,tags,created,added,page_count,"
    "mime_type,archive_serial_number,original_file_name"
)


class ManagerError(Exception):
    """Fehler mit Code, den die Karte übersetzt."""

    def __init__(self, code: str) -> None:
        super().__init__(code)
        self.code = code


def _color(value: Any) -> str:
    return value if isinstance(value, str) and _HEX_COLOR.match(value) else ""


def _date_str(value: Any) -> str:
    return str(value)[:10] if value else ""


class PaperlessManager:
    """Zustand und Aktionen einer Paperless-ngx-Instanz."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry, api: Paperless) -> None:
        self.hass = hass
        self.entry = entry
        self.api = api
        self.update_checker = UpdateChecker(hass)
        self._listeners: list[Callable[[], None]] = []
        self._unsub_timer = None
        self._lock = asyncio.Lock()
        self._inbox_tag_ids: set[int] = set()
        self.connected = False
        self.error: str | None = None
        self.updated: str | None = None
        self.stats: dict[str, Any] = {}
        self.correspondents: list[dict[str, Any]] = []
        self.document_types: list[dict[str, Any]] = []
        self.tags: list[dict[str, Any]] = []
        self.documents: list[dict[str, Any]] = []
        self.documents_total = 0

    # --- Optionen -----------------------------------------------------
    @property
    def scan_interval(self) -> int:
        return int(self.entry.options.get(OPT_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL))

    @property
    def max_documents(self) -> int:
        return int(self.entry.options.get(OPT_MAX_DOCUMENTS, DEFAULT_MAX_DOCUMENTS))

    def feature_enabled(self, key: str) -> bool:
        """Experimentelle Funktion nur aktiv, wenn Hauptschalter UND Einzelschalter an."""
        if not self.entry.options.get(OPT_EXPERIMENTAL, False):
            return False
        for feat in EXPERIMENTAL_FEATURES:
            if feat["key"] == key:
                return bool(self.entry.options.get(feat["option"], False))
        return False

    # --- Lebenszyklus -------------------------------------------------
    async def async_start(self) -> None:
        await self.async_refresh()
        self._unsub_timer = async_track_time_interval(
            self.hass, self._tick, timedelta(seconds=self.scan_interval)
        )
        await self.update_checker.async_start(self._notify)

    @callback
    def async_stop(self) -> None:
        if self._unsub_timer:
            self._unsub_timer()
            self._unsub_timer = None
        self.update_checker.async_stop()
        self._listeners.clear()

    async def _tick(self, _now) -> None:
        await self.async_refresh()

    @callback
    def async_add_listener(self, cb: Callable[[], None]) -> Callable[[], None]:
        self._listeners.append(cb)

        @callback
        def _remove() -> None:
            if cb in self._listeners:
                self._listeners.remove(cb)

        return _remove

    @callback
    def _notify(self) -> None:
        for cb in list(self._listeners):
            try:
                cb()
            except Exception:  # noqa: BLE001
                LOGGER.exception("Fehler in Listener")

    # --- Abruf --------------------------------------------------------
    async def _get_all(self, path: str, params: dict[str, Any], limit: int = 5000) -> list[dict]:
        items: list[dict] = []
        page = 1
        while len(items) < limit:
            res = await self.api.request_json(
                "get", path, params={**params, "page": page, "page_size": 250}
            )
            items.extend(res.get("results", []))
            if not res.get("next"):
                break
            page += 1
        return items

    async def async_refresh(self) -> None:
        """Alle Daten neu laden; bei Fehler bleibt der letzte Stand erhalten."""
        async with self._lock:
            try:
                await self._fetch()
                self.connected = True
                self.error = None
                self.updated = datetime.now(timezone.utc).isoformat()
            except PaperlessInvalidTokenError:
                self._fail("invalid_api_key")
                self.entry.async_start_reauth(self.hass)
            except PaperlessInactiveOrDeletedError:
                self._fail("user_inactive_or_deleted")
                self.entry.async_start_reauth(self.hass)
            except PaperlessForbiddenError:
                self._fail("forbidden")
            except (PaperlessConnectionError, aiohttp.ClientError, TimeoutError):
                self._fail("cannot_connect")
            except (PaperlessError, KeyError, ValueError, TypeError) as err:
                LOGGER.warning("Unerwartete Antwort von Paperless-ngx: %s", type(err).__name__)
                self._fail("unexpected_response")
        self._notify()

    def _fail(self, code: str) -> None:
        self.connected = False
        self.error = code

    async def _fetch(self) -> None:
        stats = await self.api.request_json("get", "/api/statistics/")
        tags_raw = await self._get_all(
            "/api/tags/", {"fields": "id,name,color,text_color,is_inbox_tag,document_count,parent"}
        )
        corr_raw = await self._get_all(
            "/api/correspondents/", {"fields": "id,name,document_count,last_correspondence"}
        )
        types_raw = await self._get_all(
            "/api/document_types/", {"fields": "id,name,document_count"}
        )
        docs_res = await self.api.request_json(
            "get",
            "/api/documents/",
            params={
                "page_size": self.max_documents,
                "page": 1,
                "ordering": "-added",
                "fields": _DOC_FIELDS,
            },
        )
        self.stats = {
            "documents_total": int(stats.get("documents_total") or 0),
            "documents_inbox": int(stats.get("documents_inbox") or 0),
            "tag_count": int(stats.get("tag_count") or 0),
            "correspondent_count": int(stats.get("correspondent_count") or 0),
            "document_type_count": int(stats.get("document_type_count") or 0),
        }
        self.tags = [
            {
                "id": int(t["id"]),
                "name": str(t.get("name", "")),
                "color": _color(t.get("color")),
                "text_color": _color(t.get("text_color")),
                "inbox": bool(t.get("is_inbox_tag")),
                "count": int(t.get("document_count") or 0),
                "parent": t.get("parent"),
            }
            for t in tags_raw
        ]
        self._inbox_tag_ids = {t["id"] for t in self.tags if t["inbox"]}
        self.correspondents = [
            {
                "id": int(c["id"]),
                "name": str(c.get("name", "")),
                "count": int(c.get("document_count") or 0),
                "last": _date_str(c.get("last_correspondence")),
            }
            for c in corr_raw
        ]
        self.document_types = [
            {
                "id": int(d["id"]),
                "name": str(d.get("name", "")),
                "count": int(d.get("document_count") or 0),
            }
            for d in types_raw
        ]
        self.documents_total = int(docs_res.get("count") or 0)
        self.documents = [self._map_document(d) for d in docs_res.get("results", [])]

    def _map_document(self, d: dict[str, Any]) -> dict[str, Any]:
        tags = [int(x) for x in (d.get("tags") or [])]
        return {
            "id": int(d["id"]),
            "title": str(d.get("title") or ""),
            "correspondent": d.get("correspondent"),
            "document_type": d.get("document_type"),
            "tags": tags,
            "created": _date_str(d.get("created")),
            "added": _date_str(d.get("added")),
            "pages": d.get("page_count"),
            "mime": str(d.get("mime_type") or ""),
            "asn": d.get("archive_serial_number"),
            "file": str(d.get("original_file_name") or ""),
            "inbox": any(t in self._inbox_tag_ids for t in tags),
        }

    # --- Momentaufnahme für die Karte --------------------------------
    def snapshot(self) -> dict[str, Any]:
        base = str(self.api.base_url).rstrip("/")
        return {
            "connected": self.connected,
            "error": self.error,
            "updated": self.updated,
            "server": {
                "url": base if base.startswith(("http://", "https://")) else "",
                "version": self.api.host_version,
            },
            "stats": self.stats,
            "tags": self.tags,
            "correspondents": self.correspondents,
            "document_types": self.document_types,
            "documents": self.documents,
            "documents_total": self.documents_total,
            "options": {
                "scan_interval": self.scan_interval,
                "max_documents": self.max_documents,
            },
            "experimental": {
                "enabled": bool(self.entry.options.get(OPT_EXPERIMENTAL, False)),
                "count": len(EXPERIMENTAL_FEATURES),
                "features": {f["key"]: self.feature_enabled(f["key"]) for f in EXPERIMENTAL_FEATURES},
            },
            "app": self.update_checker.snapshot(),
        }

    def info(self) -> dict[str, Any]:
        return {"entry_id": self.entry.entry_id, "app": self.update_checker.snapshot()}

    # --- Aktionen (nur Admin, im WebSocket geprüft) ------------------
    def _require_edit(self) -> None:
        if not self.feature_enabled("edit"):
            raise ManagerError("experimental_disabled")

    def _validate_document_fields(self, fields: dict[str, Any]) -> dict[str, Any]:
        if not isinstance(fields, dict) or not fields:
            raise ManagerError("invalid_field")
        known_corr = {c["id"] for c in self.correspondents}
        known_types = {d["id"] for d in self.document_types}
        known_tags = {t["id"] for t in self.tags}
        out: dict[str, Any] = {}
        for key, value in fields.items():
            if key == "title":
                if not isinstance(value, str) or not value.strip() or len(value.strip()) > MAX_TITLE_LEN:
                    raise ManagerError("invalid_title")
                out["title"] = value.strip()
            elif key in ("correspondent", "document_type"):
                known = known_corr if key == "correspondent" else known_types
                if value is not None and (isinstance(value, bool) or not isinstance(value, int) or value not in known):
                    raise ManagerError("invalid_field")
                out[key] = value
            elif key == "tags":
                if (
                    not isinstance(value, list)
                    or len(value) > 100
                    or any(isinstance(t, bool) or not isinstance(t, int) or t not in known_tags for t in value)
                ):
                    raise ManagerError("invalid_field")
                out["tags"] = sorted(set(value))
            elif key == "created":
                try:
                    out["created"] = date.fromisoformat(str(value)).isoformat()
                except ValueError as err:
                    raise ManagerError("invalid_date") from err
            elif key == "archive_serial_number":
                if value is not None and (isinstance(value, bool) or not isinstance(value, int) or value < 0):
                    raise ManagerError("invalid_field")
                out[key] = value
            else:
                raise ManagerError("invalid_field")
        return out

    async def _patch(self, path: str, payload: dict[str, Any]) -> dict[str, Any]:
        try:
            return await self.api.request_json("patch", path, json=payload)
        except PaperlessForbiddenError as err:
            raise ManagerError("forbidden") from err
        except JsonResponseWithError as err:
            LOGGER.debug("Paperless lehnt Änderung ab: %s", type(err).__name__)
            raise ManagerError("rejected") from err
        except aiohttp.ClientResponseError as err:
            raise ManagerError("not_found" if err.status == 404 else "failed") from err
        except (PaperlessConnectionError, aiohttp.ClientError, TimeoutError) as err:
            raise ManagerError("cannot_connect") from err
        except PaperlessError as err:
            raise ManagerError("failed") from err

    async def async_update_document(self, doc: int, fields: dict[str, Any]) -> None:
        self._require_edit()
        payload = self._validate_document_fields(fields)
        await self._patch(f"/api/documents/{int(doc)}/", payload)
        await self.async_refresh()

    async def async_rename_classifier(self, kind: str, classifier: int, name: str) -> None:
        self._require_edit()
        if kind not in CLASSIFIER_PATHS:
            raise ManagerError("invalid_field")
        if not isinstance(name, str) or not name.strip() or len(name.strip()) > MAX_NAME_LEN:
            raise ManagerError("invalid_title")
        pool = {"correspondent": self.correspondents, "document_type": self.document_types, "tag": self.tags}[kind]
        if classifier not in {c["id"] for c in pool}:
            raise ManagerError("not_found")
        await self._patch(f"/api/{CLASSIFIER_PATHS[kind]}/{int(classifier)}/", {"name": name.strip()})
        await self.async_refresh()

    async def async_document_details(self, doc: int) -> dict[str, Any]:
        """Zusatzangaben fürs Popup (Textvorschau gekürzt)."""
        try:
            res = await self.api.request_json(
                "get",
                f"/api/documents/{int(doc)}/",
                params={"fields": "id,content,modified,archived_file_name,notes"},
            )
        except aiohttp.ClientResponseError as err:
            raise ManagerError("not_found" if err.status == 404 else "failed") from err
        except (PaperlessConnectionError, aiohttp.ClientError, TimeoutError) as err:
            raise ManagerError("cannot_connect") from err
        except PaperlessError as err:
            raise ManagerError("failed") from err
        content = str(res.get("content") or "")
        return {
            "doc": int(res.get("id", doc)),
            "content": content[:CONTENT_PREVIEW_CHARS],
            "content_truncated": len(content) > CONTENT_PREVIEW_CHARS,
            "modified": _date_str(res.get("modified")),
            "notes": len(res.get("notes") or []),
        }

    def diagnostics(self) -> dict[str, Any]:
        return {
            "version": VERSION,
            "connected": self.connected,
            "error": self.error,
            "paperless_version": self.api.host_version,
            "stats": self.stats,
            "loaded_documents": len(self.documents),
            "options": dict(self.entry.options),
        }
