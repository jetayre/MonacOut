/**
 * MONAC'OUT — LES JETONS DE LA REFONTE (28 oct 2026)
 *
 * Refonte demandée par Stéphanie à partir du kit `MONACOUT_KIT_CLAUDE_CODE` :
 * « une application lifestyle premium, élégante, moderne, fluide ». Les valeurs
 * ci-dessous viennent du brief ; ce fichier les rassemble en un seul endroit
 * pour qu'on n'ait plus jamais à les écrire en dur dans un composant.
 *
 * ⚠️ CE QUI A ÉTÉ DÉCIDÉ, ET PAR QUI. J'ai signalé trois conflits avant de
 * coder ; Stéphanie a tranché les trois le 28 oct :
 *   1. LES CADRES COLORÉS PAR CATÉGORIE SONT SUPPRIMÉS. Ils dataient de la
 *      veille (28 couleurs, trois itérations) mais le brief demande des cartes
 *      sans encadrement épais. La couleur de catégorie survit dans la PASTILLE
 *      de catégorie, pas dans le cadre — couleurs.js reste donc en place et
 *      sert toujours, en plus petit.
 *   2. LES PHOTOS D'AMBIANCE NE VONT QU'EN BANDEAU D'ACCUEIL. Les données ne
 *      contiennent AUCUNE photo d'événement — 2 399 fiches, zéro champ image —
 *      et le kit interdit de faire passer une image d'ambiance pour la photo
 *      d'un événement. Les fiches gardent donc leur dégradé et leur emoji.
 *   3. L'OR DU KIT EST UTILISÉ TEL QUEL, sur décision explicite de Stéphanie,
 *      après que je lui ai montré les chiffres : #B89C68 donne 2,48:1 sur le
 *      crème, soit MOINS que l'or retiré le 10 octobre (3,45:1) et sous la
 *      norme de 4,5:1. Il est donc réservé aux petits libellés de catégorie et
 *      aux filets décoratifs — comme dans la maquette — et ne porte JAMAIS une
 *      information qu'il faut pouvoir lire (heure, lieu, prix, bouton).
 */

