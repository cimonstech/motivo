"use client";

import Image from "next/image";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/** Fidelity and Max TV first; remaining brands follow in a clean order */
const CLIENTS = [
  { name: "Fidelity Bank", logo: "/clients/fidelity_logo.png" },
  { name: "Max TV", logo: "/clients/maxtv_logo.png" },
  { name: "Accra Lions", logo: "/clients/accralions_logo.png" },
  { name: "Fruit Minute", logo: "/clients/fruitminute_logo.png" },
  { name: "Gringo", logo: "/clients/gringo_logo.png" },
  { name: "Kalani", logo: "/clients/kalani_logo.png" },
  { name: "Mask", logo: "/clients/mask_logo.png" },
  { name: "Sheldon", logo: "/clients/sheldon_logo.png" },
  { name: "SMSGH", logo: "/clients/smsgh_logo.png" },
  { name: "Springeee", logo: "/clients/springeee_logo.png" },
  { name: "Tesoro", logo: "/clients/tesoro_logo.png" },
  { name: "Tungsten", logo: "/clients/tungsten_logo.png" },
  { name: "Zeroth", logo: "/clients/zeroth_logo.png" },
];

const REPEATED = [...CLIENTS, ...CLIENTS, ...CLIENTS, ...CLIENTS];

export function ClientStrip() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <section
      aria-labelledby="trust-section-heading"
      style={{
        background:   "#ffffff",
        borderTop:    "0.5px solid rgba(0,0,0,0.08)",
        borderBottom: "0.5px solid rgba(0,0,0,0.08)",
        padding:      isMobile ? "40px 0 28px" : "56px 0 40px",
        overflow:     "hidden",
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin:   "0 auto",
          padding:  isMobile ? "0 20px" : "0 48px",
        }}
      >
        <div
          style={{
            marginBottom: isMobile ? "28px" : "36px",
            maxWidth:     "720px",
          }}
        >
          <h2
            id="trust-section-heading"
            className="font-display font-bold tracking-tight text-black"
            style={{
              fontSize:      "clamp(28px, 3.5vw, 44px)",
              lineHeight:    1.12,
              letterSpacing: "-0.02em",
              marginBottom:  isMobile ? "12px" : "0.5rem",
            }}
          >
            Trusted by brands that take their image seriously
          </h2>
          <p
            className="font-sans"
            style={{
              fontSize:      "15px",
              lineHeight:    1.65,
              color:         "rgba(8,8,8,0.45)",
              margin:        0,
              maxWidth:      "560px",
            }}
          >
            We&apos;ve worked with companies across finance, lifestyle, retail and
            emerging brands, helping them elevate how they are seen and experienced.
          </p>
        </div>

        {/* Scrolling marquee — minimal, premium */}
        <div style={{ overflow: "hidden", width: "100%" }}>
          <div
            style={{
              display:    "flex",
              alignItems: "center",
              width:      "max-content",
              animation:  "ticker 60s linear infinite",
            }}
          >
            {REPEATED.map((client, i) => (
              <div
                key={`${client.name}-${i}`}
                style={{
                  display:    "flex",
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width:          "150px",
                    height:         "48px",
                    position:       "relative",
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "center",
                    margin:         "0 32px",
                    opacity:        0.92,
                  }}
                >
                  <Image
                    src={client.logo}
                    alt={client.name}
                    fill
                    sizes="150px"
                    style={{
                      objectFit:      "contain",
                      objectPosition: "center",
                    }}
                  />
                </div>

                <span
                  style={{
                    color:      "rgba(0,0,0,0.12)",
                    fontSize:   "8px",
                    flexShrink: 0,
                  }}
                  aria-hidden
                >
                  ✦
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
