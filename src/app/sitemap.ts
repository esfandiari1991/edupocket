import type { MetadataRoute } from "next";
import { getAllArticles, getAllLessons, getAllPodcasts, getAllTags } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { slugify } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");
  const staticRoutes = ["", "/articles", "/lessons", "/podcasts", "/about"].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
  }));

  const articles = getAllArticles().map((item) => ({
    url: `${base}/articles/${item.slug}`,
    lastModified: new Date(item.updated ?? item.date),
  }));

  const lessons = getAllLessons().map((item) => ({
    url: `${base}/lessons/${item.slug}`,
    lastModified: new Date(item.updated ?? item.date),
  }));

  const podcasts = getAllPodcasts().map((item) => ({
    url: `${base}/podcasts/${item.slug}`,
    lastModified: new Date(item.updated ?? item.date),
  }));

  const tags = getAllTags().map((tag) => ({
    url: `${base}/tags/${slugify(tag)}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...articles, ...lessons, ...podcasts, ...tags];
}
