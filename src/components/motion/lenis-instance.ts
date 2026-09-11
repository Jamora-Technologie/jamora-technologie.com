import type Lenis from "lenis";

/**
 * Référence partagée vers l'instance Lenis active.
 *
 * Lenis reprend la main sur tout `window.scrollTo` programmatique : un
 * bouton « retour en haut » doit donc passer par son API, sinon
 * l'animation est immédiatement écrasée. Cette référence évite d'avoir à
 * faire descendre l'instance par un contexte à travers tout le layout.
 */
let instance: Lenis | null = null;

export function enregistrerLenis(lenis: Lenis | null) {
  instance = lenis;
}

/** Remonte en haut de page, avec Lenis s'il tourne, sinon en natif. */
export function remonterEnHaut() {
  if (instance) {
    instance.scrollTo(0, { duration: 1.1 });
    return;
  }
  /* Lenis ne démarre pas sous prefers-reduced-motion : le défilement
     natif prend alors le relais. */
  window.scrollTo({ top: 0, behavior: "smooth" });
}
