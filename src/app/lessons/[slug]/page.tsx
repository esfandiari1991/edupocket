import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAllLessons, getLessonBySlug, getRelatedLessons } from "@/lib/content";
import { commonText, formatDateFa, formatReadingTimeFa, itemBody, itemDescription, itemTitle, lessonLevel, lessonSkill } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";
import { ContactPanel } from "@/components/site/ContactPanel";
import { ContentStructuredData } from "@/components/site/ContentStructuredData";
import { Container } from "@/components/site/Container";
import { FeaturedGrid } from "@/components/site/FeaturedGrid";
import { LocalizedText } from "@/components/site/LocalizedText";
import { MDXContent } from "@/components/mdx/MDXContent";
import { TagPill } from "@/components/site/TagPill";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllLessons().map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);
  if (!lesson) return {};

  return {
    title: lesson.title,
    description: lesson.description,
    keywords: lesson.tags,
    authors: [{ name: "Ali Esfandiari Rad", url: "/about" }],
    alternates: {
      canonical: `/lessons/${lesson.slug}`,
    },
    openGraph: {
      title: lesson.title,
      description: lesson.description,
      type: "article",
      url: `/lessons/${lesson.slug}`,
      publishedTime: lesson.date,
      modifiedTime: lesson.updated,
      tags: lesson.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: lesson.title,
      description: lesson.description,
    },
  };
}

export default async function LessonPage({ params }: PageProps) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);
  if (!lesson) notFound();

  const related = getRelatedLessons(lesson);
  const title = itemTitle(lesson);
  const description = itemDescription(lesson);
  const body = itemBody(lesson);
  const skill = lessonSkill(lesson);
  const level = lessonLevel(lesson);

  return (
    <>
      <ContentStructuredData lesson={lesson} />
      <Container className="py-14">
      <Link href="/lessons" className="inline-flex items-center gap-2 text-sm font-semibold text-amber-200 hover:text-amber-100">
        <ArrowLeft aria-hidden="true" className="size-4" />
        <LocalizedText en={commonText.backToLessons.en} fa={commonText.backToLessons.fa} />
      </Link>
      <article className="mx-auto mt-10 max-w-3xl">
        <div className="flex flex-wrap gap-2">
          {lesson.tags.map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>
        <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl">
          <LocalizedText en={title.en} fa={title.fa} />
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-300">
          <LocalizedText en={description.en} fa={description.fa} />
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-400">
          <span>
            <LocalizedText en={formatDate(lesson.date)} fa={formatDateFa(lesson.date)} />
          </span>
          {lesson.updated ? (
            <span>
              <LocalizedText en={`Updated ${formatDate(lesson.updated)}`} fa={`به روزشده ${formatDateFa(lesson.updated)}`} />
            </span>
          ) : null}
          <span>
            <LocalizedText en={lesson.readingTime} fa={formatReadingTimeFa(lesson.readingTime)} />
          </span>
          <span>
            <LocalizedText en={skill.en} fa={skill.fa} />
          </span>
          <span>
            <LocalizedText en={level.en} fa={level.fa} />
          </span>
        </div>
        <div className="mt-10 rounded-[8px] border border-white/10 bg-white/[0.035] p-5 sm:p-8">
          <div className="lang-en">
            <MDXContent source={body.en} />
          </div>
          <div className="lang-fa">
            <MDXContent source={body.fa} />
          </div>
        </div>
      </article>
      <ContactPanel context="lesson" className="mx-auto mt-10 max-w-3xl" />
      <section className="mt-16">
        <h2 className="mb-5 text-2xl font-semibold text-white">
          <LocalizedText en={commonText.relatedLessons.en} fa={commonText.relatedLessons.fa} />
        </h2>
        <FeaturedGrid
          items={related}
          emptyTitle={<LocalizedText en="No related lessons yet" fa="هنوز درس مرتبطی نیست" />}
          emptyDescription={<LocalizedText en="More connected micro-lessons will appear as EduPocket grows." fa="با رشد EduPocket، درس های مرتبط بیشتری اینجا می آیند." />}
        />
      </section>
      </Container>
    </>
  );
}
