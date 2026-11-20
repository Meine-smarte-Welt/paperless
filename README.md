| 🇩🇪<br>**Deutsch** | [🇬🇧<br>**English**](README.en.md) | [🇳🇱<br>**Nederlands**](README.nl.md) |
|:-:|:-:|:-:|

# Paperless Manager für Home Assistant

Eine Karte für Paperless-ngx mit Kategorien (Dokumente, Korrespondenten, Dokumenttypen, Tags) und – experimentell – Bearbeiten direkt in der Karte. Die Verbindung zu Paperless-ngx läuft über denselben Client (`pypaperless`) wie die Core-Integration `paperless_ngx`. Die Integration heißt bewusst `paperless_manager`, damit sie die Core-Integration nicht überschreibt; beide laufen parallel.

> **Teststand (Beta):** Karte und Backend wurden gegen Testdaten und einen simulierten Paperless-Server geprüft, **nicht** gegen eine echte Paperless-ngx-Instanz und nicht in einer echten Home-Assistant-Installation. Rückmeldungen sind ausdrücklich erwünscht. Details: [EXPERIMENTELL.md](EXPERIMENTELL.md).

## Funktionsumfang

- **Kategorien als Tabs:** Dokumente · Korrespondenten · Dokumenttypen · Tags · Einstellungen (Zahnrad). Jede Kategorie ist im Karten-Editor einzeln ein- und ausschaltbar, mit Zähler-Badge (Posteingang) und Symbolfarbe je Kategorie.
- **Dokumente:** Liste mit Statuspunkt (orange = Posteingang), Korrespondent, Typ, Datum, farbigen Tags und Seitenzahl. Statistik-Chips (Gesamt, Posteingang, Unvollständig) sind zugleich Filter. Suche, Sortierung, „Mehr anzeigen“.
- **Kategorien durchklicken:** Ein Tipp auf einen Korrespondenten, Dokumenttyp oder Tag zeigt die zugehörigen Dokumente.
- **Detail-Popup** mit Akkordeon: Informationen, Textvorschau (nur Administratoren, gekürzt), Link „In Paperless öffnen“.
- **Bearbeiten (experimentell, Standard aus):** Titel, Korrespondent, Dokumenttyp, Tags, Erstellungsdatum und Archivnummer eines Dokuments ändern; Korrespondenten, Dokumenttypen und Tags umbenennen.
- **Sensoren:** Dokumente gesamt, im Posteingang, unvollständig (unter den geladenen Dokumenten), Anzahl Korrespondenten, Dokumenttypen, Tags.
- **Sprachen:** Deutsch, Englisch, Niederländisch (Integration und Karte).
- Versionsanzeige mit Update-Hinweis, `read_only`, `zoom`, Farben pro Karte.

## Neu in 1.0.0b1

Erste Veröffentlichung (Beta).

## Voraussetzungen

- Home Assistant 2025.6 oder neuer, HACS
- Paperless-ngx mit API-Token. Zum Bearbeiten braucht der Paperless-Benutzer Änderungsrechte.

## Installation

**HACS:** Benutzerdefiniertes Repository `https://github.com/meine-smarte-welt/paperless_manager` (Kategorie *Integration*) hinzufügen. Beta-Versionen erscheinen nur, wenn in HACS „Beta-Versionen anzeigen“ aktiviert ist. Danach installieren und Home Assistant neu starten.

**Manuell:** Ordner `custom_components/paperless_manager` nach `config/custom_components/` kopieren, neu starten.

## Einrichtung

Einstellungen → Geräte & Dienste → Integration hinzufügen → *Paperless Manager*. Adresse (URL), API-Token (Paperless: Mein Profil) und SSL-Prüfung eintragen. Die Karte wird im Speichermodus automatisch als Lovelace-Ressource eingetragen. Im YAML-Modus manuell als *JavaScript-Modul* hinzufügen: `/paperless_manager_files/paperless-manager-card.js`.

Optionen („Konfigurieren“): Abfrageintervall (Standard 120 s), Anzahl geladener Dokumente (Standard 200, neueste zuerst), Hauptschalter für experimentelle Funktionen.

## Die Karte

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

Alle Schlüssel sind im grafischen Editor einstellbar (Gruppen: Kategorien, Darstellung inkl. Spalten, Bearbeiten, Experimentell, Farben). Weitere Schlüssel: `zoom`, `show_stats`, `show_search`, `show_filter_bar`, `show_col_correspondent`, `show_col_type`, `show_col_date`, `show_col_tags`, `show_col_pages`, `entry_id` (bei mehreren Instanzen). Unter ca. 480 px Kartenbreite zeigen die Tabs nur Symbole.

