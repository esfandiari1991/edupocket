import fs from "node:fs";
import path from "node:path";

const args = new Map();
for (let index = 2; index < process.argv.length; index += 2) {
  args.set(process.argv[index], process.argv[index + 1]);
}

const htmlPath = args.get("--html");
const sourcePath = args.get("--source");
const qaPath = args.get("--qa");
const pdfQaPath = args.get("--pdf-qa");
const outputPath = args.get("--output") ?? path.join(process.cwd(), "src/lib/eva-booklet.generated.json");

if (!htmlPath || !sourcePath) {
  console.error("Usage: node scripts/import-eva-booklet.mjs --html <workbook.html> --source <build-source.mjs> [--qa <qa.json>] [--pdf-qa <pdf-qa.json>] [--output <json>]");
  process.exit(1);
}

function readJson(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return {};
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function decodeEntities(value) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(Number.parseInt(code, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripTags(value) {
  return decodeEntities(
    value
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<textarea[^>]*><\/textarea>/gi, "\n[answer field]\n")
      .replace(/<input[^>]*type=["']checkbox["'][^>]*>/gi, " [checkbox] ")
      .replace(/<img\b[^>]*alt=["']([^"']*)["'][^>]*>/gi, (_, alt) => (alt ? ` ${alt} ` : " "))
      .replace(/<\/(h[1-6]|p|article|section|div|li|blockquote|label|aside|figure|figcaption)>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\s+\n/g, "\n")
    .replace(/\n\s+/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function textBlocksFromHtml(value) {
  const raw = stripTags(value);
  return raw
    .split(/\n+/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line.length > 1);
}

function headingsFromHtml(value) {
  const headings = [];
  const headingRegex = /<h([1-3])[^>]*>([\s\S]*?)<\/h\1>/gi;
  let match;
  while ((match = headingRegex.exec(value))) {
    const text = stripTags(match[2]).replace(/\s+/g, " ").trim();
    if (text) headings.push(text);
  }
  return headings;
}

function extractPageBody(sectionHtml) {
  const marker = '<div class="page-body">';
  const markerIndex = sectionHtml.indexOf(marker);
  if (markerIndex === -1) return sectionHtml;

  const start = markerIndex + marker.length;
  const divRegex = /<\/?div\b[^>]*>/gi;
  divRegex.lastIndex = start;
  let depth = 1;
  let match;

  while ((match = divRegex.exec(sectionHtml))) {
    if (match[0].startsWith("</")) depth -= 1;
    else depth += 1;

    if (depth === 0) return sectionHtml.slice(start, match.index);
  }

  return sectionHtml.slice(start);
}

function extractSectionPlan(source) {
  const match = source.match(/const sectionPlan = \[([\s\S]*?)\n\];/);
  if (!match) throw new Error("Could not find sectionPlan in workbook source.");

  return Function(`${match[0]}; return sectionPlan;`)().map((chapter, index) => ({
    id: slugify(chapter.title.replace(/^Chapter\s+\d+:\s*/i, "")),
    number: String(index + 1).padStart(2, "0"),
    label: chapter.chapter,
    title: chapter.title,
    shortTitle: chapter.title.replace(/^Chapter\s+\d+:\s*/i, ""),
    start: chapter.start,
    end: chapter.end,
    accent: chapter.accent,
    inside: chapter.inside,
    outcome: chapter.outcome,
    tocOutcome: chapter.tocOutcome,
    tocUse: chapter.tocUse,
    useWhen: chapter.useWhen,
    time: chapter.time,
    mode: chapter.mode,
    skills: chapter.skills,
  }));
}

function classifySkills(type, chapter, text) {
  const haystack = `${type} ${chapter.skills.join(" ")} ${text}`.toLowerCase();
  const rules = [
    ["Vocabulary", /(vocab|lexis|word|collocation|glossary|term|definition)/],
    ["Grammar", /(grammar|tense|preposition|modal|connector|relative clause|article|passive|reported speech)/],
    ["Reading", /(reading|rc|comprehension|main idea|inference|passage|exegesis)/],
    ["Writing", /(write|writing|paragraph|journal|portfolio|answer field|sentence|draft)/],
    ["Translation", /(translation|translate|chinese|english|equivalence|back-translation)/],
    ["Listening", /(listening|sermon|notes|hear|audio)/],
    ["Speaking Solo", /(speaking|speak|role-play|conversation|prayer|testimony|spoken|small group)/],
    ["Ministry", /(ministry|church|bible|scripture|prayer|service|pastoral|xiamen)/],
    ["IELTS/TOEFL Style", /(ielts|toefl|b2-c1|c1|academic|question|task)/],
  ];

  return rules.filter(([, pattern]) => pattern.test(haystack)).map(([label]) => label);
}

function classifyLevels(text) {
  const levels = [];
  if (/\bsupported\b/i.test(text)) levels.push("Supported");
  if (/\bindependent\b/i.test(text)) levels.push("Independent");
  if (/\bchalleng(?:e|ing)\b/i.test(text)) levels.push("Challenging");
  if (/\bcritical thinking\b/i.test(text)) levels.push("Critical Thinking");
  if (/\bportfolio\b/i.test(text)) levels.push("Portfolio");
  return levels;
}

function chapterForPage(chapters, page) {
  const chapter = chapters.find((item) => page >= item.start && page <= item.end);
  if (!chapter) throw new Error(`No chapter found for page ${page}.`);
  return chapter;
}

function buildStacks(chapters) {
  return [
    {
      id: "foundation",
      title: "Foundation & Calling",
      description: "Identity, purpose, method, first Bible study, and the learning rhythm.",
      chapterIds: [chapters[0].id],
      primarySkills: ["Orientation", "Prayer", "Bible"],
    },
    {
      id: "language-accuracy",
      title: "Language Accuracy Core",
      description: "Vocabulary, collocations, grammar forms, sentence control, and Bible verse practice.",
      chapterIds: [chapters[1].id, chapters[2].id, chapters[3].id],
      primarySkills: ["Vocabulary", "Grammar", "Accuracy"],
    },
    {
      id: "reading-translation",
      title: "Reading & Translation Labs",
      description: "Deep reading, exegesis, translation decisions, RC practice, and meaning transfer.",
      chapterIds: [chapters[5].id, chapters[6].id, chapters[10].id],
      primarySkills: ["Reading", "Translation", "Exegesis"],
    },
    {
      id: "real-service-output",
      title: "Real-Service Output",
      description: "Listening notes, solo speaking rehearsal, Xiamen scenarios, visual prompts, and church language.",
      chapterIds: [chapters[4].id, chapters[7].id, chapters[9].id],
      primarySkills: ["Listening", "Speaking Solo", "Scenario"],
    },
    {
      id: "growth-capstone",
      title: "Growth & Capstone",
      description: "Progress tracking, portfolio evidence, chapter mastery labs, quizzes, and final output.",
      chapterIds: [chapters[8].id, chapters[11].id],
      primarySkills: ["Journal", "Portfolio", "Mastery"],
    },
  ];
}

const html = fs.readFileSync(htmlPath, "utf8");
const source = fs.readFileSync(sourcePath, "utf8");
const qa = readJson(qaPath);
const pdfQa = readJson(pdfQaPath);
const chapters = extractSectionPlan(source);

const pageRegex = /<section id="page-(\d{3})"([\s\S]*?)(?=<section id="page-\d{3}"|<\/body>)/g;
const pages = [];
let match;

while ((match = pageRegex.exec(html))) {
  const page = Number(match[1]);
  const sectionHtml = `<section id="page-${match[1]}"${match[2]}`;
  const bodyHtml = extractPageBody(sectionHtml);
  const blocks = textBlocksFromHtml(bodyHtml);
  const headings = headingsFromHtml(bodyHtml);
  const classMatch = sectionHtml.match(/class="([^"]+)"/);
  const type = classMatch?.[1].split(/\s+/).find((item) => item.startsWith("type-"))?.replace("type-", "") ?? "lesson";
  const chapter = chapterForPage(chapters, page);
  const text = blocks.join(" ");
  const skillTags = Array.from(new Set([...chapter.skills.map((skill) => skill.replace(/\bRC\b/g, "Reading")), ...classifySkills(type, chapter, text)]));
  const levelTags = classifyLevels(text);
  const fieldCount = (bodyHtml.match(/<textarea\b/gi) ?? []).length + (bodyHtml.match(/<input\b(?![^>]*type=["']checkbox["'])/gi) ?? []).length;
  const checkboxCount = (bodyHtml.match(/<input\b[^>]*type=["']checkbox["'][^>]*>/gi) ?? []).length;
  const title = headings[0] ?? chapter.shortTitle;
  const subtitle = headings.find((heading) => heading !== title) ?? "";
  const summary = blocks.find((block) => block !== title && block !== subtitle && block.length > 35) ?? chapter.tocOutcome;

  pages.push({
    id: `p${String(page).padStart(3, "0")}`,
    page,
    chapterId: chapter.id,
    chapterNumber: chapter.number,
    chapterTitle: chapter.shortTitle,
    title,
    subtitle,
    type,
    skillTags,
    levelTags,
    fieldCount,
    checkboxCount,
    wordCount: text.split(/\s+/).filter(Boolean).length,
    summary,
    blocks,
  });
}

if (pages.length !== 298) {
  throw new Error(`Expected 298 pages but imported ${pages.length}.`);
}

const pageCountsByChapter = new Map();
for (const page of pages) {
  const current = pageCountsByChapter.get(page.chapterId) ?? {
    pageCount: 0,
    fieldCount: 0,
    checkboxCount: 0,
    wordCount: 0,
    skillTags: new Set(),
    levelTags: new Set(),
  };
  current.pageCount += 1;
  current.fieldCount += page.fieldCount;
  current.checkboxCount += page.checkboxCount;
  current.wordCount += page.wordCount;
  page.skillTags.forEach((tag) => current.skillTags.add(tag));
  page.levelTags.forEach((tag) => current.levelTags.add(tag));
  pageCountsByChapter.set(page.chapterId, current);
}

const enrichedChapters = chapters.map((chapter) => {
  const counts = pageCountsByChapter.get(chapter.id);
  return {
    ...chapter,
    pageIds: pages.filter((page) => page.chapterId === chapter.id).map((page) => page.id),
    pageCount: counts?.pageCount ?? 0,
    fieldCount: counts?.fieldCount ?? 0,
    checkboxCount: counts?.checkboxCount ?? 0,
    wordCount: counts?.wordCount ?? 0,
    skillTags: Array.from(counts?.skillTags ?? []),
    levelTags: Array.from(counts?.levelTags ?? []),
  };
});

const result = {
  importedAt: new Date().toISOString(),
  source: {
    title: "Eva Digital Booklet",
    basis: "Final local Eva workbook HTML generated from the workbook source.",
    privacy: "Private server-side content. Do not move this generated data into public assets.",
  },
  stats: {
    pages: pages.length,
    chapters: enrichedChapters.length,
    answerFields: qa.interactiveStudentMode?.answerFields ?? pages.reduce((sum, page) => sum + page.fieldCount, 0),
    checkboxes: qa.contentCoverage?.checkboxes ?? pages.reduce((sum, page) => sum + page.checkboxCount, 0),
    vocabularyCards: qa.contentCoverage?.vocabularyCards ?? null,
    namedChapterCount: qa.contentCoverage?.namedChapterCount ?? enrichedChapters.length,
    readingLabs: qa.contentCoverage?.chapterReadingLabs ?? null,
    enrichmentPages: qa.contentCoverage?.enrichmentPages ?? null,
    languageLabs: qa.contentCoverage?.chapterLanguageLabCount ?? null,
    pdfPages: pdfQa.textLayer?.pdfPages ?? qa.pdfPages ?? null,
    textCharacters: pdfQa.textLayer?.totalCharacters ?? null,
  },
  stacks: buildStacks(enrichedChapters),
  chapters: enrichedChapters,
  pages,
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);

console.log(`Imported ${pages.length} Eva booklet pages into ${outputPath}`);
