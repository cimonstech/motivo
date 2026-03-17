"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap }           from "gsap";
import { ScrollTrigger }  from "gsap/ScrollTrigger";
import { useRouter }      from "next/navigation";
import { FloatingPills }      from "@/components/ui/FloatingPills";
import { AvailabilityCard }  from "@/components/ui/AvailabilityCard";
import { safeNavigate }   from "@/lib/safeNavigate";
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

      // Scroll animation - fade hero out
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=50%",
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        },
      })
        .to(ghostRef.current,    { opacity: 0, y: -20, duration: 0.4 }, 0)
        .to(sphereRef.current,   { opacity: 0, y: -20, duration: 0.4 }, 0)
        .to(pillsRef.current,    { opacity: 0, y: -16, duration: 0.4 }, 0)
        .to(headlineRef.current, { opacity: 0, y: -30, duration: 0.5 }, 0.05)
        .to(statsRef.current,    { opacity: 0, y: 16,  duration: 0.4 }, 0.05)
        .to(scrollCueRef.current,{ opacity: 0,          duration: 0.2 }, 0)
        .to(availabilityRef.current, { opacity: 0, y: -16, duration: 0.4 }, 0)
    }, sectionRef);

    return () => {
      try { ctx.revert(); } catch { /* pin spacer already removed */ }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero-section"
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        width: "100%",
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
          <HeroCanvas isHovered={isHovered} />
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

      {/* Availability card — within max-width */}
      <div
        ref={availabilityRef}
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

      {/* Headline - constrained */}
      <div
        ref={headlineRef}
        style={{
          position:  "absolute",
          bottom:    "96px",
          left:      "50%",
          transform: "translateX(-50%)",
          width:     "100%",
          maxWidth:  "1440px",
          padding:   "0 48px",
          zIndex:    40,
        }}
      >
        <div className="line overflow-hidden">
          <h1
            className="font-display font-bold text-white tracking-tight leading-none"
            style={{ fontSize: "clamp(36px, 5.5vw, 80px)" }}
          >
            Built where thinking
          </h1>
        </div>
        <div className="line overflow-hidden">
          <h1
            className="font-display font-bold tracking-tight leading-none"
            style={{ fontSize: "clamp(36px, 5.5vw, 80px)" }}
          >
            <span className="text-white">meets </span>
            <span className="text-red italic">making.</span>
          </h1>
        </div>
        <div className="line overflow-hidden mt-4">
          <p className="text-sm text-white/40 max-w-sm leading-relaxed">
            A creative practice built at the intersection of design,
            fabrication, and production. Based in Accra, Ghana.
          </p>
        </div>
        <div className="line overflow-hidden mt-6 flex items-center gap-4">
          <button
            type="button"
            onClick={() => safeNavigate("/work", router)}
            className="text-xs font-medium text-white border border-white/20 rounded-full px-5 py-2.5 hover:border-red transition-all duration-300"
          >
            See our work
          </button>
          <button
            type="button"
            onClick={() => safeNavigate("/contact", router)}
            className="text-xs font-medium text-red hover:text-white transition-colors duration-200"
          >
            Start a project ↗
          </button>
        </div>
      </div>

      {/* Stats — right-aligned within 1440px, no right margin */}
      <div
        ref={statsRef}
        className="stats-row"
        style={{
          position:        "absolute",
          bottom:          "32px",
          left:            "50%",
          transform:       "translateX(-50%)",
          width:           "100%",
          maxWidth:        "1440px",
          padding:         "0 0 0 48px",
          display:         "flex",
          justifyContent:  "flex-end",
          alignItems:      "flex-end",
          gap:             "48px",
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

      {/* Scroll cue */}
      <div
        ref={scrollCueRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ zIndex: 40, opacity: 0.4 }}
      >
        <span className="text-[9px] text-white/50 tracking-[0.14em] uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  );
}
