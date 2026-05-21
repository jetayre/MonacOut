import { useState, useEffect } from "react";
import { ALL_EVENTS } from "../../data/events";
import MonacOutLogo from "../MonacOutLogo";
import EventCard from "../EventCard";
import CalendarPicker from "../CalendarPicker";

const NAVY = "#0F1D3A";
const GOLD = "#C9A96E";
const GREY = "#6A7080";
const WHITE = "#FFFFFF";
const BORDER = "rgba(15,29,58,0.12)";

const CAT_TO_FILTER = {
  FOOTBALL: "sport", BASKET: "sport", "FORMULE 1": "sport", "FORMULE E": "sport",
  SPORT: "sport", RALLYE: "sport", TENNIS: "sport",
  CONCERT: "music", "OPÉRA": "music", MUSICAL: "music", "JAZZ LIVE": "music",
  "DJ SET": "music", CHANTS: "music",
  THÉÂTRE: "culture", "CONFÉRENCE": "conference", EXPOSITION: "culture", FESTIVAL: "culture",
  GALA: "culture", "FÊTE NATIONALE": "culture", MARCHÉ: "culture", SALON: "culture",
  SPECTACLE: "culture", CINÉMA: "cinema",
  ATELIER: "ateliers", DANSE: "ateliers",
  "BIEN-ÊTRE": "bienetre",
  BRUNCH: "foody", APÉRO: "foody", SOIRÉE: "foody", FOODY: "foody",
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
  if (isNaN(day) || month === undefined) return null;
  return new Date(e.year || 2026, month, day);
}

function filterByTime(events, filterId) {
  const todayStr = toFrDate(new Date()); const weekendDates = getWeekendDates();
  switch (filterId) {
    case "today": { const y = new Date().getFullYear(); return events.filter(e => e.date === todayStr && (e.year || 2026) === y); }
    case "weekend": { const y = new Date().getFullYear(); return events.filter(e => weekendDates.includes(e.date) && (e.year || 2026) === y); }
    case "week": {
      const today = new Date(); today.setHours(0,0,0,0);
      const in7 = new Date(today); in7.setDate(today.getDate() + 6);
      return events.filter(e => { const d = parseEventDate(e); return d && d >= today && d <= in7; });
    }
    default: return events;
  }
}

function matchesCatFilter(e, catId) {
  switch (catId) {
    case "sport":      return ["FOOTBALL","BASKET","FORMULE 1","FORMULE E","SPORT","RALLYE","TENNIS"].includes(e.cat);
    case "culture":    return ["MUSICAL","THÉÂTRE","CHANTS","EXPOSITION","OPÉRA","FESTIVAL","GALA","FÊTE NATIONALE","MARCHÉ","SALON","SPECTACLE","CINÉMA"].includes(e.cat);
    case "conference": return e.cat === "CONFÉRENCE" || e.cat === "SALON" || e.conf === true;
    case "music":      return ["CONCERT","CHANTS","MUSICAL","JAZZ LIVE","DJ SET","OPÉRA"].includes(e.cat);
    case "cinema":     return e.cat === "CINÉMA";
    case "famille":    return e.free === true || ["ATELIER","SPECTACLE","CINÉMA","MARCHÉ","FESTIVAL","EXPOSITION","DANSE"].includes(e.cat) || /enfant|famille|junior|jeune|parent|kid/i.test(e.subtitle + " " + (e.desc || ""));
    case "ateliers":   return ["ATELIER","DANSE"].includes(e.cat);
    case "bienetre":   return ["BIEN-ÊTRE"].includes(e.cat);
    case "foody":      return ["FOODY","BRUNCH","APÉRO","SOIRÉE"].includes(e.cat);
    case "encheres":   return ["ENCHÈRES"].includes(e.cat);
    case "messe":      return e.cat === "CHANTS";
    default: return false;
  }
}

