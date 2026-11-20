# SHA256 (Inhalt ab Zeile 2, d.h. dieser Datei ohne diese erste Zeile): 073687862a3ff5e8f7168b959792c58d4ff386e837f486279a162924612e077f
"""Einrichtung und Optionen."""
from __future__ import annotations

from collections.abc import Mapping
from typing import Any

try:  # Home Assistant Dev ersetzt voluptuous durch probatio (gleiche Schnittstelle)
    import probatio as vol
except ImportError:  # pragma: no cover
    import voluptuous as vol

from pypaperless import Paperless
from pypaperless.exceptions import (
    InitializationError,
    PaperlessConnectionError,
    PaperlessForbiddenError,
    PaperlessInactiveOrDeletedError,
    PaperlessInvalidTokenError,
)

from homeassistant.config_entries import ConfigEntry, ConfigFlow, ConfigFlowResult, OptionsFlow
from homeassistant.const import CONF_API_KEY, CONF_URL, CONF_VERIFY_SSL
from homeassistant.core import callback
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.selector import (
    BooleanSelector,
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
    TextSelector,
    TextSelectorConfig,
    TextSelectorType,
)

from .const import (
    DEFAULT_MAX_DOCUMENTS,
    DEFAULT_SCAN_INTERVAL,
    DOMAIN,
    LOGGER,
    MAX_MAX_DOCUMENTS,
    MAX_SCAN_INTERVAL,
    MIN_MAX_DOCUMENTS,
    MIN_SCAN_INTERVAL,
    OPT_EXP_EDIT,
    OPT_EXPERIMENTAL,
    OPT_MAX_DOCUMENTS,
    OPT_SCAN_INTERVAL,
    VERSION,
)

USER_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_URL): TextSelector(TextSelectorConfig(type=TextSelectorType.URL)),
        vol.Required(CONF_API_KEY): TextSelector(TextSelectorConfig(type=TextSelectorType.PASSWORD)),
        vol.Required(CONF_VERIFY_SSL, default=True): BooleanSelector(),
    }
)


async def _validate(hass, data: Mapping[str, Any]) -> dict[str, str]:
    errors: dict[str, str] = {}
    client = Paperless(  # type: ignore[abstract]
        data[CONF_URL],
        data[CONF_API_KEY],
        session=async_get_clientsession(hass, data.get(CONF_VERIFY_SSL, True)),
    )
    try:
        await client.initialize()
        await client.statistics()
    except PaperlessConnectionError:
        errors[CONF_URL] = "cannot_connect"
    except PaperlessInvalidTokenError:
        errors[CONF_API_KEY] = "invalid_api_key"
    except PaperlessInactiveOrDeletedError:
        errors[CONF_API_KEY] = "user_inactive_or_deleted"
    except PaperlessForbiddenError:
        errors[CONF_API_KEY] = "forbidden"
    except InitializationError:
        errors[CONF_URL] = "cannot_connect"
    except Exception:  # noqa: BLE001
        LOGGER.exception("Unerwarteter Fehler bei der Prüfung")
        errors["base"] = "unknown"
    return errors


UPDATE_TEXTS = {
    "de": {
        "unknown": "Noch nicht geprüft.",
        "failed": "Prüfung auf neue Version nicht möglich.",
        "available": "Neue Version {version} verfügbar: über HACS aktualisieren, Home Assistant neu starten, Browser neu laden (Strg+F5).",
        "current": "Du nutzt die neueste Version.",
    },
    "en": {
        "unknown": "Not checked yet.",
        "failed": "Could not check for a new version.",
        "available": "New version {version} available: update via HACS, restart Home Assistant, reload the browser (Ctrl+F5).",
        "current": "You are on the latest version.",
    },
    "nl": {
        "unknown": "Nog niet gecontroleerd.",
        "failed": "Controle op nieuwe versie niet mogelijk.",
        "available": "Nieuwe versie {version} beschikbaar: bijwerken via HACS, Home Assistant herstarten, browser herladen (Ctrl+F5).",
        "current": "Je gebruikt de nieuwste versie.",
    },
}


def _lang(tag: str | None) -> str:
    """Sprach-Tag nicht blind kürzen (Regelwerk 01, Abschnitt 9)."""
    parts = str(tag or "en").split("-")
    for cand in ("-".join(parts[:2]), parts[0]):
        if cand in UPDATE_TEXTS:
            return cand
    return "en"


