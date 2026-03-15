"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame }                   from "@react-three/fiber";
import * as THREE                     from "three";

const CONFIG = {
  particleCount:         2800,
  radius:                1.6,
  innerRadius:           1.1,
  whiteRatio:            0.88,
  idleRotationSpeed:     0.0012,
  mouseParallaxStrength: 0.18,
  mouseLerpSpeed:        0.06,
  particleSizeMin:       0.007,
  particleSizeMax:       0.020,
};

const HERO_WHITE = new THREE.Color("#DCDCD6");
const HERO_RED   = new THREE.Color("#ED1C24");

export function HeroSphere({ isHovered = false }: { isHovered?: boolean }) {
  const meshRef = useRef<THREE.Points>(null);
  const mouse   = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const { positions, colors, sizes } = useMemo(() => {
    const count     = CONFIG.particleCount;
    const positions = new Float32Array(count * 3);
    const colors    = new Float32Array(count * 3);
    const sizes     = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = CONFIG.innerRadius + Math.random() * (CONFIG.radius - CONFIG.innerRadius);

      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const useRed = Math.random() >= CONFIG.whiteRatio;
      const c      = useRed ? HERO_RED : HERO_WHITE;
      colors[i * 3]     = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = CONFIG.particleSizeMin +
        Math.random() * (CONFIG.particleSizeMax - CONFIG.particleSizeMin);
    }

    return { positions, colors, sizes };
  }, []);

  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    if (isHovered) {
      // Mouse hover: faster parallax response
      const lerp = CONFIG.mouseLerpSpeed;
      meshRef.current.rotation.y +=
        (mouse.current.x * CONFIG.mouseParallaxStrength - meshRef.current.rotation.y) * lerp;
      meshRef.current.rotation.x +=
        (-mouse.current.y * CONFIG.mouseParallaxStrength - meshRef.current.rotation.x) * lerp;
    } else {
      // No hover: continuous idle rotation
      meshRef.current.rotation.y += CONFIG.idleRotationSpeed * delta * 60;
      meshRef.current.rotation.x += CONFIG.idleRotationSpeed * 0.4 * delta * 60;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors,    3]} />
        <bufferAttribute attach="attributes-size"     args={[sizes,     1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
