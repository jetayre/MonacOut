// Saison lyrique OPMC 2026-27 — données EXACTES vérifiées date par date sur opera.mc (site officiel).
// Lieu et heure confirmés par représentation. Date privée (19 nov, invitation Palais) EXCLUE.
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const FILE = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'events.js');

const OPERA_BG = 'linear-gradient(150deg,#6A1828,#8A3848,#500818)', OPERA_AC = '#F4B0C0';
const CONC_BG  = 'linear-gradient(150deg,#385878,#506898,#283848)', CONC_AC = '#C0D8F4';
const NL = '\\n';
let id = 4700;
const rows = [];

// v = { titre, desc, descEn, cat, emoji, link, salle }
function add(date, year, time, v, hot) {
  const y = year >= 2027 ? `year:${year},` : '';
  const bg = v.cat === 'CONCERT' ? CONC_BG : OPERA_BG;
  const ac = v.cat === 'CONCERT' ? CONC_AC : OPERA_AC;
  const sub = `${v.salle} · Monte-Carlo`;
  rows.push(`  {id:${id++},${y}cat:"${v.cat}",date:"${date}",time:"${time}",title:"${v.titre}",subtitle:"${sub}",desc:"${v.desc}",descEn:"${v.descEn}",free:false,hot:${!!hot},fallback:"${bg}",accent:"${ac}",emoji:"${v.emoji}",link:"${v.link}",source:"Opéra de Monte-Carlo",quarter:"Monte-Carlo"},`);
}

const G = 'Grimaldi Forum', SG = 'Salle Garnier';
const L = s => `https://www.opera.mc/en/seasons/26-27/${s}`;

// ── NOVEMBRE 2026 ──
add('Sam 7 nov', 2026, '19h00', {cat:'CONCERT',emoji:'🎤',salle:SG,link:L('jonathan-tetelman'),titre:`RÉCITAL${NL}JONATHAN${NL}TETELMAN`,desc:"Récital du ténor Jonathan Tetelman à l'Opéra de Monte-Carlo, l'une des voix les plus acclamées de sa génération.",descEn:"Recital by tenor Jonathan Tetelman at the Opéra de Monte-Carlo, one of the most acclaimed voices of his generation."}, true);
const porgy={cat:'OPÉRA',emoji:'🎭',salle:G,link:L('porgy-and-bess'),titre:`PORGY${NL}AND BESS${NL}GERSHWIN`,desc:"L'opéra culte de George Gershwin au Grimaldi Forum : passion, jazz et gospel dans Catfish Row.",descEn:"George Gershwin's iconic opera at the Grimaldi Forum: passion, jazz and gospel in Catfish Row."};
add('Dim 15 nov', 2026, '15h00', porgy, true);
add('Sam 21 nov', 2026, '20h00', porgy, true);

// ── DÉCEMBRE 2026 — La Vie Parisienne (Salle Garnier) ──
const vie={cat:'OPÉRA',emoji:'🎭',salle:SG,link:L('la-vie-parisienne'),titre:`LA VIE${NL}PARISIENNE${NL}OFFENBACH`,desc:"L'opéra-bouffe d'Offenbach dans une production pétillante aux costumes de Christian Lacroix. Esprit parisien à la Salle Garnier.",descEn:"Offenbach's opéra-bouffe in a sparkling production with costumes by Christian Lacroix. Parisian wit at the Salle Garnier."};
add('Mer 23 déc', 2026, '20h00', vie, true);
add('Sam 26 déc', 2026, '20h00', vie, false);
add('Dim 27 déc', 2026, '15h00', vie, false);
add('Mar 29 déc', 2026, '20h00', vie, false);
add('Jeu 31 déc', 2026, '18h00', vie, true);

