import type { Metadata } from "next";
import { getAllTags, getContentByTag, getTagLabel } from "@/lib/content";
import { tagLabel as localizedTagLabel } from "@/lib/i18n";
import { slugify } from "@/lib/utils";
import { Container } from "@/components/site/Container";
import { DirectContactButtons } from "@/components/site/DirectContactButtons";
import { FeaturedGrid } from "@/components/site/FeaturedGrid";
import { LocalizedText } from "@/components/site/LocalizedText";
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
  const localizedLabel = localizedTagLabel(label);
  const items = getContentByTag(tag);

  return (
    <Container className="py-16">
      <SectionHeading
        title={<LocalizedText en={`Tag: ${localizedLabel.en}`} fa={`برچسب: ${localizedLabel.fa}`} />}
        description={<LocalizedText en="Connected articles, micro-lessons, and podcast episodes from the EduPocket library." fa="مقاله ها، درس های کوتاه و اپیزودهای مرتبط از کتابخانه EduPocket." />}
        action={<DirectContactButtons showSecondary={false} />}
      />
      <FeaturedGrid
        items={items}
        emptyTitle={<LocalizedText en="Nothing published for this tag" fa="برای این برچسب هنوز چیزی منتشر نشده" />}
        emptyDescription={<LocalizedText en="This tag is ready for future EduPocket content." fa="این برچسب برای محتوای آینده EduPocket آماده است." />}
      />
    </Container>
  );
}
