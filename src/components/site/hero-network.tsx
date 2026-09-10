"use client";

import Image from "next/image";
import { Blocks, Brain, Globe, PenTool, Smartphone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { projects } from "@/lib/content";
import logoMark from "@/assets/img/logo/logo-mark.png";

/*
 * Réseau du hero : le logo au centre, les expertises et les applications
 * en périphérie, reliés par des faisceaux que parcourt une impulsion.
 *
 * Les coordonnées vivent dans le repère du viewBox et le conteneur porte
 * le même rapport d'aspect : une position en pourcentage y désigne donc
 * exactement le même point que dans le SVG, sans aucune mesure au runtime.
 */

type Item = {
  id: string;
  label: string;
  /** Décalage du signal, pour que les faisceaux ne pulsent pas en chœur. */
  retard: number;
  icone?: LucideIcon;
  logo?: (typeof projects)[number]["logo"];
};

const sendon = projects.find((p) => p.slug === "sendon");
const dara = projects.find((p) => p.slug === "dara-j-food");

const ITEMS: Item[] = [
  { id: "sendon", label: "SenDon", retard: 0.2, logo: sendon?.logo },
  { id: "ia", label: "Intelligence Artificielle", retard: 0, icone: Brain },
  { id: "web", label: "Développement Web", retard: 1.1, icone: Globe },
  { id: "mobile", label: "Développement Mobile", retard: 0.6, icone: Smartphone },
  { id: "dara", label: "Dara-J-Food", retard: 0.9, logo: dara?.logo },
  { id: "design", label: "Design UI/UX", retard: 0.35, icone: PenTool },
  { id: "sur-mesure", label: "Solutions sur mesure", retard: 1.4, icone: Blocks },
];

type Point = { x: number; y: number };

type Disposition = {
  vue: { largeur: number; hauteur: number };
  centre: Point;
  /** Une position par entrée de ITEMS, dans le même ordre. */
  positions: Point[];
  /** Sens de départ des courbes : elles quittent le nœud à l'horizontale ou à la verticale. */
  axe: "horizontal" | "vertical";
};

/* Écrans larges : deux colonnes qui convergent vers le centre. */
const LARGE: Disposition = {
  vue: { largeur: 1000, hauteur: 440 },
  centre: { x: 500, y: 220 },
  positions: [
    { x: 128, y: 58 },
    { x: 52, y: 178 },
    { x: 52, y: 288 },
    { x: 128, y: 400 },
    { x: 872, y: 58 },
    { x: 948, y: 220 },
    { x: 872, y: 400 },
  ],
  axe: "horizontal",
};

/* Mobile : le format très large devient illisible, le réseau se déploie
   donc vers le bas depuis un centre placé en haut. */
const COMPACT: Disposition = {
  vue: { largeur: 400, hauteur: 660 },
  centre: { x: 200, y: 60 },
  positions: [
    { x: 92, y: 200 },
    { x: 308, y: 200 },
    { x: 92, y: 340 },
    { x: 308, y: 340 },
    { x: 92, y: 480 },
    { x: 308, y: 480 },
    { x: 200, y: 610 },
  ],
  axe: "vertical",
};

function trace(depart: Point, centre: Point, axe: Disposition["axe"]) {
  if (axe === "horizontal") {
    const m = (depart.x + centre.x) / 2;
    return `M ${depart.x} ${depart.y} C ${m} ${depart.y}, ${m} ${centre.y}, ${centre.x} ${centre.y}`;
  }
  const m = (depart.y + centre.y) / 2;
  return `M ${depart.x} ${depart.y} C ${depart.x} ${m}, ${centre.x} ${m}, ${centre.x} ${centre.y}`;
}

const pct = (valeur: number, total: number) => `${(valeur / total) * 100}%`;

function Tuile({ item, point, vue }: { item: Item; point: Point; vue: Disposition["vue"] }) {
  const Icone = item.icone;
  return (
    <div
      className="absolute flex w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 sm:w-32"
      style={{ left: pct(point.x, vue.largeur), top: pct(point.y, vue.hauteur) }}
    >
      <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-[1.1rem] bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] ring-1 ring-ink/10 sm:h-14 sm:w-14">
        {item.logo ? (
          <Image src={item.logo} alt="" className="h-9 w-9 object-contain sm:h-11 sm:w-11" />
        ) : Icone ? (
          <Icone className="h-6 w-6 text-[#3f6212]" strokeWidth={1.75} />
        ) : null}
      </div>
      <span className="text-center text-[11px] font-medium leading-tight text-neutral-500">
        {item.label}
      </span>
    </div>
  );
}

function Reseau({ d, className }: { d: Disposition; className?: string }) {
  const idFiltre = `lueur-${d.axe}`;
  return (
    <div
      className={`relative mx-auto w-full ${className ?? ""}`}
      style={{ aspectRatio: `${d.vue.largeur} / ${d.vue.hauteur}` }}
      aria-hidden
    >
      <svg
        viewBox={`0 0 ${d.vue.largeur} ${d.vue.hauteur}`}
        className="absolute inset-0 h-full w-full"
        fill="none"
      >
        <defs>
          <filter id={idFiltre} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        {ITEMS.map((item, i) => {
          const chemin = trace(d.positions[i], d.centre, d.axe);
          return (
            <g key={item.id}>
              <path d={chemin} stroke="#0a0a0a" strokeOpacity={0.12} strokeWidth={1.4} />
              <path
                d={chemin}
                pathLength={1000}
                stroke="#a3e635"
                strokeWidth={7}
                strokeLinecap="round"
                strokeDasharray="55 945"
                filter={`url(#${idFiltre})`}
                className="animate-signal"
                style={{ animationDelay: `${item.retard}s` }}
              />
              <path
                d={chemin}
                pathLength={1000}
                stroke="#4d7c0f"
                strokeWidth={2}
                strokeLinecap="round"
                strokeDasharray="40 960"
                className="animate-signal"
                style={{ animationDelay: `${item.retard}s` }}
              />
            </g>
          );
        })}
      </svg>

      {ITEMS.map((item, i) => (
        <Tuile key={item.id} item={item} point={d.positions[i]} vue={d.vue} />
      ))}

      {/* Nœud central : la marque, vers laquelle tout converge */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: pct(d.centre.x, d.vue.largeur), top: pct(d.centre.y, d.vue.hauteur) }}
      >
        <div className="relative grid place-items-center">
          <span className="animate-breathe absolute h-24 w-24 rounded-full bg-brand blur-2xl sm:h-32 sm:w-32" />
          <div className="relative grid h-20 w-20 place-items-center rounded-[1.5rem] bg-ink shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] sm:h-24 sm:w-24">
            <Image src={logoMark} alt="" priority className="h-11 w-auto sm:h-14" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroNetwork() {
  return (
    <>
      <Reseau d={COMPACT} className="max-w-sm md:hidden" />
      <Reseau d={LARGE} className="hidden max-w-5xl md:block" />
    </>
  );
}
