import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Sans_Arabic, Manrope, Vazirmatn } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site";
import { Footer } from "@/components/site/Footer";
import { LanguageBootScript } from "@/components/site/LanguageBootScript";
import { MobileContactDock } from "@/components/site/MobileContactDock";
import { Navbar } from "@/components/site/Navbar";
import { StructuredData } from "@/components/site/StructuredData";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-latin",
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-persian-display",
});

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-persian",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.canonicalUrl),
  applicationName: siteConfig.name,
  title: {
    default: `${siteConfig.name} - English, AI, and practical learning systems`,
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
    title: `${siteConfig.name} - English, AI, and practical learning systems`,
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
    title: `${siteConfig.name} - English, AI, and practical learning systems`,
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
      <body className={`${manrope.variable} ${ibmPlexSansArabic.variable} ${vazirmatn.variable}`}>
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
