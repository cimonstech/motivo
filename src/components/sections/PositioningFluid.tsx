"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { createFluidText, type FluidTextEngine } from "./fluidTextEngine";

const STATEMENT = "If your brand looks average, it will be treated that way.";

const NOTES = [
  "In today's market, perception is everything.",
  "People decide what you're worth before you say a word.",
  "We make sure your brand communicates the right message, instantly.",
];

export function PositioningFluid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<FluidTextEngine | null>(null);
  const [live, setLive] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const family =
      getComputedStyle(document.documentElement).getPropertyValue("--font-display").trim() ||
      "system-ui, sans-serif";

    const engine = createFluidText(canvas, {
      text: STATEMENT,
      fontFamily: family,
      fontWeight: 700,
      lineHeight: 1.02,
      letterSpacingEm: -0.035,
      background: "#F5F5F0",
      foreground: "#080808",
      ink: "#080808",
      minFontPx: isMobile ? 36 : 48,
      maxFontPx: isMobile ? 52 : 92,
      sizeVw: isMobile ? 0.112 : 0.062,
    });
    if (!engine) return;
    engineRef.current = engine;
    setLive(true);
    return () => {
      engine.destroy();
      engineRef.current = null;
      setLive(false);
    };
  }, [isMobile]);

  return (
    <section
      aria-label={STATEMENT}
      style={{
        background: "#F5F5F0",
        color: "#080808",
        borderTop: "0.5px solid rgba(8,8,8,0.08)",
        borderBottom: "0.5px solid rgba(8,8,8,0.08)",
        paddingBottom: isMobile ? "36px" : "48px",
      }}
    >
      <div
        style={{
          position: "relative",
          height: isMobile ? "clamp(280px, 46vh, 420px)" : "clamp(340px, 48vh, 560px)",
          background: "#F5F5F0",
        }}
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: "block",
            visibility: live ? "visible" : "hidden",
            touchAction: "pan-y",
            cursor: "crosshair",
          }}
        />
        <div
          style={
            live
              ? {
                  position: "absolute",
                  width: 1,
                  height: 1,
                  overflow: "hidden",
                  clip: "rect(0 0 0 0)",
                  whiteSpace: "nowrap",
                }
              : {
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  paddingInline: "max(20px, 6vw)",
                }
          }
        >
          <h2
            style={{
              margin: 0,
              fontFamily: "var(--font-display), ui-sans-serif, system-ui, sans-serif",
              fontWeight: 700,
              fontSize: isMobile ? "clamp(36px, 11vw, 52px)" : "clamp(48px, 6.2vw, 92px)",
              lineHeight: 1.02,
              letterSpacing: "-0.035em",
              maxWidth: "18ch",
            }}
          >
            {STATEMENT}
          </h2>
        </div>
      </div>
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          paddingInline: isMobile ? "20px" : "max(48px, 6vw)",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
          fontSize: isMobile ? "15px" : "17px",
          lineHeight: 1.7,
          color: "rgba(8,8,8,0.62)",
        }}
      >
        {NOTES.map((note) => (
          <p key={note} style={{ margin: 0 }}>
            {note}
          </p>
        ))}
      </div>
    </section>
  );
}
