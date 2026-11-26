// Gera as texturas 2D usadas nas cenas 3D (cartões, capas de bônus, cronômetro, selo de preço, botão).
// Lê config.json, então trocar o preço só exige rodar de novo (npm run render já faz isso).
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const repo = path.resolve(root, '..');
const out = path.join(root, 'public', 'tex');
fs.mkdirSync(out, { recursive: true });
const cfg = JSON.parse(fs.readFileSync(path.join(root, 'config.json'), 'utf8'));
const lang = process.argv[2] || 'es';

const font = (f) => 'data:font/ttf;base64,' + fs.readFileSync(path.join(repo, 'assets/fonts', f)).toString('base64');
const ill = (n) => fs.readFileSync(path.join(repo, 'assets/illustrations', n + '.svg'), 'utf8');

const css = `
@font-face{font-family:Fredoka;src:url(${font('Fredoka.ttf')});font-weight:300 700}
@font-face{font-family:Nunito;src:url(${font('Nunito.ttf')});font-weight:200 1000}
*{margin:0;padding:0;box-sizing:border-box}
html,body{background:transparent}
body{font-family:Nunito;color:#4A3A2E}
.f{font-family:Fredoka}
#s{position:relative;overflow:hidden}
svg{display:block}
`;

const MODS = [
  ['Rompehielos y Bienvenida', '#E2B45A', '#9A7426', '#F7EBD0', 40],
  ['Dios Creador y la Creación', '#8FAE8B', '#50704C', '#E4ECDF', 35],
  ['Historias del Antiguo Testamento', '#D9896C', '#A1543A', '#F6E1D6', 40],
  ['Jesús: Vida y Milagros', '#8DB8D6', '#457394', '#E0ECF4', 80],
  ['María y los Santos', '#D9A5A0', '#A1615B', '#F5E4E1', 30],
  ['Aprendiendo a Orar', '#A99BC9', '#685A8C', '#E9E5F2', 35],
  ['Los Sacramentos', '#D6A445', '#8C6516', '#F4E7C9', 90],
  ['Mandamientos y Valores', '#7FA27B', '#48683F', '#E1EADC', 70],
  ['La Iglesia y la Misa', '#CB7E62', '#964A31', '#F3DED4', 30],
  ['Juegos de Repaso', '#79A7C9', '#3B6888', '#DDE9F2', 30],
  ['Cierres y Oración Final', '#B795B9', '#7A5480', '#EEE3EF', 30],
];

const jobs = [];

MODS.forEach(([name, c, dark, soft, n], i) => {
  const num = String(i + 1).padStart(2, '0');
  jobs.push({
    file: `card_${num}.png`, w: 600, h: 840, html: `
<div id="s" style="width:600px;height:840px;background:${soft};padding:34px">
  <div style="position:absolute;inset:14px;border:4px dashed ${c};border-radius:34px;opacity:.7"></div>
  <div class="f" style="background:${c};color:#fff;border-radius:999px;padding:12px 0;text-align:center;font-weight:600;font-size:34px;letter-spacing:3px;position:relative">MÓDULO ${i + 1}</div>
  <div style="width:380px;height:380px;margin:26px auto 0">${ill('modulo_' + num).replace('<svg ', '<svg width="380" height="380" ')}</div>
  <div class="f" style="font-weight:600;font-size:${name.length > 22 ? 52 : 60}px;line-height:1.02;text-align:center;margin-top:18px;height:132px;display:flex;align-items:center;justify-content:center;color:#4A3A2E">${name}</div>
  <div style="display:flex;justify-content:center;margin-top:20px"><div class="f" style="background:#fff;border:4px solid ${c};color:${dark};font-weight:600;font-size:34px;border-radius:999px;padding:6px 28px">${n} dinámicas</div></div>
</div>` });
});

const BONUS = [
  ['Ruta de Encuentros', '12 Semanas', '#8FAE8B', '#E4ECDF', 'biblia', ''],
  ['30 Parábolas', 'para Niños', '#8DB8D6', '#E0ECF4', 'paloma', ''],
  ['Dinámicas para', 'Fechas Litúrgicas', '#D9896C', '#F6E1D6', 'caliz', 'Adviento y Navidad'],
  ['Guía de Oración', 'para Cada Encuentro', '#A99BC9', '#E9E5F2', 'corazon', ''],
];
BONUS.forEach(([t1, t2, c, soft, art, ribbon], i) => {
  jobs.push({
    file: `bonus_${i + 1}.png`, w: 700, h: 940, html: `
<div id="s" style="width:700px;height:940px;background:${soft};padding:40px">
  <div style="position:absolute;inset:18px;border:4px solid ${c};border-radius:30px"></div>
  <div class="f" style="position:relative;display:inline-block;background:${c};color:#fff;font-weight:600;font-size:40px;letter-spacing:3px;border-radius:999px;padding:8px 30px">BONO ${i + 1}</div>
  <div style="position:relative;width:330px;height:330px;margin:30px auto 6px;background:#FBF7F1;border-radius:50%;border:4px dashed ${c};display:flex;align-items:center;justify-content:center">
    <div style="width:210px;height:210px">${ill(art).replace('<svg ', '<svg width="210" height="210" ')}</div>
  </div>
  <div class="f" style="position:relative;text-align:center;font-weight:600;font-size:84px;line-height:1.0;margin-top:20px">${t1}</div>
  <div class="f" style="position:relative;text-align:center;font-weight:600;font-size:60px;line-height:1.1;margin-top:6px;color:${c};filter:brightness(.78)">${t2}</div>
  ${ribbon ? `<div class="f" style="position:absolute;left:-10px;right:-10px;bottom:60px;background:#E2B45A;color:#4A3A2E;text-align:center;font-weight:700;font-size:50px;padding:12px 0;transform:rotate(-3deg);box-shadow:0 6px 0 #C9AE8C">★ ${ribbon} ★</div>` :
      `<div style="position:absolute;bottom:46px;left:0;right:0;text-align:center;font-weight:700;font-size:30px;letter-spacing:2px;color:#7A6656">CATEQUESIS VIVA</div>`}
</div>` });
});

