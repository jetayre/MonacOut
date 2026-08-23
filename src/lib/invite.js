/**
 * MonacOut — LE LIEN D'INVITATION, À UN SEUL ENDROIT
 *
 * Il était écrit en dur dans FriendsScreen. La carte d'invitation d'après-inscription
 * en a besoin aussi, et deux copies d'une même adresse finissent toujours par diverger.
 *
 * ⚠️ L'hôte est **monac-out.vercel.app**, ET C'EST PROVISOIRE.
 * Stéphanie, 23 août 2026 : « je veux que tous les liens arrivent sur l'app ».
 * C'est le SEUL hôte déclaré dans `applinks:` côté iOS, donc le seul qui ouvre
 * réellement l'app chez quelqu'un qui l'a installée. Un lien monacout.com ouvre
 * Safari. Le repli est propre : quelqu'un SANS l'app charge simplement la page, où
 * la carte d'installation l'attend — un Universal Link se dégrade en page web.
 *
 * ⚠️ ON REVIENDRA À monacout.com. Le 16 août, Stéphanie jugeait ce lien « bizarre »
 * à envoyer à une amie, et elle avait raison : le tiret ressemble à une faute et
 * « vercel » n'évoque rien. Dès que la build App Store 2.2 embarquera
 * `applinks:monacout.com` (déjà dans App.entitlements), remettre
 * `https://monacout.com/?invite=` ici ET `?event=` dans EventCard.jsx : le lien sera
 * alors joli ET ouvrira l'app. C'est la décision « les deux » du 23 août.
 *
 * ⚠️ Le code DOIT rester dans l'adresse : c'est lui qui relie les deux comptes. Sans
 * lui, la personne arrive sans qu'on sache qui l'a invitée et l'amitié ne se fait pas.
 */
import { Capacitor } from '@capacitor/core'
import { Share } from '@capacitor/share'

/** Un code exploitable ? (garde-fou du 7 août : un lien parti sans code est perdu en silence) */
export const codeValide = (code) => /^[a-z0-9]{4,}$/i.test(code || '')

export const lienInvitation = (code) => `https://monac-out.vercel.app/?invite=${code}`

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
