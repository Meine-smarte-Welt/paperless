// SHA256 (Inhalt ab Zeile 2, d.h. dieser Datei ohne diese erste Zeile): d9eec69dd428f5430f54a7c00697d83d9e11797b97af47739fc02b6924326099
/* Paperless Manager Card – Karte mit Kategorien für Paperless-ngx (Meine smarte Welt) */
const CARD_VERSION = "1.0.0b1";
const CARD_TAG = "paperless-manager-card";
const EDITOR_TAG = "paperless-manager-card-editor";
const WS = "paperless_manager";

// ---- Kategorien (Registry an einer Stelle) -------------------------------------------------
const TAB_ORDER = ["documents", "correspondents", "types", "tags", "settings"];
const TAB_META = {
  documents: { icon: "mdi:file-document-multiple-outline", label: "tab_documents" },
  correspondents: { icon: "mdi:account-group-outline", label: "tab_correspondents" },
  types: { icon: "mdi:shape-outline", label: "tab_types" },
  tags: { icon: "mdi:tag-multiple-outline", label: "tab_tags" },
  settings: { icon: "mdi:cog", label: "tab_settings" },
};
const CATEGORY_ICON_COLOR_KEYS = Object.fromEntries(TAB_ORDER.map((k) => [k, `color_icon_${k}`]));

// Experimentelle Funktionen – schlüsselgleich zu EXPERIMENTAL_FEATURES im Backend
const EXPERIMENTAL = { edit: { icon: "mdi:pencil", label: "exp_edit_label" } };

