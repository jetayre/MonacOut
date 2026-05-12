import { useState } from "react";
import { ALL_EVENTS } from "../../data/events";
import EventCard from "../EventCard";
import CalendarPicker from "../CalendarPicker";

const NAVY = "#1A2A5A";
const GOLD = "#B8966E";
const DARK = "#1A2A5A";
const GREY = "#6A7A9A";
const LIGHT = "#F5F5FA";
const BORDER = "#DDE0F0";
const WHITE = "#FFFFFF";

const TIME_FILTERS = [
  { id: "all",     label: "Tout" },
  { id: "today",   label: "Aujourd'hui" },
  { id: "weekend", label: "Week-end" },
  { id: "week",    label: "Semaine" },
];
const CAT_FILTERS = [
  { id: "sport",    label: "⚽ Sport" },
  { id: "culture",  label: "🎭 Culture" },
  { id: "cinema",   label: "🎬 Cinéma" },
  { id: "music",    label: "🎵 Musique" },
  { id: "famille",  label: "👨‍👩‍👧 Famille" },
  { id: "foody",    label: "🍽️ Foody" },
  { id: "bienetre", label: "🧘 Bien-être" },
  { id: "encheres", label: "🔨 Enchères" },
  { id: "ateliers", label: "🎨 Ateliers" },
  { id: "gratuit",  label: "🆓 Gratuit" },
];

const JOURS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MOIS = ["jan", "fév", "mar", "avr", "mai", "juin", "juil", "août", "sep", "oct", "nov", "déc"];
const MOIS_IDX = { jan:0, fév:1, mar:2, avr:3, mai:4, juin:5, juil:6, août:7, sep:8, oct:9, nov:10, déc:11 };
const MOIS_NOM_COURT = ["jan","fév","mar","avr","mai","juin","juil","août","sep","oct","nov","déc"];
const JOURS_FULL = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
const MOIS_FULL  = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

function getTodayLabel() {
  const d = new Date();
  return `${JOURS_FULL[d.getDay()]} ${d.getDate()} ${MOIS_FULL[d.getMonth()]} ${d.getFullYear()}`;
}

function getWeekCount() {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const sun = new Date(today); sun.setDate(today.getDate() + (today.getDay() === 0 ? 0 : 7 - today.getDay()));
  return ALL_EVENTS.filter(e => { const d = parseEventDate(e); return d && d >= today && d <= sun; }).length;
}

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
    case "sport": return events.filter(e => ["FOOTBALL","BASKET","FORMULE 1","FORMULE E","SPORT","RALLYE","TENNIS"].includes(e.cat));
    case "culture": return events.filter(e => ["MUSICAL","THÉÂTRE","CHANTS","CONFÉRENCE","EXPOSITION","OPÉRA","FESTIVAL","GALA","FÊTE NATIONALE","MARCHÉ","SALON","SPECTACLE","CINÉMA"].includes(e.cat));
    case "music": return events.filter(e => ["CONCERT","CHANTS","MUSICAL","JAZZ LIVE","DJ SET","OPÉRA"].includes(e.cat));
    case "cinema": return events.filter(e => e.cat === "CINÉMA");
    case "famille": return events.filter(e => e.free === true);
    case "ateliers": return events.filter(e => ["ATELIER","DANSE"].includes(e.cat));
    case "bienetre": return events.filter(e => ["BIEN-ÊTRE"].includes(e.cat));
    case "foody": return events.filter(e => ["FOODY","BRUNCH","APÉRO","SOIRÉE"].includes(e.cat));
    case "encheres": return events.filter(e => ["ENCHÈRES"].includes(e.cat));
    case "gratuit": return events.filter(e => e.free === true);
    default: return events;
  }
}

