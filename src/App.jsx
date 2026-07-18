import { useState, useEffect, useRef } from "react";
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
      const hasFav = top.some(e => favorites.includes(e.id));
      const body = top.map(e => {
        const d = parseForNotif(e);
        const titre = e.title.replace(/\n/g, ' ');
        const lieu = e.subtitle ? e.subtitle.split(' · ')[0] : '';
        return `• ${JOURS_FR[d.getDay()]} ${d.getDate()} — ${titre}${lieu ? ' · ' + lieu : ''}`;
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
      title: 'Demain à Monaco ✨',
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
        { days: 2, title: '👥 Ajoute tes amis', body: 'Ajoute tes amis pour vous retrouver aux événements.' },
        { days: 6, title: '👥 Vois où sortent tes amis', body: 'Ajoute tes amis pour vous retrouver aux événements à Monaco.' },
      ]
    : [
        { days: 3, title: '👥 Agrandis ton cercle', body: 'Ajoute plus d\'amis pour vous retrouver aux événements.' },
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
  await LocalNotifications.schedule({ notifications: [{ id: HILITE_ID, title: 'À ne pas manquer à Monaco ✨', body, schedule: { at } }] });
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
  const [events, setEvents] = useState(BUNDLED_EVENTS);
  const [notifConfig, setNotifConfig] = useState(null);
  const [showNotifPrompt, setShowNotifPrompt] = useState(false);
  const [inviteToast, setInviteToast] = useState(null);
  const [inviterName, setInviterName] = useState(null);
  const [showInAppBanner, setShowInAppBanner] = useState(false);
  const [announce, setAnnounce] = useState(null);   // annonce in-app : message à TOUS (même sans notifs), piloté par notif-config.json
  const [deepLinkTick, setDeepLinkTick] = useState(0);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const askedNotifRef = useRef(localStorage.getItem("monacout_notif_asked") === "1");
  const engageRef = useRef(0);
  const eventLinkRef = useRef(false);

  useEffect(() => { scheduleDigest(events, favorites, notifConfig, auth.profile?.preferred_topics); scheduleFavoriteReminders(events, favorites); scheduleHighlightsReminder(events, favorites); }, [events, favorites, notifConfig, auth.profile]);
  useEffect(() => { scheduleFriendsNudge(!!auth.user, (social.friends || []).length); }, [auth.user, social.friends]);
  // Annonce in-app (broadcast à tous, même sans notifs) : affichée si présente, non expirée et non fermée.
  useEffect(() => {
    const a = notifConfig?.announcement;
    if (!a || !a.id || !a.message) return setAnnounce(null);
    if (a.until && new Date(a.until + "T23:59:59") < new Date()) return setAnnounce(null);
    if (localStorage.getItem("monacout_announce_dismissed") === String(a.id)) return setAnnounce(null);
    setAnnounce(a);
  }, [notifConfig]);
  useEffect(() => { localStorage.setItem("monacout_lang", lang); }, [lang]);

  // Récupère les événements EN DIRECT depuis le site (corrections sans passer par Apple)
  useEffect(() => {
    fetchLiveEvents().then(live => { if (live && live.length) setEvents(live); });
  }, []);

  // Récupère les réglages de notifications EN DIRECT (jours/heure/fréquence sans passer par Apple)
  useEffect(() => {
    fetchNotifConfig().then(cfg => { if (cfg) setNotifConfig(cfg); });
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
    if (isInApp) {
      if (supabase) {
        supabase.from("profiles").select("display_name").eq("invite_code", inv.trim().toLowerCase()).single()
          .then(({ data }) => { if (data?.display_name) setInviterName(data.display_name); });
      }
      setShowInAppBanner(true);
    }
  }, []);

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
      if (!prev.includes(id)) maybeAskNotif();   // ajout d'un favori = intérêt fort → on propose (au bon moment)
      return next;
    });
  }

  // Compte les signes d'intérêt (ouverture d'un événement). Au 2e → on propose les notifs.
  function bumpNotifEngagement() {
    engageRef.current += 1;
    if (engageRef.current >= 2) maybeAskNotif();
  }

  function handleCardClick(e) {
    setSelectedEvent(e);
    bumpNotifEngagement();
  }

  // Affiche notre petit message maison AVANT la demande iOS — une seule fois, si pas déjà répondu.
  async function maybeAskNotif() {
    if (askedNotifRef.current) return;
    if (Capacitor.isNativePlatform()) {
      try {
        const p = await LocalNotifications.checkPermissions();
        if (p.display === "prompt" || p.display === "prompt-with-rationale") {
          askedNotifRef.current = true;
          localStorage.setItem("monacout_notif_asked", "1");
          setShowNotifPrompt(true);
        }
      } catch { /* ignore */ }
    } else if ("Notification" in window && Notification.permission === "default") {
      askedNotifRef.current = true;
      localStorage.setItem("monacout_notif_asked", "1");
      setShowNotifPrompt(true);
    }
  }

  // La personne a dit OUI à notre message → on déclenche la vraie demande iOS puis on programme.
  async function acceptNotif() {
    setShowNotifPrompt(false);
    if (Capacitor.isNativePlatform()) {
      try {
        const perm = await LocalNotifications.requestPermissions();
        if (perm.display === "granted") { scheduleDigest(events, favorites, notifConfig, auth.profile?.preferred_topics); scheduleFavoriteReminders(events, favorites); scheduleFriendsNudge(!!auth.user, (social.friends || []).length); scheduleHighlightsReminder(events, favorites); }
      } catch { /* ignore */ }
    } else if ("Notification" in window) {
      try { await Notification.requestPermission(); } catch { /* ignore */ }
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

  const sharedProps = { favorites, onToggleFav: toggleFav, onCategoryClick: navigateToCategory, lang, onCardClick: handleCardClick, events, social, onGoingClick: handleGoingClick, loggedIn: !!auth.user, onShowAuth: () => setShowAuth(true) };

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
          userName={auth.profile?.display_name || ""}
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

    {/* Petit message maison AVANT la demande iOS de notifications (meilleure acceptation) */}
    {showNotifPrompt && (
      <div style={{ position: "fixed", inset: 0, zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15,29,58,0.45)" }}>
        <div style={{ background: "#FFFDF7", border: "1px solid #C9A96E", borderRadius: 8, maxWidth: 300, margin: 20, padding: "26px 22px", textAlign: "center", boxShadow: "0 12px 44px rgba(0,0,0,0.28)" }}>
          <div style={{ fontSize: 34, marginBottom: 10 }}>✨</div>
          <div style={{ fontFamily: "'Josefin Sans', sans-serif", fontSize: 16, color: "#0F1D3A", marginBottom: 8, letterSpacing: 0.5 }}>
            {lang === "en" ? "Get notified of outings?" : "Être prévenue des sorties ?"}
          </div>
          <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: "#6A7080", lineHeight: 1.5, marginBottom: 20 }}>
            {lang === "en"
              ? "Get a little reminder of the best outings in Monaco (2-3× a week). You can stop anytime."
              : "Reçois un petit rappel des plus belles sorties à Monaco (2-3× par semaine). Tu pourras arrêter quand tu veux."}
          </div>
          <button onClick={acceptNotif} style={{ width: "100%", padding: 12, background: "#0F1D3A", color: "#fff", border: "none", borderRadius: 3, cursor: "pointer", fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>
            {lang === "en" ? "Yes, notify me" : "Oui, préviens-moi"}
          </button>
          <button onClick={() => setShowNotifPrompt(false)} style={{ width: "100%", padding: 8, background: "none", color: "#6A7080", border: "none", cursor: "pointer", fontFamily: "'Lato', sans-serif", fontSize: 12 }}>
            {lang === "en" ? "Later" : "Plus tard"}
          </button>
        </div>
      </div>
    )}

    {/* Bannière in-app browser (WhatsApp/Instagram) : invite reçue mais session absente */}
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

    {/* Annonce in-app : message à TOUS (même sans notifs), piloté par notif-config.json → announcement */}
    {announce && (
      <div style={{ position: "fixed", top: 12, left: "50%", transform: "translateX(-50%)", zIndex: 3300, display: "flex", alignItems: "center", gap: 10, background: "#0F1D3A", color: "#fff", border: "1px solid #C9A96E", borderRadius: 10, padding: "10px 12px 10px 15px", boxShadow: "0 10px 34px rgba(0,0,0,0.32)", maxWidth: "92%" }}>
        <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 12.5, lineHeight: 1.4 }}>
          {lang === "en" && announce.messageEn ? announce.messageEn : announce.message}
        </div>
        {announce.link && (
          <a href={announce.link} target="_blank" rel="noopener noreferrer"
            style={{ flexShrink: 0, background: "#C4A241", color: "#0F1D3A", textDecoration: "none", padding: "7px 12px", borderRadius: 5, fontFamily: "'Josefin Sans', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 0.5, whiteSpace: "nowrap" }}>
            {lang === "en" && announce.ctaEn ? announce.ctaEn : (announce.cta || "Voir")}
          </a>
        )}
        <button onClick={() => { localStorage.setItem("monacout_announce_dismissed", String(announce.id)); setAnnounce(null); }}
          style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer", fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1, padding: "0 2px" }}>✕</button>
      </div>
    )}
    </>
  );
}
