import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.canonicalUrl.replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/eva-digital-booklet/studio", "/eva-digital-booklet/login", "/eva-digital-booklet/logout"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
