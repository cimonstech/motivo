import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LenisProvider }   from "@/components/providers/LenisProvider";
import { RouteCleanup }   from "@/components/providers/RouteCleanup";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";

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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://thisismotivo.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:  "Motivo Studio - Brand Identity, Digital & Fabrications in Accra, Ghana",
    template: "%s | Motivo Studio",
  },
  description:
    "Motivo is a premium creative practice based in Accra, Ghana. We design brand identities, build digital products, direct campaigns, and fabricate physical installations - built properly.",
  keywords: [
    "creative agency Accra",
    "brand identity Ghana",
    "graphic design Accra",
    "web design Ghana",
    "branding agency Ghana",
    "digital agency Accra",
    "logo design Ghana",
    "creative studio Accra Ghana",
    "brand design West Africa",
    "fabrication signage Ghana",
  ],
  authors: [{ name: "Motivo Studio", url: SITE_URL }],
  creator:  "Motivo Studio",
  publisher: "Motivo Studio",
  formatDetection: {
    email:     false,
    address:   false,
    telephone: false,
  },
  openGraph: {
    type:        "website",
    locale:      "en_GH",
    url:         SITE_URL,
    siteName:    "Motivo Studio",
    title:       "Motivo Studio - Brand Identity, Digital & Fabrications in Accra, Ghana",
    description: "A premium creative practice built at the intersection of design, fabrication, and production. Based in Accra, Ghana.",
    images: [
      {
        url:    "/og-image.jpg",
        width:  1200,
        height: 630,
        alt:    "Motivo Studio - Creative Practice, Accra Ghana",
      },
    ],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Motivo Studio - Brand Identity, Digital & Fabrications in Accra",
    description: "A premium creative practice built at the intersection of design, fabrication, and production. Based in Accra, Ghana.",
    images:      ["/og-image.jpg"],
    creator:     "@thisismotivo",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index:             true,
      follow:            true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet":     -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon:   "/favicon.ico",
    apple:  "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type":       ["LocalBusiness", "ProfessionalService", "DesignCompany"],
        "@id":         "https://thisismotivo.com/#organization",
        "name":        "Motivo Studio",
        "alternateName": "MOTIVO",
        "url":         "https://thisismotivo.com",
        "logo":        "https://thisismotivo.com/logo.svg",
        "image":       "https://thisismotivo.com/og-image.jpg",
        "description": "A premium creative practice built at the intersection of design, fabrication, and production. Based in Accra, Ghana.",
        "foundingDate": "2018",
        "founder": {
          "@type": "Person",
          "name":  "Gideon Kutsinyah",
          "jobTitle": "Founder & Creative Director",
        },
        "address": {
          "@type":           "PostalAddress",
          "addressLocality": "Accra",
          "addressCountry":  "GH",
          "addressRegion":   "Greater Accra",
        },
        "geo": {
          "@type":     "GeoCoordinates",
          "latitude":  5.6037,
          "longitude": -0.1870,
        },
        "contactPoint": [
          {
            "@type":       "ContactPoint",
            "contactType": "customer service",
            "email":       "hello@thisismotivo.com",
            "availableLanguage": "English",
          },
          {
            "@type":          "ContactPoint",
            "contactType":    "sales",
            "telephone":      "+233240639403",
            "contactOption":  "TollFree",
            "availableLanguage": "English",
          },
        ],
        "sameAs": [
          "https://instagram.com/thisismotivo",
          "https://linkedin.com/company/thisismotivo",
          "https://behance.net/thisismotivo",
          "https://wa.me/233240639403",
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name":  "Creative Services",
          "itemListElement": [
            {
              "@type":       "Offer",
              "itemOffered": {
                "@type":       "Service",
                "name":        "Brand Identity",
                "description": "Logos, visual systems, brand guidelines, print design, and campaign direction.",
              },
            },
            {
              "@type":       "Offer",
              "itemOffered": {
                "@type":       "Service",
                "name":        "Digital Products",
                "description": "Websites, web applications, portals, and custom digital experiences.",
              },
            },
            {
              "@type":       "Offer",
              "itemOffered": {
                "@type":       "Service",
                "name":        "Campaigns",
                "description": "Creative campaign strategy, art direction, motion graphics, and launch assets.",
              },
            },
            {
              "@type":       "Offer",
              "itemOffered": {
                "@type":       "Service",
                "name":        "Fabrications",
                "description": "3D signage, environmental branding, reception walls, and physical installations.",
              },
            },
          ],
        },
        "areaServed": [
          { "@type": "City",    "name": "Accra" },
          { "@type": "Country", "name": "Ghana" },
          { "@type": "Place",   "name": "West Africa" },
        ],
        "priceRange": "$$",
        "numberOfEmployees": { "@type": "QuantitativeValue", "value": 2 },
      },
      {
        "@type":           "WebSite",
        "@id":             "https://thisismotivo.com/#website",
        "url":             "https://thisismotivo.com",
        "name":            "Motivo Studio",
        "description":     "Brand identity, digital products, campaigns and fabrications - built properly in Accra, Ghana.",
        "publisher":       { "@id": "https://thisismotivo.com/#organization" },
        "inLanguage":      "en-GH",
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}

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
        <GoogleAnalytics />
        <JsonLd />
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
