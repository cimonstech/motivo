"use client";

import { useEffect, useRef } from "react";
import { createFlowLines, type FlowLinesEngine } from "./flowLinesEngine";
import styles from "./os-hero.module.css";

export function FlowBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let engine: FlowLinesEngine | null = createFlowLines(canvas, {
      color: "#ED1C24",
      background: "#080808",
      lineCount: 18,
      amplitude: 0.14,
      centerY: 0.52,
      speed: 1,
      lineWidth: 1,
      flatStart: 0.12,
      pointerRadius: 260,
      pointerPull: 0.55,
      interactive: !reduce,
      staticFrame: reduce,
    });

    return () => {
      engine?.destroy();
      engine = null;
    };
  }, []);

  return (
    <div className={styles.flowLayer} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.flowCanvas} />
    </div>
  );
}
