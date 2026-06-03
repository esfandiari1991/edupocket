import type { Metadata } from "next";
import { getAllArticles } from "@/lib/content";
import { commonText } from "@/lib/i18n";
import { Container } from "@/components/site/Container";
import { DirectContactButtons } from "@/components/site/DirectContactButtons";
import { FeaturedGrid } from "@/components/site/FeaturedGrid";
import { LocalizedText } from "@/components/site/LocalizedText";
import { SectionHeading } from "@/components/site/SectionHeading";

export const metadata: Metadata = {
  title: "Articles",
  description: "Practical EduPocket articles about AI learning, teaching systems, study habits, and technology.",
  keywords: ["AI learning articles", "study systems", "teaching frameworks", "education technology"],
  alternates: {
    canonical: "/articles",
  },
  openGraph: {
    title: "EduPocket Articles",
    description: "Practical EduPocket articles about AI learning, teaching systems, study habits, and technology.",
    url: "/articles",
  },
  twitter: {
    card: "summary_large_image",
    title: "Articles | EduPocket",
    description: "Practical EduPocket articles about AI learning, teaching systems, study habits, and technology.",
  },
};

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <Container className="py-16">
      <SectionHeading
        level={1}
        title={<LocalizedText en="Articles" fa="مقاله‌ها" />}
        description={<LocalizedText en="Readable, practical notes for AI-assisted learning, teaching frameworks, study systems, and technology." fa="یادداشت‌های خواندنی و کاربردی درباره یادگیری با هوش مصنوعی، چارچوب‌های تدریس، سیستم‌های مطالعه و تکنولوژی." />}
        action={<DirectContactButtons showSecondary={false} />}
      />
      <FeaturedGrid
        items={articles}
        emptyTitle={<LocalizedText en={commonText.noArticles.en} fa={commonText.noArticles.fa} />}
        emptyDescription={<LocalizedText en={commonText.noArticlesDescription.en} fa={commonText.noArticlesDescription.fa} />}
      />
    </Container>
  );
}
