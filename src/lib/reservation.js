/**
 * « Réserver une place » / « Réserver une table ».
 *
 * Stéphanie, 26 oct 2026 : « fais le lien avec leur système de résa en ouvrant
 * une vue dans l'app de leur système, et mets réserver une place… une table… ».
 *
 * ⚠️ POURQUOI UNE VUE INTÉGRÉE ET PAS UN LIEN. Deux raisons, pas une.
 *   1. `target="_blank"` depuis l'app native donne un ÉCRAN NOIR sur iPhone :
 *      une fenêtre sans barre d'adresse ni retour (constaté le 7 août 2026).
 *   2. `@capacitor/browser`, qui ouvrirait proprement un SFSafariViewController,
 *      N'EST PAS installé — et un plugin natif exige une nouvelle build App
 *      Store, pas un OTA. On ne peut donc pas s'en servir aujourd'hui.
 * Reste la vue intégrée : on affiche la page de réservation DANS l'app, dans un
 * cadre qu'on contrôle, avec une croix pour revenir. C'est livrable en OTA.
 *
 * ⚠️ TOUTES LES PAGES N'ACCEPTENT PAS D'ÊTRE CADRÉES. Vérifié le 26 oct 2026 :
 *      cinemas2monaco.com   → ni X-Frame-Options ni frame-ancestors  🟢
 *      bookings.zenchef.com → idem                                   🟢
 *      sevenrooms.com       → idem                                   🟢
 *      grimaldiforum.com    → X-Frame-Options: SAMEORIGIN            🔴
 * Un cadre refusé ne lève AUCUNE erreur : il reste blanc. On ne peut donc pas
 * le détecter depuis l'app. La règle est donc : le champ `resa` n'est écrit
 * dans les données QUE pour une page vérifiée cadrable. Pas de `resa` → pas de
 * bouton, et le téléphone reste là. Mieux vaut pas de bouton qu'un cadre vide.
 */

/** Catégories où l'on réserve une TABLE, et non une place. */
const A_TABLE = new Set([
  "BRUNCH", "APÉRO", "FOODY", "PETIT-DÉJ", "SOIRÉE", "DJ SET",
]);

/**
 * Le mot exact du bouton. Une place pour un spectacle, une table pour un repas
 * — dire « réserver » tout court laisserait croire qu'on réserve à sa place.
 */
export function motDeReservation(cat, lang) {
  const table = A_TABLE.has(String(cat || "").toUpperCase());
  if (lang === "en") return table ? "Book a table" : "Book a seat";
  return table ? "Réserver une table" : "Réserver une place";
}

/** L'adresse de réservation d'une fiche ou d'une sous-fiche, s'il y en a une. */
export function lienDeReservation(objet) {
  const u = (objet && objet.resa) || "";
  return /^https:\/\//.test(u) ? u : null;
}

/**
 * 🪑 IL N'Y A QU'UN MOT, ET C'EST « RÉSERVER ».
 *
 * Stéphanie, 26 oct 2026 : « je ne veux pas "réserver sur le site" — on est
 * toujours sur leur site quand on réserve ». Elle a raison, et mon libellé
 * « Réserver sur leur site » décrivait un détail technique qui ne regarde pas
 * la personne : qu'on ouvre un formulaire SevenRooms, la page du lieu ou le
 * composeur, elle réserve une table. Le libellé ne dépend donc QUE de la
 * catégorie — voir motDeReservation() et actionDeReservation().
 *
 * `motDuSite` est conservée pour ne pas casser un import oublié, mais elle rend
 * désormais le même mot que partout ailleurs.
 */
export function motDuSite(lang, cat) {
  return motDeReservation(cat, lang);
}

/** L'adresse du site d'un lieu, quand elle a été vérifiée cadrable. */
export function lienDuSite(objet) {
  const u = (objet && objet.siteResa) || "";
  return /^https:\/\//.test(u) ? u : null;
}

