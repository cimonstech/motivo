import { r2 } from "@/lib/r2";

export interface Service {
  id:          string;
  num:         string;
  name:        string;
  tag?:        string;
  description: string;
  tags:        string[];
  items:       string[];
  workSlug:    string;
  accentColor: string;
  thumbnail:   string;
}

export const services: Service[] = [
  {
    id:          "branding",
    num:         "01",
    name:        "Branding",
    tag:         "Most popular",
    description: "Logos, visual systems, brand guidelines, print design, and campaign direction - built to be unmistakable.",
    tags:        ["Logos", "Systems", "Print"],
    items:       [
      "Logo & identity system",
      "Brand guidelines",
      "Print & collateral",
      "Campaign direction",
    ],
    workSlug:    "branding",
    accentColor: "#ED1C24",
    thumbnail:   r2("homepage/accralions.webp"),
  },
  {
    id:          "digital",
    num:         "02",
    name:        "Digital",
    description: "Websites, web applications, portals, and custom digital experiences - engineered for performance.",
    tags:        ["Websites", "Web Apps", "Portals"],
    items:       [
      "Marketing websites",
      "Web applications",
      "Member portals",
      "E-commerce",
      "CMS & dashboards",
    ],
    workSlug:    "digital",
    accentColor: "#ED1C24",
    thumbnail:   r2("homepage/CLGB.webp"),
  },
  {
    id:          "ads-campaigns",
    num:         "03",
    name:        "Ads & Campaigns",
    description: "Creative campaign strategy, art direction, motion graphics, and launch assets that make people stop.",
    tags:        ["Creative", "Motion", "OOH"],
    items:       [
      "Campaign strategy",
      "Art direction",
      "Motion & video",
      "OOH & print",
      "Social content",
    ],
    workSlug:    "ads-campaigns",
    accentColor: "#ED1C24",
    thumbnail:   r2("homepage/guiness.webp"),
  },
  {
    id:          "fabrications",
    num:         "04",
    name:        "Fabrications",
    description: "3D signage, environmental branding, reception walls, and physical installations that make brands tangible.",
    tags:        ["3D Signage", "Environmental"],
    items:       [
      "3D signage & lettering",
      "Illuminated signs",
      "Reception branding",
      "Wayfinding systems",
      "Event installations",
    ],
    workSlug:    "fabrications",
    accentColor: "#ED1C24",
    thumbnail:   r2("homepage/motivochair.webp"),
  },
];
