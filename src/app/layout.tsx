import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LenisProvider }   from "@/components/providers/LenisProvider";
import { RouteCleanup }   from "@/components/providers/RouteCleanup";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const ranade = localFont({
  src: [
    { path: "../../public/fonts/Renade/Ranade-Thin.otf",         weight: "100", style: "normal" },
    { path: "../../public/fonts/Renade/Ranade-ThinItalic.ttf",   weight: "100", style: "italic" },
    { path: "../../public/fonts/Renade/Ranade-Light.otf",        weight: "300", style: "normal" },
    { path: "../../public/fonts/Renade/Ranade-LightItalic.otf",  weight: "300", style: "italic" },
    { path: "../../public/fonts/Renade/Ranade-Regular.otf",      weight: "400", style: "normal" },
    { path: "../../public/fonts/Renade/Ranade-Italic.otf",       weight: "400", style: "italic" },
    { path: "../../public/fonts/Renade/Ranade-Medium.otf",       weight: "500", style: "normal" },
    { path: "../../public/fonts/Renade/Ranade-MediumItalic.ttf", weight: "500", style: "italic" },
    { path: "../../public/fonts/Renade/Ranade-Bold.otf",         weight: "700", style: "normal" },
    { path: "../../public/fonts/Renade/Ranade-BoldItalic.ttf",   weight: "700", style: "italic" },
  ],
  variable: "--font-display",
  display: "swap",
});

const din = localFont({
  src: [
    { path: "../../public/fonts/DIN/DINLight.ttf",    weight: "300", style: "normal" },
    { path: "../../public/fonts/DIN/DINRegularAlternate.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/DIN/DIN-Medium.ttf",   weight: "500", style: "normal" },
    { path: "../../public/fonts/DIN/DINBold.ttf",      weight: "700", style: "normal" },
  ],
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
      className={`${ranade.variable} ${din.variable}`}
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
