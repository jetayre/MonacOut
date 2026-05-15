import { useState } from "react";
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
  THÉÂTRE: "culture", "CONFÉRENCE": "culture", EXPOSITION: "culture", FESTIVAL: "culture",
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
    case "today": return events.filter(e => e.date === todayStr);
    case "weekend": return events.filter(e => weekendDates.includes(e.date));
    case "week": {
      const today = new Date(); today.setHours(0,0,0,0);
      const sun = new Date(today); sun.setDate(today.getDate() + (today.getDay() === 0 ? 0 : 7 - today.getDay()));
      return events.filter(e => { const d = parseEventDate(e); return d && d >= today && d <= sun; });
    }
    default: return events;
  }
}

function filterByCat(events, catId) {
  switch (catId) {
    case "sport":    return events.filter(e => ["FOOTBALL","BASKET","FORMULE 1","FORMULE E","SPORT","RALLYE","TENNIS"].includes(e.cat));
    case "culture":  return events.filter(e => ["MUSICAL","THÉÂTRE","CHANTS","CONFÉRENCE","EXPOSITION","OPÉRA","FESTIVAL","GALA","FÊTE NATIONALE","MARCHÉ","SALON","SPECTACLE","CINÉMA"].includes(e.cat));
    case "music":    return events.filter(e => ["CONCERT","CHANTS","MUSICAL","JAZZ LIVE","DJ SET","OPÉRA"].includes(e.cat));
    case "cinema":   return events.filter(e => e.cat === "CINÉMA");
    case "famille":  return events.filter(e => e.free === true);
    case "ateliers": return events.filter(e => ["ATELIER","DANSE"].includes(e.cat));
    case "bienetre": return events.filter(e => ["BIEN-ÊTRE"].includes(e.cat));
    case "foody":    return events.filter(e => ["FOODY","BRUNCH","APÉRO","SOIRÉE"].includes(e.cat));
    case "encheres": return events.filter(e => ["ENCHÈRES"].includes(e.cat));
    case "messe":    return events.filter(e => e.cat === "CHANTS");
    default: return events;
  }
}

export default function HomeScreen({ onSelectEvent, favorites, onToggleFav, onCategoryClick, filter = "all", onFilterChange, lang = "fr", setLang, catFilter, onCatFilter }) {
  const setFilter = onFilterChange || (() => {});
  const t = lang === "en"
    ? {
        tagline: "Monaco in your pocket",
        filters: { today: "Today", weekend: "Weekend", week: "This week", agenda: "Calendar" },
        empty: "No events for this period.",
      }
    : {
        tagline: "Monaco dans la poche",
        filters: { today: "Aujourd'hui", weekend: "Week-end", week: "Semaine", agenda: "Agenda" },
        empty: "Aucun événement pour cette période.",
      };
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);

  function handleFilterChange(newFilter) {
    if (newFilter !== "calendar") { setRangeStart(null); setRangeEnd(null); }
    setFilter(newFilter);
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
  } else if (filter === "calendar") {
    filtered = ALL_EVENTS;
  } else if (search.trim()) {
    const q = search.toLowerCase();
    filtered = ALL_EVENTS.filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.subtitle?.toLowerCase().includes(q) ||
      e.cat.toLowerCase().includes(q) ||
      e.desc?.toLowerCase().includes(q)
    );
  } else {
    filtered = filterByCat(filterByTime(ALL_EVENTS, filter), catFilter);
  }

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
        {/* Title frame */}
        <div style={{ background: WHITE, padding: "0 12px", position: "relative" }}>
          {/* Outer border — or */}
          <div style={{ border: `1.5px solid #B8962E`, padding: 1, position: "relative" }}>
            {/* Inner border — bleu nuit */}
            <div style={{ border: `2px solid ${NAVY}`, padding: "4px 10px 5px 2px", background: WHITE, position: "relative" }}>
              {/* Search icon inside frame top-right */}
              <button
                onClick={() => setShowSearch(s => !s)}
                style={{ position: "absolute", top: 4, right: 6, background: "none", border: "none", cursor: "pointer", fontSize: 14, padding: 2, opacity: 0.4 }}
              >🔍</button>
              {/* Flags left + logo centered row */}
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <div style={{ display: "flex", gap: 1, flexShrink: 0, paddingBottom: 2 }}>
                  <button
                    onClick={() => setLang?.("fr")}
                    style={{
                      background: lang === "fr" ? NAVY : "transparent",
                      border: `1.5px solid ${NAVY}`,
                      borderRadius: 6,
                      cursor: "pointer",
                      fontSize: 13,
                      padding: "3px 7px",
                      lineHeight: 1,
                      color: lang === "fr" ? "#fff" : NAVY,
                      fontFamily: "'Jost', sans-serif",
                      fontWeight: 700,
                      letterSpacing: 0.5,
                    }}
                  >FR</button>
                  <button
                    onClick={() => setLang?.("en")}
                    style={{
                      background: lang === "en" ? NAVY : "transparent",
                      border: `1.5px solid ${NAVY}`,
                      borderRadius: 6,
                      cursor: "pointer",
                      fontSize: 13,
                      padding: "3px 7px",
                      lineHeight: 1,
                      color: lang === "en" ? "#fff" : NAVY,
                      fontFamily: "'Jost', sans-serif",
                      fontWeight: 700,
                      letterSpacing: 0.5,
                    }}
                  >EN</button>
                </div>
                <div style={{ flex: 1 }}>
                  <MonacOutLogo width={250} />
                </div>
                <div style={{ width: 50, flexShrink: 0 }} />
              </div>
              <div style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: 17,
                color: "#B8962E",
                letterSpacing: 1,
                textAlign: "center",
                marginTop: -1,
              }}>{t.tagline}</div>
            </div>
          </div>
        </div>

        {/* Filters or Search */}
        {!showSearch && (
          <div style={{ background: WHITE, borderTop: `1px solid ${BORDER}` }}>
            <div style={{ display: "flex", gap: 6, padding: "8px 10px", overflowX: "auto", scrollbarWidth: "none", justifyContent: "center" }}>
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
                      background: active ? NAVY : WHITE,
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
              onClick={onSelectEvent}
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
