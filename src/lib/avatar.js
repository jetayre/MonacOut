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
