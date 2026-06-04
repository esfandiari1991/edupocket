import type { Metadata } from "next";
import { EvaBookletGateway } from "@/components/eva/EvaBookletGateway";
import { evaPublicOffer } from "@/lib/eva-public";
import { siteConfig } from "@/lib/site";

function safeJson(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function EvaProductStructuredData() {
  const base = siteConfig.canonicalUrl;
  const pageUrl = `${base}/eva-digital-booklet`;
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${pageUrl}#product`,
    name: "Eva Digital Booklet",
    description: evaPublicOffer.description.en,
    image: `${base}/images/eva/eva-digital-booklet-study.jpg`,
    url: pageUrl,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    creator: {
      "@id": `${base}/#person`,
    },
    isPartOf: {
      "@id": `${base}/#website`,
    },
    category: "Digital educational booklet",
    audience: [
      { "@type": "Audience", audienceType: "IELTS learners" },
      { "@type": "Audience", audienceType: "TOEFL learners" },
      { "@type": "Audience", audienceType: "English writing learners" },
    ],
    offers: {
      "@type": "Offer",
      url: pageUrl,
      price: "4.99",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      seller: {
        "@id": `${base}/#organization`,
      },
    },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(data) }} />;
}

export const metadata: Metadata = {
  title: "Eva Digital Booklet by Ali Rad",
  description: "Ali Rad's first official digital study product inside EduPocket: a private Eva Digital Booklet gateway for structured IELTS, TOEFL, reading, writing, grammar, lexical resource, pronunciation, and ministry-English practice.",
  keywords: ["Eva Digital Booklet", "IELTS writing practice", "TOEFL reading practice", "IELTS reading practice", "TOEFL writing practice", "premium English booklet", "EduPocket", "digital English booklet", "grammar practice", "lexical resource", "pronunciation lab"],
  alternates: {
    canonical: "/eva-digital-booklet",
  },
  openGraph: {
    title: "Eva Digital Booklet | EduPocket",
    description: "Ali Rad's first official digital study product inside EduPocket: structured IELTS/TOEFL-style reading, writing, grammar, lexical resource, pronunciation, and review practice in a premium-member study portal.",
    url: "/eva-digital-booklet",
    images: [
      {
        url: "/images/eva/eva-digital-booklet-study.jpg",
        width: 920,
        height: 824,
        alt: "Eva Digital Booklet study preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eva Digital Booklet | EduPocket",
    description: "Ali Rad's first official digital study product inside EduPocket: structured IELTS/TOEFL-style reading, writing, grammar, lexical resource, pronunciation, and review practice in a premium-member study portal.",
    images: ["/images/eva/eva-digital-booklet-study.jpg"],
  },
};

type EvaBookletPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function EvaBookletPage({ searchParams }: EvaBookletPageProps) {
  const params = await searchParams;

  return (
    <>
      <EvaProductStructuredData />
      <EvaBookletGateway loginError={params.error} />
    </>
  );
}
