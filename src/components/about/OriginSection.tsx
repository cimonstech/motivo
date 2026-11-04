"use client";
import { useEffect, useRef } from "react";
import { gsap }              from "gsap";
import { ScrollTrigger }     from "gsap/ScrollTrigger";
import { IllustratorUI }     from "@/components/ui/IllustratorUI";
import { useMediaQuery }     from "@/hooks/useMediaQuery";

gsap.registerPlugin(ScrollTrigger);

const ORIGIN_PARAGRAPHS = [
  "I've been a designer for over ten years. Along the way I moved into art direction, and I ended up working closely with brands, printers and fabricators on all kinds of projects. After a while I kept noticing the same thing happen. The idea would be good. The design would be solid. And then somewhere between the drawing and the finished piece, it would fall apart a little.",
  "Sometimes it looked amazing on screen and then came out of production looking flat. Other times the production was fine, but it just didn't live up to the idea we started with. I saw this over and over, and honestly, it frustrated me.",
  "We have brilliant designers in Ghana. We have craftsmen who are seriously skilled. Talent was never the problem. The problem was that the people coming up with the ideas and the people building them weren't really talking to each other.",
  "Personally, I've always loved both parts. I love the thinking behind a design. But I'm just as curious about how it actually gets made: what material you use, how it's put together, the small details, the whole journey from a sketch to something you can touch.",
  "So that's where MOTIVO came from. I wanted a place where design and fabrication sit under one roof. We design things knowing how they'll be made, and we make things in a way that stays true to the original idea.",
  "The name comes from \"motive.\" I believe everything we make should have a reason to exist.",
  "At the end of the day, I want good ideas to do more than look nice on paper. I want them built, and built right.",
];

export function OriginSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const parasRef    = useRef<HTMLDivElement>(null);
  const isMobile   = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    // On mobile: no animations, all text shows immediately
    if (isMobile) return;

    const ctx = gsap.context(() => {
      // Headline word-by-word reveal
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll(".word");
        gsap.from(words, {
          y:        40,
          opacity:  0,
          duration: 0.8,
          stagger:  0.04,
          ease:     "power3.out",
          delay:    0.3,
        });
      }

      // Paragraphs fade in on scroll
      const paras = parasRef.current?.querySelectorAll(".para") ?? [];
      paras.forEach((para) => {
        gsap.from(para, {
          y:       24,
          opacity: 0,
          duration: 0.7,
          ease:    "power2.out",
          scrollTrigger: {
            trigger: para,
            start:   "top 85%",
          },
        });
      });
    }, sectionRef);

    return () => { try { ctx.revert(); } catch { /* noop */ } };
  }, [isMobile]);

  // Split headline into word spans
  const headline = "The Origin of MOTIVO";
  const words    = headline.split(" ");

  return (
    <section
      ref={sectionRef}
      style={{
        position:   "relative",
        background: "#080808",
        minHeight:  "100vh",
        padding:    "120px 0 100px",
      }}
    >
      <div className="container" style={{ position: "relative", zIndex: 1, paddingLeft: isMobile ? "20px" : undefined, paddingRight: isMobile ? "20px" : undefined }}>
      {/* Red top rule */}
      <div style={{ width: "48px", height: "2px", background: "#ED1C24", marginBottom: isMobile ? "32px" : "48px" }} />

      {/* Headline */}
      <h1
        ref={headlineRef}
        style={{
          fontFamily:    "var(--font-display)",
          fontWeight:    700,
          fontSize:      "clamp(36px, 5.5vw, 80px)",
          color:         "#F5F5F0",
          letterSpacing: "-0.03em",
          lineHeight:    1.0,
          margin:        "0 0 64px 0",
          maxWidth:      "900px",
          overflow:      "hidden",
        }}
      >
        {words.map((word, i) => (
          <span
            key={i}
            className="word"
            style={{
              display: "inline-block",
              marginRight: "0.25em",
              ...(isMobile && { opacity: 1, transform: "none" }),
            }}
          >
            {word}
          </span>
        ))}
      </h1>

      {/* Two columns: Origin text | Illustrator UI (stack on mobile) */}
      <div style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: isMobile ? "40px" : "48px",
      }}>
      {/* Left column — paragraphs */}
      <div style={{ flex: "1 1 auto", maxWidth: "640px" }}>
      {/* Body paragraphs */}
      <div
        ref={parasRef}
        style={{
          display:       "flex",
          flexDirection: "column",
          gap:           "28px",
        }}
      >
        {ORIGIN_PARAGRAPHS.map((para, i) => (
          <p
            key={i}
            className="para"
            style={{
              ...(isMobile && { opacity: 1, transform: "none" }),
              fontFamily: "var(--font-sans)",
              fontSize:   "clamp(15px, 1.4vw, 18px)",
              color:      i === 0
                ? "rgba(245,245,240,0.9)"   // first para brighter
                : "rgba(245,245,240,0.5)",
              lineHeight: 1.75,
              margin:     0,
              fontWeight: i === ORIGIN_PARAGRAPHS.length - 1 ? 500 : 400,
            }}
          >
            {/* Last para gets red accent */}
            {i === ORIGIN_PARAGRAPHS.length - 1 ? (
              <>
                At the end of the day, I want good ideas to do more than look nice on paper.{" "}
                <span style={{ color: "#ED1C24" }}>I want them built, and built right.</span>
              </>
            ) : para}
          </p>
        ))}

        {/* Founder attribution */}
        <p
          style={{
            fontFamily:    "var(--font-sans)",
            fontSize:      "12px",
            color:         "rgba(245,245,240,0.25)",
            letterSpacing: "0.06em",
            marginTop:     "16px",
          }}
        >
          - Gideon Kutsinyah, Founder
        </p>
      </div>
      </div>

      {/* Right column — Illustrator UI (sticky until Origin ends, full width on mobile) */}
      <div style={{
        flexShrink: 0,
        width:      isMobile ? "100%" : "clamp(280px, 36%, 420px)",
        position:   "sticky",
        top:        "96px",
        alignSelf:  "flex-start",
        minHeight:  isMobile ? "320px" : "400px",
      }}>
        <IllustratorUI fillContainer />
      </div>
      </div>
      </div>

      {/* Fixed-style "About" ghosted bottom-left */}
      <div
        style={{
          position:      "absolute",
          bottom:        "32px",
          left:          "48px",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontFamily:    "var(--font-display)",
            fontWeight:    700,
            fontSize:      "clamp(40px, 6vw, 88px)",
            color:         "rgba(245,245,240,0.05)",
            letterSpacing: "-0.03em",
            lineHeight:    1,
            userSelect:    "none",
          }}
        >
          About
        </span>
      </div>
    </section>
  );
}
