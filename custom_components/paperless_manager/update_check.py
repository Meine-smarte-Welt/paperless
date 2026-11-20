# SHA256 (Inhalt ab Zeile 2, d.h. dieser Datei ohne diese erste Zeile): 34cd954c17bb83be41fab4a818de80bf6b288f2f9c089c0fe3662b12eebddf29
"""Versionsabfrage gegen GitHub (alle 12 Stunden)."""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any

import aiohttp
from packaging.version import InvalidVersion, Version

from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.event import async_track_time_interval

from .const import GITHUB_REPO, LOGGER, VERSION

CHECK_INTERVAL = timedelta(hours=12)
RELEASES_URL = f"https://github.com/{GITHUB_REPO}/releases"


def _parse(value: str | None) -> Version | None:
    if not value:
        return None
    try:
        return Version(value.lstrip("vV"))
    except InvalidVersion:
        return None


class UpdateChecker:
    """Fragt GitHub nach der neuesten Version."""

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self.latest_version: str | None = None
        self.release_url: str = RELEASES_URL
        self.checked_at: str | None = None
        self.check_failed = False
        self._unsub = None

    @property
    def update_available(self) -> bool:
        latest, current = _parse(self.latest_version), _parse(VERSION)
        return bool(latest and current and latest > current)

    def snapshot(self) -> dict[str, Any]:
        return {
            "version": VERSION,
            "latest_version": self.latest_version,
            "release_url": self.release_url,
            "update_available": self.update_available,
            "checked_at": self.checked_at,
            "check_failed": self.check_failed,
        }

    async def async_start(self, on_change) -> None:
        self._on_change = on_change
        self._unsub = async_track_time_interval(
            self.hass, self._tick, CHECK_INTERVAL
        )
        self.hass.async_create_task(self.async_check())

    def async_stop(self) -> None:
        if self._unsub:
            self._unsub()
            self._unsub = None

    async def _tick(self, _now) -> None:
        await self.async_check()

    async def async_check(self) -> None:
        """Neueste Version holen (Release, bei Beta/RC auch Pre-releases)."""
        session = async_get_clientsession(self.hass)
        current = _parse(VERSION)
        include_pre = bool(current and current.is_prerelease)
        url = (
            f"https://api.github.com/repos/{GITHUB_REPO}/releases?per_page=5"
            if include_pre
            else f"https://api.github.com/repos/{GITHUB_REPO}/releases/latest"
        )
        try:
            async with session.get(
                url,
                headers={"Accept": "application/vnd.github+json"},
                timeout=aiohttp.ClientTimeout(total=15),
            ) as res:
                res.raise_for_status()
                payload = await res.json()
            releases = payload if isinstance(payload, list) else [payload]
            best: tuple[Version, dict[str, Any]] | None = None
            for rel in releases:
                ver = _parse(str(rel.get("tag_name", "")))
                if ver and (best is None or ver > best[0]):
                    best = (ver, rel)
            if best is None:
                raise ValueError("kein Release gefunden")
            self.latest_version = str(best[1]["tag_name"]).lstrip("vV")
            link = str(best[1].get("html_url", ""))
            self.release_url = link if link.startswith("https://github.com/") else RELEASES_URL
            self.check_failed = False
        except (aiohttp.ClientError, TimeoutError, ValueError, KeyError) as err:
            LOGGER.debug("Versionsprüfung fehlgeschlagen: %s", type(err).__name__)
            self.check_failed = True
        self.checked_at = datetime.now(timezone.utc).isoformat()
        if getattr(self, "_on_change", None):
            self._on_change()
