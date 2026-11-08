/**
 * CE QUI ATTEND UNE RÉPONSE — relancé chaque nuit.
 *
 * Stéphanie, 1er nov 2026 : « mets bien tout ça dans la source, que tu puisses
 * vérifier tout seul régulièrement ».
 *
 * Pendant deux jours de relevés, une quinzaine de sorties ont été écartées non
 * pas parce qu'elles étaient fausses, mais parce qu'il manquait une pièce : une
 * date non publiée, un tarif invérifiable, un horaire d'ouverture inconnu.
 * Ces dossiers-là se rouvrent tout seuls le jour où la pièce arrive — encore
 * faut-il que quelqu'un retourne voir. Personne ne le fait. Ce script le fait.
 *
 * 🚨 IL NE PUBLIE RIEN. Il relit les pages, cherche le SIGNE que l'obstacle est
 * levé, et écrit `a-verifier.txt`. La décision d'ajouter reste humaine : c'est
 * ce qui a évité d'annoncer un programme de 2024 et une Primo Cup au mauvais
 * jour.
 *
 * ⚠️ UN SIGNE N'EST PAS UNE PREUVE. « lena.mc mentionne décembre » ne veut pas
 * dire qu'une séance de décembre est ouverte : ça veut dire qu'il faut aller
 * regarder. Le rapport dit « À ROUVRIR », jamais « c'est bon ».
 *
 * ⚠️ ET UN SITE QUI NE RÉPOND PAS N'EST PAS UNE RÉPONSE NÉGATIVE. On distingue
 * « rien trouvé » de « page injoignable » — la leçon du 18 août, quand le CI
 * déclarait morts des hôtes qui refusaient seulement son adresse IP.
 *
 *   node scripts/a-verifier.mjs
 */
import { writeFileSync } from "node:fs";

const SORTIE = new URL("../a-verifier.txt", import.meta.url);
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36";

/**
 * Chaque dossier : ce qu'on attend, où regarder, et le motif qui dit
 * « l'obstacle est peut-être levé ». `humain` = ce qu'aucun script ne peut
 * faire, donc ce qu'il faut rappeler à Stéphanie.
 */
