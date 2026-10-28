import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { ALL_EVENTS } from "../../data/events";
import { localizeTitle, localizeCat } from "../../i18n";
import MonacOutLogo from "../MonacOutLogo";
import EventCard, { addToCalendar, partagerEvenement, FriendAvatars } from "../EventCard";
import CalendarPicker from "../CalendarPicker";
import { track } from "../../lib/track";
import { couleurCat } from "../../lib/couleurs";
import { NUIT, BORDEAU, CREME, FOND_PAGE, BLANC, OR, GRIS, GRIS_LISIBLE, BORDURE, SAUGE, RAYON, OMBRE, SERIF, SANS, casseNaturelle, apprendreLesNomsPropres } from "../../lib/theme";
import { Capacitor } from "@capacitor/core";
import { ouvrirItineraire } from "../../lib/itineraire";
import { lienDeReservation, lienDuSite, actionDeReservation } from "../../lib/reservation";
import { CarrouselHero, TitreSection, GrilleDeuxColonnes, CarteRangee, BandeRegroupement } from "../AccueilMaquette";
import { mediaDeLaFiche } from "../../lib/mediatheque";
import VueReservation from "../VueReservation";
import { partagerInvitation } from "../../lib/invite";

const NAVY = NUIT;            // charte du 28 oct 2026 : bleu nuit #15263B
const GOLD = BORDEAU;         // le « doré » historique est en fait le bordeaux d'action
const GREY = GRIS_LISIBLE;    // gris doux assombri d'un cran pour rester lisible
const WHITE = "#FFFFFF";
const CREAM = FOND_PAGE;      // fond de page blanc (28 oct 2026)
const BORDER = BORDURE;       // bordures légères #E8E2DA
// Les rayures bleues sont retirées (10 oct 2026, décision de Stéphanie sur
// maquette : « on enlève les rayures on met juste le nom »). Le bleu #9FC3DC
// était la dernière note froide de l'écran, orpheline depuis le passage au
// Rouge H. L'en-tête est maintenant blanc, le nom porte seul.
const STRIPE_BG = "#FFFFFF";

// Met un texte à plat pour la recherche : minuscules, sans accents, et toute
// ponctuation (tirets, points médians, apostrophes…) remplacée par une espace.
// « Monte-Carlo Summer Festival » et « monte carlo summer festival » deviennent
// alors le même texte.
function normalizeForSearch(str) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// Boutons de catégories groupées (barre sous les filtres temps, à la place des quartiers)
const EVENT_GROUPS = [
  { id: "culture",   label: "Musée/Ciné/Atelier", labelEn: "Museum/Cinema/Workshop", cats: ["EXPOSITION","CONFÉRENCE","CINÉMA","THÉÂTRE","OPÉRA","MUSICAL","SPECTACLE","FESTIVAL","ENCHÈRES","MARCHÉ","SALON","FÊTE NATIONALE","ATELIER","DANSE","BIEN-ÊTRE"] },
  { id: "foodnight", label: "Food/Nightlife", labelEn: "Food/Nightlife", cats: ["BRUNCH","APÉRO","FOODY","SOIRÉE","DJ SET","GALA"] },
  { id: "musique",   label: "Concert/Ballet/Opéra", labelEn: "Concert/Ballet/Opera", cats: ["CONCERT","OPÉRA","MUSICAL","DANSE","JAZZ LIVE","CHANTS"] },
  { id: "sport",     label: "Sport",     labelEn: "Sport",     cats: ["FOOTBALL","BASKET","FORMULE 1","FORMULE E","TENNIS","RALLYE","SPORT"] },
  // Stéphanie, 11 oct 2026 : « on va créer un filtre breakfast café ».
  { id: "petitdej",  label: "Petit-déj & café", labelEn: "Breakfast & coffee", cats: ["PETIT-DÉJ"] },
];

