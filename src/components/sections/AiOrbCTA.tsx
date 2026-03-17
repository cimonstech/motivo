"use client";

import dynamic from "next/dynamic";
import { useRef, useEffect, useState } from "react";
import { gsap }           from "gsap";
import { ScrollTrigger }  from "gsap/ScrollTrigger";
import { useGSAP }        from "@gsap/react";
import { useRouter }      from "next/navigation";

const OrbCanvas = dynamic(
  () => import("@/components/three/OrbCanvas"),
  { ssr: false }
);

gsap.registerPlugin(ScrollTrigger);

function LiveClock() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();

      const h = now.getHours().toString().padStart(2, "0");
      const m = now.getMinutes().toString().padStart(2, "0");
      const s = now.getSeconds().toString().padStart(2, "0");
      setTime(`${h}:${m}:${s}`);

      setDate(now.toLocaleDateString("en-GB", {
        weekday: "short",
        day:     "numeric",
        month:   "short",
        year:    "numeric",
      }));
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display:       "flex",
        flexDirection:  "column",
        alignItems:     "center",
        marginTop:      "20px",
        gap:            "4px",
      }}
    >
      <span
        style={{
          fontFamily:        "var(--font-display)",
          fontWeight:        700,
          fontSize:          "clamp(22px, 2.4vw, 36px)",
          color:             "rgba(245,245,240,0.9)",
          letterSpacing:     "0.05em",
          lineHeight:        1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {time}
      </span>

      <span
        style={{
          fontFamily:    "var(--font-sans)",
          fontSize:      "11px",
          color:         "rgba(245,245,240,0.3)",
          letterSpacing: "0.06em",
          textTransform: "uppercase" as const,
        }}
      >
        {date}
      </span>
    </div>
  );
}

export function AiOrbCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const router     = useRouter();

  useGSAP(() => {
    gsap.from(".cta-content", {
      y:        30,
      opacity:  0,
      duration: 1,
      stagger:  0.15,
      ease:     "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start:   "top 75%",
      },
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      style={{
        position:   "relative",
        background: "#080808",
        padding:    "80px 0",
        overflow:   "hidden",
      }}
    >
      {/* Ghost text - START NOW */}
      <div
        aria-hidden="true"
        style={{
          position:       "absolute",
          inset:          0,
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          justifyContent: "center",
          pointerEvents:  "none",
          zIndex:         0,
          gap:            "8px",
        }}
      >
        <span
          style={{
            fontFamily:    "var(--font-display)",
            fontWeight:    700,
            fontSize:      "clamp(48px, 9vw, 130px)",
            color:         "rgba(245,245,240,0.11)",
            letterSpacing: "-0.02em",
            whiteSpace:    "nowrap" as const,
            userSelect:    "none",
            lineHeight:    1,
          }}
        >
          START
        </span>
        <span
          style={{
            fontFamily:    "var(--font-sans)",
            fontSize:      "clamp(10px, 1.2vw, 16px)",
            color:         "rgba(245,245,240,0.14)",
            letterSpacing: "0.2em",
            textTransform: "uppercase" as const,
            userSelect:    "none",
          }}
        >
          Time is moving fast
        </span>
      </div>

      {/* Content row - max-width container */}
      <div
        style={{
          position:       "relative",
          zIndex:         10,
          display:        "flex",
          flexDirection:  "row",
          alignItems:     "center",
          justifyContent: "space-between",
          gap:            "60px",
          maxWidth:       "1440px",
          margin:         "0 auto",
          padding:        "0 48px",
        }}
      >
        {/* Left - text */}
        <div
          className="cta-content"
          style={{
            display:    "flex",
            flexDirection: "column",
            gap:        "20px",
            maxWidth:   "480px",
            flex:       "1",
          }}
        >
          <span
            style={{
              fontFamily:    "var(--font-sans)",
              fontSize:      "10px",
              fontWeight:    500,
              letterSpacing: "0.14em",
              textTransform: "uppercase" as const,
              color:         "rgba(245,245,240,0.3)",
            }}
          >
            Work with us
          </span>

          <h2
            style={{
              fontFamily:    "var(--font-display)",
              fontWeight:    700,
              fontSize:      "clamp(32px, 4.5vw, 60px)",
              color:         "#F5F5F0",
              letterSpacing: "-0.02em",
              lineHeight:    1.0,
              margin:        0,
            }}
          >
            Tell us what<br />
            you&apos;re{" "}
            <span style={{ color: "#ED1C24", fontStyle: "italic" }}>building.</span>
          </h2>

          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize:   "14px",
              color:      "rgba(245,245,240,0.4)",
              lineHeight: 1.6,
              maxWidth:   "380px",
              margin:     0,
            }}
          >
            Describe your project - our AI will listen, ask one smart
            question, and point you to exactly the right service. No
            forms. No back-and-forth. Just a conversation.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <button
              onClick={() => router.push("/contact")}
              style={{
                fontFamily:   "var(--font-sans)",
                fontSize:     "13px",
                fontWeight:   500,
                color:        "#ffffff",
                background:   "#ED1C24",
                border:       "none",
                borderRadius: "100px",
                padding:      "10px 24px",
                cursor:       "pointer",
                display:      "inline-flex",
                alignItems:   "center",
                gap:          "6px",
                width:        "fit-content",
                transition:   "background 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#B5151B")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#ED1C24")}
            >
              Start a project →
            </button>
            <a
              href="https://wa.me/233549467175"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily:     "var(--font-sans)",
                fontSize:       "12px",
                color:          "rgba(245,245,240,0.4)",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#F5F5F0")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245,245,240,0.4)")}
            >
              Or WhatsApp us directly
            </a>
          </div>

          {/* Quote */}
          <blockquote
            style={{
              borderLeft: "2px solid rgba(237,28,36,0.35)",
              paddingLeft: "16px",
              margin:     "8px 0 0",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize:   "12px",
                color:      "rgba(245,245,240,0.3)",
                lineHeight: 1.6,
                fontStyle:  "italic",
                margin:     0,
              }}
            >
              &ldquo;I didn&apos;t get into design to be an artist. Being a designer
              goes a step further - not only trying to evoke emotion but
              trying to make a reaction.&rdquo;
            </p>
            <cite
              style={{
                fontFamily: "var(--font-sans)",
                fontSize:   "10px",
                color:      "rgba(245,245,240,0.2)",
                fontStyle:  "normal",
                display:    "block",
                marginTop:  "8px",
              }}
            >
              - Gideon Kutsinyah, Founder
            </cite>
          </blockquote>
        </div>

        {/* Right - orb + clock */}
        <div
          className="cta-content"
          style={{
            display:       "flex",
            flexDirection: "column",
            alignItems:    "center",
            flexShrink:   0,
          }}
        >
          {/* Orb */}
          <div
            onClick={() => router.push("/contact")}
            style={{ width: "320px", height: "320px", cursor: "pointer" }}
          >
            <OrbCanvas width={320} height={320} />
          </div>

          {/* Live clock - sits directly below orb */}
          <LiveClock />
        </div>
      </div>
    </section>
  );
}
