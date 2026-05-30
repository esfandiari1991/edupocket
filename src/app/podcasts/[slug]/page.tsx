import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAllPodcasts, getPodcastBySlug, getRelatedPodcasts } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { AudioTranscript } from "@/components/audio/AudioTranscript";
import { EduPocketPlayer } from "@/components/audio/EduPocketPlayer";
import { Container } from "@/components/site/Container";
import { FeaturedGrid } from "@/components/site/FeaturedGrid";
import { MDXContent } from "@/components/mdx/MDXContent";
import { TagPill } from "@/components/site/TagPill";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPodcasts().map((episode) => ({ slug: episode.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const episode = getPodcastBySlug(slug);
  if (!episode) return {};

  return {
    title: episode.title,
    description: episode.description,
    openGraph: {
      title: episode.title,
      description: episode.description,
      type: "article",
      publishedTime: episode.date,
      modifiedTime: episode.updated,
      tags: episode.tags,
    },
  };
}

export default async function PodcastPage({ params }: PageProps) {
  const { slug } = await params;
  const episode = getPodcastBySlug(slug);
  if (!episode) notFound();

  const related = getRelatedPodcasts(episode);

  return (
    <Container className="py-14">
      <Link href="/podcasts" className="inline-flex items-center gap-2 text-sm font-semibold text-amber-200 hover:text-amber-100">
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to podcasts
      </Link>
      <article className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <div className="flex flex-wrap gap-2">
            {episode.tags.map((tag) => (
              <TagPill key={tag} tag={tag} />
            ))}
          </div>
          <p className="mt-6 text-sm font-semibold text-amber-200">Season {episode.season}, Episode {episode.episode}</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-white sm:text-5xl">{episode.title}</h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">{episode.description}</p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-400">
            <span>{formatDate(episode.date)}</span>
            {episode.updated ? <span>Updated {formatDate(episode.updated)}</span> : null}
            <span>{episode.duration}</span>
            <span>{episode.language}</span>
          </div>
        </div>
        <div className="space-y-5">
          <EduPocketPlayer title={episode.title} audioSrc={episode.audioSrc} audioAvailable={episode.audioAvailable} />
          <AudioTranscript enabled={episode.transcript} title={episode.title} />
        </div>
      </article>
      <section className="mx-auto mt-12 max-w-3xl rounded-[8px] border border-white/10 bg-white/[0.035] p-5 sm:p-8">
        <MDXContent source={episode.body} />
      </section>
      <section className="mt-16">
        <h2 className="mb-5 text-2xl font-semibold text-white">Related episodes</h2>
        <FeaturedGrid
          items={related}
          emptyTitle="No related episodes yet"
          emptyDescription="More connected audio lessons will appear as EduPocket grows."
        />
      </section>
    </Container>
  );
}
