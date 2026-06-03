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
  title: "Eva Digital Booklet by EduPocket",
  description: "An EduPocket premium product by Ali Rad: a private Eva Digital Booklet gateway for structured IELTS and TOEFL-style reading and writing practice.",
  keywords: ["Eva Digital Booklet", "IELTS writing practice", "TOEFL reading practice", "premium English booklet", "EduPocket", "digital English booklet"],
  alternates: {
    canonical: "/eva-digital-booklet",
  },
  openGraph: {
    title: "Eva Digital Booklet | EduPocket",
    description: "An EduPocket premium product by Ali Rad: structured reading and writing practice in a premium-member study portal.",
    url: "/eva-digital-booklet",
    images: [
      {
        url: "/images/eva/eva-digital-booklet-study.jpg",
        width: 1200,
        height: 900,
        alt: "Eva Digital Booklet study portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eva Digital Booklet | EduPocket",
    description: "An EduPocket premium product by Ali Rad: structured reading and writing practice in a premium-member study portal.",
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
