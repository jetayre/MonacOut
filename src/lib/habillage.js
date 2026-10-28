/**
 * 🎨 L'HABILLAGE SE FAIT DANS LA PALETTE DE LA MAISON — plus de couleur par
 * famille. Stéphanie, 28 oct 2026, charte en main : « une palette commune à
 * toutes les cartes : ivoire, bleu nuit et bordeaux, avec une discrète touche
 * champagne », parce que « les fonds violet vif, vert foncé, rouge et jaune
 * donnent un effet catalogue de catégories ».
 *
 * ⚠️ CE QUI A CHANGÉ : le fond ne vient plus de `couleurCat()`. Il part
 * toujours de `event.id` — donc deux cartes voisines restent différentes — mais
 * il ne se promène plus que dans le BLEU NUIT et le BORDEAUX, avec un halo
 * champagne très dilué. Aucune carte ne peut plus ressortir en violet ou en
 * vert. `src/lib/couleurs.js` reste en place pour le reste de l'app.
 *
 * ⚠️ Et il sert de moins en moins : depuis la médiathèque du 28 oct, chaque
 * fiche reçoit une vraie photo (du lieu, de l'un de ses lieux, ou du quartier).
 * L'habillage n'apparaît donc que si une image n'arrive pas.
 */
const NUIT    = [0x15, 0x26, 0x3B];   // #15263B
const BORDEAU = [0x81, 0x3B, 0x45];   // #813B45
const CHAMPAGNE = [0xC5, 0xA7, 0x7A]; // #C5A77A

/**
 * Un entier stable tiré de l'identifiant. Deux affichages de la même fiche
 * donnent le même résultat ; deux fiches voisines donnent des résultats
 * éloignés, parce que les identifiants se suivent souvent (800041, 800042…)
 * et qu'un simple modulo les rendrait identiques deux à deux.
 */
function graine(id) {
  let x = (Number(id) || 0) * 2654435761 % 4294967296;   // Knuth
  x ^= x >>> 13; x = (x * 1274126177) % 4294967296; x ^= x >>> 16;
  return Math.abs(x);
}

const hexVersRgb = h => [1, 3, 5].map(i => parseInt(String(h).slice(i, i + 2), 16));
const melange = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const rgb = ([r, g, b], a = 1) => a === 1 ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${a})`;

/**
 * Le fond d'une fiche : un dégradé profond dans la teinte de sa catégorie,
 * incliné et décalé selon l'identifiant.
 */
export function fondEvenement(event) {
  const g = graine(event?.id);

  // La base glisse du bleu nuit vers le bordeaux selon l'identifiant : deux
  // cartes voisines diffèrent, mais toutes restent dans la charte.
  const t = ((g >> 3) % 100) / 100;
  const base = melange(NUIT, BORDEAU, t * 0.75);

  const variante = g % 4;
  const angle = [152, 128, 168, 112][variante];
  const sombre = melange(base, [10, 14, 22], 0.18 + ((g >> 7) % 10) / 100);
  const fonce  = melange(base, [8, 11, 18], 0.52);
  // Le halo champagne, très dilué : c'est la « discrète touche » demandée.
  const halo   = melange(base, CHAMPAGNE, 0.22);

  const hx = 18 + ((g >> 11) % 58);
  const hy = 14 + ((g >> 17) % 52);

  return {
    backgroundColor: rgb(sombre),
    backgroundImage: [
      `radial-gradient(120% 95% at ${hx}% ${hy}%, ${rgb(halo, 0.42)} 0%, ${rgb(halo, 0)} 62%)`,
      `linear-gradient(${angle}deg, ${rgb(halo, 0.14)} 0%, ${rgb(sombre)} 46%, ${rgb(fonce)} 100%)`,
    ].join(", "),
  };
}

/** La teinte des cercles et filets posés par-dessus le fond. */
export function traitsEvenement(event) {
  const g = graine(event?.id);
  return {
    cx: 58 + ((g >> 5) % 30),       // centre des cercles, en %
    cy: 34 + ((g >> 9) % 34),
    r1: 26 + ((g >> 13) % 12),      // leurs rayons
    r2: 42 + ((g >> 19) % 14),
    incline: -12 + ((g >> 23) % 26), // l'inclinaison des filets
  };
}

/**
 * L'emoji de la fiche sert d'icône en filigrane. Les données en portent
 * 79 différents, déjà choisis à la main catégorie par catégorie : plutôt que
 * de redessiner une bibliothèque d'icônes, on se sert de ce qui existe et qui
 * est déjà juste.
 */
export function iconeEvenement(event) {
  return event?.emoji || "✦";
}
