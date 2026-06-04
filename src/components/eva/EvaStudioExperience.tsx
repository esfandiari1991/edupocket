"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Headphones,
  LibraryBig,
  ListChecks,
  Mic2,
  NotebookPen,
  RotateCcw,
  Search,
  Sparkles,
  Target,
  Volume2,
} from "lucide-react";
import type { EvaBooklet, EvaBookletChapter, EvaBookletPage } from "@/lib/eva-private-content";
import {
  buildEvaLearningDatabase,
  evaSeedUsers,
  evaUserStorageKey,
  normalizeStoredState,
  type EvaSeedUser,
  type EvaStoredStudioState,
  type EvaUserId,
} from "@/lib/eva-learning-db";
import { evaGrammarModules, evaLexicalResource, evaReligiousModules } from "@/lib/eva-studio-curriculum";
import { cn } from "@/lib/utils";

type EvaStudioExperienceProps = {
  booklet: EvaBooklet;
  activeUser: EvaSeedUser;
  persistenceMode: "database" | "local-database" | "development";
};

type StudioView = "study" | "ebook" | "review";
type SaveState = "loading" | "saved" | "saving" | "local" | "error";

type PracticeQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  rationale: string;
};

const legacyStorageKey = "edupocket-eva-studio-v1";

const uiCopy = {
  en: {
    today: "Study path",
    ebook: "Full ebook",
    review: "Review queue",
    search: "Search pages, skills, or chapter notes",
    read: "Read",
    practice: "Practice",
    listen: "Listen",
    repeat: "Repeat slowly",
    done: "Mark complete",
    doneShort: "Complete",
    addReview: "Add to review",
    removeReview: "Remove review",
    next: "Next useful page",
    previous: "Previous",
    saveAnswer: "Your answer is saved automatically.",
    noReview: "Nothing is waiting for review. Add weak pages from the practice panel.",
    answerPlaceholder: "Write a short answer, translation, paragraph, or teacher question here.",
    teacher: "Teacher lens",
    saved: "Saved",
    saving: "Saving",
    local: "Saved in this browser",
    error: "Local save only",
    loading: "Loading",
  },
  fa: {
    today: "مسیر مطالعه",
    ebook: "کل جزوه",
    review: "مرور",
    search: "جست‌وجوی صفحه، مهارت یا نکته‌ی فصل",
    read: "خواندن",
    practice: "تمرین",
    listen: "پخش",
    repeat: "تکرار آرام",
    done: "کامل شد",
    doneShort: "کامل",
    addReview: "افزودن به مرور",
    removeReview: "حذف از مرور",
    next: "صفحه‌ی مفید بعدی",
    previous: "قبلی",
    saveAnswer: "پاسخ تو خودکار ذخیره می‌شود.",
    noReview: "فعلاً چیزی برای مرور نیست. صفحه‌های ضعیف را از بخش تمرین اضافه کن.",
    answerPlaceholder: "اینجا جواب کوتاه، ترجمه، پاراگراف یا سوالت از معلم را بنویس.",
    teacher: "دید معلم",
    saved: "ذخیره شد",
    saving: "در حال ذخیره",
    local: "در همین مرورگر ذخیره شد",
    error: "فقط ذخیره محلی",
    loading: "در حال بارگذاری",
  },
};

function pageDoneKey(pageId: string) {
  return `page:${pageId}:done`;
}

function reviewKey(pageId: string) {
  return `page:${pageId}:review`;
}

function draftKey(pageId: string) {
  return `page:${pageId}:draft`;
}

function readKey(pageId: string) {
  return `tts-page-${pageId}`;
}

function pageSearchHaystack(page: EvaBookletPage) {
  return [page.title, page.subtitle, page.summary, page.chapterTitle, page.type, ...page.skillTags, ...page.levelTags, ...page.blocks].join(" ").toLowerCase();
}

function isPageComplete(state: EvaStoredStudioState, pageId: string) {
  return Boolean(state.done[pageDoneKey(pageId)] || state.done[pageId]);
}

function activeDraft(state: EvaStoredStudioState, pageId: string) {
  return state.writingDrafts[draftKey(pageId)] ?? "";
}

function pageReadableBlocks(page: EvaBookletPage) {
  const blocks = page.blocks.filter((block) => block.trim().length > 2);
  return blocks.length ? blocks : [page.summary || page.title];
}

function skillLabel(page: EvaBookletPage) {
  if (page.type.includes("grammar")) return "Grammar";
  if (page.type.includes("vocabulary")) return "Lexical resource";
  if (page.type.includes("translation")) return "Translation";
  if (page.type.includes("reading")) return "Reading";
  if (page.type.includes("listening")) return "Listening";
  if (page.type.includes("quiz")) return "Quiz";
  if (page.type.includes("progress")) return "Review";
  return page.skillTags[0] ?? "Source";
}

function buildPageQuestion(page: EvaBookletPage, chapterPages: EvaBookletPage[]): PracticeQuestion {
  const otherSummaries = chapterPages
    .filter((candidate) => candidate.id !== page.id && candidate.summary && candidate.summary !== page.summary)
    .slice(0, 3)
    .map((candidate) => candidate.summary);
  const correct = page.summary || page.title;
  const options = [correct, ...otherSummaries, "Skip the page and move to a separate speaking lesson."]
    .filter(Boolean)
    .slice(0, 4);

  while (options.length < 4) {
    options.push(["Build a vocabulary card.", "Write a short reflection.", "Find the main grammar pattern."][options.length - 1]);
  }

  return {
    id: `source-check-${page.id}`,
    prompt: "What is the main job of this page?",
    options,
    answerIndex: 0,
    rationale: "The correct answer uses the imported summary of this exact source page, so the check stays tied to the real booklet.",
  };
}

