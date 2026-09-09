"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * Compte de 0 jusqu'à `target` quand l'élément entre dans le viewport.
 *
 * Retourne la `ref` à poser sur le nombre affiché et la valeur courante.
 * Tant que l'élément n'est pas visible, la valeur reste à 0 : le compteur
 * ne « démarre » donc jamais hors écran.
 */
export function useCountUp(target: number, duration = 1800) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    // Un compteur qui défile est du mouvement décoratif : on l'escamote
    // pour les personnes qui demandent à réduire les animations.
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      const immediate = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(immediate);
    }

    let frame = 0;
    let startedAt: number | null = null;

    const tick = (now: number) => {
      startedAt ??= now;
      const progress = Math.min((now - startedAt) / duration, 1);

      // easeOutQuart : départ franc puis arrivée amortie, ce qui donne
      // au chiffre l'impression de se « poser » sur sa valeur finale.
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.round(target * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        // L'interpolation peut s'arrêter à 1999 : on fixe la valeur exacte.
        setValue(target);
      }
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [inView, target, duration]);

  return { ref, value };
}