## Farben

Leer = Theme-Standard. Erlaubt sind Hex, `rgb()`, `hsl()`, `var(--…)`; Ungültiges wird verworfen.

| Schlüssel | Bedeutung |
|---|---|
| `color_tab_active` | aktiver Tab |
| `color_success` / `color_warning` / `color_error` / `color_info` | grün / orange / rot / blau |
| `color_row_icon` | alle Zeilensymbole |
| `color_live_banner` | Banner |
| `color_icon_documents`, `_correspondents`, `_types`, `_tags`, `_settings` | Symbolfarbe je Kategorie |

## Sensoren

`Dokumente gesamt`, `Dokumente im Posteingang`, `Unvollständige Dokumente`, `Korrespondenten`, `Dokumenttypen`, `Tags`. Services und Ereignisse gibt es in dieser Version nicht.

## Versionsanzeige und Update-Hinweis

Die Version steht in der Karte (Zahnrad → App-Version), oben im Karten-Editor und im Optionen-Dialog. Alle 12 Stunden wird GitHub abgefragt (bei Beta/RC auch Pre-releases). Neue Version: orange Hinweis, „↑“ am Zahnrad.

## Sicherheit

- Ändern, Umbenennen, Textvorschau und „Jetzt prüfen/aktualisieren“ nur für **Administratoren**. Eingaben werden im Backend geprüft, Texte in der Karte maskiert, Farben über eine Allowlist.
- Die Dokumentliste (Titel, Korrespondenten, Tags) ist für **alle angemeldeten Home-Assistant-Benutzer** über die WebSocket-Schnittstelle abrufbar. Wer Paperless-Inhalte vor einzelnen HA-Benutzern verbergen muss, sollte die Integration nicht einsetzen.
- Das API-Token liegt im Config Entry von Home Assistant und wird nie an die Karte gesendet.

## Bekannte Einschränkungen

- Beta, nicht gegen eine echte Paperless-ngx-Instanz und nicht in echtem Home Assistant getestet (u. a. automatischer Lovelace-Ressourceneintrag, Config Flow, Sensoren).
- Es werden nur die neuesten N Dokumente geladen (Option); die Karte weist darauf hin. Es gibt keine Volltextsuche über alle Dokumente.
- Keine Vorschaubilder, kein Hochladen, kein Löschen.
- Niederländisch nicht von Muttersprachlern geprüft.
- Karten-Editor: Farbwähler und Beschriftungen nur Deutsch.

## Fehlerbehebung

Karte unbekannt: Ressource prüfen, Browser-Cache leeren (Strg+F5). „Rechte fehlen“ beim Speichern: Paperless-Benutzer braucht Änderungsrechte. Diagnose-Download enthält nur Zähler.

## Versionshistorie

| Version | Änderung |
|---|---|
| **1.0.0b1** | Erste Veröffentlichung: Kategorie-Karte, Sensoren, Bearbeiten (experimentell). |

## Datei-Integrität

`.py`, `.js` und `.yaml` tragen in Zeile 1 einen SHA-256-Hash (Inhalt ab Zeile 2). JSON-Dateien:

| Datei | SHA-256 |
|---|---|
| `custom_components/paperless_manager/manifest.json` | `6856aa3df56c7775e62a1d9bb14082bae0c6986a7968f923bc9a90288f244e74` |
| `custom_components/paperless_manager/strings.json` | `bea53abea1a06ed07f15bb4a1ac4ca1d686e1d62346ad1b1d571b719a22d45e2` |
| `custom_components/paperless_manager/icons.json` | `6fb0bdbe4a3c7c08ee323319dfb0a27c9e039febb6b25dbe7139e1d4488fe971` |
| `custom_components/paperless_manager/translations/de.json` | `bea53abea1a06ed07f15bb4a1ac4ca1d686e1d62346ad1b1d571b719a22d45e2` |
| `custom_components/paperless_manager/translations/en.json` | `955abe1f6024cd76cf5a6928c48afa85ff1b933831eb962af9524c679d4dece7` |
| `custom_components/paperless_manager/translations/nl.json` | `40c8d85cd0ddd3c46a82bfdb8c9e347b7e6d1731f8c07381640a6d626263c633` |

## Lizenz

MIT, siehe [LICENSE](LICENSE).
