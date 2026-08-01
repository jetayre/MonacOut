#!/usr/bin/env node
/**
 * MonacOut — ROBOT DE COMPLÉTION DÉTERMINISTE (sans LLM)
 *
 * Complète automatiquement src/data/events.js à partir de PrinciPocket, avec exactitude :
 *  1. scanne PrinciPocket (toutes les pages) → événements manquants (fenêtre 12 mois)
 *  2. pour chaque manquant, lit sa FICHE : titre (<h1>), lieu (1er lien /en/places/),
 *     date + heure (motif « <Jour> <J> <Mois> YYYY from HH:MM »)
 *  3. N'AJOUTE QUE si : lieu CONNU (table VENUES ci-dessous, avec link/phone officiels)
 *     ET heure présente ET pas déjà présent (dédup par DATE+LIEU et par TITRE).
 *  4. Recalcule le jour de la semaine par code (jamais celui de PrinciPocket) → règle 7.
 *  5. Ne touche QUE src/data/events.js. Le Policier + build + push sont faits ensuite par le CI.
 *
 * Tout ce qui n'est pas 100 % sûr est SKIPPÉ et écrit dans auto-complete-report.txt.
 * « Un événement manquant vaut mieux qu'un événement faux » (règle 17 de CLAUDE.md).
 *
 * Usage : node scripts/auto-complete-events.mjs   (exit 0 toujours — ne bloque jamais le CI)
 */
import https from 'https';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, '..', 'src', 'data', 'events.js');
const REPORT = join(__dirname, '..', 'auto-complete-report.txt');

