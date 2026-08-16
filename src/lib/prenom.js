/**
 * MonacOut — DEVINER LE PRÉNOM À PARTIR DE L'ADRESSE E-MAIL
 *
 * Sert à PRÉ-REMPLIR le dernier écran de l'inscription. Au 16 août 2026, 8 personnes
 * sur 50 recevaient leur code, le saisissaient, se connectaient — puis fermaient
 * « Comment tu t'appelles ? » sans répondre. Elles gardaient un compte inutilisable :
 * sans prénom, elles n'existent pour aucune amie.
 *
 * ✅ ÉPROUVÉ SUR LES VRAIES ADRESSES des 8 personnes concernées, avec Stéphanie qui
 * les connaît personnellement (16 août 2026) : les suggestions étaient **justes**.
 * L'adresse porte bien le prénom dans l'immense majorité des cas.
 *
 * ⚠️ Elle reste une SUGGESTION, jamais une décision : la mention « Deviné d'après ton
 * adresse — corrige si besoin » est affichée sous le champ, et la saisie prend la main
 * dès le premier caractère tapé. Une orthographe approximative dans une adresse
 * (« sandrine » pour Sandryne) doit pouvoir se corriger sans lutter.
 *
 * En cas de doute, on ne propose RIEN : un champ vide se remplit, alors qu'un
 * « Rfrealltor » doit d'abord être effacé — ça ajoute du travail au lieu d'en retirer.
 *
 * ⚠️ Ce fichier est séparé d'AuthScreen.jsx exprès : un fichier de composant qui
 * exporte aussi des fonctions casse le rafraîchissement à chaud (react-refresh).
 */

// Boîtes de service : ce ne sont jamais des prénoms.
const GENERIQUES = new Set([
  'contact', 'info', 'infos', 'hello', 'bonjour', 'admin', 'mail', 'email',
  'moi', 'me', 'perso', 'pro', 'noreply', 'newsletter', 'famille', 'home', 'agence',
])

// Prénoms courants à Monaco et alentour (FR, IT, EN). Sert UNIQUEMENT à découper une
// adresse qui colle prénom et nom : « giuliarossi » → « Giulia ». Liste volontairement
// courte : hors liste, on ne propose rien plutôt qu'un mauvais prénom.
const PRENOMS = ('alessandra alessandro alexandra alexandre alice amelie andrea anne antoine antonio arnaud aurelie '
  + 'baptiste beatrice benjamin bernard bruno camille carla caroline catherine cecile charlotte chiara '
  + 'christian christine christophe claire claude claudia clara daniel david delphine diego dominique '
  + 'edouard elena elisa elisabeth emilie emma eric estelle fabien fabio federico florence francesca '
  + 'francesco francois frederic gabriel geraldine giovanni giulia guillaume helene henri isabelle jacques '
  + 'jean jerome julie julien juliette laetitia laetizia laura laurent lea leonardo letizia lorenzo louis '
  + 'luca lucie ludovic manon marc marco margaux maria marie marina mathieu matteo maxime michel michele '
  + 'nathalie nicolas nicole olivia olivier pascal patricia patrick paul philippe pierre quentin raphael '
  + 'rebecca remi richard robert roberto romain sabrina sandra sandrine sarah sebastien serge silvia simon '
  + 'sophie stephane stephanie sylvie thomas valentina valeria valerie veronique victor vincent virginie yves').split(' ')

/**
 * @param {string} email
 * @returns {string} un prénom plausible, ou '' si rien de sûr
 */
export function prenomDepuisEmail(email) {
  const local = String(email || '').split('@')[0].split('+')[0].toLowerCase()
  // Premier morceau avant un séparateur : « marie.dupont » → « marie »
  let brut = local.split(/[._\-0-9]+/).filter(Boolean)[0] || ''
  if (!/^[a-zà-öø-ÿ]+$/i.test(brut)) return ''
  if (GENERIQUES.has(brut)) return ''

  // Adresse collée (« giuliarossi ») : on ne garde que le prénom reconnu au début.
  // On teste du plus long au plus court, sinon « marc » gagnerait sur « marco ».
  if (brut.length >= 8 && !PRENOMS.includes(brut)) {
    const trouve = PRENOMS.filter(p => brut.startsWith(p)).sort((a, b) => b.length - a.length)[0]
    if (!trouve) return ''       // nom inconnu collé : on préfère ne rien proposer
    brut = trouve
  }
  // Ni initiales (« jd ») ni chaîne interminable.
  if (brut.length < 3 || brut.length > 12) return ''
  return brut[0].toUpperCase() + brut.slice(1)
}
