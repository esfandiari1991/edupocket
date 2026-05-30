function productionUrl() {
  const explicitUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const vercelUrl = process.env.VERCEL_URL;
  const url = explicitUrl ?? vercelProductionUrl ?? vercelUrl;

  if (!url) return "http://localhost:3000";
  return url.startsWith("http") ? url : `https://${url}`;
}

export const siteConfig = {
  name: "EduPocket",
  tagline: "Practical learning systems for English, AI, teaching, and technology.",
  description:
    "EduPocket is Ali Rad's library of practical notes, teaching systems, AI experiments, language-learning frameworks, and audio lessons.",
  author: "Ali Esfandiari Rad",
  shortAuthor: "Ali Rad",
  url: productionUrl(),
  contactEmail: "aliesfandiari@outlook.com",
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
    { href: "/", label: "Home" },
    { href: "/articles", label: "Articles" },
    { href: "/lessons", label: "Lessons" },
    { href: "/podcasts", label: "Podcasts" },
    { href: "/about", label: "About" },
  ],
} as const;

export type SiteTopic = (typeof siteConfig.topics)[number];
