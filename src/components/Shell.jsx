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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

function HeartIcon({ color, active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={active ? color : "none"} stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

function HamburgerIcon({ color }) {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
      <rect y="0" width="18" height="1.5" rx="1" fill={color}/>
      <rect y="6" width="18" height="1.5" rx="1" fill={color}/>
      <rect y="12" width="18" height="1.5" rx="1" fill={color}/>
    </svg>
  );
}

export default function Shell({ tab, setTab, children, t, lang = "fr", setLang, catFilters = [], onCatFilter, onClearFilters, showSearch, setShowSearch }) {
  const [showMenu, setShowMenu] = useState(false);

  const activeEventsTab = tab === "events";
  const activeAgendaTab = tab === "agenda";
  const eventsColor = activeEventsTab ? NAVY : "#9AA0B0";
  const agendaColor = activeAgendaTab ? NAVY : "#9AA0B0";

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

          {/* Tab bar */}
          <div style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            height: 44,
            display: "flex",
            alignItems: "center",
            padding: "0 10px",
            gap: 0,
          }}>
            {/* Hamburger — left */}
            <button
              onClick={() => setShowMenu(true)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "6px 8px", flexShrink: 0,
                display: "flex", alignItems: "center",
              }}
            >
              <HamburgerIcon color={NAVY} />
            </button>

            {/* Events tab (icon only) */}
            <button
              onClick={() => setTab("events")}
              style={{
                flex: 1, background: "none", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <CalIcon color={eventsColor} />
            </button>

            {/* Agenda tab */}
            <button
              onClick={() => setTab("agenda")}
              style={{
                flex: 1, background: "none", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                fontFamily: "'Jost', -apple-system, sans-serif", fontSize: 13,
                fontWeight: activeAgendaTab ? 600 : 500, color: agendaColor, letterSpacing: 0.3,
              }}
            >
              <HeartIcon color={agendaColor} active={activeAgendaTab} />
              {t?.nav?.agenda || "My Agenda"}
            </button>

            {/* Search icon — right */}
            <button
              onClick={() => setShowSearch?.(s => !s)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "6px 8px", flexShrink: 0, display: "flex", alignItems: "center", opacity: 0.6,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7"/>
                <line x1="16.5" y1="16.5" x2="22" y2="22"/>
              </svg>
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

        {/* Menu overlay */}
        <div
          onClick={() => setShowMenu(false)}
          style={{
            position: "absolute", inset: 0,
            background: "rgba(0,0,0,0.35)",
            zIndex: 200,
            opacity: showMenu ? 1 : 0,
            pointerEvents: showMenu ? "auto" : "none",
            transition: "opacity 0.2s ease",
          }}
        />

        {/* Slide-in menu panel */}
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: "absolute",
            top: 0, right: 0,
            width: 240,
            height: "100%",
            background: WHITE,
            zIndex: 201,
            transform: showMenu ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.25s ease",
            overflowY: "auto",
            paddingTop: 90,
            paddingBottom: 40,
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setShowMenu(false)}
            style={{
              position: "absolute", top: 100, right: 16,
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'Jost', sans-serif", fontSize: 20,
              color: GREY, lineHeight: 1, padding: 4,
            }}
          >✕</button>

          {/* Language — Français */}
          <button
            onClick={() => { setLang?.("fr"); }}
            style={{
              width: "100%", textAlign: "left",
              background: "none", border: "none", cursor: "pointer",
              padding: "14px 24px",
              fontFamily: "'Jost', sans-serif",
              fontSize: 15, fontWeight: lang === "fr" ? 700 : 400,
              color: NAVY, letterSpacing: 0.3,
              display: "flex", alignItems: "center", gap: 10,
            }}
          >
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              background: lang === "fr" ? GOLD : "transparent",
              border: `1.5px solid ${lang === "fr" ? GOLD : GREY}`,
              flexShrink: 0,
            }}/>
            Français
          </button>

          {/* Language — English */}
          <button
            onClick={() => { setLang?.("en"); }}
            style={{
              width: "100%", textAlign: "left",
              background: "none", border: "none", cursor: "pointer",
              padding: "14px 24px",
              fontFamily: "'Jost', sans-serif",
              fontSize: 15, fontWeight: lang === "en" ? 700 : 400,
              color: NAVY, letterSpacing: 0.3,
              display: "flex", alignItems: "center", gap: 10,
            }}
          >
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              background: lang === "en" ? GOLD : "transparent",
              border: `1.5px solid ${lang === "en" ? GOLD : GREY}`,
              flexShrink: 0,
            }}/>
            English
          </button>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(15,29,58,0.1)", margin: "8px 24px 12px" }} />

          {/* Categories — multi-select */}
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
                {/* Checkbox */}
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

          {/* Clear all */}
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
