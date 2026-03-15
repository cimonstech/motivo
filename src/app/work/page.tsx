import { WorkPageClient } from "@/components/work/WorkPageClient";
import type { Metadata }  from "next";

export const metadata: Metadata = {
  title:       "Our Work",
  description: "Brand identity, digital products, campaigns and fabrications — built properly in Accra, Ghana.",
};

interface Props {
  searchParams: Promise<{ cat?: string }>;
}

export default async function WorkPage({ searchParams }: Props) {
  const params = await searchParams;
  return <WorkPageClient initialCategory={params.cat ?? null} />;
}
