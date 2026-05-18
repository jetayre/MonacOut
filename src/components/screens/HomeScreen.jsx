import { useState, useEffect } from "react";
import { ALL_EVENTS } from "../../data/events";
import MonacOutLogo from "../MonacOutLogo";
import EventCard from "../EventCard";
import CalendarPicker from "../CalendarPicker";

const NAVY = "#0F1D3A";
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

function toFrDate(d) {
  return `${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]}`;
}

function getWeekendDates() {
  const today = new Date();
  const day = today.getDay();
  const daysToSat = day === 0 ? 6 : day === 6 ? 0 : 6 - day;
  const daysToSun = day === 0 ? 0 : 7 - day;
  const sat = new Date(today); sat.setDate(today.getDate() + daysToSat);
  const sun = new Date(today); sun.setDate(today.getDate() + daysToSun);
  return [toFrDate(sat), toFrDate(sun)];
}

function parseEventDate(e) {
  const parts = e.date.trim().split(" ");
  const day = parseInt(parts[1]);
  const month = MOIS_IDX[parts[2]];
  if (isNaN(day) || month === undefined) return null;
  return new Date(e.year || 2026, month, day);
}

function filterByTime(events, filterId) {
  const todayStr = toFrDate(new Date());
  const weekendDates = getWeekendDates();
  switch (filterId) {
    case "today": {
      const thisYear = new Date().getFullYear();
      return events.filter(e => e.date === todayStr && (e.year || 2026) === thisYear);
    }
    case "weekend": {
      const thisYear = new Date().getFullYear();
      return events.filter(e => weekendDates.includes(e.date) && (e.year || 2026) === thisYear);
    }
    case "week": {
      const today = new Date(); today.setHours(0,0,0,0);
      const in7 = new Date(today); in7.setDate(today.getDate() + 6);
      return events.filter(e => { const d = parseEventDate(e); return d && d >= today && d <= in7; });
    }
    default: return events;
  }
}

function filterByCat(events, catId) {
  switch (catId) {
    case "sport":    return events.filter(e => ["FOOTBALL","BASKET","FORMULE 1","FORMULE E","SPORT","RALLYE","TENNIS"].includes(e.cat));
    case "culture":     return events.filter(e => ["MUSICAL","THÉÂTRE","CHANTS","EXPOSITION","OPÉRA","FESTIVAL","GALA","FÊTE NATIONALE","MARCHÉ","SALON","SPECTACLE","CINÉMA"].includes(e.cat));
    case "conference":  return events.filter(e => e.cat === "CONFÉRENCE" || e.cat === "SALON" || e.conf === true);
    case "music":       return events.filter(e => ["CONCERT","CHANTS","MUSICAL","JAZZ LIVE","DJ SET","OPÉRA"].includes(e.cat));
    case "cinema":      return events.filter(e => e.cat === "CINÉMA");
    case "famille":  return events.filter(e =>
      e.free === true ||
      ["ATELIER","SPECTACLE","CINÉMA","MARCHÉ","FESTIVAL","EXPOSITION","DANSE"].includes(e.cat) ||
      /enfant|famille|junior|jeune|parent|kid/i.test(e.subtitle + " " + (e.desc || ""))
    );
    case "ateliers": return events.filter(e => ["ATELIER","DANSE"].includes(e.cat));
    case "bienetre": return events.filter(e => ["BIEN-ÊTRE"].includes(e.cat));
    case "foody":    return events.filter(e => ["FOODY","BRUNCH","APÉRO","SOIRÉE"].includes(e.cat));
    case "encheres": return events.filter(e => ["ENCHÈRES"].includes(e.cat));
    case "messe":    return events.filter(e => e.cat === "CHANTS");
    default: return events;
  }
}

