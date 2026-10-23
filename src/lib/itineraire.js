import { Capacitor } from "@capacitor/core";

/**
 * « Direction » — ouvrir l'itinéraire vers un lieu.
 *
 * Stéphanie, 23 oct 2026 : « au lieu de mettre le site du lieu, mets le lien
 * Google Maps partout, mets le mot Direction ».
 *
 * ⚠️ POURQUOI PAS target="_blank". Le 7 août 2026, un lien ouvert ainsi depuis
 * l'app native a donné un ÉCRAN NOIR sur iPhone : une fenêtre sans barre
 * d'adresse ni bouton retour, impossible de revenir dans Monac'Out. On ouvre
 * donc comme le téléphone : en changeant l'adresse de la page courante. iOS
 * reconnaît la destination et bascule dans l'application de cartes, exactement
 * comme `tel:` bascule dans le composeur. L'app n'est jamais remplacée.
 *
 * ⚠️ ET POURQUOI PLANS SUR IPHONE, alors que la demande dit « Google Maps ».
 * Google Maps n'est pas toujours installé. Si on y envoie quelqu'un qui ne l'a
 * pas, la page s'ouvre DANS la vue web de l'app — et on retombe sur l'écran
 * noir. `maps.apple.com` est toujours reconnu par iOS et ouvre Plans, qui
 * propose lui-même l'itinéraire. Sur un navigateur, on envoie bien vers Google
 * Maps, où le risque n'existe pas.
 */
export function adresseItineraire(sousTitre) {
  const lieu = (sousTitre || "").split(" · ").filter(Boolean).join(", ");
  if (!lieu.trim()) return null;
  const q = encodeURIComponent(`${lieu}, Monaco`);
  return Capacitor.isNativePlatform()
    ? `https://maps.apple.com/?q=${q}`
    : `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export function ouvrirItineraire(sousTitre) {
  const url = adresseItineraire(sousTitre);
  if (url) window.location.href = url;
}
