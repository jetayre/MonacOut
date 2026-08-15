/**
 * MonacOut — PHOTO DE PROFIL
 *
 * Réduit la photo choisie en un petit carré et la renvoie en « data URL ».
 * On la stocke ainsi directement dans la colonne `avatar_url` de `profiles`,
 * sans espace de stockage séparé : à 96×96 en JPEG, une photo pèse ~5 Ko —
 * moins qu'une ligne de texte un peu longue. Avantages concrets :
 *  - aucun réglage d'accès (RLS) ni de CORS à maintenir sur un « bucket » ;
 *  - la photo part AVEC le compte quand quelqu'un le supprime (la ligne
 *    profiles disparaît, la photo avec) → obligation légale réglée sans effort ;
 *  - la photo des amis arrive avec la liste d'amis, sans requête de plus.
 * ⚠️ À revoir si l'audience grossit beaucoup (des milliers de comptes) :
 *    il faudra alors passer à Supabase Storage.
 */

export const AVATAR_PX = 96;          // taille finale, en pixels (carré)
const QUALITE = 0.72;                 // compromis poids/rendu pour du JPEG
export const AVATAR_MAX_OCTETS = 40000;   // garde-fou : on refuse au-delà

/**
 * Transforme un fichier image en petit carré JPEG (data URL).
 * Recadre au centre pour ne jamais déformer le visage.
 * @returns {Promise<string>} data URL ; lève une erreur si le fichier n'est pas une image
 */
/**
 * AVATARS MONOGRAMME — l'alternative à la photo, demandée par Stéphanie le 15 août 2026.
 *
 * Seules 8 personnes sur 44 avaient mis une photo : la plupart n'ont pas envie de se
 * montrer, ou n'ont pas de photo sous la main au moment de s'inscrire. Un monogramme
 * demande un seul geste et donne quand même un visage à la liste d'amies.
 *
 * ⚠️ Choix de conception : le monogramme est une **image SVG en data URL**, exactement
 * comme une photo. Il se range donc dans la même colonne `avatar_url` et s'affiche
 * PARTOUT sans toucher à une seule ligne d'affichage (accueil, menu, fiches, amies,
 * invitation). Ne pas le remplacer par un code du genre « av:3 » : il faudrait alors
 * modifier chaque endroit qui dessine un avatar, et le premier oublié afficherait un
 * cadre vide.
 *
 * Poids : ~400 octets, cent fois moins qu'une photo.
 */
export const MONOGRAMMES = [
  { fond: '#0F1D3A', encre: '#C4A241' },   // navy · or       — la marque
  { fond: '#C4A241', encre: '#FFFDF7' },   // or · ivoire
  { fond: '#FFFDF7', encre: '#0F1D3A' },   // ivoire · navy
  { fond: '#9FC3DC', encre: '#0F1D3A' },   // bleu nautique · navy
  { fond: '#7A1048', encre: '#FFFDF7' },   // grenat · ivoire
  { fond: '#1A4A3A', encre: '#C4A241' },   // vert profond · or
]

/**
 * Fabrique un avatar monogramme en data URL SVG.
 * @param {string} prenom  le prénom saisi (seule la 1ʳᵉ lettre est utilisée)
 * @param {number} i       index dans MONOGRAMMES
 * @returns {string} data URL utilisable en `src` comme en `background: url(…)`
 */
export function avatarMonogramme(prenom, i) {
  const c = MONOGRAMMES[((i % MONOGRAMMES.length) + MONOGRAMMES.length) % MONOGRAMMES.length]
  // Pas de lettre tant que le prénom n'est pas saisi : un point doré vaut mieux
  // qu'un « ? », qui donne l'impression d'une erreur.
  const brut = (prenom || '').trim()
  const lettre = brut ? brut[0].toUpperCase() : ''
  const centre = lettre
    ? `<text x="48" y="63" text-anchor="middle" font-family="Playfair Display,Georgia,serif" font-size="46" fill="${c.encre}">${lettre.replace(/[<>&"']/g, '')}</text>`
    : `<circle cx="48" cy="48" r="7" fill="${c.encre}"/>`
  // Le liseré reprend le double cadre or/navy du logo — c'est ce qui fait « MonacOut »
  // et non « avatar générique ».
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">`
    + `<circle cx="48" cy="48" r="48" fill="${c.fond}"/>`
    + `<circle cx="48" cy="48" r="45" fill="none" stroke="${c.encre}" stroke-opacity=".45" stroke-width="1.5"/>`
    + centre + `</svg>`
  return 'data:image/svg+xml,' + encodeURIComponent(svg)
}

export function fichierVersAvatar(fichier) {
  return new Promise((resolve, reject) => {
    if (!fichier || !fichier.type || !fichier.type.startsWith('image/')) {
      return reject(new Error('pas-une-image'))
    }
    const lecteur = new FileReader()
    lecteur.onerror = () => reject(new Error('lecture-impossible'))
    lecteur.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('image-illisible'))
      img.onload = () => {
        try {
          const cote = Math.min(img.width, img.height)          // carré au centre
          const dx = (img.width - cote) / 2
          const dy = (img.height - cote) / 2
          const c = document.createElement('canvas')
          c.width = AVATAR_PX; c.height = AVATAR_PX
          const ctx = c.getContext('2d')
          ctx.drawImage(img, dx, dy, cote, cote, 0, 0, AVATAR_PX, AVATAR_PX)
          const url = c.toDataURL('image/jpeg', QUALITE)
          if (url.length > AVATAR_MAX_OCTETS) return reject(new Error('trop-lourde'))
          resolve(url)
        } catch {
          reject(new Error('conversion-impossible'))
        }
      }
      img.src = lecteur.result
    }
    lecteur.readAsDataURL(fichier)
  })
}
