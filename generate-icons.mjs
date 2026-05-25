#!/usr/bin/env node
/**
 * Génère les icônes PNG pour la PWA depuis le logo MonacOut
 * Style : fond ivoire #FDFAF5, cadre or+navy, grand M Playfair, MONAC'OUT
 * Tailles : 192×192, 512×512, 1024×1024
 */
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SIZES = [192, 512, 1024];

const GOLD  = '#C9A96E';
const NAVY  = '#0F1D3A';
const CREAM = '#FDFAF5';

const browser = await chromium.launch();
const page    = await browser.newPage();

for (const size of SIZES) {
  const mSize    = Math.round(size * 0.68);
  const textSize = Math.round(size * 0.075);
  // stripe width scales with icon size
  const stripe   = Math.round(size * 0.078);

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Josefin+Sans:wght@400;600&display=swap" rel="stylesheet">
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body {
  width:${size}px; height:${size}px;
  background: repeating-linear-gradient(
    -45deg,
    #9FC3DC 0px, #9FC3DC ${stripe}px,
    ${CREAM} ${stripe}px, ${CREAM} ${stripe * 2}px
  );
  display:flex; flex-direction:column;
  align-items:center; justify-content:center;
  gap:0;
}
.M {
  font-family:'Playfair Display', Georgia, serif;
  font-weight:700;
  font-size:${mSize}px;
  color:${NAVY};
  line-height:0.88;
  letter-spacing:-${Math.round(mSize * 0.02)}px;
  text-shadow: 1px 2px 0 rgba(255,255,255,0.4);
}
.tagline {
  display:flex; align-items:baseline; justify-content:center;
  margin-top:${Math.round(size * 0.02)}px;
}
.monac {
  font-family:'Josefin Sans', sans-serif;
  font-weight:400;
  font-size:${textSize}px;
  letter-spacing:${Math.round(textSize * 0.38)}px;
  color:${NAVY};
  text-transform:uppercase;
}
.out {
  font-family:'Josefin Sans', sans-serif;
  font-weight:600;
  font-size:${textSize}px;
  letter-spacing:${Math.round(textSize * 0.22)}px;
  color:${GOLD};
  text-transform:uppercase;
}
</style>
</head>
<body>
  <div class="M">M</div>
  <div class="tagline">
    <span class="monac">MONAC'</span><span class="out">OUT</span>
  </div>
</body>
</html>`;

  await page.setViewportSize({ width: size, height: size });
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const outPath = join(__dirname, `public/icon-${size}.png`);
  await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: size, height: size } });
  console.log(`✓ icon-${size}.png`);
}

await browser.close();
console.log('\nIcônes générées dans public/');
