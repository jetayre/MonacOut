import { useState } from "react";
import { ALL_EVENTS } from "../../data/events";
import EventCard from "../EventCard";

const NAVY = "#1A2A5A";
const GOLD = "#B8966E";
const DARK = "#1A2A5A";
const GREY = "#6A7A9A";
const LIGHT = "#F5F5FA";
const BORDER = "#DDE0F0";
const WHITE = "#FFFFFF";

const MONTHS = [
  { id: "jan",  label: "Jan",  full: "Janvier 2026",   match: "jan"  },
  { id: "fev",  label: "Fév",  full: "Février 2026",   match: "fév"  },
  { id: "mar",  label: "Mar",  full: "Mars 2026",      match: "mar"  },
  { id: "avr",  label: "Avr",  full: "Avril 2026",     match: "avr"  },
  { id: "mai",  label: "Mai",  full: "Mai 2026",       match: "mai"  },
  { id: "juin", label: "Juin", full: "Juin 2026",      match: "juin" },
  { id: "juil", label: "Juil", full: "Juillet 2026",   match: "juil" },
  { id: "aout", label: "Août", full: "Août 2026",      match: "août" },
  { id: "sep",  label: "Sep",  full: "Septembre 2026", match: "sep"  },
  { id: "oct",  label: "Oct",  full: "Octobre 2026",   match: "oct"  },
  { id: "nov",  label: "Nov",  full: "Novembre 2026",  match: "nov"  },
  { id: "dec",  label: "Déc",  full: "Décembre 2026",  match: "déc"  },
];

function getMonthDays(monthMatch) {
  const dates = [...new Set(
    ALL_EVENTS
      .filter(e => e.date.split(" ").pop() === monthMatch)
      .map(e => e.date)
  )];
  return dates.sort((a, b) => parseInt(a.split(" ")[1]) - parseInt(b.split(" ")[1]));
}

export default function AgendaScreen({ onSelectEvent, favorites, onToggleFav, onCategoryClick, lang = "fr" }) {
  const [monthId, setMonthId] = useState("mai");
  const currentMonth = MONTHS.find(m => m.id === monthId);
  const days = getMonthDays(currentMonth.match);

  const [selectedDay, setSelectedDay] = useState(() => {
    const initial = getMonthDays("mai");
    return initial[0] || "";
  });

  function switchMonth(m) {
    setMonthId(m.id);
    const newDays = getMonthDays(m.match);
    setSelectedDay(newDays[0] || "");
  }

  const events = ALL_EVENTS.filter(e => e.date === selectedDay);

  return (
    <div style={{ background: LIGHT, minHeight: "100%" }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(160deg, ${NAVY} 0%, #0F1935 100%)`,
        padding: "20px 20px 18px",
      }}>
        <div style={{
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          fontWeight: "bold",
          fontSize: 24,
          color: WHITE,
          letterSpacing: 0.5,
        }}>{lang === "en" ? "Calendar" : "Agenda"}</div>
        <div style={{
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          fontSize: 13,
          color: "#D4B896",
          marginTop: 2,
        }}>Monaco · {lang === "en" ? "January — December 2026" : "Janvier — Décembre 2026"}</div>
      </div>

      {/* Month pills */}
      <div style={{
        display: "flex",
        gap: 6,
        padding: "12px 14px 10px",
        overflowX: "auto",
        scrollbarWidth: "none",
        background: WHITE,
        borderBottom: `1px solid ${BORDER}`,
      }}>
        {MONTHS.map(m => {
          const hasEvents = getMonthDays(m.match).length > 0;
          const isActive = m.id === monthId;
          return (
            <button
              key={m.id}
              onClick={() => switchMonth(m)}
              style={{
                flexShrink: 0,
                padding: "5px 11px",
                borderRadius: 20,
                border: `1.5px solid ${isActive ? NAVY : hasEvents ? BORDER : "#E8E8F0"}`,
                background: isActive ? NAVY : WHITE,
                color: isActive ? WHITE : hasEvents ? DARK : "#C0B8B0",
                fontFamily: "-apple-system, sans-serif",
                fontSize: 11,
                fontWeight: 600,
                cursor: hasEvents ? "pointer" : "default",
                position: "relative",
              }}
            >
              {m.label}
              {hasEvents && !isActive && (
                <span style={{
                  position: "absolute",
                  top: 2,
                  right: 4,
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: NAVY,
                  opacity: 0.6,
                }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Day pills */}
      {days.length > 0 ? (
        <div style={{
          display: "flex",
          gap: 8,
          padding: "12px 14px",
          overflowX: "auto",
          scrollbarWidth: "none",
          background: WHITE,
          borderBottom: `1px solid ${BORDER}`,
        }}>
          {days.map(d => {
            const isActive = d === selectedDay;
            const parts = d.split(" ");
            return (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                style={{
                  flexShrink: 0,
                  minWidth: 44,
                  padding: "6px 8px",
                  borderRadius: 12,
                  border: `1.5px solid ${isActive ? NAVY : BORDER}`,
                  background: isActive ? NAVY : WHITE,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <span style={{
                  fontFamily: "-apple-system, sans-serif",
                  fontSize: 9,
                  fontWeight: 600,
                  color: isActive ? WHITE : GREY,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}>{parts[0]}</span>
                <span style={{
                  fontFamily: "-apple-system, sans-serif",
                  fontSize: 15,
                  fontWeight: 700,
                  color: isActive ? WHITE : DARK,
                }}>{parts[1]}</span>
                <div style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: isActive ? WHITE : GOLD,
                }} />
              </button>
            );
          })}
        </div>
      ) : (
        <div style={{
          background: WHITE,
          borderBottom: `1px solid ${BORDER}`,
          padding: "14px 20px",
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          color: GREY,
          fontSize: 13,
        }}>{lang === "en" ? "No events this month." : "Aucun événement programmé ce mois."}</div>
      )}

      {/* Events */}
      <div style={{ padding: "16px 16px 20px" }}>
        {selectedDay && (
          <div style={{
            fontFamily: "-apple-system, sans-serif",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: NAVY,
            marginBottom: 12,
          }}>
            {selectedDay} · {events.length} {lang === "en" ? `event${events.length !== 1 ? "s" : ""}` : `événement${events.length !== 1 ? "s" : ""}`}
          </div>
        )}
        {events.length === 0 && selectedDay ? (
          <div style={{
            textAlign: "center",
            padding: "40px 20px",
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            color: GREY,
            fontSize: 15,
          }}>{lang === "en" ? "No events today." : "Aucun événement ce jour."}</div>
        ) : (
          events.map(e => (
            <EventCard
              key={e.id}
              event={e}
              onClick={onSelectEvent}
              favorites={favorites}
              onToggleFav={onToggleFav}
              onCategoryClick={onCategoryClick}
              lang={lang}
            />
          ))
        )}
      </div>
    </div>
  );
}
