import type { MetadataRoute } from "next";
import { getAllArticles, getAllLessons, getAllPodcasts, getAllTags } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { slugify } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.canonicalUrl.replace(/\/$/, "");
  const staticLastModified = new Date("2026-05-30");
  const staticRoutes: MetadataRoute.Sitemap = ["", "/articles", "/lessons", "/english-lab", "/eva-digital-booklet", "/podcasts", "/about"].map((route) => ({
    url: `${base}${route}`,
    lastModified: staticLastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/english-lab" ? 0.9 : route === "/eva-digital-booklet" ? 0.82 : 0.8,
  }));

  const articles: MetadataRoute.Sitemap = getAllArticles().map((item) => ({
    url: `${base}/articles/${item.slug}`,
    lastModified: new Date(item.updated ?? item.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const lessons: MetadataRoute.Sitemap = getAllLessons().map((item) => ({
    url: `${base}/lessons/${item.slug}`,
    lastModified: new Date(item.updated ?? item.date),
    changeFrequency: "monthly",
    priority: 0.72,
  }));

  const podcasts: MetadataRoute.Sitemap = getAllPodcasts().map((item) => ({
    url: `${base}/podcasts/${item.slug}`,
    lastModified: new Date(item.updated ?? item.date),
    changeFrequency: "monthly",
    priority: 0.68,
  }));

  const tags: MetadataRoute.Sitemap = getAllTags().map((tag) => ({
    url: `${base}/tags/${slugify(tag)}`,
    lastModified: staticLastModified,
    changeFrequency: "monthly",
    priority: 0.45,
  }));

  return [...staticRoutes, ...articles, ...lessons, ...podcasts, ...tags];
}
