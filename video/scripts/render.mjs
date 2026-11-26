// Pipeline completo:
//   1) gera as texturas (lê o preço do config.json)
//   2) renderiza o 3D de cada versão SEM legenda (intermediário de alta qualidade)
//   3) renderiza as legendas como camada transparente (ES e PT)
//   4) ffmpeg: compõe as versões finais em output/ + gera os .srt
// Uso: node scripts/render.mjs            (tudo)
//      node scripts/render.mjs --only=A   (só a versão A)
import path from 'node:path';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { renderMedia } from '@remotion/renderer';
import { makeBundle, comp, browser, root, repo } from './common.mjs';

const only = (process.argv.find((a) => a.startsWith('--only=')) || '').slice(7);
const reuse = (process.argv.find((a) => a.startsWith('--reuse-scene=')) || '').slice(14).split(',');
const work = path.join(root, 'out');
const outDir = path.join(repo, 'output');
fs.mkdirSync(work, { recursive: true });

execFileSync('node', [path.join(root, 'scripts/textures.mjs')], { stdio: 'inherit' });
const serveUrl = await makeBundle();

const render = async (props, file, extra) => {
  const composition = await comp(serveUrl, props);
  const t0 = Date.now();
  let last = -1;
  await renderMedia({
    serveUrl, composition, inputProps: props, outputLocation: file, muted: true, concurrency: 4,
    ...browser, timeoutInMilliseconds: 120000, ...extra,
    onProgress: ({ progress }) => { const p = Math.floor(progress * 10); if (p !== last) { last = p; process.stdout.write(` ${p * 10}%`); } },
  });
  console.log(`\n  ${path.basename(file)} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
};

const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: 'inherit' });
const FINAL = ['-c:v', 'libx264', '-preset', 'slow', '-crf', '21', '-pix_fmt', 'yuv420p', '-r', '30', '-an', '-movflags', '+faststart'];

const versions = (only ? [only] : ['A', 'B']);
for (const v of versions) {
  const scene = path.join(work, `scene_${v}.mp4`);
  console.log(`3D versão ${v}…`);
  if (!(reuse.includes(v) && fs.existsSync(scene))) await render({ version: v, lang: 'es', captions: false, scene: true }, scene, { codec: 'h264', crf: 12, pixelFormat: 'yuv420p' });
  const voice = path.join(root, 'public/audio', `voz_${v}_es.mp3`);
  const hasVoice = fs.existsSync(voice);
  // com narração: áudio AAC normalizado para redes sociais (-14 LUFS), completado até 30,0 s
  const AUD = hasVoice ? ['-i', voice] : [];
  const AMAP = (vi) => hasVoice ? ['-map', vi, '-map', `${vi === '0:v' ? 1 : 2}:a`, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11,apad', '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-t', '30'] : [];
  const FIN = hasVoice ? FINAL.filter((x) => x !== '-an') : FINAL;
  ff(['-i', scene, ...AUD, ...AMAP('0:v'), ...FIN, path.join(outDir, `criativo_${v}_es_SEM_LEGENDA.mp4`)]);

  const langs = v === 'A' ? ['es', 'pt'] : ['es'];
  for (const lang of langs) {
    const caps = path.join(work, `caps_${v}_${lang}.mov`);
    console.log(`legendas ${v}/${lang}…`);
    await render({ version: v, lang, captions: true, scene: false }, caps, { codec: 'prores', proResProfile: '4444', pixelFormat: 'yuva444p10le', imageFormat: 'png' });
    const withVoice = hasVoice && lang === 'es';
    ff(['-i', scene, '-i', caps, ...(withVoice ? AUD : []), '-filter_complex', '[0:v][1:v]overlay=0:0:format=auto[v]',
      ...(withVoice ? ['-map', '[v]', '-map', '2:a', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11,apad', '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-t', '30'] : ['-map', '[v]']),
      ...(withVoice ? FIN : FINAL), path.join(outDir, `criativo_${v}_${lang}.mp4`)]);
  }
}
execFileSync('node', [path.join(root, 'scripts/srt.mjs')], { stdio: 'inherit' });
console.log('pronto: arquivos em output/');