const CAT_TO_FILTER = {
  FOOTBALL: "sport", BASKET: "sport", "FORMULE 1": "sport", "FORMULE E": "sport",
  SPORT: "sport", RALLYE: "sport", TENNIS: "sport",
  CONCERT: "concert", "OPÉRA": "concert", MUSICAL: "theatre", "JAZZ LIVE": "concert",
  "DJ SET": "soiree", CHANTS: "messe", "PETIT-DÉJ": "petitdej",
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

// Une expo « en cours » (ongoing:true) ne porte qu'UNE seule date — celle du jour,
// remise à jour chaque nuit. Elle disparaissait donc dès qu'on demandait le week-end
// ou une date de septembre au calendrier, alors qu'elle est ouverte jusqu'en janvier.
// On la fait apparaître sur toute sa durée : elle a commencé (sa date ≤ fin demandée)
// et elle n'est pas terminée (son `until` ≥ début demandé).
function couvreLaPeriode(e, debut, fin) {
  if (!e.ongoing || !e.until) return false;
  const finExpo = new Date(e.until + "T00:00:00");
  if (isNaN(finExpo)) return false;
  const d = parseEventDate(e);
  return !!d && finExpo >= debut && d <= fin;
}

// ── LES EXPOS DANS LE DÉFILEMENT ────────────────────────────────────────────────
// Le fil est une liste continue : chaque fiche y apparaît UNE fois, à sa date. Une
// exposition « en cours » n'a qu'une date — celle du jour — donc en descendant le fil
// on la voyait aujourd'hui puis plus jamais, alors qu'elle est ouverte tous les jours
// jusqu'en janvier. On la répète donc sur chacun de ses jours d'ouverture.
//
// La répétition est faite À L'AFFICHAGE, pas dans les données : aucune fiche n'est
// dupliquée dans events.js, aucun id n'est réutilisé, les favoris continuent de
// fonctionner (même id ⇒ mettre l'expo en favori la met partout, ce qui est voulu).
// Chaque copie reçoit une `cleFil` unique pour la clé React.
//
// Horizon : 120 jours. Au-delà, le fil deviendrait illisible pour un gain nul —
// personne ne fait défiler quatre mois. Les dates plus lointaines restent
// accessibles par le calendrier, qui applique `couvreLaPeriode` sans limite.
const HORIZON_EN_COURS = 120;

function etaleLesEnCours(liste) {
  const aujourdhui = new Date(); aujourdhui.setHours(0, 0, 0, 0);
  const horizon = new Date(aujourdhui);
  horizon.setDate(horizon.getDate() + HORIZON_EN_COURS);

  const sortie = [];
  for (const e of liste) {
    const debut = e.ongoing && e.until ? parseEventDate(e) : null;
    const fin = e.ongoing && e.until ? new Date(e.until + "T00:00:00") : null;
    if (!debut || !fin || isNaN(fin)) { sortie.push(e); continue; }

    // Première occurrence : aujourd'hui au plus tôt (une expo commencée en juin ne
    // doit pas réapparaître dans le passé). Dernière : sa fermeture, dans l'horizon.
    const d = new Date(Math.max(debut.getTime(), aujourdhui.getTime()));
    const derniere = new Date(Math.min(fin.getTime(), horizon.getTime()));
    if (d > derniere) { sortie.push(e); continue; }

    let premier = true;
    for (let j = new Date(d); j <= derniere; j.setDate(j.getDate() + 1)) {
      sortie.push({
        ...e,
        date: toFrDate(j),
        year: j.getFullYear(),
        cleFil: `${e.id}-${j.getFullYear()}-${j.getMonth() + 1}-${j.getDate()}`,
        // Repli quand aucun jour n'a été retenu (coche posée avant cette version, ou
        // sur un autre appareil) : on l'affiche sur la PREMIÈRE occurrence seulement,
        // jamais sur toutes — sinon on retombe sur le défaut signalé le 11 août 2026.
        premierJour: premier,
      });
      premier = false;
    }
  }
  // Indispensable : les copies sont créées à la place de l'originale, donc groupées.
  // Sans ce tri, 120 fiches « Victor Brauner » s'empilaient au milieu du fil au lieu
  // d'apparaître une par une, chacune à son jour.
  return sortie.sort((a, b) => {
    const da = parseEventDate(a), db = parseEventDate(b);
    if (!da || !db) return 0;
    return (da - db) || (heureDeTri(a) - heureDeTri(b));
  });
}

// Heure en minutes, pour trier à l'intérieur d'une même journée. Reprend la
// convention de src/data/events.js : « En journée » → 11h, « En soirée » → 21h.
function heureDeTri(e) {
  const t = (e.time || "").replace(/\s/g, "");
  const m = t.match(/^(\d{1,2})h(\d{2})?/);
  if (m) return parseInt(m[1]) * 60 + (m[2] ? parseInt(m[2]) : 0);
  const mot = t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  // 🚨 LE VOCABULAIRE DOIT SUIVRE LES FICHES. Stéphanie, 11 oct 2026 : « y a un
  // bug dans liste petit déj ». La fiche « PETIT-DÉJ & CAFÉ » porte l'heure
  // « Le matin » — un mot que cette fonction ne connaissait pas. Elle retombait
  // donc sur 9999, et 9999 vaut « après 18h » : un petit-déjeuner était annoncé
  // sous « CE SOIR », puis trié en dernier. Toute heure écrite en toutes lettres
  // doit avoir sa minute, sinon elle finit à la nuit.
  if (mot === "lematin" || mot === "matin") return 8 * 60;
  if (mot === "enjournee" || mot === "toutelajournee") return 11 * 60;
  if (mot === "lemidi" || mot === "amidi" || mot === "midi") return 12 * 60;
  if (mot === "lapresmidi" || mot === "enapresmidi" || mot === "apresmidi") return 15 * 60;
  if (mot === "ensoiree" || mot === "lesoir" || mot === "soir") return 21 * 60;
  return SANS_HEURE;
}

// ⚠️ La valeur de repli n'est PAS une heure : c'est l'absence d'heure. Elle sert
// à trier en dernier, jamais à décider d'un moment de la journée.
const SANS_HEURE = 9999;

// 🚨 DEUX FINS DIFFÉRENTES, ET IL FAUT LES DISTINGUER. Stéphanie, 11 oct 2026,
// 21h45 : « j'ai la fiche petit déj or il est 21.45 », rangée sous MAINTENANT.
// `finEnMinutes` rend 24h pour les annuaires et les fiches « en cours », et c'est
// VOULU : elles doivent rester visibles le soir, quand on prépare sa sortie du
// lendemain (les sept expositions avaient disparu à 19h41, Stéphanie l'avait
// signalé). Mais cette même valeur servait aussi à décider « ça a lieu en ce
// moment » — et un petit-déjeuner n'a pas lieu à 21h45.
// `finReelle` ne sert QU'À ÇA : dire si c'est en cours. Elle ignore le 24h
// d'affichage et se fie à ce que la fiche annonce vraiment.
function finReelle(e) {
  const t = (e.time || "").replace(/\s/g, "");
  const plage = t.match(/^(\d{1,2})h(\d{2})?[\u2014\u2013\u2192>\-\u00e0]+(\d{1,2})h(\d{2})?/);
  if (plage) {
    const d = parseInt(plage[1]) * 60 + (plage[2] ? parseInt(plage[2]) : 0);
    const f = parseInt(plage[3]) * 60 + (plage[4] ? parseInt(plage[4]) : 0);
    return f <= d ? 24 * 60 : f;
  }
  const mot = t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (mot === "lematin" || mot === "matin") return 12 * 60;
  if (mot === "lemidi" || mot === "amidi" || mot === "midi") return 15 * 60;
  if (mot === "enjournee" || mot === "toutelajournee") return 18 * 60;
  if (mot === "lapresmidi" || mot === "enapresmidi" || mot === "apresmidi") return 19 * 60;
  if (mot === "ensoiree" || mot === "lesoir" || mot === "soir") return 24 * 60;
  const seul = t.match(/^(\d{1,2})h(\d{2})?/);
  if (seul) return parseInt(seul[1]) * 60 + (seul[2] ? parseInt(seul[2]) : 0) + 120;
  return 24 * 60;
}

// Une fiche du jour dont l'heure est passée n'a plus rien à proposer : à 15h48 on ne
// veut plus voir le cours de 07h00. On se fie à l'heure de FIN quand la fiche la donne
// (« 07h00 — 09h00 ») ; sinon au début plus deux heures, le temps qu'un concert ou un
// dîner déjà commencé reste rejoignable.
function finEnMinutes(e) {
  // Les récapitulatifs (« 6 musées ouverts », « 8 brunchs ») et les annuaires ne
  // portent qu'une heure d'ouverture : ils restent utiles toute la journée.
  //
  // 🚨 LES FICHES « EN COURS » AUSSI (ajouté le 10 oct 2026, Stéphanie : « il
  // manque les expositions »). Une exposition ouverte jusqu'en janvier n'est pas
  // TERMINÉE à 18h : elle est FERMÉE POUR LA NUIT, et elle rouvre demain. La règle
  // de la v0.0.106 — ne plus montrer ce qui est fini — vaut pour un concert, qui
  // n'aura pas lieu deux fois ; pas pour une expo. Résultat constaté un samedi à
  // 19h41 : les SEPT expositions du jour avaient disparu du fil, au moment précis
  // où l'on prépare sa sortie du lendemain. Leurs horaires restent écrits sur la
  // carte (« 09h00 — 18h00 ») : la personne voit bien que c'est fermé maintenant.
  if (e.recap === true || e.pinLast === true || e.ongoing === true) return 24 * 60;
  const t = (e.time || "").replace(/\s/g, "");
  // Le fil écrit les plages avec un tiret cadratin OU une flèche : « 09h — 18h »,
  // « 9h30 → 18h30 ». Oublier la flèche masquait la messe du dimanche dès 11h30.
  const plage = t.match(/^(\d{1,2})h(\d{2})?[\u2014\u2013\u2192>\-\u00e0]+(\d{1,2})h(\d{2})?/);
  if (plage) {
    const debut = parseInt(plage[1]) * 60 + (plage[2] ? parseInt(plage[2]) : 0);
    const fin   = parseInt(plage[3]) * 60 + (plage[4] ? parseInt(plage[4]) : 0);
    return fin <= debut ? 24 * 60 : fin;   // « 23h00 — 04h00 » se termine le lendemain
  }
  const seul = t.match(/^(\d{1,2})h(\d{2})?/);
  if (seul) return parseInt(seul[1]) * 60 + (seul[2] ? parseInt(seul[2]) : 0) + 120;
  const mot = t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (mot === "enjournee") return 18 * 60;
  return 24 * 60;   // « En soirée » ou horaire absent : on garde jusqu'au bout de la nuit
}

function filterByTime(events, filterId) {
  const todayStr = toFrDate(new Date()); const weekendDates = getWeekendDates();
  const maintenant = new Date().getHours() * 60 + new Date().getMinutes();
  const base = (() => {
  switch (filterId) {
    // Les fiches « en cours » sont déjà étalées jour par jour en amont
    // (etaleLesEnCours) : ces filtres n'ont donc rien de spécial à faire.
    case "today": { const y = new Date().getFullYear(); return events.filter(e => e.date === todayStr && (e.year || y) === y); }
    case "weekend": { const y = new Date().getFullYear(); return events.filter(e => weekendDates.includes(e.date) && (e.year || y) === y); }
    case "week": {
      const today = new Date(); today.setHours(0,0,0,0);
      const in7 = new Date(today); in7.setDate(today.getDate() + 6);
      return events.filter(e => { const d = parseEventDate(e); return d && d >= today && d <= in7; });
    }
    default: return events;
  }
  })();
  // Le fil est une proposition de sortie, pas un journal : on masque ce qui est
  // terminé. Les autres jours ne sont pas concernés.
  return base.filter(e => e.date !== todayStr || finEnMinutes(e) > maintenant);
}

// ── LE FIL EN SECTIONS ───────────────────────────────────────────────────────
// Stéphanie, 6 septembre 2026 : « lorsque l'on scrolle il y a une sensation de
// répétition ». Elle avait raison, et c'était mesurable : « AUJOURD'HUI » écrit
// vingt fois, une fois par carte, et treize expositions qui se suivaient sans
// rien entre elles. Trois gestes y répondent — la date passe en intertitre au
// lieu d'être répétée, la journée en cours se découpe en moments, et les
// expositions d'une même section se réunissent sur une seule carte.

const JOURS_LONGS_FR = ["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];
const MOIS_LONGS_FR  = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
const JOURS_LONGS_EN = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MOIS_LONGS_EN  = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// « Dim 6 sep » → « DIMANCHE 6 SEPTEMBRE »
function titreDeJour(dateStr, lang) {
  const p = (dateStr || "").split(" ");
  const j = JOURS.indexOf(p[0]), m = MOIS_IDX[p[2]];
  if (j < 0 || m === undefined) return dateStr || "";
  return lang === "en"
    ? `${JOURS_LONGS_EN[j]} ${p[1]} ${MOIS_LONGS_EN[m]}`
    : `${JOURS_LONGS_FR[j]} ${p[1]} ${MOIS_LONGS_FR[m]}`;
}

// ⚠️ `jourConsulte` : la journée réellement demandée au calendrier. Sans lui, le
// découpage raisonnait toujours sur AUJOURD'HUI — Stéphanie, 15 septembre 2026 :
// elle clique sur le 18, et le fil titre « Maintenant ». C'est le même mensonge
// d'étiquette que « AUJOURD'HUI » sur les expositions, corrigé le 31 août : les
// fiches `ongoing` ne portent que la date du jour, et le calendrier les laisse
// passer pour toute date qu'elles couvrent.

/**
 * 🕐 LE MOMENT D'UNE FICHE — la MÊME règle que les intertitres du fil.
 *
 * Stéphanie, 28 oct 2026 : « la section "Ce matin" contient actuellement des
 * événements à 19h et 19h30. Ce n'est pas correct. »
 *
 * 🚨 D'OÙ VENAIT LA FAUTE, ET ELLE ÉTAIT À MOI. La vitrine classait ses fiches
 * en mettant d'abord CELLES QUI ONT UNE PHOTO, pour que le hero soit beau. Le
 * titre, lui, lisait l'heure de la PREMIÈRE fiche de ce classement — donc une
 * fiche choisie pour sa photo, pas pour son heure. Un cours de 9 h en tête, et
 * « Ce matin » se retrouvait au-dessus de concerts de 19 h 30.
 *
 * La règle est maintenant la même partout : le moment se lit sur l'HEURE, la
 * vitrine ne mélange plus deux moments, et son titre décrit ce qu'elle montre.
 * Les heures sont celles des fiches, à l'heure de Monaco — on ne touche pas aux
 * données pour arranger l'affichage.
 */
function momentDeLaFiche(e, lang, min) {
  const debut = heureDeTri(e);
  const sansHeure = !(e.time && String(e.time).trim()) || debut === SANS_HEURE;
  if (sansHeure) return { cle: "apresmidi", titre: lang === "en" ? "This afternoon" : "Cet après-midi" };
  // En cours : commencé et pas encore fini. C'est le seul « Maintenant » honnête.
  if (typeof min === "number" && debut <= min && finReelle(e) > min) {
    return { cle: "maintenant", titre: lang === "en" ? "Right now" : "Maintenant" };
  }
  // 🖼️ CE QUI DURE TOUTE LA JOURNÉE N'EST PAS « CE MATIN ».
  // Une exposition « 09h00 — 18h00 » commence le matin, mais l'annoncer sous
  // « Ce matin » est faux : on peut y aller à 15 h. Et à 18 h 18, c'était même
  // absurde — Stéphanie l'a vu. Une plage qui dépasse quatre heures et franchit
  // midi s'annonce donc simplement « Aujourd'hui ».
  const fin = finReelle(e);
  if (fin - debut >= 4 * 60 && debut < 13 * 60 && fin > 14 * 60) {
    return { cle: "journee", titre: lang === "en" ? "Today" : "Aujourd'hui" };
  }

  // Le brunch ferme la matinée (règle 28), même arbitrage que dans le fil.
  if (e.cat === "BRUNCH" && debut < 14 * 60) return { cle: "matin", titre: lang === "en" ? "This morning" : "Ce matin" };
  if (debut < 12 * 60) return { cle: "matin",      titre: lang === "en" ? "This morning"   : "Ce matin" };
  if (debut < 18 * 60) return { cle: "apresmidi",  titre: lang === "en" ? "This afternoon" : "Cet après-midi" };
  return { cle: "soir", titre: lang === "en" ? "Tonight" : "Ce soir" };
}

function decouperEnSections(liste, lang, jourConsulte = null) {
  const now = new Date();
  const min = now.getHours() * 60 + now.getMinutes();
  const aujourdhui = toFrDate(now);
  const d = new Date(now); d.setDate(d.getDate() + 1);
  const demain = toFrDate(d);

  const sections = [];
  let courante = null;
  // `jour` s'affiche en gros doré, une seule fois ; `moment` en dessous, plus discret.
  // Aujourd'hui n'a pas de jour : ses moments (Maintenant, Ce soir) tiennent la
  // place du titre, c'est ce qu'on lit en ouvrant l'app.
  const poser = (cle, jour, moment, e) => {
    if (!courante || courante.cle !== cle) { courante = { cle, jour, moment, items: [] }; sections.push(courante); }
    courante.items.push(e);
  };

  // Matin / après-midi / soir, d'après l'heure de DÉBUT. La liste étant triée par
  // cette même heure, les trois se suivent toujours dans l'ordre.
  const momentDuJour = (e) => {
    if (!(e.time && String(e.time).trim())) return lang === "en" ? "Afternoon" : "Après-midi";
    const debut = heureDeTri(e);
    // Une heure illisible ne dit rien du moment : on la traite comme une fiche
    // sans heure plutôt que de l'annoncer « ce soir ».
    if (debut === SANS_HEURE) return lang === "en" ? "Afternoon" : "Après-midi";
    // 🥐 LE BRUNCH FERME LA MATINÉE. Stéphanie, 24 oct 2026 : « la fiche brunch
    // doit apparaître juste avant l'après-midi ». Un brunch commence à midi, donc
    // il tombait dans « Après-midi », au milieu des apéros. Or c'est le repas du
    // matin : on le range en fin de matinée, où le tri par heure le place
    // naturellement en dernier — juste avant l'après-midi. L'heure affichée ne
    // change pas, c'est la SECTION qui change.
    if (e.cat === "BRUNCH" && debut < 14 * 60) return lang === "en" ? "Morning" : "Matin";
    if (debut < 12 * 60)      return lang === "en" ? "Morning" : "Matin";
    if (debut < 18 * 60)      return lang === "en" ? "Afternoon" : "Après-midi";
    return lang === "en" ? "Evening" : "Soir";
  };

  // En consultant une date, tout s'affiche sous CETTE journée : le tri par date
  // n'a plus de sens et cassait l'ordre des moments — les expositions « en cours »
  // portent la date du JOUR, pas celle qu'on consulte, donc elles passaient devant
  // et « Matin » réapparaissait après « Soir ». On retrie par heure.
  // Rang du moment, pour que les sections se suivent toujours dans l'ordre : une
  // fiche « en cours » commencée ce matin ne doit pas ramener « Maintenant » après
  // « Ce soir ».
  // 🚨 « Cette fiche a fini sa journée ». CE PRÉDICAT DOIT SERVIR AU TRI ET AU
  // PLACEMENT, sinon les deux se contredisent : le placement rangeait la fiche
  // sous « Demain » pendant que le tri la laissait avec aujourd'hui, et on
  // obtenait DEUX blocs « Demain », le second avec « Après-midi » avant
  // « Matin ». Stéphanie, 11 oct 2026 : « vérifie les sous fiches des
  // expositions y a un bug ».
  const finie = (e) => {
    if (jourConsulte || e.date !== aujourdhui) return false;
    if (!(e.time && String(e.time).trim())) return false;
    return finReelle(e) <= min;
  };
  // ⚠️ Et si DEMAIN A DÉJÀ SA FICHE, on ne remonte pas celle d'aujourd'hui :
  // une fiche « en cours » (petit-déj, musées, expositions) existe à toutes les
  // dates de sa période, donc la rattacher à demain la ferait apparaître DEUX
  // FOIS dans le même bloc. Constaté en vérifiant le fil le 11 oct 2026.
  // La comparaison se fait sur le TITRE, pas sur l'identifiant : la fiche cinéma
  // et les fiches d'annuaire sont REFABRIQUÉES chaque jour avec un id différent,
  // donc « même id » laissait passer deux fois « Les films au cinéma cette
  // semaine ». Deux fiches de même catégorie et de même titre, à deux dates,
  // sont la même chose répétée.
  // ⚠️ POUR UNE FICHE QUI SE REFABRIQUE CHAQUE JOUR, LE TITRE NE VA PAS NON PLUS :
  // il porte un COMPTE qui change. « MUSÉES 6 OUVERTS À MONACO » aujourd'hui et
  // « MUSÉES 4 OUVERTS À MONACO » demain sont la même fiche, et les deux se
  // retrouvaient dans la même journée — quatre musées affichés en double au
  // dépliage des expositions, et un total annoncé trop gros. Stéphanie, 11 oct
  // 2026 : « corrige les expo il y a des doublons il n'y a en vrai pas 26 expo ».
  // Le SOUS-TITRE, lui, ne bouge pas : c'est lui qui identifie ces fiches-là.
  const signature = e => (e.recap === true || e.ongoing === true) && e.subtitle
    ? `${e.cat}|${String(e.subtitle).replace(/\s+/g, " ").trim()}`
    : `${e.cat}|${(e.title || "").replace(/\s+/g, " ").trim()}`;
  const dejaApresAujourdhui = new Set(
    liste.filter(e => e.date !== aujourdhui).map(signature));
  const aDejaSaFicheDemain = (e) => dejaApresAujourdhui.has(signature(e));
  const rang = (e) => {
    if (jourConsulte) return 0;
    // Une fiche terminée a quitté l'échelle d'aujourd'hui : elle est affichée
    // sous DEMAIN. Lui laisser un rang de « plus tard » / « ce soir » la plaçait
    // APRÈS les vraies fiches de demain, et la journée affichait deux fois ses
    // moments — matin, après-midi, soir, puis matin à nouveau.
    if (finie(e)) return 0;
    if (e.date !== aujourdhui) return 0;
    const sansHeure = !(e.time && String(e.time).trim());
    const debut = heureDeTri(e), fin = finReelle(e);
    if (!sansHeure && debut <= min && min < fin) return 0;   // maintenant
    if (!sansHeure && debut >= 18 * 60) return 2;            // ce soir
    return 1;                                               // plus tard aujourd'hui
  };
  // Comparateur COHÉRENT : la date d'abord (sauf quand tout est ramené à la même
  // journée), puis le moment, puis l'heure. Un comparateur qui renvoie 0 pour des
  // paires incomparables laisse Array.sort libre de rendre n'importe quel ordre.
  // On trie sur la journée RÉELLEMENT AFFICHÉE — celle qui sert d'intertitre —
  // et non sur la date du fichier. Une fiche « en cours » porte la date du jour ;
  // rattachée au 18 septembre, elle doit se ranger avec le 18, pas avant tout le
  // monde. Puis le moment, puis l'heure.
  const jourAffiche = e => (jourConsulte && e.ongoing) ? jourConsulte : (finie(e) ? demain : e.date);
  const aRanger = liste.slice().sort((a, b) => {
    const da = parseEventDate({ ...a, date: jourAffiche(a) });
    const db = parseEventDate({ ...b, date: jourAffiche(b) });
    if (da && db && da - db !== 0) return da - db;
    return (rang(a) - rang(b)) || (heureDeTri(a) - heureDeTri(b));
  });

  for (const e of aRanger) {
    // En consultant une autre journée, « Maintenant » et « Ce soir » ne veulent
    // rien dire : on range sous la date demandée, découpée en moments.
    if (jourConsulte) {
      const jour = titreDeJour(e.ongoing ? jourConsulte : e.date, lang);   // en cours → jour consulté
      const moment = momentDuJour(e);
      poser(`${jour}|${moment}`, jour, moment, e);
      continue;
    }
    if (e.date === aujourdhui) {
      const sansHeure = !(e.time && String(e.time).trim());
      // ⚠️ `finReelle` et NON `finEnMinutes` : la seconde rend 24h pour les
      // annuaires afin qu'ils restent affichés le soir, ce qui faisait annoncer
      // « MAINTENANT » un petit-déjeuner à 21h45.
      const debut = heureDeTri(e), fin = finReelle(e);
      // Une fiche sans horaire ne dit rien de son moment : l'annoncer « ce soir »
      // serait affirmer un horaire qu'elle ne donne pas.
      // 🚨 UNE FICHE TERMINÉE N'EST PAS « PLUS TARD AUJOURD'HUI ». Stéphanie,
      // 11 oct 2026, 22h : « mais j'ai plus tard aujourd'hui petit déj..ça va pas ».
      // Les fiches « en cours » (petit-déj, musées, expositions) restent
      // volontairement affichées le soir — c'est le moment où l'on prépare sa
      // sortie — mais leur journée est finie. Ce n'est donc pas d'aujourd'hui
      // qu'elles parlent, c'est de DEMAIN, et c'est ce qu'elles doivent annoncer.
      if (!sansHeure && debut <= min && min < fin) poser("maintenant", null, lang === "en" ? "Right now" : "Maintenant", e);
      else if (finie(e)) {
        // Sa journée est faite. Si la même fiche existe déjà pour un jour suivant,
        // on la laisse tomber — c'est l'autre qui parle de demain.
        if (aDejaSaFicheDemain(e)) continue;
        // ⚠️ LA MÊME CLÉ que les vraies fiches de demain (`${demain}|${moment}`).
        // Une clé à part (`demain|…`) ouvrait un SECOND bloc « Demain ».
        const moment = momentDuJour(e);
        poser(`${demain}|${moment}`, lang === "en" ? "Tomorrow" : "Demain", moment, e);
      }
      else if (!sansHeure && debut >= 18 * 60)     poser("cesoir",     null, lang === "en" ? "Tonight" : "Ce soir", e);
      else                                         poser("plustard",   null, lang === "en" ? "Later today" : "Plus tard aujourd'hui", e);
    } else {
      const jour = e.date === demain ? (lang === "en" ? "Tomorrow" : "Demain") : titreDeJour(e.date, lang);
      const moment = momentDuJour(e);
      poser(`${e.date}|${moment}`, jour, moment, e);
    }
  }
  // ⚠️ CLÉS UNIQUES. Deux sections pouvaient porter la même clé — « Maintenant »
  // revenait plus bas dès que l'ordre des moments s'inversait — et React, incapable
  // de les distinguer, laissait en place le DOM de l'affichage précédent : on
  // voyait les intertitres d'AUJOURD'HUI au-dessus de la date consultée au
  // calendrier, alors que la liste calculée ne contenait qu'elle.
  return sections.map((sec, i) => ({ ...sec, cle: `${sec.cle}#${i}` }));
}

// Les familles qu'on réunit sur UNE carte, et à partir de combien de fiches ça
// vaut la peine. En dessous du seuil, la carte de regroupement coûterait plus de
// place qu'elle n'en fait gagner.
//
// 🚨 LA FICHE RECAP FAIT PARTIE DU GROUPE, et c'est tout le correctif du 11 octobre
// 2026. L'ancien prédicat l'écartait (`e.recap !== true`) : elle restait donc POSÉE
// À CÔTÉ de la carte de regroupement, et la même journée annonçait deux fois ses
// sorties. Stéphanie l'a signalé trois fois, sans qu'on voie que c'était le même
// défaut : « il y a une fiche qui dit 7 expo et une fiche qui dit musées ouverts »,
// puis « il y a 1ère fiche brunch dj live robuchon et une autre brunch 8 adresses »,
// puis « idem pour apéro y a hermitage et en dessous 10 terrasses ouvertes ».
// Une famille, un jour, UNE carte.
const FAMILLES_REUNIES = [
  { cat: "EXPOSITION", seuil: 3,
    fr: "Expositions", en: "Exhibitions",
    nomFr: n => `${n} expositions à voir`,  nomEn: n => `${n} exhibitions on view` },
  { cat: "BRUNCH", seuil: 2,
    fr: "Brunchs", en: "Brunch",
    nomFr: n => `${n} brunchs ce jour-là`,  nomEn: n => `${n} brunches that day` },
  // ⚠️ « ce jour-là », pas « ce soir-là » : depuis le 11 oct 2026 la famille APÉRO
  // contient AUSSI la fiche du midi (Stéphanie : « met apéro du midi »), et
  // annoncer le soir au-dessus d'adresses de midi était faux.
  { cat: "APÉRO", seuil: 2,
    fr: "Apéro", en: "Drinks",
    nomFr: n => `${n} adresses ce jour-là`, nomEn: n => `${n} places that day` },
  // ⚠️ PAS DE FAMILLE « CINÉMA ». Elle a existé une heure, le 11 oct 2026, puis
  // a été retirée : depuis que le bouton « Infos » déplie partout, la carte
  // cinéma déplie ses films toute seule. En faire un groupe la REMPLAÇAIT par
  // une carte de regroupement, et lui faisait perdre son téléphone et son
  // « Mon agenda » pour rien.
];
const FAMILLE_DE = Object.fromEntries(FAMILLES_REUNIES.map(f => [f.cat, f]));

// ⚠️ `pinLast` reste DEHORS par défaut : cette fiche-là demande expressément à
// finir la journée, l'absorber dans un groupe lui ferait perdre sa place. Une
// famille peut lever la règle (`pinLastOk`) quand sa carte de groupe prend
// exactement la place de la fiche — c'est le cas du cinéma, seul de son jour.
const estGroupable = (e, fam) => fam?.pinLastOk === true || e.pinLast !== true;

// Une fiche qui n'est qu'un annuaire : elle ne se déplie pas en elle-même, mais
// en ses entrées. Les terrasses du soir, les brunchs, les films de la semaine.
const estAnnuaire = e =>
  (e.recap === true || e.weeklyFilms === true) && Array.isArray(e.directory) && e.directory.length > 0;

// Ce qu'une fiche représente VRAIMENT. Une fiche recap tient à elle seule tout un
// annuaire : la compter pour 1 donnerait « Voir les 2 » au-dessus de huit brunchs.
const poidsFiche = e => (estAnnuaire(e) && e.directory.length) || 1;

// ⚠️ LE REGROUPEMENT SE FAIT PAR JOUR, PAS PAR MOMENT. Stéphanie, 11 septembre
// 2026 : « il y a 1 fois la fiche 6 expo puis après la fiche 5 expo qui apparaît
// le même jour ». Depuis que les journées se découpent en matin / après-midi /
// soir, les expositions tombaient dans deux moments différents — celles qui
// ouvrent à 9h le matin, celles de 14h l'après-midi — et chaque moment
// fabriquait SA carte de regroupement. Un jour, une carte.
function reunirLesFamillesParJour(sections, estDeplie) {
  const parJour = new Map();
  for (const sec of sections) {
    const cle = sec.jour || "aujourdhui";
    if (!parJour.has(cle)) parJour.set(cle, []);
    parJour.get(cle).push(sec);
  }

  const sortie = [];
  for (const [cleJour, groupe] of parJour) {
    // Ce qui se réunit ce jour-là, famille par famille.
    const aReunir = new Map();
    for (const fam of FAMILLES_REUNIES) {
      const fiches = groupe.flatMap(sec =>
        sec.items.filter(e => e.cat === fam.cat && estGroupable(e, fam)));
      if (fiches.length >= fam.seuil) aReunir.set(fam.cat, fiches);
    }
    if (!aReunir.size) { sortie.push(...groupe); continue; }

    // 🚨 OÙ POSER LA CARTE DE GROUPE : SUR SA FICHE LA PLUS LOURDE, pas sur la
    // première. Stéphanie, 11 oct 2026 : « castel roc apparaît petit puis une
    // fiche apéro après-midi… plusieurs fois ». En ajoutant le Castel Roc —
    // UNE adresse, à 16h — toute la famille APÉRO remontait dans « PLUS TARD
    // AUJOURD'HUI », et les dix terrasses du soir étaient annoncées avant
    // « CE SOIR », qui se retrouvait sans apéro. Une seule petite fiche tirait
    // le groupe entier hors de son moment.
    // La fiche la plus lourde (son annuaire le plus fourni) décide du moment ;
    // en cas d'égalité, la première l'emporte, donc rien ne bouge pour les
    // familles dont les fiches se valent.
    const ancre = new Map();
    for (const [cat, fiches] of aReunir) {
      let meilleure = null, poidsMax = -1;
      for (const f of fiches) {
        const w = poidsFiche(f);
        if (w > poidsMax) { poidsMax = w; meilleure = f; }
      }
      ancre.set(cat, meilleure);
    }

    const posees = new Set();
    for (const sec of groupe) {
      const items = [];
      for (const e of sec.items) {
        const fiches = aReunir.get(e.cat);
        if (!fiches || !estGroupable(e, FAMILLE_DE[e.cat])) { items.push(e); continue; }
        // Les autres fiches de la famille disparaissent du fil : elles ne
        // reviennent qu'au dépliage, sous la carte.
        if (posees.has(e.cat) || e !== ancre.get(e.cat)) continue;
        posees.add(e.cat);
        const cleGroupe = `${cleJour}|${e.cat}`;
        items.push({ groupeFamille: fiches, catGroupe: e.cat, cleGroupe });
        if (estDeplie(cleGroupe)) {
          for (const x of fiches) {
            // 🚨 UNE FICHE RECAP SE DÉPLIE EN SES LIEUX, PAS EN ELLE-MÊME.
            // Stéphanie, 11 octobre 2026 : « quand je clique sur apéro les fiches
            // se déclinent mais il y a la 2e qui dit les ce soir 10 terrasses…
            // elle doit disparaître celle-là car justement les terrasses
            // apparaissent dans ces sous-fiches ». Elle a raison : rouvrir la
            // fiche-annuaire au milieu de son propre dépliage, c'est répéter le
            // titre du chapitre au milieu du chapitre.
            if (estAnnuaire(x)) {
              items.push(...x.directory.map((d, i) => ({ _lieu: d, _fiche: x, _rang: i })));
            } else {
              // 🚨 UN VRAI RENDEZ-VOUS DEVIENT UNE SOUS-FICHE COMME LES AUTRES.
              // Stéphanie, 11 oct 2026 : « y a toujours la fiche robuchon
              // différente des autres », puis « pareil pour apéro met la fiche
              // hermitage comme les autres ». Avant, le Sunday Brunch de Robuchon
              // et le Jardin Belle Époque sortaient en carte pleine au milieu de
              // sous-fiches sobres : on ne comprenait pas qu'ils étaient du même
              // ensemble. Ils gardent leur « J'y vais » — sur LEUR identifiant,
              // pas un identifiant composé, puisque ce sont de vrais événements.
              items.push({
                _lieu: {
                  name: (x.title || "").replace(/\n/g, " ").replace(/\s*ⓘ\s*$/, "").trim(),
                  // L'heure seule : le lieu est déjà dans l'adresse juste en
                  // dessous, l'écrire deux fois ne renseigne personne.
                  info: x.time,
                  adr: x.subtitle,
                  desc: x.desc,
                  tel: x.phone,
                },
                _fiche: x, _rang: `ev-${x.id}`, _evenement: true,
              });
            }
          }
        }
      }
      // Un moment vidé de ses fiches n'a plus rien à annoncer : on ne laisse pas
      // un intertitre « Matin » suivi de rien.
      if (items.length) sortie.push({ ...sec, items });
    }
  }
  return sortie;
}

// Le moment, sous le jour : plus petit, sans filet, dans le bleu du cadre —
// il précise, il n'annonce pas.
function IntertitreMoment({ titre }) {
  return (
    <div style={{
      fontFamily: "'Lato', sans-serif",
      fontSize: 12, fontWeight: 700, letterSpacing: 1.6,
      textTransform: "uppercase", color: GREY,
      margin: "14px 2px 8px",
    }}>{titre}</div>
  );
}

function IntertitreSection({ titre }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "22px 2px 12px" }}>
      <span style={{
        fontFamily: "'Josefin Sans', sans-serif",
        fontSize: 15, fontWeight: 700, letterSpacing: 2.4,
        textTransform: "uppercase", color: GOLD, whiteSpace: "nowrap",
      }}>{titre}</span>
      <span style={{ flex: 1, height: 1, background: "rgba(201,169,110,0.45)" }} />
    </div>
  );
}

