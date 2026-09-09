"use client";

import { Reveal } from "@/components/motion/reveal";

/**
 * En-tête commun aux pages intérieures : même grammaire visuelle que les
 * titres de sections de l'accueil (mot surligné en vert), avec la marge
 * haute nécessaire sous la navbar fixe.
 */
export function PageHeader({
  eyebrow,
  titleLead,
  titleHighlight,
  body,
}: {
  eyebrow: string;
  titleLead: string;
  titleHighlight: string;
  body: string;
}) {
  return (
    <section className="relative px-4 pb-8 pt-40 sm:px-6 sm:pb-12 sm:pt-48 lg:px-10">
      <div className="glow-brand pointer-events-none absolute inset-0 -z-10" />
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
            {eyebrow}
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <h1 className="mt-4 font-heading text-4xl font-semibold sm:text-6xl lg:text-7xl">
            {titleLead}{" "}
            <span className="rounded-2xl bg-brand px-4 pb-1.5 text-brand-foreground">
              {titleHighlight}
            </span>
          </h1>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
            {body}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
