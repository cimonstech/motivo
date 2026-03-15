"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";
import { SafeLink } from "@/components/ui/SafeLink";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "20px 0",
        background: "#080808",
      }}
    >
      <div
        style={{
          maxWidth:  "1440px",
          margin:    "0 auto",
          padding:   "0 48px",
          display:   "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
      {/* Logo */}
      <SafeLink href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
        <Image
          src="/logo.svg"
          alt="Motivo"
          width={120}
          height={28}
          priority
          style={{ height: "28px", width: "auto", display: "block" }}
        />
      </SafeLink>

      {/* Nav links — centered */}
      <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
        {NAV_LINKS.map((link) => (
          <SafeLink
            key={link.href}
            href={link.href}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
              color: pathname === link.href ? "#F5F5F0" : "rgba(245,245,240,0.45)",
              textDecoration: "none",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#F5F5F0")}
            onMouseLeave={(e) => {
              e.currentTarget.style.color =
                pathname === link.href ? "#F5F5F0" : "rgba(245,245,240,0.45)";
            }}
          >
            {link.label}
          </SafeLink>
        ))}
      </div>

      {/* CTA */}
      <SafeLink
        href="/contact"
        style={{
          fontFamily:     "var(--font-sans)",
          fontSize:       "12px",
          fontWeight:     500,
          color:          "#ffffff",
          textDecoration: "none",
          padding:        "9px 20px",
          background:     "#ED1C24",
          border:         "none",
          borderRadius:   "100px",
          display:        "flex",
          alignItems:     "center",
          gap:            "6px",
          transition:     "background 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#B5151B")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#ED1C24")}
      >
        Start a project
        <span style={{ fontSize: "13px" }}>↗</span>
      </SafeLink>
      </div>
    </nav>
  );
}
