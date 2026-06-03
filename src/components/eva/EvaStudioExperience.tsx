"use client";

import NextImage from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  BookOpen,
  Check,
  ChevronRight,
  CircleCheck,
  Database,
  Download,
  FileText,
  Flame,
  Gauge,
  GraduationCap,
  Headphones,
  LibraryBig,
  ListChecks,
  Layers3,
  LockKeyhole,
  Mic2,
  NotebookPen,
  Play,
  PenLine,
  RotateCcw,
  Repeat2,
  Search,
  Sparkles,
  Star,
  Target,
  Timer,
  UserCheck,
  Users,
  Volume2,
} from "lucide-react";
import type { EvaBooklet, EvaBookletChapter, EvaBookletPage, EvaBookletStack } from "@/lib/eva-private-content";
import {
  buildEvaLearningDatabase,
  evaSeedUsers,
  evaUserStorageKey,
  normalizeStoredState,
  type EvaSeedUser,
  type EvaStoredStudioState,
  type EvaUserId,
} from "@/lib/eva-learning-db";
import {
  evaMaterialCollections,
  evaMaterialItems,
  evaMaterialSourcePolicy,
  evaMaterialStats,
  type EvaMaterialItem,
  type EvaMaterialTrack,
} from "@/lib/eva-materials";
import {
  evaGrammarModules,
  evaLexicalResource,
  evaQuizQuestions,
  evaReligiousModules,
  evaSkillModules,
  evaWorkflowSteps,
  type EvaQuizQuestion,
  type EvaSkillModule,
  type EvaStudioTrack,
} from "@/lib/eva-studio-curriculum";
import { cn } from "@/lib/utils";

type EvaStudioExperienceProps = {
  booklet: EvaBooklet;
  activeUser: EvaSeedUser;
};

const legacyStorageKey = "edupocket-eva-studio-v1";
const levelOrder = ["Supported", "Independent", "Challenging", "Critical Thinking", "Portfolio"];

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

type PremiumTabId = "overview" | EvaStudioTrack | "materials" | "quiz" | "exam" | "vault";

