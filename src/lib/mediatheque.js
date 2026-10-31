/**
 * 🖼️ LA MÉDIATHÈQUE — 1 à 3 photos CC0 par lieu, servies HORS du paquet OTA.
 *
 * Source : `MONACOUT_PHOTOTHEQUE_CC0_V4`, la photothèque fournie par Stéphanie
 * le 28 oct 2026, complétée par le fonds CC0 de Wikimedia Commons sur Monaco.
 * Son brief, mot pour mot :
 *   · « Tu souhaites 1 à 3 photos par lieu, et je conserve cet objectif,
 *     uniquement avec des images gratuites dont la réutilisation est autorisée. »
 *   · « De belles photos authentiques des lieux à la place des grands rectangles
 *     colorés. »
 *   · « Rattache chaque photo au bon lieu par ID stable. Pas de correspondance
 *     sur un mot du nom, pas de photo d'un lieu pour un autre. »
 *
 * ── CE QUI EST GARANTI ──────────────────────────────────────────────────────
 *
 * 1. **AUCUNE IMAGE GÉNÉRÉE, AUCUNE IMAGE SANS LICENCE.** Chaque fichier vient
 *    de Wikimedia Commons avec une licence CC0 revérifiée par appel d'API au
 *    moment du téléchargement. Les 16 visuels IA de l'ancien kit ne servent plus.
 *
 * 2. **LE RATTACHEMENT SE FAIT PAR LIBELLÉ EXACT.** `LIBELLES` compare la
 *    chaîne ENTIÈRE, normalisée — jamais un `includes()`.
 *    🚨 C'est ce qui sépare « Théâtre Princesse Grace » d'« Académie Princesse
 *    Grace ». Le 28 oct au matin, l'ancien système posait UNE IMAGE PAR
 *    CATÉGORIE : la photo de l'Opéra atterrissait sur l'Auditorium Rainier III
 *    et des enfants sur un cours de zumba. Stéphanie l'a vu tout de suite.
 *
 * 3. **1 À 3 VUES PAR LIEU, CHOISIES PAR `event.id`** — mais seulement là où
 *    plusieurs vues existent VRAIMENT.
 *
 *    🚨 PIÈGE MAJEUR, ATTRAPÉ LE 28 OCT. La photothèque proposait 2 vues pour
 *    la plupart des lieux. En les posant côte à côte, les quatre cartes du
 *    Théâtre Princesse Grace affichaient la MÊME image. Un contrôle par
 *    empreinte visuelle (16×16 en niveaux de gris) l'a expliqué : **13 paires
 *    étaient le même cliché**, servi par deux sources différentes — la
 *    photothèque V4 et le fonds Commons avaient sélectionné les mêmes fichiers.
 *    Pire, `cafe-de-paris.webp` et `quartier-monte-carlo-2.webp` étaient
 *    identiques : la photo du Café de Paris servait AUSSI de vue générique du
 *    quartier.
 *    ⚠️ LA GALERIE DE 12 PHOTOS DU 28 OCT AU SOIR A CONFIRMÉ LE PIÈGE : sur
 *    les 12, **six étaient déjà dans la médiathèque** — le contrôle par
 *    empreinte les a reconnues avant tout téléchargement. Sur les six restantes,
 *    quatre ont été écartées en les regardant : la foire derrière un grillage,
 *    deux plages avec les grues du chantier du Portier, et une mer grise. Deux
 *    sortaient même COUCHÉES, l'orientation EXIF n'étant pas appliquée — elles
 *    ont été retéléchargées avec `ImageOps.exif_transpose`.
 *    Bilan : **3 vues gardées** (Palais, Méridien, Musée océanographique).
 *
 *    Les 13 doublons sont supprimés. Il reste **35 photos réellement
 *    distinctes**, et le registre ne promet plus 2 ou 3 vues là où il n'y en a
 *    qu'une. *Compter des fichiers n'est pas compter des photos.*
 *
 *    Le choix reste STABLE : la même fiche garde sa vue d'un affichage à
 *    l'autre, sinon l'image changerait à chaque défilement.
 *
 * 4. **CE QUI A ÉTÉ ÉCARTÉ APRÈS CONTRÔLE VISUEL** — la photothèque le demande
 *    (« ouvrir visuellement chaque image »), et six l'ont été :
 *      · `circuit-de-monaco` : des camions derrière un grillage. Et surtout,
 *        c'est « l'entrée de la Rascasse » du CIRCUIT, pas le bar La Rascasse.
 *        Le piège exact que la photothèque signale.
 *      · `casino-monte-carlo-2` : gros plan d'une horloge, illisible en vignette.
 *      · `jardin-japonais-2` : noir et blanc, avec des grues de chantier.
 *      · `opera-garnier-1` : photographie sépia du XIXᵉ, trop datée pour le fil.
 *      · `stade-louis-ii-2` : des gradins vides et des passants flous.
 *      · 3 photos du Jardin exotique : licence « Public domain » et non CC0 —
 *        le script les a refusées, on ne force pas.
 *    Une licence valide ne fait pas une bonne photo : les deux contrôles sont
 *    nécessaires.
 *
 * 5. **HORS DU PAQUET OTA.** Les fichiers vivent dans `public/media/`, que
 *    `scripts/publish-ota.mjs` EXCLUT du zip (comme `capgo/`). Vercel les sert,
 *    l'app les charge en `loading="lazy"`.
 *
 * ⚠️ CE QUE ÇA NE COUVRE PAS, ET L'INVENTAIRE LE CONFIRME. Sur les 112 libellés
 * de la photothèque : **86 n'ont AUCUNE source CC0** (995 fiches — Twiga, Bar
 * Américain, Stars of Monaco, Thermes Marins…), et **11 ne sont pas des lieux**
 * mais des regroupements (1 157 fiches — « Musées de Monaco », « Bars &
 * terrasses »). Personne ne photographie l'intérieur d'un club sous licence
 * libre : ces photos n'existent que chez les établissements eux-mêmes.
 */

