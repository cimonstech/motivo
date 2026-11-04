"use client";
import { Canvas }     from "@react-three/fiber";
import { HeroSphere } from "./HeroSphere";

export default function HeroCanvas({ isHovered = false, isMobile = false }: { isHovered?: boolean; isMobile?: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 55 }}
      gl={{ antialias: true, alpha: true }}
      style={{
        width:      "100%",
        height:     "100%",
        background: "transparent",
        display:    "block",
      }}
    >
      <HeroSphere isHovered={isHovered} isMobile={isMobile} />
    </Canvas>
  );
}
