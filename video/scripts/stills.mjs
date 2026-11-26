// Uso: node scripts/stills.mjs <versão A|B> <lang es|pt> <pasta> <frame> [frame...]
import path from 'node:path';
import fs from 'node:fs';
import { renderStill } from '@remotion/renderer';
import { makeBundle, comp, browser } from './common.mjs';

const [version = 'A', lang = 'es', dir = 'stills', ...frames] = process.argv.slice(2);
const inputProps = { version, lang, captions: true, scene: true };
const serveUrl = await makeBundle();
const composition = await comp(serveUrl, inputProps);
fs.mkdirSync(dir, { recursive: true });
for (const fr of frames.map(Number)) {
  const t0 = Date.now();
  const output = path.join(dir, `${version}_${lang}_f${String(fr).padStart(3, '0')}.png`);
  await renderStill({ serveUrl, composition, frame: fr, output, inputProps, ...browser, timeoutInMilliseconds: 120000, onBrowserLog: (l) => console.log('[browser]', l.type, l.text.slice(0, 300)) });
  console.log(output, ((Date.now() - t0) / 1000).toFixed(1) + 's');
}
