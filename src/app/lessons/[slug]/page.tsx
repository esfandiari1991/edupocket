import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAllLessons, getLessonBySlug, getRelatedLessons } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { Container } from "@/components/site/Container";
import { FeaturedGrid } from "@/components/site/FeaturedGrid";
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
    openGraph: {
      title: lesson.title,
      description: lesson.description,
      type: "article",
      publishedTime: lesson.date,
      modifiedTime: lesson.updated,
      tags: lesson.tags,
    },
  };
}

export default async function LessonPage({ params }: PageProps) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);
  if (!lesson) notFound();

  const related = getRelatedLessons(lesson);

  return (
    <Container className="py-14">
      <Link href="/lessons" className="inline-flex items-center gap-2 text-sm font-semibold text-amber-200 hover:text-amber-100">
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to lessons
      </Link>
      <article className="mx-auto mt-10 max-w-3xl">
        <div className="flex flex-wrap gap-2">
          {lesson.tags.map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>
        <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl">{lesson.title}</h1>
        <p className="mt-5 text-lg leading-8 text-slate-300">{lesson.description}</p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-400">
          <span>{formatDate(lesson.date)}</span>
          {lesson.updated ? <span>Updated {formatDate(lesson.updated)}</span> : null}
          <span>{lesson.readingTime}</span>
          <span>{lesson.skill}</span>
          <span>{lesson.level}</span>
        </div>
        <div className="mt-10 rounded-[8px] border border-white/10 bg-white/[0.035] p-5 sm:p-8">
          <MDXContent source={lesson.body} />
        </div>
      </article>
      <section className="mt-16">
        <h2 className="mb-5 text-2xl font-semibold text-white">Related lessons</h2>
        <FeaturedGrid
          items={related}
          emptyTitle="No related lessons yet"
          emptyDescription="More connected micro-lessons will appear as EduPocket grows."
        />
      </section>
    </Container>
  );
}
