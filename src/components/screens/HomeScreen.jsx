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
];

function filterEvents(events, filterId) {
  switch (filterId) {
    case "today": return events.filter(e => e.date === "Dim 10 mai");
    case "weekend": return events.filter(e => e.date === "Dim 10 mai" || e.date === "Sam 16 mai");
    case "sport": return events.filter(e => ["FOOTBALL","BASKET","FORMULE 1","SPORT","RALLYE","TENNIS"].includes(e.cat));
    case "culture": return events.filter(e => ["MUSICAL","CHANTS","CONFÉRENCE","EXPOSITION","OPÉRA","FESTIVAL","GALA","FÊTE NATIONALE","MARCHÉ","SALON","SPECTACLE"].includes(e.cat));
    case "music": return events.filter(e => ["CONCERT","CHANTS","MUSICAL","JAZZ LIVE","DJ SET","OPÉRA"].includes(e.cat));
    case "cinema": return events.filter(e => e.cat === "CINÉMA");
    case "famille": return events.filter(e => e.free === true);
    default: return events;
  }
}

export default function HomeScreen({ onSelectEvent, favorites, onToggleFav, onCategoryClick, filter = "all", onFilterChange }) {
  const setFilter = onFilterChange || (() => {});

  const filtered = filterEvents(ALL_EVENTS, filter);
  const hot = ALL_EVENTS.filter(e => e.hot && e.date === "Dim 10 mai").slice(0, 3);

  return (
    <div style={{ background: LIGHT, minHeight: "100%" }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(160deg, ${DARK} 0%, #2C2018 100%)`,
        padding: "24px 20px 20px",
      }}>
        <div style={{
          fontFamily: "-apple-system, sans-serif",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: GOLD2,
          marginBottom: 4,
        }}>Dimanche 10 mai 2026</div>
        <div style={{
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          fontWeight: "bold",
          fontSize: 28,
          color: WHITE,
          letterSpacing: 0.5,
          lineHeight: 1.1,
        }}>Ce soir à Monaco</div>
        <div style={{
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          fontSize: 13,
          color: GOLD2,
          marginTop: 4,
        }}>{ALL_EVENTS.length} événements cette semaine</div>
      </div>

      {/* Hot picks */}
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{
          fontFamily: "-apple-system, sans-serif",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: GOLD,
          marginBottom: 10,
        }}>🔥 À ne pas manquer ce soir</div>
        <div style={{
          display: "flex",
          gap: 10,
          overflowX: "auto",
          scrollbarWidth: "none",
          marginBottom: 20,
          paddingBottom: 4,
        }}>
          {hot.map(e => (
            <div
              key={e.id}
              onClick={() => onSelectEvent(e)}
              style={{
                minWidth: 140,
                height: 110,
                borderRadius: 16,
                background: e.fallback,
                flexShrink: 0,
                cursor: "pointer",
                padding: "10px 12px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 4 }}>{e.emoji}</div>
              <div style={{
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                fontWeight: "bold",
                fontSize: 11,
                color: WHITE,
                textTransform: "uppercase",
                lineHeight: 1.2,
                whiteSpace: "pre-line",
                textShadow: "0 1px 4px rgba(0,0,0,0.5)",
              }}>{e.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{
        display: "flex",
        gap: 8,
        overflowX: "auto",
        scrollbarWidth: "none",
        padding: "0 20px 16px",
      }}>
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              flexShrink: 0,
              padding: "6px 14px",
              borderRadius: 20,
              border: `1.5px solid ${filter === f.id ? GOLD : BORDER}`,
              background: filter === f.id ? GOLD : WHITE,
              color: filter === f.id ? WHITE : GREY,
              fontFamily: "-apple-system, sans-serif",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >{f.label}</button>
        ))}
      </div>

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
