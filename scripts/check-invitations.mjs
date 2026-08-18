#!/usr/bin/env node
/**
 * MonacOut — CONTRÔLE DES LIENS D'INVITATION
 *
 * Né d'un vrai incident, le 7 août 2026. Samantha s'inscrit à 11h54 et partage
 * aussitôt son lien d'invitation. Stéphanie l'ouvre : « Code introuvable ».
 * Cause : le lien était construit avec `auth.profile?.invite_code || '…'`. Le profil
 * n'étant pas encore chargé, l'app avait partagé un lien contenant l'ellipsis.
 * L'amitié était perdue en silence — aucune erreur nulle part, aucun moyen de savoir.
 *
 * Ce script vérifie les TROIS maillons de la chaîne, parce que chacun peut casser
 * séparément et qu'aucun ne prévient :
 *   1. le CODE     — chaque profil a bien un code exploitable (défaut base de données)
 *   2. le GARDE    — l'app refuse toujours de partager un lien sans code (régression)
 *   3. l'ADRESSE   — l'hôte du lien sert bien l'app et n'avale pas le `?invite=`
 *                    (une redirection mal bornée l'a fait : cf. le QR du 12 juin)
 *
 * Sort en échec (code 1) si un maillon est rompu : un lien d'invitation cassé ne se
 * voit pas à l'œil nu et personne ne le signalera jamais.
 *
 * Usage : node scripts/check-invitations.mjs
 */
import { readFileSync, existsSync, readdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const pb = [];
const ok = (m) => console.log("   ✅ " + m);
const ko = (m) => { console.log("   ❌ " + m); pb.push(m); };

// ── 1. LE GARDE DANS L'APP ───────────────────────────────────────────────────────
// On épingle la correction : si quelqu'un retire la protection, le contrôle crie.
console.log("\n1. Le garde-fou dans l'app");
const ecran = readFileSync(join(racine, "src/components/screens/FriendsScreen.jsx"), "utf8");
if (/codePret\s*=\s*\/\^\[a-z0-9\]\{4,\}\$\/i\.test/.test(ecran))
  ok("le code est validé avant d'être mis dans un lien");
else
  ko("la validation du code a disparu de FriendsScreen.jsx — un lien vide peut repartir");

if (/function shareInvite[\s\S]{0,220}if \(!codePret\)/.test(ecran))
  ok("le partage refuse de partir tant que le code n'est pas prêt");
else
  ko("shareInvite() ne vérifie plus codePret — c'est EXACTEMENT le bug du 7 août 2026");

// Le lien n'est plus construit dans l'écran mais dans src/lib/invite.js, pour qu'une
// seule source serve à la fois l'onglet Amies et la carte de partage (17 août 2026).
// On épingle donc les DEUX : la fabrique dans la bibliothèque, et le fait que l'écran
// s'en serve vraiment. Sans le second test, quelqu'un pourrait réécrire un lien en dur
// dans l'écran sans que rien ne le signale.
const fabrique = readFileSync(join(racine, "src/lib/invite.js"), "utf8");
const lien = fabrique.match(/lienInvitation\s*=\s*\(code\)\s*=>\s*`([^`]+)`/);
if (!lien) ko("impossible de retrouver lienInvitation() dans src/lib/invite.js");
else {
  const hote = lien[1].replace("${code}", "CODE");
  ok(`lien construit : ${hote}`);
  var HOTE_LIEN = hote.replace(/\?invite=CODE.*$/, "");
}
if (/lienInvitation\s*\(\s*inviteCode\s*\)/.test(ecran))
  ok("l'écran Amies utilise bien cette fabrique, pas un lien écrit en dur");
else
  ko("FriendsScreen n'appelle plus lienInvitation() — un lien en dur a pu réapparaître");

// ── 2. LES CODES EN BASE ─────────────────────────────────────────────────────────
// Les identifiants sont publics (ils sont dans le bundle livré aux navigateurs).
// En local on les lit dans .env.local ; en CI, dans le build qui vient d'être fait.
console.log("\n2. Les codes d'invitation en base");
function identifiants() {
  const env = join(racine, ".env.local");
  if (existsSync(env)) {
    const t = readFileSync(env, "utf8");
    const u = t.match(/VITE_SUPABASE_URL=(\S+)/), k = t.match(/VITE_SUPABASE_ANON_KEY=(\S+)/);
    if (u && k) return [u[1].replace(/["']/g, ""), k[1].replace(/["']/g, "")];
  }
  const dist = join(racine, "dist", "assets");
  if (existsSync(dist)) {
    for (const f of readdirSync(dist).filter(f => f.endsWith(".js"))) {
      const s = readFileSync(join(dist, f), "utf8");
      const u = s.match(/https:\/\/[a-z0-9]+\.supabase\.co/), k = s.match(/sb_publishable_[A-Za-z0-9_-]+/);
      if (u && k) return [u[0], k[0]];
    }
  }
  return null;
}
const ids = identifiants();
if (!ids) {
  console.log("   ⏭  identifiants Supabase introuvables — contrôle base ignoré");
} else {
  const [URL_SB, CLE] = ids;
  try {
    const r = await fetch(`${URL_SB}/rest/v1/profiles?select=display_name,invite_code`,
      { headers: { apikey: CLE, Authorization: `Bearer ${CLE}` } });
    const profils = await r.json();
    if (!Array.isArray(profils)) throw new Error(JSON.stringify(profils).slice(0, 120));
    const mauvais = profils.filter(p => !/^[a-z0-9]{4,}$/i.test(p.invite_code || ""));
    const doublons = [...profils.reduce((m, p) => m.set(p.invite_code, (m.get(p.invite_code) || 0) + 1), new Map())]
      .filter(([, n]) => n > 1);
    if (mauvais.length) ko(`${mauvais.length} profil(s) sans code exploitable : ${mauvais.map(p => p.display_name).join(", ")} — leurs liens d'invitation ne marcheront jamais`);
    else ok(`les ${profils.length} profils ont un code valide`);
    if (doublons.length) ko(`codes en double : ${doublons.map(([c]) => c).join(", ")} — deux personnes s'ajouteraient le mauvais ami`);
    else ok("aucun code en double");
  } catch (e) {
    console.log("   ⏭  base injoignable — contrôle ignoré (" + String(e.message).slice(0, 60) + ")");
  }
}