const COLOR_CONFIG_KEYS = {
  tab_active: { cssVar: "--pm-color-tab-active", fallback: "var(--primary-color, #03a9f4)" },
  success: { cssVar: "--pm-color-success", fallback: "var(--success-color, #43a047)" },
  warning: { cssVar: "--pm-color-warning", fallback: "var(--warning-color, #ff9800)" },
  error: { cssVar: "--pm-color-error", fallback: "var(--error-color, #db4437)" },
  info: { cssVar: "--pm-color-info", fallback: "var(--info-color, #039be5)" },
  row_icon: { cssVar: "--pm-color-row-icon", fallback: "var(--secondary-text-color, #727272)" },
  live_banner: { cssVar: "--pm-color-live-banner", fallback: "var(--state-icon-active-color, #03a9f4)" },
};
const SAFE_COLOR_RE = /^[a-zA-Z0-9#(),.%\-\s]+$/;
function sanitizeColor(v) {
  const t = String(v || "").trim();
  return t && SAFE_COLOR_RE.test(t) ? t : "";
}

const DEFAULTS = {
  title: "Paperless",
  show_title: true,
  show_documents: true,
  show_correspondents: true,
  show_types: true,
  show_tags: true,
  show_settings: true,
  default_tab: "documents",
  max_rows: 50,
  zoom: 100,
  show_stats: true,
  show_search: true,
  show_filter_bar: true,
  default_sort: "added",
  show_col_correspondent: true,
  show_col_type: true,
  show_col_date: true,
  show_col_tags: true,
  show_col_pages: true,
  read_only: false,
  show_experimental: false,
};

// ---- Sprachen ---------------------------------------------------------------------------------
const I18N = {
  de: {
    tab_documents: "Dokumente", tab_correspondents: "Korrespondenten", tab_types: "Dokumenttypen", tab_tags: "Tags", tab_settings: "Einstellungen",
    stat_total: "Gesamt", stat_inbox: "Posteingang", stat_incomplete: "Unvollständig",
    search: "Suchen …", sort_added: "Zuletzt hinzugefügt", sort_created: "Erstellungsdatum", sort_title: "Titel A–Z", sort_name: "Name A–Z", sort_count: "Meiste Dokumente",
    no_results: "Keine Einträge gefunden.", show_more: "Mehr anzeigen ({n} weitere)",
    loaded_hint: "Geladen werden die neuesten {n} von {total} Dokumenten (Option „Anzahl geladener Dokumente“).",
    filter_active: "Filter", filter_clear: "Filter entfernen",
    badge_inbox: "Posteingang", badge_no_corr: "Ohne Korrespondent", badge_no_type: "Ohne Typ", badge_exp: "Experimentell",
    pages_short: "S.", docs_count: "{n} Dokumente", last_corr: "Letzter Kontakt {d}", inbox_tag: "Posteingangs-Tag",
    sec_info: "Informationen", sec_edit: "Bearbeiten", sec_content: "Textvorschau",
    f_title: "Titel", f_corr: "Korrespondent", f_type: "Dokumenttyp", f_tags: "Tags", f_created: "Erstellt", f_added: "Hinzugefügt", f_asn: "Archivnummer (ASN)", f_pages: "Seiten", f_file: "Datei", f_none: "– keiner –", f_name: "Name",
    open_paperless: "In Paperless öffnen", save: "Speichern", cancel: "Abbrechen", saved: "Gespeichert.", edit: "Bearbeiten", show_docs: "Dokumente anzeigen", close: "Schließen",
    content_loading: "Lade …", content_empty: "Kein Text erkannt.", content_truncated: "Vorschau gekürzt.", content_notes: "Notizen: {n}",
    nothing_changed: "Nichts geändert.",
    err_experimental_disabled: "Bearbeiten ist nicht aktiviert (Optionen der Integration: experimentelle Funktionen).",
    err_invalid_field: "Ungültige Eingabe.", err_invalid_title: "Ungültiger Name oder Titel (1 bis 128 Zeichen).", err_invalid_date: "Ungültiges Datum.",
    err_forbidden: "Dem Paperless-Benutzer fehlen die Rechte dafür.", err_cannot_connect: "Keine Verbindung zu Paperless-ngx.", err_not_found: "Eintrag nicht gefunden.",
    err_failed: "Aktion fehlgeschlagen.", err_rejected: "Paperless hat die Änderung abgelehnt (z. B. Name oder Archivnummer schon vergeben).",
    err_invalid_api_key: "API-Token ungültig.", err_user_inactive_or_deleted: "Benutzer inaktiv oder gelöscht.", err_unexpected_response: "Unerwartete Antwort von Paperless-ngx.",
    err_no_entry: "Keine Paperless-Manager-Integration eingerichtet.", err_unauthorized: "Nur für Administratoren.", err_generic: "Fehler.",
    banner_error: "Verbindung zu Paperless-ngx gestört: {e}", banner_loading: "Lade Daten …",
    acc_app: "App-Version", acc_conn: "Verbindung", acc_options: "Optionen", acc_exp: "Experimentell",
    v_card: "Karte", v_integration: "Integration", v_latest: "Neueste Version", v_checked: "Zuletzt geprüft", check_now: "Jetzt prüfen", view_release: "Release ansehen",
    update_hint: "Aktualisiere über HACS und starte Home Assistant neu. Danach Browser neu laden (Strg+F5).",
    version_mismatch: "Karte und Integration haben unterschiedliche Versionen. Browser-Cache leeren (Strg+F5).",
    check_failed: "Prüfung nicht möglich", up_to_date: "Aktuell", never: "noch nie",
    conn_status: "Status", connected: "Verbunden", disconnected: "Getrennt", server_url: "Adresse", server_version: "Paperless-ngx", last_refresh: "Letzte Aktualisierung", refresh: "Jetzt aktualisieren",
    opt_interval: "Abfrageintervall", opt_max: "Geladene Dokumente", opt_hint: "Änderbar unter Einstellungen → Geräte & Dienste → Paperless Manager → Konfigurieren.",
    exp_info: "Experimentelle Funktionen sind ungeprüft und standardmäßig aus. Aktivieren: Optionen der Integration und hier im Karten-Editor.",
    exp_edit_label: "Dokumente und Namen bearbeiten", exp_backend_on: "Backend: aktiv", exp_backend_off: "Backend: aus",
  },
  en: {
    tab_documents: "Documents", tab_correspondents: "Correspondents", tab_types: "Document types", tab_tags: "Tags", tab_settings: "Settings",
    stat_total: "Total", stat_inbox: "Inbox", stat_incomplete: "Incomplete",
    search: "Search …", sort_added: "Recently added", sort_created: "Created date", sort_title: "Title A–Z", sort_name: "Name A–Z", sort_count: "Most documents",
    no_results: "No entries found.", show_more: "Show more ({n} more)",
    loaded_hint: "Loading the newest {n} of {total} documents (option “Number of loaded documents”).",
    filter_active: "Filter", filter_clear: "Remove filter",
    badge_inbox: "Inbox", badge_no_corr: "No correspondent", badge_no_type: "No type", badge_exp: "Experimental",
    pages_short: "p.", docs_count: "{n} documents", last_corr: "Last contact {d}", inbox_tag: "Inbox tag",
    sec_info: "Information", sec_edit: "Edit", sec_content: "Text preview",
    f_title: "Title", f_corr: "Correspondent", f_type: "Document type", f_tags: "Tags", f_created: "Created", f_added: "Added", f_asn: "Archive serial number (ASN)", f_pages: "Pages", f_file: "File", f_none: "– none –", f_name: "Name",
    open_paperless: "Open in Paperless", save: "Save", cancel: "Cancel", saved: "Saved.", edit: "Edit", show_docs: "Show documents", close: "Close",
    content_loading: "Loading …", content_empty: "No text recognised.", content_truncated: "Preview truncated.", content_notes: "Notes: {n}",
    nothing_changed: "Nothing changed.",
    err_experimental_disabled: "Editing is not enabled (integration options: experimental features).",
    err_invalid_field: "Invalid input.", err_invalid_title: "Invalid name or title (1 to 128 characters).", err_invalid_date: "Invalid date.",
    err_forbidden: "The Paperless user lacks the permissions for this.", err_cannot_connect: "Cannot connect to Paperless-ngx.", err_not_found: "Entry not found.",
    err_failed: "Action failed.", err_rejected: "Paperless rejected the change (e.g. name or serial number already in use).",
    err_invalid_api_key: "Invalid API token.", err_user_inactive_or_deleted: "User inactive or deleted.", err_unexpected_response: "Unexpected response from Paperless-ngx.",
    err_no_entry: "No Paperless Manager integration set up.", err_unauthorized: "Administrators only.", err_generic: "Error.",
    banner_error: "Connection to Paperless-ngx disturbed: {e}", banner_loading: "Loading data …",
    acc_app: "App version", acc_conn: "Connection", acc_options: "Options", acc_exp: "Experimental",
    v_card: "Card", v_integration: "Integration", v_latest: "Latest version", v_checked: "Last checked", check_now: "Check now", view_release: "View release",
    update_hint: "Update via HACS and restart Home Assistant. Then reload the browser (Ctrl+F5).",
    version_mismatch: "Card and integration have different versions. Clear the browser cache (Ctrl+F5).",
    check_failed: "Check not possible", up_to_date: "Up to date", never: "never",
    conn_status: "Status", connected: "Connected", disconnected: "Disconnected", server_url: "Address", server_version: "Paperless-ngx", last_refresh: "Last refresh", refresh: "Refresh now",
    opt_interval: "Polling interval", opt_max: "Loaded documents", opt_hint: "Change under Settings → Devices & services → Paperless Manager → Configure.",
    exp_info: "Experimental features are untested and off by default. Enable them in the integration options and in the card editor.",
    exp_edit_label: "Edit documents and names", exp_backend_on: "Backend: on", exp_backend_off: "Backend: off",
  },
  nl: {
    tab_documents: "Documenten", tab_correspondents: "Correspondenten", tab_types: "Documenttypen", tab_tags: "Tags", tab_settings: "Instellingen",
    stat_total: "Totaal", stat_inbox: "Inbox", stat_incomplete: "Onvolledig",
    search: "Zoeken …", sort_added: "Recent toegevoegd", sort_created: "Aanmaakdatum", sort_title: "Titel A–Z", sort_name: "Naam A–Z", sort_count: "Meeste documenten",
    no_results: "Geen items gevonden.", show_more: "Meer tonen ({n} meer)",
    loaded_hint: "De nieuwste {n} van {total} documenten worden geladen (optie “Aantal geladen documenten”).",
    filter_active: "Filter", filter_clear: "Filter verwijderen",
    badge_inbox: "Inbox", badge_no_corr: "Geen correspondent", badge_no_type: "Geen type", badge_exp: "Experimenteel",
    pages_short: "p.", docs_count: "{n} documenten", last_corr: "Laatste contact {d}", inbox_tag: "Inbox-tag",
    sec_info: "Informatie", sec_edit: "Bewerken", sec_content: "Tekstvoorbeeld",
    f_title: "Titel", f_corr: "Correspondent", f_type: "Documenttype", f_tags: "Tags", f_created: "Aangemaakt", f_added: "Toegevoegd", f_asn: "Archiefnummer (ASN)", f_pages: "Pagina's", f_file: "Bestand", f_none: "– geen –", f_name: "Naam",
    open_paperless: "Openen in Paperless", save: "Opslaan", cancel: "Annuleren", saved: "Opgeslagen.", edit: "Bewerken", show_docs: "Documenten tonen", close: "Sluiten",
    content_loading: "Laden …", content_empty: "Geen tekst herkend.", content_truncated: "Voorbeeld ingekort.", content_notes: "Notities: {n}",
    nothing_changed: "Niets gewijzigd.",
    err_experimental_disabled: "Bewerken is niet ingeschakeld (opties van de integratie: experimentele functies).",
    err_invalid_field: "Ongeldige invoer.", err_invalid_title: "Ongeldige naam of titel (1 tot 128 tekens).", err_invalid_date: "Ongeldige datum.",
    err_forbidden: "De Paperless-gebruiker heeft hiervoor geen rechten.", err_cannot_connect: "Geen verbinding met Paperless-ngx.", err_not_found: "Item niet gevonden.",
    err_failed: "Actie mislukt.", err_rejected: "Paperless heeft de wijziging geweigerd (bijv. naam of archiefnummer al in gebruik).",
    err_invalid_api_key: "Ongeldig API-token.", err_user_inactive_or_deleted: "Gebruiker inactief of verwijderd.", err_unexpected_response: "Onverwacht antwoord van Paperless-ngx.",
    err_no_entry: "Geen Paperless Manager-integratie ingesteld.", err_unauthorized: "Alleen voor beheerders.", err_generic: "Fout.",
    banner_error: "Verbinding met Paperless-ngx verstoord: {e}", banner_loading: "Gegevens laden …",
    acc_app: "App-versie", acc_conn: "Verbinding", acc_options: "Opties", acc_exp: "Experimenteel",
    v_card: "Kaart", v_integration: "Integratie", v_latest: "Nieuwste versie", v_checked: "Laatst gecontroleerd", check_now: "Nu controleren", view_release: "Release bekijken",
    update_hint: "Werk bij via HACS en herstart Home Assistant. Laad daarna de browser opnieuw (Ctrl+F5).",
    version_mismatch: "Kaart en integratie hebben verschillende versies. Wis de browsercache (Ctrl+F5).",
    check_failed: "Controle niet mogelijk", up_to_date: "Actueel", never: "nooit",
    conn_status: "Status", connected: "Verbonden", disconnected: "Verbroken", server_url: "Adres", server_version: "Paperless-ngx", last_refresh: "Laatste vernieuwing", refresh: "Nu vernieuwen",
    opt_interval: "Pollinginterval", opt_max: "Geladen documenten", opt_hint: "Wijzigen via Instellingen → Apparaten & diensten → Paperless Manager → Configureren.",
    exp_info: "Experimentele functies zijn niet getest en standaard uit. Inschakelen in de opties van de integratie en in de kaarteditor.",
    exp_edit_label: "Documenten en namen bewerken", exp_backend_on: "Backend: aan", exp_backend_off: "Backend: uit",
  },
};

// Sprach-Tag nie blind kürzen (Regelwerk 01, Abschnitt 9)
function resolveLang(tag) {
  const parts = String(tag || "en").split("-");
  for (const cand of [parts.slice(0, 2).join("-"), parts[0]]) if (I18N[cand]) return cand;
  return "en";
}
const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ESC[c]);
const num = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
const HEX_RE = /^#[0-9a-fA-F]{3,8}$/;
const safeHex = (v) => (typeof v === "string" && HEX_RE.test(v) ? v : "");
const safeUrl = (u) => (/^https?:\/\//i.test(String(u || "")) ? String(u) : "");

const CSS = `
:host{display:block;--c-success:var(--pm-color-success,var(--success-color,#43a047));--c-warning:var(--pm-color-warning,var(--warning-color,#ff9800));
  --c-error:var(--pm-color-error,var(--error-color,#db4437));--c-info:var(--pm-color-info,var(--info-color,#039be5));
  --c-tab:var(--pm-color-tab-active,var(--primary-color,#03a9f4));--c-banner:var(--pm-color-live-banner,var(--state-icon-active-color,#03a9f4));
  --c-row-icon:var(--pm-color-row-icon,var(--secondary-text-color,#727272))}
ha-card{container-type:inline-size;container-name:pm;overflow:hidden;font-size:calc(14px * var(--pm-zoom,1))}
.wrap{padding:0 0 .5em}
.title{padding:.9em 1em .2em;font-size:1.35em;font-weight:500;color:var(--primary-text-color)}
.banner{display:flex;align-items:center;gap:.6em;margin:.6em 1em;padding:.55em .8em;border-radius:8px;color:#fff;font-size:.95em}
.banner.error{background:var(--c-error)}.banner.live{background:var(--c-banner)}
.tabs{display:flex;gap:.25em;padding:.5em .6em 0;border-bottom:1px solid var(--divider-color);overflow-x:auto}
.tab{position:relative;display:flex;align-items:center;gap:.4em;padding:.55em .8em;border:0;background:none;color:var(--secondary-text-color);
  font:inherit;cursor:pointer;border-bottom:3px solid transparent;white-space:nowrap}
.tab ha-icon{--mdc-icon-size:1.35em;color:var(--tab-icon,var(--secondary-text-color))}
.tab.active{color:var(--primary-text-color);border-bottom-color:var(--c-tab)}
.tab:hover{background:var(--secondary-background-color)}
.badge{display:inline-flex;align-items:center;justify-content:center;min-width:1.4em;height:1.4em;padding:0 .4em;border-radius:1em;
  font-size:.8em;color:#fff;background:var(--c)}
.badge.warning{--c:var(--c-warning)}.badge.info{--c:var(--c-info)}.badge.error{--c:var(--c-error)}.badge.exp{--c:var(--c-warning);margin-left:.4em}
@container pm (max-width:480px){.tab .lbl{display:none}}
.chips{display:flex;flex-wrap:wrap;gap:.5em;padding:.8em 1em 0}
.chip{display:flex;flex-direction:column;align-items:flex-start;min-width:5.5em;padding:.5em .8em;border:1px solid var(--divider-color);
  border-radius:10px;background:none;color:var(--primary-text-color);font:inherit;cursor:pointer;text-align:left}
.chip .n{font-size:1.4em;font-weight:600;line-height:1.1}.chip .l{font-size:.8em;color:var(--secondary-text-color)}
.chip.active{border-color:var(--c-tab);background:color-mix(in srgb,var(--c-tab) 12%,transparent)}
.chip.warning .n{color:var(--c-warning)}.chip.info .n{color:var(--c-info)}
.bar{display:flex;flex-wrap:wrap;gap:.5em;padding:.8em 1em 0}
.bar input,.bar select,.f input,.f select,.f textarea{font:inherit;color:var(--primary-text-color);background:var(--card-background-color,transparent);
  border:1px solid var(--divider-color);border-radius:8px;padding:.5em .7em;box-sizing:border-box;min-width:0}
.bar input{flex:1 1 10em}.bar select{flex:0 1 13em}
.hint{margin:.6em 1em 0;color:var(--secondary-text-color);font-size:.85em}
.fpill{display:inline-flex;align-items:center;gap:.4em;margin:.7em 1em 0;padding:.25em .4em .25em .8em;border-radius:1em;background:var(--secondary-background-color);font-size:.9em}
.list{margin-top:.5em}
.row{display:flex;align-items:center;gap:.8em;padding:.65em 1em;border-top:1px solid var(--divider-color);cursor:pointer}
.row:first-child{border-top:0}.row:hover{background:var(--secondary-background-color)}
.ico{position:relative;flex:0 0 auto;width:2.2em;height:2.2em;display:flex;align-items:center;justify-content:center;border-radius:50%;
  background:var(--secondary-background-color);color:var(--ic,var(--c-row-icon))}
.ico ha-icon{--mdc-icon-size:1.3em}
.dot{position:absolute;right:-1px;bottom:-1px;width:.7em;height:.7em;border-radius:50%;border:2px solid var(--card-background-color,#fff);background:var(--c)}
.dot.warning{--c:var(--c-warning)}.dot.success{--c:var(--c-success)}
.main{flex:1 1 auto;min-width:0}
.name{font-weight:500;color:var(--primary-text-color);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sub{color:var(--secondary-text-color);font-size:.88em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tags{display:flex;flex-wrap:wrap;gap:.3em;margin-top:.3em}
.tag{display:inline-block;padding:.05em .6em;border-radius:1em;font-size:.78em;background:var(--tb,var(--secondary-background-color));color:var(--tt,var(--primary-text-color));
  border:1px solid color-mix(in srgb,var(--tt,var(--primary-text-color)) 20%,transparent)}
.pills{display:flex;gap:.4em;flex:0 0 auto}
.pill{padding:.15em .6em;border-radius:1em;font-size:.82em;border:1px solid var(--c,var(--divider-color));color:var(--c,var(--secondary-text-color))}
.pill.warning{--c:var(--c-warning)}.pill.info{--c:var(--c-info)}
.btn{font:inherit;padding:.5em 1em;border-radius:6px;border:1px solid var(--divider-color);background:none;color:var(--primary-text-color);cursor:pointer}
.btn.primary{background:var(--c-tab);border-color:var(--c-tab);color:#fff}.btn.small{padding:.25em .7em;font-size:.9em}
.btn.icon{padding:.25em;line-height:0;border:0}.btn:disabled{opacity:.5;cursor:default}
.more{display:block;margin:.6em auto}
.empty{padding:1.2em;text-align:center;color:var(--secondary-text-color)}
.acc{border:1px solid var(--divider-color);border-radius:8px;margin:.7em 1em 0}
.acc.update{border-color:var(--c-warning)}.acc>summary{list-style:none}.acc>summary::-webkit-details-marker{display:none}
.acc-sum{display:flex;align-items:center;gap:.6em;padding:.7em .9em;cursor:pointer;font-weight:500}
.acc-sum .grow{flex:1}.acc-sum .meta{color:var(--secondary-text-color);font-weight:400;font-size:.9em}
.acc-sum::after{content:"";width:.5em;height:.5em;border-right:2px solid var(--secondary-text-color);border-bottom:2px solid var(--secondary-text-color);transform:rotate(45deg);margin:0 .3em .2em}
details[open]>.acc-sum::after{transform:rotate(-135deg);margin:.2em .3em 0}
.acc-body{padding:.2em .9em .8em}
.line{display:flex;justify-content:space-between;gap:1em;padding:.3em 0}.line .k{color:var(--secondary-text-color)}.line .v{font-weight:600;text-align:right;overflow-wrap:anywhere}
.warnbox{margin:.5em 0;padding:.6em .8em;border-radius:8px;border:1px solid var(--c-warning);color:var(--primary-text-color)}
.actions{display:flex;gap:.5em;flex-wrap:wrap;margin-top:.6em}
.backdrop{position:fixed;inset:0;z-index:9;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center}
.dialog{width:min(440px,94vw);max-height:86vh;display:flex;flex-direction:column;background:var(--card-background-color,#fff);color:var(--primary-text-color);
  border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,.35);font-size:14px}
.dhead{display:flex;align-items:center;gap:.7em;padding:.8em 1em;border-bottom:1px solid var(--divider-color)}
.dtitle{flex:1;font-size:1.1em;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dbody{overflow:auto;padding:0 0 .8em}
.f{display:flex;flex-direction:column;gap:.25em;margin:.6em 0}.f label{color:var(--secondary-text-color);font-size:.85em}
.tagpick{display:flex;flex-wrap:wrap;gap:.35em}
.tagbtn{font:inherit;font-size:.85em;padding:.2em .7em;border-radius:1em;cursor:pointer;border:1px solid var(--divider-color);background:none;color:var(--primary-text-color)}
.tagbtn.on{background:var(--tb,var(--c-tab));color:var(--tt,#fff);border-color:var(--tb,var(--c-tab))}
.content{white-space:pre-wrap;overflow-wrap:anywhere;font-size:.85em;max-height:14em;overflow:auto;padding:.5em;border-radius:6px;background:var(--secondary-background-color)}
.toast{position:fixed;left:50%;bottom:2em;transform:translateX(-50%);z-index:10;padding:.7em 1.2em;border-radius:8px;color:#fff;background:#323232;max-width:90vw;font-size:14px}
.toast.err{background:var(--c-error)}
`;

class PaperlessManagerCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = { ...DEFAULTS };
    this._snap = null;
    this._tab = null;
    this._q = "";
    this._sort = null;
    this._mode = "all";
    this._filter = null;
    this._rows = 0;
    this._popup = null;
    this._draft = null;
    this._dirty = false;
    this._details = {};
    this._acc = { "doc-info": true, "doc-edit": true, "doc-content": false, app: true, conn: true, options: false, exp: true };
    this._unsub = null;
    this._subError = null;
    this._built = false;
    this._toastTimer = null;
    this._onKey = (e) => {
      if (e.key === "Escape" && this._popup) this._closePopup();
    };
  }

  static getConfigElement() {
    return document.createElement(EDITOR_TAG);
  }
  static getStubConfig() {
    return {};
  }

  setConfig(config) {
    this._config = { ...DEFAULTS, ...(config || {}) };
    this._tab = null;
    this._sort = null;
    this._rows = 0;
    this._applyColors();
    this._resubscribe();
    this._render();
  }

  set hass(hass) {
    const first = !this._hass;
    const langChanged = this._hass && this._hass.language !== hass.language;
    this._hass = hass;
    if (first) this._subscribe();
    if (first || langChanged) this._render();
  }

  getCardSize() {
    return 6;
  }

  connectedCallback() {
    document.addEventListener("keydown", this._onKey);
    if (this._hass) this._subscribe();
  }
  disconnectedCallback() {
    document.removeEventListener("keydown", this._onKey);
    this._unsubscribe();
  }

  // ---- Daten -------------------------------------------------------------------------------
  _resubscribe() {
    this._unsubscribe();
    if (this._hass) this._subscribe();
  }
  _unsubscribe() {
    const u = this._unsub;
    this._unsub = null;
    if (u) Promise.resolve(u).then((fn) => typeof fn === "function" && fn()).catch(() => {});
  }
  _subscribe() {
    if (this._unsub || !this._hass?.connection) return;
    const msg = { type: `${WS}/subscribe` };
    if (this._config.entry_id) msg.entry_id = this._config.entry_id;
    this._subError = null;
    this._unsub = this._hass.connection
      .subscribeMessage((ev) => {
        if (ev && ev.type === "snapshot") {
          this._snap = ev.data;
          this._onSnapshot();
        }
      }, msg)
      .catch((err) => {
        this._unsub = null;
        this._subError = err && err.code ? err.code : "generic";
        this._render();
        return null;
      });
  }
  _ws(payload) {
    const msg = { ...payload };
    if (this._config.entry_id) msg.entry_id = this._config.entry_id;
    return this._hass.callWS(msg);
  }
  _onSnapshot() {
    this._render();
    if (this._popup && !this._dirty) {
      const sig = this._popupSig();
      if (sig !== this._popupSigLast) this._renderPopup();
    }
  }

  // ---- Helfer ------------------------------------------------------------------------------
  get _lang() {
    return resolveLang(this._hass?.language);
  }
  _t(key, vars) {
    let s = (I18N[this._lang] && I18N[this._lang][key]) ?? I18N.en[key] ?? key;
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v));
    return s;
  }
  _err(e) {
    const code = e && (e.code || e.message);
    const key = `err_${code}`;
    return I18N.en[key] ? this._t(key) : this._t("err_generic");
  }
  _fmtDate(iso) {
    if (!iso) return "";
    try {
      const d = new Date(`${String(iso).slice(0, 10)}T00:00:00`);
      return Number.isNaN(d.getTime()) ? String(iso) : d.toLocaleDateString(this._hass?.language || undefined);
    } catch (_e) {
      return String(iso);
    }
  }
  _fmtDateTime(iso) {
    if (!iso) return this._t("never");
    try {
      return new Date(iso).toLocaleString(this._hass?.language || undefined);
    } catch (_e) {
      return String(iso);
    }
  }
  _isAdmin() {
    return !!this._hass?.user?.is_admin;
  }
  _canEdit() {
    const s = this._snap;
    return !!(s && this._config.show_experimental && s.experimental?.features?.edit && !this._config.read_only && this._isAdmin());
  }
  _visibleTabs() {
    const tabs = TAB_ORDER.filter((k) => this._config[`show_${k}`] !== false);
    return tabs.length ? tabs : ["documents"];
  }
  _currentTab() {
    const tabs = this._visibleTabs();
    if (this._tab && tabs.includes(this._tab)) return this._tab;
    const def = this._config.default_tab;
    this._tab = tabs.includes(def) ? def : tabs[0];
    return this._tab;
  }
  _maps() {
    const s = this._snap;
    if (!s) return { corr: new Map(), type: new Map(), tag: new Map() };
    if (this._mapsFor !== s) {
      this._mapsCache = {
        corr: new Map(s.correspondents.map((x) => [x.id, x])),
        type: new Map(s.document_types.map((x) => [x.id, x])),
        tag: new Map(s.tags.map((x) => [x.id, x])),
      };
      this._mapsFor = s;
    }
    return this._mapsCache;
  }
  _applyColors() {
    for (const [key, def] of Object.entries(COLOR_CONFIG_KEYS)) {
      const v = sanitizeColor(this._config[`color_${key}`]);
      if (v) this.style.setProperty(def.cssVar, v);
      else this.style.removeProperty(def.cssVar);
    }
    for (const tab of TAB_ORDER) {
      const all = sanitizeColor(this._config.color_row_icon);
      const own = sanitizeColor(this._config[CATEGORY_ICON_COLOR_KEYS[tab]]);
      const v = all || own;
      const name = `--pm-icon-${tab}`;
      if (v) this.style.setProperty(name, v);
      else this.style.removeProperty(name);
    }
    this.style.setProperty("--pm-zoom", String(Math.min(2, Math.max(0.5, num(this._config.zoom, 100) / 100))));
  }
  _iconStyle(tab) {
    return `--ic:var(--pm-icon-${tab},var(--c-row-icon))`;
  }

  // ---- Rendering ---------------------------------------------------------------------------
  _build() {
    this.shadowRoot.innerHTML = `<style>${CSS}</style><ha-card><div class="wrap" id="main"></div></ha-card><div id="popup"></div><div id="toast"></div>`;
    const root = this.shadowRoot;
    root.addEventListener("click", (e) => this._onClick(e));
    root.addEventListener("input", (e) => this._onInput(e));
    root.addEventListener("change", (e) => this._onChange(e));
    root.addEventListener("toggle", (e) => this._onToggle(e), true);
    this._built = true;
  }

  _render() {
    if (!this._built) this._build();
    this._applyColors();
    const main = this.shadowRoot.getElementById("main");
    main.innerHTML = this._mainHtml();
    if (this._popup) this._renderPopup();
  }

  _renderList() {
    const el = this.shadowRoot.getElementById("list");
    if (el) el.innerHTML = this._listHtml();
  }

  _mainHtml() {
    const c = this._config;
    const s = this._snap;
    const parts = [];
    if (c.show_title && c.title) parts.push(`<div class="title">${esc(c.title)}</div>`);
    if (this._subError) {
      parts.push(`<div class="banner error"><ha-icon icon="mdi:alert-circle-outline"></ha-icon>${esc(this._t("banner_error", { e: this._err({ code: this._subError }) }))}</div>`);
    } else if (!s) {
      parts.push(`<div class="banner live"><ha-icon icon="mdi:timer-sand"></ha-icon>${esc(this._t("banner_loading"))}</div>`);
    } else if (!s.connected) {
      parts.push(`<div class="banner error"><ha-icon icon="mdi:lan-disconnect"></ha-icon>${esc(this._t("banner_error", { e: this._err({ code: s.error }) }))}</div>`);
    }
    const tabs = this._visibleTabs();
    const cur = this._currentTab();
    if (tabs.length > 1) parts.push(this._tabsHtml(tabs, cur));
    if (s) parts.push(this._tabContent(cur));
    return parts.join("");
  }

  _tabsHtml(tabs, cur) {
    const s = this._snap;
    const items = tabs.map((k) => {
      const meta = TAB_META[k];
      let badge = "";
      if (s && k === "documents" && s.stats.documents_inbox > 0) badge = `<span class="badge warning">${esc(s.stats.documents_inbox)}</span>`;
      if (s && k === "settings" && s.app?.update_available) badge = `<span class="badge warning">↑</span>`;
      const label = this._t(meta.label);
      return `<button class="tab ${k === cur ? "active" : ""}" data-act="tab" data-k="${k}" title="${esc(label)}" style="--tab-icon:var(--pm-icon-${k},var(--secondary-text-color))">
        <ha-icon icon="${meta.icon}"></ha-icon><span class="lbl">${esc(label)}</span>${badge}</button>`;
    });
    return `<div class="tabs" role="tablist">${items.join("")}</div>`;
  }

  _tabContent(tab) {
    if (tab === "settings") return this._settingsHtml();
    const c = this._config;
    const s = this._snap;
    const out = [];
    if (tab === "documents" && c.show_stats) {
      const incomplete = s.documents.filter((d) => d.correspondent == null || d.document_type == null).length;
      const chip = (mode, n, label, cls) =>
        `<button class="chip ${cls} ${this._mode === mode ? "active" : ""}" data-act="mode" data-k="${mode}"><span class="n">${esc(n)}</span><span class="l">${esc(label)}</span></button>`;
      out.push(`<div class="chips">${chip("all", s.stats.documents_total, this._t("stat_total"), "")}${chip("inbox", s.stats.documents_inbox, this._t("stat_inbox"), "warning")}${chip("incomplete", incomplete, this._t("stat_incomplete"), "info")}</div>`);
    }
    if (c.show_search || c.show_filter_bar) {
      const sorts = tab === "documents" ? [["added", "sort_added"], ["created", "sort_created"], ["title", "sort_title"]] : [["name", "sort_name"], ["count", "sort_count"]];
      const curSort = this._sortFor(tab);
      out.push(`<div class="bar">${c.show_search ? `<input type="search" data-f="q" placeholder="${esc(this._t("search"))}" value="${esc(this._q)}" data-fk="q">` : ""}${
        c.show_filter_bar ? `<select data-f="sort">${sorts.map(([v, l]) => `<option value="${v}" ${v === curSort ? "selected" : ""}>${esc(this._t(l))}</option>`).join("")}</select>` : ""
      }</div>`);
    }
    if (tab === "documents" && this._filter) {
      out.push(`<div class="fpill"><span>${esc(this._t("filter_active"))}: ${esc(this._filterLabel())}</span><button class="btn icon" data-act="clear-filter" title="${esc(this._t("filter_clear"))}"><ha-icon icon="mdi:close"></ha-icon></button></div>`);
    }
    if (tab === "documents" && s.documents_total > s.documents.length) {
      out.push(`<div class="hint">${esc(this._t("loaded_hint", { n: s.documents.length, total: s.documents_total }))}</div>`);
    }
    out.push(`<div class="list" id="list">${this._listHtml()}</div>`);
    return out.join("");
  }

  _sortFor(tab) {
    if (this._sort && this._sort.tab === tab) return this._sort.value;
    if (tab === "documents") return ["added", "created", "title"].includes(this._config.default_sort) ? this._config.default_sort : "added";
    return "name";
  }

  _filterLabel() {
    const m = this._maps();
    const f = this._filter;
    if (!f) return "";
    const item = (f.kind === "corr" ? m.corr : f.kind === "type" ? m.type : m.tag).get(f.id);
    return item ? item.name : String(f.id);
  }

  _listHtml() {
    const tab = this._currentTab();
    const rows = tab === "documents" ? this._docRows() : this._classRows(tab);
    if (!rows.length) return `<div class="empty">${esc(this._t("no_results"))}</div>`;
    const limit = Math.max(5, num(this._config.max_rows, 50)) + this._rows;
    const shown = rows.slice(0, limit).map((r) => r.html).join("");
    const rest = rows.length - limit;
    return shown + (rest > 0 ? `<button class="btn small more" data-act="more">${esc(this._t("show_more", { n: rest }))}</button>` : "");
  }

  _docRows() {
    const s = this._snap;
    const c = this._config;
    const m = this._maps();
    const q = this._q.trim().toLowerCase();
    let docs = s.documents.slice();
    if (this._mode === "inbox") docs = docs.filter((d) => d.inbox);
    if (this._mode === "incomplete") docs = docs.filter((d) => d.correspondent == null || d.document_type == null);
    const f = this._filter;
    if (f) {
      docs = docs.filter((d) => (f.kind === "corr" ? d.correspondent === f.id : f.kind === "type" ? d.document_type === f.id : d.tags.includes(f.id)));
    }
    if (q) {
      docs = docs.filter((d) => {
        const hay = [d.title, d.file, d.asn, m.corr.get(d.correspondent)?.name, m.type.get(d.document_type)?.name, ...d.tags.map((t) => m.tag.get(t)?.name)];
        return hay.some((h) => h != null && String(h).toLowerCase().includes(q));
      });
    }
    const sort = this._sortFor("documents");
    docs.sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title, this._hass?.language || undefined);
      const key = sort === "created" ? "created" : "added";
      return String(b[key]).localeCompare(String(a[key])) || b.id - a.id;
    });
    return docs.map((d) => {
      const corr = m.corr.get(d.correspondent)?.name;
      const type = m.type.get(d.document_type)?.name;
      const icon = d.mime === "application/pdf" ? "mdi:file-pdf-box" : d.mime.startsWith("image/") ? "mdi:file-image-outline" : "mdi:file-document-outline";
      const sub = [];
      if (c.show_col_correspondent) sub.push(corr ? esc(corr) : `<i>${esc(this._t("badge_no_corr"))}</i>`);
      if (c.show_col_type) sub.push(type ? esc(type) : `<i>${esc(this._t("badge_no_type"))}</i>`);
      if (c.show_col_date && d.created) sub.push(esc(this._fmtDate(d.created)));
      const tags = c.show_col_tags && d.tags.length ? `<div class="tags">${d.tags.map((t) => this._tagHtml(m.tag.get(t))).join("")}</div>` : "";
      const pills = c.show_col_pages && d.pages ? `<span class="pill">${esc(d.pages)} ${esc(this._t("pages_short"))}</span>` : "";
      return {
        html: `<div class="row" data-act="open-doc" data-id="${d.id}" tabindex="0" role="button">
          <div class="ico" style="${this._iconStyle("documents")}"><ha-icon icon="${icon}"></ha-icon><span class="dot ${d.inbox ? "warning" : "success"}"></span></div>
          <div class="main"><div class="name">${esc(d.title)}</div><div class="sub">${sub.join(" · ")}</div>${tags}</div>
          <div class="pills">${pills}</div></div>`,
      };
    });
  }

  _tagHtml(tag) {
    if (!tag) return "";
    const bg = safeHex(tag.color);
    const fg = safeHex(tag.text_color);
    const style = `${bg ? `--tb:${bg};` : ""}${fg ? `--tt:${fg};` : ""}`;
    return `<span class="tag" style="${style}">${esc(tag.name)}</span>`;
  }

  _classRows(tab) {
    const s = this._snap;
    const q = this._q.trim().toLowerCase();
    const kind = tab === "correspondents" ? "corr" : tab === "types" ? "type" : "tag";
    const icon = tab === "correspondents" ? "mdi:account-outline" : tab === "types" ? "mdi:shape-outline" : "mdi:tag-outline";
    let items = (tab === "correspondents" ? s.correspondents : tab === "types" ? s.document_types : s.tags).slice();
    if (q) items = items.filter((i) => i.name.toLowerCase().includes(q));
    const sort = this._sortFor(tab);
    items.sort((a, b) => (sort === "count" ? b.count - a.count || a.name.localeCompare(b.name) : a.name.localeCompare(b.name, this._hass?.language || undefined)));
    const canEdit = this._canEdit();
    return items.map((i) => {
      const sub = kind === "corr" && i.last ? this._t("last_corr", { d: this._fmtDate(i.last) }) : "";
      const name = kind === "tag" ? this._tagHtml(i) : esc(i.name);
      const inbox = kind === "tag" && i.inbox ? `<span class="pill warning">${esc(this._t("inbox_tag"))}</span>` : "";
      const edit = canEdit ? `<button class="btn icon" data-act="edit-class" data-kind="${kind}" data-id="${i.id}" title="${esc(this._t("edit"))}"><ha-icon icon="mdi:pencil"></ha-icon></button>` : "";
      return {
        html: `<div class="row" data-act="drill" data-kind="${kind}" data-id="${i.id}" tabindex="0" role="button">
          <div class="ico" style="${this._iconStyle(tab)}"><ha-icon icon="${icon}"></ha-icon></div>
          <div class="main"><div class="name">${name}</div>${sub ? `<div class="sub">${esc(sub)}</div>` : ""}</div>
          <div class="pills">${inbox}<span class="pill">${esc(i.count)}</span>${edit}</div></div>`,
      };
    });
  }

  // ---- Einstellungen -----------------------------------------------------------------------
  _acc_(key, icon, title, body, { meta = "", cls = "" } = {}) {
    return `<details class="acc ${cls}" data-k="${key}" ${this._acc[key] ? "open" : ""}>
      <summary class="acc-sum"><ha-icon icon="${icon}"></ha-icon><span class="grow">${esc(title)}</span><span class="meta">${meta}</span></summary>
      <div class="acc-body">${body}</div></details>`;
  }
  _line(k, v) {
    return `<div class="line"><span class="k">${esc(k)}</span><span class="v">${v}</span></div>`;
  }

  _settingsHtml() {
    const s = this._snap;
    const app = s.app || {};
    const out = [];
    const mismatch = app.version && app.version !== CARD_VERSION;
    let status;
    if (app.check_failed) status = `<span style="color:var(--c-error)">${esc(this._t("check_failed"))}</span>`;
    else if (app.update_available) status = `<span style="color:var(--c-warning)">↑ ${esc(app.latest_version)}</span>`;
    else if (app.latest_version) status = `<span style="color:var(--c-success)">${esc(this._t("up_to_date"))}</span>`;
    else status = "–";
    const rel = safeUrl(app.release_url);
    let body = this._line(this._t("v_card"), esc(CARD_VERSION)) + this._line(this._t("v_integration"), esc(app.version || "–")) +
      this._line(this._t("v_latest"), `${esc(app.latest_version || "–")} ${status}`) + this._line(this._t("v_checked"), esc(this._fmtDateTime(app.checked_at)));
    if (app.update_available) body += `<div class="warnbox">${esc(this._t("update_hint"))}</div>`;
    if (mismatch) body += `<div class="warnbox">${esc(this._t("version_mismatch"))}</div>`;
    body += `<div class="actions">${this._isAdmin() ? `<button class="btn small" data-act="check-update">${esc(this._t("check_now"))}</button>` : ""}${
      rel ? `<a class="btn small" style="text-decoration:none" href="${esc(rel)}" target="_blank" rel="noopener noreferrer">${esc(this._t("view_release"))}</a>` : ""}</div>`;
    out.push(this._acc_("app", "mdi:information-outline", this._t("acc_app"), body, { cls: app.update_available || mismatch ? "update" : "", meta: esc(app.version || "") }));

    const url = safeUrl(s.server?.url);
    let conn = this._line(this._t("conn_status"), s.connected ? `<span style="color:var(--c-success)">${esc(this._t("connected"))}</span>` : `<span style="color:var(--c-error)">${esc(this._t("disconnected"))}</span>`) +
      this._line(this._t("server_url"), url ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer" style="color:var(--primary-color)">${esc(url)}</a>` : "–") +
      this._line(this._t("server_version"), esc(s.server?.version || "–")) + this._line(this._t("last_refresh"), esc(this._fmtDateTime(s.updated)));
    if (this._isAdmin()) conn += `<div class="actions"><button class="btn small" data-act="refresh">${esc(this._t("refresh"))}</button></div>`;
    out.push(this._acc_("conn", "mdi:lan-connect", this._t("acc_conn"), conn));

    const opt = this._line(this._t("opt_interval"), `${esc(s.options?.scan_interval)} s`) + this._line(this._t("opt_max"), esc(s.options?.max_documents)) + `<div class="hint" style="margin:.4em 0 0">${esc(this._t("opt_hint"))}</div>`;
    out.push(this._acc_("options", "mdi:tune", this._t("acc_options"), opt));

    if (this._config.show_experimental) {
      let exp = `<div class="hint" style="margin:.2em 0 .5em">${esc(this._t("exp_info"))}</div>`;
      for (const [key, meta] of Object.entries(EXPERIMENTAL)) {
        const on = !!s.experimental?.features?.[key];
        exp += this._line(`${this._t(meta.label)}`, `<span class="badge exp">${esc(this._t("badge_exp"))}</span> ${esc(this._t(on ? "exp_backend_on" : "exp_backend_off"))}`);
      }
      out.push(this._acc_("exp", "mdi:flask-outline", this._t("acc_exp"), exp));
    }
    return out.join("");
  }

  // ---- Popup -------------------------------------------------------------------------------
  _popupSig() {
    const p = this._popup;
    if (!p || !this._snap) return "";
    if (p.type === "doc") return JSON.stringify([this._snap.documents.find((d) => d.id === p.id), this._details[p.id], this._canEdit()]);
    const pool = p.kind === "corr" ? this._snap.correspondents : p.kind === "type" ? this._snap.document_types : this._snap.tags;
    return JSON.stringify([pool.find((x) => x.id === p.id), this._canEdit()]);
  }

  _initDraft() {
    const p = this._popup;
    if (!p) return;
    if (p.type === "doc") {
      const d = this._snap.documents.find((x) => x.id === p.id);
      if (!d) return;
      this._draft = { title: d.title, correspondent: d.correspondent == null ? "" : String(d.correspondent), document_type: d.document_type == null ? "" : String(d.document_type), tags: new Set(d.tags), created: d.created || "", asn: d.asn == null ? "" : String(d.asn) };
    } else {
      const pool = p.kind === "corr" ? this._snap.correspondents : p.kind === "type" ? this._snap.document_types : this._snap.tags;
      const x = pool.find((i) => i.id === p.id);
      this._draft = { name: x ? x.name : "" };
    }
    this._dirty = false;
  }

  _openDoc(id) {
    this._popup = { type: "doc", id };
    this._initDraft();
    this._renderPopup();
  }
  _openClass(kind, id) {
    this._popup = { type: "class", kind, id };
    this._initDraft();
    this._renderPopup();
  }
  _closePopup() {
    this._popup = null;
    this._draft = null;
    this._dirty = false;
    this._popupSigLast = "";
    this.shadowRoot.getElementById("popup").innerHTML = "";
  }

  _renderPopup() {
    const host = this.shadowRoot.getElementById("popup");
    const p = this._popup;
    if (!p || !this._snap) {
      host.innerHTML = "";
      return;
    }
    const old = host.querySelector(".dbody");
    const scroll = old ? old.scrollTop : 0;
    if (!this._draft || (!this._dirty && this._popupSig() !== this._popupSigLast)) this._initDraft();
    if (!this._draft) {
      this._closePopup();
      return;
    }
    this._popupSigLast = this._popupSig();
    host.innerHTML = p.type === "doc" ? this._docPopupHtml() : this._classPopupHtml();
    const body = host.querySelector(".dbody");
    if (body) body.scrollTop = scroll;
  }

  _dialog(icon, title, body) {
    return `<div class="backdrop" data-act="backdrop"><div class="dialog" role="dialog" aria-modal="true">
      <div class="dhead"><ha-icon icon="${icon}"></ha-icon><div class="dtitle">${esc(title)}</div>
      <button class="btn icon" data-act="close-popup" title="${esc(this._t("close"))}"><ha-icon icon="mdi:close"></ha-icon></button></div>
      <div class="dbody">${body}</div></div></div>`;
  }

  _docPopupHtml() {
    const s = this._snap;
    const d = s.documents.find((x) => x.id === this._popup.id);
    if (!d) return "";
    const m = this._maps();
    const paperless = safeUrl(s.server?.url) ? `${safeUrl(s.server.url)}/documents/${d.id}/details` : "";
    const tagPills = d.tags.length ? `<div class="tags" style="justify-content:flex-end">${d.tags.map((t) => this._tagHtml(m.tag.get(t))).join("")}</div>` : "–";
    let info = this._line(this._t("f_corr"), esc(m.corr.get(d.correspondent)?.name || "–")) + this._line(this._t("f_type"), esc(m.type.get(d.document_type)?.name || "–")) +
      this._line(this._t("f_tags"), tagPills) + this._line(this._t("f_created"), esc(this._fmtDate(d.created) || "–")) + this._line(this._t("f_added"), esc(this._fmtDate(d.added) || "–")) +
      this._line(this._t("f_asn"), esc(d.asn ?? "–")) + this._line(this._t("f_pages"), esc(d.pages ?? "–")) + this._line(this._t("f_file"), esc(d.file || "–"));
    if (paperless) info += `<div class="actions"><a class="btn small" style="text-decoration:none" href="${esc(paperless)}" target="_blank" rel="noopener noreferrer">${esc(this._t("open_paperless"))}</a></div>`;
    let html = this._acc_("doc-info", "mdi:information-outline", this._t("sec_info"), info);
    if (this._canEdit()) html += this._acc_("doc-edit", "mdi:pencil", this._t("sec_edit"), this._editForm(d), { meta: `<span class="badge exp">${esc(this._t("badge_exp"))}</span>` });
    if (this._isAdmin()) html += this._acc_("doc-content", "mdi:text-box-search-outline", this._t("sec_content"), this._contentHtml(d.id));
    return this._dialog("mdi:file-document-outline", d.title, html);
  }

  _contentHtml(id) {
    const det = this._details[id];
    if (!det) return `<div class="hint" style="margin:0">${esc(this._t("content_loading"))}</div>`;
    if (det.error) return `<div class="hint" style="margin:0;color:var(--c-error)">${esc(this._err({ code: det.error }))}</div>`;
    const text = det.content ? `<div class="content">${esc(det.content)}</div>` : `<div class="hint" style="margin:0">${esc(this._t("content_empty"))}</div>`;
    return text + (det.content_truncated ? `<div class="hint" style="margin:.4em 0 0">${esc(this._t("content_truncated"))}</div>` : "") + (det.notes ? `<div class="hint" style="margin:.2em 0 0">${esc(this._t("content_notes", { n: det.notes }))}</div>` : "");
  }

  _opts(items, selected) {
    return `<option value="">${esc(this._t("f_none"))}</option>` + items.slice().sort((a, b) => a.name.localeCompare(b.name, this._hass?.language || undefined)).map((i) => `<option value="${i.id}" ${String(i.id) === String(selected) ? "selected" : ""}>${esc(i.name)}</option>`).join("");
  }

  _editForm() {
    const s = this._snap;
    const dr = this._draft;
    const tags = s.tags.slice().sort((a, b) => a.name.localeCompare(b.name, this._hass?.language || undefined)).map((t) => {
      const bg = safeHex(t.color);
      const fg = safeHex(t.text_color);
      return `<button type="button" class="tagbtn ${dr.tags.has(t.id) ? "on" : ""}" data-act="toggle-tag" data-id="${t.id}" style="${bg ? `--tb:${bg};` : ""}${fg ? `--tt:${fg};` : ""}">${esc(t.name)}</button>`;
    }).join("");
    return `<div class="f"><label>${esc(this._t("f_title"))}</label><input data-f="title" data-fk="e-title" maxlength="128" value="${esc(dr.title)}"></div>
      <div class="f"><label>${esc(this._t("f_corr"))}</label><select data-f="correspondent">${this._opts(s.correspondents, dr.correspondent)}</select></div>
      <div class="f"><label>${esc(this._t("f_type"))}</label><select data-f="document_type">${this._opts(s.document_types, dr.document_type)}</select></div>
      <div class="f"><label>${esc(this._t("f_tags"))}</label><div class="tagpick">${tags}</div></div>
      <div class="f"><label>${esc(this._t("f_created"))}</label><input type="date" data-f="created" value="${esc(dr.created)}"></div>
      <div class="f"><label>${esc(this._t("f_asn"))}</label><input type="number" min="0" step="1" data-f="asn" value="${esc(dr.asn)}"></div>
      <div class="actions"><button class="btn primary small" data-act="save-doc" ${this._dirty ? "" : "disabled"}>${esc(this._t("save"))}</button><button class="btn small" data-act="reset-doc" ${this._dirty ? "" : "disabled"}>${esc(this._t("cancel"))}</button></div>`;
  }

  _classPopupHtml() {
    const p = this._popup;
    const pool = p.kind === "corr" ? this._snap.correspondents : p.kind === "type" ? this._snap.document_types : this._snap.tags;
    const x = pool.find((i) => i.id === p.id);
    if (!x) return "";
    const icon = p.kind === "corr" ? "mdi:account-outline" : p.kind === "type" ? "mdi:shape-outline" : "mdi:tag-outline";
    let info = this._line(this._t("f_name"), esc(x.name)) + this._line(this._t("docs_count", { n: x.count }), "") + `<div class="actions"><button class="btn small" data-act="drill-popup">${esc(this._t("show_docs"))}</button></div>`;
    let html = this._acc_("doc-info", "mdi:information-outline", this._t("sec_info"), info);
    if (this._canEdit()) {
      html += this._acc_("doc-edit", "mdi:pencil", this._t("sec_edit"),
        `<div class="f"><label>${esc(this._t("f_name"))}</label><input data-f="name" data-fk="e-name" maxlength="128" value="${esc(this._draft.name)}"></div>
         <div class="actions"><button class="btn primary small" data-act="save-class" ${this._dirty ? "" : "disabled"}>${esc(this._t("save"))}</button><button class="btn small" data-act="reset-doc" ${this._dirty ? "" : "disabled"}>${esc(this._t("cancel"))}</button></div>`,
        { meta: `<span class="badge exp">${esc(this._t("badge_exp"))}</span>` });
    }
    return this._dialog(icon, x.name, html);
  }

  // ---- Ereignisse --------------------------------------------------------------------------
  _onClick(e) {
    const el = e.target.closest("[data-act]");
    if (!el) return;
    const act = el.dataset.act;
    if (act === "backdrop") {
      if (e.target === el) this._closePopup();
      return;
    }
    const id = el.dataset.id != null ? Number(el.dataset.id) : null;
    switch (act) {
      case "tab":
        this._tab = el.dataset.k;
        this._q = "";
        this._rows = 0;
        this._render();
        break;
      case "mode":
        this._mode = el.dataset.k;
        this._rows = 0;
        this._render();
        break;
      case "clear-filter":
        this._filter = null;
        this._render();
        break;
      case "more":
        this._rows += Math.max(5, num(this._config.max_rows, 50));
        this._renderList();
        break;
      case "open-doc":
        this._openDoc(id);
        break;
      case "drill":
        this._drill(el.dataset.kind, id);
        break;
      case "edit-class":
        e.stopPropagation();
        this._openClass(el.dataset.kind, id);
        break;
      case "close-popup":
        this._closePopup();
        break;
      case "drill-popup": {
        const p = this._popup;
        this._closePopup();
        this._drill(p.kind, p.id);
        break;
      }
      case "toggle-tag":
        if (this._draft) {
          if (this._draft.tags.has(id)) this._draft.tags.delete(id);
          else this._draft.tags.add(id);
          this._dirty = true;
          this._renderPopup();
        }
        break;
      case "reset-doc":
        this._dirty = false;
        this._draft = null;
        this._renderPopup();
        break;
      case "save-doc":
        this._saveDoc();
        break;
      case "save-class":
        this._saveClass();
        break;
      case "refresh":
        this._action({ action: "refresh" });
        break;
      case "check-update":
        this._action({ action: "check_update" });
        break;
      default:
    }
  }

  _drill(kind, id) {
    this._filter = { kind, id };
    this._mode = "all";
    this._tab = "documents";
    this._q = "";
    this._rows = 0;
    this._render();
  }

  _onInput(e) {
    const f = e.target?.dataset?.f;
    if (!f) return;
    if (f === "q") {
      this._q = e.target.value;
      this._rows = 0;
      this._renderList();
      return;
    }
    this._setDraft(f, e.target.value);
  }
  _onChange(e) {
    const f = e.target?.dataset?.f;
    if (!f) return;
    if (f === "sort") {
      this._sort = { tab: this._currentTab(), value: e.target.value };
      this._render();
      return;
    }
    this._setDraft(f, e.target.value);
  }
  _setDraft(field, value) {
    if (!this._draft) return;
    this._draft[field] = value;
    const wasDirty = this._dirty;
    this._dirty = true;
    if (!wasDirty) {
      // Speichern-Knopf freischalten, ohne das Eingabefeld neu zu zeichnen
      this.shadowRoot.querySelectorAll('[data-act="save-doc"],[data-act="save-class"],[data-act="reset-doc"]').forEach((b) => (b.disabled = false));
    }
  }
  _onToggle(e) {
    const el = e.target;
    if (!el || el.tagName !== "DETAILS" || !el.dataset.k) return;
    this._acc[el.dataset.k] = el.open;
    if (el.dataset.k === "doc-content" && el.open && this._popup?.type === "doc") this._loadDetails(this._popup.id);
  }

  async _loadDetails(id) {
    if (this._details[id] && !this._details[id].error) return;
    try {
      this._details[id] = await this._ws({ type: `${WS}/details`, doc: id });
    } catch (err) {
      this._details[id] = { error: err && err.code ? err.code : "generic" };
    }
    if (this._popup && this._popup.id === id) {
      this._popupSigLast = "";
      if (!this._dirty) this._renderPopup();
      else {
        const box = this.shadowRoot.querySelector('details[data-k="doc-content"] .acc-body');
        if (box) box.innerHTML = this._contentHtml(id);
      }
    }
  }

  async _action(payload, okMsg) {
    try {
      await this._ws({ type: `${WS}/action`, ...payload });
      if (okMsg) this._showToast(okMsg);
      return true;
    } catch (err) {
      this._showToast(this._err(err), true);
      return false;
    }
  }

  async _saveDoc() {
    const p = this._popup;
    const dr = this._draft;
    const d = this._snap?.documents.find((x) => x.id === p?.id);
    if (!d || !dr) return;
    const fields = {};
    if (dr.title.trim() !== d.title) fields.title = dr.title.trim();
    const cid = dr.correspondent === "" ? null : Number(dr.correspondent);
    if (cid !== d.correspondent) fields.correspondent = cid;
    const tid = dr.document_type === "" ? null : Number(dr.document_type);
    if (tid !== d.document_type) fields.document_type = tid;
    const tags = [...dr.tags].sort((a, b) => a - b);
    if (JSON.stringify(tags) !== JSON.stringify(d.tags.slice().sort((a, b) => a - b))) fields.tags = tags;
    if (dr.created && dr.created !== d.created) fields.created = dr.created;
    const asn = dr.asn === "" ? null : Number(dr.asn);
    if (asn !== (d.asn ?? null)) fields.archive_serial_number = asn;
    if (!Object.keys(fields).length) {
      this._showToast(this._t("nothing_changed"));
      return;
    }
    if (await this._action({ action: "update_document", doc: p.id, fields }, this._t("saved"))) {
      this._dirty = false;
      this._draft = null;
      this._renderPopup();
    }
  }

  async _saveClass() {
    const p = this._popup;
    const name = (this._draft?.name || "").trim();
    if (!p || !name) return;
    const kindMap = { corr: "correspondent", type: "document_type", tag: "tag" };
    if (await this._action({ action: "rename_classifier", kind: kindMap[p.kind], classifier: p.id, name }, this._t("saved"))) {
      this._dirty = false;
      this._draft = null;
      this._renderPopup();
    }
  }

  _showToast(msg, isErr) {
    const host = this.shadowRoot.getElementById("toast");
    host.innerHTML = `<div class="toast ${isErr ? "err" : ""}" role="status">${esc(msg)}</div>`;
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => (host.innerHTML = ""), 5000);
  }
}

