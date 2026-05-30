import Link from "next/link";
import { Clock, Headphones, Layers, NotebookPen } from "lucide-react";
import type { ContentItem } from "@/types/content";
import { contentHref, formatDate } from "@/lib/utils";
import { Badge } from "@/components/site/Badge";
import { TagPill } from "@/components/site/TagPill";

const iconByKind = {
  article: NotebookPen,
  lesson: Layers,
  podcast: Headphones,
};

export function ContentCard({ item }: { item: ContentItem }) {
  const Icon = iconByKind[item.kind];
  const href = contentHref(item.kind, item.slug);
  const meta =
    item.kind === "article"
      ? item.category
      : item.kind === "lesson"
        ? `${item.skill} / ${item.level}`
        : `S${item.season} / E${item.episode} / ${item.duration}`;

  return (
    <article className="group rounded-[8px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:border-amber-300/35 hover:bg-white/[0.065]">
      <div className="flex items-start gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-[8px] border border-amber-300/20 bg-amber-300/10 text-amber-200">
          <Icon aria-hidden="true" className="size-5" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{meta}</Badge>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <Clock aria-hidden="true" className="size-3.5" />
              {item.kind === "podcast" ? item.duration : item.readingTime}
            </span>
          </div>
          <h3 className="mt-4 text-lg font-semibold leading-6 text-white">
            <Link href={href} className="outline-none transition group-hover:text-amber-100 focus:text-amber-100">
              {item.title}
            </Link>
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">{item.description}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {item.tags.slice(0, 3).map((tag) => (
          <TagPill key={tag} tag={tag} />
        ))}
      </div>
      <p className="mt-5 text-xs font-medium text-slate-500">{formatDate(item.date)}</p>
    </article>
  );
}