// ── Couleurs ────────────────────────────────────────────────────────────────
//
// 🎨 DIRECTION ARTISTIQUE V6 — « CHIC, CHAUDE, NATURELLE ET PREMIUM »,
// validée par Stéphanie le 28 oct 2026 au soir. Les cinq valeurs sont les
// siennes, reprises exactement. Contrastes MESURÉS sur l'ivoire #FAF6F0 :
//
//   Bleu nuit       #14243A  14,52:1 ✓
//   Bordeaux chaud  #87372F   7,45:1 ✓   (blanc dessus : 8,02:1 ✓)
//   Surface         #FFFCF8        —     les cartes
//   Champagne       #C7A575   2,15:1 ⚠️  DÉCOR SEULEMENT
//
// ⚠️ Le champagne reste sous la norme : filets et libellés décoratifs, jamais
// une heure, un lieu, un prix ou un bouton. Même règle que l'or retiré le
// 10 octobre, et que le #C5A77A de la charte du matin.
//
// 🎨 LA CHARTE DE STÉPHANIE, 28 oct 2026 — « les codes couleurs exacts à
// respecter ». Les valeurs ci-dessous sont les SIENNES, reprises telles quelles.
// Contrastes mesurés sur l'ivoire #FAF7F2 (et non estimés) :
//
//   Bleu nuit  #15263B  14,32:1 ✓   titres et textes forts
//   Bordeaux   #813B45   7,43:1 ✓   boutons et actions
//   Blanc      #FFFFFF        —     les cartes
//   Gris doux  #737D88   3,92:1 ⚠️  informations secondaires
//   Champagne  #C5A77A   2,14:1 ⚠️  détails premium — DÉCOR SEULEMENT
//   Bordures   #E8E2DA   1,20:1     filets, jamais du texte
//
// ⚠️ DEUX AVERTISSEMENTS, ET ILS NE SONT PAS DES CAPRICES.
//
// 1. LE GRIS DOUX EST À 3,92:1, SOUS LA NORME DE 4,5:1. Il porte l'heure et le
//    lieu sur chaque carte — exactement ce qu'il faut pouvoir lire d'un coup
//    d'œil. `GRIS_LISIBLE` (#6A737D, 4,51:1) est le MÊME gris assombri d'un
//    cran : la teinte ne bouge pas, le texte repasse au-dessus de la norme.
//    👉 C'est lui qu'utilisent les textes secondaires. `GRIS` reste exporté,
//    pour les aplats et les icônes, où le contraste de texte ne s'applique pas.
//    (Même raisonnement que le 10 oct, quand l'or à 3,45:1 a été retiré.)
//
// 2. LE CHAMPAGNE NE PORTE JAMAIS UNE INFORMATION. 2,14:1, c'est moins que l'or
//    retiré le 10 octobre. Il sert aux filets et aux petits libellés décoratifs,
//    jamais à une heure, un lieu, un prix ou un bouton.
export const NUIT    = "#14243A";   // Bleu nuit — couleur principale    14,52:1 ✓
export const BORDEAU = "#87372F";   // Bordeaux chaud — boutons, actions   7,45:1 ✓
export const CREME   = "#FAF6F0";   // Ivoire — la valeur de la charte
// 🤍 LE FOND DE PAGE PASSE AU BLANC. Stéphanie, 28 oct 2026 : « et si tu mets
// l'arrière-plan en blanc, peut-être celui du fond du tél ». L'ivoire et le
// blanc cassé des cartes étaient trop proches : les cartes ne se détachaient
// que par leur filet rouge. En posant le blanc derrière, le blanc cassé des
// cartes devient le ton CHAUD, et l'écran respire.
export const FOND_PAGE = "#FFFFFF";
// ⚠️ LES CARTES NE SONT PLUS EN BLANC PUR. Stéphanie, 28 oct 2026 : « je ne
// veux pas de fond blanc, mets un blanc cassé ». Le #FFFFFF de la charte était
// la seule valeur froide de l'écran, au milieu d'un ivoire et d'un bordeaux
// chauds — il « sautait » à l'œil. Le blanc cassé reste plus clair que le fond
// ivoire (#FAF7F2), donc la carte se détache toujours, et le filet rouge ajouté
// le même jour marque la limite.
export const BLANC   = "#FFFCF8";   // Surface — les cartes
export const BLANC_PUR = "#FFFFFF"; // la valeur de la charte, si besoin ailleurs
export const OR      = "#C7A575";   // Champagne — décor SEULEMENT        2,15:1 ⚠️
export const GRIS    = "#737D88";   // Gris doux — aplats et icônes       3,92:1 ⚠️
export const GRIS_LISIBLE = "#6A737D"; // le même, lisible en texte       4,51:1 ✓
export const BORDURE = "#E8E2DA";   // Bordures légères — filets, jamais du texte
export const SAUGE   = "#DDE8DF";   // fond de pastille, jamais du texte

// ── 🌅 LE GRAIN DES PHOTOS ──────────────────────────────────────────────────
//
// Stéphanie, 28 oct 2026 : « je veux que les photos soient belles, chaudes et
// un peu dorées, toutes ». Les 35 photos viennent de contributeurs différents,
// à des heures et des saisons différentes : certaines sont bleutées, d'autres
// grises. Côte à côte dans une grille, ça se voit tout de suite.
//
// On les accorde donc au moment de l'AFFICHAGE, pas en retouchant les fichiers :
//   · rien n'est ajouté au poids servi, ni au paquet OTA ;
//   · une photo reçue demain d'un établissement prendra le même grain sans
//     retouche ;
//   · et on peut revenir en arrière en changeant une ligne.
//
// La recette : un peu de chaleur (`sepia`), la saturation et le contraste
// relevés d'un cheveu, et un voile champagne très dilué par-dessus. Volontaire-
// ment léger — au-delà, le bleu de la Méditerranée vire au vert, et Monaco sans
// sa mer bleue n'est plus Monaco.
// ⚠️ PREMIER RÉGLAGE TROP TIMIDE. À sepia(0.16), la différence ne se voyait
// pas sur la capture : les photos restaient bleutées et grises. Doublé.
// ⚠️ LE SÉPIA EST REDESCENDU À 0,18. À 0,34 il mangeait le bleu du ciel —
// Stéphanie, 28 oct au soir : « retouche-les avec ciel bleu ». La chaleur vient
// désormais du VOILE champagne et de la retouche des fichiers
// (`scripts/retouche-ciel.mjs`), pas d'un filtre qui jaunit tout, ciel compris.
export const GRAIN_PHOTO =
  "sepia(0.18) saturate(1.26) contrast(1.05) brightness(1.03)";

