"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { team } from "@/lib/content";
import { Reveal, easeOutExpo } from "@/components/motion/reveal";

export function Team() {
  return (
    <section id="equipe" className="scroll-mt-32 px-4 pb-28 sm:px-6 lg:px-10">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#0d0d0d] px-6 py-16 ring-1 ring-white/10 sm:rounded-[2.5rem] sm:px-12 sm:py-20">
        <div className="glow-brand pointer-events-none absolute inset-0" />

        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <Reveal>
            <h2 className="font-heading text-4xl font-semibold sm:text-5xl lg:text-[3.25rem]">
              {team.title[0]}{" "}
              <span className="rounded-xl bg-brand px-3 pb-1 text-brand-foreground">
                {team.title[1]}
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <a
              href="#contact"
              className="group flex items-center gap-2 rounded-full border border-white/15 py-2 pl-6 pr-2 text-sm font-semibold uppercase tracking-wide text-white/80 transition-colors hover:border-brand hover:text-brand"
            >
              {team.pill}
              <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-brand-foreground transition-transform group-hover:scale-110">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </a>
          </Reveal>
        </div>

        <div className="relative mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {team.members.map((member, index) => (
            <motion.article
              key={member.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.6,
                ease: easeOutExpo,
                delay: (index % 3) * 0.08,
              }}
              whileHover={{ y: -6 }}
              className="rounded-3xl bg-white p-6 text-ink"
            >
              <div className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-brand">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-heading text-base font-semibold">
                    {member.name}
                  </p>
                  <p className="text-sm text-neutral-500">{member.role}</p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-neutral-600">
                {member.bio}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
