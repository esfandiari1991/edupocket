import type { Metadata } from "next";
import { getAllPodcasts, getFeaturedPodcasts } from "@/lib/content";
import { commonText } from "@/lib/i18n";
import { AudioEpisodeCard } from "@/components/audio/AudioEpisodeCard";
import { Container } from "@/components/site/Container";
import { DirectContactButtons } from "@/components/site/DirectContactButtons";
import { EmptyState } from "@/components/site/EmptyState";
import { LocalizedText } from "@/components/site/LocalizedText";
import { SectionHeading } from "@/components/site/SectionHeading";

export const metadata: Metadata = {
  title: "Podcasts",
  description: "EduPocket audio lessons and podcast notes for learning systems, English, AI, and teaching.",
  alternates: {
    canonical: "/podcasts",
  },
  openGraph: {
    title: "EduPocket Podcasts",
    description: "EduPocket audio lessons and podcast notes for learning systems, English, AI, and teaching.",
    url: "/podcasts",
  },
};

export default function PodcastsPage() {
  const episodes = getAllPodcasts();
  const featured = getFeaturedPodcasts()[0];

  return (
    <Container className="py-16">
      <SectionHeading
        title={<LocalizedText en="Podcasts" fa="پادکست ها" />}
        description={<LocalizedText en="Podcast notes, transcripts, and practical study prompts. Episodes without audio are marked clearly until the files are attached." fa="یادداشت پادکست، راهنمای شنیدن و تمرین های کاربردی. اپیزودهایی که هنوز فایل صوتی ندارند، شفاف با وضعیت به زودی مشخص شده اند." />}
        action={<DirectContactButtons showSecondary={false} />}
      />
      {featured ? (
        <div className="mb-8 rounded-[8px] border border-amber-300/20 bg-amber-300/10 p-4">
          <p className="mb-4 text-sm font-semibold text-amber-100">
            <LocalizedText en={commonText.featuredEpisode.en} fa={commonText.featuredEpisode.fa} />
          </p>
          <AudioEpisodeCard episode={featured} />
        </div>
      ) : null}
      <div className="grid gap-4">
        {episodes.length > 0 ? (
          episodes.map((episode) => <AudioEpisodeCard key={episode.slug} episode={episode} />)
        ) : (
          <EmptyState
            title={<LocalizedText en={commonText.noPodcasts.en} fa={commonText.noPodcasts.fa} />}
            description={<LocalizedText en={commonText.noPodcastsDescription.en} fa={commonText.noPodcastsDescription.fa} />}
          />
        )}
      </div>
    </Container>
  );
}
