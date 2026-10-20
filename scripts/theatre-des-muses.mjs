#!/usr/bin/env node
/**
 * MonacOut — LA SAISON DU THÉÂTRE DES MUSES
 *
 * Stéphanie, 20 oct 2026 : « supprime les fiches des muses et reprends tout le
 * programme ». L'app n'avait que quatre dates du théâtre, plus deux fiches
 * inventées qui n'existaient à aucun programme.
 *
 * ── Ce qu'il faut savoir avant d'y toucher ───────────────────────────────────
 * 1. LES HORAIRES SONT CEUX DU THÉÂTRE, lus sur letheatredesmuses.com le
 *    20 oct 2026, une page par spectacle. Le rythme est presque toujours le
 *    même — jeudi, vendredi, samedi à 20h00, dimanche à 16h30 — mais PAS
 *    toujours : le réveillon joue mardi et mercredi, et le 31 décembre DEUX
 *    FOIS (20h00 et 22h15) ; « Proust en clair » joue à 19h00 et 15h00. Ne
 *    jamais déduire l'horaire du jour de la semaine : le lire.
 * 2. ⚠️ DEUX SÉANCES LE MÊME SOIR DOIVENT PORTER DES TITRES DIFFÉRENTS.
 *    `dedup-events.mjs` compare année|catégorie|date|titre|sous-titre et IGNORE
 *    l'heure : la séance de 22h15 du 31 décembre était supprimée en silence.
 *    D'où le 4ᵉ élément optionnel de `d` : un suffixe de titre.
 * 3. LE SCRIPT SE REJOUE SANS RIEN CASSER. Il retire ses propres fiches
 *    (marqueur `tdm:1`) et les reconstruit entièrement depuis la table
 *    ci-dessous, qui est sa seule source. Il ne dépend d'aucune fiche
 *    existante — donc il ne peut pas s'auto-détruire comme l'avait fait
 *    soirees-du-jour le 11 août 2026.
 * 4. GARDE-FOU : s'il a des fiches à retirer mais rien à écrire, il n'écrit
 *    RIEN et sort en 1. Mieux vaut le programme d'hier qu'un fil amputé.
 * 5. Les fiches dont la date est passée ne sont pas écrites — cleanup-events
 *    les supprimerait de toute façon.
 *
 * Usage : node scripts/theatre-des-muses.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const RACINE = join(dirname(fileURLToPath(import.meta.url)), "..");
const FICHIER = join(RACINE, "src/data/events.js");

const LIEN = "https://www.letheatredesmuses.com/";
const TEL = "+377 9798 1093";          // le site officiel ; +377 9705 4682 était faux
const SOUS_TITRE = "Théâtre des Muses · Monte-Carlo";
const BASE = 990000;

// Les trois décors, par famille — la charte du 10 oct 2026 (plus d'or).
const DECOR = {
  "THÉÂTRE":   { fallback: "linear-gradient(150deg,#5A1870,#7A3890,#400858)", accent: "#E0B0F8", emoji: "🎭" },
  "MUSICAL":   { fallback: "linear-gradient(150deg,#123A5A,#2E6E9E,#071E33)", accent: "#A8D4F4", emoji: "🎼" },
  "SPECTACLE": { fallback: "linear-gradient(150deg,#7A2A08,#B85A20,#4A1804)", accent: "#F8B87A", emoji: "✨" },
};

const MOIS = ["jan","fév","mar","avr","mai","juin","juil","août","sep","oct","nov","déc"];
const JOURS = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];

// ── LA SAISON 2026-2027, telle que le théâtre la publie ──────────────────────
// d : [jour, mois (1-12), année, heure, suffixe de titre (optionnel)].
// Le suffixe est OBLIGATOIRE dès qu'un spectacle joue deux fois le même jour.
const SAISON = [
  { t: "BOLLYWOOD\nBOULEVARD", cat: "SPECTACLE", genre: "Humour, seule en scène", duree: "1h10",
    desc: "Les tribulations d'une Occidentale en quête identitaire. Un magnifique voyage en Inde.",
    descEn: "The adventures of a Western woman in search of herself. A beautiful journey through India.",
    d: [[8,10,2026,"20h00"],[9,10,2026,"20h00"],[10,10,2026,"20h00"],[11,10,2026,"16h30"]] },

  { t: "VERMEER\nET SON\nFAUSSAIRE", cat: "THÉÂTRE", genre: "Théâtre", duree: "1h05",
    desc: "Le directeur d'un grand musée londonien découvre avec effroi que le tableau qu'il a prêté au Louvre est un faux.",
    descEn: "A London museum director discovers in horror that the painting he lent the Louvre is a fake.",
    d: [[15,10,2026,"20h00"],[16,10,2026,"20h00"],[17,10,2026,"20h00"],[18,10,2026,"16h30"]] },

  { t: "GATSBY", cat: "MUSICAL", genre: "Théâtre musical", duree: "1h20",
    desc: "L'histoire d'un homme prêt à tout pour reconquérir son amour, jusqu'à se perdre lui-même. Une fresque en musique.",
    descEn: "A man ready to do anything to win back his love, even lose himself. A fresco set to music.",
    d: [[5,11,2026,"20h00"],[6,11,2026,"20h00"],[7,11,2026,"20h00"],[8,11,2026,"16h30"]] },

  { t: "LETTRES\nÀ ANNE", cat: "THÉÂTRE", genre: "Théâtre contemporain", duree: "1h10",
    desc: "Adaptation théâtrale des lettres adressées par François Mitterrand à Anne Pingeot de 1962 à 1995.",
    descEn: "A stage adaptation of the letters François Mitterrand wrote to Anne Pingeot from 1962 to 1995.",
    d: [[12,11,2026,"20h00"],[13,11,2026,"20h00"],[14,11,2026,"20h00"],[15,11,2026,"16h30"]] },

  { t: "SI UNE HISTOIRE\nFRAPPE\nÀ TA PORTE", cat: "THÉÂTRE", genre: "Comédie documentée", duree: "1h10",
    desc: "Comment écrire une nouvelle histoire quand tout a été dit cent fois ? Un jeune auteur part à la rencontre des écrivains du passé.",
    descEn: "How do you write a new story when everything has been told a hundred times? A young author meets the writers of the past.",
    d: [[19,11,2026,"20h00"],[20,11,2026,"20h00"],[21,11,2026,"20h00"],[22,11,2026,"16h30"]] },

  { t: "GAGNANT-\nGAGNANT", cat: "SPECTACLE", genre: "Comédie, humour", duree: "1h30",
    desc: "Une convention d'entreprise tourne à la comédie loufoque. Après l'immense succès de « La touche étoile », ils reviennent nous faire exploser de rire.",
    descEn: "A corporate convention turns into an offbeat comedy, by the team behind the hit \"La touche étoile\".",
    d: [[26,11,2026,"20h00"],[27,11,2026,"20h00"],[28,11,2026,"20h00"],[29,11,2026,"16h30"]] },

  { t: "QUOI DE NEUF ?\nSACHA\nGUITRY !", cat: "THÉÂTRE", genre: "Comédie", duree: "1h30",
    desc: "Quatre savoureuses comédies signées par le maître du Boulevard, au cœur de son théâtre.",
    descEn: "Four delicious comedies by the master of French boulevard theatre.",
    d: [[3,12,2026,"20h00"],[4,12,2026,"20h00"],[5,12,2026,"20h00"],[6,12,2026,"16h30"]] },

  { t: "L'AUTRE", cat: "THÉÂTRE", genre: "Théâtre", duree: "1h20",
    desc: "Traqué par la Milice, un homme n'a qu'une issue pour s'en sortir : devenir un autre.",
    descEn: "Hunted by the Milice, a man has only one way out: to become someone else.",
    d: [[10,12,2026,"20h00"],[11,12,2026,"20h00"],[12,12,2026,"20h00"],[13,12,2026,"16h30"]] },

  { t: "EIFFEL\nFOLLIE'S", cat: "SPECTACLE", genre: "Cabaret burlesque", duree: "1h15",
    desc: "Le Burlesque Klub, trois fois Billet d'Or du meilleur spectacle de cabaret, pour les fêtes de fin d'année. Le 31 décembre, deux représentations : 20h00 et 22h15.",
    descEn: "The Burlesque Klub, three-time winner of the Billet d'Or for best cabaret, for the festive season. Two shows on 31 December: 8pm and 10.15pm.",
    d: [[29,12,2026,"20h00"],[30,12,2026,"20h00"],[31,12,2026,"20h00"],[31,12,2026,"22h15","\n2ᵉ SÉANCE"]] },

  { t: "AVEC\nPLAISIRS", cat: "THÉÂTRE", genre: "Théâtre contemporain", duree: "1h10",
    desc: "Paul et Julie assistent à un spectacle. Quatre couples au cœur de la tourmente se croisent et se répondent.",
    descEn: "Paul and Julie are watching a play. Four couples in turmoil cross paths and answer one another.",
    d: [[7,1,2027,"20h00"],[8,1,2027,"20h00"],[9,1,2027,"20h00"],[10,1,2027,"16h30"]] },

  { t: "L'ILIADE", cat: "THÉÂTRE", genre: "Théâtre", duree: "1h20",
    desc: "Une adaptation contemporaine qui transpose le récit d'Homère dans l'univers sportif : deux équipes, Achéens et Troyens.",
    descEn: "A contemporary adaptation transposing Homer's tale into the world of sport: two teams, Achaeans and Trojans.",
    d: [[14,1,2027,"20h00"],[15,1,2027,"20h00"],[16,1,2027,"20h00"],[17,1,2027,"16h30"]] },

  { t: "SAINT-EXUPÉRY\nLE COMMANDEUR\nDES OISEAUX", cat: "SPECTACLE", genre: "Biopic, seul en scène", duree: "1h15",
    desc: "Saint-Exupéry, l'écrivain et aviateur français le plus célèbre au monde, seul en scène.",
    descEn: "Saint-Exupéry, the world's most famous French writer and aviator, in a one-man show.",
    d: [[21,1,2027,"20h00"],[22,1,2027,"20h00"],[23,1,2027,"20h00"],[24,1,2027,"16h30"]] },

  { t: "MOZART\nLE DERNIER VOYAGE\nÀ PARIS", cat: "MUSICAL", genre: "Théâtre musical", duree: "1h00",
    desc: "Le dernier voyage de Mozart à Paris fut un tournant dans sa vie. Une aventure libératrice, en musique.",
    descEn: "Mozart's last journey to Paris was a turning point in his life. A liberating adventure, set to music.",
    d: [[28,1,2027,"20h00"],[29,1,2027,"20h00"],[30,1,2027,"20h00"],[31,1,2027,"16h30"]] },

  { t: "L'EMPEREUR\nDES\nBOULEVARDS", cat: "MUSICAL", genre: "Biopic, théâtre musical", duree: "1h30",
    desc: "L'incroyable destin de Georges Feydeau, de ses triomphes au Théâtre des Variétés aux salons de chez Maxim's.",
    descEn: "The extraordinary destiny of Georges Feydeau, from his triumphs to the salons of Maxim's.",
    d: [[4,2,2027,"20h00"],[5,2,2027,"20h00"],[6,2,2027,"20h00"],[7,2,2027,"16h30"]] },

  { t: "UN AIR\nDE FAMILLE", cat: "THÉÂTRE", genre: "Théâtre contemporain", duree: "1h20",
    desc: "Comme tous les vendredis soir, la famille Ménard se retrouve « Au Père Tranquille ». La soirée va déraper.",
    descEn: "Every Friday night the Ménard family meets at the Père Tranquille. Tonight the evening goes off the rails.",
    d: [[11,2,2027,"20h00"],[12,2,2027,"20h00"],[13,2,2027,"20h00"],[14,2,2027,"16h30"]] },

  { t: "PIERRE\nET JEAN", cat: "THÉÂTRE", genre: "Classique", duree: "1h20",
    desc: "Le roman de Maupassant dans une mise en scène contemporaine, à six comédiennes et comédiens.",
    descEn: "Maupassant's novel in a contemporary staging, with six actors on stage.",
    d: [[11,3,2027,"20h00"],[12,3,2027,"20h00"],[13,3,2027,"20h00"],[14,3,2027,"16h30"]] },

  { t: "LA PROMESSE\nDES OMBRES", cat: "THÉÂTRE", genre: "Théâtre", duree: "1h10",
    desc: "Un jeune homme animé d'une volonté farouche, une femme animée d'une ardeur secrète. Un amour, une promesse.",
    descEn: "A young man of fierce will, a woman of secret ardour. A love, a promise.",
    d: [[18,3,2027,"20h00"],[19,3,2027,"20h00"],[20,3,2027,"20h00"],[21,3,2027,"16h30"]] },

  { t: "MONET, RENOIR\n& BAZILLE", cat: "THÉÂTRE", genre: "Théâtre contemporain", duree: "1h05",
    desc: "Vous connaissez l'impressionnisme… mais connaissez-vous l'amitié qui l'a vu naître ?",
    descEn: "You know Impressionism… but do you know the friendship that gave birth to it?",
    d: [[25,3,2027,"20h00"],[26,3,2027,"20h00"],[27,3,2027,"20h00"],[28,3,2027,"16h30"]] },

  { t: "LA POUSSIÈRE\nSOUS LE TAPIS", cat: "THÉÂTRE", genre: "Comédie dramatique", duree: "1h10",
    desc: "C'est trop ! Louison dit stop et tous veulent l'en empêcher. Une comédie fine sur un sujet grave.",
    descEn: "Enough! Louison says stop, and everyone tries to prevent her. A subtle comedy on a serious subject.",
    d: [[1,4,2027,"20h00"],[2,4,2027,"20h00"],[3,4,2027,"20h00"],[4,4,2027,"16h30"]] },

  { t: "EGO\nSAPIENS", cat: "THÉÂTRE", genre: "Théâtre contemporain", duree: "1h00",
    desc: "Comment déconnecter quand votre smartphone est à la fois votre ami, votre boussole et votre psy ?",
    descEn: "How do you disconnect when your smartphone is your friend, your compass and your therapist?",
    d: [[8,4,2027,"20h00"],[9,4,2027,"20h00"],[10,4,2027,"20h00"],[11,4,2027,"16h30"]] },

  { t: "LE SUBLIME\nSABOTAGE", cat: "SPECTACLE", genre: "Humour, seul en scène", duree: "1h20",
    desc: "Yohann Métay transforme le doute, l'échec et les faux pas en chef-d'œuvre comique.",
    descEn: "Yohann Métay turns doubt, failure and missteps into a comic masterpiece.",
    d: [[6,5,2027,"20h00"],[9,5,2027,"16h30"]] },

  { t: "LA TRAGÉDIE\nDU DOSSARD 512", cat: "SPECTACLE", genre: "Humour, seul en scène", duree: "1h20",
    desc: "Un type décide de faire la course autour du Mont Blanc. À pied. Plus de 1 000 représentations.",
    descEn: "A guy decides to race around Mont Blanc. On foot. Over 1,000 performances.",
    d: [[7,5,2027,"20h00"],[8,5,2027,"20h00"]] },

  { t: "PROUST\nEN CLAIR", cat: "SPECTACLE", genre: "Récital littéraire", duree: "1h10",
    desc: "Jacques Mougenot raconte et dit Proust, pour les fans comme pour les profanes. ⚠️ Horaires inhabituels : 19h00 le jeudi, 15h00 le dimanche.",
    descEn: "Jacques Mougenot tells and reads Proust, for devotees and newcomers alike. Note the unusual times.",
    d: [[13,5,2027,"19h00"],[16,5,2027,"15h00"]] },

  { t: "LE CAS\nMARTIN PICHE", cat: "THÉÂTRE", genre: "Comédie", duree: "1h20",
    desc: "Martin Piche souffre d'un manque absolu de curiosité. De quoi exciter au plus haut point celle de son psy.",
    descEn: "Martin Piche suffers from a total lack of curiosity — which thoroughly arouses his therapist's.",
    d: [[13,5,2027,"20h00"],[14,5,2027,"20h00"],[15,5,2027,"20h00"],[16,5,2027,"16h30"]] },

  { t: "LA PETITE\nGRAINE", cat: "THÉÂTRE", genre: "Comédie", duree: "1h25",
    desc: "Une pièce hilarante et tendre qui croque avec finesse les manies des jeunes parents.",
    descEn: "A hilarious and tender play that sketches the quirks of new parents.",
    d: [[20,5,2027,"20h00"],[21,5,2027,"20h00"],[22,5,2027,"20h00"],[23,5,2027,"16h30"]] },

  { t: "LE PORTRAIT\nDE DORIAN GRAY", cat: "THÉÂTRE", genre: "Adaptation théâtrale", duree: "1h40",
    desc: "La pièce qu'Oscar Wilde n'a jamais écrite : son célèbre roman adapté et porté à la scène.",
    descEn: "The play Oscar Wilde never wrote: his famous novel adapted for the stage.",
    d: [[27,5,2027,"20h00"],[28,5,2027,"20h00"],[29,5,2027,"20h00"],[30,5,2027,"16h30"]] },

  { t: "ENCORE\nUNE MARILYN", cat: "MUSICAL", genre: "Musical", duree: "1h20",
    desc: "La vie extraordinaire et tragique de Marilyn, racontée et jouée avec tendresse et espièglerie.",
    descEn: "Marilyn's extraordinary and tragic life, told and played with tenderness and mischief.",
    d: [[10,6,2027,"20h00"],[11,6,2027,"20h00"],[12,6,2027,"20h00"],[13,6,2027,"16h30"]] },
];

// ── Fabrication ──────────────────────────────────────────────────────────────
const auj = new Date(); auj.setHours(0, 0, 0, 0);
const ech = (s) => String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");

const fiches = [];
let n = 0, passees = 0;
for (const s of SAISON) {
  const dec = DECOR[s.cat];
  for (const [jour, mois, annee, heure, suffixe] of s.d) {
    const d = new Date(annee, mois - 1, jour);
    if (d < auj) { passees++; continue; }
    const date = `${JOURS[d.getDay()]} ${jour} ${MOIS[mois - 1]}`;
    const an = annee === 2026 ? "" : `year:${annee},`;
    fiches.push(`{id:${BASE + n++},${an}cat:"${s.cat}",date:"${date}",time:"${heure}",` +
      `title:"${ech(s.t + (suffixe || ""))}",subtitle:"${SOUS_TITRE}",` +
      `desc:"${ech(s.desc)} ${s.genre}, ${s.duree}. Tarifs 18 à 35 €.",` +
      `descEn:"${ech(s.descEn)} ${s.duree}. Tickets 18-35 €.",` +
      `free:false,hot:false,fallback:"${dec.fallback}",accent:"${dec.accent}",emoji:"${dec.emoji}",` +
      `link:"${LIEN}",phone:"${TEL}",source:"Théâtre des Muses",quarter:"Monte-Carlo",tdm:1}`);
  }
}

let src = readFileSync(FICHIER, "utf8");
const avant = (src.match(/,tdm:1\}/g) || []).length;

// GARDE-FOU : on ne vide jamais sans pouvoir remplir.
if (avant > 0 && fiches.length === 0) {
  console.error("🚨 Rien à écrire alors qu'il y a des fiches à retirer — fichier INCHANGÉ.");
  process.exit(1);
}

// Retrait de nos propres fiches, et d'elles seules.
const lignes = src.split("\n").filter(l => !/,tdm:1\}/.test(l));
src = lignes.join("\n");

const fin = src.indexOf("\n];");
if (fin < 0) { console.error("🚨 Fin du tableau _RAW introuvable."); process.exit(1); }
src = src.slice(0, fin) + "\n  " + fiches.join(",\n  ") + "," + src.slice(fin);

// Aucun id ne doit être déjà pris ailleurs.
for (const f of fiches) {
  const id = f.match(/^\{id:(\d+)/)[1];
  if ((src.match(new RegExp(`\\{id:${id},`, "g")) || []).length > 1) {
    console.error(`🚨 id ${id} en double — fichier NON écrit.`); process.exit(1);
  }
}

writeFileSync(FICHIER, src);
console.log(`Théâtre des Muses : ${SAISON.length} spectacles, ${fiches.length} fiches écrites ` +
  `(${passees} date(s) déjà passée(s), ignorée(s)) · ${avant} ancienne(s) remplacée(s).`);
