import React, { useEffect, useState } from 'react';
import { AbsoluteFill, Composition, continueRender, delayRender, staticFile, useCurrentFrame } from 'remotion';
import { Scene3D, Version } from './Scene3D';
import { Captions } from './Captions';
import { captionsFor, Lang } from './captions';
import { hash } from './anim';

type Props = { version: Version; lang: Lang; captions: boolean; scene: boolean };

const useFonts = () => {
  const [h] = useState(() => delayRender('fontes'));
  useEffect(() => {
    const ff = new FontFace('FredokaCap', `url(${staticFile('fonts/Fredoka.ttf')})`, { weight: '300 700' });
    ff.load().then((f) => { (document.fonts as any).add(f); continueRender(h); });
  }, [h]);
};

// bokeh desfocado em primeiro plano (profundidade de campo "fake") + vinheta quente
const Finish: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {Array.from({ length: 7 }, (_, i) => {
        const x = hash(i + 1) * 1080, y = hash(i + 50) * 1920;
        const r = 60 + hash(i + 9) * 110;
        return <div key={i} style={{
          position: 'absolute', left: x + Math.sin(f * 0.01 + i) * 40 - r, top: y - f * (0.3 + hash(i) * 0.5) % 1920 - r, width: r * 2, height: r * 2,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,236,200,.35), rgba(255,236,200,0) 70%)', filter: 'blur(6px)',
        }} />;
      })}
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse 85% 70% at 50% 42%, rgba(0,0,0,0) 55%, rgba(74,58,46,.22) 100%)' }} />
      <AbsoluteFill style={{ background: 'linear-gradient(160deg, rgba(255,226,180,.10), rgba(255,226,180,0) 40%)', mixBlendMode: 'screen' }} />
    </AbsoluteFill>
  );
};

const Criativo: React.FC<Props> = ({ version, lang, captions, scene }) => {
  useFonts();
  return (
    <AbsoluteFill style={{ background: scene ? '#F3E9DC' : 'transparent' }}>
      {scene && <Scene3D version={version} />}
      {scene && <Finish />}
      {captions && <Captions caps={captionsFor(version, lang)} />}
    </AbsoluteFill>
  );
};

export const Root: React.FC = () => (
  <Composition id="Criativo" component={Criativo as any} durationInFrames={900} fps={30} width={1080} height={1920}
    defaultProps={{ version: 'A', lang: 'es', captions: true, scene: true } as Props} />
);
