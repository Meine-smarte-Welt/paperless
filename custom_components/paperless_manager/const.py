# SHA256 (Inhalt ab Zeile 2, d.h. dieser Datei ohne diese erste Zeile): 1d357b5ee37ff7e970efc67eb22f74d5e78e8554f799fdbafdc7ab9ac46115dd
"""Konstanten für Paperless Manager."""
from __future__ import annotations

import logging

DOMAIN = "paperless_manager"
VERSION = "1.0.0b1"
GITHUB_REPO = "meine-smarte-welt/paperless_manager"

LOGGER = logging.getLogger(__package__)

CARD_FILE = "paperless-manager-card.js"
STATIC_URL = f"/{DOMAIN}_files"

OPT_SCAN_INTERVAL = "scan_interval"
OPT_MAX_DOCUMENTS = "max_documents"
OPT_EXPERIMENTAL = "experimental_enabled"
OPT_EXP_EDIT = "exp_edit"

DEFAULT_SCAN_INTERVAL = 120
MIN_SCAN_INTERVAL = 30
MAX_SCAN_INTERVAL = 3600
DEFAULT_MAX_DOCUMENTS = 200
MIN_MAX_DOCUMENTS = 25
MAX_MAX_DOCUMENTS = 1000

# Experimentelle Funktionen (Regelwerk 07): standardmäßig ausgeblendet.
# Schlüsselgleich zur Karte (EXPERIMENTAL im JS).
EXPERIMENTAL_FEATURES: tuple[dict[str, str], ...] = (
    {"key": "edit", "option": OPT_EXP_EDIT, "since": "1.0.0b1", "icon": "mdi:pencil"},
)

ACTIONS = ("refresh", "check_update", "update_document", "rename_classifier")

# Art -> API-Pfad
CLASSIFIER_PATHS = {
    "correspondent": "correspondents",
    "document_type": "document_types",
    "tag": "tags",
}

MAX_NAME_LEN = 128
MAX_TITLE_LEN = 128
CONTENT_PREVIEW_CHARS = 1500
