const GOLD = "#B8966E";
const DARK = "#1C1612";
const GREY = "#6A635A";
const WHITE = "#FFFFFF";

function getBorderColor(cat) {
  if (["FOOTBALL","BASKET","FORMULE 1","SPORT","RALLYE","TENNIS"].includes(cat)) return "#8B1728";
  if (["CONCERT","OPÉRA","JAZZ LIVE","DJ SET","MUSICAL","CHANTS"].includes(cat)) return "#1A2A5A";
  if (["CINÉMA"].includes(cat)) return "#1A2A5A";
  if (["SOIRÉE","DJ SET","APÉRO","QUIZ NIGHT"].includes(cat)) return "#3A1A5A";
  return "#B8966E";
}

export default function EventCard({ event, onClick, favorites, onToggleFav, onCategoryClick }) {
  const isFav = favorites?.includes(event.id);
  const borderColor = getBorderColor(event.cat);

  return (
    <div
      onClick={() => onClick(event)}
      style={{
        background: WHITE,
        borderRadius: 12,
        border: `3px solid ${borderColor}`,
        marginBottom: 16,
        cursor: "pointer",
        position: "relative",
        padding: "20px 16px 16px",
      }}
    >
      {/* Fav button */}
      <button
        onClick={e => { e.stopPropagation(); onToggleFav(event.id); }}
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: 18,
          lineHeight: 1,
        }}
      >
        {isFav ? "❤️" : "🤍"}
      </button>

      {/* Title */}
      <div style={{
        fontFamily: "Georgia, serif",
        fontStyle: "italic",
        fontWeight: "bold",
        fontSize: 22,
        letterSpacing: 0.5,
        textTransform: "uppercase",
        color: DARK,
        lineHeight: 1.2,
        whiteSpace: "pre-line",
        textAlign: "center",
        marginBottom: 10,
        paddingRight: 24,
        paddingLeft: 4,
      }}>
        {event.title}
      </div>

      {/* Short divider */}
      <div style={{
        width: 40,
        height: 2,
        background: borderColor,
        margin: "0 auto 10px",
        borderRadius: 1,
      }} />

      {/* Category */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        marginBottom: 8,
      }}>
        <span style={{ fontSize: 14 }}>{event.emoji}</span>
        <button
          onClick={e => { e.stopPropagation(); onCategoryClick?.(event.cat); }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "-apple-system, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: borderColor,
            textDecoration: "underline",
            textUnderlineOffset: 2,
          }}
        >{event.cat}</button>
      </div>


      {/* Free badge */}
      {event.free && (
        <div style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 10,
        }}>
          <div style={{
            border: `1.5px solid #2A7A3A`,
            borderRadius: 20,
            padding: "3px 12px",
            fontFamily: "-apple-system, sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1,
            color: "#2A7A3A",
          }}>✅ ENTRÉE LIBRE</div>
        </div>
      )}

      {/* Subtitle */}
      <div style={{
        fontFamily: "Georgia, serif",
        fontStyle: "italic",
        fontSize: 13,
        color: GREY,
        textAlign: "center",
        marginBottom: 6,
      }}>{event.subtitle}</div>

      {/* Date */}
      <div style={{
        fontFamily: "-apple-system, sans-serif",
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: 1,
        textTransform: "uppercase",
        color: DARK,
        textAlign: "center",
        marginBottom: 12,
      }}>{event.date} · {event.time}</div>

      {/* Separator */}
      <div style={{
        height: 1,
        background: "#E8E0D4",
        marginBottom: 12,
      }} />

      {/* Description */}
      <div style={{
        fontFamily: "Georgia, serif",
        fontSize: 13,
        color: GREY,
        textAlign: "center",
        lineHeight: 1.7,
      }}>{event.desc}</div>
    </div>
  );
}
