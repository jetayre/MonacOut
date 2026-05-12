import { useState } from "react";
import { ALL_EVENTS } from "../../data/events";

const NAVY = "#1A2A5A";
const GOLD = "#B8966E";
const DARK = "#1A2A5A";
const GREY = "#6A7A9A";
const WHITE = "#FFFFFF";
const LIGHT = "#F5F5FA";

const PINS = [
  { name: "Grimaldi Forum", x: 72, y: 30, color: "#C8A8D8", events: ["MUSICAL","SALON"] },
  { name: "Opéra Garnier", x: 65, y: 40, color: "#B8A8D0", events: ["CONCERT"] },
  { name: "Musée Océano", x: 38, y: 72, color: "#90B8D0", events: ["EXPOSITION"] },
  { name: "Stade Louis II", x: 22, y: 62, color: "#D0A8A8", events: ["FOOTBALL"] },
  { name: "Salle Médecin", x: 55, y: 52, color: "#D4B898", events: ["BASKET"] },
  { name: "Circuit Monaco", x: 60, y: 44, color: "#D4B8A0", events: ["FORMULE 1"] },
  { name: "Marché Condamine", x: 45, y: 48, color: "#A8C8B0", events: ["FAMILLE"] },
  { name: "La Note Bleue", x: 80, y: 20, color: "#90D8F8", events: ["JAZZ LIVE","DJ SET"] },
];

export default function MapScreen({ onSelectEvent, onCategoryClick, lang = "fr" }) {
  const [active, setActive] = useState(null);

  const pinEvents = active
    ? ALL_EVENTS.filter(e => active.events.includes(e.cat))
    : [];

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
        }}>{lang === "en" ? "Map" : "Carte"}</div>
        <div style={{
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          fontSize: 13,
          color: "#D4B896",
          marginTop: 2,
        }}>{lang === "en" ? "Principality of Monaco" : "Principauté de Monaco"}</div>
      </div>

      {/* Map */}
      <div style={{ padding: "16px 16px 0" }}>
        <div style={{
          position: "relative",
          width: "100%",
          paddingBottom: "75%",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
        }}>
          <svg
            viewBox="0 0 100 75"
            style={{
              position: "absolute",
              top: 0, left: 0,
              width: "100%", height: "100%",
            }}
          >
            {/* Sea */}
            <rect width="100" height="75" fill="#D0E4F0" />

            {/* Land — stylized Monaco shape */}
            <path
              d="M10,70 L10,55 Q12,40 20,35 L30,32 Q38,28 45,30 L55,28 Q65,25 75,28 L85,30 Q92,35 90,45 L88,55 Q85,65 80,70 Z"
              fill="#F0ECE8"
              stroke="#D8D0C8"
              strokeWidth="0.5"
            />

            {/* Roads */}
            <path d="M20,55 Q40,48 60,45 Q75,43 88,50" fill="none" stroke="#E0D8D0" strokeWidth="0.8" />
            <path d="M45,30 L45,70" fill="none" stroke="#E0D8D0" strokeWidth="0.6" />
            <path d="M30,32 Q35,50 38,70" fill="none" stroke="#E0D8D0" strokeWidth="0.5" />

            {/* Water label */}
            <text x="15" y="20" fill="#8BACC0" fontSize="4" fontFamily="Georgia, serif" fontStyle="italic">
              Mer Méditerranée
            </text>

            {/* Pins */}
            {PINS.map((pin, i) => (
              <g key={i} onClick={() => setActive(active?.name === pin.name ? null : pin)} style={{ cursor: "pointer" }}>
                <circle
                  cx={pin.x}
                  cy={pin.y}
                  r={active?.name === pin.name ? 5 : 3.5}
                  fill={pin.color}
                  stroke={active?.name === pin.name ? NAVY : WHITE}
                  strokeWidth={active?.name === pin.name ? 1.5 : 1}
                  opacity={0.9}
                />
                {active?.name === pin.name && (
                  <text
                    x={pin.x}
                    y={pin.y - 6}
                    textAnchor="middle"
                    fill={DARK}
                    fontSize="3.5"
                    fontFamily="-apple-system, sans-serif"
                    fontWeight="bold"
                  >{pin.name}</text>
                )}
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Legend */}
      <div style={{ padding: "14px 16px 0" }}>
        <div style={{
          fontFamily: "-apple-system, sans-serif",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: NAVY,
          marginBottom: 10,
        }}>
          {active ? `📍 ${active.name}` : "Lieux culturels & sportifs"}
        </div>

        {!active && (
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
          }}>
            {PINS.map((pin, i) => (
              <button
                key={i}
                onClick={() => setActive(pin)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 10px",
                  background: WHITE,
                  borderRadius: 20,
                  border: "1px solid #E8E0D4",
                  cursor: "pointer",
                  fontFamily: "-apple-system, sans-serif",
                  fontSize: 11,
                  color: DARK,
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: pin.color }} />
                {pin.name}
              </button>
            ))}
          </div>
        )}

        {active && pinEvents.length > 0 && (
          <div>
            {pinEvents.slice(0, 3).map(e => (
              <div
                key={e.id}
                onClick={() => onSelectEvent(e)}
                style={{
                  background: WHITE,
                  borderRadius: 14,
                  padding: "10px 14px",
                  marginBottom: 8,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                <span style={{ fontSize: 20 }}>{e.emoji}</span>
                <div>
                  <div style={{
                    fontFamily: "Georgia, serif",
                    fontStyle: "italic",
                    fontWeight: "bold",
                    fontSize: 13,
                    color: DARK,
                    textTransform: "uppercase",
                    whiteSpace: "pre-line",
                    lineHeight: 1.2,
                  }}>{e.title.replace(/\n/g, " ")}</div>
                  <div style={{
                    fontFamily: "-apple-system, sans-serif",
                    fontSize: 11,
                    color: GREY,
                    marginTop: 2,
                  }}>{e.date} · {e.time}</div>
                  <button
                    onClick={ev => { ev.stopPropagation(); onCategoryClick?.(e.cat); }}
                    style={{
                      background: "none", border: "none", padding: 0, cursor: "pointer",
                      fontFamily: "-apple-system, sans-serif", fontSize: 10,
                      fontWeight: 700, color: NAVY, letterSpacing: 1,
                      textTransform: "uppercase", marginTop: 2,
                      textDecoration: "underline", textUnderlineOffset: 2,
                    }}
                  >{e.cat}</button>
                </div>
              </div>
            ))}
            <button
              onClick={() => setActive(null)}
              style={{
                background: "none",
                border: "none",
                color: NAVY,
                fontFamily: "-apple-system, sans-serif",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                padding: "4px 0",
              }}
            >← Voir tous les lieux</button>
          </div>
        )}

        {active && pinEvents.length === 0 && (
          <div style={{
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            color: GREY,
            fontSize: 14,
            padding: "10px 0",
          }}>Aucun événement à venir pour ce lieu.</div>
        )}
      </div>
    </div>
  );
}
