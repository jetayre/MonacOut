/**
 * SOURCE_APP.md — tout le code de l'application, verbatim.
 *
 * Stéphanie, 31 oct 2026 : « mets bien tout ce code exact de l'app tel quel
 * dans la source md ».
 *
 * 🚨 VERBATIM VEUT DIRE VERBATIM. Aucun fichier n'est tronqué, résumé ni
 * reformaté : on lit l'octet et on l'écrit. Un document de source qui coupe
 * les gros fichiers est pire que pas de document — on croit avoir le code,
 * et c'est justement le fichier le plus long qui manque (HomeScreen.jsx fait
 * 121 Ko à lui seul).
 *
 * ⚠️ UNE SEULE EXCLUSION, ET ELLE EST ÉCRITE DANS LE DOCUMENT :
 * `src/data/events.js`, 5,2 Mo. Ce ne sont pas des instructions mais les
 * 2 400 fiches d'événements — de la DONNÉE, refabriquée chaque nuit par les
 * scripts. L'inclure ferait un document de 5,8 Mo dont 90 % de listes de
 * restaurants, et le code deviendrait introuvable dedans. Le document dit où
 * le fichier se trouve et ce qu'il contient.
 *
 * ⚠️ Le délimiteur des blocs s'adapte : un fichier qui contient ``` casserait
 * un bloc de trois accents. On compte la plus longue suite présente et on
 * clôture avec une de plus.
 *
 * Relancer :  node scripts/gen-source-md.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, relative } from "node:path";

const RACINE = new URL("..", import.meta.url).pathname;
const EXCLUS = new Set(["src/data/events.js", "src/data/events.js.bak"]);
const EXT_CODE = new Set([".js", ".jsx", ".css", ".json", ".html"]);
const LANG = { ".js": "js", ".jsx": "jsx", ".css": "css", ".json": "json", ".html": "html" };

function parcourir(dossier, acc = []) {
  for (const nom of readdirSync(dossier).sort()) {
    if (nom.startsWith(".")) continue;
    const chemin = join(dossier, nom);
    if (statSync(chemin).isDirectory()) parcourir(chemin, acc);
    else if (EXT_CODE.has(extname(nom))) acc.push(relative(RACINE, chemin));
  }
  return acc;
}

const RACINE_FICHIERS = ["index.html", "package.json", "vite.config.js", "capacitor.config.json"];
const fichiers = [...RACINE_FICHIERS, ...parcourir(join(RACINE, "src"))]
  .filter(f => !EXCLUS.has(f));

/** Le plus long train d'accents graves du fichier, pour choisir la clôture. */
function cloture(texte) {
  let max = 0;
  for (const m of texte.matchAll(/`+/g)) max = Math.max(max, m[0].length);
  return "`".repeat(Math.max(3, max + 1));
}

const octets = f => statSync(join(RACINE, f)).size;
const total = fichiers.reduce((n, f) => n + octets(f), 0);
const auj = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

const morceaux = [];
morceaux.push(`# MONAC'OUT — LE CODE DE L'APPLICATION

**${auj}.** ${fichiers.length} fichiers, ${(total / 1024).toFixed(0)} Ko.
Chaque fichier est reproduit **intégralement et tel quel** : rien n'est coupé,
résumé ni reformaté.

## Ce qui n'est pas ici, et pourquoi

| | |
|---|---|
| \`src/data/events.js\` | **5,2 Mo** — les 2 400 fiches d'événements. C'est de la **donnée**, pas du code, et elle est refabriquée chaque nuit par les scripts de \`scripts/\`. L'inclure ferait un document de 5,8 Mo dont 90 % de listes de restaurants. |
| \`scripts/\` | Les ~60 scripts de collecte et de contrôle. Ils tournent sur GitHub Actions, pas dans l'app. |
| \`public/\` | Les photos, le paquet OTA et \`events.json\`. |
| \`node_modules/\` | Les dépendances. |

## Les fichiers

| Fichier | Taille |
|---|---|
${fichiers.map(f => `| \`${f}\` | ${(octets(f) / 1024).toFixed(1)} Ko |`).join("\n")}

---
`);

for (const f of fichiers) {
  const texte = readFileSync(join(RACINE, f), "utf8");
  const c = cloture(texte);
  morceaux.push(`\n## \`${f}\`\n\n${c}${LANG[extname(f)] || ""}\n${texte}\n${c}\n`);
}

const sortie = join(RACINE, "SOURCE_APP.md");
writeFileSync(sortie, morceaux.join(""));
console.log(`✅ SOURCE_APP.md — ${fichiers.length} fichiers, ${(statSync(sortie).size / 1024).toFixed(0)} Ko`);
