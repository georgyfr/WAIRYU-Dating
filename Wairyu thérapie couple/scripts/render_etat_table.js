// Capture Playwright 1920×1080 — table « État actuel du projet » (WAIRYU WTC v2)
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  await page.goto('file:///home/z/my-project/download/_etat_table.html',
                  { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  // Contrôle de débordement vertical
  const overflow = await page.evaluate(() => {
    const t = document.querySelector('table');
    const f = document.querySelector('.footer');
    return { tableBottom: Math.round(t.getBoundingClientRect().bottom),
             footerTop: Math.round(f.getBoundingClientRect().top) };
  });
  console.log('Bas de table :', overflow.tableBottom, '| Haut du pied :', overflow.footerTop,
              '| Marge :', overflow.footerTop - overflow.tableBottom, 'px');
  if (overflow.footerTop - overflow.tableBottom < 12) {
    console.log('ATTENTION : marge verticale insuffisante');
  }
  await page.screenshot({ path:
    '/home/z/my-project/download/Table_EtatActuelProjet_2026-10-15.png' });
  await browser.close();
  console.log('PNG OK : /home/z/my-project/download/Table_EtatActuelProjet_2026-10-15.png');
})();
