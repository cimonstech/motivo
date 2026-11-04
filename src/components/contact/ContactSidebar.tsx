"use client";
import { useEffect, useState } from "react";
import { EMAIL, WHATSAPP_NUMBER, STUDIO_LOCATION } from "@/lib/constants";

function LiveClock() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
      setDate(
        now.toLocaleDateString("en-GB", {
          weekday: "short", day: "numeric", month: "short", year: "numeric",
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
      padding: "24px 0",
    }}>
      <span style={{
        fontFamily: "var(--font-display)", fontWeight: 700,
        fontSize: "clamp(24px, 2.4vw, 36px)", color: "#080808",
        letterSpacing: "0.04em", fontVariantNumeric: "tabular-nums",
        lineHeight: 1,
      }}>
        {time}
      </span>
      <span style={{
        fontFamily: "var(--font-sans)", fontSize: "10px",
        color: "rgba(8,8,8,0.3)", letterSpacing: "0.06em",
        textTransform: "uppercase" as const,
      }}>
        {date}
      </span>
      <span style={{
        fontFamily: "var(--font-sans)", fontSize: "10px",
        color: "rgba(8,8,8,0.2)", fontStyle: "italic",
        letterSpacing: "0.03em", marginTop: "2px",
      }}>
        Accra, Ghana · GMT+0
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
    <div style={{
      display: "flex", flexDirection: "column", gap: "0",
      height: "calc(100vh - 180px)", minHeight: "500px",
    }}>
      {/* Title area */}
      <div style={{ marginBottom: "28px" }}>
        <span style={{
          fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 500,
          letterSpacing: "0.14em", textTransform: "uppercase" as const,
          color: "rgba(8,8,8,0.3)", display: "block", marginBottom: "14px",
        }}>
          Get in touch
        </span>
        <h2 style={{
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: "clamp(22px, 2.5vw, 32px)", color: "#080808",
          letterSpacing: "-0.02em", lineHeight: 1.1, margin: 0,
        }}>
          Or reach us<br />
          <span style={{ color: "#ED1C24" }}>directly.</span>
        </h2>
      </div>

      {/* Clock */}
      <div style={{
        background: "rgba(8,8,8,0.02)",
        border: "0.5px solid rgba(8,8,8,0.06)",
        borderRadius: "14px",
        marginBottom: "24px",
      }}>
        <LiveClock />
      </div>

      {/* Contact details */}
      <div style={{
        display: "flex", flexDirection: "column", gap: "18px",
        marginBottom: "24px",
      }}>
        {[
          {
            label: "WhatsApp",
            value: WHATSAPP_NUMBER,
            href: `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`,
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="rgba(8,8,8,0.45)"/>
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" stroke="rgba(8,8,8,0.45)" strokeWidth="1.5" fill="none"/>
              </svg>
            ),
          },
          {
            label: "Email",
            value: EMAIL,
            href: `mailto:${EMAIL}`,
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="4" width="20" height="16" rx="3" stroke="rgba(8,8,8,0.45)" strokeWidth="1.5"/>
                <path d="M2 7l10 6 10-6" stroke="rgba(8,8,8,0.45)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            ),
          },
          {
            label: "Studio",
            value: STUDIO_LOCATION,
            href: null,
            icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="rgba(8,8,8,0.45)" strokeWidth="1.5"/>
                <circle cx="12" cy="9" r="2.5" stroke="rgba(8,8,8,0.45)" strokeWidth="1.5"/>
              </svg>
            ),
          },
        ].map((item) => (
          <div key={item.label} style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "12px 14px",
            background: "rgba(8,8,8,0.02)",
            border: "0.5px solid rgba(8,8,8,0.06)",
            borderRadius: "12px",
            transition: "border-color 0.2s ease",
          }}
            onMouseEnter={(e) => { if (item.href) e.currentTarget.style.borderColor = "rgba(8,8,8,0.15)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(8,8,8,0.06)"; }}
          >
            <div style={{ flexShrink: 0, width: 32, height: 32, borderRadius: "50%",
              background: "rgba(8,8,8,0.04)", display: "flex",
              alignItems: "center", justifyContent: "center",
            }}>
              {item.icon}
            </div>
            <div style={{ flex: 1 }}>
              <span style={{
                fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: 500,
                letterSpacing: "0.1em", textTransform: "uppercase" as const,
                color: "rgba(8,8,8,0.3)", display: "block", marginBottom: "2px",
              }}>
                {item.label}
              </span>
              {item.href ? (
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  style={{
                    fontFamily: "var(--font-sans)", fontSize: "13px",
                    color: "rgba(8,8,8,0.7)", textDecoration: "none",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#ED1C24")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(8,8,8,0.7)")}
                >
                  {item.value}
                </a>
              ) : (
                <span style={{
                  fontFamily: "var(--font-sans)", fontSize: "13px",
                  color: "rgba(8,8,8,0.7)",
                }}>
                  {item.value}
                </span>
              )}
            </div>
            {item.href && (
              <span style={{ color: "rgba(8,8,8,0.2)", fontSize: "12px" }}>↗</span>
            )}
          </div>
        ))}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Social links */}
      <div>
        <div style={{ height: "0.5px", background: "rgba(8,8,8,0.06)", marginBottom: "20px" }} />
        <span style={{
          fontFamily: "var(--font-sans)", fontSize: "9px", fontWeight: 500,
          letterSpacing: "0.12em", textTransform: "uppercase" as const,
          color: "rgba(8,8,8,0.3)", display: "block", marginBottom: "12px",
        }}>
          Follow us
        </span>
        <div style={{ display: "flex", gap: "16px" }}>
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-sans)", fontSize: "12px",
                color: "rgba(8,8,8,0.4)", textDecoration: "none",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#080808")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(8,8,8,0.4)")}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
