import { useState } from "react";
import { ALL_EVENTS } from "../../data/events";
import EventCard from "../EventCard";

const GOLD = "#B8966E";
const GOLD2 = "#D4B896";
const DARK = "#1C1612";
const GREY = "#6A635A";
const LIGHT = "#F8F4EF";
const BORDER = "#E8E0D4";
const WHITE = "#FFFFFF";

const FILTERS = [
  { id: "all", label: "Tout" },
  { id: "today", label: "Aujourd'hui" },
  { id: "weekend", label: "Week-end" },
  { id: "sport", label: "⚽ Sport" },
  { id: "culture", label: "🎭 Culture" },
  { id: "music", label: "🎵 Musique" },
  { id: "cinema", label: "🎬 Cinéma" },
  { id: "famille", label: "👨‍👩‍👧 Famille" },
  { id: "ateliers", label: "🎨 Ateliers" },
  { id: "bienetre", label: "🧘 Bien-être" },
];

const JOURS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MOIS = ["jan", "fév", "mar", "avr", "mai", "juin", "juil", "août", "sep", "oct", "nov", "déc"];

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

function filterEvents(events, filterId) {
  const todayStr = toFrDate(new Date());
  const weekendDates = getWeekendDates();
  switch (filterId) {
    case "today": return events.filter(e => e.date === todayStr);
    case "weekend": return events.filter(e => weekendDates.includes(e.date));
    case "sport": return events.filter(e => ["FOOTBALL","BASKET","FORMULE 1","FORMULE E","SPORT","RALLYE","TENNIS"].includes(e.cat));
    case "culture": return events.filter(e => ["MUSICAL","CHANTS","CONFÉRENCE","EXPOSITION","OPÉRA","FESTIVAL","GALA","FÊTE NATIONALE","MARCHÉ","SALON","SPECTACLE"].includes(e.cat));
    case "music": return events.filter(e => ["CONCERT","CHANTS","MUSICAL","JAZZ LIVE","DJ SET","OPÉRA"].includes(e.cat));
    case "cinema": return events.filter(e => e.cat === "CINÉMA");
    case "famille": return events.filter(e => e.free === true);
    case "ateliers": return events.filter(e => ["ATELIER","DANSE"].includes(e.cat));
    case "bienetre": return events.filter(e => ["BIEN-ÊTRE"].includes(e.cat));
    default: return events;
  }
}

export default function HomeScreen({ onSelectEvent, favorites, onToggleFav, onCategoryClick, filter = "all", onFilterChange }) {
  const setFilter = onFilterChange || (() => {});
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const baseFiltered = filterEvents(ALL_EVENTS, filter);
  const filtered = search.trim()
    ? ALL_EVENTS.filter(e => {
        const q = search.toLowerCase();
        return e.title.toLowerCase().includes(q)
          || e.subtitle?.toLowerCase().includes(q)
          || e.cat.toLowerCase().includes(q)
          || e.desc?.toLowerCase().includes(q);
      })
    : baseFiltered;

  return (
    <div style={{ background: LIGHT, minHeight: "100%" }}>
      {/* Sticky header */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: WHITE,
        borderBottom: `1px solid ${BORDER}`,
      }}>
      {/* Title frame */}
      <div style={{
        background: WHITE,
        padding: "4px 20px 8px",
        display: "flex",
        justifyContent: "center",
        position: "relative",
      }}>
        {/* Loupe */}
        <button
          onClick={() => setShowSearch(s => !s)}
          style={{
            position: "absolute",
            right: 24,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 16,
            padding: 4,
            zIndex: 1,
          }}
        >🔍</button>
        <div style={{
          border: `1.5px solid ${GOLD}`,
          borderRadius: 2,
          padding: 4,
          display: "inline-block",
          width: "calc(100% - 40px)",
        }}>
          <div style={{
            border: `1px solid ${GOLD}`,
            borderRadius: 1,
            padding: "10px 24px",
            textAlign: "center",
            background: WHITE,
            position: "relative",
          }}>
            <div style={{
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              fontWeight: "bold",
              fontSize: 38,
              color: "#1A2A4A",
              letterSpacing: 1,
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}>MonacOut</div>
            <div style={{
              width: 36,
              height: 1.5,
              background: GOLD,
              margin: "10px auto 6px",
            }} />
            <div style={{
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              fontSize: 17,
              color: GOLD,
              letterSpacing: 0.5,
              marginBottom: 6,
            }}>Monaco dans votre poche</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      {!showSearch && (
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 6,
          padding: "6px 16px 10px",
          background: WHITE,
        }}>
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                flexShrink: 0,
                padding: "5px 11px",
                borderRadius: 20,
                border: `1.5px solid ${filter === f.id ? GOLD : BORDER}`,
                background: filter === f.id ? GOLD : WHITE,
                color: filter === f.id ? WHITE : GREY,
                fontFamily: "-apple-system, sans-serif",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >{f.label}</button>
          ))}
        </div>
      )}

      {/* Search input — visible only when loupe clicked */}
      {showSearch && (
        <div style={{ padding: "6px 16px 10px", background: WHITE, display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            border: `1.5px solid ${GOLD}`,
            borderRadius: 24,
            padding: "7px 14px",
            gap: 8,
            background: WHITE,
          }}>
            <span style={{ fontSize: 13, opacity: 0.5 }}>🔍</span>
            <input
              autoFocus
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                border: "none", outline: "none", flex: 1,
                fontFamily: "-apple-system, sans-serif",
                fontSize: 13, color: DARK, background: "transparent",
              }}
            />
          </div>
          <button
            onClick={() => { setShowSearch(false); setSearch(""); }}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "-apple-system, sans-serif",
              fontSize: 12, fontWeight: 600, color: GREY,
            }}
          >Annuler</button>
        </div>
      )}
      </div>{/* end sticky header */}

      {/* Event list */}
      <div style={{ padding: "0 16px 20px" }}>
        {filtered.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "40px 20px",
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            color: GREY,
            fontSize: 15,
          }}>Aucun événement pour ce filtre.</div>
        ) : (
          filtered.map(e => (
            <EventCard
              key={e.id}
              event={e}
              onClick={onSelectEvent}
              favorites={favorites}
              onToggleFav={onToggleFav}
              onCategoryClick={onCategoryClick}
            />
          ))
        )}
      </div>
    </div>
  );
}
