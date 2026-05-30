import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { slugify, uniqueSorted } from "@/lib/utils";
import type { Article, ContentItem, ContentKind, Lesson, PodcastEpisode } from "@/types/content";

export type { Article, ContentItem, ContentKind, Lesson, PodcastEpisode } from "@/types/content";

type RawFrontmatter = Record<string, unknown>;

const root = process.cwd();
const contentRoot = path.join(root, "content");

function isString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function requiredString(data: RawFrontmatter, field: string, filePath: string) {
  const value = data[field];
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  if (!isString(value)) {
    throw new Error(`${filePath} is missing required string field "${field}".`);
  }
  return value.trim();
}

function optionalString(data: RawFrontmatter, field: string) {
  const value = data[field];
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return isString(value) ? value.trim() : undefined;
}

function requiredNumber(data: RawFrontmatter, field: string, filePath: string) {
  const value = data[field];
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`${filePath} is missing required number field "${field}".`);
  }
  return value;
}

function requiredBoolean(data: RawFrontmatter, field: string, filePath: string) {
  const value = data[field];
  if (typeof value !== "boolean") {
    throw new Error(`${filePath} is missing required boolean field "${field}".`);
  }
  return value;
}

function tags(data: RawFrontmatter, filePath: string) {
  const value = data.tags;
  if (!isStringArray(value)) {
    throw new Error(`${filePath} is missing required string array field "tags".`);
  }
  return value;
}

function collectionDir(kind: ContentKind) {
  const folder = kind === "article" ? "articles" : kind === "lesson" ? "lessons" : "podcasts";
  return path.join(contentRoot, folder);
}

function readFiles(kind: ContentKind) {
  const dir = collectionDir(kind);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
    .map((file) => path.join(dir, file));
}

function baseFromMatter(kind: ContentKind, filePath: string, data: RawFrontmatter, body: string) {
  return {
    kind,
    slug: slugify(path.basename(filePath).replace(/\.mdx?$/, "")),
    title: requiredString(data, "title", filePath),
    description: requiredString(data, "description", filePath),
    faTitle: optionalString(data, "faTitle"),
    faDescription: optionalString(data, "faDescription"),
    date: requiredString(data, "date", filePath),
    updated: optionalString(data, "updated"),
    tags: tags(data, filePath),
    published: requiredBoolean(data, "published", filePath),
    featured: requiredBoolean(data, "featured", filePath),
    body,
    faBody: optionalString(data, "faContent"),
  };
}

function parseArticle(filePath: string): Article {
  const parsed = matter(fs.readFileSync(filePath, "utf8"));
  const base = baseFromMatter("article", filePath, parsed.data, parsed.content);
  return {
    ...base,
    kind: "article",
    category: requiredString(parsed.data, "category", filePath),
    faCategory: optionalString(parsed.data, "faCategory"),
    readingTime: readingTime(parsed.content).text,
  };
}

function parseLesson(filePath: string): Lesson {
  const parsed = matter(fs.readFileSync(filePath, "utf8"));
  const base = baseFromMatter("lesson", filePath, parsed.data, parsed.content);
  return {
    ...base,
    kind: "lesson",
    level: requiredString(parsed.data, "level", filePath),
    skill: requiredString(parsed.data, "skill", filePath),
    faLevel: optionalString(parsed.data, "faLevel"),
    faSkill: optionalString(parsed.data, "faSkill"),
    readingTime: readingTime(parsed.content).text,
  };
}

function audioFileAvailable(audioSrc: string) {
  if (/^https?:\/\//i.test(audioSrc)) return true;
  if (!audioSrc.startsWith("/")) return false;
  const publicPath = path.join(root, "public", audioSrc.replace(/^\//, ""));
  return fs.existsSync(publicPath);
}

function parsePodcast(filePath: string): PodcastEpisode {
  const parsed = matter(fs.readFileSync(filePath, "utf8"));
  const base = baseFromMatter("podcast", filePath, parsed.data, parsed.content);
  const audioSrc = requiredString(parsed.data, "audioSrc", filePath);
  return {
    ...base,
    kind: "podcast",
    episode: requiredNumber(parsed.data, "episode", filePath),
    season: requiredNumber(parsed.data, "season", filePath),
    audioSrc,
    duration: requiredString(parsed.data, "duration", filePath),
    language: requiredString(parsed.data, "language", filePath),
    faLanguage: optionalString(parsed.data, "faLanguage"),
    transcript: requiredBoolean(parsed.data, "transcript", filePath),
    cover: optionalString(parsed.data, "cover"),
    audioAvailable: audioFileAvailable(audioSrc),
  };
}

function byNewest<T extends ContentItem>(items: T[]) {
  return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getAllArticles() {
  return byNewest(readFiles("article").map(parseArticle).filter((item) => item.published));
}

export function getAllLessons() {
  return byNewest(readFiles("lesson").map(parseLesson).filter((item) => item.published));
}

export function getAllPodcasts() {
  return byNewest(readFiles("podcast").map(parsePodcast).filter((item) => item.published));
}

export function getArticleBySlug(slug: string) {
  return getAllArticles().find((item) => item.slug === slug);
}

export function getLessonBySlug(slug: string) {
  return getAllLessons().find((item) => item.slug === slug);
}

export function getPodcastBySlug(slug: string) {
  return getAllPodcasts().find((item) => item.slug === slug);
}

export function getFeaturedArticles() {
  return getAllArticles().filter((item) => item.featured);
}

export function getFeaturedLessons() {
  return getAllLessons().filter((item) => item.featured);
}

export function getFeaturedPodcasts() {
  return getAllPodcasts().filter((item) => item.featured);
}

export function getAllContent(): ContentItem[] {
  return [...getAllArticles(), ...getAllLessons(), ...getAllPodcasts()];
}

export function getAllTags() {
  return uniqueSorted(getAllContent().flatMap((item) => item.tags));
}

export function getContentByTag(tag: string) {
  const normalized = tag.toLowerCase();
  return getAllContent().filter((item) => item.tags.some((itemTag) => slugify(itemTag) === normalized));
}

export function getRelatedItems<T extends ContentItem>(item: T, items: T[], limit = 3) {
  return items
    .filter((candidate) => candidate.slug !== item.slug)
    .map((candidate) => ({
      item: candidate,
      score: candidate.tags.filter((tag) => item.tags.includes(tag)).length,
    }))
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.item.date).getTime() - new Date(a.item.date).getTime())
    .slice(0, limit)
    .map((candidate) => candidate.item);
}

export function getRelatedArticles(article: Article) {
  return getRelatedItems(article, getAllArticles());
}

export function getRelatedLessons(lesson: Lesson) {
  return getRelatedItems(lesson, getAllLessons());
}

export function getRelatedPodcasts(podcast: PodcastEpisode) {
  return getRelatedItems(podcast, getAllPodcasts());
}

export function getTagLabel(tagSlug: string) {
  const match = getAllTags().find((tag) => slugify(tag) === tagSlug);
  return match ?? tagSlug.replace(/-/g, " ");
}
