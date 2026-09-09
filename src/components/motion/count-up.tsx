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

    // TODO(human): animer `value` de 0 vers `target` sur `duration` ms.
    // Aujourd'hui la valeur saute directement à sa cible en une frame.
    const frame = requestAnimationFrame(() => setValue(target));

    return () => cancelAnimationFrame(frame);
  }, [inView, target, duration]);

  return { ref, value };
}
