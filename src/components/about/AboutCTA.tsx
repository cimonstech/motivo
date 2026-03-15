"use client";
import Link from "next/link";

export function AboutCTA() {
  return (
    <section
      style={{
        background: "#080808",
        padding:    "120px 0",
        display:    "flex",
        flexDirection: "column",
        gap:        "0",
      }}
    >
      <div className="container">
      <span
        style={{
          fontFamily:    "var(--font-sans)",
          fontSize:      "10px",
          fontWeight:    500,
          letterSpacing: "0.14em",
          textTransform: "uppercase" as const,
          color:         "rgba(245,245,240,0.25)",
          marginBottom:  "48px",
          display:       "block",
        }}
      >
        What&apos;s next
      </span>

      {/* Two large CTA links */}
      <div
        style={{
          display:       "flex",
          flexDirection: "column",
          gap:           "0",
          borderTop:     "0.5px solid rgba(245,245,240,0.08)",
        }}
      >
        {[
          { label: "See our work",    href: "/work",    sub: "8 projects" },
          { label: "Start a project", href: "/contact", sub: "Let's talk" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "space-between",
              padding:        "40px 0",
              borderBottom:   "0.5px solid rgba(245,245,240,0.08)",
              textDecoration: "none",
              position:       "relative",
              overflow:       "hidden",
            }}
            onMouseEnter={(e) => {
              const arrow = e.currentTarget.querySelector<HTMLSpanElement>(".cta-arrow");
              const label = e.currentTarget.querySelector<HTMLSpanElement>(".cta-label");
              const line  = e.currentTarget.querySelector<HTMLDivElement>(".cta-line");
              if (arrow) arrow.style.color  = "#ED1C24";
              if (label) label.style.color  = "#F5F5F0";
              if (line)  line.style.width   = "100%";
            }}
            onMouseLeave={(e) => {
              const arrow = e.currentTarget.querySelector<HTMLSpanElement>(".cta-arrow");
              const label = e.currentTarget.querySelector<HTMLSpanElement>(".cta-label");
              const line  = e.currentTarget.querySelector<HTMLDivElement>(".cta-line");
              if (arrow) arrow.style.color  = "rgba(245,245,240,0.3)";
              if (label) label.style.color  = "rgba(245,245,240,0.6)";
              if (line)  line.style.width   = "0%";
            }}
          >
            {/* Red underline — animates left to right */}
            <div
              className="cta-line"
              style={{
                position:   "absolute",
                bottom:     0,
                left:       0,
                height:     "1px",
                width:      "0%",
                background: "#ED1C24",
                transition: "width 0.4s cubic-bezier(0.65,0,0.35,1)",
              }}
            />

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span
                className="cta-label"
                style={{
                  fontFamily:    "var(--font-display)",
                  fontWeight:    700,
                  fontSize:      "clamp(28px, 4vw, 60px)",
                  color:         "rgba(245,245,240,0.6)",
                  letterSpacing: "-0.03em",
                  lineHeight:    1,
                  transition:    "color 0.2s ease",
                }}
              >
                {item.label}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize:   "11px",
                  color:      "rgba(245,245,240,0.25)",
                }}
              >
                {item.sub}
              </span>
            </div>

            <span
              className="cta-arrow"
              style={{
                fontFamily: "var(--font-display)",
                fontSize:   "clamp(24px, 3vw, 48px)",
                color:      "rgba(245,245,240,0.3)",
                transition: "color 0.2s ease",
              }}
            >
              →
            </span>
          </Link>
        ))}
      </div>
      </div>
    </section>
  );
}
