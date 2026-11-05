import { EMAIL, WHATSAPP_NUMBER } from "@/lib/constants";

/** TODO: replace with the real next booking slot. */
export const NEXT_SLOT = "[NEXT SLOT]";

export const ACCENT = "#ED1C24";
export const TAG_IDLE = "#8A877E";

export const SCRIMS = [0.18, 0.42, 0.4, 0.12, 0.42] as const;

export const WALLPAPERS = [
  "/os/wallpapers/wall-1.jpg",
  "/os/wallpapers/wall-2.jpg",
  "/os/wallpapers/wall-3.jpg",
  "/os/wallpapers/wall-4.jpg",
  "/os/wallpapers/wall-5.jpg",
] as const;

export const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}`;
export const MAIL_HREF = `mailto:${EMAIL}`;

export const MENU_LINKS = [
  { label: "Studio", href: "/", emphasis: true },
  { label: "Work", href: "/work", emphasis: false },
  { label: "Services", href: "#services-section", emphasis: false },
  { label: "About", href: "/about", emphasis: false },
  { label: "Contact", href: "/contact", emphasis: false },
] as const;

export type WindowId =
  | "branding"
  | "digital"
  | "software"
  | "fabrications"
  | "work"
  | "fidelity"
  | "roro";

export type OsRow = { readonly label: string; readonly value: string };

export type OsMedia =
  | { readonly kind: "image"; readonly src: string; readonly alt: string }
  | { readonly kind: "video"; readonly src: string; readonly label: string }
  | { readonly kind: "placeholder"; readonly label: string };

export type OsWindow = {
  readonly id: WindowId;
  readonly title: string;
  readonly description: string;
  readonly rows: readonly [OsRow, OsRow];
  readonly cta: string;
  readonly href: string;
  readonly media: OsMedia;
};

export const WINDOWS: Record<WindowId, OsWindow> = {
  branding: {
    id: "branding",
    title: "Branding",
    description:
      "Logos, visual systems, brand guidelines, print design and campaign direction, built to be unmistakable.",
    rows: [
      { label: "Logo and identity system", value: "Identity" },
      { label: "Brand guidelines", value: "System" },
    ],
    cta: "See branding work",
    href: "/work?cat=branding",
    media: {
      kind: "image",
      src: "/os/projects/branding.jpg",
      alt: "Fidelity Bank brand standards book, business card, envelope and colour swatches",
    },
  },
  digital: {
    id: "digital",
    title: "Digital",
    description:
      "Websites, web applications, portals and custom digital experiences, engineered for performance.",
    rows: [
      { label: "Marketing websites", value: "Web" },
      { label: "Web applications", value: "Product" },
    ],
    cta: "See digital work",
    href: "/work?cat=digital",
    media: {
      kind: "image",
      src: "/os/projects/digital.jpg",
      alt: "Chamber of Licensed Gold Buyers membership page shown on a phone",
    },
  },
  software: {
    id: "software",
    title: "Software",
    // TODO: draft copy, confirm before this leaves preview.
    description:
      "Custom business systems, dashboards and internal tools built around how your business actually runs. (TODO: draft copy, confirm with me)",
    rows: [
      { label: "Custom business systems", value: "Systems" },
      { label: "Dashboards and admin portals", value: "Internal tools" },
    ],
    cta: "See software work",
    // TODO: no software filter exists yet.
    href: "/work",
    media: {
      kind: "image",
      src: "/os/projects/software.jpg",
      alt: "Laptop and monitor showing code on a desk in a dark room",
    },
  },
  fabrications: {
    id: "fabrications",
    title: "Fabrications",
    description:
      "3D signage, environmental branding, reception walls and installations that make brands tangible.",
    rows: [
      { label: "3D signage and lettering", value: "Signage" },
      { label: "Illuminated signs", value: "Lighting" },
    ],
    cta: "See fabrications work",
    href: "/work?cat=fabrications",
    media: {
      kind: "image",
      src: "/os/projects/fabrications.jpg",
      alt: "Three steel-frame chairs with timber seats and backrests",
    },
  },
  work: {
    id: "work",
    title: "Selected Work",
    description: "Not only imagined, built properly.",
    rows: [
      { label: "Fidelity Bank Ghana", value: "Branding · 2024" },
      { label: "Roro Luxury Fittings", value: "Digital · 2026" },
    ],
    cta: "View all works",
    href: "/work",
    media: {
      kind: "placeholder",
      // TODO: Selected Work window media.
      label: "[Selected Work project image or video]",
    },
  },
  fidelity: {
    id: "fidelity",
    title: "Fidelity Bank Ghana",
    description:
      "Brand identity and logo development: a modern, confident identity built on clarity, trust and forward movement.",
    rows: [
      { label: "Discipline", value: "Branding" },
      { label: "Year", value: "2024" },
    ],
    cta: "View case study",
    href: "/work/fidelity-bank",
    media: {
      kind: "image",
      src: "/os/projects/fidelity.jpg",
      alt: "Fidelity Bank case study showing logo sketches, final mark, colours and typography",
    },
  },
  roro: {
    id: "roro",
    title: "Roro Luxury Fittings",
    // TODO: Roro project summary.
    description: "[Short project summary] (TODO)",
    rows: [
      { label: "Discipline", value: "Digital" },
      { label: "Year", value: "2026" },
    ],
    cta: "View project",
    href: "/work/roro-luxury-fittings",
    media: {
      kind: "video",
      src: "/os/projects/roro.mp4",
      label: "Roro Luxury Fittings website preview",
    },
  },
};

export const DESKTOP_ICONS: readonly {
  id: WindowId;
  name: string;
  kind: "folder" | "file";
}[] = [
  { id: "branding", name: "Branding", kind: "folder" },
  { id: "digital", name: "Digital", kind: "folder" },
  { id: "software", name: "Software", kind: "folder" },
  { id: "fabrications", name: "Fabrications", kind: "folder" },
  { id: "work", name: "Selected Work", kind: "folder" },
  { id: "fidelity", name: "Fidelity Bank.mp4", kind: "file" },
  { id: "roro", name: "Roro Fittings.mp4", kind: "file" },
];

export const MOBILE_TILES: readonly { name: string; href: string }[] = [
  { name: "Branding", href: "/work?cat=branding" },
  { name: "Digital", href: "/work?cat=digital" },
  // TODO: no software filter exists yet.
  { name: "Software", href: "/work" },
  { name: "Fabrications", href: "/work?cat=fabrications" },
  { name: "Selected Work", href: "/work" },
  { name: "About", href: "/about" },
  { name: "Clients", href: "#clients" },
  { name: "Contact", href: "/contact" },
];
