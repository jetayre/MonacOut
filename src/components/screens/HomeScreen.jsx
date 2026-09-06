import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { ALL_EVENTS } from "../../data/events";
import { localizeTitle, localizeCat } from "../../i18n";
import MonacOutLogo from "../MonacOutLogo";
import EventCard from "../EventCard";
import CalendarPicker from "../CalendarPicker";
import { track } from "../../lib/track";
import { partagerInvitation } from "../../lib/invite";

const NAVY = "#0F1D3A";
const GOLD = "#C9A96E";
const GREY = "#6A7080";
const WHITE = "#FFFFFF";
const CREAM = "#FFFFFF";
const BORDER = "rgba(15,29,58,0.12)";
const STRIPE_BG = "repeating-linear-gradient(-45deg, #9FC3DC 0px, #9FC3DC 40px, #FFFFFF 40px, #FFFFFF 80px)";

// Met un texte à plat pour la recherche : minuscules, sans accents, et toute
// ponctuation (tirets, points médians, apostrophes…) remplacée par une espace.
// « Monte-Carlo Summer Festival » et « monte carlo summer festival » deviennent
// alors le même texte.
function normalizeForSearch(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// Boutons de catégories groupées (barre sous les filtres temps, à la place des quartiers)
const EVENT_GROUPS = [
  { id: "culture",   label: "Musée/Ciné/Atelier", labelEn: "Museum/Cinema/Workshop", cats: ["EXPOSITION","CONFÉRENCE","CINÉMA","THÉÂTRE","OPÉRA","MUSICAL","SPECTACLE","FESTIVAL","ENCHÈRES","MARCHÉ","SALON","FÊTE NATIONALE","ATELIER","DANSE","BIEN-ÊTRE"] },
  { id: "foodnight", label: "Food/Nightlife", labelEn: "Food/Nightlife", cats: ["BRUNCH","APÉRO","FOODY","SOIRÉE","DJ SET","GALA"] },
  { id: "musique",   label: "Concert/Ballet/Opéra", labelEn: "Concert/Ballet/Opera", cats: ["CONCERT","OPÉRA","MUSICAL","DANSE","JAZZ LIVE","CHANTS"] },
  { id: "sport",     label: "Sport",     labelEn: "Sport",     cats: ["FOOTBALL","BASKET","FORMULE 1","FORMULE E","TENNIS","RALLYE","SPORT"] },
];

const CAT_TO_FILTER = {
  FOOTBALL: "sport", BASKET: "sport", "FORMULE 1": "sport", "FORMULE E": "sport",
  SPORT: "sport", RALLYE: "sport", TENNIS: "sport",
  CONCERT: "concert", "OPÉRA": "concert", MUSICAL: "theatre", "JAZZ LIVE": "concert",
  "DJ SET": "soiree", CHANTS: "messe",
  THÉÂTRE: "theatre", "CONFÉRENCE": "conference", EXPOSITION: "musee", FESTIVAL: "theatre",
  GALA: "theatre", "FÊTE NATIONALE": "theatre", MARCHÉ: "musee", SALON: "conference",
  SPECTACLE: "theatre", CINÉMA: "cinema",
  ATELIER: "ateliers", DANSE: "ateliers",
  "BIEN-ÊTRE": "bienetre",
  BRUNCH: "foody", APÉRO: "foody", SOIRÉE: "soiree", FOODY: "foody",
  ENCHÈRES: "encheres",
};

const TIME_FILTERS = [
  { id: "today",    label: "Aujourd'hui" },
  { id: "week",     label: "Semaine" },
  { id: "weekend",  label: "Week-end" },
  { id: "calendar", label: "Agenda" },
];

const JOURS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MOIS = ["jan", "fév", "mar", "avr", "mai", "juin", "juil", "août", "sep", "oct", "nov", "déc"];
const MOIS_IDX = { jan:0, fév:1, mar:2, avr:3, mai:4, juin:5, juil:6, août:7, sep:8, oct:9, nov:10, déc:11 };
const MOIS_NOM_COURT = ["jan","fév","mar","avr","mai","juin","juil","août","sep","oct","nov","déc"];

function toFrDate(d) { return `${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]}`; }

function getWeekendDates() {
  const today = new Date(); const day = today.getDay();
  const daysToSat = day === 0 ? 6 : day === 6 ? 0 : 6 - day;
  const daysToSun = day === 0 ? 0 : 7 - day;
  const sat = new Date(today); sat.setDate(today.getDate() + daysToSat);
  const sun = new Date(today); sun.setDate(today.getDate() + daysToSun);
  return [toFrDate(sat), toFrDate(sun)];
}

function parseEventDate(e) {
  const parts = e.date.trim().split(" ");
  const day = parseInt(parts[1]); const month = MOIS_IDX[parts[2]];
  if (isNaN(day) || month === undefined) {
    if (import.meta.env.DEV) console.warn("[MonacOut] malformed date:", e.id, e.date);
    return null;
  }
  return new Date(e.year || new Date().getFullYear(), month, day);
}

// Une expo « en cours » (ongoing:true) ne porte qu'UNE seule date — celle du jour,
// remise à jour chaque nuit. Elle disparaissait donc dès qu'on demandait le week-end
// ou une date de septembre au calendrier, alors qu'elle est ouverte jusqu'en janvier.
// On la fait apparaître sur toute sa durée : elle a commencé (sa date ≤ fin demandée)
// et elle n'est pas terminée (son `until` ≥ début demandé).
function couvreLaPeriode(e, debut, fin) {
  if (!e.ongoing || !e.until) return false;
  const finExpo = new Date(e.until + "T00:00:00");
  if (isNaN(finExpo)) return false;
  const d = parseEventDate(e);
  return !!d && finExpo >= debut && d <= fin;
}

// ── LES EXPOS DANS LE DÉFILEMENT ────────────────────────────────────────────────
// Le fil est une liste continue : chaque fiche y apparaît UNE fois, à sa date. Une
// exposition « en cours » n'a qu'une date — celle du jour — donc en descendant le fil
// on la voyait aujourd'hui puis plus jamais, alors qu'elle est ouverte tous les jours
// jusqu'en janvier. On la répète donc sur chacun de ses jours d'ouverture.
//
// La répétition est faite À L'AFFICHAGE, pas dans les données : aucune fiche n'est
// dupliquée dans events.js, aucun id n'est réutilisé, les favoris continuent de
// fonctionner (même id ⇒ mettre l'expo en favori la met partout, ce qui est voulu).
// Chaque copie reçoit une `cleFil` unique pour la clé React.
//
// Horizon : 120 jours. Au-delà, le fil deviendrait illisible pour un gain nul —
// personne ne fait défiler quatre mois. Les dates plus lointaines restent
// accessibles par le calendrier, qui applique `couvreLaPeriode` sans limite.
const HORIZON_EN_COURS = 120;

function etaleLesEnCours(liste) {
  const aujourdhui = new Date(); aujourdhui.setHours(0, 0, 0, 0);
  const horizon = new Date(aujourdhui);
  horizon.setDate(horizon.getDate() + HORIZON_EN_COURS);

  const sortie = [];
  for (const e of liste) {
    const debut = e.ongoing && e.until ? parseEventDate(e) : null;
    const fin = e.ongoing && e.until ? new Date(e.until + "T00:00:00") : null;
    if (!debut || !fin || isNaN(fin)) { sortie.push(e); continue; }

    // Première occurrence : aujourd'hui au plus tôt (une expo commencée en juin ne
    // doit pas réapparaître dans le passé). Dernière : sa fermeture, dans l'horizon.
    const d = new Date(Math.max(debut.getTime(), aujourdhui.getTime()));
    const derniere = new Date(Math.min(fin.getTime(), horizon.getTime()));
    if (d > derniere) { sortie.push(e); continue; }

    let premier = true;
    for (let j = new Date(d); j <= derniere; j.setDate(j.getDate() + 1)) {
      sortie.push({
        ...e,
        date: toFrDate(j),
        year: j.getFullYear(),
        cleFil: `${e.id}-${j.getFullYear()}-${j.getMonth() + 1}-${j.getDate()}`,
        // Repli quand aucun jour n'a été retenu (coche posée avant cette version, ou
        // sur un autre appareil) : on l'affiche sur la PREMIÈRE occurrence seulement,
        // jamais sur toutes — sinon on retombe sur le défaut signalé le 11 août 2026.
        premierJour: premier,
      });
      premier = false;
    }
  }
  // Indispensable : les copies sont créées à la place de l'originale, donc groupées.
  // Sans ce tri, 120 fiches « Victor Brauner » s'empilaient au milieu du fil au lieu
  // d'apparaître une par une, chacune à son jour.
  return sortie.sort((a, b) => {
    const da = parseEventDate(a), db = parseEventDate(b);
    if (!da || !db) return 0;
    return (da - db) || (heureDeTri(a) - heureDeTri(b));
  });
}

// Heure en minutes, pour trier à l'intérieur d'une même journée. Reprend la
// convention de src/data/events.js : « En journée » → 11h, « En soirée » → 21h.
function heureDeTri(e) {
  const t = (e.time || "").replace(/\s/g, "");
  const m = t.match(/^(\d{1,2})h(\d{2})?/);
  if (m) return parseInt(m[1]) * 60 + (m[2] ? parseInt(m[2]) : 0);
  const mot = t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  if (mot === "enjournee") return 11 * 60;
  if (mot === "ensoiree") return 21 * 60;
  return 9999;
}

// Une fiche du jour dont l'heure est passée n'a plus rien à proposer : à 15h48 on ne
// veut plus voir le cours de 07h00. On se fie à l'heure de FIN quand la fiche la donne
// (« 07h00 — 09h00 ») ; sinon au début plus deux heures, le temps qu'un concert ou un
// dîner déjà commencé reste rejoignable.
function finEnMinutes(e) {
  // Les récapitulatifs (« 6 musées ouverts », « 8 brunchs ») et les annuaires ne
  // portent qu'une heure d'ouverture : ils restent utiles toute la journée.
  if (e.recap === true || e.pinLast === true) return 24 * 60;
  const t = (e.time || "").replace(/\s/g, "");
  // Le fil écrit les plages avec un tiret cadratin OU une flèche : « 09h — 18h »,
  // « 9h30 → 18h30 ». Oublier la flèche masquait la messe du dimanche dès 11h30.
  const plage = t.match(/^(\d{1,2})h(\d{2})?[\u2014\u2013\u2192>\-\u00e0]+(\d{1,2})h(\d{2})?/);
  if (plage) {
    const debut = parseInt(plage[1]) * 60 + (plage[2] ? parseInt(plage[2]) : 0);
    const fin   = parseInt(plage[3]) * 60 + (plage[4] ? parseInt(plage[4]) : 0);
    return fin <= debut ? 24 * 60 : fin;   // « 23h00 — 04h00 » se termine le lendemain
  }
  const seul = t.match(/^(\d{1,2})h(\d{2})?/);
  if (seul) return parseInt(seul[1]) * 60 + (seul[2] ? parseInt(seul[2]) : 0) + 120;
  const mot = t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (mot === "enjournee") return 18 * 60;
  return 24 * 60;   // « En soirée » ou horaire absent : on garde jusqu'au bout de la nuit
}

function filterByTime(events, filterId) {
  const todayStr = toFrDate(new Date()); const weekendDates = getWeekendDates();
  const maintenant = new Date().getHours() * 60 + new Date().getMinutes();
  const base = (() => {
  switch (filterId) {
    // Les fiches « en cours » sont déjà étalées jour par jour en amont
    // (etaleLesEnCours) : ces filtres n'ont donc rien de spécial à faire.
    case "today": { const y = new Date().getFullYear(); return events.filter(e => e.date === todayStr && (e.year || y) === y); }
    case "weekend": { const y = new Date().getFullYear(); return events.filter(e => weekendDates.includes(e.date) && (e.year || y) === y); }
    case "week": {
      const today = new Date(); today.setHours(0,0,0,0);
      const in7 = new Date(today); in7.setDate(today.getDate() + 6);
      return events.filter(e => { const d = parseEventDate(e); return d && d >= today && d <= in7; });
    }
    default: return events;
  }
  })();
  // Le fil est une proposition de sortie, pas un journal : on masque ce qui est
  // terminé. Les autres jours ne sont pas concernés.
  return base.filter(e => e.date !== todayStr || finEnMinutes(e) > maintenant);
}

// ── LE FIL EN SECTIONS ───────────────────────────────────────────────────────
// Stéphanie, 6 septembre 2026 : « lorsque l'on scrolle il y a une sensation de
// répétition ». Elle avait raison, et c'était mesurable : « AUJOURD'HUI » écrit
// vingt fois, une fois par carte, et treize expositions qui se suivaient sans
// rien entre elles. Trois gestes y répondent — la date passe en intertitre au
// lieu d'être répétée, la journée en cours se découpe en moments, et les
// expositions d'une même section se réunissent sur une seule carte.

const JOURS_LONGS_FR = ["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];
const MOIS_LONGS_FR  = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
const JOURS_LONGS_EN = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MOIS_LONGS_EN  = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// « Dim 6 sep » → « DIMANCHE 6 SEPTEMBRE »
function titreDeJour(dateStr, lang) {
  const p = (dateStr || "").split(" ");
  const j = JOURS.indexOf(p[0]), m = MOIS_IDX[p[2]];
  if (j < 0 || m === undefined) return dateStr || "";
  return lang === "en"
    ? `${JOURS_LONGS_EN[j]} ${p[1]} ${MOIS_LONGS_EN[m]}`
    : `${JOURS_LONGS_FR[j]} ${p[1]} ${MOIS_LONGS_FR[m]}`;
}

function decouperEnSections(liste, lang) {
  const now = new Date();
  const min = now.getHours() * 60 + now.getMinutes();
  const aujourdhui = toFrDate(now);
  const d = new Date(now); d.setDate(d.getDate() + 1);
  const demain = toFrDate(d);

  const sections = [];
  let courante = null;
  // `jour` s'affiche en gros doré, une seule fois ; `moment` en dessous, plus discret.
  // Aujourd'hui n'a pas de jour : ses moments (Maintenant, Ce soir) tiennent la
  // place du titre, c'est ce qu'on lit en ouvrant l'app.
  const poser = (cle, jour, moment, e) => {
    if (!courante || courante.cle !== cle) { courante = { cle, jour, moment, items: [] }; sections.push(courante); }
    courante.items.push(e);
  };

  // Matin / après-midi / soir, d'après l'heure de DÉBUT. La liste étant triée par
  // cette même heure, les trois se suivent toujours dans l'ordre.
  const momentDuJour = (e) => {
    if (!(e.time && String(e.time).trim())) return lang === "en" ? "Afternoon" : "Après-midi";
    const debut = heureDeTri(e);
    if (debut < 12 * 60)      return lang === "en" ? "Morning" : "Matin";
    if (debut < 18 * 60)      return lang === "en" ? "Afternoon" : "Après-midi";
    return lang === "en" ? "Evening" : "Soir";
  };

  for (const e of liste) {
    if (e.date === aujourdhui) {
      const sansHeure = !(e.time && String(e.time).trim());
      const debut = heureDeTri(e), fin = finEnMinutes(e);
      // Une fiche sans horaire ne dit rien de son moment : l'annoncer « ce soir »
      // serait affirmer un horaire qu'elle ne donne pas.
      if (!sansHeure && debut <= min && min < fin) poser("maintenant", null, lang === "en" ? "Right now" : "Maintenant", e);
      else if (!sansHeure && debut >= 18 * 60)     poser("cesoir",     null, lang === "en" ? "Tonight" : "Ce soir", e);
      else                                         poser("plustard",   null, lang === "en" ? "Later today" : "Plus tard aujourd'hui", e);
    } else {
      const jour = e.date === demain ? (lang === "en" ? "Tomorrow" : "Demain") : titreDeJour(e.date, lang);
      const moment = momentDuJour(e);
      poser(`${e.date}|${moment}`, jour, moment, e);
    }
  }
  return sections;
}

// Les expositions d'une même section tiennent sur une carte. En dessous de trois,
// la carte de regroupement coûterait plus de place qu'elle n'en fait gagner.
const estExpoDuFil = e => e.cat === "EXPOSITION" && e.recap !== true && e.pinLast !== true;

function reunirLesExpos(items, deplie) {
  const expos = items.filter(estExpoDuFil);
  if (expos.length < 3) return items;
  const sortie = []; let posee = false;
  for (const e of items) {
    if (!estExpoDuFil(e)) { sortie.push(e); continue; }
    // La carte prend la place de la première exposition ; dépliée, les fiches
    // reviennent juste en dessous, entières, sans quitter le jour affiché.
    if (!posee) { posee = true; sortie.push({ groupeExpos: expos }); if (deplie) sortie.push(...expos); }
  }
  return sortie;
}

// Le moment, sous le jour : plus petit, sans filet, dans le bleu du cadre —
// il précise, il n'annonce pas.
function IntertitreMoment({ titre }) {
  return (
    <div style={{
      fontFamily: "'Lato', sans-serif",
      fontSize: 12, fontWeight: 700, letterSpacing: 1.6,
      textTransform: "uppercase", color: GREY,
      margin: "14px 2px 8px",
    }}>{titre}</div>
  );
}

function IntertitreSection({ titre }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "22px 2px 12px" }}>
      <span style={{
        fontFamily: "'Josefin Sans', sans-serif",
        fontSize: 15, fontWeight: 700, letterSpacing: 2.4,
        textTransform: "uppercase", color: GOLD, whiteSpace: "nowrap",
      }}>{titre}</span>
      <span style={{ flex: 1, height: 1, background: "rgba(201,169,110,0.45)" }} />
    </div>
  );
}

