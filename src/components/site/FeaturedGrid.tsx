import type { ContentItem } from "@/types/content";
import { ContentCard } from "@/components/site/ContentCard";
import { EmptyState } from "@/components/site/EmptyState";

type FeaturedGridProps = {
  items: ContentItem[];
  emptyTitle: string;
  emptyDescription: string;
};

export function FeaturedGrid({ items, emptyTitle, emptyDescription }: FeaturedGridProps) {
  if (items.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <ContentCard key={`${item.kind}-${item.slug}`} item={item} />
      ))}
    </div>
  );
}
