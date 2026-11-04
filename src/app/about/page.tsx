import { AboutPage } from "@/components/sections/AboutPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "About",
  description: "I've been a designer for over ten years. Motivo is a studio in Accra where design and fabrication sit under one roof, so good ideas get built right.",
  alternates:  { canonical: "https://thisismotivo.com/about" },
  openGraph: {
    title:       "About | Motivo Studio",
    description: "Design and fabrication under one roof in Accra. Good ideas, built right.",
    url:         "https://thisismotivo.com/about",
    images:      [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export default function About() {
  return <AboutPage />;
}
