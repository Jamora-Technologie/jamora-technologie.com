"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/content";
import { projectsPage } from "@/lib/content";
import { easeOutExpo } from "@/components/motion/reveal";

/**
 * Carte projet : volet gauche pour le logo, volet droit pour le texte
 * et l'appel à l'action. Ajouter un projet ne demande qu'une entrée
 * de plus dans `projects` (src/lib/content.ts).
 */
export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, ease: easeOutExpo, delay: index * 0.08 }}
      className="group grid overflow-hidden rounded-[2rem] bg-[#0d0d0d] ring-1 ring-white/10 transition-colors hover:ring-brand/40 md:grid-cols-[minmax(220px,0.9fr)_1.6fr]"
    >
      {/* Volet gauche : logo ou monogramme sur la couleur du projet */}
      <div
        className="relative grid min-h-[200px] place-items-center overflow-hidden p-8 md:min-h-[260px]"
        style={{ backgroundColor: `${project.accent}1a` }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(60% 60% at 50% 40%, ${project.accent}44 0%, transparent 70%)`,
          }}
        />
        {project.logo ? (
          <Image
            src={project.logo}
            alt={`Logo ${project.name}`}
            width={160}
            height={160}
            className="relative h-24 w-auto object-contain md:h-28"
          />
        ) : (
          <span
            className="relative grid h-24 w-24 place-items-center rounded-3xl font-heading text-3xl font-bold text-ink md:h-28 md:w-28 md:text-4xl"
            style={{ backgroundColor: project.accent }}
          >
            {project.initials}
          </span>
        )}
      </div>

      {/* Volet droit : description et action */}
      <div className="flex flex-col justify-between gap-6 p-7 sm:p-9">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-heading text-2xl font-semibold sm:text-3xl">
              {project.name}
            </h2>
            {project.year && (
              <span className="text-sm text-white/40">{project.year}</span>
            )}
          </div>

          <ul className="mt-3 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-white/15 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white/60"
              >
                {tag}
              </li>
            ))}
          </ul>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/60">
            {project.description}
          </p>
        </div>

        <a
          href={project.href}
          className="inline-flex w-fit items-center gap-3 rounded-full bg-brand py-3 pl-6 pr-3 text-base font-medium text-brand-foreground transition-transform hover:scale-[1.03]"
        >
          {projectsPage.cta}
          <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-foreground text-brand transition-transform group-hover:rotate-45">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </a>
      </div>
    </motion.article>
  );
}
