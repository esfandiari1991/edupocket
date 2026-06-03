"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  ChevronRight,
  Download,
  FileText,
  Layers3,
  LockKeyhole,
  PenLine,
  Search,
  Sparkles,
  Target,
} from "lucide-react";
import type { EvaBooklet, EvaBookletChapter, EvaBookletPage, EvaBookletStack } from "@/lib/eva-private-content";
import { cn } from "@/lib/utils";

type EvaStudioExperienceProps = {
  booklet: EvaBooklet;
};

const storageKey = "edupocket-eva-studio-v1";
const levelOrder = ["Supported", "Independent", "Challenging", "Critical Thinking", "Portfolio"];

type StoredState = {
  done: Record<string, boolean>;
  notes: Record<string, string>;
};

type StudyLane = {
  id: string;
  title: string;
  description: string;
  matchTypes: string[];
  primarySkills: string[];
};

type StudyRoute = {
  id: string;
  title: string;
  description: string;
  laneIds: string[];
  preferredStackIds: string[];
  proof: string;
};

const chapterLane: StudyLane = {
  id: "chapter-path",
  title: "Chapter path",
  description: "Default order for the selected chapter.",
  matchTypes: [],
  primarySkills: ["Sequential", "Complete", "Guided"],
};

const semanticStudyLanes: StudyLane[] = [
  {
    id: "orientation-lessons",
    title: "Orientation & lessons",
    description: "Foundations, chapter language pages, and opening study frames.",
    matchTypes: ["cover", "toc", "lesson", "chapter-language"],
    primarySkills: ["Foundation", "Language focus", "Study rhythm"],
  },
  {
    id: "reading-labs",
    title: "Reading labs",
    description: "IELTS/TOEFL-style reading, comprehension, and enrichment passages.",
    matchTypes: ["reading-lab", "reading-lab-rc", "chapter-reading", "enrichment", "enrichment-rc"],
    primarySkills: ["Reading", "Comprehension", "Critical thinking"],
  },
  {
    id: "vocabulary-bank",
    title: "Vocabulary bank",
    description: "Lexis, collocations, glossary work, and reusable word knowledge.",
    matchTypes: ["vocabulary"],
    primarySkills: ["Vocabulary", "Lexis", "Collocation"],
  },
  {
    id: "grammar-accuracy",
    title: "Grammar accuracy",
    description: "Grammar teaching, practice, Bible-based accuracy work, and language control.",
    matchTypes: ["grammar-lesson", "grammar-practice", "grammar-bible"],
    primarySkills: ["Grammar", "Accuracy", "Control"],
  },
  {
    id: "translation-exegesis",
    title: "Translation & exegesis",
    description: "Equivalence, context, revision, deep reading, and meaning transfer.",
    matchTypes: ["translation", "exegesis"],
    primarySkills: ["Translation", "Context", "Meaning"],
  },
  {
    id: "listening-speaking",
    title: "Listening & solo speaking",
    description: "Audio-led rehearsal, solo speaking prompts, and discussion preparation.",
    matchTypes: ["listening-speaking"],
    primarySkills: ["Listening", "Speaking solo", "Discussion"],
  },
  {
    id: "service-scenarios",
    title: "Service scenarios",
    description: "Real-life ministry situations, visual prompts, and practical response work.",
    matchTypes: ["scenario", "gallery"],
    primarySkills: ["Scenario", "Care", "Visual speaking"],
  },
  {
    id: "progress-portfolio",
    title: "Progress & portfolio",
    description: "Trackers, journals, quizzes, review loops, and visible learning evidence.",
    matchTypes: ["progress", "chapter-quiz"],
    primarySkills: ["Journal", "Quiz", "Portfolio"],
  },
];

const studyLanes = [chapterLane, ...semanticStudyLanes];
const broadSkillTags = new Set(["Ministry", "Writing", "Speaking Solo", "Reading", "Translation", "Grammar", "Vocabulary"]);

const studyRoutes: StudyRoute[] = [
  {
    id: "exam-core",
    title: "IELTS/TOEFL reading & writing route",
    description: "Move through passages, comprehension work, journals, quizzes, and portfolio evidence without losing chapter context.",
    laneIds: ["reading-labs", "progress-portfolio"],
    preferredStackIds: ["reading-translation", "growth-capstone"],
    proof: "Reading labs + review loops",
  },
  {
    id: "accuracy-core",
    title: "Vocabulary + grammar accuracy route",
    description: "Build the reusable language layer first: lexis, collocations, grammar teaching, practice, and controlled output.",
    laneIds: ["vocabulary-bank", "grammar-accuracy"],
    preferredStackIds: ["language-accuracy", "foundation"],
    proof: "Lexis + grammar control",
  },
  {
    id: "meaning-transfer",
    title: "Translation & deep meaning route",
    description: "Group translation, exegesis, and reading pages together for meaning transfer, revision, and close analysis.",
    laneIds: ["translation-exegesis", "reading-labs"],
    preferredStackIds: ["reading-translation", "foundation"],
    proof: "Meaning, context, revision",
  },
  {
    id: "real-service",
    title: "Real scenario rehearsal route",
    description: "Practice listening, solo speaking prompts, service scenarios, and visual response work as a guided rehearsal path.",
    laneIds: ["listening-speaking", "service-scenarios"],
    preferredStackIds: ["real-service-output", "growth-capstone"],
    proof: "Scenario + solo speaking",
  },
];

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function pageMatches(page: EvaBookletPage, query: string) {
  if (!query.trim()) return true;
  const needle = query.trim().toLowerCase();
  return [page.title, page.subtitle, page.chapterTitle, page.summary, page.type, ...page.skillTags, ...page.blocks]
    .join(" ")
    .toLowerCase()
    .includes(needle);
}

