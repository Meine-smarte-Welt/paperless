| [🇩🇪<br>**Deutsch**](README.md) | 🇬🇧<br>**English** | [🇳🇱<br>**Nederlands**](README.nl.md) |
|:-:|:-:|:-:|

# Paperless Manager for Home Assistant

A card for Paperless-ngx with categories (documents, correspondents, document types, tags) and – experimental – editing right in the card. It talks to Paperless-ngx with the same client (`pypaperless`) as the core integration `paperless_ngx`. The domain is deliberately `paperless_manager` so it does not override the core integration; both can run side by side.

> **Test status (beta):** card and backend were checked against test data and a simulated Paperless server, **not** against a real Paperless-ngx instance and not inside a real Home Assistant. Feedback is very welcome. Details: [EXPERIMENTELL.md](EXPERIMENTELL.md) (German).

## Features

- **Categories as tabs:** Documents · Correspondents · Document types · Tags · Settings (cog). Each category can be switched on/off individually in the card editor, with a counter badge (inbox) and an icon colour per category.
- **Documents:** list with status dot (orange = inbox), correspondent, type, date, coloured tags and page count. Statistic chips (total, inbox, incomplete) double as filters. Search, sorting, “show more”.
- **Drill down:** tap a correspondent, document type or tag to see its documents.
- **Detail popup** with accordions: information, text preview (administrators only, truncated), link “Open in Paperless”.
- **Editing (experimental, off by default):** change title, correspondent, document type, tags, created date and archive serial number; rename correspondents, document types and tags.
- **Sensors:** documents total, in inbox, incomplete (among loaded documents), number of correspondents, document types, tags.
- **Languages:** German, English, Dutch (integration and card).
- Version display with update hint, `read_only`, `zoom`, per-card colours.

## New in 1.0.0b1

First release (beta).

## Requirements

- Home Assistant 2025.6 or newer, HACS
- Paperless-ngx with an API token. Editing needs change permissions for the Paperless user.

## Installation

**HACS:** add the custom repository `https://github.com/meine-smarte-welt/paperless_manager` (category *Integration*). Beta versions only show up when “Show beta versions” is enabled in HACS. Install, then restart Home Assistant.

**Manual:** copy `custom_components/paperless_manager` to `config/custom_components/` and restart.

## Setup

Settings → Devices & services → Add integration → *Paperless Manager*. Enter address (URL), API token (Paperless: My Profile) and SSL verification. In storage mode the card is added as a Lovelace resource automatically. In YAML mode add it manually as a *JavaScript module*: `/paperless_manager_files/paperless-manager-card.js`.

Options (“Configure”): polling interval (default 120 s), number of loaded documents (default 200, newest first), main switch for experimental features.

## The card

```yaml
type: custom:paperless-manager-card
title: Paperless
default_tab: documents      # documents | correspondents | types | tags | settings
show_types: true            # jede Kategorie einzeln: show_documents, show_correspondents, show_types, show_tags, show_settings
max_rows: 50
default_sort: added         # added | created | title
show_experimental: false    # true = experimentelle Funktionen (Bearbeiten) einblenden
read_only: false
```

All keys are available in the visual editor (groups: categories, appearance incl. columns, editing, experimental, colours). More keys: `zoom`, `show_stats`, `show_search`, `show_filter_bar`, `show_col_correspondent`, `show_col_type`, `show_col_date`, `show_col_tags`, `show_col_pages`, `entry_id` (multiple instances). Below about 480 px card width the tabs show icons only.

## Colours

Empty = theme default. Hex, `rgb()`, `hsl()` and `var(--…)` are allowed; anything else is discarded.

| Key | Meaning |
|---|---|
| `color_tab_active` | active tab |
| `color_success` / `color_warning` / `color_error` / `color_info` | green / orange / red / blue |
| `color_row_icon` | all row icons |
| `color_live_banner` | banner |
| `color_icon_documents`, `_correspondents`, `_types`, `_tags`, `_settings` | icon colour per category |

## Sensors

Documents total, documents in inbox, incomplete documents, correspondents, document types, tags. This version has no services and no events.

## Version display and update hint

The version is shown in the card (cog → app version), at the top of the card editor and in the options dialog. GitHub is queried every 12 hours (pre-releases too for beta/RC). New version: orange hint, “↑” on the cog.

## Security

- Editing, renaming, text preview and “check now/refresh” are **administrator-only**. Input is validated in the backend, card text is escaped, colours go through an allowlist.
- The document list (titles, correspondents, tags) can be retrieved by **every signed-in Home Assistant user** via the WebSocket API. If you must hide Paperless content from some HA users, do not use this integration.
- The API token stays in the Home Assistant config entry and is never sent to the card.

## Known limitations

- Beta, not tested against a real Paperless-ngx instance or real Home Assistant (e.g. automatic Lovelace resource registration, config flow, sensors).
- Only the newest N documents are loaded (option); the card says so. No full-text search across all documents.
- No thumbnails, no upload, no delete.
- Dutch not reviewed by native speakers.
- Card editor: labels and colour picker German only.

## Troubleshooting

Unknown card: check the resource, clear the browser cache (Ctrl+F5). “Permissions missing” when saving: the Paperless user needs change permissions. The diagnostics download contains counters only.

## Version history

| Version | Change |
|---|---|
| **1.0.0b1** | First release: category card, sensors, editing (experimental). |

## File integrity

`.py`, `.js` and `.yaml` files carry a SHA-256 hash in line 1 (content from line 2). JSON files:

| File | SHA-256 |
|---|---|
| `custom_components/paperless_manager/manifest.json` | `6856aa3df56c7775e62a1d9bb14082bae0c6986a7968f923bc9a90288f244e74` |
| `custom_components/paperless_manager/strings.json` | `bea53abea1a06ed07f15bb4a1ac4ca1d686e1d62346ad1b1d571b719a22d45e2` |
| `custom_components/paperless_manager/icons.json` | `6fb0bdbe4a3c7c08ee323319dfb0a27c9e039febb6b25dbe7139e1d4488fe971` |
| `custom_components/paperless_manager/translations/de.json` | `bea53abea1a06ed07f15bb4a1ac4ca1d686e1d62346ad1b1d571b719a22d45e2` |
| `custom_components/paperless_manager/translations/en.json` | `955abe1f6024cd76cf5a6928c48afa85ff1b933831eb962af9524c679d4dece7` |
| `custom_components/paperless_manager/translations/nl.json` | `40c8d85cd0ddd3c46a82bfdb8c9e347b7e6d1731f8c07381640a6d626263c633` |

## License

MIT, see [LICENSE](LICENSE).