// Le voile champagne, posé en surimpression sur chaque photo.
// `soft-light` réchauffe les clairs sans noircir les ombres — `multiply`
// assombrissait trop les façades blanches du Casino et de l'Opéra.
export const VOILE_CHAUD = {
  // Le voile démarre BAS : le haut de l'image, là où se trouve le ciel, reste
  // libre. Sans ça on redorait exactement ce qu'on venait de rendre bleu.
  background: "linear-gradient(180deg, rgba(199,165,117,0.06) 0%, rgba(199,165,117,0.26) 45%, rgba(135,55,47,0.30) 100%)",
  mixBlendMode: "overlay",
};

// ── Espacement : l'échelle 8 / 12 / 16 / 24 / 32 du brief ───────────────────
export const ESP = { xs: 8, sm: 12, md: 16, lg: 24, xl: 32 };

// ── Arrondis : 12 à 18 px ───────────────────────────────────────────────────
export const RAYON = { sm: 12, md: 16, lg: 18, pastille: 999 };

// ── Ombres : « surface douce », rien de marqué ──────────────────────────────
export const OMBRE = {
  carte: "0 1px 2px rgba(23,36,60,0.04), 0 8px 24px rgba(23,36,60,0.06)",
  haute: "0 2px 6px rgba(23,36,60,0.06), 0 16px 40px rgba(23,36,60,0.10)",
};

// ── Typographie ─────────────────────────────────────────────────────────────
// Le brief demande « titres soignés (serif premium si la police est déjà
// disponible) ». Playfair Display est DÉJÀ chargée par l'app : on ne va donc
// chercher aucune police nouvelle, ce qui éviterait un chargement fragile et
// un poids inutile dans le bundle OTA.
export const SERIF = "'Playfair Display', Georgia, serif";
export const SANS  = "'Lato', -apple-system, BlinkMacSystemFont, sans-serif";

/** Un texte secondaire : heure, lieu, compte d'amis. */
export const texteSecondaire = {
  fontFamily: SANS, fontSize: 13.5, color: GRIS_LISIBLE, lineHeight: 1.5,
};

/**
 * ⚠️ LES QUATRE IMAGES D'AMBIANCE SONT RETIRÉES (28 oct 2026, au soir).
 * Elles étaient générées par IA, pesaient 592 Ko dans le paquet OTA, et plus
 * aucun écran ne les affichait depuis que la médiathèque sert de vraies photos
 * hors du bundle. Du poids transporté pour rien chez 98 appareils.
 */

