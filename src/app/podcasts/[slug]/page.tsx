import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAllPodcasts, getPodcastBySlug, getRelatedPodcasts } from "@/lib/content";
import { commonText, formatDateFa, itemBody, itemDescription, itemTitle, podcastLanguage } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";
import { AudioTranscript } from "@/components/audio/AudioTranscript";
import { ContactPanel } from "@/components/site/ContactPanel";
import { EduPocketPlayer } from "@/components/audio/EduPocketPlayer";
import { Container } from "@/components/site/Container";
import { FeaturedGrid } from "@/components/site/FeaturedGrid";
import { LocalizedText } from "@/components/site/LocalizedText";
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
  const title = itemTitle(episode);
  const description = itemDescription(episode);
  const body = itemBody(episode);
  const language = podcastLanguage(episode);

  return (
    <Container className="py-14">
      <Link href="/podcasts" className="inline-flex items-center gap-2 text-sm font-semibold text-amber-200 hover:text-amber-100">
        <ArrowLeft aria-hidden="true" className="size-4" />
        <LocalizedText en={commonText.backToPodcasts.en} fa={commonText.backToPodcasts.fa} />
      </Link>
      <article className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <div className="flex flex-wrap gap-2">
            {episode.tags.map((tag) => (
              <TagPill key={tag} tag={tag} />
            ))}
          </div>
          <p className="mt-6 text-sm font-semibold text-amber-200">
            <LocalizedText en={`Season ${episode.season}, Episode ${episode.episode}`} fa={`فصل ${episode.season}، اپیزود ${episode.episode}`} />
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-white sm:text-5xl">
            <LocalizedText en={title.en} fa={title.fa} />
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            <LocalizedText en={description.en} fa={description.fa} />
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-400">
            <span>
              <LocalizedText en={formatDate(episode.date)} fa={formatDateFa(episode.date)} />
            </span>
            {episode.updated ? (
              <span>
                <LocalizedText en={`Updated ${formatDate(episode.updated)}`} fa={`به روزشده ${formatDateFa(episode.updated)}`} />
              </span>
            ) : null}
            <span>{episode.duration}</span>
            <span>
              <LocalizedText en={language.en} fa={language.fa} />
            </span>
          </div>
        </div>
        <div className="space-y-5">
          <EduPocketPlayer title={title.en} titleFa={title.fa} audioSrc={episode.audioSrc} audioAvailable={episode.audioAvailable} />
          <AudioTranscript enabled={episode.transcript} title={title.en} titleFa={title.fa} />
        </div>
      </article>
      <section className="mx-auto mt-12 max-w-3xl rounded-[8px] border border-white/10 bg-white/[0.035] p-5 sm:p-8">
        <div className="lang-en">
          <MDXContent source={body.en} />
        </div>
        <div className="lang-fa">
          <MDXContent source={body.fa} />
        </div>
      </section>
      <ContactPanel context="podcast" className="mx-auto mt-10 max-w-3xl" />
      <section className="mt-16">
        <h2 className="mb-5 text-2xl font-semibold text-white">
          <LocalizedText en={commonText.relatedEpisodes.en} fa={commonText.relatedEpisodes.fa} />
        </h2>
        <FeaturedGrid
          items={related}
          emptyTitle={<LocalizedText en="No related episodes yet" fa="هنوز اپیزود مرتبطی نیست" />}
          emptyDescription={<LocalizedText en="More connected audio lessons will appear as EduPocket grows." fa="با رشد EduPocket، درس های صوتی مرتبط بیشتری اینجا می آیند." />}
        />
      </section>
    </Container>
  );
}