const DOSSIERS = [
  { nom: "LENA Céramiques — dates d'ateliers",
    url: "https://lena.mc/",
    motif: /(novembre|décembre|janvier|février)\s+20(2[7-9]|3\d)|(nov|déc|jan|fév)\.?\s*20(2[7-9])/i,
    attendu: "Aucune séance publiée après le 23 mai 2026 (constaté le 1er nov 2026).",
    rouvrir: "Une date de séance à venir apparaît sur le site.",
    piege: "⚠️ RÈGLE 15 : leur 3e lieu, COMBO, est à BEAUSOLEIL. Ne reprendre que Déli Robuchon et Eeny Meeny." },

  { nom: "Aritual — dates de sessions",
    url: "https://aritual.fr/",
    motif: /(prochaine session|inscription|réserver).{0,200}(20\d\d|\d{1,2}\s+(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre))/i,
    attendu: "« Dates, prix et adresse de la prochaine session à consulter » — rien de daté.",
    rouvrir: "Une session datée apparaît.",
    piege: "Déjà présent comme adresse dans l'annuaire BIEN-ÊTRE : ne pas créer de doublon de lieu." },

  { nom: "Ateliers chocolat & boulangerie — Monte-Carlo SBM",
    url: "https://www.montecarlosbm.com/fr",
    motif: /atelier.{0,40}(chocolat|boulanger)|98\s?06\s?71\s?71/i,
    attendu: "Introuvable sur montecarlosbm.com le 1er nov 2026, y compris au navigateur.",
    rouvrir: "La SBM publie l'atelier ou le téléphone +377 98 06 71 71.",
    piege: "Même publié, ce n'est PAS une fiche datée : « sur demande », 5 à 8 personnes, 15 jours à l'avance.",
    humain: "Un appel au +377 98 06 71 71 tranche en deux minutes." },

  { nom: "Bal de la Rose 2027 — date officielle",
    url: "https://www.montecarlosbm.com/fr/agenda/bal-de-la-rose",
    motif: /20\s*mars\s*2027|\d{1,2}\s+mars\s+2027|2027-03-\d\d/i,
    attendu: "La SBM n'a pas publié la date 2027. Le « 20 mars » vient du Club Suisse, un tiers.",
    rouvrir: "La SBM annonce la date — et c'est ELLE qui fait foi, pas un tiers.",
    piege: "Dernière édition confirmée : 21 mars 2026." },

  { nom: "AS Monaco Basket — calendrier",
    url: "https://asmonaco.basketball/calendar/monthcalendar.php",
    motif: /\d{1,2}[:h]\d{2}/,
    attendu: "Calendrier VIDE même au navigateur, billetterie « aucun évènement », Monaco absent de la LNB (1er nov 2026).",
    rouvrir: "Des horaires apparaissent sur le calendrier du club.",
    piege: "Nos 2 fiches Eurocup (30 déc, 13 jan) ne sont confirmées par AUCUNE source.",
    humain: "Le club a publié une « Décision du CNOSF » le 18 sep 2026 : demander ce qu'elle implique." },

  { nom: "Médiathèque — ouvre-t-elle le dimanche ?",
    url: "https://www.mediatheque.mc/",
    motif: /dimanche\s*:?\s*\d{1,2}\s*h/i,
    attendu: "Horaires relevés : lundi 14h30-18h30, mardi-vendredi 10h-18h30, samedi 10h-13h, DIMANCHE FERMÉ.",
    rouvrir: "Un horaire de dimanche apparaît.",
    piege: "C'est ce point qui a permis de dater de 2024 l'article de la Mairie, et d'éviter 5 fiches fausses.",
    humain: "Le +377 93 15 29 40 confirmerait aussi les séances du 15 et du 22 novembre." },

  { nom: "Jardin Exotique — ateliers plantes succulentes",
    url: "https://www.mairie.mc/les-ateliers-de-compositions-de-plantes-succulentes",
    motif: /rouvert|réouvert|depuis (mars|sa réouverture)/i,
    attendu: "La page dit encore « actuellement fermé pour travaux » — or le Jardin a rouvert en mars 2026. Page périmée.",
    rouvrir: "La page est mise à jour et ne parle plus de fermeture.",
    piege: "Lundi au vendredi 10h et 14h = 10 fiches par semaine : ne pas publier sur une page périmée.",
    humain: "Réservation au +377 93 15 29 80 — un appel dit si les ateliers ont lieu." },

  // ── Relevé de Stéphanie du 8 nov 2026 ────────────────────────────────────
  // Quatre lignes de sa liste n'ont PAS pu être publiées. Aucune n'est fausse :
  // il manque à chacune une pièce. Elles se rouvrent le jour où elle arrive.

  { nom: "British Association — café-rencontre à La Note Bleue",
    url: "https://www.britishassociationmonaco.com/",
    motif: /note bleue|coffee morning|caf[ée].{0,30}(rencontre|matin)/i,
    attendu: "Relevé : 10 nov et 7 déc à 9h30 à La Note Bleue, sans réservation. ⚠️ NON VÉRIFIÉ : le site ne répond pas depuis cet environnement (HTTP 000 le 8 nov 2026).",
    rouvrir: "Le site redevient joignable et confirme la date et l'heure.",
    piege: "⚠️ Injoignable n'est PAS une réponse négative (leçon du 18 août) — mais ce n'est pas une confirmation non plus. L'Afternoon Tea du 24 nov, lui, est déjà dans l'app." },

  { nom: "AFCEM — soirée de Noël du 10 décembre",
    url: "https://en.afce-monaco.org/agenda",
    motif: /no[eë]l.{0,80}(19\s?h|19:00|\d{1,2}\s?h\s?\d{0,2})/i,
    attendu: "Date et horaire annoncés (10 déc, 19h-23h) mais AUCUN LIEU publié.",
    rouvrir: "Une salle apparaît. Une fiche sans lieu ne peut pas exister (règle 13).",
    piege: "Le café du mardi, lui, est déjà dans l'app (10 nov, 8h45)." },

  // ⛔ BACKGAMMON — DOSSIER CLOS LE 8 NOV 2026, quelques heures après son
  // ouverture. Stéphanie, après vérification : « les rencontres du mercredi
  // sont annoncées POUR LES MEMBRES ». C'est une réponse, pas une absence de
  // réponse : même règle que le Bar Salle Blanche et la matinée bien-être du
  // Yacht Club. Ne pas rouvrir sans une mention d'ouverture aux visiteurs.
  { nom: "AS Monaco Tennis de table — calendrier du championnat",
    url: "https://asmonacott.com/",
    motif: /\d{1,2}[\/\s](nov|d[ée]c|janv)/i,
    attendu: "Relevé : rencontres les 21 nov, 5 et 12 déc. ⚠️ NON VÉRIFIÉ : asmonacott.com/calendrier répond 404 le 8 nov 2026, et aucune salle ni heure n'est publiée.",
    rouvrir: "Un calendrier avec SALLE et HEURE — sans quoi on ne sait pas où aller.",
    piege: "⚠️ Ne pas confondre avec les 7 fausses correspondances du mot « table » dans l'app : il n'y a AUCUNE fiche de tennis de table aujourd'hui." },

  // ── Agenda de la Mairie, relevé du 8 nov 2026 ────────────────────────────
  // 🚨 QUATRE ENTRÉES SANS LIEU NI HEURE. L'agenda de la Mairie annonce la date
  // et une phrase de présentation, puis plus rien : pas de page dédiée (vérifié
  // au navigateur — seul « Don de plantes » est cliquable), pas de salle, pas
  // d'horaire. La règle 13 exige une salle précise : une fiche qui envoie au
  // mauvais endroit est pire qu'une fiche absente.
  // ☎️ UN SEUL APPEL AU +377 93 15 28 63 DÉBLOQUERAIT LES QUATRE.
  { nom: "Mairie — Animation jeux de société, 11 nov",
    url: "https://www.mairie.mc/agenda/",
    motif: /animation jeux[\s\S]{0,400}(\d{1,2}\s?h|march[ée])/i,
    attendu: "L'agenda confirme la DATE et la nature (« jeux de société, détente et convivialité »). Un relevé annonce 16h-18h au Marché de la Condamine, entrée libre — non confirmé par la Mairie, ni sur sa page du Marché.",
    rouvrir: "Un lieu et un horaire publiés.",
    humain: "+377 93 15 28 63 — le même appel vaut pour les trois entrées suivantes." },

  { nom: "Mairie — Spectacle jeune public « Pyjamas », 14 nov",
    url: "https://www.mairie.mc/agenda/",
    motif: /pyjamas[\s\S]{0,300}\d{1,2}\s?h/i,
    attendu: "« Pour toute la famille, dès 3 ans. » Ni salle ni horaire.",
    rouvrir: "Une salle et une heure." },

  { nom: "Mairie — « Piaf, le spectacle » avec Nathalie Lermitte, 18 nov",
    url: "https://www.mairie.mc/agenda/",
    motif: /piaf[\s\S]{0,300}\d{1,2}\s?h/i,
    attendu: "« Le spectacle officiel en hommage à Édith Piaf. » Ni salle ni horaire.",
    rouvrir: "Une salle et une heure." },

  { nom: "Mairie — Fête Nationale au Marché de la Condamine, 19 nov",
    url: "https://www.mairie.mc/agenda/",
    motif: /f[eê]te nationale au march[\s\S]{0,300}\d{1,2}\s?h/i,
    attendu: "Le LIEU est dans le titre (Marché de la Condamine), mais aucun horaire n'est publié.",
    rouvrir: "Un horaire — le lieu, lui, est acquis." },

  { nom: "Escrime — compétitions seniors à l'épée, 28-29 nov",
    url: "https://www.mairie.mc/agenda/",
    motif: /escrime|[ée]p[ée]e/i,
    attendu: "Relevé : Espace Saint-Antoine, Fontvieille, les 28 et 29 nov. Inscription réservée aux licenciés, horaires non publiés.",
    rouvrir: "Un horaire, et de quoi dire si l'on peut venir REGARDER.",
    piege: "⚠️ Une compétition fermée aux non-licenciés peut rester une sortie — on y assiste. Mais sans horaire, rien n'est publiable (règle 18)." },
];

