// Lot de complétion — événements PrinciPocket vérifiés (lieu + date + heure confirmés sur la fiche).
// Jours de la semaine vérifiés par code. IDs 4724+ (4700-4723 = opéras). Insère dans _RAW de events.js.
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const FILE = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'events.js');
const NL = '\\n';

// palettes par catégorie
const PAL = {
  'CONCERT':    ['linear-gradient(150deg,#385878,#506898,#283848)', '#C0D8F4'],
  'OPÉRA':      ['linear-gradient(150deg,#6A1828,#8A3848,#500818)', '#F4B0C0'],
  'THÉÂTRE':    ['linear-gradient(150deg,#5A1870,#7A3890,#400858)', '#E0B0F8'],
  'CINÉMA':     ['linear-gradient(150deg,#1A2A4A,#2A3A5A,#0A1A3A)', '#9FC3DC'],
  'ATELIER':    ['linear-gradient(150deg,#1A5A4A,#2A7A5A,#0A4A38)', '#A0E8C8'],
  'CONFÉRENCE': ['linear-gradient(150deg,#3A4A5A,#5A6A7A,#2A3A4A)', '#C8D8E8'],
  'SPECTACLE':  ['linear-gradient(150deg,#8A5818,#B08838,#6A4808)', '#F4D8A0'],
};

let id = 4724;
const rows = [];
function add(e) {
  const [bg, ac] = PAL[e.cat];
  const y = e.year ? `year:${e.year},` : '';
  const free = e.free ? 'true' : 'false';
  const hot = e.hot ? 'true' : 'false';
  const phone = e.phone ? `phone:"${e.phone}",` : '';
  const link = e.link ? `link:"${e.link}",` : '';
  rows.push(`  {id:${id++},${y}cat:"${e.cat}",date:"${e.date}",time:"${e.time}",title:"${e.title}",subtitle:"${e.sub}",desc:"${e.desc}",descEn:"${e.descEn}",free:${free},hot:${hot},fallback:"${bg}",accent:"${ac}",emoji:"${e.emoji}",${link}${phone}source:"${e.source}",quarter:"${e.quarter}"},`);
}

const MED = { link:'https://www.mediatheque.mc/', phone:'+377 9898 8008', source:'Médiathèque de Monaco', quarter:'La Condamine', sub:'Médiathèque Caroline · La Condamine' };
const GRI = { link:'https://www.grimaldiforum.com/', source:'Grimaldi Forum', quarter:'Larvotto', sub:'Grimaldi Forum · Larvotto' };
const TPG = { link:'https://www.tpgmonaco.mc', phone:'+377 9325 3227', source:'Théâtre Princesse Grace', quarter:'Monte-Carlo', sub:'Théâtre Princesse Grace · Monte-Carlo' };
const AUD = { link:'https://opmc.mc/en/concert/', phone:'+377 9200 1370', source:'Opéra de Monte-Carlo', quarter:'Monte-Carlo', sub:'Auditorium Rainier III · Monte-Carlo' };

// ── ÉTÉ 2026 ──
add({cat:'CINÉMA',date:'Jeu 30 juil',time:'15h00',title:`CINÉMA D'ÉTÉ${NL}LES${NL}MUSICIENS`,...MED,free:true,emoji:'🎬',desc:"Projection du film « Les Musiciens » de Grégory Magne dans le cadre du cinéma d'été de la Médiathèque.",descEn:"Screening of Grégory Magne's film 'Les Musiciens' as part of the Média­thèque's summer cinema."});
add({cat:'SPECTACLE',date:'Sam 1 août',time:'22h00',title:`SOIRÉE${NL}FEUX${NL}D'ARTIFICE`,link:'https://www.mairie.mc/les-soirees-feux-dartifice-au-quai-albert-1er',phone:'+377 9315 2828',source:'Mairie de Monaco',quarter:'La Condamine',sub:'Quai Albert Ier · La Condamine',free:true,emoji:'🎆',desc:"Grande soirée pyrotechnique au-dessus du port Hercule. Spectacle gratuit en accès libre sur le quai.",descEn:"Grand fireworks evening over Port Hercule. Free open-air show along the quay."});
add({cat:'CINÉMA',date:'Jeu 6 août',time:'15h00',title:`CINÉMA D'ÉTÉ${NL}A REAL${NL}PAIN`,...MED,free:true,emoji:'🎬',desc:"Projection du film « A Real Pain » de Jesse Eisenberg, cinéma d'été de la Médiathèque.",descEn:"Screening of Jesse Eisenberg's 'A Real Pain', Média­thèque summer cinema."});
add({cat:'CINÉMA',date:'Jeu 6 août',time:'18h00',title:`NOCTURNE${NL}PROJECTION${NL}MEMORIA`,link:'https://www.nmnm.mc/',source:'Nouveau Musée National de Monaco',quarter:'Monaco',sub:'Villa Paloma (NMNM) · Monaco',emoji:'🎬',desc:"Nocturne au NMNM avec la projection de « Memoria » d'Apichatpong Weerasethakul à la Villa Paloma.",descEn:"Late-night opening at NMNM with a screening of Apichatpong Weerasethakul's 'Memoria' at Villa Paloma."});
add({cat:'CINÉMA',date:'Jeu 20 août',time:'15h00',title:`CINÉMA${NL}FAMILLE${NL}HOLA FRIDA`,...MED,free:true,emoji:'🎬',desc:"Séance famille : « Hola Frida » d'André Kadi et Karine Vézina. Cinéma d'été de la Médiathèque.",descEn:"Family screening: 'Hola Frida' by André Kadi and Karine Vézina. Média­thèque summer cinema."});

