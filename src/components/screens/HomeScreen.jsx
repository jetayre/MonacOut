import { useState, useEffect, useRef, useCallback } from "react";
import { ALL_EVENTS } from "../../data/events";
import { localizeTitle, localizeCat } from "../../i18n";
import MonacOutLogo from "../MonacOutLogo";
import EventCard from "../EventCard";
import CalendarPicker from "../CalendarPicker";

const NAVY = "#0F1D3A";
const GOLD = "#C9A96E";
const GREY = "#6A7080";
const WHITE = "#FFFFFF";
const CREAM = "#FFFFFF";
const BORDER = "rgba(15,29,58,0.12)";
const STRIPE_BG = "repeating-linear-gradient(-45deg, #9FC3DC 0px, #9FC3DC 40px, #FFFFFF 40px, #FFFFFF 80px)";

// Boutons de catégories groupées (barre sous les filtres temps, à la place des quartiers)
const EVENT_GROUPS = [
  { id: "culture",   label: "Culture/Ateliers", labelEn: "Culture/Workshops", cats: ["EXPOSITION","CONFÉRENCE","CINÉMA","THÉÂTRE","OPÉRA","MUSICAL","SPECTACLE","FESTIVAL","ENCHÈRES","MARCHÉ","SALON","FÊTE NATIONALE","ATELIER","DANSE","BIEN-ÊTRE"] },
  { id: "foodnight", label: "Food/Nightlife", labelEn: "Food/Nightlife", cats: ["BRUNCH","APÉRO","FOODY","SOIRÉE","DJ SET","GALA"] },
  { id: "musique",   label: "Musique",   labelEn: "Music",     cats: ["CONCERT","JAZZ LIVE","CHANTS","MUSICAL","OPÉRA"] },
  { id: "sport",     label: "Sport",     labelEn: "Sport",     cats: ["FOOTBALL","BASKET","FORMULE 1","FORMULE E","TENNIS","RALLYE","SPORT"] },
];

const CAT_TO_FILTER = {
  FOOTBALL: "sport", BASKET: "sport", "FORMULE 1": "sport", "FORMULE E": "sport",
  SPORT: "sport", RALLYE: "sport", TENNIS: "sport",
  CONCERT: "concert", "OPÉRA": "concert", MUSICAL: "theatre", "JAZZ LIVE": "concert",
  "DJ SET": "soiree", CHANTS: "messe",
  THÉÂTRE: "theatre", "CONFÉRENCE": "conference", EXPOSITION: "musee", FESTIVAL: "theatre",
  GALA: "theatre", "FÊTE NATIONALE": "theatre", MARCHÉ: "musee", SALON: "conference",
  SPECTACLE: "theatre", CINÉMA: "cinema",
  ATELIER: "ateliers", DANSE: "ateliers",
  "BIEN-ÊTRE": "bienetre",
  BRUNCH: "foody", APÉRO: "foody", SOIRÉE: "soiree", FOODY: "foody",
  ENCHÈRES: "encheres",
};

const TIME_FILTERS = [
  { id: "today",    label: "Aujourd'hui" },
  { id: "week",     label: "Semaine" },
  { id: "weekend",  label: "Week-end" },
  { id: "calendar", label: "Agenda" },
];

const JOURS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MOIS = ["jan", "fév", "mar", "avr", "mai", "juin", "juil", "août", "sep", "oct", "nov", "déc"];
const MOIS_IDX = { jan:0, fév:1, mar:2, avr:3, mai:4, juin:5, juil:6, août:7, sep:8, oct:9, nov:10, déc:11 };
const MOIS_NOM_COURT = ["jan","fév","mar","avr","mai","juin","juil","août","sep","oct","nov","déc"];

function toFrDate(d) { return `${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]}`; }

