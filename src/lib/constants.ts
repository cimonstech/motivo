export const R2_BASE = (process.env.NEXT_PUBLIC_R2_BASE_URL ?? "").replace(
  /\/+$/,
  ""
);

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://thisismotivo.com";

export const WHATSAPP_NUMBER = "+233240639403";
export const EMAIL = "hello@thisismotivo.com";
export const STUDIO_LOCATION = "Accra, Ghana";

export const NAV_LINKS = [
  { label: "Home",    href: "/" },
  { label: "Work",    href: "/work" },
  { label: "About",   href: "/about" },
  { label: "Contact", href: "/contact" },
];
