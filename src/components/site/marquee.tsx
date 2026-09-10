"use client";

import { marqueeWords, tagWords } from "@/lib/content";
import { Diamond, Sparkle } from "@/components/site/decor";

/**
 * Défilement infini : le contenu est dupliqué à l'identique et translaté
 * de -50%, si bien que la seconde copie prend exactement la place de la
 * première au moment où le cycle recommence — la boucle est invisible.
 */
function Track({
  children,
  duration,
  className,
}: {
  children: React.ReactNode;
  duration: string;
  className?: string;
}) {
  return (
    <div className={`mask-fade-x overflow-hidden ${className ?? ""}`}>
      <div
        className="flex w-max animate-marquee"
        style={{ ["--marquee-duration" as string]: duration }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

/** Grand bandeau typographique « Innover ✦ Inspirer ✦ Créer ». */
export function WordsBand() {
  const sequence = (
    <>
      {marqueeWords.map((word) => (
        <span key={word} className="flex items-center">
          <span className="px-7 font-heading text-5xl font-extrabold tracking-tight sm:px-12 sm:text-7xl lg:text-8xl">
            {word}
          </span>
          <Sparkle className="h-6 w-6 shrink-0 text-brand sm:h-9 sm:w-9" />
        </span>
      ))}
    </>
  );

  return (
    <section className="py-16 sm:py-20">
      <Track duration="34s">{sequence}</Track>
      <div className="mx-auto mt-12 flex max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-10">
        <span className="h-px flex-1 bg-white/15" />
        <Diamond className="h-3 w-3 text-white/50" />
        <span className="h-px flex-1 bg-white/15" />
      </div>
    </section>
  );
}

/** Bandeau de mots-clés métier, défilant en sens inverse. */
export function TagsBand() {
  const sequence = (
    <>
      {tagWords.map((word) => (
        <span key={word} className="flex items-center">
          <span className="px-6 font-heading text-xl font-semibold text-white/85 sm:px-10 sm:text-3xl">
            {word}
          </span>
          <Sparkle className="h-4 w-4 shrink-0 text-brand sm:h-5 sm:w-5" />
        </span>
      ))}
    </>
  );

  return (
    <section className="border-y border-white/10 bg-white/[0.02] py-8">
      <Track duration="28s">{sequence}</Track>
    </section>
  );
}
