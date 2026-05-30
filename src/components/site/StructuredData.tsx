import { siteConfig } from "@/lib/site";

function safeJson(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function StructuredData() {
  const base = siteConfig.canonicalUrl;
  const sameAs = [siteConfig.contact.telegram.href, siteConfig.contact.instagram.href, siteConfig.contact.bale.href];
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${base}/#website`,
      name: siteConfig.name,
      url: base,
      description: siteConfig.description,
      inLanguage: ["en", "fa"],
      publisher: {
        "@id": `${base}/#person`,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${base}/#person`,
      name: siteConfig.author,
      alternateName: siteConfig.shortAuthor,
      url: `${base}/about`,
      email: siteConfig.contactEmail,
      jobTitle: "English teacher, AI learning-system builder, and education technologist",
      sameAs,
      knowsAbout: siteConfig.topics,
    },
    {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "@id": `${base}/#organization`,
      name: "Blue Rose Academy",
      url: base,
      founder: {
        "@id": `${base}/#person`,
      },
      sameAs,
    },
  ];

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(data) }} />;
}
