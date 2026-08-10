import { useState, useEffect, useRef, useMemo } from "react";
import { T } from "./i18n";
import Shell from "./components/Shell";
import { fetchLiveEvents, fetchNotifConfig, BUNDLED_EVENTS } from "./data/liveEvents";
import HomeScreen from "./components/screens/HomeScreen";
import FavoritesScreen from "./components/screens/FavoritesScreen";
import AdminScreen from "./components/screens/AdminScreen";
import FriendsScreen from "./components/screens/FriendsScreen";
import AuthScreen from "./components/screens/AuthScreen";
import WelcomeScreen from "./components/screens/WelcomeScreen";
import { useAuth } from "./hooks/useAuth";
import { useSocial } from "./hooks/useSocial";
import { supabase } from "./lib/supabase";
import { Capacitor } from "@capacitor/core";
import { App as CapApp } from "@capacitor/app";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import posthog from "posthog-js";
import { fichierVersAvatar } from "./lib/avatar";

// Capteur de mesure (invisible pour l'utilisateur). Lié à des ACTIONS (clics),
// jamais au défilement → aucune répétition parasite quand on scrolle.
function track(event, props) {
  try { posthog.capture(event, props); } catch { /* analytics indisponible */ }
}

const MOIS_APP = { jan:0,fév:1,mar:2,avr:3,mai:4,juin:5,juil:6,août:7,sep:8,oct:9,nov:10,déc:11 };

function parseForNotif(e) {
  const parts = e.date.trim().split(" ");
  const day = parseInt(parts[1]);
  const month = MOIS_APP[parts[2]];
  if (isNaN(day) || month === undefined) return null;
  return new Date(e.year || 2026, month, day);
}

// Cartes « annuaire » Spas & Musées : elles existent en 1 exemplaire PAR JOUR
// (repérables au champ `venues`). Pour éviter de les revoir à chaque jour quand on scrolle,
// on ne garde que l'occurrence la PLUS PROCHE (aujourd'hui) de chaque carte, et on masque le reste.
// ⚠️ Le CINÉMA est exclu : il change chaque semaine avec les nouveaux films → on le laisse tel quel.
function isDailyDirectory(e) {
  return e && Array.isArray(e.venues) && e.cat !== "CINÉMA";
}
function collapseVenueCards(events) {
  if (!Array.isArray(events)) return events;
  // 1) Regroupe : ne garder que l'occurrence la plus proche de chaque carte annuaire.
  const best = new Map();                 // titre → { i, t } = occurrence la plus proche
  events.forEach((e, i) => {
    if (!isDailyDirectory(e)) return;
    const d = parseForNotif(e);
    const t = d ? d.getTime() : Infinity;
    const cur = best.get(e.title);
    if (!cur || t < cur.t) best.set(e.title, { i, t });
  });
  if (!best.size) return events;
  const keep = new Set(Array.from(best.values(), v => v.i));
  const kept = events.filter((e, i) => !isDailyDirectory(e) || keep.has(i));

  // 2) Repositionne : place chaque carte annuaire À LA FIN de sa journée (jamais en haut).
  const dayKey = e => `${e.year || 2026}|${e.date}`;
  const dirs = [], rest = [];
  kept.forEach(e => (isDailyDirectory(e) ? dirs : rest).push(e));
  if (!dirs.length) return kept;
  const byDay = new Map();
  dirs.forEach(e => { const k = dayKey(e); if (!byDay.has(k)) byDay.set(k, []); byDay.get(k).push(e); });
  const out = [];
  const done = new Set();
  for (let i = 0; i < rest.length; i++) {
    out.push(rest[i]);
    const k = dayKey(rest[i]);
    const next = rest[i + 1];
    if (byDay.has(k) && !done.has(k) && (!next || dayKey(next) !== k)) {
      byDay.get(k).forEach(c => out.push(c));   // dernier event du jour → on ajoute les cartes annuaire après
      done.add(k);
    }
  }
  byDay.forEach((cards, k) => { if (!done.has(k)) cards.forEach(c => out.push(c)); });  // filet (jour sans autre event)
  return out;
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

// Catégories par groupe (mêmes que les filtres de l'app) — pour les sujets préférés
const GROUP_CATS = {
  culture: ["EXPOSITION","CONFÉRENCE","CINÉMA","THÉÂTRE","OPÉRA","MUSICAL","SPECTACLE","FESTIVAL","ENCHÈRES","MARCHÉ","SALON","FÊTE NATIONALE","ATELIER","DANSE","BIEN-ÊTRE"],
  foodnight: ["BRUNCH","APÉRO","FOODY","SOIRÉE","DJ SET","GALA"],
  musique: ["CONCERT","JAZZ LIVE","CHANTS","MUSICAL","OPÉRA"],
  sport: ["FOOTBALL","BASKET","FORMULE 1","FORMULE E","TENNIS","RALLYE","SPORT"],
};
function inPreferred(e, topics) {
  return topics && topics.length ? topics.some(t => GROUP_CATS[t]?.includes(e.cat)) : false;
}

function digestScore(e, favorites, refDate, topics) {
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
       + (inPreferred(e, topics) ? 60 : 0)         // puis les sujets préférés choisis au login
       + (e.recurring ? 0 : 20);   // déprioritise les récurrences (apéro/brunch quotidiens)
}

async function scheduleDigest(events, favorites, config, topics) {
  if (!Capacitor.isNativePlatform()) return;
  // On NE demande PLUS l'autorisation ici (à l'ouverture) : on vérifie seulement.
  // La demande se fait au bon moment (1er favori) via le petit message dans App.
  const perm = await LocalNotifications.checkPermissions();
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
        if (e.directory) return false;   // pas les annuaires Musées/Cinéma dans les notifs (seulement de vrais événements)
        if (e.noNotif) return false;     // fiches quotidiennes d'expo : visibles dans l'app, exclues des notifs
        const d = parseForNotif(e);
        return d && d >= winStart && d <= winEnd;
      });
      if (winEvents.length === 0) continue;
      const top = [...winEvents]
        .sort((a, b) => digestScore(b, favorites, winStart, topics) - digestScore(a, favorites, winStart, topics))
        .slice(0, perDigest);
      const body = top.map(e => {
        const titre = e.title.replace(/\n/g, ' ');
        const lieu = e.subtitle ? e.subtitle.split(' · ')[0] : '';
        // Teaser : on affiche seulement le NOM (+ lieu), PAS la date → donne envie d'ouvrir l'app pour voir quand.
        return `• ${titre}${lieu ? ' · ' + lieu : ''}`;
      }).join('\n');
      const id = DIGEST_ID_BASE + w * sendOffsets.length + s;
      toSchedule.push({
        id: id < DIGEST_ID_BASE + MAX_DIGEST_IDS ? id : DIGEST_ID_BASE + MAX_DIGEST_IDS - 1,
        title: 'Vos sorties à venir à Monaco',
        body,
        schedule: { at },
      });
    }
  }
  if (toSchedule.length) await LocalNotifications.schedule({ notifications: toSchedule });
}

