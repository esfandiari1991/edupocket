export type ContentKind = "article" | "lesson" | "podcast";

export type BaseContent = {
  kind: ContentKind;
  slug: string;
  title: string;
  description: string;
  faTitle?: string;
  faDescription?: string;
  date: string;
  updated?: string;
  tags: string[];
  published: boolean;
  featured: boolean;
  body: string;
  faBody?: string;
  readingTime?: string;
};

export type Article = BaseContent & {
  kind: "article";
  category: string;
  faCategory?: string;
};

export type Lesson = BaseContent & {
  kind: "lesson";
  level: string;
  skill: string;
  faLevel?: string;
  faSkill?: string;
};

export type PodcastEpisode = BaseContent & {
  kind: "podcast";
  episode: number;
  season: number;
  audioSrc: string;
  duration: string;
  language: string;
  faLanguage?: string;
  transcript: boolean;
  cover?: string;
  audioAvailable: boolean;
};

export type ContentItem = Article | Lesson | PodcastEpisode;
