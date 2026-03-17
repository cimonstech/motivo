import type { Metadata } from "next";
import { Hero }            from "@/components/sections/Hero";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { FeaturedWork }    from "@/components/sections/FeaturedWork";
import { AiOrbCTA }        from "@/components/sections/AiOrbCTA";

export const metadata: Metadata = {
  title:       "Motivo Studio - Brand Identity, Digital & Fabrications in Accra, Ghana",
  description: "A creative practice built at the intersection of design, fabrication, and production. Based in Accra, Ghana. We design brands, build digital products, and make things real.",
  alternates:  { canonical: "https://thisismotivo.com" },
  openGraph: {
    title:       "Motivo Studio - Creative Practice, Accra Ghana",
    description: "Brand identity, digital products, campaigns and physical fabrications - built properly.",
    url:         "https://thisismotivo.com",
    images:      [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <FeaturedWork />
      <AiOrbCTA />
    </>
  );
}
