import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Sans_Arabic, Manrope, Vazirmatn } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site";
import { Footer } from "@/components/site/Footer";
import { LanguageBootScript } from "@/components/site/LanguageBootScript";
import { MobileContactDock } from "@/components/site/MobileContactDock";
import { Navbar } from "@/components/site/Navbar";

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
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
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
        <Navbar />
        <main className="pb-28 sm:pb-0">{children}</main>
        <Footer />
        <MobileContactDock />
      </body>
    </html>
  );
}
