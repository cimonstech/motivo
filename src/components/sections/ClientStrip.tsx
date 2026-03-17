"use client";

import Image from "next/image";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const CLIENTS = [
  { name: "Accra Lions",    logo: "/clients/accralions_logo.png" },
  { name: "Fidelity Bank",  logo: "/clients/fidelity_logo.png" },
  { name: "Fruit Minute",   logo: "/clients/fruitminute_logo.png" },
  { name: "Gringo",         logo: "/clients/gringo_logo.png" },
  { name: "Kalani",         logo: "/clients/kalani_logo.png" },
  { name: "Mask",           logo: "/clients/mask_logo.png" },
  { name: "Max TV",         logo: "/clients/maxtv_logo.png" },
  { name: "Sheldon",        logo: "/clients/sheldon_logo.png" },
  { name: "SMSGH",          logo: "/clients/smsgh_logo.png" },
  { name: "Springeee",      logo: "/clients/springeee_logo.png" },
  { name: "Tesoro",         logo: "/clients/tesoro_logo.png" },
  { name: "Tungsten",       logo: "/clients/tungsten_logo.png" },
  { name: "Zeroth",         logo: "/clients/zeroth_logo.png" },
];

// Quadruple for a seamless infinite loop at any screen size
const REPEATED = [...CLIENTS, ...CLIENTS, ...CLIENTS, ...CLIENTS];

export function ClientStrip() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <section
      style={{
        background:   "#ffffff",
        borderTop:    "0.5px solid rgba(0,0,0,0.08)",
        borderBottom: "0.5px solid rgba(0,0,0,0.08)",
        padding:      isMobile ? "24px 0" : "32px 0",
        overflow:     "hidden",
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin:   "0 auto",
          padding:  isMobile ? "0 20px" : "0 48px",
          display:  "flex",
          alignItems: "center",
          flexDirection: isMobile ? "column" : "row",
          gap:      isMobile ? "16px" : 0,
        }}
      >

        {/* Fixed label */}
        <div
          style={{
            flexShrink:    0,
            padding:       isMobile ? "0" : "0 40px",
            borderRight:   isMobile ? "none" : "0.5px solid rgba(0,0,0,0.08)",
            borderBottom:  isMobile ? "0.5px solid rgba(0,0,0,0.08)" : "none",
            marginRight:   "0",
            paddingBottom: isMobile ? "16px" : 0,
          }}
        >
          <span
            style={{
              fontFamily:    "var(--font-sans)",
              fontSize:      "10px",
              fontWeight:    500,
              letterSpacing: "0.14em",
              textTransform: "uppercase" as const,
              color:         "#e00",
              whiteSpace:    "nowrap" as const,
            }}
          >
            Trusted by
          </span>
        </div>

        {/* Scrolling marquee */}
        <div style={{ overflow: "hidden", flex: 1, width: isMobile ? "100%" : undefined }}>
          <div
            style={{
              display:   "flex",
              alignItems: "center",
              width:     "max-content",
              animation: "ticker 60s linear infinite",
            }}
          >
            {REPEATED.map((client, i) => (
              <div
                key={`${client.name}-${i}`}
                style={{
                  display:        "flex",
                  alignItems:     "center",
                  flexShrink:     0,
                  gap:            "0",
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
                    opacity:        1,
                  }}
                >
                  <Image
                    src={client.logo}
                    alt={client.name}
                    fill
                    style={{
                      objectFit:      "contain",
                      objectPosition: "center",
                    }}
                  />
                </div>

                <span
                  style={{
                    color:     "rgba(0,0,0,0.15)",
                    fontSize:  "8px",
                    flexShrink: 0,
                  }}
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
