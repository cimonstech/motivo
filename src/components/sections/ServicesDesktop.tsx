"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter }     from "next/navigation";
import { gsap }          from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { safeNavigate }  from "@/lib/safeNavigate";
import { type Service }  from "@/data/services";

gsap.registerPlugin(ScrollTrigger);

interface Props { data: Service[] }

export function ServicesDesktop({ data }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const router    = useRouter();

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const init = () => {
      const totalWidth = track.scrollWidth - window.innerWidth;
      if (totalWidth <= 0) return;

      const vw = window.innerWidth;

      // Trailing div (50vw wide) stops with its left edge at ~52% of vw
      const scrollDistance = totalWidth + vw * 0.02;

      const ctx = gsap.context(() => {
        gsap.to(track, {
          x:    -scrollDistance,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start:   "top top",
            end:     () => `+=${scrollDistance}`,
            scrub:   1,
            pin:     true,
            pinSpacing: true,
            anticipatePin: 1,
            onUpdate: () => {
              const cards = track.querySelectorAll<HTMLElement>(".service-card");
              const viewportCenter = window.innerWidth / 2;
              let closestIdx  = 0;
              let closestDist = Infinity;
              cards.forEach((card, i) => {
                const rect       = card.getBoundingClientRect();
                const cardCenter = rect.left + rect.width / 2;
                const dist       = Math.abs(cardCenter - viewportCenter);
                if (dist < closestDist) {
                  closestDist = dist;
                  closestIdx  = i;
                }
              });
              setActiveIdx(closestIdx);
            },
          },
        });
      });

      return () => {
        try { ctx.revert(); } catch { /* pin spacer already removed */ }
      };
    };

    const timer = setTimeout(init, 500);
    return () => clearTimeout(timer);
  }, [data.length]);

  return (
    <div
      ref={sectionRef}
      id="services-section-inner"
      style={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
        background: "#F5F5F0",
        zIndex: 10,
      }}
    >
      {/* Vertical Motivo logo - left third anchor */}
      <div
        style={{
          position:       "absolute",
          top:            "50%",
          left:           "0",
          width:          "38vw",
          maxWidth:       "520px",
          height:         "100%",
          transform:      "translateY(-50%)",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          zIndex:         45,
          pointerEvents:  "none",
        }}
      >
        <img
          src="/logo-dark.svg"
          alt=""
          aria-hidden="true"
          style={{
            width:        "auto",
            height:       "clamp(120px, 12vw, 180px)",
            opacity:      0.07,
            transform:    "rotate(-90deg)",
            display:     "block",
            userSelect:   "none",
            pointerEvents: "none",
            filter:       "brightness(0)",
          }}
        />
      </div>

      {/* Left gradient mask - cards vanish as they enter the sphere zone */}
      <div
        style={{
          position:      "absolute",
          top:           0,
          left:          0,
          width:         "42vw",
          height:        "100%",
          background:    "linear-gradient(to right, #F5F5F0 45%, transparent 100%)",
          zIndex:        40,
          pointerEvents: "none",
        }}
      />

      {/* Scrolling card track - starts from right of sphere zone */}
      <div
        ref={trackRef}
        style={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          paddingLeft: "44vw",
          paddingRight: "48px",
          gap: "16px",
          width: "max-content",
        }}
      >
        {data.map((svc, i) => (
          <ServiceCard key={svc.id} service={svc} isActive={activeIdx === i} />
        ))}

        {/* Trailing text - last scroll item, stops centered */}
        <div
          style={{
            flexShrink:     0,
            width:          "calc(50vw - 16px)",
            height:         "100%",
            display:        "flex",
            flexDirection:  "column",
            justifyContent: "center",
            paddingLeft:    "48px",
            paddingRight:   "48px",
          }}
        >
          {/* Text constrained to ~420px max */}
          <div style={{ maxWidth: "420px" }}>
            <p
              style={{
                fontFamily:    "var(--font-display)",
                fontWeight:    700,
                fontSize:      "clamp(28px, 3.2vw, 48px)",
                color:         "#080808",
                lineHeight:    1.1,
                letterSpacing: "-0.02em",
                margin:        0,
                textAlign:     "left",
              }}
            >
              Not just design. We build complete brand experiences.
            </p>

            <p
              style={{
                marginTop:  "14px",
                fontFamily: "var(--font-sans)",
                fontSize:   "14px",
                lineHeight: 1.65,
                color:      "rgba(8,8,8,0.55)",
              }}
            >
              Most studios stop at visuals. We go further into execution, production, and real-world impact.
            </p>

            {/* Button - width fits content only */}
            <button
              onClick={() => safeNavigate("/work", router)}
              style={{
                marginTop:      "24px",
                fontFamily:     "var(--font-sans)",
                fontSize:       "13px",
                fontWeight:     500,
                color:          "#ffffff",
                background:     "#ED1C24",
                border:         "none",
                borderRadius:   "100px",
                padding:        "10px 22px",
                cursor:         "pointer",
                display:        "inline-flex",
                alignItems:     "center",
                gap:            "8px",
                width:          "fit-content",
                transition:     "background 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#B5151B")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#ED1C24")}
            >
              See all our work →
            </button>
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <div
        style={{
          position: "absolute",
          bottom: "28px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "6px",
          zIndex: 10,
        }}
      >
        {data.map((_, i) => (
          <div
            key={i}
            style={{
              height: "3px",
              borderRadius: "2px",
              transition: "width 0.3s ease, background 0.3s ease",
              width: activeIdx === i ? "28px" : "16px",
              background: activeIdx === i ? "#ED1C24" : "rgba(8,8,8,0.15)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ServiceCard({ service, isActive }: { service: Service; isActive: boolean }) {
  const router = useRouter();
  return (
    <div
      className="service-card"
      style={{
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        borderRadius: "14px",
        overflow: "hidden",
        border: isActive
          ? "0.5px solid rgba(237,28,36,0.4)"
          : "0.5px solid rgba(8,8,8,0.1)",
        background: isActive ? "#ffffff" : "#EDEEE8",
        boxShadow: isActive ? "0 8px 32px rgba(0,0,0,0.08)" : "none",
        width: isActive ? "348px" : "240px",
        height: isActive ? "528px" : "380px",
        transition: [
          "width 0.5s cubic-bezier(0.34,1.1,0.64,1)",
          "height 0.5s cubic-bezier(0.34,1.1,0.64,1)",
          "border-color 0.3s ease",
          "background 0.3s ease",
          "box-shadow 0.3s ease",
        ].join(", "),
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "18px 18px 12px" }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "rgba(8,8,8,0.25)", fontVariantNumeric: "tabular-nums" }}>
          {service.num}
        </span>
        <span style={{ fontSize: "13px", color: isActive ? "#ED1C24" : "rgba(8,8,8,0.2)" }}>↗</span>
      </div>

      {/* Thumbnail - real image */}
      <div
        style={{
          margin:       "0 16px",
          borderRadius: "10px",
          flex:         1,
          overflow:     "hidden",
          position:     "relative",
          minHeight:    "160px",
        }}
      >
        <img
          src={service.thumbnail}
          alt={service.name}
          style={{
            width:      "100%",
            height:     "100%",
            objectFit:  "cover",
            display:    "block",
            position:   "absolute",
            inset:      0,
            transition: "transform 0.5s ease",
            transform:  isActive ? "scale(1.03)" : "scale(1)",
          }}
        />
        {/* Subtle overlay - lightens inactive cards */}
        <div
          style={{
            position:      "absolute",
            inset:         0,
            background:    isActive
              ? "rgba(237,28,36,0.06)"
              : "rgba(245,245,240,0.25)",
            transition:    "background 0.4s ease",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Name */}
      <div style={{ padding: "14px 18px 8px", display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: isActive ? "22px" : "15px",
            color: isActive ? "#080808" : "rgba(8,8,8,0.45)",
            margin: 0,
            transition: "font-size 0.3s ease, color 0.3s ease",
          }}
        >
          {service.name}
        </h3>
        {service.tag && (
          <span style={{ fontSize: "8px", padding: "2px 7px", borderRadius: "20px", border: "0.5px solid rgba(8,8,8,0.12)", color: "rgba(8,8,8,0.3)", whiteSpace: "nowrap" }}>
            {service.tag}
          </span>
        )}
      </div>

      {/* Expanded content */}
      <div
        style={{
          padding: "0 18px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          overflow: "hidden",
          maxHeight: isActive ? "200px" : "0px",
          opacity: isActive ? 1 : 0,
          transition: "max-height 0.5s cubic-bezier(0.34,1.1,0.64,1), opacity 0.35s ease",
          pointerEvents: isActive ? "auto" : "none",
          paddingBottom: isActive ? "16px" : "0",
        }}
      >
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "11px", color: "rgba(8,8,8,0.45)", lineHeight: 1.6, margin: 0 }}>
          {service.description}
        </p>
        <ul style={{ display: "flex", flexDirection: "column", gap: "6px", padding: 0, margin: 0, listStyle: "none" }}>
          {service.items.slice(0, 3).map((item) => (
            <li key={item} style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-sans)", fontSize: "10px", color: "rgba(8,8,8,0.4)" }}>
              <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(8,8,8,0.35)", flexShrink: 0 }} />
              {item}
            </li>
          ))}
        </ul>
        <button
          onClick={(e) => {
            e.stopPropagation();
            safeNavigate(`/work?cat=${service.workSlug}`, router);
          }}
          style={{
            width:          "100%",
            padding:        "10px 16px",
            background:     "rgba(237,28,36,0.06)",
            border:         "0.5px solid rgba(237,28,36,0.25)",
            borderRadius:   "8px",
            fontFamily:     "var(--font-sans)",
            fontSize:       "12px",
            fontWeight:     500,
            color:          "#ED1C24",
            cursor:         "pointer",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            transition:     "background 0.2s ease",
            textAlign:      "left" as const,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(237,28,36,0.12)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(237,28,36,0.06)")}
        >
          See {service.name.toLowerCase()} work
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
