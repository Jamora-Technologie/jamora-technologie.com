"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { presse, pressePage } from "@/lib/content";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/**
 * Retombées presse. Les liens sortants vers des médias reconnus sont un
 * signal de notoriété, et la mention rassure autant qu'elle référence.
 */
export function Press() {
  return (
    <section id="presse" className="scroll-mt-32 px-4 pb-24 pt-20 sm:px-6 sm:pt-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
            {pressePage.eyebrow}
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-4 font-heading text-[1.875rem] font-semibold sm:text-[2.375rem] lg:text-[2.875rem]">
            {pressePage.titreLead}{" "}
            <span className="rounded-xl bg-brand px-3 pb-1 text-brand-foreground">
              {pressePage.titreHighlight}
            </span>
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {presse.map((article, index) => (
            <Reveal key={article.url} delay={0.08 + index * 0.08}>
              <a
                href={article.url}
                target="_blank"
                /* `noopener` par sécurité ; pas de `nofollow` : ces liens
                   sortants vers des médias sont un signal légitime. */
                rel="noopener noreferrer"
                className="group flex h-full flex-col justify-between gap-6 rounded-3xl border border-white/12 bg-white/[0.03] p-7 transition-colors hover:border-brand/50 hover:bg-brand/[0.06]"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    {/* Plaque blanche obligatoire : l'un des logos est une
                        encre sombre détourée, l'autre arrive avec son propre
                        fond blanc. Le même socle les réconcilie. */}
                    <span className="inline-flex h-12 shrink-0 items-center rounded-xl bg-white px-3 ring-1 ring-transparent transition-[box-shadow] group-hover:ring-brand/40">
                      <Image
                        src={article.logo}
                        alt={article.media}
                        /* Servis tels quels : à 3,5 ko et déjà 3x la densité
                           d'affichage, l'optimiseur ne gagne rien et retombe
                           en JPEG si le client ne négocie pas le WebP, ce qui
                           aplatirait l'alpha du logo Seneweb sur du noir. */
                        unoptimized
                        className={cn("w-auto object-contain", article.logoClasse)}
                      />
                    </span>
                    <span className="text-sm text-white/35">{article.dateLisible}</span>
                  </div>
                  <p className="mt-5 font-heading text-lg font-medium leading-snug text-white sm:text-xl">
                    {article.titre}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-white/45">
                    Par {article.auteur}
                  </span>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 text-white transition-all group-hover:border-brand group-hover:bg-brand group-hover:text-brand-foreground">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
