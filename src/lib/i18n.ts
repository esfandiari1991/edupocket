import type { Article, ContentItem, Lesson, PodcastEpisode } from "@/types/content";

export type Language = "en" | "fa";

export type LocalizedString = {
  en: string;
  fa: string;
};

const tagLabels: Record<string, string> = {
  "AI Learning": "یادگیری با هوش مصنوعی",
  "Arabic & Languages": "عربی و زبان ها",
  "Business English": "انگلیسی کسب و کار",
  "English Teaching": "آموزش انگلیسی",
  "Error Logs": "دفتر خطاها",
  "Exam Strategy": "استراتژی آزمون",
  IELTS: "آیلتس",
  "IELTS & TOEFL": "آیلتس و تافل",
  KET: "KET",
  "Language Learning": "یادگیری زبان",
  Learning: "یادگیری",
  "Micro-Lessons": "درس های کوتاه",
  "Mini Apps": "مینی اپ ها",
  Podcasts: "پادکست ها",
  Programming: "برنامه نویسی",
  Python: "پایتون",
  Reading: "ریدینگ",
  SQL: "SQL",
  Speaking: "اسپیکینگ",
  "Spaced Repetition": "مرور فاصله دار",
  "Study Systems": "سیستم های مطالعه",
  "Teaching Frameworks": "چارچوب های تدریس",
};

export const commonText = {
  backToArticles: { en: "Back to articles", fa: "بازگشت به مقاله ها" },
  backToLessons: { en: "Back to lessons", fa: "بازگشت به درس ها" },
  backToPodcasts: { en: "Back to podcasts", fa: "بازگشت به پادکست ها" },
  builtFor: {
    en: "Students, teachers, self-learners, and creators building practical learning systems.",
    fa: "برای دانش آموزان، معلم ها، خودآموزها و سازنده هایی که سیستم یادگیری عملی می سازند.",
  },
  builtWith: { en: "Built with Next.js and deployed on Vercel.", fa: "ساخته شده با Next.js و منتشر شده روی Vercel." },
  audioSoon: { en: "Audio Soon", fa: "صوت به زودی" },
  comingSoon: { en: "Coming Soon", fa: "به زودی" },
  explore: { en: "Explore", fa: "گشت و گذار" },
  featuredEpisode: { en: "Featured episode", fa: "اپیزود ویژه" },
  home: { en: "Home", fa: "خانه" },
  noArticles: { en: "No articles yet", fa: "هنوز مقاله ای منتشر نشده" },
  noArticlesDescription: {
    en: "Published articles will appear here when the EduPocket library grows.",
    fa: "وقتی کتابخانه EduPocket بزرگ تر شود، مقاله های منتشرشده اینجا دیده می شوند.",
  },
  noLessons: { en: "No lessons yet", fa: "هنوز درسی منتشر نشده" },
  noLessonsDescription: { en: "Published micro-lessons will appear here.", fa: "درس های کوتاه منتشرشده اینجا قرار می گیرند." },
  noPodcasts: { en: "No podcast episodes yet", fa: "هنوز اپیزود پادکست منتشر نشده" },
  noPodcastsDescription: { en: "Published audio lessons will appear here.", fa: "درس های صوتی منتشرشده اینجا قرار می گیرند." },
  relatedArticles: { en: "Related articles", fa: "مقاله های مرتبط" },
  relatedLessons: { en: "Related lessons", fa: "درس های مرتبط" },
  relatedEpisodes: { en: "Related episodes", fa: "اپیزودهای مرتبط" },
  viewAll: { en: "View all", fa: "دیدن همه" },
};

export function tagLabel(tag: string): LocalizedString {
  return { en: tag, fa: tagLabels[tag] ?? tag };
}

export function itemTitle(item: ContentItem): LocalizedString {
  return { en: item.title, fa: item.faTitle ?? item.title };
}

export function itemDescription(item: ContentItem): LocalizedString {
  return { en: item.description, fa: item.faDescription ?? item.description };
}

export function itemBody(item: ContentItem): LocalizedString {
  return { en: item.body, fa: item.faBody ?? item.body };
}

export function articleCategory(article: Article): LocalizedString {
  return { en: article.category, fa: article.faCategory ?? article.category };
}

export function lessonSkill(lesson: Lesson): LocalizedString {
  return { en: lesson.skill, fa: lesson.faSkill ?? lesson.skill };
}

export function lessonLevel(lesson: Lesson): LocalizedString {
  return { en: lesson.level, fa: lesson.faLevel ?? lesson.level };
}

export function podcastLanguage(podcast: PodcastEpisode): LocalizedString {
  return { en: podcast.language, fa: podcast.faLanguage ?? podcast.language };
}

export function formatDateFa(date: string) {
  return new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(new Date(date));
}

export function formatReadingTimeFa(readingTime?: string) {
  const minutes = readingTime?.match(/\d+/)?.[0] ?? "1";
  return `${minutes} دقیقه مطالعه`;
}

export function contentMeta(item: ContentItem): LocalizedString {
  if (item.kind === "article") {
    return articleCategory(item);
  }

  if (item.kind === "lesson") {
    return {
      en: `${item.skill} / ${item.level}`,
      fa: `${item.faSkill ?? item.skill} / ${item.faLevel ?? item.level}`,
    };
  }

  return {
    en: `S${item.season} / E${item.episode} / ${item.duration}`,
    fa: `فصل ${item.season} / اپیزود ${item.episode} / ${item.duration}`,
  };
}
