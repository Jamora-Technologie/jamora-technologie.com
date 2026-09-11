"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";
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
  const isLive = project.status === "live" && project.href;

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, ease: easeOutExpo, delay: index * 0.08 }}
      className="group grid overflow-hidden rounded-[2rem] bg-[#0d0d0d] ring-1 ring-white/10 transition-colors hover:ring-brand/40 md:grid-cols-[minmax(240px,0.9fr)_1.6fr]"
    >
      {/*
        Volet logo sur fond clair : les logos fournis arrivent avec des fonds
        hétérogènes (l'un transparent, l'autre blanc opaque). Une surface claire
        les rend tous lisibles de la même façon, quel que soit le futur logo.
      */}
      <div className="relative grid min-h-[220px] place-items-center overflow-hidden bg-white p-6 md:min-h-[280px]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(70% 70% at 50% 50%, ${project.accent}1f 0%, transparent 72%)`,
          }}
        />
        {project.logo ? (
          <Image
            src={project.logo}
            alt={`Logo ${project.name}`}
            sizes="(max-width: 768px) 60vw, 260px"
            /*
              mix-blend-multiply : sur un panneau blanc, le blanc du logo
              devient invisible. Cela neutralise le fond opaque de certains
              logos sans retoucher les fichiers, et ne change rien à ceux
              qui sont déjà transparents.
            */
            className="relative w-full max-w-[240px] object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105 sm:max-w-[322px]"
          />
        ) : (
          <span
            className="relative grid h-28 w-28 place-items-center rounded-3xl font-heading text-4xl font-bold text-white"
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
                className="rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wide"
                style={{
                  borderColor: `${project.accent}55`,
                  color: project.accent,
                }}
              >
                {tag}
              </li>
            ))}
          </ul>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/60">
            {project.description}
          </p>
        </div>

        {isLive ? (
          <a
            href={project.href ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-3 rounded-full bg-brand py-3 pl-6 pr-3 text-base font-medium text-brand-foreground transition-transform hover:scale-[1.03]"
          >
            {projectsPage.cta}
            <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-foreground text-brand transition-transform group-hover:rotate-45">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </a>
        ) : (
          <p className="inline-flex w-fit items-center gap-2.5 rounded-full border border-white/15 px-6 py-3 text-base text-white/50">
            <Clock className="h-4 w-4" />
            {projectsPage.ctaWip}
          </p>
        )}
      </div>
    </motion.article>
  );
}