function filterByCats(events, catFilters) {
  if (!catFilters || catFilters.length === 0) return events;
  return events.filter(e => catFilters.some(id => matchesCatFilter(e, id)));
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

export default function HomeScreen({ favorites = [], onToggleFav, onCategoryClick, filter = "all", onFilterChange, lang = "fr", catFilters = [], onCatFilter, onOpenMenu, onNavAgenda }) {
  const setFilter = onFilterChange || (() => {});
  const t = lang === "en"
    ? { tagline: "Monaco Secret", filters: { today: "Today", week: "This week", weekend: "Weekend", agenda: "Calendar" }, empty: "No events for this period." }
    : { tagline: "Monaco Secret", filters: { today: "Aujourd'hui", week: "Semaine", weekend: "Week-end", agenda: "Agenda" }, empty: "Aucun événement pour cette période." };

  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [quarterFilter, setQuarterFilter] = useState(null);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [logoCollapsed, setLogoCollapsed] = useState(false);

  useEffect(() => {
    const el = document.getElementById("main-scroll");
    if (!el) return;
    let lastY = 0;
    const handler = () => {
      const y = el.scrollTop;
      setLogoCollapsed(y > 60);
      if (y < 10) setFiltersVisible(true);
      else if (y > lastY + 6) setFiltersVisible(false);
      else if (y < lastY - 6) setFiltersVisible(true);
      lastY = y;
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  function handleFilterChange(newFilter) {
    const el = document.getElementById("main-scroll");
    if (filter === newFilter && newFilter !== "calendar") { setFilter("all"); if (el) el.scrollTop = 0; return; }
    if (newFilter !== "calendar") { setRangeStart(null); setRangeEnd(null); }
    setFilter(newFilter); setFiltersVisible(true);
    if (el) el.scrollTop = 0;
  }

  let filtered;
  if (filter === "calendar" && rangeStart) {
    const endBound = rangeEnd || rangeStart;
    filtered = filterByCats(ALL_EVENTS.filter(e => { const d = parseEventDate(e); return d && d >= rangeStart && d <= endBound; }), catFilters);
  } else if (filter === "calendar") {
    filtered = filterByCats(ALL_EVENTS, catFilters);
  } else {
    filtered = filterByCats(filterByTime(ALL_EVENTS, filter), catFilters);
  }
  if (quarterFilter) filtered = filtered.filter(e => e.quarter === quarterFilter);

  const rangeLabel = rangeStart
    ? rangeEnd && rangeEnd.toDateString() !== rangeStart.toDateString()
      ? `${rangeStart.getDate()} ${MOIS_NOM_COURT[rangeStart.getMonth()]} — ${rangeEnd.getDate()} ${MOIS_NOM_COURT[rangeEnd.getMonth()]}`
      : `${rangeStart.getDate()} ${MOIS_NOM_COURT[rangeStart.getMonth()]}`
    : null;

  const hasFavs = favorites.length > 0;

  return (
    <div style={{ background: WHITE, minHeight: "100%" }}>
      {/* Sticky header — z-index très élevé, toujours au-dessus des cartes */}
      <div style={{ position: "sticky", top: 0, zIndex: 999, background: WHITE, borderBottom: `1px solid ${BORDER}` }}>

        {/* Logo complet — sans cadre */}
        <div style={{ maxHeight: logoCollapsed ? 0 : 120, overflow: "hidden", transition: "max-height 0.3s ease" }}>
          <div style={{ background: WHITE, padding: "6px 14px 4px", position: "relative", display: "flex", alignItems: "center" }}>

            {/* ☰ gauche */}
            <button onClick={onOpenMenu} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, flexShrink: 0 }}>
              <HamburgerIcon />
            </button>

            {/* Logo centré */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 300, fontSize: 9, color: NAVY, letterSpacing: 3, textTransform: "uppercase", marginBottom: 2 }}>{t.tagline}</div>
              <MonacOutLogo width={240} />
            </div>

            {/* ❤️ droite */}
            <button onClick={onNavAgenda} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, flexShrink: 0 }}>
              <HeartIcon hasFavs={hasFavs} />
            </button>
          </div>
        </div>

        {/* Mini logo avec ☰ et ❤️ — apparaît au scroll */}
        <div style={{ maxHeight: logoCollapsed ? 38 : 0, overflow: "hidden", transition: "max-height 0.3s ease" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 14px" }}>
            <button onClick={onOpenMenu} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <HamburgerIcon />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
              <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 300, fontSize: 15, color: GOLD, letterSpacing: 2 }}>Monac</span>
              <span style={{ fontFamily: "'Great Vibes', cursive", fontWeight: 400, fontSize: 20, color: NAVY, lineHeight: 1 }}>Out</span>
            </div>
            <button onClick={onNavAgenda} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <HeartIcon hasFavs={hasFavs} />
            </button>
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
                  background: active ? NAVY : "#FDFAF5", color: active ? WHITE : GREY,
                  fontFamily: "'Jost', -apple-system, sans-serif", fontSize: 12, fontWeight: 600,
                  cursor: "pointer", whiteSpace: "nowrap", letterSpacing: 0.3,
                }}>{label}</button>
              );
            })}
          </div>
        </div>

        {/* Quartiers — disparaissent au scroll */}
        <div style={{
          background: WHITE, borderTop: `1px solid ${BORDER}`,
          maxHeight: filtersVisible ? "44px" : "0px", overflow: "hidden", transition: "max-height 0.22s ease",
        }}>
          <div style={{ display: "flex", gap: 4, padding: "5px 10px 7px", overflowX: "auto", scrollbarWidth: "none" }}>
            {["Monte-Carlo","Monaco-Ville","Fontvieille","La Condamine","Larvotto"].map(q => {
              const active = quarterFilter === q;
              return (
                <button key={q} onClick={() => { setQuarterFilter(active ? null : q); const el = document.getElementById("main-scroll"); if (el) el.scrollTop = 0; }} style={{
                  flexShrink: 0, padding: "3px 8px", borderRadius: 20,
                  border: `1px solid ${active ? NAVY : "rgba(15,29,58,0.18)"}`,
                  background: active ? NAVY : "#FDFAF5", color: active ? WHITE : GREY,
                  fontFamily: "'Jost', sans-serif", fontSize: 9, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", letterSpacing: 0.4,
                }}>{q}</button>
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
          filtered.map((e, i) => (
            <div key={e.id} style={{ position: "sticky", top: 0, zIndex: i + 1 }}>
              <EventCard
                event={e}
                favorites={favorites}
                onToggleFav={onToggleFav}
                onCategoryClick={(cat) => { const f = CAT_TO_FILTER[cat]; if (f) onCatFilter?.(f); }}
                lang={lang}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
