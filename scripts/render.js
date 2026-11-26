// Renderiza um HTML em PDF (Carta) com Chromium/Playwright e verifica overflow.
// Uso: node scripts/render.js entrada.html saida.pdf [--png pasta --pages 1,2,3]
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const [, , input, output, ...rest] = process.argv;
  const opt = {};
  for (let i = 0; i < rest.length; i += 2) opt[rest[i].replace(/^--/, '')] = rest[i + 1];

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 816, height: 1056 }, deviceScaleFactor: Number(opt.scale || 1) });
  await page.goto('file://' + path.resolve(input), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);

  // Verifica fontes carregadas e páginas com conteúdo estourando a área útil
  const report = await page.evaluate(() => {
    const fonts = [...document.fonts].map(f => `${f.family}:${f.status}`);
    const overflow = [];
    document.querySelectorAll('.page').forEach((pg, i) => {
      pg.querySelectorAll('.page-inner, .clip').forEach(el => {
        if (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1)
          overflow.push({ page: i + 1, id: pg.id, over: el.scrollHeight - el.clientHeight });
      });
    });
    return { fonts: [...new Set(fonts)], overflow, pages: document.querySelectorAll('.page').length };
  });
  console.log(JSON.stringify(report));

  if (output && output !== '-') {
    await page.pdf({ path: output, format: 'Letter', printBackground: true, preferCSSPageSize: true, tagged: true, outline: true });
  }

  if (opt.png) {
    fs.mkdirSync(opt.png, { recursive: true });
    const list = opt.pages ? opt.pages.split(',').map(Number) : [...Array(report.pages).keys()].map(i => i + 1);
    const handles = await page.$$('.page');
    for (const n of list) {
      if (handles[n - 1]) await handles[n - 1].screenshot({ path: path.join(opt.png, `p${String(n).padStart(3, '0')}.png`) });
    }
  }
  await browser.close();
})();
