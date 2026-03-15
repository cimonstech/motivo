"use client";

import { useEffect, useRef } from "react";
import { gsap }             from "gsap";
import { ScrollTrigger }    from "gsap/ScrollTrigger";
import Image                from "next/image";
import { SafeLink }         from "@/components/ui/SafeLink";
import { featuredProjects } from "@/data/projects";

gsap.registerPlugin(ScrollTrigger);

export function FeaturedWork() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".featured-card",
        { y: 50, opacity: 0 },
        {
          y:        0,
          opacity:  1,
          duration: 0.9,
          stagger:  0.1,
          ease:     "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start:   "top 78%",
            once:    true,
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#F5F5F0",
        padding:    "80px 0 96px",
      }}
    >
      <div className="container">
      {/* Header */}
      <div
        style={{
          display:        "flex",
          alignItems:     "flex-end",
          justifyContent: "space-between",
          marginBottom:   "40px",
        }}
      >
        <div>
          <span
            style={{
              display:       "block",
              fontFamily:    "var(--font-sans)",
              fontSize:      "10px",
              fontWeight:    500,
              letterSpacing: "0.14em",
              textTransform: "uppercase" as const,
              color:         "rgba(8,8,8,0.3)",
              marginBottom:  "12px",
            }}
          >
            Selected work
          </span>
          <h2
            style={{
              fontFamily:    "var(--font-display)",
              fontWeight:    700,
              fontSize:      "clamp(28px, 3.5vw, 52px)",
              color:         "#080808",
              letterSpacing: "-0.02em",
              lineHeight:    1.05,
              margin:        0,
            }}
          >
            Not only imagined —<br />
            <span style={{ color: "#ED1C24" }}>built properly.</span>
          </h2>
        </div>

        <SafeLink
          href="/work"
          style={{
            fontFamily:     "var(--font-sans)",
            fontSize:       "12px",
            color:          "rgba(8,8,8,0.35)",
            textDecoration: "none",
            display:        "flex",
            alignItems:     "center",
            gap:            "4px",
            flexShrink:     0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#080808")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(8,8,8,0.35)")}
        >
          View all work <span style={{ color: "#ED1C24" }}>→</span>
        </SafeLink>
      </div>

      {/* 3-card grid: first card spans 2 cols */}
      <div
        style={{
          display:             "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap:                 "10px",
        }}
      >
        {featuredProjects.map((project, i) => {
          const isLarge = i === 0;

          return (
            <SafeLink
              key={project.slug}
              href={`/work/${project.slug}`}
              className="featured-card"
              style={{
                position:       "relative" as const,
                display:        "block",
                overflow:       "hidden",
                borderRadius:   "12px",
                border:         "0.5px solid rgba(8,8,8,0.08)",
                background:     "#111",
                aspectRatio:    isLarge ? "16/9" : "4/3",
                gridColumn:     isLarge ? "span 2" : "span 1",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                const bar = e.currentTarget.querySelector<HTMLDivElement>(".red-bar");
                if (bar) bar.style.transform = "scaleY(1)";
              }}
              onMouseLeave={(e) => {
                const bar = e.currentTarget.querySelector<HTMLDivElement>(".red-bar");
                if (bar) bar.style.transform = "scaleY(0)";
              }}
            >
              {/* Image */}
              <Image
                src={project.stripMedia.src}
                alt={project.name}
                fill
                style={{ objectFit: "cover", objectPosition: "center" }}
              />

              {/* Gradient */}
              <div
                style={{
                  position:   "absolute",
                  inset:      0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.08) 55%, transparent 100%)",
                }}
              />

              {/* Red bar */}
              <div
                className="red-bar"
                style={{
                  position:        "absolute",
                  left:            0,
                  top:             0,
                  bottom:          0,
                  width:           "3px",
                  background:      "#ED1C24",
                  transform:       "scaleY(0)",
                  transformOrigin: "bottom",
                  transition:      "transform 0.4s cubic-bezier(0.34,1.1,0.64,1)",
                }}
              />

              {/* Info */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px" }}>
                <span
                  style={{
                    fontFamily:    "var(--font-sans)",
                    fontSize:      "9px",
                    color:         "rgba(255,255,255,0.45)",
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.1em",
                    display:       "block",
                    marginBottom:  "5px",
                  }}
                >
                  {project.category} · {project.year}
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                    fontSize:   "15px",
                    color:      "#fff",
                    margin:     0,
                    lineHeight: 1.2,
                  }}
                >
                  {project.name}
                </h3>
              </div>

              {/* Arrow */}
              <div
                style={{
                  position:       "absolute",
                  top:            "14px",
                  right:          "14px",
                  width:          "28px",
                  height:         "28px",
                  borderRadius:   "50%",
                  background:     "rgba(255,255,255,0.07)",
                  border:         "0.5px solid rgba(255,255,255,0.12)",
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: "11px", color: "#fff" }}>↗</span>
              </div>
            </SafeLink>
          );
        })}
      </div>
      </div>
    </section>
  );
}
