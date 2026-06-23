import { useState, useEffect } from "react";
import { T } from "./i18n";
import Shell from "./components/Shell";
import { fetchLiveEvents, fetchNotifConfig, BUNDLED_EVENTS } from "./data/liveEvents";
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

// ── Pop-up automatique : les sorties phares à venir ───────────────────────────
// Par défaut MARDI, JEUDI et SAMEDI en fin de journée (18h) : iOS envoie un résumé
// des 4 plus gros événements des 7 jours à venir, en priorisant les FAVORIS et les
// événements les PLUS PROCHES en date, MÊME app fermée. 8 semaines à l'avance.
// Ces réglages (jours/heure/nombre/semaines) sont PILOTABLES depuis le site via
// public/notif-config.json — les valeurs ci-dessous ne servent que de repli.
const NOTIF_HOUR = 18;           // repli : fin de journée (moment « je cherche une sortie »)
const DIGEST_WEEKS = 8;          // repli : nb de semaines programmées à l'avance
const DIGEST_TOP = 4;            // repli : 3-4 plus gros événements / favoris
const SEND_OFFSETS = [1, 3, 5];  // repli : jours d'envoi depuis lundi (1=mardi, 3=jeudi, 5=samedi)
const MAX_DIGEST_IDS = 120;      // plage d'annulation (couvre toutes les configs possibles)
const DIGEST_ID_BASE = 90000;
const JOURS_FR = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

function digestScore(e, favorites, refDate) {
  // Bonus « proche en date » : plus l'événement arrive tôt dans la fenêtre de
  // 7 jours, plus il monte (84 pts le jour même → 12 pts au 6e jour).
  let proximity = 0;
  if (refDate) {
    const d = parseForNotif(e);
    if (d) {
      const dayOffset = Math.min(6, Math.max(0, Math.round((d - refDate) / 86400000)));
      proximity = (7 - dayOffset) * 12;
    }
  }
  return (favorites.includes(e.id) ? 1000 : 0)   // favoris d'abord
       + (e.hot ? 100 : 0)                         // puis événements phares
       + proximity                                 // puis les plus proches en date
       + (e.recurring ? 0 : 20);   // déprioritise les récurrences (apéro/brunch quotidiens)
}

async function scheduleDigest(events, favorites, config) {
  if (!Capacitor.isNativePlatform()) return;
  const perm = await LocalNotifications.requestPermissions();
  if (perm.display !== 'granted') return;

  // Réglages pilotés par le site (notif-config.json), avec repli sur les valeurs codées.
  const sendOffsets = config?.offsets?.length ? config.offsets : SEND_OFFSETS;
  const notifHour   = config?.hour != null ? config.hour : NOTIF_HOUR;
  const weeks       = config?.weeks || DIGEST_WEEKS;
  const perDigest   = config?.perDigest || DIGEST_TOP;

  // Annule les anciens pop-up (plage large : couvre toutes les configs et versions précédentes)
  const old = Array.from({ length: MAX_DIGEST_IDS }, (_, i) => ({ id: DIGEST_ID_BASE + i }));
  try { await LocalNotifications.cancel({ notifications: old }); } catch { /* rien à annuler */ }

  const now = new Date();
  // Lundi de la semaine en cours (les envois passés seront ignorés plus bas)
  const monday = new Date(); monday.setHours(0, 0, 0, 0);
  const dow = (monday.getDay() + 6) % 7;          // 0 = lundi
  monday.setDate(monday.getDate() - dow);

  const toSchedule = [];
  for (let w = 0; w < weeks; w++) {
    for (let s = 0; s < sendOffsets.length; s++) {
      const sendDay = new Date(monday); sendDay.setDate(monday.getDate() + 7 * w + sendOffsets[s]);
      const at = new Date(sendDay); at.setHours(notifHour, 0, 0, 0);
      if (at <= now) continue;                     // ne jamais programmer dans le passé
      const winStart = new Date(sendDay); winStart.setHours(0, 0, 0, 0);
      const winEnd = new Date(sendDay); winEnd.setDate(sendDay.getDate() + 6); winEnd.setHours(23, 59, 59, 999);
      const winEvents = events.filter(e => {
        const d = parseForNotif(e);
        return d && d >= winStart && d <= winEnd;
      });
      if (winEvents.length === 0) continue;
      const top = [...winEvents]
        .sort((a, b) => digestScore(b, favorites, winStart) - digestScore(a, favorites, winStart))
        .slice(0, perDigest);
      const hasFav = top.some(e => favorites.includes(e.id));
      const body = top.map(e => {
        const d = parseForNotif(e);
        return `• ${JOURS_FR[d.getDay()]} — ${e.title.replace(/\n/g, ' ')}`;
      }).join('\n');
      const id = DIGEST_ID_BASE + w * sendOffsets.length + s;
      toSchedule.push({
        id: id < DIGEST_ID_BASE + MAX_DIGEST_IDS ? id : DIGEST_ID_BASE + MAX_DIGEST_IDS - 1,
        title: (hasFav ? '⭐ ' : '') + 'Vos sorties à venir à Monaco',
        body,
        schedule: { at },
      });
    }
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
  const [notifConfig, setNotifConfig] = useState(null);

  useEffect(() => { scheduleDigest(events, favorites, notifConfig); }, [events, favorites, notifConfig]);

  // Récupère les événements EN DIRECT depuis le site (corrections sans passer par Apple)
  useEffect(() => {
    fetchLiveEvents().then(live => { if (live && live.length) setEvents(live); });
  }, []);

  // Récupère les réglages de notifications EN DIRECT (jours/heure/fréquence sans passer par Apple)
  useEffect(() => {
    fetchNotifConfig().then(cfg => { if (cfg) setNotifConfig(cfg); });
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
      contactEmail={notifConfig?.contactEmail || "eventsmonacout@gmail.com"}
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
