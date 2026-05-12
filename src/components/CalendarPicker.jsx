import { useState } from "react";

const GOLD = "#1A2A5A";
const NAVY = "#1A2A4A";
const WHITE = "#FFFFFF";
const GREY = "#6A7A9A";

const JOURS_FR = ["L", "M", "M", "J", "V", "S", "D"];
const JOURS_EN = ["M", "T", "W", "T", "F", "S", "S"];
const MOIS_FR = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const MOIS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function sameDay(a, b) {
  return a && b && a.toDateString() === b.toDateString();
}

// inline=true: compact panel with no full-screen wrapper, calls onChange(start, end) immediately on each selection
// inline=false (default): full-screen with header + confirm button, calls onConfirm(start, end) on button click
export default function CalendarPicker({ onClose, onConfirm, onChange, inline = false, lang = "fr", initialStart = null, initialEnd = null }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [start, setStart] = useState(initialStart);
  const [end, setEnd] = useState(initialEnd);

  const JOURS = lang === "en" ? JOURS_EN : JOURS_FR;
  const MOIS_NOM = lang === "en" ? MOIS_EN : MOIS_FR;

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
    let newStart, newEnd;
    if (!start || (start && end)) {
      newStart = clicked;
      newEnd = null;
    } else {
      if (clicked < start) {
        newStart = clicked; newEnd = start;
      } else {
        newStart = start; newEnd = clicked;
      }
    }
    setStart(newStart);
    setEnd(newEnd);
    if (inline) onChange?.(newStart, newEnd);
  }

  function handleReset() {
    setStart(null);
    setEnd(null);
    if (inline) onChange?.(null, null);
  }

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  const grid = (
    <>
      {/* Month navigation */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <button onClick={prevMonth} style={{ background: "none", border: `1px solid #E8E0D4`, borderRadius: "50%", width: 30, height: 30, cursor: "pointer", fontSize: 14, color: NAVY, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
        <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 15, color: NAVY, fontWeight: "bold" }}>
          {MOIS_NOM[month]} {year}
        </div>
        <button onClick={nextMonth} style={{ background: "none", border: `1px solid #E8E0D4`, borderRadius: "50%", width: 30, height: 30, cursor: "pointer", fontSize: 14, color: NAVY, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
      </div>

      {/* Day headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 4 }}>
        {JOURS.map((j, i) => (
          <div key={i} style={{ textAlign: "center", fontFamily: "-apple-system, sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: 0.5, color: GREY, paddingBottom: 4 }}>{j}</div>
        ))}
      </div>

      {/* Days grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
        {cells.map((day, i) => {
          const col = i % 7;
          const isToday = day && sameDay(new Date(year, month, day), today);
          const isStart = day && sameDay(new Date(year, month, day), start);
          const isEnd = day && sameDay(new Date(year, month, day), end);
          const inRange = day && start && end && new Date(year, month, day) > start && new Date(year, month, day) < end;
          return (
            <div
              key={i}
              onClick={() => handleDay(day)}
              style={{ height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: day ? "pointer" : "default", position: "relative" }}
            >
              {/* Range strip */}
              {inRange && (
                <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: col === 0 ? "50%" : 0, right: col === 6 ? "50%" : 0, height: 28, background: "#DDE4F5", zIndex: 0 }} />
              )}
              {/* Start strip right */}
              {isStart && end && (
                <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: "50%", right: col === 6 ? "50%" : 0, height: 28, background: "#DDE4F5", zIndex: 0 }} />
              )}
              {/* End strip left */}
              {isEnd && start && (
                <div style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", right: "50%", left: col === 0 ? "50%" : 0, height: 28, background: "#DDE4F5", zIndex: 0 }} />
              )}
              {/* Day circle */}
              {day && (
                <div style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: isStart || isEnd ? GOLD : "transparent",
                  color: isStart || isEnd ? WHITE : NAVY,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "-apple-system, sans-serif", fontSize: 12,
                  fontWeight: isToday ? 700 : 400,
                  zIndex: 1, position: "relative",
                  boxShadow: isToday && !isStart && !isEnd ? `inset 0 -2px 0 ${GOLD}` : "none",
                }}>
                  {day}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );

  // Inline mode: compact panel, no full-screen
  if (inline) {
    const resetLabel = lang === "en" ? "Reset" : "Réinit.";
    return (
      <div style={{ background: WHITE, borderBottom: "1px solid #E8E0D4", padding: "12px 16px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: "bold", fontSize: 14, color: NAVY }}>
            {lang === "en" ? "Select dates" : "Sélectionner des dates"}
          </div>
          <button onClick={handleReset} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "-apple-system, sans-serif", fontSize: 11, color: GREY, padding: 0 }}>{resetLabel}</button>
        </div>
        {grid}
      </div>
    );
  }

  // Standalone full-screen mode
  const calTitle = lang === "en" ? "Calendar" : "Agenda";
  const resetLabel = lang === "en" ? "Reset" : "Réinit.";
  const confirmLabel = start
    ? (lang === "en" ? "See events →" : "Voir les événements →")
    : (lang === "en" ? "Select a date" : "Sélectionnez une date");

  return (
    <div style={{ background: WHITE, minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ background: WHITE, borderBottom: "1px solid #E8E0D4", padding: "14px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: NAVY, padding: 0, lineHeight: 1 }}>←</button>
        <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: "bold", fontSize: 20, color: NAVY }}>{calTitle}</div>
        <button onClick={handleReset} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "-apple-system, sans-serif", fontSize: 11, color: GREY, padding: 0 }}>{resetLabel}</button>
      </div>
      <div style={{ padding: "20px 16px", flex: 1 }}>{grid}</div>
      <div style={{ padding: "12px 20px 28px", background: WHITE, borderTop: "1px solid #E8E0D4" }}>
        <button
          onClick={() => start && onConfirm(start, end || start)}
          style={{ width: "100%", padding: "14px", background: start ? GOLD : "#D8D0C8", color: WHITE, border: "none", borderRadius: 24, fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 16, cursor: start ? "pointer" : "default", letterSpacing: 0.5 }}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}
