import { siteConfig } from "@/lib/site";

function safeJson(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function StructuredData() {
  const base = siteConfig.canonicalUrl;
  const sameAs = [siteConfig.contact.telegram.href, siteConfig.contact.instagram.href, siteConfig.contact.bale.href];
  const logo = `${base}/icons/edupocket-mark.svg`;
  const serviceArea = siteConfig.teacherProfile.regions.map((name) => ({ "@type": "Place", name }));
  const teachingServiceNames = [...siteConfig.teacherProfile.examPrep, ...siteConfig.teacherProfile.globalLanguageExams, ...siteConfig.teacherProfile.specializedEnglish];
  const teachingServices = teachingServiceNames.map((name, index) => ({
    "@type": "Offer",
    position: index + 1,
    itemOffered: {
      "@type": "Service",
      name: `${name} coaching with Ali Rad`,
      serviceType: "Online English tutoring and exam preparation",
      provider: {
        "@id": `${base}/#person`,
      },
      areaServed: serviceArea,
      availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: `${base}/about`,
      },
    },
  }));
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
        { "@type": "Audience", audienceType: "IELTS, TOEFL, Cambridge English, PTE, Duolingo, TOEIC, OET, LanguageCert, CELPIP, CAEL, GRE, GMAT, SAT, ACT, MSRT, TOLIMO, and EPT candidates" },
        { "@type": "Audience", audienceType: "Professionals looking for specialized English and English for Specific Purposes" },
        { "@type": "Audience", audienceType: "Parents looking for FCE and teen English support" },
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
      jobTitle: siteConfig.teacherProfile.role,
      description:
        "Cambridge CELTA-qualified English teacher with 15+ years of teaching experience in IELTS, TOEFL, Cambridge English, FCE/B2 First, PTE, Duolingo, TOEIC, OET, GRE, GMAT, specialized English, academic English, business English, and AI-assisted learning systems.",
      worksFor: {
        "@id": `${base}/#organization`,
      },
      sameAs,
      hasCredential: [
        {
          "@type": "EducationalOccupationalCredential",
          name: "Cambridge CELTA",
          credentialCategory: "English language teaching certificate",
          recognizedBy: {
            "@type": "Organization",
            name: "Cambridge English",
          },
        },
      ],
      knowsAbout: [...siteConfig.topics, ...teachingServiceNames],
      knowsLanguage: ["English", "Persian", "Arabic"],
      areaServed: serviceArea,
      makesOffer: {
        "@id": `${base}/#english-coaching-services`,
      },
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
      areaServed: serviceArea,
      makesOffer: {
        "@id": `${base}/#english-coaching-services`,
      },
      sameAs,
    },
    {
      "@context": "https://schema.org",
      "@type": "OfferCatalog",
      "@id": `${base}/#english-coaching-services`,
      name: "Ali Rad online English tutoring and exam preparation",
      description:
        "Online English coaching for IELTS Academic and General, TOEFL iBT, TOEFL Essentials, TOEFL ITP, Cambridge English KET, PET, FCE/B2 First, CAE/C1 Advanced, CPE/C2 Proficiency, YLE, Linguaskill, PTE Academic, PTE Core, Duolingo English Test, TOEIC, OET, LanguageCert, Oxford Test of English, CELPIP, CAEL, MSRT, TOLIMO, EPT, GRE Verbal, GMAT Verbal, SAT English, ACT English, AP English, specialized English, academic writing, business English, kids English, and teen English.",
      itemListElement: teachingServices,
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
