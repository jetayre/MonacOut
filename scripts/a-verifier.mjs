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
