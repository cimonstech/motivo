"use client";

import { useEffect, useRef } from "react";
import { useRouter }         from "next/navigation";
import { gsap }              from "gsap";
import { ScrollTrigger }     from "gsap/ScrollTrigger";
import { safeNavigate }      from "@/lib/safeNavigate";
import { featuredProjects }  from "@/data/projects";
import { CATEGORY_LABELS }   from "@/data/categories";

gsap.registerPlugin(ScrollTrigger);

export function FeaturedWork() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!featuredProjects.length) return;
    const ctx = gsap.context(() => {
      gsap.from(".featured-card", {
        y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      });
    }, sectionRef);
    return () => { try { ctx.revert(); } catch { /* noop */ } };
  }, []);

  if (!featuredProjects.length) {
    return (
      <section style={{ background: "#F5F5F0", padding: "80px 48px" }}>
        <p style={{ color: "red" }}>No featured projects found. Check projects.ts</p>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      style={{ background: "#F5F5F0", padding: "80px 0 96px" }}
    >
      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "0 48px" }}>

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "flex-end",
          justifyContent: "space-between", marginBottom: "40px",
        }}>
          <div>
            <span style={{
              display: "block", fontFamily: "var(--font-sans)",
              fontSize: "10px", fontWeight: 500, letterSpacing: "0.14em",
              textTransform: "uppercase" as const,
              color: "rgba(8,8,8,0.3)", marginBottom: "12px",
            }}>
              Selected work
            </span>
            <h2 style={{
              fontFamily: "var(--font-display)", fontWeight: 700,
              fontSize: "clamp(28px, 3.5vw, 52px)", color: "#080808",
              letterSpacing: "-0.02em", lineHeight: 1.05, margin: 0,
            }}>
              Not only imagined -<br />
              <span style={{ color: "#ED1C24" }}>built properly.</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={() => safeNavigate("/work", router)}
            style={{
              background: "none", border: "none", padding: 0,
              fontFamily: "var(--font-sans)", fontSize: "12px",
              color: "rgba(8,8,8,0.35)", display: "flex",
              alignItems: "center", gap: "4px", flexShrink: 0,
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#080808")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(8,8,8,0.35)")}
          >
            View all work <span style={{ color: "#ED1C24" }}>→</span>
          </button>
        </div>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
        }}>
          {featuredProjects.map((project, i) => (
            <button
              key={project.slug}
              type="button"
              onClick={() => safeNavigate(`/work/${project.slug}`, router)}
              className="featured-card"
              style={{
                position: "relative", display: "block",
                overflow: "hidden", borderRadius: "12px",
                border: "0.5px solid rgba(8,8,8,0.08)",
                background: "#111",
                aspectRatio: i === 0 ? "16/9" : "4/3",
                gridColumn: i === 0 ? "span 2" : "span 1",
                cursor: "pointer",
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.stripMedia.src}
                alt={project.name}
                style={{
                  position: "absolute", inset: 0,
                  width: "100%", height: "100%", objectFit: "cover",
                }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)",
              }} />
              <div className="red-bar" style={{
                position: "absolute", left: 0, top: 0, bottom: 0,
                width: "3px", background: "#ED1C24",
                transform: "scaleY(0)", transformOrigin: "bottom",
                transition: "transform 0.4s cubic-bezier(0.34,1.1,0.64,1)",
              }} />
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px",
              }}>
                <span style={{
                  fontFamily: "var(--font-sans)", fontSize: "9px",
                  color: "rgba(255,255,255,0.45)", textTransform: "uppercase" as const,
                  letterSpacing: "0.1em", display: "block", marginBottom: "5px",
                }}>
                  {CATEGORY_LABELS[project.category] ?? project.category} · {project.year}
                </span>
                <h3 style={{
                  fontFamily: "var(--font-display)", fontWeight: 500,
                  fontSize: "15px", color: "#fff", margin: 0, lineHeight: 1.2,
                }}>
                  {project.name}
                </h3>
              </div>
              <div style={{
                position: "absolute", top: "14px", right: "14px",
                width: "28px", height: "28px", borderRadius: "50%",
                background: "rgba(255,255,255,0.07)",
                border: "0.5px solid rgba(255,255,255,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: "11px", color: "#fff" }}>↗</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