const lire = async u => {
  try {
    const r = await fetch(u, { headers: { "User-Agent": UA }, redirect: "follow", signal: AbortSignal.timeout(25000) });
    if (!r.ok) return { err: `HTTP ${r.status}` };
    const html = await r.text();
    return { texte: html.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ") };
  } catch (e) { return { err: e.name === "TimeoutError" ? "délai dépassé" : e.message.slice(0, 60) }; }
};

const lignes = [`CE QUI ATTEND UNE RÉPONSE — ${new Date().toISOString().slice(0, 10)}`, ""];
let rouverts = 0, injoignables = 0;

for (const d of DOSSIERS) {
  const r = await lire(d.url);
  let etat;
  if (r.err) { etat = `⚠️  INJOIGNABLE (${r.err}) — ce n'est PAS une réponse négative`; injoignables++; }
  else if (d.motif.test(r.texte)) { etat = "🔔 À ROUVRIR — le signe attendu est apparu"; rouverts++; }
  else etat = "·  inchangé";
  lignes.push(`${etat}`, `   ${d.nom}`, `   ${d.url}`, `   état connu : ${d.attendu}`, `   rouvrir si : ${d.rouvrir}`);
  if (d.piege) lignes.push(`   ${d.piege}`);
  if (d.humain) lignes.push(`   ☎️  ${d.humain}`);
  lignes.push("");
}

lignes.splice(1, 0,
  `${DOSSIERS.length} dossiers · ${rouverts} à rouvrir · ${injoignables} injoignable(s)`,
  "",
  "🚨 Ce rapport ne publie RIEN. « À rouvrir » veut dire « va regarder »,",
  "   jamais « c'est bon » : un signe n'est pas une preuve.");

const rapport = lignes.join("\n") + "\n";
writeFileSync(SORTIE, rapport);
console.log(rapport);
