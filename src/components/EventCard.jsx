const GOLD = "#C4A241";
const MOIS_ICS = { jan:0,fév:1,mar:2,avr:3,mai:4,juin:5,juil:6,août:7,sep:8,oct:9,nov:10,déc:11 };

function generateICS(event) {
  const parts = event.date.trim().split(" ");
  const day = parseInt(parts[1]);
  const month = MOIS_ICS[parts[2]];
  const year = event.year || 2026;
  const tm = (event.time || '').replace(/\s/g,'').match(/^(\d{1,2})h(\d{2})?/);
  const h = tm ? parseInt(tm[1]) : 20;
  const m = tm && tm[2] ? parseInt(tm[2]) : 0;
  const p = n => String(n).padStart(2,'0');
  const dt  = `${year}${p(month+1)}${p(day)}T${p(h)}${p(m)}00`;
  const dt2 = `${year}${p(month+1)}${p(day)}T${p(Math.min(h+2,23))}${p(m)}00`;
  return [
    'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//MonacOut//FR',
    'BEGIN:VEVENT',
    `DTSTART:${dt}`,`DTEND:${dt2}`,
    `SUMMARY:${event.title.replace(/\n/g,' ')}`,
    `LOCATION:${event.subtitle||''}`,
    event.link ? `URL:${event.link}` : null,
    `DESCRIPTION:${(event.desc||'').replace(/\n/g,'\\n')}`,
    'END:VEVENT','END:VCALENDAR',
  ].filter(Boolean).join('\r\n');
}

function handleAddToCalendar(event, e) {
  e.stopPropagation();
  const blob = new Blob([generateICS(event)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = event.title.replace(/\n/g,'-').replace(/[^a-zA-Z0-9À-ÿ-]/g,'').slice(0,40) + '.ics';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const NAVY = "#0F1D3A";
const GREY = "#6A7080";
const WHITE = "#FDFAF5";

const JOURS = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
const MOIS = ["jan","fév","mar","avr","mai","juin","juil","août","sep","oct","nov","déc"];

function todayFrDate() {
  const d = new Date();
  return `${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]}`;
}

export default function EventCard({ event, favorites, onToggleFav, onCategoryClick, lang = "fr" }) {
  const isFav = favorites?.includes(event.id);
  const isToday = event.date === todayFrDate() && (event.year || 2026) === new Date().getFullYear();
  const dateLabel = isToday
    ? (lang === "en" ? "Today" : "Aujourd'hui")
    : event.date;

  return (
    <div style={{
      background: WHITE,
      borderRadius: 3,
      borderTop: "1px solid rgba(196,162,65,0.25)",
      borderRight: "1px solid rgba(196,162,65,0.25)",
      borderBottom: "1px solid rgba(196,162,65,0.25)",
      borderLeft: `3px solid ${GOLD}`,
      marginBottom: 10,
      padding: "12px 14px 14px",
      boxShadow: "0 1px 6px rgba(15,29,58,0.05)",
    }}>

      {/* Top row: category + fav */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <button
          onClick={e => { e.stopPropagation(); onCategoryClick?.(event.cat); }}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "'Jost', -apple-system, sans-serif",
            fontSize: 10, fontWeight: 700, letterSpacing: 1.4,
            textTransform: "uppercase", color: GREY, padding: 0,
          }}
        >{event.cat}</button>
        <button
          onClick={e => { e.stopPropagation(); onToggleFav(event.id); }}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, lineHeight: 1, padding: 0 }}
        >{isFav ? "❤️" : "🤍"}</button>
      </div>

      {/* Date + time */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 5 }}>
        <span style={{
          fontFamily: "'Jost', -apple-system, sans-serif",
          fontSize: 18, fontWeight: 700, letterSpacing: 0.8,
          textTransform: "uppercase", color: NAVY,
        }}>{dateLabel}{!isToday && ` ${event.year || 2026}`}</span>
        {event.time && (
          <span style={{
            fontFamily: "'Jost', -apple-system, sans-serif",
            fontSize: 13, fontWeight: 400, color: GREY,
          }}>{event.time}</span>
        )}
      </div>

      {/* Title */}
      <div style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontWeight: 600, fontSize: 22, letterSpacing: 0.6,
        color: NAVY, lineHeight: 1.2,
        marginBottom: event.subtitle ? 5 : 10,
      }}>{event.title.replace(/\n/g, " ")}</div>

      {/* Venue */}
      {event.subtitle && (
        <div style={{
          fontFamily: "'Jost', -apple-system, sans-serif",
          fontSize: 12, fontWeight: 500, color: GREY,
          marginBottom: 10,
        }}>{event.subtitle}</div>
      )}

      {/* Free badge */}
      {event.free && (
        <div style={{ marginBottom: 8 }}>
          <span style={{
            border: "1px solid #2A6A3A", borderRadius: 20,
            padding: "2px 10px",
            fontFamily: "'Jost', -apple-system, sans-serif",
            fontSize: 10, fontWeight: 700, letterSpacing: 1, color: "#1A4A2A",
          }}>{lang === "en" ? "FREE ENTRY" : "ENTRÉE LIBRE"}</span>
        </div>
      )}

      {/* Link */}
      {event.link && (
        <div style={{ marginBottom: event.phone ? 6 : 0 }}>
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              fontFamily: "'Jost', -apple-system, sans-serif",
              fontSize: 11, fontWeight: 700, letterSpacing: 1,
              textTransform: "uppercase", color: NAVY,
              border: `1px solid ${GOLD}`,
              padding: "5px 14px", borderRadius: 20,
              textDecoration: "none", display: "inline-block",
            }}
          >{event.free ? (lang === "en" ? "More info" : "Plus d'infos") : "Let's go"}</a>
        </div>
      )}

      {/* Phone */}
      {event.phone && (
        <a
          href={`tel:${event.phone}`}
          onClick={e => e.stopPropagation()}
          style={{
            fontFamily: "'Jost', -apple-system, sans-serif",
            fontWeight: 600, fontSize: 12,
            color: GOLD, textDecoration: "none", letterSpacing: 0.3,
            display: "block",
          }}
        >{event.phone}</a>
      )}
    </div>
  );
}
