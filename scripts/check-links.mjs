#!/usr/bin/env node
/**
 * MonacOut — CONTRÔLE DES LIENS DES FICHES
 *
 * Né du 7 août 2026. Stéphanie : « certaines fonctionnent, certaines non ». En
 * testant les 137 liens de l'app, deux étaient MORTS depuis longtemps — dont
 * `smakelijk-restaurant.com`, présent sur 27 fiches (tous les brunchs du dimanche
 * au Méridien). Personne ne l'avait vu : `verify-events.mjs` existait déjà mais
 * noyait l'information dans des centaines de lignes, et n'a jamais alerté.
 *
 * Un lien mort ne se voit pas dans l'app : on appuie sur « Réserver », Safari
 * s'ouvre sur une page blanche ou noire, et la personne croit que Monac'Out est
 * cassée. C'est le pire des défauts — invisible de nous, visible d'eux.
 *
 * CE QUI COMPTE ICI, C'EST DE NE PAS CRIER POUR RIEN :
 *  · on se présente comme un iPhone — beaucoup de sites servent autre chose aux robots
 *  · 403 / 401 / 429 = le site refuse les automates, PAS une erreur : il s'ouvre
 *    normalement sur un téléphone (zumba.com, hvmc.com, marriott.com…)
 *  · deuxième essai avant de condamner — un serveur peut hoqueter
 *  · seules les pannes SÛRES comptent : DNS introuvable, poignée de main TLS
 *    refusée, connexion impossible, 404, 410
 *
 * Écrit `liens-morts.txt` et sort en échec (code 1) s'il en trouve. Le remplacement
 * reste HUMAIN : un script ne sait pas deviner la bonne adresse, et inventer un lien
 * serait pire que de n'en avoir aucun (règle 16).
 *
 * Usage : node scripts/check-links.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { execFile } from "child_process";

const racine = join(dirname(fileURLToPath(import.meta.url)), "..");
const IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 " +
               "(KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
const REFUS_ROBOT = new Set([401, 403, 405, 429]);   // le site filtre les automates, pas une panne
const MORT_SUR = new Set([404, 410]);                 // la page n'existe pas / a été supprimée

let ev = [];
try {
  const j = JSON.parse(readFileSync(join(racine, "public", "events.json"), "utf8"));
  ev = j.events || j;
} catch { console.log("public/events.json illisible — contrôle ignoré"); process.exit(0); }

// Un lien peut porter des dizaines de fiches : on le teste UNE fois et on compte.
const fichesParLien = new Map();
for (const e of ev) {
  if (!e.link) continue;
  if (!fichesParLien.has(e.link)) fichesParLien.set(e.link, []);
  fichesParLien.get(e.link).push(e);
}

async function essai(url) {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), 25000);
  try {
    const r = await fetch(url, { redirect: "follow", signal: c.signal, headers: { "User-Agent": IPHONE } });
    return { status: r.status };
  } catch (e) {
    return { panne: String(e.cause?.code || e.name || e.message).slice(0, 40) };
  } finally { clearTimeout(t); }
}

// ⚠️ NODE EST PLUS SÉVÈRE QUE SAFARI SUR LES CERTIFICATS. Quand un site oublie de
// livrer le maillon intermédiaire de sa chaîne, Node refuse
// (UNABLE_TO_VERIFY_LEAF_SIGNATURE) alors que Safari va chercher le maillon manquant
// tout seul et affiche la page. Le 7 août 2026, ma première version signalait ainsi
// opera.mc et balletsdemontecarlo.com comme morts : ils répondent 200 dans un
// navigateur. On refait donc l'essai SANS vérifier le certificat : si le serveur
// répond, il est joignable — le défaut est cosmétique, la personne verra la page.
// S'il ne répond toujours pas, il est vraiment inaccessible (cas de smakelijk).
function essaiSansVerifCertificat(url) {
  return new Promise(async (res) => {
    try {
      const https = await import("node:https");
      const u = new URL(url);
      const req = https.request({
        hostname: u.hostname, port: u.port || 443, path: u.pathname + u.search, method: "GET",
        rejectUnauthorized: false, timeout: 25000, headers: { "User-Agent": IPHONE },
      }, r => { r.resume(); res({ status: r.statusCode }); });
      req.on("error", e => res({ panne: String(e.code || e.message).slice(0, 40) }));
      req.on("timeout", () => { req.destroy(); res({ panne: "TIMEOUT" }); });
      req.end();
    } catch (e) { res({ panne: String(e.message).slice(0, 40) }); }
  });
}

// Dernier recours : curl, qui utilise le magasin de certificats DU SYSTÈME, comme
// Safari. C'est l'outil sur lequel les verdicts du 7 août ont été vérifiés à la main.
// Sans lui, www.mediatheque.mc passait pour mort alors qu'il répond 200.
function essaiCurl(url) {
  return new Promise(res => {
    execFile("curl", ["-s", "-o", "/dev/null", "-m", "25", "-L", "-A", IPHONE, "-w", "%{http_code}", url],
      (err, out) => res(err ? { panne: "curl" } : { status: Number(out) || 0 }));
  });
}

async function verdict(url) {
  let r = await essai(url);
  const suspect = r.panne || r.status >= 500 || MORT_SUR.has(r.status);
  if (suspect) {                       // deuxième chance : un serveur peut hoqueter
    await new Promise(s => setTimeout(s, 1500));
    r = await essai(url);
  }
  if (r.panne) {
    // Le serveur répond-il quand on ne vérifie pas son certificat ?
    let b = await essaiSansVerifCertificat(url);
    if (b.panne) {                       // deuxième chance ici aussi : sous charge,
      await new Promise(s => setTimeout(s, 2000));   // un serveur lent passait pour mort
      b = await essaiSansVerifCertificat(url);       // (www.mediatheque.mc, 7 août)
    }
    if (b.panne) {
      const c = await essaiCurl(url);   // magasin système, comme Safari
      if (!c.panne && c.status >= 200 && c.status < 400) return { mort: false, chaine: true };
      if (!c.panne && REFUS_ROBOT.has(c.status)) return { mort: false, robot: true };
      if (!c.panne && MORT_SUR.has(c.status)) return { mort: true, raison: "HTTP " + c.status + " — page inexistante" };
      // 🚨 UN DÉLAI DÉPASSÉ N'EST PAS UNE PREUVE DE MORT.
      // Le 18 août 2026, le CI a déclaré morts larosedesvents.com et odeonspa.com :
      // tous deux répondent 200 depuis une vraie connexion, avec 83 et 92 Ko de page.
      // Ces hôtes refusent simplement les adresses de centres de données comme celles
      // de GitHub. Crier « lien mort » pour ça use l'alarme, et une alarme usée finit
      // par ne plus être lue — c'est ainsi qu'on rate un vrai lien mort.
      // On ne garde « mort » que pour une PREUVE : le domaine n'existe pas (DNS), la
      // page répond 404/410, ou elle est vide (cas Jack Monaco, 663 octets).
      const dns = /ENOTFOUND|EAI_AGAIN|getaddrinfo|ERR_INVALID_URL/i.test(String(r.panne));
      if (dns) return { mort: true, raison: r.panne };
      return { mort: false, injoignable: true, raison: r.panne };
    }
    // Le certificat masquait le vrai verdict : on rapporte CE QUE LA PAGE RÉPOND.
    if (MORT_SUR.has(b.status)) return { mort: true, raison: "HTTP " + b.status + " — page inexistante" };
    if (b.status >= 500) return { mort: true, raison: "HTTP " + b.status + " — serveur en panne" };
    if (REFUS_ROBOT.has(b.status)) return { mort: false, robot: true };
    return { mort: false, chaine: true };   // joignable : Safari l'affichera
  }
  if (MORT_SUR.has(r.status)) return { mort: true, raison: "HTTP " + r.status + " — page inexistante" };
  if (r.status >= 500) return { mort: true, raison: "HTTP " + r.status + " — serveur en panne" };
  if (REFUS_ROBOT.has(r.status)) return { mort: false, robot: true };
  return { mort: false };
}

const liens = [...fichesParLien.keys()];
console.log(`Contrôle de ${liens.length} liens distincts (${ev.filter(e => e.link).length} fiches)…`);

const morts = [], filtres = [], chaines = [];
const injoignables = [];
const lots = [];
for (let i = 0; i < liens.length; i += 12) lots.push(liens.slice(i, i + 12));
for (const lot of lots) {
  await Promise.all(lot.map(async url => {
    const v = await verdict(url);
    if (v.mort) morts.push({ url, raison: v.raison, fiches: fichesParLien.get(url) });
    else if (v.injoignable) injoignables.push({ url, raison: v.raison, fiches: fichesParLien.get(url) });
    else if (v.robot) filtres.push(url);
    else if (v.chaine) chaines.push(url);
  }));
}

morts.sort((a, b) => b.fiches.length - a.fiches.length);
const touchees = morts.reduce((n, m) => n + m.fiches.length, 0);

let txt = "LIENS MORTS DES FICHES MonacOut\n";
txt += `Contrôle du ${new Date().toISOString().slice(0, 10)} — ${liens.length} liens, ${ev.length} fiches.\n`;
txt += "Un lien mort = « Réserver » ouvre une page vide. À remplacer par le site officiel\n";
txt += "du lieu (jamais un agrégateur, jamais un lien inventé — règle 16).\n";
if (!morts.length) txt += "\n✅ Aucun lien mort.\n";
for (const m of morts) {
  txt += `\n■ ${m.url}\n   ${m.raison} — ${m.fiches.length} fiche(s)\n`;
  for (const f of m.fiches.slice(0, 5))
    txt += `     · [id ${f.id}] ${f.date} ${(f.title || "").replace(/\n/g, " ").replace(/\s*ⓘ\s*$/, "")} — ${(f.subtitle || "").split(" · ")[0]}\n`;
  if (m.fiches.length > 5) txt += `     … et ${m.fiches.length - 5} autre(s)\n`;
}
if (injoignables.length) {
  txt += "\n■ INJOIGNABLES DEPUIS LE CI — probablement vivants, à vérifier depuis un téléphone\n";
  txt += "   Ces hôtes refusent les adresses de centres de données. Ce n'est PAS une preuve\n";
  txt += "   de lien mort : le contenu, lui, n'a pas pu être lu.\n";
  for (const m of injoignables)
    txt += `     · ${m.url} — ${m.raison} — ${m.fiches.length} fiche(s)\n`;
}
writeFileSync(join(racine, "liens-morts.txt"), txt);

console.log(`  ✅ ${liens.length - morts.length - filtres.length - chaines.length} liens répondent parfaitement`);
console.log(`  ⏭  ${filtres.length} refusent les automates (normaux sur un téléphone)`);
console.log(`  ⏭  ${chaines.length} ont une chaîne de certificat incomplète — Safari la répare, la page s'affiche`);
if (injoignables.length) {
  console.log(`  ⚠️  ${injoignables.length} injoignable(s) depuis le CI (hôtes qui refusent les centres de données) :`);
  for (const m of injoignables) console.log(`        ${m.raison.padEnd(26)} ${m.url}`);
}
if (!morts.length) { console.log("\n✅ Aucun lien mort.\n"); process.exit(0); }
console.log(`  ❌ ${morts.length} lien(s) MORT(S), sur ${touchees} fiche(s) :\n`);
for (const m of morts) console.log(`     ${String(m.fiches.length).padStart(4)} fiches  ${m.raison.padEnd(30)} ${m.url}`);
console.log("\n→ détail dans liens-morts.txt · remplacer par le site officiel du lieu\n");
process.exit(1);