// La carte qui remplace la pile d'expositions. Elle ne prétend pas être un
// événement : ni cœur, ni « J'y vais », ni téléphone. On la touche, la catégorie
// se déplie et les fiches reviennent une par une, entières.
function CarteGroupeExpos({ expos, lang, deplie, onOuvrir }) {
  // On annonce les expositions elles-mêmes : le premier morceau du sous-titre est
  // tantôt une salle, tantôt une adresse (« 62 bd du Jardin Exotique »), et lister
  // des rues ne donne envie de rien.
  const titres = [...new Set(expos.map(e => localizeTitle((e.title || "").replace(/\n/g, " ").replace(/\s*ⓘ\s*$/, "").trim(), lang)).filter(Boolean))];
  return (
    <div
      onClick={onOuvrir}
      style={{
        border: "1.5px solid #C9A96E", borderRadius: 2, padding: 4,
        marginBottom: 14, background: WHITE, cursor: "pointer",
      }}
    >
      <div style={{ border: "1.5px solid #9FC3DC", borderRadius: 1, background: WHITE }}>
        <div style={{ padding: "18px 22px 20px", textAlign: "center" }}>
          <div style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontSize: 15, fontWeight: 700, letterSpacing: 2.2,
            textTransform: "uppercase", color: GOLD, marginBottom: 14,
          }}>{lang === "en" ? "Exhibitions" : "Expositions"}</div>

          {/* Les titres des fiches arrivent en capitales depuis les données ; celui-ci
              est écrit ici, donc c'est la feuille de style qui doit s'en charger —
              sans quoi la carte de regroupement détonnait au milieu des autres. */}
          <div style={{
            fontFamily: "'Josefin Sans', Georgia, sans-serif",
            fontWeight: 400, fontSize: 26, letterSpacing: 0.3,
            textTransform: "uppercase",
            color: "#000000", lineHeight: 1.25, marginBottom: 14,
          }}>{expos.length} {lang === "en" ? "exhibitions on view" : "expositions à voir"}</div>

          {/* Les titres arrivent déjà en capitales : en serif ils pèsent autant que
              le titre de la carte. En Lato fin, ils redeviennent ce qu'ils sont —
              un index discret de ce qu'on trouvera dessous. */}
          <div style={{
            fontFamily: "'Lato', sans-serif",
            fontSize: 11.5, fontWeight: 400, letterSpacing: 0.8,
            color: GREY, lineHeight: 1.8, marginBottom: 18,
          }}>{titres.slice(0, 3).join(" · ")}{titres.length > 3 ? " …" : ""}</div>

          <span style={{
            display: "inline-block", padding: "8px 18px",
            border: "1px solid #C9A96E",
            fontFamily: "'Lato', sans-serif", fontSize: 12,
            fontWeight: 700, letterSpacing: 1.6,
            textTransform: "uppercase", color: GOLD,
          }}>{deplie
            ? (lang === "en" ? "Close" : "Replier")
            : (lang === "en" ? `See all ${expos.length}` : `Voir les ${expos.length}`)}</span>
        </div>
      </div>
    </div>
  );
}

