import type { Metadata } from "next";
import { getAllPodcasts, getFeaturedPodcasts } from "@/lib/content";
import { AudioEpisodeCard } from "@/components/audio/AudioEpisodeCard";
import { Container } from "@/components/site/Container";
import { EmptyState } from "@/components/site/EmptyState";
import { SectionHeading } from "@/components/site/SectionHeading";

export const metadata: Metadata = {
  title: "Podcasts",
  description: "EduPocket audio lessons and podcast notes for learning systems, English, AI, and teaching.",
};

export default function PodcastsPage() {
  const episodes = getAllPodcasts();
  const featured = getFeaturedPodcasts()[0];

  return (
    <Container className="py-16">
      <SectionHeading
        title="Podcasts"
        description="Audio lessons with notes, transcripts, and practical study prompts."
      />
      {featured ? (
        <div className="mb-8 rounded-[8px] border border-amber-300/20 bg-amber-300/10 p-4">
          <p className="mb-4 text-sm font-semibold text-amber-100">Featured episode</p>
          <AudioEpisodeCard episode={featured} />
        </div>
      ) : null}
      <div className="grid gap-4">
        {episodes.length > 0 ? (
          episodes.map((episode) => <AudioEpisodeCard key={episode.slug} episode={episode} />)
        ) : (
          <EmptyState title="No podcast episodes yet" description="Published audio lessons will appear here." />
        )}
      </div>
    </Container>
  );
}
