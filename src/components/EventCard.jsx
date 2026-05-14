const GOLD = "#B8962E";
const NAVY = "#0F1D3A";
const NAVY_LIGHT = "#1A2D4A";
const GREY = "#4A4A50";
const WHITE = "#FFFFFF";

export default function EventCard({ event, onClick, favorites, onToggleFav, onCategoryClick, lang = "fr" }) {
  const isFav = favorites?.includes(event.id);
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

        {/* Date — top, under category/fav row */}
        <div style={{
          fontFamily: "'Jost', -apple-system, sans-serif",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: 0.8,
          textTransform: "uppercase",
          color: NAVY,
          textAlign: "center",
          paddingTop: 24,
          marginBottom: 6,
        }}>{event.date} {event.year || 2026} · {event.time}</div>

        {/* Title */}
        <div style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontStyle: "italic",
          fontWeight: 600,
          fontSize: 28,
          letterSpacing: 0.3,
          color: NAVY,
          lineHeight: 1.2,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textAlign: "center",
          marginBottom: 10,
          paddingRight: 24,
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
              padding: "3px 14px",
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
          fontFamily: "'Libre Baskerville', Georgia, serif",
          fontStyle: "italic",
          fontSize: 13,
          color: GREY,
          textAlign: "center",
          marginBottom: 10,
        }}>{event.subtitle}</div>

        {/* Description */}
        <div style={{
          fontFamily: "'Libre Baskerville', Georgia, serif",
          fontStyle: "normal",
          fontSize: 14,
          color: NAVY_LIGHT,
          textAlign: "justify",
          lineHeight: 1.75,
        }}>{event.desc}</div>

        {event.link && (
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                fontFamily: "'Jost', -apple-system, sans-serif",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                color: WHITE,
                background: NAVY,
                padding: "8px 22px",
                borderRadius: 20,
                textDecoration: "none",
                display: "inline-block",
              }}
            >{event.free ? (lang === "en" ? "I'm joining" : "Je participe") : (lang === "en" ? "Book" : "Réserver")}</a>
          </div>
        )}

        {event.phone && (
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <a
              href={`tel:${event.phone}`}
              onClick={e => e.stopPropagation()}
              style={{
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontStyle: "italic",
                fontSize: 14,
                color: GOLD,
                textDecoration: "none",
              }}
            >{event.phone}</a>
          </div>
        )}

      </div>
    </div>
  );
}
