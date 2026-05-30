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
  faTagline: "سیستم های یادگیری عملی برای انگلیسی، هوش مصنوعی، تدریس و تکنولوژی.",
  description:
    "EduPocket is Ali Rad's library of practical notes, teaching systems, AI experiments, language-learning frameworks, and audio lessons.",
  faDescription:
    "EduPocket کتابخانه علی راد برای یادداشت های کاربردی، سیستم های تدریس، تجربه های هوش مصنوعی، چارچوب های یادگیری زبان و درس های صوتی است.",
  author: "Ali Esfandiari Rad",
  shortAuthor: "Ali Rad",
  url: productionUrl(),
  contactEmail: "aliesfandiari@outlook.com",
  contact: {
    telegram: {
      label: "Telegram",
      faLabel: "تلگرام",
      handle: "@esfandiari_Rad",
      href: "https://t.me/esfandiari_Rad",
    },
    instagram: {
      label: "Instagram",
      faLabel: "اینستاگرام",
      handle: "@esfandiari_RAD",
      href: "https://www.instagram.com/esfandiari_RAD/",
    },
    bale: {
      label: "Bale",
      faLabel: "بله",
      handle: "@ali_esfandiari",
      href: "https://ble.ir/ali_esfandiari",
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
  nav: [
    { href: "/", label: "Home", faLabel: "خانه" },
    { href: "/articles", label: "Articles", faLabel: "مقاله ها" },
    { href: "/lessons", label: "Lessons", faLabel: "درس ها" },
    { href: "/english-lab", label: "English Lab", faLabel: "آزمایشگاه زبان" },
    { href: "/podcasts", label: "Podcasts", faLabel: "پادکست ها" },
    { href: "/about", label: "About", faLabel: "درباره" },
  ],
} as const;

export type SiteTopic = (typeof siteConfig.topics)[number];
