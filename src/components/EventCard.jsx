const GOLD = "#B8962E";
const NAVY = "#0F1D3A";
const NAVY_LIGHT = "#1A2D4A";
const GREY = "#6A6860";
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
        marginBottom: 12,
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
        padding: "12px 14px 14px",
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
            left: 10,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "'Jost', -apple-system, sans-serif",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: NAVY,
            padding: 0,
            lineHeight: 1,
          }}
        >{event.cat}</button>

        {/* Title */}
        <div style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontStyle: "italic",
          fontWeight: 600,
          fontSize: 26,
          letterSpacing: 0.3,
          color: NAVY,
          lineHeight: 1.15,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textAlign: "center",
          marginBottom: 8,
          paddingRight: 24,
          paddingLeft: 4,
          paddingTop: 18,
        }}>
          {event.title.replace(/\n/g, " ")}
        </div>

        {/* Free badge */}
        {event.free && (
          <div style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 8,
          }}>
            <div style={{
              border: `1px solid #2A6A3A`,
              borderRadius: 20,
              padding: "2px 12px",
              fontFamily: "'Jost', -apple-system, sans-serif",
              fontSize: 10,
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
          fontSize: 12,
          color: GREY,
          textAlign: "center",
          marginBottom: 4,
        }}>{event.subtitle}</div>

        {/* Date */}
        <div style={{
          fontFamily: "'Jost', -apple-system, sans-serif",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: 1,
          textTransform: "uppercase",
          color: NAVY,
          textAlign: "center",
          marginBottom: 10,
        }}>{event.date} {event.year || 2026} · {event.time}</div>

        {/* Description */}
        <div style={{
          fontFamily: "'Libre Baskerville', Georgia, serif",
          fontStyle: "normal",
          fontSize: 12,
          color: NAVY_LIGHT,
          textAlign: "center",
          lineHeight: 1.6,
        }}>{event.desc}</div>

        {event.link && (
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                fontFamily: "'Jost', -apple-system, sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                color: WHITE,
                background: NAVY,
                padding: "6px 18px",
                borderRadius: 20,
                textDecoration: "none",
                display: "inline-block",
              }}
            >{event.free ? (lang === "en" ? "I'm joining" : "Je participe") : (lang === "en" ? "Book" : "Réserver")}</a>
          </div>
        )}

        {event.phone && (
          <div style={{ textAlign: "center", marginTop: 6 }}>
            <a
              href={`tel:${event.phone}`}
              onClick={e => e.stopPropagation()}
              style={{
                fontFamily: "'Libre Baskerville', Georgia, serif",
                fontStyle: "italic",
                fontSize: 12,
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
