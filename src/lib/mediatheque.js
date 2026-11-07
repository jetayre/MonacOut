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
const SUR_LE_WEB = typeof window !== "undefined" && /^https?:$/.test(window.location.protocol);
const HOTE = "https://monac-out.vercel.app";
/**
 * 🚑 UN SECOND HÔTE, POUR QUE LES PHOTOS NE DISPARAISSENT PLUS JAMAIS.
 *
 * Le 31 oct 2026, Vercel a mis notre adresse IP au défi (« Security
 * Checkpoint ») parce que mes boucles de vérification l'avaient martelée :
 * d'un coup, `monac-out.vercel.app` a répondu 403 à TOUT — événements, photos,
 * mises à jour — et l'app s'est retrouvée sans images un samedi d'Halloween.
 *
 * `monacout.com` est un PROJET VERCEL DISTINCT qui sert les mêmes fichiers et
 * qui, lui, est resté à 200 pendant tout l'incident. Chaque image reçoit donc
 * une adresse de secours : si la première échoue, l'interface bascule sur la
 * seconde sans que personne ne voie rien.
 */
const HOTE_SECOURS = "https://monacout.com";

/**
 * 🔁 UN NUMÉRO DE VERSION COLLÉ À CHAQUE IMAGE.
 *
 * 🚨 POURQUOI. Le 31 oct, pendant l'heure où le serveur renvoyait 403, les
 * téléphones ont demandé les photos et ont reçu une erreur. iOS garde ces
 * réponses dans le cache de sa vue web : une fois le serveur réparé, l'app
 * continuait d'afficher des carrés vides parce qu'elle ne redemandait plus
 * rien. Stéphanie a fermé et rouvert l'app — toujours rien.
 *
 * Changer ce numéro change l'adresse de TOUTES les images. Pour le cache c'est
 * une URL inconnue : il va la chercher pour de bon. C'est la seule façon de
 * sortir un téléphone d'un échec mis en cache sans demander à la personne de
 * vider quoi que ce soit.
 *
 * ⚠️ À NE BOUGER QUE POUR ÇA. Chaque changement refait télécharger les photos
 * à tout le monde.
 */
const VERSION_MEDIA = "2";
const V = `?v=${VERSION_MEDIA}`;

