import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import "./globals.css";
import { siteConfig } from "@/lib/site";
import { Footer } from "@/components/site/Footer";
import { LanguageBootScript } from "@/components/site/LanguageBootScript";
import { MobileContactDock } from "@/components/site/MobileContactDock";
import { Navbar } from "@/components/site/Navbar";
import { StructuredData } from "@/components/site/StructuredData";

const manrope = localFont({
  src: "../assets/fonts/manrope-latin.woff2",
  weight: "200 800",
  display: "swap",
  variable: "--font-latin",
});

const ibmPlexSansArabic = localFont({
  src: [
    { path: "../assets/fonts/ibm-plex-sans-arabic-400.woff2", weight: "400", style: "normal" },
    { path: "../assets/fonts/ibm-plex-sans-arabic-500.woff2", weight: "500", style: "normal" },
    { path: "../assets/fonts/ibm-plex-sans-arabic-600.woff2", weight: "600", style: "normal" },
    { path: "../assets/fonts/ibm-plex-sans-arabic-700.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-persian-display",
});

const vazirmatn = localFont({
  src: "../assets/fonts/vazirmatn-arabic.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-persian",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.canonicalUrl),
  applicationName: siteConfig.name,
  title: {
    default: `${siteConfig.name} - CELTA English Teacher, IELTS, TOEFL, FCE, GRE & GMAT Coaching`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.seoKeywords],
  authors: [{ name: siteConfig.author, url: "/about" }],
  creator: siteConfig.author,
  publisher: "Blue Rose Academy",
  category: "Education",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: "black-translucent",
  },
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      fa: "/",
      "x-default": "/",
    },
  },
  icons: {
    icon: [{ url: "/icons/edupocket-mark.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/icons/edupocket-mark.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icons/edupocket-mark.svg", type: "image/svg+xml" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: siteConfig.canonicalUrl,
    siteName: siteConfig.name,
    title: `${siteConfig.name} - CELTA English Teacher, IELTS, TOEFL, FCE, GRE & GMAT Coaching`,
    description: siteConfig.description,
    locale: "en_US",
    alternateLocale: ["fa_IR"],
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "EduPocket learning systems by Ali Rad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - CELTA English Teacher, IELTS, TOEFL, FCE, GRE & GMAT Coaching`,
    description: siteConfig.description,
    images: ["/twitter-image"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#06111f",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" dir="ltr" data-lang="en" suppressHydrationWarning>
      <body className={`${manrope.variable} ${ibmPlexSansArabic.variable} ${vazirmatn.variable}`} suppressHydrationWarning>
        <LanguageBootScript />
        <StructuredData />
        <Navbar />
        <main className="pb-28 sm:pb-0">{children}</main>
        <Footer />
        <MobileContactDock />
      </body>
    </html>
  );
}
