export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const prog = (f: number, a: number, b: number) => clamp((f - a) / (b - a));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeIn = (t: number) => t * t * t;
export const easeOutBack = (t: number, s = 1.70158) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);
export const easeInBack = (t: number, s = 1.70158) => (s + 1) * t * t * t - s * t * t;

// mola amortecida (0 -> 1), em frames
export const spring = (f: number, start: number, freq = 2.2, damp = 0.32) => {
  const t = (f - start) / 30;
  if (t <= 0) return 0;
  const w = freq * Math.PI * 2;
  return 1 - Math.exp(-damp * w * t) * Math.cos(w * Math.sqrt(1 - damp * damp) * t);
};

// queda com quique: devolve altura relativa (1 = topo, 0 = chão) e squash
export const drop = (f: number, start: number, dur = 18) => {
  const t = (f - start) / dur;
  if (t <= 0) return { h: 1, squash: 0, landed: false };
  if (t < 1) return { h: 1 - t * t, squash: 0, landed: false };
  const tb = t - 1;
  // dois quiques decrescentes
  const b1 = 0.45, b2 = 0.22;
  if (tb < b1) { const x = tb / b1; return { h: 0.16 * 4 * x * (1 - x), squash: Math.max(0, 1 - tb * 9) * 0.22, landed: true }; }
  if (tb < b1 + b2) { const x = (tb - b1) / b2; return { h: 0.04 * 4 * x * (1 - x), squash: 0.06 * Math.max(0, 1 - (tb - b1) * 12), landed: true }; }
  return { h: 0, squash: 0, landed: true };
};

export type Key = [number, number[]];
// spline de Hermite cúbica com tangentes por diferença finita (movimento contínuo, sem paradas robóticas)
export const track = (keys: Key[], f: number): number[] => {
  const n = keys.length;
  if (f <= keys[0][0]) return keys[0][1].slice();
  if (f >= keys[n - 1][0]) return keys[n - 1][1].slice();
  let i = 0;
  while (i < n - 2 && f > keys[i + 1][0]) i++;
  const [t0, p0] = keys[i];
  const [t1, p1] = keys[i + 1];
  const h = t1 - t0;
  const u = (f - t0) / h;
  const tan = (k: number) => {
    if (k <= 0 || k >= n - 1) return keys[k][1].map(() => 0);
    const [ta, pa] = keys[k - 1];
    const [tb, pb] = keys[k + 1];
    return keys[k][1].map((_, j) => (pb[j] - pa[j]) / (tb - ta));
  };
  const m0 = tan(i), m1 = tan(i + 1);
  const u2 = u * u, u3 = u2 * u;
  const h00 = 2 * u3 - 3 * u2 + 1, h10 = u3 - 2 * u2 + u, h01 = -2 * u3 + 3 * u2, h11 = u3 - u2;
  return p0.map((_, j) => h00 * p0[j] + h10 * h * m0[j] + h01 * p1[j] + h11 * h * m1[j]);
};

// ruído determinístico
export const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
