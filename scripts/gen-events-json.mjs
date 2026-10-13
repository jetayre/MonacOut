#!/usr/bin/env node
/**
 * MonacOut — Génère public/events.json (TOUS les événements à venir).
 * L'app le télécharge en direct à chaque ouverture → les corrections de données
 * apparaissent SANS repasser par Apple. Repli sur les données embarquées hors-ligne.
 *
 * Publié sur https://monacout.vercel.app/events.json à chaque déploiement.
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const { ALL_EVENTS } = await import('../src/data/events.js');

// 🚫 L'indice « ⓘ » collé au bout de CHAQUE titre est retiré (13 oct 2026).
// C'était un dépannage pour les iPhone d'avant la v1.7, qui n'avaient pas encore
// le bouton « Infos » : le glyphe signalait qu'une fiche cachait quelque chose.
// Depuis, le bouton existe et il est explicite. Stéphanie : « enlève le i de info
// et les infos qui sont liées à ce i, laisse le rectangle info et les sous-fiches ».
// Il était posé sur tous les titres, y compris ceux qui n'ont rien à déplier.
const HINT = " ⓘ";
const events = ALL_EVENTS.map(e => ({
  ...e,
  title: e.title.replace(/\s*ⓘ\s*$/, ""),
  titleEn: e.titleEn ? e.titleEn.replace(/\s*ⓘ\s*$/, "") : e.titleEn,
}));

const payload = {
  generatedAt: new Date().toISOString(),
  count: events.length,
  events,
};

const out = join(ROOT, 'public', 'events.json');
writeFileSync(out, JSON.stringify(payload), 'utf8');
console.log(`✓ events.json généré (${ALL_EVENTS.length} événements) → ${out}`);