// ── Rappel « veille d'événement » pour chaque favori ──────────────────────────
// La veille à 18h : « Demain : [titre] · [lieu] ». Le levier de rétention le plus fort.
const FAV_ID_BASE = 91000;
const MAX_FAV_IDS = 60;
async function scheduleFavoriteReminders(events, favorites) {
  if (!Capacitor.isNativePlatform()) return;
  const perm = await LocalNotifications.checkPermissions();
  if (perm.display !== 'granted') return;
  const old = Array.from({ length: MAX_FAV_IDS }, (_, i) => ({ id: FAV_ID_BASE + i }));
  try { await LocalNotifications.cancel({ notifications: old }); } catch { /* rien à annuler */ }
  const now = new Date();
  const favEvents = events.filter(e => favorites.includes(e.id));
  const toSchedule = [];
  let idx = 0;
  for (const e of favEvents) {
    if (idx >= MAX_FAV_IDS) break;
    const d = parseForNotif(e);
    if (!d) continue;
    const at = new Date(d); at.setDate(d.getDate() - 1); at.setHours(18, 0, 0, 0);
    if (at <= now) continue;                       // ne jamais programmer dans le passé
    const titre = e.title.replace(/\n/g, ' ');
    const lieu = e.subtitle ? e.subtitle.split(' · ')[0] : '';
    const heure = (e.time || '').split(/[—–-]/)[0].trim();
    toSchedule.push({
      id: FAV_ID_BASE + idx,
      title: 'Demain à Monaco',
      body: `${titre}${lieu ? ' · ' + lieu : ''}${/\d/.test(heure) ? ' · ' + heure : ''}`,
      schedule: { at },
    });
    idx++;
  }
  if (toSchedule.length) await LocalNotifications.schedule({ notifications: toSchedule });
}

// ── Rappel « Ajoute tes amis » ────────────────────────────────────────────────
// Pour les personnes connectées SANS ami : petit coup de pouce (J+2 et J+6 à 18h).
// Annulé dès qu'elles ont au moins un ami → on n'embête jamais ceux qui en ont.
const FRIENDS_NUDGE_BASE = 92000;
async function scheduleFriendsNudge(loggedIn, friendCount) {
  if (!Capacitor.isNativePlatform()) return;
  const perm = await LocalNotifications.checkPermissions();
  if (perm.display !== 'granted') return;
  const old = [0, 1, 2].map(i => ({ id: FRIENDS_NUDGE_BASE + i }));
  try { await LocalNotifications.cancel({ notifications: old }); } catch { /* rien à annuler */ }
  if (!loggedIn) return;
  const now = new Date();
  // 0 ami → 2 rappels (J+2, J+6). A déjà des amis (souvent peu) → 1 seul rappel (J+3) pour en ajouter plus.
  const nudges = friendCount === 0
    ? [
        { days: 2, title: 'Ajoute tes amis', body: 'Ajoute tes amis pour vous retrouver aux événements.' },
        { days: 6, title: 'Vois où sortent tes amis', body: 'Ajoute tes amis pour vous retrouver aux événements à Monaco.' },
      ]
    : [
        { days: 3, title: 'Agrandis ton cercle', body: 'Ajoute plus d\'amis pour vous retrouver aux événements.' },
      ];
  const toSchedule = [];
  nudges.forEach((n, i) => {
    const at = new Date(now); at.setDate(now.getDate() + n.days); at.setHours(18, 0, 0, 0);
    if (at <= now) return;
    toSchedule.push({ id: FRIENDS_NUDGE_BASE + i, title: n.title, body: n.body, schedule: { at } });
  });
  if (toSchedule.length) await LocalNotifications.schedule({ notifications: toSchedule });
}

// ── Rappel « à ne pas manquer » : les 2 meilleurs événements à venir ──────────
// Se replanifie à chaque ouverture (J+1 à 12h) → ne se déclenche que si la personne ne revient pas.
const HILITE_ID = 93000;
async function scheduleHighlightsReminder(events, favorites) {
  if (!Capacitor.isNativePlatform()) return;
  const perm = await LocalNotifications.checkPermissions();
  if (perm.display !== 'granted') return;
  try { await LocalNotifications.cancel({ notifications: [{ id: HILITE_ID }] }); } catch { /* rien à annuler */ }
  const now = new Date();
  const winEnd = new Date(now); winEnd.setDate(now.getDate() + 7); winEnd.setHours(23, 59, 59, 999);
  const top = events.filter(e => {
    if (e.directory || e.noNotif) return false;
    const d = parseForNotif(e);
    return d && d >= now && d <= winEnd;
  }).sort((a, b) => digestScore(b, favorites, now) - digestScore(a, favorites, now)).slice(0, 2);
  if (!top.length) return;
  const body = top.map(e => {
    const d = parseForNotif(e);
    const titre = e.title.replace(/\n/g, ' ');
    const lieu = e.subtitle ? e.subtitle.split(' · ')[0] : '';
    return `• ${JOURS_FR[d.getDay()]} ${d.getDate()} — ${titre}${lieu ? ' · ' + lieu : ''}`;
  }).join('\n');
  const at = new Date(now); at.setDate(now.getDate() + 1); at.setHours(12, 0, 0, 0);
  if (at <= now) at.setDate(at.getDate() + 1);
  await LocalNotifications.schedule({ notifications: [{ id: HILITE_ID, title: 'À ne pas manquer à Monaco', body, schedule: { at } }] });
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

// ── Bandeau « mise à jour disponible » ────────────────────────────────────────
// L'app compare sa version à `latestVersion` (piloté depuis notif-config.json).
// Si le serveur annonce une version plus récente → bandeau vers l'App Store.
const APPSTORE_URL = "https://apps.apple.com/fr/app/monacout/id6774785049";
function isNewerVersion(latest, current) {
  const a = String(latest).split(".").map(n => parseInt(n) || 0);
  const b = String(current).split(".").map(n => parseInt(n) || 0);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if ((a[i] || 0) > (b[i] || 0)) return true;
    if ((a[i] || 0) < (b[i] || 0)) return false;
  }
  return false;
}

