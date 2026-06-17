import { useState, useEffect } from "react";
import { T } from "./i18n";
import Shell from "./components/Shell";
import { fetchLiveEvents, BUNDLED_EVENTS } from "./data/liveEvents";
import HomeScreen from "./components/screens/HomeScreen";
import FavoritesScreen from "./components/screens/FavoritesScreen";
import AdminScreen from "./components/screens/AdminScreen";
import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

const MOIS_APP = { jan:0,fév:1,mar:2,avr:3,mai:4,juin:5,juil:6,août:7,sep:8,oct:9,nov:10,déc:11 };

function parseForNotif(e) {
  const parts = e.date.trim().split(" ");
  const day = parseInt(parts[1]);
  const month = MOIS_APP[parts[2]];
  if (isNaN(day) || month === undefined) return null;
  return new Date(e.year || 2026, month, day);
}

// ── Pop-up HEBDOMADAIRE automatique : les sorties phares de la semaine ────────
// Chaque LUNDI matin (8h), iOS envoie un résumé des 4 plus gros événements de la
// semaine (favoris en priorité), MÊME app fermée. Programmé 8 semaines à l'avance.
const NOTIF_HOUR = 8;        // lundi matin
const DIGEST_WEEKS = 8;      // nb de semaines programmées à l'avance
const DIGEST_TOP = 4;        // 3-4 plus gros événements / favoris
const DIGEST_ID_BASE = 90000;
const JOURS_FR = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

function digestScore(e, favorites) {
  return (favorites.includes(e.id) ? 1000 : 0)
       + (e.hot ? 100 : 0)
       + (e.recurring ? 0 : 20);   // déprioritise les récurrences (apéro/brunch quotidiens)
}

async function scheduleWeeklyDigest(events, favorites) {
  if (!Capacitor.isNativePlatform()) return;
  const perm = await LocalNotifications.requestPermissions();
  if (perm.display !== 'granted') return;

  // Annule les anciens pop-up (plage large, couvre aussi l'ancienne version quotidienne)
  const old = Array.from({ length: 20 }, (_, i) => ({ id: DIGEST_ID_BASE + i }));
  try { await LocalNotifications.cancel({ notifications: old }); } catch { /* rien à annuler */ }

  const now = new Date();
  // Lundi de la semaine en cours (les semaines passées seront ignorées plus bas)
  const monday = new Date(); monday.setHours(0, 0, 0, 0);
  const dow = (monday.getDay() + 6) % 7;          // 0 = lundi
  monday.setDate(monday.getDate() - dow);

  const toSchedule = [];
  for (let w = 0; w < DIGEST_WEEKS; w++) {
    const weekStart = new Date(monday); weekStart.setDate(monday.getDate() + 7 * w);
    const at = new Date(weekStart); at.setHours(NOTIF_HOUR, 0, 0, 0);
    if (at <= now) continue;                       // ne jamais programmer dans le passé
    const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 6); weekEnd.setHours(23, 59, 59, 999);
    const weekEvents = events.filter(e => {
      const d = parseForNotif(e);
      return d && d >= weekStart && d <= weekEnd;
    });
    if (weekEvents.length === 0) continue;
    const top = [...weekEvents]
      .sort((a, b) => digestScore(b, favorites) - digestScore(a, favorites))
      .slice(0, DIGEST_TOP);
    const hasFav = top.some(e => favorites.includes(e.id));
    const body = top.map(e => {
      const d = parseForNotif(e);
      return `• ${JOURS_FR[d.getDay()]} — ${e.title.replace(/\n/g, ' ')}`;
    }).join('\n');
    toSchedule.push({
      id: DIGEST_ID_BASE + w,
      title: (hasFav ? '⭐ ' : '') + 'Vos sorties de la semaine à Monaco',
      body,
      schedule: { at },
    });
  }
  if (toSchedule.length) await LocalNotifications.schedule({ notifications: toSchedule });
}

