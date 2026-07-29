// Lot 2 — religieux (paroisse), Vuelta, Soirées Musicales Estivales, conférences pro.
// Lieux/heures vérifiés (diocese.mc, mairie.mc, visitmonaco, jds). Jour de semaine auto-vérifié (throw si faux). IDs 4744+.
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const FILE = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'events.js');
const NL = '\\n';
const JOURS = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
const MOIS = {jan:0,'fév':1,mar:2,avr:3,mai:4,juin:5,juil:6,'août':7,sep:8,oct:9,nov:10,'déc':11};

const PAL = {
  'CHANTS':     ['linear-gradient(150deg,#5A4A2A,#7A6A3A,#3A2E18)', '#E8D8A8'],
  'SPORT':      ['linear-gradient(150deg,#1A5A3A,#2A7A4A,#0A3A28)', '#A0E8B8'],
  'CONCERT':    ['linear-gradient(150deg,#385878,#506898,#283848)', '#C0D8F4'],
  'CONFÉRENCE': ['linear-gradient(150deg,#3A4A5A,#5A6A7A,#2A3A4A)', '#C8D8E8'],
};
let id = 4744;
const rows = [];
function add(e) {
  // vérif jour de semaine
  const [jjj, dd, mmm] = e.date.split(' ');
  const y = e.year || 2026;
  const real = JOURS[new Date(y, MOIS[mmm], +dd).getDay()];
  if (real !== jjj) throw new Error(`JOUR FAUX: "${e.date}" devrait être ${real} (${e.title.replace(/\\n/g,' ')})`);
  const [bg, ac] = PAL[e.cat];
  const yr = e.year ? `year:${e.year},` : '';
  const phone = e.phone ? `phone:"${e.phone}",` : '';
  const link = e.link ? `link:"${e.link}",` : '';
  rows.push(`  {id:${id++},${yr}cat:"${e.cat}",date:"${e.date}",time:"${e.time}",title:"${e.title}",subtitle:"${e.sub}",desc:"${e.desc}",descEn:"${e.descEn}",free:${!!e.free},hot:${!!e.hot},fallback:"${bg}",accent:"${ac}",emoji:"${e.emoji}",${link}${phone}source:"${e.source}",quarter:"${e.quarter}"},`);
}

// ── RELIGIEUX — Paroisse Saint-Charles (Heure Sainte 20h00) ──
const SC = { link:'https://saintcharles.diocese.mc/', phone:'+377 9330 7490', source:'Paroisse Saint-Charles', quarter:'Monte-Carlo', sub:'Église Saint-Charles · Monte-Carlo' };
for (const d of ['Mar 4 août','Mar 1 sep','Mar 6 oct','Mar 3 nov','Mar 1 déc'])
  add({cat:'CHANTS',date:d,time:'20h00',title:`HEURE${NL}SAINTE`,...SC,emoji:'🙏',desc:"Heure Sainte : temps d'adoration et de prière à l'église Saint-Charles.",descEn:"Holy Hour: a time of adoration and prayer at Saint-Charles church."});
// Bénédiction des Malades (17h15)
for (const d of ['Jeu 20 août','Jeu 17 sep','Jeu 15 oct','Jeu 19 nov','Jeu 17 déc'])
  add({cat:'CHANTS',date:d,time:'17h15',title:`BÉNÉDICTION${NL}DES${NL}MALADES`,...SC,emoji:'🙏',desc:"Célébration et bénédiction des malades à l'église Saint-Charles.",descEn:"Celebration and blessing of the sick at Saint-Charles church."});
// Messes pour les victimes
add({cat:'CHANTS',date:'Sam 28 nov',time:'17h00',title:`MESSE${NL}VICTIMES${NL}DU SIDA`,link:'https://saintmartin.diocese.mc',phone:'+377 9330 7526',source:'Paroisse Saint-Martin',quarter:'Monaco',sub:'Église Saint-Martin · Monaco',emoji:'🙏',desc:"Conférence et messe pour les victimes du SIDA et pour la recherche, à l'église Saint-Martin.",descEn:"Conference and Mass for AIDS victims and for research, at Saint-Martin church."});
add({cat:'CHANTS',year:2027,date:'Sam 30 jan',time:'17h00',title:`MESSE${NL}VICTIMES${NL}DU CANCER`,...SC,emoji:'🙏',desc:"Conférence et messe pour toutes les victimes du cancer et pour la recherche, à l'église Saint-Charles.",descEn:"Conference and Mass for all cancer victims and for research, at Saint-Charles church."});
// Grandes fêtes diocésaines
add({cat:'CHANTS',date:'Sam 21 nov',time:'09h45',title:`FÊTE${NL}DU CATÉ${NL}2026`,link:'https://saintcharles.diocese.mc/catechisme',source:'Diocèse de Monaco',quarter:'Monte-Carlo',sub:'Auditorium Rainier III · Monte-Carlo',emoji:'⛪',desc:"Fête du catéchisme 2026 du diocèse de Monaco, à l'Auditorium Rainier III.",descEn:"Diocese of Monaco 2026 catechism celebration, at the Auditorium Rainier III."});
add({cat:'CHANTS',year:2027,date:'Sam 8 mai',time:'09h30',title:`FÊTE DE${NL}L'ESPRIT-${NL}SAINT`,link:'https://www.maitrisecathedrale.mc/fr/prochaines-dates',phone:'+377 9999 1400',source:'Cathédrale de Monaco',quarter:'Monaco-Ville',sub:'Cathédrale · Monaco-Ville',emoji:'⛪',desc:"Fête de l'Esprit-Saint 2027 célébrée à la Cathédrale Notre-Dame-Immaculée de Monaco.",descEn:"2027 Feast of the Holy Spirit celebrated at Monaco's Notre-Dame-Immaculée Cathedral."});

