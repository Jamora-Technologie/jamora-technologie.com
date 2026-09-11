import type { Metadata } from "next";
import { projects, projectsPage, seo } from "@/lib/content";
import { PageHeader } from "@/components/site/page-header";
import { ProjectCard } from "@/components/site/project-card";
import { ProductsData } from "@/components/site/products-data";

export const metadata: Metadata = {
  /* Le gabarit du layout ajoute « - Jamora Technologie ». */
  title: seo.pages.projets.titre,
  description: seo.pages.projets.description,
  alternates: { canonical: "/projets" },
  openGraph: {
    title: seo.pages.projets.titre,
    description: seo.pages.projets.description,
    url: `${seo.siteUrl}/projets`,
  },
};

export default function ProjetsPage() {
  return (
    <main className="flex-1">
      <ProductsData />
      <PageHeader
        eyebrow={projectsPage.eyebrow}
        titleLead={projectsPage.titleLead}
        titleHighlight={projectsPage.titleHighlight}
        body={projectsPage.body}
      />

      <section className="px-4 pb-8 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </section>
    </main>
  );
}
