"use client";
import { useRef, useState } from "react";
import { team }             from "@/data/team";
import { useMediaQuery }    from "@/hooks/useMediaQuery";

export function PeopleSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <section
      style={{
        background: "#F5F5F0",
        padding:    isMobile ? "60px 0 80px" : "100px 0 100px",
        overflow:   "hidden",
      }}
    >
      <div className="container" style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
      {/* Header */}
      <div style={{ marginBottom: isMobile ? "32px" : "48px", textAlign: "center" }}>
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

      {/* Mobile: 2-col grid, side by side. Desktop: horizontal scroll */}
      <div
        ref={trackRef}
        style={{
          display:        isMobile ? "grid" : "flex",
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : undefined,
          gap:            isMobile ? "24px" : "16px",
          paddingLeft:    isMobile ? 0 : "48px",
          paddingRight:   isMobile ? 0 : "48px",
          overflowX:      isMobile ? "visible" : "auto",
          scrollbarWidth: "none",
          scrollBehavior: "smooth",
          cursor:         isMobile ? "default" : "grab",
          width:          "100%",
          maxWidth:       "1440px",
          margin:         "0 auto",
          justifyContent: isMobile ? undefined : "center",
        }}
        onMouseDown={isMobile ? undefined : (e) => {
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
            onMouseEnter={!isMobile ? () => setHoveredIdx(i) : undefined}
            onMouseLeave={!isMobile ? () => setHoveredIdx(null) : undefined}
            style={{
              flexShrink: isMobile ? undefined : 0,
              width:      isMobile ? "100%" : "280px",
              display:    "flex",
              flexDirection: "column",
              cursor:     "default",
            }}
          >
            {/* Single photo - grayscale at rest, color on hover (always color on mobile) */}
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
                  filter:     (isMobile || hoveredIdx === i) ? "none" : "grayscale(100%)",
                  transition: "filter 0.4s ease",
                }}
              />

              {/* Quote overlay - desktop: on hover. Mobile: hidden (shown below) */}
              {!isMobile && (
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
              )}
            </div>

            {/* Name + role + quote (mobile: quote below name) */}
            <div style={{ padding: "14px 4px 0" }}>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 500,
                  fontSize:   isMobile ? "14px" : "16px",
                  color:      "#080808",
                  margin:     "0 0 4px 0",
                }}
              >
                {member.name}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize:   isMobile ? "10px" : "11px",
                  color:      "rgba(8,8,8,0.4)",
                  margin:     0,
                }}
              >
                {member.role}
              </p>
              {/* Mobile: quote below name */}
              {isMobile && (
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize:   "11px",
                    color:      "rgba(8,8,8,0.55)",
                    lineHeight: 1.5,
                    margin:     "10px 0 0",
                    fontStyle:  "italic",
                  }}
                >
                  &ldquo;{member.quote}&rdquo;
                </p>
              )}
            </div>
          </div>
        ))}

        {/* Trailing spacer - desktop only */}
        {!isMobile && <div style={{ flexShrink: 0, width: "48px" }} />}
      </div>
      </div>
    </section>
  );
}
