"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMediaQuery } from "@/hooks/useMediaQuery";

gsap.registerPlugin(ScrollTrigger);

const REASONS = [
  {
    title: "We think beyond design",
    body:  "Every decision is tied to perception, positioning, and business impact",
  },
  {
    title: "We build, not just design",
    body:  "What we create doesn’t stay on screen, it exists in the real world.",
  },
  {
    title: "We make brands look premium",
    body:  "Because perception shapes value, and value drives revenue.",
  },
  {
    title: "We move fast, but with precision",
    body:  "No unnecessary delays. No guesswork.",
  },
];

export function WhyMotivo() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".why-item");
      const dots = gsap.utils.toArray<HTMLElement>(".why-dot");

      gsap.set(items, { opacity: 0.25, y: 18 });
      gsap.set(dots, { scale: 0.85, opacity: 0.35 });
      gsap.set(progressRef.current, { scaleY: 0, transformOrigin: "50% 0%" });

      if (isMobile) {
        // Mobile: simpler reveal, no pin
        items.forEach((el, idx) => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
            },
            delay: idx * 0.02,
          });
        });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=120%",
          scrub: 0.8,
          pin: stickyRef.current,
          pinSpacing: true,
          anticipatePin: 1,
        },
      });

      // Progress rail fills as you scroll
      tl.to(progressRef.current, { scaleY: 1, ease: "none", duration: 1 }, 0);

      // Each reason becomes the active one sequentially
      items.forEach((el, i) => {
        const dot = dots[i];
        const at = i / Math.max(1, items.length - 1);
        tl.to(el, { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }, at)
          .to(dot, { scale: 1, opacity: 1, duration: 0.2, ease: "power2.out" }, at)
          // Dim the previous item when the next activates
          .to(
            i > 0 ? items[i - 1] : [],
            { opacity: 0.35, y: 0, duration: 0.2, ease: "power2.out" },
            at
          )
          .to(
            i > 0 ? dots[i - 1] : [],
            { scale: 0.9, opacity: 0.45, duration: 0.2, ease: "power2.out" },
            at
          );
      });
    }, sectionRef);

    return () => {
      try { ctx.revert(); } catch { /* noop */ }
    };
  }, [isMobile]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="why-motivo-heading"
      style={{
        background: "#080808",
        color: "#F5F5F0",
        padding: isMobile ? "64px 0" : "96px 0",
      }}
    >
      <div
        ref={stickyRef}
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          padding: isMobile ? "0 20px" : "0 48px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(360px, 1fr) minmax(520px, 1.25fr)",
          gap: isMobile ? "28px" : "64px",
          alignItems: "start",
        }}
      >
        {/* Left: headline block */}
        <div>
          <div
            style={{
              width: "72px",
              height: "3px",
              background: "#ED1C24",
              marginBottom: "22px",
              opacity: 0.95,
            }}
          />

          <h2
            id="why-motivo-heading"
            className="font-display font-bold tracking-tight"
            style={{
              fontSize: "clamp(30px, 3.9vw, 56px)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              margin: 0,
              maxWidth: "18ch",
            }}
          >
            Why serious brands choose Motivo
          </h2>
          <p
            style={{
              marginTop: "16px",
              fontFamily: "var(--font-sans)",
              fontSize: "15px",
              lineHeight: 1.7,
              color: "rgba(245,245,240,0.68)",
              maxWidth: "46ch",
            }}
          >
            Four reasons teams come to us when the work has to feel premium and land with impact.
          </p>
        </div>

        {/* Right: pinned rail + reasons */}
        <div
          ref={railRef}
          style={{
            position: "relative",
            border: "0.5px solid rgba(245,245,240,0.10)",
            background: "rgba(245,245,240,0.03)",
            borderRadius: "18px",
            padding: isMobile ? "22px" : "28px",
            overflow: "hidden",
          }}
        >
          {/* Subtle glow */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: "-40%",
              background:
                "radial-gradient(closest-side, rgba(237,28,36,0.12), rgba(237,28,36,0) 60%)",
              filter: "blur(22px)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", display: "grid", gridTemplateColumns: "22px 1fr", gap: "16px" }}>
            {/* Rail */}
            <div style={{ position: "relative", width: "22px", display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  position: "absolute",
                  top: 6,
                  bottom: 6,
                  width: "2px",
                  background: "rgba(245,245,240,0.12)",
                  borderRadius: "10px",
                }}
              />
              <div
                ref={progressRef}
                style={{
                  position: "absolute",
                  top: 6,
                  bottom: 6,
                  width: "2px",
                  background: "#ED1C24",
                  borderRadius: "10px",
                }}
              />

              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "6px 0" }}>
                {REASONS.map((_, i) => (
                  <div
                    key={i}
                    className="why-dot"
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "999px",
                      background: "#F5F5F0",
                      boxShadow: "0 0 0 1px rgba(245,245,240,0.18)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Reasons */}
            <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "16px" : "18px" }}>
              {REASONS.map((r) => (
                <div key={r.title} className="why-item">
                  <p
                    className="font-sans"
                    style={{
                      margin: 0,
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "rgba(245,245,240,0.45)",
                    }}
                  >
                    {r.title}
                  </p>
                  <p
                    style={{
                      margin: "8px 0 0 0",
                      fontFamily: "var(--font-sans)",
                      fontSize: "15px",
                      lineHeight: 1.65,
                      color: "rgba(245,245,240,0.84)",
                      maxWidth: "60ch",
                    }}
                  >
                    {r.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