// La carte qui remplace la pile du jour. Elle ne prétend pas être un événement :
// ni cœur, ni « J'y vais », ni téléphone. On la touche, la famille se déplie et les
// fiches reviennent une par une, ENTIÈRES — avec tous leurs « J'y vais » et leurs
// annuaires, puisque ce sont les mêmes fiches qu'avant.
function CarteGroupeFamille({ fiches, cat, lang, deplie, onOuvrir }) {
  const fam = FAMILLE_DE[cat] || FAMILLES_REUNIES[0];
  const total = fiches.reduce((n, e) => n + poidsFiche(e), 0);

  // On annonce les sorties elles-mêmes : le premier morceau du sous-titre est
  // tantôt une salle, tantôt une adresse (« 62 bd du Jardin Exotique »), et lister
  // des rues ne donne envie de rien. Pour une fiche recap, son titre à elle ne dit
  // rien non plus (« MUSÉES 6 ADRESSES À MONACO ») : ce sont les noms de son
  // annuaire qui renseignent.
  const noms = [];
  for (const e of fiches) {
    if (e.recap === true && Array.isArray(e.directory)) {
      for (const d of e.directory) if (d?.name) noms.push(d.name);
    } else {
      const t = localizeTitle((e.title || "").replace(/\n/g, " ").replace(/\s*ⓘ\s*$/, "").trim(), lang);
      if (t) noms.push(t);
    }
  }
  const titres = [...new Set(noms)];

  return (
    <div
      onClick={onOuvrir}
      style={{
        // 🎨 REFONTE DU 28 OCT : même traitement que les cartes ordinaires —
        // plus de cadre épais, une ombre douce et des coins arrondis. Cette
        // carte-ci avait été oubliée à la première passe : elle gardait son
        // trait de 3 px au milieu de voisines devenues lisses, et ça se voyait
        // tout de suite sur la capture.
        border: "1px solid rgba(23,36,60,0.06)", borderRadius: RAYON.lg,
        boxShadow: OMBRE.carte, padding: 0,
        marginBottom: 14, background: BLANC, cursor: "pointer",
      }}
    >
      {/* Un seul trait, comme toutes les autres cartes depuis le 10 oct 2026.
          Le filet bleu intérieur avait été oublié ici : les expositions
          affichaient deux couleurs de ligne. */}
      <div style={{ background: WHITE }}>
        <div style={{ padding: "18px 22px 20px", textAlign: "center" }}>
          <div style={{ marginBottom: 12 }}>
            <span style={{
              display: "inline-block", padding: "5px 12px",
              borderRadius: RAYON.pastille, background: `${couleurCat(cat)}14`,
              fontFamily: SANS, fontSize: 10.5, fontWeight: 700,
              letterSpacing: 1.1, textTransform: "uppercase",
              color: couleurCat(cat), lineHeight: 1.2,
            }}>{lang === "en" ? fam.en : fam.fr}</span>
          </div>

          {/* Les titres des fiches arrivent en capitales depuis les données ; celui-ci
              est écrit ici, donc c'est la feuille de style qui doit s'en charger —
              sans quoi la carte de regroupement détonnait au milieu des autres. */}
          <div style={{
            fontFamily: SERIF, fontWeight: 600, fontSize: 22, letterSpacing: 0,
            textTransform: "none",
            color: NUIT, lineHeight: 1.25, marginBottom: 12,
          }}>{casseNaturelle(lang === "en" ? fam.nomEn(total) : fam.nomFr(total))}</div>

          {/* Les titres arrivent déjà en capitales : en serif ils pèsent autant que
              le titre de la carte. En Lato fin, ils redeviennent ce qu'ils sont —
              un index discret de ce qu'on trouvera dessous. */}
          <div style={{
            fontFamily: SANS,
            fontSize: 12.5, fontWeight: 400, letterSpacing: 0,
            textTransform: "none",
            color: GRIS, lineHeight: 1.6, marginBottom: 18,
          }}>{titres.slice(0, 3).join(" · ")}{titres.length > 3 ? " …" : ""}</div>

          {/* 🔘 LE MÊME BOUTON QUE SUR LES AUTRES CARTES. Stéphanie, 27 oct
              2026 : « expo voir les 13 n'est pas comme les autres ». Elle avait
              raison, et sur cinq points à la fois : cette carte-ci écrivait son
              bouton en Lato 12 avec un trait de 1 px et aucun fond, quand toutes
              les autres l'écrivent en Josefin Sans 14, trait de 2 px, fond
              #FBF2F0. Il reprend donc le style commun — et la couleur de la
              famille, comme le cadre, au lieu du Rouge H codé en dur. */}
          <span style={{
            display: "inline-flex", alignItems: "center",
            padding: "11px 22px", borderRadius: RAYON.pastille,
            border: "none", background: BORDEAU,
            fontFamily: SANS, fontSize: 13,
            fontWeight: 700, letterSpacing: 0.4,
            textTransform: "none", color: "#FFFFFF",
          }}>{deplie
            ? (lang === "en" ? "Close" : "Replier")
            : (lang === "en" ? `See all ${total}` : `Voir les ${total}`)}</span>
        </div>
      </div>
    </div>
  );
}

