/**
 * 🌤️ RETOUCHE DU CIEL — les photos de quartier et d'ambiance.
 *
 * Stéphanie, 28 oct 2026 : « retouche-les avec ciel bleu ».
 *
 * ⚠️ ON NE FABRIQUE PAS DE CIEL. Le brief V6 est formel : « ne jamais modifier
 * les bâtiments ni fabriquer de ciel ». Ce script ne colle aucune image : il
 * RAVIVE le bleu déjà présent. Un pixel n'est retouché que s'il est
 *   · dans le tiers supérieur de l'image,
 *   · clair (un ciel est lumineux),
 *   · et déjà plus bleu que rouge.
 * Un toit ocre, un mur crème ou un palmier ne remplissent jamais ces trois
 * conditions : ils ressortent inchangés.
 *
 * ⚠️ ET LE DÉGRADÉ EST PROGRESSIF du haut vers le bas, sinon on voit une ligne
 * nette au milieu de l'image — le défaut classique de ce genre de retouche.
 *
 * Les originaux ne sont jamais écrasés : ils sont copiés dans
 * `public/media/_originaux/` au premier passage, pour pouvoir tout refaire.
 */
