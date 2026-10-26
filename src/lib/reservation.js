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
 * À DÉFAUT DE FORMULAIRE, LEUR SITE. Stéphanie, 26 oct 2026 : « pour apéro et
 * soirées on peut mettre le bouton je réserve ? il mène au site du restau ou
 * syst de résa ».
 *
 * ⚠️ LE MOT DOIT DIRE CE QU'IL FAIT. Un bouton « Réserver une table » qui ouvre
 * la PAGE D'ACCUEIL d'un restaurant ment : on tombe sur une présentation, pas
 * sur un formulaire. D'où deux boutons distincts — « Réserver une table » pour
 * un vrai système (SevenRooms, Zenchef), « Réserver sur leur site » pour un
 * simple site, où l'on trouvera leur propre bouton ou leur numéro. Le second
 * est volontairement plus sobre : il promet moins.
 *
 * Mesuré le 26 oct 2026 : 17 sites de lieu sur 42 acceptent le cadre. Les 24
 * autres le refusent — dont TOUS les établissements SBM, qui répondent
 * SAMEORIGIN — et n'ont donc aucun bouton : leur téléphone reste.
 */
export function motDuSite(lang) {
  return lang === "en" ? "Book on their site" : "Réserver sur leur site";
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
  const form = lienDeReservation(objet);
  if (form) return { mode: "form", url: form, mot: motDeReservation(cat, lang) };
  const site = lienDuSite(objet);
  if (site) return { mode: "site", url: site, mot: lang === "en" ? "Book" : "Réserver" };
  const tel = (objet && (objet.tel || objet.phone)) || "";
  if (tel) return { mode: "tel", tel: String(tel).replace(/[\s()]/g, ""),
                    mot: lang === "en" ? "Book by phone" : "Réserver par téléphone" };
  return null;
}
