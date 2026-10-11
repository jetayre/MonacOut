import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage();
for (const u of ['https://www.euroleaguebasketball.net/en/euroleague/teams/as-monaco/calendar/MCO/',
                 'https://www.euroleaguebasketball.net/en/euroleague/game-center/']) {
  try {
    await p.goto(u, { waitUntil: 'domcontentloaded', timeout: 40000 });
    await p.waitForTimeout(4000);
    const t = await p.evaluate(() => document.body.innerText);
    const L = t.split('\n').map(x=>x.trim()).filter(Boolean);
    const utiles = L.filter(l => /monaco/i.test(l) || /^\d{1,2}\s+\w{3}/i.test(l) || /\d{1,2}:\d{2}/.test(l));
    console.log(`\n=== ${u.slice(0,70)} === (${L.length} lignes)`);
    console.log(utiles.slice(0, 30).join('\n') || '(rien d\'exploitable)');
  } catch (e) { console.log(`\n=== ${u.slice(0,60)} : ${String(e).slice(0,70)}`); }
}
await b.close();
