"use client";
import Image from "next/image";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";
import { safeNavigate } from "@/lib/safeNavigate";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      style={{
        position:     "fixed",
        top:          0,
        left:         0,
        right:        0,
        zIndex:       100,
        padding:      isMobile ? "16px 0" : "20px 0",
        background:   "#080808",
        overflowX:    "hidden",
        width:        "100%",
        maxWidth:     "100vw",
      }}
    >
      <div
        style={{
          width:       "100%",
          maxWidth:    "1440px",
          margin:      "0 auto",
          padding:     isMobile ? "0 20px" : "0 48px",
          display:     "flex",
          alignItems:  "center",
          justifyContent: "space-between",
          minWidth:    0,
        }}
      >
      {/* Logo */}
      <button
        type="button"
        onClick={() => safeNavigate("/", router)}
        style={{
          background: "none", border: "none", padding: 0,
          display: "flex", alignItems: "center", cursor: "pointer",
        }}
      >
        <Image
          src="/logo.svg"
          alt="Motivo"
          width={120}
          height={28}
          priority
          style={{ height: "28px", width: "auto", display: "block" }}
        />
      </button>

      {/* Nav links - desktop */}
      {!isMobile && (
        <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              type="button"
              onClick={() => safeNavigate(link.href, router)}
              style={{
                background: "none", border: "none", padding: 0,
                fontFamily: "var(--font-sans)", fontSize: "13px",
                color: pathname === link.href ? "#F5F5F0" : "rgba(245,245,240,0.45)",
                cursor: "pointer", transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#F5F5F0")}
              onMouseLeave={(e) => {
                e.currentTarget.style.color =
                  pathname === link.href ? "#F5F5F0" : "rgba(245,245,240,0.45)";
              }}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}

      {/* Mobile menu button + CTA (hide CTA on homepage) */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {isMobile && (
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            style={{
              background: "none", border: "none", padding: "8px",
              color: "#F5F5F0", cursor: "pointer",
              display: "flex", flexDirection: "column", gap: "5px",
            }}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span style={{ width: "20px", height: "2px", background: "currentColor", display: "block" }} />
            <span style={{ width: "20px", height: "2px", background: "currentColor", display: "block" }} />
            <span style={{ width: "20px", height: "2px", background: "currentColor", display: "block" }} />
          </button>
        )}
      {/* CTA */}
      <button
        type="button"
        onClick={() => safeNavigate("/contact", router)}
        style={{
          fontFamily: "var(--font-sans)", fontSize: "12px", fontWeight: 500,
          color: "#ffffff", padding: "9px 20px", background: "#ED1C24",
          border: "none", borderRadius: "100px", display: "flex",
          alignItems: "center", gap: "6px", cursor: "pointer",
          transition: "background 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#B5151B")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#ED1C24")}
      >
        {isMobile ? "Start" : "Start a project"}
        <span style={{ fontSize: "13px" }}>↗</span>
      </button>
      </div>

      {/* Mobile menu overlay */}
      {isMobile && menuOpen && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "#080808",
            zIndex: 101,
            padding: "80px 20px 40px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              type="button"
              onClick={() => { safeNavigate(link.href, router); setMenuOpen(false); }}
              style={{
                background: "none", border: "none", padding: 0,
                fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 700,
                color: pathname === link.href ? "#F5F5F0" : "rgba(245,245,240,0.6)",
                cursor: "pointer", textAlign: "left",
              }}
            >
              {link.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            style={{
              position: "absolute", top: "20px", right: "20px",
              background: "none", border: "none", padding: "8px",
              color: "#F5F5F0", fontSize: "24px", cursor: "pointer",
            }}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>
      )}
      </div>
    </nav>
  );
}
