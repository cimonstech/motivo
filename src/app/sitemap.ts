import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://thisismotivo.com";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url:             baseUrl,
      lastModified:    new Date(),
      changeFrequency: "monthly",
      priority:        1.0,
    },
    {
      url:             `${baseUrl}/work`,
      lastModified:    new Date(),
      changeFrequency: "weekly",
      priority:        0.9,
    },
    {
      url:             `${baseUrl}/about`,
      lastModified:    new Date(),
      changeFrequency: "monthly",
      priority:        0.8,
    },
    {
      url:             `${baseUrl}/contact`,
      lastModified:    new Date(),
      changeFrequency: "monthly",
      priority:        0.7,
    },
  ];

  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url:             `${baseUrl}/work/${project.slug}`,
    lastModified:    new Date(),
    changeFrequency: "monthly" as const,
    priority:        0.6,
  }));

  return [...staticPages, ...projectPages];
}
