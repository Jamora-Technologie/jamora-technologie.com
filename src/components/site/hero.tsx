"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { hero } from "@/lib/content";
import { Navbar } from "@/components/site/navbar";
import { Burst, Leaf, Squiggle } from "@/components/site/decor";
import { easeOutExpo, fadeUp, staggerParent } from "@/components/motion/reveal";

export function Hero() {
  return (
    <section id="top" className="relative bg-background pb-24 sm:pb-28">
      <Navbar />

      <div className="px-3 pt-3 sm:px-4 sm:pt-4">
        <motion.div
          variants={staggerParent}
          initial="hidden"
          animate="visible"
          className="relative mx-auto max-w-[1400px] rounded-[2rem] bg-white px-5 pb-28 pt-28 text-ink sm:rounded-[3rem] sm:px-10 sm:pb-32 sm:pt-36 lg:pt-40"
        >
          {/* Décors du template */}
          <Burst className="absolute left-6 top-28 hidden h-12 w-12 text-brand lg:block xl:left-16 xl:h-14 xl:w-14" />
          <Leaf className="absolute right-10 top-44 hidden h-6 w-10 rotate-12 text-brand lg:block" />

          <motion.h1
            variants={fadeUp}
            className="mx-auto max-w-4xl text-balance text-center font-heading text-[2rem] font-semibold leading-[1.08] sm:text-5xl lg:text-6xl xl:text-[4.25rem]"
          >
            {hero.titleLines[0]}
            <br className="hidden sm:block" />{" "}
            {hero.titleLines[1]}
          </motion.h1>

          <div className="mt-12 grid items-center gap-10 lg:mt-4 lg:grid-cols-[1fr_auto_1fr] lg:gap-6">
            {/* Colonne gauche : accroche + CTA fantôme */}
            <motion.div
              variants={fadeUp}
              className="order-2 max-w-xs lg:order-1 lg:pb-16"
            >
              <Leaf className="mb-3 h-4 w-7 text-brand" />
              <p className="text-sm leading-relaxed text-neutral-600">
                {hero.intro}
              </p>
              <a
                href="#services"
                className="mt-6 inline-flex items-center rounded-full border border-neutral-300 px-6 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
              >
                {hero.ctaGhost}
              </a>
            </motion.div>

            {/* Portrait central */}
            <motion.div
              variants={fadeUp}
              className="order-1 flex justify-center lg:order-2"
            >
              <div className="relative">
                <div className="relative h-[260px] w-[260px] overflow-hidden rounded-full bg-neutral-100 sm:h-[330px] sm:w-[330px] lg:h-[380px] lg:w-[380px]">
                  <Image
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=900&q=80"
                    alt="Portrait d'une collaboratrice de Jamora Technologie"
                    fill
                    priority
                    sizes="(max-width: 640px) 260px, (max-width: 1024px) 330px, 380px"
                    className="object-cover object-top"
                  />
                </div>
                <Squiggle className="absolute -left-10 bottom-6 hidden text-neutral-800 lg:block" />
              </div>
            </motion.div>

            {/* Colonne droite : preuve sociale */}
            <motion.div
              variants={fadeUp}
              className="order-3 flex flex-col items-center gap-1 lg:items-end lg:pb-16 lg:text-right"
            >
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className="h-4 w-4 fill-brand text-brand"
                    strokeWidth={0}
                  />
                ))}
              </div>
              <p className="font-heading text-3xl font-semibold lg:text-4xl">
                {hero.experienceValue}
              </p>
              <p className="text-sm text-neutral-500">{hero.experienceLabel}</p>
            </motion.div>
          </div>

          {/* Pilule de CTA à cheval sur le bord du bloc blanc */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.45 }}
            className="absolute inset-x-0 bottom-0 flex translate-y-1/2 justify-center px-4"
          >
            <div className="flex items-center gap-2 rounded-full bg-ink p-2 ring-1 ring-white/10">
              <a
                href="#contact"
                className="rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-brand-foreground transition-transform hover:scale-[1.03] sm:px-6"
              >
                {hero.ctaPrimary}
              </a>
              <a
                href="#services"
                className="rounded-full px-5 py-2.5 text-sm font-medium text-white/90 transition-colors hover:text-brand sm:px-6"
              >
                {hero.ctaSecondary}
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
