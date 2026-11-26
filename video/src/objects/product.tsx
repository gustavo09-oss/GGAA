import React, { useMemo } from 'react';
import * as THREE from 'three';
import { C, MOD_COLORS, crop, useTex } from '../assets';
import { Clay, useRounded } from './shapes';
import { clamp, easeInOut, hash } from '../anim';

const W = 2.1, D = 2.7, T = 0.36;

// Página que vira, com curvatura
const FlipPage: React.FC<{ theta: number; map: THREE.Texture; y: number }> = ({ theta, map, y }) => {
  const SEG = 18, L = 2.0, Z = 2.56;
  const geo = useMemo(() => new THREE.PlaneGeometry(L, Z, SEG, 1), []);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const curl = 0.9 * Math.sin(theta);
  let x = 0, yy = 0;
  const xs: number[] = [0], ys: number[] = [0];
  for (let i = 0; i < SEG; i++) {
    const s = (i + 0.5) / SEG;
    const a = theta - curl * s * s;
    x += Math.cos(a) * (L / SEG);
    yy += Math.sin(a) * (L / SEG);
    xs.push(x); ys.push(yy);
  }
  for (let r = 0; r < 2; r++) {
    for (let i = 0; i <= SEG; i++) {
      const k = r * (SEG + 1) + i;
      pos.setXYZ(k, xs[i], ys[i], r === 0 ? -Z / 2 : Z / 2);
    }
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return (
    <mesh geometry={geo} position={[-1.0, y, 0]} castShadow>
      <meshStandardMaterial map={map} side={THREE.DoubleSide} roughness={0.9} />
    </mesh>
  );
};

export const Book: React.FC<{ open?: number; flip?: number; squash?: number } & any> = ({ open = 0, flip = 0, squash = 0, ...p }) => {
  const tex = useTex();
  const edge = useMemo(() => { const t = tex.pages.clone(); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1, 6); t.needsUpdate = true; return t; }, [tex]);
  const pageMaps = useMemo(() => Array.from({ length: 6 }, (_, i) => {
    const k = [4, 11, 17, 22, 26, 8][i];
    return crop(tex.wall_atlas, (k % 6) / 6, Math.floor(k / 6) / 5, (k % 6 + 1) / 6, (Math.floor(k / 6) + 1) / 5);
  }), [tex]);
  const rightTop = useMemo(() => crop(tex.wall_atlas, 2 / 6, 1 / 5, 3 / 6, 2 / 5), [tex]);
  const coverGeo = useRounded(W, 0.05, D, 0.02, 2);
  const theta = easeInOut(clamp(open)) * Math.PI;
  const sq = 1 - squash;
  return (
    <group {...p}>
      <group scale={[1 + squash * 0.5, sq, 1 + squash * 0.5]}>
        {/* contracapa */}
        <mesh geometry={coverGeo} position={[0, 0.025, 0]} castShadow receiveShadow><Clay color={C.begeEsc} /></mesh>
        {/* miolo (bloco de páginas) */}
        <mesh position={[0.02, T / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[W - 0.1, T - 0.08, D - 0.08]} />
          <meshStandardMaterial attach="material-0" map={edge} roughness={0.9} />
          <meshStandardMaterial attach="material-1" map={edge} roughness={0.9} />
          <meshStandardMaterial attach="material-2" color={C.creme} roughness={0.9} />
          <meshStandardMaterial attach="material-3" color={C.creme} roughness={0.9} />
          <meshStandardMaterial attach="material-4" map={edge} roughness={0.9} />
          <meshStandardMaterial attach="material-5" map={edge} roughness={0.9} />
        </mesh>
        {open > 0.02 && (
          <mesh position={[0.02, T - 0.039, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[W - 0.12, D - 0.1]} /><meshStandardMaterial map={rightTop} roughness={0.9} />
          </mesh>
        )}
        {/* bloco esquerdo que aparece quando o livro abre */}
        {open > 0.02 && (
          <mesh position={[-W + 0.02, (T - 0.04) * clamp(open) / 2, 0]} scale={[1, Math.max(0.01, clamp(open)), 1]} castShadow receiveShadow>
            <boxGeometry args={[W - 0.1, T - 0.08, D - 0.08]} /><meshStandardMaterial color={C.creme} roughness={0.9} />
          </mesh>
        )}
        {/* lombada */}
        <mesh position={[-W / 2, T / 2, 0]} castShadow><boxGeometry args={[0.06, T + 0.02, D]} /><Clay color={C.terracota} /></mesh>
        {/* páginas virando */}
        {pageMaps.map((m, i) => {
          const start = i * 0.13;
          const t = clamp((flip - start) / 0.3);
          if (t <= 0 || t >= 1) return null;
          return <FlipPage key={i} theta={easeInOut(t) * Math.PI} map={m} y={T - 0.035 + i * 0.002} />;
        })}
        {/* capa (articulada na lombada) */}
        <group position={[-W / 2, T, 0]} rotation={[0, 0, theta]}>
          <mesh geometry={coverGeo} position={[W / 2, 0, 0]} castShadow receiveShadow><Clay color={C.bege} /></mesh>
          <mesh position={[W / 2, 0.027, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[W - 0.03, D - 0.03]} /><meshStandardMaterial map={tex.cover} roughness={0.75} />
          </mesh>
          <mesh position={[W / 2, -0.027, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[W - 0.06, D - 0.06]} /><meshStandardMaterial color={C.bg} roughness={0.9} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// Cartão de módulo
export const ModuleCard: React.FC<{ i: number } & any> = ({ i, ...p }) => {
  const tex = useTex();
  const geo = useRounded(1.0, 1.4, 0.04, 0.05, 3);
  return (
    <group {...p}>
      <mesh geometry={geo} castShadow><Clay color={MOD_COLORS[i]} /></mesh>
      <mesh position={[0, 0, 0.0215]}><planeGeometry args={[0.96, 1.344]} /><meshStandardMaterial map={tex[`card_${String(i + 1).padStart(2, '0')}`]} roughness={0.8} /></mesh>
    </group>
  );
};

// Regiões dos blocos na ficha (u0, v0, u1, v1), medidas na página renderizada do PDF
export const BLOCKS = [
  [0.068, 0.205, 0.542, 0.345], // Objetivo
  [0.552, 0.205, 0.932, 0.345], // Materiales
  [0.062, 0.352, 0.932, 0.551], // Paso a paso
  [0.066, 0.556, 0.932, 0.672], // Adaptaciones
];
export const FW = 2.0, FH = 2.0 * 2420 / 1870;

export const Ficha: React.FC<{ hi?: number[]; which?: 'main' | 'hero'; glow?: number } & any> = ({ hi = [0, 0, 0, 0], which = 'main', glow = 0, ...p }) => {
  const tex = useTex();
  const map = which === 'main' ? tex.ficha_main : tex.ficha_hero;
  const crops = useMemo(() => BLOCKS.map(([a, b, c, d]) => crop(map, a, b, c, d)), [map]);
  const back = useRounded(FW + 0.06, FH + 0.06, 0.03, 0.04, 2);
  const dim = Math.max(...hi);
  return (
    <group {...p}>
      <mesh geometry={back} castShadow receiveShadow position={[0, 0, -0.016]}><Clay color={C.creme} /></mesh>
      {glow > 0 && (
        <mesh position={[0, 0, -0.05]} scale={[FW * 1.5, FH * 1.4, 1]}>
          <planeGeometry /><meshBasicMaterial map={tex.glow} color={C.mostarda} transparent opacity={glow} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      )}
      <mesh position={[0, 0, 0.001]}>
        <planeGeometry args={[FW, FH]} />
        <meshStandardMaterial map={map} roughness={0.85} color={new THREE.Color(1, 1, 1).lerp(new THREE.Color('#8a7d72'), dim * 0.7)} />
      </mesh>
      {which === 'main' && BLOCKS.map(([u0, v0, u1, v1], k) => {
        const h = hi[k];
        if (h <= 0.001) return null;
        const w = (u1 - u0) * FW, hh = (v1 - v0) * FH;
        const x = ((u0 + u1) / 2 - 0.5) * FW, y = (0.5 - (v0 + v1) / 2) * FH;
        const s = 1 + 0.07 * h;
        return (
          <group key={k} position={[x, y, 0.004 + 0.16 * h]} scale={[s, s, 1]}>
            <mesh position={[0, 0, -0.003]} scale={[w * 1.35, hh * 1.5, 1]}>
              <planeGeometry /><meshBasicMaterial map={tex.glow} color="#FFD98A" transparent opacity={0.5 * h} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
            <mesh castShadow>
              <planeGeometry args={[w, hh]} /><meshBasicMaterial map={crops[k]} toneMapped={false} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

export const BonusBook: React.FC<{ i: number } & any> = ({ i, ...p }) => {
  const tex = useTex();
  const geo = useRounded(1.12, 1.5, 0.12, 0.03, 2);
  return (
    <group {...p}>
      <mesh geometry={geo} castShadow receiveShadow><Clay color={['#8FAE8B', '#8DB8D6', '#D9896C', '#A99BC9'][i]} /></mesh>
      <mesh position={[0, 0, 0.0625]}><planeGeometry args={[1.08, 1.45]} /><meshStandardMaterial map={tex[`bonus_${i + 1}`]} roughness={0.8} /></mesh>
    </group>
  );
};

// Folha que se amassa e vira bolinha
export const Crumple: React.FC<{ t: number } & any> = ({ t, ...p }) => {
  const tex = useTex();
  const NX = 24, NY = 32;
  const geo = useMemo(() => new THREE.PlaneGeometry(1.5, 2.0, NX, NY), []);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const uv = geo.attributes.uv as THREE.BufferAttribute;
  for (let k = 0; k < pos.count; k++) {
    const u = uv.getX(k), v = uv.getY(k);
    const fx = (u - 0.5) * 1.5, fz = -(v - 0.5) * 2.0;
    const d = Math.min(1, Math.hypot(u - 0.5, v - 0.5) * 1.6);
    const lt = easeInOut(clamp((t - (1 - d) * 0.25) / 0.75));
    const lon = u * Math.PI * 2, lat = (v - 0.5) * Math.PI * 0.96;
    const n = hash(Math.floor(u * 9) * 17 + Math.floor(v * 11) * 31);
    const r = 0.3 * (0.85 + 0.3 * n);
    const sx = Math.cos(lat) * Math.cos(lon) * r, sy = Math.sin(lat) * r, sz = Math.cos(lat) * Math.sin(lon) * r;
    const wr = Math.sin(lt * Math.PI) * 0.12 * (hash(k * 1.7) - 0.3);
    pos.setXYZ(k, fx + (sx - fx) * lt, 0.012 + (sy + 0.3 - 0.012) * lt + wr, fz + (sz - fz) * lt);
  }
  pos.needsUpdate = true;
  return (
    <mesh geometry={geo} castShadow receiveShadow={t > 0.05} {...p}>
      <meshStandardMaterial map={tex.paper} side={THREE.DoubleSide} roughness={0.9} flatShading={t > 0.01} emissive="#FFF6EA" emissiveIntensity={0.18 + 0.22 * t} />
    </mesh>
  );
};
