import { ContactPage } from "@/components/sections/ContactPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "Contact",
  description: "Tell us what you're building. We'll tell you how we'd do it.",
};

export default function Contact() {
  return <ContactPage />;
}
