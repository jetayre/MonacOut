#!/usr/bin/env node
/**
 * MonacOut — LE FLYER A5 À AFFICHER DANS UN CAFÉ
 *
 * Stéphanie, 16 oct 2026 : « fait moi un flyer format A5 que je peux afficher
 * au café avec un QR code ».
 *
 * ── Les trois décisions qui comptent ─────────────────────────────────────────
 * 1. LE QR MÈNE À L'APP STORE, pas au site. Mesuré le 3 août 2026 : 25,3 % des
 *    visiteurs de la fiche App Store installent l'application, là où une app
 *    Lifestyle tourne à 3-5 %. Le site, lui, ne fait installer personne — et
 *    les quatorze personnes arrivées par un lien d'invitation en sont la preuve
 *    inverse : elles ont découvert Monac'Out sans jamais l'installer.
 * 2. LE QR EST DESSINÉ EN SVG, pas appelé chez un service en ligne. Un flyer
 *    imprimé doit se régénérer à l'identique dans dix ans, sans dépendre d'une
 *    adresse tierce qui aura peut-être disparu — et un QR en PNG basse
 *    définition imprime mal.
 * 3. LA CHARTE DU 10 OCTOBRE EST RESPECTÉE : pas d'or (3,45:1 sur l'ivoire,
 *    sous la norme), Rouge H #7B2D26 en fil conducteur, navy pour le texte, et
 *    le logo n'est plus que le NOM — ni M, ni rayures, ni cadre.
 *
 * ⚠️ Ne pas écrire « vercel » ni « Principauté » sur le flyer : décision de
 * Stéphanie pour le flyer A4, elle vaut ici aussi.
 *
 * Usage : node scripts/flyer-a5.mjs            → public/flyer-a5.html
 *         node scripts/flyer-a5.mjs --pdf      → + ~/Desktop/Flyer A5 Monac'Out.pdf
 */
import { writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { homedir } from "os";
import QRCode from "qrcode";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RACINE = join(__dirname, "..");

// ⚠️ L'ADRESSE DU QR. C'est la seule chose qu'on ne pourra plus changer une fois
// le flyer imprimé — le QR du 12 juin 2026 pointait vers le site et il a fallu
// détourner l'adresse dans vercel.json pour rattraper le coup.
const CIBLE = "https://apps.apple.com/fr/app/monacout/id6774785049";

const ROUGE_H = "#7B2D26";
const NAVY = "#0F1D3A";
const IVOIRE = "#FFFDF7";

// Correction d'erreur « H » : le QR reste lisible même sali, corné ou partiellement
// masqué — un flyer de café vit mal.
const qr = await QRCode.toString(CIBLE, {
  type: "svg", errorCorrectionLevel: "H", margin: 0,
  color: { dark: NAVY, light: "#0000" },
});
const qrInline = qr.replace(/<\?xml[^>]*\?>/, "").replace(/<svg /, '<svg class="qr" ');

const html = `<!doctype html>
<html lang="fr"><head><meta charset="utf-8">
<title>Flyer A5 Monac'Out</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;600;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
<style>
  @page { size: A5 portrait; margin: 0; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { margin: 0; padding: 0; background: #e9e6df; }
  .feuille {
    width: 148mm; height: 210mm; margin: 0 auto; background: ${IVOIRE};
    display: flex; flex-direction: column; align-items: center;
    padding: 15mm 13mm 11mm; position: relative; overflow: hidden;
  }
  @media print { html, body { background: ${IVOIRE}; } .feuille { margin: 0; } }

  /* Un filet Rouge H en haut et en bas : c'est tout ce qui reste du cadre. */
  .filet { width: 100%; height: 1.4mm; background: ${ROUGE_H}; flex-shrink: 0; }

  .logo { text-align: center; margin-top: 9mm; }
  .nom { display: flex; align-items: baseline; justify-content: center; }
  .nom .a { font-family: 'Josefin Sans', sans-serif; font-weight: 400; font-size: 44px;
            letter-spacing: 18px; color: ${NAVY}; text-transform: uppercase; }
  .nom .b { font-family: 'Josefin Sans', sans-serif; font-weight: 600; font-size: 44px;
            letter-spacing: 11px; color: ${ROUGE_H}; text-transform: uppercase; }
  .signature { font-family: 'Josefin Sans', sans-serif; font-weight: 700; font-size: 11px;
               letter-spacing: 5px; color: ${NAVY}; opacity: .62; text-transform: uppercase;
               margin-top: 7px; }
  .trait { height: 2px; background: ${ROUGE_H}; width: 42mm; margin: 7mm auto 0; }

  .accroche { font-family: 'Josefin Sans', sans-serif; font-weight: 300; font-size: 25px;
              line-height: 1.32; color: ${NAVY}; text-align: center; margin: 9mm 0 0;
              letter-spacing: .4px; }
  .accroche strong { font-weight: 600; color: ${ROUGE_H}; }

  .liste { font-family: 'Lato', sans-serif; font-size: 13.5px; line-height: 2;
           color: ${NAVY}; text-align: center; margin: 7mm 0 0; letter-spacing: .5px; }
  .liste span { white-space: nowrap; }
  .pt { color: ${ROUGE_H}; font-weight: 700; margin: 0 7px; }

  .bloc-qr { margin-top: auto; display: flex; flex-direction: column; align-items: center; }
  .cadre-qr { border: 2px solid ${ROUGE_H}; padding: 5mm; background: #fff; line-height: 0; }
  .qr { width: 41mm; height: 41mm; display: block; }
  .mode { font-family: 'Josefin Sans', sans-serif; font-weight: 700; font-size: 12.5px;
          letter-spacing: 3.2px; color: ${NAVY}; text-transform: uppercase; margin-top: 6mm;
          text-align: center; }
  .gratuit { font-family: 'Josefin Sans', sans-serif; font-weight: 600; font-size: 11px;
             letter-spacing: 2.6px; color: ${ROUGE_H}; text-transform: uppercase;
             margin-top: 3mm; }
</style></head>
<body>
  <div class="feuille">
    <div class="filet"></div>

    <div class="logo">
      <div class="nom"><span class="a">MONAC'</span><span class="b">OUT</span></div>
      <div class="signature">Monaco Ensemble</div>
      <div class="trait"></div>
    </div>

    <p class="accroche">Tout ce qu'il y a à faire<br>à Monaco <strong>aujourd'hui</strong></p>

    <div class="liste">
      <span>Petit-déj</span><span class="pt">·</span><span>Brunch</span><span class="pt">·</span><span>Apéro</span><br>
      <span>Expos</span><span class="pt">·</span><span>Concerts</span><span class="pt">·</span><span>Soirées</span><br>
      <span>Bien-être</span><span class="pt">·</span><span>Sport</span><span class="pt">·</span><span>Enfants</span>
    </div>

    <div class="bloc-qr">
      <div class="cadre-qr">${qrInline}</div>
      <div class="mode">Scannez pour installer</div>
      <div class="gratuit">Gratuit</div>
    </div>

    <div class="filet" style="margin-top:9mm"></div>
  </div>
</body></html>`;

mkdirSync(join(RACINE, "public"), { recursive: true });
const sortie = join(RACINE, "public", "flyer-a5.html");
writeFileSync(sortie, html, "utf8");
console.log(`✓ ${sortie}`);
console.log(`  QR → ${CIBLE}`);

if (process.argv.includes("--pdf")) {
  const { chromium } = await import("playwright");
  const nav = await chromium.launch();
  const page = await nav.newPage();
  await page.goto("file://" + sortie, { waitUntil: "networkidle" });
  // Les polices Google doivent être arrivées avant l'impression, sinon le PDF
  // sort en Times : on attend qu'elles soient prêtes.
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(900);
  const pdf = join(homedir(), "Desktop", "Flyer A5 Monac'Out.pdf");
  await page.pdf({ path: pdf, format: "A5", printBackground: true,
                   margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  const png = join(homedir(), "Desktop", "Flyer A5 Monac'Out.png");
  await page.setViewportSize({ width: 560, height: 794 });
  await page.locator(".feuille").screenshot({ path: png, scale: "device" });
  await nav.close();
  console.log(`✓ ${pdf}`);
  console.log(`✓ ${png}`);
}