export default function HomeScreen({ onSelectEvent, favorites, onToggleFav, onCategoryClick, filter = "all", onFilterChange, lang = "fr", setLang }) {
  const setFilter = onFilterChange || (() => {});
  const t = lang === "en"
    ? {
        tagline: "Monaco in your pocket",
        filters: { all: "All", today: "Today", weekend: "Weekend", week: "This week", sport: "⚽ Sport", culture: "🎭 Culture", music: "🎵 Music", cinema: "🎬 Cinema", famille: "👨‍👩‍👧 Family", ateliers: "🎨 Workshops", bienetre: "🧘 Wellness", foody: "🍽️ Foody", encheres: "🔨 Auctions", gratuit: "🆓 Free", agenda: "Calendar" },
        empty: "No events for this period.",
      }
    : {
        tagline: "Monaco dans la poche",
        filters: { all: "Tout", today: "Aujourd'hui", weekend: "Week-end", week: "Semaine", sport: "⚽ Sport", culture: "🎭 Culture", music: "🎵 Musique", cinema: "🎬 Cinéma", famille: "👨‍👩‍👧 Famille", ateliers: "🎨 Ateliers", bienetre: "🧘 Bien-être", foody: "🍽️ Foody", encheres: "🔨 Enchères", gratuit: "🆓 Gratuit", agenda: "Agenda" },
        empty: "Aucun événement pour cette période.",
      };
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [catFilter, setCatFilter] = useState(null);

  function handleCalendarChange(start, end) {
    setRangeStart(start || null);
    setRangeEnd(end || null);
    if (start) setSearch("");
  }

  function clearRange() {
    setRangeStart(null);
    setRangeEnd(null);
  }

  // Determine filtered events
  let filtered;
  if (rangeStart) {
    const endBound = rangeEnd || rangeStart;
    filtered = ALL_EVENTS.filter(e => {
      const d = parseEventDate(e);
      if (!d) return false;
      return d >= rangeStart && d <= endBound;
    });
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
    <div style={{ background: LIGHT, minHeight: "100%" }}>
      {/* Sticky header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: WHITE, borderBottom: `1px solid ${BORDER}`,
      }}>
        {/* Title frame — tableau double-border, full width */}
        <div style={{
          background: WHITE, padding: "3px 16px 0",
          position: "relative",
        }}>
          {/* Language toggle — inside frame top left */}
          <div style={{ position: "absolute", left: 18, top: 18, display: "flex", gap: 4, zIndex: 2 }}>
            <button
              onClick={() => setLang?.("fr")}
              style={{ background: "none", border: lang === "fr" ? `1.5px solid ${NAVY}` : "1.5px solid transparent", borderRadius: 6, cursor: "pointer", fontSize: 16, padding: "1px 3px", lineHeight: 1, opacity: lang === "fr" ? 1 : 0.4 }}
            >🇫🇷</button>
            <button
              onClick={() => setLang?.("en")}
              style={{ background: "none", border: lang === "en" ? `1.5px solid ${NAVY}` : "1.5px solid transparent", borderRadius: 6, cursor: "pointer", fontSize: 16, padding: "1px 3px", lineHeight: 1, opacity: lang === "en" ? 1 : 0.4 }}
            >🇬🇧</button>
          </div>
          {/* Search — inside frame top right */}
          <button
            onClick={() => setShowSearch(s => !s)}
            style={{ position: "absolute", right: 18, top: 18, background: "none", border: "none", cursor: "pointer", fontSize: 15, padding: 4, zIndex: 2 }}
          >🔍</button>
          {/* Outer border — cadre marine */}
          <div style={{ border: `1.5px solid ${NAVY}`, padding: 1 }}>
            {/* Inner border */}
            <div style={{ border: `2px solid ${NAVY}`, padding: "4px 12px 5px", textAlign: "center", background: WHITE }}>
              <div style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontWeight: 700,
                fontSize: 34,
                color: NAVY,
                letterSpacing: 3,
                textTransform: "uppercase",
                lineHeight: 1,
              }}>MonacOut</div>
              <div style={{
                fontFamily: "Georgia, serif",
                fontStyle: "normal",
                fontSize: 13,
                color: NAVY,
                letterSpacing: 1,
                marginTop: 2,
              }}>{t.tagline}</div>
            </div>
          </div>
        </div>

        {/* Filters or Search */}
        {!showSearch && (
          <div style={{ background: WHITE, borderTop: `1px solid ${BORDER}` }}>
            {/* Time filter row */}
            <div style={{ display: "flex", gap: 5, padding: "7px 10px 4px" }}>
              {TIME_FILTERS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  style={{
                    flexShrink: 0,
                    padding: "5px 12px",
                    borderRadius: 20,
                    border: `1.5px solid ${filter === f.id ? GOLD : "rgba(184,150,110,0.4)"}`,
                    background: filter === f.id ? GOLD : WHITE,
                    color: filter === f.id ? WHITE : GREY,
                    fontFamily: "-apple-system, sans-serif",
                    fontSize: 10,
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >{t.filters[f.id] || f.label}</button>
              ))}
            </div>
            {/* Category filter grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 2, padding: "1px 10px 5px" }}>
              {CAT_FILTERS.map(f => (
                <button
                  key={f.id}
                  onClick={() => {
                const next = catFilter === f.id ? null : f.id;
                setCatFilter(next);
                if (next) setFilter("all");
              }}
                  style={{
                    padding: "2px 0px",
                    borderRadius: 20,
                    border: `1px solid ${catFilter === f.id ? NAVY : "rgba(184,150,110,0.4)"}`,
                    background: catFilter === f.id ? NAVY : WHITE,
                    color: catFilter === f.id ? WHITE : GREY,
                    fontFamily: "-apple-system, sans-serif",
                    fontSize: 8,
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "normal",
                    textAlign: "center",
                    lineHeight: 1.15,
                  }}
                >{t.filters[f.id] || f.label}</button>
              ))}
            </div>
          </div>
        )}

        {showSearch && (
          <div style={{ padding: "6px 16px 10px", background: WHITE, display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", flex: 1, border: `1.5px solid ${NAVY}`, borderRadius: 24, padding: "7px 14px", gap: 8, background: WHITE }}>
              <span style={{ fontSize: 13, opacity: 0.5 }}>🔍</span>
              <input
                autoFocus
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ border: "none", outline: "none", flex: 1, fontFamily: "-apple-system, sans-serif", fontSize: 13, color: DARK, background: "transparent" }}
              />
            </div>
            <button onClick={() => { setShowSearch(false); setSearch(""); }} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "-apple-system, sans-serif", fontSize: 12, fontWeight: 600, color: GREY }}>Annuler</button>
          </div>
        )}
      </div>

      {/* Inline calendar panel */}
      {showCalendar && (
        <CalendarPicker
          inline
          lang={lang}
          initialStart={rangeStart}
          initialEnd={rangeEnd}
          onChange={handleCalendarChange}
        />
      )}

      {/* Event list */}
      <div style={{ padding: "0 16px 20px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", fontFamily: "Georgia, serif", fontStyle: "italic", color: GREY, fontSize: 15 }}>
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
              onCategoryClick={(catId) => setCatFilter(c => c === catId ? null : catId)}
              lang={lang}
            />
          ))
        )}
      </div>
    </div>
  );
}
