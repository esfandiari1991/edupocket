import type { EvaBooklet, EvaBookletChapter, EvaBookletPage } from "@/lib/eva-private-content";
import type { EvaMaterialItem, EvaMaterialQuestion, EvaMaterialTrack } from "@/lib/eva-materials";

type MaterialCollection<TId extends EvaMaterialTrack = EvaMaterialTrack> = {
  id: TId;
  title: string;
  description: string;
  items: EvaMaterialItem[];
};

const readingTypes = ["reading-lab", "reading-lab-rc", "chapter-reading", "enrichment", "enrichment-rc"];
const writingTypes = ["progress", "chapter-quiz", "translation", "exegesis", "lesson", "chapter-language"];
const listeningTypes = ["listening-speaking", "scenario", "gallery", "chapter-reading"];
const pronunciationTypes = ["vocabulary", "chapter-language", "grammar-practice", "reading-lab"];

const chapterTerms = [
  { term: "calling", focus: "CALL-ing", cue: "purpose and vocation" },
  { term: "collocation", focus: "col-lo-CA-tion", cue: "words that naturally travel together" },
  { term: "accuracy", focus: "AC-cu-ra-cy", cue: "grammar that stays stable" },
  { term: "connection", focus: "con-NEC-tion", cue: "ideas joined with care" },
  { term: "listening", focus: "LIS-ten-ing", cue: "attention before response" },
  { term: "revision", focus: "re-VI-sion", cue: "meaning improved after the first draft" },
  { term: "exegesis", focus: "ek-suh-JEE-sis", cue: "careful explanation of a text" },
  { term: "scenario", focus: "sce-NA-ri-o", cue: "language inside a real situation" },
  { term: "reflection", focus: "re-FLEC-tion", cue: "thinking turned into evidence" },
  { term: "visual", focus: "VI-su-al", cue: "image-based language practice" },
  { term: "glossary", focus: "GLOS-sa-ry", cue: "words organized for reuse" },
  { term: "portfolio", focus: "port-FO-li-o", cue: "saved evidence of growth" },
];

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function formatType(type: string) {
  return type
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function pageExcerpt(page: EvaBookletPage, maxLength = 620) {
  const text = normalizeText(
    page.blocks
      .filter((block) => block !== page.title)
      .filter((block) => block.length > 22)
      .slice(0, 5)
      .join(" "),
  );

  if (!text) return page.summary || page.title;
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).replace(/\s+\S*$/, "")}.`;
}

function firstChapterPage(booklet: EvaBooklet, chapter: EvaBookletChapter, preferredTypes: string[]) {
  const pages = booklet.pages.filter((page) => page.chapterId === chapter.id);
  return pages.find((page) => preferredTypes.includes(page.type)) ?? pages[0] ?? booklet.pages[0];
}

function visibleSkills(page: EvaBookletPage) {
  return page.skillTags.filter((tag) => !tag.startsWith("source-page:")).slice(0, 4);
}

function sourceTags(chapter: EvaBookletChapter, page: EvaBookletPage, extras: string[]) {
  return unique([
    `source-page:${page.id}`,
    `chapter:${chapter.id}`,
    chapter.shortTitle,
    formatType(page.type),
    ...visibleSkills(page),
    ...extras,
  ]);
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function readingQuestions(chapter: EvaBookletChapter, page: EvaBookletPage): EvaMaterialQuestion[] {
  const skill = visibleSkills(page)[0] ?? "reading";

  return [
    {
      id: `${chapter.id}-source-r-main`,
      type: "Main idea",
      prompt: "What is the main purpose of this source-linked reading pack?",
      options: [
        `To turn ${chapter.shortTitle} into visible learning evidence`,
        "To replace every teacher note with a private password",
        "To memorize isolated words without context",
        "To remove the source page from the study path",
      ],
      answerIndex: 0,
      rationale: "The passage explicitly frames the source page as trackable evidence inside the study path.",
    },
    {
      id: `${chapter.id}-source-r-detail`,
      type: "Factual information",
      prompt: "Which source signal is named in the passage?",
      options: [formatType(page.type), "a payment invoice", "a public download folder", "an unrelated social post"],
      answerIndex: 0,
      rationale: `The passage identifies the page as ${formatType(page.type)} and links it to the chapter workflow.`,
    },
    {
      id: `${chapter.id}-source-r-inference`,
      type: "Inference",
      prompt: "What should the learner do after reading this page?",
      options: [
        "Produce a small answer, note, or review decision",
        "Close the portal without saving anything",
        "Skip the chapter because the page is complete",
        "Copy an official exam answer",
      ],
      answerIndex: 0,
      rationale: "The studio model asks the learner to create a trackable decision after each page.",
    },
    {
      id: `${chapter.id}-source-r-vocab`,
      type: "Vocabulary in context",
      prompt: `In this task, '${skill}' is closest to...`,
      options: ["a learning signal connected to action", "a decorative label", "a password rule", "a file name only"],
      answerIndex: 0,
      rationale: "Skill labels are used to route practice and evidence, not as decoration.",
    },
  ];
}

function listeningQuestions(chapter: EvaBookletChapter): EvaMaterialQuestion[] {
  return [
    {
      id: `${chapter.id}-source-l-sequence`,
      type: "Listening sequence",
      prompt: "What is the final action in the listening routine?",
      options: ["Choose one review decision", "Delete the source page", "Ignore the teacher note", "Start a new account"],
      answerIndex: 0,
      rationale: "The TTS script closes with a review decision so progress does not disappear.",
    },
    {
      id: `${chapter.id}-source-l-purpose`,
      type: "Listening purpose",
      prompt: "Why should the learner repeat the key sentence aloud?",
      options: [
        "To connect listening, pronunciation, and memory",
        "To make the page decorative",
        "To avoid writing any evidence",
        "To replace all reading practice",
      ],
      answerIndex: 0,
      rationale: "Shadowing links sound, meaning, and later recall.",
    },
  ];
}

function buildReadingMaterial(booklet: EvaBooklet, chapter: EvaBookletChapter, index: number): EvaMaterialItem {
  const page = firstChapterPage(booklet, chapter, readingTypes);
  const exam = index % 2 === 0 ? "IELTS" : "TOEFL";
  const passage =
    `In ${chapter.shortTitle}, the source page "${page.title}" is not treated as passive reading. It belongs to the ${formatType(page.type)} lane and carries ${visibleSkills(page).join(", ") || "study"} signals. The learner should read for meaning, produce one visible answer, and decide whether a weak item belongs in review. ${pageExcerpt(page)} In the premium studio, this page becomes a reading task because every source page should leave evidence: an answer, a note, a correction, or a next step.`;

  return {
    id: `source-${chapter.id}-reading-pack`,
    track: "reading",
    exam,
    skill: "reading",
    title: `${chapter.shortTitle}: source reading pack`,
    level: index % 3 === 0 ? "B1" : "B2",
    timeLimitMinutes: exam === "IELTS" ? 18 : 16,
    summary: `A chapter-linked ${exam}-style reading task built from page ${String(page.page).padStart(3, "0")} of the Eva source booklet.`,
    sourceUse: `Built from ${chapter.title}, page ${page.page}: ${page.title}.`,
    sourceTypeTargets: unique([page.type, ...readingTypes]),
    passage,
    prompt: "Read the passage, answer the questions, then save one evidence sentence in the Writing Vault.",
    questions: readingQuestions(chapter, page),
    routine: [
      "Skim the chapter title and source-page title.",
      "Answer without using outside knowledge.",
      "Read every rationale after answering.",
      "Save one sentence explaining the weak point or next action.",
    ],
    rubric: exam === "IELTS" ? ["main idea", "detail", "inference", "vocabulary in context"] : ["factual information", "inference", "purpose", "vocabulary"],
    tags: sourceTags(chapter, page, [exam, "source reading", "answer key", "review evidence"]),
    localeNotes: {
      en: "Use this when a chapter needs to become exam-style reading without losing the original source page.",
      fa: "براي وقتي كه يك فصل بايد به تمرين ريدينگ آزموني تبديل شود، اما صفحه اصلي از دست نرود.",
    },
  };
}

function buildWritingMaterial(booklet: EvaBooklet, chapter: EvaBookletChapter, index: number): EvaMaterialItem {
  const page = firstChapterPage(booklet, chapter, writingTypes);
  const exam = index % 2 === 0 ? "IELTS" : "TOEFL";
  const integrated = exam === "TOEFL";
  const prompt = integrated
    ? `Your class is discussing whether chapter-based digital booklets help learners make more durable progress than static PDFs. Use ${chapter.shortTitle} as your example. State your view, respond to the idea, and support your answer with one concrete learning action.`
    : `Some learners make faster progress when every chapter page becomes a saved activity, while others prefer reading a full workbook without interruption. Discuss both views and give your own opinion. Use ${chapter.shortTitle} as your context.`;

  return {
    id: `source-${chapter.id}-writing-task`,
    track: "writing",
    exam,
    skill: "writing",
    title: `${chapter.shortTitle}: ${exam} writing task`,
    level: index % 3 === 1 ? "B1" : "B2",
    timeLimitMinutes: integrated ? 10 : 25,
    summary: `A source-linked writing task that turns page ${String(page.page).padStart(3, "0")} into a saved premium draft.`,
    sourceUse: `Use after reading page ${page.page}: ${page.title}.`,
    sourceTypeTargets: unique([page.type, ...writingTypes]),
    passage: integrated
      ? `Source note: ${chapter.shortTitle} asks the learner to move from page awareness to saved evidence. The page "${page.title}" provides the chapter anchor; the writing task asks the learner to explain how a digital study path changes behavior.`
      : undefined,
    ttsScript: integrated
      ? `A classmate argues that a digital booklet is useful only if it reduces friction. Another classmate says the real value is teacher visibility. The strongest answer should connect both ideas to one concrete study action.`
      : undefined,
    prompt,
    questions: [],
    routine: [
      "Plan the controlling idea in one sentence.",
      "Add one concrete detail from the active chapter.",
      "Use one connector for contrast or result.",
      "Save the final draft and choose one sentence for teacher review.",
    ],
    rubric: integrated ? ["clear position", "response to discussion", "specific support", "academic tone"] : ["task response", "coherence and cohesion", "lexical resource", "grammar range and accuracy"],
    tags: sourceTags(chapter, page, [exam, "writing vault", "teacher review", "chapter draft"]),
    localeNotes: {
      en: "Use this to make the chapter produce a real saved writing artifact.",
      fa: "براي اينكه فصل فقط خوانده نشود و يك متن واقعي قابل بازبيني توليد كند.",
    },
  };
}

function buildListeningMaterial(booklet: EvaBooklet, chapter: EvaBookletChapter, index: number): EvaMaterialItem {
  const page = firstChapterPage(booklet, chapter, listeningTypes);
  const script =
    `Open ${chapter.shortTitle}. Start with page ${page.page}, "${page.title}". Listen for the chapter purpose first. Then say one key sentence aloud: this page should produce evidence, not only attention. After you answer, choose one review decision. If the page feels easy, explain why. If it feels difficult, name the exact weak item.`;

  return {
    id: `source-${chapter.id}-listening-routine`,
    track: "listening",
    exam: "EduPocket",
    skill: "listening",
    title: `${chapter.shortTitle}: listening routine`,
    level: index % 2 === 0 ? "B1" : "B2",
    timeLimitMinutes: 8,
    summary: `A TTS-led chapter opening routine for page ${String(page.page).padStart(3, "0")}.`,
    sourceUse: `Use before or after page ${page.page}: ${page.title}.`,
    sourceTypeTargets: unique([page.type, ...listeningTypes]),
    ttsScript: script,
    questions: listeningQuestions(chapter),
    routine: [
      "Listen once at normal speed.",
      "Repeat the key sentence slowly.",
      "Name the weak item aloud.",
      "Add the page to review if the weak item is unclear.",
    ],
    rubric: ["sequence listening", "shadowing", "weak item naming", "review decision"],
    tags: sourceTags(chapter, page, ["TTS", "shadowing", "listening routine", "review decision"]),
    localeNotes: {
      en: "Use this as a low-friction entry point when the learner is tired or unsure where to start.",
      fa: "براي شروع آسان وقتي زبان آموز خسته است يا نمي داند از كجا شروع كند.",
    },
  };
}

function buildPronunciationMaterial(booklet: EvaBooklet, chapter: EvaBookletChapter, index: number): EvaMaterialItem {
  const page = firstChapterPage(booklet, chapter, pronunciationTypes);
  const term = chapterTerms[index % chapterTerms.length];

  return {
    id: `source-${chapter.id}-pronunciation-card`,
    track: "pronunciation",
    exam: "EduPocket",
    skill: "pronunciation",
    title: `${term.term} / ${term.focus}`,
    level: index % 2 === 0 ? "B1" : "B2",
    timeLimitMinutes: 6,
    summary: `A chapter-linked stress and shadowing card for ${chapter.shortTitle}.`,
    sourceUse: `Pairs with page ${page.page}: ${page.title}.`,
    sourceTypeTargets: unique([page.type, ...pronunciationTypes]),
    ttsScript: `${term.term}. ${term.focus}. ${term.cue}. In ${chapter.shortTitle}, use this word inside one clear sentence and repeat it until the stress feels stable.`,
    questions: [],
    routine: [
      "Listen to the word.",
      "Mark the stressed syllable.",
      "Repeat the full sentence three times.",
      "Write one source-page sentence using the word naturally.",
    ],
    rubric: ["word stress", "clear vowels", "sentence transfer", "shadowing repeat"],
    tags: sourceTags(chapter, page, ["pronunciation", "stress", term.term, "shadowing"]),
    localeNotes: {
      en: "Use this when a chapter needs a sound-level checkpoint before writing or review.",
      fa: "براي وقتي كه يك فصل قبل از نوشتن يا مرور، يك ايستگاه تلفظ و ريتم لازم دارد.",
    },
  };
}

function buildTeacherMaterial(booklet: EvaBooklet, chapter: EvaBookletChapter, index: number): EvaMaterialItem {
  const page = firstChapterPage(booklet, chapter, ["progress", "chapter-quiz", "reading-lab-rc", "grammar-practice", "translation"]);

  return {
    id: `source-${chapter.id}-teacher-checkpoint`,
    track: "teacher",
    exam: "EduPocket",
    skill: "teacher-feedback",
    title: `${chapter.shortTitle}: teacher checkpoint`,
    level: index % 2 === 0 ? "B1" : "B2",
    timeLimitMinutes: 7,
    summary: `A reusable Ali feedback prompt for checking chapter evidence, weak skills, and next assignment.`,
    sourceUse: `Designed for Teacher Lens after page ${page.page}: ${page.title}.`,
    sourceTypeTargets: unique([page.type, "progress", "chapter-quiz"]),
    prompt:
      `Feedback template: In ${chapter.shortTitle}, your strongest evidence is ______. The weak point I want you to review is ______. Before the next session, complete one source page, one material pack, and one saved sentence that shows the correction.`,
    questions: [],
    routine: [
      "Check the learner's latest draft or answer.",
      "Name one strength and one weak skill.",
      "Assign one source page plus one material pack.",
      "Add a teacher note that can be reviewed later.",
    ],
    rubric: ["evidence named", "weak skill named", "next task assigned", "reviewable note"],
    tags: sourceTags(chapter, page, ["teacher lens", "premium member", "feedback", "assignment"]),
    localeNotes: {
      en: "Use this to keep feedback specific and chapter-linked instead of vague encouragement.",
      fa: "براي اينكه بازخورد دقيق، متصل به فصل و قابل پيگيري بماند.",
    },
  };
}

export function buildEvaSourceMaterialItems(booklet: EvaBooklet): EvaMaterialItem[] {
  return booklet.chapters.flatMap((chapter, index) => [
    buildReadingMaterial(booklet, chapter, index),
    buildWritingMaterial(booklet, chapter, index),
    buildListeningMaterial(booklet, chapter, index),
    buildPronunciationMaterial(booklet, chapter, index),
    buildTeacherMaterial(booklet, chapter, index),
  ]);
}

export function extendEvaMaterialCollections<TCollection extends MaterialCollection>(
  baseCollections: TCollection[],
  sourceItems: EvaMaterialItem[],
) {
  return baseCollections.map((collection) => ({
    ...collection,
    description: `${collection.description} Includes source-linked chapter packs from the full Eva booklet.`,
    items: [...collection.items, ...sourceItems.filter((item) => item.track === collection.id)],
  }));
}

export function buildEvaMaterialStats(items: EvaMaterialItem[], collections = 5) {
  return {
    collections,
    items: items.length,
    readingQuestions: items.filter((item) => item.track === "reading").reduce((total, item) => total + item.questions.length, 0),
    listeningQuestions: items.filter((item) => item.track === "listening").reduce((total, item) => total + item.questions.length, 0),
    ttsScripts: items.filter((item) => item.ttsScript || item.passage).length,
    writingPrompts: items.filter((item) => item.track === "writing").length,
    pronunciationDrills: items.filter((item) => item.track === "pronunciation").length,
    teacherTemplates: items.filter((item) => item.track === "teacher").length,
  };
}

export function buildEvaSupplementalExamTasksFromMaterials(materials: EvaMaterialItem[]) {
  return materials
    .filter((material) => material.track === "reading" || material.track === "writing")
    .map((material) => ({
      id: `source-exam-${material.id}`,
      exam: material.exam === "TOEFL" ? "TOEFL" : "IELTS",
      skill: material.skill === "writing" ? "writing" : "reading",
      title: material.title,
      level: material.level,
      timeLimitMinutes: material.timeLimitMinutes,
      passage: material.passage,
      prompt: material.prompt ?? material.summary,
      rubric: material.rubric,
      questions: material.questions,
    }));
}
