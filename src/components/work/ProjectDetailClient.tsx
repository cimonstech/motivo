"use client";
import { useEffect, useRef, useState } from "react";
import { gsap }  from "gsap";
import Link      from "next/link";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { type Project } from "@/data/projects";

interface Props { project: Project; nextProject: Project; }

export function ProjectDetailClient({ project, nextProject }: Props) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const titleRef   = useRef<HTMLHeadingElement>(null);
  const cloneRef   = useRef<HTMLDivElement>(null);
  const stripRef   = useRef<HTMLDivElement>(null);
  const rightRef   = useRef<HTMLDivElement>(null);
  const [activeImg, setActiveImg] = useState(0);

  const NAVBAR_H = 72;
  const PAGE_H   = `calc(100vh - ${NAVBAR_H}px)`;

  const isVideoUrl = (s: string) => /\.(mp4|webm|mov)(\?|$)/i.test(s);

  const allImages = (() => {
    const base = [project.stripMedia.src, ...(project.caseImages ?? [])];
    const seen = new Set<string>();
    return base.filter((src) => {
      if (!src || typeof src !== "string" || !src.trim()) return false;
      if (seen.has(src)) return false;
      seen.add(src);
      return true;
    });
  })();

  // GSAP name transition
  useEffect(() => {
    const stored = sessionStorage.getItem("projectNameTransition");
    sessionStorage.removeItem("projectNameTransition");

    if (!stored || !titleRef.current || !cloneRef.current) {
      gsap.from(titleRef.current, { y: 20, opacity: 0, duration: 0.7, ease: "power3.out", delay: 0.15 });
      return;
    }
    const from      = JSON.parse(stored);
    const titleRect = titleRef.current.getBoundingClientRect();
    gsap.set(titleRef.current, { opacity: 0 });
    const clone = cloneRef.current;
    clone.textContent   = project.name;
    clone.style.display = "block";
    gsap.set(clone, {
      position: "fixed", top: from.top, left: from.left,
      fontSize: from.fontSize, fontWeight: 700, color: "#080808",
      zIndex: 999, opacity: 1, margin: 0, padding: 0,
      pointerEvents: "none", fontFamily: "var(--font-display)",
      letterSpacing: "-0.02em", lineHeight: 1, whiteSpace: "nowrap",
    });
    gsap.to(clone, {
      top: titleRect.top, left: titleRect.left,
      fontSize: window.getComputedStyle(titleRef.current).fontSize,
      duration: 0.75, ease: "power3.inOut",
      onComplete: () => {
        gsap.to(titleRef.current, { opacity: 1, duration: 0.15 });
        gsap.to(clone, { opacity: 0, duration: 0.15,
          onComplete: () => { clone.style.display = "none"; } });
      },
    });
  }, [project.name]);

  // Content entrance — scoped to right panel, delayed so DOM is ready on client nav
  const slug = project.slug;
  useEffect(() => {
    const run = () => {
      const el = rightRef.current;
      if (!el) return;
      const targets = el.querySelectorAll<HTMLElement>(".detail-content");
      if (targets.length === 0) return;
      gsap.fromTo(targets, { y: 14, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power2.out", delay: 0.2,
      });
    };
    const id = requestAnimationFrame(() => requestAnimationFrame(run));
    return () => cancelAnimationFrame(id);
  }, [slug ?? ""]);

  // Strip scroll → active image
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;

    const onScroll = () => {
      const thumbs   = strip.querySelectorAll<HTMLElement>(".thumb");
      const stripMid = strip.scrollTop + strip.clientHeight / 2;
      let closest    = 0;
      let closestDist = Infinity;
      thumbs.forEach((thumb, i) => {
        const mid  = thumb.offsetTop + thumb.offsetHeight / 2;
        const dist = Math.abs(mid - stripMid);
        if (dist < closestDist) { closestDist = dist; closest = i; }
      });
      setActiveImg(closest);
    };

    strip.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => strip.removeEventListener("scroll", onScroll);
  }, [allImages.length]);

  // Click → scroll thumb to center
  const handleThumbClick = (i: number) => {
    const strip  = stripRef.current;
    if (!strip) return;
    const thumbs = strip.querySelectorAll<HTMLElement>(".thumb");
    const thumb  = thumbs[i];
    if (!thumb) return;
    const targetScroll = thumb.offsetTop - strip.clientHeight / 2 + thumb.offsetHeight / 2;
    strip.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  const STRIP_W = 140;

  // Mobile: stacked layout with horizontal thumb strip
  if (isMobile) {
    return (
      <div style={{ background: "#F5F5F0", minHeight: "100vh", paddingTop: `${NAVBAR_H}px`, overflowX: "hidden" }}>
        <div ref={cloneRef} style={{ display: "none" }} />
        <div style={{ padding: "20px 20px 40px" }}>
          <Link href="/work" style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            fontFamily: "var(--font-sans)", fontSize: "11px",
            color: "rgba(8,8,8,0.4)", textDecoration: "none",
            marginBottom: "16px", width: "fit-content",
          }}>
            ← Work
          </Link>

          {/* Main image */}
          <div style={{ marginBottom: "16px", borderRadius: "6px", overflow: "hidden" }}>
            {isVideoUrl(allImages[activeImg]) ? (
              <video
                key={activeImg}
                src={allImages[activeImg]}
                autoPlay
                loop
                muted
                playsInline
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            ) : (
              <img
                key={activeImg}
                src={allImages[activeImg]}
                alt={`${project.name} ${activeImg + 1}`}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            )}
            <div style={{
              fontFamily: "var(--font-sans)", fontSize: "11px",
              color: "rgba(8,8,8,0.35)", padding: "8px 0 0",
            }}>
              {activeImg + 1} / {allImages.length}
            </div>
          </div>

          {/* Horizontal thumb strip */}
          <div style={{
            display: "flex", gap: "8px", overflowX: "auto",
            paddingBottom: "8px", marginBottom: "24px",
            scrollbarWidth: "none", WebkitOverflowScrolling: "touch",
          }}>
            {allImages.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImg(i)}
                style={{
                  flexShrink: 0, width: "72px", borderRadius: "4px",
                  overflow: "hidden", border: "none", padding: 0,
                  cursor: "pointer", opacity: activeImg === i ? 1 : 0.4,
                  transition: "opacity 0.2s ease",
                }}
              >
                {isVideoUrl(src) ? (
                  <video src={src} muted playsInline style={{ width: "100%", height: "auto", display: "block" }} />
                ) : (
                  <img src={src} alt="" style={{ width: "100%", height: "auto", display: "block" }} />
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div ref={rightRef}>
            <h1 ref={titleRef} className="detail-content" style={{
              fontFamily: "var(--font-display)", fontWeight: 700,
              fontSize: "28px", color: "#080808",
              letterSpacing: "-0.03em", lineHeight: 1.0, margin: "0 0 20px 0",
            }}>
              {project.name}
            </h1>
            <div className="detail-content" style={{ display: "flex", gap: "24px", marginBottom: "16px" }}>
              {[
                { label: "Year", value: project.year },
                { label: "Disciplines", value: project.tags?.join(", ") ?? project.category },
              ].map((m) => (
                <div key={m.label} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                  <span style={{
                    fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: 600,
                    letterSpacing: "0.12em", textTransform: "uppercase" as const,
                    color: "rgba(8,8,8,0.3)",
                  }}>{m.label}</span>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "13px", color: "#080808", fontWeight: 500 }}>{m.value}</span>
                </div>
              ))}
            </div>
            <div className="detail-content" style={{ height: "0.5px", background: "rgba(8,8,8,0.08)", marginBottom: "16px" }} />
            <p className="detail-content" style={{
              fontFamily: "var(--font-sans)", fontSize: "13px",
              color: "rgba(8,8,8,0.5)", lineHeight: 1.7, margin: "0 0 16px 0",
            }}>
              {project.summary}
            </p>
            {[
              { label: "The Challenge", text: project.challenge },
              { label: "The Insight", text: project.insight },
              { label: "The Solution", text: project.solution },
            ].filter((s) => s.text).map((section) => (
              <div key={section.label} className="detail-content" style={{ marginBottom: "14px" }}>
                <p style={{
                  fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: 600,
                  letterSpacing: "0.12em", textTransform: "uppercase" as const,
                  color: "rgba(8,8,8,0.3)", margin: "0 0 5px 0",
                }}>{section.label}</p>
                <p style={{
                  fontFamily: "var(--font-sans)", fontSize: "12px",
                  color: "rgba(8,8,8,0.6)", lineHeight: 1.65, margin: 0,
                }}>{section.text}</p>
              </div>
            ))}
            {project.liveUrl && (
              <a className="detail-content" href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 500,
                  color: "#ED1C24", textDecoration: "none",
                  display: "inline-flex", alignItems: "center", gap: "4px",
                  borderBottom: "0.5px solid #ED1C24", paddingBottom: "2px",
                  width: "fit-content", marginBottom: "16px",
                }}
              >Visit →</a>
            )}
            <div className="detail-content" style={{
              borderTop: "0.5px solid rgba(8,8,8,0.08)", paddingTop: "16px", marginTop: "20px",
            }}>
              <span style={{
                fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: 600,
                letterSpacing: "0.12em", textTransform: "uppercase" as const,
                color: "rgba(8,8,8,0.3)", display: "block", marginBottom: "6px",
              }}>Next</span>
              <Link href={`/work/${nextProject.slug}`}
                style={{
                  fontFamily: "var(--font-display)", fontWeight: 700,
                  fontSize: "20px", color: "#080808",
                  textDecoration: "none", letterSpacing: "-0.02em",
                  display: "flex", alignItems: "center", gap: "6px",
                }}
              >
                {nextProject.name}
                <span style={{ color: "#ED1C24" }}>→</span>
              </Link>
            </div>
          </div>
        </div>
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
      </div>
    );
  }

  return (
    <div style={{ background: "#F5F5F0", height: "100vh", overflow: "hidden", paddingTop: `${NAVBAR_H}px` }}>
      <div ref={cloneRef} style={{ display: "none" }} />

      {/* 3-col layout — using absolute positioning for reliability */}
      <div style={{ position: "relative", height: PAGE_H, overflow: "hidden" }}>

        {/* ── STRIP — absolute center, explicit height ── */}
        <div
          style={{
            position: "absolute",
            top:      0,
            left:     `calc(50vw - ${STRIP_W / 2}px)`,
            width:    `${STRIP_W}px`,
            height:   PAGE_H,
            zIndex:   10,
          }}
        >
          {/* Top fade */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "30%",
            background: "linear-gradient(to bottom, #F5F5F0, transparent)",
            zIndex: 2, pointerEvents: "none",
          }} />
          {/* Bottom fade */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "30%",
            background: "linear-gradient(to top, #F5F5F0, transparent)",
            zIndex: 2, pointerEvents: "none",
          }} />

          {/* SCROLL CONTAINER — explicit vh height, guaranteed to scroll */}
          <div
            ref={stripRef}
            style={{
              position:       "absolute",
              top:            0,
              left:           0,
              right:          0,
              bottom:         0,
              overflowY:      "scroll",
              overflowX:      "hidden",
              scrollbarWidth: "none",
              WebkitOverflowScrolling: "touch",
              padding:        "0 10px",
            }}
          >
            {/* Top spacer — fixed px so first thumb can reach center */}
            <div style={{ minHeight: "calc(50vh - 100px)", flexShrink: 0 }} />

            {allImages.map((src, i) => (
              <div
                key={i}
                className="thumb"
                onClick={() => handleThumbClick(i)}
                style={{
                  marginBottom: "8px",
                  borderRadius: "4px",
                  overflow:     "hidden",
                  cursor:       "pointer",
                  opacity:      activeImg === i ? 1 : 0.35,
                  transition:   "opacity 0.25s ease",
                }}
              >
                {isVideoUrl(src) ? (
                  <video
                    src={src}
                    muted
                    playsInline
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                ) : (
                  <img
                    src={src}
                    alt={`${project.name} ${i + 1}`}
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                )}
              </div>
            ))}

            {/* Bottom spacer — fixed px so last thumb can reach center */}
            <div style={{ minHeight: "calc(50vh - 100px)" }} />
          </div>
        </div>

        {/* ── LEFT — image anchored bottom, left of strip ── */}
        <div
          style={{
            position: "absolute",
            top:      0,
            left:     0,
            width:    `calc(50vw - ${STRIP_W / 2}px)`,
            height:   "100%",
            display:  "flex",
            flexDirection: "column",
            padding:  "20px 0 20px 24px",
          }}
        >
          <Link href="/work" style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            fontFamily: "var(--font-sans)", fontSize: "11px",
            color: "rgba(8,8,8,0.4)", textDecoration: "none",
            marginBottom: "auto", width: "fit-content",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#080808")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(8,8,8,0.4)")}
          >
            ← Work
          </Link>

          <div style={{
            display: "flex", alignItems: "flex-end",
            flex: 1, paddingRight: "16px", position: "relative",
          }}>
            {isVideoUrl(allImages[activeImg]) ? (
              <video
                key={activeImg}
                src={allImages[activeImg]}
                autoPlay
                loop
                muted
                playsInline
                aria-label={`${project.name} ${activeImg + 1}`}
                style={{
                  maxWidth: "88%", maxHeight: "78vh",
                  width: "auto", height: "auto",
                  objectFit: "contain", display: "block",
                  animation: "detailFade 0.3s ease",
                }}
              />
            ) : (
              <img
                key={activeImg}
                src={allImages[activeImg]}
                alt={`${project.name} ${activeImg + 1}`}
                style={{
                  maxWidth: "88%", maxHeight: "78vh",
                  width: "auto", height: "auto",
                  objectFit: "contain", display: "block",
                  animation: "detailFade 0.3s ease",
                }}
              />
            )}
            <div style={{
              position: "absolute", bottom: 0, right: "20px",
              fontFamily: "var(--font-sans)", fontSize: "11px",
              color: "rgba(8,8,8,0.35)",
              background: "rgba(8,8,8,0.06)",
              padding: "3px 10px", borderRadius: "100px",
            }}>
              {activeImg + 1} / {allImages.length}
            </div>
          </div>
        </div>

        {/* ── RIGHT — project info, right of strip ── */}
        <div
          ref={rightRef}
          style={{
            position:  "absolute",
            top:       0,
            left:      `calc(50vw + ${STRIP_W / 2}px)`,
            right:     0,
            height:    "100%",
            overflowY: "auto",
            scrollbarWidth: "none",
            padding:   "24px 40px 24px 28px",
            display:   "flex",
            flexDirection: "column",
          }}
        >
          {/* Project name */}
          <h1 ref={titleRef} className="detail-content" style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: "clamp(28px, 4vw, 56px)", color: "#080808",
            letterSpacing: "-0.03em", lineHeight: 1.0, margin: "0 0 24px 0",
          }}>
            {project.name}
          </h1>

          {/* Year + Disciplines row */}
          <div className="detail-content" style={{ display: "flex", gap: "32px", marginBottom: "20px" }}>
            {[
              { label: "Year",        value: project.year },
              { label: "Disciplines", value: project.tags?.join(", ") ?? project.category },
            ].map((m) => (
              <div key={m.label} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                <span style={{
                  fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: 600,
                  letterSpacing: "0.12em", textTransform: "uppercase" as const,
                  color: "rgba(8,8,8,0.3)",
                }}>{m.label}</span>
                <span style={{
                  fontFamily: "var(--font-sans)", fontSize: "13px",
                  color: "#080808", fontWeight: 500,
                }}>{m.value}</span>
              </div>
            ))}
          </div>

          <div className="detail-content" style={{
            height: "0.5px", background: "rgba(8,8,8,0.08)", marginBottom: "18px",
          }} />

          <p className="detail-content" style={{
            fontFamily: "var(--font-sans)", fontSize: "13px",
            color: "rgba(8,8,8,0.5)", lineHeight: 1.7, margin: "0 0 20px 0",
          }}>
            {project.summary}
          </p>

          {[
            { label: "The Challenge", text: project.challenge },
            { label: "The Insight",   text: project.insight   },
            { label: "The Solution",  text: project.solution  },
          ].filter((s) => s.text).map((section) => (
            <div key={section.label} className="detail-content" style={{ marginBottom: "16px" }}>
              <p style={{
                fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: 600,
                letterSpacing: "0.12em", textTransform: "uppercase" as const,
                color: "rgba(8,8,8,0.3)", margin: "0 0 5px 0",
              }}>{section.label}</p>
              <p style={{
                fontFamily: "var(--font-sans)", fontSize: "12px",
                color: "rgba(8,8,8,0.6)", lineHeight: 1.65, margin: 0,
              }}>{section.text}</p>
            </div>
          ))}

          {project.liveUrl && (
            <a className="detail-content" href={project.liveUrl}
              target="_blank" rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 500,
                color: "#ED1C24", textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: "4px",
                borderBottom: "0.5px solid #ED1C24", paddingBottom: "2px",
                width: "fit-content", marginBottom: "16px",
              }}
            >Visit →</a>
          )}

          <div style={{ flex: 1 }} />

          <div className="detail-content" style={{
            borderTop: "0.5px solid rgba(8,8,8,0.08)", paddingTop: "16px",
          }}>
            <span style={{
              fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: 600,
              letterSpacing: "0.12em", textTransform: "uppercase" as const,
              color: "rgba(8,8,8,0.3)", display: "block", marginBottom: "6px",
            }}>Next</span>
            <Link href={`/work/${nextProject.slug}`}
              style={{
                fontFamily: "var(--font-display)", fontWeight: 700,
                fontSize: "clamp(16px, 2vw, 26px)", color: "#080808",
                textDecoration: "none", letterSpacing: "-0.02em",
                display: "flex", alignItems: "center", gap: "6px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ED1C24")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#080808")}
            >
              {nextProject.name}
              <span style={{ color: "#ED1C24" }}>→</span>
            </Link>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes detailFade {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