// ── VUELTA 2026 — Grand Départ à Monaco ──
add({cat:'SPORT',date:'Sam 22 août',time:'En journée',title:`LA VUELTA${NL}ÉTAPE 1${NL}CONTRE-LA-MONTRE`,link:'https://www.lavuelta.es/en',source:'La Vuelta',quarter:'Monte-Carlo',sub:'Départ Place du Casino · Monte-Carlo',hot:true,emoji:'🚴',desc:"Grand Départ historique de la Vuelta à Monaco : contre-la-montre individuel dans les rues de la Principauté, départ Place du Casino.",descEn:"Historic Grand Départ of the Vuelta in Monaco: individual time trial through the streets of the Principality, starting at Place du Casino."});
add({cat:'SPORT',date:'Dim 23 août',time:'En journée',title:`LA VUELTA${NL}ÉTAPE 2${NL}GRAND DÉPART`,link:'https://www.lavuelta.es/en',source:'La Vuelta',quarter:'Monaco',sub:'Départ Jardin Exotique · Monaco',hot:true,emoji:'🚴',desc:"2ᵉ étape de la Vuelta 2026 : départ fictif au Palais Princier puis vrai départ au Jardin Exotique, direction la France (Monaco → Manosque).",descEn:"Stage 2 of the 2026 Vuelta: dummy start at the Prince's Palace then the real start at the Exotic Garden, heading into France (Monaco → Manosque)."});

// ── SOIRÉES MUSICALES ESTIVALES — Square Gastaud, gratuit, 19h30 ──
const SM = { link:'https://www.mairie.mc/programme-estival-2026', phone:'+377 9315 2828', source:'Mairie de Monaco', quarter:'La Condamine', sub:'Square Gastaud · La Condamine', free:true };
add({cat:'CONCERT',date:'Mer 5 août',time:'19h30',title:`SOIRÉES${NL}MUSICALES${NL}BELLA ITALIA`,...SM,emoji:'🎶',desc:"Soirée musicale estivale gratuite « Bella Italia » au Square Gastaud, sons italiens en plein air.",descEn:"Free summer musical evening 'Bella Italia' at Square Gastaud, Italian sounds outdoors."});
add({cat:'CONCERT',date:'Mer 19 août',time:'19h30',title:`SOIRÉES${NL}MUSICALES${NL}EXIT`,...SM,emoji:'🎶',desc:"Soirée musicale estivale gratuite avec le groupe Exit au Square Gastaud, pop-rock en plein air.",descEn:"Free summer musical evening with the band Exit at Square Gastaud, open-air pop-rock."});

// ── CONFÉRENCES PRO (Grimaldi Forum) ──
const GF = { link:'https://www.grimaldiforum.com/', phone:'+377 9999 2000', source:'Grimaldi Forum', quarter:'Larvotto', sub:'Grimaldi Forum · Larvotto' };
add({cat:'CONFÉRENCE',date:'Ven 9 oct',time:'Journée',title:`LES${NL}ASSISES${NL}SÉCURITÉ`,...GF,emoji:'🔒',desc:"« Les Assises » : le grand rendez-vous de la cybersécurité et des systèmes d'information, au Grimaldi Forum.",descEn:"'Les Assises': the major cybersecurity and information systems event, at the Grimaldi Forum."});
add({cat:'CONFÉRENCE',date:'Mar 27 oct',time:'Journée',title:`BNI${NL}NATIONAL${NL}CONFERENCE`,...GF,emoji:'🤝',desc:"BNI France & French-speaking Belgium National Conference, réseau d'affaires, au Grimaldi Forum.",descEn:"BNI France & French-speaking Belgium National Conference, business networking, at the Grimaldi Forum."});
add({cat:'CONFÉRENCE',date:'Ven 30 oct',time:'Journée',title:`BNI GLOBAL${NL}CONVENTION${NL}2026`,...GF,emoji:'🤝',desc:"2026 BNI Global Convention : le grand rassemblement mondial du réseau d'affaires BNI, au Grimaldi Forum.",descEn:"2026 BNI Global Convention: the worldwide gathering of the BNI business network, at the Grimaldi Forum."});
add({cat:'CONFÉRENCE',date:'Mer 4 nov',time:'Journée',title:`CONFÉRENCE${NL}MINISTRES${NL}DU SPORT`,...GF,emoji:'🏅',desc:"19ᵉ Conférence des ministres responsables du sport, au Grimaldi Forum de Monaco.",descEn:"19th Conference of Ministers Responsible for Sport, at the Grimaldi Forum in Monaco."});
add({cat:'CONFÉRENCE',year:2027,date:'Jeu 25 fév',time:'Journée',title:`THE${NL}SUMMIT${NL}FORBES`,...GF,emoji:'⭐',desc:"The Summit (Forbes Travel Guide) : rencontre internationale de l'excellence hôtelière, au Grimaldi Forum.",descEn:"The Summit (Forbes Travel Guide): the international gathering of hospitality excellence, at the Grimaldi Forum."});

let s = readFileSync(FILE, 'utf8');
const marker = 'const _RAW = [\n';
const i = s.indexOf(marker) + marker.length;
const block = '  // ── LOT 2 : religieux, Vuelta, Soirées Musicales, conférences pro (vérifiés) ──\n' + rows.join('\n') + '\n';
s = s.slice(0, i) + block + s.slice(i);
writeFileSync(FILE, s);
console.log(`✓ ${rows.length} événements insérés (ids 4744-${id-1}). Tous les jours de semaine vérifiés ✅`);
