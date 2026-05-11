import { ALL_EVENTS } from "../../data/events";
import EventCard from "../EventCard";

const GOLD = "#B8966E";
const DARK = "#1C1612";
const GREY = "#6A635A";
const WHITE = "#FFFFFF";
const LIGHT = "#F8F4EF";

export default function FavoritesScreen({ onSelectEvent, favorites, onToggleFav, onCategoryClick }) {
  const favEvents = ALL_EVENTS.filter(e => favorites.includes(e.id));

  return (
    <div style={{ background: LIGHT, minHeight: "100%" }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(160deg, ${DARK} 0%, #2C2018 100%)`,
        padding: "20px 20px 18px",
      }}>
        <div style={{
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          fontWeight: "bold",
          fontSize: 24,
          color: WHITE,
        }}>Mes Favoris</div>
        <div style={{
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          fontSize: 13,
          color: "#D4B896",
          marginTop: 2,
        }}>
          {favEvents.length} événement{favEvents.length !== 1 ? "s" : ""} sauvegardé{favEvents.length !== 1 ? "s" : ""}
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
            }}>Aucun favori pour l'instant</div>
            <div style={{
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              fontSize: 14,
              color: GREY,
              lineHeight: 1.6,
            }}>
              Appuyez sur le ❤️ sur n'importe quel événement pour le retrouver ici.
            </div>
          </div>
        ) : (
          favEvents.map(e => (
            <EventCard
              key={e.id}
              event={e}
              onClick={onSelectEvent}
              favorites={favorites}
              onToggleFav={onToggleFav}
              onCategoryClick={onCategoryClick}
            />
          ))
        )}
      </div>
    </div>
  );
}
