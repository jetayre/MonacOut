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

// Les huit familles. La 1ʳᵉ catégorie citée donne son nom à la famille.
export const FAMILLES = [
  { nom: "Rouge H",        couleur: "#7B2D26", cats: ["APÉRO", "BRUNCH", "FOODY"] },
  { nom: "Havane",         couleur: "#6E4B1C", cats: ["EXPOSITION", "MARCHÉ"] },
  { nom: "Vert Bengale",   couleur: "#44581C", cats: ["SPECTACLE", "THÉÂTRE", "DANSE", "CINÉMA", "FESTIVAL", "FÊTE NATIONALE", "ATELIER"] },
  { nom: "Vert Cyprès",    couleur: "#1A4F3C", cats: ["BIEN-ÊTRE"] },
  { nom: "Bleu Jean",      couleur: "#22607A", cats: ["SPORT", "FOOTBALL", "BASKET", "FORMULE 1", "FORMULE E", "TENNIS", "RALLYE"] },
  { nom: "Bleu Encre",     couleur: "#27306B", cats: ["CONCERT", "OPÉRA", "MUSICAL", "CHANTS"] },
  { nom: "Violet Anémone", couleur: "#58275C", cats: ["JAZZ LIVE", "DJ SET", "SOIRÉE"] },
  { nom: "Rouge Grenat",   couleur: "#6E2340", cats: ["ENCHÈRES", "SALON", "GALA", "CONFÉRENCE"] },
];

const PAR_CAT = {};
for (const f of FAMILLES) for (const c of f.cats) PAR_CAT[c] = f.couleur;

// La couleur d'une catégorie. Une catégorie inconnue retombe sur le Rouge H
// plutôt que sur rien : mieux vaut la couleur de la marque qu'un mot invisible.
export function couleurCat(cat) {
  return PAR_CAT[cat] || ROUGE_H;
}
