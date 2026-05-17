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
const NAVY_LIGHT = "#1A2D4A";
const GREY = "#4A4A50";
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
    <div
      style={{
        background: WHITE,
        borderRadius: 4,
        border: `1.5px solid ${GOLD}`,
        marginBottom: 10,
        position: "relative",
        padding: 4,
        boxShadow: "0 2px 12px rgba(15,29,58,0.07)",
      }}
    >
      {/* Inner frame — navy */}
      <div style={{
        border: `2px solid ${NAVY}`,
        borderRadius: 2,
        padding: "10px 12px 10px",
        position: "relative",
      }}>

        {/* Fav button */}
        <button
          onClick={e => { e.stopPropagation(); onToggleFav(event.id); }}
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 16,
            lineHeight: 1,
          }}
        >
          {isFav ? "❤️" : "🤍"}
        </button>

        {/* Category — top left */}
        <button
          onClick={e => { e.stopPropagation(); onCategoryClick?.(event.cat); }}
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "'Jost', -apple-system, sans-serif",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            color: NAVY,
            padding: 0,
            lineHeight: 1,
          }}
        >{event.cat}</button>

        {/* Date centrée + heure à droite (spacer fantôme pour équilibre) */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          paddingTop: 14, marginBottom: 2, gap: 0,
        }}>
          {event.time && (
            <span style={{
              fontFamily: "'Jost', -apple-system, sans-serif",
              fontSize: 11, visibility: "hidden", flexShrink: 0,
            }}>{event.time}</span>
          )}
          <span style={{
            fontFamily: "'Jost', -apple-system, sans-serif",
            fontSize: 13, fontWeight: 700, letterSpacing: 0.8,
            textTransform: "uppercase", color: NAVY,
          }}>{dateLabel}{!isToday && ` ${event.year || 2026}`}</span>
          {event.time && (
            <span style={{
              fontFamily: "'Jost', -apple-system, sans-serif",
              fontSize: 11, fontWeight: 400, color: GREY,
              marginLeft: 6, flexShrink: 0,
            }}>{event.time}</span>
          )}
        </div>

        {/* Title */}
        <div style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontWeight: 600,
          fontSize: 22,
          letterSpacing: 0.8,
          color: NAVY,
          lineHeight: 1.2,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textAlign: "center",
          marginTop: 4,
          marginBottom: 8,
          paddingRight: 22,
          paddingLeft: 4,
        }}>
          {event.title.replace(/\n/g, " ")}
        </div>

        {/* Organisation name — fondations & associations uniquement */}
        {/fondation|fdtn|fight aids|croix.rouge|amade|association|mission enfance|anges gardiens|amapei|jewish|caritas|jcc/i.test(event.source || "") && (
          <div style={{
            fontFamily: "'Jost', -apple-system, sans-serif",
            fontWeight: 700,
            fontSize: 10,
            letterSpacing: 1.4,
            textTransform: "uppercase",
            color: GOLD,
            textAlign: "center",
            marginTop: -4,
            marginBottom: 6,
          }}>{event.source}</div>
        )}

        {/* Free badge */}
        {event.free && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
            <div style={{
              border: `1.5px solid #2A6A3A`,
              borderRadius: 20,
              padding: "3px 12px",
              fontFamily: "'Jost', -apple-system, sans-serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1,
              color: "#1A4A2A",
            }}>{lang === "en" ? "FREE ENTRY" : "ENTRÉE LIBRE"}</div>
          </div>
        )}

        {/* Subtitle */}
        <div style={{
          fontFamily: "'Jost', -apple-system, sans-serif",
          fontWeight: 700,
          fontSize: 12,
          letterSpacing: 0.5,
          color: GREY,
          textAlign: "center",
          marginBottom: 6,
        }}>{event.subtitle}</div>

        {/* Description — 3 lignes justifiées */}
        <div style={{
          fontFamily: "'Libre Baskerville', Georgia, serif",
          fontSize: 13,
          color: NAVY_LIGHT,
          textAlign: "justify",
          lineHeight: 1.55,
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>{lang === "en" ? (event.descEn || event.desc) : event.desc}</div>

        {event.link && (
          <div style={{ textAlign: "center", marginTop: 10 }}>
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                fontFamily: "'Jost', -apple-system, sans-serif",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                color: NAVY,
                background: WHITE,
                border: `1.5px solid ${GOLD}`,
                padding: "7px 18px",
                borderRadius: 20,
                textDecoration: "none",
                display: "inline-block",
              }}
            >{event.free
              ? (lang === "en" ? "More info" : "Plus d'infos")
              : (lang === "en" ? "Book" : "Réserver")}
            </a>
          </div>
        )}

        {event.phone && (
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <a
              href={`tel:${event.phone}`}
              onClick={e => e.stopPropagation()}
              style={{
                fontFamily: "'Jost', -apple-system, sans-serif",
                fontWeight: 700,
                fontSize: 13,
                color: GOLD,
                textDecoration: "none",
                letterSpacing: 0.5,
              }}
            >{event.phone}</a>
          </div>
        )}

      </div>
    </div>
  );
}
