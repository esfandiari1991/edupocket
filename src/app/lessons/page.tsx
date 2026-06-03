import type { Metadata } from "next";
import { getAllLessons } from "@/lib/content";
import { commonText } from "@/lib/i18n";
import { Container } from "@/components/site/Container";
import { DirectContactButtons } from "@/components/site/DirectContactButtons";
import { FeaturedGrid } from "@/components/site/FeaturedGrid";
import { LocalizedText } from "@/components/site/LocalizedText";
import { SectionHeading } from "@/components/site/SectionHeading";

export const metadata: Metadata = {
  title: "Lessons",
  description: "EduPocket micro-lessons for English, IELTS, TOEFL, study skills, AI learning, and practical frameworks.",
  keywords: ["English micro-lessons", "IELTS lessons", "TOEFL lessons", "study skills", "AI learning"],
  alternates: {
    canonical: "/lessons",
  },
  openGraph: {
    title: "EduPocket Lessons",
    description: "EduPocket micro-lessons for English, IELTS, TOEFL, study skills, AI learning, and practical frameworks.",
    url: "/lessons",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lessons | EduPocket",
    description: "EduPocket micro-lessons for English, IELTS, TOEFL, study skills, AI learning, and practical frameworks.",
  },
};

export default function LessonsPage() {
  const lessons = getAllLessons();

  return (
    <Container className="py-16">
      <SectionHeading
        level={1}
        title={<LocalizedText en="Lessons" fa="درس‌ها" />}
        description={<LocalizedText en="Short, structured micro-lessons that turn a topic into a repeatable learning move." fa="درس‌های کوتاه و ساختارمند که هر موضوع را به یک حرکت قابل تکرار تبدیل می‌کنند." />}
        action={<DirectContactButtons showSecondary={false} />}
      />
      <FeaturedGrid
        items={lessons}
        emptyTitle={<LocalizedText en={commonText.noLessons.en} fa={commonText.noLessons.fa} />}
        emptyDescription={<LocalizedText en={commonText.noLessonsDescription.en} fa={commonText.noLessonsDescription.fa} />}
      />
    </Container>
  );
}
