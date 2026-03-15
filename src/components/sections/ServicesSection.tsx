"use client";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ServicesDesktop } from "./ServicesDesktop";
import { ServicesMobile } from "./ServicesMobile";
import { services } from "@/data/services";

export function ServicesSection() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <section id="services-section" style={{ position: "relative", background: "#F5F5F0" }}>
      <div
        style={{
          maxWidth: "1440px",
          margin:   "0 auto",
          padding:  "20px 48px 0",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "10px",
            fontWeight: 500,
            letterSpacing: "0.14em",
            textTransform: "uppercase" as const,
            color: "rgba(8,8,8,0.3)",
          }}
        >
          What we do
        </span>
      </div>
      {isMobile ? (
        <ServicesMobile data={services} />
      ) : (
        <ServicesDesktop data={services} />
      )}
    </section>
  );
}