function matchesCatFilter(e, catId) {
  switch (catId) {
    case "sport":      return ["FOOTBALL","BASKET","FORMULE 1","FORMULE E","SPORT","RALLYE","TENNIS"].includes(e.cat);
    case "theatre":    return ["THÉÂTRE","SPECTACLE","DANSE","FESTIVAL","GALA","FÊTE NATIONALE","MUSICAL"].includes(e.cat);
    case "concert":    return ["CONCERT","JAZZ LIVE","OPÉRA"].includes(e.cat);
    case "musee":      return ["EXPOSITION","MARCHÉ","SALON"].includes(e.cat);
    case "conference": return e.cat === "CONFÉRENCE" || e.cat === "SALON" || e.conf === true;
    case "cinema":     return e.cat === "CINÉMA";
    case "famille":    return e.free === true || ["ATELIER","SPECTACLE","CINÉMA","MARCHÉ","FESTIVAL","EXPOSITION","DANSE"].includes(e.cat) || /enfant|famille|junior|jeune|parent|kid/i.test(e.subtitle + " " + (e.desc || ""));
    case "ateliers":   return ["ATELIER","DANSE"].includes(e.cat);
    case "bienetre":   return ["BIEN-ÊTRE"].includes(e.cat);
    case "foody":      return ["FOODY","BRUNCH","APÉRO"].includes(e.cat);
    case "soiree":     return ["SOIRÉE","DJ SET"].includes(e.cat);
    case "encheres":   return ["ENCHÈRES"].includes(e.cat);
    case "messe":      return e.cat === "CHANTS";
    default: return false;
  }
}

