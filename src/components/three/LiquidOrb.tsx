"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MeshDistortMaterial, Sphere } from "@react-three/drei";

export function LiquidOrb() {
  const meshRef   = useRef<THREE.Mesh>(null);
  const hovered   = useRef(false);
  const distort   = useRef(0.3);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    meshRef.current.rotation.x = t * 0.12;
    meshRef.current.rotation.y = t * 0.18;

    // Smooth distortion transition
    const target = hovered.current ? 0.6 : 0.28;
    distort.current += (target - distort.current) * 0.04;
    (meshRef.current.material as any).distort = distort.current;

    // Gentle breathe
    const s = 1 + Math.sin(t * 0.7) * 0.012;
    meshRef.current.scale.setScalar(s);
  });

  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[2.5, 2.5, 2.5]}  intensity={1.5} color="#ED1C24" />
      <pointLight position={[-2, -1.5, -1.5]}  intensity={0.5} color="#ffffff" />
      <pointLight position={[0, -2, 2]}         intensity={0.3} color="#ED1C24" />

      <Sphere
        ref={meshRef}
        args={[1.1, 128, 128]}
        onPointerEnter={() => { hovered.current = true; }}
        onPointerLeave={() => { hovered.current = false; }}
      >
        <MeshDistortMaterial
          color="#1c0606"
          roughness={0.1}
          metalness={0.9}
          distort={0.28}
          speed={2}
          envMapIntensity={1}
        />
      </Sphere>

      {/* Thin red orbit ring */}
      <mesh rotation={[Math.PI / 2.2, 0.3, 0]}>
        <torusGeometry args={[1.5, 0.003, 16, 100]} />
        <meshBasicMaterial color="#ED1C24" transparent opacity={0.2} />
      </mesh>
    </>
  );
}