// ── 3. L'ADRESSE DU LIEN ─────────────────────────────────────────────────────────
// Le piège vécu : une redirection posée pour un QR code renvoyait la racine de
// l'hôte vers l'App Store. Elle ne comparait que le CHEMIN, donc « /?invite=xxx »
// partait aussi — l'invitation disparaissait avant même d'atteindre l'app.
console.log("\n3. L'adresse du lien répond-elle vraiment ?");
const hotes = [HOTE_LIEN, "https://monacout.vercel.app", "https://monacout.com"].filter(Boolean);
for (const h of [...new Set(hotes)]) {
  const url = `${h}${h.endsWith("/") ? "" : "/"}?invite=test1234`;
  try {
    const r = await fetch(url, { redirect: "manual" });
    if (r.status >= 300 && r.status < 400) {
      const dest = r.headers.get("location") || "";
      ko(`${url} renvoie ${r.status} vers ${dest} — l'invitation est perdue en route`);
    } else if (r.status === 200) ok(`${url} sert bien l'app (200)`);
    else ko(`${url} répond ${r.status}`);
  } catch (e) {
    console.log(`   ⏭  ${url} injoignable (${String(e.message).slice(0, 40)})`);
  }
}

console.log(pb.length
  ? `\n🛑 ${pb.length} problème(s) sur la chaîne d'invitation.\n`
  : "\n✅ Chaîne d'invitation intacte : code → lien → adresse.\n");
process.exit(pb.length ? 1 : 0);
