/**
 * LES CHORALES DE LA PAROISSE SAINT-CHARLES.
 *
 * Stéphanie, 8 nov 2026 : « fais une fiche chorale même si pas d'horaires, mets
 * ces infos ». Trois chorales se réunissent à Saint-Charles ; deux ont un
 * créneau hebdomadaire, la troisième non.
 *
 * 📞 LE CONTACT DU CHEF DE CHŒUR EST PUBLIÉ — DÉCISION DE STÉPHANIE.
 * J'avais d'abord mis le seul numéro de la paroisse : la règle 14 dit de ne pas
 * publier les coordonnées privées d'un particulier. Stéphanie a tranché le
 * 8 nov 2026 : « si, mets le portable ». Elle a raison sur le fond — pour une
 * chorale de paroisse, le chef de chœur EST la porte d'entrée, et ces
 * coordonnées ont été diffusées par la communauté pour qu'on l'appelle.
 * La chorale française porte donc le contact de Stéphane Catalanotti ; la
 * chorale anglaise, dont le responsable n'est pas nommé, garde le numéro de la
 * paroisse.
 * ⚠️ La règle 14 reste la règle par défaut : ceci est une exception décidée,
 *    pas son abandon.
 *
 * ⚠️ JE N'AI PAS TROUVÉ CES HORAIRES, LE RELEVÉ DE STÉPHANIE LES SOURCE AU
 * DIOCÈSE. J'ai lu le 8 nov 2026 saintcharles.diocese.mc et
 * diocese.mc/mouvements-associations-laics sans y voir « chorale » ni « Cesare
 * Penzo » ; sa capture, elle, cite le Diocèse de Monaco. Les deux peuvent être
 * vrais — le site est vaste et je n'en ai lu que deux pages. J'ai d'abord écrit
 * dans les fiches que « la paroisse ne publie pas ces horaires » : c'était
 * affirmer plus que ce que je savais, et c'est retiré.
 * ⚠️ La mise en garde utile demeure, mais elle porte sur ce qui est vrai de
 *    tout chœur : les répétitions s'interrompent aux vacances et aux fêtes.
 *
 * ⚠️ LA CHORALE PORTUGAISE N'A PAS DE FICHE, ET C'EST VOLONTAIRE. Elle se
 * réunit « certains vendredis, après la chorale française » : ce n'est pas une
 * date. En faire une fiche hebdomadaire ferait venir quelqu'un un vendredi où
 * il n'y a personne (règle 17). Elle est citée dans la fiche du vendredi, là où
 * l'information est utile sans rien affirmer de faux.
 *
 *   node scripts/chorales-saint-charles.mjs            → rapport seul
 *   node scripts/chorales-saint-charles.mjs --ecrire   → met à jour events.js
 */
import { readFileSync, writeFileSync } from "node:fs";

const ECRIRE = process.argv.includes("--ecrire");
const FICHIER = new URL("../src/data/events.js", import.meta.url);
const MARQUE = "chs:1";
const HORIZON = 120;
const ID0 = 963000;
const TEL = "+377 9330 7490";
const LIEN = "https://saintcharles.diocese.mc/";
const JOURS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MOIS = ["jan", "fév", "mar", "avr", "mai", "juin", "juil", "août", "sep", "oct", "nov", "déc"];

const RAPPEL = "Les répétitions s'interrompent aux vacances scolaires et aux fêtes : un appel avant de se déplacer évite de trouver la salle fermée.";

