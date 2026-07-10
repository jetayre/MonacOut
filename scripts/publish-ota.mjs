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
execSync('npm run build', { cwd: ROOT, stdio: 'inherit' });

// 3) Nettoie les anciens zips + zippe l'interface (index.html à la racine du zip)
mkdirSync(CAPGO_DIR, { recursive: true });
for (const f of readdirSync(CAPGO_DIR)) { if (f.endsWith('.zip')) rmSync(join(CAPGO_DIR, f)); }
const zip = `monacout-${version}.zip`;
console.log('→ zip…');
execSync(`cd "${ROOT}/dist" && zip -qr "${join(CAPGO_DIR, zip)}" .`, { stdio: 'inherit' });

// 4) Manifeste
writeFileSync(MANIFEST, JSON.stringify({ version, url: `${BASE_URL}/${zip}` }, null, 2) + '\n');

console.log(`\n✅  Prêt (v${version}).  Pour PUBLIER :\n`);
console.log('   git add public/capgo && git commit -m "ota: maj interface" && git push\n');
console.log('   → Les apps installées se mettront à jour au prochain lancement (sans review Apple).\n');
