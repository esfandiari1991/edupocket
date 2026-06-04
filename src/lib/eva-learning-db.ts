import type { EvaBooklet, EvaBookletPage } from "@/lib/eva-private-content";
import { evaMaterialItems, evaSupplementalExamTasks } from "@/lib/eva-materials";
import { buildEvaSourceMaterialItems, buildEvaSupplementalExamTasksFromMaterials } from "@/lib/eva-source-materials";
import { evaGrammarModules, evaLexicalResource, evaQuizQuestions, evaReligiousModules } from "@/lib/eva-studio-curriculum";

export type EvaUserId = "ali" | "eva" | "elham";

export type EvaUserRole = "owner" | "premium-member" | "premium-learner";

export type EvaSeedUser = {
  id: EvaUserId;
  displayName: string;
  role: EvaUserRole;
  locale: "en" | "fa";
  canTeach: boolean;
};

export type EvaLearningEntity =
  | "users"
  | "memberships"
  | "source_documents"
  | "chapters"
  | "sections"
  | "learning_items"
  | "activities"
  | "questions"
  | "tts_segments"
  | "user_progress"
  | "user_responses"
  | "review_queue"
  | "teacher_notes";

export type EvaLearningActivityKind =
  | "source-page"
  | "reading"
  | "writing"
  | "grammar"
  | "lexical"
  | "religious-context"
  | "listening"
  | "translation"
  | "pronunciation"
  | "quiz"
  | "exam-mode"
  | "teacher-feedback"
  | "review";

export type EvaLearningActivity = {
  id: string;
  kind: EvaLearningActivityKind;
  title: string;
  sourcePageIds: string[];
  skillTargets: string[];
  levelTargets: string[];
  estimatedMinutes: number;
  scoringMode: "completion" | "answer-key" | "rubric" | "teacher-review";
  trackableSignals: string[];
  contentJson: Record<string, unknown>;
};

export type EvaTtsSegment = {
  id: string;
  activityId: string;
  sourcePageId?: string;
  title: string;
  text: string;
  locale: "en";
  voiceHint: "calm-teacher" | "pronunciation-coach" | "exam-reader";
  speedDefault: number;
  pronunciationFocus?: string;
};

export type EvaExamQuestion = {
  id: string;
  type: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  rationale: string;
};

export type EvaExamTask = {
  id: string;
  exam: "IELTS" | "TOEFL";
  skill: "reading" | "writing";
  title: string;
  level: "B1" | "B2";
  timeLimitMinutes: number;
  passage?: string;
  prompt: string;
  rubric: string[];
  questions: EvaExamQuestion[];
};

export type EvaLearningDatabase = {
  entities: EvaLearningEntity[];
  users: EvaSeedUser[];
  memberships: Array<{ userId: EvaUserId; productId: "eva-digital-booklet"; status: "active"; pricePaid: number; currency: "USD" }>;
  sourceDocuments: Array<{ id: string; title: string; privacy: string; importedPages: number; textCharacters: number | null }>;
  chapters: Array<{ id: string; title: string; pageIds: string[]; skillTags: string[] }>;
  sections: Array<{ id: string; chapterId: string; type: string; pageIds: string[]; fieldCount: number; checkboxCount: number }>;
  learningItems: Array<{ id: string; activityId: string; title: string; sourcePageId?: string; type: string; tags: string[] }>;
  activities: EvaLearningActivity[];
  questions: Array<{ id: string; activityId: string; track: string; type: string; prompt: string; options: string[]; answerIndex: number; rationale: string }>;
  ttsSegments: EvaTtsSegment[];
  examTasks: EvaExamTask[];
};

