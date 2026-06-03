import {
  BookOpen,
  Brain,
  ClipboardCheck,
  FileText,
  Gauge,
  Headphones,
  PenLine,
  Trophy,
  type LucideIcon,
} from "lucide-react";

export type EnglishLevel = "A1" | "A2" | "B1" | "B2";
export type EnglishSkill = "grammar" | "vocabulary" | "listening" | "reading" | "use-of-english" | "writing" | "exams" | "level-test";

export type LocalizedCopy = {
  en: string;
  fa: string;
};

export type LabQuestion = {
  prompt: LocalizedCopy;
  options: LocalizedCopy[];
  answer: number;
  feedback: LocalizedCopy;
};

export type LabModule = {
  id: string;
  skill: EnglishSkill;
  level: EnglishLevel;
  title: LocalizedCopy;
  description: LocalizedCopy;
  duration: LocalizedCopy;
  format: LocalizedCopy;
  status: "ready" | "upcoming";
  questions: LabQuestion[];
};

export type SkillTrack = {
  id: EnglishSkill;
  title: LocalizedCopy;
  shortTitle: LocalizedCopy;
  description: LocalizedCopy;
  icon: LucideIcon;
  color: string;
};

export const englishLevels: Array<{ id: EnglishLevel; label: string; faLabel: string; description: LocalizedCopy }> = [
  { id: "A1", label: "A1 Elementary", faLabel: "A1 مقدماتی", description: { en: "short sentences and survival grammar", fa: "جمله‌های کوتاه و گرامر پایه" } },
  { id: "A2", label: "A2 Pre-intermediate", faLabel: "A2 پیش متوسط", description: { en: "daily topics, routines, and simple stories", fa: "موضوعات روزمره، روتین و متن ساده" } },
  { id: "B1", label: "B1 Intermediate", faLabel: "B1 متوسط", description: { en: "clear opinions, longer texts, and exam habits", fa: "نظر دادن، متن طولانی‌تر و عادت آزمونی" } },
  { id: "B2", label: "B2 Upper-intermediate", faLabel: "B2 بالاتر از متوسط", description: { en: "precision, argument, and natural phrasing", fa: "دقت، استدلال و بیان طبیعی" } },
];

export const skillTracks: SkillTrack[] = [
  {
    id: "grammar",
    title: { en: "Grammar lessons", fa: "درس‌های گرامر" },
    shortTitle: { en: "Grammar", fa: "گرامر" },
    description: { en: "Mini explanations, sentence control, and instant feedback.", fa: "توضیح کوتاه، کنترل جمله و بازخورد فوری." },
    icon: BookOpen,
    color: "from-amber-300/24 to-amber-500/8",
  },
  {
    id: "vocabulary",
    title: { en: "Vocabulary practice", fa: "تمرین واژگان" },
    shortTitle: { en: "Vocabulary", fa: "واژگان" },
    description: { en: "Meaning, collocation, word family, and context drills.", fa: "معنا، هم‌نشینی، خانواده کلمه و تمرین در متن." },
    icon: Brain,
    color: "from-sky-300/22 to-cyan-500/8",
  },
  {
    id: "listening",
    title: { en: "Listening drills", fa: "تمرین شنیداری" },
    shortTitle: { en: "Listening", fa: "شنیداری" },
    description: { en: "Audio-style tasks with transcript reveal and focus questions.", fa: "تمرین شبیه صوت با نمایش متن و سؤال‌های متمرکز." },
    icon: Headphones,
    color: "from-indigo-300/22 to-blue-500/8",
  },
  {
    id: "reading",
    title: { en: "Reading tests", fa: "تست ریدینگ" },
    shortTitle: { en: "Reading", fa: "ریدینگ" },
    description: { en: "Skim, scan, infer, and check meaning under light pressure.", fa: "مرور سریع، پیدا کردن جزئیات، استنباط و بررسی معنا." },
    icon: FileText,
    color: "from-emerald-300/18 to-teal-500/8",
  },
  {
    id: "use-of-english",
    title: { en: "Use of English", fa: "کاربرد انگلیسی" },
    shortTitle: { en: "Use", fa: "کاربرد" },
    description: { en: "Mixed grammar and vocabulary choices with explanation.", fa: "ترکیب گرامر و واژگان با توضیح جواب." },
    icon: ClipboardCheck,
    color: "from-violet-300/20 to-fuchsia-500/8",
  },
  {
    id: "writing",
    title: { en: "Writing studio", fa: "استودیو نوشتن" },
    shortTitle: { en: "Writing", fa: "نوشتن" },
    description: { en: "Prompts, structure checks, connectors, and word targets.", fa: "موضوع نوشتن، چک ساختار، connector و هدف تعداد کلمه." },
    icon: PenLine,
    color: "from-rose-300/18 to-orange-500/8",
  },
  {
    id: "exams",
    title: { en: "Exam corner", fa: "گوشه آزمون" },
    shortTitle: { en: "Exams", fa: "آزمون‌ها" },
    description: { en: "KET, IELTS, and TOEFL-style habits without empty promises.", fa: "عادت‌های KET، آیلتس و تافل بدون وعده خالی." },
    icon: Trophy,
    color: "from-lime-300/16 to-amber-500/8",
  },
  {
    id: "level-test",
    title: { en: "Level check", fa: "تعیین سطح" },
    shortTitle: { en: "Level", fa: "سطح" },
    description: { en: "A fast sample diagnostic that estimates your next step.", fa: "یک تعیین سطح نمونه و سریع برای قدم بعدی." },
    icon: Gauge,
    color: "from-white/18 to-slate-400/8",
  },
];

