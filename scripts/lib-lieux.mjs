/**
 * MonacOut — identifiants STABLES pour les lieux et les fiches récapitulatives.
 *
 * ── Le problème ───────────────────────────────────────────────────────────────
 * Les fiches « ce soir », « brunchs » et « musées » listent plusieurs lieux. Pour que
 * « J'y vais » sur UN lieu soit visible par les amies, il faut l'écrire dans la table
 * Supabase `participations`, qui ne connaît qu'une colonne `event_id` (un entier).
 * Il faut donc fabriquer un entier qui désigne sans ambiguïté « ce lieu, ce jour-là ».
 *
 * ── Ce qui serait faux ────────────────────────────────────────────────────────
 * ✗ Numéroter les fiches avec un compteur : au passage suivant du CI, la fiche 930000
 *   correspond à une AUTRE date (les journées passées sont purgées) → la participation
 *   d'une amie glisse en silence sur un autre jour.
 * ✗ Utiliser le RANG du lieu dans la liste : dès qu'un lieu ferme, les rangs glissent
 *   et la participation change de lieu.
 *
 * ── Ce qui est juste ──────────────────────────────────────────────────────────
 * L'identifiant de la fiche est DÉDUIT DE LA DATE, et celui du lieu vient d'un registre
 * où chaque nom reçoit un numéro **définitif** (`lieux-ids.json`, jamais réattribué) :
 *
 *     event_id = (base + nombre de jours depuis le 1er janvier 2026) × 1000 + n° du lieu
 *
 * Bases : 930000 = « ce soir », 940000 = « brunchs », 950000 = « musées ».
 * Plafond : 950730 × 1000 + 999 = 950 730 999, sous la limite d'un entier PostgreSQL
 * (2 147 483 647). Aucun événement réel n'atteint ces valeurs (le plus grand est
 * ~1 007 276), donc aucun risque de confusion avec une vraie fiche.
 */
import { existsSync, readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REGISTRE_LIEUX = join(__dirname, "..", "lieux-ids.json");

export const BASE_SOIR = 930000;
export const BASE_BRUNCH = 940000;
export const BASE_MUSEES = 950000;

const ORIGINE = new Date(2026, 0, 1);

/** Numéro de la journée depuis le 1er janvier 2026 (identique pour une même date). */
export function jourIndex(d) {
  const j = Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - ORIGINE) / 86400000);
  if (j < 0 || j > 9999) throw new Error(`Date hors plage pour un identifiant stable : ${d}`);
  return j;
}

/** Identifiant de la fiche récapitulative d'un jour donné. */
export function idFiche(base, d) {
  return base + jourIndex(d);
}

/** Registre nom de lieu → numéro définitif. Append-only : on ne réattribue JAMAIS. */
export function chargerRegistreLieux() {
  if (!existsSync(REGISTRE_LIEUX)) return {};
  try { return JSON.parse(readFileSync(REGISTRE_LIEUX, "utf8")) || {}; } catch { return {}; }
}

export function ecrireRegistreLieux(reg) {
  writeFileSync(REGISTRE_LIEUX, JSON.stringify(reg, null, 1) + "\n");
}

/**
 * Numéro d'un lieu. S'il est inconnu, on lui en attribue un nouveau (le suivant libre).
 * Un numéro déjà donné n'est jamais repris : c'est ce qui garantit qu'une participation
 * enregistrée aujourd'hui désignera toujours le même lieu dans un an.
 */
export function numeroLieu(reg, nom) {
  const cle = (nom || "").trim();
  if (!cle) return 0;
  if (reg[cle]) return reg[cle];
  const max = Object.values(reg).reduce((a, b) => Math.max(a, b), 0);
  if (max >= 999) throw new Error("Registre des lieux saturé (999) — élargir la plage.");
  reg[cle] = max + 1;
  return reg[cle];
}
