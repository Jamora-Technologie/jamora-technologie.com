import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { projects, projectsPage } from "@/lib/content";
import { PageHeader } from "@/components/site/page-header";
import { ProjectCard } from "@/components/site/project-card";
import { Reveal } from "@/components/motion/reveal";
import { Sparkle } from "@/components/site/decor";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Projets - Jamora Technologie",
  description:
    "Les réalisations de Jamora Technologie : produits digitaux conçus et livrés pour des besoins concrets.",
};

export default function ProjetsPage() {
  /* Les deux compteurs sont dérivés des données : ils ne peuvent pas
     se désynchroniser de la liste des projets. */
  const enProduction = projects.filter((p) => p.status === "live").length;

  const resume = [
    { valeur: String(projects.length), label: projectsPage.resume.projets, estTexte: false },
    { valeur: String(enProduction), label: projectsPage.resume.production, estTexte: false },
    {
      valeur: projectsPage.resume.secteurs,
      label: projectsPage.resume.secteursLabel,
      /* Valeur textuelle : elle ne doit pas porter la taille d'un chiffre,
         sinon elle passe à la ligne sur un écran étroit. */
      estTexte: true,
    },
  ];

  return (
    <main className="flex-1">
      <PageHeader
        eyebrow={projectsPage.eyebrow}
        titleLead={projectsPage.titleLead}
        titleHighlight={projectsPage.titleHighlight}
        body={projectsPage.body}
      />

      {/* Résumé chiffré, pour situer l'ampleur avant d'entrer dans le détail */}
      <section className="px-4 pb-12 sm:px-6 lg:px-10">
        <Reveal className="mx-auto max-w-7xl">
          <dl className="grid grid-cols-2 divide-white/10 rounded-[1.5rem] border border-white/10 bg-white/[0.03] sm:rounded-full md:grid-cols-3 md:divide-x">
            {resume.map((item) => (
              <div
                key={item.label}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-6 py-5 text-center",
                  item.estTexte && "col-span-2 border-t border-white/10 md:col-span-1 md:border-t-0",
                )}
              >
                <dt className="order-2 text-xs uppercase tracking-wide text-white/45 sm:text-sm">
                  {item.label}
                </dt>
                <dd
                  className={cn(
                    "order-1 font-heading font-semibold text-white",
                    item.estTexte
                      ? "text-base sm:text-lg"
                      : "text-2xl sm:text-3xl",
                  )}
                >
                  {item.valeur}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </section>

      {/* Clôture : la page se terminait sur un vide, elle appelle maintenant */}
      <section className="px-4 pb-24 sm:px-6 lg:px-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#0d0d0d] px-6 py-16 ring-1 ring-white/10 sm:rounded-[2.5rem] sm:px-12 sm:py-20">
          <div className="glow-brand pointer-events-none absolute inset-0" />
          <Sparkle className="absolute right-10 top-10 hidden h-6 w-6 text-brand/40 lg:block" />

          <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
            <Reveal>
              <h2 className="text-balance font-heading text-3xl font-semibold sm:text-4xl lg:text-[2.75rem]">
                {projectsPage.fin.titre}
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-5 text-base leading-relaxed text-white/60 sm:text-lg">
                {projectsPage.fin.body}
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <Link
                href="/contact"
                className="group mt-9 inline-flex items-center gap-3 rounded-full bg-brand py-3.5 pl-7 pr-3 text-base font-medium text-brand-foreground transition-transform hover:scale-[1.03]"
              >
                {projectsPage.fin.cta}
                <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-foreground text-brand transition-transform group-hover:translate-x-0.5">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
