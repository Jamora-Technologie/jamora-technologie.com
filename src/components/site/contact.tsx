"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { contact } from "@/lib/content";
import { Reveal } from "@/components/motion/reveal";
import { Sparkle } from "@/components/site/decor";

export function Contact() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="contact"
      className="scroll-mt-32 px-4 py-24 sm:px-6 sm:py-28 lg:px-10"
    >
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#0d0d0d] px-6 py-20 ring-1 ring-white/10 sm:rounded-[2.5rem] sm:px-12 sm:py-24">
        <div className="glow-brand pointer-events-none absolute inset-0" />

        {/* Étoiles décoratives, en écho aux bandeaux du site */}
        <Sparkle className="absolute left-10 top-12 hidden h-6 w-6 text-brand/50 lg:block" />
        <Sparkle className="absolute bottom-14 right-14 hidden h-8 w-8 text-brand/40 lg:block" />

        <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
          <Reveal>
            <h2 className="text-balance font-heading text-4xl font-semibold sm:text-5xl lg:text-[3.5rem]">
              {contact.title}
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mt-6 text-base leading-relaxed text-white/60 sm:text-lg">
              {contact.body}
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <Link
              href="/contact"
              className="group mt-10 inline-flex items-center gap-4 rounded-full bg-brand py-4 pl-8 pr-4 text-lg font-medium text-brand-foreground transition-transform hover:scale-[1.03]"
            >
              {contact.cta}
              <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-brand-foreground text-brand">
                {/*
                  La flèche oscille en continu pour signaler l'action, et
                  l'amplitude n'est pas rejouée si la personne a demandé à
                  réduire les animations.
                */}
                <motion.span
                  animate={reduceMotion ? undefined : { x: [0, 5, 0] }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="flex"
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.span>
              </span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
