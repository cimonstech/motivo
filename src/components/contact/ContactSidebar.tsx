"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const OrbCanvas = dynamic(
  () => import("@/components/three/OrbCanvas"),
  { ssr: false }
);
import { EMAIL, WHATSAPP_NUMBER, STUDIO_LOCATION } from "@/lib/constants";

function LiveClock() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h   = now.getHours().toString().padStart(2, "0");
      const m   = now.getMinutes().toString().padStart(2, "0");
      const s   = now.getSeconds().toString().padStart(2, "0");
      setTime(`${h}:${m}:${s}`);
      setDate(now.toLocaleDateString("en-GB", {
        weekday: "short", day: "numeric",
        month: "short",   year: "numeric",
      }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
      <span style={{
        fontFamily:         "var(--font-display)",
        fontWeight:         700,
        fontSize:           "clamp(18px, 2vw, 28px)",
        color:              "#080808",
        letterSpacing:      "0.05em",
        fontVariantNumeric: "tabular-nums",
        lineHeight:         1,
      }}>
        {time}
      </span>
      <span style={{
        fontFamily:    "var(--font-sans)",
        fontSize:      "10px",
        color:         "rgba(8,8,8,0.35)",
        letterSpacing:  "0.06em",
        textTransform: "uppercase" as const,
      }}>
        {date}
      </span>
    </div>
  );
}

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com/thisismotivo" },
  { label: "LinkedIn",  href: "https://linkedin.com/company/thisismotivo" },
  { label: "Behance",   href: "https://behance.net/thisismotivo" },
];

export function ContactSidebar() {
  return (
    <div
      style={{
        display:       "flex",
        flexDirection: "column",
        gap:           "40px",
        paddingLeft:   "40px",
      }}
    >
      {/* Section label */}
      <span style={{
        fontFamily:    "var(--font-sans)",
        fontSize:      "10px",
        fontWeight:    500,
        letterSpacing: "0.14em",
        textTransform: "uppercase" as const,
        color:         "rgba(8,8,8,0.3)",
      }}>
        Get in touch
      </span>

      {/* Orb + clock */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
        <div style={{ width: "200px", height: "200px" }}>
          <OrbCanvas width={200} height={200} />
        </div>
        <LiveClock />
        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize:   "10px",
          color:      "rgba(8,8,8,0.25)",
          textAlign:  "center",
          margin:     0,
          fontStyle:  "italic",
          letterSpacing: "0.04em",
        }}>
          Time is moving fast.
        </p>
      </div>

      {/* Divider */}
      <div style={{ height: "0.5px", background: "rgba(8,8,8,0.08)" }} />

      {/* Contact details */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {[
          { label: "WhatsApp",  value: WHATSAPP_NUMBER, href: `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}` },
          { label: "Email",     value: EMAIL,           href: `mailto:${EMAIL}` },
          { label: "Studio",    value: STUDIO_LOCATION, href: null },
        ].map((item) => (
          <div key={item.label} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{
              fontFamily:    "var(--font-sans)",
              fontSize:      "9px",
              fontWeight:    500,
              letterSpacing:  "0.12em",
              textTransform: "uppercase" as const,
              color:         "rgba(8,8,8,0.3)",
            }}>
              {item.label}
            </span>
            {item.href ? (
              <a
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                style={{
                  fontFamily:     "var(--font-sans)",
                  fontSize:       "13px",
                  color:          "rgba(8,8,8,0.65)",
                  textDecoration: "none",
                  transition:     "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ED1C24")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(8,8,8,0.65)")}
              >
                {item.value}
              </a>
            ) : (
              <span style={{
                fontFamily: "var(--font-sans)",
                fontSize:   "13px",
                color:      "rgba(8,8,8,0.65)",
              }}>
                {item.value}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: "0.5px", background: "rgba(8,8,8,0.08)" }} />

      {/* Social links */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <span style={{
          fontFamily:    "var(--font-sans)",
          fontSize:      "9px",
          fontWeight:    500,
          letterSpacing:  "0.12em",
          textTransform: "uppercase" as const,
          color:         "rgba(8,8,8,0.3)",
          marginBottom:  "4px",
        }}>
          Follow
        </span>
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily:     "var(--font-sans)",
              fontSize:       "13px",
              color:          "rgba(8,8,8,0.45)",
              textDecoration: "none",
              display:        "flex",
              alignItems:     "center",
              gap:            "6px",
              transition:     "color 0.2s ease",
              width:          "fit-content",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#080808")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(8,8,8,0.45)")}
          >
            {link.label}
            <span style={{ color: "#ED1C24", fontSize: "11px" }}>↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}
