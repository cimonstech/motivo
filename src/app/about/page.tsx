import { AboutPage } from "@/components/sections/AboutPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "About",
  description: "MOTIVO didn't start as a business plan. Founded by Gideon Kutsinyah in Accra, Ghana in 2018 - a creative practice where ideas are not only imagined, they are built properly.",
  alternates:  { canonical: "https://thisismotivo.com/about" },
  openGraph: {
    title:       "About | Motivo Studio",
    description: "Founded in Accra in 2018. A creative practice where good ideas are not only imagined - they are built properly.",
    url:         "https://thisismotivo.com/about",
    images:      [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export default function About() {
  return <AboutPage />;
}
