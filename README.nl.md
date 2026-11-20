| [🇩🇪<br>**Deutsch**](README.md) | [🇬🇧<br>**English**](README.en.md) | 🇳🇱<br>**Nederlands** |
|:-:|:-:|:-:|

# Paperless Manager voor Home Assistant

Een kaart voor Paperless-ngx met categorieën (documenten, correspondenten, documenttypen, tags) en – experimenteel – bewerken direct in de kaart. De verbinding met Paperless-ngx loopt via dezelfde client (`pypaperless`) als de core-integratie `paperless_ngx`. Het domein is bewust `paperless_manager`, zodat de core-integratie niet wordt overschreven; beide kunnen naast elkaar draaien.

> **Teststatus (bèta):** kaart en backend zijn getest met testdata en een gesimuleerde Paperless-server, **niet** met een echte Paperless-ngx-instantie en niet in een echte Home Assistant. Feedback is zeer welkom. Details: [EXPERIMENTELL.md](EXPERIMENTELL.md) (Duits).

## Functies

- **Categorieën als tabs:** Documenten · Correspondenten · Documenttypen · Tags · Instellingen (tandwiel). Elke categorie is in de kaarteditor apart aan/uit te zetten, met teller-badge (inbox) en pictogramkleur per categorie.
- **Documenten:** lijst met statuspunt (oranje = inbox), correspondent, type, datum, gekleurde tags en aantal pagina's. Statistiekchips (totaal, inbox, onvolledig) werken ook als filter. Zoeken, sorteren, “meer tonen”.
- **Doorklikken:** tik op een correspondent, documenttype of tag om de bijbehorende documenten te zien.
- **Detailpopup** met accordeon: informatie, tekstvoorbeeld (alleen beheerders, ingekort), link “Openen in Paperless”.
- **Bewerken (experimenteel, standaard uit):** titel, correspondent, documenttype, tags, aanmaakdatum en archiefnummer wijzigen; correspondenten, documenttypen en tags hernoemen.
- **Sensoren:** documenten totaal, in inbox, onvolledig (onder de geladen documenten), aantal correspondenten, documenttypen, tags.
- **Talen:** Duits, Engels, Nederlands (integratie en kaart).
- Versieweergave met updatemelding, `read_only`, `zoom`, kleuren per kaart.

## Nieuw in 1.0.0b1

Eerste uitgave (bèta).

## Vereisten

- Home Assistant 2025.6 of nieuwer, HACS
- Paperless-ngx met API-token. Voor bewerken heeft de Paperless-gebruiker wijzigingsrechten nodig.

## Installatie

**HACS:** voeg de aangepaste repository `https://github.com/meine-smarte-welt/paperless_manager` toe (categorie *Integratie*). Bètaversies verschijnen alleen als “Bètaversies tonen” in HACS aan staat. Installeren en Home Assistant herstarten.

**Handmatig:** kopieer `custom_components/paperless_manager` naar `config/custom_components/` en herstart.

## Instellen

Instellingen → Apparaten & diensten → Integratie toevoegen → *Paperless Manager*. Vul adres (URL), API-token (Paperless: Mijn profiel) en SSL-controle in. In opslagmodus wordt de kaart automatisch als Lovelace-resource toegevoegd. In YAML-modus handmatig toevoegen als *JavaScript-module*: `/paperless_manager_files/paperless-manager-card.js`.

Opties (“Configureren”): pollinginterval (standaard 120 s), aantal geladen documenten (standaard 200, nieuwste eerst), hoofdschakelaar voor experimentele functies.

## De kaart

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

Alle sleutels zijn in de grafische editor in te stellen (groepen: categorieën, weergave incl. kolommen, bewerken, experimenteel, kleuren). Meer sleutels: `zoom`, `show_stats`, `show_search`, `show_filter_bar`, `show_col_correspondent`, `show_col_type`, `show_col_date`, `show_col_tags`, `show_col_pages`, `entry_id` (meerdere instanties). Onder ca. 480 px kaartbreedte tonen de tabs alleen pictogrammen.

