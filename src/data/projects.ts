import { r2 } from "@/lib/r2";

export type Category =
  | "branding"
  | "digital"
  | "ads-campaigns"
  | "fabrications";

export interface Project {
  slug:         string;
  name:         string;
  category:     Category;           // primary category (for filtering)
  tags:         string[];           // all disciplines (for display)
  client:       string;
  year:         string;
  challenge:    string;
  insight:      string;
  solution:     string;
  impact:       string;
  summary:      string;             // short version for cards/meta
  stripMedia:   { type: "image" | "video" | "webp"; src: string };
  caseImages:   string[];
  liveUrl?:     string;
  featured:     boolean;
}

export const projects: Project[] = [
  {
    slug:     "fidelity-bank",
    name:     "Fidelity Bank Ghana",
    category: "branding",
    tags:     ["Branding", "Identity"],
    client:   "Fidelity Bank Ghana",
    year:     "2024",
    challenge: "Build a brand identity system that communicates trust, accessibility, and forward-thinking for one of Ghana's leading commercial banks.",
    insight:   "Banking brands earn trust through consistency and clarity, not complexity.",
    solution:  "MOTIVO developed a full brand identity system covering logo, visual language, typography, colour, and print collateral built for both digital and physical environments.",
    impact:    "A cohesive identity system that positions Fidelity Bank as modern, credible, and approachable across every touchpoint.",
    summary:   "Full brand identity system for one of Ghana's leading commercial banks.",
    stripMedia:  { type: "webp", src: r2("homepage/fidelity.webp") },
    caseImages:  Array.from({ length: 5 }, (_, i) => r2(`work/fidelity/case-${i + 1}.jpg`)),
    featured:    true,
  },
  {
    slug:     "clgb",
    name:     "Ghana Chamber of Licensed Gold Buyers",
    category: "digital",
    tags:     ["Digital", "Branding", "Web App"],
    client:   "CLGB",
    year:     "2024",
    challenge: "Design and build a digital platform for Ghana's gold trading regulatory body that handles member management, compliance, and public communication.",
    insight:   "Regulatory bodies need digital tools that project authority while remaining genuinely usable.",
    solution:  "MOTIVO created a dramatic brand identity system and a full-stack member portal with admin approval workflows, PDF certificate generation, live gold prices, and a support ticket system.",
    impact:    "A unified brand and platform that positions CLGB as a credible, modern regulatory institution in Ghana's gold sector.",
    summary:   "Brand identity and full-stack member portal for Ghana's gold trading regulatory body.",
    stripMedia:  { type: "webp", src: r2("homepage/CLGB.webp") },
    caseImages:  Array.from({ length: 5 }, (_, i) => r2(`work/clgb/case-${i + 1}.jpg`)),
    liveUrl:     "https://goldchamber.vercel.app",
    featured:    true,
  },
  {
    slug:     "coke",
    name:     "Coca-Cola",
    category: "ads-campaigns",
    tags:     ["Ads & Campaigns", "Outdoor", "Design"],
    client:   "Coca-Cola Ghana",
    year:     "2024",
    challenge: "Create a billboard campaign that communicates Coca-Cola's platform of happiness and shared moments while standing out in busy outdoor environments.",
    insight:   "Coca-Cola's strongest connection with audiences lies in everyday joyful experiences: meals, gatherings, and celebrations.",
    solution:  "MOTIVO designed vibrant outdoor visuals using energetic illustrations, expressive colour palettes, and lifestyle storytelling to show Coca-Cola as a natural part of social moments.",
    impact:    "The campaign translated brand emotion into compelling outdoor storytelling, reinforcing Coca-Cola's message of positivity and shared happiness.",
    summary:   "Outdoor billboard campaign built around happiness, colour, and everyday Ghanaian moments.",
    stripMedia:  { type: "webp", src: r2("homepage/coke.webp") },
    caseImages:  Array.from({ length: 5 }, (_, i) => r2(`work/coke/case-${i + 1}.jpg`)),
    featured:    false,
  },
  {
    slug:     "guinness",
    name:     "Guinness",
    category: "ads-campaigns",
    tags:     ["Ads & Campaigns", "Concept", "Outdoor"],
    client:   "Concept Campaign for Guinness",
    year:     "2018",
    challenge: "Develop an outdoor billboard concept that goes beyond traditional advertising to capture attention and spark conversation.",
    insight:   "Outdoor advertising is most powerful when it becomes an unexpected visual experience.",
    solution:  "MOTIVO designed a dramatic 3D billboard illusion where Guinness appears to emerge from the billboard frame, using bold colour contrasts and minimal messaging.",
    impact:    "The concept transforms the billboard into memorable brand theatre, encouraging social media sharing and stronger brand recall.",
    summary:   "A 3D billboard concept that turns outdoor advertising into an unexpected visual experience.",
    stripMedia:  { type: "webp", src: r2("homepage/guiness.webp") },
    caseImages:  Array.from({ length: 5 }, (_, i) => r2(`work/guinness/case-${i + 1}.jpg`)),
    featured:    false,
  },
  {
    slug:     "accralions",
    name:     "Accra Lions FC",
    category: "branding",
    tags:     ["Branding", "Fabrications", "Environmental"],
    client:   "Accra Lions Football Club",
    year:     "2025",
    challenge: "Strengthen the club's identity through highly visible environmental and vehicle branding.",
    insight:   "A strong visual presence builds recognition, pride, and connection with supporters.",
    solution:  "MOTIVO created bold architectural signage for the facility and transformed the team bus into a mobile extension of the club's identity with dynamic graphics and large typography.",
    impact:    "The project establishes a unified and highly recognizable brand presence for the club both on the road and at its home facility.",
    summary:   "Facility branding and team bus design for Accra Lions Football Club.",
    stripMedia:  { type: "webp", src: r2("homepage/accralions.webp") },
    caseImages:  Array.from({ length: 5 }, (_, i) => r2(`work/accralions/case-${i + 1}.jpg`)),
    featured:    true,
  },
  {
    slug:     "tesoro",
    name:     "TESORO",
    category: "branding",
    tags:     ["Branding", "Packaging", "Identity"],
    client:   "TESORO Fine Artisanal Chocolate",
    year:     "2024",
    challenge: "Design a premium brand identity that communicates craftsmanship and indulgence for an artisanal chocolate brand.",
    insight:   "Luxury chocolate brands rely heavily on packaging to convey quality and authenticity.",
    solution:  "MOTIVO created a cocoa-inspired emblem and rich gold-and-cocoa packaging system for bars and gift boxes.",
    impact:    "The refined visual system enhances shelf appeal and positions TESORO as a premium artisanal chocolate brand.",
    summary:   "Premium brand identity and packaging system for a luxury artisanal chocolate brand.",
    stripMedia:  { type: "webp", src: r2("homepage/tesoro.webp") },
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
    featured:    false,
  },
  {
    slug:     "logofolio",
    name:     "Logofolio",
    category: "branding",
    tags:     ["Branding", "Identity", "Logo Design"],
    client:   "Various",
    year:     "2024",
    challenge: "Create distinctive logo marks for a diverse range of clients across industries in Ghana.",
    insight:   "A great logo works at any size, in any context, and communicates without explanation.",
    solution:  "A curated collection of logo marks and brand identities created across multiple client engagements, each built on a distinct visual idea.",
    impact:    "A body of work that demonstrates range, craft, and the ability to create memorable marks across very different categories.",
    summary:   "A curated collection of logo marks and brand identities created for clients across Ghana.",
    stripMedia:  { type: "webp", src: r2("homepage/logofolio.webp") },
    caseImages:  Array.from({ length: 5 }, (_, i) => r2(`work/logofolio/case-${i + 1}.jpg`)),
    featured:    false,
  },
  {
    slug:     "outline-chair",
    name:     "Outline Chair",
    category: "fabrications",
    tags:     ["Fabrications", "Product Design", "Furniture"],
    client:   "Private Commission",
    year:     "2023",
    challenge: "Design a unique yet affordable chair using locally available materials.",
    insight:   "Simplicity and thoughtful craftsmanship can elevate everyday materials into elegant objects.",
    solution:  "MOTIVO combined locally sourced wood with slender iron rods to create a minimalist yet sculptural structure.",
    impact:    "The piece demonstrates how functional design and material efficiency can produce contemporary furniture with strong visual identity.",
    summary:   "A minimalist chair combining locally sourced wood and iron rods for a private commission.",
    stripMedia:  { type: "webp", src: r2("homepage/motivochair.webp") },
    caseImages:  Array.from({ length: 5 }, (_, i) => r2(`work/chair/case-${i + 1}.jpg`)),
    featured:    false,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
