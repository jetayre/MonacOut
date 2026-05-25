#!/usr/bin/env node
/**
 * Génère les icônes PNG pour la PWA depuis le logo MonacOut
 * Style : rayures diagonales bleues/ivoire, cadre double or+navy, grand M Playfair, MONACOUT
 * Tailles : 192×192, 512×512, 1024×1024
 */
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SIZES = [192, 512, 1024];

const GOLD  = '#C9A96E';
const NAVY  = '#0F1D3A';
const BLUE  = '#9FC3DC';
const CREAM = '#FFFFFF';

const browser = await chromium.launch({ args: ['--force-color-profile=srgb', '--disable-lcd-text'] });
const page    = await browser.newPage();

for (const size of SIZES) {
  const frameSize  = Math.round(size * 0.74);
  const borderW    = Math.round(size * 0.006);
  const gapW       = Math.round(size * 0.008);
  const innerBorder= Math.round(size * 0.004);
  const mSize      = Math.round(frameSize * 0.90);
  const textSize   = Math.round(frameSize * 0.068);
  const stripe     = Math.round(size * 0.12);

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
    ${BLUE}  0px, ${BLUE}  ${stripe}px,
    ${CREAM} ${stripe}px, ${CREAM} ${stripe * 2}px
  );
  display:flex; align-items:center; justify-content:center;
}
.outer {
  width:${frameSize}px; height:${frameSize}px;
  background:${CREAM};
  border:${borderW}px solid ${GOLD};
  padding:${gapW}px;
  display:flex; align-items:center; justify-content:center;
}
.inner {
  width:100%; height:100%;
  border:${innerBorder}px solid ${NAVY};
  background:${CREAM};
  display:flex; flex-direction:column;
  align-items:center; justify-content:center;
  gap:0;
}
.M {
  font-family:'Playfair Display', Georgia, serif;
  font-weight:700;
  font-size:${mSize}px;
  color:${NAVY};
  line-height:1;
  letter-spacing:-${Math.round(mSize * 0.02)}px;
}
.tagline {
  margin-top:${Math.round(frameSize * 0.04)}px;
  font-family:'Josefin Sans', sans-serif;
  font-weight:400;
  font-size:${textSize}px;
  letter-spacing:${Math.round(textSize * 0.55)}px;
  color:${NAVY};
  text-transform:uppercase;
  padding-right:${Math.round(textSize * 0.55)}px;
}
</style>
</head>
<body>
  <div class="outer">
    <div class="inner">
      <div class="M">M</div>
    </div>
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
