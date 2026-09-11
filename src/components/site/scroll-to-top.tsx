"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import { ChevronUp } from "lucide-react";
import { remonterEnHaut } from "@/components/motion/lenis-instance";
import { easeOutExpo } from "@/components/motion/reveal";

/**
 * Bouton flottant de retour en haut, ceinturé d'un anneau qui se remplit
 * à mesure que la page défile.
 */
export function ScrollToTop() {
  const { scrollYProgress } = useScroll();
  /* Le ressort absorbe les à-coups de la molette : l'anneau se remplit
     d'un geste continu plutôt que par saccades. */
  const avancement = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (valeur) => {
    setVisible(valeur > 0.06);
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={remonterEnHaut}
          aria-label="Revenir en haut de la page"
          initial={{ opacity: 0, scale: 0.7, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 12 }}
          transition={{ duration: 0.35, ease: easeOutExpo }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="group fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-ink/85 ring-1 ring-white/10 backdrop-blur-xl sm:bottom-10 sm:right-10"
        >
          {/* Halo qui s'allume au survol */}
          <span className="absolute inset-0 rounded-full bg-brand/25 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100" />

          <svg
            viewBox="0 0 56 56"
            className="absolute inset-0 h-full w-full -rotate-90"
            fill="none"
            aria-hidden
          >
            {/* Rail de l'anneau */}
            <circle
              cx="28"
              cy="28"
              r="25"
              stroke="#ffffff"
              strokeOpacity={0.14}
              strokeWidth="2.5"
            />
            {/*
              `pathLength` normalise la longueur du tracé à 1 : la valeur
              de progression du défilement s'y branche directement, sans
              calcul de circonférence.
            */}
            <motion.circle
              cx="28"
              cy="28"
              r="25"
              stroke="#a3e635"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ pathLength: avancement }}
            />
          </svg>

          <ChevronUp className="relative h-5 w-5 text-white transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:text-brand" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
