// Publie une mise à jour d'interface À DISTANCE (OTA), sans review Apple.
// Usage : npm run ota   → puis git add public/capgo && git commit && git push
//
// Ce que ça fait : build le web → zippe l'interface → dépose le zip + le manifeste
// dans public/capgo/ (servi par Vercel). L'app native lit latest.json au lancement,
// télécharge la nouvelle interface et l'applique au prochain lancement.
// ⚠️ Ne touche PAS au code natif (permissions, plugins) — ça, ça demande un build Apple.

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CAPGO_DIR = join(ROOT, 'public', 'capgo');
const MANIFEST = join(CAPGO_DIR, 'latest.json');
const BASE_URL = 'https://monac-out.vercel.app/capgo';

// 1) Version OTA suivante (incrémente le dernier chiffre)
const prev = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : { version: '0.0.0' };
const p = (prev.version || '0.0.0').split('.').map(n => parseInt(n) || 0);
const version = `${p[0]}.${p[1]}.${p[2] + 1}`;
console.log(`\n📦  Nouvelle interface OTA : v${version}\n`);

// 2) Build du web
console.log('→ build…');
// VITE_OTA_VERSION grave sa propre version dans le bundle : chaque événement PostHog
// dira alors quelle interface la personne utilise, et on saura enfin qui a reçu l'OTA.
execSync('npm run build', { cwd: ROOT, stdio: 'inherit', env: { ...process.env, VITE_OTA_VERSION: version } });

// 3) Nettoie les anciens zips + zippe l'interface (index.html à la racine du zip)
mkdirSync(CAPGO_DIR, { recursive: true });
for (const f of readdirSync(CAPGO_DIR)) { if (f.endsWith('.zip')) rmSync(join(CAPGO_DIR, f)); }
const zip = `monacout-${version}.zip`;
console.log('→ zip…');
// 🚨 EXCLURE `capgo/` DU ZIP — SINON CHAQUE OTA CONTIENT LA PRÉCÉDENTE.
// Découvert le 13 oct 2026 : la v0.0.134 pesait 93 Mo, dont 97 Mo (décompressés)
// pour un seul fichier, `capgo/monacout-0.0.133.zip`. Vite recopie tout `public/`
// dans `dist/`, donc l'ancien zip s'y retrouvait et était rezippé dans le nouveau :
// une poupée russe qui enflait d'environ 1 Mo par publication. Le vrai contenu
// de l'interface fait 5 Mo de JavaScript et 5 Mo de données.
// Conséquence concrète : l'app devait télécharger 93 Mo au lancement pour une
// correction d'affichage — sur un réseau mobile, ça n'arrivait pas. C'est pour ça
// que Stéphanie ne voyait pas les mises à jour sur son téléphone.
// ⚠️ `latest.json` est exclu pour la même raison : le manifeste est servi par
// Vercel, il n'a rien à faire DANS le paquet.
// 🖼️ `media/` EST EXCLU LUI AUSSI — les photos de lieux vivent HORS du paquet.
// Les 15 photos CC0 pèsent 4 Mo : embarquées, elles tripleraient un OTA de 1,9 Mo
// pour une image qu'on ne regarde qu'une fois. Vercel les sert depuis
// `monac-out.vercel.app/media/lieux/…` et `src/lib/mediatheque.js` les charge
// paresseusement, en adresse absolue (dans l'app native, `/media/…` pointerait
// sur `capacitor://localhost`, qui ne contient rien).
execSync(`cd "${ROOT}/dist" && zip -qr "${join(CAPGO_DIR, zip)}" . -x 'capgo/*' 'media/*'`, { stdio: 'inherit' });

// 4) Manifeste
writeFileSync(MANIFEST, JSON.stringify({ version, url: `${BASE_URL}/${zip}` }, null, 2) + '\n');

console.log(`\n✅  Prêt (v${version}).  Pour PUBLIER :\n`);
console.log('   git add public/capgo && git commit -m "ota: maj interface" && git push\n');
console.log('   → Les apps installées se mettront à jour au prochain lancement (sans review Apple).\n');
