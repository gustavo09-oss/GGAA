import React, { useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { C } from '../assets';
import { hash } from '../anim';

export const Clay: React.FC<{ color: string; rough?: number; emissive?: string; ei?: number; side?: any; transparent?: boolean; opacity?: number }> = ({ color, rough = 0.72, emissive = '#000', ei = 0, side, transparent, opacity = 1 }) => (
  <meshPhysicalMaterial color={color} roughness={rough} metalness={0} sheen={0.5} sheenColor="#fff1dc" sheenRoughness={0.7}
    emissive={emissive} emissiveIntensity={ei} side={side} transparent={transparent} opacity={opacity} />
);

export const useRounded = (w: number, h: number, d: number, r: number, seg = 3) =>
  useMemo(() => new RoundedBoxGeometry(w, h, d, seg, r), [w, h, d, r, seg]);

const extrude = (shape: THREE.Shape, depth: number, bevel: number) => {
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 4, curveSegments: 24 });
  g.center();
  g.computeVertexNormals();
  return g;
};

export const heartGeo = (() => {
  let g: THREE.BufferGeometry | null = null;
  return () => {
    if (g) return g;
    const s = new THREE.Shape();
    s.moveTo(0, -0.42);
    s.bezierCurveTo(-0.1, -0.3, -0.5, -0.05, -0.5, 0.18);
    s.bezierCurveTo(-0.5, 0.42, -0.2, 0.52, 0, 0.3);
    s.bezierCurveTo(0.2, 0.52, 0.5, 0.42, 0.5, 0.18);
    s.bezierCurveTo(0.5, -0.05, 0.1, -0.3, 0, -0.42);
    g = extrude(s, 0.14, 0.07);
    return g;
  };
})();

export const starGeo = (() => {
  let g: THREE.BufferGeometry | null = null;
  return () => {
    if (g) return g;
    const s = new THREE.Shape();
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 + Math.PI / 2;
      const r = i % 2 ? 0.22 : 0.5;
      const x = Math.cos(a) * r, y = Math.sin(a) * r;
      i ? s.lineTo(x, y) : s.moveTo(x, y);
    }
    s.closePath();
    g = extrude(s, 0.12, 0.06);
    return g;
  };
})();

export const Heart: React.FC<any> = ({ color = C.terracota, ...p }) => (
  <mesh geometry={heartGeo()} castShadow {...p}><Clay color={color} rough={0.55} /></mesh>
);
export const Star: React.FC<any> = ({ color = C.mostarda, ...p }) => (
  <mesh geometry={starGeo()} castShadow {...p}><Clay color={color} rough={0.55} /></mesh>
);

// Lápis de cor deitado ao longo do eixo X
export const Pencil: React.FC<any> = ({ color = C.mostarda, ...p }) => (
  <group {...p}>
    <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.07, 0.07, 1.0, 6]} />
      <Clay color={color} />
    </mesh>
    <mesh castShadow position={[0.6, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
      <cylinderGeometry args={[0.012, 0.07, 0.2, 6]} />
      <Clay color="#EBCB9F" />
    </mesh>
    <mesh position={[0.67, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
      <cylinderGeometry args={[0.001, 0.03, 0.07, 6]} />
      <Clay color={color} rough={0.5} />
    </mesh>
    <mesh castShadow position={[-0.53, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.074, 0.074, 0.07, 16]} />
      <Clay color={C.begeEsc} rough={0.45} />
    </mesh>
    <mesh castShadow position={[-0.61, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
      <capsuleGeometry args={[0.068, 0.06, 6, 16]} />
      <Clay color={C.rosa} />
    </mesh>
  </group>
);

// Bolinha de papel amassado
export const ballGeo = (seed: number) => {
  const g = new THREE.IcosahedronGeometry(0.26, 2);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const n = v.clone().normalize();
    const k = 1 + (hash(Math.round(n.x * 40) * 7.1 + Math.round(n.y * 40) * 13.3 + Math.round(n.z * 40) * 3.7 + seed) - 0.5) * 0.38;
    v.multiplyScalar(k);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
};

// Tesoura deitada
export const Scissors: React.FC<any> = (p) => {
  const blade = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.05); s.quadraticCurveTo(0.45, 0.06, 0.78, 0.0); s.quadraticCurveTo(0.45, -0.03, 0, -0.05); s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.03, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01, bevelSegments: 2 });
    return g;
  }, []);
  return (
    <group {...p}>
      <group rotation={[0, 0.18, 0]}>
        <mesh geometry={blade} castShadow rotation={[-Math.PI / 2, 0, 0]}><meshStandardMaterial color="#D8DDE2" roughness={0.35} metalness={0.5} /></mesh>
        <mesh castShadow position={[-0.3, 0, 0.08]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[0.15, 0.045, 12, 28]} /><Clay color={C.terracota} /></mesh>
      </group>
      <group rotation={[0, -0.18, 0]}>
        <mesh geometry={blade} castShadow position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}><meshStandardMaterial color="#CBD1D7" roughness={0.35} metalness={0.5} /></mesh>
        <mesh castShadow position={[-0.3, 0.035, -0.08]} rotation={[-Math.PI / 2, 0, 0]}><torusGeometry args={[0.15, 0.045, 12, 28]} /><Clay color={C.terracota} /></mesh>
      </group>
      <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.035, 0.035, 0.04, 16]} /><Clay color={C.cafe} /></mesh>
    </group>
  );
};

