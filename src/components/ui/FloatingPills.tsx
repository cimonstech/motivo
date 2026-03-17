"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const pillStyle: React.CSSProperties = {
  position:       "absolute",
  backdropFilter: "blur(8px)",
  background:     "rgba(245,245,240,0.06)",
  border:         "0.5px solid rgba(245,245,240,0.1)",
  borderRadius:   "100px",
  padding:        "7px 14px",
  display:        "flex",
  alignItems:     "center",
  gap:            "8px",
  fontFamily:     "var(--font-sans)",
  fontSize:       "11px",
  color:          "rgba(245,245,240,0.7)",
  whiteSpace:     "nowrap" as const,
  zIndex:         30,
};

export function FloatingPills() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const ref0 = useRef<HTMLDivElement>(null);
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    [
      { ref: ref0, y: -10, duration: 3.0 },
      { ref: ref1, y: -8,  duration: 3.5 },
      { ref: ref2, y: -12, duration: 2.8 },
    ].forEach(({ ref, y, duration }) => {
      if (!ref.current) return;
      gsap.to(ref.current, {
        y, duration, repeat: -1, yoyo: true, ease: "sine.inOut",
      });
    });
  }, []);

  return (
    <div
      style={{
        position:      "absolute",
        inset:          0,
        width:         "100%",
        maxWidth:      "min(1440px, 100vw)",
        margin:        "0 auto",
        left:          "50%",
        transform:     "translateX(-50%)",
        pointerEvents:  "none",
      }}
    >
      {/* Top left - client icons + count */}
      <div
        ref={ref0}
        className="pill"
        style={{ ...pillStyle, top: isMobile ? "16%" : "22%", left: isMobile ? "20px" : "48px", right: isMobile ? "auto" : undefined }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {[
            { src: "/clients/icons/tungsten_icon.png",  alt: "Tungsten" },
            { src: "/clients/icons/coldwater_icon.png", alt: "Coldwater" },
            { src: "/clients/icons/fidelity_icon.png",  alt: "Fidelity" },
            { src: "/clients/icons/tesoro_icon.png",    alt: "Tesoro" },
          ].map((icon, i) => (
            <div
              key={icon.alt}
              style={{
                width:        "24px",
                height:       "24px",
                borderRadius: "50%",
                overflow:     "hidden",
                border:       "1.5px solid rgba(245,245,240,0.15)",
                marginLeft:   i === 0 ? "0" : "-7px",
                flexShrink:   0,
                background:   "#1a1a1a",
              }}
            >
              <img
                src={icon.src}
                alt={icon.alt}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          ))}
        </div>
        <span style={{ marginLeft: "8px" }}>40+ brands built</span>
      </div>

      {/* Top right - rating (left on mobile) */}
      <div
        ref={ref1}
        className="pill"
        style={{
          ...pillStyle,
          top: isMobile ? "24%" : "18%",
          left: isMobile ? "20px" : undefined,
          right: isMobile ? "auto" : "48px",
        }}
      >
        <span style={{ color: "#ED1C24", fontSize: "10px" }}>✦</span>
        Top creative practice - Accra
      </div>

      {/* Middle left - live badge */}
      <div
        ref={ref2}
        className="pill"
        style={{ ...pillStyle, top: isMobile ? "32%" : "55%", left: isMobile ? "20px" : "48px" }}
      >
        <span style={{ position: "relative", display: "flex", width: "6px", height: "6px" }}>
          <span style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: "#4ade80", opacity: 0.75,
            animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite",
          }} />
          <span style={{
            position: "relative", width: "6px", height: "6px",
            borderRadius: "50%", background: "#4ade80", display: "inline-flex",
          }} />
        </span>
        Currently in production
      </div>
    </div>
  );
}
