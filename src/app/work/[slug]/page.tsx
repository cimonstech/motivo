import { projects }           from "@/data/projects";
import { CATEGORY_LABELS }    from "@/data/categories";
import { notFound }           from "next/navigation";
import { ProjectDetailClient } from "@/components/work/ProjectDetailClient";
import type { Metadata }      from "next";

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title:       project.name,
    description: `${project.summary} A ${CATEGORY_LABELS[project.category] ?? project.category} project by Motivo Studio, Accra Ghana (${project.year}).`,
    alternates:  { canonical: `https://thisismotivo.com/work/${project.slug}` },
    openGraph: {
      title:       `${project.name} | Motivo Studio`,
      description: project.summary,
      url:         `https://thisismotivo.com/work/${project.slug}`,
      images: [
        {
          url:    project.stripMedia.src,
          width:  1200,
          height: 630,
          alt:    `${project.name} - Motivo Studio`,
        },
      ],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const idx  = projects.findIndex((p) => p.slug === slug);
  const next = projects[(idx + 1) % projects.length];

  const projectSchema = {
    "@context": "https://schema.org",
    "@type":    "CreativeWork",
    name:       project.name,
    creator:    { "@id": "https://thisismotivo.com/#organization" },
    dateCreated: project.year,
    description: project.summary,
    image:      project.stripMedia.src,
    url:        `https://thisismotivo.com/work/${project.slug}`,
    genre:      CATEGORY_LABELS[project.category] ?? project.category,
    locationCreated: {
      "@type":           "Place",
      "addressLocality": "Accra",
      "addressCountry":  "GH",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(projectSchema).replace(/</g, "\\u003c"),
        }}
      />
      {/* Hide footer on detail pages */}
      <style>{`footer { display: none !important; }`}</style>
      <ProjectDetailClient project={project} nextProject={next} />
    </>
  );
}