// ── JANVIER 2027 — L'Italiana in Algeri (Salle Garnier) + récital Bartoli/Fagioli ──
const ital={cat:'OPÉRA',emoji:'🎭',salle:SG,link:L('litaliana-in-algeri'),titre:`L'ITALIANA${NL}IN ALGERI${NL}ROSSINI`,desc:"« L'Italienne à Alger » de Rossini : comédie lyrique virtuose et bel canto à l'Opéra de Monte-Carlo.",descEn:"Rossini's 'The Italian Girl in Algiers': a virtuosic comic opera and bel canto at the Opéra de Monte-Carlo."};
add('Dim 24 jan', 2027, '15h00', ital, true);
add('Mar 26 jan', 2027, '20h00', ital, false);
add('Jeu 28 jan', 2027, '20h00', ital, false);
add('Sam 30 jan', 2027, '20h00', ital, false);
add('Ven 29 jan', 2027, '20h00', {cat:'CONCERT',emoji:'🎤',salle:SG,link:L('cecilia-bartoli-franco-fagioli'),titre:`RÉCITAL${NL}BARTOLI &${NL}FAGIOLI`,desc:"Récital exceptionnel de Cecilia Bartoli et du contre-ténor Franco Fagioli : virtuosité baroque à la Salle Garnier.",descEn:"Exceptional recital by Cecilia Bartoli and countertenor Franco Fagioli: baroque virtuosity at the Salle Garnier."}, true);

// ── FÉVRIER 2027 — Fidelio (Grimaldi) + récital Grigorian + Rigoletto (Salle Garnier) ──
add('Sam 6 fév', 2027, '19h00', {cat:'OPÉRA',emoji:'🎭',salle:G,link:L('fidelio'),titre:`FIDELIO${NL}BEETHOVEN${NL}VERSION CONCERT`,desc:"L'unique opéra de Beethoven en version concert au Grimaldi Forum : un hymne à la liberté et à l'amour.",descEn:"Beethoven's only opera in concert version at the Grimaldi Forum: a hymn to freedom and love."}, true);
add('Dim 7 fév', 2027, '15h00', {cat:'CONCERT',emoji:'🎤',salle:SG,link:L('asmik-grigorian'),titre:`RÉCITAL${NL}ASMIK${NL}GRIGORIAN`,desc:"Récital de la soprano Asmik Grigorian, star de la scène lyrique internationale, à l'Opéra de Monte-Carlo.",descEn:"Recital by soprano Asmik Grigorian, a star of the international opera scene, at the Opéra de Monte-Carlo."}, true);
const rigo={cat:'OPÉRA',emoji:'🎭',salle:SG,link:L('rigoletto'),titre:`RIGOLETTO${NL}VERDI`,desc:"Le chef-d'œuvre de Verdi : malédiction, amour paternel et tragédie du bouffon Rigoletto, à la Salle Garnier.",descEn:"Verdi's masterpiece: curse, a father's love and the tragedy of the jester Rigoletto, at the Salle Garnier."};
add('Dim 21 fév', 2027, '15h00', rigo, true);
add('Mar 23 fév', 2027, '20h00', rigo, false);
add('Jeu 25 fév', 2027, '20h00', rigo, false);
add('Dim 28 fév', 2027, '15h00', rigo, false);

// ── AVRIL 2027 — Siegfried + Il ritorno d'Ulisse (Salle Garnier) ──
const sieg={cat:'OPÉRA',emoji:'🎭',salle:SG,link:L('siegfried'),titre:`SIEGFRIED${NL}WAGNER`,desc:"Troisième journée de « L'Anneau du Nibelung » de Wagner. Une fresque épique à l'Opéra de Monte-Carlo.",descEn:"The third part of Wagner's 'Ring of the Nibelung'. An epic saga at the Opéra de Monte-Carlo."};
add('Lun 5 avr', 2027, '18h00', sieg, true);
add('Jeu 8 avr', 2027, '18h00', sieg, false);
add('Dim 11 avr', 2027, '15h00', sieg, false);
add('Jeu 15 avr', 2027, '18h00', sieg, false);
add('Mar 13 avr', 2027, '20h00', {cat:'OPÉRA',emoji:'🎭',salle:SG,link:L('il-ritorno-dulisse-in-patria'),titre:`IL RITORNO${NL}D'ULISSE${NL}MONTEVERDI`,desc:"« Le Retour d'Ulysse dans sa patrie » de Monteverdi, en version marionnettes. Un joyau baroque à la Salle Garnier.",descEn:"Monteverdi's 'The Return of Ulysses to his Homeland', in a puppet version. A baroque gem at the Salle Garnier."}, true);

let s = readFileSync(FILE, 'utf8');
const marker = 'const _RAW = [\n';
const i = s.indexOf(marker) + marker.length;
const block = '  // ── SAISON LYRIQUE OPMC 2026-27 (vérifié date par date sur opera.mc) ──\n' + rows.join('\n') + '\n';
s = s.slice(0, i) + block + s.slice(i);
writeFileSync(FILE, s);
console.log(`✓ ${rows.length} événements OPMC insérés (ids 4700-${id-1}).`);
