"use client";
import { useRef, useState } from "react";
import { team }             from "@/data/team";

export function PeopleSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section
      style={{
        background: "#F5F5F0",
        padding:    "100px 0 100px",
        overflow:   "hidden",
      }}
    >
      <div className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Header */}
      <div style={{ marginBottom: "48px", textAlign: "center" }}>
        <span
          style={{
            fontFamily:    "var(--font-sans)",
            fontSize:      "10px",
            fontWeight:    500,
            letterSpacing: "0.14em",
            textTransform: "uppercase" as const,
            color:         "rgba(8,8,8,0.3)",
          }}
        >
          The people
        </span>
      </div>

      {/* Horizontal scroll track — centered */}
      <div
        ref={trackRef}
        style={{
          display:        "flex",
          gap:            "16px",
          paddingLeft:    "48px",
          paddingRight:   "48px",
          overflowX:      "auto",
          scrollbarWidth: "none",
          scrollBehavior: "smooth",
          cursor:         "grab",
          width:          "100%",
          maxWidth:       "1440px",
          margin:         "0 auto",
          justifyContent: "center",
        }}
        onMouseDown={(e) => {
          const el    = trackRef.current;
          if (!el) return;
          const startX   = e.pageX - el.offsetLeft;
          const scrollLeft = el.scrollLeft;
          const onMove = (ev: MouseEvent) => {
            const x    = ev.pageX - el.offsetLeft;
            el.scrollLeft = scrollLeft - (x - startX);
          };
          const onUp = () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
            if (el) el.style.cursor = "grab";
          };
          el.style.cursor = "grabbing";
          window.addEventListener("mousemove", onMove);
          window.addEventListener("mouseup", onUp);
        }}
      >
        {team.map((member, i) => (
          <div
            key={member.name}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{
              flexShrink: 0,
              width:      "280px",
              display:    "flex",
              flexDirection: "column",
              cursor:     "default",
            }}
          >
            {/* Single photo - grayscale at rest, color on hover */}
            <div
              style={{
                position:     "relative",
                width:        "100%",
                aspectRatio:  "3/4",
                borderRadius: "10px",
                overflow:     "hidden",
                background:   "#e0e0e0",
              }}
            >
              <img
                src={member.photo}
                alt={member.name}
                style={{
                  width:      "100%",
                  height:     "100%",
                  objectFit:  "cover",
                  display:    "block",
                  filter:     hoveredIdx === i ? "none" : "grayscale(100%)",
                  transition: "filter 0.4s ease",
                }}
              />

              {/* Quote overlay - slides up on hover */}
              <div
                style={{
                  position:   "absolute",
                  bottom:     0,
                  left:       0,
                  right:      0,
                  padding:    "20px",
                  background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)",
                  transform:  hoveredIdx === i ? "translateY(0)" : "translateY(20px)",
                  opacity:    hoveredIdx === i ? 1 : 0,
                  transition: "transform 0.4s ease, opacity 0.4s ease",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize:   "11px",
                    color:      "rgba(255,255,255,0.85)",
                    lineHeight: 1.5,
                    margin:     0,
                    fontStyle:  "italic",
                  }}
                >
                  &ldquo;{member.quote}&rdquo;
                </p>
              </div>
            </div>

            {/* Name + role */}
            <div style={{ padding: "14px 4px 0" }}>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 500,
                  fontSize:   "16px",
                  color:      "#080808",
                  margin:     "0 0 4px 0",
                }}
              >
                {member.name}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize:   "11px",
                  color:      "rgba(8,8,8,0.4)",
                  margin:     0,
                }}
              >
                {member.role}
              </p>
            </div>
          </div>
        ))}

        {/* Trailing spacer */}
        <div style={{ flexShrink: 0, width: "48px" }} />
      </div>
      </div>
    </section>
  );
}