function formatType(type: string) {
  return type
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function firstPageForChapter(chapter: EvaBookletChapter, pages: EvaBookletPage[]) {
  return pages.find((page) => page.chapterId === chapter.id);
}

function pageMatchesStudyLane(page: EvaBookletPage, lane: StudyLane) {
  if (lane.id === chapterLane.id) return true;
  return lane.matchTypes.includes(page.type);
}

function countFields(pages: EvaBookletPage[]) {
  return pages.reduce((total, page) => total + page.fieldCount, 0);
}

function pagesForStack(stack: EvaBookletStack, pages: EvaBookletPage[]) {
  const chapterIds = new Set(stack.chapterIds);
  return pages.filter((page) => chapterIds.has(page.chapterId));
}

function pagesForStackAndLane(stack: EvaBookletStack, lane: StudyLane, pages: EvaBookletPage[]) {
  const stackPages = pagesForStack(stack, pages);
  if (lane.id === chapterLane.id) return stackPages;
  return stackPages.filter((page) => pageMatchesStudyLane(page, lane));
}

function orderedRouteStacks(route: StudyRoute, stacks: EvaBookletStack[]) {
  const preferred = route.preferredStackIds
    .map((id) => stacks.find((stack) => stack.id === id))
    .filter((stack): stack is EvaBookletStack => Boolean(stack));
  const preferredIds = new Set(preferred.map((stack) => stack.id));
  return [...preferred, ...stacks.filter((stack) => !preferredIds.has(stack.id))];
}

export function EvaStudioExperience({ booklet }: EvaStudioExperienceProps) {
  const [activeStackId, setActiveStackId] = useState(booklet.stacks[0]?.id ?? "");
  const [activeChapterId, setActiveChapterId] = useState(booklet.chapters[0]?.id ?? "");
  const [activePageId, setActivePageId] = useState(booklet.pages[0]?.id ?? "");
  const [activeLaneId, setActiveLaneId] = useState(chapterLane.id);
  const [skillFilter, setSkillFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const stored = window.localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored) as StoredState;
          setDone(parsed.done ?? {});
          setNotes(parsed.notes ?? {});
        }
      } catch {
        // Local progress is helpful, but the studio should remain usable if storage is unavailable.
      }
      setHydrated(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify({ done, notes }));
  }, [done, hydrated, notes]);

  const activeStack = useMemo(
    () => booklet.stacks.find((stack) => stack.id === activeStackId) ?? booklet.stacks[0],
    [activeStackId, booklet.stacks],
  );

  const stackChapters = useMemo(() => {
    const ids = new Set(activeStack?.chapterIds ?? []);
    return booklet.chapters.filter((chapter) => ids.has(chapter.id));
  }, [activeStack?.chapterIds, booklet.chapters]);

  const activeChapter = useMemo(
    () => booklet.chapters.find((chapter) => chapter.id === activeChapterId) ?? stackChapters[0] ?? booklet.chapters[0],
    [activeChapterId, booklet.chapters, stackChapters],
  );

  const activePage = useMemo(
    () => booklet.pages.find((page) => page.id === activePageId) ?? firstPageForChapter(activeChapter, booklet.pages) ?? booklet.pages[0],
    [activeChapter, activePageId, booklet.pages],
  );

  const stackPagesById = useMemo(() => {
    return new Map(booklet.stacks.map((stack) => [stack.id, pagesForStack(stack, booklet.pages)]));
  }, [booklet.pages, booklet.stacks]);

  const stackPageIds = useMemo(() => new Set(stackChapters.flatMap((chapter) => chapter.pageIds)), [stackChapters]);
  const stackPages = useMemo(() => booklet.pages.filter((page) => stackPageIds.has(page.id)), [booklet.pages, stackPageIds]);
  const chapterPages = useMemo(() => booklet.pages.filter((page) => page.chapterId === activeChapter.id), [activeChapter.id, booklet.pages]);
  const activeLane = useMemo(() => studyLanes.find((lane) => lane.id === activeLaneId) ?? chapterLane, [activeLaneId]);
  const stackStats = useMemo(() => {
    return new Map(
      booklet.stacks.map((stack) => {
        const pages = stackPagesById.get(stack.id) ?? [];
        return [stack.id, { fields: countFields(pages), pages: pages.length }];
      }),
    );
  }, [booklet.stacks, stackPagesById]);
  const laneCoverageCount = useMemo(() => {
    const coveredIds = new Set(
      booklet.pages
        .filter((page) => semanticStudyLanes.some((lane) => pageMatchesStudyLane(page, lane)))
        .map((page) => page.id),
    );
    return coveredIds.size;
  }, [booklet.pages]);
  const lanePages = useMemo(() => {
    if (activeLane.id === chapterLane.id) return chapterPages;
    return stackPages.filter((page) => pageMatchesStudyLane(page, activeLane));
  }, [activeLane, chapterPages, stackPages]);
  const laneCounts = useMemo(() => {
    return new Map(
      studyLanes.map((lane) => {
        const pages = lane.id === chapterLane.id ? chapterPages : stackPages.filter((page) => pageMatchesStudyLane(page, lane));
        return [lane.id, { fields: countFields(pages), pages: pages.length }];
      }),
    );
  }, [chapterPages, stackPages]);
  const matrixCounts = useMemo(() => {
    return new Map(
      semanticStudyLanes.map((lane) => [
        lane.id,
        new Map(
          booklet.stacks.map((stack) => {
            const pages = (stackPagesById.get(stack.id) ?? []).filter((page) => pageMatchesStudyLane(page, lane));
            return [stack.id, { fields: countFields(pages), pages: pages.length }];
          }),
        ),
      ]),
    );
  }, [booklet.stacks, stackPagesById]);
  const routeStats = useMemo(() => {
    return new Map(
      studyRoutes.map((route) => {
        const routePageIds = new Set<string>();
        const routeChapters = new Set<string>();

        for (const stack of orderedRouteStacks(route, booklet.stacks)) {
          const pages = stackPagesById.get(stack.id) ?? [];
          for (const lane of semanticStudyLanes.filter((item) => route.laneIds.includes(item.id))) {
            for (const page of pages.filter((item) => pageMatchesStudyLane(item, lane))) {
              routePageIds.add(page.id);
              routeChapters.add(page.chapterId);
            }
          }
        }

        const routePages = Array.from(routePageIds)
          .map((id) => booklet.pages.find((page) => page.id === id))
          .filter((page): page is EvaBookletPage => Boolean(page));

        return [route.id, { chapters: routeChapters.size, fields: countFields(routePages), pages: routePages.length }];
      }),
    );
  }, [booklet.pages, booklet.stacks, stackPagesById]);
  const skillOptions = useMemo(() => ["All", ...unique(lanePages.flatMap((page) => page.skillTags)).slice(0, 12)], [lanePages]);
  const effectiveSkillFilter = skillOptions.includes(skillFilter) ? skillFilter : "All";
  const visiblePages = useMemo(() => {
    const basePages = query.trim() && activeLane.id === chapterLane.id ? stackPages : lanePages;
    return basePages.filter((page) => pageMatches(page, query)).filter((page) => effectiveSkillFilter === "All" || page.skillTags.includes(effectiveSkillFilter));
  }, [activeLane.id, effectiveSkillFilter, lanePages, query, stackPages]);

  const relatedPages = useMemo(() => {
    const activeSpecificSkills = new Set(activePage.skillTags.filter((skill) => !broadSkillTags.has(skill)));
    const adjacent = booklet.pages.filter(
      (page) => page.chapterId === activePage.chapterId && Math.abs(page.page - activePage.page) <= 2 && page.id !== activePage.id,
    );
    const sameType = stackPages.filter((page) => page.id !== activePage.id && page.type === activePage.type);
    const sameLane = activeLane.id === chapterLane.id ? [] : stackPages.filter((page) => page.id !== activePage.id && pageMatchesStudyLane(page, activeLane));
    const semantic = stackPages.filter(
      (page) =>
        page.id !== activePage.id &&
        page.skillTags.some((skill) => activeSpecificSkills.has(skill)) &&
        activeSpecificSkills.size > 0,
    );
    return unique([...adjacent, ...sameType, ...sameLane, ...semantic].map((page) => page.id))
      .map((id) => booklet.pages.find((page) => page.id === id))
      .filter((page): page is EvaBookletPage => Boolean(page))
      .slice(0, 6);
  }, [activeLane, activePage, booklet.pages, stackPages]);

  if (!activeStack || !activeChapter || !activePage) return null;

  const chapterDoneCount = chapterPages.filter((page) => done[page.id]).length;
  const chapterProgress = Math.round((chapterDoneCount / Math.max(chapterPages.length, 1)) * 100);
  const activeNote = notes[activePage.id] ?? "";
  const activeNoteWordCount = activeNote.trim().split(/\s+/).filter(Boolean).length;
  const activeBlocks = activePage.blocks.filter((block, index) => index !== 0 || block !== activePage.title);

  function chooseStack(stack: EvaBookletStack) {
    const nextChapter = booklet.chapters.find((chapter) => stack.chapterIds.includes(chapter.id)) ?? booklet.chapters[0];
    const nextPage = nextChapter ? firstPageForChapter(nextChapter, booklet.pages) : booklet.pages[0];
    setActiveStackId(stack.id);
    setActiveChapterId(nextChapter?.id ?? "");
    setActivePageId(nextPage?.id ?? "");
    setActiveLaneId(chapterLane.id);
    setSkillFilter("All");
    setQuery("");
  }

  function chooseChapter(chapter: EvaBookletChapter) {
    const nextPage = firstPageForChapter(chapter, booklet.pages);
    setActiveChapterId(chapter.id);
    setActivePageId(nextPage?.id ?? "");
    setActiveLaneId(chapterLane.id);
    setSkillFilter("All");
  }

  function choosePage(page: EvaBookletPage) {
    const nextStack = booklet.stacks.find((stack) => stack.chapterIds.includes(page.chapterId));
    if (nextStack) setActiveStackId(nextStack.id);
    setActiveChapterId(page.chapterId);
    setActivePageId(page.id);
  }

  function chooseLane(lane: StudyLane) {
    setActiveLaneId(lane.id);
    setSkillFilter("All");
    setQuery("");
    if (lane.id === chapterLane.id) return;

    const nextPage = stackPages.find((page) => pageMatchesStudyLane(page, lane));
    if (nextPage) {
      setActiveChapterId(nextPage.chapterId);
      setActivePageId(nextPage.id);
    }
  }

  function chooseMatrixCell(stack: EvaBookletStack, lane: StudyLane) {
    const pages = pagesForStackAndLane(stack, lane, booklet.pages);
    const nextPage = pages[0];
    if (!nextPage) return;

    setActiveStackId(stack.id);
    setActiveLaneId(lane.id);
    setActiveChapterId(nextPage.chapterId);
    setActivePageId(nextPage.id);
    setSkillFilter("All");
    setQuery("");
  }

  function chooseStudyRoute(route: StudyRoute) {
    const routeLanes = semanticStudyLanes.filter((lane) => route.laneIds.includes(lane.id));

    for (const stack of orderedRouteStacks(route, booklet.stacks)) {
      for (const lane of routeLanes) {
        const nextPage = pagesForStackAndLane(stack, lane, booklet.pages)[0];
        if (nextPage) {
          setActiveStackId(stack.id);
          setActiveLaneId(lane.id);
          setActiveChapterId(nextPage.chapterId);
          setActivePageId(nextPage.id);
          setSkillFilter("All");
          setQuery("");
          return;
        }
      }
    }
  }

  function exportPageNote() {
    const text = [
      `# ${activePage.title}`,
      "",
      `Page: ${activePage.page}`,
      `Chapter: ${activePage.chapterTitle}`,
      `Skills: ${activePage.skillTags.join(", ")}`,
      "",
      "## Source content",
      activePage.blocks.join("\n\n"),
      "",
      "## My notes",
      activeNote || "No note yet.",
    ].join("\n");
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `eva-page-${String(activePage.page).padStart(3, "0")}-notes.md`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-5">
      <section className="rounded-[8px] border border-amber-200/18 bg-[linear-gradient(135deg,rgba(251,191,36,0.11),rgba(15,23,42,0.7),rgba(14,165,233,0.06))] p-4 shadow-[0_24px_90px_rgba(0,0,0,0.18)] sm:p-5">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="text-sm font-semibold text-amber-200">EduPocket private product database</p>
            <h2 className="mt-2 max-w-4xl text-xl font-semibold leading-tight text-white sm:text-3xl">
              EduPocket&apos;s Eva Digital Booklet, segmented into a real 298-page study studio.
            </h2>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300">
              The full workbook is indexed by learning stack, semantic lane, chapter, page, skill, practice level, search, related pages, and local study evidence.
              {` ${laneCoverageCount}/${booklet.stats.pages} imported pages are covered by the studio lanes, with chapter order preserved for every page.`}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:w-[34rem]">
            {[
              { label: "Pages", value: booklet.stats.pages, icon: FileText },
              { label: "Chapters", value: booklet.stats.chapters, icon: Layers3 },
              { label: "Fields", value: booklet.stats.answerFields, icon: PenLine },
              { label: "Checks", value: booklet.stats.checkboxes, icon: Check },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className="rounded-[8px] border border-white/10 bg-slate-950/40 p-3">
                  <Icon aria-hidden="true" className="size-4 text-amber-200" />
                  <p className="mt-3 text-lg font-semibold text-white">{item.value}</p>
                  <p className="text-xs leading-4 text-slate-400">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rounded-[8px] border border-white/10 bg-white/[0.035] p-3 sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">Learning stacks</h2>
            <p className="mt-1 text-sm leading-6 text-slate-400">Related chapters stay visually close; different learning jobs live in separate stacks.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {booklet.stacks.map((stack) => {
              const active = stack.id === activeStack.id;
              const stats = stackStats.get(stack.id);

              return (
                <button
                  key={stack.id}
                  type="button"
                  onClick={() => chooseStack(stack)}
                  className={cn(
                    "rounded-[8px] border p-3 text-start transition focus:outline-none focus:ring-2 focus:ring-amber-300/50",
                    active ? "border-amber-300/55 bg-amber-300/12 text-white" : "border-white/10 bg-slate-950/28 text-slate-300 hover:border-amber-300/35",
                  )}
                >
                  <span className="block text-sm font-semibold">{stack.title}</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-400">{stack.primarySkills.join(" / ")}</span>
                  <span className="mt-2 block text-xs font-semibold text-slate-500">
                    {stack.chapterIds.length} chapters · {stats?.pages ?? 0} pages · {stats?.fields ?? 0} fields
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[8px] border border-amber-200/20 bg-[radial-gradient(circle_at_10%_0%,rgba(251,191,36,0.1),transparent_32%),rgba(255,255,255,0.035)] p-3 sm:p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">Booklet architecture</h2>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-400">
              Every imported page can be reached by route, learning stack, semantic lane, chapter, search, and related-page links.
            </p>
          </div>
          <p className="text-xs font-semibold text-slate-500">
            Active stack: {stackPages.length} pages · full studio coverage {laneCoverageCount}/{booklet.stats.pages}
          </p>
        </div>

        <div className="mt-4 grid gap-2 lg:grid-cols-4">
          {studyRoutes.map((route) => {
            const stats = routeStats.get(route.id);
            const routeActive = route.laneIds.includes(activeLane.id) && route.preferredStackIds.includes(activeStack.id);

            return (
              <button
                key={route.id}
                type="button"
                onClick={() => chooseStudyRoute(route)}
                className={cn(
                  "group min-w-0 rounded-[8px] border p-3 text-start transition focus:outline-none focus:ring-2 focus:ring-amber-300/50",
                  routeActive
                    ? "border-amber-300/55 bg-amber-300/12 text-white"
                    : "border-white/10 bg-slate-950/30 text-slate-300 hover:border-amber-300/35 hover:bg-slate-950/45",
                )}
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0 text-sm font-semibold leading-5">{route.title}</span>
                  <ChevronRight aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-slate-500 transition group-hover:text-amber-200" />
                </span>
                <span className="mt-2 block min-w-0 break-words text-xs leading-5 text-slate-400">{route.description}</span>
                <span className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-500">
                  <span className="rounded-[6px] border border-amber-200/15 bg-amber-200/[0.07] px-2 py-1 text-amber-100">{route.proof}</span>
                  <span>{stats?.pages ?? 0} pages</span>
                  <span>{stats?.fields ?? 0} fields</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 overflow-hidden rounded-[8px] border border-white/10 bg-slate-950/28 p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Stack x lane map</h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">Tap a count to jump into that exact segment. Quiet dashes mean no imported pages in that cell.</p>
            </div>
            <p className="text-xs font-semibold text-slate-500">{semanticStudyLanes.length} lanes · {booklet.stacks.length} stacks</p>
          </div>
          <div className="mt-3 overflow-x-auto pb-1">
            <div className="grid min-w-[55rem] gap-1" style={{ gridTemplateColumns: `13rem repeat(${booklet.stacks.length}, minmax(6.75rem, 1fr))` }}>
              <div className="rounded-[6px] border border-white/10 bg-slate-950/50 px-3 py-2 text-[11px] font-semibold uppercase text-slate-500">
                Lane
              </div>
              {booklet.stacks.map((stack) => (
                <button
                  key={stack.id}
                  type="button"
                  onClick={() => chooseStack(stack)}
                  className={cn(
                    "rounded-[6px] border px-2 py-2 text-center text-[11px] font-semibold leading-4 transition focus:outline-none focus:ring-2 focus:ring-amber-300/40",
                    stack.id === activeStack.id
                      ? "border-amber-300/45 bg-amber-300/12 text-amber-100"
                      : "border-white/10 bg-slate-950/42 text-slate-400 hover:border-amber-300/30 hover:text-slate-200",
                  )}
                >
                  {stack.title}
                </button>
              ))}
              {semanticStudyLanes.map((lane) => (
                <div key={lane.id} className="contents">
                  <button
                    type="button"
                    onClick={() => chooseLane(lane)}
                    className={cn(
                      "rounded-[6px] border px-3 py-2 text-start text-xs font-semibold leading-4 transition focus:outline-none focus:ring-2 focus:ring-amber-300/40",
                      lane.id === activeLane.id
                        ? "border-amber-300/45 bg-amber-300/12 text-amber-100"
                        : "border-white/10 bg-slate-950/38 text-slate-300 hover:border-amber-300/30",
                    )}
                  >
                    {lane.title}
                  </button>
                  {booklet.stacks.map((stack) => {
                    const stats = matrixCounts.get(lane.id)?.get(stack.id);
                    const count = stats?.pages ?? 0;
                    const active = lane.id === activeLane.id && stack.id === activeStack.id;

                    return (
                      <button
                        key={`${lane.id}-${stack.id}`}
                        type="button"
                        disabled={!count}
                        onClick={() => chooseMatrixCell(stack, lane)}
                        className={cn(
                          "rounded-[6px] border px-2 py-2 text-center text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-amber-300/40",
                          !count
                            ? "cursor-not-allowed border-white/10 bg-slate-950/16 text-slate-700"
                            : active
                              ? "border-amber-300/55 bg-amber-300/14 text-amber-50"
                              : "border-white/10 bg-slate-950/32 text-slate-300 hover:border-amber-300/35 hover:text-amber-100",
                        )}
                        aria-label={count ? `${lane.title} in ${stack.title}: ${count} pages` : `${lane.title} in ${stack.title}: no imported pages`}
                      >
                        {count ? (
                          <span className="flex flex-col items-center gap-0.5">
                            <span>{count}</span>
                            <span className="text-[10px] font-medium text-slate-500">{stats?.fields ?? 0} fields</span>
                          </span>
                        ) : (
                          "-"
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {studyLanes.map((lane) => {
            const active = lane.id === activeLane.id;
            const stats = laneCounts.get(lane.id);
            const disabled = (stats?.pages ?? 0) === 0;

            return (
              <button
                key={lane.id}
                type="button"
                disabled={disabled}
                onClick={() => chooseLane(lane)}
                className={cn(
                  "min-h-[8.25rem] rounded-[8px] border p-3 text-start transition focus:outline-none focus:ring-2 focus:ring-amber-300/50",
                  disabled
                    ? "cursor-not-allowed border-white/10 bg-slate-950/18 text-slate-600 opacity-55"
                    : active
                      ? "border-amber-300/55 bg-amber-300/12 text-white"
                      : "border-white/10 bg-slate-950/28 text-slate-300 hover:border-amber-300/35",
                )}
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="text-sm font-semibold leading-5">{lane.title}</span>
                  <span className="rounded-[6px] border border-white/10 bg-slate-950/40 px-2 py-1 text-[11px] font-semibold text-amber-100">
                    {stats?.pages ?? 0}
                  </span>
                </span>
                <span className="mt-2 block text-xs leading-5 text-slate-400">{lane.description}</span>
                <span className="mt-3 block text-xs font-semibold text-slate-500">
                  {disabled ? "Not in this stack yet" : lane.primarySkills.join(" / ")}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[21rem_minmax(0,1fr)]">
        <aside className="grid gap-5 xl:sticky xl:top-24 xl:self-start">
          <section className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-[8px] bg-amber-200/10 text-amber-200">
                <BookOpen aria-hidden="true" className="size-5" />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-white">{activeStack.title}</h2>
                <p className="text-xs leading-5 text-slate-400">{activeStack.description}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-2">
              {stackChapters.map((chapter) => {
                const active = chapter.id === activeChapter.id;

                return (
                  <button
                    key={chapter.id}
                    type="button"
                    onClick={() => chooseChapter(chapter)}
                    className={cn(
                      "rounded-[8px] border p-3 text-start transition focus:outline-none focus:ring-2 focus:ring-amber-300/50",
                      active ? "border-amber-300/50 bg-amber-300/10 text-white" : "border-white/10 bg-slate-950/30 text-slate-300 hover:border-amber-300/35",
                    )}
                  >
                    <span className="flex items-center justify-between gap-3 text-xs font-semibold text-amber-200">
                      <span>{chapter.number}</span>
                      <span className="text-slate-500">{chapter.start}-{chapter.end}</span>
                    </span>
                    <span className="mt-1 block text-sm font-semibold">{chapter.shortTitle}</span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">{chapter.mode} · {chapter.time}</span>
                    <span className="mt-1 block text-xs font-semibold text-slate-600">
                      {chapter.pageCount} pages · {chapter.fieldCount} fields
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-[8px] border border-amber-200/20 bg-amber-200/[0.07] p-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex size-9 items-center justify-center rounded-[8px] bg-amber-200/12 text-amber-200">
                <LockKeyhole aria-hidden="true" className="size-4" />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-amber-100">Speaking is a 1:1 add-on</h2>
                <p className="mt-1 text-sm leading-6 text-slate-300">
                  The booklet includes solo speaking rehearsal. Personal correction, pronunciation, and live feedback stay separate.
                </p>
              </div>
            </div>
          </section>
        </aside>

        <section className="grid gap-5">
          <article className="rounded-[8px] border border-white/10 bg-white/[0.045] p-4 shadow-[0_22px_80px_rgba(0,0,0,0.18)] sm:p-5">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
              <div>
                <p className="text-xs font-semibold text-amber-200">
                  Chapter {activeChapter.number} / pages {activeChapter.start}-{activeChapter.end}
                </p>
                <h1 className="mt-2 text-2xl font-semibold leading-tight text-white sm:text-3xl">{activeChapter.shortTitle}</h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">{activeChapter.outcome}</p>
              </div>
              <div className="rounded-[8px] border border-white/10 bg-slate-950/32 p-3">
                <div className="flex items-center justify-between gap-3 text-xs font-semibold text-slate-400">
                  <span>Chapter completion</span>
                  <span>{chapterProgress}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-amber-300 to-sky-300" style={{ width: `${chapterProgress}%` }} />
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-500">
                  {chapterDoneCount} of {chapterPages.length} pages marked complete locally.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {[
                { label: "Use when", value: activeChapter.useWhen, icon: Target },
                { label: "Inside", value: activeChapter.inside, icon: Layers3 },
                { label: "Primary skills", value: activeChapter.skillTags.slice(0, 5).join(" / "), icon: Sparkles },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.label} className="rounded-[8px] border border-white/10 bg-slate-950/28 p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase text-amber-200">
                      <Icon aria-hidden="true" className="size-4" />
                      {item.label}
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{item.value}</p>
                  </div>
                );
              })}
            </div>
          </article>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
            <aside className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4">
              <label className="flex min-h-11 items-center gap-2 rounded-[8px] border border-white/10 bg-slate-950/50 px-3 text-sm text-slate-300 focus-within:border-amber-300/45 focus-within:ring-2 focus-within:ring-amber-300/15">
                <Search aria-hidden="true" className="size-4 text-slate-500" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search this stack..."
                  className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate-600"
                />
              </label>

              <div className="mt-4 flex flex-wrap gap-2">
                {skillOptions.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => setSkillFilter(skill)}
                    className={cn(
                      "rounded-[8px] border px-3 py-2 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-amber-300/50",
                      effectiveSkillFilter === skill ? "border-amber-300/45 bg-amber-300/12 text-amber-100" : "border-white/10 bg-slate-950/30 text-slate-400 hover:border-amber-300/30 hover:text-slate-200",
                    )}
                  >
                    {skill}
                  </button>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-white">{query.trim() ? "Search results" : activeLane.title}</h2>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{activeLane.id === chapterLane.id ? activeChapter.shortTitle : activeLane.description}</p>
                </div>
                <span className="shrink-0 text-xs text-slate-500">{visiblePages.length} pages</span>
              </div>

              <div className="mt-3 max-h-[34rem] space-y-2 overflow-y-auto pr-1">
                {visiblePages.map((page) => {
                  const active = page.id === activePage.id;
                  const complete = Boolean(done[page.id]);

                  return (
                    <button
                      key={page.id}
                      type="button"
                      onClick={() => choosePage(page)}
                      className={cn(
                        "group w-full rounded-[8px] border p-3 text-start transition focus:outline-none focus:ring-2 focus:ring-amber-300/50",
                        active ? "border-amber-300/55 bg-amber-300/10 text-white" : "border-white/10 bg-slate-950/28 text-slate-300 hover:border-amber-300/35",
                      )}
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span className="text-xs font-semibold text-amber-200">P{String(page.page).padStart(3, "0")}</span>
                        <span className={cn("flex size-5 shrink-0 items-center justify-center rounded-[6px] border", complete ? "border-emerald-300 bg-emerald-300 text-slate-950" : "border-white/15 text-transparent")}>
                          <Check aria-hidden="true" className="size-3.5" />
                        </span>
                      </span>
                      <span className="mt-1 block text-sm font-semibold leading-5">{page.title}</span>
                      <span className="mt-1 block text-xs leading-5 text-slate-500">{formatType(page.type)} · {page.fieldCount} fields</span>
                    </button>
                  );
                })}
                {!visiblePages.length ? <p className="rounded-[8px] border border-white/10 bg-slate-950/28 p-4 text-sm leading-6 text-slate-400">No page matches this filter.</p> : null}
              </div>
            </aside>

            <div className="grid gap-5">
              <article className="rounded-[8px] border border-white/10 bg-white/[0.045] p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold text-amber-200">
                      Page {String(activePage.page).padStart(3, "0")} / {activePage.chapterTitle} / {formatType(activePage.type)}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold leading-tight text-white">{activePage.title}</h2>
                    {activePage.subtitle ? <p className="mt-1 text-sm leading-6 text-slate-400">{activePage.subtitle}</p> : null}
                  </div>
                  <label className="inline-flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-[8px] border border-white/10 px-3 text-sm font-semibold text-slate-200 transition hover:border-amber-300/40 hover:text-amber-100">
                    <span>Complete</span>
                    <input
                      type="checkbox"
                      checked={Boolean(done[activePage.id])}
                      onChange={(event) => setDone((current) => ({ ...current, [activePage.id]: event.target.checked }))}
                      className="sr-only"
                    />
                    <span className={cn("flex size-6 items-center justify-center rounded-[6px] border", done[activePage.id] ? "border-amber-200 bg-amber-200 text-slate-950" : "border-white/20")}>
                      {done[activePage.id] ? <Check aria-hidden="true" className="size-4" /> : null}
                    </span>
                  </label>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[8px] border border-white/10 bg-slate-950/28 p-3">
                    <p className="text-xs font-semibold uppercase text-slate-500">Practice fields</p>
                    <p className="mt-2 text-lg font-semibold text-white">{activePage.fieldCount}</p>
                  </div>
                  <div className="rounded-[8px] border border-white/10 bg-slate-950/28 p-3">
                    <p className="text-xs font-semibold uppercase text-slate-500">Checks</p>
                    <p className="mt-2 text-lg font-semibold text-white">{activePage.checkboxCount}</p>
                  </div>
                  <div className="rounded-[8px] border border-white/10 bg-slate-950/28 p-3">
                    <p className="text-xs font-semibold uppercase text-slate-500">Words</p>
                    <p className="mt-2 text-lg font-semibold text-white">{activePage.wordCount}</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {unique([...activePage.skillTags, ...activePage.levelTags]).slice(0, 12).map((tag) => (
                    <span key={tag} className="rounded-[8px] border border-white/10 bg-slate-950/38 px-3 py-2 text-xs font-semibold text-slate-200">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-semibold text-white">Level stack</h3>
                    <span className="text-xs font-semibold text-slate-500">{activePage.levelTags.length || "Imported"} signals</span>
                  </div>
                  <div className="mt-2 grid gap-2 sm:grid-cols-5">
                    {levelOrder.map((level) => {
                      const active = activePage.levelTags.includes(level) || activePage.blocks.some((block) => block.toLowerCase().includes(level.toLowerCase()));

                      return (
                        <div
                          key={level}
                          className={cn(
                            "rounded-[8px] border px-3 py-2 text-center text-xs font-semibold",
                            active ? "border-amber-300/45 bg-amber-300/12 text-amber-100" : "border-white/10 bg-slate-950/22 text-slate-600",
                          )}
                        >
                          {level}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </article>

              <article className="rounded-[8px] border border-sky-200/15 bg-sky-300/[0.055] p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-white">Source page content</h2>
                  <span className="text-xs font-semibold text-slate-500">Imported from the full booklet</span>
                </div>
                <div className="mt-4 max-h-[36rem] overflow-y-auto rounded-[8px] border border-white/10 bg-slate-950/38 p-4">
                  <div className="space-y-4">
                    {activeBlocks.map((block, index) => {
                      const prominent = block.length < 80 && /^[A-Z0-9].*/.test(block) && index < 10;

                      return prominent ? (
                        <h3 key={`${block}-${index}`} className="text-base font-semibold leading-7 text-amber-100">
                          {block}
                        </h3>
                      ) : (
                        <p key={`${block}-${index}`} className="text-sm leading-8 text-slate-300">
                          {block}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </article>

              <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_19rem]">
                <article className="rounded-[8px] border border-white/10 bg-white/[0.045] p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-[8px] bg-amber-200/10 text-amber-200">
                      <PenLine aria-hidden="true" className="size-5" />
                    </span>
                    <div>
                      <h2 className="text-lg font-semibold text-white">Study note</h2>
                      <p className="text-sm leading-6 text-slate-400">Local notes stay in this browser until a real member database is added.</p>
                    </div>
                  </div>
                  <textarea
                    value={activeNote}
                    onChange={(event) => setNotes((current) => ({ ...current, [activePage.id]: event.target.value }))}
                    className="mt-5 min-h-44 w-full resize-y rounded-[8px] border border-white/10 bg-slate-950/72 p-4 text-sm leading-7 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-amber-300/50 focus:ring-2 focus:ring-amber-300/20"
                    placeholder="Write the answer, revision, translation note, or portfolio evidence for this page..."
                  />
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-slate-400">Note words: {activeNoteWordCount}</p>
                    <button
                      type="button"
                      onClick={exportPageNote}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[8px] border border-white/10 px-3 text-sm font-semibold text-slate-200 transition hover:border-amber-300/40 hover:text-amber-100"
                    >
                      <Download aria-hidden="true" className="size-4" />
                      Export page
                    </button>
                  </div>
                </article>

                <aside className="rounded-[8px] border border-white/10 bg-white/[0.045] p-4 sm:p-5">
                  <h2 className="text-lg font-semibold text-white">Related pages</h2>
                  <div className="mt-4 grid gap-2">
                    {relatedPages.map((page) => (
                      <button
                        key={page.id}
                        type="button"
                        onClick={() => choosePage(page)}
                        className="group flex items-start justify-between gap-3 rounded-[8px] border border-white/10 bg-slate-950/28 p-3 text-start transition hover:border-amber-300/35"
                      >
                        <span>
                          <span className="block text-xs font-semibold text-amber-200">P{String(page.page).padStart(3, "0")}</span>
                          <span className="mt-1 block text-sm font-semibold leading-5 text-slate-200">{page.title}</span>
                        </span>
                        <ChevronRight aria-hidden="true" className="mt-1 size-4 shrink-0 text-slate-500 transition group-hover:text-amber-200" />
                      </button>
                    ))}
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
