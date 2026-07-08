import { useState } from "react";
import { Capacitor } from "@capacitor/core";
import { localizeCat, localizeTitle } from "../i18n";

const IS_NATIVE = Capacitor.isNativePlatform();

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
  { id: "concert",    label: "Concert",     labelEn: "Concert" },
  { id: "conference", label: "Conférences", labelEn: "Talks" },
  { id: "encheres",   label: "Enchères",    labelEn: "Auctions" },
  { id: "famille",    label: "Famille",     labelEn: "Family" },
  { id: "foody",      label: "Brunch · Apéro", labelEn: "Brunch · Apéro" },
  { id: "messe",      label: "Messe",       labelEn: "Mass" },
  { id: "musee",      label: "Musée",       labelEn: "Museum" },
  { id: "soiree",     label: "Soirée",      labelEn: "Nightlife" },
  { id: "sport",      label: "Sport",       labelEn: "Sport" },
  { id: "theatre",    label: "Théâtre",     labelEn: "Theatre" },
];

function addToCalendar(event) {
  const MONTHS = { jan:0, fév:1, mar:2, avr:3, mai:4, juin:5, juil:6, août:7, sep:8, oct:9, nov:10, déc:11 };
  const parts = event.date.split(' ');
  const day   = parseInt(parts[1]);
  const month = MONTHS[parts[2]];
  const year  = event.year || new Date().getFullYear();
  const t     = event.time.match(/(\d{1,2})h(\d{2})/);
  const h     = t ? parseInt(t[1]) : 12;
  const m     = t ? parseInt(t[2]) : 0;
  const pad   = n => String(n).padStart(2, '0');
  const fmt   = (y, mo, d, hh, mm) => `${y}${pad(mo+1)}${pad(d)}T${pad(hh)}${pad(mm)}00`;
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//MonacOut//FR',
    'BEGIN:VEVENT',
    `DTSTART:${fmt(year, month, day, h, m)}`,
    `DTEND:${fmt(year, month, day, h + 2, m)}`,
    `SUMMARY:${event.title.replace(/\n/g, ' ')}`,
    `DESCRIPTION:${event.desc.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.subtitle}`,
    event.link ? `URL:${event.link}` : '',
    'END:VEVENT', 'END:VCALENDAR',
  ].filter(Boolean).join('\r\n');
  const a = document.createElement('a');
  a.href = 'data:text/calendar;charset=utf8,' + encodeURIComponent(ics);
  a.download = 'event.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

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

