import { useState } from "react";
import { fichierVersAvatar } from '../lib/avatar';
import { Capacitor } from "@capacitor/core";
import { ouvrirItineraire } from "../lib/itineraire";
import { localizeCat, localizeTitle } from "../i18n";
import { couleurCat } from "../lib/couleurs";
import BandeauWeb from "./BandeauWeb";
import VueReservation from "./VueReservation";
import { actionDeReservation } from "../lib/reservation";
import { track } from "../lib/track";
import { BORDEAU, NUIT, SERIF, SANS, RAYON, casseNaturelle } from "../lib/theme";

const IS_NATIVE = Capacitor.isNativePlatform();

const NAVY = "#0F1D3A";
const GOLD = "#7B2D26";
const GOLD_FRAME = "#7B2D26";
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
  // Stéphanie, 11 oct 2026 : « on va créer un filtre breakfast café ».
  // Le menu latéral doit proposer les mêmes entrées que la barre du haut.
  { id: "petitdej",   label: "Petit-déj · Café", labelEn: "Breakfast · Coffee" },
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

export default function Shell({ onGoingSansCompte, tab, setTab, children, lang = "fr", catFilters = [], onCatFilter, onClearFilters, showMenu, setShowMenu, selectedEvent, onClosePopup, onToggleFav, favorites = [], adminOverlay = null, contactEmail = "contact@monacout.com", auth, social, onShowAuth, pendingCount = 0 }) {
  // 🎟️ LA FICHE OUVERTE N'AVAIT AUCUN BOUTON « RÉSERVER ».
  // Stéphanie, 29 oct 2026 : « les liens réserver buguent », « quand je vais
  // voir l'événement ça ne s'affiche pas correctement ». Les cartes du fil en
  // avaient un, la fiche détaillée non : on ouvrait la fiche et on ne pouvait
  // plus rien réserver. La vue s'affiche DANS l'app, jamais dans un onglet
  // (écran noir du 7 août).
  const [resaOuverte, setResaOuverte] = useState(null);
  const [showPhone, setShowPhone] = useState(false);
  return (
    <div style={{
      minHeight: "100dvh",
      background: "#FFFFFF",
      ...(IS_NATIVE ? {} : {
        display: "flex",
        // `flex-start` et non `center` : le bandeau du site ajoute ~62 px en haut,
        // et un contenu plus haut que la fenêtre se fait COUPER par le haut quand
        // il est centré — le cadre iPhone fait déjà 852 px.
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "78px 0 20px",
      }),
    }}>
      {/* Bandeau du site — ne s'affiche jamais dans l'app native (voir BandeauWeb) */}
      <BandeauWeb lang={lang} />
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
        {/* `overflowX/overscrollBehaviorX` : l'app se laissait tirer de gauche à droite
            au doigt. La règle est aussi dans index.css, mais on la pose ICI en style
            inline parce que c'est CE conteneur qui reçoit réellement le geste. */}
        <div id="main-scroll" style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          overscrollBehaviorX: "none",
          touchAction: "pan-y",
          maxWidth: "100%",
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
              // 🚨 LA FICHE DÉBORDAIT DE L'ÉCRAN. Stéphanie, 29 oct 2026 :
              // « quand je vais voir l'événement ça ne s'affiche pas
              // correctement ». Centrée par `translate(-50%, -50%)` sans
              // hauteur maximale, une fiche à longue description dépassait en
              // HAUT comme en BAS — et le haut, coupé, emportait la catégorie
              // et le bouton de fermeture. On la borne à 86 % de la hauteur et
              // on la rend défilante.
              position: "absolute",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: 318, maxHeight: "86%",
              overflowY: "auto", WebkitOverflowScrolling: "touch",
              zIndex: 601,
              border: `1px solid ${BORDEAU}`,
              borderRadius: RAYON.md,
              padding: 0,
              background: WHITE,
            }}>
              <div style={{
                position: "relative",
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
                  fontSize: 13, fontWeight: 700, letterSpacing: 3,
                  textTransform: "uppercase", color: BORDEAU,
                  marginBottom: 6, textAlign: "center",
                }}>{localizeCat(selectedEvent.cat, lang)}</div>

                {/* Titre — en casse de phrase, comme dans le fil. Les données
                    arrivent en capitales parce que les sources les publient
                    ainsi ; `casseNaturelle` les abaisse SANS toucher aux noms
                    propres, appris sur les sous-titres. */}
                <div style={{
                  fontFamily: SERIF,
                  fontWeight: 600, fontSize: 21, color: NUIT,
                  textAlign: "center", lineHeight: 1.22, marginBottom: 14,
                }}>{casseNaturelle(localizeTitle(selectedEvent.title.replace(/\n/g, " "), lang))}</div>

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
                          {/* Le film : genre, durée, note, puis le résumé. Stéphanie,
                              11 oct 2026 : « met plutôt dans la fiche ». Un titre et une
                              heure ne disent pas si le film vous tente. Ces champs
                              n'existent que pour la carte cinéma — ailleurs, rien ne
                              s'affiche, donc rien ne bouge. */}
                          {(d.genre || d.duree || typeof d.rt === "number") && (
                            <span style={{ display: "block", fontFamily: "'Lato', sans-serif", fontSize: 11, color: GREY, marginTop: 3 }}>
                              {[d.genre, d.duree].filter(Boolean).join(" · ")}
                              {typeof d.rt === "number" && (
                                // 🍅 au-dessus de 60 %, 🤢 en dessous : la convention
                                // de Rotten Tomatoes lui-même (« fresh » / « rotten »).
                                <span style={{ fontWeight: 700, marginLeft: (d.genre || d.duree) ? 6 : 0,
                                               color: d.rt >= 60 ? "#44581C" : "#7B2D26" }}>
                                  {d.rt >= 60 ? "🍅" : "🤢"} {d.rt} %
                                </span>
                              )}
                            </span>
                          )}
                          {d.desc && (
                            <span style={{ display: "block", fontFamily: "'Lato', sans-serif", fontSize: 12,
                                           color: "#555", lineHeight: 1.55, marginTop: 6, maxWidth: 420 }}>{d.desc}</span>
                          )}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                          {/* « J'y vais » lieu par lieu, VISIBLE PAR LES AMIES.
                              L'identifiant écrit en base est composé : identifiant de la
                              fiche du jour (déduit de la DATE) × 1000 + numéro définitif
                              du lieu. Il désigne donc « ce lieu, ce soir-là » sans
                              ambiguïté et sans toucher au schéma de la base.
                              Voir scripts/lib-lieux.mjs pour le raisonnement complet. */}
                          {d.vid > 0 && (() => {
                            const idLieu = selectedEvent.id * 1000 + d.vid;
                            const jyVais = (social?.myParticipations || []).includes(idLieu);
                            const amies = social?.friendsGoingTo?.(idLieu) || [];
                            return (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                              {amies.length > 0 && (
                                <span title={amies.map(f => f.display_name).filter(Boolean).join(", ")}
                                      style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 9,
                                               fontWeight: 600, color: GOLD, whiteSpace: "nowrap" }}>
                                  {amies.map(f => (f.display_name || "").split(" ")[0]).filter(Boolean).slice(0, 2).join(", ")}
                                  {amies.length > 2 ? ` +${amies.length - 2}` : ""}
                                </span>
                              )}
                              <button
                                onClick={() => {
                                  // Sans compte : la carte qui EXPLIQUE, pas l'écran muet.
                                  if (!auth?.user) { (onGoingSansCompte || onShowAuth)?.(idLieu); return; }
                                  social?.toggleParticipation?.(idLieu);
                                }}
                                aria-pressed={jyVais}
                                style={{
                                  display: "inline-flex", alignItems: "center", gap: 3,
                                  padding: "4px 8px", cursor: "pointer",
                                  border: `1px solid ${jyVais ? GOLD : "rgba(15,29,58,0.18)"}`,
                                  borderRadius: 1, background: jyVais ? "#FFF8EC" : "none",
                                  fontFamily: "'Josefin Sans', sans-serif",
                                  fontSize: 8.5, fontWeight: 600, letterSpacing: 1,
                                  textTransform: "uppercase",
                                  color: jyVais ? GOLD : NAVY, whiteSpace: "nowrap",
                                }}
                              >
                                {jyVais ? "✓ " : ""}{lang === "en" ? "Going" : "J'y vais"}
                              </button>
                              </span>
                            );
                          })()}
                          {/* Téléphone cliquable. `tel:` ouvre le composeur du téléphone,
                              ce n'est PAS une page web : aucun risque d'écran noir comme
                              avec target="_blank". Demande de Stéphanie : une icône à
                              toucher plutôt que le numéro écrit en clair. */}
                          {d.tel && (
                            <a href={`tel:${d.tel.replace(/[^+0-9]/g, "")}`}
                               title={lang === "en" ? `Call ${d.name}` : `Appeler ${d.name}`}
                               aria-label={lang === "en" ? `Call ${d.name}` : `Appeler ${d.name}`}
                               style={{ display: "inline-flex", alignItems: "center", textDecoration: "none", lineHeight: 1 }}>
                              <svg width="17" height="17" viewBox="0 0 24 24" fill={GOLD} aria-hidden="true">
                                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                              </svg>
                            </a>
                          )}
                          {/* Une épingle de carte n'a de sens que pour un LIEU. Sur la
                              fiche cinéma, les entrées sont des FILMS : chercher
                              « Pressure Monaco » sur une carte ne mène nulle part. */}
                          {selectedEvent.cat !== "CINÉMA" && (
                            <button onClick={() => ouvrirItineraire(d.name)}
                              title={lang === "en" ? "Directions" : "Itinéraire"}
                              style={{ background: "none", border: "none", cursor: "pointer", padding: 0,
                                       fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, fontWeight: 600,
                                       color: GOLD, letterSpacing: 1 }}>
                              {lang === "en" ? "Directions →" : "Direction →"}
                            </button>
                          )}
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
                  // 🚨 SUR UNE FICHE « EN COURS », LE PRESENT MENT.
                  // La table participations ne stocke PAS de date : sur une expo ouverte
                  // des mois, on sait qu'une amie y est allee, jamais QUAND. Ecrire « y va »
                  // affirme « aujourd'hui » — Stephanie a vu deux fois Nadege et Toma
                  // annonces sur le Mariage du siecle du jour alors qu'elles y etaient
                  // allees la semaine d'avant. Le passe, lui, reste vrai quel que soit le jour.
                  // ➜ Le vrai correctif reste la colonne `jour` (voir CLAUDE.md, § A FAIRE).
                  const enCours = !!selectedEvent.ongoing;
                  const label = n.length === 1
                    ? (lang === "en" ? `${n[0]} ${enCours ? "has been" : "is going"}` : `${n[0]} ${enCours ? "y est allée" : "y va"}`)
                    : n.length === 2
                      ? (lang === "en" ? `${n[0]} and ${n[1]} ${enCours ? "have been" : "are going"}` : `${n[0]} et ${n[1]} ${enCours ? "y sont allées" : "y vont"}`)
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

                {/* 🎟️ RÉSERVER — le bouton qui manquait sur la fiche ouverte.
                    Même règle que partout : un seul mot, « Réserver une place »
                    ou « une table » selon la catégorie, et il fait le mieux
                    disponible — formulaire, site, ou téléphone.
                    ⚠️ En mode `tel`, l'objet rendu porte `tel` et PAS `url` :
                    c'est l'oubli qui, sur les cartes, envoyait l'app sur
                    `/undefined` et la rechargeait à l'accueil (29 oct). */}
                {(() => {
                  const a = actionDeReservation(selectedEvent, selectedEvent.cat, lang);
                  if (!a) return null;
                  return (
                    <button
                      onClick={() => {
                        track("reservation_clic", { mode: a.mode, cat: selectedEvent.cat,
                                                    lieu: selectedEvent.source || selectedEvent.subtitle });
                        if (a.mode === "tel") { window.location.href = `tel:${a.tel}`; return; }
                        if (!a.url) return;
                        setResaOuverte({ url: a.url, nom: (selectedEvent.title || "").replace(/\n/g, " ") });
                      }}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        width: "100%", minHeight: 44, marginBottom: 10, cursor: "pointer",
                        border: "none", borderRadius: RAYON.pastille, background: BORDEAU,
                        fontFamily: SANS, fontSize: 14, fontWeight: 700, letterSpacing: 0.3,
                        color: "#FFFCF8",
                      }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFFCF8"
                           strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
                        {a.mode === "tel"
                          ? <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.5 11.5 0 0 0 3.6.57 1 1 0 0 1 1 1V21a1 1 0 0 1-1 1A17 17 0 0 1 3 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.5 11.5 0 0 0 .57 3.6 1 1 0 0 1-.25 1z"/>
                          : <path d="M4 7h16M4 7v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7M9 11h6"/>}
                      </svg>
                      {a.mot}
                    </button>
                  );
                })()}

                {/* Itinéraire */}
                {(selectedEvent.subtitle || selectedEvent.phone) && (
                  <div style={{ display: "flex", gap: 8, alignItems: "stretch", justifyContent: "center" }}>
                    {selectedEvent.subtitle && (
                      <button
                        onClick={() => ouvrirItineraire(selectedEvent.subtitle)}
                        style={{
                          flex: selectedEvent.phone ? 1 : "0 0 auto",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: "'Josefin Sans', sans-serif",
                          fontSize: 11, fontWeight: 600, letterSpacing: 2,
                          textTransform: "uppercase", color: WHITE,
                          background: NAVY, padding: "11px 24px", border: "none",
                          cursor: "pointer", borderRadius: 1,
                        }}
                      ><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {lang === "en" ? "Directions" : "Direction"}
                      </span></button>
                    )}
                    {/* 🗑️ Bouton téléphone retiré : « Réserver » s'en charge. */}
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

        {/* 🎟️ La vue de réservation, par-dessus la fiche ouverte. */}
        {resaOuverte && (
          <VueReservation
            url={resaOuverte.url}
            titre={resaOuverte.nom}
            lang={lang}
            onFermer={() => setResaOuverte(null)}
          />
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
              <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                {/* Photo de profil, modifiable ICI : l'écran d'inscription ne se rouvre
                    jamais, donc c'est le seul endroit où les comptes déjà créés
                    peuvent ajouter ou changer leur photo. Carré 24 px, coins 4. */}
                <label htmlFor="mo-avatar-menu" title={lang === "en" ? "Change photo" : "Changer ma photo"} style={{ cursor: "pointer", flexShrink: 0 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", overflow: "hidden",
                    border: `1px solid ${auth.profile.avatar_url ? GOLD : "rgba(15,29,58,0.25)"}`,
                    background: auth.profile.avatar_url
                      ? `center/cover no-repeat url("${auth.profile.avatar_url}")`
                      : "#FFFDF7",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: GREY, fontSize: 11, fontFamily: "'Lato', sans-serif",
                  }}>{auth.profile.avatar_url ? "" : "＋"}</div>
                </label>
                <input
                  id="mo-avatar-menu" type="file" accept="image/*" style={{ display: "none" }}
                  onChange={async e => {
                    const f = e.target.files?.[0]; e.target.value = "";
                    if (!f) return;
                    try {
                      const url = await fichierVersAvatar(f);
                      await auth.saveProfile(auth.profile.display_name, undefined, url);
                    } catch { /* photo illisible : on ne change rien */ }
                  }}
                />
                <div style={{
                  fontFamily: "'Josefin Sans', sans-serif", fontSize: 13,
                  color: NAVY, letterSpacing: 0.5, minWidth: 0,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {lang === "en" ? "Hi, " : "Bonjour, "}
                  <span style={{ color: GOLD, fontWeight: 600 }}>{auth.profile.display_name}</span>
                </div>
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
