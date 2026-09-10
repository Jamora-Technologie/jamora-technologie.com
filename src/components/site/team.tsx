"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { team, type TeamMember } from "@/lib/content";
import { Reveal, easeOutExpo } from "@/components/motion/reveal";
import { LinkedinIcon } from "@/components/site/decor";
import { cn } from "@/lib/utils";

const PANEL_WIDTH = 360;

/** Contenu du panneau déplié, partagé par les deux mises en page. */
function MemberDetails({ member }: { member: TeamMember }) {
  return (
    <>
      <p className="font-heading text-lg font-semibold text-white">
        {member.name}
      </p>
      <p className="mt-1 text-sm font-medium italic text-brand">
        {member.title}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-white/75">{member.bio}</p>
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
  dimmed,
  openLeft,
  onActivate,
  onToggle,
}: {
  member: TeamMember;
  isActive: boolean;
  dimmed: boolean;
  openLeft: boolean;
  onActivate: () => void;
  onToggle: () => void;
}) {
  return (
    <article
      onMouseEnter={onActivate}
      onClick={onToggle}
      onFocus={onActivate}
      tabIndex={0}
      className={cn(
        "group relative cursor-pointer outline-none lg:h-[460px] lg:w-[220px] lg:shrink-0",
        isActive ? "z-20" : "z-10",
      )}
    >
      {/* Bloc visuel : sa taille ne change jamais, même carte ouverte */}
      <div
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-3xl ring-offset-2 ring-offset-background transition-opacity duration-500 group-focus-visible:ring-2 group-focus-visible:ring-brand",
          dimmed && "lg:opacity-45",
        )}
        style={{ backgroundColor: member.tone }}
      >
        <div className="relative z-10 h-[112px] shrink-0 px-5 pt-5">
          <h3 className="font-heading text-lg font-bold leading-tight text-ink">
            {member.name}
          </h3>
          <p className="mt-1 text-[13px] font-medium text-ink/70">
            {member.role}
          </p>
        </div>

        <div className="relative h-[340px] min-h-0 lg:h-auto lg:flex-1">
          <Image
            src={member.photo}
            alt={member.name}
            fill
            sizes="(max-width: 1024px) 100vw, 220px"
            className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`LinkedIn de ${member.name}`}
            onClick={(event) => event.stopPropagation()}
            className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-xl bg-ink/80 text-white backdrop-blur transition-colors hover:bg-brand hover:text-brand-foreground lg:opacity-100 lg:group-hover:opacity-0"
          >
            <LinkedinIcon className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/*
        Desktop : le panneau se déplie à côté de la carte, en superposition.
        Il flotte au-dessus des voisines au lieu de les comprimer, ce qui
        garde la taille des cartes strictement constante.
      */}
      <motion.div
        animate={{ width: isActive ? PANEL_WIDTH : 0 }}
        transition={{ duration: 0.5, ease: easeOutExpo }}
        className={cn(
          "absolute top-0 hidden h-full overflow-hidden rounded-3xl bg-[#111] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/10 lg:block",
          openLeft ? "right-full mr-3" : "left-full ml-3",
        )}
      >
        <div
          className="flex h-full flex-col justify-center p-8"
          style={{ width: PANEL_WIDTH }}
        >
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.35, ease: easeOutExpo, delay: 0.18 }}
              >
                <MemberDetails member={member} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Mobile : dépliement vertical, sous la photo */}
      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: easeOutExpo }}
            className="overflow-hidden rounded-b-3xl bg-[#111] lg:hidden"
          >
            <div className="p-6">
              <MemberDetails member={member} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

export function Team() {
  const [active, setActive] = useState<number | null>(null);

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
          <div
            onMouseLeave={() => setActive(null)}
            className="relative mt-10 flex flex-col gap-4 lg:flex-row lg:justify-center"
          >
            {team.members.map((member, index) => (
              <MemberCard
                key={member.slug}
                member={member}
                isActive={active === index}
                dimmed={active !== null && active !== index}
                /* Les deux dernières s'ouvrent vers la gauche pour ne pas
                   déborder du bloc. */
                openLeft={index >= team.members.length - 2}
                onActivate={() => setActive(index)}
                onToggle={() =>
                  setActive((current) => (current === index ? null : index))
                }
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
