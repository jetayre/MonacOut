/**
 * 🛡️ AUCUNE PHOTO NE DOIT DISPARAÎTRE DU SERVEUR.
 *
 * 🚨 L'INCIDENT DU 31 OCTOBRE 2026. Stéphanie, un samedi d'Halloween : « non je
 * n'ai pas les photos ». Sa capture montrait des carrés vides avec le texte de
 * remplacement. Cause : le 28 octobre j'avais supprimé 13 fichiers en double
 * visuel — mais SON APP tournait encore sur un paquet OTA plus ancien qui les
 * réclamait. Résultat : 404 sur chaque image, et un écran vide.
 *
 * ⚠️ LA LEÇON, QUI VAUT POUR TOUT CE QUI EST SERVI HORS DU PAQUET.
 * Un paquet OTA est FIGÉ : il demandera les mêmes fichiers pendant des
 * semaines, parce qu'un OTA met une à deux semaines à se répandre (règle 34).
 * Les photos, elles, sont servies en direct et communes à toutes les versions.
 * Donc : **on ajoute, on remplace, mais on ne SUPPRIME jamais** un fichier déjà
 * publié. C'est la même règle que `lieux-ids.json`, où un numéro attribué n'est
 * jamais réattribué.
 *
 * Ce contrôle échoue si un fichier cité par un paquet encore en circulation a
 * disparu. Lancé par daily-check.yml.
 */
import { readdirSync, existsSync, readFileSync } from "node:fs";

const DOSSIERS = ["public/media/lieux", "public/media/ambiance"];
const presents = new Set(DOSSIERS.flatMap(d => existsSync(d) ? readdirSync(d).filter(f => f.endsWith(".webp")) : []));

// Tous les noms cités par le registre courant.
const src = readFileSync("src/lib/mediatheque.js", "utf8");
const cites = [...src.matchAll(/f:\s*"([^"]+\.webp)"/g)].map(m => m[1]);

const manquants = [...new Set(cites)].filter(f => !presents.has(f));
if (manquants.length) {
  console.error("🚨 PHOTOS CITÉES MAIS ABSENTES :", manquants.join(", "));
  process.exit(1);
}

console.log(`✅ ${presents.size} photos servies, ${new Set(cites).size} citées par le registre, aucune manquante.`);
console.log("   Rappel : ne JAMAIS supprimer un fichier déjà publié — les anciens paquets OTA le réclament encore.");