// ── SEPTEMBRE 2026 ──
add({cat:'ATELIER',date:'Sam 19 sep',time:'10h30',title:`GOÛTER${NL}ZÉRO DÉCHET${NL}ECOPOLIS`,...MED,free:true,emoji:'🌱',desc:"Atelier avec Ecopolis : des idées pour un goûter zéro déchet. À la Médiathèque de Monaco.",descEn:"Workshop with Ecopolis: ideas for a zero-waste afternoon snack. At the Média­thèque of Monaco."});
add({cat:'CONCERT',date:'Dim 20 sep',time:'18h00',title:`STELLA${NL}ALMONDO${NL}PIANO`,...GRI,hot:true,emoji:'🎹',desc:"Récital de la pianiste Stella Almondo, révélation du concours Long-Thibaud, au Grimaldi Forum.",descEn:"Recital by pianist Stella Almondo, a Long-Thibaud competition revelation, at the Grimaldi Forum."});
add({cat:'CONFÉRENCE',date:'Mer 23 sep',time:'18h30',title:`LUDO MÉMO${NL}LE JEU ET${NL}LE CERVEAU`,...MED,free:true,emoji:'🧠',desc:"Conférence « Ludo Mémo » : quand le jeu aide à stimuler notre cerveau, avec le Centre Mémoire du CHPG.",descEn:"'Ludo Mémo' talk: how play can stimulate the brain, with the CHPG Memory Centre."});
add({cat:'OPÉRA',date:'Sam 26 sep',time:'16h00',title:`ROMA${NL}MASSENET`,...AUD,hot:true,emoji:'🎭',desc:"« Roma » de Jules Massenet en version concert à l'Auditorium Rainier III. Une rareté lyrique.",descEn:"Jules Massenet's 'Roma' in concert version at the Auditorium Rainier III. A lyrical rarity."});

