"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { team, type TeamMember } from "@/lib/content";
import { Reveal, easeOutExpo } from "@/components/motion/reveal";
import { LinkedinIcon } from "@/components/site/decor";

/** Contenu du panneau déplié, partagé par les deux mises en page. */
function MemberDetails({ member }: { member: TeamMember }) {
  return (
    <>
      <p className="text-sm font-medium italic text-brand">{member.title}</p>
      <p className="mt-3 text-sm leading-relaxed text-white/80">{member.bio}</p>
      <a
        href={member.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(event) => event.stopPropagation()}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-transform hover:scale-[1.04]"
      >
        <LinkedinIcon className="h-4 w-4" />
        LinkedIn
        <ArrowUpRight className="h-3.5 w-3.5" />
      </a>
    </>
  );
}

function MemberCard({
  member,
  isActive,
  onActivate,
}: {
  member: TeamMember;
  isActive: boolean;
  onActivate: () => void;
}) {
  return (
    <motion.article
      /*
       * `flexGrow` ne joue qu'en rangée (lg et plus) : en colonne, le
       * conteneur n'a pas de hauteur fixe, donc aucun espace libre à
       * répartir. La même animation sert les deux mises en page.
       */
      animate={{ flexGrow: isActive ? 3 : 1 }}
      transition={{ duration: 0.6, ease: easeOutExpo }}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      tabIndex={0}
      aria-expanded={isActive}
      style={{ backgroundColor: member.tone }}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl outline-none ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-brand lg:h-auto lg:basis-0"
    >
      {/* Bandeau de titre : la photo commence dessous, jamais derrière */}
      <div className="relative z-10 h-[112px] shrink-0 px-5 pt-5">
        <h3 className="font-heading text-lg font-bold leading-tight text-ink">
          {member.name}
        </h3>
        <p className="mt-1 text-[13px] font-medium text-ink/70">
          {member.role}
        </p>
      </div>

      <div className="relative flex h-[340px] min-h-0 lg:h-auto lg:flex-1">
        <div className="relative min-w-0 flex-1">
          <Image
            src={member.photo}
            alt={member.name}
            fill
            sizes="(max-width: 1024px) 100vw, 30vw"
            className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
          />

          {/* Raccourci LinkedIn sur les cartes repliées */}
          {!isActive && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`LinkedIn de ${member.name}`}
              onClick={(event) => event.stopPropagation()}
              className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-xl bg-ink/80 text-white backdrop-blur transition-colors hover:bg-brand hover:text-brand-foreground"
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>
          )}

        </div>

        {/*
          Desktop : le panneau se déplie à côté de la photo. En absorbant
          toute la largeur gagnée, il évite que la photo change de format
          et se recadre brutalement à chaque ouverture.
        */}
        <motion.div
          animate={{ width: isActive ? 300 : 0 }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="hidden shrink-0 overflow-hidden bg-ink/90 lg:block"
        >
          <div className="w-[300px] p-6">
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.4, ease: easeOutExpo, delay: 0.15 }}
                >
                  <MemberDetails member={member} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/*
        Mobile : le panneau se déplie sous la photo au lieu de la recouvrir.
        Un texte long masquerait sinon complètement le visage.
      */}
      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: easeOutExpo }}
            className="overflow-hidden bg-ink/92 lg:hidden"
          >
            <div className="p-5">
              <MemberDetails member={member} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

export function Team() {
  const [active, setActive] = useState(0);

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

        <Reveal delay={0.15}>
          <div className="relative mt-10 flex flex-col gap-4 lg:h-[560px] lg:flex-row">
            {team.members.map((member, index) => (
              <MemberCard
                key={member.slug}
                member={member}
                isActive={active === index}
                onActivate={() => setActive(index)}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
