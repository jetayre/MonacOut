// MonacOut — LA PALETTE, UN SEUL ENDROIT
//
// Refonte du 10 oct 2026, décidée avec Stéphanie sur maquette. Ce qui a changé et
// pourquoi — l'or disparaît, le Rouge H devient le fil conducteur, et chaque
// famille d'événements porte sa propre couleur :
//
//  • L'OR N'ÉTAIT PAS LISIBLE. #a88421 sur l'ivoire #FFFDF7 donne 3,45:1, sous la
//    norme de 4,5:1 — et le cadre #C9A96E tombait à 2,20:1. Stéphanie a besoin de
//    contraste ; toutes les couleurs ci-dessous sont au-dessus de 6,8:1.
//  • L'ORANGE DES BOÎTES HERMÈS A ÉTÉ ÉCARTÉ : 2,89:1, encore pire que l'or.
//  • Les teintes portent des noms de la maison Hermès (Rouge H, Havane, Bleu Jean,
//    Vert Cyprès, Violet Anémone) mais les valeurs sont les nôtres : Hermès ne
//    publie pas de codes hexadécimaux, et ses teintes de soie sont trop claires
//    pour du texte. Ce sont des cuirs profonds dans leur esprit, pas des copies.
//  • Aucune paire n'est à moins de 25° de teinte : elles se distinguent vraiment,
//    pas seulement sur le papier.
//
// ⚠️ Ne pas remettre de vert pour « ENTRÉE LIBRE » : le vert est désormais la
// couleur de la famille Scène, et le badge donnait deux sens au même vert.

export const ROUGE_H = "#7B2D26";   // le fil conducteur : contours, logo, traits
export const NAVY    = "#0F1D3A";   // tous les textes
export const IVOIRE  = "#FFFDF7";
export const GRIS    = "#6A7080";

// 🎨 PALETTE RAVIVÉE LE 27 OCT 2026. Stéphanie : « met des couleurs plus
// distinctes, change le contraste, là je ne vois que légèrement les couleurs
// des cadres ». Le diagnostic, mesuré avant de toucher à quoi que ce soit : les
// teintes étaient DÉJÀ bien séparées (29° au minimum), mais les huit étaient
// toutes SOMBRES — de 6,8:1 à 12:1 de contraste. Sur un trait de 3 px, l'œil ne
// lit que « foncé » et ne distingue pas le Havane du Vert Bengale.
//
// Les nouvelles valeurs montent à 95 % de saturation pour un contraste ramené
// à 5,6:1 — au-dessus de la norme de 4,5:1, mais assez clair pour que la TEINTE
// se voie enfin. Chaque valeur a été calculée, pas choisie à l'œil : on cherche
// la saturation maximale qui tienne dans la fourchette de contraste voulue.
//
// ⚠️ ROUGE_H, LUI, NE CHANGE PAS. C'est le fil conducteur — logo, bouton
// « Réserver », cœur des favoris — et le passer à #CE0C05 ferait virer
// l'identité au rouge postal. Seule la FAMILLE de la table prend le rouge vif.
//
// Les huit familles. La 1ʳᵉ catégorie citée donne son nom à la famille.
export const FAMILLES = [
  // « PETIT-DÉJ » (11 oct 2026) rejoint la famille de la table plutôt que
  // d'ouvrir une 9ᵉ couleur : l'écart de 25° entre teintes, qui les rend
  // vraiment distinguables, ne survivrait pas à une de plus.
  { nom: "Rouge H",        couleur: "#CE0C05", cats: ["APÉRO", "BRUNCH", "FOODY", "PETIT-DÉJ"] },
  { nom: "Havane",         couleur: "#9F5204", cats: ["EXPOSITION", "MARCHÉ"] },
  { nom: "Vert Bengale",   couleur: "#327503", cats: ["SPECTACLE", "THÉÂTRE", "DANSE", "CINÉMA", "FESTIVAL", "FÊTE NATIONALE", "ATELIER"] },
  { nom: "Vert Cyprès",    couleur: "#03754F", cats: ["BIEN-ÊTRE"] },
  { nom: "Bleu Jean",      couleur: "#046DA2", cats: ["SPORT", "FOOTBALL", "BASKET", "FORMULE 1", "FORMULE E", "TENNIS", "RALLYE"] },
  { nom: "Bleu Encre",     couleur: "#3A3FDF", cats: ["CONCERT", "OPÉRA", "MUSICAL", "CHANTS", "JAZZ LIVE"] },
  // Stéphanie, 10 oct 2026 : « jazz live ça devrait être musique comme catégorie ».
  // Elle a raison — un concert de jazz est un concert. Violet Anémone ne garde que
  // ce qui relève vraiment de la nuit.
  { nom: "Violet Anémone", couleur: "#AF05C9", cats: ["DJ SET", "SOIRÉE"] },
  { nom: "Rouge Grenat",   couleur: "#C90561", cats: ["ENCHÈRES", "SALON", "GALA", "CONFÉRENCE"] },
];

const PAR_CAT = {};
for (const f of FAMILLES) for (const c of f.cats) PAR_CAT[c] = f.couleur;

// La couleur d'une catégorie. Une catégorie inconnue retombe sur le Rouge H
// plutôt que sur rien : mieux vaut la couleur de la marque qu'un mot invisible.
export function couleurCat(cat) {
  return PAR_CAT[cat] || ROUGE_H;
}