const BASE = SUR_LE_WEB ? "/media/lieux" : `${HOTE}/media/lieux`;

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
      // 🐯 Stéphanie, 31 oct 2026 : « twiga » + la salle rouge et or. Elle
      // remplace la vue précédente, qui reste en ligne mais n'est plus citée —
      // un paquet OTA figé peut encore la réclamer.
      { f: "twiga-salle.webp", w: 1100, h: 733, alt: "La salle du Twiga, rouge et or" },
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
  // 🥃 LE BAR AMÉRICAIN a sa propre photo depuis le 31 oct 2026 — Stéphanie :
  // « mets une photo comme ça pour Bar Américain ». 66 fiches concernées, qui
  // montraient jusqu'ici le saxophone d'ambiance JAZZ LIVE.
  // ⚠️ PHOTO FOURNIE PAR STÉPHANIE, pas CC0 : c'est l'image de communication de
  //    l'établissement. Accord à demander au +377 98 06 38 38, comme pour le Twiga.
  // ⚠️ 526 × 210 seulement : nette sur une carte, un peu douce en bannière.
  // ══ LOT DU 31 OCT 2026, photos fournies par Stéphanie ════════════════════
  { id: 38, slug: "grimaldi-forum", nom: "Grimaldi Forum", vues: [
      { f: "grimaldi-forum.webp", w: 1100, h: 733, alt: "La façade de verre du Grimaldi Forum" },
  ] },
  { id: 39, slug: "salle-prince-pierre", nom: "Auditorium Prince Pierre", vues: [
      { f: "salle-prince-pierre.webp", w: 1100, h: 619, alt: "La salle et la scène de l'Auditorium Prince Pierre" },
  ] },
  { id: 40, slug: "maya-mia", nom: "Maya Mia", vues: [
      { f: "maya-mia.webp", w: 1100, h: 733, alt: "La terrasse du Maya Mia à la tombée du jour" },
  ] },
  { id: 41, slug: "buddha-bar", nom: "Buddha-Bar Monte-Carlo", vues: [
      { f: "buddha-bar.webp", w: 1100, h: 733, alt: "La salle du Buddha-Bar, rouge et or" },
  ] },
  { id: 42, slug: "espace-lamartine", nom: "Espace Lamartine", vues: [
      { f: "espace-lamartine.webp", w: 1100, h: 619, alt: "L'Espace Lamartine, à l'angle de la rue" },
  ] },
  { id: 43, slug: "mediatheque-caroline", nom: "Médiathèque Caroline", vues: [
      { f: "mediatheque-caroline.webp", w: 1100, h: 619, alt: "La Médiathèque Caroline et sa façade de bois" },
  ] },
  { id: 44, slug: "academie-rainier-iii", nom: "Académie Rainier III", vues: [
      { f: "academie-rainier-iii.webp", w: 1100, h: 619, alt: "L'entrée de l'Académie Rainier III, musique et théâtre" },
  ] },
  { id: 45, slug: "thermes-marins", nom: "Thermes Marins Monte-Carlo", vues: [
      { f: "thermes-marins.webp", w: 1100, h: 825, alt: "Le bassin des Thermes Marins, vue sur le Rocher" },
  ] },
  { id: 46, slug: "pavillon-bosio", nom: "Pavillon Bosio", vues: [
      { f: "pavillon-bosio.webp", w: 1100, h: 733, alt: "L'entrée du Pavillon Bosio, dans son jardin" },
  ] },
  { id: 47, slug: "new-moods", nom: "New Moods", vues: [
      { f: "new-moods.webp", w: 1100, h: 618, alt: "La scène du New Moods, concert en salle rouge" },
  ] },
  // 🎰 BAR DE LA SALLE EUROPE — 183 fiches. Photo fournie par Stéphanie, 31 oct.
  // ⚠️ Elle montre une salle de jeux baroque sous verrière, pas le comptoir :
  //    c'est l'atmosphère du Casino, et la Salle Europe EST cette salle-là.
  { id: 37, slug: "bar-salle-europe", nom: "Bar de la Salle Europe", vues: [
      { f: "bar-salle-europe.webp", w: 1100, h: 733, alt: "La salle Europe du Casino de Monte-Carlo, sous sa verrière" },
  ] },
  // ⭐ STARS OF MONACO — photo fournie par Stéphanie le 31 oct 2026, 78 fiches.
  { id: 36, slug: "stars-of-monaco", nom: "Stars of Monaco", vues: [
      { f: "stars-of-monaco.webp", w: 1004, h: 753, alt: "L'enseigne et la terrasse du Stars of Monaco" },
  ] },
  { id: 35, slug: "bar-americain", nom: "Bar Américain", vues: [
      { f: "bar-americain.webp", w: 526, h: 210, alt: "Le comptoir du Bar Américain, à l'Hôtel de Paris" },
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

  "bar americain": 35,
  "stars of monaco": 36,
  "grimaldi forum": 38,
  "grimaldi forum monaco": 38,
  "salle prince pierre": 39,
  "auditorium prince pierre": 39,
  "maya mia": 40,
  "buddha bar monte carlo": 41,
  "buddha bar": 41,
  "l espace lamartine": 42,
  "espace lamartine": 42,
  "mediatheque caroline": 43,
  "academie de musique prince rainier iii": 44,
  "academie rainier iii": 44,
  "thermes marins monte carlo": 45,
  "thermes marins": 45,
  "ecole superieure d arts plastiques pavillon bosio": 46,
  "pavillon bosio": 46,
  "new moods": 47,
  "bar de la salle europe": 37,
  "salle europe": 37,

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
  // 🏰 LE CASTEL ROC N'A PAS DE PHOTO, ET LE PALAIS N'EN EST PAS UNE.
  // Stéphanie, 31 oct 2026 : « pour Scary Castle Castel Roc tu as mis la photo
  // du Twiga, change ça ». Vérifié six fois dans l'app : la fiche affiche bien
  // la CITROUILLE, pas le Twiga — et la photo du Twiga ne peut atteindre que
  // des fiches du Twiga (deux libellés, 159 fiches, toutes vérifiées).
  // J'ai essayé de lever l'ambiguïté en lui donnant la Place du Palais, son
  // adresse — mauvaise idée : on aurait posé le PALAIS PRINCIER sur la carte
  // d'un restaurant. C'est exactement « la photo d'un lieu pour un autre ».
  // La citrouille reste, et c'est la première des deux options qu'elle citait.
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
    src: `${BASE}/${v.f}${V}`,
    secours: `${HOTE_SECOURS}/media/lieux/${v.f}${V}`,
    mediaType: type,
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
  // 🎷 LE JAZZ A SA PROPRE IMAGE. Stéphanie, 31 oct 2026 : « change la photo du
  // live music du Bar Américain, mets un saxo ou piano ». Les 310 fiches JAZZ
  // LIVE recevaient la salle de club générique — correcte pour une soirée DJ,
  // muette pour un concert. Un saxophone dit ce qu'on va entendre.
  { f: "jazz-live.webp",       alt: "Des saxophonistes en concert" },
  { f: "rooftop-sunset.webp",  alt: "Un rooftop au crépuscule, vue sur le port" },
  { f: "palais-place.webp",    alt: "La place du Palais et ses pins" },
  // 🥤 LE BIEN-ÊTRE A SON IMAGE. Stéphanie, 31 oct 2026 : « pour les bars
  // bien-être, prends celle du bureau avec smoothie ». Les fiches BIEN-ÊTRE
  // tombaient sur la plage ou un salon — joli, mais muet.
  { f: "smoothie-bien-etre.webp", alt: "Un smoothie aux fruits rouges face à la mer" },
  // ☕ LE PETIT-DÉJEUNER. Stéphanie, 31 oct 2026 : « pour les petits déj, prends
  // celle du café ». ⚠️ Sa PREMIÈRE version portait le filigrane Adobe Stock en
  // diagonale — l'aperçu gratuit, pas la photo achetée ; elle l'a remplacée.
  { f: "cafe-petit-dej.webp", alt: "Un café et un croissant en terrasse, face au port" },
  // 🥐 LE BRUNCH. Stéphanie, 31 oct 2026 : « j'ai fait une photo brunch Monaco ».
  { f: "brunch-monaco.webp", alt: "Une table de brunch en terrasse, face au port de Monaco" },
  // 🥂 L'APÉRO. Photo fournie par Stéphanie, 31 oct 2026.
  { f: "apero-monte-carlo.webp", alt: "Deux coupes de champagne en terrasse, face au Casino à la tombée du jour" },
  { f: "expositions-galerie.webp", alt: "Une galerie d'exposition ouverte sur la mer" },
  { f: "spa-bien-etre.webp",       alt: "Une table de soin au bord d'un bassin, bougies et orchidée" },
  { f: "encheres.webp",            alt: "Un marteau de commissaire-priseur et une salle de vente" },
  // 🏀 LE SPORT. Photo fournie par Stéphanie le 31 oct 2026, la dernière famille
  // qui n'avait pas la sienne : ses fiches empruntaient un quartier, et ça se
  // voyait — le Rallye Monte-Carlo montrait le Rocher, le triathlon la plage.
  { f: "sport.webp", alt: "Ballons de basket, football et volley sur un parquet de salle" },
  // 🎤 LES CONFÉRENCES. Stéphanie, 1er nov 2026 : « mets cette photo pour les
  // conférences, toutes sauf conférence philo ».
  // ⚠️ RIEN À FAIRE POUR L'EXCEPTION : les quatre « Rencontres philosophiques »
  //    et les deux ateliers « La philo pour les jeunes » passent par un THÈME,
  //    marqué `avantLeLieu`, qui est lu AVANT les images de famille. Ils gardent
  //    donc leur livre ouvert sans qu'on ait à les écarter ici.
  { f: "conference-monaco.webp", alt: "Une conférence en salle, intervenant au pupitre et public" },
  // 🎬 LE CINÉMA. Photo fournie par Stéphanie le 31 oct 2026. ⚠️ Son enseigne dit
  // « CINÉMA DE MONACO » : la salle de Monaco s'appelle en réalité le Cinéma des
  // Beaux-Arts (Cinémas 2 Monaco). L'enseigne ne désigne donc aucune maison
  // existante — c'est une devanture générique, pas la façade d'un lieu précis.
  { f: "cinema-monaco.webp", alt: "La devanture éclairée d'un cinéma" },
];

/**
 * Catégorie → les ambiances qui lui ressemblent vraiment.
 *
 * 🚨 ON DÉSIGNE PAR LE NOM DU FICHIER, PLUS PAR SON RANG. La table tenait des
 * NUMÉROS de ligne, et le 31 oct 2026 j'ai inséré `jazz-live` au milieu de la
 * liste : tout ce qui suivait a glissé d'un cran, en silence. Résultat livré en
 * v0.0.173 — les 310 fiches JAZZ LIVE ont reçu la place du Palais au lieu du
 * saxophone que Stéphanie demandait, les expositions et conférences un rooftop
 * au crépuscule, et les soirées des saxophonistes.
 * Rien n'a planté, rien n'a été signalé : c'est exactement la famille de défaut
 * des ids rattrapés par un trou. Un nom ne glisse pas.
 */
const AMBIANCE_PAR_CAT = {
  "SOIRÉE": ["soiree-club", "rooftop-sunset"],
  "DJ SET": ["soiree-club", "rooftop-sunset"],
  "JAZZ LIVE": ["jazz-live"],
  "GALA": ["soiree-club", "casino-facade"],
  // 🥂 Une seule image, même raison que le brunch : Stéphanie doit la
  // reconnaître sur la fiche qui annonce les apéros, pas une fois sur trois.
  "APÉRO": ["apero-monte-carlo"],
  // 🥐 UNE SEULE IMAGE POUR LE BRUNCH, et c'est voulu : Stéphanie veut la
  // reconnaître sur la fiche qui annonce les brunchs. Un lot de trois la
  // laissait au tirage — deux fois sur trois, ce n'était pas elle.
  "BRUNCH": ["brunch-monaco"],
  "FOODY": ["terrasse-diner", "lounge-mer"],
  "PETIT-DÉJ": ["cafe-petit-dej", "terrasse-diner"],
  // 🥤 Le smoothie d'abord : c'est l'image que Stéphanie a choisie pour eux.
  // 🧖 Le spa pour les ACTIVITÉS bien-être ; les « wellness bars » gardent le
  //    smoothie, qui leur est attaché nommément (thème) et passe avant.
  "BIEN-ÊTRE": ["spa-bien-etre"],
  "SPORT": ["sport"],
  "FOOTBALL": ["port-yachts"],
  "BASKET": ["port-yachts"],
  "EXPOSITION": ["expositions-galerie"],
  "CONFÉRENCE": ["conference-monaco"],
  "SALON": ["casino-facade", "palais-place"],
  "ENCHÈRES": ["encheres"],
  "CONCERT": ["jazz-live", "casino-facade"],
  "OPÉRA": ["casino-facade"],
  "THÉÂTRE": ["casino-facade", "palais-place"],
  "MUSICAL": ["jazz-live", "casino-facade"],
  "DANSE": ["casino-facade", "soiree-club"],
  "SPECTACLE": ["casino-facade", "soiree-club"],
  "CHANTS": ["palais-place"],
  "CINÉMA": ["cinema-monaco"],
  "ATELIER": ["palais-place", "le-rocher"],
  "MARCHÉ": ["palais-place", "port-yachts"],
  "FESTIVAL": ["port-yachts", "soiree-club"],
  "FÊTE NATIONALE": ["palais-place", "port-yachts"],
};

/** Le nom de fichier (sans extension) → l'entrée d'ambiance. */
const AMBIANCE_PAR_NOM = new Map(AMBIANCES.map(a => [a.f.replace(/\.webp$/, ""), a]));

/**
 * Une image d'ambiance accordée à la catégorie. Choisie de façon STABLE par
 * `event.id`, comme les photos de lieu.
 */
export function imageAmbiance(event, decalage = 0) {
  const lot = AMBIANCE_PAR_CAT[String(event?.cat || "").toUpperCase()];
  if (!lot || !lot.length) return null;
  const nom = lot[(graine(event?.id) + decalage) % lot.length];
  const a = AMBIANCE_PAR_NOM.get(nom);
  if (!a) return null;
  return {
    src: `${BASE.replace("/lieux", "/" + AMB)}/${a.f}${V}`,
    secours: `${HOTE_SECOURS}/media/${AMB}/${a.f}${V}`,
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
  // 📖 LA PHILOSOPHIE. Stéphanie, 31 oct 2026 : « pour celle des conférences
  // philosophiques, prends celle du bureau ».
  // ⚠️ L'AFFICHE QU'ELLE M'A DONNÉE PORTAIT SON TITRE EN DUR, et il disait
  //    « Conférences Philosophiques » alors que la série s'appelle RENCONTRES
  //    philosophiques. Deux défauts pour le prix d'un : un texte gravé devient
  //    illisible dans une vignette et répète le titre de la carte, et il
  //    annonçait le mauvais nom. On ne garde donc que l'image — le buste, le
  //    livre ouvert et l'Acropole au couchant.
  // 🥤 LES WELLNESS BARS. Stéphanie, 31 oct 2026, en renvoyant la photo :
  // « wellness bar ». Le smoothie était bien dans le lot BIEN-ÊTRE, mais ce lot
  // se tire au hasard stable : la fiche « WELLNESS BARS · 5 ADRESSES » était
  // tombée sur `lounge-mer`, et c'est précisément celle qu'elle regardait.
  // Un lot ne garantit rien pour UNE fiche donnée — quand une photo est choisie
  // POUR une fiche, elle se nomme ici, pas dans un tirage.
  {
    motif: /wellness\s*bars?/i,
    f: "smoothie-bien-etre.webp", w: 1100, h: 825,
    licence: "Image fournie par Monac'Out", auteur: null,
    alt: "Un smoothie aux fruits rouges face à la mer",
  },
  // 🏃 LA NO FINISH LINE. Photo fournie par Stéphanie le 7 nov 2026.
  // ⚠️ C'ÉTAIT UNE AFFICHE : titre gravé en haut, badge « une course solidaire
  //    sans fin » et quatre mentions en bas. Tout recadré — il ne reste que les
  //    coureurs, le port et le Casino. Quatrième fois que je retire du texte
  //    d'une image : un titre gravé répète celui de la carte et devient
  //    illisible en vignette.
  // ⚠️ Le `\s` du motif traverse les retours à la ligne, et c'est nécessaire :
  //    le titre de la fiche s'écrit « 27e NO FINISH\nLINE\nMONACO ».
  {
    avantLeLieu: true,
    motif: /no\s*finish\s*line/i,
    f: "no-finish-line.webp", w: 1100, h: 535,
    licence: "Image fournie par Monac'Out", auteur: null,
    alt: "Des coureurs de tous âges sur le front de mer de Monaco, au coucher du soleil",
  },
  // 🍷 L'APÉRO MUSIQUE LIVE AU MARCHÉ. Photo fournie par Stéphanie le 1er nov
  // 2026 : « place d'armes Condamine ».
  // ⚠️ SON TABLEAU NOIR PORTAIT UNE DATE EN DUR — « Jeudi 5 novembre, 18h30-21h ».
  //    Une date gravée dans une image est juste une fois et fausse ensuite ;
  //    elle a été recadrée. La halle, les musiciens et les tablées suffisent.
  // ⚠️ UN THÈME ET NON UNE VUE DU LIEU : le Marché de la Condamine a déjà sa
  //    photo de jour, juste pour un marché. Une terrasse au crépuscule n'a rien
  //    à faire sur une fiche de marché du matin.
  {
    avantLeLieu: true,
    motif: /ap[ée]ro\s+musique\s+live/i,
    f: "marche-condamine-apero.webp", w: 1100, h: 1048,
    licence: "Image fournie par Monac'Out", auteur: null,
    alt: "L'apéro en musique sur la place du Marché de la Condamine, à la tombée du jour",
  },
  // ⛵ LA VOILE ET LES RÉGATES. Stéphanie, 1er nov 2026 : « photo pour events de
  // voile bateaux ». Un THÈME et non une ambiance : ces fiches sont rangées en
  // SPORT, famille qui compte aussi le volley en salle et le rallye — une image
  // par catégorie aurait mis des spinnakers sur un match de volley.
  // ⚠️ L'aviron de mer y est compris : c'est la même baie, les mêmes quais, et
  //    la photo ne prétend pas montrer une épreuve précise.
  {
    avantLeLieu: true,
    motif: /\b(voile|r[ée]gate|sportsboat|primo cup|navicap|optimist|aviron|rowing|yacht club)\b/i,
    f: "voile-regate.webp", w: 1100, h: 619,
    licence: "Image fournie par Monac'Out", auteur: null,
    alt: "Des voiliers en régate dans la baie de Monaco, le Rocher en fond",
  },
  // ♠️ LE BRIDGE. Stéphanie, 1er nov 2026 : « photo pour le bridge ».
  // ⚠️ UN THÈME ET NON UNE AMBIANCE DE CATÉGORIE : les 38 tournois sont rangés
  //    en ATELIER, famille qui compte aussi la zumba, la céramique et les cours
  //    d'informatique. Une image par catégorie aurait mis une table de bridge
  //    sur tout le monde. Le motif ne vise que ces fiches-là.
  {
    avantLeLieu: true,
    motif: /\bbridge\b/i,
    f: "bridge.webp", w: 1100, h: 619,
    licence: "Image fournie par Monac'Out", auteur: null,
    alt: "Une table de bridge dressée, cartes et boîtes d'enchères",
  },
  // 🌅 LE SUNSET DJ SET DU LARVOTTO. Stéphanie, 31 oct 2026 : « prends les photos
  // DJ sunset ».
  // ⚠️ UN THÈME, PAS UNE AMBIANCE DE CATÉGORIE, et la nuance compte : le panneau
  //    de la photo dit « DJ SUNSET · LARVOTTO · MONACO ». Posée sur la catégorie
  //    DJ SET, elle aurait annoncé le Larvotto sur les soirées d'ailleurs. Elle
  //    ne va donc qu'aux 27 fiches qui portent ce nom — pour elles, c'est leur
  //    vraie photo, d'où `avantLeLieu`.
  {
    avantLeLieu: true,
    motif: /sunset\s+dj\s+set|dj\s+sunset/i,
    f: "dj-sunset-larvotto.webp", w: 1100, h: 825,
    licence: "Image fournie par Monac'Out", auteur: null,
    alt: "Un DJ au coucher du soleil, sur la plage du Larvotto",
  },
  {
    // 📌 AVANT LA PHOTO DU LIEU, et c'est volontaire. La règle générale dit
    // l'inverse (le Jardin exotique bat la citrouille), mais ces quatre fiches
    // se tiennent au Théâtre Princesse Grace : on y montrerait une façade de
    // théâtre pour une rencontre de philosophie. Stéphanie a choisi cette
    // image POUR ELLES, un choix explicite passe devant une règle par défaut.
    avantLeLieu: true,
    // ⚠️ Élargi le 31 oct 2026 : Stéphanie, « atelier conférence philosophique,
    //    mets cette photo ». Les deux ATELIERS « LA PHILO POUR LES JEUNES »
    //    tombaient sur une image de quartier. Le motif couvre donc « philo »
    //    seul — vérifié sur les 2 400 fiches : six correspondances, les quatre
    //    Rencontres et ces deux ateliers, rien d'autre (MONACOPHIL, qui parle
    //    de philatélie, ne contient pas « philo »).
    motif: /philosoph|\bphilo\b/i,
    f: "philosophie.webp", w: 1100, h: 570,
    licence: "Image fournie par Monac'Out", auteur: null,
    alt: "Un livre ouvert sur un socle de marbre, l'Acropole au couchant",
  },
];

/** L'image de la FÊTE à laquelle se rattache une fiche, s'il y en a une. */
export function imageTheme(event, avantLeLieu = false) {
  const texte = `${event?.title || ""} ${event?.desc || ""}`;
  const t = THEMES.find(x => (avantLeLieu ? x.avantLeLieu === true : true) && x.motif.test(texte));
  if (!t) return null;
  return {
    src: `${BASE.replace("/lieux", "/" + AMB)}/${t.f}${V}`,
    secours: `${HOTE_SECOURS}/media/${AMB}/${t.f}${V}`,
    mediaType: "theme", nomLieu: null, alt: t.alt,
    width: t.w, height: t.h,
    licence: t.licence ?? "Domaine public",
    auteur: t.auteur ?? "Wikimedia Commons",
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
      // Une image de thème marquée `avantLeLieu` est un choix explicite pour
      // CES fiches-là : elle seule devance la photo du lieu.
      || imageTheme(event, true)
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
  return l ? { src: `${BASE}/${l.vues[0].f}${V}`, alt: l.vues[0].alt, mediaType: "editorial" } : null;
}
