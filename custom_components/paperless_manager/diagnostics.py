# SHA256 (Inhalt ab Zeile 2, d.h. dieser Datei ohne diese erste Zeile): 4046045402589688bbbcfb2f8d3781e720a97e3ffdde4cac7ffd1b68742f57c3
"""Anonymisierte Diagnose (nur Zähler, keine Titel, Namen oder Adressen)."""
from __future__ import annotations

from typing import Any

from homeassistant.core import HomeAssistant


async def async_get_config_entry_diagnostics(hass: HomeAssistant, entry) -> dict[str, Any]:
    return entry.runtime_data.diagnostics()