// ---- Karten-Editor ------------------------------------------------------------------------------
const EDITOR_LABELS = {
  title: "Titel", entry_id: "Eintrag (entry_id)", show_title: "Titel anzeigen", default_tab: "Starttab",
  show_documents: "Kategorie „Dokumente“ anzeigen", show_correspondents: "Kategorie „Korrespondenten“ anzeigen", show_types: "Kategorie „Dokumenttypen“ anzeigen",
  show_tags: "Kategorie „Tags“ anzeigen", show_settings: "Kategorie „Einstellungen“ anzeigen",
  max_rows: "Zeilen pro Seite", zoom: "Zoom (%)", show_stats: "Statistik-Chips anzeigen", show_search: "Suchfeld anzeigen", show_filter_bar: "Sortierung anzeigen", default_sort: "Standard-Sortierung",
  show_col_correspondent: "Spalte Korrespondent", show_col_type: "Spalte Dokumenttyp", show_col_date: "Spalte Datum", show_col_tags: "Spalte Tags", show_col_pages: "Spalte Seiten",
  read_only: "Nur lesen (keine Bearbeiten-Elemente)", show_experimental: "Experimentelle Funktionen anzeigen",
};
const COLOR_LABELS = { tab_active: "Aktiver Tab", success: "Erfolg (grün)", warning: "Warnung (orange)", error: "Fehler (rot)", info: "Info (blau)", row_icon: "Zeilensymbole (alle)", live_banner: "Banner" };
const TAB_LABELS_DE = { documents: "Dokumente", correspondents: "Korrespondenten", types: "Dokumenttypen", tags: "Tags", settings: "Einstellungen" };

