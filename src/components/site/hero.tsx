"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { hero } from "@/lib/content";
import { Burst, Leaf } from "@/components/site/decor";
import { HeroNetwork } from "@/components/site/hero-network";
import { easeOutExpo, fadeUp, staggerParent } from "@/components/motion/reveal";

export function Hero() {
  return (
    <section id="top" className="relative bg-background pb-24 sm:pb-28">
      <div className="px-3 pt-3 sm:px-4 sm:pt-4">
        <motion.div
          variants={staggerParent}
          initial="hidden"
          animate="visible"
          className="relative mx-auto max-w-[1500px] rounded-[2rem] bg-white px-5 pb-28 pt-28 text-ink sm:rounded-[3rem] sm:px-10 sm:pb-32 sm:pt-32 lg:pt-36"
        >
          <Burst className="absolute left-6 top-28 hidden h-12 w-12 text-brand lg:block xl:left-16 xl:h-14 xl:w-14" />
          <Leaf className="absolute right-10 top-36 hidden h-6 w-10 rotate-12 text-brand lg:block" />

          <motion.h1
            variants={fadeUp}
            className="mx-auto max-w-4xl text-balance text-center font-heading text-[2.25rem] font-semibold leading-[1.05] sm:text-5xl lg:text-6xl xl:text-[4.5rem]"
          >
            {hero.titleLines[0]}
            <br className="hidden sm:block" /> {hero.titleLines[1]}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-neutral-600 sm:text-lg"
          >
            {hero.intro}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-neutral-500"
          >
            <span className="flex gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className="h-4 w-4 fill-brand text-brand"
                  strokeWidth={0}
                />
              ))}
            </span>
            <span>
              <strong className="font-heading font-semibold text-ink">
                {hero.experienceValue}
              </strong>{" "}
              {hero.experienceLabel}
            </span>
          </motion.div>

          {/* Le réseau : la marque au centre, expertises et applications autour */}
          <motion.div variants={fadeUp} className="mt-10 sm:mt-12">
            <HeroNetwork />
          </motion.div>

          {/* Pilule de CTA à cheval sur le bord du bloc blanc */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.45 }}
            className="absolute inset-x-0 bottom-0 flex translate-y-1/2 justify-center px-4"
          >
            <div className="flex items-center gap-2 rounded-full bg-ink p-2 ring-1 ring-white/10">
              <Link
                href="/contact"
                className="rounded-full bg-brand px-6 py-3 text-base font-medium text-brand-foreground transition-transform hover:scale-[1.03] sm:px-8"
              >
                {hero.ctaPrimary}
              </Link>
              <a
                href="#equipe"
                className="rounded-full px-6 py-3 text-base font-medium text-white/90 transition-colors hover:text-brand sm:px-8"
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