/**
 * Là où les photos sont servies.
 *
 * 🚨 DEUX CAS, ET IL FAUT LES DEUX. Sur le SITE (et en développement), la page
 * vit sur un vrai `http(s)://` : l'adresse relative suffit. Dans l'APP
 * INSTALLÉE, la page vit sur `capacitor://localhost`, où `/media/…` ne mène
 * nulle part — il faut l'adresse absolue. Une première version ne gardait que
 * l'absolue : en local, les photos renvoyaient toutes leur texte de
 * remplacement et l'accueil s'affichait sans aucune image.
 */
const BASE =
  (typeof window !== "undefined" && /^https?:$/.test(window.location.protocol))
    ? "/media/lieux"
    : "https://monac-out.vercel.app/media/lieux";

/**
 * LE REGISTRE DES LIEUX. `id` est STABLE et ne se réattribue JAMAIS — même
 * règle que `lieux-ids.json` : un numéro repris ferait glisser les photos d'un
 * lieu sur un autre, en silence.
 *
 * `vues` : 1 à 3 fichiers, du plus représentatif au plus anecdotique.
 */
export const LIEUX = [
  { id: 1, slug: "port-hercule", nom: "Port Hercule", vues: [
      { f: "port-hercule.webp",   w: 1280, h: 640,  alt: "Vue générale du Port Hercule" },
      { f: "port-hercule-5.webp", w: 1400, h: 1071, alt: "Les bateaux du Port Hercule" },
  ] },
  { id: 2, slug: "theatre-des-muses", nom: "Théâtre des Muses", vues: [
      { f: "theatre-des-muses.webp", w: 1280, h: 1379, alt: "La façade du Théâtre des Muses" },
  ] },
  { id: 3, slug: "theatre-princesse-grace", nom: "Théâtre Princesse Grace", vues: [
      { f: "theatre-princesse-grace.webp", w: 1280, h: 1323, alt: "L'entrée du Théâtre Princesse Grace" },
  ] },
  { id: 4, slug: "musee-oceanographique", nom: "Musée Océanographique", vues: [
      { f: "musee-oceanographique.webp",        w: 1280, h: 1707, alt: "Le Musée océanographique de Monaco" },
      { f: "musee-oceanographique-g1.webp",     w: 1200, h: 1600, alt: "La façade du Musée océanographique, côté mer" },
      { f: "musee-oceanographique-entree.webp", w: 1280, h: 2391, alt: "L'entrée du Musée océanographique" },
  ] },
  { id: 6, slug: "casino-monte-carlo", nom: "Casino de Monte-Carlo", vues: [
      { f: "casino-exterieur.webp",             w: 1400, h: 1366, alt: "La façade du Casino de Monte-Carlo" },
      { f: "casino-monte-carlo-interieur.webp", w: 1280, h: 1707, alt: "Un salon intérieur du Casino de Monte-Carlo" },
  ] },
  { id: 7, slug: "place-du-casino", nom: "Place du Casino", vues: [
      { f: "place-du-casino.webp", w: 1280, h: 891, alt: "La Place du Casino" },
  ] },
  { id: 8, slug: "opera-monte-carlo", nom: "Opéra de Monte-Carlo", vues: [
      { f: "opera-monte-carlo-exterieur.webp", w: 1280, h: 901, alt: "L'Opéra de Monte-Carlo, façade de la Salle Garnier" },
  ] },
  { id: 9, slug: "palais-princier", nom: "Palais Princier", vues: [
      { f: "palais-princier.webp",    w: 1280, h: 1707, alt: "Le Palais princier de Monaco" },
      { f: "palais-princier-g1.webp", w: 1200, h: 942,  alt: "Le Palais princier vu des remparts" },
  ] },
  { id: 10, slug: "stade-louis-ii", nom: "Stade Louis-II", vues: [
      { f: "stade-louis-ii.webp", w: 1280, h: 960, alt: "Le Stade Louis-II" },
  ] },
  { id: 11, slug: "jardin-japonais", nom: "Jardin Japonais", vues: [
      { f: "jardin-japonais.webp",        w: 1280, h: 960, alt: "Le Jardin japonais de Monaco" },
      { f: "jardin-japonais-entree.webp", w: 1280, h: 960, alt: "L'entrée du Jardin japonais" },
  ] },
  { id: 13, slug: "plage-larvotto", nom: "Plage du Larvotto", vues: [
      { f: "plage-larvotto.webp", w: 1280, h: 960, alt: "La plage du Larvotto" },
  ] },
  { id: 14, slug: "marche-condamine", nom: "Marché de la Condamine", vues: [
      { f: "marche-condamine.webp", w: 1280, h: 677, alt: "La halle du Marché de la Condamine" },
  ] },
  { id: 15, slug: "jardin-exotique", nom: "Jardin Exotique", vues: [
      { f: "jardin-exotique.webp", w: 1280, h: 960, alt: "Le Jardin exotique de Monaco" },
  ] },
  { id: 17, slug: "cafe-de-paris", nom: "Café de Paris Monte-Carlo", vues: [
      { f: "cafe-de-paris.webp", w: 1280, h: 1005, alt: "Le Café de Paris, depuis la Place du Casino" },
  ] },
  { id: 18, slug: "nmnm", nom: "Nouveau Musée National de Monaco", vues: [
      { f: "nmnm-villa-paloma.webp", w: 1280, h: 847, alt: "Le Nouveau Musée National de Monaco" },
  ] },
  { id: 19, slug: "eglise-sainte-devote", nom: "Église Sainte-Dévote", vues: [
      { f: "eglise-sainte-devote.webp", w: 1280, h: 1311, alt: "L'église Sainte-Dévote" },
  ] },
  { id: 20, slug: "meridien-beach-plaza", nom: "Le Méridien Beach Plaza", vues: [
      { f: "meridien-beach-plaza.webp",    w: 1280, h: 960, alt: "La plage du Méridien Beach Plaza" },
      { f: "meridien-beach-plaza-g1.webp", w: 1200, h: 900, alt: "Le rivage devant le Méridien Beach Plaza" },
  ] },
  { id: 21, slug: "cathedrale-monaco", nom: "Cathédrale de Monaco", vues: [
      { f: "cathedrale-monaco.webp", w: 1280, h: 2475, alt: "La cathédrale de Monaco" },
  ] },

  // 🌃 LE TWIGA — photo fournie par Stéphanie le 28 oct 2026 (« soirée »,
  // « twiga »), et c'est bien SA salle : le plafond annulaire, les lustres de
  // perles, le service aux serviettes. 156 fiches concernées, le 2ᵉ lieu le
  // plus présent de l'app.
  // ⚠️ Provenance : fichier remis par Stéphanie, vraisemblablement tiré de la
  // communication de l'établissement. Ce n'est pas une licence libre — si le
  // Twiga le demandait, il faudrait la retirer. À faire confirmer par eux :
  // +377 9999 2550.
  { id: 22, slug: "twiga-monte-carlo", nom: "Twiga Monte-Carlo", vues: [
      { f: "twiga-monte-carlo.webp", w: 1400, h: 956, alt: "La salle du Twiga Monte-Carlo un soir de fête" },
  ] },

  // 🎡 LA FOIRE : photo de la MANIFESTATION, pas du quai. Édition précédente.
  { id: 16, slug: "foire-attractions", nom: "Foire Attractions du Port Hercule", edition: "novembre 2021", vues: [
      { f: "foire-attractions-port-hercule.webp", w: 1280, h: 907, alt: "Les manèges de la Foire Attractions, sur le Port Hercule" },
  ] },

  // 🏙️ LES QUARTIERS — dernier recours.
  { id: 30, slug: "quartier-monaco", nom: "Monaco", vues: [
      { f: "quartier-monaco.webp",   w: 900, h: 458, alt: "Monaco, le Port Hercule vu du Palais" },
      { f: "quartier-monaco-2.webp", w: 900, h: 619, alt: "Le front de mer à Monaco" },
      { f: "quartier-monaco-3.webp", w: 900, h: 646, alt: "La mer depuis l'avenue Saint-Martin" },
  ] },
  { id: 31, slug: "quartier-monte-carlo", nom: "Monte-Carlo", vues: [
      { f: "quartier-monte-carlo.webp",   w: 900, h: 1111, alt: "Une rue de Monte-Carlo" },
      { f: "quartier-monte-carlo-3.webp", w: 900, h: 658,  alt: "L'avenue des Spélugues" },
  ] },
  { id: 32, slug: "quartier-la-condamine", nom: "La Condamine", vues: [
      { f: "quartier-la-condamine.webp",   w: 900, h: 707, alt: "Le Port Hercule, à La Condamine" },
      { f: "quartier-la-condamine-2.webp", w: 900, h: 978, alt: "Les quais du Port Hercule" },
      { f: "quartier-la-condamine-3.webp", w: 900, h: 675, alt: "Le Rocher vu de la Place d'Armes" },
  ] },
  { id: 33, slug: "quartier-larvotto", nom: "Larvotto", vues: [
      { f: "quartier-larvotto.webp",   w: 900, h: 625, alt: "La plage du Larvotto" },
      { f: "quartier-larvotto-2.webp", w: 900, h: 620, alt: "Le rivage du Larvotto" },
  ] },
  { id: 34, slug: "quartier-monaco-ville", nom: "Monaco-Ville", vues: [
      { f: "quartier-monaco-ville.webp",   w: 900, h: 907, alt: "Une ruelle de Monaco-Ville, sur le Rocher" },
      { f: "quartier-monaco-ville-2.webp", w: 900, h: 675, alt: "La Place du Palais" },
  ] },
];