class PaperlessManagerCardEditor extends HTMLElement {
  constructor() {
    super();
    this._config = {};
    this._info = null;
    this._entries = 0;
    this._built = false;
  }
  setConfig(config) {
    this._config = { ...(config || {}) };
    if (this._built) this._update();
  }
  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    if (this._form) this._form.hass = hass;
    if (first) {
      this._load();
      if (!this._built) this._build();
      this._update();
    }
  }
  async _load() {
    try {
      this._info = await this._hass.callWS({ type: `${WS}/info`, ...(this._config.entry_id ? { entry_id: this._config.entry_id } : {}) });
    } catch (_e) {
      this._info = null;
    }
    try {
      const list = await this._hass.callWS({ type: "config_entries/get", domain: WS });
      this._entries = Array.isArray(list) ? list.length : 0;
    } catch (_e) {
      this._entries = 0;
    }
    this._update();
  }
  _schema() {
    const sel = (opts) => ({ select: { mode: "dropdown", options: opts } });
    const tabs = TAB_ORDER.map((k) => ({ value: k, label: TAB_LABELS_DE[k] }));
    const schema = [{ name: "title", selector: { text: {} } }];
    if (this._entries > 1) schema.push({ name: "entry_id", selector: { text: {} } });
    schema.push(
      { name: "", type: "expandable", title: "Kategorien", expanded: true, flatten: true, schema: [...TAB_ORDER.map((k) => ({ name: `show_${k}`, selector: { boolean: {} } })), { name: "default_tab", selector: sel(tabs) }] },
      { name: "", type: "expandable", title: "Darstellung", flatten: true, schema: [
        { name: "show_title", selector: { boolean: {} } }, { name: "max_rows", selector: { number: { min: 5, max: 500, mode: "box" } } },
        { name: "zoom", selector: { number: { min: 50, max: 200, mode: "box" } } }, { name: "show_stats", selector: { boolean: {} } },
        { name: "show_search", selector: { boolean: {} } }, { name: "show_filter_bar", selector: { boolean: {} } },
        { name: "default_sort", selector: sel([{ value: "added", label: "Zuletzt hinzugefügt" }, { value: "created", label: "Erstellungsdatum" }, { value: "title", label: "Titel A–Z" }]) },
        { name: "", type: "expandable", title: "Spalten", flatten: true, schema: ["correspondent", "type", "date", "tags", "pages"].map((k) => ({ name: `show_col_${k}`, selector: { boolean: {} } })) },
      ] },
      { name: "", type: "expandable", title: "Bearbeiten", flatten: true, schema: [{ name: "read_only", selector: { boolean: {} } }] },
      { name: "", type: "expandable", title: "Experimentell", flatten: true, schema: [{ name: "show_experimental", selector: { boolean: {} } }] },
    );
    return schema;
  }
  _build() {
    this.innerHTML = "";
    this._ver = document.createElement("div");
    this._ver.style.cssText = "padding:8px 0 12px;font-size:14px";
    this._form = document.createElement("ha-form");
    this._form.hass = this._hass;
    this._form.computeLabel = (s) => EDITOR_LABELS[s.name] || s.name;
    this._form.addEventListener("value-changed", (ev) => {
      ev.stopPropagation();
      this._emit({ ...this._config, ...ev.detail.value });
    });
    this._colors = document.createElement("details");
    this._colors.style.cssText = "border:1px solid var(--divider-color);border-radius:8px;margin-top:12px;padding:8px 12px";
    this.append(this._ver, this._form, this._colors);
    this._built = true;
  }
  _emit(cfg) {
    this._config = cfg;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: cfg }, bubbles: true, composed: true }));
  }
  _update() {
    if (!this._built) return;
    const info = this._info;
    const app = info && info.app;
    let status = "";
    if (app) {
      if (app.check_failed) status = ' · <span style="color:var(--error-color)">Prüfung nicht möglich</span>';
      else if (app.update_available) status = ` · <span style="color:var(--warning-color)">↑ Neue Version ${esc(app.latest_version)} verfügbar (HACS, Neustart, Strg+F5)</span>`;
      else if (app.latest_version) status = ' · <span style="color:var(--success-color)">aktuell</span>';
    }
    this._ver.innerHTML = `<b>Karte ${esc(CARD_VERSION)}</b> · Integration ${esc(app ? app.version : "–")}${status}`;
    this._form.schema = this._schema();
    this._form.data = { ...DEFAULTS, ...this._config };
    this._colors.innerHTML = "";
    const sum = document.createElement("summary");
    sum.textContent = "Farben";
    sum.style.cursor = "pointer";
    this._colors.append(sum);
    const keys = [...Object.keys(COLOR_CONFIG_KEYS).map((k) => [`color_${k}`, COLOR_LABELS[k]]), ...TAB_ORDER.map((k) => [`color_icon_${k}`, `Symbol: ${TAB_LABELS_DE[k]}`])];
    for (const [key, label] of keys) {
      const row = document.createElement("div");
      row.style.cssText = "display:flex;align-items:center;gap:8px;margin:6px 0";
      const lab = document.createElement("span");
      lab.style.cssText = "flex:1;font-size:13px";
      lab.textContent = label;
      const pick = document.createElement("input");
      pick.type = "color";
      const txt = document.createElement("input");
      txt.type = "text";
      txt.style.cssText = "width:9em";
      const cur = sanitizeColor(this._config[key]);
      txt.value = cur;
      if (/^#[0-9a-fA-F]{6}$/.test(cur)) pick.value = cur;
      const set = (v) => {
        const clean = sanitizeColor(v);
        const cfg = { ...this._config };
        if (clean) cfg[key] = clean;
        else delete cfg[key];
        this._emit(cfg);
      };
      pick.addEventListener("input", () => { txt.value = pick.value; set(pick.value); });
      txt.addEventListener("change", () => set(txt.value));
      row.append(lab, pick, txt);
      this._colors.append(row);
    }
    const reset = document.createElement("button");
    reset.textContent = "Alle Farben zurücksetzen";
    reset.style.cssText = "margin-top:8px;padding:6px 12px;cursor:pointer";
    reset.addEventListener("click", () => {
      const cfg = { ...this._config };
      for (const [k] of keys) delete cfg[k];
      this._emit(cfg);
      this._update();
    });
    this._colors.append(reset);
  }
}

if (!customElements.get(CARD_TAG)) customElements.define(CARD_TAG, PaperlessManagerCard);
if (!customElements.get(EDITOR_TAG)) customElements.define(EDITOR_TAG, PaperlessManagerCardEditor);
window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === CARD_TAG)) {
  window.customCards.push({ type: CARD_TAG, name: "Paperless Manager", description: "Paperless-ngx mit Kategorien: Dokumente, Korrespondenten, Dokumenttypen, Tags.", preview: false });
}
console.info(`%c PAPERLESS-MANAGER-CARD %c ${CARD_VERSION} `, "color:#fff;background:#1976d2;font-weight:700", "color:#1976d2;background:#fff;font-weight:700");
