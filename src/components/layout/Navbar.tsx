"use client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";
import { safeNavigate } from "@/lib/safeNavigate";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

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

      {/* Nav links — centered */}
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
        Start a project
        <span style={{ fontSize: "13px" }}>↗</span>
      </button>
      </div>
    </nav>
  );
}
