import React, { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { ThreeCanvas } from '@remotion/three';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { C, useTex, TexProvider } from './assets';
import { Key, clamp, drop, easeIn, easeInOut, easeOut, easeOutBack, hash, lerp, prog, spring, track } from './anim';
import { AlarmClock, Arrow, Button3D, Cup, Dove, Gift, Heart, Pencil, PriceSeal, Scissors, Spool, Star, Stopwatch, ballGeo, Clay } from './objects/shapes';
import { Book, BonusBook, Crumple, FW, FH, Ficha, ModuleCard } from './objects/product';
import { Confetti, FichaWall, HERO_CELL, Rays, Sparkles, wallCell } from './objects/fx';

export type Version = 'A' | 'B';

// ---------- câmera ----------
const F = [0, 2.2, 2.2]; // posição da ficha em pé (cena principal)
const blockCam = (bx: number, by: number, d: number, below: number) => [
  [F[0] + bx, F[1] + by - below, F[2] + d], [F[0] + bx, F[1] + by - below, F[2]],
];
const BC = {
  obj: blockCam(-0.39, 0.6, 2.7, 0.37),
  mat: blockCam(0.48, 0.6, 2.7, 0.37),
  paso: blockCam(-0.4, 0.13, 2.9, 0.4),
  paso2: blockCam(0.1, 0.13, 2.9, 0.4),
  adap: blockCam(-0.3, -0.3, 2.9, 0.4),
  adap2: blockCam(0.08, -0.3, 2.9, 0.4),
};
// [frame, [px,py,pz, tx,ty,tz]]
const K = (f: number, p: number[], t: number[]): Key => [f, [...p, ...t]];
const CAM_A: Key[] = [
  K(0, [3.4, 8.8, 7.6], [0, 0, 0]),
  K(22, [1.4, 6.0, 5.0], [-0.1, 0, -0.1]),
  K(58, [0.4, 4.3, 3.3], [0, 0, 0.1]),
  K(92, [0.05, 3.2, 2.35], [0, 0, 0.25]),
  K(135, [0.1, 3.3, 2.6], [0, 0.2, 0.25]),
  K(160, [0.25, 3.5, 2.9], [0, 0.25, 0.25]),
  K(169, [3.3, 1.25, 2.9], [0, 0.45, 0]),
  K(228, [2.7, 1.5, 3.7], [0, 0.55, 0]),
  K(238, [0, 6.9, 5.7], [0, 0.3, 0]),
  K(262, [0, 6.3, 5.1], [0, 0.3, 0]),
  K(300, [0, 5.3, 3.5], [0, 0.3, 0.05]),
  K(338, [0, 3.0, 9.0], [0, 2.0, 0]),
  K(372, [0, 2.8, 7.4], [0, 2.15, 0]),
  K(404, BC.obj[0], BC.obj[1]),
  K(428, [BC.obj[0][0] + 0.04, BC.obj[0][1], BC.obj[0][2] - 0.1], BC.obj[1]),
  K(442, BC.mat[0], BC.mat[1]),
  K(460, [BC.mat[0][0] - 0.04, BC.mat[0][1], BC.mat[0][2] - 0.1], BC.mat[1]),
  K(470, [F[0] + 1.9, F[1] - 0.2, F[2] + 2.3], [F[0] - 0.15, F[1] - 0.15, F[2]]),
  K(490, [F[0] + 1.5, F[1] - 0.3, F[2] + 2.5], [F[0] - 0.05, F[1] - 0.35, F[2]]),
  K(510, [F[0] + 1.2, F[1] - 0.5, F[2] + 2.6], [F[0] + 0.05, F[1] - 0.6, F[2]]),
  K(519, [0.15, 2.4, 2.0], [-0.8, 0.25, -1.4]),
  K(556, [0.0, 2.3, 1.75], [-0.8, 0.25, -1.4]),
  K(566, [0, 4.6, 3.7], [0, 0, 0.2]),
  K(608, [0.3, 4.3, 3.4], [0, 0, 0.25]),
  K(618, [0.3, 1.2, 4.4], [0, 1.7, 0]),
  K(656, [-0.3, 1.6, 4.2], [0, 2.6, 0]),
  K(668, [-0.1, 3.3, 7.9], [0.0, 0.6, 0]),
  K(716, [-0.05, 3.2, 7.4], [0.0, 0.65, 0]),
  K(726, [0.12, 2.4, 11.2], [0.12, 0.1, 0]),
  K(776, [0.12, 2.45, 11.0], [0.12, 0.1, 0]),
  K(786, [0.1, 2.1, 8.6], [0.1, -0.05, 2.0]),
  K(836, [0.1, 2.0, 8.1], [0.1, -0.05, 2.0]),
  K(846, [0.12, 2.5, 12.0], [0.12, 0.05, 0]),
  K(900, [0.12, 2.35, 11.4], [0.12, 0.05, 0]),
];
const HC = wallCell(HERO_CELL[0], HERO_CELL[1]);
const HERO = [HC[0], HC[1], -11]; // ficha herói (versão B)
const CAM_B: Key[] = [
  K(0, [0, HERO[1] + 0.8, HERO[2] + 8.5], HERO),
  K(18, [0, HERO[1] - 0.1, HERO[2] + 5.6], HERO),
  K(60, [0.15, HERO[1] - 0.15, HERO[2] + 5.9], HERO),
  K(96, [0, HERO[1] - 0.1, HERO[2] + 5.7], HERO),
  K(138, [0.5, HC[1] + 0.3, -6.5], [0, HC[1], -16]),
  K(150, [0.6, HC[1] + 0.35, -5.8], [0, HC[1], -16]),
  K(160, [5.6, 15.0, 6.5], [0.3, 12.4, -16]),
  K(206, [6.2, 15.2, 8.8], [0.3, 12.4, -16]),
  K(222, [4.6, 13.2, 10.5], [0.2, 9.0, -13]),
  K(232, [0, 7.1, 5.9], [0, 0.3, 0]),
  K(240, [0, 6.9, 5.7], [0, 0.3, 0]),
  K(250, [0, 6.7, 5.5], [0, 0.3, 0]),
  ...CAM_A.filter(([f]) => f >= 262),
];

const CameraRig: React.FC<{ f: number; v: Version }> = ({ f, v }) => {
  const { camera, scene, gl } = useThree();
  const tex = useTex();
  const light = useRef<THREE.DirectionalLight>(null);
  useMemo(() => {
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    (scene as any).environmentIntensity = 0.45;
    scene.background = tex.bg;
    scene.fog = new THREE.Fog(C.bg, 10, 30);
  }, [gl, scene, tex]);
  useLayoutEffect(() => {
    const k = track(v === 'A' ? CAM_A : CAM_B, f);
    // tremida curta quando o livro cai
    const sh = f > 252 && f < 266 ? Math.exp(-(f - 252) / 4) * 0.06 : 0;
    camera.position.set(k[0] + Math.sin(f * 2.1) * sh, k[1] + Math.cos(f * 2.7) * sh, k[2]);
    camera.lookAt(k[3], k[4], k[5]);
    (camera as THREE.PerspectiveCamera).fov = 40;
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
    const wallPhase = v === 'B' && f < 236;
    const fog = scene.fog as THREE.Fog;
    fog.near = wallPhase ? 30 : 11;
    fog.far = wallPhase ? 80 : 34;
    const L = light.current!;
    L.intensity = wallPhase ? 1.35 : 2.3;
    L.position.set(k[3] - 4, k[4] + 8, k[5] + 4);
    L.target.position.set(k[3], k[4], k[5]);
    L.target.updateMatrixWorld();
  });
  return (
    <>
      <hemisphereLight args={['#FFF8EF', '#D8C4A8', 1.1]} />
      <directionalLight ref={light} color="#FFF5EA" intensity={2.25} castShadow
        shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004} shadow-normalBias={0.02}
        shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-5} shadow-camera-near={0.5} shadow-camera-far={30} />
      <directionalLight position={[5, 3, 6]} color="#E9F0FF" intensity={0.45} />
    </>
  );
};

