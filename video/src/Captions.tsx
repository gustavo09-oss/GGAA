import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Cap } from './captions';
import { clamp, easeIn, easeOutBack, prog } from './anim';

type Tok = { word: string; kw: boolean; group: number };

const tokenize = (text: string): Tok[] => {
  const out: Tok[] = [];
  const parts = text.split('*');
  let g = 0;
  parts.forEach((p, i) => {
    const kw = i % 2 === 1;
    const words = p.trim().split(/\s+/).filter(Boolean);
    if (kw) { words.forEach((w) => out.push({ word: w, kw, group: g })); g++; }
    else words.forEach((w) => { out.push({ word: w, kw, group: g }); g++; });
  });
  return out;
};

const STROKE = '#4A3A2E';
const KW_COLORS = ['#D9886C', '#E2B45A'];

const Line: React.FC<{ cap: Cap; idx: number; f: number }> = ({ cap, idx, f }) => {
  const [a, b, text] = cap;
  const toks = tokenize(text);
  const groups = [...new Set(toks.map((t) => t.group))];
  const per = Math.min(5, Math.max(2.5, (b - a) * 0.45 / Math.max(1, groups.length)));
  const out = easeIn(prog(f, b - 5, b));
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', columnGap: 30, rowGap: 6,
      opacity: 1 - out, transform: `translateY(${-out * 20}px) scale(${1 - out * 0.06})`,
    }}>
      {groups.map((g) => {
        const words = toks.filter((t) => t.group === g);
        const kw = words[0].kw;
        const start = a + groups.indexOf(g) * per;
        const s = easeOutBack(clamp((f - start) / 7), 1.5);
        const o = clamp((f - start) / 3);
        const color = KW_COLORS[idx % 2];
        return (
          <span key={g} style={{
            display: 'inline-block', transform: `scale(${0.55 + 0.45 * s}) rotate(${kw ? (idx % 2 ? 2 : -2) * s : 0}deg)`, opacity: o,
            background: kw ? color : 'transparent', borderRadius: kw ? 26 : 0, padding: kw ? '0px 22px 6px' : 0,
            boxShadow: kw ? `0 8px 0 ${STROKE}, 0 0 0 6px ${STROKE}` : 'none', margin: kw ? '8px 6px' : 0,
          }}>
            {words.map((w) => w.word).join(' ')}
          </span>
        );
      })}
    </div>
  );
};

export const Captions: React.FC<{ caps: Cap[] }> = ({ caps }) => {
  const f = useCurrentFrame();
  return (
    <div style={{
      position: 'absolute', left: 50, right: 150, top: 1130, height: 330,
      display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
      fontFamily: 'FredokaCap', fontWeight: 700, fontSize: 82, lineHeight: 1.08, color: '#FFFFFF', letterSpacing: 1,
      WebkitTextStroke: `14px ${STROKE}`, paintOrder: 'stroke fill',
      textShadow: `0 8px 0 ${STROKE}, 0 12px 24px rgba(74,58,46,.45)`,
    }}>
      {caps.map((c, i) => (f >= c[0] && f < c[1] ? <Line key={i} cap={c} idx={i} f={f} /> : null))}
    </div>
  );
};
