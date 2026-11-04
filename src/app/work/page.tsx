import { WorkPageClient } from "@/components/work/WorkPageClient";
import type { Metadata }  from "next";

export const metadata: Metadata = {
  title:       "Our Work",
  description: "Branding, digital products, ads and campaigns, and fabrications for clients across Ghana. See how Motivo builds ideas properly.",
  alternates:  { canonical: "https://thisismotivo.com/work" },
  openGraph: {
    title:       "Our Work | Motivo Studio",
    description: "Branding, digital products, ads and campaigns, and fabrications for clients across Ghana. See how Motivo builds ideas properly.",
    url:         "https://thisismotivo.com/work",
    images:      [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

interface Props {
  searchParams: Promise<{ cat?: string }>;
}

export default async function WorkPage({ searchParams }: Props) {
  const params = await searchParams;
  return <WorkPageClient initialCategory={params.cat ?? null} />;
}
