"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
        className="group flex items-center gap-5 rounded-full border border-white/12 bg-white/[0.03] px-7 py-5 transition-colors hover:border-brand/60 hover:bg-brand/10"
      >
        <span className="font-heading text-base font-semibold text-brand">
          {id}
        </span>
        <span className="flex-1 font-heading text-lg font-medium text-white sm:text-xl">
          {title}
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white transition-all group-hover:border-brand group-hover:bg-brand group-hover:text-brand-foreground">
          <ArrowRight className="h-5 w-5 transition-transform group-hover:-rotate-45" />
        </span>
      </a>
    </motion.div>
  );
}

export function Services() {
  return (
    <section id="services" className="scroll-mt-32 px-4 pb-28 sm:px-6 lg:px-10">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#0d0d0d] px-6 py-16 ring-1 ring-white/10 sm:rounded-[2.5rem] sm:px-12 sm:py-20">
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
            <h2 className="font-heading text-4xl font-semibold sm:text-5xl lg:text-[3.25rem]">
              {servicesIntro.titleLead}{" "}
              <span className="rounded-xl bg-brand px-3 pb-1 text-brand-foreground">
                {servicesIntro.titleHighlight}
              </span>
            </h2>
          </Reveal>

          <div className="mt-10 grid items-stretch gap-8 lg:grid-cols-[1fr_1fr] lg:gap-8">
            {/* Colonne 1 : intro + liste des services */}
            <div>
              <Reveal delay={0.05}>
                <p className="max-w-md text-base leading-relaxed text-white/55">
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

          </div>
        </div>
      </div>
    </section>
  );
}
