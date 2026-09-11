"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { homeProjects, projects } from "@/lib/content";
import { Reveal } from "@/components/motion/reveal";
import { ProjectCard } from "@/components/site/project-card";

/**
 * Section « produits phare » de l'accueil.
 *
 * Elle réutilise la carte de la page Projets plutôt que d'en dupliquer une
 * variante : un seul composant à maintenir, et les deux pages restent
 * visuellement cohérentes. La sélection vient du drapeau `featured`.
 */
export function FeaturedProjects() {
  const featured = projects.filter((project) => project.featured);

  if (featured.length === 0) return null;

  return (
    <section id="projets" className="scroll-mt-32 px-4 pb-28 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
            {homeProjects.eyebrow}
          </p>
        </Reveal>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
          <Reveal delay={0.05}>
            <h2 className="font-heading text-[1.875rem] font-semibold sm:text-[2.375rem] lg:text-[2.875rem]">
              {homeProjects.titleLead}{" "}
              <span className="rounded-xl bg-brand px-3 pb-1 text-brand-foreground">
                {homeProjects.titleHighlight}
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="max-w-md text-base leading-relaxed text-white/55">
              {homeProjects.body}
            </p>
          </Reveal>
        </div>

        <div className="mt-10 flex flex-col gap-6">
          {featured.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>

        <Reveal delay={0.1} className="mt-10 flex justify-center">
          <Link
            href="/projets"
            className="group inline-flex items-center gap-3 rounded-full border border-white/15 py-4 pl-8 pr-3 text-base font-medium text-white transition-colors hover:border-brand hover:text-brand"
          >
            {homeProjects.cta}
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-brand-foreground transition-transform group-hover:translate-x-1">
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
