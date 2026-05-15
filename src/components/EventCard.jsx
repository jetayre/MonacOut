const GOLD = "#B8962E";
const NAVY = "#0F1D3A";
const NAVY_LIGHT = "#1A2D4A";
const GREY = "#4A4A50";
const WHITE = "#FFFFFF";

const JOURS = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
const MOIS = ["jan","fév","mar","avr","mai","juin","juil","août","sep","oct","nov","déc"];
function todayFrDate() {
  const d = new Date();
  return `${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]}`;
}

export default function EventCard({ event, onClick, favorites, onToggleFav, onCategoryClick, lang = "fr" }) {
  const isFav = favorites?.includes(event.id);
  const isToday = event.date === todayFrDate();
  const dateLabel = isToday
    ? (lang === "en" ? "Today" : "Aujourd'hui")
    : event.date;
  return (
    <div
      onClick={() => onClick(event)}
      style={{
        background: WHITE,
        borderRadius: 4,
        border: `1.5px solid ${GOLD}`,
        marginBottom: 14,
        cursor: "pointer",
        position: "relative",
        padding: 4,
        boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
      }}
    >
      {/* Inner frame — navy */}
      <div style={{
        border: `2px solid ${NAVY}`,
        borderRadius: 2,
        padding: "14px 16px 16px",
        position: "relative",
      }}>

        {/* Fav button */}
        <button
          onClick={e => { e.stopPropagation(); onToggleFav(event.id); }}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 18,
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
            top: 10,
            left: 10,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "'Jost', -apple-system, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: "uppercase",
            color: NAVY,
            padding: 0,
            lineHeight: 1,
          }}
        >{event.cat}</button>

        {/* Date + heure */}
        <div style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "center",
          gap: 8,
          paddingTop: 26,
          marginBottom: 6,
        }}>
          <span style={{
            fontFamily: "'Jost', -apple-system, sans-serif",
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: 0.8,
            textTransform: "uppercase",
            color: NAVY,
          }}>{dateLabel}{!isToday && ` ${event.year || 2026}`}</span>
          <span style={{
            fontFamily: "'Jost', -apple-system, sans-serif",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: 0.5,
            color: GREY,
          }}>{event.time}</span>
        </div>

        {/* Title */}
        <div style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontStyle: "normal",
          fontWeight: 300,
          fontSize: 28,
          letterSpacing: 3,
          color: NAVY,
          lineHeight: 1.3,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textAlign: "center",
          marginTop: 10,
          marginBottom: 24,
          paddingRight: 26,
          paddingLeft: 4,
        }}>
          {event.title.replace(/\n/g, " ")}
        </div>

        {/* Free badge */}
        {event.free && (
          <div style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 10,
          }}>
            <div style={{
              border: `1.5px solid #2A6A3A`,
              borderRadius: 20,
              padding: "4px 16px",
              fontFamily: "'Jost', -apple-system, sans-serif",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1,
              color: "#1A4A2A",
            }}>{lang === "en" ? "FREE ENTRY" : "ENTRÉE LIBRE"}</div>
          </div>
        )}

        {/* Subtitle */}
        <div style={{
          fontFamily: "'Jost', -apple-system, sans-serif",
          fontStyle: "normal",
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: 0.5,
          color: GREY,
          textAlign: "center",
          marginBottom: 10,
        }}>{event.subtitle}</div>

        {/* Description */}
        <div style={{
          fontFamily: "'Libre Baskerville', Georgia, serif",
          fontStyle: "normal",
          fontSize: 15,
          color: NAVY_LIGHT,
          textAlign: "justify",
          lineHeight: 1.8,
        }}>{lang === "en" ? (event.descEn || event.desc) : event.desc}</div>

        {event.link && !event.free && (
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                fontFamily: "'Jost', -apple-system, sans-serif",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                color: NAVY,
                background: WHITE,
                border: `1.5px solid ${GOLD}`,
                padding: "10px 24px",
                borderRadius: 20,
                textDecoration: "none",
                display: "inline-block",
              }}
            >{event.free ? (lang === "en" ? "I'm joining" : "Je participe") : (lang === "en" ? "Book" : "Réserver")}</a>
          </div>
        )}

        {event.phone && (
          <div style={{ textAlign: "center", marginTop: 10 }}>
            <a
              href={`tel:${event.phone}`}
              onClick={e => e.stopPropagation()}
              style={{
                fontFamily: "'Jost', -apple-system, sans-serif",
                fontStyle: "normal",
                fontWeight: 700,
                fontSize: 15,
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