function buildActionPrompt(page: EvaBookletPage) {
  if (page.type.includes("grammar")) {
    return `Write three original sentences using the grammar focus from page ${page.page}. Then correct one sentence and explain the change.`;
  }
  if (page.type.includes("vocabulary")) {
    return `Choose five useful words from page ${page.page}. For each one, write a natural collocation and one sentence you could actually say.`;
  }
  if (page.type.includes("translation")) {
    return `Translate the strongest line from page ${page.page}. Then rewrite it once so it sounds natural in English.`;
  }
  if (page.type.includes("reading") || page.type.includes("enrichment")) {
    return `Summarize page ${page.page} in two sentences. Then write one IELTS/TOEFL-style inference question about it.`;
  }
  if (page.type.includes("listening")) {
    return `Listen once, repeat once, then write the sentence that was hardest to say clearly.`;
  }
  return `Write the one idea from page ${page.page} that is worth remembering, then turn it into one small action.`;
}

function statusText(status: SaveState, locale: "en" | "fa") {
  return uiCopy[locale][status];
}

function compactPercent(value: number) {
  return `${Math.round(value)}%`;
}

function pickRelatedModule(page: EvaBookletPage) {
  const haystack = pageSearchHaystack(page);
  if (haystack.includes("grammar") || page.type.includes("grammar")) {
    return evaGrammarModules.find((module) => module.sourceTypes.includes(page.type)) ?? evaGrammarModules[0];
  }
  if (haystack.includes("prayer") || haystack.includes("ministry") || haystack.includes("bible")) {
    return evaReligiousModules.find((module) => module.sourceTypes.includes(page.type)) ?? evaReligiousModules[0];
  }
  return evaGrammarModules.find((module) => module.id === "grammar-paragraph-control") ?? evaGrammarModules[0];
}

function pickRelatedLexical(page: EvaBookletPage) {
  const haystack = pageSearchHaystack(page);
  return (
    evaLexicalResource.find((item) => item.tags.some((tag) => haystack.includes(tag.toLowerCase()))) ??
    evaLexicalResource.find((item) => haystack.includes(item.term.toLowerCase())) ??
    evaLexicalResource[0]
  );
}

