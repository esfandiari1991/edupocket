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

export type EnglishLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
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
  { id: "C1", label: "C1 Advanced", faLabel: "C1 پیشرفته", description: { en: "nuance, register, transformation, and argument control", fa: "ظرافت، register، تبدیل جمله و کنترل استدلال" } },
  { id: "C2", label: "C2 Proficiency", faLabel: "C2 تسلط", description: { en: "near-native precision, style, and dense academic language", fa: "دقت نزدیک به بومی، سبک و زبان آکادمیک فشرده" } },
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

const labModuleSeeds: LabModule[] = [
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

function lc(en: string, fa: string): LocalizedCopy {
  return { en, fa };
}

function question(prompt: LocalizedCopy, options: LocalizedCopy[], answer: number, feedback: LocalizedCopy): LabQuestion {
  return { prompt, options, answer, feedback };
}

const originalPracticeModules: LabModule[] = [
  {
    id: "a1-be-have-can",
    skill: "grammar",
    level: "A1",
    status: "ready",
    title: lc("Be, have, and can: foundation check", "be، have و can: چک پایه"),
    description: lc("A fast foundation set for sentence building.", "یک ست سریع پایه برای ساخت جمله."),
    duration: lc("6 min", "۶ دقیقه"),
    format: lc("grammar choices", "انتخاب گرامری"),
    questions: [
      question(lc("I ___ a student.", "من دانش‌آموز ___."), [lc("am", "am"), lc("have", "have"), lc("can", "can")], 0, lc("Use am with I for identity.", "برای معرفی هویت با I از am استفاده می‌کنیم.")),
      question(lc("She ___ a notebook.", "او یک دفتر ___."), [lc("is", "is"), lc("has", "has"), lc("can", "can")], 1, lc("Has shows possession with she/he/it.", "has برای مالکیت با she/he/it می‌آید.")),
      question(lc("They ___ read short stories.", "آن‌ها ___ داستان کوتاه بخوانند."), [lc("are", "are"), lc("have", "have"), lc("can", "can")], 2, lc("Can + base verb shows ability.", "can + فعل ساده توانایی را نشان می‌دهد.")),
    ],
  },
  {
    id: "a2-articles-countability",
    skill: "grammar",
    level: "A2",
    status: "ready",
    title: lc("Articles and countable nouns", "حروف تعریف و اسم‌های قابل شمارش"),
    description: lc("Choose a, an, the, or no article in short contexts.", "در متن‌های کوتاه a، an، the یا بدون article را انتخاب کن."),
    duration: lc("7 min", "۷ دقیقه"),
    format: lc("article drill", "تمرین article"),
    questions: [
      question(lc("I watched ___ useful lesson.", "یک درس مفید دیدم."), [lc("a", "a"), lc("an", "an"), lc("the", "the")], 0, lc("Useful starts with a /juː/ sound, so use a.", "useful با صدای /juː/ شروع می‌شود، پس a درست است.")),
      question(lc("This is ___ answer I told you about.", "این همان جوابی است که درباره‌اش گفتم."), [lc("a", "a"), lc("the", "the"), lc("no article", "بدون article")], 1, lc("Use the for a specific known answer.", "برای چیزی مشخص و شناخته‌شده از the استفاده می‌کنیم.")),
      question(lc("___ practice helps more than passive watching.", "تمرین از تماشای منفعل مفیدتر است."), [lc("A", "A"), lc("The", "The"), lc("No article", "بدون article")], 2, lc("Practice as an uncountable general idea takes no article.", "practice به عنوان مفهوم کلی و غیرقابل شمارش article نمی‌گیرد.")),
    ],
  },
  {
    id: "b1-present-perfect-since-for",
    skill: "grammar",
    level: "B1",
    status: "ready",
    title: lc("Present perfect: since and for", "حال کامل: since و for"),
    description: lc("Track time clearly in learning and exam stories.", "زمان را در داستان‌های یادگیری و آزمون دقیق نشان بده."),
    duration: lc("8 min", "۸ دقیقه"),
    format: lc("time-marker quiz", "کوئیز نشانه‌های زمانی"),
    questions: [
      question(lc("I have studied with Ali ___ three months.", "سه ماه است با علی درس می‌خوانم."), [lc("since", "since"), lc("for", "for"), lc("from", "from")], 1, lc("Use for with a duration.", "با مدت زمان از for استفاده می‌کنیم.")),
      question(lc("She has kept a vocabulary notebook ___ January.", "از ژانویه دفتر واژگان دارد."), [lc("since", "since"), lc("for", "for"), lc("during", "during")], 0, lc("Use since with a starting point.", "با نقطه شروع از since استفاده می‌کنیم.")),
      question(lc("We ___ three essays this week.", "این هفته سه essay نوشته‌ایم."), [lc("write", "write"), lc("wrote", "wrote"), lc("have written", "have written")], 2, lc("This week is an unfinished time period, so present perfect works.", "this week بازه‌ی تمام‌نشده است، پس حال کامل مناسب است.")),
    ],
  },
  {
    id: "b2-passive-reporting",
    skill: "grammar",
    level: "B2",
    status: "ready",
    title: lc("Passive reporting for academic style", "passive reporting برای سبک آکادمیک"),
    description: lc("Use it is believed, it is argued, and evidence-based phrasing.", "از it is believed، it is argued و بیان مبتنی بر evidence استفاده کن."),
    duration: lc("9 min", "۹ دقیقه"),
    format: lc("academic grammar", "گرامر آکادمیک"),
    questions: [
      question(lc("Researchers ___ that feedback improves revision.", "پژوهشگران می‌گویند بازخورد revision را بهتر می‌کند."), [lc("are believed", "are believed"), lc("argue", "argue"), lc("is argued", "is argued")], 1, lc("Researchers is the subject, so use the active verb argue.", "Researchers فاعل است، پس فعل active یعنی argue درست است.")),
      question(lc("It ___ that short practice beats long passive reading.", "گفته می‌شود تمرین کوتاه از خواندن منفعل طولانی بهتر است."), [lc("argues", "argues"), lc("is often argued", "is often argued"), lc("often arguing", "often arguing")], 1, lc("It is often argued is a common passive reporting form.", "It is often argued یک فرم رایج passive reporting است.")),
      question(lc("The results ___ in the learner's review log.", "نتایج در review log زبان‌آموز ثبت می‌شوند."), [lc("record", "record"), lc("are recorded", "are recorded"), lc("recording", "recording")], 1, lc("The results receive the action, so passive is needed.", "results عمل را دریافت می‌کند، پس passive لازم است.")),
    ],
  },
  {
    id: "c1-key-word-transformations",
    skill: "use-of-english",
    level: "C1",
    status: "ready",
    title: lc("Key word transformations: precision", "تبدیل جمله با کلمه کلیدی: دقت"),
    description: lc("C1-style transformations with original EduPocket sentences.", "تبدیل جمله سبک C1 با جمله‌های اصلی EduPocket."),
    duration: lc("10 min", "۱۰ دقیقه"),
    format: lc("transformation logic", "منطق تبدیل جمله"),
    questions: [
      question(lc("Ali started teaching online in 2019. KEY: has", "علی از ۲۰۱۹ تدریس آنلاین را شروع کرد. KEY: has"), [lc("Ali has taught online since 2019.", "Ali has taught online since 2019."), lc("Ali has teaching online in 2019.", "Ali has teaching online in 2019."), lc("Ali has teach online since 2019.", "Ali has teach online since 2019.")], 0, lc("Present perfect + since links a start point to now.", "حال کامل + since نقطه شروع را به زمان حال وصل می‌کند.")),
      question(lc("The task was difficult, but Eva finished it. KEY: although", "تمرین سخت بود، اما Eva تمامش کرد. KEY: although"), [lc("Although the task was difficult, Eva finished it.", "Although the task was difficult, Eva finished it."), lc("Although Eva finished it, so difficult.", "Although Eva finished it, so difficult."), lc("The task although was finished difficult.", "The task although was finished difficult.")], 0, lc("Although introduces the contrast clause cleanly.", "Although بخش تضاد را تمیز معرفی می‌کند.")),
      question(lc("The feedback was useful enough to change my draft. KEY: so", "بازخورد آنقدر مفید بود که draft را تغییر دادم. KEY: so"), [lc("The feedback was so useful that I changed my draft.", "The feedback was so useful that I changed my draft."), lc("The feedback was so useful to changing my draft.", "The feedback was so useful to changing my draft."), lc("So useful feedback changed my draft that.", "So useful feedback changed my draft that.")], 0, lc("Use so + adjective + that + result clause.", "ساختار درست so + adjective + that + نتیجه است.")),
    ],
  },
  {
    id: "c2-nominalisation-style",
    skill: "grammar",
    level: "C2",
    status: "ready",
    title: lc("Nominalisation and dense academic style", "nominalisation و سبک آکادمیک فشرده"),
    description: lc("Turn verbs into controlled academic nouns without making the sentence ugly.", "فعل‌ها را به اسم‌های آکادمیک کنترل‌شده تبدیل کن بدون زشت شدن جمله."),
    duration: lc("11 min", "۱۱ دقیقه"),
    format: lc("style control", "کنترل سبک"),
    questions: [
      question(lc("Students revised the paragraph carefully. Best nominalised version:", "دانش‌آموزها پاراگراف را دقیق revise کردند. بهترین nominalised version:"), [lc("The careful revision of the paragraph improved clarity.", "The careful revision of the paragraph improved clarity."), lc("The careful revise of paragraph clarity.", "The careful revise of paragraph clarity."), lc("Students careful revisioned paragraph.", "Students careful revisioned paragraph.")], 0, lc("Revision is the correct noun form and the sentence remains readable.", "revision اسم درست است و جمله خوانا می‌ماند.")),
      question(lc("Which phrase is most formal and natural?", "کدام عبارت رسمی‌تر و طبیعی‌تر است؟"), [lc("the evaluation of learner progress", "the evaluation of learner progress"), lc("the evaluate of learner progress", "the evaluate of learner progress"), lc("learner progress evaluatingness", "learner progress evaluatingness")], 0, lc("Evaluation is the natural noun form.", "evaluation اسم طبیعی این ساختار است.")),
      question(lc("Choose the clearest C2-style sentence.", "واضح‌ترین جمله C2-style را انتخاب کن."), [lc("Excessive correction may reduce fluency if it interrupts meaning.", "Excessive correction may reduce fluency if it interrupts meaning."), lc("Correction excessive reduce maybe fluency.", "Correction excessive reduce maybe fluency."), lc("If correction excessive, fluency interruption meaning.", "If correction excessive, fluency interruption meaning.")], 0, lc("Advanced style should still be clear.", "سبک پیشرفته همچنان باید روشن باشد.")),
    ],
  },
  {
    id: "a1-vocab-classroom",
    skill: "vocabulary",
    level: "A1",
    status: "ready",
    title: lc("Classroom survival vocabulary", "واژگان پایه کلاس"),
    description: lc("Core words for lessons, homework, and questions.", "کلمات پایه برای درس، تکلیف و سؤال."),
    duration: lc("5 min", "۵ دقیقه"),
    format: lc("meaning match", "تطبیق معنا"),
    questions: [
      question(lc("A teacher asks you to open your ___.", "معلم از تو می‌خواهد ___ را باز کنی."), [lc("book", "book"), lc("bus", "bus"), lc("bank", "bank")], 0, lc("Book is the classroom object.", "book شیء مربوط به کلاس است.")),
      question(lc("Homework means:", "Homework یعنی:"), [lc("work you do after class", "کاری که بعد از کلاس انجام می‌دهی"), lc("a place to sleep", "جایی برای خواب"), lc("a kind of food", "نوعی غذا")], 0, lc("Homework is study work outside class.", "homework کار درسی بیرون از کلاس است.")),
      question(lc("If you do not understand, you can ask for a ___.", "اگر نفهمیدی می‌توانی ___ بخواهی."), [lc("example", "example"), lc("ticket", "ticket"), lc("rain", "rain")], 0, lc("An example helps meaning become clear.", "example کمک می‌کند معنا روشن شود.")),
    ],
  },
  {
    id: "b1-vocab-phrasal-verbs",
    skill: "vocabulary",
    level: "B1",
    status: "ready",
    title: lc("Phrasal verbs for study habits", "phrasal verbهای عادت مطالعه"),
    description: lc("Learn practical phrasal verbs without random lists.", "phrasal verbهای کاربردی را بدون لیست‌های پراکنده یاد بگیر."),
    duration: lc("8 min", "۸ دقیقه"),
    format: lc("context choices", "انتخاب در متن"),
    questions: [
      question(lc("I need to ___ this rule before the test.", "قبل از آزمون باید این قانون را ___."), [lc("go over", "go over"), lc("go out", "go out"), lc("go off", "go off")], 0, lc("Go over means review carefully.", "go over یعنی مرور دقیق.")),
      question(lc("Do not ___ when the first listening task feels hard.", "وقتی اولین listening سخت است، ___."), [lc("give up", "give up"), lc("give in to grammar", "give in to grammar"), lc("give away a lesson", "give away a lesson")], 0, lc("Give up means stop trying.", "give up یعنی دست کشیدن از تلاش.")),
      question(lc("After feedback, ___ your draft again.", "بعد از بازخورد، draft را دوباره ___."), [lc("look through", "look through"), lc("look after", "look after"), lc("look like", "look like")], 0, lc("Look through means read/check something quickly but carefully.", "look through یعنی چیزی را سریع اما با دقت بررسی کردن.")),
    ],
  },
  {
    id: "b2-vocab-word-formation",
    skill: "vocabulary",
    level: "B2",
    status: "ready",
    title: lc("Word formation: academic families", "word formation: خانواده‌های آکادمیک"),
    description: lc("Build noun, adjective, and verb forms for exam writing.", "فرم اسم، صفت و فعل را برای writing آزمونی بساز."),
    duration: lc("9 min", "۹ دقیقه"),
    format: lc("word-family drill", "تمرین خانواده کلمه"),
    questions: [
      question(lc("The teacher's ___ helped me revise. (explain)", "___ معلم به من کمک کرد revise کنم. (explain)"), [lc("explanation", "explanation"), lc("explainful", "explainful"), lc("explainingly", "explainingly")], 0, lc("Explanation is the noun form.", "explanation فرم اسمی است.")),
      question(lc("The task requires careful ___. (analyse)", "تمرین به ___ دقیق نیاز دارد. (analyse)"), [lc("analysis", "analysis"), lc("analysingness", "analysingness"), lc("analysed", "analysed")], 0, lc("Analysis is the noun.", "analysis اسم درست است.")),
      question(lc("Choose the adjective: This feedback is ___.", "صفت را انتخاب کن: این feedback ___ است."), [lc("constructive", "constructive"), lc("construction", "construction"), lc("construct", "construct")], 0, lc("Constructive describes useful feedback.", "constructive بازخورد مفید را توصیف می‌کند.")),
    ],
  },
  {
    id: "c1-vocab-discourse",
    skill: "vocabulary",
    level: "C1",
    status: "ready",
    title: lc("Discourse markers for advanced answers", "discourse markerها برای جواب‌های پیشرفته"),
    description: lc("Use markers that organise argument rather than decorate it.", "markerهایی استفاده کن که استدلال را منظم کنند، نه فقط تزئین."),
    duration: lc("9 min", "۹ دقیقه"),
    format: lc("register practice", "تمرین register"),
    questions: [
      question(lc("Which phrase adds a cautious contrast?", "کدام عبارت تضاد محتاطانه اضافه می‌کند؟"), [lc("That said", "That said"), lc("In the same way", "In the same way"), lc("Randomly", "Randomly")], 0, lc("That said introduces a balanced contrast.", "That said تضاد متعادل وارد می‌کند.")),
      question(lc("Which phrase signals evidence?", "کدام عبارت نشانه evidence است؟"), [lc("According to the data", "According to the data"), lc("Maybe just because", "Maybe just because"), lc("Anyway", "Anyway")], 0, lc("According to the data points to evidence.", "According to the data به evidence اشاره می‌کند.")),
      question(lc("Choose the most academic transition.", "آکادمیک‌ترین transition را انتخاب کن."), [lc("Consequently", "Consequently"), lc("So yeah", "So yeah"), lc("Like whatever", "Like whatever")], 0, lc("Consequently signals a result in formal style.", "Consequently نتیجه را در سبک رسمی نشان می‌دهد.")),
    ],
  },
  {
    id: "b1-reading-study-systems",
    skill: "reading",
    level: "B1",
    status: "ready",
    title: lc("Reading: why small systems work", "ریدینگ: چرا سیستم‌های کوچک جواب می‌دهند"),
    description: lc("A short original reading with main idea, detail, and inference.", "یک ریدینگ کوتاه original با main idea، detail و inference."),
    duration: lc("10 min", "۱۰ دقیقه"),
    format: lc("short text + questions", "متن کوتاه + سؤال"),
    questions: [
      question(lc("Text: A learner who studies ten minutes every day often improves more than a learner who studies three hours once a month. What is the main idea?", "متن: زبان‌آموزی که هر روز ده دقیقه درس می‌خواند اغلب بیشتر از کسی پیشرفت می‌کند که ماهی یک بار سه ساعت درس می‌خواند. ایده اصلی چیست؟"), [lc("Consistency matters.", "ثبات مهم است."), lc("Long study is always better.", "مطالعه طولانی همیشه بهتر است."), lc("Monthly study is enough.", "ماهی یک بار کافی است.")], 0, lc("The text contrasts regular short practice with rare long practice.", "متن تمرین کوتاه منظم را با تمرین طولانی و نادر مقایسه می‌کند.")),
      question(lc("Which detail supports the main idea?", "کدام detail از ایده اصلی حمایت می‌کند؟"), [lc("ten minutes every day", "ده دقیقه هر روز"), lc("three hours once a month", "سه ساعت ماهی یک بار"), lc("no feedback", "بدون بازخورد")], 0, lc("Daily repetition creates the system.", "تکرار روزانه سیستم را می‌سازد.")),
      question(lc("What can we infer?", "چه چیزی می‌توان infer کرد؟"), [lc("A small routine can reduce forgetting.", "روتین کوچک می‌تواند فراموشی را کم کند."), lc("Practice should be random.", "تمرین باید تصادفی باشد."), lc("Feedback is useless.", "بازخورد بی‌فایده است.")], 0, lc("Regular contact with language helps memory.", "تماس منظم با زبان به حافظه کمک می‌کند.")),
    ],
  },
  {
    id: "b2-reading-ai-feedback",
    skill: "reading",
    level: "B2",
    status: "ready",
    title: lc("Reading: AI feedback with limits", "ریدینگ: بازخورد AI با محدودیت"),
    description: lc("Practise inference and writer attitude in an AI-learning text.", "inference و writer attitude را در متن AI-learning تمرین کن."),
    duration: lc("11 min", "۱۱ دقیقه"),
    format: lc("exam-style reading", "ریدینگ سبک آزمون"),
    questions: [
      question(lc("Text: AI feedback is useful when it helps a learner notice a pattern, but it becomes harmful when the learner stops making decisions. The writer mainly believes that AI should:", "متن: بازخورد AI وقتی مفید است که زبان‌آموز الگو را ببیند، اما وقتی زبان‌آموز تصمیم گرفتن را متوقف کند آسیب‌زا می‌شود. نظر اصلی نویسنده چیست؟"), [lc("support learner judgment", "از قضاوت زبان‌آموز پشتیبانی کند"), lc("replace the teacher completely", "کاملاً جای معلم را بگیرد"), lc("hide all mistakes", "همه خطاها را پنهان کند")], 0, lc("The writer supports AI as a thinking aid, not a replacement for judgment.", "نویسنده AI را کمک برای فکر کردن می‌داند، نه جایگزین قضاوت.")),
      question(lc("The word harmful is closest to:", "کلمه harmful نزدیک است به:"), [lc("damaging", "آسیب‌زننده"), lc("helpful", "کمک‌کننده"), lc("ordinary", "معمولی")], 0, lc("Harmful means causing damage.", "harmful یعنی آسیب‌زننده.")),
      question(lc("Which situation matches the warning?", "کدام موقعیت با هشدار متن می‌خواند؟"), [lc("A learner copies every correction without checking it.", "زبان‌آموز همه اصلاح‌ها را بدون چک کردن کپی می‌کند."), lc("A learner asks why an error happened.", "زبان‌آموز می‌پرسد چرا خطا رخ داده."), lc("A teacher reviews the draft with the learner.", "معلم draft را با زبان‌آموز مرور می‌کند.")], 0, lc("The warning is about passive copying.", "هشدار درباره کپی منفعلانه است.")),
    ],
  },
  {
    id: "c1-reading-argument-evidence",
    skill: "reading",
    level: "C1",
    status: "ready",
    title: lc("Reading: argument and evidence", "ریدینگ: استدلال و evidence"),
    description: lc("C1 reading choices for claim, evidence, and implication.", "انتخاب‌های C1 برای claim، evidence و implication."),
    duration: lc("12 min", "۱۲ دقیقه"),
    format: lc("advanced reading", "ریدینگ پیشرفته"),
    questions: [
      question(lc("Text: A platform may feel educational because it contains many lessons, yet its value depends on whether learners produce, revise, and remember. What is the implied criticism?", "متن: یک پلتفرم ممکن است آموزشی به نظر برسد چون درس‌های زیادی دارد، اما ارزشش به تولید، revision و یادآوری زبان‌آموز وابسته است. نقد ضمنی چیست؟"), [lc("Content volume alone is not enough.", "حجم محتوا به تنهایی کافی نیست."), lc("Lessons should be removed.", "درس‌ها باید حذف شوند."), lc("Memory is unrelated to learning.", "حافظه به یادگیری ربطی ندارد.")], 0, lc("The text questions content quantity without learner action.", "متن حجم محتوا بدون اقدام زبان‌آموز را زیر سؤال می‌برد.")),
      question(lc("Which word best captures the phrase produce, revise, and remember?", "کدام کلمه بهترین خلاصه produce, revise, remember است؟"), [lc("active learning", "یادگیری فعال"), lc("decoration", "تزئین"), lc("advertising", "تبلیغ")], 0, lc("Those actions show active learning.", "این کارها یادگیری فعال را نشان می‌دهند.")),
      question(lc("The tone is mostly:", "tone متن بیشتر چیست؟"), [lc("analytical", "تحلیلی"), lc("angry", "عصبانی"), lc("comic", "طنز")], 0, lc("The text evaluates conditions rather than attacking emotionally.", "متن شرایط را تحلیل می‌کند، نه حمله احساسی.")),
    ],
  },
  {
    id: "a2-listening-campus",
    skill: "listening",
    level: "A2",
    status: "ready",
    title: lc("Listening: campus message", "لیسنینگ: پیام دانشگاه"),
    description: lc("A transcript-based drill for notices, times, and actions.", "تمرین transcript برای اطلاعیه، زمان و action."),
    duration: lc("6 min", "۶ دقیقه"),
    format: lc("notice listening", "لیسنینگ اطلاعیه"),
    questions: [
      question(lc("Transcript: The writing workshop starts at 4:30 in Room 12. What time does it start?", "متن: workshop نوشتن ساعت 4:30 در اتاق 12 شروع می‌شود. کی شروع می‌شود؟"), [lc("4:30", "۴:۳۰"), lc("12:00", "۱۲:۰۰"), lc("3:40", "۳:۴۰")], 0, lc("The transcript says starts at 4:30.", "در متن آمده starts at 4:30.")),
      question(lc("Where is the workshop?", "workshop کجاست؟"), [lc("Room 12", "اتاق ۱۲"), lc("Library desk", "میز کتابخانه"), lc("Online only", "فقط آنلاین")], 0, lc("The place is Room 12.", "مکان Room 12 است.")),
      question(lc("The message is mainly about:", "پیام بیشتر درباره چیست؟"), [lc("an academic workshop", "یک workshop آکادمیک"), lc("a sports match", "مسابقه ورزشی"), lc("a restaurant menu", "منوی رستوران")], 0, lc("Writing workshop is an academic event.", "writing workshop یک رویداد آموزشی است.")),
    ],
  },
  {
    id: "b2-listening-lecture-notes",
    skill: "listening",
    level: "B2",
    status: "ready",
    title: lc("Listening: mini lecture notes", "لیسنینگ: نت‌برداری از mini lecture"),
    description: lc("Practise gist, detail, and function from a lecture-style transcript.", "gist، detail و function را از transcript سبک lecture تمرین کن."),
    duration: lc("10 min", "۱۰ دقیقه"),
    format: lc("lecture-style task", "تمرین سبک lecture"),
    questions: [
      question(lc("Transcript: Spaced review works because memory weakens over time, and planned returns make the item easier to retrieve. What is the lecture about?", "متن: مرور فاصله‌دار کار می‌کند چون حافظه با زمان ضعیف می‌شود و برگشت‌های برنامه‌ریزی‌شده بازیابی را آسان‌تر می‌کند. lecture درباره چیست؟"), [lc("spaced review", "مرور فاصله‌دار"), lc("school buildings", "ساختمان مدرسه"), lc("food habits", "عادات غذایی")], 0, lc("The key phrase is spaced review.", "عبارت کلیدی spaced review است.")),
      question(lc("Why do planned returns help?", "چرا برگشت‌های برنامه‌ریزی‌شده کمک می‌کنند؟"), [lc("They make recall easier.", "بازیابی را آسان‌تر می‌کنند."), lc("They remove all effort.", "همه تلاش را حذف می‌کنند."), lc("They replace sleep.", "جای خواب را می‌گیرند.")], 0, lc("The transcript says easier to retrieve.", "در متن آمده easier to retrieve.")),
      question(lc("The speaker's purpose is to:", "هدف گوینده چیست؟"), [lc("explain a learning method", "توضیح یک روش یادگیری"), lc("tell a joke", "گفتن joke"), lc("sell a phone", "فروش تلفن")], 0, lc("The language is explanatory.", "زبان متن توضیحی است.")),
    ],
  },
  {
    id: "b1-use-cloze-learning",
    skill: "use-of-english",
    level: "B1",
    status: "ready",
    title: lc("Multiple-choice cloze: learning habits", "multiple-choice cloze: عادت‌های یادگیری"),
    description: lc("A short cloze test for grammar and vocabulary together.", "یک cloze کوتاه برای گرامر و واژگان با هم."),
    duration: lc("8 min", "۸ دقیقه"),
    format: lc("cloze test", "cloze test"),
    questions: [
      question(lc("Good learners do not wait ___ motivation; they build routines.", "زبان‌آموزهای خوب منتظر motivation نمی‌مانند؛ routine می‌سازند."), [lc("for", "for"), lc("at", "at"), lc("over", "over")], 0, lc("Wait for is the correct collocation.", "collocation درست wait for است.")),
      question(lc("A review queue helps you remember items ___ you got wrong.", "review queue کمک می‌کند آیتم‌هایی را به خاطر بسپاری که اشتباه زدی."), [lc("which", "which"), lc("where", "where"), lc("whose", "whose")], 0, lc("Which refers to items.", "which به items برمی‌گردد.")),
      question(lc("Feedback should be specific ___ general praise.", "feedback باید مشخص باشد نه تعریف کلی."), [lc("rather than", "rather than"), lc("because of", "because of"), lc("as long as", "as long as")], 0, lc("Rather than creates the contrast.", "rather than تضاد را می‌سازد.")),
    ],
  },
  {
    id: "b2-use-open-cloze",
    skill: "use-of-english",
    level: "B2",
    status: "ready",
    title: lc("Open cloze logic: tiny function words", "open cloze logic: کلمات کوچک کاربردی"),
    description: lc("Practise the grammar logic behind missing function words.", "منطق گرامری پشت function wordهای حذف‌شده را تمرین کن."),
    duration: lc("9 min", "۹ دقیقه"),
    format: lc("function-word choices", "انتخاب function word"),
    questions: [
      question(lc("The more you revise, ___ easier retrieval becomes.", "هرچه بیشتر revise کنی، retrieval آسان‌تر می‌شود."), [lc("the", "the"), lc("a", "a"), lc("than", "than")], 0, lc("The more..., the easier... is a fixed comparative pattern.", "الگوی ثابت comparative این است: the more..., the easier...")),
      question(lc("I would rather practise for ten minutes ___ watch another passive lesson.", "ترجیح می‌دهم ده دقیقه تمرین کنم تا یک درس passive دیگر ببینم."), [lc("than", "than"), lc("that", "that"), lc("to", "to")], 0, lc("Would rather takes than for contrast.", "would rather برای تضاد than می‌گیرد.")),
      question(lc("The answer depends ___ the exact question.", "جواب به سؤال دقیق بستگی دارد."), [lc("on", "on"), lc("in", "in"), lc("with", "with")], 0, lc("Depend on is the correct phrase.", "عبارت درست depend on است.")),
    ],
  },
  {
    id: "c1-use-register",
    skill: "use-of-english",
    level: "C1",
    status: "ready",
    title: lc("Register repair: formal, neutral, casual", "اصلاح register: رسمی، neutral، casual"),
    description: lc("Choose language that fits exam writing and professional messages.", "زبانی انتخاب کن که به writing آزمونی و پیام حرفه‌ای بخورد."),
    duration: lc("10 min", "۱۰ دقیقه"),
    format: lc("register decisions", "تصمیم‌های register"),
    questions: [
      question(lc("Best formal replacement for 'This idea is kind of useful':", "جایگزین رسمی برای 'This idea is kind of useful':"), [lc("This idea is moderately useful.", "This idea is moderately useful."), lc("This idea is like okay.", "This idea is like okay."), lc("This idea is whatever useful.", "This idea is whatever useful.")], 0, lc("Moderately is formal and precise.", "moderately رسمی و دقیق است.")),
      question(lc("Best professional email line:", "بهترین جمله برای email حرفه‌ای:"), [lc("I would be grateful if you could confirm the time.", "I would be grateful if you could confirm the time."), lc("Tell me the time now.", "Tell me the time now."), lc("Yo, time?", "Yo, time?")], 0, lc("The first line is polite and professional.", "جمله اول مودبانه و حرفه‌ای است.")),
      question(lc("Which phrase is too casual for IELTS Task 2?", "کدام عبارت برای IELTS Task 2 بیش از حد casual است؟"), [lc("to be honest, it's super cool", "to be honest, it's super cool"), lc("it can be argued that", "it can be argued that"), lc("one possible consequence is", "one possible consequence is")], 0, lc("Super cool is informal and vague.", "super cool غیررسمی و مبهم است.")),
    ],
  },
  {
    id: "a2-writing-email",
    skill: "writing",
    level: "A2",
    status: "ready",
    title: lc("Write a short class email", "نوشتن email کوتاه کلاسی"),
    description: lc("Choose useful lines for a polite A2 email.", "جمله‌های مفید برای email مودبانه سطح A2."),
    duration: lc("8 min", "۸ دقیقه"),
    format: lc("email builder", "email builder"),
    questions: [
      question(lc("Best opening:", "بهترین شروع:"), [lc("Dear Teacher,", "Dear Teacher,"), lc("Hey random person,", "Hey random person,"), lc("No hello", "بدون سلام")], 0, lc("Dear Teacher is polite and clear.", "Dear Teacher مودبانه و روشن است.")),
      question(lc("Best request:", "بهترین درخواست:"), [lc("Could you please send the homework?", "Could you please send the homework?"), lc("Send homework now.", "Send homework now."), lc("Where homework??", "Where homework??")], 0, lc("Could you please is polite.", "Could you please مودبانه است.")),
      question(lc("Best closing:", "بهترین پایان:"), [lc("Best regards,", "Best regards,"), lc("bye lol", "bye lol"), lc("nothing", "هیچ چیز")], 0, lc("Best regards is a suitable closing.", "Best regards پایان مناسب است.")),
    ],
  },
  {
    id: "b2-writing-ielts-task2",
    skill: "writing",
    level: "B2",
    status: "ready",
    title: lc("IELTS-style Task 2 paragraph", "پاراگراف سبک IELTS Task 2"),
    description: lc("Build a claim, reason, example, and mini-conclusion.", "claim، reason، example و mini-conclusion بساز."),
    duration: lc("13 min", "۱۳ دقیقه"),
    format: lc("paragraph builder", "سازنده پاراگراف"),
    questions: [
      question(lc("Best claim:", "بهترین claim:"), [lc("Online education can be effective when feedback is frequent.", "Online education can be effective when feedback is frequent."), lc("Online education good maybe.", "Online education good maybe."), lc("I like phones.", "I like phones.")], 0, lc("A strong claim is clear and limited.", "claim قوی روشن و محدود است.")),
      question(lc("Best example phrase:", "بهترین phrase برای مثال:"), [lc("For instance, a learner can record pronunciation weekly.", "For instance, a learner can record pronunciation weekly."), lc("Because however therefore.", "Because however therefore."), lc("No example needed.", "No example needed.")], 0, lc("For instance introduces a specific example.", "For instance مثال مشخص معرفی می‌کند.")),
      question(lc("Best final sentence:", "بهترین جمله پایانی:"), [lc("Therefore, feedback turns online study into a guided process.", "Therefore, feedback turns online study into a guided process."), lc("So done.", "So done."), lc("The end no idea.", "The end no idea.")], 0, lc("The sentence returns to the main argument.", "جمله به استدلال اصلی برمی‌گردد.")),
    ],
  },
  {
    id: "c1-writing-cae-proposal",
    skill: "writing",
    level: "C1",
    status: "ready",
    title: lc("CAE-style proposal planning", "برنامه‌ریزی proposal سبک CAE"),
    description: lc("Choose headings, recommendations, and formal rationale.", "heading، recommendation و rationale رسمی انتخاب کن."),
    duration: lc("14 min", "۱۴ دقیقه"),
    format: lc("proposal planner", "برنامه proposal"),
    questions: [
      question(lc("Best proposal heading:", "بهترین heading برای proposal:"), [lc("Recommendation: Weekly Speaking Clinic", "Recommendation: Weekly Speaking Clinic"), lc("My random thoughts", "My random thoughts"), lc("Stuff", "Stuff")], 0, lc("A proposal heading should be informative.", "heading proposal باید informative باشد.")),
      question(lc("Best formal recommendation:", "بهترین recommendation رسمی:"), [lc("I recommend introducing a short weekly clinic.", "I recommend introducing a short weekly clinic."), lc("Let's just do something.", "Let's just do something."), lc("Maybe whatever is okay.", "Maybe whatever is okay.")], 0, lc("The first option is specific and formal.", "گزینه اول مشخص و رسمی است.")),
      question(lc("Best rationale:", "بهترین rationale:"), [lc("This would give learners regular speaking evidence and targeted correction.", "This would give learners regular speaking evidence and targeted correction."), lc("It is cool.", "It is cool."), lc("Because I said so.", "Because I said so.")], 0, lc("A strong rationale explains the benefit.", "rationale قوی فایده را توضیح می‌دهد.")),
    ],
  },
  {
    id: "b1-exam-cambridge-b1",
    skill: "exams",
    level: "B1",
    status: "ready",
    title: lc("Cambridge B1 Preliminary habits", "عادت‌های Cambridge B1 Preliminary"),
    description: lc("Practise task reading, distractors, and answer evidence.", "task reading، distractor و evidence جواب را تمرین کن."),
    duration: lc("8 min", "۸ دقیقه"),
    format: lc("exam strategy", "استراتژی آزمون"),
    questions: [
      question(lc("In a B1 reading task, a distractor often:", "در B1 reading، distractor اغلب:"), [lc("uses a word from the text but changes the meaning", "کلمه‌ای از متن می‌آورد اما معنا را عوض می‌کند"), lc("is always the shortest answer", "همیشه کوتاه‌ترین جواب است"), lc("has no connection to the text", "هیچ ربطی به متن ندارد")], 0, lc("Many distractors are partly connected but meaningfully wrong.", "بسیاری distractorها تا حدی مرتبط اما از نظر معنا غلط‌اند.")),
      question(lc("Before choosing an answer, you should:", "قبل از انتخاب جواب باید:"), [lc("find evidence in the text", "evidence را در متن پیدا کنی"), lc("choose by feeling only", "فقط با حس انتخاب کنی"), lc("ignore names and numbers", "اسم‌ها و عددها را نادیده بگیری")], 0, lc("Evidence-based answers are safer.", "جواب مبتنی بر evidence امن‌تر است.")),
      question(lc("Which habit improves writing Part 1?", "کدام عادت writing Part 1 را بهتر می‌کند؟"), [lc("answer every bullet point", "به همه bullet pointها جواب بدهی"), lc("write one unrelated story", "یک داستان بی‌ربط بنویسی"), lc("avoid planning", "برنامه‌ریزی نکنی")], 0, lc("Cambridge tasks reward covering all required points.", "تسک‌های Cambridge پوشش همه نکات لازم را ارزشمند می‌دانند.")),
    ],
  },
  {
    id: "b2-exam-ielts-toefl-reading",
    skill: "exams",
    level: "B2",
    status: "ready",
    title: lc("IELTS/TOEFL reading decisions", "تصمیم‌های ریدینگ IELTS/TOEFL"),
    description: lc("Use evidence, inference, and vocabulary-in-context strategies.", "از evidence، inference و vocabulary-in-context استفاده کن."),
    duration: lc("11 min", "۱۱ دقیقه"),
    format: lc("exam strategy + quiz", "استراتژی آزمون + کوئیز"),
    questions: [
      question(lc("A vocabulary-in-context question asks you to:", "سؤال vocabulary-in-context از تو می‌خواهد:"), [lc("use nearby meaning, not only memory", "از معنای اطراف استفاده کنی، نه فقط حافظه"), lc("translate every word first", "اول همه کلمات را ترجمه کنی"), lc("ignore the sentence", "جمله را نادیده بگیری")], 0, lc("Context controls the meaning.", "context معنا را کنترل می‌کند.")),
      question(lc("For inference questions, the answer should be:", "برای inference question، جواب باید:"), [lc("supported by the text but not copied word-for-word", "با متن پشتیبانی شود اما کلمه‌به‌کلمه کپی نباشد"), lc("a personal opinion", "نظر شخصی باشد"), lc("the most dramatic option", "دراماتیک‌ترین گزینه باشد")], 0, lc("Inference stays text-based.", "inference همچنان text-based است.")),
      question(lc("When two answers look possible, first check:", "وقتی دو جواب ممکن به نظر می‌رسند، اول چک کن:"), [lc("which one has exact evidence", "کدام evidence دقیق دارد"), lc("which one is longer", "کدام طولانی‌تر است"), lc("which one sounds nicer", "کدام قشنگ‌تر است")], 0, lc("Exact evidence beats impression.", "evidence دقیق از impression مهم‌تر است.")),
    ],
  },
  {
    id: "c1-exam-gre-gmat-verbal",
    skill: "exams",
    level: "C1",
    status: "ready",
    title: lc("GRE/GMAT verbal logic", "منطق verbal در GRE/GMAT"),
    description: lc("Practise precision, assumption, and trap-answer awareness.", "دقت، assumption و trap answer را تمرین کن."),
    duration: lc("12 min", "۱۲ دقیقه"),
    format: lc("verbal reasoning", "verbal reasoning"),
    questions: [
      question(lc("A critical reasoning assumption is:", "assumption در critical reasoning یعنی:"), [lc("an unstated idea the argument needs", "ایده بیان‌نشده‌ای که استدلال به آن نیاز دارد"), lc("a random example", "مثال تصادفی"), lc("the longest sentence", "طولانی‌ترین جمله")], 0, lc("Arguments often depend on hidden assumptions.", "استدلال‌ها اغلب به assumption پنهان وابسته‌اند.")),
      question(lc("A trap answer often:", "trap answer اغلب:"), [lc("sounds related but changes the logical task", "مرتبط به نظر می‌رسد اما task منطقی را عوض می‌کند"), lc("is always grammatically wrong", "همیشه از نظر گرامر غلط است"), lc("has no vocabulary", "هیچ واژگانی ندارد")], 0, lc("Trap answers are attractive because they are partly related.", "trap answer چون تا حدی مرتبط است جذاب می‌شود.")),
      question(lc("For sentence equivalence, both answers must:", "در sentence equivalence، هر دو جواب باید:"), [lc("create the same overall meaning", "معنای کلی یکسان بسازند"), lc("start with the same letter", "با یک حرف شروع شوند"), lc("be the easiest words", "آسان‌ترین کلمات باشند")], 0, lc("The pair must produce equivalent sentence meaning.", "جفت جواب باید معنای جمله را معادل کند.")),
    ],
  },
  {
    id: "a1-level-foundation",
    skill: "level-test",
    level: "A1",
    status: "ready",
    title: lc("A1 foundation diagnostic", "تشخیص پایه A1"),
    description: lc("Check core be, present simple, and classroom vocabulary.", "be، حال ساده و واژگان کلاس را چک کن."),
    duration: lc("6 min", "۶ دقیقه"),
    format: lc("mini diagnostic", "تشخیص کوچک"),
    questions: [
      question(lc("He ___ from Tehran.", "او اهل تهران ___."), [lc("is", "is"), lc("are", "are"), lc("have", "have")], 0, lc("He takes is.", "با he از is استفاده می‌کنیم.")),
      question(lc("I ___ English on Mondays.", "دوشنبه‌ها انگلیسی ___."), [lc("study", "study"), lc("studies", "studies"), lc("studying", "studying")], 0, lc("I takes the base verb.", "با I فعل ساده می‌آید.")),
      question(lc("A notebook is used for:", "notebook برای چیست؟"), [lc("writing notes", "نوشتن یادداشت"), lc("driving", "رانندگی"), lc("cooking rice", "پختن برنج")], 0, lc("A notebook is for notes.", "notebook برای یادداشت است.")),
    ],
  },
  {
    id: "b2-level-upper-check",
    skill: "level-test",
    level: "B2",
    status: "ready",
    title: lc("B2 upper-intermediate check", "چک سطح B2"),
    description: lc("A compact diagnostic for connectors, passive, and inference.", "تشخیص فشرده برای connector، passive و inference."),
    duration: lc("8 min", "۸ دقیقه"),
    format: lc("diagnostic quiz", "کوئیز تشخیصی"),
    questions: [
      question(lc("___ the lesson was short, it changed my plan.", "با اینکه درس کوتاه بود، برنامه‌ام را تغییر داد."), [lc("Although", "Although"), lc("Because", "Because"), lc("In addition", "In addition")], 0, lc("Although creates contrast.", "Although تضاد می‌سازد.")),
      question(lc("The drafts ___ every Friday.", "draftها هر جمعه بررسی می‌شوند."), [lc("are reviewed", "are reviewed"), lc("review", "review"), lc("reviewing", "reviewing")], 0, lc("Drafts receive the action, so passive fits.", "draftها عمل را دریافت می‌کنند، پس passive مناسب است.")),
      question(lc("If a text says practice is useful only with feedback, we can infer that:", "اگر متن بگوید تمرین فقط با feedback مفید است، می‌توان infer کرد:"), [lc("practice without feedback may be less effective", "تمرین بدون feedback ممکن است کمتر مؤثر باشد"), lc("feedback is always harmful", "feedback همیشه مضر است"), lc("practice should stop", "تمرین باید متوقف شود")], 0, lc("The inference follows the condition in the text.", "inference از شرط داخل متن می‌آید.")),
    ],
  },
];

export const labModules: LabModule[] = [
  ...labModuleSeeds.filter((module) => module.status === "ready"),
  ...originalPracticeModules,
  ...labModuleSeeds.filter((module) => module.status === "upcoming"),
];

export const englishLabStats = {
  readyModules: labModules.filter((module) => module.status === "ready").length,
  questions: labModules.reduce((total, module) => total + module.questions.length, 0),
  levels: englishLevels.length,
  skills: skillTracks.length,
};

export const defaultLabModule = labModules.find((item) => item.status === "ready") ?? labModules[0];
