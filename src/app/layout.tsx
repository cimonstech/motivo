import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import "./globals.css";
import { LenisProvider }   from "@/components/providers/LenisProvider";
import { RouteCleanup }   from "@/components/providers/RouteCleanup";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://thisismotivo.com"),
  title: {
    default: "Motivo — Brand Identity, Digital & Fabrications",
    template: "%s | Motivo",
  },
  description:
    "A creative practice built at the intersection of design, fabrication, and production. Based in Accra, Ghana.",
  keywords: [
    "creative agency Accra",
    "brand identity Ghana",
    "web design Ghana",
    "3D signage Accra",
    "Motivo",
  ],
  authors: [{ name: "Motivo" }],
  creator: "Motivo",
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://thisismotivo.com",
    siteName: "Motivo",
    title: "Motivo — Brand Identity, Digital & Fabrications",
    description:
      "A creative practice built at the intersection of design, fabrication, and production. Based in Accra, Ghana.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Motivo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Motivo",
    description: "Built where thinking meets making.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#080808",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <RouteCleanup />
        <LenisProvider>
          <CustomCursor />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  );
}
