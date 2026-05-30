import type { Metadata } from "next";
import { getAllLessons } from "@/lib/content";
import { Container } from "@/components/site/Container";
import { FeaturedGrid } from "@/components/site/FeaturedGrid";
import { SectionHeading } from "@/components/site/SectionHeading";

export const metadata: Metadata = {
  title: "Lessons",
  description: "EduPocket micro-lessons for English, IELTS, TOEFL, study skills, AI learning, and practical frameworks.",
};

export default function LessonsPage() {
  const lessons = getAllLessons();

  return (
    <Container className="py-16">
      <SectionHeading
        title="Lessons"
        description="Short, structured micro-lessons that turn a topic into a repeatable learning move."
      />
      <FeaturedGrid
        items={lessons}
        emptyTitle="No lessons yet"
        emptyDescription="Published micro-lessons will appear here."
      />
    </Container>
  );
}
