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

/*
 * Schéma d'architecture de la section Services.
 *
 * Même principe que le réseau du hero : les coordonnées vivent dans le
 * repère du viewBox et le conteneur porte le même rapport d'aspect, si
 * bien qu'une position en pourcentage désigne exactement le même point
 * dans le SVG comme en HTML.
 */
const VUE = { largeur: 900, hauteur: 560 };
const CENTRE = { x: 400, y: 280 };

type Surface = {
  id: string;
  icone: LucideIcon;
  nom: string;
  /** Position de la tuile. */
  x: number;
  y: number;
  /** Étiquette portée par la liaison, et sa position. */
  flux: string;
  fluxX: number;
  fluxY: number;
  teinte: string;
  texteTeinte: string;
};

/* Ce qui consomme la plateforme, à gauche. */
const SURFACES: Surface[] = [
  {
    id: "web",
    icone: Monitor,
    nom: "Web",
    x: 72,
    y: 96,
    flux: "UI / UX",
    fluxX: 218,
    fluxY: 152,
    teinte: "#a3e635",
    texteTeinte: "#0a0f04",
  },
  {
    id: "mobile",
    icone: Smartphone,
    nom: "Mobile",
    x: 54,
    y: 280,
    flux: "API REST",
    fluxX: 200,
    fluxY: 280,
    teinte: "#65a30d",
    texteTeinte: "#f7fee7",
  },
  {
    id: "dashboard",
    icone: LayoutDashboard,
    nom: "Dashboard",
    x: 72,
    y: 464,
    flux: "Temps réel",
    fluxX: 218,
    fluxY: 408,
    teinte: "#d9f99d",
    texteTeinte: "#14210a",
  },
];

/* Ce sur quoi elle s'appuie, à droite. */
const SOCLES = [
  { id: "ia", icone: Sparkles, label: "Modèles\nIA", x: 616, y: 118 },
  { id: "donnees", icone: Database, label: "Données\npersistantes", x: 648, y: 280 },
  { id: "tiers", icone: Network, label: "Services\ntiers", x: 616, y: 442 },
];

const pct = (valeur: number, total: number) => `${(valeur / total) * 100}%`;

/** Courbe en S horizontale entre deux points. */
function courbe(de: { x: number; y: number }, vers: { x: number; y: number }) {
  const m = (de.x + vers.x) / 2;
  return `M ${de.x} ${de.y} C ${m} ${de.y}, ${m} ${vers.y}, ${vers.x} ${vers.y}`;
}

export function ServicesDiagram() {
  return (
    <div
      className="relative w-full"
      style={{ aspectRatio: `${VUE.largeur} / ${VUE.hauteur}` }}
      aria-hidden
    >
      <svg
        viewBox={`0 0 ${VUE.largeur} ${VUE.hauteur}`}
        className="absolute inset-0 h-full w-full"
        fill="none"
      >
        <defs>
          {/* Trame de points, comme sur un plan technique */}
          <pattern id="trame" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.1" fill="#ffffff" fillOpacity="0.07" />
          </pattern>
          <marker
            id="fleche-marque"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill="#a3e635" />
          </marker>
          <marker
            id="fleche-neutre"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill="#ffffff" fillOpacity="0.45" />
          </marker>
        </defs>

        <rect width={VUE.largeur} height={VUE.hauteur} fill="url(#trame)" />

        {/* Flux entrants : les surfaces appellent la plateforme */}
        {SURFACES.map((surface, index) => {
          const d = courbe(
            { x: surface.x + 46, y: surface.y },
            { x: CENTRE.x - 78, y: CENTRE.y - 40 + index * 40 },
          );
          return (
            <g key={surface.id}>
              <path
                d={d}
                stroke={surface.teinte}
                strokeOpacity={0.55}
                strokeWidth={1.8}
                markerEnd="url(#fleche-marque)"
              />
              <path
                d={d}
                pathLength={1000}
                stroke={surface.teinte}
                strokeWidth={3}
                strokeLinecap="round"
                strokeDasharray="45 955"
                className="animate-signal"
                style={{ animationDelay: `${index * 0.8}s` }}
              />
            </g>
          );
        })}

        {/* Appuis sortants : la plateforme s'adosse à ses socles */}
        {SOCLES.map((socle, index) => (
          <path
            key={socle.id}
            d={courbe(
              { x: CENTRE.x + 78, y: CENTRE.y - 40 + index * 40 },
              { x: socle.x - 34, y: socle.y },
            )}
            stroke="#ffffff"
            strokeOpacity={0.25}
            strokeWidth={1.5}
            markerEnd="url(#fleche-neutre)"
          />
        ))}
      </svg>

      {/* Tuiles des surfaces */}
      {SURFACES.map((surface) => {
        const Icone = surface.icone;
        return (
          <div
            key={surface.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: pct(surface.x, VUE.largeur), top: pct(surface.y, VUE.hauteur) }}
          >
            {/* Le libellé est en absolu : sa longueur ne peut plus dilater
                la tuile, qui reste carrée d'un nœud à l'autre. */}
            <span className="grid h-10 w-10 place-items-center rounded-[0.9rem] bg-white shadow-[0_10px_28px_-10px_rgba(0,0,0,0.6)] sm:h-12 sm:w-12">
              <Icone className="h-5 w-5 text-[#3f6212] sm:h-6 sm:w-6" strokeWidth={1.9} />
            </span>
            <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-[0.7rem] font-medium text-white/60">
              {surface.nom}
            </span>
          </div>
        );
      })}

      {/* Étiquettes de flux, posées sur les liaisons */}
      {SURFACES.map((surface) => (
        <span
          key={`${surface.id}-flux`}
          className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[0.7rem] font-semibold shadow-[0_6px_18px_-6px_rgba(0,0,0,0.7)]"
          style={{
            left: pct(surface.fluxX, VUE.largeur),
            top: pct(surface.fluxY, VUE.hauteur),
            backgroundColor: surface.teinte,
            color: surface.texteTeinte,
          }}
        >
          {surface.flux}
        </span>
      ))}

      {/* Socles : cercles pointillés et intitulé */}
      {SOCLES.map((socle) => {
        const Icone = socle.icone;
        return (
          <div
            key={socle.id}
            className="absolute flex -translate-y-1/2 items-center gap-2.5"
            style={{ left: pct(socle.x - 30, VUE.largeur), top: pct(socle.y, VUE.hauteur) }}
          >
            <span className="grid aspect-square w-[7%] min-w-9 place-items-center rounded-full border border-dashed border-white/35">
              <Icone className="h-[45%] w-[45%] text-white/70" strokeWidth={1.8} />
            </span>
            <span className="whitespace-pre-line text-[0.7rem] leading-tight text-white/55">
              {socle.label}
            </span>
          </div>
        );
      })}

      {/* Nœud central : la plateforme */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: pct(CENTRE.x, VUE.largeur), top: pct(CENTRE.y, VUE.hauteur) }}
      >
        <div className="relative grid place-items-center">
          <span className="animate-breathe absolute h-24 w-24 rounded-full bg-brand blur-2xl" />
          <div className="relative flex flex-col items-center gap-2 rounded-[1.35rem] bg-ink p-4 ring-1 ring-brand/45 shadow-[0_18px_45px_-12px_rgba(0,0,0,0.8)]">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand/15">
              <Image src={logoMark} alt="" className="h-6 w-auto" />
            </span>
            <span className="whitespace-nowrap font-heading text-[0.7rem] font-semibold text-white">
              Plateforme
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