export function EvaStudioExperience({ booklet, activeUser, persistenceMode }: EvaStudioExperienceProps) {
  const locale = activeUser.locale === "fa" ? "fa" : "en";
  const copy = uiCopy[locale];
  const isTeacherView = activeUser.canTeach;
  const [studioState, setStudioState] = useState<EvaStoredStudioState>(() => normalizeStoredState(null));
  const [teacherSnapshots, setTeacherSnapshots] = useState<Record<EvaUserId, EvaStoredStudioState>>({
    ali: normalizeStoredState(null),
    eva: normalizeStoredState(null),
    elham: normalizeStoredState(null),
  });
  const [saveState, setSaveState] = useState<SaveState>("loading");
  const [activeView, setActiveView] = useState<StudioView>("study");
  const [search, setSearch] = useState("");

  const database = useMemo(() => buildEvaLearningDatabase(booklet), [booklet]);
  const storageKey = evaUserStorageKey(activeUser.id);

  const chapterPages = useMemo(() => {
    return new Map(booklet.chapters.map((chapter) => [chapter.id, booklet.pages.filter((page) => page.chapterId === chapter.id)]));
  }, [booklet.chapters, booklet.pages]);

  const completedCount = booklet.pages.filter((page) => isPageComplete(studioState, page.id)).length;
  const reviewIds = Object.keys(studioState.reviewQueue)
    .filter((key) => studioState.reviewQueue[key])
    .map((key) => key.replace(/^page:/, "").replace(/:review$/, ""))
    .filter((id) => booklet.pages.some((page) => page.id === id));
  const progressPercent = booklet.pages.length ? (completedCount / booklet.pages.length) * 100 : 0;

  const activeChapter =
    booklet.chapters.find((chapter) => chapter.id === studioState.activeChapterId) ??
    booklet.chapters.find((chapter) => !chapter.pageIds.every((pageId) => isPageComplete(studioState, pageId))) ??
    booklet.chapters[0];

  const pagesInActiveChapter = useMemo(() => chapterPages.get(activeChapter.id) ?? [], [activeChapter.id, chapterPages]);
  const activePage =
    booklet.pages.find((page) => page.id === studioState.activePageId) ??
    pagesInActiveChapter.find((page) => !isPageComplete(studioState, page.id)) ??
    pagesInActiveChapter[0] ??
    booklet.pages[0];

  const activePageIndex = booklet.pages.findIndex((page) => page.id === activePage.id);
  const activeChapterIndex = booklet.chapters.findIndex((chapter) => chapter.id === activeChapter.id);
  const activeBlocks = pageReadableBlocks(activePage);
  const activeQuestion = buildPageQuestion(activePage, pagesInActiveChapter);
  const relatedModule = pickRelatedModule(activePage);
  const relatedLexical = pickRelatedLexical(activePage);
  const relatedExam = database.examTasks.find((task) => task.skill === "reading") ?? database.examTasks[0];
  const activeAnswer = studioState.quizAnswers[activeQuestion.id];
  const draft = activeDraft(studioState, activePage.id);
  const isDone = isPageComplete(studioState, activePage.id);
  const isInReview = Boolean(studioState.reviewQueue[reviewKey(activePage.id)] || studioState.reviewQueue[activePage.id]);
  const sourceText = [activePage.title, activePage.summary, ...activeBlocks.slice(0, 8)].join(". ");

  const filteredPages = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return pagesInActiveChapter;
    return booklet.pages.filter((page) => pageSearchHaystack(page).includes(normalized));
  }, [booklet.pages, pagesInActiveChapter, search]);

  const persistState = useCallback(
    async (nextState: EvaStoredStudioState) => {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(nextState));
        window.localStorage.setItem(legacyStorageKey, JSON.stringify(nextState));
      } catch {
        // Browser storage can be disabled; the server/local API still gets a chance below.
      }

      setSaveState("saving");
      try {
        const response = await fetch("/eva-digital-booklet/state", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ state: nextState }),
        });

        if (!response.ok) {
          setSaveState("local");
          return;
        }

        setSaveState(persistenceMode === "development" ? "local" : "saved");
      } catch {
        setSaveState("local");
      }
    },
    [persistenceMode, storageKey],
  );

  const updateStudioState = useCallback(
    (updater: (current: EvaStoredStudioState) => EvaStoredStudioState) => {
      setStudioState((current) => {
        const nextState = normalizeStoredState(updater(current));
        void persistState(nextState);
        return nextState;
      });
    },
    [persistState],
  );

  useEffect(() => {
    let isActive = true;

    async function loadState() {
      try {
        const localRaw = window.localStorage.getItem(storageKey) ?? window.localStorage.getItem(legacyStorageKey);
        if (localRaw && isActive) {
          setStudioState(normalizeStoredState(JSON.parse(localRaw) as Partial<EvaStoredStudioState>));
          setSaveState("local");
        }
      } catch {
        setSaveState("error");
      }

      try {
        const response = await fetch("/eva-digital-booklet/state", { method: "GET" });
        if (!response.ok) {
          if (isActive) setSaveState("local");
          return;
        }

        const payload = (await response.json()) as {
          state?: Partial<EvaStoredStudioState>;
          teacherSnapshots?: Record<EvaUserId, Partial<EvaStoredStudioState>> | null;
        };

        if (!isActive) return;

        const serverState = normalizeStoredState(payload.state);
        setStudioState(serverState);
        try {
          window.localStorage.setItem(storageKey, JSON.stringify(serverState));
        } catch {
          // Fine: the private portal can still read the server/local API state.
        }

        if (payload.teacherSnapshots) {
          setTeacherSnapshots({
            ali: normalizeStoredState(payload.teacherSnapshots.ali),
            eva: normalizeStoredState(payload.teacherSnapshots.eva),
            elham: normalizeStoredState(payload.teacherSnapshots.elham),
          });
        }

        setSaveState(persistenceMode === "development" ? "local" : "saved");
      } catch {
        if (isActive) setSaveState("local");
      }
    }

    void loadState();

    return () => {
      isActive = false;
    };
  }, [persistenceMode, storageKey]);

  const choosePage = useCallback(
    (page: EvaBookletPage, view: StudioView = "study") => {
      setActiveView(view);
      updateStudioState((current) => ({
        ...current,
        activeChapterId: page.chapterId,
        activePageId: page.id,
        activePremiumTab: view,
      }));
    },
    [updateStudioState],
  );

  const chooseChapter = useCallback(
    (chapter: EvaBookletChapter) => {
      const firstOpenPage = (chapterPages.get(chapter.id) ?? []).find((page) => !isPageComplete(studioState, page.id)) ?? booklet.pages.find((page) => page.id === chapter.pageIds[0]);
      if (firstOpenPage) choosePage(firstOpenPage);
    },
    [booklet.pages, chapterPages, choosePage, studioState],
  );

  function updateDraft(value: string) {
    updateStudioState((current) => ({
      ...current,
      writingDrafts: {
        ...current.writingDrafts,
        [draftKey(activePage.id)]: value,
      },
    }));
  }

  function answerQuestion(index: number) {
    updateStudioState((current) => ({
      ...current,
      quizAnswers: {
        ...current.quizAnswers,
        [activeQuestion.id]: index,
      },
      reviewQueue:
        index === activeQuestion.answerIndex
          ? current.reviewQueue
          : {
              ...current.reviewQueue,
              [reviewKey(activePage.id)]: true,
            },
    }));
  }

  function toggleDone() {
    updateStudioState((current) => ({
      ...current,
      done: {
        ...current.done,
        [activePage.id]: !isPageComplete(current, activePage.id),
        [pageDoneKey(activePage.id)]: !isPageComplete(current, activePage.id),
      },
    }));
  }

  function toggleReview() {
    updateStudioState((current) => ({
      ...current,
      reviewQueue: {
        ...current.reviewQueue,
        [reviewKey(activePage.id)]: !current.reviewQueue[reviewKey(activePage.id)],
      },
    }));
  }

  function markModuleDone(moduleId: string) {
    updateStudioState((current) => ({
      ...current,
      moduleDone: {
        ...current.moduleDone,
        [moduleId]: !current.moduleDone[moduleId],
      },
      activityChecks: {
        ...current.activityChecks,
        [`module-evidence-${moduleId}`]: true,
      },
    }));
  }

  function speak(text: string, segmentId: string, repeat = false) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      updateStudioState((current) => ({
        ...current,
        ttsListened: {
          ...current.ttsListened,
          [segmentId]: (current.ttsListened[segmentId] ?? 0) + 1,
        },
      }));
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = repeat ? 0.72 : 0.86;
    utterance.pitch = 0.96;
    window.speechSynthesis.speak(utterance);

    updateStudioState((current) => ({
      ...current,
      ttsListened: {
        ...current.ttsListened,
        [segmentId]: (current.ttsListened[segmentId] ?? 0) + 1,
      },
      ttsRepeated: repeat
        ? {
            ...current.ttsRepeated,
            [segmentId]: (current.ttsRepeated[segmentId] ?? 0) + 1,
          }
        : current.ttsRepeated,
      shadowingDone: repeat
        ? {
            ...current.shadowingDone,
            [segmentId]: true,
          }
        : current.shadowingDone,
    }));
  }

  function goNext() {
    const afterCurrent = booklet.pages.slice(Math.max(activePageIndex + 1, 0)).find((page) => !isPageComplete(studioState, page.id));
    const fromStart = booklet.pages.find((page) => !isPageComplete(studioState, page.id));
    choosePage(afterCurrent ?? fromStart ?? booklet.pages[Math.min(activePageIndex + 1, booklet.pages.length - 1)]);
  }

  function goPrevious() {
    choosePage(booklet.pages[Math.max(0, activePageIndex - 1)]);
  }

  return (
    <section className="eva-minimal-studio" dir={locale === "fa" ? "rtl" : "ltr"}>
      <div className="rounded-[8px] border border-amber-200/20 bg-slate-950/62 shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
        <div className="border-b border-white/10 p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">Eva Digital Booklet Studio</p>
              <h2 className="mt-2 text-2xl font-semibold leading-tight text-white sm:text-4xl">
                {isTeacherView
                  ? locale === "fa"
                    ? "یک صفحه بخوان، همان صفحه را تمرین کن."
                    : "Read one page. Practice the same page."
                  : locale === "fa"
                    ? "تمرین امروزت همین‌جاست."
                    : "Today's practice is here."}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                {isTeacherView
                  ? locale === "fa"
                    ? "این نسخه‌ی مینیمال، کل جزوه‌ی ۲۹۸ صفحه‌ای را به مسیرهای کوچک و قابل پیگیری تبدیل می‌کند: خواندن، جواب دادن، شنیدن، تکرار و مرور."
                    : "A quiet study app for the full 298-page booklet: read, answer, listen, repeat, review, and move forward without noise."
                  : locale === "fa"
                    ? "اول تمرین را انجام بده. اگر لازم شد، متن همان صفحه را پایین‌تر بخوان. همین."
                    : "Do the exercise first. If you need it, read the source page below. That is all."}
              </p>
            </div>
            <div dir="ltr" className={cn("min-w-0 rounded-[8px] border border-white/10 bg-white/[0.035] p-2 text-center", isTeacherView ? "grid grid-cols-3 gap-2 sm:min-w-[340px]" : "w-full sm:w-[300px]")}>
              {isTeacherView ? (
                <>
                  <div className="rounded-[6px] bg-slate-950/62 px-3 py-3">
                    <p className="text-xl font-semibold text-white">{completedCount}</p>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">done</p>
                  </div>
                  <div className="rounded-[6px] bg-slate-950/62 px-3 py-3">
                    <p className="text-xl font-semibold text-amber-100">{compactPercent(progressPercent)}</p>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">coverage</p>
                  </div>
                  <div className="rounded-[6px] bg-slate-950/62 px-3 py-3">
                    <p className="text-xl font-semibold text-sky-100">{reviewIds.length}</p>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">review</p>
                  </div>
                </>
              ) : (
                <div className="rounded-[6px] bg-slate-950/62 px-4 py-3 text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Page {activePage.page} of {booklet.stats.pages}
                  </p>
                  <p className="mt-1 text-xl font-semibold text-white">{compactPercent(progressPercent)} complete</p>
                </div>
              )}
            </div>
          </div>

          {!isTeacherView ? (
            <StudentPathPicker
              booklet={booklet}
              chapters={booklet.chapters}
              pagesInChapter={pagesInActiveChapter}
              activeChapter={activeChapter}
              activePage={activePage}
              state={studioState}
              locale={locale}
              onChapter={(chapterId) => {
                const chapter = booklet.chapters.find((item) => item.id === chapterId);
                if (chapter) chooseChapter(chapter);
              }}
              onPage={(pageId) => {
                const page = booklet.pages.find((item) => item.id === pageId);
                if (page) choosePage(page);
              }}
            />
          ) : null}

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-amber-300 via-sky-300 to-teal-300 transition-all duration-500" style={{ width: `${Math.max(2, progressPercent)}%` }} />
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {[
                { id: "study" as const, label: copy.today, icon: BookOpen },
                { id: "ebook" as const, label: copy.ebook, icon: LibraryBig },
                { id: "review" as const, label: copy.review, icon: RotateCcw },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveView(item.id)}
                    className={cn(
                      "inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] border px-4 text-sm font-semibold transition",
                      activeView === item.id ? "border-amber-200/55 bg-amber-200/12 text-amber-50" : "border-white/10 bg-white/[0.035] text-slate-300 hover:border-white/20 hover:text-white",
                    )}
                  >
                    <Icon aria-hidden="true" className="size-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-slate-950/58 px-3 py-2 text-xs font-semibold text-slate-400 sm:self-auto">
              <span className={cn("size-2 rounded-full", saveState === "saving" || saveState === "loading" ? "bg-amber-300" : saveState === "error" ? "bg-rose-300" : "bg-emerald-300")} />
              {statusText(saveState, locale)}
            </div>
          </div>
        </div>

        <div className={cn("grid gap-0", isTeacherView && "xl:grid-cols-[290px_minmax(0,1fr)]")}>
          {isTeacherView ? (
          <aside className="min-w-0 border-b border-white/10 p-4 sm:p-5 xl:border-b-0 xl:border-r xl:border-white/10">
            <label className="relative block">
              <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500 rtl:left-auto rtl:right-3" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={copy.search}
                className="min-h-12 w-full rounded-[8px] border border-white/10 bg-slate-950/70 px-10 text-sm font-medium text-white outline-none transition placeholder:text-slate-500 focus:border-amber-200/45 focus:ring-2 focus:ring-amber-200/15"
              />
            </label>

            <div className="mt-5 flex gap-2 overflow-x-auto pb-1 xl:block xl:space-y-2 xl:overflow-visible xl:pb-0">
              {booklet.chapters.map((chapter) => {
                const chapterDone = chapter.pageIds.filter((pageId) => isPageComplete(studioState, pageId)).length;
                const chapterPercent = chapter.pageIds.length ? (chapterDone / chapter.pageIds.length) * 100 : 0;
                const isActive = chapter.id === activeChapter.id;
                return (
                  <button
                    key={chapter.id}
                    type="button"
                    onClick={() => chooseChapter(chapter)}
                    className={cn(
                      "min-w-[240px] rounded-[8px] border p-3 text-left transition rtl:text-right xl:min-w-0 xl:w-full",
                      isActive ? "border-amber-200/45 bg-amber-200/10 shadow-[0_14px_44px_rgba(251,191,36,0.08)]" : "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.045]",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{chapter.label}</p>
                        <p className="mt-1 text-sm font-semibold leading-5 text-white">{chapter.shortTitle}</p>
                      </div>
                      <span className="rounded-full border border-white/10 px-2 py-1 text-[11px] font-semibold text-slate-400">
                        {chapterDone}/{chapter.pageIds.length}
                      </span>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-amber-200/80 transition-all" style={{ width: `${chapterPercent}%` }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>
          ) : null}

          <main className="min-w-0 p-4 sm:p-5">
            {activeView === "review" ? (
              <ReviewView pages={booklet.pages} reviewIds={reviewIds} state={studioState} onOpen={(page) => choosePage(page)} onToggleReview={(page) => choosePage(page, "study")} emptyText={copy.noReview} />
            ) : activeView === "ebook" ? (
              <EbookView
                pages={filteredPages}
                activePage={activePage}
                activeChapter={activeChapter}
                state={studioState}
                onOpen={(page) => choosePage(page, "study")}
                onComplete={(page) => {
                  choosePage(page, "ebook");
                  updateStudioState((current) => ({
                    ...current,
                    done: {
                      ...current.done,
                      [page.id]: true,
                      [pageDoneKey(page.id)]: true,
                    },
                  }));
                }}
              />
            ) : (
              <div className={cn("grid gap-5", isTeacherView ? "2xl:grid-cols-[minmax(0,1.04fr)_minmax(360px,0.72fr)]" : "mx-auto max-w-4xl")}>
                <article dir="ltr" className={cn("min-w-0 rounded-[8px] border border-white/10 bg-white/[0.035] p-4 text-left sm:p-5", !isTeacherView && "order-2")}>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-200">
                        Page {activePage.page} / {booklet.stats.pages} · {skillLabel(activePage)}
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold leading-tight text-white">{activePage.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-300">{activePage.summary}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={goPrevious}
                        className="inline-flex size-11 items-center justify-center rounded-[8px] border border-white/10 text-slate-300 transition hover:border-white/25 hover:text-white"
                        aria-label={copy.previous}
                      >
                        <ChevronLeft aria-hidden="true" className="size-4 rtl:rotate-180" />
                      </button>
                      <button
                        type="button"
                        onClick={goNext}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] border border-amber-200/35 bg-amber-200/12 px-4 text-sm font-semibold text-amber-50 transition hover:border-amber-100/70"
                      >
                        {copy.next}
                        <ChevronRight aria-hidden="true" className="size-4 rtl:rotate-180" />
                      </button>
                    </div>
                  </div>

                  {isTeacherView ? (
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <InfoStrip icon={Target} label="Chapter" value={`${activeChapterIndex + 1}. ${activeChapter.shortTitle}`} />
                    <InfoStrip icon={NotebookPen} label="Fields" value={`${activePage.fieldCount} prompts`} />
                    <InfoStrip icon={ListChecks} label="Checklist" value={`${activePage.checkboxCount} checks`} />
                  </div>
                  ) : null}

                  <div className="mt-5 rounded-[8px] border border-white/10 bg-slate-950/44 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">{copy.read}</h4>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => speak(sourceText, readKey(activePage.id))}
                          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[8px] border border-white/10 px-3 text-sm font-semibold text-slate-200 transition hover:border-sky-200/40 hover:text-sky-100"
                        >
                          <Volume2 aria-hidden="true" className="size-4" />
                          {copy.listen}
                        </button>
                        <button
                          type="button"
                          onClick={() => speak(sourceText, readKey(activePage.id), true)}
                          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[8px] border border-white/10 px-3 text-sm font-semibold text-slate-200 transition hover:border-sky-200/40 hover:text-sky-100"
                        >
                          <Mic2 aria-hidden="true" className="size-4" />
                          {copy.repeat}
                        </button>
                      </div>
                    </div>

                    <div dir="ltr" className="mt-4 max-h-[520px] space-y-4 overflow-y-auto pr-1 text-left text-sm leading-7 text-slate-200 rtl:pl-1 rtl:pr-0">
                      {activeBlocks.map((block, index) => (
                        <p key={`${activePage.id}-${index}`} className={cn(index === 0 && "text-base font-semibold leading-8 text-white")}>
                          {block}
                        </p>
                      ))}
                    </div>
                  </div>

                  {isTeacherView ? (
                  <div className="mt-5">
                    <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-400">Pages in this path</h4>
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                      {filteredPages.slice(0, 80).map((page) => (
                        <button
                          key={page.id}
                          type="button"
                          onClick={() => choosePage(page)}
                          className={cn(
                            "inline-flex min-h-10 min-w-16 items-center justify-center rounded-[8px] border px-3 text-xs font-semibold transition",
                            page.id === activePage.id
                              ? "border-amber-200/60 bg-amber-200/12 text-amber-50"
                              : isPageComplete(studioState, page.id)
                                ? "border-emerald-200/25 bg-emerald-300/10 text-emerald-100"
                                : "border-white/10 bg-white/[0.025] text-slate-400 hover:border-white/20 hover:text-white",
                          )}
                        >
                          {page.page}
                        </button>
                      ))}
                    </div>
                  </div>
                  ) : null}
                </article>

                <aside className={cn("min-w-0 space-y-5", !isTeacherView && "order-1")}>
                  <section dir="ltr" className="rounded-[8px] border border-amber-200/20 bg-gradient-to-b from-amber-200/10 to-white/[0.035] p-4 text-left sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-200">{copy.practice}</p>
                        <h3 className="mt-2 text-xl font-semibold leading-tight text-white">
                          {locale === "fa" ? "تمرین همین صفحه" : "Practice this page"}
                        </h3>
                      </div>
                      {isDone ? <CheckCircle2 aria-hidden="true" className="size-6 text-emerald-200" /> : <Sparkles aria-hidden="true" className="size-6 text-amber-200" />}
                    </div>

                    <div className="mt-5 rounded-[8px] border border-white/10 bg-slate-950/42 p-4">
                      <p className="text-sm font-semibold leading-6 text-white">{activeQuestion.prompt}</p>
                      <div className="mt-3 space-y-2">
                        {activeQuestion.options.map((option, index) => {
                          const isSelected = activeAnswer === index;
                          const isCorrect = activeQuestion.answerIndex === index;
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => answerQuestion(index)}
                              className={cn(
                                "flex w-full items-start gap-3 rounded-[8px] border p-3 text-left text-sm leading-6 transition",
                                isSelected && isCorrect
                                  ? "border-emerald-200/45 bg-emerald-300/10 text-emerald-50"
                                  : isSelected
                                    ? "border-rose-200/45 bg-rose-300/10 text-rose-50"
                                    : "border-white/10 bg-white/[0.025] text-slate-300 hover:border-white/20 hover:text-white",
                              )}
                            >
                              <span className="mt-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-current text-[11px]">{index + 1}</span>
                              {option}
                            </button>
                          );
                        })}
                      </div>
                      {typeof activeAnswer === "number" ? <p className="mt-3 text-sm leading-6 text-slate-300">{activeQuestion.rationale}</p> : null}
                    </div>

                    <div className="mt-4 rounded-[8px] border border-white/10 bg-slate-950/42 p-4">
                      <p className="text-sm font-semibold leading-6 text-white">{buildActionPrompt(activePage)}</p>
                      <textarea
                        value={draft}
                        onChange={(event) => updateDraft(event.target.value)}
                        placeholder={copy.answerPlaceholder}
                        rows={7}
                        dir="ltr"
                        className="mt-3 w-full resize-y rounded-[8px] border border-white/10 bg-slate-950/70 p-3 text-sm leading-7 text-white outline-none transition placeholder:text-slate-500 focus:border-amber-200/45 focus:ring-2 focus:ring-amber-200/15"
                      />
                      <p className="mt-2 text-xs font-semibold text-slate-500">{copy.saveAnswer}</p>
                    </div>

                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={toggleDone}
                        className={cn(
                          "inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] border px-4 text-sm font-semibold transition",
                          isDone ? "border-emerald-200/40 bg-emerald-300/12 text-emerald-50" : "border-white/10 bg-white/[0.04] text-slate-200 hover:border-emerald-200/35 hover:text-emerald-50",
                        )}
                      >
                        <Check aria-hidden="true" className="size-4" />
                        {isDone ? copy.doneShort : copy.done}
                      </button>
                      <button
                        type="button"
                        onClick={toggleReview}
                        className={cn(
                          "inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] border px-4 text-sm font-semibold transition",
                          isInReview ? "border-sky-200/45 bg-sky-300/12 text-sky-50" : "border-white/10 bg-white/[0.04] text-slate-200 hover:border-sky-200/35 hover:text-sky-50",
                        )}
                      >
                        <RotateCcw aria-hidden="true" className="size-4" />
                        {isInReview ? copy.removeReview : copy.addReview}
                      </button>
                    </div>
                  </section>

                  {isTeacherView ? (
                  <section dir="ltr" className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4 text-left sm:p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-[8px] border border-amber-200/25 bg-amber-200/10 text-amber-100">
                        <Target aria-hidden="true" className="size-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{relatedModule.title}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-400">{relatedModule.outcome}</p>
                      </div>
                    </div>
                    <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-300">
                      {relatedModule.practice.slice(0, 3).map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-200" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={() => markModuleDone(relatedModule.id)}
                      className={cn(
                        "mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-[8px] border px-3 text-sm font-semibold transition",
                        studioState.moduleDone[relatedModule.id]
                          ? "border-emerald-200/40 bg-emerald-300/12 text-emerald-50"
                          : "border-white/10 text-slate-200 hover:border-amber-200/35 hover:text-amber-50",
                      )}
                    >
                      <Check aria-hidden="true" className="size-4" />
                      {relatedModule.evidence}
                    </button>
                  </section>
                  ) : null}

                  {isTeacherView ? (
                  <section className="grid gap-3 sm:grid-cols-2">
                    <MiniPracticeCard
                      icon={Headphones}
                      title={relatedLexical.term}
                      text={`${relatedLexical.ipa} · ${relatedLexical.meaning}`}
                      action="Pronunciation"
                      onClick={() => speak(`${relatedLexical.term}. ${relatedLexical.stress}. ${relatedLexical.example}`, `tts-lexical-${relatedLexical.id}`, true)}
                    />
                    <MiniPracticeCard
                      icon={BookOpen}
                      title={relatedExam.title}
                      text={`${relatedExam.exam} · ${relatedExam.timeLimitMinutes} min · ${relatedExam.level}`}
                      action="Exam mode"
                      onClick={() => {
                        updateStudioState((current) => ({
                          ...current,
                          activeExamId: relatedExam.id,
                          reviewQueue: {
                            ...current.reviewQueue,
                            [`exam:${relatedExam.id}`]: true,
                          },
                        }));
                      }}
                    />
                  </section>
                  ) : null}
                </aside>
              </div>
            )}

            {activeUser.canTeach ? (
              <TeacherLens booklet={booklet} snapshots={teacherSnapshots} label={copy.teacher} />
            ) : null}
          </main>
        </div>
      </div>
    </section>
  );
}

function StudentPathPicker({
  chapters,
  pagesInChapter,
  activeChapter,
  activePage,
  state,
  locale,
  onChapter,
  onPage,
}: {
  booklet: EvaBooklet;
  chapters: EvaBookletChapter[];
  pagesInChapter: EvaBookletPage[];
  activeChapter: EvaBookletChapter;
  activePage: EvaBookletPage;
  state: EvaStoredStudioState;
  locale: "en" | "fa";
  onChapter: (chapterId: string) => void;
  onPage: (pageId: string) => void;
}) {
  const chapterDone = activeChapter.pageIds.filter((pageId) => isPageComplete(state, pageId)).length;

  return (
    <div className="mt-5 rounded-[8px] border border-white/10 bg-white/[0.025] p-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{locale === "fa" ? "فصل" : "Chapter"}</span>
          <select
            value={activeChapter.id}
            onChange={(event) => onChapter(event.target.value)}
            className="mt-2 min-h-11 w-full rounded-[8px] border border-white/10 bg-slate-950/70 px-3 text-sm font-semibold text-white outline-none focus:border-amber-200/45 focus:ring-2 focus:ring-amber-200/15"
          >
            {chapters.map((chapter) => (
              <option key={chapter.id} value={chapter.id}>
                {chapter.label} · {chapter.shortTitle}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{locale === "fa" ? "صفحه" : "Page"}</span>
          <select
            value={activePage.id}
            onChange={(event) => onPage(event.target.value)}
            className="mt-2 min-h-11 w-full rounded-[8px] border border-white/10 bg-slate-950/70 px-3 text-sm font-semibold text-white outline-none focus:border-amber-200/45 focus:ring-2 focus:ring-amber-200/15"
          >
            {pagesInChapter.map((page) => (
              <option key={page.id} value={page.id}>
                {page.page}. {page.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-xs font-semibold text-slate-400" dir="ltr">
        <span>
          {chapterDone}/{activeChapter.pageIds.length} pages done
        </span>
        <span>{activePage.title}</span>
      </div>
    </div>
  );
}

function InfoStrip({ icon: Icon, label, value }: { icon: typeof Target; label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-white/10 bg-white/[0.025] p-3">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon aria-hidden="true" className="size-4" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">{label}</p>
      </div>
      <p dir="ltr" className="mt-2 truncate text-sm font-semibold text-slate-100">
        {value}
      </p>
    </div>
  );
}

function MiniPracticeCard({
  icon: Icon,
  title,
  text,
  action,
  onClick,
}: {
  icon: typeof Headphones;
  title: string;
  text: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      dir="ltr"
      className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4 text-left transition hover:border-amber-200/35 hover:bg-white/[0.055]"
    >
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-[8px] border border-white/10 bg-slate-950/54 text-sky-100">
          <Icon aria-hidden="true" className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{title}</p>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">{text}</p>
        </div>
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-amber-200">{action}</p>
    </button>
  );
}

function EbookView({
  pages,
  activePage,
  activeChapter,
  state,
  onOpen,
  onComplete,
}: {
  pages: EvaBookletPage[];
  activePage: EvaBookletPage;
  activeChapter: EvaBookletChapter;
  state: EvaStoredStudioState;
  onOpen: (page: EvaBookletPage) => void;
  onComplete: (page: EvaBookletPage) => void;
}) {
  return (
    <div className="grid gap-5 2xl:grid-cols-[360px_minmax(0,1fr)]">
      <aside dir="ltr" className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4 text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-200">Read-only ebook</p>
        <h3 className="mt-2 text-xl font-semibold text-white">{activeChapter.shortTitle}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">Every imported page stays reachable. Open a page when you want to turn it into practice.</p>
        <div className="mt-4 max-h-[620px] space-y-2 overflow-y-auto pr-1 rtl:pl-1 rtl:pr-0">
          {pages.map((page) => (
            <button
              key={page.id}
              type="button"
              onClick={() => onOpen(page)}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-[8px] border p-3 text-left transition",
                page.id === activePage.id ? "border-amber-200/45 bg-amber-200/10" : "border-white/10 bg-slate-950/36 hover:border-white/20",
              )}
            >
              <span className="min-w-0">
                <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Page {page.page}</span>
                <span className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-white">{page.title}</span>
              </span>
              {isPageComplete(state, page.id) ? <CheckCircle2 aria-hidden="true" className="size-5 shrink-0 text-emerald-200" /> : null}
            </button>
          ))}
        </div>
      </aside>

      <article dir="ltr" className="rounded-[8px] border border-white/10 bg-slate-950/48 p-4 text-left sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Page {activePage.page}</p>
        <h3 className="mt-2 text-2xl font-semibold leading-tight text-white">{activePage.title}</h3>
        <p className="mt-2 text-sm leading-7 text-slate-300">{activePage.summary}</p>
        <div className="mt-5 max-h-[720px] space-y-4 overflow-y-auto pr-1 text-sm leading-7 text-slate-200 rtl:pl-1 rtl:pr-0">
          {pageReadableBlocks(activePage).map((block, index) => (
            <p key={`${activePage.id}-ebook-${index}`}>{block}</p>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onComplete(activePage)}
          className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] border border-emerald-200/30 bg-emerald-300/10 px-4 text-sm font-semibold text-emerald-50 transition hover:border-emerald-200/55"
        >
          <Check aria-hidden="true" className="size-4" />
          Mark this ebook page read
        </button>
      </article>
    </div>
  );
}

function ReviewView({
  pages,
  reviewIds,
  state,
  onOpen,
  emptyText,
}: {
  pages: EvaBookletPage[];
  reviewIds: string[];
  state: EvaStoredStudioState;
  onOpen: (page: EvaBookletPage) => void;
  onToggleReview: (page: EvaBookletPage) => void;
  emptyText: string;
}) {
  const reviewPages = reviewIds.map((id) => pages.find((page) => page.id === id)).filter((page): page is EvaBookletPage => Boolean(page));

  if (!reviewPages.length) {
    return (
      <div className="rounded-[8px] border border-white/10 bg-white/[0.035] p-8 text-center">
        <RotateCcw aria-hidden="true" className="mx-auto size-8 text-slate-500" />
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-400">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4 sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-200">Weak pages</p>
      <h3 className="mt-2 text-2xl font-semibold text-white">Review only what actually needs attention</h3>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {reviewPages.map((page) => (
          <button
            key={page.id}
            type="button"
            onClick={() => onOpen(page)}
            dir="ltr"
            className="rounded-[8px] border border-white/10 bg-slate-950/44 p-4 text-left transition hover:border-amber-200/35"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Page {page.page}</p>
                <p className="mt-1 text-base font-semibold leading-6 text-white">{page.title}</p>
              </div>
              {isPageComplete(state, page.id) ? <CheckCircle2 aria-hidden="true" className="size-5 shrink-0 text-emerald-200" /> : <RotateCcw aria-hidden="true" className="size-5 shrink-0 text-amber-200" />}
            </div>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">{page.summary}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function TeacherLens({
  booklet,
  snapshots,
  label,
}: {
  booklet: EvaBooklet;
  snapshots: Record<EvaUserId, EvaStoredStudioState>;
  label: string;
}) {
  return (
    <section dir="ltr" className="mt-5 rounded-[8px] border border-white/10 bg-white/[0.025] p-4 text-left sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {evaSeedUsers.map((user) => {
          const snapshot = snapshots[user.id] ?? normalizeStoredState(null);
          const done = booklet.pages.filter((page) => isPageComplete(snapshot, page.id)).length;
          const reviews = Object.values(snapshot.reviewQueue).filter(Boolean).length;
          return (
            <div key={user.id} className="rounded-[8px] border border-white/10 bg-slate-950/40 p-4">
              <p className="text-base font-semibold text-white">{user.displayName}</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-amber-200 to-sky-200" style={{ width: `${booklet.pages.length ? (done / booklet.pages.length) * 100 : 0}%` }} />
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {done}/{booklet.pages.length} pages · {reviews} review items
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
