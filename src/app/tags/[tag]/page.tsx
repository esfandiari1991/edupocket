import type { Metadata } from "next";
import { getAllTags, getContentByTag, getTagLabel } from "@/lib/content";
import { slugify } from "@/lib/utils";
import { Container } from "@/components/site/Container";
import { FeaturedGrid } from "@/components/site/FeaturedGrid";
import { SectionHeading } from "@/components/site/SectionHeading";

type PageProps = {
  params: Promise<{ tag: string }>;
};

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag: slugify(tag) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params;
  const label = getTagLabel(tag);

  return {
    title: `Tag: ${label}`,
    description: `EduPocket content tagged ${label}.`,
  };
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params;
  const label = getTagLabel(tag);
  const items = getContentByTag(tag);

  return (
    <Container className="py-16">
      <SectionHeading
        title={`Tag: ${label}`}
        description="Connected articles, micro-lessons, and podcast episodes from the EduPocket library."
      />
      <FeaturedGrid
        items={items}
        emptyTitle="Nothing published for this tag"
        emptyDescription="This tag is ready for future EduPocket content."
      />
    </Container>
  );
}
