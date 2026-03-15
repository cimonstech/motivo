"use client";
import Link from "next/link";
import Image from "next/image";
import { EMAIL, WHATSAPP_NUMBER, STUDIO_LOCATION, NAV_LINKS } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "#080808",
        borderTop: "0.5px solid rgba(245,245,240,0.06)",
        padding: "56px 48px",
      }}
    >
      <div style={{ maxWidth: "1440px", margin: "0 auto" }}>

        {/* Top grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "48px",
            marginBottom: "48px",
          }}
        >
          {/* Brand */}
          <div
            style={{
              display:       "flex",
              flexDirection: "column",
              gap:           "16px",
              alignItems:    "flex-start",
            }}
          >
            <Image
              src="/logo.svg"
              alt="Motivo"
              width={110}
              height={26}
              style={{ height: "26px", width: "auto", display: "block" }}
            />
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "12px",
                color: "rgba(245,245,240,0.3)",
                lineHeight: 1.6,
                maxWidth: "200px",
                margin: 0,
              }}
            >
              Brand identity, digital products, and physical fabrications.
              Built in Accra.
            </p>
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(245,245,240,0.25)",
                marginBottom: "4px",
              }}
            >
              Navigation
            </span>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "13px",
                  color: "rgba(245,245,240,0.4)",
                  textDecoration: "none",
                  width: "fit-content",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#F5F5F0")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245,245,240,0.4)")}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(245,245,240,0.25)",
                marginBottom: "4px",
              }}
            >
              Get in touch
            </span>
            <a
              href={`mailto:${EMAIL}`}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                color: "rgba(245,245,240,0.4)",
                textDecoration: "none",
                width: "fit-content",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ED1C24")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245,245,240,0.4)")}
            >
              {EMAIL}
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
                color: "rgba(245,245,240,0.4)",
                textDecoration: "none",
                width: "fit-content",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ED1C24")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245,245,240,0.4)")}
            >
              WhatsApp
            </a>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "11px",
                color: "rgba(245,245,240,0.2)",
                margin: 0,
              }}
            >
              {STUDIO_LOCATION}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "24px",
            borderTop: "0.5px solid rgba(245,245,240,0.06)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              color: "rgba(245,245,240,0.2)",
              margin: 0,
            }}
          >
            © {year} Motivo. All rights reserved.
          </p>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "11px",
              color: "rgba(245,245,240,0.2)",
              margin: 0,
            }}
          >
            Designed &amp; built by Motivo
          </p>
        </div>
      </div>
    </footer>
  );
}
