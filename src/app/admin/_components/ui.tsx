import type { ReactNode } from "react";

/** Éléments visuels partagés par les écrans du back-office. */

export const inputClass =
  "w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-brand/60 focus:bg-white/[0.06] aria-[invalid=true]:border-red-400/60";

export const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-white/50";

export function PageHeading({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-white sm:text-3xl">
          {title}
        </h1>
        {subtitle && <p className="mt-2 max-w-2xl text-sm text-white/55">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export function Card({
  title,
  description,
  aside,
  children,
}: {
  title?: string;
  description?: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-[#0d0d0d] p-6 ring-1 ring-white/10 sm:p-7">
      {(title || aside) && (
        <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title && (
              <h2 className="font-heading text-lg font-semibold text-white">{title}</h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-white/50">{description}</p>
            )}
          </div>
          {aside}
        </header>
      )}
      {children}
    </section>
  );
}

const pillTones = {
  brand: "bg-brand/15 text-brand",
  muted: "bg-white/8 text-white/55",
  warn: "bg-amber-400/15 text-amber-300",
  danger: "bg-red-400/15 text-red-300",
} as const;

export function Pill({
  tone = "muted",
  children,
}: {
  tone?: keyof typeof pillTones;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${pillTones[tone]}`}
    >
      {children}
    </span>
  );
}

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Africa/Dakar",
});

export function formatDate(iso: string): string {
  return dateFormat.format(new Date(iso));
}
