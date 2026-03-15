import { projects }           from "@/data/projects";
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
  return {
    title:       project?.name ?? "Project",
    description: project?.summary,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const idx  = projects.findIndex((p) => p.slug === slug);
  const next = projects[(idx + 1) % projects.length];

  return (
    <>
      {/* Hide footer on detail pages */}
      <style>{`footer { display: none !important; }`}</style>
      <ProjectDetailClient project={project} nextProject={next} />
    </>
  );
}
