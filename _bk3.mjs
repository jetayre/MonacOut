import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage();
await p.goto('https://www.euroleaguebasketball.net/en/euroleague/game-center/', { waitUntil: 'domcontentloaded', timeout: 45000 });
await p.waitForTimeout(5000);
const L = (await p.evaluate(() => document.body.innerText)).split('\n').map(x=>x.trim()).filter(Boolean);
// on imprime le voisinage de chaque mention de Monaco
const idx = L.map((l,i)=>/monaco/i.test(l)?i:-1).filter(i=>i>=0);
console.log('mentions de Monaco :', idx.length);
for (const i of idx.slice(0,6)) console.log('  …', L.slice(Math.max(0,i-6), i+4).join(' | '));
console.log('\n--- 40 premières lignes brutes ---');
console.log(L.slice(0,40).join('\n'));
await b.close();
