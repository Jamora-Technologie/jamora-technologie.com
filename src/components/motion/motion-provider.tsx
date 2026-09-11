"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Applique la préférence système de réduction du mouvement à toutes les
 * animations Framer Motion du site.
 *
 * `reducedMotion="user"` neutralise les animations de transformation tout
 * en conservant les fondus. C'est préférable à un branchement manuel sur
 * `useReducedMotion()` au moment du rendu : ce dernier renvoie une valeur
 * différente sur le serveur et sur le client, ce qui provoquait une
 * erreur d'hydratation.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