// ---------- utilidades ----------
const scatter = (f: number, p: number[], seed: number) => {
  const t = easeOut(prog(f, 244, 268));
  let dx = p[0], dz = p[2];
  const L = Math.hypot(dx, dz) || 1;
  dx /= L; dz /= L;
  return { pos: [p[0] + dx * 4 * t, p[1] + Math.sin(t * Math.PI) * 1.4, p[2] + dz * 4 * t], rot: t * (3 + seed), s: 1 - easeIn(prog(f, 256, 272)) };
};
const bell = (f: number, a: number, b: number, r = 6) => Math.min(easeOut(prog(f, a, a + r)), 1 - easeIn(prog(f, b - r, b)));
const BALLS = Array.from({ length: 9 }, (_, i) => {
  const a = i * 2.4 + 0.5, r = 1.0 + hash(i + 4) * 0.9;
  return { x: Math.cos(a) * r * 1.1, z: Math.sin(a) * r * 0.9 + 0.3, start: 168 + i * 6 + Math.floor(hash(i) * 3), seed: i };
});

const Podium: React.FC = () => (
  <group>
    <mesh position={[0, -2, 0.2]} receiveShadow castShadow><cylinderGeometry args={[2.45, 2.45, 4, 96]} /><Clay color="#E8D7C0" /></mesh>
    <mesh position={[0, -0.0, 0.2]} rotation={[Math.PI / 2, 0, 0]} receiveShadow><torusGeometry args={[2.42, 0.07, 16, 96]} /><Clay color={C.begeEsc} /></mesh>
    <mesh position={[0, -0.32, 0.2]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[2.47, 0.05, 16, 96]} /><Clay color={C.terracota} /></mesh>
    <mesh position={[0, 0.001, 0.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><circleGeometry args={[2.42, 96]} /><Clay color="#F0E3D1" /></mesh>
  </group>
);

// ---------- mundo ----------
const World: React.FC<{ f: number; v: Version }> = ({ f, v }) => {
  const tex = useTex();
  const ballGeos = useMemo(() => BALLS.map((b) => ballGeo(b.seed * 13.7)), []);
  const A = v === 'A';
  const step = (Math.PI * 4) / 11;

  // ---- livro (cena principal) ----
  const bookDrop = drop(f, 239, 13);
  const bookY = 4.6 * bookDrop.h;
  const open = prog(f, 266, 290);
  const flip = prog(f, 276, 320);

  // ---- carrossel ----
  const carRot = -6 * step - (1 - easeOut(prog(f, 300, 382))) * Math.PI * 1.3;
  const R = 1.55;
  const cardSlot = (i: number, extra = 0) => {
    const phi = carRot + i * step;
    const rr = R + extra;
    return { pos: [Math.sin(phi) * rr, 0.85 + i * 0.3, Math.cos(phi) * rr], phi };
  };
  const scatterCards = easeIn(prog(f, 384, 412));

  // ---- mergulho / ficha ----
  const flipCard = prog(f, 378, 392);
  const fichaIn = f >= 391;
  const fichaRot = -(Math.PI / 2) * (1 - easeOutBack(prog(f, 391, 404), 2.2));
  const lay = easeInOut(prog(f, 512, 540));
  const intoBook = easeIn(prog(f, 662, 680));
  const fichaPos = [
    lerp(lerp(F[0], 0, lay), 0, intoBook),
    lerp(lerp(F[1], 0.03, lay), 1.35, intoBook),
    lerp(lerp(F[2], 0.3, lay), -0.1, intoBook),
  ];
  const fichaScale = 1 - intoBook * 0.6;
  const hi = [bell(f, 404, 438), bell(f, 437, 466), bell(f, 465, 498), bell(f, 497, 518)];
  const absorb = prog(f, 612, 628);

  // ---- bundle final ----
  const standDrop = drop(f, 662, 12);
  const fan = easeOutBack(prog(f, 722, 748), 1.3);
  const SLOTS = [
    [-1.48, 2.15, -0.1, 0.62], [-1.48, 0.76, 0.1, 0.62], [1.48, 0.76, 0.1, -0.62], [1.48, 2.15, -0.1, -0.62],
  ];
  const giftT = spring(f, 718);
  const giftOpen = easeOutBack(prog(f, 736, 750));
  const giftOut = easeIn(prog(f, 770, 790));
  const adv = easeInOut(prog(f, 744, 772));

  const tgt = track(A ? CAM_A : CAM_B, f).slice(3);

  return (
    <>
      <CameraRig f={f} v={v} />

      {/* mesa (cai no final e revela o pódio) */}
      <group position={[0, -easeIn(prog(f, 660, 682)) * 4, 0]} visible={f < 684}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#E9DCCA" roughness={0.95} />
      </mesh>
      {/* tapete oval como na capa */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0.002, 0.2]} scale={[1, 0.62, 1]}>
        <circleGeometry args={[3.2, 64]} />
        <meshStandardMaterial color="#E4D5C0" roughness={0.95} />
      </mesh>
      </group>
      {f >= 662 && <Podium />}
      {f >= 684 && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]} receiveShadow>
          <planeGeometry args={[80, 80]} /><meshStandardMaterial color={C.bege} roughness={0.95} />
        </mesh>
      )}

      {/* ===== Versão A: 0–8s ===== */}
      {A && f < 285 && (() => {
        const pIn = easeOut(prog(f, 0, 14));
        const paperBase = [0, 3 * (1 - pIn), 0.25];
        const sc = scatter(f, [0.1, 0, 0.35], 0);
        const ballLift = easeOutBack(prog(f, 128, 142)) * 0.0;
        const clockS = easeOutBack(prog(f, 4, 20), 2.5);
        const ring = f < 46 ? Math.sin(f * 2.4) * 0.12 * Math.exp(-f / 30) : 0;
        const csc = scatter(f, [-0.6, 0, -1.35], 1);
        const pRoll = easeOut(prog(f, 6, 26));
        const psc = scatter(f, [0.95, 0, 0.75], 2);
        return (
          <group>
            <group position={f < 244 ? [paperBase[0], paperBase[1] + ballLift, paperBase[2]] : sc.pos as any}
              rotation={[Math.sin(f * 0.3) * 0.2 * (1 - pIn), 0.08 + (f >= 244 ? sc.rot : 0), 0]} scale={f >= 244 ? sc.s : 1}>
              <Crumple t={prog(f, 96, 130)} />
            </group>
            <group position={f < 244 ? [0.95 + (1 - pRoll) * 3, 0.075, 0.75] : psc.pos as any} rotation={[(1 - pRoll) * 9, -0.5, 0]} scale={f >= 244 ? psc.s : 1}>
              <Pencil color={C.mostarda} />
            </group>
            <group position={f < 244 ? [-0.6, 0.55, -1.35] : [csc.pos[0], csc.pos[1] + 0.55, csc.pos[2]]}
              rotation={[-0.2 - easeOutBack(prog(f, 192, 206), 1.2) * 1.25 * (f < 244 ? 1 : 0), 0.3, ring + (f >= 244 ? csc.rot : 0)]} scale={(f >= 244 ? csc.s : 1) * Math.max(0.001, clockS) * 0.78}>
              <AlarmClock f={f} tex={tex.clock} speed={f < 90 ? 1.6 : 0.7} />
            </group>
            {BALLS.map((b, i) => {
              if (f < b.start) return null;
              const d = drop(f, b.start, 14);
              const s = scatter(f, [b.x, 0, b.z], i);
              const pos = f < 244 ? [b.x, 0.26 + d.h * 5, b.z] : [s.pos[0], s.pos[1] + 0.26, s.pos[2]];
              return <mesh key={i} geometry={ballGeos[i]} castShadow position={pos as any} rotation={[i, (f - b.start) * 0.05 * (1 - (d.landed ? 1 : 0)) + i, 0]}
                scale={[(1 + d.squash * 0.5) * (f >= 244 ? s.s : 1), (1 - d.squash) * (f >= 244 ? s.s : 1), (1 + d.squash * 0.5) * (f >= 244 ? s.s : 1)]}>
                <meshStandardMaterial color="#FFFDF8" roughness={0.9} flatShading />
              </mesh>;
            })}
          </group>
        );
      })()}

      {/* ===== Versão B: 0–8s ===== */}
      {!A && f < 262 && (() => {
        const spin = easeOutBack(prog(f, 0, 22), 1.4);
        const toSlot = easeInOut(prog(f, 100, 152));
        const heroPos = [lerp(HERO[0], HC[0], toSlot), lerp(HERO[1], HC[1], toSlot) + Math.sin(f * 0.08) * 0.05 * (1 - toSlot), lerp(lerp(-16, HERO[2], spin), HC[2] + 0.02, toSlot)];
        const heroS = lerp(1, 0.56 / FW * 1.12, toSlot);
        const fallT = Math.max(0, (f - 222) / 30);
        const glowU = bell(f, 104, 150, 8) * 0.9 + (1 - prog(f, 20, 40)) * 0.6 * prog(f, 2, 6);
        return (
          <group>
            <Ficha which="hero" glow={glowU} position={[heroPos[0], heroPos[1] - fallT * fallT * 30, heroPos[2]]}
              rotation={[0, (1 - spin) * Math.PI * 3, (1 - spin) * 0.3]} scale={heroS} />
            {f < 120 && <Confetti f={f} start={3} origin={[HERO[0], HERO[1] - 0.3, HERO[2] - 0.5]} />}
            {f < 110 && Array.from({ length: 10 }, (_, i) => {
              const a = (i / 10) * Math.PI * 2 + 0.3;
              const s = spring(f, 6 + i * 3, 1.8, 0.35) * (1 - easeIn(prog(f, 92, 108)));
              const rx = Math.cos(a) * 1.45, ry = Math.sin(a) * 1.75;
              const bob = Math.sin(f * 0.15 + i) * 0.08;
              const P = [HERO[0] + rx * s, HERO[1] + ry * s + bob, HERO[2] + 0.4];
              const col = [C.terracota, C.mostarda, C.rosa, C.ceu, C.salvia][i % 5];
              return i % 2
                ? <Heart key={i} color={col} position={P} scale={0.42 * Math.max(0.001, s)} rotation={[0, Math.sin(f * 0.1 + i) * 0.6, a * 0.2]} />
                : <Star key={i} color={col} position={P} scale={0.45 * Math.max(0.001, s)} rotation={[0, f * 0.06 + i, 0]} />;
            })}
            {f >= 120 && <FichaWall f={f} appear={128} fall={222} />}
            {f >= 120 && f < 236 && (
              <mesh position={[HC[0], 12.6, -16.3]}>
                <planeGeometry args={[11.4, 25]} /><meshStandardMaterial color="#C9AE8C" roughness={0.95} />
              </mesh>
            )}
          </group>
        );
      })()}

      {/* ===== Livro: cena principal (8–14s) ===== */}
      {f >= 230 && f < 420 && (
        <Book position={[0, bookY, 0]} rotation={[0, -0.04, 0]} open={open} flip={flip} squash={bookDrop.squash} />
      )}
      {/* poeira ao pousar */}
      {f >= 252 && f < 275 && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} scale={1.6 + easeOut(prog(f, 252, 275)) * 2.2}>
          <ringGeometry args={[0.9, 1.0, 64]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.6 * (1 - prog(f, 252, 275))} depthWrite={false} />
        </mesh>
      )}

      {/* cartões dos 11 módulos */}
      {f >= 296 && f < 414 && Array.from({ length: 11 }, (_, i) => {
        const e = 296 + i * 2.6;
        const t = easeOut(prog(f, e, e + 22));
        if (t <= 0) return null;
        const slot = cardSlot(i, scatterCards * 3);
        const from = [0, 0.45, 0];
        let pos = [lerp(from[0], slot.pos[0], t), lerp(from[1], slot.pos[1], t) + Math.sin(t * Math.PI) * 0.8, lerp(from[2], slot.pos[2], t)];
        let ry = slot.phi * t;
        let rx = -Math.PI / 2 * (1 - t);
        let s = lerp(0.3, 1, t) * (1 - scatterCards);
        if (i === 6) {
          if (f >= 391) return null;
          const dv = easeInOut(flipCard);
          pos = [lerp(slot.pos[0], F[0], dv), lerp(slot.pos[1], F[1], dv), lerp(slot.pos[2], F[2], dv)];
          ry = lerp(ry, 0, dv) + dv * Math.PI / 2;
          s = lerp(1, FH / 1.4, dv);
          return <ModuleCard key={i} i={i} position={pos} rotation={[rx, ry, 0]} scale={s} />;
        }
        if (s <= 0.01) return null;
        return <ModuleCard key={i} i={i} position={pos} rotation={[rx, ry, 0]} scale={s} />;
      })}

      {/* ficha real */}
      {fichaIn && f < 682 && (
        <group position={fichaPos as any} rotation={[-Math.PI / 2 * lay, fichaRot, 0]} scale={fichaScale * (1 - prog(f, 674, 682))}>
          <Ficha hi={hi} glow={bell(f, 390, 414, 6) * 0.8 + bell(f, 612, 640, 8) * 0.9} />
        </group>
      )}

      {/* ===== 17–22s ===== */}
      {f >= 514 && f < 676 && (() => {
        const s = easeOutBack(prog(f, 514, 530), 2.4) * (1 - easeIn(prog(f, 604, 616)));
        return <Stopwatch f={f} tex={tex.timer} sweep={easeInOut(prog(f, 522, 556)) * Math.PI * 2}
          position={[-0.85, 0.78, -1.4]} rotation={[-0.42, 0.28, Math.sin(f * 0.4) * 0.03 * (f < 556 ? 1 : 0)]} scale={Math.max(0.001, s) * 0.95} />;
      })()}
      {f >= 560 && f < 632 && (() => {
        const items = [
          { el: <Pencil color={C.terracota} />, from: [3.2, 0, 1.8], to: [-0.45, 0.1, 0.95], ry: 0.4 },
          { el: <Scissors />, from: [-3.2, 0, 1.5], to: [0.45, 0.07, 0.1], ry: -0.6 },
          { el: <Spool scale={0.85} />, from: [3.0, 0, -1.4], to: [0.5, 0.03, -0.55], ry: 0 },
          { el: <Pencil color={C.ceu} />, from: [-3.0, 0, -1.2], to: [-0.35, 0.1, -0.3], ry: -0.3 },
          { el: <mesh castShadow rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.6, 0.8]} /><meshStandardMaterial map={tex.paper} side={THREE.DoubleSide} /></mesh>, from: [0.2, 0, 3.4], to: [-0.2, 0.06, 0.45], ry: 0.25 },
          { el: <Pencil color={C.salvia} />, from: [2.6, 0, 3.0], to: [0.15, 0.13, 1.1], ry: 0.9 },
        ];
        return items.map((it, i) => {
          const st = 562 + i * 5;
          const t = prog(f, st, st + 16);
          if (t <= 0) return null;
          const shrink = easeIn(prog(f, 612 + i, 626 + i));
          const x = lerp(it.from[0], it.to[0], t), z = lerp(it.from[2], it.to[2], t);
          const y = lerp(it.from[1], it.to[1], t) + Math.sin(t * Math.PI) * 1.6;
          const land = f > st + 16 ? Math.exp(-(f - st - 16) / 3) * Math.sin((f - st - 16) * 1.2) * 0.12 : 0;
          return (
            <group key={i} position={[x, y - shrink * 0.1, z]} rotation={[0, it.ry + (1 - t) * 4, 0]} scale={[(1 + land) * (1 - shrink), (1 - land) * (1 - shrink), (1 + land) * (1 - shrink)].map((q) => Math.max(0.001, q)) as any}>
              {it.el}
            </group>
          );
        });
      })()}
      {f >= 610 && f < 700 && Array.from({ length: 14 }, (_, i) => {
        const st = 612 + i * 2.5;
        const t = prog(f, st, st + 56);
        if (t <= 0) return null;
        const col = [C.terracota, C.mostarda, C.rosa, C.ceu, C.salvia, C.lavanda][i % 6];
        const x = (hash(i + 3) - 0.5) * 1.8, z = 0.3 + (hash(i + 9) - 0.5) * 1.8;
        const y = 0.1 + easeOut(t) * (2.2 + hash(i) * 2.0);
        const s = easeOutBack(prog(f, st, st + 10), 2) * 0.42 * (1 - easeIn(prog(f, 668, 690)));
        const P = [x * (1 + t * 0.6), y, z];
        return i % 2
          ? <Heart key={i} color={col} position={P} scale={Math.max(0.001, s)} rotation={[-0.6, Math.sin(f * 0.1 + i) * 0.8, 0]} />
          : <Star key={i} color={col} position={P} scale={Math.max(0.001, s)} rotation={[-0.6, f * 0.08 + i, 0]} />;
      })}

      {/* ===== 22–30s: bundle ===== */}
      {f >= 660 && (
        <group position={[0, 1.36 + standDrop.h * 6, 0]} rotation={[Math.PI / 2 - 0.02, Math.sin(f * 0.03) * 0.04, 0]}
          scale={[1 + standDrop.squash * 0.3, 1, 1 - standDrop.squash]}>
          <group position={[0, -0.18, 0]}>
            <Book />
          </group>
        </group>
      )}
      {f >= 768 && <Rays f={f} opacity={0.55 * easeOut(prog(f, 768, 800))} position={[0, 1.6, -1.2]} />}
      {f >= 716 && [0, 1, 3].map((bi) => {
        const sl = SLOTS[bi];
        const t = fan;
        return <BonusBook key={bi} i={bi} position={[lerp(0, sl[0], t), lerp(1.3, sl[1], t) + Math.sin(f * 0.05 + bi) * 0.03, lerp(-0.6, sl[2], t)]}
          rotation={[0, sl[3] * t, (1 - t) * 0.6 * Math.sign(sl[0])]} scale={Math.max(0.001, 0.5 + 0.5 * t)} />;
      })}
      {f >= 744 && (() => {
        const sl = SLOTS[2];
        const g = [1.6, 0, 0.75];
        const up = easeOut(prog(f, 744, 756));
        const pos = [lerp(g[0], sl[0], adv), lerp(g[1] + 0.4 + up * 1.4, sl[1], adv) + Math.sin(f * 0.05 + 2) * 0.03, lerp(g[2], sl[2], adv)];
        return <BonusBook i={2} position={pos} rotation={[0, sl[3] * adv + (1 - adv) * f * 0.12, 0]} scale={lerp(0.6, 1, up)} />;
      })()}
      {f >= 744 && f < 800 && <Sparkles f={f} center={[1.6, 1.4, 0.75]} spread={[1.4, 1.6, 1]} n={22} opacity={1 - prog(f, 770, 800)} />}
      {f >= 716 && f < 792 && (
        <Gift open={giftOpen} position={[1.6, 0, 0.75]} rotation={[0, -0.35 + Math.sin(f * 0.6) * 0.05 * (f > 724 && f < 736 ? 1 : 0), 0]}
          scale={Math.max(0.001, Math.min(giftT, 1.2) * (1 - giftOut)) * 0.9} />
      )}
      {f >= 664 && f < 740 && (
        <Cup f={f} position={[-1.45 - easeIn(prog(f, 716, 740)) * 3, 0, 0.75]} rotation={[0, 0.6, 0]} scale={Math.max(0.001, spring(f, 664, 1.6, 0.4)) * 0.95} />
      )}
      {f >= 668 && (() => {
        const s = spring(f, 668, 1.5, 0.35);
        const pos = [0.6, 2.72, 1.4];
        return <PriceSeal tex={tex.price} position={pos as any} rotation={[0, (1 - Math.min(1, s)) * Math.PI * 4 + Math.sin(f * 0.06) * 0.2, 0.15]} scale={Math.max(0.001, s) * 0.46} />;
      })()}
      {f >= 784 && (() => {
        const s = easeOutBack(prog(f, 784, 800), 2.2);
        const pulse = 1 + Math.sin((f - 784) * 0.32) * 0.045;
        const ph = ((f - 800) % 22) / 22;
        const press = f > 812 && ((f - 812) % 44) < 6 ? Math.sin(((f - 812) % 44) / 6 * Math.PI) : 0;
        return (
          <group>
            <Button3D tex={tex.button} press={press} ripple={f > 800 ? ph : 0} position={[0.1, 0.42, 2.05]} rotation={[-0.1, 0, 0]} scale={Math.max(0.001, s * pulse) * 0.8} />
            <Arrow position={[-1.5 + Math.sin(f * 0.28) * 0.1, 0.42, 2.1]} rotation={[0, 0, -0.05]} scale={Math.max(0.001, easeOutBack(prog(f, 796, 810), 2)) * 0.6} />
          </group>
        );
      })()}
      {f >= 800 && (() => {
        const t = prog(f, 800, 900);
        return <Dove flap={Math.sin(f * 0.55) * 0.7} position={[lerp(-3.4, 2.6, t), 3.7 + Math.sin(t * Math.PI) * 0.4, -0.8]} rotation={[0, 0.1, 0.12]} scale={0.38} />;
      })()}

      {/* brilhos que acompanham a câmera */}
      <Sparkles f={f} center={[tgt[0], tgt[1] + 0.3, tgt[2]]} spread={[4, 4, 3]} n={30} opacity={0.85} />
    </>
  );
};

export const Scene3D: React.FC<{ version: Version }> = ({ version }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <TexProvider>
    <ThreeCanvas width={width} height={height} shadows="soft" dpr={1}
      gl={{ antialias: true, toneMapping: THREE.NeutralToneMapping, preserveDrawingBuffer: true }}
      camera={{ fov: 40, near: 0.1, far: 200, position: [0, 6, 6] }}>
      <World f={f} v={version} />
    </ThreeCanvas>
    </TexProvider>
  );
};
