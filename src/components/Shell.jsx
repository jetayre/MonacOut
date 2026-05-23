import { useState } from "react";

const NAVY = "#0F1D3A";
const GOLD = "#C4A241";
const GOLD_FRAME = "#C9A96E";
const BLUE = "#9FC3DC";
const GREY = "#6A7080";
const WHITE = "#FFFFFF";
const CREAM = "#FFFFFF";

const CAT_FILTERS = [
  { id: "ateliers",   label: "Ateliers",    labelEn: "Workshops" },
  { id: "bienetre",   label: "Bien-être",   labelEn: "Wellness" },
  { id: "cinema",     label: "Cinéma",      labelEn: "Cinema" },
  { id: "conference", label: "Conférences", labelEn: "Talks" },
  { id: "culture",    label: "Culture",     labelEn: "Culture" },
  { id: "encheres",   label: "Enchères",    labelEn: "Auctions" },
  { id: "famille",    label: "Famille",     labelEn: "Family" },
  { id: "foody",      label: "Foody",       labelEn: "Foody" },
  { id: "music",      label: "Musique",     labelEn: "Music" },
  { id: "messe",      label: "Messe",       labelEn: "Mass" },
  { id: "sport",      label: "Sport",       labelEn: "Sport" },
];

function PhoneIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.5 11.5 0 0 0 3.6.57 1 1 0 0 1 1 1V21a1 1 0 0 1-1 1A17 17 0 0 1 3 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.5 11.5 0 0 0 .57 3.6 1 1 0 0 1-.25 1z"/>
    </svg>
  );
}

