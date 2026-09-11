import { brand, presse, projects, seo } from "@/lib/content";

/**
 * Données structurées des produits, en JSON-LD.
 *
 * Séparé de `StructuredData` volontairement : ce bloc n'est rendu que
 * sur les pages où les produits sont réellement visibles. Déclarer un
 * contenu absent de la page expose à une pénalité.
 *
 * L'enjeu est de rattacher explicitement SenDon et Dara-J-Food à
 * l'organisation : c'est ce lien que les moteurs exploitent pour
 * associer une recherche « SenDon » à jamora-technologie.com.
 */
export function ProductsData() {
  const produits = projects.map((projet) => {
    const retombees = presse.filter((article) => article.projet === projet.slug);

    return {
      "@type": "SoftwareApplication",
      "@id": `${seo.siteUrl}/projets#${projet.slug}`,
      name: projet.name,
      description: projet.description,
      applicationCategory: projet.categorie,
      operatingSystem: "Web",
      inLanguage: "fr",
      url: projet.href ?? `${seo.siteUrl}/projets#${projet.slug}`,
      /* Le rattachement à l'organisation, dans les deux sens utiles. */
      creator: { "@id": `${seo.siteUrl}/#organisation` },
      publisher: { "@id": `${seo.siteUrl}/#organisation` },
      author: { "@id": `${seo.siteUrl}/#organisation` },
      keywords: [...projet.tags].join(", "),
      countriesSupported: "SN",
      ...(retombees.length > 0 && {
        subjectOf: retombees.map((article) => ({
          "@type": "NewsArticle",
          headline: article.titre,
          url: article.url,
          datePublished: article.date,
          author: { "@type": "Person", name: article.auteur },
          publisher: { "@type": "Organization", name: article.media },
        })),
      }),
    };
  });

  const donnees = {
    "@context": "https://schema.org",
    "@graph": [
      ...produits,
      {
        /* Rend le lien lisible dans l'autre sens : l'organisation possède
           ces produits. */
        "@type": "Organization",
        "@id": `${seo.siteUrl}/#organisation`,
        name: brand.fullName,
        owns: produits.map((p) => ({ "@id": p["@id"] })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(donnees) }}
    />
  );
}
