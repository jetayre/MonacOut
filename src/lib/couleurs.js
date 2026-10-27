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
  // 🎨 UNE COULEUR PAR CATÉGORIE — 27 oct 2026. Stéphanie : « c'est mieux, mais
  // chaque catégorie doit avoir une couleur différente ». On passe donc de 8
  // familles à 28 teintes, UNE PAR CATÉGORIE.
  //
  // ⚠️ MAIS LES FAMILLES NE DISPARAISSENT PAS. Elles restent la structure : les
  // tables occupent les rouges-orangés, les expositions les ocres, la scène les
  // verts, le sport les bleus-cyan, la musique les bleus-violets, la nuit les
  // magentas. Chaque catégorie prend SA nuance dans la zone de sa famille, en
  // alternant une bande claire (contraste ~5,2:1) et une bande foncée (~7,1:1)
  // pour que deux voisines ne se confondent jamais.
  //
  // J'ai essayé une variante « séparation maximale » qui écartait les catégories
  // fréquentes de 107 au lieu de 38 — mais elle FAISAIT VOLER EN ÉCLATS les
  // familles : les expositions devenaient bleues, le sport rouge. La refonte du
  // 10 octobre est une décision de Stéphanie, on ne la défait pas pour gagner
  // quelques points d'écart.
  //
  // Toutes les valeurs sont CALCULÉES : on cherche la saturation maximale qui
  // tienne dans la fourchette de contraste. Minimum relevé : 5,2:1, au-dessus de
  // la norme de 4,5:1. Les seules paires un peu proches (écart 25 sur 441)
  // concernent des catégories à 1 ou 2 fiches — Festival, Marché, Petit-déj.
  { nom: "Apéro", couleur: "#D80202", cats: ["APÉRO"] },
  { nom: "Brunch", couleur: "#A62802", cats: ["BRUNCH"] },
  { nom: "Foody", couleur: "#B04D02", cats: ["FOODY"] },
  { nom: "Petit-Déj", couleur: "#7D4C01", cats: ["PETIT-DÉJ"] },
  { nom: "Exposition", couleur: "#856701", cats: ["EXPOSITION"] },
  { nom: "Marché", couleur: "#5D5A01", cats: ["MARCHÉ"] },
  { nom: "Salon", couleur: "#607301", cats: ["SALON"] },
  { nom: "Enchères", couleur: "#3E6101", cats: ["ENCHÈRES"] },
  { nom: "Théâtre", couleur: "#327B01", cats: ["THÉÂTRE"] },
  { nom: "Spectacle", couleur: "#156501", cats: ["SPECTACLE"] },
  { nom: "Danse", couleur: "#017D01", cats: ["DANSE"] },
  { nom: "Cinéma", couleur: "#016515", cats: ["CINÉMA"] },
  { nom: "Festival", couleur: "#017B32", cats: ["FESTIVAL"] },
  { nom: "Atelier", couleur: "#01653D", cats: ["ATELIER"] },
  { nom: "Bien-Être", couleur: "#01795D", cats: ["BIEN-ÊTRE"] },
  { nom: "Sport", couleur: "#01606F", cats: ["SPORT"] },
  { nom: "Football", couleur: "#0273A0", cats: ["FOOTBALL"] },
  { nom: "Basket", couleur: "#02599C", cats: ["BASKET"] },
  { nom: "Fête Nationale", couleur: "#0262E8", cats: ["FÊTE NATIONALE"] },
  { nom: "Concert", couleur: "#0240EA", cats: ["CONCERT"] },
  { nom: "Opéra", couleur: "#4154FD", cats: ["OPÉRA"] },
  { nom: "Musical", couleur: "#392BFD", cats: ["MUSICAL"] },
  { nom: "Jazz Live", couleur: "#7045FD", cats: ["JAZZ LIVE"] },
  { nom: "Chants", couleur: "#6503F8", cats: ["CHANTS"] },
  { nom: "Soirée", couleur: "#A502F6", cats: ["SOIRÉE"] },
  { nom: "Dj Set", couleur: "#9702AE", cats: ["DJ SET"] },
  { nom: "Gala", couleur: "#C6029F", cats: ["GALA"] },
  { nom: "Conférence", couleur: "#AE0252", cats: ["CONFÉRENCE"] },
];


const PAR_CAT = {};
for (const f of FAMILLES) for (const c of f.cats) PAR_CAT[c] = f.couleur;

// La couleur d'une catégorie. Une catégorie inconnue retombe sur le Rouge H
// plutôt que sur rien : mieux vaut la couleur de la marque qu'un mot invisible.
export function couleurCat(cat) {
  return PAR_CAT[cat] || ROUGE_H;
}
