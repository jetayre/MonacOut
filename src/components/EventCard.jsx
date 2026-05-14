const GOLD = "#C4A46B";
const NAVY = "#1A2A5A";
const NAVY_LIGHT = "#2A3A6A";
const GREY = "#6A7A8A";
const WHITE = "#FFFFFF";

function getBorderColor(cat) {
  if (["FOOTBALL","BASKET","FORMULE 1","FORMULE E","SPORT","RALLYE","TENNIS"].includes(cat)) return "#8B1728";
  if (["CONCERT","OPÉRA","JAZZ LIVE","DJ SET","MUSICAL","CHANTS","CINÉMA"].includes(cat)) return "#1A2A5A";
  if (["SOIRÉE","APÉRO","QUIZ NIGHT"].includes(cat)) return "#3A1A5A";
  if (["ATELIER","DANSE","EXPOSITION","FESTIVAL","SPECTACLE","GALA","THÉÂTRE"].includes(cat)) return "#5A1A7A";
  if (["BIEN-ÊTRE"].includes(cat)) return "#1A6A5A";
  if (["CONFÉRENCE"].includes(cat)) return "#1A4A2A";
  if (["FOODY","BRUNCH"].includes(cat)) return "#C85A1A";
  if (["ENCHÈRES"].includes(cat)) return "#6A5010";
  return NAVY;
}

export default function EventCard({ event, onClick, favorites, onToggleFav, onCategoryClick, lang = "fr" }) {
  const isFav = favorites?.includes(event.id);
  const borderColor = getBorderColor(event.cat);

  return (
    /* Outer frame */
    <div
      onClick={() => onClick(event)}
      style={{
        background: WHITE,
        borderRadius: 4,
        border: `1px solid ${borderColor}`,
        marginBottom: 16,
        cursor: "pointer",
        position: "relative",
        padding: 5,
        boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
      }}
    >
      {/* Inner frame */}
      <div style={{
        border: `2px solid ${borderColor}`,
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
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontStyle: "italic",
          fontWeight: 600,
          fontSize: 26,
          letterSpacing: 0.5,
          color: NAVY,
          lineHeight: 1.15,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textAlign: "center",
          marginBottom: 12,
          paddingRight: 28,
          paddingLeft: 4,
          paddingTop: 2,
        }}>
          {event.title.replace(/\n/g, " ")}
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
            }}>{lang === "en" ? "✅ FREE ENTRY" : "✅ ENTRÉE LIBRE"}</div>
          </div>
        )}

        {/* Subtitle */}
        <div style={{
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          fontSize: 13,
          color: GREY,
          textAlign: "left",
          marginBottom: 6,
        }}>{event.subtitle}</div>

        {/* Date */}
        <div style={{
          fontFamily: "-apple-system, sans-serif",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 1,
          textTransform: "uppercase",
          color: NAVY,
          textAlign: "left",
          marginBottom: 12,
        }}>{event.date} {event.year || 2026} · {event.time}</div>

        {/* Separator */}
        <div style={{
          height: 1,
          background: "#DDE0F0",
          marginBottom: 12,
        }} />

        {/* Description */}
        <div style={{
          fontFamily: "Georgia, serif",
          fontStyle: "normal",
          fontSize: 13,
          color: NAVY_LIGHT,
          textAlign: "left",
          lineHeight: 1.6,
        }}>{event.desc}</div>

        {event.link && (
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                fontFamily: "-apple-system, sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                color: WHITE,
                background: borderColor,
                padding: "6px 18px",
                borderRadius: 20,
                textDecoration: "none",
                display: "inline-block",
              }}
            >{event.free ? "Je participe" : "Réserver"}</a>
          </div>
        )}

      </div>
    </div>
  );
}
