import Link from "next/link";
import { Headphones } from "lucide-react";
import type { PodcastEpisode } from "@/types/content";
import { formatDateFa, itemDescription, itemTitle } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";
import { AudioWavePlaceholder } from "@/components/audio/AudioWavePlaceholder";
import { Badge } from "@/components/site/Badge";
import { LocalizedText } from "@/components/site/LocalizedText";
import { TagPill } from "@/components/site/TagPill";

export function AudioEpisodeCard({ episode }: { episode: PodcastEpisode }) {
  const title = itemTitle(episode);
  const description = itemDescription(episode);

  return (
    <article className="grid gap-5 rounded-[8px] border border-white/10 bg-white/[0.045] p-5 transition hover:border-amber-300/35 hover:bg-white/[0.065] sm:grid-cols-[11rem_1fr]">
      <div className="rounded-[8px] border border-white/10 bg-gradient-to-br from-indigo-500/30 via-slate-900 to-amber-400/20 p-4">
        <Headphones aria-hidden="true" className="size-7 text-amber-200" />
        <p className="mt-7 text-lg font-semibold leading-6 text-white">EduPocket Podcast</p>
        <p className="mt-1 text-xs text-slate-300">
          <LocalizedText en="by Ali Rad" fa="با علی راد" />
        </p>
        <AudioWavePlaceholder className="mt-5" />
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>
            <LocalizedText en={`Episode ${episode.episode}`} fa={`اپیزود ${episode.episode}`} />
          </Badge>
          <span className="text-xs text-slate-500">
            <LocalizedText en={formatDate(episode.date)} fa={formatDateFa(episode.date)} />
          </span>
          <span className="text-xs text-slate-500">{episode.duration}</span>
        </div>
        <h2 className="mt-4 text-xl font-semibold text-white">
          <Link href={`/podcasts/${episode.slug}`} className="transition hover:text-amber-100">
            <LocalizedText en={title.en} fa={title.fa} />
          </Link>
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          <LocalizedText en={description.en} fa={description.fa} />
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {episode.tags.map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>
      </div>
    </article>
  );
}