// Carretel de barbante (em pé)
export const Spool: React.FC<any> = (p) => {
  const strand = useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.22, 0.25, 0), new THREE.Vector3(0.45, 0.12, 0.1), new THREE.Vector3(0.55, 0.03, 0.4), new THREE.Vector3(0.85, 0.03, 0.5),
  ]), 24, 0.02, 6), []);
  return (
    <group {...p}>
      <mesh castShadow position={[0, 0.03, 0]}><cylinderGeometry args={[0.3, 0.3, 0.06, 32]} /><Clay color={C.begeEsc} /></mesh>
      <mesh castShadow position={[0, 0.47, 0]}><cylinderGeometry args={[0.3, 0.3, 0.06, 32]} /><Clay color={C.begeEsc} /></mesh>
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} castShadow position={[0, 0.1 + i * 0.065, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.2, 0.04, 10, 32]} /><Clay color={i % 2 ? C.rosa : '#C98D86'} rough={0.9} />
        </mesh>
      ))}
      <mesh geometry={strand} castShadow><Clay color={C.rosa} rough={0.9} /></mesh>
    </group>
  );
};

// Despertador
export const AlarmClock: React.FC<{ f: number; tex: THREE.Texture; speed?: number } & any> = ({ f, tex, speed = 1, ...p }) => {
  const a = f * 0.42 * speed;
  return (
    <group {...p}>
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.6, 0.6, 0.36, 48]} /><Clay color={C.terracota} /></mesh>
      <mesh castShadow position={[0, 0, 0.17]}><torusGeometry args={[0.55, 0.06, 16, 48]} /><Clay color={C.mostarda} rough={0.5} /></mesh>
      <mesh position={[0, 0, 0.185]}><circleGeometry args={[0.52, 48]} /><meshStandardMaterial map={tex} roughness={0.8} /></mesh>
      <mesh position={[0, 0, 0.2]} rotation={[0, 0, -a]}><boxGeometry args={[0.05, 0.42, 0.02]} /><meshStandardMaterial color={C.cafe} />
      </mesh>
      <group rotation={[0, 0, -a / 12]}>
        <mesh position={[0, 0.13, 0.21]}><boxGeometry args={[0.07, 0.3, 0.02]} /><meshStandardMaterial color={C.cafe} /></mesh>
      </group>
      <mesh position={[0, 0, 0.22]}><sphereGeometry args={[0.05, 16, 16]} /><Clay color={C.mostarda} /></mesh>
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh castShadow position={[s * 0.36, 0.58, 0]} rotation={[0, 0, -s * 0.5]}><sphereGeometry args={[0.2, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><Clay color={C.mostarda} rough={0.45} side={THREE.DoubleSide} /></mesh>
          <mesh castShadow position={[s * 0.38, -0.62, 0]} rotation={[0, 0, s * 0.4]}><capsuleGeometry args={[0.05, 0.12, 6, 12]} /><Clay color={C.cafe} /></mesh>
        </group>
      ))}
      <mesh castShadow position={[0, 0.68, 0]}><capsuleGeometry args={[0.035, 0.18, 6, 12]} /><Clay color={C.cafe} /></mesh>
    </group>
  );
};

