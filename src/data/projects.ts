import { r2 } from "@/lib/r2";

export interface Project {
  slug:       string;
  name:       string;
  category:   "brands" | "digital" | "campaigns" | "fabrications";
  client:     string;
  year:       string;
  summary:    string;
  stripMedia: { type: "image" | "video" | "webp"; src: string };
  caseImages: string[];
  liveUrl?:   string;
  featured:   boolean;
  homepageMedia?: string;
}

export const projects: Project[] = [
  {
    slug:          "fidelity-bank",
    name:          "Fidelity Bank Ghana",
    category:      "brands",
    client:        "Fidelity Bank Ghana",
    year:          "2024",
    summary:       "Full brand identity system for one of Ghana's leading commercial banks.",
    stripMedia:    { type: "webp", src: r2("homepage/fidelity.webp") },
    caseImages:    Array.from({ length: 5 }, (_, i) => r2(`work/fidelity/case-${i + 1}.jpg`)),
    featured:      true,
    homepageMedia: r2("homepage/fidelity.webp"),
  },
  {
    slug:          "clgb",
    name:          "Ghana Chamber of Licensed Gold Buyers",
    category:      "digital",
    client:        "CLGB",
    year:          "2024",
    summary:       "Brand identity system and full-stack member portal for Ghana's gold trading regulatory body.",
    stripMedia:    { type: "webp", src: r2("homepage/CLGB.webp") },
    caseImages:    Array.from({ length: 5 }, (_, i) => r2(`work/clgb/case-${i + 1}.jpg`)),
    liveUrl:       "https://goldchamber.vercel.app",
    featured:      true,
    homepageMedia: r2("homepage/CLGB.webp"),
  },
  {
    slug:       "coke",
    name:       "Coca-Cola",
    category:   "campaigns",
    client:     "Coca-Cola Ghana",
    year:       "2024",
    summary:    "Creative campaign direction and brand activation for Coca-Cola Ghana.",
    stripMedia: { type: "webp", src: r2("homepage/coke.webp") },
    caseImages: Array.from({ length: 5 }, (_, i) => r2(`work/coke/case-${i + 1}.jpg`)),
    featured:   false,
  },
  {
    slug:       "guinness",
    name:       "Guinness",
    category:   "campaigns",
    client:     "Guinness Ghana",
    year:       "2024",
    summary:    "Creative campaign direction and brand activation for Guinness Ghana.",
    stripMedia: { type: "webp", src: r2("homepage/guiness.webp") },
    caseImages: Array.from({ length: 5 }, (_, i) => r2(`work/guinness/case-${i + 1}.jpg`)),
    featured:   false,
  },
  {
    slug:          "accralions",
    name:          "Accralions",
    category:      "brands",
    client:        "Accralions",
    year:          "2024",
    summary:       "Brand identity system built for a bold Accra-rooted brand.",
    stripMedia:    { type: "webp", src: r2("homepage/accralions.webp") },
    caseImages:    Array.from({ length: 5 }, (_, i) => r2(`work/accralions/case-${i + 1}.jpg`)),
    featured:      true,
    homepageMedia: r2("homepage/accralions.webp"),
  },
  {
    slug:       "tesoro",
    name:       "Tesoro",
    category:   "brands",
    client:     "Tesoro",
    year:       "2024",
    summary:    "Premium brand identity crafted for Tesoro — a refined visual system built for a luxury chocolate and confectionery brand.",
    stripMedia: { type: "webp", src: r2("homepage/tesoro.webp") },
    caseImages: [
      r2("homepage/works/Tesoro/TESORO-01.jpg"),
      r2("homepage/works/Tesoro/TESORO-02-01.jpg"),
      r2("homepage/works/Tesoro/TESORO-03.jpg"),
      r2("homepage/works/Tesoro/TESORO-04.jpg"),
      r2("homepage/works/Tesoro/TESORO-05.jpg"),
      r2("homepage/works/Tesoro/TESORO-06.jpg"),
      r2("homepage/works/Tesoro/TESORO-Chocolate-Box-1.JPG"),
      r2("homepage/works/Tesoro/TESORO-Chocolate-Box-2.JPG"),
    ],
    featured:   false,
  },
  {
    slug:       "logofolio",
    name:       "Logofolio",
    category:   "brands",
    client:     "Various",
    year:       "2024",
    summary:    "A curated collection of logo marks and brand identities created for clients across Ghana.",
    stripMedia: { type: "webp", src: r2("homepage/logofolio.webp") },
    caseImages: Array.from({ length: 5 }, (_, i) => r2(`work/logofolio/case-${i + 1}.jpg`)),
    featured:   false,
  },
  {
    slug:       "motivo-chair",
    name:       "Motivo Chair",
    category:   "fabrications",
    client:     "Motivo",
    year:       "2024",
    summary:    "A custom-fabricated furniture piece — where design thinking meets physical making.",
    stripMedia: { type: "webp", src: r2("homepage/motivochair.webp") },
    caseImages: Array.from({ length: 5 }, (_, i) => r2(`work/motivochair/case-${i + 1}.jpg`)),
    featured:   false,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
