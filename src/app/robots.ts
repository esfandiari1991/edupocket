import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.canonicalUrl.replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/eva-digital-booklet/studio",
          "/eva-digital-booklet/login",
          "/eva-digital-booklet/logout",
          "/eva-digital-booklet/state",
          "/eva-digital-booklet/teacher-note",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
