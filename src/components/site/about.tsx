"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { about } from "@/lib/content";
import { Reveal, WordReveal } from "@/components/motion/reveal";
import { Sparkle } from "@/components/site/decor";

export function About() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    /*
     * La vidéo ne se charge et ne tourne que lorsque la bande est à
     * l'écran : `preload="none"` évite 4,7 Mo de téléchargement aux
     * visiteurs qui ne descendent jamais jusqu'ici, et la mise en pause
     * hors champ épargne le décodage.
     */
    if (reduceMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => {
            /* Lecture refusée par le navigateur : l'affiche reste visible. */
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <section id="a-propos" className="relative scroll-mt-32 py-24 sm:py-28">
      <div className="relative isolate overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          poster="/movie/jtech-poster.jpg"
          preload="none"
          muted
          loop
          playsInline
          aria-hidden
        >
          <source src="/movie/jtech.mp4" type="video/mp4" />
        </video>

        {/* Voile sombre : rend le texte lisible quel que soit le plan diffusé */}
        <div className="absolute inset-0 bg-ink/78" />
        {/* Fondu haut et bas, pour que la bande émerge du noir de la page */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(180deg, #050505 0%, rgba(5,5,5,0) 22%, rgba(5,5,5,0) 78%, #050505 100%)",
          }}
        />
        {/* Teinte de marque, très diffuse */}
        <div className="glow-brand-left absolute inset-0 opacity-70" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:px-10 sm:py-32 lg:px-12">
          <Reveal>
            <motion.span className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2 font-heading text-xs font-semibold uppercase tracking-[0.18em] text-brand-foreground">
              <Sparkle className="h-3.5 w-3.5" />
              {about.badge}
            </motion.span>
          </Reveal>

          <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-16">
            <Reveal delay={0.08}>
              <h2 className="font-heading text-4xl font-semibold leading-tight sm:text-5xl lg:text-[3.5rem]">
                <WordReveal text={about.title[0]} />
                <br />
                <WordReveal text={about.title[1]} delay={0.15} />
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
                {about.body}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