## Kleuren

Leeg = themastandaard. Toegestaan zijn hex, `rgb()`, `hsl()` en `var(--…)`; al het andere wordt genegeerd.

| Sleutel | Betekenis |
|---|---|
| `color_tab_active` | actieve tab |
| `color_success` / `color_warning` / `color_error` / `color_info` | groen / oranje / rood / blauw |
| `color_row_icon` | alle rijpictogrammen |
| `color_live_banner` | banner |
| `color_icon_documents`, `_correspondents`, `_types`, `_tags`, `_settings` | pictogramkleur per categorie |

## Sensoren

Documenten totaal, documenten in inbox, onvolledige documenten, correspondenten, documenttypen, tags. Deze versie heeft geen services en geen events.

## Versieweergave en updatemelding

De versie staat in de kaart (tandwiel → app-versie), bovenin de kaarteditor en in het optiesdialoog. Elke 12 uur wordt GitHub geraadpleegd (bij bèta/RC ook pre-releases). Nieuwe versie: oranje melding, “↑” op het tandwiel.

## Beveiliging

- Wijzigen, hernoemen, tekstvoorbeeld en “nu controleren/vernieuwen” alleen voor **beheerders**. Invoer wordt in de backend gecontroleerd, kaarttekst wordt ge-escaped, kleuren lopen via een allowlist.
- De documentlijst (titels, correspondenten, tags) is voor **elke ingelogde Home Assistant-gebruiker** op te halen via de WebSocket-API. Moet Paperless-inhoud voor sommige HA-gebruikers verborgen blijven, gebruik deze integratie dan niet.
- Het API-token blijft in de config entry van Home Assistant en wordt nooit naar de kaart gestuurd.

## Bekende beperkingen

- Bèta, niet getest met een echte Paperless-ngx-instantie of echte Home Assistant (o.a. automatische Lovelace-resource, config flow, sensoren).
- Alleen de nieuwste N documenten worden geladen (optie); de kaart meldt dit. Geen volledige tekstzoekfunctie over alle documenten.
- Geen miniaturen, geen upload, geen verwijderen.
- Nederlands niet door moedertaalsprekers gecontroleerd.
- Kaarteditor: labels en kleurkiezer alleen Duits.

## Probleemoplossing

Onbekende kaart: resource controleren, browsercache wissen (Ctrl+F5). “Rechten ontbreken” bij opslaan: de Paperless-gebruiker heeft wijzigingsrechten nodig. De diagnose-download bevat alleen tellers.

## Versiegeschiedenis

| Versie | Wijziging |
|---|---|
| **1.0.0b1** | Eerste uitgave: categoriekaart, sensoren, bewerken (experimenteel). |

## Bestandsintegriteit

`.py`-, `.js`- en `.yaml`-bestanden dragen op regel 1 een SHA-256-hash (inhoud vanaf regel 2). JSON-bestanden:

| Bestand | SHA-256 |
|---|---|
| `custom_components/paperless_manager/manifest.json` | `6856aa3df56c7775e62a1d9bb14082bae0c6986a7968f923bc9a90288f244e74` |
| `custom_components/paperless_manager/strings.json` | `bea53abea1a06ed07f15bb4a1ac4ca1d686e1d62346ad1b1d571b719a22d45e2` |
| `custom_components/paperless_manager/icons.json` | `6fb0bdbe4a3c7c08ee323319dfb0a27c9e039febb6b25dbe7139e1d4488fe971` |
| `custom_components/paperless_manager/translations/de.json` | `bea53abea1a06ed07f15bb4a1ac4ca1d686e1d62346ad1b1d571b719a22d45e2` |
| `custom_components/paperless_manager/translations/en.json` | `955abe1f6024cd76cf5a6928c48afa85ff1b933831eb962af9524c679d4dece7` |
| `custom_components/paperless_manager/translations/nl.json` | `40c8d85cd0ddd3c46a82bfdb8c9e347b7e6d1731f8c07381640a6d626263c633` |

## Licentie

MIT, zie [LICENSE](LICENSE).
