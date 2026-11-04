import { ContactPage } from "@/components/sections/ContactPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:       "Contact",
  description: "Tell us what you're building. Motivo Studio - hello@thisismotivo.com - Accra, Ghana. Start your project today.",
  alternates:  { canonical: "https://thisismotivo.com/contact" },
  openGraph: {
    title:       "Contact | Motivo Studio",
    description: "Tell us what you're building. Based in Accra, Ghana. hello@thisismotivo.com",
    url:         "https://thisismotivo.com/contact",
    images:      [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export default function Contact() {
  return <ContactPage />;
}
