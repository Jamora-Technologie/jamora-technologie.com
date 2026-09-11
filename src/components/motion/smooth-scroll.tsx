"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { enregistrerLenis } from "@/components/motion/lenis-instance";

/**
 * Défilement fluide sur l'ensemble du site.
 *
 * Le composant ne rend aucun élément : Lenis pilote le défilement de la
 * fenêtre elle-même, ce qui laisse intacts `position: sticky`, les
 * observateurs d'intersection et les ancres.
 */
export function SmoothScroll() {
  useEffect(() => {
    /* Le défilement inertiel est une source classique de gêne : on le
       laisse au comportement natif si la personne demande moins de
       mouvement. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      // Courbe d'amortissement : départ immédiat, arrivée très douce.
      easing: (t) => 1 - Math.pow(1 - t, 3),
      touchMultiplier: 1.6,
    });

    enregistrerLenis(lenis);

    let frame = requestAnimationFrame(function boucle(temps) {
      lenis.raf(temps);
      frame = requestAnimationFrame(boucle);
    });

    /*
     * Les ancres doivent passer par Lenis, sinon le saut natif
     * court-circuite l'animation. Le gestionnaire couvre aussi bien
     * `#section` que `/#section` — la navigation du site utilise la
     * seconde forme, pour rester valable depuis les autres pages.
     *
     * L'écoute est en phase de capture afin de précéder le routeur de
     * Next, et ne l'interrompt que pour une ancre de la page courante.
     */
    const surClic = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const lien = (event.target as HTMLElement).closest<HTMLAnchorElement>(
        "a[href]",
      );
      const href = lien?.getAttribute("href");
      if (!href || !href.includes("#")) return;

      const url = new URL(href, window.location.href);
      const memePage =
        url.origin === window.location.origin &&
        url.pathname === window.location.pathname;
      if (!memePage || !url.hash || url.hash === "#") return;

      const destination = document.querySelector(url.hash);
      if (!destination) return;

      event.preventDefault();
      event.stopPropagation();
      /* L'offset dégage la navbar fixe au-dessus de la section visée. */
      lenis.scrollTo(destination as HTMLElement, { offset: -110 });
    };

    document.addEventListener("click", surClic, { capture: true });

    return () => {
      document.removeEventListener("click", surClic, { capture: true });
      cancelAnimationFrame(frame);
      lenis.destroy();
      enregistrerLenis(null);
    };
  }, []);

  return null;
}