function HeartIcon({ color, active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={active ? color : "none"} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

export default function Shell({ tab, setTab, children, t, lang = "fr", setLang, catFilters = [], onCatFilter, onClearFilters, showMenu, setShowMenu, selectedEvent, onClosePopup, onToggleFav, favorites = [] }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#FFFFFF",
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
        {/* Dynamic island seul */}
        <div style={{
          flexShrink: 0,
          height: 46,
          background: WHITE,
          position: "relative",
          zIndex: 10,
        }}>
          <div style={{
            position: "absolute",
            top: 10, left: "50%",
            transform: "translateX(-50%)",
            width: 120, height: 34,
            background: "#000",
            borderRadius: 20,
            zIndex: 5,
          }} />
        </div>

        {/* Contenu scrollable */}
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
          onClick={() => setShowMenu?.(false)}
          style={{
            position: "absolute", inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 400,
            opacity: showMenu ? 1 : 0,
            pointerEvents: showMenu ? "auto" : "none",
            transition: "opacity 0.2s ease",
          }}
        />

        {/* Popup événement */}
        {selectedEvent && (
          <>
            <div onClick={onClosePopup} style={{
              position: "absolute", inset: 0,
              background: "rgba(0,0,0,0.55)",
              zIndex: 600,
            }} />
            <div style={{
              position: "absolute",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: 300,
              zIndex: 601,
              border: `1.5px solid ${GOLD_FRAME}`,
              borderRadius: 2,
              padding: 4,
              background: WHITE,
            }}>
              <div style={{
                position: "relative",
                border: `1.5px solid ${BLUE}`,
                borderRadius: 1,
                background: CREAM,
                padding: "22px 20px 20px",
              }}>
                {/* Fermer */}
                <button onClick={onClosePopup} style={{
                  position: "absolute", top: 10, right: 12,
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 16, color: GREY, lineHeight: 1, padding: 0,
                }}>✕</button>

                {/* Catégorie */}
                <div style={{
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontSize: 10, fontWeight: 600, letterSpacing: 3,
                  textTransform: "uppercase", color: GOLD,
                  marginBottom: 6, textAlign: "center",
                }}>{selectedEvent.cat}</div>

                {/* Titre */}
                <div style={{
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontWeight: 400, fontSize: 16, color: NAVY,
                  textAlign: "center", lineHeight: 1.3, marginBottom: 14,
                }}>{selectedEvent.title.replace(/\n/g, " ")}</div>

                {/* Description */}
                <div style={{
                  fontFamily: "'Lato', sans-serif",
                  fontSize: 13, color: "#333", lineHeight: 1.65,
                  marginBottom: 18, textAlign: "left",
                }}>{lang === "en" ? (selectedEvent.descEn || selectedEvent.desc) : selectedEvent.desc}</div>

                {/* Coeur */}
                <div style={{ textAlign: "center", marginBottom: 14 }}>
                  <button
                    onClick={() => onToggleFav?.(selectedEvent.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 26, lineHeight: 1 }}
                  >{favorites.includes(selectedEvent.id) ? "❤️" : "🤍"}</button>
                </div>

                {/* Je réserve + téléphone */}
                {(selectedEvent.link || selectedEvent.phone) && (
                  <div style={{ display: "flex", gap: 8, alignItems: "stretch", justifyContent: "center" }}>
                    {selectedEvent.link && (
                      <a
                        href={selectedEvent.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          flex: selectedEvent.phone ? 1 : "0 0 auto",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: "'Josefin Sans', sans-serif",
                          fontSize: 11, fontWeight: 600, letterSpacing: 2,
                          textTransform: "uppercase", color: WHITE,
                          background: NAVY, padding: "11px 24px",
                          textDecoration: "none", borderRadius: 1,
                        }}
                      >{selectedEvent.free ? (lang === "en" ? "More info" : "Plus d'infos") : (lang === "en" ? "Book" : "Je réserve")}</a>
                    )}
                    {selectedEvent.phone && (
                      <a
                        href={`tel:${selectedEvent.phone}`}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "center",
                          width: 44, flexShrink: 0,
                          border: `1.5px solid ${GOLD}`,
                          borderRadius: 1,
                          textDecoration: "none", color: GOLD,
                        }}
                      ><PhoneIcon /></a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Menu panneau */}
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: "absolute",
            top: 0, right: 0,
            width: 250, height: "100%",
            background: WHITE,
            zIndex: 401,
            transform: showMenu ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.25s ease",
            overflowY: "auto",
            paddingTop: 56,
            paddingBottom: 40,
            borderLeft: "1px solid rgba(196,162,65,0.3)",
          }}
        >
          <button
            onClick={() => setShowMenu?.(false)}
            style={{
              position: "absolute", top: 60, right: 16,
              background: "none", border: "none", cursor: "pointer",
              fontSize: 20, color: GREY, padding: 4, lineHeight: 1,
            }}
          >✕</button>

          {/* Français */}
          <button onClick={() => setLang?.("fr")} style={{
            width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer",
            padding: "14px 24px", fontFamily: "'Jost', sans-serif",
            fontSize: 15, fontWeight: lang === "fr" ? 700 : 400, color: NAVY, letterSpacing: 0.3,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
              background: lang === "fr" ? GOLD : "transparent",
              border: `1.5px solid ${lang === "fr" ? GOLD : GREY}`,
            }} />
            Français
          </button>

          {/* English */}
          <button onClick={() => setLang?.("en")} style={{
            width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer",
            padding: "14px 24px", fontFamily: "'Jost', sans-serif",
            fontSize: 15, fontWeight: lang === "en" ? 700 : 400, color: NAVY, letterSpacing: 0.3,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
              background: lang === "en" ? GOLD : "transparent",
              border: `1.5px solid ${lang === "en" ? GOLD : GREY}`,
            }} />
            English
          </button>

          <div style={{ height: 1, background: "rgba(15,29,58,0.1)", margin: "8px 24px 12px" }} />

          {/* My Agenda */}
          <button onClick={() => { setTab?.("agenda"); setShowMenu?.(false); }} style={{
            width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer",
            padding: "14px 24px", fontFamily: "'Jost', sans-serif",
            fontSize: 15, fontWeight: tab === "agenda" ? 700 : 400, color: NAVY, letterSpacing: 0.3,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <HeartIcon color={tab === "agenda" ? GOLD : GREY} active={tab === "agenda"} />
            {lang === "en" ? "My Agenda" : "Mon Agenda"}
          </button>

          <div style={{ height: 1, background: "rgba(15,29,58,0.1)", margin: "8px 24px 12px" }} />

          {/* Catégories */}
          {CAT_FILTERS.map(f => {
            const active = catFilters.includes(f.id);
            return (
              <button key={f.id} onClick={() => onCatFilter?.(f.id)} style={{
                width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer",
                padding: "11px 24px", fontFamily: "'Jost', sans-serif",
                fontSize: 14, fontWeight: active ? 600 : 400, color: active ? NAVY : GREY,
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <span style={{
                  width: 16, height: 16, borderRadius: 3, flexShrink: 0,
                  border: `1.5px solid ${active ? GOLD : "rgba(15,29,58,0.3)"}`,
                  background: active ? GOLD : "transparent",
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

          {catFilters.length > 0 && (
            <button onClick={() => onClearFilters?.()} style={{
              width: "100%", textAlign: "center", background: "none", border: "none", cursor: "pointer",
              padding: "14px 24px", fontFamily: "'Jost', sans-serif",
              fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: 1.2, textTransform: "uppercase",
              marginTop: 8,
            }}>{lang === "en" ? "Clear all" : "Tout effacer"}</button>
          )}
        </div>
      </div>
    </div>
  );
}
