import { ALL_EVENTS } from "../../data/events";
import EventCard from "../EventCard";

const NAVY = "#0F1D3A";
const GOLD = "#C9A96E";
const GREY = "#6A7080";
const WHITE = "#FDFAF5";

function HamburgerIcon() {
  return (
    <svg width="18" height="13" viewBox="0 0 18 13" fill="none">
      <rect y="0" width="18" height="1.8" rx="0.9" fill={WHITE}/>
      <rect y="5.6" width="18" height="1.8" rx="0.9" fill={WHITE}/>
      <rect y="11.2" width="18" height="1.8" rx="0.9" fill={WHITE}/>
    </svg>
  );
}

function ArrowLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  );
}

export default function FavoritesScreen({ favorites, onToggleFav, onCategoryClick, lang = "fr", onNavEvents, onCardClick, events = ALL_EVENTS, loggedIn = false, onShowAuth }) {
  const favEvents = events.filter(e => favorites.includes(e.id));

  return (
    <div style={{ background: WHITE, minHeight: "100%" }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(160deg, ${NAVY} 0%, #162040 100%)`,
        padding: "16px 20px 18px",
        display: "flex", alignItems: "center", gap: 14,
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <button
          onClick={onNavEvents}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, flexShrink: 0, display: "flex", alignItems: "center" }}
        >
          <ArrowLeft />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 600, fontSize: 22, color: WHITE, letterSpacing: 0.5,
          }}>{lang === "en" ? "My Agenda" : "Mon Agenda"}</div>
          <div style={{
            fontFamily: "'Jost', sans-serif", fontSize: 12, color: GOLD, marginTop: 1,
          }}>
            {lang === "en"
              ? `${favEvents.length} saved event${favEvents.length !== 1 ? "s" : ""}`
              : `${favEvents.length} événement${favEvents.length !== 1 ? "s" : ""} sauvegardé${favEvents.length !== 1 ? "s" : ""}`}
          </div>
        </div>
        <span style={{ fontSize: 22 }}>❤️</span>
      </div>

      <div style={{ padding: "16px 16px 20px" }}>
        {/* Ligne discrète : sauvegarder ses favoris (visible seulement si pas connectée et au moins un favori) */}
        {!loggedIn && favEvents.length > 0 && onShowAuth && (
          <button
            onClick={onShowAuth}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              background: "#FFFDF7", border: `1px solid ${GOLD}`, borderRadius: 6,
              padding: "10px 14px", marginBottom: 14, cursor: "pointer", textAlign: "left",
            }}
          >
            <span style={{ fontSize: 18, flexShrink: 0 }}>☁️</span>
            <span style={{ flex: 1, fontFamily: "'Jost', sans-serif", fontSize: 13, color: NAVY, lineHeight: 1.35 }}>
              {lang === "en" ? "Save my favourites" : "Sauvegarder mes favoris"}
              <span style={{ display: "block", fontSize: 11, color: GREY, marginTop: 1 }}>
                {lang === "en" ? "Keep them even on a new phone" : "Les garder même en changeant de téléphone"}
              </span>
            </span>
            <span style={{ flexShrink: 0, color: GOLD, fontSize: 18, lineHeight: 1 }}>›</span>
          </button>
        )}
        {favEvents.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🤍</div>
            <div style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 600, fontSize: 20, color: NAVY, marginBottom: 8,
            }}>{lang === "en" ? "No favorites yet" : "Aucun favori pour l'instant"}</div>
            <div style={{
              fontFamily: "'Jost', sans-serif", fontSize: 14, color: GREY, lineHeight: 1.6,
            }}>
              {lang === "en" ? "Tap ❤️ on any event to save it here." : "Appuyez sur ❤️ sur un événement pour le retrouver ici."}
            </div>
          </div>
        ) : (
          favEvents.map(e => (
            <EventCard
              key={e.id}
              event={e}
              favorites={favorites}
              onToggleFav={onToggleFav}
              onCategoryClick={onCategoryClick}
              onCardClick={onCardClick}
              lang={lang}
            />
          ))
        )}
      </div>
    </div>
  );
}
