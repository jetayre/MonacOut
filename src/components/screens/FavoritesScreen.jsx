import { ALL_EVENTS } from "../../data/events";
import EventCard from "../EventCard";

const NAVY = "#1A2A5A";
const GOLD = "#B8966E";
const DARK = "#1A2A5A";
const GREY = "#6A7A9A";
const WHITE = "#FFFFFF";
const LIGHT = "#F5F5FA";

export default function FavoritesScreen({ favorites, onToggleFav, onCategoryClick, lang = "fr" }) {
  const favEvents = ALL_EVENTS.filter(e => favorites.includes(e.id));

  return (
    <div style={{ background: LIGHT, minHeight: "100%" }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(160deg, ${NAVY} 0%, #0F1935 100%)`,
        padding: "20px 20px 18px",
      }}>
        <div style={{
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          fontWeight: "bold",
          fontSize: 24,
          color: WHITE,
        }}>{lang === "en" ? "My Favorites" : "Mes Favoris"}</div>
        <div style={{
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          fontSize: 13,
          color: "#D4B896",
          marginTop: 2,
        }}>
          {lang === "en"
            ? `${favEvents.length} saved event${favEvents.length !== 1 ? "s" : ""}`
            : `${favEvents.length} événement${favEvents.length !== 1 ? "s" : ""} sauvegardé${favEvents.length !== 1 ? "s" : ""}`}
        </div>
      </div>

      <div style={{ padding: "20px 16px" }}>
        {favEvents.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🤍</div>
            <div style={{
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              fontWeight: "bold",
              fontSize: 18,
              color: DARK,
              marginBottom: 8,
            }}>{lang === "en" ? "No favorites yet" : "Aucun favori pour l'instant"}</div>
            <div style={{
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              fontSize: 14,
              color: GREY,
              lineHeight: 1.6,
            }}>
              {lang === "en" ? "Tap the ❤️ on any event to save it here." : "Appuyez sur le ❤️ sur n'importe quel événement pour le retrouver ici."}
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
              lang={lang}
            />
          ))
        )}
      </div>
    </div>
  );
}
