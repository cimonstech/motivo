"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap }           from "gsap";
import { ScrollTrigger }  from "gsap/ScrollTrigger";
import { useRouter }      from "next/navigation";
import { FloatingPills }      from "@/components/ui/FloatingPills";
import { AvailabilityCard }  from "@/components/ui/AvailabilityCard";
import { safeNavigate }   from "@/lib/safeNavigate";
import { useMediaQuery }  from "@/hooks/useMediaQuery";
import { ThreeErrorBoundary } from "@/components/ui/ThreeErrorBoundary";

const HeroCanvas = dynamic(
  () => import("@/components/three/HeroCanvas"),
  { ssr: false, loading: () => null }
);

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const router       = useRouter();
  const sectionRef   = useRef<HTMLElement>(null);
  const headlineRef  = useRef<HTMLDivElement>(null);
  const pillsRef     = useRef<HTMLDivElement>(null);
  const statsRef     = useRef<HTMLDivElement>(null);
  const ghostRef     = useRef<HTMLDivElement>(null);
  const scrollCueRef   = useRef<HTMLDivElement>(null);
  const sphereRef     = useRef<HTMLDivElement>(null);
  const availabilityRef  = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(ghostRef.current,    { opacity: 0, duration: 2, delay: 0.1 })
        .from(headlineRef.current?.querySelectorAll(".line") ?? [], {
          y: 50, opacity: 0, duration: 0.9, stagger: 0.1,
        }, "-=1.4")
        .from(pillsRef.current?.querySelectorAll(".pill") ?? [], {
          y: 14, opacity: 0, duration: 0.5, stagger: 0.07,
        }, "-=0.6")
        .from(statsRef.current?.querySelectorAll(".stat") ?? [], {
          y: 10, opacity: 0, duration: 0.4, stagger: 0.06,
        }, "-=0.4")
        .from(scrollCueRef.current, { opacity: 0, duration: 0.4 }, "-=0.2");

      // Count-up animation for stats
      const statsData = [
        { id: "brands", target: 40,   suffix: "+", duration: 1.8 },
        { id: "years",  target: 7,    suffix: "",  duration: 1.2 },
        { id: "est",    target: 2018, suffix: "",  duration: 2.2 },
      ];

      statsData.forEach(({ id, target, suffix, duration }) => {
        const el = document.getElementById(`stat-${id}`);
        if (!el) return;

        const obj = { val: 0 };
        gsap.to(obj, {
          val:      target,
          duration,
          delay:    1.2,
          ease:     "power2.out",
          onUpdate: () => {
            el.textContent = Math.round(obj.val) + suffix;
          },
          onComplete: () => {
            el.textContent = String(target) + suffix;
          },
        });
      });

      // Scroll animation - fade hero out (no pin on mobile for normal scroll)
      const pinHero = !isMobile;
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: pinHero ? "+=50%" : "bottom top",
          scrub: 1,
          pin: pinHero,
          pinSpacing: pinHero,
          anticipatePin: pinHero ? 1 : 0,
        },
      });
      scrollTl
        .to(ghostRef.current,    { opacity: 0, y: -20, duration: 0.4 }, 0)
        .to(sphereRef.current,   { opacity: 0, y: -20, duration: 0.4 }, 0)
        .to(pillsRef.current,    { opacity: 0, y: -16, duration: 0.4 }, 0)
        .to(headlineRef.current, { opacity: 0, y: -30, duration: 0.5 }, 0.05)
        .to(statsRef.current,    { opacity: 0, y: 16,  duration: 0.4 }, 0.05)
        .to(scrollCueRef.current,{ opacity: 0,          duration: 0.2 }, 0);
      // Use selector so GSAP finds the element when timeline runs (ref can be null during setup)
      if (!isMobile && sectionRef.current?.querySelector("[data-availability-wrapper]")) {
        scrollTl.to("[data-availability-wrapper]", { opacity: 0, y: -16, duration: 0.4 }, 0);
      }
    }, sectionRef);

    return () => {
      try { ctx.revert(); } catch { /* pin spacer already removed */ }
    };
  }, [isMobile]);

  return (
    <section
      ref={sectionRef}
      id="hero-section"
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "100vw",
        height: "100vh",
        background: "#080808",
        overflow: "hidden",
      }}
    >
      {/* Ghost logo - greyscale, large, centered behind sphere */}
      <div
        ref={ghostRef}
        style={{
          position:       "absolute",
          inset:          0,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          pointerEvents:  "none",
          zIndex:         5,
        }}
        aria-hidden="true"
      >
        <img
          src="/logo.svg"
          alt=""
          style={{
            width:      "clamp(280px, 40vw, 560px)",
            height:     "auto",
            display:    "block",
            filter:     "grayscale(100%) brightness(2)",
            opacity:    0.07,
            userSelect: "none",
          }}
        />
      </div>

      {/* Hero particle sphere - centered */}
      <div
        ref={sphereRef}
        suppressHydrationWarning
        style={{
          position: "absolute",
          inset:    0,
          zIndex:   10,
        }}
      >
        <ThreeErrorBoundary>
          <HeroCanvas isHovered={isHovered} isMobile={isMobile} />
        </ThreeErrorBoundary>
      </div>

      {/* Floating pills */}
      <div
        ref={pillsRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 30 }}
      >
        <FloatingPills />
      </div>

      {/* Availability card — within max-width (hidden on mobile) */}
      {!isMobile && (
        <div
          ref={availabilityRef}
          data-availability-wrapper
          style={{
            position: "absolute", inset: 0, zIndex: 30, pointerEvents: "none",
            display: "flex", justifyContent: "center",
          }}
        >
          <div style={{
            position: "relative",
            width: "100%",
            maxWidth: "1440px",
            padding: "0 48px",
          }}>
            <AvailabilityCard />
          </div>
        </div>
      )}

      {/* Headline - constrained (moved up 15% on mobile) */}
      <div
        ref={headlineRef}
        style={{
          position:  "absolute",
          bottom:    isMobile ? "calc(80px + 15vh)" : "96px",
          left:      "50%",
          transform: "translateX(-50%)",
          width:     "100%",
          maxWidth:  "1440px",
          padding:   isMobile ? "0 20px" : "0 48px",
          zIndex:    40,
        }}
      >
        <div className="line overflow-hidden">
          <h1
            className="font-display font-bold tracking-tight leading-none"
            style={{ fontSize: "clamp(28px, 4.23vw, 62px)" }}
          >
            <span className="text-white">We </span>
            <span className="text-red italic">build brands</span>
          </h1>
        </div>
        <div className="line overflow-hidden">
          <h1
            className="font-display font-bold text-white tracking-tight leading-none"
            style={{ fontSize: "clamp(28px, 4.23vw, 62px)" }}
          >
            that look expensive
          </h1>
        </div>
        <div className="line overflow-hidden">
          <h1
            className="font-display font-bold tracking-tight leading-none"
            style={{ fontSize: "clamp(28px, 4.23vw, 62px)" }}
          >
            <span className="text-white">and perform like </span>
            <span className="text-red italic">assets.</span>
          </h1>
        </div>
        <div className="line overflow-hidden mt-4">
          <p className="text-sm text-white/40 max-w-sm leading-relaxed">
          Motivo is a design and production studio helping ambitious companies turn ideas into brands, digital platforms, and physical experiences that command attention, build trust, and drive real business growth.
          </p>
        </div>
        
        <div className="line overflow-hidden mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => safeNavigate("/contact", router)}
            className="text-xs font-medium text-white bg-red border border-red rounded-full px-[calc(1.25rem+7px)] py-[calc(0.625rem+7px)] hover:bg-[#B5151B] hover:border-[#B5151B] transition-colors duration-200 inline-flex items-center gap-1.5"
          >
            Book a Project Slot
            <span className="text-[13px] leading-none">↗</span>
          </button>
          <button
            type="button"
            onClick={() => safeNavigate("/work", router)}
            className="text-xs font-medium text-white border border-white/20 rounded-full px-[calc(1.25rem+7px)] py-[calc(0.625rem+7px)] hover:border-red transition-all duration-300"
          >
            View Selected Work
          </button>
        </div>
      </div>

      {/* Stats — left on mobile, right-aligned on desktop; right edge aligns with nav/availability (moved up 15% on mobile) */}
      <div
        ref={statsRef}
        className="stats-row"
        style={{
          position:        "absolute",
          bottom:          isMobile ? "calc(24px + 15vh)" : "32px",
          left:            "50%",
          transform:       "translateX(-50%)",
          width:           "100%",
          maxWidth:        "1440px",
          padding:         isMobile ? "0 20px" : "0 48px",
          display:         "flex",
          justifyContent:  isMobile ? "flex-start" : "flex-end",
          alignItems:      "flex-end",
          gap:             isMobile ? "24px" : "48px",
          zIndex:          40,
        }}
      >
        {[
          { id: "brands", target: 40,   suffix: "+", label: ["Brands", "Built"] },
          { id: "years",  target: 7,    suffix: "",  label: ["Years in", "Accra"] },
          { id: "est",    target: 2018, suffix: "",  label: ["Est.", ""] },
        ].map((s) => (
          <div key={s.id} className="stat" style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
            <span
              id={`stat-${s.id}`}
              style={{
                fontFamily:    "var(--font-display)",
                fontWeight:    700,
                fontSize:      "clamp(28px, 3vw, 42px)",
                color:         "#F5F5F0",
                lineHeight:    1,
                letterSpacing: "-0.02em",
              }}
            >
              0{s.suffix}
            </span>
            <span style={{
              fontFamily:    "var(--font-sans)",
              fontSize:      "10px",
              color:         "rgba(245,245,240,0.35)",
              lineHeight:    1.3,
              paddingBottom: "2px",
            }}>
              {s.label[0]}{s.label[1] ? <><br />{s.label[1]}</> : ""}
            </span>
          </div>
        ))}
      </div>

      {/* Scroll cue (moved up 15% on mobile) */}
      <div
        ref={scrollCueRef}
        className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{
          zIndex: 40, opacity: 0.4,
          bottom: isMobile ? "calc(32px + 15vh)" : "32px",
        }}
      >
        <span className="text-[9px] text-white/50 tracking-[0.14em] uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  );
}
