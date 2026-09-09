import type { Metadata } from "next";
import { projects, projectsPage } from "@/lib/content";
import { PageHeader } from "@/components/site/page-header";
import { ProjectCard } from "@/components/site/project-card";

export const metadata: Metadata = {
  title: "Projets — Jamora Technologie",
  description:
    "Les réalisations de Jamora Technologie : produits digitaux conçus et livrés pour des besoins concrets.",
};

export default function ProjetsPage() {
  return (
    <main className="flex-1">
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
