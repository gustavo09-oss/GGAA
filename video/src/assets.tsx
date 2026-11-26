import React, { createContext, useContext, useEffect, useState } from 'react';
import * as THREE from 'three';
import { continueRender, delayRender, staticFile } from 'remotion';

const NAMES = [
  'img/cover.png', 'img/ficha_main.png', 'img/ficha_hero.png', 'img/wall_atlas.jpg',
  'tex/pages.png', 'tex/paper.png', 'tex/timer.png', 'tex/clock.png', 'tex/price.png', 'tex/button.png',
  ...Array.from({ length: 11 }, (_, i) => `tex/card_${String(i + 1).padStart(2, '0')}.png`),
  ...Array.from({ length: 4 }, (_, i) => `tex/bonus_${i + 1}.png`),
];

export type Tex = Record<string, THREE.Texture>;
const Ctx = createContext<Tex | null>(null);
let GLOBAL: Tex | null = null;
export const useTex = () => useContext(Ctx) ?? GLOBAL!;

const canvasTex = (w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) => {
  const cv = document.createElement('canvas');
  cv.width = w; cv.height = h;
  draw(cv.getContext('2d')!);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

const proc = (): Tex => ({
  sparkle: canvasTex(128, 128, (c) => {
    const g = c.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,248,225,1)'); g.addColorStop(0.18, 'rgba(255,230,170,.75)'); g.addColorStop(1, 'rgba(255,220,150,0)');
    c.fillStyle = g; c.fillRect(0, 0, 128, 128);
    c.fillStyle = 'rgba(255,252,240,1)';
    c.beginPath();
    c.moveTo(64, 4); c.quadraticCurveTo(68, 60, 124, 64); c.quadraticCurveTo(68, 68, 64, 124); c.quadraticCurveTo(60, 68, 4, 64); c.quadraticCurveTo(60, 60, 64, 4);
    c.fill();
  }),
  glow: canvasTex(256, 256, (c) => {
    // retângulo arredondado difuso (para o brilho dos blocos da ficha)
    c.filter = 'blur(18px)';
    c.fillStyle = '#fff';
    c.beginPath(); (c as any).roundRect(40, 40, 176, 176, 30); c.fill();
  }),
  rays: canvasTex(1024, 1024, (c) => {
    c.translate(512, 512);
    for (let i = 0; i < 18; i++) {
      c.rotate((Math.PI * 2) / 18);
      const g = c.createLinearGradient(0, 0, 0, -512);
      g.addColorStop(0, 'rgba(255,236,190,0.9)'); g.addColorStop(1, 'rgba(255,236,190,0)');
      c.fillStyle = g;
      c.beginPath(); c.moveTo(0, 0); c.lineTo(-40, -512); c.lineTo(40, -512); c.closePath(); c.fill();
    }
    const r = c.createRadialGradient(0, 0, 0, 0, 0, 420);
    r.addColorStop(0, 'rgba(255,244,215,1)'); r.addColorStop(1, 'rgba(255,244,215,0)');
    c.fillStyle = r; c.fillRect(-512, -512, 1024, 1024);
  }),
  bg: canvasTex(64, 512, (c) => {
    const g = c.createLinearGradient(0, 0, 0, 512);
    g.addColorStop(0, '#FBF3E8'); g.addColorStop(0.55, '#F3E9DC'); g.addColorStop(1, '#E9D9C4');
    c.fillStyle = g; c.fillRect(0, 0, 64, 512);
  }),
  ring: canvasTex(256, 256, (c) => {
    c.strokeStyle = '#fff'; c.lineWidth = 14; c.filter = 'blur(3px)';
    c.beginPath(); c.arc(128, 128, 100, 0, Math.PI * 2); c.stroke();
  }),
});

export const TexProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tex, setTex] = useState<Tex | null>(null);
  const [handle] = useState(() => delayRender('texturas'));
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    Promise.all(NAMES.map((n) => loader.loadAsync(staticFile(n)).then((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      return [n.replace(/^.*\//, '').replace(/\.(png|jpg)$/, ''), t] as const;
    }))).then((list) => {
      const map: Tex = Object.fromEntries(list);
      Object.assign(map, proc());
      GLOBAL = map;
      setTex(map);
      continueRender(handle);
    });
  }, [handle]);
  if (!tex) return null;
  return <Ctx.Provider value={tex}>{children}</Ctx.Provider>;
};

// recorte de uma região da textura (u0,v0)-(u1,v1) com v medido do topo
export const crop = (t: THREE.Texture, u0: number, v0: number, u1: number, v1: number) => {
  const c = t.clone();
  c.repeat.set(u1 - u0, v1 - v0);
  c.offset.set(u0, 1 - v1);
  c.needsUpdate = true;
  return c;
};

export const C = {
  bg: '#F3E9DC', bege: '#E6D5BE', begeEsc: '#C9AE8C', cafe: '#4A3A2E', creme: '#FBF7F1',
  salvia: '#8FAE8B', terracota: '#D9896C', ceu: '#8DB8D6', mostarda: '#E2B45A', rosa: '#D9A5A0', lavanda: '#A99BC9',
};
export const MOD_COLORS = ['#E2B45A', '#8FAE8B', '#D9896C', '#8DB8D6', '#D9A5A0', '#A99BC9', '#D6A445', '#7FA27B', '#CB7E62', '#79A7C9', '#B795B9'];