const CAT_TO_FILTER = {
  FOOTBALL: "sport", BASKET: "sport", "FORMULE 1": "sport", "FORMULE E": "sport",
  SPORT: "sport", RALLYE: "sport", TENNIS: "sport",
  CONCERT: "music", "OPÉRA": "music", MUSICAL: "music", "JAZZ LIVE": "music",
  "DJ SET": "music", CHANTS: "music",
  THÉÂTRE: "culture", "CONFÉRENCE": "conference", EXPOSITION: "culture", FESTIVAL: "culture",
  GALA: "culture", "FÊTE NATIONALE": "culture", MARCHÉ: "culture", SALON: "culture",
  SPECTACLE: "culture", CINÉMA: "cinema",
  ATELIER: "ateliers", DANSE: "ateliers",
  "BIEN-ÊTRE": "bienetre",
  BRUNCH: "foody", APÉRO: "foody", SOIRÉE: "foody", FOODY: "foody",
  ENCHÈRES: "encheres",
};

export default function App() {
  const [tab, setTab] = useState("events");
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("monacout_favs") || "[]"); }
    catch { return []; }
  });
  const [homeFilter, setHomeFilter] = useState("all");
  const [lang, setLang] = useState("fr");
  const [catFilters, setCatFilters] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [events, setEvents] = useState(BUNDLED_EVENTS);

  useEffect(() => { scheduleWeeklyDigest(events, favorites); }, [events, favorites]);

  // Récupère les événements EN DIRECT depuis le site (corrections sans passer par Apple)
  useEffect(() => {
    fetchLiveEvents().then(live => { if (live && live.length) setEvents(live); });
  }, []);

  function handleTabChange(newTab) {
    const el = document.getElementById("main-scroll");
    if (newTab !== tab) {
      setCatFilters([]);
      setTab(newTab);
      if (el) el.scrollTop = 0;
    }
  }

  function handleCatFilter(catId) {
    setCatFilters(prev =>
      prev.includes(catId) ? prev.filter(f => f !== catId) : [...prev, catId]
    );
    const el = document.getElementById("main-scroll");
    if (el) el.scrollTop = 0;
  }

  function toggleFav(id) {
    // Haptic feedback natif iOS
    if (Capacitor.isNativePlatform()) {
      Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
    }
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem("monacout_favs", JSON.stringify(next));
      if (next.length === 1) {
        if (Capacitor.isNativePlatform()) {
          LocalNotifications.requestPermissions().catch(() => {});
        } else if ('Notification' in window && Notification.permission === 'default') {
          Notification.requestPermission();
        }
      }
      return next;
    });
  }

  function navigateToCategory(cat) {
    const filterId = CAT_TO_FILTER[cat];
    if (filterId) {
      setCatFilters(prev =>
        prev.includes(filterId) ? prev.filter(f => f !== filterId) : [...prev, filterId]
      );
    }
    setHomeFilter("all");
    setTab("events");
    const el = document.getElementById("main-scroll");
    if (el) el.scrollTop = 0;
  }

  const sharedProps = { favorites, onToggleFav: toggleFav, onCategoryClick: navigateToCategory, lang, onCardClick: setSelectedEvent, events };

  return (
    <Shell
      tab={tab}
      setTab={handleTabChange}
      lang={lang}
      setLang={setLang}
      t={T[lang]}
      catFilters={catFilters}
      onCatFilter={handleCatFilter}
      onClearFilters={() => setCatFilters([])}
      showMenu={showMenu}
      setShowMenu={setShowMenu}
      selectedEvent={selectedEvent}
      onClosePopup={() => setSelectedEvent(null)}
      onToggleFav={toggleFav}
      favorites={favorites}
      adminOverlay={showAdmin ? <AdminScreen onClose={() => setShowAdmin(false)} /> : null}
    >
      {tab === "events" ? (
        <HomeScreen
          {...sharedProps}
          filter={homeFilter}
          onFilterChange={setHomeFilter}
          catFilters={catFilters}
          onCatFilter={handleCatFilter}
          onOpenMenu={() => setShowMenu(true)}
          onNavAgenda={() => handleTabChange("agenda")}
          onAdminOpen={() => setShowAdmin(true)}
          onLangChange={setLang}
        />
      ) : (
        <FavoritesScreen
          {...sharedProps}
          onNavEvents={() => handleTabChange("events")}
        />
      )}
    </Shell>
  );
}
