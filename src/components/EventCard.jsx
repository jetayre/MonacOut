const GOLD = "#B8966E";
const DARK = "#1C1612";
const GREY = "#6A635A";
const WHITE = "#FFFFFF";

export default function EventCard({ event, onClick, favorites, onToggleFav, onCategoryClick }) {
  const isFav = favorites?.includes(event.id);

  return (
    <div
      onClick={() => onClick(event)}
      style={{
        background: WHITE,
        borderRadius: 20,
        overflow: "hidden",
        marginBottom: 14,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        cursor: "pointer",
        position: "relative",
      }}
    >
      {/* gradient header */}
      <div style={{
        background: event.fallback,
        minHeight: 90,
        display: "flex",
        alignItems: "flex-end",
        padding: "12px 14px 10px",
        position: "relative",
      }}>
        {event.hot && (
          <div style={{
            position: "absolute",
            top: 10,
            left: 12,
            background: "rgba(0,0,0,0.35)",
            borderRadius: 20,
            padding: "2px 8px",
            fontSize: 9,
            fontFamily: "-apple-system, sans-serif",
            fontWeight: 700,
            letterSpacing: 1.5,
            color: "#FFD580",
            textTransform: "uppercase",
          }}>🔥 À ne pas manquer</div>
        )}
        {event.free && (
          <div style={{
            position: "absolute",
            top: 10,
            right: 44,
            background: "rgba(255,255,255,0.25)",
            borderRadius: 20,
            padding: "2px 8px",
            fontSize: 9,
            fontFamily: "-apple-system, sans-serif",
            fontWeight: 700,
            letterSpacing: 1.5,
            color: WHITE,
            textTransform: "uppercase",
          }}>Entrée libre</div>
        )}
        <div style={{ fontSize: 28, marginRight: 10, lineHeight: 1 }}>{event.emoji}</div>
        <div style={{
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          fontWeight: "bold",
          fontSize: 15,
          letterSpacing: 0.5,
          textTransform: "uppercase",
          color: WHITE,
          lineHeight: 1.15,
          whiteSpace: "pre-line",
          flex: 1,
          textShadow: "0 1px 4px rgba(0,0,0,0.4)",
        }}>
          {event.title}
        </div>
        <button
          onClick={e => { e.stopPropagation(); onToggleFav(event.id); }}
          style={{
            position: "absolute",
            top: 8,
            right: 10,
            background: "rgba(0,0,0,0.25)",
            border: "none",
            borderRadius: "50%",
            width: 30,
            height: 30,
            cursor: "pointer",
            fontSize: 15,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isFav ? "❤️" : "🤍"}
        </button>
      </div>

      {/* body */}
      <div style={{ padding: "10px 14px 12px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <button
            onClick={e => { e.stopPropagation(); onCategoryClick?.(event.cat); }}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              fontFamily: "-apple-system, sans-serif",
              fontSize: 11,
              fontWeight: 600,
              color: GOLD,
              letterSpacing: 1,
              textTransform: "uppercase",
              marginBottom: 3,
              display: "block",
              textDecoration: "underline",
              textUnderlineOffset: 2,
            }}
          >
            {event.cat}
          </button>
          <div style={{
            fontFamily: "-apple-system, sans-serif",
            fontSize: 12,
            color: "#6A635A",
            marginBottom: 3,
          }}>
            {event.subtitle}
          </div>
          <div style={{
            fontFamily: "-apple-system, sans-serif",
            fontSize: 12,
            fontWeight: 600,
            color: DARK,
          }}>
            {event.date} · {event.time}
          </div>
        </div>
      </div>
    </div>
  );
}
