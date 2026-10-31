import { chromium } from "playwright";
const n = await chromium.launch();
const p = await (await n.newContext({ userAgent: "Mozilla/5.0", locale: "fr-FR" })).newPage();
await p.goto("https://www.montecarlosbm.com/fr/agenda", { waitUntil: "networkidle", timeout: 60000 });
await p.waitForTimeout(3000);
for (let i = 0; i < 12; i++) {
  await p.evaluate(() => window.scrollBy(0, document.body.scrollHeight));
  await p.waitForTimeout(900);
  // bouton « voir plus » éventuel
  const b = await p.$('button:has-text("plus"), a:has-text("plus")');
  if (b) { try { await b.click(); await p.waitForTimeout(1200); } catch {} }
}
const liens = await p.evaluate(() => [...document.querySelectorAll('a[href*="/agenda/"]')].map(a => a.getAttribute("href")));
console.log("pages agenda :", [...new Set(liens)].length);
for (const u of [...new Set(liens)].sort()) console.log("  ", u);
const t = await p.evaluate(() => document.body.innerText);
console.log("\n--- texte (2000 car.) ---\n" + t.slice(0, 2000));
await n.close();