/**
 * ✒️ REMETTRE UN TITRE EN CASSE DE PHRASE, SANS ABAISSER LES NOMS PROPRES.
 *
 * Le brief et les maquettes veulent « Cinéma à l'affiche cette semaine », pas
 * « CINÉMA À L'AFFICHE CETTE SEMAINE ». Les titres arrivent en capitales parce
 * que les sources les publient ainsi.
 *
 * 🚨 PREMIER ESSAI, ÉCARTÉ. Une simple mise en minuscules donnait « Wellness
 * bars 5 adresses à monaco » et « Ligue 1 AS monaco aj auxerre » — un nom propre
 * abaissé sur chaque carte, pire que la capitale de trop. Les titres sont pleins
 * de lieux, de clubs et d'artistes, et aucune liste écrite à la main ne les
 * couvrirait : il y en a des centaines, et ils changent chaque nuit.
 *
 * ✅ CE QUI MARCHE. Les SOUS-TITRES, eux, sont correctement capitalisés —
 * « Musée d'Anthropologie Préhistorique · Monaco », « Cinémas 2 Monaco ·
 * Monte-Carlo ». On en tire donc le dictionnaire à l'exécution : tout mot qui
 * apparaît quelque part avec une majuscule suivie de minuscules est un nom
 * propre, et il garde sa forme. 225 relevés au 28 oct 2026, et la liste se
 * met à jour toute seule quand les données changent.
 *
 * ⚠️ ON NE TOUCHE PAS AUX DONNÉES : la conversion se fait à l'AFFICHAGE.
 * events.json garde ses titres d'origine, et les scripts de nuit — dédoublonnage,
 * rapprochement par titre, billetterie — continuent de travailler dessus.
 */
const SIGLES = new Set([
  "DJ", "VF", "VO", "VOST", "OPMC", "AS", "ASM", "SBM", "TPG", "NMNM", "MC",
  "UEFA", "BKT", "FC", "PSG", "OM", "CREM", "AIAP", "UNESCO", "TV", "IA", "QR",
  "II", "III", "IV", "VI", "VII", "VIII", "IX", "XI", "XII", "XV", "XX", "XXI",
]);

let _noms = null;
/** Le dictionnaire, construit une fois à partir des sous-titres des fiches. */
export function apprendreLesNomsPropres(fiches) {
  const d = new Map();
  for (const e of fiches || []) {
    for (const champ of [e.subtitle, e.source, e.quarter]) {
      for (const mot of String(champ || "").split(/[\s·,—–()]+/)) {
        const nu = mot.replace(/^[^A-Za-zÀ-ÿ]+|[^A-Za-zÀ-ÿ']+$/g, "");
        if (nu.length < 3) continue;
        if (!/^[A-ZÀ-Ý][a-zà-ÿ]/.test(nu)) continue;
        d.set(nu.toLowerCase(), nu);
      }
    }
  }
  _noms = d;
  return d.size;
}

export function casseNaturelle(titre) {
  const t = String(titre || "");
  const lettres = t.replace(/[^A-Za-zÀ-ÿ]/g, "");
  // Un titre déjà en casse mixte n'est pas touché : on ne corrige que ce qui crie.
  if (!lettres || lettres !== lettres.toUpperCase()) return t;

  let debut = true;
  return t.split(/(\s+)/).map(mot => {
    if (/^\s+$/.test(mot)) return mot;
    const nu = mot.replace(/[^A-Za-zÀ-ÿ0-9']/g, "");
    if (SIGLES.has(nu.toUpperCase())) { debut = false; return mot; }
    const propre = _noms && _noms.get(nu.toLowerCase());
    if (propre) { debut = false; return mot.replace(nu, propre); }
    // ⚠️ « MONTE-CARLO » est UN mot pour le découpage, DEUX pour le dictionnaire.
    // Sans ce passage, il ressortait « monte-carlo » alors que « Monte » et
    // « Carlo » figurent tous deux dans les sous-titres.
    if (_noms && /[-']/.test(mot)) {
      const recolle = mot.split(/([-'])/).map(part => {
        const p = part.replace(/[^A-Za-zÀ-ÿ]/g, "");
        // ⚠️ Un séparateur se garde tel quel ; une lettre seule s'abaisse. Sans
        // cette distinction, « L'AFFICHE » ressortait « L'affiche » avec un L
        // majuscule au milieu de la phrase.
        if (part === "-" || part === "'") return part;
        if (p.length < 3) return part.toLowerCase();
        return _noms.get(p.toLowerCase()) || part.toLowerCase();
      }).join("");
      if (recolle !== mot.toLowerCase()) { debut = false; return recolle; }
    }
    const bas = mot.toLowerCase();
    const sortie = debut ? bas.charAt(0).toUpperCase() + bas.slice(1) : bas;
    debut = /[.!?:]$/.test(mot);
    return sortie;
  }).join("");
}