export const labModules: LabModule[] = [
  {
    id: "a1-present-simple",
    skill: "grammar",
    level: "A1",
    status: "ready",
    title: { en: "Present simple: daily routines", fa: "حال ساده: روتین روزانه" },
    description: { en: "Choose the correct verb form and notice the third-person -s.", fa: "شکل درست فعل را انتخاب کن و s سوم شخص را ببین." },
    duration: { en: "6 min", fa: "۶ دقیقه" },
    format: { en: "3-question drill", fa: "تمرین ۳ سوالی" },
    questions: [
      {
        prompt: { en: "She ___ English every evening.", fa: "او هر عصر انگلیسی ___." },
        options: [
          { en: "study", fa: "study" },
          { en: "studies", fa: "studies" },
          { en: "studying", fa: "studying" },
        ],
        answer: 1,
        feedback: { en: "Use studies with she/he/it in the present simple.", fa: "با she/he/it در حال ساده از studies استفاده می‌کنیم." },
      },
      {
        prompt: { en: "They ___ coffee before class.", fa: "آن‌ها قبل از کلاس قهوه ___." },
        options: [
          { en: "drink", fa: "drink" },
          { en: "drinks", fa: "drinks" },
          { en: "drinking", fa: "drinking" },
        ],
        answer: 0,
        feedback: { en: "They use the base verb: drink.", fa: "با they فعل ساده می‌آید: drink." },
      },
      {
        prompt: { en: "Ali ___ online lessons on Saturdays.", fa: "علی شنبه‌ها کلاس آنلاین ___." },
        options: [
          { en: "teach", fa: "teach" },
          { en: "teaches", fa: "teaches" },
          { en: "teaching", fa: "teaching" },
        ],
        answer: 1,
        feedback: { en: "Ali is one person, so we use teaches.", fa: "Ali یک نفر است، پس teaches درست است." },
      },
    ],
  },
  {
    id: "a2-past-story",
    skill: "grammar",
    level: "A2",
    status: "ready",
    title: { en: "Past simple: short stories", fa: "گذشته ساده: داستان کوتاه" },
    description: { en: "Pick the past form that keeps the story clean.", fa: "فرم گذشته را انتخاب کن تا داستان دقیق بماند." },
    duration: { en: "7 min", fa: "۷ دقیقه" },
    format: { en: "quick quiz", fa: "کوئیز سریع" },
    questions: [
      {
        prompt: { en: "Yesterday, I ___ a new grammar chart.", fa: "دیروز یک چارت گرامر جدید ___." },
        options: [
          { en: "make", fa: "make" },
          { en: "made", fa: "made" },
          { en: "making", fa: "making" },
        ],
        answer: 1,
        feedback: { en: "Yesterday signals the past simple: made.", fa: "Yesterday نشانه گذشته ساده است: made." },
      },
      {
        prompt: { en: "We ___ the lesson twice before the test.", fa: "ما قبل از آزمون درس را دو بار ___." },
        options: [
          { en: "reviewed", fa: "reviewed" },
          { en: "review", fa: "review" },
          { en: "reviews", fa: "reviews" },
        ],
        answer: 0,
        feedback: { en: "The story is in the past, so reviewed is right.", fa: "داستان در گذشته است، پس reviewed درست است." },
      },
      {
        prompt: { en: "She ___ the answer after the hint.", fa: "او بعد از راهنمایی جواب را ___." },
        options: [
          { en: "understand", fa: "understand" },
          { en: "understood", fa: "understood" },
          { en: "understands", fa: "understands" },
        ],
        answer: 1,
        feedback: { en: "Understand is irregular: understood.", fa: "فعل understand بی‌قاعده است: understood." },
      },
    ],
  },
  {
    id: "b1-conditionals",
    skill: "grammar",
    level: "B1",
    status: "ready",
    title: { en: "First conditional decisions", fa: "تصمیم با شرطی نوع اول" },
    description: { en: "Practise if + present, will + verb for real future results.", fa: "if + حال ساده و will + فعل برای نتیجه واقعی آینده." },
    duration: { en: "8 min", fa: "۸ دقیقه" },
    format: { en: "feedback quiz", fa: "کوئیز با بازخورد" },
    questions: [
      {
        prompt: { en: "If you practise daily, you ___ faster.", fa: "اگر هر روز تمرین کنی، سریع‌تر ___." },
        options: [
          { en: "improve", fa: "improve" },
          { en: "will improve", fa: "will improve" },
          { en: "improved", fa: "improved" },
        ],
        answer: 1,
        feedback: { en: "Use will + verb for the future result.", fa: "برای نتیجه آینده از will + verb استفاده کن." },
      },
      {
        prompt: { en: "If the question ___ unclear, ask for an example.", fa: "اگر سوال نامشخص ___، مثال بخواه." },
        options: [
          { en: "is", fa: "is" },
          { en: "will be", fa: "will be" },
          { en: "was", fa: "was" },
        ],
        answer: 0,
        feedback: { en: "After if, use the present simple for real future conditions.", fa: "بعد از if برای شرط واقعی آینده، حال ساده می‌آید." },
      },
      {
        prompt: { en: "If I have time, I ___ the transcript.", fa: "اگر وقت داشته باشم، متن را ___." },
        options: [
          { en: "will read", fa: "will read" },
          { en: "read", fa: "read" },
          { en: "am read", fa: "am read" },
        ],
        answer: 0,
        feedback: { en: "The result clause uses will read.", fa: "در بخش نتیجه از will read استفاده می‌کنیم." },
      },
    ],
  },
  {
    id: "b2-linking-ideas",
    skill: "grammar",
    level: "B2",
    status: "ready",
    title: { en: "Linking ideas with contrast", fa: "وصل کردن ایده‌ها با تضاد" },
    description: { en: "Choose precise connectors for academic and exam sentences.", fa: "connector دقیق برای جمله‌های آکادمیک و آزمونی." },
    duration: { en: "9 min", fa: "۹ دقیقه" },
    format: { en: "precision drill", fa: "تمرین دقت" },
    questions: [
      {
        prompt: { en: "The course is demanding; ___, it is very practical.", fa: "دوره سخت است؛ ___ بسیار کاربردی است." },
        options: [
          { en: "however", fa: "however" },
          { en: "because", fa: "because" },
          { en: "so", fa: "so" },
        ],
        answer: 0,
        feedback: { en: "However introduces contrast between two ideas.", fa: "however تضاد بین دو ایده را نشان می دهد." },
      },
      {
        prompt: { en: "___ the task was short, it required careful planning.", fa: "___ تمرین کوتاه بود، برنامه ریزی دقیق می خواست." },
        options: [
          { en: "Although", fa: "Although" },
          { en: "Therefore", fa: "Therefore" },
          { en: "In addition", fa: "In addition" },
        ],
        answer: 0,
        feedback: { en: "Although starts a contrast clause.", fa: "Although بخش تضاد را شروع می‌کند." },
      },
      {
        prompt: { en: "The app is simple. ___, it gives detailed feedback.", fa: "اپ ساده است. ___ بازخورد دقیق می دهد." },
        options: [
          { en: "Nevertheless", fa: "Nevertheless" },
          { en: "As a result", fa: "As a result" },
          { en: "For example", fa: "For example" },
        ],
        answer: 0,
        feedback: { en: "Nevertheless keeps the contrast but sounds formal.", fa: "Nevertheless تضاد را رسمی‌تر بیان می‌کند." },
      },
    ],
  },
  {
    id: "a2-vocab-learning",
    skill: "vocabulary",
    level: "A2",
    status: "ready",
    title: { en: "Study verbs that actually work", fa: "فعل های کاربردی مطالعه" },
    description: { en: "Choose verbs that match real learning actions.", fa: "فعل هایی را انتخاب کن که با کارهای واقعی مطالعه بخوانند." },
    duration: { en: "6 min", fa: "۶ دقیقه" },
    format: { en: "meaning in context", fa: "معنا در متن" },
    questions: [
      {
        prompt: { en: "I need to ___ my notes before the exam.", fa: "قبل از امتحان باید یادداشت‌هایم را ___." },
        options: [
          { en: "revise", fa: "revise" },
          { en: "repair", fa: "repair" },
          { en: "reserve", fa: "reserve" },
        ],
        answer: 0,
        feedback: { en: "Revise means review study material.", fa: "revise یعنی مرور مطالب درسی." },
      },
      {
        prompt: { en: "Can you ___ the rule with one example?", fa: "می توانی قانون را با یک مثال ___؟" },
        options: [
          { en: "explain", fa: "explain" },
          { en: "expect", fa: "expect" },
          { en: "exchange", fa: "exchange" },
        ],
        answer: 0,
        feedback: { en: "Explain means make something clear.", fa: "explain یعنی چیزی را روشن توضیح دادن." },
      },
      {
        prompt: { en: "Keep an error log to ___ your mistakes.", fa: "برای ___ خطاهایت دفتر خطا نگه دار." },
        options: [
          { en: "track", fa: "track" },
          { en: "travel", fa: "travel" },
          { en: "treat", fa: "treat" },
        ],
        answer: 0,
        feedback: { en: "Track means follow progress over time.", fa: "track یعنی پیگیری کردن در طول زمان." },
      },
    ],
  },
  {
    id: "b1-reading-ai",
    skill: "reading",
    level: "B1",
    status: "ready",
    title: { en: "Reading: AI as a study partner", fa: "ریدینگ: AI به عنوان همراه مطالعه" },
    description: { en: "Read a short text and choose the best meaning.", fa: "یک متن کوتاه بخوان و بهترین معنا را انتخاب کن." },
    duration: { en: "10 min", fa: "۱۰ دقیقه" },
    format: { en: "mini text + questions", fa: "متن کوتاه + سوال" },
    questions: [
      {
        prompt: { en: "Text: A useful AI tool should ask questions before giving answers. What is the main idea?", fa: "متن: ابزار AI مفید باید قبل از جواب دادن سوال بپرسد. ایده اصلی چیست؟" },
        options: [
          { en: "AI should replace all studying.", fa: "AI باید جای همه مطالعه را بگیرد." },
          { en: "AI should make learners think first.", fa: "AI باید اول زبان‌آموز را وادار به فکر کند." },
          { en: "AI should only translate words.", fa: "AI فقط باید کلمه ترجمه کند." },
        ],
        answer: 1,
        feedback: { en: "The text values thinking before answers.", fa: "متن روی فکر کردن قبل از جواب تاکید دارد." },
      },
      {
        prompt: { en: "Which action matches the text?", fa: "کدام کار با متن هماهنگ است؟" },
        options: [
          { en: "Ask AI to quiz you.", fa: "از AI بخواه از تو سوال بپرسد." },
          { en: "Copy AI answers directly.", fa: "جواب AI را مستقیم کپی کن." },
          { en: "Avoid feedback.", fa: "از بازخورد دوری کن." },
        ],
        answer: 0,
        feedback: { en: "Quiz-first use keeps the learner active.", fa: "اول سوال پرسیدن یادگیرنده را فعال نگه می دارد." },
      },
      {
        prompt: { en: "The word partner is closest to:", fa: "کلمه partner نزدیک تر است به:" },
        options: [
          { en: "tool that works with you", fa: "ابزاری که با تو کار می‌کند" },
          { en: "a final answer", fa: "جواب نهایی" },
          { en: "a grammar mistake", fa: "خطای گرامری" },
        ],
        answer: 0,
        feedback: { en: "A partner supports your process.", fa: "partner یعنی همراهی که روندت را پشتیبانی می‌کند." },
      },
    ],
  },
  {
    id: "b1-use-of-english",
    skill: "use-of-english",
    level: "B1",
    status: "ready",
    title: { en: "Mixed choices: grammar + vocab", fa: "انتخاب ترکیبی: گرامر + واژگان" },
    description: { en: "A compact Use of English set with immediate explanations.", fa: "یک ست کوتاه کاربرد انگلیسی با توضیح فوری." },
    duration: { en: "8 min", fa: "۸ دقیقه" },
    format: { en: "mixed multiple choice", fa: "چند گزینه ای ترکیبی" },
    questions: [
      {
        prompt: { en: "I have been learning English ___ 2022.", fa: "از سال ۲۰۲۲ انگلیسی یاد می گیرم." },
        options: [
          { en: "for", fa: "for" },
          { en: "since", fa: "since" },
          { en: "during", fa: "during" },
        ],
        answer: 1,
        feedback: { en: "Use since with a starting point.", fa: "با نقطه شروع از since استفاده می‌کنیم." },
      },
      {
        prompt: { en: "The lesson was ___ useful that I saved it.", fa: "درس آنقدر مفید بود که ذخیره اش کردم." },
        options: [
          { en: "so", fa: "so" },
          { en: "such", fa: "such" },
          { en: "too", fa: "too" },
        ],
        answer: 0,
        feedback: { en: "Use so + adjective + that.", fa: "ساختار so + adjective + that است." },
      },
      {
        prompt: { en: "A synonym for improve is:", fa: "مترادف improve چیست؟" },
        options: [
          { en: "get better", fa: "get better" },
          { en: "give up", fa: "give up" },
          { en: "look after", fa: "look after" },
        ],
        answer: 0,
        feedback: { en: "Improve means get better.", fa: "improve یعنی بهتر شدن." },
      },
    ],
  },
  {
    id: "a1-listening-routines",
    skill: "listening",
    level: "A1",
    status: "ready",
    title: { en: "Listening focus: daily routine", fa: "تمرکز شنیداری: روتین روزانه" },
    description: { en: "Read-listen simulation with transcript reveal and gist check.", fa: "شبیه ساز شنیداری با نمایش متن و سوال کلی." },
    duration: { en: "5 min", fa: "۵ دقیقه" },
    format: { en: "transcript drill", fa: "تمرین متن شنیداری" },
    questions: [
      {
        prompt: { en: "Transcript: I study English after dinner and review five words. When does the speaker study?", fa: "متن: بعد از شام انگلیسی می‌خوانم و پنج کلمه مرور می‌کنم. گوینده کی مطالعه می‌کند؟" },
        options: [
          { en: "After dinner", fa: "بعد از شام" },
          { en: "Before breakfast", fa: "قبل از صبحانه" },
          { en: "At school", fa: "در مدرسه" },
        ],
        answer: 0,
        feedback: { en: "The time phrase is after dinner.", fa: "عبارت زمانی after dinner است." },
      },
      {
        prompt: { en: "How many words does the speaker review?", fa: "گوینده چند کلمه مرور می‌کند؟" },
        options: [
          { en: "three", fa: "سه" },
          { en: "five", fa: "پنج" },
          { en: "ten", fa: "ده" },
        ],
        answer: 1,
        feedback: { en: "The transcript says five words.", fa: "در متن آمده five words." },
      },
      {
        prompt: { en: "The speaker's habit is:", fa: "عادت گوینده چیست؟" },
        options: [
          { en: "short and regular", fa: "کوتاه و منظم" },
          { en: "very rare", fa: "خیلی نادر" },
          { en: "only on exams", fa: "فقط زمان آزمون" },
        ],
        answer: 0,
        feedback: { en: "A daily review habit is short and regular.", fa: "عادت مرور روزانه کوتاه و منظم است." },
      },
    ],
  },
  {
    id: "b2-writing-opinion",
    skill: "writing",
    level: "B2",
    status: "ready",
    title: { en: "Opinion paragraph studio", fa: "استودیو پاراگراف نظر" },
    description: { en: "Write a claim, reason, example, and closing sentence.", fa: "یک ادعا، دلیل، مثال و جمله پایانی بنویس." },
    duration: { en: "12 min", fa: "۱۲ دقیقه" },
    format: { en: "live writing checklist", fa: "چک لیست نوشتن زنده" },
    questions: [
      {
        prompt: { en: "Best topic sentence: Online lessons are useful because ___.", fa: "بهترین topic sentence: کلاس آنلاین مفید است چون ___." },
        options: [
          { en: "they can save time and allow flexible practice", fa: "در زمان صرفه‌جویی می‌کنند و تمرین منعطف می‌دهند" },
          { en: "I am yesterday", fa: "I am yesterday" },
          { en: "very lesson good", fa: "very lesson good" },
        ],
        answer: 0,
        feedback: { en: "A clear topic sentence gives one focused reason.", fa: "topic sentence خوب یک دلیل روشن می دهد." },
      },
      {
        prompt: { en: "Which connector introduces an example?", fa: "کدام connector مثال را معرفی می‌کند؟" },
        options: [
          { en: "For example", fa: "For example" },
          { en: "However", fa: "However" },
          { en: "Although", fa: "Although" },
        ],
        answer: 0,
        feedback: { en: "For example signals a specific example.", fa: "For example نشان دهنده مثال مشخص است." },
      },
      {
        prompt: { en: "A good closing sentence should:", fa: "جمله پایانی خوب باید:" },
        options: [
          { en: "repeat the main idea in a fresh way", fa: "ایده اصلی را با بیان تازه جمع کند" },
          { en: "start a completely new topic", fa: "موضوع کاملا جدیدی شروع کند" },
          { en: "remove the opinion", fa: "نظر را حذف کند" },
        ],
        answer: 0,
        feedback: { en: "A closing sentence should land the paragraph.", fa: "جمله پایانی باید پاراگراف را جمع کند." },
      },
    ],
  },
  {
    id: "a2-ket-habits",
    skill: "exams",
    level: "A2",
    status: "ready",
    title: { en: "KET habit: read the task twice", fa: "عادت KET: صورت سوال را دو بار بخوان" },
    description: { en: "A small exam routine for avoiding easy mistakes.", fa: "یک روتین کوچک آزمونی برای جلوگیری از خطاهای ساده." },
    duration: { en: "7 min", fa: "۷ دقیقه" },
    format: { en: "exam micro-drill", fa: "تمرین کوچک آزمونی" },
    questions: [
      {
        prompt: { en: "In a reading exam, the first step should be:", fa: "در آزمون ریدینگ، قدم اول باید:" },
        options: [
          { en: "read the question carefully", fa: "سوال را دقیق بخوانی" },
          { en: "guess without reading", fa: "بدون خواندن حدس بزنی" },
          { en: "copy the longest answer", fa: "طولانی‌ترین جواب را کپی کنی" },
        ],
        answer: 0,
        feedback: { en: "Careful task reading prevents avoidable errors.", fa: "خواندن دقیق سوال جلوی خطاهای قابل پیشگیری را می گیرد." },
      },
      {
        prompt: { en: "A distractor is:", fa: "distractor یعنی:" },
        options: [
          { en: "an option designed to trick you", fa: "گزینه ای که برای گمراه کردن طراحی شده" },
          { en: "the answer key", fa: "کلید جواب" },
          { en: "the easiest word", fa: "آسان ترین کلمه" },
        ],
        answer: 0,
        feedback: { en: "Distractors look attractive but do not match the text.", fa: "distractor جذاب به نظر می رسد اما با متن نمی خواند." },
      },
      {
        prompt: { en: "Before submitting, you should:", fa: "قبل از ثبت جواب باید:" },
        options: [
          { en: "check evidence in the text", fa: "مدرک را در متن چک کنی" },
          { en: "ignore the text", fa: "متن را نادیده بگیری" },
          { en: "change every answer", fa: "همه جواب‌ها را عوض کنی" },
        ],
        answer: 0,
        feedback: { en: "Good exam habits are evidence-based.", fa: "عادت آزمونی خوب بر اساس مدرک است." },
      },
    ],
  },
  {
    id: "level-sample",
    skill: "level-test",
    level: "B1",
    status: "ready",
    title: { en: "Fast level sample", fa: "نمونه سریع تعیین سطح" },
    description: { en: "Six decisions from A1 to B2 patterns, compressed into one sample.", fa: "چند تصمیم از الگوهای A1 تا B2 در یک نمونه کوتاه." },
    duration: { en: "6 min", fa: "۶ دقیقه" },
    format: { en: "diagnostic sample", fa: "نمونه تشخیصی" },
    questions: [
      {
        prompt: { en: "I usually ___ at 7.", fa: "معمولا ساعت ۷ ___." },
        options: [
          { en: "wake up", fa: "wake up" },
          { en: "wakes up", fa: "wakes up" },
          { en: "woke up", fa: "woke up" },
        ],
        answer: 0,
        feedback: { en: "I + base verb in present simple.", fa: "با I در حال ساده فعل ساده می‌آید." },
      },
      {
        prompt: { en: "This is the ___ lesson I have tried this week.", fa: "این ___ درسی است که این هفته امتحان کرده ام." },
        options: [
          { en: "useful", fa: "useful" },
          { en: "more useful", fa: "more useful" },
          { en: "most useful", fa: "most useful" },
        ],
        answer: 2,
        feedback: { en: "The pattern the + most + adjective forms a superlative.", fa: "الگوی the + most + adjective صفت عالی می‌سازد." },
      },
      {
        prompt: { en: "If I ___ more examples, I will understand it.", fa: "اگر مثال های بیشتری ___، می فهمم." },
        options: [
          { en: "see", fa: "see" },
          { en: "will see", fa: "will see" },
          { en: "saw", fa: "saw" },
        ],
        answer: 0,
        feedback: { en: "First conditional uses present simple after if.", fa: "در شرطی نوع اول بعد از if حال ساده می‌آید." },
      },
    ],
  },
  {
    id: "c1-advanced-style",
    skill: "use-of-english",
    level: "B2",
    status: "upcoming",
    title: { en: "Advanced transformation set", fa: "ست تبدیل جمله پیشرفته" },
    description: { en: "A C1-style transformation pack is planned, but not open yet.", fa: "یک پک تبدیل جمله سبک C1 برنامه ریزی شده اما هنوز باز نیست." },
    duration: { en: "Soon", fa: "به‌زودی" },
    format: { en: "locked module", fa: "ماژول قفل" },
    questions: [],
  },
  {
    id: "ielts-writing-pack",
    skill: "exams",
    level: "B2",
    status: "upcoming",
    title: { en: "IELTS Task 2 feedback pack", fa: "پک بازخورد IELTS Task 2" },
    description: { en: "Band-aware writing feedback will open after the first content batch.", fa: "بازخورد نوشتن بر اساس band بعد از اولین بسته محتوا باز می‌شود." },
    duration: { en: "Soon", fa: "به‌زودی" },
    format: { en: "not clickable", fa: "قابل کلیک نیست" },
    questions: [],
  },
];

export const defaultLabModule = labModules.find((item) => item.status === "ready") ?? labModules[0];
