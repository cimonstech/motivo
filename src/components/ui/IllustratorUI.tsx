"use client";
import { useEffect, useRef, useState } from "react";

// The M letter path points — anchor points for the animated pen tool
const M_ANCHORS = [
  { x: 60,  y: 200 }, // bottom-left
  { x: 60,  y: 60  }, // top-left
  { x: 130, y: 130 }, // center-top
  { x: 200, y: 60  }, // top-right
  { x: 200, y: 200 }, // bottom-right
];

const M_PATH = `M 60 200 L 60 60 L 130 130 L 200 60 L 200 200`;

const LAYERS = [
  { name: "M — Letterform",   color: "#ED1C24", visible: true,  locked: false },
  { name: "Grid — baseline",  color: "#4A9EFF", visible: true,  locked: true  },
  { name: "Guides",           color: "#FF6B35", visible: false, locked: false },
  { name: "Background",       color: "#8B5CF6", visible: true,  locked: true  },
];

const TOOLS = ["V", "A", "P", "T", "R", "E", "L", "Z", "G", "K"];

interface IllustratorUIProps {
  fillContainer?: boolean; // when true, fills parent (e.g. About page sidebar)
}

export function IllustratorUI({ fillContainer = false }: IllustratorUIProps = {}) {
  const [drawProgress, setDrawProgress] = useState(0);
  const [cursorPos,    setCursorPos]    = useState({ x: 60, y: 200 });
  const [activeAnchor, setActiveAnchor] = useState(0);
  const [blinkOn,      setBlinkOn]      = useState(true);
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Animate cursor moving to each anchor point
  useEffect(() => {
    let anchorIdx = 0;
    let progress  = 0;

    const step = () => {
      progress += 0.008;
      if (progress >= 1) {
        progress  = 0;
        anchorIdx = (anchorIdx + 1) % M_ANCHORS.length;
        setActiveAnchor(anchorIdx);
      }

      const from = M_ANCHORS[anchorIdx];
      const to   = M_ANCHORS[(anchorIdx + 1) % M_ANCHORS.length];
      setCursorPos({
        x: from.x + (to.x - from.x) * progress,
        y: from.y + (to.y - from.y) * progress,
      });

      // Draw progress — fills the M path stroke
      const totalAnchors = M_ANCHORS.length;
      const overallProgress = (anchorIdx + progress) / totalAnchors;
      setDrawProgress(Math.min(overallProgress, 1));

      animRef.current = setTimeout(step, 16);
    };

    animRef.current = setTimeout(step, 500);
    return () => { if (animRef.current) clearTimeout(animRef.current); };
  }, []);

  // Cursor blink
  useEffect(() => {
    const iv = setInterval(() => setBlinkOn((b) => !b), 600);
    return () => clearInterval(iv);
  }, []);

  // Approximate stroke-dashoffset for path drawing animation
  const PATH_LENGTH = 420; // approximate total path length
  const dashOffset  = PATH_LENGTH * (1 - drawProgress);

  return (
    <div
      style={{
        position:       "absolute",
        top:            0,
        ...(fillContainer ? { left: 0, right: "auto", width: "100%", height: "100%" } : { right: 0, width: "52%", height: "100%", transform: "scale(0.7)", transformOrigin: "top right" }),
        opacity:        0.5,
        pointerEvents:  "none",
        userSelect:     "none",
        overflow:       "hidden",
        zIndex:         5,
      }}
    >
      {/* ── Illustrator window chrome ── */}
      <div style={{
        position:   "absolute",
        inset:      0,
        background: "#1E1E1E",
        fontFamily: "'SF Mono', 'Menlo', monospace",
        fontSize:   "11px",
        color:      "#CCCCCC",
        display:    "flex",
        flexDirection: "column",
      }}>

        {/* ── Menu bar ── */}
        <div style={{
          height:      "22px",
          background:  "#323232",
          borderBottom:"1px solid #111",
          display:     "flex",
          alignItems:  "center",
          padding:     "0 8px",
          gap:         "16px",
          flexShrink:  0,
        }}>
          {["File","Edit","Object","Type","Select","Effect","View","Window","Help"].map((m) => (
            <span key={m} style={{ fontSize: "11px", color: "#CCCCCC", cursor: "default" }}>
              {m}
            </span>
          ))}
        </div>

        {/* ── Control bar ── */}
        <div style={{
          height:      "28px",
          background:  "#2C2C2C",
          borderBottom:"1px solid #111",
          display:     "flex",
          alignItems:  "center",
          padding:     "0 12px",
          gap:         "12px",
          flexShrink:  0,
        }}>
          <span style={{ fontSize: "10px", color: "#888" }}>X:</span>
          <span style={{ fontSize: "10px", color: "#EEE", width: "40px" }}>
            {Math.round(cursorPos.x * 2.4)}px
          </span>
          <span style={{ fontSize: "10px", color: "#888" }}>Y:</span>
          <span style={{ fontSize: "10px", color: "#EEE", width: "40px" }}>
            {Math.round(cursorPos.y * 2.4)}px
          </span>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: "10px", color: "#888" }}>Stroke:</span>
          <div style={{
            width: "16px", height: "16px",
            background: "none", border: "1px solid #ED1C24",
          }} />
          <span style={{ fontSize: "10px", color: "#888" }}>Fill:</span>
          <div style={{
            width: "16px", height: "16px",
            background: "transparent", border: "1px solid #666",
          }} />
        </div>

        {/* ── Main area ── */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* ── Left toolbar ── */}
          <div style={{
            width:        "28px",
            background:   "#2C2C2C",
            borderRight:  "1px solid #111",
            display:      "flex",
            flexDirection:"column",
            alignItems:   "center",
            padding:      "8px 0",
            gap:          "2px",
            flexShrink:   0,
          }}>
            {TOOLS.map((tool, i) => (
              <div
                key={tool}
                style={{
                  width:          "22px",
                  height:         "22px",
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  background:     i === 2 ? "#ED1C24" : "transparent", // Pen tool active
                  borderRadius:   "2px",
                  fontSize:       "10px",
                  color:          i === 2 ? "#fff" : "#AAA",
                  fontWeight:     i === 2 ? 700 : 400,
                }}
              >
                {tool}
              </div>
            ))}
          </div>

          {/* ── Canvas area ── */}
          <div style={{ flex: 1, background: "#404040", position: "relative", overflow: "hidden" }}>

            {/* Grid dots */}
            <svg
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.3 }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="illustrator-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="0" cy="0" r="0.5" fill="#999" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#illustrator-grid)" />
            </svg>

            {/* Artboard — white canvas */}
            <div style={{
              position:     "absolute",
              top:          "50%",
              left:         "50%",
              transform:    "translate(-50%, -50%)",
              width:        "260px",
              height:       "260px",
              background:   "#FFFFFF",
              boxShadow:    "0 4px 24px rgba(0,0,0,0.5)",
            }}>
              {/* Artboard label */}
              <div style={{
                position:  "absolute",
                top:       "-18px",
                left:      0,
                fontSize:  "9px",
                color:     "#CCC",
                whiteSpace:"nowrap",
              }}>
                Motivo_M_Letterform-v3.ai
              </div>

              {/* SVG artboard content */}
              <svg
                width="260"
                height="260"
                viewBox="0 0 260 260"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Guide lines */}
                <line x1="30" y1="0" x2="30" y2="260" stroke="#4A9EFF" strokeWidth="0.5" strokeDasharray="4,4" opacity="0.4" />
                <line x1="230" y1="0" x2="230" y2="260" stroke="#4A9EFF" strokeWidth="0.5" strokeDasharray="4,4" opacity="0.4" />
                <line x1="0" y1="30" x2="260" y2="30" stroke="#4A9EFF" strokeWidth="0.5" strokeDasharray="4,4" opacity="0.4" />
                <line x1="0" y1="230" x2="260" y2="230" stroke="#4A9EFF" strokeWidth="0.5" strokeDasharray="4,4" opacity="0.4" />

                {/* The M path — animated drawing */}
                <path
                  d={M_PATH}
                  fill="none"
                  stroke="#ED1C24"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={PATH_LENGTH}
                  strokeDashoffset={dashOffset}
                  style={{ transition: "stroke-dashoffset 0.05s linear" }}
                />

                {/* Anchor points */}
                {M_ANCHORS.map((pt, i) => (
                  <g key={i}>
                    {/* Anchor point square */}
                    <rect
                      x={pt.x - 4}
                      y={pt.y - 4}
                      width="8"
                      height="8"
                      fill={i === activeAnchor ? "#ED1C24" : "#FFFFFF"}
                      stroke={i === activeAnchor ? "#ED1C24" : "#4A9EFF"}
                      strokeWidth="1"
                    />
                  </g>
                ))}

                {/* Animated pen cursor */}
                <g transform={`translate(${cursorPos.x}, ${cursorPos.y})`}>
                  {/* Pen tool cursor */}
                  <path
                    d="M 0 0 L 0 12 L 3 9 L 5 14 L 6.5 13.5 L 4.5 8.5 L 8 8.5 Z"
                    fill="#FFFFFF"
                    stroke="#000"
                    strokeWidth="0.5"
                  />
                  {/* Pen nib dot — blinks */}
                  {blinkOn && (
                    <circle cx="2" cy="2" r="2" fill="#ED1C24" />
                  )}
                </g>

                {/* Selection handles around active segment */}
                <rect
                  x="50" y="50" width="160" height="160"
                  fill="none"
                  stroke="#4A9EFF"
                  strokeWidth="0.5"
                  strokeDasharray="3,3"
                  opacity="0.5"
                />
              </svg>
            </div>

            {/* Zoom indicator */}
            <div style={{
              position:  "absolute",
              bottom:    "8px",
              left:      "50%",
              transform: "translateX(-50%)",
              fontSize:  "10px",
              color:     "#AAA",
              background:"rgba(0,0,0,0.4)",
              padding:   "2px 8px",
              borderRadius: "3px",
            }}>
              150%
            </div>
          </div>

          {/* ── Layers panel ── */}
          <div style={{
            width:       "180px",
            background:  "#252525",
            borderLeft:  "1px solid #111",
            display:     "flex",
            flexDirection:"column",
            flexShrink:  0,
          }}>
            {/* Panel header */}
            <div style={{
              height:       "28px",
              background:   "#2C2C2C",
              borderBottom: "1px solid #111",
              display:      "flex",
              alignItems:   "center",
              padding:      "0 10px",
              justifyContent:"space-between",
            }}>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "#DDD" }}>Layers</span>
              <span style={{ fontSize: "14px", color: "#888", cursor: "default" }}>+</span>
            </div>

            {/* Layer items */}
            {LAYERS.map((layer, i) => (
              <div
                key={layer.name}
                style={{
                  display:      "flex",
                  alignItems:   "center",
                  padding:      "5px 8px",
                  gap:          "6px",
                  borderBottom: "1px solid #1A1A1A",
                  background:   i === 0 ? "rgba(237,28,36,0.08)" : "transparent",
                }}
              >
                {/* Eye icon */}
                <span style={{
                  fontSize: "10px",
                  color:    layer.visible ? "#CCC" : "#444",
                  width:    "12px",
                }}>
                  {layer.visible ? "●" : "○"}
                </span>
                {/* Lock icon */}
                <span style={{
                  fontSize: "10px",
                  color:    layer.locked ? "#666" : "#333",
                  width:    "10px",
                }}>
                  {layer.locked ? "🔒" : ""}
                </span>
                {/* Color chip */}
                <div style={{
                  width:        "8px",
                  height:       "8px",
                  background:   layer.color,
                  borderRadius: "1px",
                  flexShrink:   0,
                }} />
                {/* Name */}
                <span style={{
                  fontSize:  "10px",
                  color:     i === 0 ? "#EEE" : "#999",
                  overflow:  "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  flex:      1,
                }}>
                  {layer.name}
                </span>
              </div>
            ))}

            <div style={{ flex: 1 }} />

            {/* Properties panel stub */}
            <div style={{
              borderTop:  "1px solid #111",
              padding:    "8px",
            }}>
              <div style={{ fontSize: "10px", color: "#888", marginBottom: "6px", fontWeight: 600 }}>
                Properties
              </div>
              {[
                { label: "W", value: "160 px" },
                { label: "H", value: "160 px" },
                { label: "X", value: "50 px"  },
                { label: "Y", value: "50 px"  },
              ].map((prop) => (
                <div key={prop.label} style={{
                  display: "flex", justifyContent: "space-between",
                  marginBottom: "3px",
                }}>
                  <span style={{ fontSize: "10px", color: "#666" }}>{prop.label}</span>
                  <span style={{ fontSize: "10px", color: "#CCC" }}>{prop.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Status bar ── */}
        <div style={{
          height:    "20px",
          background:"#2C2C2C",
          borderTop: "1px solid #111",
          display:   "flex",
          alignItems:"center",
          padding:   "0 12px",
          gap:       "16px",
          flexShrink:0,
        }}>
          <span style={{ fontSize: "9px", color: "#666" }}>Artboard 1 of 1</span>
          <span style={{ fontSize: "9px", color: "#666" }}>
            {Math.round(drawProgress * 100)}% drawn
          </span>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: "9px", color: "#666" }}>
            Pen Tool active — click to add anchor point
          </span>
        </div>
      </div>
    </div>
  );
}