class PaperlessManagerConfigFlow(ConfigFlow, domain=DOMAIN):
    """Einrichtungsablauf."""

    VERSION = 1

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        errors: dict[str, str] = {}
        if user_input is not None:
            user_input[CONF_URL] = user_input[CONF_URL].strip().rstrip("/")
            await self.async_set_unique_id(user_input[CONF_URL].lower())
            self._abort_if_unique_id_configured()
            errors = await _validate(self.hass, user_input)
            if not errors:
                return self.async_create_entry(title=user_input[CONF_URL], data=user_input)
        return self.async_show_form(
            step_id="user",
            data_schema=self.add_suggested_values_to_schema(USER_SCHEMA, user_input or {}),
            errors=errors,
        )

    async def async_step_reconfigure(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        entry = self._get_reconfigure_entry()
        errors: dict[str, str] = {}
        if user_input is not None:
            user_input[CONF_URL] = user_input[CONF_URL].strip().rstrip("/")
            errors = await _validate(self.hass, user_input)
            if not errors:
                return self.async_update_reload_and_abort(entry, data=user_input)
        suggested = user_input or {
            CONF_URL: entry.data[CONF_URL],
            CONF_VERIFY_SSL: entry.data.get(CONF_VERIFY_SSL, True),
        }
        return self.async_show_form(
            step_id="reconfigure",
            data_schema=self.add_suggested_values_to_schema(USER_SCHEMA, suggested),
            errors=errors,
        )

    async def async_step_reauth(self, entry_data: Mapping[str, Any]) -> ConfigFlowResult:
        return await self.async_step_reauth_confirm()

    async def async_step_reauth_confirm(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        entry = self._get_reauth_entry()
        errors: dict[str, str] = {}
        if user_input is not None:
            updated = {**entry.data, CONF_API_KEY: user_input[CONF_API_KEY]}
            errors = await _validate(self.hass, updated)
            if not errors:
                return self.async_update_reload_and_abort(entry, data=updated)
        return self.async_show_form(
            step_id="reauth_confirm",
            data_schema=vol.Schema(
                {vol.Required(CONF_API_KEY): TextSelector(TextSelectorConfig(type=TextSelectorType.PASSWORD))}
            ),
            errors=errors,
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:
        return PaperlessManagerOptionsFlow()


class PaperlessManagerOptionsFlow(OptionsFlow):
    """Optionen („Konfigurieren“)."""

    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        opts = self.config_entry.options
        if user_input is not None:
            if not user_input.get(OPT_EXPERIMENTAL):
                user_input[OPT_EXP_EDIT] = False
            return self.async_create_entry(data=user_input)

        fields: dict[Any, Any] = {
            vol.Required(OPT_SCAN_INTERVAL, default=opts.get(OPT_SCAN_INTERVAL, DEFAULT_SCAN_INTERVAL)): NumberSelector(
                NumberSelectorConfig(min=MIN_SCAN_INTERVAL, max=MAX_SCAN_INTERVAL, step=10, unit_of_measurement="s", mode=NumberSelectorMode.BOX)
            ),
            vol.Required(OPT_MAX_DOCUMENTS, default=opts.get(OPT_MAX_DOCUMENTS, DEFAULT_MAX_DOCUMENTS)): NumberSelector(
                NumberSelectorConfig(min=MIN_MAX_DOCUMENTS, max=MAX_MAX_DOCUMENTS, step=25, mode=NumberSelectorMode.BOX)
            ),
            vol.Required(OPT_EXPERIMENTAL, default=opts.get(OPT_EXPERIMENTAL, False)): BooleanSelector(),
        }
        # Einzelschalter erst sichtbar, wenn der Hauptschalter schon aktiv gespeichert ist (Regelwerk 07)
        if opts.get(OPT_EXPERIMENTAL, False):
            fields[vol.Required(OPT_EXP_EDIT, default=opts.get(OPT_EXP_EDIT, False))] = BooleanSelector()

        checker = getattr(getattr(self.config_entry, "runtime_data", None), "update_checker", None)
        texts = UPDATE_TEXTS[_lang(self.hass.config.language)]
        info = texts["unknown"]
        if checker is not None:
            if checker.check_failed:
                info = texts["failed"]
            elif checker.update_available:
                info = texts["available"].format(version=checker.latest_version)
            elif checker.latest_version:
                info = texts["current"]
        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(fields),
            description_placeholders={"version": VERSION, "update_info": info},
        )