// cronômetro
let ticks = '';
for (let k = 0; k < 60; k++) {
  const a = (k / 60) * Math.PI * 2, big = k % 5 === 0;
  const r1 = big ? 196 : 206, r2 = 222;
  ticks += `<line x1="${256 + Math.sin(a) * r1}" y1="${256 - Math.cos(a) * r1}" x2="${256 + Math.sin(a) * r2}" y2="${256 - Math.cos(a) * r2}" stroke="${big ? '#4A3A2E' : '#C9AE8C'}" stroke-width="${big ? 7 : 3}" stroke-linecap="round"/>`;
}
jobs.push({
  file: 'timer.png', w: 512, h: 512, html: `
<div id="s" style="width:512px;height:512px">
<svg width="512" height="512"><circle cx="256" cy="256" r="250" fill="#FBF7F1"/>${ticks}
<path d="M256 256 L256 34 A222 222 0 0 1 448 145 Z" fill="#E2B45A" opacity=".35"/></svg>
<div class="f" style="position:absolute;left:0;right:0;top:150px;text-align:center;font-weight:700;font-size:150px;line-height:1;color:#4A3A2E">2:00</div>
<div class="f" style="position:absolute;left:0;right:0;top:310px;text-align:center;font-weight:600;font-size:44px;letter-spacing:6px;color:#D9896C">MIN</div>
</div>` });

// mostrador do despertador
let cticks = '';
for (let k = 0; k < 12; k++) {
  const a = (k / 12) * Math.PI * 2;
  cticks += `<circle cx="${256 + Math.sin(a) * 200}" cy="${256 - Math.cos(a) * 200}" r="${k % 3 ? 9 : 16}" fill="${k % 3 ? '#C9AE8C' : '#4A3A2E'}"/>`;
}
jobs.push({ file: 'clock.png', w: 512, h: 512, html: `<div id="s" style="width:512px;height:512px"><svg width="512" height="512"><circle cx="256" cy="256" r="252" fill="#FFFDF8"/>${cticks}</svg></div>` });

// selo de preço
let pts = '';
for (let k = 0; k < 48; k++) {
  const a = (k / 48) * Math.PI * 2, r = k % 2 ? 268 : 296;
  pts += `${300 + Math.cos(a) * r},${300 + Math.sin(a) * r} `;
}
const price = cfg.price;
const pfs = Math.min(150, Math.floor(860 / Math.max(4, price.length)));
jobs.push({
  file: 'price.png', w: 600, h: 600, html: `
<div id="s" style="width:600px;height:600px">
<svg width="600" height="600"><polygon points="${pts}" fill="#E2B45A" stroke="#4A3A2E" stroke-width="8" stroke-linejoin="round"/>
<circle cx="300" cy="300" r="222" fill="#FBF7F1" stroke="#4A3A2E" stroke-width="7"/>
<circle cx="300" cy="300" r="200" fill="none" stroke="#C9AE8C" stroke-width="5" stroke-dasharray="14 12"/></svg>
<div class="f" style="position:absolute;left:0;right:0;top:150px;text-align:center;font-weight:600;font-size:56px;letter-spacing:8px;color:#7A6656">${cfg.priceLabel[lang]}</div>
<div class="f" style="position:absolute;left:0;right:0;top:${300 - pfs * 0.42}px;text-align:center;font-weight:700;font-size:${pfs}px;line-height:1;color:#D9896C;white-space:nowrap;-webkit-text-stroke:7px #4A3A2E;paint-order:stroke fill;text-shadow:0 7px 0 #4A3A2E">${price}</div>
</div>` });

// rótulo do botão
jobs.push({
  file: 'button.png', w: 1100, h: 240, html: `
<div id="s" style="width:1100px;height:240px;display:flex;align-items:center;justify-content:center">
<div class="f" style="font-weight:700;font-size:112px;color:#fff;white-space:nowrap;text-shadow:0 5px 0 rgba(74,58,46,.35)">${cfg.button[lang]}</div></div>` });

// borda das páginas do livro
jobs.push({
  file: 'pages.png', w: 256, h: 64, html: `
<div id="s" style="width:256px;height:64px;background:repeating-linear-gradient(180deg,#FBF7F1 0 3px,#E6D5BE 3px 4px)"></div>` });

// folha em branco (pautada)
jobs.push({
  file: 'paper.png', w: 600, h: 800, html: `
<div id="s" style="width:600px;height:800px;background:#FFFDF8">
<div style="position:absolute;left:0;right:0;top:120px;bottom:40px;background:repeating-linear-gradient(180deg,transparent 0 46px,#DCE6EE 46px 49px)"></div>
<div style="position:absolute;top:0;bottom:0;left:84px;width:3px;background:#EBB5A9"></div></div>` });

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
for (const j of jobs) {
  await page.setViewportSize({ width: j.w, height: j.h });
  await page.setContent(`<style>${css}</style>${j.html}`, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.locator('#s').screenshot({ path: path.join(out, j.file), omitBackground: true });
}
await browser.close();
console.log(`texturas: ${jobs.length} arquivos em public/tex (preço: ${price})`);
