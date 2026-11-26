import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { bundle } from '@remotion/bundler';
import { selectComposition } from '@remotion/renderer';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const repo = path.resolve(root, '..');
const exe = ['/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell']
  .find((p) => fs.existsSync(p));
export const browser = {
  browserExecutable: exe ?? null,
  chromiumOptions: { gl: 'swangle', enableMultiProcessOnLinux: true },
};
export const makeBundle = () => bundle({ entryPoint: path.join(root, 'src/index.ts'), publicDir: path.join(root, 'public') });
export const comp = (serveUrl, inputProps) => selectComposition({ serveUrl, id: 'Criativo', inputProps, ...browser });
