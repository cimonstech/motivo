import type { Metadata } from "next";
import Puzzle404 from "@/components/puzzle-404/Puzzle404";

export const metadata: Metadata = {
  title: { absolute: "Page not found | Motivo Studio" },
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section
      style={{
        maxWidth: 1120,
        margin: "0 auto",
        paddingBlock: "120px 64px",
        paddingInline: "max(16px, env(safe-area-inset-left, 0px))",
        display: "flex",
        flexDirection: "column",
        gap: 32,
        color: "#F5F5F0",
      }}
    >
      <header
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
          gap: "16px 40px",
          alignItems: "end",
        }}
      >
        <div>
          <p
            style={{
              margin: "0 0 12px",
              fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#ED1C24",
            }}
          >
            Error 404
          </p>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--font-display), ui-sans-serif, system-ui, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(36px, 5.4vw, 68px)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            This page is missing a piece.
          </h1>
        </div>
        <p
          style={{
            margin: 0,
            fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
            fontSize: 17,
            lineHeight: 1.55,
            color: "rgba(245,245,240,0.74)",
            maxWidth: "44ch",
          }}
        >
          The link you followed doesn&apos;t lead anywhere. Drag the loose piece into the gap to finish the puzzle, and
          we&apos;ll take you back to the homepage.
        </p>
      </header>
      <Puzzle404 homeHref="/" />
    </section>
  );
}
