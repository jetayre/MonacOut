// MonacOut — NUMÉROS DE TÉLÉPHONE : normalisation et empreinte
//
// Pourquoi ce fichier existe : pour retrouver une amie dans son carnet d'adresses,
// il faut comparer des numéros. On ne compare JAMAIS des numéros en clair, et on
// n'en envoie JAMAIS au serveur : on envoie une empreinte (SHA-256) calculée DANS
// le téléphone. Le serveur ne reçoit donc pas les numéros de gens qui n'ont rien
// demandé — seulement des suites de caractères qu'il compare entre elles.
//
// ⚠️ À DIRE HONNÊTEMENT : une empreinte de numéro n'est PAS un secret solide. Il
// n'existe qu'une centaine de millions de numéros possibles ; quelqu'un qui aurait
// accès à la base pourrait tous les essayer et retrouver les numéros. L'empreinte
// évite le stockage en clair et la fuite par simple lecture, rien de plus. C'est
// pour cela que le croisement passe par une fonction serveur qui n'accepte qu'un
// carnet à la fois et ne rend jamais la colonne.
//
// Deux pays seulement, ceux des gens qui utilisent l'app : Monaco et la France.

const SEL = "monacout:v1:";   // séparateur de domaine — empêche de réutiliser une
                              // empreinte calculée ailleurs. Ce n'est pas un secret.

// Ramène un numéro écrit n'importe comment au format international E.164.
// « 06 12 34 56 78 » → « +33612345678 » · « 93 15 22 95 » → « +37793152295 »
export function versE164(brut) {
  if (!brut) return null
  let s = String(brut).replace(/[^\d+]/g, "")
  if (s.startsWith("00")) s = "+" + s.slice(2)
  if (s.startsWith("+")) {
    const n = s.slice(1)
    return /^\d{8,15}$/.test(n) ? "+" + n : null
  }
  // 10 chiffres commençant par 0 → France (06…, 07…, 01…)
  if (/^0\d{9}$/.test(s)) return "+33" + s.slice(1)
  // 8 chiffres → Monaco (93…, 97…, 99…, 4…, 6…)
  if (/^\d{8}$/.test(s)) return "+377" + s
  // 9 chiffres commençant par 377 sans le + (saisie fréquente)
  if (/^377\d{8}$/.test(s)) return "+" + s
  if (/^33\d{9}$/.test(s)) return "+" + s
  return null
}

// Empreinte SHA-256, en hexadécimal. Calculée dans le téléphone, jamais ailleurs.
export async function empreinte(brut) {
  const e164 = versE164(brut)
  if (!e164) return null
  if (!globalThis.crypto?.subtle) return null   // contexte non sécurisé : on renonce
  const octets = new TextEncoder().encode(SEL + e164)
  const digest = await globalThis.crypto.subtle.digest("SHA-256", octets)
  return [...new Uint8Array(digest)].map(o => o.toString(16).padStart(2, "0")).join("")
}

// Empreintes d'un carnet entier, dédoublonnées, sans jamais garder les numéros.
// On plafonne : un carnet de 3 000 entrées n'a pas à partir en une seule fois, et
// la fonction serveur refuse au-delà de 1 000.
export async function empreintesDuCarnet(numeros, max = 1000) {
  const vues = new Set()
  for (const n of numeros) {
    const h = await empreinte(n)
    if (h) vues.add(h)
    if (vues.size >= max) break
  }
  return [...vues]
}

// Affichage lisible d'un numéro enregistré — pour que la personne se reconnaisse.
export function joli(e164) {
  if (!e164) return ""
  // Monaco : 8 chiffres par paires (93 15 22 95).
  if (e164.startsWith("+377")) return "+377 " + e164.slice(4).replace(/(\d{2})(?=\d)/g, "$1 ").trim()
  // France : 9 chiffres, le premier seul puis des paires (6 12 34 56 78).
  if (e164.startsWith("+33")) {
    const n = e164.slice(3)
    return "+33 " + n[0] + " " + n.slice(1).replace(/(\d{2})(?=\d)/g, "$1 ").trim()
  }
  return e164
}