// ── OCTOBRE 2026 ──
add({cat:'THÉÂTRE',date:'Jeu 1 oct',time:'20h00',title:`THE${NL}ENCOUNTER`,...TPG,emoji:'🎭',desc:"« The Encounter » au Théâtre Princesse Grace : une expérience théâtrale immersive et sonore.",descEn:"'The Encounter' at Théâtre Princesse Grace: an immersive, sound-driven theatrical experience."});
add({cat:'THÉÂTRE',date:'Jeu 8 oct',time:'20h00',title:`SISTERS${NL}AUDREY &${NL}VICTORIA`,...TPG,emoji:'🎭',desc:"« Sisters » (Audrey & Victoria) au Théâtre Princesse Grace. Une pièce sur les liens de sororité.",descEn:"'Sisters' (Audrey & Victoria) at Théâtre Princesse Grace. A play about the bonds between sisters."});
add({cat:'SPECTACLE',date:'Dim 11 oct',time:'16h00',title:`THE LEGEND${NL}OF THE MAGIC${NL}CRYSTAL`,phone:'+377 9330 1861',source:'Théâtre des Variétés',quarter:'Monte-Carlo',sub:'Théâtre des Variétés · Monte-Carlo',emoji:'✨',desc:"Spectacle familial « The Legend of the Magic Crystal » au Théâtre des Variétés.",descEn:"Family show 'The Legend of the Magic Crystal' at the Théâtre des Variétés."});
add({cat:'THÉÂTRE',date:'Dim 11 oct',time:'17h00',title:`UNE HEURE${NL}À${NL}T'ATTENDRE`,...TPG,emoji:'🎭',desc:"« Une heure à t'attendre » au Théâtre Princesse Grace : comédie tendre sur l'attente et le hasard.",descEn:"'Une heure à t'attendre' at Théâtre Princesse Grace: a tender comedy about waiting and chance."});
add({cat:'CONCERT',date:'Jeu 15 oct',time:'18h30',title:`THURSDAY${NL}LIVE SESSIONS${NL}FRIEDBERG`,...GRI,emoji:'🎸',desc:"Thursday Live Sessions au Grimaldi Forum : concert du groupe Friedberg dans une ambiance club.",descEn:"Thursday Live Sessions at the Grimaldi Forum: a concert by Friedberg in a club atmosphere."});
add({cat:'CONCERT',date:'Sam 24 oct',time:'18h00',title:`DISNEY${NL}EN CONCERT${NL}SUIVEZ VOS RÊVES`,...GRI,hot:true,emoji:'🎬',desc:"« Disney en concert - Suivez vos rêves » : les plus belles musiques Disney par un orchestre live, au Grimaldi Forum.",descEn:"'Disney in Concert - Follow Your Dreams': the greatest Disney scores performed live by orchestra, at the Grimaldi Forum."});

// ── NOVEMBRE / DÉCEMBRE 2026 ──
add({cat:'CONCERT',date:'Jeu 5 nov',time:'18h30',title:`THURSDAY${NL}LIVE SESSIONS${NL}JIMMY GNECCO`,...GRI,emoji:'🎸',desc:"Thursday Live Sessions au Grimaldi Forum : Jimmy Gnecco (Ours) en concert intimiste.",descEn:"Thursday Live Sessions at the Grimaldi Forum: Jimmy Gnecco (Ours) in an intimate concert."});
add({cat:'CONCERT',date:'Jeu 17 déc',time:'18h30',title:`THURSDAY${NL}LIVE SESSIONS${NL}DIRTY DEEP`,...GRI,emoji:'🎸',desc:"Thursday Live Sessions au Grimaldi Forum : le blues-rock de Dirty Deep en live.",descEn:"Thursday Live Sessions at the Grimaldi Forum: the blues-rock of Dirty Deep, live."});

// ── 2027 ──
add({cat:'CONCERT',year:2027,date:'Sam 27 fév',time:'20h30',title:`MARINE${NL}EN CONCERT`,...GRI,emoji:'🎤',desc:"Marine en concert au Grimaldi Forum. Une soirée musicale à ne pas manquer.",descEn:"Marine in concert at the Grimaldi Forum. A musical evening not to be missed."});
add({cat:'CONCERT',year:2027,date:'Sam 17 avr',time:'20h00',title:`STAR WARS${NL}UN NOUVEL${NL}ESPOIR`,...GRI,hot:true,emoji:'🎬',desc:"Ciné-concert « Star Wars : Un Nouvel Espoir » : le film projeté avec la partition de John Williams jouée en direct, au Grimaldi Forum.",descEn:"'Star Wars: A New Hope' film-in-concert: the movie screened with John Williams' score performed live, at the Grimaldi Forum."});
add({cat:'CONCERT',year:2027,date:'Mer 9 juin',time:'19h30',title:`RÉCITAL${NL}JANSEN &${NL}KANTOROW`,...AUD,hot:true,emoji:'🎻',desc:"Récital exceptionnel de la violoniste Janine Jansen et du pianiste Alexandre Kantorow à l'Auditorium Rainier III.",descEn:"Exceptional recital by violinist Janine Jansen and pianist Alexandre Kantorow at the Auditorium Rainier III."});

let s = readFileSync(FILE, 'utf8');
const marker = 'const _RAW = [\n';
const i = s.indexOf(marker) + marker.length;
const block = '  // ── LOT COMPLÉTION PrinciPocket (vérifié : lieu + date + heure) ──\n' + rows.join('\n') + '\n';
s = s.slice(0, i) + block + s.slice(i);
writeFileSync(FILE, s);
console.log(`✓ ${rows.length} événements insérés (ids 4724-${id-1}).`);
