"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { services, servicesIntro } from "@/lib/content";
import { Reveal, easeOutExpo } from "@/components/motion/reveal";

/** Texte disposé en cercle autour de la photo centrale, en rotation lente. */
function CircularLabel() {
  const text = "JAMORA TECHNOLOGIE • DESIGN • DIGITAL • ";
  return (
    <svg
      viewBox="0 0 200 200"
      className="h-32 w-32 animate-spin-slow text-ink drop-shadow"
      aria-hidden
    >
      <defs>
        <path
          id="circle-path"
          d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0"
          fill="none"
        />
      </defs>
      <text className="text-[13px] font-semibold uppercase tracking-[0.12em]">
        {/* textLength force le mot à couvrir exactement la circonférence :
            sans lui, le texte se chevauche à la jonction du cercle. */}
        <textPath
          href="#circle-path"
          fill="currentColor"
          textLength={2 * Math.PI * 72}
          lengthAdjust="spacing"
        >
          {text}
        </textPath>
      </text>
    </svg>
  );
}

function ServiceRow({
  id,
  title,
  description,
  index,
}: {
  id: string;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.55, ease: easeOutExpo, delay: index * 0.08 }}
    >
      <a
        href="#contact"
        title={description}
        className="group flex items-center gap-4 rounded-full border border-white/12 bg-white/[0.03] px-5 py-4 transition-colors hover:border-brand/60 hover:bg-brand/10"
      >
        <span className="font-heading text-sm font-semibold text-brand">
          {id}
        </span>
        <span className="flex-1 font-heading text-base font-medium text-white sm:text-lg">
          {title}
        </span>
        <span className="grid h-8 w-8 place-items-center rounded-full border border-white/15 text-white transition-all group-hover:border-brand group-hover:bg-brand group-hover:text-brand-foreground">
          <ArrowRight className="h-4 w-4 transition-transform group-hover:-rotate-45" />
        </span>
      </a>
    </motion.div>
  );
}

export function Services() {
  return (
    <section id="services" className="px-4 pb-24 sm:px-6 lg:px-10">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-[#0d0d0d] px-5 py-14 ring-1 ring-white/10 sm:rounded-[2.5rem] sm:px-10 sm:py-16">
        <div className="glow-brand pointer-events-none absolute inset-0" />

        {/* Onglet vertical collé au bord gauche */}
        <div
          className="absolute left-0 top-14 hidden rounded-r-lg bg-brand px-1.5 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-foreground lg:block"
          style={{ writingMode: "vertical-rl", rotate: "180deg" }}
        >
          {servicesIntro.eyebrow}
        </div>

        <div className="relative lg:pl-10">
          <Reveal>
            <h2 className="font-heading text-3xl font-semibold sm:text-4xl lg:text-[2.75rem]">
              {servicesIntro.titleLead}{" "}
              <span className="rounded-xl bg-brand px-3 pb-1 text-brand-foreground">
                {servicesIntro.titleHighlight}
              </span>
            </h2>
          </Reveal>

          <div className="mt-10 grid items-stretch gap-8 lg:grid-cols-[1.05fr_0.95fr_0.7fr] lg:gap-6">
            {/* Colonne 1 : intro + liste des services */}
            <div>
              <Reveal delay={0.05}>
                <p className="max-w-sm text-sm leading-relaxed text-white/55">
                  {servicesIntro.body}
                </p>
              </Reveal>
              <div className="mt-7 flex flex-col gap-3">
                {services.map((service, index) => (
                  <ServiceRow key={service.id} index={index} {...service} />
                ))}
              </div>
            </div>

            {/* Colonne 2 : visuel avec label circulaire */}
            <Reveal delay={0.1} className="relative h-full">
              <div className="relative h-full min-h-[260px] overflow-hidden rounded-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80"
                  alt="Session de travail créative chez Jamora Technologie"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover grayscale"
                />
                <div className="absolute inset-0 bg-ink/20" />
                <div className="absolute right-2 top-3 grid place-items-center">
                  <CircularLabel />
                </div>
              </div>
            </Reveal>

            {/* Colonne 3 : deux cartes d'appel à l'action */}
            <div className="flex flex-col gap-4">
              <Reveal delay={0.15}>
                <div className="flex h-full flex-col justify-between rounded-2xl border border-white/12 bg-white/[0.03] p-5">
                  <p className="text-sm leading-relaxed text-white/60">
                    {servicesIntro.cardOne.question}
                  </p>
                  <a
                    href="#a-propos"
                    className="group mt-8 flex items-end justify-between gap-3"
                  >
                    <span className="font-heading text-lg font-medium leading-tight text-white">
                      {servicesIntro.cardOne.action}
                    </span>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-white transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </a>
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="flex h-full flex-col justify-between rounded-2xl bg-brand p-5 text-brand-foreground">
                  <p className="text-sm leading-relaxed opacity-80">
                    {servicesIntro.cardTwo.question}
                  </p>
                  <a
                    href="#contact"
                    className="group mt-8 flex items-end justify-between gap-3"
                  >
                    <span className="font-heading text-lg font-medium leading-tight">
                      {servicesIntro.cardTwo.action}
                    </span>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white transition-transform group-hover:scale-110">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
