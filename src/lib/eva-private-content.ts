import "server-only";

export type EvaChapter = {
  id: string;
  number: string;
  title: string;
  faTitle: string;
  track: string;
  focus: string;
  level: string;
  time: string;
  outcome: string;
  useCase: string;
  studyMode: string;
  artifact: string;
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
  practiceLadder: {
    level: string;
    title: string;
    prompt: string;
  }[];
  microTasks: string[];
  vocabulary: string[];
};

export const evaChapters: EvaChapter[] = [
  {
    id: "calling-compass",
    number: "01",
    title: "The Calling Compass",
    faTitle: "قطب نمای مسیر یادگیری",
    track: "Orientation",
    focus: "Identity, rhythm, and first learning evidence",
    level: "B1-B2",
    time: "25 min",
    outcome: "Define why English matters and choose the next faithful study step.",
    useCase: "Start, reset, or recover motivation before deeper work.",
    studyMode: "Read, reflect, write",
    artifact: "A one-paragraph learning purpose statement",
    reading: {
      title: "Why a learning compass matters",
      text:
        "A strong learner does not begin with random effort. She first names the reason for learning, then connects that reason to a visible action: one paragraph, one corrected sentence, one useful word, or one spoken line. When the goal is visible, practice becomes easier to return to. A compass does not finish the journey, but it keeps the next step honest.",
      source: "Original EduPocket passage.",
      questions: [
        {
          prompt: "What is the main idea of the passage?",
          options: ["Random effort is enough.", "A visible goal makes practice easier to repeat.", "A compass replaces practice."],
          answer: 1,
        },
        {
          prompt: "Which example counts as learning evidence?",
          options: ["A corrected sentence", "Only a long plan", "A vague intention"],
          answer: 0,
        },
      ],
    },
    writing: {
      task: "Write 90-120 words explaining why this booklet matters and what one visible result you want by the end of the week.",
      checklist: ["Clear purpose", "One visible result", "One next action", "No vague promise"],
    },
    practiceLadder: [
      { level: "Supported", title: "Name the reason", prompt: "Complete: I am learning English because..." },
      { level: "Independent", title: "Choose evidence", prompt: "Choose one result you can show after this week." },
      { level: "Challenge", title: "Make it measurable", prompt: "Turn the result into a tiny weekly promise." },
    ],
    microTasks: ["Read the passage once for main idea.", "Write the purpose statement.", "Export the note as the first portfolio entry."],
    vocabulary: ["calling", "evidence", "rhythm", "purpose", "visible result"],
  },
  {
    id: "church-lexicon",
    number: "02",
    title: "The Church Lexicon",
    faTitle: "واژگان دقیق کلیسایی",
    track: "Vocabulary",
    focus: "Precise terms, collocations, and sentence use",
    level: "B2",
    time: "35 min",
    outcome: "Use key ministry words in clear, natural sentences.",
    useCase: "When exact vocabulary is blocking reading or writing.",
    studyMode: "Vocabulary, sentence craft",
    artifact: "A 10-word personal ministry glossary",
    reading: {
      title: "Why exact words create trust",
      text:
        "In serious communication, a word is more than a translation. It carries tone, context, and responsibility. A learner who knows only the dictionary meaning may sound correct but still feel unclear. A learner who studies collocations, example sentences, and audience expectations can choose words that serve the message instead of distracting from it.",
      source: "Original EduPocket passage.",
      questions: [
        {
          prompt: "Which answer best matches the writer's view?",
          options: ["Dictionary meaning is always enough.", "Words also carry tone and context.", "Serious words should never be practiced."],
          answer: 1,
        },
        {
          prompt: "What should a learner study with a new term?",
          options: ["Collocations and example sentences", "Only spelling", "Only the first translation"],
          answer: 0,
        },
      ],
    },
    writing: {
      task: "Write five natural sentences using five vocabulary items from the vault. Each sentence should sound usable, not copied from a dictionary.",
      checklist: ["Natural collocation", "Clear context", "Correct grammar", "Useful for real communication"],
    },
    practiceLadder: [
      { level: "Supported", title: "Sort the terms", prompt: "Group words into belief, service, communication, and action." },
      { level: "Independent", title: "Build sentences", prompt: "Write one sentence for each term with a real situation." },
      { level: "Challenge", title: "Explain gently", prompt: "Explain one term to a new learner in simple English." },
    ],
    microTasks: ["Pick five words.", "Write five sentences.", "Mark the two that sound most natural."],
    vocabulary: ["covenant", "grace", "service", "testimony", "encouragement"],
  },
  {
    id: "grammar-of-calling",
    number: "03",
    title: "The Grammar of Calling",
    faTitle: "گرامر برای بیان هدف",
    track: "Grammar",
    focus: "Form, meaning, examples, and controlled practice",
    level: "B1-B2",
    time: "40 min",
    outcome: "Use core grammar to describe purpose, habit, and growth.",
    useCase: "When the idea is clear but the sentence is unstable.",
    studyMode: "Notice, control, use",
    artifact: "A corrected grammar mini-page",
    reading: {
      title: "Accuracy that serves meaning",
      text:
        "Grammar becomes useful when it helps a learner say something that matters. A tense, connector, or modal verb should not stay as a rule on a page. It should help the writer show time, reason, confidence, or responsibility. The strongest grammar practice moves from noticing the form to using it in a sentence that belongs to the learner.",
      source: "Original EduPocket passage.",
      questions: [
        {
          prompt: "What makes grammar useful?",
          options: ["It helps express meaning.", "It stays only as a rule.", "It replaces vocabulary."],
          answer: 0,
        },
        {
          prompt: "What should grammar practice move toward?",
          options: ["A memorized label only", "A sentence that belongs to the learner", "Avoiding all connectors"],
          answer: 1,
        },
      ],
    },
    writing: {
      task: "Write six sentences about your learning purpose: two present habits, two future goals, and two reasons.",
      checklist: ["Correct tense", "Clear connector", "One modal verb", "Meaning is personal"],
    },
    practiceLadder: [
      { level: "Supported", title: "Notice", prompt: "Underline the verb form and connector in three model sentences." },
      { level: "Independent", title: "Control", prompt: "Rewrite three weak sentences with stronger grammar." },
      { level: "Challenge", title: "Use", prompt: "Write a short paragraph using two modals and two connectors." },
    ],
    microTasks: ["Notice form.", "Rewrite weak sentences.", "Save the corrected mini-page."],
    vocabulary: ["purpose", "habit", "because", "therefore", "should"],
  },
  {
    id: "prayer-connection-grammar",
    number: "04",
    title: "The Grammar of Prayer and Connection",
    faTitle: "گرامر دعا و ارتباط",
    track: "Grammar",
    focus: "Tone, precision, and connective language",
    level: "B2",
    time: "40 min",
    outcome: "Write careful, respectful sentences with stronger transitions.",
    useCase: "When the sentence is emotionally important and needs precision.",
    studyMode: "Tone, transition, revise",
    artifact: "A revised encouragement paragraph",
    reading: {
      title: "Gentle language still needs structure",
      text:
        "Warm language can become unclear if it has no structure. A careful writer uses transitions to show why one idea follows another, and she uses modal verbs to avoid sounding too forceful. In sensitive communication, grammar is not cold. It protects the tone of the message and helps kindness become understandable.",
      source: "Original EduPocket passage.",
      questions: [
        {
          prompt: "What is one role of grammar in sensitive communication?",
          options: ["To protect tone", "To remove kindness", "To make every sentence longer"],
          answer: 0,
        },
      ],
    },
    writing: {
      task: "Write 100-130 words of encouragement to a learner who feels tired. Use at least three transitions and two modal verbs.",
      checklist: ["Gentle tone", "Useful transitions", "Modal verbs are natural", "No pressure language"],
    },
    practiceLadder: [
      { level: "Supported", title: "Choose tone", prompt: "Replace forceful phrases with gentle alternatives." },
      { level: "Independent", title: "Connect ideas", prompt: "Add transitions between four short sentences." },
      { level: "Challenge", title: "Revise voice", prompt: "Make the paragraph warmer without making it vague." },
    ],
    microTasks: ["Read for tone.", "Revise transitions.", "Export the final encouragement paragraph."],
    vocabulary: ["encouragement", "therefore", "however", "may", "could"],
  },
  {
    id: "listening-chapel",
    number: "05",
    title: "The Listening Chapel",
    faTitle: "تمرین شنیدن و یادداشت برداری",
    track: "Listening",
    focus: "Sermon notes, key ideas, and solo speaking rehearsal",
    level: "B2",
    time: "30 min",
    outcome: "Turn listening notes into a short written summary.",
    useCase: "When listening creates scattered notes but no clear output.",
    studyMode: "Listen, summarize, rehearse",
    artifact: "A 5-sentence listening summary",
    reading: {
      title: "Notes are not the final product",
      text:
        "Listening practice becomes powerful when the learner turns sound into structure. A note can capture a word, but a summary must show relationships: main idea, support, example, and response. This chapter keeps speaking as solo rehearsal only; live pronunciation and feedback remain a separate 1:1 add-on.",
      source: "Original EduPocket passage.",
      questions: [
        {
          prompt: "What should a summary show?",
          options: ["Only isolated words", "Main idea and relationships", "No response"],
          answer: 1,
        },
      ],
    },
    writing: {
      task: "Write five sentences from a listening note: main idea, two supporting points, one useful phrase, and one personal response.",
      checklist: ["Main idea is clear", "Support is organized", "Phrase is reusable", "Speaking marked as solo rehearsal"],
    },
    practiceLadder: [
      { level: "Supported", title: "Catch keywords", prompt: "Write five words that carry the message." },
      { level: "Independent", title: "Build summary", prompt: "Turn the words into five clear sentences." },
      { level: "Challenge", title: "Rehearse aloud", prompt: "Read the summary twice and mark one pronunciation question for 1:1." },
    ],
    microTasks: ["Catch keywords.", "Write a five-sentence summary.", "Mark one speaking question for the add-on."],
    vocabulary: ["summary", "support", "response", "rehearsal", "feedback"],
  },
  {
    id: "translation-workshop",
    number: "06",
    title: "The Translation Workshop",
    faTitle: "کارگاه ترجمه",
    track: "Translation",
    focus: "Meaning, tone, audience, and cultural fit",
    level: "B2-C1",
    time: "45 min",
    outcome: "Compare literal and natural translation choices before writing.",
    useCase: "When a sentence is understandable but not yet natural.",
    studyMode: "Compare, choose, justify",
    artifact: "A translation note with reasons",
    reading: {
      title: "Translation is a decision trail",
      text:
        "A good translation is not only a final sentence. It is a trail of decisions about meaning, tone, audience, and naturalness. The translator asks what must stay exact, what can become more natural, and what a reader might misunderstand. This process turns translation from guessing into careful explanation.",
      source: "Original EduPocket passage.",
      questions: [
        {
          prompt: "What is a good translation according to the passage?",
          options: ["Only a final sentence", "A trail of decisions", "A random paraphrase"],
          answer: 1,
        },
        {
          prompt: "What should a translator consider?",
          options: ["Meaning, tone, audience, and naturalness", "Only word count", "Only speed"],
          answer: 0,
        },
      ],
    },
    writing: {
      task: "Write a translation note explaining one sentence choice: exact meaning, natural wording, and possible misunderstanding.",
      checklist: ["Meaning preserved", "Tone explained", "Audience considered", "Choice justified"],
    },
    practiceLadder: [
      { level: "Supported", title: "Literal first", prompt: "Write the literal meaning in simple English." },
      { level: "Independent", title: "Natural next", prompt: "Rewrite it for a real reader." },
      { level: "Challenge", title: "Justify", prompt: "Explain why your final choice is better." },
    ],
    microTasks: ["Draft literal meaning.", "Rewrite naturally.", "Export the decision note."],
    vocabulary: ["literal", "naturalness", "audience", "misunderstanding", "justify"],
  },
  {
    id: "exegesis-path",
    number: "07",
    title: "The Exegesis Path",
    faTitle: "مسیر تحلیل متن",
    track: "Reading",
    focus: "Observe, interpret, apply, and explain",
    level: "B2-C1",
    time: "45 min",
    outcome: "Move from details to a responsible interpretation.",
    useCase: "When reading needs depth, not just quick answers.",
    studyMode: "Read, infer, apply",
    artifact: "A four-step reading note",
    reading: {
      title: "Deep reading moves in order",
      text:
        "A deep reader does not jump from a sentence to a personal conclusion immediately. She first observes repeated words and contrasts, then interprets how the ideas connect, then applies the message carefully. This order matters because a quick reaction can feel sincere while still missing the structure of the text.",
      source: "Original EduPocket passage.",
      questions: [
        {
          prompt: "What should come before application?",
          options: ["Observation and interpretation", "A quick reaction only", "Ignoring repeated words"],
          answer: 0,
        },
      ],
    },
    writing: {
      task: "Write a four-step note: observe, interpret, apply, and explain one sentence to another learner.",
      checklist: ["Observation first", "Interpretation connected", "Application careful", "Explanation simple"],
    },
    practiceLadder: [
      { level: "Supported", title: "Observe", prompt: "List repeated words and contrasts." },
      { level: "Independent", title: "Interpret", prompt: "Explain how the ideas connect." },
      { level: "Challenge", title: "Teach", prompt: "Write a simple explanation for another learner." },
    ],
    microTasks: ["Mark repeated words.", "Write the four-step note.", "Save the teaching sentence."],
    vocabulary: ["observe", "interpret", "apply", "contrast", "structure"],
  },
  {
    id: "xiamen-mission-lab",
    number: "08",
    title: "The Xiamen Mission Lab",
    faTitle: "لابراتوار ماموریت شیامن",
    track: "Scenario",
    focus: "Real conversations, logistics, care, and clear writing",
    level: "B2",
    time: "35 min",
    outcome: "Prepare useful language for a real-world travel or service scenario.",
    useCase: "When English must work outside the classroom.",
    studyMode: "Scenario, phrase bank, write",
    artifact: "A scenario response card",
    reading: {
      title: "Scenario practice reduces hesitation",
      text:
        "A learner often knows more English than she can use under pressure. Scenario practice lowers that pressure by rehearsing the situation before it arrives. Travel, payment, welcome, care, and follow-up conversations become easier when the learner has already chosen the first sentence.",
      source: "Original EduPocket passage.",
      questions: [
        {
          prompt: "Why does scenario practice help?",
          options: ["It removes every problem.", "It rehearses pressure before the situation arrives.", "It avoids real conversation forever."],
          answer: 1,
        },
      ],
    },
    writing: {
      task: "Write a response card for one scenario: greeting, question, clarification, and closing sentence.",
      checklist: ["Greeting is natural", "Question is clear", "Clarification is polite", "Closing sentence helps"],
    },
    practiceLadder: [
      { level: "Supported", title: "Choose scenario", prompt: "Pick one: travel, payment, welcome, care, or follow-up." },
      { level: "Independent", title: "Write the card", prompt: "Create four usable lines." },
      { level: "Challenge", title: "Pressure test", prompt: "Rewrite the lines shorter and easier to say." },
    ],
    microTasks: ["Choose a scenario.", "Write four lines.", "Shorten each line for real speech."],
    vocabulary: ["clarify", "follow up", "welcome", "logistics", "pressure"],
  },
  {
    id: "growth-journal",
    number: "09",
    title: "The Growth Journal",
    faTitle: "ژورنال رشد",
    track: "Portfolio",
    focus: "Weekly reflection, correction, and next-step planning",
    level: "B1-C1",
    time: "20 min",
    outcome: "Make progress visible enough to continue.",
    useCase: "When learning feels invisible or scattered.",
    studyMode: "Reflect, select, plan",
    artifact: "A weekly growth entry",
    reading: {
      title: "A portfolio beats a folder",
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
    practiceLadder: [
      { level: "Supported", title: "Select evidence", prompt: "Choose one answer that improved." },
      { level: "Independent", title: "Name the weakness", prompt: "Write what still needs practice without shame." },
      { level: "Challenge", title: "Plan next week", prompt: "Choose one small action and one proof of completion." },
    ],
    microTasks: ["Select one saved answer.", "Write the reflection.", "Choose next week's proof."],
    vocabulary: ["portfolio", "reflection", "revision", "visible", "next step"],
  },
  {
    id: "visual-ministry-studio",
    number: "10",
    title: "The Visual Ministry Studio",
    faTitle: "استودیوی تصویری زبان",
    track: "Visual",
    focus: "Turn images into speech, captions, and written explanations",
    level: "B2",
    time: "30 min",
    outcome: "Use one image to produce useful language.",
    useCase: "When a visual prompt can unlock writing or speaking.",
    studyMode: "Observe, caption, explain",
    artifact: "A visual prompt response",
    reading: {
      title: "Images can organize language",
      text:
        "A strong image gives the learner a situation before the sentence begins. It suggests people, mood, action, and purpose. The learner can then write a caption, describe what is happening, explain what might happen next, and connect the image to a useful message. Visual work should still produce language, not decoration.",
      source: "Original EduPocket passage.",
      questions: [
        {
          prompt: "What should visual work produce?",
          options: ["Only decoration", "Useful language", "No writing"],
          answer: 1,
        },
      ],
    },
    writing: {
      task: "Write a caption, a description, and a short explanation for one meaningful image.",
      checklist: ["Caption is concise", "Description is concrete", "Explanation has purpose", "No decorative filler"],
    },
    practiceLadder: [
      { level: "Supported", title: "Observe", prompt: "List five visible details." },
      { level: "Independent", title: "Caption", prompt: "Write one clear caption." },
      { level: "Challenge", title: "Explain", prompt: "Connect the image to one learning or service message." },
    ],
    microTasks: ["List details.", "Write a caption.", "Write the explanation."],
    vocabulary: ["caption", "observe", "detail", "message", "purpose"],
  },
  {
    id: "ministry-language-field-guide",
    number: "11",
    title: "The Ministry Language Field Guide",
    faTitle: "راهنمای میدانی زبان کاربردی",
    track: "Reading",
    focus: "Deep reading, phrase bank, and translation drills",
    level: "B2-C1",
    time: "50 min",
    outcome: "Build a ready-to-use bank of phrases, terms, and reading responses.",
    useCase: "When the learner needs depth and breadth in one place.",
    studyMode: "Read, collect, drill",
    artifact: "A personal field-guide page",
    reading: {
      title: "A field guide is for use",
      text:
        "A field guide is not a decorative list. It is a tool a person carries into real situations. The best language guide includes terms, phrase frames, example sentences, warnings about common mistakes, and space to write personal versions. It helps the learner move from recognition to use.",
      source: "Original EduPocket passage.",
      questions: [
        {
          prompt: "What is the purpose of a field guide?",
          options: ["Decoration", "Real use", "Avoiding personal sentences"],
          answer: 1,
        },
      ],
    },
    writing: {
      task: "Create one field-guide page with five terms, five phrase frames, and two personal sentences.",
      checklist: ["Terms are grouped", "Phrase frames are reusable", "Personal sentences are natural", "Mistake warning included"],
    },
    practiceLadder: [
      { level: "Supported", title: "Collect", prompt: "Choose five useful terms." },
      { level: "Independent", title: "Frame", prompt: "Create five phrase frames." },
      { level: "Challenge", title: "Personalize", prompt: "Write two versions that sound like you." },
    ],
    microTasks: ["Collect terms.", "Build phrase frames.", "Add personal examples."],
    vocabulary: ["field guide", "phrase frame", "recognition", "use", "mistake warning"],
  },
  {
    id: "capstone-portfolio",
    number: "12",
    title: "The Capstone Portfolio",
    faTitle: "پورتفولیوی نهایی",
    track: "Portfolio",
    focus: "Mastery evidence, review, and next product path",
    level: "B1-C1",
    time: "60 min",
    outcome: "Assemble the strongest work into a reviewable learning portfolio.",
    useCase: "Finish strongly and prepare the next month of study.",
    studyMode: "Select, revise, export",
    artifact: "A final portfolio packet",
    reading: {
      title: "Finishing means selecting",
      text:
        "A learner does not need to keep every answer at the center of attention. A strong finish requires selection: the clearest paragraph, the most useful vocabulary page, the best translation note, and the most honest reflection. Selection turns a long workbook into a visible story of progress.",
      source: "Original EduPocket passage.",
      questions: [
        {
          prompt: "What does selection do?",
          options: ["Turns work into a visible story", "Deletes all progress", "Avoids revision"],
          answer: 0,
        },
      ],
    },
    writing: {
      task: "Write a capstone note: what you can do now, which artifact proves it, and what should be trained next.",
      checklist: ["Ability named", "Artifact selected", "Next training clear", "Tone is honest"],
    },
    practiceLadder: [
      { level: "Supported", title: "Select", prompt: "Choose the best artifact from three chapters." },
      { level: "Independent", title: "Revise", prompt: "Improve one artifact before exporting." },
      { level: "Challenge", title: "Plan", prompt: "Write the next-month learning route." },
    ],
    microTasks: ["Select three artifacts.", "Revise one.", "Export the capstone note."],
    vocabulary: ["capstone", "artifact", "mastery", "selection", "next route"],
  },
];
