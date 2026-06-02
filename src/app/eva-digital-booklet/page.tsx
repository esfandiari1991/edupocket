import type { Metadata } from "next";
import { EvaBookletGateway } from "@/components/eva/EvaBookletGateway";

export const metadata: Metadata = {
  title: "Eva Digital Booklet",
  description: "A private EduPocket digital booklet gateway for structured IELTS and TOEFL-style reading and writing practice.",
  keywords: ["Eva Digital Booklet", "IELTS writing practice", "TOEFL reading practice", "private English booklet", "EduPocket"],
  alternates: {
    canonical: "/eva-digital-booklet",
  },
  openGraph: {
    title: "Eva Digital Booklet | EduPocket",
    description: "A quiet private study portal for structured IELTS/TOEFL-style reading and writing practice.",
    url: "/eva-digital-booklet",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eva Digital Booklet | EduPocket",
    description: "A quiet private study portal for structured IELTS/TOEFL-style reading and writing practice.",
  },
};

type EvaBookletPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function EvaBookletPage({ searchParams }: EvaBookletPageProps) {
  const params = await searchParams;

  return <EvaBookletGateway loginError={params.error} />;
}