export default function Shell({ tab, setTab, children, t, lang = "fr", setLang, catFilters = [], onCatFilter, onClearFilters, showMenu, setShowMenu, selectedEvent, onClosePopup, onToggleFav, favorites = [], adminOverlay = null, contactEmail = "contact@monacout.com", auth, social, onShowAuth, pendingCount = 0 }) {
  const [showPhone, setShowPhone] = useState(false);
  return (
    <div style={{
      minHeight: "100dvh",
      background: "#FFFFFF",
      ...(IS_NATIVE ? {} : {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px 0",
      }),
    }}>
      <div style={IS_NATIVE ? {
        width: "100%",
        height: "100dvh",
        background: WHITE,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      } : {
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
        {/* Barre haute : zone sûre sous l'encoche réelle (natif) ou fausse encoche (aperçu web) */}
        <div style={{
          flexShrink: 0,
          height: IS_NATIVE ? "env(safe-area-inset-top, 44px)" : 46,
          background: WHITE,
          position: "relative",
          zIndex: 10,
        }}>
          {!IS_NATIVE && (
            <div style={{
              position: "absolute",
              top: 10, left: "50%",
              transform: "translateX(-50%)",
              width: 120, height: 34,
              background: "#000",
              borderRadius: 20,
              zIndex: 5,
            }} />
          )}
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

        {/* Overlay admin */}
        {adminOverlay}

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
                }}>{localizeCat(selectedEvent.cat, lang)}</div>

                {/* Titre */}
                <div style={{
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontWeight: 400, fontSize: 16, color: NAVY,
                  textAlign: "center", lineHeight: 1.3, marginBottom: 14,
                }}>{localizeTitle(selectedEvent.title.replace(/\n/g, " "), lang)}</div>

                {selectedEvent.directory ? (
                  <div style={{ marginBottom: 4 }}>
                    {selectedEvent.directory.map((d, i) => {
                      const mapUrl = d.map || `https://www.google.com/maps/search/${encodeURIComponent(d.name + " Monaco")}`;
                      const isMapLink = d.link && /google\.[^/]*\/maps/.test(d.link);
                      return (
                      <div key={i} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                        padding: "11px 2px",
                        borderBottom: i < selectedEvent.directory.length - 1 ? "1px solid rgba(15,29,58,0.08)" : "none",
                      }}>
                        <span style={{ textAlign: "left", minWidth: 0 }}>
                          <span style={{ display: "block", fontFamily: "'Josefin Sans', sans-serif", fontSize: 13, color: NAVY, fontWeight: 600 }}>{d.name}</span>
                          {d.info && <span style={{ display: "block", fontFamily: "'Lato', sans-serif", fontSize: 11, color: GREY, marginTop: 2 }}>{d.info}</span>}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                          <a href={mapUrl} target="_blank" rel="noopener noreferrer" title={lang === "en" ? "Map" : "Carte"} style={{ fontSize: 15, textDecoration: "none", lineHeight: 1 }}>📍</a>
                          {d.link && !isMapLink && <a href={d.link} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, fontWeight: 600, color: GOLD, letterSpacing: 1, textDecoration: "none" }}>{lang === "en" ? "Visit →" : "Voir →"}</a>}
                        </span>
                      </div>
                      );
                    })}
                  </div>
                ) : (
                <>
                {/* Description */}
                <div style={{
                  fontFamily: "'Lato', sans-serif",
                  fontSize: 13, color: "#333", lineHeight: 1.65,
                  marginBottom: 18, textAlign: "left",
                }}>{lang === "en" ? (selectedEvent.descEn || selectedEvent.desc) : selectedEvent.desc}</div>

                {/* Amis qui y vont */}
                {(() => {
                  const going = social?.friendsGoingTo?.(selectedEvent.id) || [];
                  if (!going.length) return null;
                  const n = going.map(f => f.display_name).filter(Boolean);
                  const label = n.length === 1
                    ? (lang === "en" ? `${n[0]} is going` : `${n[0]} y va`)
                    : n.length === 2
                      ? (lang === "en" ? `${n[0]} and ${n[1]} are going` : `${n[0]} et ${n[1]} y vont`)
                      : (lang === "en" ? `${n[0]}, ${n[1]} +${n.length - 2} more are going` : `${n[0]}, ${n[1]} +${n.length - 2} autres y vont`);
                  return (
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      background: "#FFF8EC", border: `1px solid ${GOLD_FRAME}`, borderRadius: 20,
                      padding: "7px 14px", marginBottom: 16,
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill={GOLD} style={{ flexShrink: 0 }} aria-hidden="true">
                        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                      </svg>
                      <span style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, fontWeight: 600, color: NAVY, letterSpacing: 0.3 }}>{label}</span>
                    </div>
                  );
                })()}

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
                      ><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                        {selectedEvent.free ? (lang === "en" ? "Info" : "Infos") : (lang === "en" ? "Book" : "Réserver")}
                      </span></a>
                    )}
                    {selectedEvent.phone && (
                      <button
                        onClick={() => { if (showPhone) window.location.href = `tel:${selectedEvent.phone}`; else setShowPhone(true); }}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "center",
                          width: showPhone ? "auto" : 44, padding: showPhone ? "0 10px" : 0,
                          flexShrink: 0,
                          border: `1.5px solid ${GOLD}`,
                          borderRadius: 1,
                          background: "none", cursor: "pointer", color: GOLD,
                          fontFamily: "'Lato', sans-serif", fontSize: 11,
                        }}
                      >{showPhone ? selectedEvent.phone : <PhoneIcon />}</button>
                    )}
                  </div>
                )}

                {/* Ajouter au calendrier */}
                <button
                  onClick={() => addToCalendar(selectedEvent)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    width: "100%", marginTop: 10, padding: "10px 0",
                    border: `1.5px solid ${GOLD_FRAME}`,
                    borderRadius: 1, background: "none", cursor: "pointer",
                    fontFamily: "'Josefin Sans', sans-serif",
                    fontSize: 11, fontWeight: 600, letterSpacing: 1.5,
                    textTransform: "uppercase", color: NAVY,
                  }}
                >
                  {lang === "en" ? "Add to calendar" : "Ajouter au calendrier"}
                </button>
                </>
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
            top: 46, right: 0,
            width: 250, height: "calc(100% - 46px)",
            background: WHITE,
            zIndex: 1001,
            transform: showMenu ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.25s ease",
            overflowY: "auto",
            paddingBottom: 40,
            borderLeft: "1px solid rgba(196,162,65,0.3)",
            borderTop: "1px solid rgba(196,162,65,0.3)",
          }}
        >
          {/* Header menu */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 16px 10px",
            borderBottom: "1px solid rgba(196,162,65,0.2)",
            marginBottom: 8,
          }}>
            {auth?.profile?.display_name ? (
              <div style={{
                fontFamily: "'Josefin Sans', sans-serif", fontSize: 13,
                color: NAVY, letterSpacing: 0.5, minWidth: 0,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {lang === "en" ? "Hi, " : "Bonjour, "}
                <span style={{ color: GOLD, fontWeight: 600 }}>{auth.profile.display_name}</span>
              </div>
            ) : <span />}
            <button
              onClick={() => setShowMenu?.(false)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 20, color: GREY, padding: 4, lineHeight: 1, flexShrink: 0,
              }}
            >✕</button>
          </div>

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

          {/* Mon Cercle */}
          <button onClick={() => { setTab?.("friends"); setShowMenu?.(false); }} style={{
            width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer",
            padding: "14px 24px", fontFamily: "'Jost', sans-serif",
            fontSize: 15, fontWeight: tab === "friends" ? 700 : 400, color: NAVY, letterSpacing: 0.3,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={tab === "friends" ? GOLD : GREY} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            {lang === "en" ? "My Circle" : "Mon Cercle"}
            {pendingCount > 0 && (
              <span style={{
                marginLeft: "auto", background: GOLD, color: WHITE,
                borderRadius: 10, padding: "1px 7px",
                fontFamily: "'Jost', sans-serif", fontSize: 11, fontWeight: 700,
              }}>{pendingCount}</span>
            )}
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

          <div style={{ height: 1, background: "rgba(15,29,58,0.1)", margin: "12px 24px" }} />

          {/* Proposer un événement (contact organisateurs) */}
          <button onClick={() => {
            const subject = lang === "en" ? "Event submission — Monac'Out" : "Proposition d'événement — Monac'Out";
            const body = lang === "en"
              ? "Hello,\n\nI'd like to submit an event for Monac'Out:\n\n• Event name:\n• Date & time:\n• Venue (hall + district):\n• Short description:\n• Ticket / info link:\n• Venue phone:\n\nThank you!"
              : "Bonjour,\n\nJe souhaite proposer un événement pour Monac'Out :\n\n• Nom de l'événement :\n• Date & heure :\n• Lieu (salle + quartier) :\n• Courte description :\n• Lien billetterie / infos :\n• Téléphone du lieu :\n\nMerci !";
            window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          }} style={{
            width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer",
            padding: "14px 24px", fontFamily: "'Jost', sans-serif",
            fontSize: 15, fontWeight: 400, color: NAVY, letterSpacing: 0.3,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
              <rect x="1.5" y="3.5" width="15" height="11" rx="2" stroke={GOLD} strokeWidth="1.4"/>
              <path d="M2.5 5L9 9.5L15.5 5" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {lang === "en" ? "Submit an event" : "Proposer un événement"}
          </button>

          {/* Section connexion */}
          <div style={{ height: 1, background: "rgba(15,29,58,0.1)", margin: "12px 24px" }} />
          {auth?.user ? (
            <div style={{ padding: "4px 24px 16px" }}>
              <div style={{
                fontFamily: "'Lato', sans-serif", fontSize: 11, color: GREY,
                marginBottom: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {auth.profile?.display_name
                  ? `${auth.profile.display_name} · ${auth.user.email}`
                  : auth.user.email}
              </div>
              <button onClick={() => { auth.signOut(); setShowMenu?.(false); }} style={{
                width: "100%", padding: "10px 0", background: "none",
                border: `1px solid rgba(15,29,58,0.2)`, borderRadius: 1, cursor: "pointer",
                fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, fontWeight: 600,
                letterSpacing: 2, textTransform: "uppercase", color: GREY,
              }}>{lang === "en" ? "Sign out" : "Se déconnecter"}</button>
            </div>
          ) : (
            <button onClick={() => { onShowAuth?.(); setShowMenu?.(false); }} style={{
              width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer",
              padding: "14px 24px 20px", fontFamily: "'Jost', sans-serif",
              fontSize: 15, fontWeight: 400, color: NAVY, letterSpacing: 0.3,
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              {lang === "en" ? "Sign in" : "Se connecter"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