export default function App() {
  const auth = useAuth();
  const social = useSocial(auth.user?.id);
  const [pendingInvite, setPendingInvite] = useState(() => {
    try { return new URLSearchParams(window.location.search).get("invite") || null; } catch { return null; }
  });
  const [tab, setTab] = useState(() =>
    new URLSearchParams(window.location.search).get("invite") ? "friends" : "events"
  );
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("monacout_favs") || "[]"); }
    catch { return []; }
  });
  const [homeFilter, setHomeFilter] = useState("all");
  const [lang, setLang] = useState(() => {
    // 1) choix manuel mémorisé, sinon 2) langue du téléphone (anglais → en, sinon fr)
    const saved = localStorage.getItem("monacout_lang");
    if (saved === "fr" || saved === "en") return saved;
    return (navigator.language || "fr").toLowerCase().startsWith("en") ? "en" : "fr";
  });
  const [catFilters, setCatFilters] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showFavNudge, setShowFavNudge] = useState(false);
  const [showPhotoNudge, setShowPhotoNudge] = useState(false);
  const [events, setEvents] = useState(BUNDLED_EVENTS);
  const [notifConfig, setNotifConfig] = useState(null);
  const [showNotifPrompt, setShowNotifPrompt] = useState(false);
  const [inviteToast, setInviteToast] = useState(null);
  const [inviterName, setInviterName] = useState(null);
  const [showInAppBanner, setShowInAppBanner] = useState(false);
  const [showInstallInvite, setShowInstallInvite] = useState(false);   // invité arrivé sur le SITE, sans l'app
  const [codeInvitation, setCodeInvitation] = useState("");
  const [resumeTick, setResumeTick] = useState(0);  // incrémenté au retour au 1er plan → recalcule « ce soir / demain » sans fermer l'app
  const [deepLinkTick, setDeepLinkTick] = useState(0);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const engageRef = useRef(0);
  const eventLinkRef = useRef(false);
  const promptedThisSessionRef = useRef(false);   // un seul message par session, jamais deux d'affilée
  const authUserRef = useRef(null);               // valeur à jour d'auth.user pour les minuteurs
  const profileRef = useRef(null);                // idem pour le profil (a-t-elle déjà une photo ?)

  useEffect(() => { scheduleDigest(events, favorites, notifConfig, auth.profile?.preferred_topics); scheduleFavoriteReminders(events, favorites); scheduleHighlightsReminder(events, favorites); }, [events, favorites, notifConfig, auth.profile]);
  useEffect(() => { scheduleFriendsNudge(!!auth.user, (social.friends || []).length); }, [auth.user, social.friends]);
  useEffect(() => { authUserRef.current = auth.user; }, [auth.user]);
  useEffect(() => { profileRef.current = auth.profile; }, [auth.profile]);

  // Au lancement : on compte la visite, puis on sollicite les gens qui reviennent
  // MÊME s'ils n'ouvrent jamais de fiche. C'était le trou : la demande de notifications
  // ne partait qu'après 2 fiches ouvertes, or 85 % des visiteurs n'en ouvrent aucune —
  // on ne posait donc la question qu'à 10 % d'entre eux (et personne ne refusait).
  useEffect(() => {
    // Migration : l'ancien drapeau « déjà demandé » bloquait à vie. On le convertit
    // en « 1 demande sans date » → ces personnes pourront être resollicitées.
    try {
      if (localStorage.getItem("monacout_notif_asked") === "1" && !localStorage.getItem("monacout_notif_asks")) writeNum("monacout_notif_asks", 1);
      if (localStorage.getItem("monacout_fav_nudge_shown") === "1" && !localStorage.getItem("monacout_signup_asks")) writeNum("monacout_signup_asks", 1);
    } catch { /* ignore */ }

    const visites = bumpCount("monacout_sessions");
    // On laisse respirer : jamais à la seconde où l'app s'ouvre.
    const t = setTimeout(() => {
      if (!authUserRef.current && visites >= 4 && maybeAskSignup("visites")) return;
      if (maybeAskPhoto()) return;          // connectée mais sans photo → on l'invite (2× max)
      if (visites >= 3) maybeAskNotif();
    }, 12000);
    return () => clearTimeout(t);
  }, []);   // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { localStorage.setItem("monacout_lang", lang); }, [lang]);

  // Récupère les événements EN DIRECT depuis le site (corrections sans passer par Apple)
  // Délai : attend que l'écran de démarrage ait fini de s'estomper (600ms + 500ms fade = 1100ms)
  // → évite le flash visible quand la liste change d'ordre au premier rendu.
  useEffect(() => {
    let cancelled = false;
    const t0 = Date.now();
    fetchLiveEvents().then(live => {
      if (cancelled || !live?.length) return;
      const elapsed = Date.now() - t0;
      const wait = Math.max(0, 1200 - elapsed);
      setTimeout(() => { if (!cancelled) setEvents(live); }, wait);
    });
    return () => { cancelled = true; };
  }, []);

  // ── L'ANNONCE « CE SOIR » : un carré au centre, plus un bandeau en haut ──────────
  // Le bandeau se plaçait au-dessus du logo et revenait à CHAQUE ouverture même après
  // avoir été fermé — jugé agaçant le 7 août 2026. Désormais c'est le même carré que
  // les autres messages, et il n'apparaît QU'UNE FOIS par phase : une fois la veille
  // (« Demain soir »), une fois le jour même (« Ce soir »). Deux apparitions par
  // événement au maximum, jamais deux fois dans la même visite.

  // Propose les notifications ~3,5 s après l'entrée dans l'app (pour TOUT LE MONDE), une fois l'écran de bienvenue passé.
  // maybeAskNotif est protégé (n'affiche que si la permission est encore demandable → jamais 2 fois).
  useEffect(() => {
    if (showWelcome) return;
    const t = setTimeout(() => { maybeAskNotif(); }, 3500);
    return () => clearTimeout(t);
  }, [showWelcome]);

  // Récupère les réglages EN DIRECT + REFRESH au retour au 1er plan (natif + web) →
  // le bandeau « demain soir » bascule tout seul en « ce soir » le lendemain, sans fermer l'app.
  useEffect(() => {
    const refresh = () => { setResumeTick(t => t + 1); fetchNotifConfig().then(cfg => { if (cfg) setNotifConfig(cfg); }); };
    refresh();
    let sub;
    if (Capacitor.isNativePlatform()) CapApp.addListener("appStateChange", ({ isActive }) => { if (isActive) refresh(); }).then(h => { sub = h; });
    const onVis = () => { if (document.visibilityState === "visible") refresh(); };
    document.addEventListener("visibilitychange", onVis);
    return () => { document.removeEventListener("visibilitychange", onVis); if (sub) sub.remove(); };
  }, []);

  // Lien partagé « ?event=<id> » → ouvre directement la fiche de l'événement dans l'app/le site
  useEffect(() => {
    if (eventLinkRef.current || !events?.length) return;
    try {
      const eid = new URLSearchParams(window.location.search).get("event");
      if (!eid) { eventLinkRef.current = true; return; }
      const ev = events.find(e => String(e.id) === String(eid));
      if (ev) { setSelectedEvent(ev); eventLinkRef.current = true; }
    } catch { /* ignore */ }
  }, [events]);

  // Bandeau « mise à jour disponible » : compare la version de l'app à latestVersion (config live)
  useEffect(() => {
    const latest = notifConfig?.latestVersion;
    if (!latest || !Capacitor.isNativePlatform()) return;
    CapApp.getInfo().then(info => {
      if (isNewerVersion(latest, info.version) &&
          localStorage.getItem("monacout_update_dismissed") !== String(latest)) {
        setUpdateAvailable(true);
      }
    }).catch(() => { /* getInfo indisponible (web) */ });
  }, [notifConfig]);

  // Après connexion, si la personne n'a pas encore de profil (prénom) → on ouvre l'étape "prénom" automatiquement
  useEffect(() => {
    if (!auth.loading && auth.user && !auth.profile?.display_name) setShowAuth(true);
  }, [auth.loading, auth.user, auth.profile]);

  // Si un code de connexion est en attente (on a quitté l'app pour lire le mail) → on rouvre l'écran (qui s'ouvre pile sur l'écran code)
  useEffect(() => {
    if (auth.loading || auth.user) return;
    try { if (localStorage.getItem("monacout_pending_login_email")) setShowAuth(true); } catch { /* rien */ }
  }, [auth.loading, auth.user]);

  // Écran d'accueil au 1er lancement — invite à se connecter, SANS jamais forcer.
  useEffect(() => {
    if (auth.loading || auth.user) return;
    if (localStorage.getItem("monacout_welcomed") === "1") return;
    if (localStorage.getItem("monacout_pending_invite")) return; // le flux invitation gère déjà l'écran
    setShowWelcome(true);
  }, [auth.loading, auth.user]);

  // Lien d'invitation partagé (?invite=xxx) : on mémorise le code pour l'appliquer après connexion
  useEffect(() => {
    const inv = new URLSearchParams(window.location.search).get("invite");
    if (!inv) return;
    localStorage.setItem("monacout_pending_invite", inv.trim().toLowerCase());
    window.history.replaceState({}, "", window.location.pathname + window.location.hash);
    // Navigateur intégré WhatsApp/Instagram : session Supabase absente → bannière Safari
    const ua = navigator.userAgent || "";
    const isInApp = !Capacitor.isNativePlatform() && /WhatsApp|Instagram|FBAN|FBAV|Twitter|Line\//.test(ua);
    if (supabase) {
      supabase.from("profiles").select("display_name").eq("invite_code", inv.trim().toLowerCase()).single()
        .then(({ data }) => { if (data?.display_name) setInviterName(data.display_name); });
    }
    if (isInApp) { setShowInAppBanner(true); return; }
    // ── LE LIEN D'INVITATION DOIT MENER À L'APP ──────────────────────────────────
    // Relevé du 9 août 2026 : 20 personnes ont ouvert un lien d'invitation, toutes
    // dans un VRAI navigateur (Safari 10, Chrome iOS 7, bureau 3) — pas dans un
    // navigateur intégré. Elles n'avaient donc pas l'app : le lien les déposait sur
    // le site, et RIEN ne leur proposait de l'installer. Le lien de Nadège à lui
    // seul a amené 14 personnes de cette façon, toutes restées sur le web.
    // On leur propose donc l'app, en gardant le code visible : après installation
    // il suffit de le saisir dans Mon Cercle, rien n'est perdu.
    // iPhone/iPad UNIQUEMENT : l'app n'existe pas encore sur Android, y envoyer
    // quelqu'un vers l'App Store d'Apple ne mènerait nulle part.
    if (!Capacitor.isNativePlatform() && /iPhone|iPad|iPod/i.test(ua)) {
      setCodeInvitation(inv.trim().toLowerCase());
      setShowInstallInvite(true);
      track("invite_web_shown", { source: "invitation" });
    }
  }, []);

  // ── TOUS LES VISITEURS DU SITE SUR IPHONE, PAS SEULEMENT LES INVITÉS ────────────
  // Relevé du 9 août 2026 : 42 personnes utilisent Monac'Out depuis leur navigateur
  // sans avoir l'app. Rien ne leur proposait de l'installer. On leur montre donc la
  // même invitation, après quelques secondes, et pas plus de 3 fois espacées de 7
  // jours — on propose, on ne harcèle pas.
  useEffect(() => {
    if (Capacitor.isNativePlatform() || showWelcome) return;
    if (!/iPhone|iPad|iPod/i.test(navigator.userAgent || "")) return;
    if (new URLSearchParams(window.location.search).get("invite")) return;   // déjà géré au-dessus
    if (!canAskAgain("monacout_install_asks", "monacout_install_last_ask", 3, 7)) return;
    const t = setTimeout(() => {
      noteAsked("monacout_install_asks", "monacout_install_last_ask");
      setShowInstallInvite(true);
      track("invite_web_shown", { source: "visite" });
    }, 8000);   // le temps de voir le fil : on propose l'app à quelqu'un qui l'utilise déjà
    return () => clearTimeout(t);
  }, [showWelcome]);

  // App NATIVE ouverte via un lien (Universal Link) : on récupère le ?invite= du lien reçu
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    const handle = CapApp.addListener("appUrlOpen", ({ url }) => {
      try {
        const u = new URL(url);
        const inv = u.searchParams.get("invite");
        if (inv) {
          localStorage.setItem("monacout_pending_invite", inv.trim().toLowerCase());
          setDeepLinkTick(t => t + 1);
        }
        const eid = u.searchParams.get("event");
        if (eid) {
          localStorage.setItem("monacout_pending_event", eid);
          setDeepLinkTick(t => t + 1);
        }
        // Retour du lien magique (Universal Link) : on établit la session dans l'app native.
        // Flux implicite → jetons dans le hash ; flux PKCE → ?code=.
        const hp = new URLSearchParams(u.hash?.startsWith("#") ? u.hash.slice(1) : "");
        const access_token = hp.get("access_token");
        const refresh_token = hp.get("refresh_token");
        const code = u.searchParams.get("code");
        if (supabase && access_token && refresh_token) {
          supabase.auth.setSession({ access_token, refresh_token });
        } else if (supabase && code) {
          supabase.auth.exchangeCodeForSession(code);
        }
      } catch { /* lien non pertinent */ }
    });
    return () => { handle.then(h => h.remove()); };
  }, []);

  // Deep link natif ?event=<id> → ouvre directement la fiche événement
  useEffect(() => {
    const eid = localStorage.getItem("monacout_pending_event");
    if (!eid || !events?.length) return;
    const ev = events.find(e => String(e.id) === String(eid));
    if (ev) { setSelectedEvent(ev); localStorage.removeItem("monacout_pending_event"); }
  }, [events, deepLinkTick]);

  // Dès que la personne est connectée (avec un profil), on applique l'invitation en attente — SANS code à taper
  useEffect(() => {
    const inv = localStorage.getItem("monacout_pending_invite");
    if (!inv || !auth.user || !auth.profile) return;
    social.addFriendByCode(inv).then(r => {
      localStorage.removeItem("monacout_pending_invite");
      if (r?.name) {
        setInviteToast(lang === "en" ? `✅ Friend request sent to ${r.name}!` : `✅ Invitation envoyée à ${r.name} !`);
        setTab("friends");
      } else if (r?.error && r.error !== "Demande déjà envoyée") {
        setInviteToast(`ℹ️ ${r.error}`);
      }
      setTimeout(() => setInviteToast(null), 4500);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user, auth.profile, deepLinkTick]);

  // Invitation en attente + personne pas encore connectée → on propose l'inscription
  // et on affiche le prénom de l'ami qui invite (lu via le code, lecture publique autorisée).
  useEffect(() => {
    if (auth.loading || auth.user) return;
    const inv = localStorage.getItem("monacout_pending_invite");
    if (!inv) return;
    setShowAuth(true);
    if (supabase) {
      supabase.from("profiles").select("display_name").eq("invite_code", inv).single()
        .then(({ data }) => { if (data?.display_name) setInviterName(data.display_name); });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.loading, auth.user, deepLinkTick]);

  function handleTabChange(newTab) {
    const el = document.getElementById("main-scroll");
    if (newTab !== tab) {
      setCatFilters([]);
      setTab(newTab);
      if (el) el.scrollTop = 0;
    }
  }

  function handleCatFilter(catId) {
    setCatFilters(prev => {
      const active = prev.includes(catId);
      if (!active) track("filter_used", { filter: catId });   // seulement à l'activation d'un filtre
      return active ? prev.filter(f => f !== catId) : [...prev, catId];
    });
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
      if (!prev.includes(id)) {
        track("favorite_added", { event_id: id });   // ajout d'un favori (jamais au retrait)
        // 1er favori sans compte → on invite (une seule fois) à sauvegarder ses favoris.
        // Sinon (déjà connectée, ou nudge déjà vu) → on propose les notifs au bon moment.
        const nudged = maybeAskSignup("fav_nudge");
        if (!nudged) maybeAskNotif();   // ajout d'un favori = intérêt fort → on propose (au bon moment)
      }
      return next;
    });
  }

  // Compte les signes d'intérêt (ouverture d'un événement).
  // 2 fiches dans la même visite, OU 3 fiches en cumulé → on sollicite.
  function bumpNotifEngagement() {
    engageRef.current += 1;
    const total = bumpCount("monacout_card_opens");
    if (!auth.user && total >= 3 && maybeAskSignup("cartes")) return;   // le compte d'abord
    if (engageRef.current >= 2 || total >= 3) maybeAskNotif();
  }

  function handleCardClick(e) {
    track("event_opened", { event_id: e.id, cat: e.cat });   // ouverture d'une fiche (au clic)
    setSelectedEvent(e);
    bumpNotifEngagement();
  }

  // ── Compteurs d'intérêt conservés d'une visite à l'autre ─────────────────
  // engageRef repart à zéro à chaque lancement ; ces compteurs-là, non.
  function readNum(k) { try { return parseInt(localStorage.getItem(k) || "0", 10) || 0; } catch { return 0; } }
  function writeNum(k, v) { try { localStorage.setItem(k, String(v)); } catch { /* ignore */ } }
  function bumpCount(k) { const v = readNum(k) + 1; writeNum(k, v); return v; }
  const DAY_MS = 86400000;

  // Autorise à reposer la question : au plus `max` fois en tout, espacées de `days` jours,
  // et jamais deux messages dans la même session.
  function canAskAgain(kAsks, kLast, max, days) {
    if (promptedThisSessionRef.current) return false;
    if (readNum(kAsks) >= max) return false;
    const last = readNum(kLast);
    return !last || Date.now() - last > days * DAY_MS;
  }
  function noteAsked(kAsks, kLast) {
    promptedThisSessionRef.current = true;
    writeNum(kAsks, readNum(kAsks) + 1);
    writeNum(kLast, Date.now());
  }

  // Invitation à ajouter sa photo — uniquement aux personnes CONNECTÉES qui n'en ont
  // pas encore. Sans ça elles ne sauraient pas que c'est possible : le carré du menu
  // ne se remarque pas. 2 fois maximum, à 14 jours d'écart.
  function maybeAskPhoto() {
    const p = authUserRef.current ? profileRef.current : null;
    if (!p || !p.display_name || p.avatar_url) return false;
    if (!canAskAgain("monacout_photo_asks", "monacout_photo_last_ask", 2, 14)) return false;
    noteAsked("monacout_photo_asks", "monacout_photo_last_ask");
    setShowPhotoNudge(true);
    track("photo_prompt_shown");
    return true;
  }

  // Invitation à créer un compte. Renvoie true si le message a été affiché.
  function maybeAskSignup(source) {
    if (auth.user) return false;
    if (!canAskAgain("monacout_signup_asks", "monacout_signup_last_ask", 2, 10)) return false;
    noteAsked("monacout_signup_asks", "monacout_signup_last_ask");
    setShowFavNudge(true);
    track("signup_prompt_shown", { source });
    return true;
  }

  // Affiche notre petit message maison AVANT la demande iOS.
  // Reposable jusqu'à 3 fois, à 7 jours d'intervalle : « plus tard » ne doit pas
  // valoir « plus jamais » (14 personnes sur 20 avaient répondu « plus tard »).
  async function maybeAskNotif() {
    if (!canAskAgain("monacout_notif_asks", "monacout_notif_last_ask", 3, 7)) return;
    if (Capacitor.isNativePlatform()) {
      try {
        const p = await LocalNotifications.checkPermissions();
        if (p.display === "prompt" || p.display === "prompt-with-rationale") {
          noteAsked("monacout_notif_asks", "monacout_notif_last_ask");
          setShowNotifPrompt(true);
          track("notif_prompt_shown");
        }
      } catch { /* ignore */ }
    } else if ("Notification" in window && Notification.permission === "default") {
      noteAsked("monacout_notif_asks", "monacout_notif_last_ask");
      setShowNotifPrompt(true);
      track("notif_prompt_shown");
    }
  }

  // La personne a dit OUI à notre message → on déclenche la vraie demande iOS puis on programme.
  async function acceptNotif() {
    setShowNotifPrompt(false);
    if (Capacitor.isNativePlatform()) {
      try {
        const perm = await LocalNotifications.requestPermissions();
        track("notif_permission", { result: perm.display });   // granted / denied → mesure le taux d'acceptation
        if (perm.display === "granted") { scheduleDigest(events, favorites, notifConfig, auth.profile?.preferred_topics); scheduleFavoriteReminders(events, favorites); scheduleFriendsNudge(!!auth.user, (social.friends || []).length); scheduleHighlightsReminder(events, favorites); }
      } catch { /* ignore */ }
    } else if ("Notification" in window) {
      try { const r = await Notification.requestPermission(); track("notif_permission", { result: r }); } catch { /* ignore */ }
    }
  }

  function handleGoingClick(eventId) {
    if (!auth.user) { setShowAuth(true); return; }
    social.toggleParticipation(eventId);
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

  // Liste pour l'AFFICHAGE : cartes annuaire (spa/musées/cinéma) réduites à une seule occurrence.
  // (Les notifications continuent d'utiliser `events` brut plus haut.)
  const displayEvents = useMemo(() => collapseVenueCards(events), [events]);

  const sharedProps = { favorites, onToggleFav: toggleFav, onCategoryClick: navigateToCategory, lang, onCardClick: handleCardClick, events: displayEvents, social, onGoingClick: handleGoingClick, loggedIn: !!auth.user, authReady: !auth.loading, onShowAuth: () => setShowAuth(true) };

  return (
    <>
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
      contactEmail={notifConfig?.contactEmail || "contact@monacout.com"}
      auth={auth}
      social={social}
      onShowAuth={() => setShowAuth(true)}
      pendingCount={social.pending?.length || 0}
    >
      {tab === "events" ? (
        <HomeScreen
          {...sharedProps}
          userName={auth.profile?.display_name || ""} avatarUrl={auth.profile?.avatar_url || ""}
          filter={homeFilter}
          onFilterChange={setHomeFilter}
          catFilters={catFilters}
          onCatFilter={handleCatFilter}
          onOpenMenu={() => setShowMenu(true)}
          onNavAgenda={() => handleTabChange("agenda")}
          onNavFriends={() => handleTabChange("friends")}
          pendingFriends={social.pending?.length || 0}
          onAdminOpen={() => setShowAdmin(true)}
          onLangChange={setLang}
        />
      ) : tab === "friends" ? (
        <FriendsScreen
          auth={auth}
          social={social}
          events={events}
          lang={lang}
          onShowAuth={() => setShowAuth(true)}
          onNavEvents={() => handleTabChange("events")}
          initialInviteCode={pendingInvite}
          onInviteConsumed={() => setPendingInvite(null)}
        />
      ) : (
        <FavoritesScreen
          {...sharedProps}
          onNavEvents={() => handleTabChange("events")}
        />
      )}
      {showAuth && (
        <AuthScreen
          onClose={() => setShowAuth(false)}
          auth={auth}
          lang={lang}
          inviterName={inviterName}
        />
      )}
      {showWelcome && (
        <WelcomeScreen
          lang={lang}
          onLogin={() => { localStorage.setItem("monacout_welcomed", "1"); setShowWelcome(false); setShowAuth(true); }}
          onExplore={() => { localStorage.setItem("monacout_welcomed", "1"); setShowWelcome(false); }}
        />
      )}
    </Shell>

    {/* Invitation douce à créer un compte après le 1er favori (conversion, jamais bloquante) */}

    {/* Invitation à ajouter sa photo — uniquement aux personnes connectées qui n'en
        ont pas. Sans ce message elles ne sauraient pas que c'est possible : le petit
        carré du menu passe inaperçu. Sélecteur de photos standard (aucun plugin natif). */}
    {showPhotoNudge && auth.user && (
      <div style={{ position: "fixed", inset: 0, zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,29,58,0.45)" }}>
        <div style={{ background: "#FFFDF7", border: "1px solid #C9A96E", borderRadius: 8, maxWidth: 300, margin: 20, padding: "26px 22px", textAlign: "center", boxShadow: "0 12px 44px rgba(0,0,0,0.28)" }}>
          <label htmlFor="mo-avatar-nudge" style={{ display: "block", width: 72, margin: "0 auto 12px", cursor: "pointer" }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%", border: "1px solid rgba(15,29,58,0.25)",
              background: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
              color: "#9AA0AE", fontSize: 20, fontFamily: "'Lato', sans-serif",
            }}>＋</div>
          </label>
          <input
            id="mo-avatar-nudge" type="file" accept="image/*" style={{ display: "none" }}
            onChange={async e => {
              const f = e.target.files?.[0]; e.target.value = "";
              if (!f) return;
              try {
                const url = await fichierVersAvatar(f);
                await auth.saveProfile(auth.profile?.display_name || "", undefined, url);
                track("photo_added");
                setShowPhotoNudge(false);
              } catch { /* photo illisible : on laisse le message ouvert */ }
            }}
          />
          <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 16, color: "#0F1D3A", marginBottom: 8, letterSpacing: 0.5 }}>
            {lang === "en" ? "Add your photo" : "Ajoute ta photo"}
          </div>
          <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: "#6A7080", lineHeight: 1.5, marginBottom: 20 }}>
            {lang === "en"
              ? "Your friends will recognise you on the outings you're going to."
              : "Tes amis te reconnaîtront sur les sorties où tu vas."}
          </div>
          <label htmlFor="mo-avatar-nudge" style={{ display: "block", width: "100%", padding: 12, background: "#0F1D3A", color: "#fff", borderRadius: 3, cursor: "pointer", fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8, boxSizing: "border-box" }}>
            {lang === "en" ? "Choose my photo" : "Choisir ma photo"}
          </label>
          <button onClick={() => { setShowPhotoNudge(false); track("photo_later"); }} style={{ width: "100%", padding: 8, background: "none", color: "#6A7080", border: "none", cursor: "pointer", fontFamily: "'Lato', sans-serif", fontSize: 12 }}>
            {lang === "en" ? "Later" : "Plus tard"}
          </button>
        </div>
      </div>
    )}

    {showFavNudge && !auth.user && (
      <div style={{ position: "fixed", inset: 0, zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,29,58,0.45)" }}>
        <div style={{ background: "#FFFDF7", border: "1px solid #C9A96E", borderRadius: 8, maxWidth: 300, margin: 20, padding: "26px 22px", textAlign: "center", boxShadow: "0 12px 44px rgba(0,0,0,0.28)" }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>❤️</div>
          <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 16, color: "#0F1D3A", marginBottom: 8, letterSpacing: 0.5 }}>
            {lang === "en" ? "Keep your favourites" : "Garde tes favoris"}
          </div>
          <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: "#6A7080", lineHeight: 1.5, marginBottom: 20 }}>
            {lang === "en"
              ? "Create your account to keep your favourite outings — even on a new phone — and see the ones your friends are going to."
              : "Crée ton compte pour retrouver tes sorties favorites même en changeant de téléphone — et voir celles de tes amis."}
          </div>
          <button onClick={() => { setShowFavNudge(false); setShowAuth(true); }} style={{ width: "100%", padding: 12, background: "#0F1D3A", color: "#fff", border: "none", borderRadius: 3, cursor: "pointer", fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
            {lang === "en" ? "Create my account" : "Créer mon compte"}
          </button>
          <button onClick={() => setShowFavNudge(false)} style={{ width: "100%", padding: 8, background: "none", color: "#6A7080", border: "none", cursor: "pointer", fontFamily: "'Lato', sans-serif", fontSize: 12 }}>
            {lang === "en" ? "Later" : "Plus tard"}
          </button>
        </div>
      </div>
    )}

    {/* Petit message maison AVANT la demande iOS de notifications (meilleure acceptation) */}
    {showNotifPrompt && (
      <div style={{ position: "fixed", inset: 0, zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,29,58,0.45)" }}>
        <div style={{ background: "#FFFDF7", border: "1px solid #C9A96E", borderRadius: 8, maxWidth: 300, margin: 20, padding: "26px 22px", textAlign: "center", boxShadow: "0 12px 44px rgba(0,0,0,0.28)" }}>
          <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 16, color: "#0F1D3A", marginBottom: 8, marginTop: 4, letterSpacing: 0.5 }}>
            {lang === "en" ? "Never miss a great outing" : "Ne rate aucune belle sortie"}
          </div>
          <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: "#6A7080", lineHeight: 1.5, marginBottom: 20 }}>
            {lang === "en"
              ? "A reminder of the outings not to miss, right on your phone."
              : "Un rappel des sorties à ne pas manquer, direct sur ton téléphone."}
          </div>
          <button onClick={acceptNotif} style={{ width: "100%", padding: 12, background: "#0F1D3A", color: "#fff", border: "none", borderRadius: 3, cursor: "pointer", fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
            {lang === "en" ? "Yes, notify me" : "Oui, préviens-moi"}
          </button>
          <button onClick={() => { setShowNotifPrompt(false); track("notif_later"); }} style={{ width: "100%", padding: 8, background: "none", color: "#6A7080", border: "none", cursor: "pointer", fontFamily: "'Lato', sans-serif", fontSize: 12 }}>
            {lang === "en" ? "Later" : "Plus tard"}
          </button>
        </div>
      </div>
    )}

    {/* Bannière in-app browser (WhatsApp/Instagram) : invite reçue mais session absente */}
    {/* Invitation reçue, ouverte dans un vrai navigateur sur téléphone : la personne
        n'a pas l'app. On la lui propose, sans l'y forcer, et on garde son code
        affiché en clair pour qu'elle puisse le saisir après installation. */}
    {showInstallInvite && (
      <div style={{ position: "fixed", inset: 0, zIndex: 4000, background: "rgba(15,29,58,0.55)", display: "flex", alignItems: "flex-end" }}>
        <div style={{ position: "relative", width: "100%", background: "#FFFDF7", borderRadius: "16px 16px 0 0", padding: "26px 24px 34px", textAlign: "center", borderTop: "1px solid #C9A96E" }}>
          <div style={{ fontFamily: "Georgia, 'Playfair Display', serif", fontWeight: 700, fontSize: 40, color: "#0F1D3A", lineHeight: 1 }}>M</div>
          <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 15, fontWeight: 600, letterSpacing: 1, color: "#0F1D3A", marginTop: 12, marginBottom: 8 }}>
            {inviterName
              ? (lang === "en" ? `${inviterName} invites you to Monac'Out` : `${inviterName} t'invite sur Monac'Out`)
              : (lang === "en" ? "You're invited to Monac'Out" : "Tu es invité·e sur Monac'Out")}
          </div>
          <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 13.5, color: "#4A5568", lineHeight: 1.6, marginBottom: 18 }}>
            {lang === "en"
              ? "Everything happening in Monaco, in one app. Free."
              : "Tout ce qui se passe à Monaco, dans une seule appli. Gratuite."}
          </div>
          <a href={APPSTORE_URL} target="_blank" rel="noopener noreferrer"
             onClick={() => track("invite_install_clic")}
             style={{ display: "block", width: "100%", padding: 13, background: "#0F1D3A", color: "#fff", borderRadius: 3, textDecoration: "none", fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", boxSizing: "border-box" }}>
            {lang === "en" ? "Get the app — free" : "Installer l'app — gratuit"}
          </a>
          <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, color: "#6A7080", marginTop: 14, lineHeight: 1.6 }}>
            {lang === "en" ? "Your invite code:" : "Ton code d'invitation :"}{" "}
            <b style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 15, letterSpacing: 3, color: "#C4A241" }}>{codeInvitation.toUpperCase()}</b>
            <br />
            {lang === "en" ? "Enter it in My Circle after installing." : "À saisir dans Mon Cercle après l'installation."}
          </div>
          {/* Pas de « continuer sur le site » : décision de Stéphanie le 9 août 2026,
              elle veut que le lien mène à l'app. Une petite croix discrète reste,
              volontairement : un écran sans aucune issue est ce qui a produit la
              page noire du 7 août, et on ne piège personne. */}
          <button onClick={() => { setShowInstallInvite(false); track("invite_web_ferme"); }}
                  aria-label={lang === "en" ? "Close" : "Fermer"}
                  style={{ position: "absolute", top: 10, right: 14, background: "none", border: "none", color: "#B8BEC6", fontSize: 20, lineHeight: 1, cursor: "pointer", padding: 4 }}>✕</button>
        </div>
      </div>
    )}

    {showInAppBanner && (
      <div style={{ position: "fixed", inset: 0, zIndex: 4000, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "flex-end" }}>
        <div style={{ width: "100%", background: "#fff", borderRadius: "16px 16px 0 0", padding: "28px 24px 40px", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔗</div>
          <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontWeight: 600, fontSize: 15, color: "#0F1D3A", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>
            {inviterName ? `${inviterName} t'invite sur Monac'Out !` : "Invitation Monac'Out"}
          </div>
          <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 13.5, color: "#4A5568", lineHeight: 1.6, marginBottom: 20 }}>
            {lang === "en"
              ? "Open this link in Safari so you can connect with your friend."
              : "Pour vous connecter, ouvre ce lien dans Safari.\nAppuie sur ⋯ puis « Ouvrir dans Safari »."}
          </div>
          <button
            onClick={() => { window.open(window.location.origin + "?invite=" + (localStorage.getItem("monacout_pending_invite") || ""), "_blank"); }}
            style={{ width: "100%", padding: "14px 0", background: "#0F1D3A", color: "#fff", border: "none", borderRadius: 4, fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", marginBottom: 10 }}
          >
            {lang === "en" ? "Open in Safari" : "Ouvrir dans Safari"}
          </button>
          <button onClick={() => setShowInAppBanner(false)} style={{ background: "none", border: "none", color: "#9AA0A6", fontFamily: "'Lato', sans-serif", fontSize: 13, cursor: "pointer" }}>
            {lang === "en" ? "Dismiss" : "Ignorer"}
          </button>
        </div>
      </div>
    )}

    {/* Confirmation d'ajout d'ami via lien */}
    {inviteToast && (
      <div style={{ position: "fixed", bottom: 30, left: "50%", transform: "translateX(-50%)", zIndex: 3000, background: "#0F1D3A", color: "#fff", padding: "12px 20px", borderRadius: 6, fontFamily: "'Lato', sans-serif", fontSize: 13, boxShadow: "0 6px 24px rgba(0,0,0,0.3)", maxWidth: "85%", textAlign: "center" }}>
        {inviteToast}
      </div>
    )}

    {/* Bandeau discret « mise à jour disponible » (piloté par notif-config.json) */}
    {updateAvailable && (
      <div style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", zIndex: 3200, display: "flex", alignItems: "center", gap: 12, background: "#FFFDF7", border: "1px solid #C9A96E", borderRadius: 8, padding: "10px 12px 10px 16px", boxShadow: "0 8px 30px rgba(0,0,0,0.22)", maxWidth: "88%" }}>
        <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 12.5, color: "#0F1D3A", lineHeight: 1.4 }}>
          {lang === "en" ? "A new version is available." : "Une nouvelle version est disponible."}
        </div>
        <a href={APPSTORE_URL} target="_blank" rel="noopener noreferrer"
          style={{ flexShrink: 0, background: "#0F1D3A", color: "#fff", textDecoration: "none", padding: "8px 14px", borderRadius: 4, fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
          {lang === "en" ? "Update" : "Mettre à jour"}
        </a>
        <button onClick={() => {
          const latest = notifConfig?.latestVersion;
          if (latest) localStorage.setItem("monacout_update_dismissed", String(latest));
          setUpdateAvailable(false);
        }} style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer", fontSize: 15, color: "#6A7080", lineHeight: 1, padding: "0 2px" }}>✕</button>
      </div>
    )}

    </>
  );
}
