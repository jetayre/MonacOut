import { useState } from "react";
import { ALL_EVENTS } from "../../data/events";
import EventCard from "../EventCard";

const NAVY = "#1A2A5A";
const GOLD = "#B8966E";
const GREY = "#6A7A9A";
const LIGHT = "#F5F5FA";
const BORDER = "#DDE0F0";
const WHITE = "#FFFFFF";

const JOURS_FR  = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
const MOIS_FULL = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const MOIS_MATCH = ["jan","fév","mar","avr","mai","juin","juil","août","sep","oct","nov","déc"];
const DAY_HEADERS = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function firstDayOfMonth(year, month) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1; // Monday = 0
}

function getEventDaySet(year, month) {
  const match = MOIS_MATCH[month];
  const set = new Set();
  ALL_EVENTS.forEach(e => {
    const parts = e.date.trim().split(" ");
    if (parts[2] === match) set.add(parseInt(parts[1]));
  });
  return set;
}

function getEventsForDay(year, month, dayNum) {
  const match = MOIS_MATCH[month];
  const weekday = new Date(year, month, dayNum).getDay();
  const dayStr = `${JOURS_FR[weekday]} ${dayNum} ${match}`;
  return ALL_EVENTS.filter(e => e.date === dayStr);
}

export default function AgendaScreen({ onSelectEvent, favorites, onToggleFav, onCategoryClick, lang = "fr" }) {
  const now = new Date();
  const [year]  = useState(2026);
  const [month, setMonth] = useState(now.getFullYear() === 2026 ? now.getMonth() : 4);
  const [selectedDays, setSelectedDays] = useState(() => {
    const s = new Set();
    if (now.getFullYear() === 2026 && getEventDaySet(2026, now.getMonth()).has(now.getDate()))
      s.add(now.getDate());
    return s;
  });

  const eventDays = getEventDaySet(year, month);

  function toggleDay(day) {
    setSelectedDays(prev => {
      const next = new Set(prev);
      next.has(day) ? next.delete(day) : next.add(day);
      return next;
    });
  }

  const events = [...selectedDays]
    .sort((a, b) => a - b)
    .flatMap(d => getEventsForDay(year, month, d));
  const totalDays = daysInMonth(year, month);
  const offset = firstDayOfMonth(year, month);

  const cells = [
    ...Array(offset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday = (d) =>
    d !== null && new Date().getFullYear() === year &&
    new Date().getMonth() === month && new Date().getDate() === d;

  return (
    <div style={{ background: LIGHT, minHeight: "100%" }}>

      {/* Header */}
      <div style={{
        background: `linear-gradient(160deg, ${NAVY} 0%, #0F1935 100%)`,
        padding: "18px 20px 14px",
      }}>
        <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: "bold", fontSize: 22, color: WHITE }}>
          {lang === "en" ? "Calendar" : "Agenda"}
        </div>
        <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 12, color: "#D4B896", marginTop: 2 }}>
          Monaco · 2026
        </div>
      </div>

      {/* Calendar card */}
      <div style={{ background: WHITE, margin: "12px 12px 0", borderRadius: 12, border: `1px solid ${BORDER}`, overflow: "hidden" }}>

        {/* Month navigation */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px 10px", borderBottom: `1px solid ${BORDER}` }}>
          <button
            onClick={() => { setMonth(m => Math.max(0, m - 1)); setSelectedDays(new Set()); }}
            disabled={month === 0}
            style={{ background: "none", border: "none", cursor: month === 0 ? "default" : "pointer", fontSize: 18, color: month === 0 ? BORDER : GOLD, padding: "0 8px" }}
          >‹</button>
          <div style={{ fontFamily: "Georgia, serif", fontWeight: "bold", fontSize: 17, color: NAVY, letterSpacing: 0.5 }}>
            {MOIS_FULL[month]} {year}
          </div>
          <button
            onClick={() => { setMonth(m => Math.min(11, m + 1)); setSelectedDays(new Set()); }}
            disabled={month === 11}
            style={{ background: "none", border: "none", cursor: month === 11 ? "default" : "pointer", fontSize: 18, color: month === 11 ? BORDER : GOLD, padding: "0 8px" }}
          >›</button>
        </div>

        {/* Day-of-week headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "8px 10px 4px" }}>
          {DAY_HEADERS.map(d => (
            <div key={d} style={{ textAlign: "center", fontFamily: "-apple-system, sans-serif", fontSize: 10, fontWeight: 700, color: GREY, letterSpacing: 0.5 }}>
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3, padding: "4px 10px 12px" }}>
          {cells.map((day, i) => {
            if (day === null) return <div key={i} />;
            const hasEvent = eventDays.has(day);
            const isSelected = selectedDays.has(day);
            const today = isToday(day);
            return (
              <button
                key={i}
                onClick={() => hasEvent && toggleDay(day)}
                style={{
                  aspectRatio: "1",
                  borderRadius: 8,
                  border: today ? `2px solid ${GOLD}` : isSelected ? `2px solid ${NAVY}` : "2px solid transparent",
                  background: isSelected ? NAVY : hasEvent ? `rgba(184,150,110,0.12)` : "transparent",
                  color: isSelected ? WHITE : hasEvent ? NAVY : "#C0C8D8",
                  fontFamily: "-apple-system, sans-serif",
                  fontSize: 13,
                  fontWeight: hasEvent ? 700 : 400,
                  cursor: hasEvent ? "pointer" : "default",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  padding: 2,
                  position: "relative",
                }}
              >
                {day}
                {hasEvent && (
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: isSelected ? WHITE : GOLD }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected day events */}
      <div style={{ padding: "14px 12px 20px" }}>
        {selectedDays.size > 0 ? (
          <>
            <div style={{ fontFamily: "-apple-system, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: NAVY, marginBottom: 12 }}>
              {selectedDays.size === 1
                ? `${JOURS_FR[new Date(year, month, [...selectedDays][0]).getDay()]} ${[...selectedDays][0]} ${MOIS_MATCH[month]}`
                : `${selectedDays.size} dates · ${MOIS_FULL[month]}`
              } · {events.length} {lang === "en" ? `event${events.length !== 1 ? "s" : ""}` : `événement${events.length !== 1 ? "s" : ""}`}
            </div>
            {events.map(e => (
              <EventCard key={e.id} event={e} onClick={onSelectEvent} favorites={favorites} onToggleFav={onToggleFav} onCategoryClick={onCategoryClick} lang={lang} />
            ))}
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "30px 20px", fontFamily: "Georgia, serif", fontStyle: "italic", color: GREY, fontSize: 14 }}>
            {lang === "en" ? "Select a highlighted date to see events." : "Sélectionnez une date pour voir les événements."}
          </div>
        )}
      </div>
    </div>
  );
}
