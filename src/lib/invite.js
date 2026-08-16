/**
 * MonacOut — LE LIEN D'INVITATION, À UN SEUL ENDROIT
 *
 * Il était écrit en dur dans FriendsScreen. La carte d'invitation d'après-inscription
 * en a besoin aussi, et deux copies d'une même adresse finissent toujours par diverger.
 *
 * ⚠️ L'hôte est **monacout.com**, jamais l'adresse technique en .vercel.app.
 * Stéphanie, 16 août 2026 : « le lien à envoyer aux amis est bizarre ».
 * « monac-out.vercel.app?invite=4750b5 » a tout d'un lien de traçage — personne ne
 * reconnaît le nom, le tiret ressemble à une faute, et « vercel » n'évoque rien.
 * Reçu par message d'une amie, ça se signale plutôt que ça ne se clique.
 * Vérifié : `monacout.com/?invite=…` sert bien l'app (200, aucune redirection) — la
 * règle du QR de juin ne vise que l'hôte `monacout.vercel.app`, pas celui-ci.
 *
 * ⚠️ Le code DOIT rester dans l'adresse : c'est lui qui relie les deux comptes. Sans
 * lui, la personne arrive sans qu'on sache qui l'a invitée et l'amitié ne se fait pas.
 */
import { Capacitor } from '@capacitor/core'
import { Share } from '@capacitor/share'

/** Un code exploitable ? (garde-fou du 7 août : un lien parti sans code est perdu en silence) */
export const codeValide = (code) => /^[a-z0-9]{4,}$/i.test(code || '')

export const lienInvitation = (code) => `https://monacout.com/?invite=${code}`

export const messageInvitation = (lang) => lang === 'en'
  ? "Join me on Monac'Out — the app for going out in Monaco! Tap the link and we'll be connected 👇"
  : "Rejoins-moi sur Monac'Out, l'appli des sorties à Monaco ! Clique sur le lien et on sera connectés 👇"

/**
 * Ouvre le partage du téléphone. Rien ne sort de l'app : c'est la feuille de partage
 * du système, pas une page web — donc aucun risque de l'écran noir du 7 août.
 * @returns {Promise<'partage'|'copie'|'sans-code'>} ce qui a été fait
 */
export async function partagerInvitation(code, lang) {
  if (!codeValide(code)) return 'sans-code'
  const lien = lienInvitation(code)
  // Le lien va dans `url` (champ dédié) : les messageries le rendent cliquable.
  const payload = { title: "Monac'Out", text: messageInvitation(lang), url: lien }
  if (Capacitor.isNativePlatform()) {
    await Share.share(payload).catch(() => {})
    return 'partage'
  }
  if (navigator.share) {
    await navigator.share(payload).catch(() => {})
    return 'partage'
  }
  navigator.clipboard?.writeText(`${messageInvitation(lang)}\n${lien}`)
  return 'copie'
}
