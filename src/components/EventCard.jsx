const GOLD = "#B8966E";
const NAVY = "#1A2A4A";
const NAVY_LIGHT = "#2A3A5A";
const GREY = "#6A7A8A";
const WHITE = "#FFFFFF";

function getBorderColor(cat) {
  if (["FOOTBALL","BASKET","FORMULE 1","FORMULE E","SPORT","RALLYE","TENNIS"].includes(cat)) return "#8B1728";
  if (["CONCERT","OPÉRA","JAZZ LIVE","DJ SET","MUSICAL","CHANTS","CINÉMA"].includes(cat)) return "#1A2A5A";
  if (["SOIRÉE","APÉRO","QUIZ NIGHT"].includes(cat)) return "#3A1A5A";
  return GOLD;
}

export default function EventCard({ event, onClick, favorites, onToggleFav, onCategoryClick }) {
  const isFav = favorites?.includes(event.id);
  const borderColor = getBorderColor(event.cat);

  return (
    /* Outer frame */
    <div
      onClick={() => onClick(event)}
      style={{
        background: WHITE,
        borderRadius: 4,
        border: `2px solid ${borderColor}`,
        marginBottom: 16,
        cursor: "pointer",
        position: "relative",
        padding: 5,
        boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
      }}
    >
      {/* Inner frame */}
      <div style={{
        border: `1px solid ${borderColor}`,
        borderRadius: 2,
        padding: "18px 16px 20px",
        position: "relative",
      }}>

        {/* Fav button */}
        <button
          onClick={e => { e.stopPropagation(); onToggleFav(event.id); }}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
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
            top: 8,
            left: 10,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "-apple-system, sans-serif",
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: borderColor,
            padding: 0,
            display: "flex",
            alignItems: "center",
            gap: 3,
            lineHeight: 1,
          }}
        ><span style={{ fontSize: 10 }}>{event.emoji}</span>{event.cat}</button>

        {/* Title */}
        <div style={{
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          fontWeight: "bold",
          fontSize: 28,
          letterSpacing: 0.5,
          textTransform: "uppercase",
          color: NAVY,
          lineHeight: 1.15,
          whiteSpace: "pre-line",
          textAlign: "center",
          marginBottom: 12,
          paddingRight: 28,
          paddingLeft: 4,
          paddingTop: 2,
        }}>
          {event.title}
        </div>

        {/* Short divider */}
        <div style={{
          width: 36,
          height: 1.5,
          background: borderColor,
          margin: "0 auto 12px",
          borderRadius: 1,
        }} />

        {/* Free badge */}
        {event.free && (
          <div style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 10,
          }}>
            <div style={{
              border: `1px solid #2A6A3A`,
              borderRadius: 20,
              padding: "3px 14px",
              fontFamily: "-apple-system, sans-serif",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1,
              color: "#1A4A2A",
            }}>✅ ENTRÉE LIBRE</div>
          </div>
        )}

        {/* Subtitle */}
        <div style={{
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          fontSize: 14,
          color: GREY,
          textAlign: "center",
          marginBottom: 8,
        }}>{event.subtitle}</div>

        {/* Date */}
        <div style={{
          fontFamily: "-apple-system, sans-serif",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 1,
          textTransform: "uppercase",
          color: NAVY,
          textAlign: "center",
          marginBottom: 14,
        }}>{event.date} · {event.time}</div>

        {/* Separator */}
        <div style={{
          height: 1,
          background: "#D8E0E8",
          marginBottom: 14,
        }} />

        {/* Description */}
        <div style={{
          fontFamily: "Georgia, serif",
          fontStyle: "normal",
          fontSize: 14,
          color: NAVY_LIGHT,
          textAlign: "center",
          lineHeight: 1.7,
        }}>{event.desc}</div>

      </div>
    </div>
  );
}
