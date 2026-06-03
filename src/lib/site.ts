function productionUrl() {
  const explicitUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const vercelUrl = process.env.VERCEL_URL;
  const url = (explicitUrl ?? vercelProductionUrl ?? vercelUrl)?.trim();

  if (!url) return "https://edupocket.org";
  return (url.startsWith("http") ? url : `https://${url}`).replace(/\/$/, "");
}

export const siteConfig = {
  name: "EduPocket",
  tagline: "Practical learning systems for English, AI, teaching, and technology.",
  faTagline: "سیستم‌های یادگیری کاربردی برای انگلیسی، هوش مصنوعی، تدریس و تکنولوژی.",
  description:
    "EduPocket is Ali Rad's library of practical notes, teaching systems, AI experiments, language-learning frameworks, and audio lessons.",
  faDescription:
    "EduPocket کتابخانه علی راد برای یادداشت‌های کاربردی، سیستم‌های تدریس، تجربه‌های هوش مصنوعی، چارچوب‌های یادگیری زبان و درس‌های صوتی است.",
  author: "Ali Esfandiari Rad",
  shortAuthor: "Ali Rad",
  url: productionUrl(),
  canonicalUrl: "https://edupocket.org",
  contactEmail: "aliesfandiari@outlook.com",
  contact: {
    telegram: {
      label: "Telegram",
      faLabel: "تلگرام",
      handle: "@esfandiari_Rad",
      href: "https://t.me/esfandiari_Rad",
    },
    instagram: {
      label: "insta",
      faLabel: "insta",
      handle: "@esfandiari_RAD",
      href: "https://www.instagram.com/esfandiari_RAD/",
    },
    bale: {
      label: "Bale",
      faLabel: "بله",
      handle: "@esfandiari_1991",
      href: "https://ble.ir/esfandiari_1991",
    },
    email: {
      label: "Email",
      faLabel: "ایمیل",
      handle: "aliesfandiari@outlook.com",
      href: "mailto:aliesfandiari@outlook.com?subject=EduPocket%20Direct%20Message",
    },
  },
  topics: [
    "AI Learning",
    "English Teaching",
    "IELTS & TOEFL",
    "KET",
    "Business English",
    "Study Systems",
    "Programming",
    "SQL",
    "Python",
    "Arabic & Languages",
    "Teaching Frameworks",
    "Mini Apps",
    "Book Summaries",
    "Podcasts",
  ],
  seoKeywords: [
    "EduPocket",
    "Ali Esfandiari Rad",
    "Ali Rad",
    "English coaching",
    "AI learning systems",
    "Persian English learning",
    "English test practice",
    "online English tutor",
    "AI-assisted English learning",
    "IELTS TOEFL lessons",
    "study systems",
    "micro lessons",
    "education technology",
    "language learning",
    "Blue Rose Academy",
    "Eva Digital Booklet",
    "digital English booklet",
  ],
  nav: [
    { href: "/", label: "Home", faLabel: "خانه" },
    { href: "/articles", label: "Articles", faLabel: "مقاله‌ها" },
    { href: "/lessons", label: "Lessons", faLabel: "درس‌ها" },
    { href: "/english-lab", label: "English Lab", faLabel: "آزمایشگاه زبان" },
    { href: "/podcasts", label: "Podcasts", faLabel: "پادکست‌ها" },
    { href: "/about", label: "About", faLabel: "درباره" },
  ],
} as const;

export type SiteTopic = (typeof siteConfig.topics)[number];