export type EvaStoredStudioState = {
  activeStackId?: string;
  activeChapterId?: string;
  activePageId?: string;
  activeLaneId?: string;
  activePremiumTab?: string;
  activeModuleId?: string;
  activeLexicalId?: string;
  activeQuizTrack?: string;
  activeExamId?: string;
  activeMaterialTrack?: string;
  activeMaterialId?: string;
  done: Record<string, boolean>;
  moduleDone: Record<string, boolean>;
  notes: Record<string, string>;
  writingDrafts: Record<string, string>;
  pronunciationDone: Record<string, boolean>;
  shadowingDone: Record<string, boolean>;
  ttsListened: Record<string, number>;
  ttsRepeated: Record<string, number>;
  quizAnswers: Record<string, number>;
  examAnswers: Record<string, number>;
  activityChecks: Record<string, boolean>;
  rubricRatings: Record<string, number>;
  reviewQueue: Record<string, boolean>;
  teacherNotes: Record<string, string>;
};

export const evaSeedUsers: EvaSeedUser[] = [
  { id: "ali", displayName: "Ali", role: "owner", locale: "fa", canTeach: true },
  { id: "eva", displayName: "Eva", role: "premium-member", locale: "en", canTeach: false },
  { id: "elham", displayName: "Elham", role: "premium-learner", locale: "fa", canTeach: false },
];

export const evaLearningEntities: EvaLearningEntity[] = [
  "users",
  "memberships",
  "source_documents",
  "chapters",
  "sections",
  "learning_items",
  "activities",
  "questions",
  "tts_segments",
  "user_progress",
  "user_responses",
  "review_queue",
  "teacher_notes",
];

export const emptyEvaStoredStudioState: EvaStoredStudioState = {
  done: {},
  moduleDone: {},
  notes: {},
  writingDrafts: {},
  pronunciationDone: {},
  shadowingDone: {},
  ttsListened: {},
  ttsRepeated: {},
  quizAnswers: {},
  examAnswers: {},
  activityChecks: {},
  rubricRatings: {},
  reviewQueue: {},
  teacherNotes: {},
};

export const evaExamModeTasks: EvaExamTask[] = [
  {
    id: "ielts-reading-ministry-planning",
    exam: "IELTS",
    skill: "reading",
    title: "IELTS-style Reading: Planning a learning ministry",
    level: "B2",
    timeLimitMinutes: 18,
    passage:
      "A small learning ministry can become effective when language practice is tied to repeated service situations. Learners often improve faster when each reading passage leads to a visible output: a summary, a revised sentence, a vocabulary card, or a short reflection. This approach also makes progress easier to observe. Instead of asking whether a learner feels more confident, the teacher can inspect the evidence: completed pages, corrected answers, reviewed vocabulary, and clearer writing. The risk is that a large workbook can become passive if it is only displayed. A stronger system turns every page into an activity and every activity into a trackable decision.",
    prompt: "Answer the questions. The passage is original EduPocket material and follows IELTS-style reading demands.",
    rubric: ["Skimming", "detail matching", "inference", "vocabulary in context"],
    questions: [
      {
        id: "ielts-r1-q1",
        type: "True / False / Not Given",
        prompt: "The passage says confidence should be measured only by learner feelings.",
        options: ["True", "False", "Not Given"],
        answerIndex: 1,
        rationale: "The passage contrasts feelings with visible evidence such as completed pages and clearer writing.",
      },
      {
        id: "ielts-r1-q2",
        type: "Multiple choice",
        prompt: "What is the main risk of a large workbook?",
        options: ["It may become passive if it is only displayed.", "It always improves speaking automatically.", "It cannot include vocabulary.", "It is too short for review."],
        answerIndex: 0,
        rationale: "The final sentences identify passive display as the risk.",
      },
      {
        id: "ielts-r1-q3",
        type: "Sentence completion",
        prompt: "A stronger system turns every page into...",
        options: ["a decorative preview", "an activity", "a public file", "a payment receipt"],
        answerIndex: 1,
        rationale: "The passage explicitly says every page should become an activity.",
      },
    ],
  },
  {
    id: "toefl-reading-meaning-transfer",
    exam: "TOEFL",
    skill: "reading",
    title: "TOEFL-style Reading: Meaning transfer and revision",
    level: "B2",
    timeLimitMinutes: 16,
    passage:
      "Translation practice is not only a vocabulary exercise. A learner must notice tone, sequence, audience, and the purpose of the message. When the first draft is too literal, the reader may understand the words but miss the intended effect. Revision therefore becomes a learning event. By comparing a literal draft, a natural draft, and a ministry-ready draft, the learner can see how grammar choices carry meaning. This is especially useful when Chinese and English sentence patterns pull in different directions.",
    prompt: "Answer the questions. The passage is original EduPocket material and follows TOEFL-style reading demands.",
    rubric: ["factual information", "inference", "rhetorical purpose", "vocabulary in context"],
    questions: [
      {
        id: "toefl-r1-q1",
        type: "Factual information",
        prompt: "According to the passage, what may happen when a draft is too literal?",
        options: ["The reader may miss the intended effect.", "The text becomes shorter.", "The vocabulary disappears.", "The grammar is always perfect."],
        answerIndex: 0,
        rationale: "The passage says literal wording can preserve words while losing intended effect.",
      },
      {
        id: "toefl-r1-q2",
        type: "Rhetorical purpose",
        prompt: "Why does the author mention three drafts?",
        options: ["To show a revision pathway.", "To reject all grammar study.", "To describe payment tiers.", "To introduce unrelated languages."],
        answerIndex: 0,
        rationale: "The three drafts demonstrate how revision can make meaning clearer.",
      },
      {
        id: "toefl-r1-q3",
        type: "Vocabulary in context",
        prompt: "In the passage, 'carry meaning' is closest to...",
        options: ["transport books", "communicate meaning", "remove context", "hide mistakes"],
        answerIndex: 1,
        rationale: "Grammar choices are described as communicating or preserving meaning.",
      },
    ],
  },
  {
    id: "ielts-writing-digital-booklet",
    exam: "IELTS",
    skill: "writing",
    title: "IELTS-style Writing: Digital booklets and progress",
    level: "B2",
    timeLimitMinutes: 22,
    prompt:
      "Some learners prefer digital study portals because they can save answers, track progress, and review weak areas. Others believe a simple PDF is enough. Discuss both views and give your own opinion.",
    rubric: ["task response", "coherence and cohesion", "lexical resource", "grammar range and accuracy"],
    questions: [],
  },
  {
    id: "toefl-writing-academic-discussion",
    exam: "TOEFL",
    skill: "writing",
    title: "TOEFL-style Writing: Academic discussion",
    level: "B2",
    timeLimitMinutes: 10,
    prompt:
      "Your class is discussing whether language learners should use AI feedback before teacher feedback. Write a response that states your view and supports it with one clear reason and one example.",
    rubric: ["clear claim", "support", "example", "academic tone"],
    questions: [],
  },
];