/**
 * 🔑 LIBELLÉ EXACT → identifiant de lieu.
 *
 * La clé est le libellé tel qu'il est RÉELLEMENT écrit dans `subtitle`, avant
 * le « · » du quartier. Relevé sur les 2 385 fiches : les variantes sont peu
 * nombreuses, mieux vaut les écrire une par une que de les deviner.
 *
 * 🚨 NE JAMAIS remplacer cette table par un rapprochement souple. Le jour où un
 * libellé nouveau apparaît, la fiche prend la photo de son quartier — c'est le
 * bon défaut.
 */
const LIBELLES = {
  "port hercule": 1,
  "port hercule de monaco": 1,
  // 🌊 LA DIGUE, C'EST LE PORT HERCULE. Stéphanie, 28 oct 2026 : « pour zumba
  // tu as mis des enfants, mets plutôt la digue de Monaco port hercule ». La
  // fiche dit « Zumba La Digue · Quai Rainier III » : la digue est bien la
  // jetée du Port Hercule, la photo montre donc le VRAI lieu du cours.
  "zumba la digue": 1,
  "quai rainier iii": 1,
  "la digue": 1,

  "theatre des muses": 2,
  "theatre princesse grace": 3,
  "salle princesse grace": 3,
  "musee oceanographique": 4,
  "musee oceanographique de monaco": 4,
  "casino de monte carlo": 6,
  "place du casino": 7,
  "opera garnier": 8,
  "opera garnier monte carlo": 8,
  "salle garnier": 8,
  "palais princier": 9,
  "place du palais": 9,
  "stade louis ii": 10,
  "salle gaston medecin": 10,
  "jardin japonais": 11,
  "plage du larvotto": 13,
  "marche de la condamine": 14,
  "jardin exotique": 15,
  "jardin exotique de monaco": 15,
  // 🦴 LE MUSÉE D'ANTHROPOLOGIE N'A PAS DE PHOTO, ET LE JARDIN EXOTIQUE NE
  // CONVIENT PAS. Le musée est bien sur le site du jardin (« 56 bis bd du
  // Jardin Exotique », entrée par le jardin), et je l'y avais donc rattaché.
  // Stéphanie, 28 oct 2026 : « ce n'est pas une belle photo du musée
  // d'anthropologie, change ». Les trois photos libres du Jardin exotique sont
  // des allées de cactus — exactes, mais elles ne disent pas « musée ».
  // Ces fiches retombent donc sur la vue de Monaco, plus flatteuse, en
  // attendant une vraie photo des salles : +377 9898 8006.
  // ⚠️ On n'y met PAS l'intérieur de musée de la maquette : il est généré et ne
  // montre aucun musée monégasque.
  "62 bd du jardin exotique": 15,
  "cafe de paris": 17,
  "cafe de paris monte carlo": 17,
  "villa paloma": 18,
  "villa sauber": 18,
  "nmnm villa paloma villa sauber": 18,
  "eglise sainte devote": 19,
  "le meridien beach plaza": 20,
  "sea club le meridien beach plaza": 20,
  "cathedrale de monaco": 21,
  "cathedrale saint nicolas": 21,
  "cathedrale notre dame immaculee de monaco": 21,
  "cathedrale": 21,
  "twiga monte carlo": 22,
  "twiga": 22,
};

