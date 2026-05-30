import type { Metadata } from "next";
import { getAllArticles } from "@/lib/content";
import { Container } from "@/components/site/Container";
import { FeaturedGrid } from "@/components/site/FeaturedGrid";
import { SectionHeading } from "@/components/site/SectionHeading";

export const metadata: Metadata = {
  title: "Articles",
  description: "Practical EduPocket articles about AI learning, teaching systems, study habits, and technology.",
};

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <Container className="py-16">
      <SectionHeading
        title="Articles"
        description="Readable, practical notes for AI-assisted learning, teaching frameworks, study systems, and technology."
      />
      <FeaturedGrid
        items={articles}
        emptyTitle="No articles yet"
        emptyDescription="Published articles will appear here when the EduPocket library grows."
      />
    </Container>
  );
}