const premiumTabs: Array<{ id: PremiumTabId; title: string; description: string }> = [
  { id: "overview", title: "Use model", description: "How the studio should be worked." },
  { id: "grammar", title: "Grammar Atlas", description: "10 accuracy chapters." },
  { id: "religious", title: "Religious Context", description: "10 meaning chapters." },
  { id: "lexical", title: "Pronunciation Lab", description: "Lexis, stress, IPA, and shadowing." },
  { id: "materials", title: "Material Library", description: "Original packs and TTS scripts." },
  { id: "quiz", title: "Quiz & Review", description: "Track mastery signals." },
  { id: "exam", title: "Exam Mode", description: "Timed IELTS/TOEFL practice." },
  { id: "vault", title: "Writing Vault", description: "Saved drafts and teacher notes." },
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

function countChecks(pages: EvaBookletPage[]) {
  return pages.reduce((total, page) => total + page.checkboxCount, 0);
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

function pagesForModule(module: EvaSkillModule, pages: EvaBookletPage[]) {
  return pages.filter((page) => module.sourceTypes.includes(page.type));
}

function moduleTrackTitle(track: EvaStudioTrack) {
  if (track === "grammar") return "Grammar Atlas";
  if (track === "religious") return "Religious Context Library";
  return "Lexical Resource";
}

function quizTrackTitle(track: EvaStudioTrack) {
  if (track === "grammar") return "Grammar";
  if (track === "religious") return "Religious context";
  return "Lexical resource";
}

function answeredCorrectly(selected: number | undefined, answerIndex: number) {
  return selected !== undefined && selected === answerIndex;
}

function recordCount(record: Record<string, unknown>) {
  return Object.values(record).filter(Boolean).length;
}

export function EvaStudioExperience({ booklet, activeUser }: EvaStudioExperienceProps) {
  const [activeStackId, setActiveStackId] = useState(booklet.stacks[0]?.id ?? "");
  const [activeChapterId, setActiveChapterId] = useState(booklet.chapters[0]?.id ?? "");
  const [activePageId, setActivePageId] = useState(booklet.pages[0]?.id ?? "");
  const [activeLaneId, setActiveLaneId] = useState(chapterLane.id);
  const [activePremiumTab, setActivePremiumTab] = useState<PremiumTabId>("overview");
  const [activeModuleId, setActiveModuleId] = useState(evaGrammarModules[0]?.id ?? "");
  const [activeLexicalId, setActiveLexicalId] = useState(evaLexicalResource[0]?.id ?? "");
  const [activeQuizTrack, setActiveQuizTrack] = useState<EvaStudioTrack>("grammar");
  const [activeExamId, setActiveExamId] = useState("ielts-reading-ministry-planning");
  const [activeMaterialTrack, setActiveMaterialTrack] = useState<EvaMaterialTrack>("reading");
  const [activeMaterialId, setActiveMaterialId] = useState(evaMaterialCollections[0]?.items[0]?.id ?? "");
  const [activeTeacherTargetId, setActiveTeacherTargetId] = useState<EvaUserId>("eva");
  const [skillFilter, setSkillFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [moduleDone, setModuleDone] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [writingDrafts, setWritingDrafts] = useState<Record<string, string>>({});
  const [pronunciationDone, setPronunciationDone] = useState<Record<string, boolean>>({});
  const [shadowingDone, setShadowingDone] = useState<Record<string, boolean>>({});
  const [ttsListened, setTtsListened] = useState<Record<string, number>>({});
  const [ttsRepeated, setTtsRepeated] = useState<Record<string, number>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [examAnswers, setExamAnswers] = useState<Record<string, number>>({});
  const [reviewQueue, setReviewQueue] = useState<Record<string, boolean>>({});
  const [teacherNotes, setTeacherNotes] = useState<Record<string, string>>({});
  const [teacherSnapshots, setTeacherSnapshots] = useState<Record<EvaUserId, EvaStoredStudioState>>({ ali: normalizeStoredState(null), eva: normalizeStoredState(null), elham: normalizeStoredState(null) });
  const [hydrated, setHydrated] = useState(false);
  const learningDatabase = useMemo(() => buildEvaLearningDatabase(booklet), [booklet]);
  const storageKey = evaUserStorageKey(activeUser.id);
  const activeExamTask = learningDatabase.examTasks.find((task) => task.id === activeExamId) ?? learningDatabase.examTasks[0]!;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const stored = window.localStorage.getItem(storageKey);
        const legacyStored = activeUser.id === "eva" ? window.localStorage.getItem(legacyStorageKey) : null;
        const target = stored ?? legacyStored;

        if (target) {
          const parsed = normalizeStoredState(JSON.parse(target) as Partial<EvaStoredStudioState>);
          setActiveStackId(parsed.activeStackId ?? booklet.stacks[0]?.id ?? "");
          setActiveChapterId(parsed.activeChapterId ?? booklet.chapters[0]?.id ?? "");
          setActivePageId(parsed.activePageId ?? booklet.pages[0]?.id ?? "");
          setActiveLaneId(parsed.activeLaneId ?? chapterLane.id);
          setActivePremiumTab((parsed.activePremiumTab as PremiumTabId | undefined) ?? "overview");
          setActiveModuleId(parsed.activeModuleId ?? evaGrammarModules[0]?.id ?? "");
          setActiveLexicalId(parsed.activeLexicalId ?? evaLexicalResource[0]?.id ?? "");
          setActiveQuizTrack((parsed.activeQuizTrack as EvaStudioTrack | undefined) ?? "grammar");
          setActiveExamId(parsed.activeExamId ?? learningDatabase.examTasks[0]?.id ?? "");
          setActiveMaterialTrack((parsed.activeMaterialTrack as EvaMaterialTrack | undefined) ?? "reading");
          setActiveMaterialId(parsed.activeMaterialId ?? evaMaterialCollections[0]?.items[0]?.id ?? "");
          setDone(parsed.done);
          setModuleDone(parsed.moduleDone);
          setNotes(parsed.notes);
          setWritingDrafts(parsed.writingDrafts);
          setPronunciationDone(parsed.pronunciationDone);
          setShadowingDone(parsed.shadowingDone);
          setTtsListened(parsed.ttsListened);
          setTtsRepeated(parsed.ttsRepeated);
          setQuizAnswers(parsed.quizAnswers);
          setExamAnswers(parsed.examAnswers);
          setReviewQueue(parsed.reviewQueue);
          setTeacherNotes(parsed.teacherNotes);
        }

        const snapshots = Object.fromEntries(
          evaSeedUsers.map((user) => {
            const raw = window.localStorage.getItem(evaUserStorageKey(user.id));
            return [user.id, normalizeStoredState(raw ? (JSON.parse(raw) as Partial<EvaStoredStudioState>) : null)];
          }),
        ) as Record<EvaUserId, EvaStoredStudioState>;
        setTeacherSnapshots(snapshots);
      } catch {
        // Local progress is helpful, but the studio should remain usable if storage is unavailable.
      }
      setHydrated(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeUser.id, booklet.chapters, booklet.pages, booklet.stacks, learningDatabase.examTasks, storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    const state = normalizeStoredState({
      activeStackId,
      activeChapterId,
      activePageId,
      activeLaneId,
      activePremiumTab,
      activeModuleId,
      activeLexicalId,
      activeQuizTrack,
      activeExamId,
      activeMaterialTrack,
      activeMaterialId,
      done,
      moduleDone,
      notes,
      writingDrafts,
      pronunciationDone,
      shadowingDone,
      ttsListened,
      ttsRepeated,
      quizAnswers,
      examAnswers,
      reviewQueue,
      teacherNotes,
    });
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [
    activeChapterId,
    activeExamId,
    activeMaterialId,
    activeMaterialTrack,
    activeLaneId,
    activeLexicalId,
    activeModuleId,
    activePageId,
    activePremiumTab,
    activeQuizTrack,
    activeStackId,
    activeUser.id,
    done,
    examAnswers,
    hydrated,
    moduleDone,
    notes,
    pronunciationDone,
    quizAnswers,
    reviewQueue,
    shadowingDone,
    storageKey,
    teacherNotes,
    ttsListened,
    ttsRepeated,
    writingDrafts,
  ]);

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
  const moduleStats = useMemo(() => {
    return new Map(
      evaSkillModules.map((module) => {
        const pages = pagesForModule(module, booklet.pages);
        return [module.id, { pages, pageCount: pages.length, fields: countFields(pages), checks: countChecks(pages) }];
      }),
    );
  }, [booklet.pages]);
  const activeModules = useMemo(() => {
    if (activePremiumTab === "religious") return evaReligiousModules;
    return evaGrammarModules;
  }, [activePremiumTab]);
  const activeModule = useMemo(() => {
    const preferredModules = activePremiumTab === "religious" ? evaReligiousModules : evaGrammarModules;
    return preferredModules.find((module) => module.id === activeModuleId) ?? preferredModules[0];
  }, [activeModuleId, activePremiumTab]);
  const activeModulePages = useMemo(() => (activeModule ? pagesForModule(activeModule, booklet.pages) : []), [activeModule, booklet.pages]);
  const activeLexicalItem = useMemo(
    () => evaLexicalResource.find((item) => item.id === activeLexicalId) ?? evaLexicalResource[0],
    [activeLexicalId],
  );
  const activeQuizQuestions = useMemo(() => evaQuizQuestions.filter((question) => question.track === activeQuizTrack), [activeQuizTrack]);
  const activeMaterialCollection = useMemo(
    () => evaMaterialCollections.find((collection) => collection.id === activeMaterialTrack) ?? evaMaterialCollections[0]!,
    [activeMaterialTrack],
  );
  const activeMaterial = useMemo(() => {
    const activeCollectionIds = new Set(activeMaterialCollection.items.map((item) => item.id));
    if (!activeCollectionIds.has(activeMaterialId)) return activeMaterialCollection.items[0] ?? evaMaterialItems[0]!;
    return evaMaterialItems.find((item) => item.id === activeMaterialId) ?? activeMaterialCollection.items[0] ?? evaMaterialItems[0]!;
  }, [activeMaterialCollection, activeMaterialId]);
  const materialTitleMap = useMemo(() => new Map(evaMaterialItems.map((item) => [item.id, item.title])), []);
  const answeredQuizQuestions = evaQuizQuestions.filter((question) => quizAnswers[question.id] !== undefined);
  const correctQuizQuestions = answeredQuizQuestions.filter((question) => quizAnswers[question.id] === question.answerIndex);
  const reviewItemIds = Object.entries(reviewQueue)
    .filter(([, queued]) => queued)
    .map(([pageId]) => pageId);
  const reviewMaterialItems = reviewItemIds
    .map((itemId) => evaMaterialItems.find((item) => item.id === itemId))
    .filter((item): item is EvaMaterialItem => Boolean(item));
  const reviewPages = reviewItemIds
    .map((pageId) => booklet.pages.find((page) => page.id === pageId))
    .filter((page): page is EvaBookletPage => Boolean(page));
  const reviewQueueCount = reviewPages.length + reviewMaterialItems.length;
  const completedPremiumModules = evaSkillModules.filter((module) => moduleDone[module.id]).length;
  const completedMaterials = evaMaterialItems.filter((item) => done[item.id]).length;
  const materialQuestionCount = evaMaterialItems.reduce((total, item) => total + item.questions.length, 0);
  const materialCorrectCount = evaMaterialItems.reduce(
    (total, item) => total + item.questions.filter((question) => examAnswers[`${item.id}:${question.id}`] === question.answerIndex).length,
    0,
  );
  const completedPronunciations = evaLexicalResource.filter((item) => pronunciationDone[item.id]).length;
  const studioMastery = Math.round(
    ((booklet.pages.filter((page) => done[page.id]).length / Math.max(booklet.pages.length, 1)) * 0.45 +
      (completedPremiumModules / Math.max(evaSkillModules.length, 1)) * 0.2 +
      (completedMaterials / Math.max(evaMaterialItems.length, 1)) * 0.1 +
      (correctQuizQuestions.length / Math.max(evaQuizQuestions.length, 1)) * 0.15 +
      (completedPronunciations / Math.max(evaLexicalResource.length, 1)) * 0.1) *
      100,
  );
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

  const coverage = useMemo(() => {
    const transformedPageIds = new Set(learningDatabase.activities.flatMap((activity) => activity.sourcePageIds));
    const ttsPageIds = new Set(learningDatabase.ttsSegments.map((segment) => segment.sourcePageId).filter(Boolean));
    const trackableSignals = learningDatabase.activities.reduce((total, activity) => total + activity.trackableSignals.length, 0);

    return {
      transformedPages: transformedPageIds.size,
      ttsPages: ttsPageIds.size,
      activityCount: learningDatabase.activities.length,
      learningItems: learningDatabase.learningItems.length,
      trackableSignals,
      percent: Math.round((transformedPageIds.size / Math.max(booklet.stats.pages, 1)) * 100),
    };
  }, [booklet.stats.pages, learningDatabase.activities, learningDatabase.learningItems.length, learningDatabase.ttsSegments]);

  const weakSkillMap = useMemo(() => {
    const weights = new Map<string, number>();
    const add = (skill: string, amount = 1) => weights.set(skill, (weights.get(skill) ?? 0) + amount);

    for (const pageId of Object.keys(reviewQueue).filter((id) => reviewQueue[id])) {
      const page = booklet.pages.find((item) => item.id === pageId);
      page?.skillTags.slice(0, 5).forEach((skill) => add(skill));
      const material = evaMaterialItems.find((item) => item.id === pageId);
      material?.tags.slice(0, 4).forEach((skill) => add(skill));
    }

    for (const question of evaQuizQuestions) {
      const selected = quizAnswers[question.id];
      if (selected !== undefined && selected !== question.answerIndex) add(quizTrackTitle(question.track), 2);
    }

    for (const task of learningDatabase.examTasks) {
      for (const question of task.questions) {
        const selected = examAnswers[`${task.id}:${question.id}`];
        if (selected !== undefined && selected !== question.answerIndex) add(`${task.exam} ${task.skill}`, 2);
      }
    }

    for (const item of evaMaterialItems) {
      for (const question of item.questions) {
        const selected = examAnswers[`${item.id}:${question.id}`];
        if (selected !== undefined && selected !== question.answerIndex) add(`${item.exam} ${item.skill}`, 2);
      }
    }

    return Array.from(weights.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [booklet.pages, examAnswers, learningDatabase.examTasks, quizAnswers, reviewQueue]);

  if (!activeStack || !activeChapter || !activePage) return null;

  const chapterDoneCount = chapterPages.filter((page) => done[page.id]).length;
  const chapterProgress = Math.round((chapterDoneCount / Math.max(chapterPages.length, 1)) * 100);
  const activeNote = writingDrafts[activePage.id] ?? notes[activePage.id] ?? "";
  const activeNoteWordCount = activeNote.trim().split(/\s+/).filter(Boolean).length;
  const activeBlocks = activePage.blocks.filter((block, index) => index !== 0 || block !== activePage.title);
  const activeModuleStats = activeModule ? moduleStats.get(activeModule.id) : undefined;
  const activeQuizAnswered = activeQuizQuestions.filter((question) => quizAnswers[question.id] !== undefined);
  const activeQuizCorrect = activeQuizAnswered.filter((question) => quizAnswers[question.id] === question.answerIndex);
  const activeTtsSegment = learningDatabase.ttsSegments.find((segment) => segment.sourcePageId === activePage.id);
  const writingVaultEntries = Object.entries(writingDrafts).filter(([, value]) => value.trim().length > 0);
  const activeExamAnswered = activeExamTask.questions.filter((question) => examAnswers[`${activeExamTask.id}:${question.id}`] !== undefined);
  const activeExamCorrect = activeExamTask.questions.filter((question) => answeredCorrectly(examAnswers[`${activeExamTask.id}:${question.id}`], question.answerIndex));
  const activeMaterialAnswered = activeMaterial.questions.filter((question) => examAnswers[`${activeMaterial.id}:${question.id}`] !== undefined);
  const activeMaterialCorrect = activeMaterial.questions.filter((question) => answeredCorrectly(examAnswers[`${activeMaterial.id}:${question.id}`], question.answerIndex));
  const activeMaterialDraft = writingDrafts[activeMaterial.id] ?? "";
  const activeMaterialTtsText = activeMaterial.ttsScript ?? activeMaterial.passage ?? activeMaterial.prompt ?? activeMaterial.summary;
  const activeMaterialTtsKey = `tts-material-${activeMaterial.id}`;
  const activeMaterialSourcePages = booklet.pages.filter((page) => activeMaterial.sourceTypeTargets.includes(page.type)).slice(0, 5);
  const currentStoredState = normalizeStoredState({
    activeStackId,
    activeChapterId,
    activePageId,
    activeLaneId,
    activePremiumTab,
    activeModuleId,
    activeLexicalId,
    activeQuizTrack,
    activeExamId,
    activeMaterialTrack,
    activeMaterialId,
    done,
    moduleDone,
    notes,
    writingDrafts,
    pronunciationDone,
    shadowingDone,
    ttsListened,
    ttsRepeated,
    quizAnswers,
    examAnswers,
    reviewQueue,
    teacherNotes,
  });
  const visibleTeacherSnapshots = { ...teacherSnapshots, [activeUser.id]: currentStoredState };
  const nextIncompletePage = visiblePages.find((page) => !done[page.id] && page.id !== activePage.id) ?? booklet.pages.find((page) => !done[page.id]);
  const smartNextStep = reviewPages[0]
    ? { label: "Review weak page", text: reviewPages[0].title, action: () => choosePage(reviewPages[0]) }
    : reviewMaterialItems[0]
      ? { label: "Review weak material", text: reviewMaterialItems[0].title, action: () => chooseMaterial(reviewMaterialItems[0]) }
    : nextIncompletePage
      ? { label: "Continue source path", text: nextIncompletePage.title, action: () => choosePage(nextIncompletePage) }
      : activeQuizQuestions.find((question) => quizAnswers[question.id] === undefined)
        ? { label: "Finish quiz track", text: quizTrackTitle(activeQuizTrack), action: () => setActivePremiumTab("quiz" as const) }
        : { label: "Open Writing Vault", text: `${writingVaultEntries.length} saved drafts`, action: () => setActivePremiumTab("vault" as const) };

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

  function chooseModule(module: EvaSkillModule) {
    setActivePremiumTab(module.track);
    setActiveModuleId(module.id);

    const preferredPages = pagesForModule(module, stackPages);
    const nextPage = preferredPages[0] ?? pagesForModule(module, booklet.pages)[0];
    if (nextPage) choosePage(nextPage);
  }

  function chooseLexicalItem(itemId: string) {
    setActivePremiumTab("lexical");
    setActiveLexicalId(itemId);
    const item = evaLexicalResource.find((entry) => entry.id === itemId);
    const nextPage = item
      ? booklet.pages.find((page) => item.tags.some((tag) => page.skillTags.join(" ").toLowerCase().includes(tag.toLowerCase()) || page.blocks.join(" ").toLowerCase().includes(tag.toLowerCase())))
      : undefined;
    if (nextPage) choosePage(nextPage);
  }

  function chooseMaterial(item: EvaMaterialItem) {
    setActivePremiumTab("materials");
    setActiveMaterialTrack(item.track);
    setActiveMaterialId(item.id);
    const nextPage =
      stackPages.find((page) => item.sourceTypeTargets.includes(page.type)) ??
      booklet.pages.find((page) => item.sourceTypeTargets.includes(page.type));
    if (nextPage) choosePage(nextPage);
  }

  function speakStudioText(text: string, segmentId: string, repeat = false, rate = 0.82) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = rate;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
    setTtsListened((current) => ({ ...current, [segmentId]: (current[segmentId] ?? 0) + 1 }));
    if (repeat) setTtsRepeated((current) => ({ ...current, [segmentId]: (current[segmentId] ?? 0) + 1 }));
  }

  function speakLexicalItem(term: string) {
    const segmentId = `tts-lexical-${activeLexicalItem.id}`;
    speakStudioText(term, segmentId, false, 0.78);
  }

  function answerQuiz(question: EvaQuizQuestion, answerIndex: number) {
    setQuizAnswers((current) => ({ ...current, [question.id]: answerIndex }));
    if (answerIndex !== question.answerIndex) {
      setReviewQueue((current) => ({ ...current, [activePage.id]: true, [`quiz-${question.id}`]: true }));
    }
  }

  function answerExamQuestion(questionId: string, answerIndex: number) {
    const question = activeExamTask.questions.find((item) => item.id === questionId);
    setExamAnswers((current) => ({ ...current, [`${activeExamTask.id}:${questionId}`]: answerIndex }));
    if (question && answerIndex !== question.answerIndex) {
      setReviewQueue((current) => ({ ...current, [activePage.id]: true, [`exam-${activeExamTask.id}-${questionId}`]: true }));
    }
  }

  function answerMaterialQuestion(questionId: string, answerIndex: number) {
    const question = activeMaterial.questions.find((item) => item.id === questionId);
    setExamAnswers((current) => ({ ...current, [`${activeMaterial.id}:${questionId}`]: answerIndex }));
    if (question && answerIndex !== question.answerIndex) {
      setReviewQueue((current) => ({ ...current, [activeMaterial.id]: true }));
    }
  }

  function updateActiveDraft(value: string) {
    setNotes((current) => ({ ...current, [activePage.id]: value }));
    setWritingDrafts((current) => ({ ...current, [activePage.id]: value }));
  }

  function updateMaterialDraft(value: string) {
    setWritingDrafts((current) => ({ ...current, [activeMaterial.id]: value }));
  }

  function updateTeacherNote(targetId: EvaUserId, note: string) {
    const currentSnapshot = normalizeStoredState(teacherSnapshots[targetId]);
    const nextSnapshot = normalizeStoredState({
      ...currentSnapshot,
      teacherNotes: { ...currentSnapshot.teacherNotes, [activePage.id]: note },
    });
    window.localStorage.setItem(evaUserStorageKey(targetId), JSON.stringify(nextSnapshot));
    setTeacherSnapshots((current) => ({ ...current, [targetId]: nextSnapshot }));
    if (targetId === activeUser.id) setTeacherNotes(nextSnapshot.teacherNotes);
  }

  function resetQuizTrack() {
    setQuizAnswers((current) => {
      const next = { ...current };
      for (const question of activeQuizQuestions) delete next[question.id];
      return next;
    });
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
            <p className="text-sm font-semibold text-amber-200">Ali Rad private study database inside EduPocket</p>
            <h2 className="mt-2 max-w-4xl text-xl font-semibold leading-tight text-white sm:text-3xl">
              EduPocket&apos;s Eva Digital Booklet, segmented into a real 298-page study studio.
            </h2>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300">
              The full workbook is indexed by learning stack, semantic lane, chapter, page, skill, practice level, search, related pages, and saved study evidence.
              {` ${laneCoverageCount}/${booklet.stats.pages} imported pages are covered by the studio lanes, with chapter order preserved for every page.`}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-[8px] border border-amber-200/20 bg-amber-200/[0.08] px-3 py-2 text-sm font-semibold text-amber-100">
                <UserCheck aria-hidden="true" className="size-4" />
                {activeUser.displayName} / {activeUser.role}
              </span>
              <span className="inline-flex items-center gap-2 rounded-[8px] border border-sky-200/15 bg-sky-300/[0.055] px-3 py-2 text-sm font-semibold text-sky-100">
                <Database aria-hidden="true" className="size-4" />
                {learningDatabase.entities.length} DB entities modeled
              </span>
            </div>
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

      <section className="grid gap-3 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[8px] border border-amber-200/20 bg-[radial-gradient(circle_at_12%_0%,rgba(251,191,36,0.12),transparent_18rem),rgba(255,255,255,0.035)] p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-amber-200">
                <Gauge aria-hidden="true" className="size-4" />
                Coverage Meter
              </div>
              <h2 className="mt-2 text-2xl font-semibold leading-tight text-white">{coverage.percent}% of the booklet is activity-mapped</h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                {coverage.transformedPages}/{booklet.stats.pages} pages become trackable activities. The database also exposes {coverage.learningItems} learning items, {coverage.activityCount} activities, and {coverage.trackableSignals} progress signals.
              </p>
            </div>
            <div className="flex size-20 shrink-0 items-center justify-center rounded-full border border-amber-200/25 bg-slate-950/48 text-xl font-semibold text-amber-100">
              {coverage.percent}%
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full rounded-full bg-gradient-to-r from-amber-300 via-yellow-100 to-sky-300" style={{ width: `${coverage.percent}%` }} />
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-4">
            {[
              { label: "TTS segments", value: learningDatabase.ttsSegments.length },
              { label: "Exam tasks", value: learningDatabase.examTasks.length },
              { label: "Questions", value: learningDatabase.questions.length },
              { label: "Material packs", value: evaMaterialStats.items },
            ].map((item) => (
              <div key={item.label} className="rounded-[8px] border border-white/10 bg-slate-950/32 p-3">
                <p className="text-lg font-semibold text-white">{item.value}</p>
                <p className="text-sm leading-5 text-slate-400">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[8px] border border-sky-200/15 bg-[radial-gradient(circle_at_90%_0%,rgba(125,211,252,0.11),transparent_18rem),rgba(255,255,255,0.035)] p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-sky-100">
                <Sparkles aria-hidden="true" className="size-4" />
                Smart Next Step
              </div>
              <h2 className="mt-2 text-2xl font-semibold leading-tight text-white">{smartNextStep.label}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">{smartNextStep.text}</p>
            </div>
            <button
              type="button"
              onClick={smartNextStep.action}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-[8px] bg-sky-200 px-4 text-sm font-bold text-slate-950 transition hover:bg-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-100"
            >
              Open
              <ChevronRight aria-hidden="true" className="size-4" />
            </button>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {[
              { label: "Drafts", value: writingVaultEntries.length, icon: NotebookPen },
              { label: "Review", value: Object.values(reviewQueue).filter(Boolean).length, icon: Star },
              { label: "Weak skills", value: weakSkillMap.length, icon: Target },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className="rounded-[8px] border border-white/10 bg-slate-950/32 p-3">
                  <Icon aria-hidden="true" className="size-4 text-sky-100" />
                  <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
                  <p className="text-sm leading-5 text-slate-400">{item.label}</p>
                </div>
              );
            })}
          </div>
          {weakSkillMap.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {weakSkillMap.map(([skill, weight]) => (
                <span key={skill} className="rounded-[8px] border border-rose-200/15 bg-rose-300/[0.07] px-3 py-2 text-sm font-semibold text-rose-100">
                  {skill}: {weight}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="grid gap-3 lg:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.75fr)]">
        <div className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4 sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">How to use the digital booklet</h2>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-400">
                The product is designed as a study operating system: route, source page, skill layer, evidence, review.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-amber-200/18 bg-amber-200/[0.08] px-3 py-2 text-xs font-semibold text-amber-100">
              <CircleCheck aria-hidden="true" className="size-4" />
              No imported page is discarded
            </span>
          </div>
          <div className="mt-4 grid gap-2 md:grid-cols-4">
            {evaWorkflowSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div key={step.id} className="rounded-[8px] border border-white/10 bg-slate-950/32 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex size-9 items-center justify-center rounded-[8px] bg-amber-200/10 text-amber-200">
                      <Icon aria-hidden="true" className="size-4" />
                    </span>
                    <span className="text-xs font-semibold text-slate-600">0{index + 1}</span>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{step.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="rounded-[8px] border border-amber-200/20 bg-[radial-gradient(circle_at_20%_0%,rgba(251,191,36,0.13),transparent_16rem),rgba(15,23,42,0.54)] p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-white">Mastery tracker</h2>
              <p className="mt-1 text-sm leading-6 text-slate-400">Separate member signals for pages, modules, quiz, TTS, review, and writing.</p>
            </div>
            <div className="flex size-16 shrink-0 items-center justify-center rounded-full border border-amber-200/25 bg-slate-950/46 text-lg font-semibold text-amber-100">
              {studioMastery}%
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {[
              { label: "Pages done", value: booklet.pages.filter((page) => done[page.id]).length, total: booklet.pages.length, icon: FileText },
              { label: "Modules", value: completedPremiumModules, total: evaSkillModules.length, icon: ListChecks },
              { label: "Materials", value: completedMaterials, total: evaMaterialItems.length, icon: LibraryBig },
              { label: "Quiz correct", value: correctQuizQuestions.length, total: evaQuizQuestions.length, icon: BarChart3 },
              { label: "Pronounced", value: completedPronunciations, total: evaLexicalResource.length, icon: Headphones },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className="rounded-[8px] border border-white/10 bg-slate-950/32 p-3">
                  <Icon aria-hidden="true" className="size-4 text-amber-200" />
                  <p className="mt-2 text-sm font-semibold text-white">
                    {item.value}/{item.total}
                  </p>
                  <p className="text-xs leading-4 text-slate-500">{item.label}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-3 rounded-[8px] border border-white/10 bg-slate-950/30 p-3">
            <p className="text-xs font-semibold uppercase text-slate-500">Review queue for {activeUser.displayName}</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {reviewQueueCount ? `${reviewQueueCount} items waiting for deliberate review.` : "No review items yet. Add weak pages or material tasks from the studio."}
            </p>
          </div>
        </aside>
      </section>

      {activeUser.canTeach ? (
        <section className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-amber-200">
                <Users aria-hidden="true" className="size-4" />
                Teacher Lens
              </div>
              <h2 className="mt-2 text-2xl font-semibold leading-tight text-white">Ali can inspect premium learners separately.</h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">
                Eva and Elham keep separate progress, drafts, quiz answers, TTS history, pronunciation work, review queues, weak-skill signals, and teacher notes.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-[8px] border border-amber-200/20 bg-amber-200/[0.08] px-3 py-2 text-sm font-semibold text-amber-100">
              <Database aria-hidden="true" className="size-4" />
              Premium member records
            </span>
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="grid gap-3 md:grid-cols-3">
              {evaSeedUsers.map((user) => {
                const snapshot = normalizeStoredState(visibleTeacherSnapshots[user.id]);
                const quizCorrect = evaQuizQuestions.filter((question) => snapshot.quizAnswers[question.id] === question.answerIndex).length;
                const active = activeTeacherTargetId === user.id;

                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => setActiveTeacherTargetId(user.id)}
                    className={cn(
                      "rounded-[8px] border p-4 text-start transition focus:outline-none focus:ring-2 focus:ring-amber-300/50",
                      active ? "border-amber-300/55 bg-amber-300/12 text-white" : "border-white/10 bg-slate-950/28 text-slate-300 hover:border-amber-300/35",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold text-white">{user.displayName}</p>
                        <p className="mt-1 text-sm leading-5 text-slate-400">{user.role}</p>
                      </div>
                      <UserCheck aria-hidden="true" className="size-5 text-amber-200" />
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      <span className="rounded-[8px] border border-white/10 bg-slate-950/30 p-2">
                        <span className="block font-semibold text-white">{recordCount(snapshot.done)}</span>
                        <span className="text-xs text-slate-500">pages</span>
                      </span>
                      <span className="rounded-[8px] border border-white/10 bg-slate-950/30 p-2">
                        <span className="block font-semibold text-white">{Object.values(snapshot.writingDrafts).filter((value) => value.trim()).length}</span>
                        <span className="text-xs text-slate-500">drafts</span>
                      </span>
                      <span className="rounded-[8px] border border-white/10 bg-slate-950/30 p-2">
                        <span className="block font-semibold text-white">{quizCorrect}</span>
                        <span className="text-xs text-slate-500">quiz correct</span>
                      </span>
                      <span className="rounded-[8px] border border-white/10 bg-slate-950/30 p-2">
                        <span className="block font-semibold text-white">{recordCount(snapshot.reviewQueue)}</span>
                        <span className="text-xs text-slate-500">review</span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="rounded-[8px] border border-amber-200/16 bg-amber-200/[0.06] p-4">
              <h3 className="text-sm font-semibold text-amber-100">Teacher note for active page</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Target: {evaSeedUsers.find((user) => user.id === activeTeacherTargetId)?.displayName}. Page {String(activePage.page).padStart(3, "0")}.
              </p>
              <textarea
                value={normalizeStoredState(visibleTeacherSnapshots[activeTeacherTargetId]).teacherNotes[activePage.id] ?? ""}
                onChange={(event) => updateTeacherNote(activeTeacherTargetId, event.target.value)}
                className="mt-3 min-h-28 w-full resize-y rounded-[8px] border border-white/10 bg-slate-950/72 p-3 text-sm leading-7 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-amber-300/50 focus:ring-2 focus:ring-amber-300/20"
                placeholder="Write Ali's feedback, weak skill, or next assignment..."
              />
              <p className="mt-2 text-xs leading-5 text-slate-500">Saved to the selected learner record for focused review.</p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="overflow-hidden rounded-[8px] border border-amber-200/20 bg-[radial-gradient(circle_at_12%_0%,rgba(251,191,36,0.11),transparent_24rem),rgba(255,255,255,0.035)] p-3 sm:p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">Premium workbench</h2>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-400">
              Grammar, religious context, lexical pronunciation, quizzes, and review all point back to source pages.
            </p>
          </div>
          <p className="text-sm font-semibold text-slate-500">
            20 modules · {evaMaterialStats.items} material packs · {evaLexicalResource.length} pronunciation cards · {learningDatabase.examTasks.length} exam tasks
          </p>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
          {premiumTabs.map((tab) => {
            const active = activePremiumTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                data-testid={`eva-premium-tab-${tab.id}`}
                onClick={() => {
                  setActivePremiumTab(tab.id);
                  if (tab.id === "grammar") setActiveModuleId(evaGrammarModules[0]?.id ?? "");
                  if (tab.id === "religious") setActiveModuleId(evaReligiousModules[0]?.id ?? "");
                }}
                className={cn(
                  "rounded-[8px] border p-3 text-start transition focus:outline-none focus:ring-2 focus:ring-amber-300/50",
                  active ? "border-amber-300/55 bg-amber-300/12 text-white" : "border-white/10 bg-slate-950/28 text-slate-300 hover:border-amber-300/35",
                )}
              >
                <span className="block text-sm font-semibold">{tab.title}</span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">{tab.description}</span>
              </button>
            );
          })}
        </div>

        {activePremiumTab === "overview" ? (
          <div className="mt-4 grid gap-3 lg:grid-cols-[0.78fr_1.22fr]">
            <div className="rounded-[8px] border border-white/10 bg-slate-950/30 p-4">
              <h3 className="text-sm font-semibold text-white">Segmentation principle</h3>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Same-meaning work stays visually close: grammar with accuracy, religious meaning with exegesis and service, lexis with pronunciation and collocation, review with measurable evidence.
              </p>
              <div className="mt-4 grid gap-2">
                {[
                  ["Source", `${booklet.stats.pages} imported pages`],
                  ["Semantic lanes", `${semanticStudyLanes.length} lanes plus chapter path`],
                  ["Premium layers", "Grammar / Religious / Lexical / Materials"],
                  ["Tracking", "page, module, material, quiz, pronunciation, review"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-3 rounded-[8px] border border-white/10 bg-white/[0.035] px-3 py-2 text-sm">
                    <span className="font-semibold text-slate-200">{label}</span>
                    <span className="text-slate-500">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { title: "Grammar Atlas", value: evaGrammarModules.length, text: "Accuracy chapters with source-page jumps.", icon: GraduationCap },
                { title: "Religious Context", value: evaReligiousModules.length, text: "Meaning, service, prayer, and translation chapters.", icon: Flame },
                { title: "Lexical Resource", value: evaLexicalResource.length, text: "IPA, stress, collocations, and listen practice.", icon: Volume2 },
                { title: "Material Library", value: evaMaterialStats.items, text: "Original IELTS/TOEFL-style packs and TTS scripts.", icon: LibraryBig },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() =>
                      setActivePremiumTab(
                        item.title === "Grammar Atlas"
                          ? "grammar"
                          : item.title === "Religious Context"
                            ? "religious"
                            : item.title === "Material Library"
                              ? "materials"
                              : "lexical",
                      )
                    }
                    className="rounded-[8px] border border-white/10 bg-slate-950/28 p-4 text-start transition hover:border-amber-300/35 focus:outline-none focus:ring-2 focus:ring-amber-300/50"
                  >
                    <Icon aria-hidden="true" className="size-5 text-amber-200" />
                    <p className="mt-4 text-2xl font-semibold text-white">{item.value}</p>
                  <h3 className="mt-1 text-sm font-semibold text-white">{item.title === "Lexical Resource" ? "Pronunciation Lab" : item.title}</h3>
                    <p className="mt-2 text-xs leading-5 text-slate-400">{item.text}</p>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {(activePremiumTab === "grammar" || activePremiumTab === "religious") && activeModule ? (
          <div className="mt-4 grid gap-3 xl:grid-cols-[22rem_minmax(0,1fr)]">
            <div className="max-h-[32rem] space-y-2 overflow-y-auto pr-1">
              {activeModules.map((module) => {
                const active = module.id === activeModule.id;
                const stats = moduleStats.get(module.id);
                const Icon = module.icon;

                return (
                  <button
                    key={module.id}
                    type="button"
                    onClick={() => chooseModule(module)}
                    className={cn(
                      "w-full rounded-[8px] border p-3 text-start transition focus:outline-none focus:ring-2 focus:ring-amber-300/50",
                      active ? "border-amber-300/55 bg-amber-300/12 text-white" : "border-white/10 bg-slate-950/28 text-slate-300 hover:border-amber-300/35",
                    )}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2 text-sm font-semibold">
                        <Icon aria-hidden="true" className="size-4 text-amber-200" />
                        {module.order}. {module.title}
                      </span>
                      <span className={cn("flex size-5 shrink-0 items-center justify-center rounded-[6px] border", moduleDone[module.id] ? "border-emerald-300 bg-emerald-300 text-slate-950" : "border-white/15 text-transparent")}>
                        <Check aria-hidden="true" className="size-3.5" />
                      </span>
                    </span>
                    <span className="mt-2 block text-xs leading-5 text-slate-500">
                      {stats?.pageCount ?? 0} source pages · {stats?.fields ?? 0} fields · {module.minutes} min
                    </span>
                  </button>
                );
              })}
            </div>
            <article className="rounded-[8px] border border-white/10 bg-slate-950/30 p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase text-amber-200">{moduleTrackTitle(activeModule.track)} / module {activeModule.order}</p>
                  <h3 className="mt-2 text-2xl font-semibold leading-tight text-white">{activeModule.title}</h3>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">{activeModule.outcome}</p>
                </div>
                <label className="inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-between gap-3 rounded-[8px] border border-white/10 px-3 text-sm font-semibold text-slate-200 transition hover:border-amber-300/40 hover:text-amber-100">
                  <span>Module done</span>
                  <input
                    type="checkbox"
                    checked={Boolean(moduleDone[activeModule.id])}
                    onChange={(event) => setModuleDone((current) => ({ ...current, [activeModule.id]: event.target.checked }))}
                    className="sr-only"
                  />
                  <span className={cn("flex size-6 items-center justify-center rounded-[6px] border", moduleDone[activeModule.id] ? "border-amber-200 bg-amber-200 text-slate-950" : "border-white/20")}>
                    {moduleDone[activeModule.id] ? <Check aria-hidden="true" className="size-4" /> : null}
                  </span>
                </label>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {[
                  { label: "Focus", value: activeModule.focus },
                  { label: "Evidence", value: activeModule.evidence },
                  { label: "Coverage", value: `${activeModuleStats?.pageCount ?? 0} pages / ${activeModuleStats?.fields ?? 0} fields / ${activeModuleStats?.checks ?? 0} checks` },
                ].map((item) => (
                  <div key={item.label} className="rounded-[8px] border border-white/10 bg-white/[0.035] p-3">
                    <p className="text-xs font-semibold uppercase text-slate-500">{item.label}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_18rem]">
                <div>
                  <h4 className="text-sm font-semibold text-white">Practice stack</h4>
                  <div className="mt-3 grid gap-2">
                    {activeModule.practice.map((practice, index) => (
                      <div key={practice} className="flex items-start gap-3 rounded-[8px] border border-white/10 bg-white/[0.035] p-3 text-sm leading-6 text-slate-300">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-[6px] bg-amber-200/10 text-xs font-semibold text-amber-100">{index + 1}</span>
                        <span>{practice}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-[8px] border border-amber-200/16 bg-amber-200/[0.06] p-3">
                  <h4 className="text-sm font-semibold text-amber-100">Jump to source</h4>
                  <div className="mt-3 grid gap-2">
                    {activeModulePages.slice(0, 4).map((page) => (
                      <button
                        key={page.id}
                        type="button"
                        onClick={() => choosePage(page)}
                        className="rounded-[8px] border border-white/10 bg-slate-950/30 p-3 text-start text-xs leading-5 text-slate-300 transition hover:border-amber-300/35 focus:outline-none focus:ring-2 focus:ring-amber-300/40"
                      >
                        <span className="font-semibold text-amber-100">P{String(page.page).padStart(3, "0")}</span> · {page.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </div>
        ) : null}

        {activePremiumTab === "lexical" && activeLexicalItem ? (
          <div className="mt-4 grid gap-3 xl:grid-cols-[18rem_minmax(0,1fr)]">
            <div className="grid max-h-[30rem] gap-2 overflow-y-auto pr-1">
              {evaLexicalResource.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => chooseLexicalItem(item.id)}
                  className={cn(
                    "rounded-[8px] border p-3 text-start transition focus:outline-none focus:ring-2 focus:ring-amber-300/50",
                    item.id === activeLexicalItem.id ? "border-amber-300/55 bg-amber-300/12 text-white" : "border-white/10 bg-slate-950/28 text-slate-300 hover:border-amber-300/35",
                  )}
                >
                  <span className="block text-sm font-semibold">{item.term}</span>
                  <span className="mt-1 block font-mono text-xs text-sky-100">{item.ipa}</span>
                  <span className="mt-1 block text-xs text-slate-500">{item.tags.join(" / ")}</span>
                </button>
              ))}
            </div>
            <article className="rounded-[8px] border border-white/10 bg-slate-950/30 p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase text-amber-200">Lexical resource / Pronunciation Lab</p>
                  <h3 className="mt-2 text-3xl font-semibold text-white">{activeLexicalItem.term}</h3>
                  <p className="mt-1 font-mono text-lg text-sky-100">{activeLexicalItem.ipa}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => speakLexicalItem(activeLexicalItem.term)}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] bg-amber-300 px-4 text-sm font-bold text-slate-950 transition hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-100"
                  >
                    <Volume2 aria-hidden="true" className="size-4" />
                    Listen
                  </button>
                  <button
                    type="button"
                    onClick={() => speakStudioText(`${activeLexicalItem.term}. ${activeLexicalItem.stress}. ${activeLexicalItem.example}`, `tts-lexical-${activeLexicalItem.id}`, true, 0.72)}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] border border-white/10 px-4 text-sm font-semibold text-slate-200 transition hover:border-sky-200/40 hover:text-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-300/40"
                  >
                    <Repeat2 aria-hidden="true" className="size-4" />
                    Repeat
                  </button>
                  <button
                    type="button"
                    onClick={() => setPronunciationDone((current) => ({ ...current, [activeLexicalItem.id]: !current[activeLexicalItem.id] }))}
                    className={cn(
                      "inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] border px-4 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-amber-300/50",
                      pronunciationDone[activeLexicalItem.id] ? "border-emerald-300 bg-emerald-300 text-slate-950" : "border-white/10 text-slate-200 hover:border-amber-300/40",
                    )}
                  >
                    <Headphones aria-hidden="true" className="size-4" />
                    Practiced
                  </button>
                  <button
                    type="button"
                    onClick={() => setShadowingDone((current) => ({ ...current, [activeLexicalItem.id]: !current[activeLexicalItem.id] }))}
                    className={cn(
                      "inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] border px-4 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-sky-300/40",
                      shadowingDone[activeLexicalItem.id] ? "border-sky-200 bg-sky-200 text-slate-950" : "border-white/10 text-slate-200 hover:border-sky-200/40",
                    )}
                  >
                    <Check aria-hidden="true" className="size-4" />
                    Shadowed
                  </button>
                </div>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {[
                  { label: "Stress", value: activeLexicalItem.stress },
                  { label: "Meaning", value: activeLexicalItem.meaning },
                  { label: "Use", value: activeLexicalItem.ministryUse },
                ].map((item) => (
                  <div key={item.label} className="rounded-[8px] border border-white/10 bg-white/[0.035] p-3">
                    <p className="text-xs font-semibold uppercase text-slate-500">{item.label}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
                <div>
                  <h4 className="text-sm font-semibold text-white">Collocation cards</h4>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {activeLexicalItem.collocations.map((item) => (
                      <span key={item} className="rounded-[8px] border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-slate-200">
                        {item}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 rounded-[8px] border border-sky-200/15 bg-sky-300/[0.055] p-3 text-sm leading-7 text-slate-300">{activeLexicalItem.example}</p>
                </div>
                <div className="rounded-[8px] border border-amber-200/16 bg-amber-200/[0.06] p-4">
                  <h4 className="text-sm font-semibold text-amber-100">Pronunciation coaching</h4>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{activeLexicalItem.pronunciationTip}</p>
                  <p className="mt-4 text-xs font-semibold uppercase text-slate-500">Tracking idea</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Listen once, say it twice, then use it in one source-page note before marking it practiced.
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                    {[
                      ["Listened", ttsListened[`tts-lexical-${activeLexicalItem.id}`] ?? 0],
                      ["Repeated", ttsRepeated[`tts-lexical-${activeLexicalItem.id}`] ?? 0],
                      ["Shadow", shadowingDone[activeLexicalItem.id] ? 1 : 0],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-[8px] border border-white/10 bg-slate-950/30 p-2">
                        <p className="font-semibold text-white">{value}</p>
                        <p className="text-xs text-slate-500">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </div>
        ) : null}

        {activePremiumTab === "materials" ? (
          <div className="mt-4 grid gap-3 xl:grid-cols-[22rem_minmax(0,1fr)]">
            <aside className="rounded-[8px] border border-white/10 bg-slate-950/30 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-white">Material Library</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-400">Original study packs with answer keys, TTS scripts, and writing prompts.</p>
                </div>
                <LibraryBig aria-hidden="true" className="size-5 shrink-0 text-amber-200" />
              </div>
              <div className="mt-4 grid gap-2">
                {evaMaterialCollections.map((collection) => {
                  const active = collection.id === activeMaterialTrack;
                  const completedInTrack = collection.items.filter((item) => done[item.id]).length;

                  return (
                    <button
                      key={collection.id}
                      type="button"
                      onClick={() => {
                        setActiveMaterialTrack(collection.id);
                        setActiveMaterialId(collection.items[0]?.id ?? activeMaterial.id);
                      }}
                      className={cn(
                        "rounded-[8px] border p-3 text-start transition focus:outline-none focus:ring-2 focus:ring-amber-300/50",
                        active ? "border-amber-300/55 bg-amber-300/12 text-white" : "border-white/10 bg-white/[0.035] text-slate-300 hover:border-amber-300/35",
                      )}
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold">{collection.title}</span>
                        <span className="rounded-[6px] border border-white/10 bg-slate-950/35 px-2 py-1 text-xs font-semibold text-amber-100">
                          {completedInTrack}/{collection.items.length}
                        </span>
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-slate-500">{collection.description}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 rounded-[8px] border border-sky-200/15 bg-sky-300/[0.055] p-3">
                <p className="text-xs font-semibold uppercase text-sky-100">Library stats</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {[
                    ["Questions", materialQuestionCount],
                    ["Correct", materialCorrectCount],
                    ["Writing", evaMaterialStats.writingPrompts],
                    ["TTS", evaMaterialStats.ttsScripts],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-[8px] border border-white/10 bg-slate-950/30 p-2">
                      <p className="text-sm font-semibold text-white">{value}</p>
                      <p className="text-xs text-slate-500">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            <article className="rounded-[8px] border border-white/10 bg-slate-950/30 p-4">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
                <div>
                  <p className="text-xs font-semibold uppercase text-amber-200">
                    {activeMaterial.exam} / {activeMaterial.skill} / {activeMaterial.level}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold leading-tight text-white">{activeMaterial.title}</h3>
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">{activeMaterial.summary}</p>
                  <p className="mt-3 rounded-[8px] border border-amber-200/16 bg-amber-200/[0.06] p-3 text-sm leading-7 text-amber-50">
                    {activeUser.locale === "fa" ? activeMaterial.localeNotes.fa : activeMaterial.localeNotes.en}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Minutes", value: activeMaterial.timeLimitMinutes },
                    { label: "Questions", value: activeMaterial.questions.length },
                    { label: "Correct", value: activeMaterialCorrect.length },
                    { label: "Answered", value: activeMaterialAnswered.length },
                  ].map((item) => (
                    <div key={item.label} className="rounded-[8px] border border-white/10 bg-white/[0.035] p-3">
                      <p className="text-lg font-semibold text-white">{item.value}</p>
                      <p className="text-xs leading-4 text-slate-500">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => speakStudioText(activeMaterialTtsText, activeMaterialTtsKey, false, activeMaterial.track === "pronunciation" ? 0.76 : 0.86)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] bg-amber-300 px-4 text-sm font-bold text-slate-950 transition hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-100"
                >
                  <Volume2 aria-hidden="true" className="size-4" />
                  Listen
                </button>
                <button
                  type="button"
                  onClick={() => speakStudioText(activeMaterialTtsText, activeMaterialTtsKey, true, activeMaterial.track === "pronunciation" ? 0.68 : 0.78)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] border border-white/10 px-4 text-sm font-semibold text-slate-200 transition hover:border-sky-200/40 hover:text-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-300/40"
                >
                  <Repeat2 aria-hidden="true" className="size-4" />
                  Repeat
                </button>
                <button
                  type="button"
                  onClick={() => setReviewQueue((current) => ({ ...current, [activeMaterial.id]: !current[activeMaterial.id] }))}
                  className={cn(
                    "inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] border px-4 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-sky-300/40",
                    reviewQueue[activeMaterial.id] ? "border-sky-200 bg-sky-200 text-slate-950" : "border-white/10 text-slate-200 hover:border-sky-200/40 hover:text-sky-100",
                  )}
                >
                  <Star aria-hidden="true" className="size-4" />
                  {reviewQueue[activeMaterial.id] ? "In review" : "Add review"}
                </button>
                <label className="inline-flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-[8px] border border-white/10 px-4 text-sm font-semibold text-slate-200 transition hover:border-amber-300/40 hover:text-amber-100">
                  <span>Material done</span>
                  <input
                    type="checkbox"
                    checked={Boolean(done[activeMaterial.id])}
                    onChange={(event) => setDone((current) => ({ ...current, [activeMaterial.id]: event.target.checked }))}
                    className="sr-only"
                  />
                  <span className={cn("flex size-6 items-center justify-center rounded-[6px] border", done[activeMaterial.id] ? "border-amber-200 bg-amber-200 text-slate-950" : "border-white/20")}>
                    {done[activeMaterial.id] ? <Check aria-hidden="true" className="size-4" /> : null}
                  </span>
                </label>
              </div>

              <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
                <div className="grid gap-4">
                  {activeMaterial.visualAsset ? (
                    <div className="overflow-hidden rounded-[8px] border border-white/10 bg-slate-950/40">
                      <NextImage
                        src={activeMaterial.visualAsset}
                        alt={`${activeMaterial.title} visual guide`}
                        width={1280}
                        height={720}
                        className="h-auto w-full"
                      />
                    </div>
                  ) : null}

                  {activeMaterial.passage ? (
                    <section className="rounded-[8px] border border-sky-200/15 bg-sky-300/[0.055] p-4">
                      <h4 className="text-sm font-semibold text-sky-100">Reading passage</h4>
                      <p className="mt-3 text-base leading-8 text-slate-200">{activeMaterial.passage}</p>
                    </section>
                  ) : null}

                  {activeMaterial.ttsScript ? (
                    <section className="rounded-[8px] border border-sky-200/15 bg-sky-300/[0.055] p-4">
                      <div className="flex items-center gap-2 text-sm font-semibold text-sky-100">
                        <Mic2 aria-hidden="true" className="size-4" />
                        TTS / shadowing script
                      </div>
                      <p className="mt-3 text-base leading-8 text-slate-200">{activeMaterial.ttsScript}</p>
                    </section>
                  ) : null}

                  {activeMaterial.prompt ? (
                    <section className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4">
                      <h4 className="text-sm font-semibold text-white">Prompt</h4>
                      <p className="mt-3 text-base leading-8 text-slate-200">{activeMaterial.prompt}</p>
                    </section>
                  ) : null}

                  {activeMaterial.questions.length ? (
                    <section className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-white">Answer key practice</h4>
                          <p className="mt-1 text-sm leading-6 text-slate-400">
                            {activeMaterialCorrect.length}/{activeMaterial.questions.length} correct. Wrong answers enter the review engine.
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-2 rounded-[8px] border border-amber-200/18 bg-amber-200/[0.08] px-3 py-2 text-xs font-semibold text-amber-100">
                          <Target aria-hidden="true" className="size-4" />
                          Trackable
                        </span>
                      </div>
                      <div className="mt-4 grid gap-3">
                        {activeMaterial.questions.map((question, index) => {
                          const answerKey = `${activeMaterial.id}:${question.id}`;
                          const selected = examAnswers[answerKey];
                          const answered = selected !== undefined;

                          return (
                            <div key={question.id} className="rounded-[8px] border border-white/10 bg-slate-950/30 p-4">
                              <p className="text-sm font-semibold text-amber-200">
                                {index + 1}. {question.type}
                              </p>
                              <h5 className="mt-2 text-base font-semibold leading-7 text-white">{question.prompt}</h5>
                              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                {question.options.map((option, optionIndex) => {
                                  const correct = optionIndex === question.answerIndex;
                                  const active = selected === optionIndex;

                                  return (
                                    <button
                                      key={option}
                                      type="button"
                                      onClick={() => answerMaterialQuestion(question.id, optionIndex)}
                                      className={cn(
                                        "rounded-[8px] border p-3 text-start text-sm leading-6 transition focus:outline-none focus:ring-2 focus:ring-amber-300/50",
                                        answered && correct
                                          ? "border-emerald-300 bg-emerald-300/12 text-emerald-100"
                                          : active
                                            ? "border-rose-300 bg-rose-300/10 text-rose-100"
                                            : "border-white/10 bg-slate-950/32 text-slate-300 hover:border-amber-300/35",
                                      )}
                                    >
                                      {option}
                                    </button>
                                  );
                                })}
                              </div>
                              {answered ? <p className="mt-3 text-sm leading-7 text-slate-300">{question.rationale}</p> : null}
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  ) : null}

                  {(activeMaterial.track === "writing" || activeMaterial.track === "teacher") ? (
                    <section className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4">
                      <h4 className="text-sm font-semibold text-white">{activeMaterial.track === "teacher" ? "Teacher note draft" : "Writing response"}</h4>
                      <textarea
                        value={activeMaterialDraft}
                        onChange={(event) => updateMaterialDraft(event.target.value)}
                        className="mt-3 min-h-40 w-full resize-y rounded-[8px] border border-white/10 bg-slate-950/72 p-4 text-base leading-8 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-amber-300/50 focus:ring-2 focus:ring-amber-300/20"
                        placeholder={activeMaterial.track === "teacher" ? "Adapt this feedback for Eva or Elham..." : "Write and save this response in the Writing Vault..."}
                      />
                      <p className="mt-2 text-sm leading-6 text-slate-400">Saved to {activeUser.displayName}&apos;s Writing Vault under this material.</p>
                    </section>
                  ) : null}
                </div>

                <aside className="grid content-start gap-3">
                  <div className="rounded-[8px] border border-amber-200/16 bg-amber-200/[0.06] p-4">
                    <h4 className="text-sm font-semibold text-amber-100">Routine</h4>
                    <div className="mt-3 grid gap-2">
                      {activeMaterial.routine.map((step, index) => (
                        <div key={step} className="flex items-start gap-3 rounded-[8px] border border-white/10 bg-slate-950/30 p-3 text-sm leading-6 text-slate-300">
                          <span className="flex size-7 shrink-0 items-center justify-center rounded-[6px] bg-amber-200/10 text-xs font-semibold text-amber-100">{index + 1}</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4">
                    <h4 className="text-sm font-semibold text-white">Rubric</h4>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {activeMaterial.rubric.map((item) => (
                        <span key={item} className="rounded-[8px] border border-white/10 bg-slate-950/35 px-3 py-2 text-xs font-semibold text-slate-200">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4">
                    <h4 className="text-sm font-semibold text-white">Related source pages</h4>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{activeMaterial.sourceUse}</p>
                    <div className="mt-3 grid gap-2">
                      {activeMaterialSourcePages.length ? (
                        activeMaterialSourcePages.map((page) => (
                          <button
                            key={page.id}
                            type="button"
                            onClick={() => choosePage(page)}
                            className="rounded-[8px] border border-white/10 bg-slate-950/30 p-3 text-start text-xs leading-5 text-slate-300 transition hover:border-amber-300/35 focus:outline-none focus:ring-2 focus:ring-amber-300/40"
                          >
                            <span className="font-semibold text-amber-100">P{String(page.page).padStart(3, "0")}</span> · {page.title}
                          </button>
                        ))
                      ) : (
                        <p className="rounded-[8px] border border-dashed border-slate-500/35 bg-slate-900/30 p-3 text-sm leading-6 text-slate-400">
                          This material stands alone and can be used with the active page.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-[8px] border border-sky-200/15 bg-sky-300/[0.055] p-4">
                    <h4 className="text-sm font-semibold text-sky-100">Source safety</h4>
                    <div className="mt-3 grid gap-2">
                      {evaMaterialSourcePolicy.slice(0, 3).map((item) => (
                        <div key={item.label} className="rounded-[8px] border border-white/10 bg-slate-950/30 p-3">
                          <p className="text-xs font-semibold text-white">{item.label}</p>
                          <p className="mt-1 text-xs leading-5 text-slate-500">{item.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </aside>
              </div>
            </article>
          </div>
        ) : null}

        {activePremiumTab === "quiz" ? (
          <div className="mt-4 grid gap-3 xl:grid-cols-[18rem_minmax(0,1fr)]">
            <aside className="rounded-[8px] border border-white/10 bg-slate-950/30 p-4">
              <h3 className="text-sm font-semibold text-white">Quiz tracks</h3>
              <div className="mt-3 grid gap-2">
                {(["grammar", "religious", "lexical"] as EvaStudioTrack[]).map((track) => {
                  const questions = evaQuizQuestions.filter((question) => question.track === track);
                  const answered = questions.filter((question) => quizAnswers[question.id] !== undefined);
                  const correct = answered.filter((question) => quizAnswers[question.id] === question.answerIndex);

                  return (
                    <button
                      key={track}
                      type="button"
                      onClick={() => setActiveQuizTrack(track)}
                      className={cn(
                        "rounded-[8px] border p-3 text-start transition focus:outline-none focus:ring-2 focus:ring-amber-300/50",
                        activeQuizTrack === track ? "border-amber-300/55 bg-amber-300/12 text-white" : "border-white/10 bg-white/[0.035] text-slate-300 hover:border-amber-300/35",
                      )}
                    >
                      <span className="block text-sm font-semibold">{quizTrackTitle(track)}</span>
                      <span className="mt-1 block text-xs text-slate-500">
                        {correct.length}/{questions.length} correct
                      </span>
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={resetQuizTrack}
                className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-[8px] border border-white/10 px-3 text-sm font-semibold text-slate-200 transition hover:border-amber-300/40 hover:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300/50"
              >
                <RotateCcw aria-hidden="true" className="size-4" />
                Reset this track
              </button>
            </aside>
            <article className="rounded-[8px] border border-white/10 bg-slate-950/30 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{quizTrackTitle(activeQuizTrack)} quiz</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    {activeQuizCorrect.length}/{activeQuizQuestions.length} correct in this track. Explanations appear after answering.
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-[8px] border border-amber-200/18 bg-amber-200/[0.08] px-3 py-2 text-xs font-semibold text-amber-100">
                  <Star aria-hidden="true" className="size-4" />
                  Trackable checks
                </span>
              </div>
              <div className="mt-4 grid gap-3">
                {activeQuizQuestions.map((question, index) => {
                  const selected = quizAnswers[question.id];
                  const answered = selected !== undefined;

                  return (
                    <div key={question.id} className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4">
                      <p className="text-xs font-semibold uppercase text-amber-200">Question {index + 1}</p>
                      <h4 className="mt-2 text-sm font-semibold leading-6 text-white">{question.prompt}</h4>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {question.options.map((option, optionIndex) => {
                          const correct = optionIndex === question.answerIndex;
                          const active = selected === optionIndex;

                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => answerQuiz(question, optionIndex)}
                              className={cn(
                                "rounded-[8px] border p-3 text-start text-sm leading-6 transition focus:outline-none focus:ring-2 focus:ring-amber-300/50",
                                answered && correct
                                  ? "border-emerald-300 bg-emerald-300/12 text-emerald-100"
                                  : active
                                    ? "border-rose-300 bg-rose-300/10 text-rose-100"
                                    : "border-white/10 bg-slate-950/32 text-slate-300 hover:border-amber-300/35",
                              )}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                      {answered ? <p className="mt-3 text-sm leading-6 text-slate-300">{question.explanation}</p> : null}
                    </div>
                  );
                })}
              </div>
            </article>
          </div>
        ) : null}

        {activePremiumTab === "exam" ? (
          <div className="mt-4 grid gap-3 xl:grid-cols-[20rem_minmax(0,1fr)]">
            <aside className="rounded-[8px] border border-white/10 bg-slate-950/30 p-4">
              <h3 className="text-base font-semibold text-white">IELTS / TOEFL Exam Mode</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">Original EduPocket tasks, modeled on real exam question families without copying official material.</p>
              <div className="mt-4 grid gap-2">
                {learningDatabase.examTasks.map((task) => {
                  const active = task.id === activeExamTask.id;
                  const answered = task.questions.filter((question) => examAnswers[`${task.id}:${question.id}`] !== undefined).length;
                  const correct = task.questions.filter((question) => examAnswers[`${task.id}:${question.id}`] === question.answerIndex).length;

                  return (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => setActiveExamId(task.id)}
                      className={cn(
                        "rounded-[8px] border p-3 text-start transition focus:outline-none focus:ring-2 focus:ring-amber-300/50",
                        active ? "border-amber-300/55 bg-amber-300/12 text-white" : "border-white/10 bg-white/[0.035] text-slate-300 hover:border-amber-300/35",
                      )}
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold">{task.title}</span>
                        <span className="rounded-[6px] border border-white/10 bg-slate-950/35 px-2 py-1 text-xs font-semibold text-amber-100">{task.exam}</span>
                      </span>
                      <span className="mt-2 block text-sm leading-5 text-slate-400">
                        {task.skill} · {task.timeLimitMinutes} min · {task.questions.length ? `${correct}/${task.questions.length} correct` : "rubric task"}
                      </span>
                      {answered ? <span className="mt-1 block text-xs font-semibold text-slate-500">{answered} answers saved</span> : null}
                    </button>
                  );
                })}
              </div>
            </aside>

            <article className="rounded-[8px] border border-white/10 bg-slate-950/30 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-amber-200">
                    {activeExamTask.exam} / {activeExamTask.skill} / {activeExamTask.level}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold leading-tight text-white">{activeExamTask.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{activeExamTask.prompt}</p>
                </div>
                <span className="inline-flex min-h-11 items-center gap-2 rounded-[8px] border border-amber-200/20 bg-amber-200/[0.08] px-3 text-sm font-semibold text-amber-100">
                  <Timer aria-hidden="true" className="size-4" />
                  {activeExamTask.timeLimitMinutes} min
                </span>
              </div>

              {activeExamTask.passage ? (
                <div className="mt-5 rounded-[8px] border border-sky-200/15 bg-sky-300/[0.055] p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h4 className="text-base font-semibold text-white">Reading passage</h4>
                    <button
                      type="button"
                      onClick={() => speakStudioText(activeExamTask.passage ?? activeExamTask.prompt, `tts-exam-${activeExamTask.id}`, false, 0.9)}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[8px] border border-white/10 px-3 text-sm font-semibold text-slate-200 transition hover:border-sky-200/40 hover:text-sky-100"
                    >
                      <Volume2 aria-hidden="true" className="size-4" />
                      Listen passage
                    </button>
                  </div>
                  <p className="mt-3 text-base leading-8 text-slate-200">{activeExamTask.passage}</p>
                </div>
              ) : null}

              {activeExamTask.questions.length ? (
                <div className="mt-5 grid gap-3">
                  {activeExamTask.questions.map((question, index) => {
                    const answerKey = `${activeExamTask.id}:${question.id}`;
                    const selected = examAnswers[answerKey];
                    const answered = selected !== undefined;

                    return (
                      <div key={question.id} className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4">
                        <p className="text-sm font-semibold text-amber-200">
                          {index + 1}. {question.type}
                        </p>
                        <h4 className="mt-2 text-base font-semibold leading-7 text-white">{question.prompt}</h4>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          {question.options.map((option, optionIndex) => {
                            const correct = optionIndex === question.answerIndex;
                            const active = selected === optionIndex;

                            return (
                              <button
                                key={option}
                                type="button"
                                onClick={() => answerExamQuestion(question.id, optionIndex)}
                                className={cn(
                                  "rounded-[8px] border p-3 text-start text-sm leading-6 transition focus:outline-none focus:ring-2 focus:ring-amber-300/50",
                                  answered && correct
                                    ? "border-emerald-300 bg-emerald-300/12 text-emerald-100"
                                    : active
                                      ? "border-rose-300 bg-rose-300/10 text-rose-100"
                                      : "border-white/10 bg-slate-950/32 text-slate-300 hover:border-amber-300/35",
                                )}
                              >
                                {option}
                              </button>
                            );
                          })}
                        </div>
                        {answered ? <p className="mt-3 text-sm leading-7 text-slate-300">{question.rationale}</p> : null}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-5">
                  <h4 className="text-base font-semibold text-white">Writing response</h4>
                  <textarea
                    value={writingDrafts[`exam-${activeExamTask.id}`] ?? ""}
                    onChange={(event) => setWritingDrafts((current) => ({ ...current, [`exam-${activeExamTask.id}`]: event.target.value }))}
                    className="mt-3 min-h-44 w-full resize-y rounded-[8px] border border-white/10 bg-slate-950/72 p-4 text-base leading-8 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-amber-300/50 focus:ring-2 focus:ring-amber-300/20"
                    placeholder="Write your timed response here..."
                  />
                </div>
              )}

              <div className="mt-5 grid gap-2 sm:grid-cols-4">
                {activeExamTask.rubric.map((item) => (
                  <span key={item} className="rounded-[8px] border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-slate-200">
                    {item}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-400">
                Saved: {activeExamAnswered.length} answers. Correct: {activeExamCorrect.length}. Wrong answers enter the review engine automatically.
              </p>
            </article>
          </div>
        ) : null}

        {activePremiumTab === "vault" ? (
          <div className="mt-4 grid gap-3 xl:grid-cols-[minmax(0,1fr)_20rem]">
            <article className="rounded-[8px] border border-white/10 bg-slate-950/30 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">Writing Vault</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-400">All saved page drafts and exam responses for {activeUser.displayName}.</p>
                </div>
                <NotebookPen aria-hidden="true" className="size-5 text-amber-200" />
              </div>
              <div className="mt-4 grid gap-3">
                {writingVaultEntries.length ? (
                  writingVaultEntries.slice(0, 12).map(([id, draft]) => {
                    const page = booklet.pages.find((item) => item.id === id);
                    const material = evaMaterialItems.find((item) => item.id === id);
                    const title = page?.title ?? materialTitleMap.get(id) ?? learningDatabase.examTasks.find((task) => `exam-${task.id}` === id)?.title ?? id;

                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          if (page) choosePage(page);
                          else if (material) chooseMaterial(material);
                          else setActivePremiumTab("exam");
                        }}
                        className="rounded-[8px] border border-white/10 bg-white/[0.035] p-4 text-start transition hover:border-amber-300/35 focus:outline-none focus:ring-2 focus:ring-amber-300/50"
                      >
                        <span className="text-sm font-semibold text-white">{title}</span>
                        <span className="mt-2 line-clamp-3 block text-sm leading-6 text-slate-400">{draft}</span>
                      </button>
                    );
                  })
                ) : (
                  <p className="rounded-[8px] border border-dashed border-slate-500/35 bg-slate-900/30 p-5 text-sm leading-7 text-slate-400">
                    No writing saved yet. Open a source page or timed writing task and save the first serious answer.
                  </p>
                )}
              </div>
            </article>
            <aside className="rounded-[8px] border border-amber-200/16 bg-amber-200/[0.06] p-4">
              <h3 className="text-sm font-semibold text-amber-100">Vault signals</h3>
              <div className="mt-4 grid gap-2">
                {[
                  ["Drafts", writingVaultEntries.length],
                  ["Teacher notes", Object.values(teacherNotes).filter((value) => value.trim()).length],
                  ["TTS listened", Object.values(ttsListened).reduce((sum, value) => sum + value, 0)],
                  ["TTS repeated", Object.values(ttsRepeated).reduce((sum, value) => sum + value, 0)],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-3 rounded-[8px] border border-white/10 bg-slate-950/30 px-3 py-2 text-sm">
                    <span className="font-semibold text-slate-200">{label}</span>
                    <span className="text-amber-100">{value}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        ) : null}
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
          <div className="mt-3 grid gap-2 sm:hidden">
            {semanticStudyLanes.map((lane) => {
              const stats = laneCounts.get(lane.id);
              const active = lane.id === activeLane.id;
              const disabled = (stats?.pages ?? 0) === 0;

              return (
                <button
                  key={`mobile-${lane.id}`}
                  type="button"
                  disabled={disabled}
                  onClick={() => chooseLane(lane)}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-[8px] border p-3 text-start transition focus:outline-none focus:ring-2 focus:ring-amber-300/40",
                    disabled
                      ? "cursor-not-allowed border-white/10 bg-slate-950/16 text-slate-700"
                      : active
                        ? "border-amber-300/55 bg-amber-300/12 text-amber-50"
                        : "border-white/10 bg-slate-950/32 text-slate-300 hover:border-amber-300/35",
                  )}
                >
                  <span>
                    <span className="block text-sm font-semibold">{lane.title}</span>
                    <span className="mt-1 block text-xs text-slate-500">{lane.primarySkills.join(" / ")}</span>
                  </span>
                  <span className="shrink-0 rounded-[6px] border border-white/10 bg-slate-950/42 px-2 py-1 text-xs font-semibold text-amber-100">
                    {stats?.pages ?? 0} pages
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-3 hidden overflow-x-auto pb-1 sm:block">
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
                  {chapterDoneCount} of {chapterPages.length} pages marked complete for {activeUser.displayName}.
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
                  <div className="flex flex-wrap gap-2">
                    {activeTtsSegment ? (
                      <>
                        <button
                          type="button"
                          onClick={() => speakStudioText(activeTtsSegment.text, activeTtsSegment.id, false, activeTtsSegment.speedDefault)}
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] border border-white/10 px-3 text-sm font-semibold text-slate-200 transition hover:border-sky-200/40 hover:text-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-300/40"
                        >
                          <Volume2 aria-hidden="true" className="size-4" />
                          Listen
                        </button>
                        <button
                          type="button"
                          onClick={() => speakStudioText(activeTtsSegment.text, activeTtsSegment.id, true, Math.max(0.68, activeTtsSegment.speedDefault - 0.12))}
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] border border-white/10 px-3 text-sm font-semibold text-slate-200 transition hover:border-sky-200/40 hover:text-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-300/40"
                        >
                          <Repeat2 aria-hidden="true" className="size-4" />
                          Repeat
                        </button>
                      </>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setReviewQueue((current) => ({ ...current, [activePage.id]: !current[activePage.id] }))}
                      className={cn(
                        "inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] border px-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-amber-300/50",
                        reviewQueue[activePage.id] ? "border-sky-200 bg-sky-200 text-slate-950" : "border-white/10 text-slate-200 hover:border-sky-200/40 hover:text-sky-100",
                      )}
                    >
                      <Star aria-hidden="true" className="size-4" />
                      {reviewQueue[activePage.id] ? "In review" : "Add review"}
                    </button>
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
                {activeTtsSegment ? (
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    {[
                      ["TTS listened", ttsListened[activeTtsSegment.id] ?? 0],
                      ["TTS repeated", ttsRepeated[activeTtsSegment.id] ?? 0],
                      ["Segment speed", `${activeTtsSegment.speedDefault}x`],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-[8px] border border-sky-200/15 bg-sky-300/[0.045] p-3">
                        <p className="text-sm font-semibold text-sky-100">{value}</p>
                        <p className="text-xs leading-4 text-slate-500">{label}</p>
                      </div>
                    ))}
                  </div>
                ) : null}

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
                      <p className="text-sm leading-6 text-slate-400">Saved as writing evidence for this member and visible in the Writing Vault.</p>
                    </div>
                  </div>
                  <textarea
                    value={activeNote}
                    onChange={(event) => updateActiveDraft(event.target.value)}
                    className="mt-5 min-h-44 w-full resize-y rounded-[8px] border border-white/10 bg-slate-950/72 p-4 text-base leading-8 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-amber-300/50 focus:ring-2 focus:ring-amber-300/20"
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
                  {reviewQueueCount ? (
                    <div className="mb-5 rounded-[8px] border border-sky-200/15 bg-sky-300/[0.055] p-3">
                      <div className="flex items-center justify-between gap-3">
                        <h2 className="text-sm font-semibold text-sky-100">Review queue</h2>
                        <span className="text-xs font-semibold text-slate-500">{reviewQueueCount}</span>
                      </div>
                      <div className="mt-3 grid gap-2">
                        {reviewPages.slice(0, 4).map((page) => (
                          <button
                            key={page.id}
                            type="button"
                            onClick={() => choosePage(page)}
                            className="group flex items-start justify-between gap-3 rounded-[8px] border border-white/10 bg-slate-950/28 p-3 text-start transition hover:border-sky-200/35"
                          >
                            <span>
                              <span className="block text-xs font-semibold text-sky-100">P{String(page.page).padStart(3, "0")}</span>
                              <span className="mt-1 block text-sm font-semibold leading-5 text-slate-200">{page.title}</span>
                            </span>
                            <Play aria-hidden="true" className="mt-1 size-4 shrink-0 text-slate-500 transition group-hover:text-sky-100" />
                          </button>
                        ))}
                        {reviewMaterialItems.slice(0, Math.max(0, 4 - reviewPages.slice(0, 4).length)).map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => chooseMaterial(item)}
                            className="group flex items-start justify-between gap-3 rounded-[8px] border border-white/10 bg-slate-950/28 p-3 text-start transition hover:border-sky-200/35"
                          >
                            <span>
                              <span className="block text-xs font-semibold text-sky-100">{item.exam} / {item.skill}</span>
                              <span className="mt-1 block text-sm font-semibold leading-5 text-slate-200">{item.title}</span>
                            </span>
                            <Play aria-hidden="true" className="mt-1 size-4 shrink-0 text-slate-500 transition group-hover:text-sky-100" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}

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
