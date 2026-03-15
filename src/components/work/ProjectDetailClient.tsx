"use client";
import { useEffect, useRef, useState } from "react";
import { gsap }  from "gsap";
import Link      from "next/link";
import { type Project } from "@/data/projects";

const PEOPLE_AVATARS = [
  "/people/person1.webp",
  "/people/person2.webp",
  "/people/person3.webp",
  "/people/person4.webp",
];

interface Props { project: Project; nextProject: Project; }

export function ProjectDetailClient({ project, nextProject }: Props) {
  const titleRef  = useRef<HTMLHeadingElement>(null);
  const cloneRef  = useRef<HTMLDivElement>(null);
  const stripRef  = useRef<HTMLDivElement>(null);
  const [activeImg, setActiveImg] = useState(0);

  const allImages = [
    project.stripMedia.src,
    ...(project.caseImages ?? []),
  ];

  // GSAP name transition on mount
  useEffect(() => {
    const stored = sessionStorage.getItem("projectNameTransition");
    sessionStorage.removeItem("projectNameTransition");

    if (!stored || !titleRef.current || !cloneRef.current) {
      gsap.from(titleRef.current, {
        y: 20, opacity: 0, duration: 0.6, ease: "power2.out", delay: 0.2,
      });
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
      duration: 0.7, ease: "power3.inOut",
      onComplete: () => {
        gsap.to(titleRef.current, { opacity: 1, duration: 0.15 });
        gsap.to(clone, {
          opacity: 0, duration: 0.15,
          onComplete: () => { clone.style.display = "none"; },
        });
      },
    });
  }, [project.name]);

  // Content entrance animation
  useEffect(() => {
    gsap.from(".detail-content", {
      y: 16, opacity: 0, duration: 0.5,
      stagger: 0.07, ease: "power2.out", delay: 0.2,
    });
  }, []);

  // Scroll active thumb into view
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const thumbs = strip.querySelectorAll<HTMLDivElement>(".thumb");
    thumbs[activeImg]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activeImg]);

  // Strip scroll → active image (identical pattern to work page)
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;

    const onScroll = () => {
      const thumbs     = strip.querySelectorAll<HTMLElement>(".thumb");
      const stripRect  = strip.getBoundingClientRect();
      const stripMid   = stripRect.top + stripRect.height / 2;

      let closest     = 0;
      let closestDist = Infinity;

      thumbs.forEach((thumb, i) => {
        const rect     = thumb.getBoundingClientRect();
        const thumbMid = rect.top + rect.height / 2;
        const dist     = Math.abs(thumbMid - stripMid);
        if (dist < closestDist) {
          closestDist = dist;
          closest     = i;
        }
      });

      setActiveImg(closest);
    };

    strip.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // set correct active on mount
    return () => strip.removeEventListener("scroll", onScroll);
  }, [allImages.length]);

  return (
    <div
      style={{
        background:    "#F5F5F0",
        height:        "100vh",
        overflow:      "hidden",
        display:       "flex",
        flexDirection: "column",
        paddingTop:    "72px",
      }}
    >
      {/* Clone for name transition */}
      <div ref={cloneRef} style={{ display: "none" }} />

      {/* Main layout */}
      <div
        style={{
          display:  "flex",
          flex:     1,
          overflow: "hidden",
          padding:  "0 0 0 0",
        }}
      >

        {/* ── LEFT — active image (sized so strip lands at horizontal center) ── */}
        <div
          style={{
            flex:       "0 0 calc(50vw - 94px)",
            position:   "relative",
            overflow:   "hidden",
            background: "#111",
          }}
        >
          <img
            key={activeImg}
            src={allImages[activeImg]}
            alt={`${project.name} ${activeImg + 1}`}
            style={{
              width:     "100%",
              height:    "100%",
              objectFit: "cover",
              display:   "block",
              animation: "detailFade 0.3s ease",
            }}
          />
          <style>{`
            @keyframes detailFade {
              from { opacity: 0; }
              to   { opacity: 1; }
            }
          `}</style>
          {/* Counter */}
          <div style={{
            position:     "absolute", bottom: "16px", right: "16px",
            fontFamily:   "var(--font-sans)", fontSize: "11px",
            color:        "rgba(255,255,255,0.55)",
            background:   "rgba(0,0,0,0.3)", padding: "3px 10px",
            borderRadius: "100px", backdropFilter: "blur(4px)",
          }}>
            {activeImg + 1} / {allImages.length}
          </div>
        </div>

        {/* ── CENTER — thumbnail strip ── */}
        <div
          ref={stripRef}
          style={{
            width:          "140px",
            flexShrink:     0,
            display:        "flex",
            flexDirection:  "column",
            gap:            "4px",
            overflowY:      "auto",
            scrollbarWidth: "none",
            padding:        "16px 24px",
          }}
        >
          {allImages.map((src, i) => (
            <div
              key={i}
              className="thumb"
              onClick={() => setActiveImg(i)}
              style={{
                flexShrink:    0,
                borderRadius:  "4px",
                overflow:      "hidden",
                cursor:        "pointer",
                width:         activeImg === i ? "100%" : "75%",
                alignSelf:     "center",
                opacity:       activeImg === i ? 1 : 0.38,
                outline:       activeImg === i
                  ? "2px solid #ED1C24"
                  : "2px solid transparent",
                outlineOffset: "2px",
                transition:    "width 0.3s ease, opacity 0.3s ease, outline 0.2s ease",
              }}
            >
              <img
                src={src}
                alt={`${project.name} ${i + 1}`}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
          ))}
        </div>

        {/* ── RIGHT — project details ── */}
        <div
          style={{
            flex:          "1",
            display:       "flex",
            flexDirection: "column",
            overflowY:     "auto",
            scrollbarWidth:"none",
            padding:       "24px 40px",
            minWidth:      0,
          }}
        >
          {/* Back */}
          <Link href="/work" className="detail-content" style={{
            fontFamily: "var(--font-sans)", fontSize: "11px",
            color: "rgba(8,8,8,0.4)", textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: "4px",
            marginBottom: "28px", width: "fit-content",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#080808")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(8,8,8,0.4)")}
          >
            ← Work
          </Link>

          {/* Project name — top, right aligned */}
          <h1
            ref={titleRef}
            className="detail-content"
            style={{
              fontFamily:    "var(--font-display)",
              fontWeight:    700,
              fontSize:      "clamp(28px, 4vw, 60px)",
              color:         "#080808",
              letterSpacing: "-0.03em",
              lineHeight:    1.0,
              margin:        "0 0 4px 0",
              textAlign:     "right",
            }}
          >
            {project.name}
          </h1>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "28px" }}>
            <span style={{
              fontFamily: "var(--font-sans)", fontSize: "10px",
              color:      "rgba(8,8,8,0.3)",
            }}>{project.year}</span>
          </div>

          {/* Meta — Year + Category only */}
          <div className="detail-content" style={{
            display: "flex", flexDirection: "column",
            gap: "16px", marginBottom: "24px",
          }}>
            {[
              { label: "Year",     value: project.year },
              { label: "Category", value: project.category },
            ].map((m) => (
              <div key={m.label} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                <span style={{
                  fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: 500,
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

          {/* Divider */}
          <div className="detail-content" style={{
            height: "0.5px", background: "rgba(8,8,8,0.08)", marginBottom: "18px",
          }} />

          {/* Summary */}
          <p className="detail-content" style={{
            fontFamily: "var(--font-sans)", fontSize: "13px",
            color: "rgba(8,8,8,0.5)", lineHeight: 1.7,
            margin: "0 0 24px 0", maxWidth: "320px",
          }}>
            {project.summary}
          </p>

          {/* Rating */}
          <div className="detail-content" style={{
            padding: "14px", background: "rgba(8,8,8,0.03)",
            borderRadius: "10px", border: "0.5px solid rgba(8,8,8,0.07)",
            marginBottom: "20px", display: "flex",
            flexDirection: "column", gap: "10px",
            maxWidth: "280px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
              {[1,2,3,4,5].map((s) => (
                <svg key={s} width="12" height="12" viewBox="0 0 14 14"
                  fill="#ED1C24" stroke="#ED1C24" strokeWidth="0.5">
                  <polygon points="7,1 8.8,5.2 13.4,5.5 10,8.5 11.1,13 7,10.5 2.9,13 4,8.5 0.6,5.5 5.2,5.2" />
                </svg>
              ))}
              <span style={{
                fontFamily: "var(--font-sans)", fontSize: "11px",
                color: "rgba(8,8,8,0.4)", marginLeft: "5px",
              }}>5.0</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ display: "flex" }}>
                {PEOPLE_AVATARS.map((src, i) => (
                  <div key={i} style={{
                    width: "22px", height: "22px", borderRadius: "50%",
                    overflow: "hidden", border: "2px solid #F5F5F0",
                    marginLeft: i === 0 ? "0" : "-6px",
                    background: "#ddd", flexShrink: 0,
                  }}>
                    <img src={src} alt="client"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                ))}
              </div>
              <span style={{
                fontFamily: "var(--font-sans)", fontSize: "11px",
                color: "rgba(8,8,8,0.45)", lineHeight: 1.3,
              }}>
                Trusted by 40+<br />brands across Ghana
              </span>
            </div>
          </div>

          {/* Visit */}
          {project.liveUrl && (
            <a className="detail-content" href={project.liveUrl}
              target="_blank" rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 500,
                color: "#ED1C24", textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: "4px",
                borderBottom: "0.5px solid #ED1C24", paddingBottom: "2px",
                width: "fit-content", marginBottom: "20px",
              }}
            >
              Visit →
            </a>
          )}

          {/* Spacer pushes next to bottom */}
          <div style={{ flex: 1 }} />

          {/* Next project */}
          <div className="detail-content" style={{
            borderTop: "0.5px solid rgba(8,8,8,0.08)",
            paddingTop: "14px", marginBottom: "16px",
          }}>
            <span style={{
              fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: 500,
              letterSpacing: "0.12em", textTransform: "uppercase" as const,
              color: "rgba(8,8,8,0.3)", display: "block", marginBottom: "6px",
            }}>Next</span>
            <Link href={`/work/${nextProject.slug}`}
              style={{
                fontFamily: "var(--font-display)", fontWeight: 700,
                fontSize: "clamp(14px, 1.8vw, 22px)", color: "#080808",
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
    </div>
  );
}