/**
 * UN SEUL BOUTON, SUR TOUTES LES FICHES.
 *
 * Stéphanie, 26 oct 2026 : « au lieu du téléphone et site il faudrait en fait
 * ce bouton réserver sur toutes les fiches ».
 *
 * Le bouton dit toujours « Réserver », et fait le mieux disponible :
 *   1. un VRAI formulaire (SevenRooms, Zenchef, billetterie)  → on l'ouvre ;
 *   2. sinon le site du lieu, s'il accepte d'être affiché      → on l'ouvre ;
 *   3. sinon le téléphone                                      → on appelle.
 *
 * ⚠️ LE TÉLÉPHONE N'EST PAS UN PIS-ALLER. Pour la moitié des lieux de Monaco
 * c'est LE moyen de réserver, et c'est le seul qui marche à coup sûr. Il est
 * donc le troisième choix, jamais un échec : un bouton qui appelle vaut mieux
 * qu'un bouton absent.
 *
 * ⚠️ ET LE MOT RESTE HONNÊTE. Au cas 1 on précise « une table » ou « une
 * place » ; aux cas 2 et 3 on dit seulement « Réserver », sans promettre un
 * formulaire qu'on n'a pas.
 */
export function actionDeReservation(objet, cat, lang) {
  // 🪑 LE MÊME MOT DANS LES TROIS CAS. Stéphanie, 26 oct 2026 : « mets le même
  // bouton pour les restaus, réserver une table ».
  //
  // J'avais d'abord inventé trois libellés — « Réserver une table » pour un
  // formulaire, « Réserver » pour un site, « Réserver par téléphone » sinon —
  // par crainte de promettre une table qu'on n'ouvrirait pas. C'était une
  // prudence mal placée : APPELER UN RESTAURANT, C'EST RÉSERVER UNE TABLE, et
  // c'est même la façon dont on réserve dans la moitié des lieux de Monaco.
  // Le mot est donc juste dans les trois cas, et trois libellés différents
  // pour un même geste brouillaient la lecture.
  //
  // Le mot ne dépend plus que de la CATÉGORIE : une table pour un repas, une
  // place pour un spectacle. Seul le mode change ce qui se passe au toucher.
  const mot = motDeReservation(cat, lang);
  const form = lienDeReservation(objet);
  if (form) return { mode: "form", url: form, mot };
  const site = lienDuSite(objet);
  if (site) return { mode: "site", url: site, mot };
  const tel = (objet && (objet.tel || objet.phone)) || "";
  if (!tel) return null;

  // 🎡 ON NE RÉSERVE PAS UNE FOIRE — MAIS ON RÉSERVE PRESQUE TOUT LE RESTE.
  //
  // Stéphanie, 27 oct 2026 : « la foire, y a rien à réserver, tu as mis un
  // numéro ». Elle avait raison. Mais ma première correction renvoyait
  // « Appeler » sur TOUT ce qui n'est pas un repas — 4 466 fiches — et défaisait
  // sa demande de la veille : « met le même bouton, réserver une table ou une
  // place, et même couleur ». Deux instructions justes, une seule bonne réponse :
  // garder « Réserver » partout, et ne faire exception QUE là où il n'y a
  // vraiment rien à réserver.
  //
  // La liste est donc COURTE et explicite : une foire, un marché, une messe, un
  // feu d'artifice, une procession, une brocante. On y entre à sa guise, le
  // téléphone sert à se renseigner, pas à réserver.
  //
  // ⚠️ ON NE SE FIE PAS À `free` : les Thursday Live Sessions du Grimaldi Forum
  // sont GRATUITES SUR RÉSERVATION, 200 places. Gratuit ne veut pas dire ouvert.
  const texte = `${(objet && (objet.name || objet.title)) || ""} ${cat || ""}`
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  // ⚠️ « MARCHE » N'EST PAS « MARCHÉ ». Une fois les accents dépliés, les deux
  // s'écrivent pareil — et « Marche et sorties nature », une randonnée guidée
  // qui se réserve très bien, tombait dans l'exception. On ne cherche donc plus
  // le mot dans le texte : la CATÉGORIE tranche, elle ne confond rien.
  const SANS_RESERVATION = /\bfoire\b|\bbrocante\b|\bmesse\b|feu d.artifice|procession|vide.grenier/;
  const CAT_OUVERTE = new Set(["MARCHÉ", "CHANTS", "FÊTE NATIONALE"]);
  if (SANS_RESERVATION.test(texte) || CAT_OUVERTE.has(String(cat || "").toUpperCase()))
    return { mode: "tel", tel: String(tel).replace(/[\s()]/g, ""),
             mot: lang === "en" ? "Call" : "Appeler" };

  // Partout ailleurs : le même mot, la même couleur, comme demandé.
  return { mode: "tel", tel: String(tel).replace(/[\s()]/g, ""), mot };
}
