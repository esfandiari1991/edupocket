import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAllArticles, getArticleBySlug, getRelatedArticles } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { Container } from "@/components/site/Container";
import { FeaturedGrid } from "@/components/site/FeaturedGrid";
import { MDXContent } from "@/components/mdx/MDXContent";
import { TagPill } from "@/components/site/TagPill";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.date,
      modifiedTime: article.updated,
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = getRelatedArticles(article);

  return (
    <Container className="py-14">
      <Link href="/articles" className="inline-flex items-center gap-2 text-sm font-semibold text-amber-200 hover:text-amber-100">
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to articles
      </Link>
      <article className="mx-auto mt-10 max-w-3xl">
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>
        <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl">{article.title}</h1>
        <p className="mt-5 text-lg leading-8 text-slate-300">{article.description}</p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-400">
          <span>{formatDate(article.date)}</span>
          {article.updated ? <span>Updated {formatDate(article.updated)}</span> : null}
          <span>{article.readingTime}</span>
          <span>{article.category}</span>
        </div>
        <div className="mt-10 rounded-[8px] border border-white/10 bg-white/[0.035] p-5 sm:p-8">
          <MDXContent source={article.body} />
        </div>
      </article>
      <section className="mt-16">
        <h2 className="mb-5 text-2xl font-semibold text-white">Related articles</h2>
        <FeaturedGrid
          items={related}
          emptyTitle="No related articles yet"
          emptyDescription="More connected reading will appear as EduPocket grows."
        />
      </section>
    </Container>
  );
}
