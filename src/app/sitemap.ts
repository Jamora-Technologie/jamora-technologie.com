import type { MetadataRoute } from "next";
import { seo } from "@/lib/content";

/**
 * Sert /sitemap.xml. Le site compte trois pages : les lister
 * explicitement suffit et évite toute page oubliée par les robots.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const maj = new Date();

  return [
    {
      url: seo.siteUrl,
      lastModified: maj,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${seo.siteUrl}/projets`,
      lastModified: maj,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${seo.siteUrl}/contact`,
      lastModified: maj,
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];
}
