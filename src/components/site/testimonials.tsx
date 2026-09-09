"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { testimonials } from "@/lib/content";
import { easeOutExpo } from "@/components/motion/reveal";

export function Testimonials() {
  const [index, setIndex] = useState(1);
  const [offset, setOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  /**
   * On mesure la position réelle de la carte active plutôt que de
   * calculer un pas fixe : la largeur des cartes change selon le
   * breakpoint, et une mesure reste juste dans tous les cas.
   */
  const recompute = useCallback(() => {
    const container = containerRef.current;
    const card = cardRefs.current[index];
    if (!container || !card) return;
    setOffset(container.offsetWidth / 2 - card.offsetWidth / 2 - card.offsetLeft);
  }, [index]);

  useEffect(() => {
    recompute();
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, [recompute]);

  const move = (direction: -1 | 1) =>
    setIndex((current) =>
      Math.min(testimonials.length - 1, Math.max(0, current + direction)),
    );

  return (
    <section id="avis" className="scroll-mt-32 overflow-hidden pb-24 sm:pb-28">
      <div ref={containerRef} className="relative">
        <motion.div
          className="flex gap-5"
          animate={{ x: offset }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
        >
          {testimonials.map((item, itemIndex) => {
            const isActive = itemIndex === index;
            return (
              <motion.div
                key={item.name}
                ref={(node) => {
                  cardRefs.current[itemIndex] = node;
                }}
                animate={{
                  opacity: isActive ? 1 : 0.35,
                  scale: isActive ? 1 : 0.94,
                }}
                transition={{ duration: 0.6, ease: easeOutExpo }}
                onClick={() => setIndex(itemIndex)}
                className="w-[320px] shrink-0 cursor-pointer rounded-3xl bg-white p-8 text-ink sm:w-[500px]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-heading text-base font-semibold">
                        {item.name}
                      </p>
                      <p className="text-sm text-neutral-500">{item.company}</p>
                    </div>
                  </div>
                  <Quote className="h-6 w-6 shrink-0 fill-neutral-300 text-neutral-300" />
                </div>
                <p className="mt-6 text-base leading-relaxed text-neutral-600">
                  {item.quote}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => move(-1)}
          disabled={index === 0}
          aria-label="Témoignage précédent"
          className="grid h-12 w-12 place-items-center rounded-full border border-white/15 text-white transition-colors hover:border-brand hover:text-brand disabled:opacity-30 disabled:hover:border-white/15 disabled:hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => move(1)}
          disabled={index === testimonials.length - 1}
          aria-label="Témoignage suivant"
          className="grid h-12 w-12 place-items-center rounded-full border border-white/15 text-white transition-colors hover:border-brand hover:text-brand disabled:opacity-30 disabled:hover:border-white/15 disabled:hover:text-white"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
