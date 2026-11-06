import type { Metadata } from "next";
import { OsHero } from "@/components/os-hero/OsHero";
import { PositioningFluid } from "@/components/sections/PositioningFluid";
import { WhyMotivo } from "@/components/sections/WhyMotivo";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { ClientStrip } from "@/components/sections/ClientStrip";
import { AiOrbCTA } from "@/components/sections/AiOrbCTA";

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
      <OsHero />
      <PositioningFluid />
      <WhyMotivo />
      <ServicesSection mobileCloser />
      <FeaturedWork />
      <div id="clients">
        <ClientStrip />
      </div>
      <AiOrbCTA />
    </>
  );
}
