"use client";

import Image from "next/image";
import { about } from "@/lib/content";
import { Reveal } from "@/components/motion/reveal";
import { BulbDoodle, Sparkle } from "@/components/site/decor";

export function About() {
  return (
    <section
      id="a-propos"
      className="relative px-4 py-24 sm:px-6 sm:py-28 lg:px-10"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-16">
          <Reveal>
            <h2 className="font-heading text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.75rem]">
              {about.title[0]}
              <br />
              {about.title[1]}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
              {about.body}
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 sm:mt-16 lg:grid-cols-[1.55fr_1fr]">
          <Reveal className="relative">
            <Sparkle className="absolute -left-3 -top-5 z-10 h-8 w-8 text-brand" />
            <div className="relative h-[260px] overflow-hidden rounded-2xl sm:h-[340px] lg:h-[380px]">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80"
                alt="L'équipe Jamora Technologie en atelier de travail"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover grayscale"
              />
              {/* Étiquette verte à cheval sur la photo */}
              <div className="absolute bottom-8 left-0 flex items-center bg-brand py-3 pl-6 pr-16 font-heading text-sm font-semibold uppercase tracking-wide text-brand-foreground sm:pr-24">
                {about.badge}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="relative">
            <div className="relative h-[260px] overflow-hidden rounded-2xl sm:h-[340px] lg:h-[380px]">
              <Image
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80"
                alt="Une designer souriante devant son écran"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover grayscale"
              />
              <BulbDoodle className="absolute right-6 top-6 h-14 w-14 text-red-500" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
