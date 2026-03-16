"use client";
import dynamic from "next/dynamic";
import {
  useEffect, useRef, useState, useCallback,
} from "react";
import { gsap }          from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter }     from "next/navigation";
import { projects }     from "@/data/projects";
import type { Project }  from "@/data/projects";

const OrbCanvas = dynamic(
  () => import("@/components/three/OrbCanvas"),
  { ssr: false }
);

gsap.registerPlugin(ScrollTrigger);

interface Props {
  initialCategory: string | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  brands:       "Brand Identity",
  digital:      "Digital",
  campaigns:    "Campaigns",
  fabrications: "Fabrications",
};

export function WorkPageClient({ initialCategory }: Props) {
  const [activeIdx,    setActiveIdx]    = useState(0);
  const [mousePos,     setMousePos]     = useState({ x: -200, y: -200 });
  const [overStrip,    setOverStrip]    = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(initialCategory);

  const cardRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const logoRef     = useRef<HTMLDivElement>(null);
  const titleRef    = useRef<HTMLDivElement>(null);
  const indexRef    = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const router      = useRouter();

  // Filter projects by category
  const filteredProjects: Project[] = activeFilter
    ? projects.filter((p) => p.category === activeFilter)
    : projects;

  // Reset active index and scroll when filter changes
  useEffect(() => {
    setActiveIdx(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeFilter]);

  // Pre-scroll to first matching project when landing with category
  useEffect(() => {
    if (!initialCategory || filteredProjects.length === 0) return;
    const timer = setTimeout(() => {
      cardRefs.current[0]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 150);
    return () => clearTimeout(timer);
  }, [initialCategory]);

  // Scroll spy
  useEffect(() => {
    const onScroll = () => {
      const mid = window.innerHeight / 2;
      let closest = 0, closestDist = Infinity;
      for (let i = 0; i < filteredProjects.length; i++) {
        const card = cardRefs.current[i];
        if (!card) continue;
        const rect    = card.getBoundingClientRect();
        const cardMid = rect.top + rect.height / 2;
        const dist    = Math.abs(cardMid - mid);
        if (dist < closestDist) { closestDist = dist; closest = i; }
      }
      setActiveIdx(closest);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [filteredProjects]);

  // Scroll-off animation — fixed elements exit upward as CTA rises
  useEffect(() => {
    if (!sentinelRef.current) return;

    const fixedEls = [
      logoRef.current,
      titleRef.current,
      indexRef.current,
    ].filter(Boolean);

    const ctx = gsap.context(() => {
      gsap.to(fixedEls, {
        y:       "-120vh",
        opacity: 0,
        ease:    "power2.in",
        scrollTrigger: {
          trigger: sentinelRef.current,
          start:   "top 80%",
          end:     "top 20%",
          scrub:   1,
        },
      });
    });

    return () => { try { ctx.revert(); } catch { /* noop */ } };
  }, [filteredProjects]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <div
      style={{
        background:     "#F5F5F0",
        minHeight:      "100vh",
        overflowX:      "hidden",
        scrollbarWidth: "none",
        paddingTop:     "80px",
        paddingBottom:  "140px",
      }}
      onMouseMove={handleMouseMove}
    >
      {/* ── Fixed: Motivo logo ── */}
      <div
        ref={logoRef}
        style={{
          position:      "fixed",
          left:          "max(24px, calc(50vw - 720px + 24px))",
          top:           "50%",
          transform:     "translateY(-50%)",
          zIndex:        40,
          pointerEvents: "none",
          willChange:    "transform",
        }}
      >
        <img
          src="/logo.svg"
          alt=""
          aria-hidden="true"
          style={{
            height:          "90px",
            width:           "auto",
            display:         "block",
            transform:       "rotate(-90deg)",
            filter:          "grayscale(100%) brightness(0)",
            opacity:         0.08,
            userSelect:      "none",
            transformOrigin: "center center",
          }}
        />
      </div>

      {/* ── Fixed: "Our Work" title ── */}
      <div
        ref={titleRef}
        style={{
          position:      "fixed",
          bottom:        "28px",
          left:          "max(40px, calc(50vw - 720px + 40px))",
          zIndex:        40,
          pointerEvents: "none",
          willChange:    "transform",
        }}
      >
        <span
          style={{
            fontFamily:    "var(--font-display)",
            fontWeight:    700,
            fontSize:      "clamp(32px, 5vw, 72px)",
            color:         "#080808",
            letterSpacing: "-0.03em",
            lineHeight:    1,
            userSelect:    "none",
          }}
        >
          Our Work
        </span>
      </div>

      {/* ── Fixed: project index — bottom-right ── */}
      <div
        ref={indexRef}
        style={{
          position:      "fixed",
          bottom:        "32px",
          right:         "max(40px, calc(50vw - 720px + 40px))",
          zIndex:        40,
          display:       "flex",
          flexDirection: "column",
          alignItems:    "flex-end",
          gap:           "4px",
          willChange:    "transform",
        }}
      >
        {filteredProjects.map((project, i) => (
          <button
            key={project.slug}
            className="work-index-btn"
            onClick={() => {
              const btns = document.querySelectorAll<HTMLButtonElement>(".work-index-btn");
              const btn  = btns[i];
              if (btn) {
                const rect = btn.getBoundingClientRect();
                sessionStorage.setItem("projectNameTransition", JSON.stringify({
                  top: rect.top, left: rect.left,
                  width: rect.width, height: rect.height,
                  name: project.name, fontSize: window.getComputedStyle(btn).fontSize,
                }));
              }
              router.push(`/work/${project.slug}`);
            }}
            style={{
              background:  "none",
              border:      "none",
              padding:     "1px 0",
              fontFamily:  "var(--font-sans)",
              fontSize:    activeIdx === i ? "14px" : "12px",
              fontWeight:  activeIdx === i ? 700 : 400,
              color:       activeIdx === i ? "#080808" : "rgba(8,8,8,0.28)",
              cursor:      "pointer",
              textAlign:   "right",
              transition:  "all 0.2s ease",
              lineHeight:  1.3,
            }}
          >
            {project.name}
          </button>
        ))}
      </div>

      {/* ── Category filter tabs ── */}
      <div
        style={{
          display:         "flex",
          justifyContent:  "center",
          gap:             "0",
          marginBottom:    "40px",
          borderBottom:    "0.5px solid rgba(8,8,8,0.1)",
        }}
      >
        {/* All */}
        <button
          onClick={() => setActiveFilter(null)}
          style={{
            background:    "none",
            border:        "none",
            borderBottom:  activeFilter === null
              ? "2px solid #ED1C24"
              : "2px solid transparent",
            padding:       "12px 24px",
            fontFamily:    "var(--font-sans)",
            fontSize:      "12px",
            fontWeight:    activeFilter === null ? 600 : 400,
            color:         activeFilter === null ? "#080808" : "rgba(8,8,8,0.4)",
            cursor:        "pointer",
            transition:    "all 0.2s ease",
            letterSpacing: "0.04em",
          }}
        >
          All
        </button>
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            style={{
              background:    "none",
              border:        "none",
              borderBottom:  activeFilter === key
                ? "2px solid #ED1C24"
                : "2px solid transparent",
              padding:       "12px 24px",
              fontFamily:    "var(--font-sans)",
              fontSize:      "12px",
              fontWeight:    activeFilter === key ? 600 : 400,
              color:         activeFilter === key ? "#080808" : "rgba(8,8,8,0.4)",
              cursor:        "pointer",
              transition:    "all 0.2s ease",
              letterSpacing: "0.04em",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Magnifier lens ── */}
      {overStrip && (
        <div
          style={{
            position:       "fixed",
            left:           mousePos.x,
            top:            mousePos.y,
            width:          "64px",
            height:         "64px",
            borderRadius:   "50%",
            border:         "1px solid rgba(8,8,8,0.15)",
            background:     "rgba(8,8,8,0.02)",
            transform:      "translate(-50%,-50%)",
            pointerEvents:  "none",
            zIndex:         200,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
          }}
        >
          <div style={{
            width: "4px", height: "4px",
            borderRadius: "50%", background: "#ED1C24",
          }} />
        </div>
      )}

      {/* ── Project strip ── */}
      <div
        style={{
          display:       "flex",
          flexDirection: "column",
          alignItems:    "center",
          paddingLeft:   "8vw",
          marginLeft:    "auto",
          marginRight:   "auto",
          width:         "fit-content",
          gap:           "8px",
        }}
        onMouseEnter={() => setOverStrip(true)}
        onMouseLeave={() => setOverStrip(false)}
      >
        {filteredProjects.length === 0 ? (
          <div style={{
            padding:    "80px 0",
            fontFamily: "var(--font-sans)",
            fontSize:   "14px",
            color:      "rgba(8,8,8,0.3)",
            textAlign:  "center",
          }}>
            No projects in this category yet.
          </div>
        ) : (
          filteredProjects.map((project, i) => {
            const isActive = activeIdx === i;
            return (
              <div
                key={project.slug}
                ref={(el) => { cardRefs.current[i] = el; }}
                onClick={() => {
                  sessionStorage.setItem("projectNameTransition", JSON.stringify({
                    top: window.innerHeight - 80, left: window.innerWidth - 240,
                    width: 200, height: 20, name: project.name, fontSize: "12px",
                  }));
                  router.push(`/work/${project.slug}`);
                }}
                style={{
                  width:      isActive ? "44vw"  : "26vw",
                  maxWidth:   isActive ? "660px" : "390px",
                  cursor:     "pointer",
                  transition: [
                    "width 0.55s cubic-bezier(0.34,1.1,0.64,1)",
                    "max-width 0.55s cubic-bezier(0.34,1.1,0.64,1)",
                  ].join(", "),
                }}
              >
                <div style={{
                  borderRadius: "6px",
                  overflow:     "hidden",
                  opacity:      isActive ? 1 : 0.45,
                  transition:   "opacity 0.4s ease",
                }}>
                  <img
                    src={project.stripMedia.src}
                    alt={project.name}
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                </div>
                <div style={{
                  display:        "flex",
                  justifyContent: "space-between",
                  alignItems:     "baseline",
                  padding:        "8px 2px 20px",
                  opacity:        isActive ? 1 : 0,
                  transition:     "opacity 0.3s ease",
                  pointerEvents:  isActive ? "auto" : "none",
                }}>
                  <span style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                    fontSize:   "clamp(13px, 1.2vw, 18px)",
                    color:      "#080808",
                  }}>
                    {project.name}
                  </span>
                  <span style={{
                    fontFamily:    "var(--font-sans)",
                    fontSize:      "10px",
                    color:         "rgba(8,8,8,0.35)",
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.08em",
                  }}>
                    {project.category} · {project.year}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Sentinel — triggers fixed element exit ── */}
      <div ref={sentinelRef} style={{ height: "1px", margin: "40px 0 0" }} />

      {/* ── CTA section — orb + quote ── */}
      <div
        style={{
          background: "#F5F5F0",
          borderTop:  "0.5px solid rgba(8,8,8,0.08)",
          padding:    "80px 0 100px",
          position:   "relative",
          overflow:   "hidden",
        }}
      >
        {/* Ghost logo */}
        <div
          aria-hidden="true"
          style={{
            position:       "absolute",
            inset:          0,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            pointerEvents:  "none",
            zIndex:         0,
          }}
        >
          <img
            src="/logo.svg"
            alt=""
            style={{
              width:      "clamp(240px, 35vw, 480px)",
              height:     "auto",
              display:    "block",
              filter:     "grayscale(100%) brightness(0)",
              opacity:    0.04,
              userSelect: "none",
            }}
          />
        </div>

        {/* Content */}
        <div
          style={{
            position:       "relative",
            zIndex:         1,
            maxWidth:       "1440px",
            margin:         "0 auto",
            padding:        "0 48px",
            display:        "flex",
            flexDirection:  "row",
            alignItems:     "center",
            justifyContent: "space-between",
            gap:            "60px",
          }}
        >
          {/* Left — quote */}
          <div
            style={{
              flex:          "1",
              maxWidth:      "520px",
              display:       "flex",
              flexDirection: "column",
              gap:           "24px",
            }}
          >
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
              Our philosophy
            </span>

            <blockquote
              style={{
                margin:      0,
                borderLeft:  "2px solid #ED1C24",
                paddingLeft: "20px",
              }}
            >
              <p
                style={{
                  fontFamily:    "var(--font-display)",
                  fontWeight:    500,
                  fontSize:      "clamp(14px, 1.5vw, 22px)",
                  color:         "#080808",
                  lineHeight:    1.55,
                  letterSpacing: "-0.01em",
                  margin:        0,
                }}
              >
                Precise by instinct.{" "}
                <span style={{ color: "rgba(8,8,8,0.4)" }}>
                  Client-focused by nature. We craft brands and digital products
                  with restraint, rigour, and an obsessive attention to detail —
                  delivering work that feels effortless and performs flawlessly.
                </span>
              </p>
              <cite
                style={{
                  display:       "block",
                  marginTop:     "14px",
                  fontFamily:    "var(--font-sans)",
                  fontSize:      "10px",
                  color:         "rgba(8,8,8,0.3)",
                  fontStyle:     "normal",
                  letterSpacing: "0.04em",
                }}
              >
                — Batista Simons, Creative Developer
              </cite>
            </blockquote>

            <a
              href="/contact"
              style={{
                fontFamily:     "var(--font-sans)",
                fontSize:       "12px",
                fontWeight:     500,
                color:          "#ffffff",
                background:     "#ED1C24",
                textDecoration: "none",
                borderRadius:   "100px",
                padding:        "9px 22px",
                display:        "inline-flex",
                alignItems:     "center",
                gap:            "6px",
                width:          "fit-content",
                transition:     "background 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#B5151B")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#ED1C24")}
            >
              Start a project →
            </a>
          </div>

          {/* Right — orb */}
          <div style={{ flexShrink: 0 }}>
            <OrbCanvas width={260} height={260} />
          </div>
        </div>
      </div>
    </div>
  );
}
