"use client";
import { Canvas }    from "@react-three/fiber";
import { Suspense }  from "react";
import { LiquidOrb } from "./LiquidOrb";

export default function OrbCanvas({
  width = 320,
  height = 320,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
      style={{
        width:      `${width}px`,
        height:     `${height}px`,
        background: "transparent",
        display:    "block",
      }}
    >
      <Suspense fallback={null}>
        <LiquidOrb />
      </Suspense>
    </Canvas>
  );
}
