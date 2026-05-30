import Link from "next/link";
import { Clock, Headphones, Layers, NotebookPen } from "lucide-react";
import type { ContentItem } from "@/types/content";
import { contentHref, formatDate } from "@/lib/utils";
import { commonText, contentMeta, formatDateFa, formatReadingTimeFa, itemDescription, itemTitle } from "@/lib/i18n";
import { Badge } from "@/components/site/Badge";
import { LocalizedText } from "@/components/site/LocalizedText";
import { TagPill } from "@/components/site/TagPill";

const iconByKind = {
  article: NotebookPen,
  lesson: Layers,
  podcast: Headphones,
};

export function ContentCard({ item }: { item: ContentItem }) {
  const Icon = iconByKind[item.kind];
  const href = contentHref(item.kind, item.slug);
  const meta = contentMeta(item);
  const title = itemTitle(item);
  const description = itemDescription(item);
  const readingTime = item.kind === "podcast" ? { en: item.duration, fa: item.duration } : { en: item.readingTime, fa: formatReadingTimeFa(item.readingTime) };

  return (
    <article className="group rounded-[8px] border border-white/10 bg-white/[0.045] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:border-amber-300/35 hover:bg-white/[0.065]">
      <div className="flex items-start gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-[8px] border border-amber-300/20 bg-amber-300/10 text-amber-200">
          <Icon aria-hidden="true" className="size-5" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>
              <LocalizedText en={meta.en} fa={meta.fa} />
            </Badge>
            {item.kind === "podcast" && !item.audioAvailable ? (
              <span className="rounded-[6px] border border-slate-500/30 bg-slate-800/70 px-2 py-1 text-xs font-semibold text-slate-300">
                <LocalizedText en={commonText.audioSoon.en} fa={commonText.audioSoon.fa} />
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <Clock aria-hidden="true" className="size-3.5" />
              <LocalizedText en={readingTime.en} fa={readingTime.fa} />
            </span>
          </div>
          <h3 className="mt-4 text-lg font-semibold leading-6 text-white">
            <Link href={href} className="outline-none transition group-hover:text-amber-100 focus:text-amber-100">
              <LocalizedText en={title.en} fa={title.fa} />
            </Link>
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">
            <LocalizedText en={description.en} fa={description.fa} />
          </p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {item.tags.slice(0, 3).map((tag) => (
          <TagPill key={tag} tag={tag} />
        ))}
      </div>
      <p className="mt-5 text-xs font-medium text-slate-500">
        <LocalizedText en={formatDate(item.date)} fa={formatDateFa(item.date)} />
      </p>
    </article>
  );
}