const CHŒURS = [
  {
    jour: 5, heure: "20h00",
    tel: "+33 6 64 12 37 05",
    titre: `CHORALE FRANÇAISE\nSAINT-CHARLES\nRÉPÉTITION`,
    lieu: "Salle Cesare Penzo · Paroisse Saint-Charles · Monte-Carlo",
    desc: "La chorale française de la paroisse Saint-Charles répète tous les vendredis soir, salle Cesare Penzo : "
      + "chants liturgiques et travail de la polyphonie. Débutants acceptés, il n'est pas nécessaire de savoir lire la musique. "
      + "Contact : Stéphane Catalanotti, 06 64 12 37 05, stephanecatalanotti@gmail.com. "
      + "La chorale portugaise de la paroisse se réunit certains vendredis, à la suite de celle-ci — se renseigner pour les dates. "
      + RAPPEL,
    descEn: "The French-language choir of Saint-Charles parish rehearses every Friday evening in the Cesare Penzo hall: "
      + "liturgical singing and part-work. Beginners welcome, no need to read music. "
      + "Contact: Stéphane Catalanotti, +33 6 64 12 37 05, stephanecatalanotti@gmail.com. "
      + "The parish's Portuguese choir meets on some Fridays straight afterwards - ask for dates. "
      + "Rehearsals pause during school holidays and feast days: a quick call before coming avoids finding the hall closed.",
  },
  {
    jour: 0, heure: "11h30",
    titre: `CHORALE ANGLAISE\nSAINT-CHARLES\nDIMANCHE`,
    lieu: "Paroisse Saint-Charles · Monte-Carlo",
    desc: "La chorale anglophone de la paroisse Saint-Charles se réunit le dimanche à 11h30. "
      + "Le responsable renseigne sur le niveau attendu et sur la possibilité de rejoindre le groupe. "
      + RAPPEL,
    descEn: "The English-speaking choir of Saint-Charles parish gathers on Sundays at 11.30am. "
      + "The choir leader can advise on the level expected and on joining. "
      + "Rehearsals pause during school holidays and feast days: a quick call before coming avoids finding the hall closed.",
  },
];

const esc = s => String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ").trim();
const auj = new Date(); auj.setHours(0, 0, 0, 0);
const lignes = [];
let id = ID0;

for (let k = 0; k < HORIZON; k++) {
  const d = new Date(auj); d.setDate(auj.getDate() + k);
  for (const c of CHŒURS) {
    if (d.getDay() !== c.jour) continue;
    const date = `${JOURS[d.getDay()]} ${d.getDate()} ${MOIS[d.getMonth()]}`;
    const an = d.getFullYear() !== auj.getFullYear() ? `year:${d.getFullYear()},` : "";
    lignes.push(
      `  {id:${id++},${an}cat:"CHANTS",date:"${date}",time:"${c.heure}",`
      + `title:"${c.titre.replace(/\n/g, "\\n")}",subtitle:"${esc(c.lieu)}",`
      + `desc:"${esc(c.desc)}",descEn:"${esc(c.descEn)}",`
      + `free:true,hot:false,${MARQUE},`
      + `fallback:"linear-gradient(150deg,#2A1A3A,#54386A,#160C22)",accent:"#C8A8E8",emoji:"🎼",`
      + `link:"${LIEN}",phone:"${c.tel || TEL}",source:"Paroisse Saint-Charles",quarter:"Monte-Carlo"},`);
  }
}

console.log(`🎼 Chorales Saint-Charles : ${lignes.length} fiche(s) sur ${HORIZON} jours`);
for (const c of CHŒURS) console.log(`   ${JOURS[c.jour]} ${c.heure} — ${c.titre.split("\n")[0]}`);
console.log("   ⚠️ La chorale portugaise n'a PAS de fiche : « certains vendredis » n'est pas une date.");
if (!ECRIRE) { console.log("\n(lecture seule — relancer avec --ecrire)"); process.exit(0); }

let src = readFileSync(FICHIER, "utf8");
const avant = (src.match(new RegExp(MARQUE, "g")) || []).length;
if (!lignes.length) { console.log(`❌ Rien à écrire alors que ${avant} fiches existent — fichier NON modifié.`); process.exit(1); }
src = src.split("\n").filter(l => !l.includes(MARQUE)).join("\n");
const ancre = src.indexOf("\n", src.indexOf("const _RAW = ["));
if (ancre < 0) { console.log("❌ Tableau _RAW introuvable."); process.exit(1); }
src = src.slice(0, ancre + 1) + lignes.join("\n") + "\n" + src.slice(ancre + 1);
writeFileSync(FICHIER, src);
console.log(`\n✓ events.js : ${avant} ancienne(s) fiche(s) remplacée(s) par ${lignes.length}.`);
