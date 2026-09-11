"use client";

import {
  motion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { useRef, type ReactNode } from "react";

/**
 * Courbe d'accélération commune à toutes les entrées du site.
 * Un easing unique = une identité de mouvement cohérente d'une section à l'autre.
 */
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOutExpo },
  },
};

export const staggerParent: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Décalage vertical initial, en pixels. */
  y?: number;
};

/**
 * Enveloppe une portion de page et la révèle à l'entrée dans le viewport.
 * `once: true` évite que le contenu rejoue son animation à chaque scroll.
 */
export function Reveal({ children, className, delay = 0, y = 28 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: easeOutExpo, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Variante « conteneur » : les enfants directs utilisant `fadeUp`
 * s'animent en cascade au lieu d'apparaître d'un bloc.
 */
export function RevealGroup({
  children,
  className,
  amount = 0.2,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={staggerParent}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Révèle un titre mot par mot : chaque mot monte, se défloute et
 * s'opacifie, avec un léger décalage. Plus vivant qu'un fondu global,
 * et le texte reste un seul bloc lisible pour les lecteurs d'écran.
 */
export function WordReveal({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const mots = text.split(" ");

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ staggerChildren: 0.055, delayChildren: delay }}
      aria-label={text}
    >
      {mots.map((mot, index) => (
        <span
          key={`${mot}-${index}`}
          /* `inline-block` sur un conteneur par mot : l'animation porte sur
             la boîte, et les retours à la ligne restent naturels. */
          className="inline-block overflow-hidden align-bottom"
          aria-hidden
        >
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "0.9em", opacity: 0, filter: "blur(8px)" },
              visible: {
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                transition: { duration: 0.75, ease: easeOutExpo },
              },
            }}
          >
            {mot}
          </motion.span>
          {index < mots.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </motion.span>
  );
}

/**
 * Déplace son contenu à contre-courant du défilement.
 * `distance` est l'amplitude totale en pixels, du haut au bas de la course.
 */
export function Parallax({
  children,
  className,
  distance = 80,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    /* La course commence quand le haut de l'élément touche le bas de
       l'écran et s'achève quand son bas touche le haut. */
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance / 2, -distance / 2]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="h-full">
        {children}
      </motion.div>
    </div>
  );
}
