"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMediaQuery } from "@/hooks/useMediaQuery";

gsap.registerPlugin(ScrollTrigger);

export function PositioningStatement() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLDivElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = headlineRef.current?.querySelectorAll(".statement-word") ?? [];
      const lines = subtextRef.current?.querySelectorAll(".statement-line") ?? [];

      gsap.set(words, { y: 24, opacity: 0, rotateX: -20, transformOrigin: "0% 100%" });
      gsap.set(lines, { y: 18, opacity: 0 });
      gsap.set(accentRef.current, { scaleX: 0, transformOrigin: "0% 50%" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: isMobile ? "top 85%" : "top 78%",
          end: "bottom 55%",
          scrub: 0.7,
        },
      });

      tl.to(accentRef.current, { scaleX: 1, duration: 0.5, ease: "power2.out" }, 0)
        .to(words, {
          y: 0,
          opacity: 1,
          rotateX: 0,
          stagger: 0.06,
          duration: 0.85,
          ease: "power3.out",
        }, 0.08)
        .to(lines, {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.7,
          ease: "power2.out",
        }, 0.26);
    }, sectionRef);

    return () => {
      try { ctx.revert(); } catch { /* noop */ }
    };
  }, [isMobile]);

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#F5F5F0",
        color: "#080808",
        padding: isMobile ? "56px 0 52px" : "92px 0 84px",
        borderTop: "0.5px solid rgba(8,8,8,0.08)",
        borderBottom: "0.5px solid rgba(8,8,8,0.08)",
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          padding: isMobile ? "0 20px" : "0 48px",
        }}
      >
        <div
          ref={accentRef}
          style={{
            width: isMobile ? "56px" : "72px",
            height: "3px",
            background: "#ED1C24",
            marginBottom: isMobile ? "18px" : "24px",
          }}
        />

        <h2
          ref={headlineRef}
          className="font-display font-bold tracking-tight"
          style={{
            fontSize: "clamp(30px, 4.2vw, 62px)",
            lineHeight: 1.06,
            letterSpacing: "-0.02em",
            maxWidth: "940px",
            marginBottom: isMobile ? "18px" : "20px",
          }}
        >
          {"If your brand looks average, it will be treated that way.".split(" ").map((word, idx) => (
            <span key={`${word}-${idx}`} className="statement-word" style={{ display: "inline-block", marginRight: "0.24em" }}>
              {word}
            </span>
          ))}
        </h2>

        <div
          ref={subtextRef}
          style={{
            maxWidth: "690px",
            fontFamily: "var(--font-sans)",
            fontSize: isMobile ? "15px" : "17px",
            lineHeight: 1.72,
            color: "rgba(8,8,8,0.62)",
          }}
        >
          <p className="statement-line">In today&apos;s market, perception is everything.</p>
          <p className="statement-line">People decide what you&apos;re worth before you say a word.</p>
          <p className="statement-line">We make sure your brand communicates the right message, instantly.</p>
        </div>
      </div>
    </section>
  );
}
