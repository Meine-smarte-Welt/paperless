# SHA256 (Inhalt ab Zeile 2, d.h. dieser Datei ohne diese erste Zeile): a9aa4fdfdfb5d18b7c4649a82932106ddd8f6b5312f70171fbc73ce17d80623c
"""WebSocket-API: subscribe / info / action / details (Schreiben nur Admin)."""
from __future__ import annotations

from typing import Any

try:  # Home Assistant Dev ersetzt voluptuous durch probatio (gleiche Schnittstelle)
    import probatio as vol
except ImportError:  # pragma: no cover
    import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from .const import ACTIONS, CLASSIFIER_PATHS, DOMAIN
from .manager import ManagerError, PaperlessManager


def _managers(hass: HomeAssistant) -> list[PaperlessManager]:
    out = []
    for entry in hass.config_entries.async_loaded_entries(DOMAIN):
        manager = getattr(entry, "runtime_data", None)
        if manager is not None:
            out.append(manager)
    return out


def _get_manager(hass: HomeAssistant, entry_id: str | None) -> PaperlessManager | None:
    managers = _managers(hass)
    if entry_id:
        return next((m for m in managers if m.entry.entry_id == entry_id), None)
    return managers[0] if managers else None


@callback
def async_register(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, ws_subscribe)
    websocket_api.async_register_command(hass, ws_info)
    websocket_api.async_register_command(hass, ws_action)
    websocket_api.async_register_command(hass, ws_details)


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/subscribe",
        vol.Optional("entry_id"): str,
    }
)
@callback
def ws_subscribe(hass: HomeAssistant, connection, msg: dict[str, Any]) -> None:
    manager = _get_manager(hass, msg.get("entry_id"))
    if manager is None:
        connection.send_error(msg["id"], "not_found", "no_entry")
        return

    @callback
    def _push() -> None:
        connection.send_message(
            websocket_api.event_message(msg["id"], {"type": "snapshot", "data": manager.snapshot()})
        )

    unsub = manager.async_add_listener(_push)
    connection.subscriptions[msg["id"]] = unsub
    connection.send_result(msg["id"])
    _push()


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/info",
        vol.Optional("entry_id"): str,
    }
)
@callback
def ws_info(hass: HomeAssistant, connection, msg: dict[str, Any]) -> None:
    manager = _get_manager(hass, msg.get("entry_id"))
    if manager is None:
        connection.send_error(msg["id"], "not_found", "no_entry")
        return
    connection.send_result(msg["id"], manager.info())


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/action",
        vol.Optional("entry_id"): str,
        vol.Required("action"): vol.In(ACTIONS),
        vol.Optional("doc"): vol.All(int, vol.Range(min=1)),
        vol.Optional("fields"): dict,
        vol.Optional("kind"): vol.In(tuple(CLASSIFIER_PATHS)),
        vol.Optional("classifier"): vol.All(int, vol.Range(min=1)),
        vol.Optional("name"): str,
    }
)
@websocket_api.async_response
async def ws_action(hass: HomeAssistant, connection, msg: dict[str, Any]) -> None:
    manager = _get_manager(hass, msg.get("entry_id"))
    if manager is None:
        connection.send_error(msg["id"], "not_found", "no_entry")
        return
    action = msg["action"]
    try:
        if action == "refresh":
            await manager.async_refresh()
        elif action == "check_update":
            await manager.update_checker.async_check()
        elif action == "update_document":
            if "doc" not in msg or "fields" not in msg:
                raise ManagerError("invalid_field")
            await manager.async_update_document(msg["doc"], msg["fields"])
        elif action == "rename_classifier":
            if not {"kind", "classifier", "name"} <= msg.keys():
                raise ManagerError("invalid_field")
            await manager.async_rename_classifier(msg["kind"], msg["classifier"], msg["name"])
    except ManagerError as err:
        connection.send_error(msg["id"], err.code, err.code)
        return
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/details",
        vol.Optional("entry_id"): str,
        vol.Required("doc"): vol.All(int, vol.Range(min=1)),
    }
)
@websocket_api.async_response
async def ws_details(hass: HomeAssistant, connection, msg: dict[str, Any]) -> None:
    manager = _get_manager(hass, msg.get("entry_id"))
    if manager is None:
        connection.send_error(msg["id"], "not_found", "no_entry")
        return
    try:
        data = await manager.async_document_details(msg["doc"])
    except ManagerError as err:
        connection.send_error(msg["id"], err.code, err.code)
        return
    connection.send_result(msg["id"], data)