export function evaUserStorageKey(userId: EvaUserId) {
  return `edupocket-eva-studio-v2-${userId}`;
}

export function getEvaSeedUser(userId: string): EvaSeedUser | undefined {
  return evaSeedUsers.find((user) => user.id === userId);
}

export function normalizeStoredState(value: Partial<EvaStoredStudioState> | null | undefined): EvaStoredStudioState {
  return {
    ...emptyEvaStoredStudioState,
    ...(value ?? {}),
    done: value?.done ?? {},
    moduleDone: value?.moduleDone ?? {},
    notes: value?.notes ?? {},
    writingDrafts: value?.writingDrafts ?? value?.notes ?? {},
    pronunciationDone: value?.pronunciationDone ?? {},
    shadowingDone: value?.shadowingDone ?? {},
    ttsListened: value?.ttsListened ?? {},
    ttsRepeated: value?.ttsRepeated ?? {},
    quizAnswers: value?.quizAnswers ?? {},
    examAnswers: value?.examAnswers ?? {},
    activityChecks: value?.activityChecks ?? {},
    rubricRatings: value?.rubricRatings ?? {},
    reviewQueue: value?.reviewQueue ?? {},
    teacherNotes: value?.teacherNotes ?? {},
  };
}

function activityKindForPage(page: EvaBookletPage): EvaLearningActivityKind {
  if (page.type.includes("reading") || page.type.includes("enrichment")) return "reading";
  if (page.type.includes("grammar")) return "grammar";
  if (page.type.includes("vocabulary")) return "lexical";
  if (page.type.includes("translation") || page.type.includes("exegesis")) return "translation";
  if (page.type.includes("listening")) return "pronunciation";
  if (page.type.includes("quiz")) return "quiz";
  if (page.type.includes("scenario") || page.type.includes("gallery")) return "religious-context";
  if (page.type.includes("progress")) return "review";
  return "source-page";
}

