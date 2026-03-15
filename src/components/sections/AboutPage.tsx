"use client";
import { OriginSection }  from "@/components/about/OriginSection";
import { PeopleSection }   from "@/components/about/PeopleSection";
import { NumbersSection } from "@/components/about/NumbersSection";
import { AboutCTA }        from "@/components/about/AboutCTA";

export function AboutPage() {
  return (
    <div style={{ overflowX: "hidden" }}>
      <OriginSection />
      <PeopleSection />
      <NumbersSection />
      <AboutCTA />
    </div>
  );
}
