"use client";

import Image from "next/image";
import {
  Database,
  LayoutDashboard,
  Monitor,
  Network,
  Smartphone,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import logoMark from "@/assets/img/logo/logo-mark.png";
import { cn } from "@/lib/utils";

/*
 * Schéma d'architecture de la section Services.
 *
 * Les coordonnées vivent dans le repère du viewBox, et les tuiles HTML
 * sont positionnées en pourcentage de ce même repère. Attention : leur
 * *taille*, elle, reste en pixels — le SVG se met à l'échelle, les
 * tuiles non. D'où deux dispositions, dont chaque viewBox est calibré
 * sur la largeur réelle du conteneur à ce palier.
 */

type Surface = {
  id: string;
  icone: LucideIcon;
  nom: string;
  flux: string;
  teinte: string;
  texteTeinte: string;
};

/* Ce qui consomme la plateforme. */
const SURFACES: Surface[] = [
  { id: "web", icone: Monitor, nom: "Web", flux: "UI / UX", teinte: "#a3e635", texteTeinte: "#0a0f04" },
  { id: "mobile", icone: Smartphone, nom: "Mobile", flux: "API REST", teinte: "#65a30d", texteTeinte: "#f7fee7" },
  { id: "dashboard", icone: LayoutDashboard, nom: "Dashboard", flux: "Temps réel", teinte: "#d9f99d", texteTeinte: "#14210a" },
];

/* Ce sur quoi elle s'appuie. */
const SOCLES = [
  { id: "ia", icone: Sparkles, label: "Modèles\nIA" },
  { id: "donnees", icone: Database, label: "Données\npersistantes" },
  { id: "tiers", icone: Network, label: "Services\ntiers" },
];

type Point = { x: number; y: number };

type Disposition = {
  vue: { largeur: number; hauteur: number };
  centre: Point;
  surfaces: Point[];
  /** Position des étiquettes de flux ; absente si elles sont masquées. */
  flux?: Point[];
  socles: Point[];
  axe: "horizontal" | "vertical";
  /** Intitulé du socle à droite du cercle, ou dessous. */
  labelSocleACote: boolean;
};

/* Écrans larges : convergence horizontale, étiquettes de flux visibles. */
const LARGE: Disposition = {
  vue: { largeur: 900, hauteur: 560 },
  centre: { x: 400, y: 280 },
  surfaces: [
    { x: 72, y: 96 },
    { x: 54, y: 280 },
    { x: 72, y: 464 },
  ],
  flux: [
    { x: 218, y: 152 },
    { x: 200, y: 280 },
    { x: 218, y: 408 },
  ],
  socles: [
    { x: 616, y: 118 },
    { x: 648, y: 280 },
    { x: 616, y: 442 },
  ],
  axe: "horizontal",
  labelSocleACote: true,
};

/*
 * Mobile : le viewBox fait 320 unités de large, soit à peu près la
 * largeur réelle du conteneur. Une unité vaut donc environ un pixel, et
 * les tuiles de 40 px occupent bien 40 unités — plus aucun chevauchement.
 * Les étiquettes de flux sont masquées, faute de place entre les colonnes.
 */
const COMPACT: Disposition = {
  vue: { largeur: 320, hauteur: 580 },
  centre: { x: 160, y: 72 },
  surfaces: [
    { x: 58, y: 236 },
    { x: 58, y: 360 },
    { x: 58, y: 484 },
  ],
  socles: [
    { x: 262, y: 236 },
    { x: 262, y: 360 },
    { x: 262, y: 484 },
  ],
  axe: "vertical",
  labelSocleACote: false,
};

const pct = (valeur: number, total: number) => `${(valeur / total) * 100}%`;

function courbe(de: Point, vers: Point, axe: Disposition["axe"]) {
  if (axe === "horizontal") {
    const m = (de.x + vers.x) / 2;
    return `M ${de.x} ${de.y} C ${m} ${de.y}, ${m} ${vers.y}, ${vers.x} ${vers.y}`;
  }
  const m = (de.y + vers.y) / 2;
  return `M ${de.x} ${de.y} C ${de.x} ${m}, ${vers.x} ${m}, ${vers.x} ${vers.y}`;
}

function Schema({ d, className }: { d: Disposition; className?: string }) {
  const idFiltre = `fleche-${d.axe}`;
  /* Points d'attache sur le nœud central, décalés pour éviter que les
     courbes ne se superposent à son arrivée. */
  const attache = (index: number, cote: -1 | 1): Point =>
    d.axe === "horizontal"
      ? { x: d.centre.x + cote * 78, y: d.centre.y - 40 + index * 40 }
      : { x: d.centre.x - 30 + index * 30, y: d.centre.y + 52 };

  return (
    <div
      className={cn("relative w-full", className)}
      style={{ aspectRatio: `${d.vue.largeur} / ${d.vue.hauteur}` }}
      aria-hidden
    >
      <svg
        viewBox={`0 0 ${d.vue.largeur} ${d.vue.hauteur}`}
        className="absolute inset-0 h-full w-full"
        fill="none"
      >
        <defs>
          <pattern id={`trame-${d.axe}`} width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.1" fill="#ffffff" fillOpacity="0.07" />
          </pattern>
          <filter id={`lueur-${d.axe}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
          <marker id={`${idFiltre}-marque`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 1 L 9 5 L 0 9 z" fill="#a3e635" />
          </marker>
          <marker id={`${idFiltre}-neutre`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 1 L 9 5 L 0 9 z" fill="#ffffff" fillOpacity="0.45" />
          </marker>
        </defs>

        <rect width={d.vue.largeur} height={d.vue.hauteur} fill={`url(#trame-${d.axe})`} />

        {/* Flux entrants : les surfaces appellent la plateforme */}
        {SURFACES.map((surface, index) => {
          const depart = d.surfaces[index];
          const arrivee = attache(index, -1);
          const chemin =
            d.axe === "horizontal"
              ? courbe({ x: depart.x + 26, y: depart.y }, arrivee, d.axe)
              : courbe({ x: depart.x, y: depart.y - 30 }, arrivee, d.axe);
          return (
            <g key={surface.id}>
              <path d={chemin} stroke={surface.teinte} strokeOpacity={0.55} strokeWidth={1.8} markerEnd={`url(#${idFiltre}-marque)`} />
              <path
                d={chemin}
                pathLength={1000}
                stroke={surface.teinte}
                strokeWidth={3}
                strokeLinecap="round"
                strokeDasharray="45 955"
                filter={`url(#lueur-${d.axe})`}
                className="animate-signal"
                style={{ animationDelay: `${index * 0.8}s` }}
              />
            </g>
          );
        })}

        {/* Appuis sortants : la plateforme s'adosse à ses socles */}
        {SOCLES.map((socle, index) => {
          const cible = d.socles[index];
          const depart = attache(index, 1);
          const chemin =
            d.axe === "horizontal"
              ? courbe(depart, { x: cible.x - 34, y: cible.y }, d.axe)
              : courbe(depart, { x: cible.x, y: cible.y - 30 }, d.axe);
          return (
            <path
              key={socle.id}
              d={chemin}
              stroke="#ffffff"
              strokeOpacity={0.25}
              strokeWidth={1.5}
              markerEnd={`url(#${idFiltre}-neutre)`}
            />
          );
        })}
      </svg>

      {/* Tuiles des surfaces */}
      {SURFACES.map((surface, index) => {
        const Icone = surface.icone;
        const p = d.surfaces[index];
        return (
          <div
            key={surface.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: pct(p.x, d.vue.largeur), top: pct(p.y, d.vue.hauteur) }}
          >
            {/* Le libellé est en absolu : sa longueur ne dilate pas la tuile. */}
            <span className="grid h-10 w-10 place-items-center rounded-[0.9rem] bg-white shadow-[0_10px_28px_-10px_rgba(0,0,0,0.6)] xl:h-12 xl:w-12">
              <Icone className="h-5 w-5 text-[#3f6212] xl:h-6 xl:w-6" strokeWidth={1.9} />
            </span>
            <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-[0.68rem] font-medium text-white/60">
              {surface.nom}
            </span>
          </div>
        );
      })}

      {/* Étiquettes de flux, posées sur les liaisons */}
      {d.flux?.map((p, index) => (
        <span
          key={SURFACES[index].id}
          className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[0.7rem] font-semibold shadow-[0_6px_18px_-6px_rgba(0,0,0,0.7)]"
          style={{
            left: pct(p.x, d.vue.largeur),
            top: pct(p.y, d.vue.hauteur),
            backgroundColor: SURFACES[index].teinte,
            color: SURFACES[index].texteTeinte,
          }}
        >
          {SURFACES[index].flux}
        </span>
      ))}

      {/* Socles : cercles pointillés et intitulé */}
      {SOCLES.map((socle, index) => {
        const Icone = socle.icone;
        const p = d.socles[index];
        return (
          <div
            key={socle.id}
            className={cn(
              "absolute",
              d.labelSocleACote
                ? "flex -translate-y-1/2 items-center gap-2.5"
                : "-translate-x-1/2 -translate-y-1/2",
            )}
            style={{
              left: pct(d.labelSocleACote ? p.x - 30 : p.x, d.vue.largeur),
              top: pct(p.y, d.vue.hauteur),
            }}
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-dashed border-white/35 xl:h-10 xl:w-10">
              <Icone className="h-4 w-4 text-white/70" strokeWidth={1.8} />
            </span>
            <span
              className={cn(
                "whitespace-pre-line text-[0.68rem] leading-tight text-white/55",
                d.labelSocleACote
                  ? ""
                  : "absolute left-1/2 top-full mt-2 w-24 -translate-x-1/2 text-center",
              )}
            >
              {socle.label}
            </span>
          </div>
        );
      })}

      {/* Nœud central : la plateforme */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: pct(d.centre.x, d.vue.largeur), top: pct(d.centre.y, d.vue.hauteur) }}
      >
        <div className="relative grid place-items-center">
          <span className="animate-breathe absolute h-20 w-20 rounded-full bg-brand blur-2xl xl:h-24 xl:w-24" />
          <div className="relative flex flex-col items-center gap-1.5 rounded-[1.2rem] bg-ink p-3 shadow-[0_18px_45px_-12px_rgba(0,0,0,0.8)] ring-1 ring-brand/45 xl:gap-2 xl:rounded-[1.35rem] xl:p-4">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand/15 xl:h-11 xl:w-11">
              <Image src={logoMark} alt="" className="h-5 w-auto xl:h-6" />
            </span>
            <span className="whitespace-nowrap font-heading text-[0.65rem] font-semibold text-white xl:text-[0.7rem]">
              Plateforme
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ServicesDiagram() {
  return (
    <>
      <Schema d={COMPACT} className="mx-auto max-w-[360px] xl:hidden" />
      <Schema d={LARGE} className="hidden xl:block" />
    </>
  );
}
