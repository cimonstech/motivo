import { Hero }            from "@/components/sections/Hero";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { FeaturedWork }    from "@/components/sections/FeaturedWork";
import { ClientStrip }     from "@/components/sections/ClientStrip";
import { AiOrbCTA }        from "@/components/sections/AiOrbCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <FeaturedWork />
      <ClientStrip />
      <AiOrbCTA />
    </>
  );
}