// Cronômetro de mão
export const Stopwatch: React.FC<{ f: number; tex: THREE.Texture; sweep: number } & any> = ({ f, tex, sweep, ...p }) => (
  <group {...p}>
    <mesh castShadow rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.62, 0.62, 0.3, 48]} /><Clay color={C.salvia} /></mesh>
    <mesh castShadow position={[0, 0, 0.14]}><torusGeometry args={[0.58, 0.07, 16, 48]} /><Clay color={C.mostarda} rough={0.45} /></mesh>
    <mesh position={[0, 0, 0.16]}><circleGeometry args={[0.56, 48]} /><meshStandardMaterial map={tex} roughness={0.8} /></mesh>
    <group position={[0, 0, 0.18]} rotation={[0, 0, -sweep]}>
      <mesh position={[0, 0.24, 0]}><boxGeometry args={[0.035, 0.46, 0.02]} /><meshStandardMaterial color={C.terracota} /></mesh>
    </group>
    <mesh position={[0, 0, 0.19]}><sphereGeometry args={[0.045, 16, 16]} /><Clay color={C.terracota} /></mesh>
    <mesh castShadow position={[0, 0.74, 0]}><cylinderGeometry args={[0.08, 0.08, 0.16, 24]} /><Clay color={C.mostarda} /></mesh>
    <mesh castShadow position={[0, 0.85, 0]}><capsuleGeometry args={[0.1, 0.12, 6, 16]} /><Clay color={C.terracota} /></mesh>
    <mesh castShadow position={[0.48, 0.5, 0]} rotation={[0, 0, -0.75]}><capsuleGeometry args={[0.06, 0.1, 6, 16]} /><Clay color={C.terracota} /></mesh>
  </group>
);

// Caixa de presente com tampa animável
export const Gift: React.FC<{ open: number } & any> = ({ open, ...p }) => {
  const box = useRounded(1.0, 0.8, 1.0, 0.08);
  const lid = useRounded(1.1, 0.22, 1.1, 0.07);
  const lidY = 0.51 + open * 1.3;
  return (
    <group {...p}>
      <mesh geometry={box} castShadow receiveShadow position={[0, 0.4, 0]}><Clay color={C.terracota} /></mesh>
      <mesh castShadow position={[0, 0.4, 0]}><boxGeometry args={[0.2, 0.81, 1.01]} /><Clay color={C.mostarda} rough={0.5} /></mesh>
      <mesh castShadow position={[0, 0.4, 0]}><boxGeometry args={[1.01, 0.81, 0.2]} /><Clay color={C.mostarda} rough={0.5} /></mesh>
      <group position={[open * 0.5, lidY, open * 0.2]} rotation={[open * 0.5, 0, -open * 0.9]}>
        <mesh geometry={lid} castShadow><Clay color="#C9765A" /></mesh>
        <mesh castShadow><boxGeometry args={[0.21, 0.23, 1.11]} /><Clay color={C.mostarda} rough={0.5} /></mesh>
        <mesh castShadow><boxGeometry args={[1.11, 0.23, 0.21]} /><Clay color={C.mostarda} rough={0.5} /></mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} castShadow position={[s * 0.2, 0.2, 0]} rotation={[0, 0, s * 0.6]} scale={[1, 0.7, 0.5]}>
            <torusGeometry args={[0.18, 0.07, 12, 28]} /><Clay color={C.mostarda} rough={0.5} />
          </mesh>
        ))}
        <mesh position={[0, 0.16, 0]}><sphereGeometry args={[0.1, 16, 16]} /><Clay color={C.mostarda} rough={0.5} /></mesh>
      </group>
    </group>
  );
};

