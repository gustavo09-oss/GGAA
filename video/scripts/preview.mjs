// Uso: node scripts/preview.mjs <saida.mp4> <frameInicial> <frameFinal> [versão] [lang]
import { renderMedia } from '@remotion/renderer';
import { makeBundle, comp, browser } from './common.mjs';
const [out, a, b, version = 'A', lang = 'es'] = process.argv.slice(2);
const inputProps = { version, lang, captions: true, scene: true };
const serveUrl = await makeBundle();
const composition = await comp(serveUrl, inputProps);
const t0 = Date.now();
await renderMedia({
  serveUrl, composition, inputProps, codec: 'h264', outputLocation: out, frameRange: [Number(a), Number(b)],
  muted: true, crf: 20, pixelFormat: 'yuv420p', concurrency: 4, ...browser, timeoutInMilliseconds: 120000,
  onProgress: ({ progress }) => { if (Math.round(progress * 100) % 20 === 0) process.stdout.write(`\r${Math.round(progress * 100)}%`); },
});
console.log(`\n${out} em ${((Date.now() - t0) / 1000).toFixed(0)}s`);
