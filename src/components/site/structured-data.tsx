import { brand, presse, seo, team } from "@/lib/content";

/**
 * Données structurées schema.org, injectées en JSON-LD.
 *
 * Deux entités liées entre elles : l'organisation et le site. Les
 * fondateurs sont déclarés avec leur fonction exacte, et les retombées
 * presse en `subjectOf` — Google y lit un signal de notoriété adossé à
 * des sources tierces.
 *
 * Règle respectée ici : tout ce qui est déclaré est aussi visible sur la
 * page. Des données structurées qui décrivent un contenu absent exposent
 * à une pénalité.
 */
export function StructuredData() {
  const organisation = {
    "@type": "Organization",
    "@id": `${seo.siteUrl}/#organisation`,
    name: brand.fullName,
    alternateName: brand.name,
    url: seo.siteUrl,
    logo: `${seo.siteUrl}/icon.png`,
    image: `${seo.siteUrl}/og.png`,
    description: seo.description,
    email: brand.email,
    telephone: brand.phone,
    foundingDate: "2022",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dakar",
      addressCountry: "SN",
    },
    areaServed: { "@type": "Country", name: "Sénégal" },
    /* Seuls les fondateurs, avec la fonction affichée sur le site. */
    founder: team.members.map((membre) => ({
      "@type": "Person",
      name: membre.name,
      jobTitle: membre.role,
      knowsAbout: membre.title,
      url: membre.linkedin,
      sameAs: membre.linkedin,
    })),
    knowsAbout: [
      "Intelligence artificielle",
      "Développement web",
      "Développement mobile",
      "Design UI/UX",
      "Architecture logicielle",
    ],
    subjectOf: presse.map((article) => ({
      "@type": "NewsArticle",
      headline: article.titre,
      url: article.url,
      datePublished: article.date,
      author: { "@type": "Person", name: article.auteur },
      publisher: { "@type": "Organization", name: article.media },
    })),
  };

  const site = {
    "@type": "WebSite",
    "@id": `${seo.siteUrl}/#site`,
    url: seo.siteUrl,
    name: brand.fullName,
    inLanguage: "fr",
    publisher: { "@id": `${seo.siteUrl}/#organisation` },
  };

  const donnees = {
    "@context": "https://schema.org",
    "@graph": [organisation, site],
  };

  return (
    <script
      type="application/ld+json"
      /* JSON.stringify échappe déjà le contenu ; les données viennent du
         dépôt, jamais d'une saisie utilisateur. */
      dangerouslySetInnerHTML={{ __html: JSON.stringify(donnees) }}
    />
  );
}
