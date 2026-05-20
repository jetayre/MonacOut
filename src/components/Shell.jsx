import { useState, useEffect } from "react";

const NAVY = "#0F1D3A";
const GOLD = "#C4A241";
const GREY = "#6A7080";
const WHITE = "#FDFAF5";

const CAT_FILTERS = [
  { id: "ateliers",   label: "Ateliers",    labelEn: "Workshops" },
  { id: "bienetre",   label: "Bien-être",   labelEn: "Wellness" },
  { id: "cinema",     label: "Cinéma",      labelEn: "Cinema" },
  { id: "conference", label: "Conférences", labelEn: "Talks" },
  { id: "culture",    label: "Culture",     labelEn: "Culture" },
  { id: "encheres",   label: "Enchères",    labelEn: "Auctions" },
  { id: "famille",    label: "Famille",     labelEn: "Family" },
  { id: "foody",      label: "Foody",       labelEn: "Foody" },
  { id: "messe",      label: "Messes",      labelEn: "Masses" },
  { id: "music",      label: "Musique",     labelEn: "Music" },
  { id: "sport",      label: "Sport",       labelEn: "Sport" },
];

function CalIcon({ color }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

function HeartIcon({ color, active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? color : "none"} stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

function HamburgerIcon({ color }) {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
      <rect y="0" width="20" height="1.8" rx="1" fill={color}/>
      <rect y="6" width="20" height="1.8" rx="1" fill={color}/>
      <rect y="12" width="20" height="1.8" rx="1" fill={color}/>
    </svg>
  );
}

export default function Shell({ tab, setTab, children, t, lang = "fr", setLang, catFilters = [], onCatFilter, onClearFilters }) {
  const [showMenu, setShowMenu] = useState(false);

  const eventsActive = tab === "events";
  const agendaActive = tab === "agenda";

  return (
    <div style={{
      minHeight: "100vh",
      background: "#E8E4DC",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px 0",
    }}>
      <div style={{
        width: 393,
        height: 852,
        background: WHITE,
        borderRadius: 54,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 24px 80px rgba(15,29,58,0.22)",
        position: "relative",
      }}>
        {/* Header: dynamic island + tab bar */}
        <div style={{
          flexShrink: 0,
          height: 90,
          background: WHITE,
          borderBottom: `1px solid rgba(15,29,58,0.12)`,
          position: "relative",
          zIndex: 10,
        }}>
          {/* Dynamic island */}
          <div style={{
            position: "absolute",
            top: 12, left: "50%",
            transform: "translateX(-50%)",
            width: 120, height: 34,
            background: "#000",
            borderRadius: 20,
            zIndex: 5,
          }} />

          {/* Tab bar — ☰ · CalIcon · HeartIcon */}
          <div style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            padding: "0 20px",
          }}>
            {/* Hamburger */}
            <button
              onClick={() => setShowMenu(true)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "6px 10px", display: "flex", alignItems: "center",
              }}
            >
              <HamburgerIcon color={NAVY} />
            </button>

            {/* Events — icône seule */}
            <button
              onClick={() => setTab("events")}
              style={{
                background: "none", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "6px 16px",
                opacity: eventsActive ? 1 : 0.45,
              }}
            >
              <CalIcon color={NAVY} />
            </button>

            {/* Agenda — icône seule */}
            <button
              onClick={() => setTab("agenda")}
              style={{
                background: "none", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "6px 16px",
                opacity: agendaActive ? 1 : 0.45,
              }}
            >
              <HeartIcon color={NAVY} active={agendaActive} />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div id="main-scroll" style={{
          flex: 1,
          overflowY: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }} className="hide-scrollbar">
          {children}
        </div>

        {/* Overlay sombre */}
        <div
          onClick={() => setShowMenu(false)}
          style={{
            position: "absolute", inset: 0,
            background: "rgba(0,0,0,0.38)",
            zIndex: 200,
            opacity: showMenu ? 1 : 0,
            pointerEvents: showMenu ? "auto" : "none",
            transition: "opacity 0.2s ease",
          }}
        />

        {/* Menu panneau glissant */}
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: "absolute",
            top: 0, right: 0,
            width: 250,
            height: "100%",
            background: WHITE,
            zIndex: 201,
            transform: showMenu ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.25s ease",
            overflowY: "auto",
            paddingTop: 96,
            paddingBottom: 40,
            borderLeft: "1px solid rgba(196,162,65,0.3)",
          }}
        >
          {/* Fermer */}
          <button
            onClick={() => setShowMenu(false)}
            style={{
              position: "absolute", top: 100, right: 16,
              background: "none", border: "none", cursor: "pointer",
              fontSize: 20, color: GREY, padding: 4, lineHeight: 1,
            }}
          >✕</button>

          {/* Français */}
          <button
            onClick={() => setLang?.("fr")}
            style={{
              width: "100%", textAlign: "left",
              background: "none", border: "none", cursor: "pointer",
              padding: "14px 24px",
              fontFamily: "'Jost', sans-serif",
              fontSize: 15, fontWeight: lang === "fr" ? 700 : 400,
              color: NAVY, letterSpacing: 0.3,
              display: "flex", alignItems: "center", gap: 12,
            }}
          >
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              background: lang === "fr" ? GOLD : "transparent",
              border: `1.5px solid ${lang === "fr" ? GOLD : GREY}`,
              flexShrink: 0,
            }} />
            Français
          </button>

          {/* English */}
          <button
            onClick={() => setLang?.("en")}
            style={{
              width: "100%", textAlign: "left",
              background: "none", border: "none", cursor: "pointer",
              padding: "14px 24px",
              fontFamily: "'Jost', sans-serif",
              fontSize: 15, fontWeight: lang === "en" ? 700 : 400,
              color: NAVY, letterSpacing: 0.3,
              display: "flex", alignItems: "center", gap: 12,
            }}
          >
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              background: lang === "en" ? GOLD : "transparent",
              border: `1.5px solid ${lang === "en" ? GOLD : GREY}`,
              flexShrink: 0,
            }} />
            English
          </button>

          {/* Séparateur */}
          <div style={{ height: 1, background: "rgba(15,29,58,0.1)", margin: "8px 24px 12px" }} />

          {/* My Agenda */}
          <button
            onClick={() => { setTab("agenda"); setShowMenu(false); }}
            style={{
              width: "100%", textAlign: "left",
              background: "none", border: "none", cursor: "pointer",
              padding: "14px 24px",
              fontFamily: "'Jost', sans-serif",
              fontSize: 15, fontWeight: tab === "agenda" ? 700 : 400,
              color: NAVY, letterSpacing: 0.3,
              display: "flex", alignItems: "center", gap: 12,
            }}
          >
            <HeartIcon color={tab === "agenda" ? GOLD : GREY} active={tab === "agenda"} />
            {lang === "en" ? "My Agenda" : "Mon Agenda"}
          </button>

          {/* Séparateur */}
          <div style={{ height: 1, background: "rgba(15,29,58,0.1)", margin: "8px 24px 12px" }} />

          {/* Catégories multi-select */}
          {CAT_FILTERS.map(f => {
            const active = catFilters.includes(f.id);
            return (
              <button
                key={f.id}
                onClick={() => onCatFilter?.(f.id)}
                style={{
                  width: "100%", textAlign: "left",
                  background: "none", border: "none", cursor: "pointer",
                  padding: "11px 24px",
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 14, fontWeight: active ? 600 : 400,
                  color: active ? NAVY : GREY, letterSpacing: 0.2,
                  display: "flex", alignItems: "center", gap: 12,
                }}
              >
                <span style={{
                  width: 16, height: 16, borderRadius: 3,
                  border: `1.5px solid ${active ? GOLD : "rgba(15,29,58,0.3)"}`,
                  background: active ? GOLD : "transparent",
                  flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {active && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                {lang === "en" ? f.labelEn : f.label}
              </button>
            );
          })}

          {/* Tout effacer */}
          {catFilters.length > 0 && (
            <button
              onClick={() => onClearFilters?.()}
              style={{
                width: "100%", textAlign: "center",
                background: "none", border: "none", cursor: "pointer",
                padding: "14px 24px",
                fontFamily: "'Jost', sans-serif",
                fontSize: 11, fontWeight: 700,
                color: GOLD, letterSpacing: 1.2,
                textTransform: "uppercase",
                marginTop: 8,
              }}
            >{lang === "en" ? "Clear all" : "Tout effacer"}</button>
          )}
        </div>
      </div>
    </div>
  );
}
