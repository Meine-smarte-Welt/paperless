# SHA256 (Inhalt ab Zeile 2, d.h. dieser Datei ohne diese erste Zeile): 40d54a9b8acfbdeeaed66984c84ea703e80b9b130787024ed486f785dbcdf6eb
"""Paperless Manager – Karte mit Kategorien für Paperless-ngx."""
from __future__ import annotations

from pathlib import Path

from pypaperless import Paperless
from pypaperless.exceptions import (
    InitializationError,
    PaperlessConnectionError,
    PaperlessForbiddenError,
    PaperlessInactiveOrDeletedError,
    PaperlessInvalidTokenError,
)

from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_API_KEY, CONF_URL, CONF_VERIFY_SSL, Platform
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryAuthFailed, ConfigEntryError, ConfigEntryNotReady
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.start import async_at_started

from . import websocket_api
from .const import CARD_FILE, DOMAIN, LOGGER, STATIC_URL, VERSION
from .manager import PaperlessManager

PLATFORMS: list[Platform] = [Platform.SENSOR]

type PaperlessManagerConfigEntry = ConfigEntry[PaperlessManager]


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Statischen Pfad der Karte und WebSocket-Befehle einmalig registrieren."""
    www = Path(__file__).parent / "www"
    await hass.http.async_register_static_paths(
        [StaticPathConfig(STATIC_URL, str(www), cache_headers=False)]
    )
    websocket_api.async_register(hass)
    async_at_started(hass, _async_register_resource)
    return True


async def _async_register_resource(hass: HomeAssistant) -> None:
    """Karte als Lovelace-Ressource eintragen (nur Speichermodus)."""
    base = f"{STATIC_URL}/{CARD_FILE}"
    url = f"{base}?v={VERSION}"
    try:
        from homeassistant.components.lovelace.const import LOVELACE_DATA

        data = hass.data.get(LOVELACE_DATA)
        resources = getattr(data, "resources", None)
        mode = getattr(data, "resource_mode", "storage")
        if resources is None or mode != "storage":
            LOGGER.info("Lovelace im YAML-Modus: Ressource bitte manuell eintragen: %s", url)
            return
        if not getattr(resources, "loaded", True):
            await resources.async_load()
        for item in resources.async_items():
            if str(item.get("url", "")).split("?")[0] == base:
                if item["url"] != url:
                    await resources.async_update_item(item["id"], {"res_type": "module", "url": url})
                return
        await resources.async_create_item({"res_type": "module", "url": url})
    except Exception as err:  # noqa: BLE001
        LOGGER.warning(
            "Karte konnte nicht automatisch als Ressource eingetragen werden (%s). "
            "Bitte manuell hinzufügen: %s (Typ: JavaScript-Modul)",
            type(err).__name__,
            url,
        )


async def async_setup_entry(hass: HomeAssistant, entry: PaperlessManagerConfigEntry) -> bool:
    api = Paperless(  # type: ignore[abstract]
        entry.data[CONF_URL],
        entry.data[CONF_API_KEY],
        session=async_get_clientsession(hass, entry.data.get(CONF_VERIFY_SSL, True)),
    )
    try:
        await api.initialize()
        await api.statistics()
    except PaperlessConnectionError as err:
        raise ConfigEntryNotReady(translation_domain=DOMAIN, translation_key="cannot_connect") from err
    except PaperlessInvalidTokenError as err:
        raise ConfigEntryAuthFailed(translation_domain=DOMAIN, translation_key="invalid_api_key") from err
    except PaperlessInactiveOrDeletedError as err:
        raise ConfigEntryAuthFailed(translation_domain=DOMAIN, translation_key="user_inactive_or_deleted") from err
    except PaperlessForbiddenError as err:
        raise ConfigEntryError(translation_domain=DOMAIN, translation_key="forbidden") from err
    except InitializationError as err:
        raise ConfigEntryNotReady(translation_domain=DOMAIN, translation_key="cannot_connect") from err

    manager = PaperlessManager(hass, entry, api)
    await manager.async_start()
    entry.runtime_data = manager

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    entry.async_on_unload(entry.add_update_listener(_async_reload))
    return True


async def _async_reload(hass: HomeAssistant, entry: PaperlessManagerConfigEntry) -> None:
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: PaperlessManagerConfigEntry) -> bool:
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded:
        entry.runtime_data.async_stop()
    return unloaded
