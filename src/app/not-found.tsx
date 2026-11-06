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
        color: "#F5F5F0",
      }}
    >
      <Puzzle404 homeHref="/" />
    </section>
  );
}
