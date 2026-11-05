import type { Metadata } from "next";
import { OsHero } from "@/components/os-hero/OsHero";
import { PositioningFluid } from "@/components/sections/PositioningFluid";
import { WhyMotivo } from "@/components/sections/WhyMotivo";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { ClientStrip } from "@/components/sections/ClientStrip";
import { AiOrbCTA } from "@/components/sections/AiOrbCTA";

export const metadata: Metadata = {
  title: { absolute: "Motivo Studio | Home 2 (preview)" },
  robots: { index: false, follow: false },
};

export default function Home2Page() {
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