function getWeekendDates() {
  const today = new Date(); const day = today.getDay();
  const daysToSat = day === 0 ? 6 : day === 6 ? 0 : 6 - day;
  const daysToSun = day === 0 ? 0 : 7 - day;
  const sat = new Date(today); sat.setDate(today.getDate() + daysToSat);
  const sun = new Date(today); sun.setDate(today.getDate() + daysToSun);
  return [toFrDate(sat), toFrDate(sun)];
}

function parseEventDate(e) {
  const parts = e.date.trim().split(" ");
  const day = parseInt(parts[1]); const month = MOIS_IDX[parts[2]];
  if (isNaN(day) || month === undefined) {
    if (import.meta.env.DEV) console.warn("[MonacOut] malformed date:", e.id, e.date);
    return null;
  }
  return new Date(e.year || new Date().getFullYear(), month, day);
}

function filterByTime(events, filterId) {
  const todayStr = toFrDate(new Date()); const weekendDates = getWeekendDates();
  switch (filterId) {
    case "today": { const y = new Date().getFullYear(); return events.filter(e => e.date === todayStr && (e.year || y) === y); }
    case "weekend": { const y = new Date().getFullYear(); return events.filter(e => weekendDates.includes(e.date) && (e.year || y) === y); }
    case "week": {
      const today = new Date(); today.setHours(0,0,0,0);
      const in7 = new Date(today); in7.setDate(today.getDate() + 6);
      return events.filter(e => { const d = parseEventDate(e); return d && d >= today && d <= in7; });
    }
    default: return events;
  }
}

function matchesCatFilter(e, catId) {
  switch (catId) {
    case "sport":      return ["FOOTBALL","BASKET","FORMULE 1","FORMULE E","SPORT","RALLYE","TENNIS"].includes(e.cat);
    case "theatre":    return ["THÉÂTRE","SPECTACLE","DANSE","FESTIVAL","GALA","FÊTE NATIONALE","MUSICAL"].includes(e.cat);
    case "concert":    return ["CONCERT","JAZZ LIVE","OPÉRA"].includes(e.cat);
    case "musee":      return ["EXPOSITION","MARCHÉ","SALON"].includes(e.cat);
    case "conference": return e.cat === "CONFÉRENCE" || e.cat === "SALON" || e.conf === true;
    case "cinema":     return e.cat === "CINÉMA";
    case "famille":    return e.free === true || ["ATELIER","SPECTACLE","CINÉMA","MARCHÉ","FESTIVAL","EXPOSITION","DANSE"].includes(e.cat) || /enfant|famille|junior|jeune|parent|kid/i.test(e.subtitle + " " + (e.desc || ""));
    case "ateliers":   return ["ATELIER","DANSE"].includes(e.cat);
    case "bienetre":   return ["BIEN-ÊTRE"].includes(e.cat);
    case "foody":      return ["FOODY","BRUNCH","APÉRO"].includes(e.cat);
    case "soiree":     return ["SOIRÉE","DJ SET"].includes(e.cat);
    case "encheres":   return ["ENCHÈRES"].includes(e.cat);
    case "messe":      return e.cat === "CHANTS";
    default: return false;
  }
}

function filterByCats(events, catFilters) {
  if (!catFilters || catFilters.length === 0) return events;
  return events.filter(e => catFilters.some(id => matchesCatFilter(e, id)));
}

function SearchIcon({ active }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke={active ? "#C9A96E" : "#0F1D3A"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7"/>
      <line x1="16.5" y1="16.5" x2="22" y2="22"/>
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg width="18" height="13" viewBox="0 0 18 13" fill="none">
      <rect y="0" width="18" height="1.8" rx="0.9" fill="#0F1D3A"/>
      <rect y="5.6" width="18" height="1.8" rx="0.9" fill="#0F1D3A"/>
      <rect y="11.2" width="18" height="1.8" rx="0.9" fill="#0F1D3A"/>
    </svg>
  );
}