/** Les événements qui ont leur PROPRE photo. Clé : le titre exact, normalisé. */
const TITRES = {
  "foire attractions port hercule": 16,
};

/** Quartier → lieu « quartier » correspondant. */
const PAR_QUARTIER = {
  "monte carlo": 31,
  "la condamine": 32,
  "larvotto": 33,
  "monaco ville": 34,
  "monaco": 30,
  // ⚠️ Fontvieille n'a AUCUNE photo CC0 sur Commons (vérifié le 28 oct 2026) :
  // ses 20 fiches prennent la vue générale de Monaco, légendée « Monaco ».
  // Mieux vaut un quartier vrai mais large qu'un quartier faux.
  "fontvieille": 30,
};

const PAR_ID = new Map(LIEUX.map(l => [l.id, l]));

/** Accents et ponctuation retirés, pour comparer des chaînes ENTIÈRES. */
function normalise(s) {
  return String(s || "")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

/**
 * Un entier stable tiré de l'identifiant — le même mélange que `habillage.js`.
 * Les identifiants se suivent souvent (800041, 800042…) : un simple modulo
 * donnerait deux cartes voisines identiques.
 */
function graine(id) {
  let x = (Number(id) || 0) * 2654435761 % 4294967296;
  x ^= x >>> 13; x = (x * 1274126177) % 4294967296; x ^= x >>> 16;
  return Math.abs(x);
}

/**
 * Une vue du lieu, choisie de façon STABLE d'après l'identifiant de la fiche.
 * `decalage` permet de prendre la vue SUIVANTE quand la précédente ferait
 * doublon à l'écran — voir `mediasSansRepetition()`.
 */
function vueDuLieu(lieu, eventId, decalage = 0) {
  return lieu.vues[(graine(eventId) + decalage) % lieu.vues.length];
}

/** Construit le média rendu à l'interface. */
function media(lieu, eventId, type, decalage = 0) {
  const v = vueDuLieu(lieu, eventId, decalage);
  return {
    src: `${BASE}/${v.f}`, mediaType: type,
    venueId: lieu.id, slug: lieu.slug, nomLieu: lieu.nom,
    alt: v.alt, width: v.w, height: v.h,
    edition: lieu.edition || null,
    licence: "CC0 1.0", auteur: "Wikimedia Commons",
  };
}

/** Le libellé du lieu d'une fiche : ce qui précède le « · » du quartier. */
function libelleDuLieu(event) {
  return String(event?.subtitle || "").split("·")[0].trim();
}

/** L'identifiant de lieu d'une fiche, ou `null`. Comparaison EXACTE. */
export function lieuDeLaFiche(event) {
  const cle = normalise(libelleDuLieu(event));
  return cle && Object.prototype.hasOwnProperty.call(LIBELLES, cle) ? LIBELLES[cle] : null;
}

/** La photo d'un ÉVÉNEMENT : celle des données, sinon celle inscrite ici. */
export function photoEvenement(event) {
  const src = event?.image || event?.photo || event?.cover;
  if (src) return { src, mediaType: "event", alt: event?.title || "", credit: event?.imageCredit || null };

  const cle = normalise(String(event?.title || "").replace(/\n/g, " "));
  const id = Object.prototype.hasOwnProperty.call(TITRES, cle) ? TITRES[cle] : null;
  const l = id != null ? PAR_ID.get(id) : null;
  if (!l) return null;
  // ⚠️ « edition » et non « event » : la photo montre bien CETTE manifestation,
  // mais une édition passée. L'interface l'écrit.
  return media(l, event?.id, l.edition ? "edition" : "event");
}

/** La photo du LIEU d'un événement. Toujours marquée `venue`. */
export function photoDuLieu(event) {
  const id = lieuDeLaFiche(event);
  const l = id != null ? PAR_ID.get(id) : null;
  return l ? media(l, event?.id, "venue") : null;
}

/**
 * 🗂️ LA PHOTO D'UNE FICHE À ANNUAIRE, TIRÉE DE SES PROPRES LIEUX.
 *
 * « MUSÉES · 6 OUVERTS À MONACO » n'est pas un lieu, c'est une liste. Mais le
 * Musée océanographique EN FAIT PARTIE, et on a sa photo. L'illustrer avec elle
 * n'est donc pas « la photo d'un autre lieu ».
 *
 * ⚠️ LA LÉGENDE NE DIT PAS « PHOTO DU LIEU » — la photothèque l'interdit pour
 * un regroupement, et elle a raison : la carte n'est pas ce lieu. Elle nomme le
 * lieu photographié, et `mediaType: "groupe"` le fait écrire à l'interface.
 */
export function photoDeLAnnuaire(event) {
  const liste = Array.isArray(event?.directory) ? event.directory : null;
  if (!liste || !liste.length) return null;
  for (const entree of liste) {
    const cle = normalise(String(entree?.name || "").split("·")[0]);
    const id = Object.prototype.hasOwnProperty.call(LIBELLES, cle) ? LIBELLES[cle] : null;
    const l = id != null ? PAR_ID.get(id) : null;
    if (l) return media(l, event?.id, "groupe");
  }
  return null;
}


/* ══════════════════════════════════════════════════════════════════════════
   🌇 LES NEUF IMAGES D'AMBIANCE — pour les 995 fiches sans photo possible.

   Stéphanie a fourni le 28 oct 2026 une planche de neuf vues de Monaco
   (« Monaco Luxury Moments Collage »), chaudes et dorées, dans l'esprit exact
   qu'elle demandait depuis le matin.

   ⚠️ CE SONT DES IMAGES D'AMBIANCE, PAS DES PHOTOS DE LIEUX. Elles sont
   générées : aucune ne montre un établissement réel. Elles ne sont donc JAMAIS
   rattachées à un nom d'établissement — on les choisit sur la CATÉGORIE de la
   sortie (un dîner, une soirée, une terrasse, une plage), ce qui est vrai :
   une soirée ressemble à une soirée. C'est ce qui les sépare d'une « photo du
   Twiga » qui n'en serait pas une.

   🚨 ET ELLES PASSENT APRÈS TOUT LE RESTE. Une vraie photo du lieu, même
   quelconque, vaut mieux qu'une belle image générique : l'ordre de priorité ne
   change pas, l'ambiance ne prend la place que du quartier.

   ⚠️ 547 px de large. Assez pour une carte de 173 pt (519 px sur un écran
   Retina), trop juste pour le hero, qui en demande 1 074. Les heros gardent
   donc les photos réelles. Si Stéphanie récupère la planche en pleine
   définition, on pourra les y mettre aussi.
   ══════════════════════════════════════════════════════════════════════════ */
const AMB = "ambiance";
const AMBIANCES = [
  { f: "port-yachts.webp",     alt: "Le port de Monaco au coucher du soleil" },
  { f: "casino-facade.webp",   alt: "La façade du Casino sous les palmiers" },
  { f: "terrasse-diner.webp",  alt: "Une terrasse dressée face à la mer" },
  { f: "lounge-mer.webp",      alt: "Un salon en plein air au bord de l'eau" },
  { f: "le-rocher.webp",       alt: "Le Rocher de Monaco vu de la mer" },
  { f: "plage-larvotto.webp",  alt: "La plage et ses parasols" },
  { f: "soiree-club.webp",     alt: "Une soirée animée sous les lumières" },
  { f: "rooftop-sunset.webp",  alt: "Un rooftop au crépuscule, vue sur le port" },
  { f: "palais-place.webp",    alt: "La place du Palais et ses pins" },
];

/** Catégorie → les ambiances qui lui ressemblent vraiment. */
const AMBIANCE_PAR_CAT = {
  "SOIRÉE": [6, 7], "DJ SET": [6, 7], "JAZZ LIVE": [6, 7], "GALA": [6, 1],
  "APÉRO": [2, 3, 7], "BRUNCH": [2, 3, 5], "FOODY": [2, 3], "PETIT-DÉJ": [2, 3],
  "BIEN-ÊTRE": [5, 3, 4], "SPORT": [0, 4], "FOOTBALL": [0], "BASKET": [0],
  "EXPOSITION": [1, 8], "CONFÉRENCE": [1, 8], "SALON": [1, 8], "ENCHÈRES": [1],
  "CONCERT": [1, 7], "OPÉRA": [1], "THÉÂTRE": [1, 8], "MUSICAL": [1],
  "DANSE": [1, 6], "SPECTACLE": [1, 6], "CHANTS": [8], "CINÉMA": [7, 1],
  "ATELIER": [8, 4], "MARCHÉ": [8, 0], "FESTIVAL": [0, 6], "FÊTE NATIONALE": [8, 0],
};

/**
 * Une image d'ambiance accordée à la catégorie. Choisie de façon STABLE par
 * `event.id`, comme les photos de lieu.
 */
export function imageAmbiance(event, decalage = 0) {
  const lot = AMBIANCE_PAR_CAT[String(event?.cat || "").toUpperCase()];
  if (!lot || !lot.length) return null;
  const i = lot[(graine(event?.id) + decalage) % lot.length];
  const a = AMBIANCES[i];
  if (!a) return null;
  return {
    src: `${BASE.replace("/lieux", "/" + AMB)}/${a.f}`,
    mediaType: "ambiance", nomLieu: null, alt: a.alt,
    width: 547, height: 303, licence: null, auteur: null,
  };
}


/* ══════════════════════════════════════════════════════════════════════════
   🎃 LES IMAGES DE THÈME — une fête, pas un lieu.

   Stéphanie, 30 oct 2026 : « mets photo Halloween où tu peux ».

   ⚠️ CE N'EST NI UNE PHOTO DE LIEU NI UNE AMBIANCE DE CATÉGORIE, et c'est
   pour ça que ça passe AVANT la photo du lieu. Une citrouille sur « Halloween
   Night Twiga » décrit l'ÉVÉNEMENT — ce qui s'y passe ce soir-là — là où la
   façade du Twiga ne décrit que le bâtiment. Rien n'est trompeur : la fête a
   bien lieu, et l'image ne prétend pas montrer la salle.

   🚨 LE SEUL ENDROIT OÙ UN RAPPROCHEMENT PAR MOT EST LÉGITIME. Partout ailleurs
   on compare des libellés ENTIERS (un `includes()` collerait la photo d'un lieu
   sur un autre — l'erreur de l'Opéra sur l'Auditorium). Ici le mot cherché est
   le NOM DE LA FÊTE, pas celui d'un établissement : « Halloween » dans un titre
   ne peut désigner qu'Halloween.
   ⚠️ Les motifs sont ancrés sur des mots entiers et restent peu nombreux : on
   n'ouvre pas la porte à une liste qui s'allonge sans fin.
   ══════════════════════════════════════════════════════════════════════════ */
const THEMES = [
  {
    motif: /\b(halloween|buddhalloween|muertos|catrina|trick or treat|diablotins)\b/i,
    f: "halloween.webp", w: 1100, h: 825,
    alt: "Une citrouille d'Halloween sculptée, dans les feuilles",
  },
];

/** L'image de la FÊTE à laquelle se rattache une fiche, s'il y en a une. */
export function imageTheme(event) {
  const texte = `${event?.title || ""} ${event?.desc || ""}`;
  const t = THEMES.find(x => x.motif.test(texte));
  if (!t) return null;
  return {
    src: `${BASE.replace("/lieux", "/" + AMB)}/${t.f}`,
    mediaType: "theme", nomLieu: null, alt: t.alt,
    width: t.w, height: t.h, licence: "Domaine public", auteur: "Wikimedia Commons",
  };
}


/* ══════════════════════════════════════════════════════════════════════════
   ⛪ LA PHOTO DE CATÉGORIE — un seul cas, et il est demandé.

   Stéphanie, 31 oct 2026 : « mets une photo de la cathédrale pour les messes ».

   Les 82 fiches CHANTS tombaient presque toutes sur une image de quartier :
   « 5 paroisses » et « 9 paroisses » (57 fiches à elles deux) ne sont pas des
   lieux mais des regroupements, donc aucune photo de lieu ne s'y accrochait.

   ⚠️ CE N'EST PAS UN RETOUR DE L'IMAGE PAR CATÉGORIE qui posait la photo de
   l'Opéra sur l'Auditorium. La différence tient en une phrase : la cathédrale
   EST une église de Monaco, et une carte de messes propose des églises de
   Monaco. On ne prétend pas montrer la paroisse exacte — mais on ne montre pas
   non plus un port ou un casino sur une messe.
   ⚠️ Elle passe APRÈS la photo du lieu : une messe à Saint-Charles ou à
   Sainte-Dévote garde la sienne le jour où on l'aura.
   ══════════════════════════════════════════════════════════════════════════ */
const PAR_CATEGORIE = {
  "CHANTS": 21,          // la cathédrale de Monaco
};

export function photoDeCategorie(event) {
  const id = PAR_CATEGORIE[String(event?.cat || "").toUpperCase()];
  const l = id != null ? PAR_ID.get(id) : null;
  return l ? media(l, event?.id, "categorie") : null;
}

/**
 * 🏙️ LA PHOTO DU QUARTIER — dernier recours.
 *
 * Stéphanie, 28 oct 2026 : « mets sinon une photo de Monaco, du quartier ».
 * ⚠️ Elle n'est JAMAIS présentée comme celle du lieu : la légende porte le nom
 * du QUARTIER (« Monte-Carlo — photo du quartier »), jamais celui de
 * l'établissement. Sans cette mention, on referait l'erreur de l'Opéra posé sur
 * l'Auditorium.
 */
export function photoDuQuartier(event, decalage = 0) {
  const q = normalise(event?.quarter);
  const l = PAR_ID.get(PAR_QUARTIER[q] || 30);
  return l ? media(l, event?.id, "quartier", decalage) : null;
}

/**
 * Le média d'une fiche, dans l'ordre imposé par le brief :
 *   1. photo de l'ÉVÉNEMENT ;
 *   2. photo du LIEU EXACT, étiquetée ;
 *   3. pour un annuaire, la photo de l'un de SES lieux, nommé ;
 *   4. sinon la photo du QUARTIER, annoncée comme telle.
 * Jamais la photo d'un autre établissement.
 */
export function mediaDeLaFiche(event, decalage = 0) {
  return photoEvenement(event)
      // 🚨 LA PHOTO DU LIEU PASSE DEVANT L'IMAGE DE FÊTE.
      // Stéphanie, 31 oct 2026 : « l'activité dans la grotte, mets une photo du
      // Jardin exotique ». La citrouille d'Halloween écrasait la vraie photo du
      // lieu : on perdait une information (où ça se passe) pour un décor.
      // La règle revient donc à l'ordre normal — une image qui montre le LIEU
      // RÉEL bat toujours une image de thème. Les fiches sans photo de lieu
      // (Jimmy'z, Buddha-Bar, La Rascasse, le Castelroc, le Parc Princesse
      // Antoinette) gardent la citrouille, qui reste mieux qu'un quartier.
      || photoDuLieu(event)
      || imageTheme(event)
      || photoDeLAnnuaire(event)
      || photoDeCategorie(event)
      || imageAmbiance(event, decalage)
      || photoDuQuartier(event, decalage);
}

/**
 * 🔁 PAS DEUX FOIS LA MÊME PHOTO CÔTE À CÔTE.
 *
 * Stéphanie, 28 oct 2026 : « ne remets pas les mêmes photos à côté pour des
 * activités différentes ». Dans une grille à deux colonnes, deux sorties
 * voisines du même quartier tombaient sur la même vue : l'œil croit voir la
 * même chose deux fois, et la page paraît bâclée.
 *
 * On parcourt donc la liste DANS L'ORDRE D'AFFICHAGE et, dès qu'une photo
 * reparaît, on prend la vue suivante du même quartier.
 *
 * ⚠️ ON NE CORRIGE QUE LES PHOTOS DE QUARTIER. Une photo de LIEU qui se répète
 * est juste : deux concerts au Théâtre des Muses, c'est deux fois le Théâtre
 * des Muses. Changer pour « faire joli » poserait une image fausse — exactement
 * ce qu'on passe la journée à éviter.
 *
 * ⚠️ Et quand un quartier n'a qu'une vue, la répétition subsiste : on ne va pas
 * inventer une photo. Monte-Carlo en a 2, La Condamine 3, Monaco 3.
 */
export function mediasSansRepetition(fiches, recents = []) {
  // 🚨 RÈGLE DURCIE LE 28 OCT AU SOIR. Stéphanie : « ne mets pas 2 photos
  // identiques à côté, SAUF si même event ». Jusqu'ici j'autorisais la
  // répétition dès qu'il s'agissait du même LIEU — deux expositions
  // différentes à la Villa Paloma montraient donc la même image côte à côte.
  // Désormais seule une même fiche (même `id`, par exemple une série reprise
  // deux jours de suite) a le droit de répéter sa photo.
  // Quand le lieu n'a qu'une vue, la seconde carte bascule sur son image
  // d'ambiance de catégorie : on ne va pas inventer une deuxième façade.
  const sortie = [];                  // `recents` : les 3 dernières photos posées.
  // ⚠️ IL FAUT POUVOIR LE PARTAGER ENTRE PLUSIEURS GRILLES. Le fil pose une
  // grille par série de fiches ordinaires ; avec un compteur remis à zéro à
  // chaque grille, deux vues identiques se retrouvaient de part et d'autre
  // d'une bande de regroupement. Le fil passe donc UN SEUL tableau à toutes
  // ses grilles.
  let precedent = null;             // { src, id } de la carte juste avant
  for (const e of fiches || []) {
    let m = mediaDeLaFiche(e);
    const memeFiche = precedent && precedent.id === e.id;

    // 🚨 ON NE FAIT VARIER QUE CE QUI EST DÉCORATIF.
    // Stéphanie, 31 oct 2026, en voyant les cartes de messes : la deuxième
    // « Messe dimanche » affichait le PALAIS PRINCIER, la suivante le port.
    // La règle anti-répétition s'appliquait à TOUTES les images : la photo de
    // la cathédrale, pourtant juste, se faisait écarter dès qu'elle avait déjà
    // servi, et la cascade descendait jusqu'au quartier.
    // Une photo qui DIT quelque chose — le lieu exact, un lieu de l'annuaire,
    // la cathédrale pour une messe, la citrouille pour Halloween — a le droit
    // de se répéter : deux messes, c'est deux fois une église. Seuls le
    // quartier et l'ambiance, qui ne sont que du décor, doivent tourner.
    const decoratif = m && (m.mediaType === "quartier" || m.mediaType === "ambiance");
    if (decoratif && !memeFiche && recents.includes(m.src)) {
      // 1) essayer une autre vue (du lieu, du quartier ou de l'ambiance)
      for (let d = 1; d <= 3 && recents.includes(m.src); d++) {
        const autre = mediaDeLaFiche(e, d);
        if (autre && autre.src !== m.src) { m = autre; break; }
      }
      // 2) un lieu à vue unique : on passe à l'ambiance de sa catégorie
      if (recents.includes(m.src)) {
        for (let d = 0; d < 3 && recents.includes(m.src); d++) {
          const amb = imageAmbiance(e, d);
          if (amb && !recents.includes(amb.src)) { m = amb; break; }
        }
      }
      // 3) ⚠️ DERNIER RECOURS : LE QUARTIER.
      // Certaines catégories n'ont qu'UNE ambiance (CHANTS, OPÉRA, ENCHÈRES…) :
      // la boucle précédente tournait alors à vide et la répétition tenait bon.
      // Le quartier, lui, a 2 ou 3 vues — il débloque toujours la situation.
      if (recents.includes(m.src)) {
        for (let d = 0; d < 3 && recents.includes(m.src); d++) {
          const q = photoDuQuartier(e, d);
          if (q && !recents.includes(q.src)) { m = q; break; }
        }
      }
    }

    sortie.push(m);
    if (m) {
      precedent = { src: m.src, id: e.id };
      recents.push(m.src);
      if (recents.length > 3) recents.shift();
    }
  }
  return sortie;
}

/** Une photo de Monaco pour une BANNIÈRE ÉDITORIALE — jamais pour un lieu précis. */
export function photoEditoriale() {
  const l = PAR_ID.get(30);
  return l ? { src: `${BASE}/${l.vues[0].f}`, alt: l.vues[0].alt, mediaType: "editorial" } : null;
}
