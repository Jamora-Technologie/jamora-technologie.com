import type { MetadataRoute } from "next";
import { seo } from "@/lib/content";

/**
 * Sert /robots.txt. Tout le site est ouvert à l'indexation ; seul
 * l'endpoint interne d'optimisation d'images est écarté, il ne produit
 * que des variantes d'images déjà indexées par ailleurs.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/_next/image",
    },
    sitemap: `${seo.siteUrl}/sitemap.xml`,
    host: seo.siteUrl,
  };
}