function HeartIcon({ active, hasFavs }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24"
      fill={hasFavs ? "#C4A241" : "none"}
      stroke={hasFavs ? "#C4A241" : "#0F1D3A"}
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

export default function HomeScreen({ favorites = [], onToggleFav, onCategoryClick, filter = "all", onFilterChange, lang = "fr", catFilters = [], onCatFilter, onOpenMenu, onNavAgenda, onNavFriends, onCardClick, onAdminOpen, onLangChange, events = ALL_EVENTS, social, onGoingClick, pendingFriends = 0, userName = "", loggedIn = false, onShowAuth }) {
  const setFilter = onFilterChange || (() => {});
  const t = lang === "en"
    ? { tagline: "Community & lifestyle", filters: { today: "Today", week: "This week", weekend: "Weekend", agenda: "Calendar" }, empty: "No events for this period." }
    : { tagline: "Community & lifestyle", filters: { today: "Aujourd'hui", week: "Semaine", weekend: "Week-end", agenda: "Agenda" }, empty: "Aucun événement pour cette période." };

  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [groupFilter, setGroupFilter] = useState(null);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [logoTaps, setLogoTaps] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  const tapTimer = useRef(null);

  function handleLogoTap() {
    const next = logoTaps + 1;
    if (next >= 5) {
      setLogoTaps(0);
      clearTimeout(tapTimer.current);
      onAdminOpen?.();
      return;
    }
    setLogoTaps(next);
    clearTimeout(tapTimer.current);
    tapTimer.current = setTimeout(() => setLogoTaps(0), 2000);
  }

  useEffect(() => {
    const el = document.getElementById("main-scroll");
    if (!el) return;
    let lastY = 0;
    const handler = () => {
      const y = el.scrollTop;
      if (y < 10) setFiltersVisible(true);
      else if (y > lastY + 6) setFiltersVisible(false);
      else if (y < lastY - 6) setFiltersVisible(true);
      lastY = y;
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  function handleFilterChange(newFilter) {
    const el = document.getElementById("main-scroll");
    if (filter === newFilter && newFilter !== "calendar") { setFilter("all"); if (el) el.scrollTop = 0; return; }
    if (newFilter !== "calendar") { setRangeStart(null); setRangeEnd(null); }
    setFilter(newFilter); setFiltersVisible(true);
    if (el) el.scrollTop = 0;
  }

  let filtered;
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filterByCats(events, catFilters).filter(e => {
      // Recherche dans TOUS les champs, en français ET en anglais
      const hay = [
        e.title, localizeTitle((e.title || "").replace(/\n/g, " "), "en"),
        e.subtitle, e.quarter,
        e.cat, localizeCat(e.cat, "en"),
        e.desc, e.descEn, e.source, e.time,
      ].join(" ").toLowerCase();
      return hay.includes(q);
    });
  } else if (filter === "calendar" && rangeStart) {
    const endBound = rangeEnd || rangeStart;
    filtered = filterByCats(events.filter(e => { const d = parseEventDate(e); return d && d >= rangeStart && d <= endBound; }), catFilters);
  } else if (filter === "calendar") {
    filtered = filterByCats(events, catFilters);
  } else {
    filtered = filterByCats(filterByTime(events, filter), catFilters);
  }
  if (groupFilter) { const g = EVENT_GROUPS.find(x => x.id === groupFilter); if (g) filtered = filtered.filter(e => g.cats.includes(e.cat)); }

  const rangeLabel = rangeStart
    ? rangeEnd && rangeEnd.toDateString() !== rangeStart.toDateString()
      ? `${rangeStart.getDate()} ${MOIS_NOM_COURT[rangeStart.getMonth()]} — ${rangeEnd.getDate()} ${MOIS_NOM_COURT[rangeEnd.getMonth()]}`
      : `${rangeStart.getDate()} ${MOIS_NOM_COURT[rangeStart.getMonth()]}`
    : null;

  const hasFavs = favorites.length > 0;

  return (
    <div style={{ background: WHITE, minHeight: "100%" }}>
      {/* Sticky header — z-index très élevé, toujours au-dessus des cartes */}
      <div style={{ position: "sticky", top: 0, zIndex: 999, background: WHITE, borderBottom: `1px solid ${BORDER}` }}>

        {/* Header — le logo rétrécit au scroll vers le bas, s'agrandit au scroll vers le haut.
            Les boutons (menu, loupe, fr/en, cœur) restent toujours visibles. */}
        <div style={{
          background: STRIPE_BG,
          padding: (filtersVisible || showSearch) ? "8px 12px" : "3px 12px",
          display: "flex", alignItems: "center", gap: 8,
          transition: "padding 0.22s ease",
        }}>
          {/* Gauche : menu + loupe + amis */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <button onClick={onOpenMenu} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <HamburgerIcon />
            </button>
            <button onClick={() => {
              setShowSearch(v => {
                if (v) setSearchQuery("");
                else setTimeout(() => searchInputRef.current?.focus(), 50);
                return !v;
              });
            }} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <SearchIcon active={showSearch} />
            </button>
            <button onClick={onNavFriends} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, position: "relative" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F1D3A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              {pendingFriends > 0 && (
                <span style={{
                  position: "absolute", top: 0, right: 0,
                  width: 8, height: 8, borderRadius: "50%",
                  background: "#C4A241", border: "1.5px solid #fff",
                }} />
              )}
            </button>
          </div>

          {/* Centre : logo — grand en haut, petit au scroll vers le bas */}
          <div style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
            maxHeight: (filtersVisible || showSearch) ? "46px" : "24px",
            overflow: "hidden", transition: "max-height 0.22s ease",
          }} onClick={handleLogoTap}>
            <div style={{
              transform: (filtersVisible || showSearch) ? "scale(1)" : "scale(0.6)",
              transformOrigin: "center", transition: "transform 0.22s ease",
            }}>
              <MonacOutLogo compact />
            </div>
          </div>

          {/* Droite : fr/en + cœur */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{ display: "flex", gap: 4 }}>
              {["fr","en"].map(l => (
                <button key={l} onClick={() => onLangChange?.(l)} style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "'Josefin Sans', sans-serif",
                  fontSize: 10, fontWeight: lang === l ? 700 : 400,
                  letterSpacing: 1, textTransform: "uppercase",
                  color: lang === l ? "#0F1D3A" : "#6A7080",
                  padding: "1px 3px",
                  borderBottom: lang === l ? "1.5px solid #C9A96E" : "1.5px solid transparent",
                }}>{l}</button>
              ))}
            </div>
            <button onClick={onNavAgenda} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <HeartIcon hasFavs={hasFavs} />
            </button>
          </div>
        </div>

        {/* Salutation — « Bonjour, <prénom> » sous le logo quand connectée */}
        {userName && (
          <div style={{
            background: WHITE, borderTop: `1px solid ${BORDER}`, textAlign: "center",
            padding: "5px 12px",
            fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, letterSpacing: 0.5, color: NAVY,
          }}>
            {lang === "en" ? "Hi, " : "Bonjour, "}
            <span style={{ color: "#C4A241", fontWeight: 600 }}>{userName}</span>
          </div>
        )}

        {/* Barre de recherche */}
        <div style={{
          background: WHITE, borderTop: `1px solid ${BORDER}`,
          maxHeight: showSearch ? "52px" : "0px", overflow: "hidden", transition: "max-height 0.22s ease",
        }}>
          <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
            <SearchIcon active />
            <input
              ref={searchInputRef}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={lang === "en" ? "Search events…" : "Rechercher…"}
              style={{
                flex: 1, border: "none", outline: "none", background: "transparent",
                fontFamily: "'Jost', sans-serif", fontSize: 16, color: NAVY,
                letterSpacing: 0.2,
              }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 14, color: GREY, padding: 0, lineHeight: 1,
              }}>✕</button>
            )}
          </div>
        </div>

        {/* Filtres temps — disparaissent au scroll */}
        <div style={{
          background: WHITE, borderTop: `1px solid ${BORDER}`,
          maxHeight: filtersVisible ? "52px" : "0px", overflow: "hidden", transition: "max-height 0.22s ease",
        }}>
          <div style={{ display: "flex", gap: 6, padding: "8px 10px", justifyContent: "center" }}>
            {TIME_FILTERS.map(f => {
              const active = filter === f.id;
              const label = f.id === "calendar" && rangeStart ? rangeLabel : (t.filters[f.id] || f.label);
              return (
                <button key={f.id} onClick={() => handleFilterChange(f.id)} style={{
                  flexShrink: 0, padding: "7px 16px", borderRadius: 20,
                  border: `1.5px solid ${active ? NAVY : "rgba(15,29,58,0.2)"}`,
                  background: active ? NAVY : "#FFFFFF", color: active ? WHITE : GREY,
                  fontFamily: "'Jost', -apple-system, sans-serif", fontSize: 12, fontWeight: 600,
                  cursor: "pointer", whiteSpace: "nowrap", letterSpacing: 0.3,
                }}>{f.id === "calendar" ? (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={active ? "#FFFFFF" : GREY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                    {rangeStart && rangeLabel}
                  </span>
                ) : label}</button>
              );
            })}
          </div>
        </div>

        {/* Catégories groupées — disparaissent au scroll */}
        <div style={{
          background: WHITE, borderTop: `1px solid ${BORDER}`,
          maxHeight: filtersVisible ? "44px" : "0px", overflow: "hidden", transition: "max-height 0.22s ease",
        }}>
          <div style={{ display: "flex", gap: 5, justifyContent: "center", padding: "5px 8px 7px", overflowX: "auto", scrollbarWidth: "none" }}>
            {EVENT_GROUPS.map(g => {
              const active = groupFilter === g.id;
              return (
                <button key={g.id} onClick={() => { setGroupFilter(active ? null : g.id); const el = document.getElementById("main-scroll"); if (el) el.scrollTop = 0; }} style={{
                  flexShrink: 0, padding: "4px 10px", borderRadius: 20,
                  border: `1px solid ${active ? NAVY : "rgba(15,29,58,0.18)"}`,
                  background: active ? NAVY : "#FFFFFF", color: active ? WHITE : GREY,
                  fontFamily: "'Jost', sans-serif", fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", letterSpacing: 0.4,
                }}>{lang === "en" ? g.labelEn : g.label}</button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Calendrier inline */}
      {filter === "calendar" && (
        <CalendarPicker inline lang={lang} initialStart={rangeStart} initialEnd={rangeEnd}
          onChange={(s, e) => { setRangeStart(s || null); setRangeEnd(e || null); }} />
      )}

      {/* Liste — cartes qui s'empilent */}
      <div style={{ padding: "0 16px 20px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", fontFamily: "'Libre Baskerville', Georgia, serif", fontStyle: "italic", color: GREY, fontSize: 15 }}>
            {t.empty}
          </div>
        ) : (
          filtered.map((e) => (
            <EventCard
              key={e.id}
              event={e}
              favorites={favorites}
              onToggleFav={onToggleFav}
              onCategoryClick={(cat) => { const f = CAT_TO_FILTER[cat]; if (f) onCatFilter?.(f); }}
              onCardClick={onCardClick}
              lang={lang}
              onGoingClick={onGoingClick}
              isGoing={social?.myParticipations?.includes(e.id) ?? false}
              friendsGoing={social ? social.friendsGoingTo(e.id) : []}
              loggedIn={loggedIn}
              onShowAuth={onShowAuth}
            />
          ))
        )}
      </div>
    </div>
  );
}