// Xícara de café com vapor
export const Cup: React.FC<{ f: number } & any> = ({ f, ...p }) => {
  const geo = useMemo(() => {
    const pts = [[0, 0], [0.28, 0], [0.33, 0.05], [0.4, 0.45], [0.42, 0.52], [0.38, 0.52], [0.35, 0.47], [0.3, 0.08], [0, 0.08]].map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(pts, 48);
  }, []);
  return (
    <group {...p}>
      <mesh castShadow receiveShadow position={[0, 0.02, 0]}><cylinderGeometry args={[0.62, 0.55, 0.05, 48]} /><Clay color={C.creme} /></mesh>
      <mesh geometry={geo} castShadow position={[0, 0.05, 0]}><Clay color={C.creme} rough={0.45} side={THREE.DoubleSide} /></mesh>
      <mesh position={[0, 0.48, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.37, 40]} /><meshStandardMaterial color="#7A4F33" roughness={0.3} /></mesh>
      <mesh castShadow position={[0.42, 0.3, 0]} rotation={[0, 0, -0.1]}><torusGeometry args={[0.13, 0.04, 12, 24, Math.PI * 1.3]} /><Clay color={C.creme} /></mesh>
      {[0, 1, 2].map((i) => {
        const t = ((f / 40 + i / 3) % 1);
        return (
          <mesh key={i} position={[Math.sin(t * 6 + i) * 0.08, 0.6 + t * 0.9, 0]} scale={0.12 + t * 0.18}>
            <sphereGeometry args={[1, 16, 12]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.45 * Math.sin(t * Math.PI)} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
};

// Selo de preço (moeda recortada)
export const PriceSeal: React.FC<{ tex: THREE.Texture } & any> = ({ tex, ...p }) => {
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    for (let k = 0; k < 48; k++) {
      const a = (k / 48) * Math.PI * 2, r = k % 2 ? 0.9 : 1.0;
      k ? s.lineTo(Math.cos(a) * r, Math.sin(a) * r) : s.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.1, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 3 });
    g.center();
    return g;
  }, []);
  return (
    <group {...p}>
      <mesh geometry={geo} castShadow><Clay color={C.mostarda} rough={0.5} /></mesh>
      <mesh position={[0, 0, 0.09]}><planeGeometry args={[2.06, 2.06]} /><meshStandardMaterial map={tex} transparent alphaTest={0.05} roughness={0.7} /></mesh>
      <mesh position={[0, 0, -0.09]} rotation={[0, Math.PI, 0]}><planeGeometry args={[2.06, 2.06]} /><meshStandardMaterial map={tex} transparent alphaTest={0.05} roughness={0.7} /></mesh>
    </group>
  );
};

// Botão "Más información"
export const Button3D: React.FC<{ tex: THREE.Texture; press: number; ripple: number } & any> = ({ tex, press, ripple, ...p }) => {
  const geo = useRounded(3.1, 0.78, 0.32, 0.36, 6);
  return (
    <group {...p}>
      <mesh geometry={geo} position={[0, -0.05, -0.08]}><Clay color="#B86A4F" /></mesh>
      <group position={[0, 0, press * -0.07]}>
        <mesh geometry={geo} castShadow><Clay color={C.terracota} rough={0.5} emissive={C.terracota} ei={0.12} /></mesh>
        <mesh position={[0, 0.02, 0.17]}><planeGeometry args={[2.9, 0.633]} /><meshBasicMaterial map={tex} transparent toneMapped={false} /></mesh>
      </group>
      {ripple > 0 && ripple < 1 && (
        <mesh geometry={geo} scale={[1 + ripple * 0.25, 1 + ripple * 0.9, 0.2]} position={[0, 0, -0.1]}>
          <meshBasicMaterial color={C.mostarda} transparent opacity={(1 - ripple) * 0.55} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
};

// Seta
export const Arrow: React.FC<any> = (p) => {
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0.3); s.lineTo(0.42, 0); s.lineTo(0, -0.3); s.lineTo(0, -0.13); s.lineTo(-0.5, -0.13); s.lineTo(-0.5, 0.13); s.lineTo(0, 0.13); s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.12, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 4 });
    g.center();
    return g;
  }, []);
  return <mesh geometry={geo} castShadow {...p}><Clay color={C.mostarda} rough={0.5} emissive={C.mostarda} ei={0.1} /></mesh>;
};

// Pomba
export const Dove: React.FC<{ flap: number } & any> = ({ flap, ...p }) => (
  <group {...p}>
    <mesh castShadow scale={[0.5, 0.3, 0.3]}><sphereGeometry args={[1, 24, 16]} /><Clay color="#FFFFFF" /></mesh>
    <mesh castShadow position={[0.42, 0.16, 0]} scale={0.17}><sphereGeometry args={[1, 20, 16]} /><Clay color="#FFFFFF" /></mesh>
    <mesh position={[0.6, 0.15, 0]} rotation={[0, 0, -Math.PI / 2]}><coneGeometry args={[0.05, 0.12, 12]} /><Clay color={C.mostarda} /></mesh>
    <mesh position={[0.5, 0.2, 0.12]}><sphereGeometry args={[0.025, 8, 8]} /><meshBasicMaterial color={C.cafe} /></mesh>
    <mesh position={[0.5, 0.2, -0.12]}><sphereGeometry args={[0.025, 8, 8]} /><meshBasicMaterial color={C.cafe} /></mesh>
    <mesh castShadow position={[-0.55, 0.05, 0]} rotation={[0, 0, 0.25]} scale={[0.35, 0.06, 0.22]}><sphereGeometry args={[1, 16, 12]} /><Clay color="#FFFFFF" /></mesh>
    {[-1, 1].map((s) => (
      <group key={s} position={[0, 0.1, s * 0.12]} rotation={[s * (0.2 + flap), 0, 0]}>
        <mesh castShadow position={[-0.05, 0, s * 0.38]} scale={[0.32, 0.05, 0.42]}><sphereGeometry args={[1, 16, 12]} /><Clay color="#FFFFFF" /></mesh>
      </group>
    ))}
  </group>
);
