import "server-only";

import booklet from "./eva-booklet.generated.json";

export type EvaBookletPage = {
  id: string;
  page: number;
  chapterId: string;
  chapterNumber: string;
  chapterTitle: string;
  title: string;
  subtitle: string;
  type: string;
  skillTags: string[];
  levelTags: string[];
  fieldCount: number;
  checkboxCount: number;
  wordCount: number;
  summary: string;
  blocks: string[];
};

export type EvaBookletChapter = {
  id: string;
  number: string;
  label: string;
  title: string;
  shortTitle: string;
  start: number;
  end: number;
  accent: "teal" | "blue" | "gold" | string;
  inside: string;
  outcome: string;
  tocOutcome: string;
  tocUse: string;
  useWhen: string;
  time: string;
  mode: string;
  skills: string[];
  pageIds: string[];
  pageCount: number;
  fieldCount: number;
  checkboxCount: number;
  wordCount: number;
  skillTags: string[];
  levelTags: string[];
};

export type EvaBookletStack = {
  id: string;
  title: string;
  description: string;
  chapterIds: string[];
  primarySkills: string[];
};

export type EvaBooklet = {
  importedAt: string;
  source: {
    title: string;
    basis: string;
    privacy: string;
  };
  stats: {
    pages: number;
    chapters: number;
    answerFields: number;
    checkboxes: number;
    vocabularyCards: number | null;
    namedChapterCount: number;
    readingLabs: number | null;
    enrichmentPages: number | null;
    languageLabs: number | null;
    pdfPages: number | null;
    textCharacters: number | null;
  };
  stacks: EvaBookletStack[];
  chapters: EvaBookletChapter[];
  pages: EvaBookletPage[];
};

export const evaBooklet = booklet as EvaBooklet;

export function getEvaBookletChapter(chapterId: string) {
  return evaBooklet.chapters.find((chapter) => chapter.id === chapterId);
}

export function getEvaBookletPage(pageId: string) {
  return evaBooklet.pages.find((page) => page.id === pageId);
}

export function getEvaBookletPagesForChapter(chapterId: string) {
  return evaBooklet.pages.filter((page) => page.chapterId === chapterId);
}
