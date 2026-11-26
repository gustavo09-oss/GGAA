import React, { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { C, crop, useTex } from '../assets';
import { clamp, easeOut, easeOutBack, hash } from '../anim';

const PAL = [C.terracota, C.mostarda, C.salvia, C.ceu, C.rosa, C.lavanda, '#FFFFFF'];

// Explosão de confete (InstancedMesh)
export const Confetti: React.FC<{ f: number; start: number; origin: number[]; n?: number }> = ({ f, start, origin, n = 260 }) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useLayoutEffect(() => {
    const m = ref.current!;
    const t = Math.max(0, (f - start) / 30);
    for (let i = 0; i < n; i++) {
      const th = hash(i) * Math.PI * 2, ph = hash(i + 99) * Math.PI * 0.9;
      const sp = 4 + hash(i + 7) * 6;
      const v = [Math.cos(th) * Math.sin(ph) * sp, Math.cos(ph) * sp * 0.9 + 2.5, Math.sin(th) * Math.sin(ph) * sp * 0.6 + 2];
      const drag = (1 - Math.exp(-2.2 * t)) / 2.2;
      dummy.position.set(origin[0] + v[0] * drag, origin[1] + v[1] * drag - 2.2 * t * t, origin[2] + v[2] * drag);
      dummy.rotation.set(t * (4 + hash(i + 3) * 8), t * (3 + hash(i + 5) * 6), hash(i + 1) * 6);
      dummy.scale.setScalar(t > 0 ? 1 : 0);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      if (!m.instanceColor) m.setColorAt(i, new THREE.Color(PAL[i % PAL.length]));
      else m.setColorAt(i, new THREE.Color(PAL[i % PAL.length]));
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, n]} frustumCulled={false}>
      <planeGeometry args={[0.1, 0.16]} />
      <meshStandardMaterial side={THREE.DoubleSide} roughness={0.6} />
    </instancedMesh>
  );
};

// Brilhos/estrelinhas cintilando em volta de um centro
export const Sparkles: React.FC<{ f: number; center: number[]; spread: number[]; n?: number; opacity?: number }> = ({ f, center, spread, n = 34, opacity = 1 }) => {
  const tex = useTex();
  return (
    <group>
      {Array.from({ length: n }, (_, i) => {
        const ph = hash(i * 3.1) * Math.PI * 2;
        const tw = Math.pow(Math.max(0, Math.sin(f * (0.08 + hash(i) * 0.08) + ph)), 3);
        const x = center[0] + (hash(i + 11) - 0.5) * spread[0] + Math.sin(f * 0.02 + i) * 0.1;
        const y = center[1] + (hash(i + 23) - 0.5) * spread[1] + ((f * 0.004 * (1 + hash(i))) % 1) * 0.6;
        const z = center[2] + (hash(i + 37) - 0.5) * spread[2];
        const s = (0.08 + hash(i + 5) * 0.14) * (0.4 + tw);
        return (
          <sprite key={i} position={[x, y, z]} scale={[s, s, s]}>
            <spriteMaterial map={tex.sparkle} transparent opacity={tw * opacity} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
          </sprite>
        );
      })}
    </group>
  );
};

// Parede com 510 fichas (17 colunas x 30 linhas)
export const WALL = { cols: 17, rows: 30, cw: 0.62, ch: 0.8, center: [0, 12.6, -16] as number[] };
export const wallCell = (c: number, r: number) => [
  WALL.center[0] + (c - (WALL.cols - 1) / 2) * WALL.cw,
  WALL.center[1] - (r - (WALL.rows - 1) / 2) * WALL.ch,
  WALL.center[2],
];
export const HERO_CELL = [8, 14];

export const FichaWall: React.FC<{ f: number; appear: number; fall: number }> = ({ f, appear, fall }) => {
  const tex = useTex();
  const mats = useMemo(() => Array.from({ length: 30 }, (_, k) =>
    new THREE.MeshStandardMaterial({ map: crop(tex.wall_atlas, (k % 6) / 6, Math.floor(k / 6) / 5, (k % 6 + 1) / 6, (Math.floor(k / 6) + 1) / 5), roughness: 0.85 })), [tex]);
  const geo = useMemo(() => new THREE.PlaneGeometry(0.56, 0.725), []);
  const cells = useMemo(() => {
    const groups: number[][][] = Array.from({ length: 30 }, () => []);
    let k = 0;
    for (let r = 0; r < WALL.rows; r++) for (let c = 0; c < WALL.cols; c++) {
      if (c === HERO_CELL[0] && r === HERO_CELL[1]) continue;
      groups[(k * 7 + r * 3) % 30].push([c, r]);
      k++;
    }
    return groups;
  }, []);
  const refs = useRef<THREE.InstancedMesh[]>([]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useLayoutEffect(() => {
    cells.forEach((list, g) => {
      const m = refs.current[g];
      if (!m) return;
      list.forEach(([c, r], i) => {
        const [x, y, z] = wallCell(c, r);
        const dist = Math.hypot(c - HERO_CELL[0], (r - HERO_CELL[1]) * 0.8);
        const t = clamp((f - appear - dist * 2.3) / 12);
        const ft = Math.max(0, (f - fall - hash(c * 31 + r) * 10) / 30);
        dummy.position.set(x, y - ft * ft * 30, z + 0.1 + Math.sin(f * 0.05 + c * 0.6 + r * 0.4) * 0.08 * t);
        dummy.rotation.set(ft * 3 * hash(r + c), (1 - easeOut(t)) * Math.PI * 0.5, ft * 2 * (hash(c) - 0.5));
        dummy.scale.setScalar(Math.max(0.0001, easeOutBack(t)));
        dummy.updateMatrix();
        m.setMatrixAt(i, dummy.matrix);
      });
      m.instanceMatrix.needsUpdate = true;
    });
  });
  return (
    <group>
      {cells.map((list, g) => (
        <instancedMesh key={g} ref={(el) => { if (el) refs.current[g] = el; }} args={[geo, mats[g], list.length]} frustumCulled={false} />
      ))}
    </group>
  );
};

// Raios de luz atrás do produto
export const Rays: React.FC<{ f: number; opacity: number } & any> = ({ f, opacity, ...p }) => {
  const tex = useTex();
  return (
    <mesh {...p} rotation={[0, 0, f * 0.006]}>
      <planeGeometry args={[9, 9]} />
      <meshBasicMaterial map={tex.rays} transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
    </mesh>
  );
};
