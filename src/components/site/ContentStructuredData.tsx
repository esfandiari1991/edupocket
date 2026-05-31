import { siteConfig } from "@/lib/site";
import type { Article, Lesson, PodcastEpisode } from "@/types/content";

function safeJson(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function absoluteUrl(path: string) {
  const base = siteConfig.canonicalUrl.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function tagThings(tags: string[]) {
  return tags.map((tag) => ({ "@type": "Thing", name: tag }));
}

function breadcrumb(path: string, collectionName: string, collectionPath: string, title: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "EduPocket", item: siteConfig.canonicalUrl },
      { "@type": "ListItem", position: 2, name: collectionName, item: absoluteUrl(collectionPath) },
      { "@type": "ListItem", position: 3, name: title, item: absoluteUrl(path) },
    ],
  };
}

function isoDuration(duration: string) {
  const parts = duration.split(":").map((part) => Number(part));
  if (parts.some((part) => Number.isNaN(part))) return undefined;

  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return `PT${minutes ? `${minutes}M` : ""}${seconds}S`;
  }

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return `PT${hours ? `${hours}H` : ""}${minutes ? `${minutes}M` : ""}${seconds}S`;
  }

  return undefined;
}

type ContentStructuredDataProps = {
  article?: Article;
  lesson?: Lesson;
  episode?: PodcastEpisode;
};

export function ContentStructuredData({ article, lesson, episode }: ContentStructuredDataProps) {
  const base = siteConfig.canonicalUrl.replace(/\/$/, "");

  if (article) {
    const path = `/articles/${article.slug}`;
    const data = [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": `${base}${path}#article`,
        headline: article.title,
        alternativeHeadline: article.faTitle,
        description: article.description,
        image: `${base}/opengraph-image`,
        datePublished: article.date,
        dateModified: article.updated ?? article.date,
        author: { "@id": `${base}/#person` },
        publisher: { "@id": `${base}/#organization` },
        mainEntityOfPage: absoluteUrl(path),
        articleSection: article.category,
        keywords: article.tags.join(", "),
        about: tagThings(article.tags),
        inLanguage: ["en", "fa"],
      },
      breadcrumb(path, "Articles", "/articles", article.title),
    ];

    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(data) }} />;
  }

  if (lesson) {
    const path = `/lessons/${lesson.slug}`;
    const data = [
      {
        "@context": "https://schema.org",
        "@type": "LearningResource",
        "@id": `${base}${path}#learning-resource`,
        name: lesson.title,
        alternateName: lesson.faTitle,
        description: lesson.description,
        url: absoluteUrl(path),
        datePublished: lesson.date,
        dateModified: lesson.updated ?? lesson.date,
        author: { "@id": `${base}/#person` },
        provider: { "@id": `${base}/#organization` },
        learningResourceType: "Micro-lesson",
        educationalLevel: lesson.level,
        teaches: lesson.skill,
        keywords: lesson.tags.join(", "),
        about: tagThings(lesson.tags),
        inLanguage: ["en", "fa"],
        isPartOf: { "@id": `${base}/#website` },
      },
      breadcrumb(path, "Lessons", "/lessons", lesson.title),
    ];

    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(data) }} />;
  }

  if (episode) {
    const path = `/podcasts/${episode.slug}`;
    const media = episode.audioAvailable
      ? {
          "@type": "MediaObject",
          contentUrl: absoluteUrl(episode.audioSrc),
          duration: isoDuration(episode.duration),
        }
      : undefined;
    const data = [
      {
        "@context": "https://schema.org",
        "@type": "PodcastEpisode",
        "@id": `${base}${path}#podcast-episode`,
        name: episode.title,
        alternateName: episode.faTitle,
        description: episode.description,
        url: absoluteUrl(path),
        datePublished: episode.date,
        dateModified: episode.updated ?? episode.date,
        episodeNumber: episode.episode,
        partOfSeries: {
          "@type": "PodcastSeries",
          name: "EduPocket Podcast",
          url: absoluteUrl("/podcasts"),
          author: { "@id": `${base}/#person` },
        },
        associatedMedia: media,
        keywords: episode.tags.join(", "),
        about: tagThings(episode.tags),
        inLanguage: [episode.language, "fa"],
      },
      breadcrumb(path, "Podcasts", "/podcasts", episode.title),
    ];

    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(data) }} />;
  }

  return null;
}
