"use client";

import { signature } from "@/lib/content";
import { Reveal } from "@/components/motion/reveal";
import { Burst } from "@/components/site/decor";

/** Bulle de signature affichée juste au-dessus du footer. */
export function Signature() {
  return (
    <section className="px-4 pb-10 pt-20 sm:px-6 sm:pb-14 sm:pt-24 lg:px-10">
      <Reveal className="mx-auto max-w-4xl">
        <figure className="relative rounded-[2rem] bg-white/[0.04] px-7 py-9 text-center ring-1 ring-white/10 sm:rounded-[2.5rem] sm:px-14 sm:py-12">
          <Burst className="absolute -top-5 left-1/2 h-10 w-10 -translate-x-1/2 rounded-full bg-background p-1.5 text-brand" />
          <figcaption className="font-heading text-base font-semibold text-brand sm:text-lg">
            {signature.brand}
          </figcaption>
          <blockquote className="mt-3 text-balance font-heading text-xl font-medium leading-relaxed text-white/85 sm:text-2xl lg:text-[1.75rem]">
            «&nbsp;{signature.quote}&nbsp;»
          </blockquote>
        </figure>
      </Reveal>
    </section>
  );
}
