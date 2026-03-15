import { AboutPage } from "@/components/sections/AboutPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "MOTIVO didn't start as a business plan. It started from something Gideon kept noticing over the years.",
};

export default function About() {
  return <AboutPage />;
}
