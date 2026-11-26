// Gera os .srt a partir de src/captions.ts (mesma fonte de verdade das legendas animadas)
import fs from 'node:fs';
import path from 'node:path';
import { root, repo } from './common.mjs';
const src = fs.readFileSync(path.join(root, 'src/captions.ts'), 'utf8')
  .replace(/^export type .*$/gm, '').replace(/: Record<Lang, Cap\[\]>/g, '').replace(/export const captionsFor[\s\S]*$/, '')
  .replace(/^export /gm, '').replace(/: Cap\[\]/g, '').replace(/\(([a-z]): number(, [a-z]+: [a-z\[\]]+)*\)/g, (m) => m.replace(/: [a-z\[\]]+/g, '')).replace(/\): Cap =>/g, ') =>');
const { HOOK_A, HOOK_B, BODY, VOICE_B_ES } = new Function(`${src}; return { HOOK_A, HOOK_B, BODY, VOICE_B_ES };`)();
const ts = (fr) => {
  const ms = Math.round((fr / 30) * 1000);
  const p = (n, l = 2) => String(n).padStart(l, '0');
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
};
const write = (name, caps) => {
  const body = caps.map(([a, b, t], i) => `${i + 1}\n${ts(a)} --> ${ts(b)}\n${t.replace(/\*/g, '')}\n`).join('\n');
  fs.writeFileSync(path.join(repo, 'output', name), body);
};
write('criativo_A_es.srt', [...HOOK_A.es, ...BODY.es]);
write('criativo_B_es.srt', VOICE_B_ES);
write('criativo_A_pt.srt', [...HOOK_A.pt, ...BODY.pt]);
console.log('srt: 3 arquivos');