export default function HomeScreen({ favorites, onToggleFav, onCategoryClick, filter = "all", onFilterChange, lang = "fr", catFilter, onCatFilter, showSearch: showSearchProp, setShowSearch: setShowSearchProp }) {
  const setFilter = onFilterChange || (() => {});
  const t = lang === "en"
    ? {
        tagline: "Monaco Secret",
        filters: { today: "Today", week: "This week", weekend: "Weekend", agenda: "Calendar" },
        empty: "No events for this period.",
      }
    : {
        tagline: "Monaco Secret",
        filters: { today: "Aujourd'hui", week: "Semaine", weekend: "Week-end", agenda: "Agenda" },
        empty: "Aucun événement pour cette période.",
      };
  const [search, setSearch] = useState("");
  const showSearch = showSearchProp ?? false;
  const setShowSearch = setShowSearchProp ?? (() => {});
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [quarterFilter, setQuarterFilter] = useState(null);
  const [filtersVisible, setFiltersVisible] = useState(true);

  useEffect(() => {
    const el = document.getElementById("main-scroll");
    if (!el) return;
    let lastY = 0;
    const handler = () => {
      const y = el.scrollTop;
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
    if (filter === newFilter && newFilter !== "calendar") {
      setFilter("all");
      if (el) el.scrollTop = 0;
      return;
    }
    if (newFilter !== "calendar") { setRangeStart(null); setRangeEnd(null); }
    setFilter(newFilter);
    setFiltersVisible(true);
    if (el) el.scrollTop = 0;
  }

  function handleCalendarChange(start, end) {
    setRangeStart(start || null);
    setRangeEnd(end || null);
    if (start) setSearch("");
  }

  let filtered;
  if (filter === "calendar" && rangeStart) {
    const endBound = rangeEnd || rangeStart;
    filtered = ALL_EVENTS.filter(e => {
      const d = parseEventDate(e);
      if (!d) return false;
      return d >= rangeStart && d <= endBound;
    });
    if (catFilter) filtered = filterByCat(filtered, catFilter);
  } else if (filter === "calendar") {
    filtered = catFilter ? filterByCat(ALL_EVENTS, catFilter) : ALL_EVENTS;
  } else if (search.trim()) {
    const norm = s => s.toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/['’‘“”]/g, " ")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ").trim();
    const words = norm(search).split(" ").filter(w => w.length > 0);
    filtered = ALL_EVENTS.filter(e => {
      const text = norm([e.title, e.subtitle, e.cat, e.desc].filter(Boolean).join(" "));
      return words.every(w => text.includes(w));
    });
  } else {
    filtered = filterByCat(filterByTime(ALL_EVENTS, filter), catFilter);
  }

  if (quarterFilter) filtered = filtered.filter(e => e.quarter === quarterFilter);

  const rangeLabel = rangeStart
    ? rangeEnd && rangeEnd.toDateString() !== rangeStart.toDateString()
      ? `${rangeStart.getDate()} ${MOIS_NOM_COURT[rangeStart.getMonth()]} — ${rangeEnd.getDate()} ${MOIS_NOM_COURT[rangeEnd.getMonth()]}`
      : `${rangeStart.getDate()} ${MOIS_NOM_COURT[rangeStart.getMonth()]}`
    : null;

  return (
    <div style={{ background: WHITE, minHeight: "100%" }}>
      {/* Sticky header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: WHITE, borderBottom: `1px solid ${BORDER}`,
      }}>
        {/* Title section — cadre bicolore or + navy */}
        <div style={{ background: WHITE, padding: "4px 10px 4px" }}>
          <div style={{ border: `1.5px solid #C9A96E`, padding: "2px", position: "relative" }}>
            {/* Coins ornementaux */}
            {[{top:3,left:4},{top:3,right:4},{bottom:3,left:4},{bottom:3,right:4}].map((pos,i) => (
              <span key={i} style={{ position:"absolute", color:"#C9A96E", fontSize:11, lineHeight:1, ...pos }}>✦</span>
            ))}
            <div style={{
              border: `2px solid ${NAVY}`, background: WHITE,
              display: "flex", flexDirection: "column",
              alignItems: "center",
              padding: "4px 10px 4px",
            }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: "normal", fontWeight: 600, fontSize: 12,
                color: NAVY, letterSpacing: 2, lineHeight: 1, marginTop: 8, marginBottom: 0,
                textTransform: "uppercase",
              }}>{t.tagline}</div>
              <MonacOutLogo width={190} />
              <div style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontStyle: "normal", fontWeight: 600, fontSize: 12,
                color: NAVY, letterSpacing: 2, lineHeight: 1, marginTop: 3,
                textTransform: "uppercase",
              }}>Monaco Lifestyle &amp; Events Agenda</div>
            </div>
          </div>
        </div>

        {/* Filtres temps — toujours visibles */}
        {!showSearch && (
          <div style={{
            background: WHITE, borderTop: `1px solid ${BORDER}`,
          }}>
            <div style={{ display: "flex", gap: 6, padding: "8px 10px", justifyContent: "center" }}>
              {TIME_FILTERS.map(f => {
                const active = filter === f.id;
                const label = f.id === "calendar" && rangeStart ? rangeLabel : (t.filters[f.id] || f.label);
                return (
                  <button
                    key={f.id}
                    onClick={() => handleFilterChange(f.id)}
                    style={{
                      flexShrink: 0,
                      padding: "7px 16px",
                      borderRadius: 20,
                      border: `1.5px solid ${active ? NAVY : "rgba(15,29,58,0.2)"}`,
                      background: active ? NAVY : "#FDFAF5",
                      color: active ? WHITE : GREY,
                      fontFamily: "'Jost', -apple-system, sans-serif",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      letterSpacing: 0.3,
                    }}
                  >{label}</button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quartiers + Gratuit — disparaissent au scroll vers le bas */}
        {!showSearch && (
          <div style={{
            background: WHITE, borderTop: `1px solid ${BORDER}`,
            maxHeight: filtersVisible ? "44px" : "0px",
            overflow: "hidden",
            transition: "max-height 0.22s ease",
          }}>
            <div style={{ display: "flex", gap: 4, padding: "5px 10px 7px", overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }}>
              {["Monte-Carlo","Monaco-Ville","Fontvieille","La Condamine","Larvotto"].map(q => {
                const active = quarterFilter === q;
                return (
                  <button key={q} onClick={() => { setQuarterFilter(active ? null : q); const el = document.getElementById("main-scroll"); if (el) el.scrollTop = 0; }} style={{
                    flexShrink: 0, padding: "3px 8px", borderRadius: 20,
                    border: `1px solid ${active ? NAVY : "rgba(15,29,58,0.18)"}`,
                    background: active ? NAVY : "#FDFAF5", color: active ? WHITE : GREY,
                    fontFamily: "'Jost', -apple-system, sans-serif", fontSize: 9,
                    fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", letterSpacing: 0.4,
                  }}>{q}</button>
                );
              })}
            </div>
          </div>
        )}

        {showSearch && (
          <div style={{ padding: "6px 16px 10px", background: WHITE, display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", flex: 1, border: `1.5px solid ${NAVY}`, borderRadius: 24, padding: "7px 14px", gap: 8, background: WHITE }}>
              <span style={{ fontSize: 13, opacity: 0.4 }}>🔍</span>
              <input
                autoFocus
                type="text"
                placeholder={lang === "en" ? "Search..." : "Rechercher..."}
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ border: "none", outline: "none", flex: 1, fontFamily: "'Jost', -apple-system, sans-serif", fontSize: 13, color: NAVY, background: "transparent" }}
              />
            </div>
            <button onClick={() => { setShowSearch(false); setSearch(""); }} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "'Jost', -apple-system, sans-serif", fontSize: 12, fontWeight: 600, color: GREY }}>{lang === "en" ? "Cancel" : "Annuler"}</button>
          </div>
        )}

      </div>

      {/* Inline calendar panel */}
      {filter === "calendar" && (
        <CalendarPicker inline lang={lang} initialStart={rangeStart} initialEnd={rangeEnd} onChange={handleCalendarChange} />
      )}

      {/* Event list */}
      <div style={{ padding: "0 16px 20px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", fontFamily: "'Libre Baskerville', Georgia, serif", fontStyle: "italic", color: GREY, fontSize: 15 }}>
            {t.empty}
          </div>
        ) : (
          filtered.map(e => (
            <EventCard
              key={e.id}
              event={e}
              favorites={favorites}
              onToggleFav={onToggleFav}
              onCategoryClick={(cat) => {
                const filterId = CAT_TO_FILTER[cat];
                if (filterId) onCatFilter?.(catFilter === filterId ? null : filterId);
              }}
              lang={lang}
            />
          ))
        )}
      </div>
    </div>
  );
}
