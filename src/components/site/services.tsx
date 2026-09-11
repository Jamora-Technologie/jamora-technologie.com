"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { services, servicesIntro } from "@/lib/content";
import { Reveal, easeOutExpo } from "@/components/motion/reveal";
import { ServicesDiagram } from "@/components/site/services-diagram";

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

            {/* Colonne 2 : schéma d'architecture de la plateforme */}
            <Reveal delay={0.1} className="flex h-full items-center">
              <ServicesDiagram />
            </Reveal>

          </div>
        </div>
      </div>
    </section>
  );
}