function estimateMinutes(page: EvaBookletPage) {
  return Math.max(6, Math.min(32, Math.round(page.wordCount / 65) + page.fieldCount * 2 + page.checkboxCount));
}

function firstReadableText(page: EvaBookletPage) {
  return page.blocks.find((block) => block.length > 80) ?? page.summary ?? page.title;
}

export function buildEvaLearningDatabase(booklet: EvaBooklet): EvaLearningDatabase {
  const sourceMaterialItems = buildEvaSourceMaterialItems(booklet);
  const allMaterialItems = [...evaMaterialItems, ...sourceMaterialItems];
  const allSupplementalExamTasks = [...evaSupplementalExamTasks, ...buildEvaSupplementalExamTasksFromMaterials(sourceMaterialItems)];
  const supplementalExamTasks: EvaExamTask[] = allSupplementalExamTasks.map((task) => ({
    id: task.id,
    exam: task.exam as "IELTS" | "TOEFL",
    skill: task.skill as "reading" | "writing",
    title: task.title,
    level: task.level,
    timeLimitMinutes: task.timeLimitMinutes,
    passage: task.passage,
    prompt: task.prompt,
    rubric: task.rubric,
    questions: task.questions,
  }));
  const allExamTasks = [...evaExamModeTasks, ...supplementalExamTasks];
  const pageActivities: EvaLearningActivity[] = booklet.pages.map((page) => ({
    id: `activity-${page.id}`,
    kind: activityKindForPage(page),
    title: page.title,
    sourcePageIds: [page.id],
    skillTargets: page.skillTags,
    levelTargets: page.levelTags,
    estimatedMinutes: estimateMinutes(page),
    scoringMode: page.type.includes("quiz") ? "answer-key" : page.fieldCount > 0 ? "teacher-review" : "completion",
    trackableSignals: ["active page", "completion", "writing draft", "review queue", "TTS listened", "teacher note"],
    contentJson: {
      source: "eva-source-booklet",
      pageNumber: page.page,
      chapterId: page.chapterId,
      chapterTitle: page.chapterTitle,
      subtitle: page.subtitle,
      summary: page.summary,
      type: page.type,
      fieldCount: page.fieldCount,
      checkboxCount: page.checkboxCount,
      wordCount: page.wordCount,
      blocks: page.blocks,
    },
  }));

  const moduleActivities: EvaLearningActivity[] = [...evaGrammarModules, ...evaReligiousModules].map((module) => ({
    id: `module-${module.id}`,
    kind: module.track === "grammar" ? "grammar" : "religious-context",
    title: module.title,
    sourcePageIds: booklet.pages.filter((page) => module.sourceTypes.includes(page.type)).map((page) => page.id),
    skillTargets: [module.track, module.focus],
    levelTargets: [module.level],
    estimatedMinutes: module.minutes,
    scoringMode: "teacher-review",
    trackableSignals: ["module completion", "source jump", "writing evidence", "weak skill map"],
    contentJson: {
      track: module.track,
      order: module.order,
      focus: module.focus,
      outcome: module.outcome,
      sourceTypes: module.sourceTypes,
      practice: module.practice,
      evidence: module.evidence,
      level: module.level,
    },
  }));

  const lexicalActivities: EvaLearningActivity[] = evaLexicalResource.map((item) => ({
    id: `lexical-${item.id}`,
    kind: "pronunciation",
    title: item.term,
    sourcePageIds: booklet.pages
      .filter((page) => item.tags.some((tag) => page.skillTags.join(" ").toLowerCase().includes(tag) || page.blocks.join(" ").toLowerCase().includes(tag)))
      .slice(0, 8)
      .map((page) => page.id),
    skillTargets: ["lexical resource", "pronunciation", ...item.tags],
    levelTargets: ["B1", "B2"],
    estimatedMinutes: 8,
    scoringMode: "completion",
    trackableSignals: ["TTS listened", "TTS repeated", "shadowing", "pronunciation mastered"],
    contentJson: {
      term: item.term,
      ipa: item.ipa,
      stress: item.stress,
      meaning: item.meaning,
      ministryUse: item.ministryUse,
      collocations: item.collocations,
      pronunciationTip: item.pronunciationTip,
      example: item.example,
      tags: item.tags,
    },
  }));

  const materialActivities: EvaLearningActivity[] = allMaterialItems.map((item) => ({
    id: `material-${item.id}`,
    kind:
      item.track === "reading"
        ? "reading"
        : item.track === "writing"
          ? "writing"
          : item.track === "listening"
            ? "listening"
            : item.track === "pronunciation"
              ? "pronunciation"
              : "teacher-feedback",
    title: item.title,
    sourcePageIds: booklet.pages
      .filter((page) => item.sourceTypeTargets.includes(page.type))
      .slice(0, 14)
      .map((page) => page.id),
    skillTargets: [item.exam, item.skill, item.track, ...item.tags],
    levelTargets: [item.level],
    estimatedMinutes: item.timeLimitMinutes,
    scoringMode: item.questions.length ? "answer-key" : item.track === "writing" || item.track === "teacher" ? "teacher-review" : "completion",
    trackableSignals: ["material completion", "material question answers", "writing draft", "TTS listened", "TTS repeated", "review queue"],
    contentJson: {
      track: item.track,
      exam: item.exam,
      skill: item.skill,
      level: item.level,
      summary: item.summary,
      sourceUse: item.sourceUse,
      sourceTypeTargets: item.sourceTypeTargets,
      passage: item.passage,
      prompt: item.prompt,
      ttsScript: item.ttsScript,
      routine: item.routine,
      rubric: item.rubric,
      visualAsset: item.visualAsset,
      tags: item.tags,
      localeNotes: item.localeNotes,
    },
  }));

  const examActivities: EvaLearningActivity[] = allExamTasks.map((task) => ({
    id: `exam-${task.id}`,
    kind: "exam-mode",
    title: task.title,
    sourcePageIds: [],
    skillTargets: [task.exam, task.skill, ...task.rubric],
    levelTargets: [task.level],
    estimatedMinutes: task.timeLimitMinutes,
    scoringMode: task.questions.length ? "answer-key" : "rubric",
    trackableSignals: ["timed start", "answers", "rationale viewed", "review queue", "writing draft"],
    contentJson: {
      exam: task.exam,
      skill: task.skill,
      level: task.level,
      timeLimitMinutes: task.timeLimitMinutes,
      passage: task.passage,
      prompt: task.prompt,
      rubric: task.rubric,
    },
  }));

  const quizQuestions = evaQuizQuestions.map((question) => ({
    id: question.id,
    activityId: `quiz-${question.track}`,
    track: question.track,
    type: "multiple-choice",
    prompt: question.prompt,
    options: question.options,
    answerIndex: question.answerIndex,
    rationale: question.explanation,
  }));

  const examQuestions = allExamTasks.flatMap((task) =>
    task.questions.map((question) => ({
      id: question.id,
      activityId: `exam-${task.id}`,
      track: `${task.exam}-${task.skill}`,
      type: question.type,
      prompt: question.prompt,
      options: question.options,
      answerIndex: question.answerIndex,
      rationale: question.rationale,
    })),
  );

  const materialQuestions = allMaterialItems.flatMap((item) =>
    item.questions.map((question) => ({
      id: `material-${item.id}-${question.id}`,
      activityId: `material-${item.id}`,
      track: `${item.exam}-${item.skill}`,
      type: question.type,
      prompt: question.prompt,
      options: question.options,
      answerIndex: question.answerIndex,
      rationale: question.rationale,
    })),
  );

  const ttsSegments: EvaTtsSegment[] = [
    ...booklet.pages.map((page) => ({
      id: `tts-page-${page.id}`,
      activityId: `activity-${page.id}`,
      sourcePageId: page.id,
      title: `Page ${page.page}: ${page.title}`,
      text: firstReadableText(page),
      locale: "en" as const,
      voiceHint: "calm-teacher" as const,
      speedDefault: 0.86,
    })),
    ...evaLexicalResource.map((item) => ({
      id: `tts-lexical-${item.id}`,
      activityId: `lexical-${item.id}`,
      title: `${item.term} pronunciation`,
      text: `${item.term}. ${item.stress}. ${item.example}`,
      locale: "en" as const,
      voiceHint: "pronunciation-coach" as const,
      speedDefault: 0.78,
      pronunciationFocus: item.pronunciationTip,
    })),
    ...allExamTasks
      .filter((task) => task.passage)
      .map((task) => ({
        id: `tts-exam-${task.id}`,
        activityId: `exam-${task.id}`,
        title: `${task.title} passage`,
        text: task.passage ?? task.prompt,
        locale: "en" as const,
        voiceHint: "exam-reader" as const,
        speedDefault: 0.9,
      })),
    ...allMaterialItems
      .filter((item) => item.ttsScript || item.passage || item.prompt)
      .map((item) => ({
        id: `tts-material-${item.id}`,
        activityId: `material-${item.id}`,
        title: `${item.title} material script`,
        text: item.ttsScript ?? item.passage ?? item.prompt ?? item.summary,
        locale: "en" as const,
        voiceHint: item.track === "pronunciation" ? ("pronunciation-coach" as const) : item.track === "reading" ? ("exam-reader" as const) : ("calm-teacher" as const),
        speedDefault: item.track === "pronunciation" ? 0.76 : item.track === "listening" ? 0.84 : 0.9,
        pronunciationFocus: item.track === "pronunciation" ? item.summary : undefined,
      })),
  ];

  return {
    entities: evaLearningEntities,
    users: evaSeedUsers,
    memberships: evaSeedUsers.map((user) => ({ userId: user.id, productId: "eva-digital-booklet", status: "active", pricePaid: 4.99, currency: "USD" })),
    sourceDocuments: [
      {
        id: "eva-digital-booklet-source",
        title: booklet.source.title,
        privacy: booklet.source.privacy,
        importedPages: booklet.stats.pages,
        textCharacters: booklet.stats.textCharacters,
      },
    ],
    chapters: booklet.chapters.map((chapter) => ({ id: chapter.id, title: chapter.title, pageIds: chapter.pageIds, skillTags: chapter.skillTags })),
    sections: booklet.chapters.flatMap((chapter) => {
      const pages = booklet.pages.filter((page) => page.chapterId === chapter.id);
      const typeGroups = Array.from(new Set(pages.map((page) => page.type)));
      return typeGroups.map((type) => {
        const typedPages = pages.filter((page) => page.type === type);
        return {
          id: `section-${chapter.id}-${type}`,
          chapterId: chapter.id,
          type,
          pageIds: typedPages.map((page) => page.id),
          fieldCount: typedPages.reduce((sum, page) => sum + page.fieldCount, 0),
          checkboxCount: typedPages.reduce((sum, page) => sum + page.checkboxCount, 0),
        };
      });
    }),
    learningItems: [
      ...booklet.pages.map((page) => ({
        id: `item-${page.id}`,
        activityId: `activity-${page.id}`,
        title: page.title,
        sourcePageId: page.id,
        type: page.type,
        tags: [...page.skillTags, ...page.levelTags],
      })),
      ...evaLexicalResource.map((item) => ({
        id: `item-${item.id}`,
        activityId: `lexical-${item.id}`,
        title: item.term,
        type: "lexical-pronunciation",
        tags: item.tags,
      })),
      ...allMaterialItems.map((item) => ({
        id: `item-${item.id}`,
        activityId: `material-${item.id}`,
        title: item.title,
        type: `material-${item.track}`,
        tags: [item.exam, item.skill, item.level, ...item.tags],
      })),
    ],
    activities: [...pageActivities, ...moduleActivities, ...lexicalActivities, ...materialActivities, ...examActivities],
    questions: [...quizQuestions, ...examQuestions, ...materialQuestions],
    ttsSegments,
    examTasks: allExamTasks,
  };
}
