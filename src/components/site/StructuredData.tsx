import { siteConfig } from "@/lib/site";

function safeJson(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function StructuredData() {
  const base = siteConfig.canonicalUrl;
  const sameAs = [siteConfig.contact.telegram.href, siteConfig.contact.instagram.href, siteConfig.contact.bale.href];
  const logo = `${base}/icons/edupocket-mark.svg`;
  const primaryPages = [
    { name: "Eva Digital Booklet by Ali Rad", url: `${base}/eva-digital-booklet`, description: "Ali Rad's first official digital study product inside EduPocket: private IELTS and TOEFL-style reading and writing practice." },
    { name: "English Lab", url: `${base}/english-lab`, description: "Interactive English practice for grammar, vocabulary, reading, listening, writing, exams, and level checks." },
    { name: "Articles", url: `${base}/articles`, description: "Practical notes about AI learning, teaching systems, study habits, and technology." },
    { name: "Lessons", url: `${base}/lessons`, description: "Short micro-lessons for English, IELTS, TOEFL, study skills, and AI learning." },
    { name: "Podcasts", url: `${base}/podcasts`, description: "Audio lessons and podcast notes for English, AI, learning systems, and teaching." },
    { name: "About Ali Rad", url: `${base}/about`, description: "Profile page for Ali Esfandiari Rad, the teacher and builder behind EduPocket." },
  ];

  const data = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${base}/#website`,
      name: siteConfig.name,
      alternateName: ["Edu Pocket", "EduPocket by Ali Rad"],
      url: base,
      description: siteConfig.description,
      inLanguage: ["en", "fa"],
      author: {
        "@id": `${base}/#person`,
      },
      publisher: {
        "@id": `${base}/#organization`,
      },
      about: siteConfig.topics.map((topic) => ({
        "@type": "Thing",
        name: topic,
      })),
      audience: [
        { "@type": "Audience", audienceType: "English learners" },
        { "@type": "Audience", audienceType: "Teachers" },
        { "@type": "Audience", audienceType: "AI builders" },
        { "@type": "Audience", audienceType: "Self-learners" },
      ],
      hasPart: primaryPages.map((page) => ({
        "@type": "WebPage",
        name: page.name,
        url: page.url,
        description: page.description,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${base}/#webpage`,
      url: base,
      name: `${siteConfig.name} - English, AI, and practical learning systems`,
      description: siteConfig.description,
      isPartOf: {
        "@id": `${base}/#website`,
      },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${base}/opengraph-image`,
      },
      about: {
        "@id": `${base}/#person`,
      },
      inLanguage: ["en", "fa"],
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${base}/#person`,
      name: siteConfig.author,
      alternateName: siteConfig.shortAuthor,
      url: `${base}/about`,
      image: `${base}/images/ali-rad-profile.jpg`,
      email: siteConfig.contactEmail,
      jobTitle: "English teacher, AI learning-system builder, and education technologist",
      worksFor: {
        "@id": `${base}/#organization`,
      },
      sameAs,
      knowsAbout: siteConfig.topics,
      knowsLanguage: ["English", "Persian", "Arabic"],
    },
    {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "@id": `${base}/#organization`,
      name: "Blue Rose Academy",
      url: base,
      logo: {
        "@type": "ImageObject",
        url: logo,
      },
      founder: {
        "@id": `${base}/#person`,
      },
      sameAs,
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${base}/#primary-learning-paths`,
      name: "EduPocket primary learning paths",
      itemListElement: primaryPages.map((page, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: page.name,
        url: page.url,
      })),
    },
  ];

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(data) }} />;
}
