# SHA256 (Inhalt ab Zeile 2, d.h. dieser Datei ohne diese erste Zeile): e9ea3499e04fccf3e14e1b074f91fac4cc5d9440386802fc4c39cf2aa0317bd7
"""Übersichts-Sensoren."""
from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from typing import Any

from homeassistant.components.sensor import SensorEntity, SensorEntityDescription, SensorStateClass
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback

from .const import DOMAIN
from .manager import PaperlessManager


@dataclass(frozen=True, kw_only=True)
class PMSensorDescription(SensorEntityDescription):
    value_fn: Callable[[PaperlessManager], int | None]


SENSORS: tuple[PMSensorDescription, ...] = (
    PMSensorDescription(key="documents_total", translation_key="documents_total",
        state_class=SensorStateClass.MEASUREMENT, value_fn=lambda m: m.stats.get("documents_total")),
    PMSensorDescription(key="documents_inbox", translation_key="documents_inbox",
        state_class=SensorStateClass.MEASUREMENT, value_fn=lambda m: m.stats.get("documents_inbox")),
    PMSensorDescription(key="documents_incomplete", translation_key="documents_incomplete",
        state_class=SensorStateClass.MEASUREMENT,
        value_fn=lambda m: sum(1 for d in m.documents if d["correspondent"] is None or d["document_type"] is None)),
    PMSensorDescription(key="correspondent_count", translation_key="correspondent_count",
        state_class=SensorStateClass.MEASUREMENT, value_fn=lambda m: m.stats.get("correspondent_count")),
    PMSensorDescription(key="document_type_count", translation_key="document_type_count",
        state_class=SensorStateClass.MEASUREMENT, value_fn=lambda m: m.stats.get("document_type_count")),
    PMSensorDescription(key="tag_count", translation_key="tag_count",
        state_class=SensorStateClass.MEASUREMENT, value_fn=lambda m: m.stats.get("tag_count")),
)


async def async_setup_entry(hass: HomeAssistant, entry, async_add_entities: AddConfigEntryEntitiesCallback) -> None:
    manager: PaperlessManager = entry.runtime_data
    async_add_entities(PMSensor(manager, d) for d in SENSORS)


class PMSensor(SensorEntity):
    """Zähler aus dem Manager."""

    _attr_has_entity_name = True
    _attr_should_poll = False
    entity_description: PMSensorDescription

    def __init__(self, manager: PaperlessManager, description: PMSensorDescription) -> None:
        self._manager = manager
        self.entity_description = description
        entry_id = manager.entry.entry_id
        self._attr_unique_id = f"{entry_id}_{description.key}"
        self._attr_device_info = DeviceInfo(
            entry_type=DeviceEntryType.SERVICE,
            identifiers={(DOMAIN, entry_id)},
            manufacturer="Paperless-ngx",
            name="Paperless-ngx",
            sw_version=manager.api.host_version,
            configuration_url=str(manager.api.base_url),
        )

    @property
    def available(self) -> bool:
        return self._manager.connected

    @property
    def native_value(self) -> Any:
        return self.entity_description.value_fn(self._manager)

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(self._manager.async_add_listener(self._handle))

    @callback
    def _handle(self) -> None:
        self.async_write_ha_state()
