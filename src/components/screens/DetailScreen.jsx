import { ALL_EVENTS } from "../../data/events";

const NAVY = "#0F1D3A";
const GOLD = "#C4A241";
const GOLD2 = "#FFFFFF";
const GREY = "#6A6860";
const WHITE = "#FFFFFF";
const LIGHT = "#FFFFFF";
const BORDER = "rgba(15,29,58,0.12)";

function handleShare(event, lang) {
  if (navigator.share) {
    navigator.share({
      title: event.title.replace(/\n/g, " "),
      text: `${event.subtitle} · ${event.date} · ${event.time}`,
      url: window.location.href,
    }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
  }
}

export default function DetailScreen({ event, onBack, favorites, onToggleFav, onSelectEvent, onCategoryClick, lang = "fr" }) {
  if (!event) return null;
  const isFav = favorites?.includes(event.id);

  const related = ALL_EVENTS
    .filter(e => e.id !== event.id && e.cat === event.cat)
    .slice(0, 3);

  return (
    <div style={{ background: LIGHT, minHeight: "100%" }}>
      {/* Hero */}
      <div style={{
        background: event.fallback,
        minHeight: 220,
        padding: "60px 20px 24px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}>
        <button
          onClick={onBack}
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            background: "rgba(0,0,0,0.3)",
            border: "none",
            borderRadius: 20,
            padding: "6px 14px",
            color: WHITE,
            fontFamily: "'Jost', -apple-system, sans-serif",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >{lang === "en" ? "← Back" : "← Retour"}</button>

        <button
          onClick={() => handleShare(event, lang)}
          style={{
            position: "absolute",
            top: 14,
            right: 62,
            background: "rgba(0,0,0,0.3)",
            border: "none",
            borderRadius: "50%",
            width: 38,
            height: 38,
            cursor: "pointer",
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >🔗</button>

        <button
          onClick={() => onToggleFav(event.id)}
          style={{
            position: "absolute",
            top: 14,
            right: 16,
            background: "rgba(0,0,0,0.3)",
            border: "none",
            borderRadius: "50%",
            width: 38,
            height: 38,
            cursor: "pointer",
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >{isFav ? "❤️" : "🤍"}</button>

        {/* Clickable cat badge */}
        <button
          onClick={() => onCategoryClick?.(event.cat)}
          style={{
            alignSelf: "flex-start",
            background: "rgba(0,0,0,0.3)",
            border: "none",
            borderRadius: 20,
            padding: "3px 10px",
            fontFamily: "'Jost', -apple-system, sans-serif",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: WHITE,
            marginBottom: 10,
            cursor: "pointer",
            textDecoration: "underline",
            textUnderlineOffset: 2,
          }}
        >{event.emoji} {event.cat}</button>

        <div style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontStyle: "italic",
          fontWeight: 600,
          fontSize: 32,
          color: WHITE,
          textTransform: "uppercase",
          lineHeight: 1.1,
          whiteSpace: "pre-line",
          textShadow: "0 2px 8px rgba(0,0,0,0.4)",
          letterSpacing: 0.3,
        }}>{event.title}</div>
      </div>

      {/* Body */}
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{
          fontFamily: "'Libre Baskerville', Georgia, serif",
          fontStyle: "italic",
          fontSize: 13,
          color: GREY,
          marginBottom: 4,
        }}>{event.subtitle}</div>

        <div style={{
          fontFamily: "'Jost', -apple-system, sans-serif",
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: 0.5,
          color: NAVY,
          marginBottom: 16,
        }}>{event.date} · {event.time}</div>

        <div style={{ height: 1, background: BORDER, marginBottom: 16 }} />

        <div style={{
          fontFamily: "'Libre Baskerville', Georgia, serif",
          fontStyle: "italic",
          fontSize: 15,
          color: NAVY,
          lineHeight: 1.85,
          marginBottom: 20,
        }}>{event.desc}</div>

        {event.free && (
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "#E8F4EC",
            borderRadius: 20,
            padding: "6px 14px",
            marginBottom: 20,
          }}>
            <span style={{ fontSize: 14 }}>✅</span>
            <span style={{
              fontFamily: "'Jost', -apple-system, sans-serif",
              fontSize: 12,
              fontWeight: 700,
              color: "#2A7A3A",
            }}>{lang === "en" ? "Free entry" : "Entrée libre"}</span>
          </div>
        )}

        <div style={{
          fontFamily: "'Jost', -apple-system, sans-serif",
          fontSize: 11,
          color: GREY,
          marginBottom: 20,
        }}>{lang === "en" ? "Source: " : "Source : "}{event.source}</div>

        {event.link && (
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              background: `linear-gradient(135deg, ${NAVY}, #1A2D4A)`,
              borderRadius: 16,
              padding: "14px 20px",
              textAlign: "center",
              textDecoration: "none",
              color: GOLD2,
              fontFamily: "'Playfair Display', Georgia, serif",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: 16,
              letterSpacing: 0.3,
            }}
          >
            {event.free
              ? (lang === "en" ? "More info →" : "Plus d'infos →")
              : (lang === "en" ? "Book →" : "Réserver →")}
          </a>
        )}
        {event.phone && (
          <a
            href={`tel:${event.phone}`}
            style={{
              display: "block",
              marginTop: 10,
              border: `1.5px solid ${GOLD}`,
              borderRadius: 16,
              padding: "12px 20px",
              textAlign: "center",
              textDecoration: "none",
              color: GOLD,
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontStyle: "italic",
              fontSize: 15,
              letterSpacing: 0.3,
            }}
          >📞 {event.phone}</a>
        )}
      </div>

      {/* Voir aussi */}
      {related.length > 0 && (
        <div style={{ padding: "24px 20px 30px" }}>
          <div style={{ height: 1, background: BORDER, marginBottom: 16 }} />
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}>
            <div style={{
              fontFamily: "'Jost', -apple-system, sans-serif",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: NAVY,
            }}>{lang === "en" ? "See also · " : "Voir aussi · "}{event.cat}</div>
            <button
              onClick={() => onCategoryClick?.(event.cat)}
              style={{
                background: "none",
                border: "none",
                fontFamily: "'Jost', -apple-system, sans-serif",
                fontSize: 11,
                fontWeight: 600,
                color: NAVY,
                cursor: "pointer",
                textDecoration: "underline",
                textUnderlineOffset: 2,
              }}
            >{lang === "en" ? "See all →" : "Tout voir →"}</button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {related.map(e => (
              <div
                key={e.id}
                onClick={() => onSelectEvent(e)}
                style={{
                  background: WHITE,
                  borderRadius: 16,
                  overflow: "hidden",
                  cursor: "pointer",
                  display: "flex",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                <div style={{
                  width: 70,
                  background: e.fallback,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  flexShrink: 0,
                }}>{e.emoji}</div>
                <div style={{ padding: "10px 12px", flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontStyle: "italic",
                    fontWeight: 600,
                    fontSize: 13,
                    color: NAVY,
                    textTransform: "uppercase",
                    lineHeight: 1.2,
                    marginBottom: 3,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>{e.title.replace(/\n/g, " ")}</div>
                  <div style={{
                    fontFamily: "'Jost', -apple-system, sans-serif",
                    fontSize: 11,
                    color: GREY,
                  }}>{e.date}</div>
                </div>
                {e.hot && (
                  <div style={{
                    alignSelf: "center",
                    marginRight: 12,
                    fontSize: 12,
                  }}>🔥</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
