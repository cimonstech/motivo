"use client";
import { useEffect, useRef } from "react";
import { gsap }              from "gsap";
import { ScrollTrigger }     from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { id: "brands",     target: 40,   suffix: "+", label: "Brands built"      },
  { id: "years",      target: 7,    suffix: "",  label: "Years in Accra"    },
  { id: "templates",  target: 0,    suffix: "",  label: "Templates used"    },
  { id: "industries", target: 3,    suffix: "",  label: "Industries shaped" },
];

export function NumbersSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const triggered  = useRef(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start:   "top 70%",
        onEnter: () => {
          if (triggered.current) return;
          triggered.current = true;

          STATS.forEach(({ id, target, suffix }) => {
            const el = document.getElementById(`stat-${id}`);
            if (!el) return;
            if (target === 0) {
              el.textContent = "0" + suffix;
              return;
            }
            const obj = { val: 0 };
            gsap.to(obj, {
              val:      target,
              duration: id === "brands" ? 2.0 : 1.4,
              ease:     "power2.out",
              onUpdate: () => {
                el.textContent = Math.round(obj.val) + suffix;
              },
              onComplete: () => {
                el.textContent = target + suffix;
              },
            });
          });

          // Stagger stat cards in
          gsap.from(".stat-card", {
            y:        30,
            opacity:  0,
            duration: 0.7,
            stagger:  0.1,
            ease:     "power2.out",
          });
        },
      });
    }, sectionRef);

    return () => { try { ctx.revert(); } catch { /* noop */ } };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#F5F5F0",
        padding:    "100px 0",
        borderTop:  "0.5px solid rgba(8,8,8,0.08)",
      }}
    >
      <div className="container">
      {/* Header */}
      <div style={{ marginBottom: "64px" }}>
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
          By the numbers
        </span>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display:             "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap:                 "0",
          maxWidth:            "1000px",
        }}
      >
        {STATS.map((stat, i) => (
          <div
            key={stat.id}
            className="stat-card"
            style={{
              borderLeft:   i === 0 ? "none" : "0.5px solid rgba(8,8,8,0.1)",
              paddingLeft:  i === 0 ? "0"    : "40px",
              paddingRight: "40px",
            }}
          >
            {/* Number */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
              <span
                id={`stat-${stat.id}`}
                style={{
                  fontFamily:    "var(--font-display)",
                  fontWeight:    700,
                  fontSize:      "clamp(48px, 5vw, 80px)",
                  color:         stat.id === "templates" ? "rgba(8,8,8,0.15)" : "#080808",
                  letterSpacing: "-0.03em",
                  lineHeight:    1,
                }}
              >
                {`0${stat.suffix}`}
              </span>
            </div>
            {/* Label */}
            <p
              style={{
                fontFamily:  "var(--font-sans)",
                fontSize:    "12px",
                color:       "rgba(8,8,8,0.4)",
                margin:      "10px 0 0",
                lineHeight:  1.4,
              }}
            >
              {stat.label}
            </p>
            {/* Provocation under "0 Templates" */}
            {stat.id === "templates" && (
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize:   "10px",
                  color:      "#ED1C24",
                  margin:     "6px 0 0",
                  fontStyle:  "italic",
                }}
              >
                Every project is original.
              </p>
            )}
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
