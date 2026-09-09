import { cn } from "@/lib/utils";

/** Étoile éclatée : marque de fabrique du logo et des décors du hero. */
export function Burst({ className }: { className?: string }) {
  const rays = Array.from({ length: 16 }, (_, i) => (i * 360) / 16);
  return (
    <svg viewBox="0 0 100 100" className={cn("h-6 w-6", className)} aria-hidden>
      {rays.map((angle) => (
        <rect
          key={angle}
          x="48.2"
          y="4"
          width="3.6"
          height="34"
          rx="1.8"
          fill="currentColor"
          transform={`rotate(${angle} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="11" fill="currentColor" />
    </svg>
  );
}

/** Étoile à quatre branches utilisée comme séparateur dans les bandeaux. */
export function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={cn("h-5 w-5", className)} aria-hidden>
      <path
        d="M50 0c3 27 20 44 50 50-30 6-47 23-50 50-3-27-20-44-50-50 30-6 47-23 50-50z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Petit losange fin, séparateur des lignes horizontales. */
export function Diamond({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={cn("h-3 w-3", className)} aria-hidden>
      <path d="M50 0 100 50 50 100 0 50z" fill="currentColor" />
    </svg>
  );
}

/** Feuille stylisée, posée en accent autour des titres. */
export function Leaf({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 60" className={cn("h-5 w-8", className)} aria-hidden>
      <path
        d="M4 56C18 20 52 2 96 4c-8 34-42 54-92 52z"
        fill="currentColor"
        opacity="0.9"
      />
      <path d="M8 54C30 34 60 18 92 8" stroke="#050505" strokeWidth="3" fill="none" />
    </svg>
  );
}

/** Gribouillis manuscrit sous le portrait du hero. */
export function Squiggle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 60" className={cn("h-10 w-24", className)} aria-hidden>
      <path
        d="M4 44c22-34 44 12 62-8s26 22 44 4 30-24 46-30"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/** Ampoule tracée à la main, en accent rouge sur la photo « à propos ». */
export function BulbDoodle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={cn("h-16 w-16", className)} aria-hidden>
      <g stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M60 30a22 22 0 0 0-13 39v9h26v-9A22 22 0 0 0 60 30z" />
        <path d="M50 86h20M53 94h14" />
        <path d="M60 12v8M30 30l6 6M90 30l-6 6M18 60h8M94 60h8" />
      </g>
    </svg>
  );
}

/**
 * Icônes sociales maison : lucide-react ne fournit plus de logos de marque.
 * Tracés simplifiés, héritant de la couleur courante.
 */
export function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-4 w-4", className)} fill="currentColor" aria-hidden>
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H16.7V3.6c-.29-.04-1.28-.12-2.43-.12-2.4 0-4.05 1.47-4.05 4.17V9.9H7.5V13h2.72v8z" />
    </svg>
  );
}

export function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-4 w-4", className)} fill="currentColor" aria-hidden>
      <path d="M17.2 3h3.3l-7.2 8.2L21.8 21h-6.6l-5.2-6.7L4.1 21H.8l7.7-8.8L.4 3H7l4.7 6.2z" />
    </svg>
  );
}

export function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-4 w-4", className)} fill="currentColor" aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4v11H3zM10 9.5h3.8v1.5h.05c.53-.95 1.83-1.95 3.75-1.95 4 0 4.75 2.5 4.75 5.8v5.65h-4v-5c0-1.2-.02-2.75-1.75-2.75s-2 1.3-2 2.65v5.1h-4z" />
    </svg>
  );
}

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-4 w-4", className)} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
      </g>
      <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
    </svg>
  );
}
