import type { MetadataRoute } from "next";
import { seo } from "@/lib/content";

/**
 * Sert /robots.txt. Tout le site public est ouvert à l'indexation ; seul
 * l'endpoint interne d'optimisation d'images est écarté, il ne produit que
 * des variantes d'images déjà indexées.
 *
 * Le back-office n'y figure VOLONTAIREMENT pas : robots.txt est public, y
 * écrire l'adresse secrète reviendrait à la publier. Il est protégé par sa
 * session, son en-tête `noindex` et un 404 hors de sa propre adresse.
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