// Un lieu d'annuaire, devenu une fiche à part entière dans le fil quand on
// déplie sa famille. Il garde TOUT ce que la fiche-annuaire lui donnait :
// « J'y vais » nominatif, les amies qui y vont, et le téléphone.
//
// ⚠️ L'IDENTIFIANT « J'y vais » EST COMPOSÉ : id de la fiche du jour × 1000 +
// numéro du lieu. C'est exactement le calcul de Shell.jsx — il DOIT rester
// identique, sinon un « J'y vais » posé ici n'est pas celui posé dans la fiche.
export function CarteLieu({ lieu, fiche, lang, social, loggedIn, onGoingClick, onOuvrir, onReserver, evenement = false,
                     favorites = [], onToggleFav }) {
  // Un vrai événement répond de son propre identifiant ; un lieu d'annuaire, de
  // l'identifiant composé. Les confondre ferait pointer deux « J'y vais »
  // différents sur la même ligne de la base.
  const idLieu = evenement ? fiche.id : (lieu.vid > 0 ? fiche.id * 1000 + lieu.vid : null);
  const jyVais = idLieu ? (social?.myParticipations || []).includes(idLieu) : false;
  const amies  = idLieu ? (social?.friendsGoingTo?.(idLieu) || []) : [];

  // ❤️📅 LE CŒUR ET « MON CALENDRIER » VIVENT ICI, PAS SUR LA FICHE DU DESSUS.
  // Stéphanie, 13 oct 2026 : « met mon calendrier et cœur sur les sous-fiches,
  // idem pour expo ». On ne met pas « 12 adresses » à son agenda ni en favori :
  // on choisit UNE adresse. Un vrai événement répond de son propre identifiant,
  // un lieu d'annuaire de l'identifiant composé — le même que « J'y vais », pour
  // que le favori et la participation désignent bien la même chose.
  // Une sous-fiche de cinéma ne rouvre pas sa fiche-mère : voir plus bas.
  const ouvrableDepuisLaSousFiche = !!onOuvrir && fiche.cat !== "CINÉMA" && !fiche.weeklyFilms;

  const estFav = idLieu ? favorites.includes(idLieu) : false;
  const pourAgenda = evenement ? fiche : {
    ...fiche,
    id: idLieu,
    title: lieu.name,
    subtitle: lieu.adr || fiche.subtitle,
    time: lieu.info || fiche.time,
    desc: (lang === "en" ? (lieu.descEn || lieu.desc) : lieu.desc) || fiche.desc,
  };

  return (
    <div style={{
      // 🎨 La sous-fiche porte la couleur de la famille de sa fiche-mère.
      border: `3px solid ${couleurCat(fiche.cat)}`, borderRadius: 2, background: WHITE,
      // Le même retrait de 22 px que les expositions dépliées : on voit d'un
      // coup d'œil que ces fiches appartiennent à celle du dessus.
      margin: "0 22px 14px", padding: "16px 20px 18px",
    }}>
      {/* 🎬 PAS DE CLIC SUR UNE SOUS-FICHE DE CINÉMA. Stéphanie, 24 oct 2026 :
          « supprime sur les sous-fiches cinéma le clic sur la fiche qui donne
          tous les films ». Toucher le titre d'un film rouvrait la fiche-mère,
          c'est-à-dire la liste des douze films — on croyait ouvrir CE film et
          on se retrouvait au point de départ. Ailleurs le geste a du sens : la
          fiche-mère d'un annuaire de terrasses dit quelque chose de plus. */}
      <div
        onClick={ouvrableDepuisLaSousFiche ? onOuvrir : undefined}
        style={{
          fontFamily: "'Josefin Sans', Georgia, sans-serif",
          fontWeight: 400, fontSize: 18, letterSpacing: 0.3,
          textTransform: "uppercase", color: "#000000",
          lineHeight: 1.3, cursor: ouvrableDepuisLaSousFiche ? "pointer" : "default",
          // 🎯 Stéphanie, 27 oct 2026 : « met les noms des cafés au centre des
          // sous-fiches ». Le nom du lieu est ce qu'on cherche en faisant
          // défiler : centré, il se repère d'un coup d'œil, et il s'aligne avec
          // la barre « Réserver » qui occupe toute la largeur juste en dessous.
          textAlign: "center",
        }}>{lieu.name}</div>

      {lieu.info && (
        <div style={{
          fontFamily: "'Lato', sans-serif", fontSize: 13,
          color: GREY, marginTop: 5,
        textAlign: "center",
        }}>{lieu.info}</div>
      )}

      {/* L'adresse, quand on la connaît : une sous-fiche doit suffire à s'y rendre. */}
      {lieu.adr && lieu.adr !== lieu.info && (
        <div style={{
          fontFamily: "'Lato', sans-serif", fontSize: 12,
          color: GREY, marginTop: 3,
        textAlign: "center",
        }}>{lieu.adr}</div>
      )}

      {/* Un film, lui, a un genre, une durée, une note et un résumé. Ces champs
          n'existent que dans l'annuaire du cinéma : pour une terrasse ou un
          brunch, rien ne s'affiche et la fiche est exactement la même qu'avant. */}
      {(lieu.genre || lieu.duree || typeof lieu.rt === "number") && (
        <div style={{
          fontFamily: "'Lato', sans-serif", fontSize: 12,
          color: GREY, marginTop: 5,
          display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
        }}>
          {[lieu.genre, lieu.duree].filter(Boolean).map((x, i) => <span key={i}>{x}</span>)}
          {typeof lieu.rt === "number" && (
            // 🍅 au-dessus de 60 %, 🤢 en dessous : la convention de Rotten
            // Tomatoes lui-même (« fresh » / « rotten »).
            <span style={{ fontWeight: 700, color: lieu.rt >= 60 ? "#44581C" : GOLD }}>
              {lieu.rt >= 60 ? "🍅" : "🤢"} {lieu.rt} %
            </span>
          )}
        </div>
      )}

      {/* 🇬🇧 En anglais on prend descEn, et on retombe sur le français s'il
           n'existe pas — un texte français vaut mieux que pas de texte, mais on
           ne le met JAMAIS dans descEn côté données (règle de la maison). */}
      {(lang === "en" ? (lieu.descEn || lieu.desc) : lieu.desc) && (
        <div style={{
          fontFamily: "'Lato', sans-serif", fontSize: 13,
          color: "#555", lineHeight: 1.6, marginTop: 9,
        }}>{lang === "en" ? (lieu.descEn || lieu.desc) : lieu.desc}</div>
      )}

      {/* 🎟️ UN SEUL BOUTON, SUR TOUTES LES FICHES. Stéphanie, 26 oct 2026 :
          « au lieu du téléphone et site il faudrait en fait ce bouton réserver
          sur toutes les fiches ». Il dit toujours « Réserver » et fait le mieux
          disponible : le vrai formulaire, sinon le site, sinon le téléphone.
          Voir lib/reservation.js — le mot reste honnête dans les trois cas. */}
      {(() => {
        const a = actionDeReservation(lieu, fiche.cat, lang);
        if (!a) return null;
        // 🎨 LE BOUTON RESTE UNIFORME, C'EST LE CADRE QUI PORTE LA FAMILLE.
        // Stéphanie, 27 oct 2026 : « nous avions prévu des couleurs différentes,
        // là tout semble identique », puis « le bouton doit rester comme ça,
        // mais les cadres ». J'avais d'abord teinté la barre : erreur. Le geste
        // « Réserver » est le même partout, il garde donc le Rouge H, fil
        // conducteur de la maison. La couleur de famille vit dans le CADRE.
        // Même geste, même aspect : la barre est pleine dans les trois cas.
            const plein = true;
        return (
          <button onClick={e => { e.stopPropagation();
                    // 📊 SANS CETTE LIGNE, LE BOUTON EST MUET. Stéphanie, 27 oct
                    // 2026 : « dis-moi s'ils utilisent les nouveaux boutons
                    // réserver ». 9 030 boutons posés la veille, et AUCUN
                    // n'envoyait de signal — impossible de répondre. Le mode
                    // (formulaire, site ou téléphone) est enregistré : c'est lui
                    // qui dira si un vrai formulaire convertit mieux qu'un appel.
                    track("reservation_clic", { mode: a.mode, cat: fiche.cat,
                                                lieu: lieu.nom || lieu.name });
                    if (a.mode === "tel") window.location.href = `tel:${a.tel}`;
                    else onReserver?.(a.url, lieu.nom || lieu.name); }}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              width: "100%", height: plein ? 38 : 36, marginTop: 12, cursor: "pointer",
              border: "1px solid #7B2D26", borderRadius: 1,
              background: plein ? BORDEAU : "#FFF6F4",
              fontFamily: "'Josefin Sans', sans-serif", fontSize: plein ? 11 : 10,
              fontWeight: 700, letterSpacing: plein ? 2 : 1.6,
              textTransform: "uppercase", color: plein ? "#FFFDF8" : BORDEAU,
            }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                 stroke={plein ? "#FFFDF8" : BORDEAU} strokeWidth="2"
                 strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }}>
              {a.mode === "tel"
                ? <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.5 11.5 0 0 0 3.6.57 1 1 0 0 1 1 1V21a1 1 0 0 1-1 1A17 17 0 0 1 3 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.5 11.5 0 0 0 .57 3.6 1 1 0 0 1-.25 1z"/>
                : <path d="M4 7h16M4 7v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7M9 11h6"/>}
            </svg>
            {a.mot}
          </button>
        );
      })()}

      {/* 🚨 LA RANGÉE NE DOIT PAS DÉPENDRE DU SEUL `vid`. Stéphanie, 26 oct 2026 :
          « toujours pas je réserve sur les fiches de cinéma ». Une sous-fiche de
          FILM n'a ni `vid` ni `tel` — elle porte un titre, des horaires et un
          résumé. `idLieu` était donc nul, et toute la rangée (Réserver ET
          Direction) disparaissait en silence. Un bouton doit suffire à faire
          exister la rangée qui le porte. */}
      {(idLieu || lieu.tel || lienDeReservation(lieu) || lienDuSite(lieu)) && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          {/* 👥 L'INDICATEUR D'AMIS, comme sur une fiche normale. Stéphanie,
              13 oct 2026 : « rajoute indicateur amis ». Les prénoms en toutes
              lettres restent en infobulle ; ce sont les visages qu'on repère
              en faisant défiler. */}
          {amies.length > 0 ? (
            <span title={amies.map(f => f.display_name).filter(Boolean).join(", ")}
                  style={{ display: "inline-flex", alignItems: "center" }}>
              <FriendAvatars friends={amies} />
            </span>
          ) : idLieu ? (
            <span title={lang === "en" ? "No friends going yet" : "Aucun ami inscrit pour l'instant"}
                  style={{ display: "inline-flex", alignItems: "center" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="#C7C1B4" aria-hidden="true" style={{ display: "block" }}>
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
            </span>
          ) : null}
          {idLieu && (
            <button
              onClick={() => onGoingClick?.({ ...fiche, id: idLieu })}
              aria-pressed={jyVais}
              style={{
                display: "inline-flex", alignItems: "center", gap: 3,
                padding: "6px 12px", cursor: "pointer",
                border: `1px solid ${jyVais ? GOLD : "rgba(15,29,58,0.18)"}`,
                borderRadius: 1, background: jyVais ? "#FFF8EC" : "none",
                fontFamily: "'Josefin Sans', sans-serif",
                fontSize: 9, fontWeight: 600, letterSpacing: 1,
                textTransform: "uppercase",
                color: jyVais ? GOLD : NAVY, whiteSpace: "nowrap",
              }}
            >{jyVais ? "✓ " : ""}{lang === "en" ? "Going" : "J'y vais"}</button>
          )}
          {/* 🗑️ « APPELER » ET « AGENDA » RETIRÉS. Stéphanie, 27 oct 2026 :
              « et retire appeler et agenda ». « Appeler » faisait double emploi
              avec « Réserver », qui compose déjà le numéro quand c'est le seul
              moyen — et nommer le moyen est précisément ce qu'elle ne veut pas.
              La rangée n'a plus que ce qui sert : J'y vais, Direction, Partager. */}
          {/* 📍 DIRECTION. Stéphanie, 23 oct 2026 : « au lieu de mettre le site
              du lieu, mets le lien Google Maps partout, mets le mot Direction ».
              Le site d'un restaurant n'aide pas à y aller ; l'itinéraire, si.
              Pas d'icône téléphone à côté : « Appeler » est déjà écrit en toutes
              lettres. Ouverture SANS target="_blank" — voir lib/itineraire.js. */}
          {(lieu.nom || fiche.subtitle) && (
            <button onClick={e => { e.stopPropagation(); ouvrirItineraire(lieu.nom || fiche.subtitle); }}
               aria-label={lang === "en" ? "Directions" : "Itinéraire"}
               style={{
                 display: "inline-flex", alignItems: "center", gap: 4,
                 padding: "5px 11px", background: "none", cursor: "pointer",
                 border: "1px solid rgba(15,29,58,0.18)", borderRadius: 1,
                 fontFamily: "'Josefin Sans', sans-serif", fontSize: 9, fontWeight: 600,
                 letterSpacing: 1, textTransform: "uppercase", color: NAVY, whiteSpace: "nowrap",
               }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={NAVY}
                   strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              {lang === "en" ? "Directions" : "Direction"}
            </button>
          )}
          {idLieu && Capacitor.isNativePlatform() && (
            <button
              onClick={e => { e.stopPropagation(); partagerEvenement(pourAgenda, lang, idLieu); }}
              style={{
                padding: "6px 12px", cursor: "pointer",
                border: "1px solid rgba(15,29,58,0.18)", borderRadius: 1, background: "none",
                fontFamily: "'Josefin Sans', sans-serif",
                fontSize: 9, fontWeight: 600, letterSpacing: 1,
                textTransform: "uppercase", color: NAVY, whiteSpace: "nowrap",
              }}>{lang === "en" ? "Share" : "Partager"}</button>
          )}
          {idLieu && onToggleFav && (
            <button
              onClick={e => { e.stopPropagation(); onToggleFav(idLieu); }}
              aria-label={estFav
                ? (lang === "en" ? "Remove from favourites" : "Retirer des favoris")
                : (lang === "en" ? "Add to favourites" : "Ajouter aux favoris")}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 1, flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"
                   fill={estFav ? GOLD : "none"} stroke={GOLD} strokeWidth="1.8"
                   strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1L12 21l7.7-7.6 1.1-1a5.5 5.5 0 0 0 0-7.8z"/>
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function matchesCatFilter(e, catId) {
  switch (catId) {
    case "sport":      return ["FOOTBALL","BASKET","FORMULE 1","FORMULE E","SPORT","RALLYE","TENNIS"].includes(e.cat);
    case "theatre":    return ["THÉÂTRE","SPECTACLE","DANSE","FESTIVAL","GALA","FÊTE NATIONALE","MUSICAL"].includes(e.cat);
    case "concert":    return ["CONCERT","JAZZ LIVE","OPÉRA"].includes(e.cat);
    case "musee":      return ["EXPOSITION","MARCHÉ","SALON"].includes(e.cat);
    case "conference": return e.cat === "CONFÉRENCE" || e.cat === "SALON" || e.conf === true;
    case "cinema":     return e.cat === "CINÉMA";
    case "petitdej":   return e.cat === "PETIT-DÉJ";
    case "famille": {
      // 🚨 La règle commençait par `e.free === true ||` : TOUT événement gratuit
      // devenait « Famille ». Mesuré le 10 oct 2026 : 152 fiches sur 362 passaient
      // le filtre, dont 30 récapitulatifs « CE SOIR N TERRASSES OUVERTES », 10
      // brunchs et 10 messes. Une mère qui cherchait quoi faire avec ses enfants
      // tombait sur des terrasses de bars. La gratuité n'a jamais voulu dire
      // « pour les enfants » — c'est le filtre Famille, pas le filtre Gratuit.
      const txt = `${e.title} ${e.subtitle} ${e.desc || ""}`;
      // 1. Ce qui se dit explicitement l'emporte, quelle que soit la catégorie.
      if (/enfant|famille|junior|jeune public|jeunesse|parent|kid|b[ée]b[ée]|d[èe]s \d+\s*ans/i.test(txt)) return true;
      // 2. Ce qui n'est jamais pour les enfants, même gratuit.
      if (["APÉRO","SOIRÉE","DJ SET","JAZZ LIVE","BRUNCH","ENCHÈRES","CHANTS","BIEN-ÊTRE","PETIT-DÉJ"].includes(e.cat)) return false;
      // 3. Le reste : les catégories où une famille a sa place.
      return ["ATELIER","SPECTACLE","CINÉMA","MARCHÉ","FESTIVAL","EXPOSITION","DANSE"].includes(e.cat);
    }
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
      stroke={active ? BORDEAU : NUIT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7"/>
      <line x1="16.5" y1="16.5" x2="22" y2="22"/>
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg width="18" height="13" viewBox="0 0 18 13" fill="none">
      <rect y="0" width="18" height="1.8" rx="0.9" fill={NUIT}/>
      <rect y="5.6" width="18" height="1.8" rx="0.9" fill={NUIT}/>
      <rect y="11.2" width="18" height="1.8" rx="0.9" fill={NUIT}/>
    </svg>
  );
}

function HeartIcon({ active, hasFavs }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24"
      fill={hasFavs ? BORDEAU : "none"}
      stroke={hasFavs ? BORDEAU : NUIT}
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

export default function HomeScreen({ favorites = [], onToggleFav, onCategoryClick, filter = "all", onFilterChange, lang = "fr", catFilters = [], onCatFilter, onOpenMenu, onNavAgenda, onNavFriends, onCardClick, onAdminOpen, onLangChange, events = ALL_EVENTS, social, onGoingClick, joursParticipation = {}, pendingFriends = 0, userName = "", avatarUrl = "", loggedIn = false, authReady = false, onShowAuth, inviteCode = "" }) {
  const setFilter = onFilterChange || (() => {});
  const t = lang === "en"
    ? { tagline: "Monaco Together", filters: { today: "Today", week: "This week", weekend: "Weekend", agenda: "Calendar" }, empty: "No events for this period." }
    : { tagline: "Monaco Ensemble", filters: { today: "Aujourd'hui", week: "Semaine", weekend: "Week-end", agenda: "Agenda" }, empty: "Aucun événement pour cette période." };

  // 🎟️ LA VUE DE RÉSERVATION. Stéphanie, 26 oct 2026 : « en ouvrant une vue
  // dans l'app de leur système ». On garde l'adresse et le nom du lieu ; la vue
  // s'affiche par-dessus le fil et se referme sur la croix. Voir
  // components/VueReservation.jsx et lib/reservation.js.
  const [resaOuverte, setResaOuverte] = useState(null);
  const ouvrirReservation = (url, nom) => setResaOuverte({ url, nom });

  // ✒️ Le dictionnaire des noms propres se construit UNE FOIS, à partir des
  // sous-titres : c'est lui qui empêche « Monaco » de devenir « monaco » quand
  // on remet les titres en casse de phrase. Voir lib/theme.js.
  useEffect(() => { apprendreLesNomsPropres(events); }, [events]);

  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [groupFilter, setGroupFilter] = useState(null);
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [logoTaps, setLogoTaps] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  // Bandeau « Partage ton lien » : refermé pour la visite en cours seulement.
  const [bandeauAmisFerme, setBandeauAmisFerme] = useState(false);
  // Quelles sections ont déplié leur pile d'expositions. Une par jour, indépendantes.
  const [exposDepliees, setExposDepliees] = useState({});
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

  // Combien de fiches sont affichées à l'instant. Mis à jour à chaque rendu, lu par
  // le capteur de défilement ci-dessous (qui, lui, n'est installé qu'une seule fois).
  const nbAffichees = useRef(0);
  // Nombre de cartes réellement posées dans le DOM (rendu progressif, voir plus bas).
  const [nbRendues, setNbRendues] = useState(40);
  // Jalons de profondeur déjà envoyés pendant cette visite : on ne mesure que la
  // descente la plus profonde, pas chaque va-et-vient. 4 mesures par visite maximum.
  const jalonsEnvoyes = useRef(new Set());

  useEffect(() => {
    const el = document.getElementById("main-scroll");
    if (!el) return;
    let lastY = 0;
    let enAttente = false;

    // 🚨 L'EN-TÊTE S'OUVRAIT ET SE REFERMAIT SANS FIN. Stéphanie, 27 oct 2026 :
    // « quand je scrolle et que je laisse, avec Monac'Out en petit, ça bouge
    // non stop ». C'était une boucle, et elle se referme toute seule :
    //   1. on descend → l'en-tête se replie et ~96 px disparaissent
    //      (filtres 52 px + catégories 44 px, plus le logo qui rétrécit) ;
    //   2. le contenu remonte donc TOUT SEUL : scrollTop change sans que
    //      personne n'ait bougé le doigt ;
    //   3. l'app lit ce déplacement comme « elle remonte » et ROUVRE l'en-tête ;
    //   4. ce qui redescend le contenu, et on repart à l'étape 1.
    // Le seuil de 6 px ne pouvait rien contre un saut de 96 px.
    //
    // On verrouille donc le basculement pendant 320 ms après chaque changement —
    // un peu plus que la transition CSS de 0,22 s — et on reprend la mesure à
    // partir de la NOUVELLE position. Un geste volontaire dure bien plus
    // longtemps que ça : rien n'est perdu pour la personne.
    let verrouJusqua = 0;
    const basculer = (ouvert) => {
      verrouJusqua = Date.now() + 320;
      setFiltersVisible(ouvert);
    };

    const handler = () => {
      const y = el.scrollTop;
      if (Date.now() >= verrouJusqua) {
        if (y < 10) basculer(true);
        else if (y > lastY + 6) basculer(false);
        else if (y < lastY - 6) basculer(true);
      }
      lastY = y;

      // Rendu progressif : on pose 40 cartes de plus dès qu'on arrive à deux écrans
      // du bas, pour que le fil paraisse infini sans jamais tout poser d'un coup.
      if (el.scrollHeight - (y + el.clientHeight) < el.clientHeight * 2) {
        setNbRendues(n => (n >= nbAffichees.current ? n : n + 40));
      }

      // ── Mesure de la profondeur de lecture ──────────────────────────────────
      // Ce qui compte pour Monac'Out, c'est que les gens PARCOURENT le fil : la
      // carte donne déjà le nom, la date et le lieu, ouvrir la fiche n'est utile
      // que pour réserver. On mesure donc jusqu'où ils descendent, en NOMBRE DE
      // FICHES vues (pas en pourcentage : le fil n'a pas la même longueur selon
      // le filtre, et « 50 % » ne veut rien dire quand il ne reste que 6 fiches).
      // Calcul différé d'une frame : le scroll doit rester parfaitement fluide.
      if (enAttente) return;
      enAttente = true;
      requestAnimationFrame(() => {
        enAttente = false;
        const total = nbAffichees.current;
        const hauteur = el.scrollHeight;
        if (total < 1 || hauteur <= el.clientHeight) return;   // rien à faire défiler
        const vues = Math.round(total * Math.min(1, (y + el.clientHeight) / hauteur));
        for (const jalon of [5, 10, 20, 40]) {
          if (vues >= jalon && !jalonsEnvoyes.current.has(jalon)) {
            jalonsEnvoyes.current.add(jalon);
            track("scroll_depth", { fiches: jalon, affichees: total });
          }
        }
      });
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  // Repartir du haut du fil (40 cartes) à chaque changement de vue : sinon on gardait
  // les centaines de cartes déjà posées pour la vue précédente.
  // ⚠️ `catFilters.join()` et non `catFilters` : le parent recrée le tableau à chaque
  // rendu, donc la dépendance changerait sans arrêt et remettrait le fil à 40 cartes
  // en boucle — le défilement infini n'avancerait jamais.
  useEffect(() => { setNbRendues(40); }, [filter, searchQuery, groupFilter, rangeStart, rangeEnd, catFilters.join(",")]);

  // ── MESURER LA RECHERCHE ────────────────────────────────────────────────────
  // Elle ne l'était PAS. Le 10 oct 2026, à la question « les gens utilisent-ils
  // les filtres et la recherche ? », PostHog répondait « 0 personne » pour la
  // recherche — non parce que personne ne cherche, mais parce que rien n'était
  // envoyé. Une absence de mesure se lit comme une absence d'usage : c'est le
  // pire des deux mondes, on en tire une conclusion fausse.
  // On attend 1,2 s après la dernière frappe pour n'envoyer que la requête
  // terminée, et non une mesure par lettre tapée.
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 3) return;
    const t = setTimeout(() => track("search_used", { longueur: q.length, resultats: filtered.length }), 1200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  function handleFilterChange(newFilter) {
    const el = document.getElementById("main-scroll");
    // Re-cliquer sur le filtre actif le retire — y compris le CALENDRIER, qui en
    // était exclu : le bouton l'ouvrait mais rien ne le refermait. Stéphanie,
    // 3 septembre 2026 : « quand j'appuie sur calendrier 1×, il apparaît, et la
    // 2ᵉ fois il ne s'en va pas ». Un bouton qui ouvre doit refermer.
    if (filter === newFilter) {
      setFilter("all");
      if (newFilter === "calendar") { setRangeStart(null); setRangeEnd(null); }
      if (el) el.scrollTop = 0;
      return;
    }
    if (newFilter !== "calendar") { setRangeStart(null); setRangeEnd(null); }
    setFilter(newFilter); setFiltersVisible(true);
    if (el) el.scrollTop = 0;
  }

  // Fil continu : les fiches « en cours » y sont répétées sur chacun de leurs jours
  // d'ouverture. La RECHERCHE et le CALENDRIER travaillent sur la liste d'origine :
  // la recherche ne doit pas renvoyer 120 fois la même exposition, et le calendrier
  // gère lui-même les dates lointaines (au-delà de l'horizon) via `couvreLaPeriode`.
  const evenementsEtales = useMemo(() => etaleLesEnCours(events), [events]);

  let filtered;
  if (searchQuery.trim()) {
    // Recherche tolérante : on ignore accents, tirets et ponctuation, et on
    // cherche TOUS les mots (dans n'importe quel ordre) plutôt que la suite
    // exacte de caractères. Sans ça « monte carlo summer festival » ne trouvait
    // rien, parce que les fiches écrivent « Monte-Carlo Summer Festival ».
    const words = normalizeForSearch(searchQuery).split(" ").filter(Boolean);
    filtered = filterByCats(events, catFilters).filter(e => {
      // Recherche dans TOUS les champs, en français ET en anglais
      const hay = normalizeForSearch([
        e.title, localizeTitle((e.title || "").replace(/\n/g, " "), "en"),
        e.subtitle, e.quarter,
        e.cat, localizeCat(e.cat, "en"),
        e.desc, e.descEn, e.source, e.time,
      ].join(" "));
      return words.every(w => hay.includes(w));
    });
  } else if (filter === "calendar" && rangeStart) {
    const endBound = rangeEnd || rangeStart;
    // Le tri est indispensable : sans lui les fiches arrivent dans l'ordre du
    // fichier, les clés de section alternent, et « Maintenant » réapparaissait
    // plus bas sur d'autres cartes.
    filtered = filterByCats(events.filter(e => {
      const d = parseEventDate(e);
      return (d && d >= rangeStart && d <= endBound) || couvreLaPeriode(e, rangeStart, endBound);
    }), catFilters).slice().sort((a, b) => {
      const da = parseEventDate(a), db = parseEventDate(b);
      if (!da || !db) return 0;
      return (da - db) || (heureDeTri(a) - heureDeTri(b));
    });
  } else if (filter === "calendar") {
    filtered = filterByCats(events, catFilters);
  } else {
    filtered = filterByCats(filterByTime(evenementsEtales, filter), catFilters);
  }
  if (groupFilter) { const g = EVENT_GROUPS.find(x => x.id === groupFilter); if (g) filtered = filtered.filter(e => g.cats.includes(e.cat)); }

  // Le fil ne montre que de VRAIS événements. Les deux fiches d'annuaire permanentes
  // — « Musées de Monaco ouverts » et « Bien-être : spas & studios » — sont là tous
  // les jours et encombraient la liste : on ne les affiche plus que lorsqu'on
  // demande explicitement leur catégorie (Musée / Bien-être), ou en recherche.
  // La carte cinéma, elle, reste dans le fil : c'est un programme qui change.
  const estAnnuairePermanent = e => e.pinLast === true && e.cat !== "CINÉMA";
  const filtreCatActif = (catFilters && catFilters.length > 0) || !!groupFilter;
  if (!filtreCatActif && !searchQuery.trim()) filtered = filtered.filter(e => !estAnnuairePermanent(e));

  // On tient la longueur du fil à jour pour le capteur de profondeur : celui-ci est
  // installé une fois pour toutes et ne verrait pas la variable `filtered` changer.
  nbAffichees.current = filtered.length;

  // Rendu progressif. Le fil posait déjà toutes ses cartes d'un coup ; en répétant
  // les expositions jour par jour il en compte ~900 de plus, ce qui se sentirait au
  // démarrage sur iPhone. On en pose 40, puis 40 de plus dès qu'on approche du bas.
  // Purement visuel : `filtered.length` reste la vraie longueur pour la mesure.
  // 🌟 LA VITRINE — les premières sorties, en DEUX COLONNES, juste sous la photo
  // de Monaco. Stéphanie, 28 oct 2026 : « sur un même écran iPhone, on puisse
  // déjà voir une belle photo de Monaco et deux ou trois propositions de
  // sorties, au lieu d'un seul grand bloc d'expositions ».
  //
  // ⚠️ Les fiches de la vitrine sont RETIRÉES du fil en dessous — sans ça on les
  //    verrait deux fois, ce qui est exactement le défaut des doublons d'annuaire
  //    corrigé le 11 oct.
  // ⚠️ La vitrine ne s'affiche QUE dans le fil ordinaire. Dès qu'une catégorie,
  //    une recherche ou le calendrier est demandé, on rend la liste telle quelle :
  //    le brief interdit de toucher au comportement des filtres.
  // ⚠️ Les fiches à annuaire en sont exclues : un regroupement se déplie, il n'a
  //    rien à faire dans une case de 173 pt.
  const vitrineActive = !searchQuery.trim() && !filtreCatActif && filter !== "calendar";
  // Les fiches à annuaire sont écartées de la vitrine : un regroupement se
  // déplie, il n'a rien à faire dans un hero ni dans une case de 173 pt.
  const candidats = vitrineActive
    ? filtered.filter(e => !(Array.isArray(e.directory) && e.directory.length > 0))
    : [];
  // 🚨 DÉDOUBLONNER PAR `id`, PAS PAR `cleFil`. Une fiche `ongoing` — la Foire,
  // une exposition — est répétée JOUR PAR JOUR : même `id`, `cleFil` différent.
  // En dédoublonnant par `cleFil`, la Foire s'affichait en hero ET dans la
  // grille juste en dessous, avec un jour d'écart invisible à l'œil. Même
  // famille que les doublons d'annuaire du 11 oct.
  const vus = new Set();
  const uniques = candidats.filter(e => (vus.has(e.id) ? false : (vus.add(e.id), true)));

  // 📷 LE HERO PRÉFÈRE LES FICHES QUI ONT UNE VRAIE PHOTO DE LEUR LIEU.
  // La maquette montre une grande photo ; un dégradé en pleine page ferait pâle
  // figure. Le tri est STABLE (`index` en second critère), donc à égalité
  // l'ordre chronologique tient. Un hero est une MISE EN AVANT, il n'affirme
  // aucun moment de la journée — c'est pourquoi lui seul peut se réordonner.
  // ⚠️ On ne fabrique aucune photo pour autant : s'il n'y en a aucune, le hero
  //    prend simplement l'habillage graphique.
  const heros = vitrineActive
    ? uniques
        .map((e, index) => ({ e, index, photo: mediaDeLaFiche(e) ? 0 : 1 }))
        .sort((a, b) => (a.photo - b.photo) || (a.index - b.index))
        .slice(0, 4).map(x => x.e)
    : [];
  const idsHero = new Set(heros.map(e => e.id));

  // 🕐 LA GRILLE RESTE CHRONOLOGIQUE ET NE MÉLANGE PAS DEUX MOMENTS.
  // C'est ce qui garantit que son titre dit vrai : « Ce soir » ne chapeaute que
  // des fiches du soir. Sans cette règle, une fiche de 9 h et un concert de
  // 19 h 30 se retrouvaient sous le même intertitre.
  const maintenantDate = new Date();
  const minMaintenant = maintenantDate.getHours() * 60 + maintenantDate.getMinutes();
  const jourAujourdhui = toFrDate(maintenantDate);
  const jourDemain = (() => { const d = new Date(maintenantDate); d.setDate(d.getDate() + 1); return toFrDate(d); })();
  const restants = uniques.filter(e => !idsHero.has(e.id));

  // 🚨 LA VITRINE NE MÉLANGE NI DEUX MOMENTS NI DEUX JOURS.
  // Stéphanie, 28 oct 2026 : « la section "Ce matin" contient actuellement des
  // événements à 19h et 19h30 ». Deux fautes se cumulaient :
  //   1. le titre lisait l'heure d'une fiche choisie pour sa PHOTO, pas pour son
  //      heure (corrigé plus haut, la grille reste chronologique) ;
  //   2. la grille piochait dans TOUTE la liste, jours suivants compris — à
  //      18h18, l'exposition de 9h-18h du LENDEMAIN remontait sous « Ce matin ».
  //      Une fiche `ongoing` existe en une copie par jour, le piège était donc
  //      permanent.
  // On fixe donc d'abord le JOUR (celui de la première fiche restante), puis le
  // moment à l'intérieur de ce jour. Les données ne sont pas touchées.
  const jourVitrine = restants.length ? restants[0].date : null;
  const duJour = jourVitrine ? restants.filter(e => e.date === jourVitrine) : [];
  const momentVitrine = vitrineActive && duJour.length
    ? momentDeLaFiche(duJour[0], lang, jourVitrine === jourAujourdhui ? minMaintenant : null)
    : null;
  const misEnAvant = momentVitrine
    ? duJour.filter(e => momentDeLaFiche(e, lang, jourVitrine === jourAujourdhui ? minMaintenant : null).cle === momentVitrine.cle).slice(0, 4)
    : [];

  // Le fil, lui, est purgé de TOUTES les occurrences de ces fiches — donc par id.
  const idsVitrine = new Set([...heros, ...misEnAvant].map(e => e.id));

  // 🏷️ LE TITRE DIT CE QUE LA GRILLE CONTIENT, puisqu'elle ne contient qu'un
  // seul moment. Sur « Semaine » ou « Week-end », parler de « ce soir » n'aurait
  // aucun sens : on annonce simplement ce qui est à l'affiche.
  // Le moment (« Ce soir ») ne vaut que pour AUJOURD'HUI. Demain, on dit
  // « Demain soir » ; au-delà, on nomme le jour — « Ce matin » au-dessus d'une
  // fiche de jeudi n'aurait aucun sens.
  const titreVitrine = (() => {
    const repli = lang === "en" ? "Coming up" : "À l'affiche";
    if (filter === "week" || filter === "weekend") return repli;
    if (!momentVitrine) return repli;
    if (jourVitrine === jourAujourdhui) return momentVitrine.titre;
    if (jourVitrine === jourDemain) {
      return momentVitrine.cle === "soir"
        ? (lang === "en" ? "Tomorrow evening" : "Demain soir")
        : (lang === "en" ? "Tomorrow" : "Demain");
    }
    return jourVitrine || repli;
  })();

  const aAfficher = (idsVitrine.size
    ? filtered.filter(e => !idsVitrine.has(e.id))
    : filtered
  ).slice(0, nbRendues);

  // Le fil se range sous des intertitres de jour (et de moment, pour aujourd'hui).
  // En recherche on garde la liste à plat : les résultats sautent d'un mois à
  // l'autre, un intertitre par carte n'aiderait personne.
  const enSections = !searchQuery.trim();

  // Le jour réellement consulté, quand le calendrier ne porte QU'UNE date.
  // Sert à corriger l'étiquette des fiches `ongoing`, qui portent toujours la date
  // du jour et affichaient « AUJOURD'HUI » même en consultant le 11 septembre.
  const jourConsulte =
    filter === "calendar" && rangeStart && (!rangeEnd || rangeEnd.toDateString() === rangeStart.toDateString())
      ? `${JOURS[rangeStart.getDay()]} ${rangeStart.getDate()} ${MOIS_NOM_COURT[rangeStart.getMonth()]}`
      : null;

  // Pour les SECTIONS, une plage de dates compte autant qu'une date seule : dès
  // qu'on consulte le calendrier, « Maintenant » et « Ce soir » n'ont plus de sens.
  // Les fiches « en cours » ne portent que la date du jour ; on les rattache au
  // premier jour de la période consultée.
  const jourCalendrier =
    filter === "calendar" && rangeStart
      ? `${JOURS[rangeStart.getDay()]} ${rangeStart.getDate()} ${MOIS_NOM_COURT[rangeStart.getMonth()]}`
      : null;

  // On ne réunit les expositions que dans le fil ordinaire : dès qu'on demande
  // explicitement la catégorie, on veut les voir une par une.
  const sections = enSections
    ? (filtreCatActif
        ? decouperEnSections(aAfficher, lang, jourCalendrier)
        : reunirLesFamillesParJour(decouperEnSections(aAfficher, lang, jourCalendrier), cle => !!exposDepliees[cle]))
    : null;

  const rangeLabel = rangeStart
    ? rangeEnd && rangeEnd.toDateString() !== rangeStart.toDateString()
      ? `${rangeStart.getDate()} ${MOIS_NOM_COURT[rangeStart.getMonth()]} — ${rangeEnd.getDate()} ${MOIS_NOM_COURT[rangeEnd.getMonth()]}`
      : `${rangeStart.getDate()} ${MOIS_NOM_COURT[rangeStart.getMonth()]}`
    : null;

  const hasFavs = favorites.length > 0;

  // ── BANDEAU « PARTAGE TON LIEN » ─────────────────────────────────────────────
  // Uniquement pour quelqu'un de CONNECTÉ dont le cercle est VIDE. Il s'éteint
  // tout seul à la première amie : pas de compteur, pas de délai, pas de « 3 fois
  // espacées de 7 jours ». Il s'arrête en réussissant, pas en lassant.
  //
  // Pourquoi il fallait le faire (PostHog, 17→22 août 2026) : la carte de partage
  // a été montrée 38 fois, dont 32 à des gens SANS COMPTE — elle demandait de
  // partager un lien à des gens qui n'en avaient pas encore. Zéro partage lancé.
  // ⚠️ `social.charge` est indispensable : sans lui, « aucune amie » est vrai pendant
  // le chargement et le bandeau clignote chez tout le monde (corrigé le 3 sept 2026).
  const cercleVide = loggedIn && social?.charge === true && Array.isArray(social.friends) && social.friends.length === 0;
  const conditionsReunies = authReady && cercleVide && !!inviteCode;

  // 🔒 UNE FOIS AFFICHÉ, IL RESTE. Stéphanie, 4 septembre 2026, après deux tentatives
  // de correction : « laisse-le, et les personnes le ferment en appuyant sur une croix
  // évidente ». Elle a raison : tant que l'affichage dépend d'un état qui peut changer
  // sous nos pieds (chargement de la base, rafraîchissement de session), il y aura
  // toujours une course pour le faire disparaître. On verrouille donc : dès que les
  // conditions sont réunies UNE fois, le bandeau reste jusqu'à la croix.
  const [bandeauAmisVerrouille, setBandeauAmisVerrouille] = useState(false);
  useEffect(() => {
    if (conditionsReunies) setBandeauAmisVerrouille(true);
  }, [conditionsReunies]);

  const montreBandeauAmis = (bandeauAmisVerrouille || conditionsReunies) && !bandeauAmisFerme;

  useEffect(() => {
    if (montreBandeauAmis) track("bandeau_amis_vu");
  }, [montreBandeauAmis]);

  return (
    // 🎨 Fond crème de la refonte : les cartes blanches s'y détachent.
    <div style={{ background: FOND_PAGE, minHeight: "100%" }}>
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={NUIT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              {pendingFriends > 0 && (
                <span style={{
                  position: "absolute", top: 0, right: 0,
                  width: 8, height: 8, borderRadius: "50%",
                  background: BORDEAU, border: "1.5px solid #fff",
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
              <MonacOutLogo compact lang={lang} />
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
                  color: lang === l ? NUIT : GRIS_LISIBLE,
                  padding: "1px 3px",
                  borderBottom: lang === l ? "1.5px solid #7B2D26" : "1.5px solid transparent",
                }}>{l}</button>
              ))}
            </div>
            <button onClick={onNavAgenda} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <HeartIcon hasFavs={hasFavs} />
            </button>
          </div>
        </div>

        {/* Pendant le chargement de l'auth : on réserve la place du bandeau (invisible) → « Bonjour » apparaît sans faire sauter la mise en page */}
        {!authReady && (
          <div style={{
            background: WHITE, borderTop: `1px solid ${BORDER}`, textAlign: "center",
            padding: "5px 12px", fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, visibility: "hidden",
          }}>&nbsp;</div>
        )}

        {/* Salutation — « Bonjour, <prénom> » sous le logo quand connectée */}
        {userName && (
          <div style={{
            background: WHITE, borderTop: `1px solid ${BORDER}`,
            padding: "7px 12px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            fontFamily: "'Josefin Sans', sans-serif", fontSize: 12, letterSpacing: 0.5, color: NAVY,
          }}>
            {/* Photo de profil sur l'accueil, à gauche du bonjour. Carré 20 px pour ne
                pas alourdir l'en-tête. Se change depuis le menu. */}
            {avatarUrl && (
              <div style={{
                width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                background: `center/cover no-repeat url("${avatarUrl}")`,
                border: "1px solid rgba(196,162,65,0.6)",
              }} />
            )}
            <span>
              {lang === "en" ? "Hi, " : "Bonjour, "}
              <span style={{ color: BORDEAU, fontWeight: 600 }}>{userName}</span>
            </span>
          </div>
        )}

        {/* Barre « Inscris-toi » pleine largeur, bien en haut (en-tête fixe) — UNIQUEMENT si pas connectée (additif) */}
        {authReady && !loggedIn && onShowAuth && (
          /* 🎨 PLUS DE BLEU NUIT ICI. Stéphanie, 28 oct 2026 : « mets le
             "inscris-toi" dans les mêmes tons, enlève le bleu ». La bande
             reprend donc le bordeaux de la refonte — celui du bouton « Voir
             l'événement » — au lieu du navy, qui était le seul aplat froid de
             l'écran et cassait l'accord crème/bordeaux/or. */
          <button onClick={onShowAuth} style={{
            display: "block", width: "100%", border: "none", cursor: "pointer",
            background: BORDEAU, color: "#FFFFFF",
            padding: "11px 16px", textAlign: "center",
            fontFamily: SANS, fontSize: 12.5, fontWeight: 700, letterSpacing: 0.4,
            borderTop: `1px solid ${BORDER}`,
          }}>
            {lang === "en"
              ? "✨ Sign up — find your friends & favourites ›"
              : "✨ Inscris-toi — retrouve tes amis & tes favoris ›"}
          </button>
        )}

        {/* Bandeau « Partage ton lien » — connectée, aucune amie. Le bouton ouvre la
            feuille de partage du téléphone : JAMAIS une page web (cf. écran noir du
            7 août). Une croix discrète le referme pour la visite en cours. */}
        {montreBandeauAmis && (
          <div style={{
            background: "#FFFDF7", borderTop: `1px solid ${GOLD}`, borderBottom: `1px solid ${GOLD}`,
            padding: "10px 14px", display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: "Georgia, 'Playfair Display', serif", fontWeight: 700,
                fontSize: 14, color: NAVY, lineHeight: 1.25,
              }}>
                {lang === "en"
                  ? "Monaco Together — share your link"
                  : "Monaco Ensemble — partage ton lien"}
              </div>
              <div style={{
                fontFamily: "'Lato', sans-serif", fontSize: 11, color: GREY,
                lineHeight: 1.35, marginTop: 2,
              }}>
                {lang === "en"
                  ? "You'll see where your friends go, and they'll see where you go."
                  : "Tu verras où sortent tes amis, eux où tu vas."}
              </div>
            </div>
            <button
              onClick={async () => {
                const r = await partagerInvitation(inviteCode, lang);
                track("bandeau_amis_partage", { resultat: r });
              }}
              style={{
                flexShrink: 0, background: NAVY, color: "#fff", border: "none", cursor: "pointer",
                fontFamily: "'Josefin Sans', sans-serif", fontSize: 10, fontWeight: 600,
                letterSpacing: 1.4, textTransform: "uppercase",
                padding: "9px 13px", borderRadius: 3, whiteSpace: "nowrap",
              }}>
              {lang === "en" ? "Share" : "Partager"}
            </button>
            {/* Croix bien visible : c'est le SEUL moyen de faire partir le bandeau. */}
            <button onClick={() => { setBandeauAmisFerme(true); track("bandeau_amis_ferme"); }}
                    aria-label={lang === "en" ? "Close" : "Fermer"}
                    style={{
                      flexShrink: 0, cursor: "pointer",
                      width: 30, height: 30, borderRadius: "50%",
                      background: "#FFFFFF", border: `1px solid ${GOLD}`,
                      color: NAVY, fontSize: 16, lineHeight: 1, padding: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>✕</button>
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
          maxHeight: filtersVisible ? "44px" : "0px", overflow: "hidden", transition: "max-height 0.22s ease",
        }}>
          {/* 🫧 LES BULLES TIENNENT DANS L'ÉCRAN. Stéphanie, 28 oct 2026 :
              « mets bien les bulles du menu en haut dans l'écran, il faut
              peut-être les diminuer de taille ». Elles débordaient des deux
              côtés et la première était coupée.
              ⚠️ `justifyContent: center` était le piège : sur une rangée qui
              défile, centrer un contenu plus large que l'écran le fait démarrer
              AU MILIEU — « Aujourd'hui » n'était donc plus visible à l'ouverture.
              On part désormais du bord, et la rangée reste balayable. */}
          <div style={{ display: "flex", gap: 7, padding: "8px 12px", justifyContent: "flex-start", overflowX: "auto", overscrollBehaviorX: "contain", touchAction: "pan-x", scrollbarWidth: "none" }}>
            {TIME_FILTERS.map(f => {
              const active = filter === f.id;
              const label = f.id === "calendar" && rangeStart ? rangeLabel : (t.filters[f.id] || f.label);
              return (
                /* 🔘 CHIPS DE LA REFONTE — 28 oct 2026. Le brief : « filtres
                   temporels en chips avec sélection clairement visible ». Le
                   choisi passe en bordeaux plein, les autres sur un gris très
                   pâle sans contour dur. La hauteur monte à 36 px pour tenir la
                   cible tactile de 44 px avec le pas vertical. */
                <button key={f.id} onClick={() => handleFilterChange(f.id)} style={{
                  flexShrink: 0, padding: "7px 14px", minHeight: 34,
                  borderRadius: RAYON.pastille, border: "none",
                  background: active ? BORDEAU : "rgba(23,36,60,0.05)",
                  color: active ? "#FFFFFF" : GRIS,
                  fontFamily: SANS, fontSize: 12.5, fontWeight: 600,
                  cursor: "pointer", whiteSpace: "nowrap", letterSpacing: 0.1,
                }}>{f.id === "calendar" ? (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={active ? "#FFFFFF" : GRIS} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
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
          maxHeight: filtersVisible ? "50px" : "0px", overflow: "hidden", transition: "max-height 0.22s ease",
        }}>
          {/* `touchAction: pan-x` : le conteneur parent verrouille le geste horizontal
              (l'app glissait de côté). Cette rangée-ci, elle, doit rester balayable
              latéralement — on lui rend explicitement le droit. */}
          <div style={{ display: "flex", gap: 6, justifyContent: "flex-start", padding: "5px 12px 9px", overflowX: "auto", overscrollBehaviorX: "contain", touchAction: "pan-x", scrollbarWidth: "none" }}>
            {EVENT_GROUPS.map(g => {
              const active = groupFilter === g.id;
              return (
                <button key={g.id} onClick={() => { setGroupFilter(active ? null : g.id); const el = document.getElementById("main-scroll"); if (el) el.scrollTop = 0; }} style={{
                  flexShrink: 0, padding: "6px 11px", minHeight: 30,
                  borderRadius: RAYON.pastille, border: "none",
                  background: active ? BORDEAU : "rgba(23,36,60,0.05)",
                  color: active ? "#FFFFFF" : GRIS,
                  fontFamily: SANS, fontSize: 11.5, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", letterSpacing: 0.1,
                }}>{lang === "en" ? g.labelEn : g.label}</button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 🎯 LE HERO + « CE SOIR » — la composition exacte de la maquette.
          Stéphanie, 28 oct 2026 : « tu peux faire exactement comme ça, à 100 %
          pareil ». Ordre du téléphone de gauche : grande carte photo avec le
          titre et le bouton POSÉS DESSUS, les points du carrousel, le titre
          « Ce soir » avec son filet et « Tout voir », puis DEUX COLONNES.

          ⚠️ L'ancien bandeau d'ambiance est retiré d'ici : ses quatre images
          étaient GÉNÉRÉES, et la maquette demande une vraie photo. Le hero
          montre une photo du LIEU (étiquetée comme telle) quand la médiathèque
          en a une, et un habillage graphique sinon — jamais une image inventée.

          ⚠️ Ce bloc ne s'affiche que dans le fil ordinaire : avec une catégorie,
          une recherche ou le calendrier, la liste reste telle qu'elle est. */}
      {vitrineActive && heros.length > 0 && (
        <>
          <CarrouselHero
            fiches={heros}
            lang={lang}
            favorites={favorites}
            onToggleFav={onToggleFav}
            onCardClick={onCardClick}
            onReserver={ouvrirReservation}
            social={social}
            inviteCode={inviteCode}
            onShowAuth={onShowAuth}
          />

          {misEnAvant.length > 0 && (
            <>
              {/* Le titre reprend le MOMENT réellement affiché (« Ce soir »,
                  « Maintenant »…), il n'est pas écrit en dur : à 10 h du matin,
                  « Ce soir » au-dessus d'une expo ouverte serait un mensonge. */}
              <TitreSection
                titre={titreVitrine}
                lang={lang}
                onToutVoir={() => {
                  const el = document.getElementById("main-scroll");
                  if (el) el.scrollTo({ top: el.scrollTop + 320, behavior: "smooth" });
                }}
              />
              <GrilleDeuxColonnes
                fiches={misEnAvant}
                lang={lang}
                favorites={favorites}
                onToggleFav={onToggleFav}
                onCardClick={onCardClick}
                onReserver={ouvrirReservation}
                social={social}
                inviteCode={inviteCode}
                onShowAuth={onShowAuth}
              />
            </>
          )}
        </>
      )}

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
          enSections ? sections.map((sec, i) => (
            <div key={sec.cle}>
              {/* Le jour une seule fois, puis les moments qui le découpent. */}
              {sec.jour && sec.jour !== sections[i - 1]?.jour && <IntertitreSection titre={sec.jour} />}
              {sec.jour
                ? <IntertitreMoment titre={sec.moment} />
                : <IntertitreSection titre={sec.moment} />}
              {rendreItems(sec.items, true)}
            </div>
          )) : rendreItems(aAfficher, false)
        )}
      </div>

      {/* 🎟️ La vue de réservation, par-dessus le fil. Posée ICI, dans le div
          racine de HomeScreen — une première tentative l'avait mise dans une
          fonction auxiliaire, à côté d'un </div> déjà fermé : deux frères JSX
          sans fragment, et le build refuse sans dire où. */}
      {resaOuverte && (
        <VueReservation
          url={resaOuverte.url}
          titre={resaOuverte.nom}
          lang={lang}
          onFermer={() => setResaOuverte(null)}
        />
      )}
    </div>
  );

  /**
   * 🧱 LE FIL EN DEUX COLONNES — Stéphanie, 28 oct 2026 : « quand je scrolle
   * ça repart sur une colonne, mais 2 colonnes c'est mieux ».
   *
   * Les fiches ordinaires s'empilent donc par deux, exactement comme la grille
   * sous le hero. Ce qui NE PEUT PAS tenir dans une case de 173 pt garde la
   * pleine largeur :
   *   · une sous-fiche de lieu (`_lieu`), qui porte ses propres actions ;
   *   · un regroupement (« 7 expositions »), qui se déplie ;
   *   · une fiche à annuaire, qui se déplie elle aussi.
   *
   * ⚠️ L'ORDRE EST PRÉSERVÉ. On accumule les fiches ordinaires qui se SUIVENT
   * et on les pose en grille ; dès qu'une pleine largeur arrive, on vide le
   * paquet avant. Sans ça, regrouper toutes les grilles d'abord mélangerait la
   * chronologie — et une app de sorties qui désordonne les heures ne sert plus
   * à rien.
   */
  function rendreItems(items, sansDate) {
    const sortie = [];
    let paquet = [];
    // 🔁 UN SEUL registre de photos récentes pour TOUTES les grilles de ce
    // passage : sinon deux vues identiques se retrouvent de part et d'autre
    // d'une bande de regroupement, et c'est exactement ce que Stéphanie ne veut
    // plus voir (« ne remets pas les mêmes photos à côté »).
    const recents = [];
    const viderLePaquet = () => {
      if (!paquet.length) return;
      sortie.push(
        <div key={`grille-${sortie.length}`} style={{ marginBottom: 12 }}>
          <GrilleDeuxColonnes
            fiches={paquet}
            recents={recents}
            lang={lang}
            favorites={favorites}
            onToggleFav={onToggleFav}
            onCardClick={onCardClick}
            onReserver={ouvrirReservation}
            social={social}
            inviteCode={inviteCode}
            onShowAuth={onShowAuth}
          />
        </div>
      );
      paquet = [];
    };

    for (const e of items) {
      if (e._lieu) {
        viderLePaquet();
        sortie.push(
          <CarteLieu
            key={`lieu-${e._fiche.id}-${e._rang}`}
            lieu={e._lieu} fiche={e._fiche} lang={lang} social={social}
            loggedIn={loggedIn} onGoingClick={onGoingClick}
            onOuvrir={() => onCardClick?.(e._fiche)} onReserver={ouvrirReservation}
            evenement={!!e._evenement} favorites={favorites} onToggleFav={onToggleFav}
          />
        );
      } else if (e.groupeFamille) {
        viderLePaquet();
        const cle = e.cleGroupe;
        const deplie = !!exposDepliees[cle];
        sortie.push(
          <BandeRegroupement
            key={`groupe-${cle}`}
            fiches={e.groupeFamille} cat={e.catGroupe} lang={lang} deplie={deplie} recents={recents}
            onBasculer={() => setExposDepliees(d => ({ ...d, [cle]: !d[cle] }))}
          />
        );
        // Déplié, le groupe pose SES fiches — en deux colonnes, comme le reste.
        if (deplie) {
          sortie.push(
            <div key={`groupe-ouvert-${cle}`} style={{ marginBottom: 12 }}>
              <GrilleDeuxColonnes
                fiches={e.groupeFamille} recents={recents} lang={lang}
                favorites={favorites} onToggleFav={onToggleFav}
                onCardClick={onCardClick} onReserver={ouvrirReservation} social={social}
              />
            </div>
          );
        }
      } else if (Array.isArray(e.directory) && e.directory.length > 0) {
        viderLePaquet();
        sortie.push(renduCarte(e, sansDate, !!e._depliee, recents));
      } else {
        paquet.push(e);
      }
    }
    viderLePaquet();
    return sortie;
  }

  // Toute fiche qui porte un annuaire se déplie SOUS elle, jamais dans une
  // fenêtre. Stéphanie, 11 oct 2026 : « je veux que cela soit cohérent partout ».
  /**
   * LA FICHE-MÈRE D'UN ANNUAIRE — « MUSÉES · 6 OUVERTS », « CE SOIR : 7
   * TERRASSES », la semaine de cinéma. Elle se déplie EN SOUS-FICHES sous elle,
   * jamais dans une fenêtre (règle posée le 11 oct 2026).
   *
   * 🪶 Stéphanie, 28 oct 2026 : « la carte "7 expositions à voir" est trop
   * grande et déséquilibre la page ». Elle passe donc en bande compacte (~86 pt
   * au lieu d'une carte pleine), avec sa vignette, son titre, son compte et son
   * bouton « Voir les N ». Le dépliage et les sous-fiches ne changent pas.
   */
  function renduCarte(e, sansDate, compact = false, recentsCourants = []) {
    // 🚨 LA CLÉ DOIT PORTER LE JOUR. Une fiche `ongoing` revient chaque jour
    // AVEC LE MÊME IDENTIFIANT : avec `infos-${e.id}` seul, toucher « Infos »
    // sur la fiche d'aujourd'hui dépliait aussi celle de demain.
    const cleInfos = `infos-${e.cleFil || `${e.id}-${e.date}`}`;
    const ouvert = !!exposDepliees[cleInfos];
    const carte = (
      <CarteRangee
        key={e.cleFil || e.id}
        event={e}
        lang={lang}
        favorites={favorites}
        onToggleFav={onToggleFav}
        onCardClick={onCardClick}
        social={social}
        onReserver={ouvrirReservation}
        recents={recentsCourants}
        inviteCode={inviteCode}
        onShowAuth={onShowAuth}
        onInfos={() => setExposDepliees(d => ({ ...d, [cleInfos]: !d[cleInfos] }))}
        infosDepliees={ouvert}
        nbLieux={e.directory.length}
      />
    );
    if (!ouvert) return carte;
    return (
      <div key={`annu-${cleInfos}`}>
        {carte}
        {e.directory.map((d, k) => (
          <CarteLieu
            key={`lieu-${cleInfos}-${k}`}
            lieu={d} fiche={e} lang={lang} social={social}
            loggedIn={loggedIn} onGoingClick={onGoingClick}
            onOuvrir={() => onCardClick?.(e)}
            favorites={favorites} onToggleFav={onToggleFav}
            onReserver={ouvrirReservation}
          />
        ))}
      </div>
    );
  }
}