function filterByCats(events, catFilters) {
  if (!catFilters || catFilters.length === 0) return events;
  return events.filter(e => catFilters.some(id => matchesCatFilter(e, id)));
}

function SearchIcon({ active }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke={active ? "#C9A96E" : "#0F1D3A"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7"/>
      <line x1="16.5" y1="16.5" x2="22" y2="22"/>
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg width="18" height="13" viewBox="0 0 18 13" fill="none">
      <rect y="0" width="18" height="1.8" rx="0.9" fill="#0F1D3A"/>
      <rect y="5.6" width="18" height="1.8" rx="0.9" fill="#0F1D3A"/>
      <rect y="11.2" width="18" height="1.8" rx="0.9" fill="#0F1D3A"/>
    </svg>
  );
}

function HeartIcon({ active, hasFavs }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24"
      fill={hasFavs ? "#C4A241" : "none"}
      stroke={hasFavs ? "#C4A241" : "#0F1D3A"}
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

export default function HomeScreen({ favorites = [], onToggleFav, onCategoryClick, filter = "all", onFilterChange, lang = "fr", catFilters = [], onCatFilter, onOpenMenu, onNavAgenda, onNavFriends, onCardClick, onAdminOpen, onLangChange, events = ALL_EVENTS, social, onGoingClick, joursParticipation = {}, pendingFriends = 0, userName = "", avatarUrl = "", loggedIn = false, authReady = false, onShowAuth, inviteCode = "" }) {
  const setFilter = onFilterChange || (() => {});
  const t = lang === "en"
    ? { tagline: "Monaco Together", filters: { today: "Today", week: "This week", weekend: "Weekend", agenda: "Calendar" }, empty: "No events for this period." }
    : { tagline: "Monaco Ensemble", filters: { today: "Aujourd'hui", week: "Semaine", weekend: "Week-end", agenda: "Agenda" }, empty: "Aucun événement pour cette période." };

  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [groupFilter, setGroupFilter] = useState(null);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [logoTaps, setLogoTaps] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  // Bandeau « Partage ton lien » : refermé pour la visite en cours seulement.
  const [bandeauAmisFerme, setBandeauAmisFerme] = useState(false);
  // Quelles sections ont déplié leur pile d'expositions. Une par jour, indépendantes.
  const [exposDepliees, setExposDepliees] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  const tapTimer = useRef(null);

  function handleLogoTap() {
    const next = logoTaps + 1;
    if (next >= 5) {
      setLogoTaps(0);
      clearTimeout(tapTimer.current);
      onAdminOpen?.();
      return;
    }
    setLogoTaps(next);
    clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => setLogoTaps(0), 2000);
  }

  // Combien de fiches sont affichées à l'instant. Mis à jour à chaque rendu, lu par
  // le capteur de défilement ci-dessous (qui, lui, n'est installé qu'une seule fois).
  const nbAffichees = useRef(0);
  // Nombre de cartes réellement posées dans le DOM (rendu progressif, voir plus bas).
  const [nbRendues, setNbRendues] = useState(40);
  // Jalons de profondeur déjà envoyés pendant cette visite : on ne mesure que la
  // descente la plus profonde, pas chaque va-et-vient. 4 mesures par visite maximum.
  const jalonsEnvoyes = useRef(new Set());

  useEffect(() => {
    const el = document.getElementById("main-scroll");
    if (!el) return;
    let lastY = 0;
    let enAttente = false;
    const handler = () => {
      const y = el.scrollTop;
      if (y < 10) setFiltersVisible(true);
      else if (y > lastY + 6) setFiltersVisible(false);
      else if (y < lastY - 6) setFiltersVisible(true);
      lastY = y;

      // Rendu progressif : on pose 40 cartes de plus dès qu'on arrive à deux écrans
      // du bas, pour que le fil paraisse infini sans jamais tout poser d'un coup.
      if (el.scrollHeight - (y + el.clientHeight) < el.clientHeight * 2) {
        setNbRendues(n => (n >= nbAffichees.current ? n : n + 40));
      }

      // ── Mesure de la profondeur de lecture ──────────────────────────────────
      // Ce qui compte pour Monac'Out, c'est que les gens PARCOURENT le fil : la
      // carte donne déjà le nom, la date et le lieu, ouvrir la fiche n'est utile
      // que pour réserver. On mesure donc jusqu'où ils descendent, en NOMBRE DE
      // FICHES vues (pas en pourcentage : le fil n'a pas la même longueur selon
      // le filtre, et « 50 % » ne veut rien dire quand il ne reste que 6 fiches).
      // Calcul différé d'une frame : le scroll doit rester parfaitement fluide.
      if (enAttente) return;
      enAttente = true;
      requestAnimationFrame(() => {
        enAttente = false;
        const total = nbAffichees.current;
        const hauteur = el.scrollHeight;
        if (total < 1 || hauteur <= el.clientHeight) return;   // rien à faire défiler
        const vues = Math.round(total * Math.min(1, (y + el.clientHeight) / hauteur));
        for (const jalon of [5, 10, 20, 40]) {
          if (vues >= jalon && !jalonsEnvoyes.current.has(jalon)) {
            jalonsEnvoyes.current.add(jalon);
            track("scroll_depth", { fiches: jalon, affichees: total });
          }
        }
      });
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  // Repartir du haut du fil (40 cartes) à chaque changement de vue : sinon on gardait
  // les centaines de cartes déjà posées pour la vue précédente.
  // ⚠️ `catFilters.join()` et non `catFilters` : le parent recrée le tableau à chaque
  // rendu, donc la dépendance changerait sans arrêt et remettrait le fil à 40 cartes
  // en boucle — le défilement infini n'avancerait jamais.
  useEffect(() => { setNbRendues(40); }, [filter, searchQuery, groupFilter, rangeStart, rangeEnd, catFilters.join(",")]);

  function handleFilterChange(newFilter) {
    const el = document.getElementById("main-scroll");
    // Re-cliquer sur le filtre actif le retire — y compris le CALENDRIER, qui en
    // était exclu : le bouton l'ouvrait mais rien ne le refermait. Stéphanie,
    // 3 septembre 2026 : « quand j'appuie sur calendrier 1×, il apparaît, et la
    // 2ᵉ fois il ne s'en va pas ». Un bouton qui ouvre doit refermer.
    if (filter === newFilter) {
      setFilter("all");
      if (newFilter === "calendar") { setRangeStart(null); setRangeEnd(null); }
      if (el) el.scrollTop = 0;
      return;
    }
    if (newFilter !== "calendar") { setRangeStart(null); setRangeEnd(null); }
    setFilter(newFilter); setFiltersVisible(true);
    if (el) el.scrollTop = 0;
  }

  // Fil continu : les fiches « en cours » y sont répétées sur chacun de leurs jours
  // d'ouverture. La RECHERCHE et le CALENDRIER travaillent sur la liste d'origine :
  // la recherche ne doit pas renvoyer 120 fois la même exposition, et le calendrier
  // gère lui-même les dates lointaines (au-delà de l'horizon) via `couvreLaPeriode`.
  const evenementsEtales = useMemo(() => etaleLesEnCours(events), [events]);

  let filtered;
  if (searchQuery.trim()) {
    // Recherche tolérante : on ignore accents, tirets et ponctuation, et on
    // cherche TOUS les mots (dans n'importe quel ordre) plutôt que la suite
    // exacte de caractères. Sans ça « monte carlo summer festival » ne trouvait
    // rien, parce que les fiches écrivent « Monte-Carlo Summer Festival ».
    const words = normalizeForSearch(searchQuery).split(" ").filter(Boolean);
    filtered = filterByCats(events, catFilters).filter(e => {
      // Recherche dans TOUS les champs, en français ET en anglais
      const hay = normalizeForSearch([
        e.title, localizeTitle((e.title || "").replace(/\n/g, " "), "en"),
        e.subtitle, e.quarter,
        e.cat, localizeCat(e.cat, "en"),
        e.desc, e.descEn, e.source, e.time,
      ].join(" "));
      return words.every(w => hay.includes(w));
    });
  } else if (filter === "calendar" && rangeStart) {
    const endBound = rangeEnd || rangeStart;
    filtered = filterByCats(events.filter(e => {
      const d = parseEventDate(e);
      return (d && d >= rangeStart && d <= endBound) || couvreLaPeriode(e, rangeStart, endBound);
    }), catFilters);
  } else if (filter === "calendar") {
    filtered = filterByCats(events, catFilters);
  } else {
    filtered = filterByCats(filterByTime(evenementsEtales, filter), catFilters);
  }
  if (groupFilter) { const g = EVENT_GROUPS.find(x => x.id === groupFilter); if (g) filtered = filtered.filter(e => g.cats.includes(e.cat)); }

  // Le fil ne montre que de VRAIS événements. Les deux fiches d'annuaire permanentes
  // — « Musées de Monaco ouverts » et « Bien-être : spas & studios » — sont là tous
  // les jours et encombraient la liste : on ne les affiche plus que lorsqu'on
  // demande explicitement leur catégorie (Musée / Bien-être), ou en recherche.
  // La carte cinéma, elle, reste dans le fil : c'est un programme qui change.
  const estAnnuairePermanent = e => e.pinLast === true && e.cat !== "CINÉMA";
  const filtreCatActif = (catFilters && catFilters.length > 0) || !!groupFilter;
  if (!filtreCatActif && !searchQuery.trim()) filtered = filtered.filter(e => !estAnnuairePermanent(e));

  // On tient la longueur du fil à jour pour le capteur de profondeur : celui-ci est
  // installé une fois pour toutes et ne verrait pas la variable `filtered` changer.
  nbAffichees.current = filtered.length;

  // Rendu progressif. Le fil posait déjà toutes ses cartes d'un coup ; en répétant
  // les expositions jour par jour il en compte ~900 de plus, ce qui se sentirait au
  // démarrage sur iPhone. On en pose 40, puis 40 de plus dès qu'on approche du bas.
  // Purement visuel : `filtered.length` reste la vraie longueur pour la mesure.
  const aAfficher = filtered.slice(0, nbRendues);

  // Le fil se range sous des intertitres de jour (et de moment, pour aujourd'hui).
  // En recherche on garde la liste à plat : les résultats sautent d'un mois à
  // l'autre, un intertitre par carte n'aiderait personne.
  const enSections = !searchQuery.trim();
  const sections = enSections
    ? decouperEnSections(aAfficher, lang).map(sec => ({
        ...sec,
        // On ne réunit les expositions que dans le fil ordinaire : dès qu'on demande
        // explicitement la catégorie, on veut les voir une par une.
        items: filtreCatActif ? sec.items : reunirLesExpos(sec.items, !!exposDepliees[sec.cle]),
      }))
    : null;

  const rangeLabel = rangeStart
    ? rangeEnd && rangeEnd.toDateString() !== rangeStart.toDateString()
      ? `${rangeStart.getDate()} ${MOIS_NOM_COURT[rangeStart.getMonth()]} — ${rangeEnd.getDate()} ${MOIS_NOM_COURT[rangeEnd.getMonth()]}`
      : `${rangeStart.getDate()} ${MOIS_NOM_COURT[rangeStart.getMonth()]}`
    : null;

  // Le jour réellement consulté, quand le calendrier ne porte QU'UNE date.
  // Sert à corriger l'étiquette des fiches `ongoing`, qui portent toujours la date
  // du jour et affichaient « AUJOURD'HUI » même en consultant le 11 septembre.
  const jourConsulte =
    filter === "calendar" && rangeStart && (!rangeEnd || rangeEnd.toDateString() === rangeStart.toDateString())
      ? `${JOURS[rangeStart.getDay()]} ${rangeStart.getDate()} ${MOIS_NOM_COURT[rangeStart.getMonth()]}`
      : null;

  const hasFavs = favorites.length > 0;

  // ── BANDEAU « PARTAGE TON LIEN » ─────────────────────────────────────────────
  // Uniquement pour quelqu'un de CONNECTÉ dont le cercle est VIDE. Il s'éteint
  // tout seul à la première amie : pas de compteur, pas de délai, pas de « 3 fois
  // espacées de 7 jours ». Il s'arrête en réussissant, pas en lassant.
  //
  // Pourquoi il fallait le faire (PostHog, 17→22 août 2026) : la carte de partage
  // a été montrée 38 fois, dont 32 à des gens SANS COMPTE — elle demandait de
  // partager un lien à des gens qui n'en avaient pas encore. Zéro partage lancé.
  // ⚠️ `social.charge` est indispensable : sans lui, « aucune amie » est vrai pendant
  // le chargement et le bandeau clignote chez tout le monde (corrigé le 3 sept 2026).
  const cercleVide = loggedIn && social?.charge === true && Array.isArray(social.friends) && social.friends.length === 0;
  const conditionsReunies = authReady && cercleVide && !!inviteCode;

  // 🔒 UNE FOIS AFFICHÉ, IL RESTE. Stéphanie, 4 septembre 2026, après deux tentatives
  // de correction : « laisse-le, et les personnes le ferment en appuyant sur une croix
  // évidente ». Elle a raison : tant que l'affichage dépend d'un état qui peut changer
  // sous nos pieds (chargement de la base, rafraîchissement de session), il y aura
  // toujours une course pour le faire disparaître. On verrouille donc : dès que les
  // conditions sont réunies UNE fois, le bandeau reste jusqu'à la croix.
  const [bandeauAmisVerrouille, setBandeauAmisVerrouille] = useState(false);
  useEffect(() => {
    if (conditionsReunies) setBandeauAmisVerrouille(true);
  }, [conditionsReunies]);

  const montreBandeauAmis = (bandeauAmisVerrouille || conditionsReunies) && !bandeauAmisFerme;

  useEffect(() => {
    if (montreBandeauAmis) track("bandeau_amis_vu");
  }, [montreBandeauAmis]);

  return (
    <div style={{ background: WHITE, minHeight: "100%" }}>
      {/* Sticky header — z-index très élevé, toujours au-dessus des cartes */}
      <div style={{ position: "sticky", top: 0, zIndex: 999, background: WHITE, borderBottom: `1px solid ${BORDER}` }}>

        {/* Header — le logo rétrécit au scroll vers le bas, s'agrandit au scroll vers le haut.
            Les boutons (menu, loupe, fr/en, cœur) restent toujours visibles. */}
        <div style={{
          background: STRIPE_BG,
          padding: (filtersVisible || showSearch) ? "8px 12px" : "3px 12px",
          display: "flex", alignItems: "center", gap: 8,
          transition: "padding 0.22s ease",
        }}>
          {/* Gauche : menu + loupe + amis */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <button onClick={onOpenMenu} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <HamburgerIcon />
            </button>
            <button onClick={() => {
              setShowSearch(v => {
                if (v) setSearchQuery("");
                else setTimeout(() => searchInputRef.current?.focus(), 50);
                return !v;
              });
            }} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <SearchIcon active={showSearch} />
            </button>
            <button onClick={onNavFriends} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, position: "relative" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F1D3A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              {pendingFriends > 0 && (
                <span style={{
                  position: "absolute", top: 0, right: 0,
                  width: 8, height: 8, borderRadius: "50%",
                  background: "#C4A241", border: "1.5px solid #fff",
                }} />
              )}
            </button>
          </div>

          {/* Centre : logo — grand en haut, petit au scroll vers le bas */}
          <div style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
            maxHeight: (filtersVisible || showSearch) ? "46px" : "24px",
            overflow: "hidden", transition: "max-height 0.22s ease",
          }} onClick={handleLogoTap}>
            <div style={{
              transform: (filtersVisible || showSearch) ? "scale(1)" : "scale(0.6)",
              transformOrigin: "center", transition: "transform 0.22s ease",
            }}>
              <MonacOutLogo compact lang={lang} />
            </div>
          </div>

          {/* Droite : fr/en + cœur */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{ display: "flex", gap: 4 }}>
              {["fr","en"].map(l => (
                <button key={l} onClick={() => onLangChange?.(l)} style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontSize: 10, fontWeight: lang === l ? 700 : 400,
                  letterSpacing: 1, textTransform: "uppercase",
                  color: lang === l ? "#0F1D3A" : "#6A7080",
                  padding: "1px 3px",
                  borderBottom: lang === l ? "1.5px solid #C9A96E" : "1.5px solid transparent",
                }}>{l}</button>
              ))}
            </div>
            <button onClick={onNavAgenda} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <HeartIcon hasFavs={hasFavs} />
            </button>
          </div>
        </div>

        {/* Pendant le chargement de l'auth : on réserve la place du bandeau (invisible) → « Bonjour » apparaît sans faire sauter la mise en page */}
        {!authReady && (
          <div style={{
            background: WHITE, borderTop: `1px solid ${BORDER}`, textAlign: "center",
            padding: "5px 12px", fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, visibility: "hidden",
          }}>&nbsp;</div>
        )}

        {/* Salutation — « Bonjour, <prénom> » sous le logo quand connectée */}
        {userName && (
          <div style={{
            background: WHITE, borderTop: `1px solid ${BORDER}`,
            padding: "7px 12px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, letterSpacing: 0.5, color: NAVY,
          }}>
            {/* Photo de profil sur l'accueil, à gauche du bonjour. Carré 20 px pour ne
                pas alourdir l'en-tête. Se change depuis le menu. */}
            {avatarUrl && (
              <div style={{
                width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                background: `center/cover no-repeat url("${avatarUrl}")`,
                border: "1px solid rgba(196,162,65,0.6)",
              }} />
            )}
            <span>
              {lang === "en" ? "Hi, " : "Bonjour, "}
              <span style={{ color: "#C4A241", fontWeight: 600 }}>{userName}</span>
            </span>
          </div>
        )}

        {/* Barre « Inscris-toi » pleine largeur, bien en haut (en-tête fixe) — UNIQUEMENT si pas connectée (additif) */}
        {authReady && !loggedIn && onShowAuth && (
          <button onClick={onShowAuth} style={{
            display: "block", width: "100%", border: "none", cursor: "pointer",
            background: NAVY, color: "#fff",
            padding: "11px 16px", textAlign: "center",
            fontFamily: "'Josefin Sans', sans-serif", fontSize: 12.5, fontWeight: 600, letterSpacing: 0.8,
            borderTop: `1px solid ${BORDER}`,
          }}>
            {lang === "en"
              ? "✨ Sign up — find your friends & favourites ›"
              : "✨ Inscris-toi — retrouve tes amis & tes favoris ›"}
          </button>
        )}

        {/* Bandeau « Partage ton lien » — connectée, aucune amie. Le bouton ouvre la
            feuille de partage du téléphone : JAMAIS une page web (cf. écran noir du
            7 août). Une croix discrète le referme pour la visite en cours. */}
        {montreBandeauAmis && (
          <div style={{
            background: "#FFFDF7", borderTop: `1px solid ${GOLD}`, borderBottom: `1px solid ${GOLD}`,
            padding: "10px 14px", display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: "Georgia, 'Playfair Display', serif", fontWeight: 700,
                fontSize: 14, color: NAVY, lineHeight: 1.25,
              }}>
                {lang === "en"
                  ? "Monaco Together — share your link"
                  : "Monaco Ensemble — partage ton lien"}
              </div>
              <div style={{
                fontFamily: "'Lato', sans-serif", fontSize: 11, color: GREY,
                lineHeight: 1.35, marginTop: 2,
              }}>
                {lang === "en"
                  ? "You'll see where your friends go, and they'll see where you go."
                  : "Tu verras où sortent tes amis, eux où tu vas."}
              </div>
            </div>
            <button
              onClick={async () => {
                const r = await partagerInvitation(inviteCode, lang);
                track("bandeau_amis_partage", { resultat: r });
              }}
              style={{
                flexShrink: 0, background: NAVY, color: "#fff", border: "none", cursor: "pointer",
                fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, fontWeight: 600,
                letterSpacing: 1.4, textTransform: "uppercase",
                padding: "9px 13px", borderRadius: 3, whiteSpace: "nowrap",
              }}>
              {lang === "en" ? "Share" : "Partager"}
            </button>
            {/* Croix bien visible : c'est le SEUL moyen de faire partir le bandeau. */}
            <button onClick={() => { setBandeauAmisFerme(true); track("bandeau_amis_ferme"); }}
                    aria-label={lang === "en" ? "Close" : "Fermer"}
                    style={{
                      flexShrink: 0, cursor: "pointer",
                      width: 30, height: 30, borderRadius: "50%",
                      background: "#FFFFFF", border: `1px solid ${GOLD}`,
                      color: NAVY, fontSize: 16, lineHeight: 1, padding: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>✕</button>
          </div>
        )}

        {/* Barre de recherche */}
        <div style={{
          background: WHITE, borderTop: `1px solid ${BORDER}`,
          maxHeight: showSearch ? "52px" : "0px", overflow: "hidden", transition: "max-height 0.22s ease",
        }}>
          <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
            <SearchIcon active />
            <input
              ref={searchInputRef}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={lang === "en" ? "Search events…" : "Rechercher…"}
              style={{
                flex: 1, border: "none", outline: "none", background: "transparent",
                fontFamily: "'Jost', sans-serif", fontSize: 16, color: NAVY,
                letterSpacing: 0.2,
              }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 14, color: GREY, padding: 0, lineHeight: 1,
              }}>✕</button>
            )}
          </div>
        </div>

        {/* Filtres temps — disparaissent au scroll */}
        <div style={{
          background: WHITE, borderTop: `1px solid ${BORDER}`,
          maxHeight: filtersVisible ? "52px" : "0px", overflow: "hidden", transition: "max-height 0.22s ease",
        }}>
          <div style={{ display: "flex", gap: 6, padding: "8px 10px", justifyContent: "center" }}>
            {TIME_FILTERS.map(f => {
              const active = filter === f.id;
              const label = f.id === "calendar" && rangeStart ? rangeLabel : (t.filters[f.id] || f.label);
              return (
                <button key={f.id} onClick={() => handleFilterChange(f.id)} style={{
                  flexShrink: 0, padding: "7px 16px", borderRadius: 20,
                  border: `1.5px solid ${active ? NAVY : "rgba(15,29,58,0.2)"}`,
                  background: active ? NAVY : "#FFFFFF", color: active ? WHITE : GREY,
                  fontFamily: "'Jost', -apple-system, sans-serif", fontSize: 12, fontWeight: 600,
                  cursor: "pointer", whiteSpace: "nowrap", letterSpacing: 0.3,
                }}>{f.id === "calendar" ? (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={active ? "#FFFFFF" : GREY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                    {rangeStart && rangeLabel}
                  </span>
                ) : label}</button>
              );
            })}
          </div>
        </div>

        {/* Catégories groupées — disparaissent au scroll */}
        <div style={{
          background: WHITE, borderTop: `1px solid ${BORDER}`,
          maxHeight: filtersVisible ? "44px" : "0px", overflow: "hidden", transition: "max-height 0.22s ease",
        }}>
          {/* `touchAction: pan-x` : le conteneur parent verrouille le geste horizontal
              (l'app glissait de côté). Cette rangée-ci, elle, doit rester balayable
              latéralement — on lui rend explicitement le droit. */}
          <div style={{ display: "flex", gap: 5, justifyContent: "center", padding: "5px 8px 7px", overflowX: "auto", overscrollBehaviorX: "contain", touchAction: "pan-x", scrollbarWidth: "none" }}>
            {EVENT_GROUPS.map(g => {
              const active = groupFilter === g.id;
              return (
                <button key={g.id} onClick={() => { setGroupFilter(active ? null : g.id); const el = document.getElementById("main-scroll"); if (el) el.scrollTop = 0; }} style={{
                  flexShrink: 0, padding: "4px 10px", borderRadius: 20,
                  border: `1px solid ${active ? NAVY : "rgba(15,29,58,0.18)"}`,
                  background: active ? NAVY : "#FFFFFF", color: active ? WHITE : GREY,
                  fontFamily: "'Jost', sans-serif", fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", letterSpacing: 0.4,
                }}>{lang === "en" ? g.labelEn : g.label}</button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Calendrier inline */}
      {filter === "calendar" && (
        <CalendarPicker inline lang={lang} initialStart={rangeStart} initialEnd={rangeEnd}
          onChange={(s, e) => { setRangeStart(s || null); setRangeEnd(e || null); }} />
      )}

      {/* Liste — cartes qui s'empilent */}
      <div style={{ padding: "0 16px 20px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", fontFamily: "'Libre Baskerville', Georgia, serif", fontStyle: "italic", color: GREY, fontSize: 15 }}>
            {t.empty}
          </div>
        ) : (
          enSections ? sections.map((sec, i) => (
            <div key={sec.cle}>
              {/* Le jour une seule fois, puis les moments qui le découpent. */}
              {sec.jour && sec.jour !== sections[i - 1]?.jour && <IntertitreSection titre={sec.jour} />}
              {sec.jour
                ? <IntertitreMoment titre={sec.moment} />
                : <IntertitreSection titre={sec.moment} />}
              {sec.items.map(e => e.groupeExpos ? (
                <CarteGroupeExpos
                  key={`expos-${sec.cle}`}
                  expos={e.groupeExpos}
                  lang={lang}
                  deplie={!!exposDepliees[sec.cle]}
                  onOuvrir={() => setExposDepliees(d => ({ ...d, [sec.cle]: !d[sec.cle] }))}
                />
              ) : renduCarte(e, true))}
            </div>
          )) : aAfficher.map(e => renduCarte(e, false))
        )}
      </div>
    </div>
  );

  function renduCarte(e, sansDate) {
    return (
            <EventCard
              key={e.cleFil || e.id}
              event={e}
              sansDate={sansDate}
              jourAffiche={e.ongoing ? jourConsulte : null}
              favorites={favorites}
              onToggleFav={onToggleFav}
              onCategoryClick={(cat) => { const f = CAT_TO_FILTER[cat]; if (f) onCatFilter?.(f); }}
              onCardClick={onCardClick}
              lang={lang}
              onGoingClick={onGoingClick}
              isGoing={
                (social?.myParticipations?.includes(e.id) ?? false)
                // Une expo « en cours » : la coche n'appartient qu'au jour choisi.
                && (!e.ongoing
                    || (joursParticipation[e.id] ? joursParticipation[e.id] === e.date : !!e.premierJour))
              }
              // ⚠️ AUCUNE amie n'est affichée sur une fiche « en cours » dans le fil.
              // La table `participations` ne stocke QUE l'identifiant de l'événement,
              // sans date : impossible de savoir quel jour une amie y est allée. Les
              // afficher sur une occurrence, c'était affirmer un jour faux — Nadège
              // apparaissait sur « aujourd'hui » alors qu'elle y était allée la semaine
              // précédente. Elles restent visibles dans la fiche qu'on ouvre, là où
              // aucun jour n'est sous-entendu.
              // ➜ Pour les remettre au bon jour, il faut une colonne `jour` dans
              //    `participations` (voir le journal du 11 août 2026 dans CLAUDE.md).
              friendsGoing={social ? (e.ongoing ? [] : social.friendsGoingTo(e.id)) : []}
              loggedIn={loggedIn}
              onShowAuth={onShowAuth}
            />
    );
  }
}
