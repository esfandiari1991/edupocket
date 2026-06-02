import "server-only";

export type EvaChapter = {
  id: string;
  number: string;
  title: string;
  faTitle: string;
  focus: string;
  level: string;
  reading: {
    title: string;
    text: string;
    source: string;
    questions: {
      prompt: string;
      options: string[];
      answer: number;
    }[];
  };
  writing: {
    task: string;
    checklist: string[];
  };
  vocabulary: string[];
};

export const evaChapters: EvaChapter[] = [
  {
    id: "foundations",
    number: "01",
    title: "Foundations of Academic Reading",
    faTitle: "پایه های ریدینگ آکادمیک",
    focus: "Main idea, purpose, and paragraph control",
    level: "B1-B2",
    reading: {
      title: "Why focused reading changes exam performance",
      text:
        "A strong reader does not try to understand every word at the same speed. She first identifies the purpose of the paragraph, then separates the main claim from examples, numbers, and supporting details. This habit saves time in exams because the reader knows where each answer is likely to hide. In IELTS and TOEFL-style tasks, speed usually comes from structure, not from rushing.",
      source: "Original EduPocket passage.",
      questions: [
        {
          prompt: "What is the main idea of the passage?",
          options: ["Readers should translate every word.", "Reading speed improves when structure is clear.", "Exam questions are mostly about numbers."],
          answer: 1,
        },
        {
          prompt: "According to the passage, where does speed come from?",
          options: ["Rushing through the text", "Skipping examples permanently", "Understanding paragraph structure"],
          answer: 2,
        },
      ],
    },
    writing: {
      task: "Write 90-120 words explaining one reading habit that would help a student in IELTS or TOEFL preparation.",
      checklist: ["Clear topic sentence", "One practical example", "Accurate connectors", "Final learning action"],
    },
    vocabulary: ["claim", "supporting detail", "purpose", "structure", "identify"],
  },
  {
    id: "detail-inference",
    number: "02",
    title: "Detail and Inference Lab",
    faTitle: "لابراتوار جزئیات و استنباط",
    focus: "Evidence, implied meaning, and answer traps",
    level: "B2",
    reading: {
      title: "Clean energy and careful conclusions",
      text:
        "The shift toward clean energy is accelerating worldwide. Governments, industries, and individuals are investing in solar, wind, and storage technologies. However, this transition does not remove every problem immediately. It creates new questions about supply chains, local jobs, and long-term maintenance. A careful reader should notice both the benefit and the limitation before choosing an answer.",
      source: "Original EduPocket passage.",
      questions: [
        {
          prompt: "Which answer best matches the writer's view?",
          options: ["Clean energy is useless.", "Clean energy has benefits but also new challenges.", "Only governments can use clean energy."],
          answer: 1,
        },
        {
          prompt: "What can be inferred from the final sentence?",
          options: ["Balanced answers are often stronger.", "Limitations should always be ignored.", "Maintenance is the only issue."],
          answer: 0,
        },
      ],
    },
    writing: {
      task: "Write a balanced opinion paragraph about whether governments should invest more in renewable energy.",
      checklist: ["Position is clear", "Two sides are acknowledged", "One precise example", "No overgeneralization"],
    },
    vocabulary: ["accelerate", "transition", "supply chain", "maintenance", "limitation"],
  },
  {
    id: "vocabulary-context",
    number: "03",
    title: "Vocabulary in Context",
    faTitle: "واژگان در متن",
    focus: "Meaning from sentence logic",
    level: "B2-C1",
    reading: {
      title: "Learning words through pressure",
      text:
        "Memorizing a list can help at the beginning, but durable vocabulary usually grows when a learner meets a word inside pressure: a paragraph, a question, a deadline, or a real message. Context forces the mind to choose a meaning, test it, and revise it. This is why strong learners record not only translations, but also the sentence that made the word useful.",
      source: "Original EduPocket passage.",
      questions: [
        {
          prompt: "In the passage, what does durable vocabulary mean?",
          options: ["Words that stay usable", "Words that are impossible to translate", "Words from casual speech only"],
          answer: 0,
        },
        {
          prompt: "Why should learners record sentences?",
          options: ["Sentences replace grammar completely.", "Sentences show why a word is useful.", "Sentences make lists shorter."],
          answer: 1,
        },
      ],
    },
    writing: {
      task: "Choose three words from this chapter and write one useful exam-style sentence for each.",
      checklist: ["Meaning is natural", "Sentence has context", "Grammar is controlled", "Word is reusable"],
    },
    vocabulary: ["durable", "context", "revise", "record", "useful"],
  },
  {
    id: "writing-task-one",
    number: "04",
    title: "IELTS Writing Task 1 Control",
    faTitle: "کنترل رایتینگ تسک ۱",
    focus: "Overview, comparison, and data language",
    level: "B2",
    reading: {
      title: "What an overview must do",
      text:
        "An overview is not a list of every number. It is a short explanation of the biggest movement, contrast, or pattern in the visual information. If a chart shows five categories, the overview should help the reader understand the story before the details arrive. A weak overview describes isolated facts; a strong overview groups information and gives direction.",
      source: "Original EduPocket passage.",
      questions: [
        {
          prompt: "What should a strong overview do?",
          options: ["List every number", "Group information and show direction", "Avoid comparison"],
          answer: 1,
        },
      ],
    },
    writing: {
      task: "Write a Task 1 overview for an imaginary chart showing online learning growth from 2020 to 2026.",
      checklist: ["No unnecessary numbers", "Clear trend", "At least one comparison", "Formal tone"],
    },
    vocabulary: ["overview", "contrast", "pattern", "category", "trend"],
  },
  {
    id: "opinion-writing",
    number: "05",
    title: "IELTS/TOEFL Opinion Writing",
    faTitle: "رایتینگ نظری آیلتس و تافل",
    focus: "Position, support, and academic coherence",
    level: "B2-C1",
    reading: {
      title: "The difference between opinion and argument",
      text:
        "An opinion becomes an argument when it is supported by a reason, tested against a possible objection, and connected to a real consequence. Many learners repeat their position several times, but repetition is not development. A developed paragraph moves forward: claim, reason, evidence, and result. This movement makes the reader feel guided rather than pushed.",
      source: "Original EduPocket passage.",
      questions: [
        {
          prompt: "What turns an opinion into an argument?",
          options: ["A louder conclusion", "Reason, objection, and consequence", "Repeating the same position"],
          answer: 1,
        },
      ],
    },
    writing: {
      task: "Write one developed body paragraph about whether students should use AI tools while learning English.",
      checklist: ["Claim", "Reason", "Evidence or example", "Result sentence"],
    },
    vocabulary: ["argument", "objection", "consequence", "developed", "guided"],
  },
  {
    id: "review-portfolio",
    number: "06",
    title: "Review and Portfolio",
    faTitle: "مرور و پورتفولیو",
    focus: "Weekly reflection and next-step planning",
    level: "B1-C1",
    reading: {
      title: "Why a portfolio beats a folder",
      text:
        "A folder stores work, but a portfolio shows growth. It contains selected answers, teacher notes, revised paragraphs, vocabulary examples, and a short reflection about what changed. This matters because progress in language learning is often invisible from one day to the next. A portfolio makes improvement visible enough to guide the next week.",
      source: "Original EduPocket passage.",
      questions: [
        {
          prompt: "Why is a portfolio useful?",
          options: ["It hides mistakes.", "It makes improvement visible.", "It removes the need for revision."],
          answer: 1,
        },
      ],
    },
    writing: {
      task: "Write a weekly reflection: what improved, what still feels weak, and what you will practice next.",
      checklist: ["One improvement", "One weakness", "One next action", "Specific language goal"],
    },
    vocabulary: ["portfolio", "reflection", "selected", "visible", "revision"],
  },
];

