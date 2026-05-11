import { useState } from "react";

const GOLD = "#B8966E";
const NAVY = "#1A2A4A";
const WHITE = "#FFFFFF";
const LIGHT = "#F8F4EF";
const GREY = "#6A7A8A";

const JOURS = ["L", "M", "M", "J", "V", "S", "D"];
const MOIS_NOM = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

function sameDay(a, b) {
  return a && b && a.toDateString() === b.toDateString();
}

export default function CalendarPicker({ onClose, onConfirm }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = new Date(year, month, 1).getDay();
  const firstMon = firstDow === 0 ? 6 : firstDow - 1;

  const cells = [];
  for (let i = 0; i < firstMon; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  function handleDay(day) {
    if (!day) return;
    const clicked = new Date(year, month, day);
    if (!start || (start && end)) {
      setStart(clicked);
      setEnd(null);
    } else {
      if (clicked < start) {
        setEnd(start); setStart(clicked);
      } else {
        setEnd(clicked);
      }
    }
  }

  function cellStyle(day, col) {
    if (!day) return {};
    const d = new Date(year, month, day);
    const isStart = sameDay(d, start);
    const isEnd = sameDay(d, end);
    const inRange = start && end && d > start && d < end;
    const isToday = sameDay(d, today);

    let bg = "transparent";
    let color = NAVY;
    let borderRadius = "50%";
    let fontWeight = isToday ? 700 : 400;

    if (isStart || isEnd) {
      bg = GOLD; color = WHITE;
    } else if (inRange) {
      bg = "#F0E4D0";
      borderRadius = col === 0 ? "50% 0 0 50%" : col === 6 ? "0 50% 50% 0" : "0";
    }

    return { background: bg, color, borderRadius, fontWeight };
  }

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  const selText = start && end
    ? `Du ${start.getDate()} ${MOIS_NOM[start.getMonth()].slice(0,3).toLowerCase()} au ${end.getDate()} ${MOIS_NOM[end.getMonth()].slice(0,3).toLowerCase()}`
    : start
    ? `Depuis le ${start.getDate()} ${MOIS_NOM[start.getMonth()].slice(0,3).toLowerCase()}`
    : "Sélectionnez une date de début";

  return (
    <div style={{ background: WHITE, minHeight: "100%", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{ background: WHITE, borderBottom: "1px solid #E8E0D4", padding: "14px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: NAVY, padding: 0, lineHeight: 1 }}>←</button>
        <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: "bold", fontSize: 20, color: NAVY }}>Agenda</div>
        <button onClick={() => { setStart(null); setEnd(null); }} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "-apple-system, sans-serif", fontSize: 11, color: GREY, padding: 0 }}>Réinit.</button>
      </div>

      <div style={{ padding: "20px 16px", flex: 1 }}>

        {/* Month navigation */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <button onClick={prevMonth} style={{ background: "none", border: `1px solid #E8E0D4`, borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 14, color: NAVY, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
          <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 17, color: NAVY, fontWeight: "bold" }}>
            {MOIS_NOM[month]} {year}
          </div>
          <button onClick={nextMonth} style={{ background: "none", border: `1px solid #E8E0D4`, borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 14, color: NAVY, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
        </div>

        {/* Day headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 6 }}>
          {JOURS.map((j, i) => (
            <div key={i} style={{ textAlign: "center", fontFamily: "-apple-system, sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 0.5, color: GREY, paddingBottom: 4 }}>{j}</div>
          ))}
        </div>

        {/* Days grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
          {cells.map((day, i) => {
            const col = i % 7;
            const style = cellStyle(day, col);
            const isToday = day && sameDay(new Date(year, month, day), today);
            return (
              <div
                key={i}
                onClick={() => handleDay(day)}
                style={{
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: day ? "pointer" : "default",
                  position: "relative",
                }}
              >
                {/* Range background (full width strip) */}
                {day && start && end && new Date(year, month, day) > start && new Date(year, month, day) < end && (
                  <div style={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    left: col === 0 ? "50%" : 0,
                    right: col === 6 ? "50%" : 0,
                    height: 32,
                    background: "#F0E4D0",
                    zIndex: 0,
                  }} />
                )}
                {/* Start date left strip */}
                {day && sameDay(new Date(year, month, day), start) && end && (
                  <div style={{
                    position: "absolute", top: "50%", transform: "translateY(-50%)",
                    left: "50%", right: col === 6 ? "50%" : 0, height: 32,
                    background: "#F0E4D0", zIndex: 0,
                  }} />
                )}
                {/* End date right strip */}
                {day && sameDay(new Date(year, month, day), end) && start && (
                  <div style={{
                    position: "absolute", top: "50%", transform: "translateY(-50%)",
                    right: "50%", left: col === 0 ? "50%" : 0, height: 32,
                    background: "#F0E4D0", zIndex: 0,
                  }} />
                )}
                {/* Day circle */}
                {day && (
                  <div style={{
                    width: 34, height: 34,
                    borderRadius: "50%",
                    background: (sameDay(new Date(year, month, day), start) || sameDay(new Date(year, month, day), end)) ? GOLD : "transparent",
                    color: (sameDay(new Date(year, month, day), start) || sameDay(new Date(year, month, day), end)) ? WHITE : NAVY,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "-apple-system, sans-serif",
                    fontSize: 13,
                    fontWeight: isToday ? 700 : 400,
                    zIndex: 1,
                    position: "relative",
                    boxShadow: isToday && !sameDay(new Date(year, month, day), start) && !sameDay(new Date(year, month, day), end)
                      ? `inset 0 -2px 0 ${GOLD}` : "none",
                  }}>
                    {day}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selection label */}
        <div style={{
          margin: "20px 0 6px",
          textAlign: "center",
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          fontSize: 14,
          color: start ? NAVY : GREY,
        }}>{selText}</div>

      </div>

      {/* Confirm button */}
      <div style={{ padding: "12px 20px 28px", background: WHITE, borderTop: "1px solid #E8E0D4" }}>
        <button
          onClick={() => start && onConfirm(start, end || start)}
          style={{
            width: "100%",
            padding: "14px",
            background: start ? GOLD : "#D8D0C8",
            color: WHITE,
            border: "none",
            borderRadius: 24,
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            fontSize: 16,
            cursor: start ? "pointer" : "default",
            letterSpacing: 0.5,
          }}
        >
          {start ? "Voir les événements →" : "Sélectionnez une date"}
        </button>
      </div>
    </div>
  );
}
