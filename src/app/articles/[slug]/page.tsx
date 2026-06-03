import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAllArticles, getArticleBySlug, getRelatedArticles } from "@/lib/content";
import { articleCategory, commonText, formatDateFa, formatReadingTimeFa, itemBody, itemDescription, itemTitle } from "@/lib/i18n";
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
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.description,
    keywords: article.tags,
    authors: [{ name: "Ali Esfandiari Rad", url: "/about" }],
    alternates: {
      canonical: `/articles/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      url: `/articles/${article.slug}`,
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
  const title = itemTitle(article);
  const description = itemDescription(article);
  const body = itemBody(article);
  const category = articleCategory(article);

  return (
    <>
      <ContentStructuredData article={article} />
      <Container className="py-14">
      <Link href="/articles" className="inline-flex items-center gap-2 text-sm font-semibold text-amber-200 hover:text-amber-100">
        <ArrowLeft aria-hidden="true" className="size-4" />
        <LocalizedText en={commonText.backToArticles.en} fa={commonText.backToArticles.fa} />
      </Link>
      <article className="mx-auto mt-10 max-w-3xl">
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag) => (
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
            <LocalizedText en={formatDate(article.date)} fa={formatDateFa(article.date)} />
          </span>
          {article.updated ? (
            <span>
              <LocalizedText en={`Updated ${formatDate(article.updated)}`} fa={`به‌روزشده ${formatDateFa(article.updated)}`} />
            </span>
          ) : null}
          <span>
            <LocalizedText en={article.readingTime} fa={formatReadingTimeFa(article.readingTime)} />
          </span>
          <span>
            <LocalizedText en={category.en} fa={category.fa} />
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
      <ContactPanel context="article" className="mx-auto mt-10 max-w-3xl" />
      <section className="mt-16">
        <h2 className="mb-5 text-2xl font-semibold text-white">
          <LocalizedText en={commonText.relatedArticles.en} fa={commonText.relatedArticles.fa} />
        </h2>
        <FeaturedGrid
          items={related}
          emptyTitle={<LocalizedText en="No related articles yet" fa="هنوز مقاله مرتبطی نیست" />}
          emptyDescription={<LocalizedText en="More connected reading will appear as EduPocket grows." fa="با رشد EduPocket، مطالعه‌های مرتبط بیشتری اینجا می‌آیند." />}
        />
      </section>
      </Container>
    </>
  );
}