const JOURS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const MOIS_FR = ['jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'août', 'sep', 'oct', 'nov', 'déc'];
const MON_EN = { january:0, february:1, march:2, april:3, may:4, june:5, july:6, august:7, september:8, october:9, november:10, december:11 };
const MON3 = { jan:0, feb:1, mar:2, apr:3, may:4, jun:5, jul:6, aug:7, sep:8, oct:9, nov:10, dec:11 };

// ── Table des LIEUX connus (link + phone OFFICIELS du lieu, quartier, catégorie par défaut) ──
// Le robot n'ajoute QUE les événements dont le lieu est ici (sinon : skip « lieu inconnu »).
// match = regex testée (insensible casse) sur le nom de lieu PrinciPocket.
const VENUES = [
  { match:/m[ée]diath[èe]que/i,            name:'Médiathèque Caroline',           quarter:'La Condamine', link:'https://www.mediatheque.mc/', phone:'+377 9898 8008', cat:'CONFÉRENCE' },
  { match:/grimaldi/i,                     name:'Grimaldi Forum',                 quarter:'Larvotto',     link:'https://www.grimaldiforum.com/', phone:'+377 9999 2000', cat:'CONCERT' },
  { match:/princesse grace|princess grace/i,name:'Théâtre Princesse Grace',        quarter:'Monte-Carlo',  link:'https://www.tpgmonaco.mc', phone:'+377 9325 3227', cat:'THÉÂTRE' },
  { match:/vari[ée]t[ée]s/i,               name:'Théâtre des Variétés',           quarter:'Monte-Carlo',  link:'', phone:'+377 9330 1861', cat:'SPECTACLE' },
  { match:/fort antoine/i,                 name:'Théâtre Fort Antoine',           quarter:'Monaco-Ville', link:'https://www.theatrefortantoine.com/', phone:'', cat:'THÉÂTRE' },
  { match:/muses/i,                        name:'Théâtre des Muses',              quarter:'Monte-Carlo',  link:'https://www.letheatredesmuses.com/', phone:'', cat:'THÉÂTRE' },
  { match:/rainier iii|auditorium/i,       name:'Auditorium Rainier III',         quarter:'Monte-Carlo',  link:'https://opmc.mc/en/concert/', phone:'+377 9200 1370', cat:'CONCERT' },
  { match:/garnier/i,                      name:'Salle Garnier',                  quarter:'Monte-Carlo',  link:'https://www.opera.mc/', phone:'+377 9200 1370', cat:'OPÉRA' },
  { match:/saint-charles|saint charles/i,  name:'Église Saint-Charles',           quarter:'Monte-Carlo',  link:'https://saintcharles.diocese.mc/', phone:'+377 9330 7490', cat:'CHANTS' },
  { match:/saint-martin|saint martin|sacr[ée]-c[œo]ur/i, name:'Église Saint-Martin', quarter:'Monaco', link:'https://saintmartin.diocese.mc', phone:'+377 9330 7526', cat:'CHANTS' },
  { match:/cath[ée]drale|saint-nicolas/i,  name:'Cathédrale de Monaco',           quarter:'Monaco-Ville', link:'https://www.maitrisecathedrale.mc/fr/prochaines-dates', phone:'+377 9999 1400', cat:'CHANTS' },
  { match:/paloma|sauber|nmnm|nouveau mus[ée]e/i, name:'NMNM',                    quarter:'Monaco',       link:'https://www.nmnm.mc/', phone:'', cat:'EXPOSITION' },
  { match:/oc[ée]anographique/i,           name:'Musée Océanographique',          quarter:'Monaco-Ville', link:'https://musee.oceano.org/', phone:'', cat:'ATELIER' },
  { match:/l[ée]o ferr[ée]/i,              name:'Espace Léo Ferré',               quarter:'Fontvieille',  link:'https://www.espaceleoferre.mc/', phone:'+377 9310 1210', cat:'CONCERT' },
  { match:/sporting|salle des [ée]toiles/i,name:'Salle des Étoiles',              quarter:'Larvotto',     link:'https://www.montecarlosbm.com/en/sporting-monte-carlo', phone:'+377 9806 7071', cat:'CONCERT' },
  { match:/99 sushi/i,                     name:'99 Sushi Bar',                   quarter:'Monaco',       link:'https://www.99sushibar.com/en/99-sushi-bar-monaco/', phone:'+377 9992 5102', cat:'APÉRO' },
  { match:/vivaldi/i,                      name:'Le Vivaldi',                     quarter:'La Condamine', link:'https://www.instagram.com/vivaldi_monaco/', phone:'+33 6 63 07 20 20', cat:'APÉRO' },
  { match:/brasserie de monaco|monaco brewery/i, name:'Brasserie de Monaco',      quarter:'La Condamine', link:'https://brasseriedemonaco.com', phone:'+377 9798 5120', cat:'SOIRÉE' },
  { match:/soci[ée]t[ée] nautique|aviron|rowing/i, name:'Restaurant de la Société Nautique', quarter:'La Condamine', link:'https://www.restaurantsocietenautique.club/', phone:'+377 9350 5130', cat:'BRUNCH' },
];
function findVenue(v) { for (const x of VENUES) if (x.match.test(v)) return x; return null; }

// ── Catégorie affinée par mots-clés du titre (sinon : catégorie par défaut du lieu) ──
function catFromTitle(title, def) {
  const t = title.toLowerCase();
  if (/messe|heure sainte|b[ée]n[ée]diction|pri[èe]re|c[aa]t[ée]|esprit-saint|chapelet|vĉ|vêpres|adoration/.test(t)) return 'CHANTS';
  if (/op[ée]ra/.test(t)) return 'OPÉRA';
  if (/cin[ée]ma|projection|film|s[ée]ance/.test(t)) return 'CINÉMA';
  if (/r[ée]cital|concert|live session|symph|philharmon|quatuor|jazz|musical/.test(t)) return 'CONCERT';
  if (/conf[ée]rence|rencontre|colloque|d[ée]bat/.test(t)) return 'CONFÉRENCE';
  if (/atelier|stage|workshop/.test(t)) return 'ATELIER';
  if (/th[éé][âa]tre|pi[èe]ce|com[ée]die/.test(t)) return 'THÉÂTRE';
  if (/exposition|vernissage/.test(t)) return 'EXPOSITION';
  return def;
}
const PAL = {
  'CONCERT':['linear-gradient(150deg,#385878,#506898,#283848)','#C0D8F4','🎵'],
  'OPÉRA':['linear-gradient(150deg,#6A1828,#8A3848,#500818)','#F4B0C0','🎭'],
  'THÉÂTRE':['linear-gradient(150deg,#5A1870,#7A3890,#400858)','#E0B0F8','🎭'],
  'CINÉMA':['linear-gradient(150deg,#1A2A4A,#2A3A5A,#0A1A3A)','#9FC3DC','🎬'],
  'ATELIER':['linear-gradient(150deg,#1A5A4A,#2A7A5A,#0A4A38)','#A0E8C8','🎨'],
  'CONFÉRENCE':['linear-gradient(150deg,#3A4A5A,#5A6A7A,#2A3A4A)','#C8D8E8','🎤'],
  'CHANTS':['linear-gradient(150deg,#5A4A2A,#7A6A3A,#3A2E18)','#E8D8A8','🙏'],
  'SPECTACLE':['linear-gradient(150deg,#8A5818,#B08838,#6A4808)','#F4D8A0','✨'],
  'EXPOSITION':['linear-gradient(150deg,#2A4A4A,#3A6A6A,#183838)','#A8E0E0','🖼️'],
};

// ── util réseau ──
function get(url) {
  return new Promise(r => {
    const rq = https.get(url, { headers:{'User-Agent':'MonacOut-AutoComplete/1.0'}, timeout:20000 }, res => {
      let h=''; res.on('data',c=>h+=c); res.on('end',()=>r(h));
    });
    rq.on('error',()=>r('')); rq.on('timeout',()=>{rq.destroy();r('');});
  });
}
const norm = s => (s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();

// ── source events.js : titres + (date+lieu) existants pour la DÉDUP ──
let src = readFileSync(FILE, 'utf8');
const existingTitles = new Set([...src.matchAll(/title:"([^"]+)"/g)].map(m => norm(m[1].replace(/\\n/g,' '))));
const existingDateVenue = new Set();
for (const m of src.matchAll(/date:"([^"]+)"[^}]*?subtitle:"([^"]*)"/g)) {
  existingDateVenue.add(norm(m[1]) + '|' + norm((m[2]||'').split(' · ')[0]));
}
const wordSets = [...existingTitles].map(t => new Set(t.split(' ').filter(w=>w.length>=4)));
function titleExists(candNorm) {
  if (candNorm.length < 4) return true;
  const cw = new Set(candNorm.split(' ').filter(w=>w.length>=4));
  for (const t of existingTitles) if (t.includes(candNorm) || candNorm.includes(t)) return true;
  for (const ws of wordSets) { let sh=0; for (const w of cw) if (ws.has(w)) sh++; if (sh >= (cw.size<=1?1:2)) return true; }
  return false;
}
const usedIds = new Set([...src.matchAll(/\{id:(\d+)/g)].map(m=>+m[1]));
let nextId = 700000; while (usedIds.has(nextId)) nextId++;   // bande dédiée robot : 7xxxxx

// ── scrape listing PrinciPocket ──
function fetchListing(page) {
  return get(`https://www.principocket.com/en/events?page=${page}`).then(html => {
    const hrefRe = /href="(\/en\/events\/[0-9a-f]{32}-[^"]+)"/g; const hrefs=[]; let m;
    while ((m=hrefRe.exec(html))!==null) hrefs.push(m[1]);
    return [...new Set(hrefs)];
  });
}

const report = [];
const added = [];
const today = new Date(); today.setHours(0,0,0,0);
const horizon = new Date(today); horizon.setMonth(horizon.getMonth()+12);

const slugs = new Set();
for (let p=1; p<=25; p++) { const s = await fetchListing(p); if (!s.length) break; s.forEach(x=>slugs.add(x)); }
report.push(`PrinciPocket : ${slugs.size} fiches scannées.`);

const rows = [];
for (const slug of slugs) {
  const titleSlug = norm(slug.replace(/^\/en\/events\/[0-9a-f]{32}-/,'').replace(/-/g,' '));
  if (titleExists(titleSlug)) continue;                 // déjà présent (pré-filtre rapide sur le titre du slug)
  const d = await get('https://www.principocket.com'+slug);
  if (!d) continue;
  const title = (d.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)||[])[1]?.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
  if (!title) continue;
  const places = [...d.matchAll(/href="\/en\/places\/[^"]+"[^>]*>([\s\S]*?)<\/a>/g)].map(x=>x[1].replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim()).filter(Boolean);
  const venueRaw = [...new Set(places)][0] || '';
  const venue = findVenue(venueRaw);
  // sessions : « Weekday D Month YYYY from HH:MM »
  const txt = d.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
  const sessRe = /(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s+(\d{1,2})\s+(\w+)\s+(\d{4})(?:\s+from\s+(\d{1,2}):(\d{2}))?/gi;
  let sm; const seen = new Set();
  while ((sm = sessRe.exec(txt)) !== null) {
    const D=+sm[2], mo=MON_EN[sm[3].toLowerCase()], Y=+sm[4], hh=sm[5], mm=sm[6];
    if (mo===undefined) continue;
    const dt = new Date(Y, mo, D); dt.setHours(0,0,0,0);
    if (dt < today || dt > horizon) continue;
    const key = `${Y}-${mo}-${D}`; if (seen.has(key)) continue; seen.add(key);
    const dateStr = `${JOURS[dt.getDay()]} ${D} ${MOIS_FR[mo]}`;      // jour recalculé par code (règle 7)
    // dédup fine par date+lieu
    if (!venue) { report.push(`  SKIP « ${title} » [${dateStr} ${Y}] — lieu inconnu (« ${venueRaw||'?'} »)`); continue; }
    if (!hh)    { report.push(`  SKIP « ${title} » [${dateStr} ${Y}] — heure inconnue`); continue; }
    const dvKey = norm(dateStr) + '|' + norm(venue.name);
    if (existingDateVenue.has(dvKey) || titleExists(norm(title))) { continue; }   // déjà présent (silencieux)
    // construit l'objet
    const cat = catFromTitle(title, venue.cat);
    const [bg, ac, emo] = PAL[cat] || PAL['CONCERT'];
    const time = `${hh.padStart(2,'0')}h${mm}`;
    const T = title.toUpperCase().replace(/"/g,'\\"');
    const safe = s => s.replace(/"/g,'\\"');
    const yr = Y >= 2027 ? `year:${Y},` : '';
    const link = venue.link ? `link:"${venue.link}",` : '';
    const phone = venue.phone ? `phone:"${venue.phone}",` : '';
    const desc = safe(`${title} — ${venue.name}, Monaco.`);
    rows.push(`  {id:${nextId},${yr}cat:"${cat}",date:"${dateStr}",time:"${time}",title:"${T}",subtitle:"${venue.name} · ${venue.quarter}",desc:"${desc}",descEn:"${desc}",free:false,hot:false,fallback:"${bg}",accent:"${ac}",emoji:"${emo}",${link}${phone}source:"${safe(venue.name)}",quarter:"${venue.quarter}"},`);
    added.push(`+ [${dateStr} ${Y}] ${title} @ ${venue.name} (${cat} ${time})`);
    existingDateVenue.add(dvKey);
    usedIds.add(nextId); do { nextId++; } while (usedIds.has(nextId));
  }
}

if (rows.length) {
  const marker = 'const _RAW = [\n';
  const i = src.indexOf(marker) + marker.length;
  const block = `  // ── AUTO-COMPLÉTION robot (PrinciPocket, lieu+date+heure vérifiés) ──\n${rows.join('\n')}\n`;
  src = src.slice(0, i) + block + src.slice(i);
  writeFileSync(FILE, src);
}

report.push('', `AJOUTÉS : ${added.length}`, ...added);
const out = report.join('\n') + '\n';
writeFileSync(REPORT, out);
console.log(out);
console.log(rows.length ? `\n✓ ${rows.length} événement(s) ajouté(s) par le robot (Le Policier + build valideront).` : '\nRien à ajouter (app déjà complète ou rien de 100 % sûr).');
process.exit(0);
