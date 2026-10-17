"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { href: string; label: string; badge?: number };

export function AdminNav({ items, base }: { items: Item[]; base: string }) {
  const pathname = usePathname();

  /* « Demandes » reste actif sur la fiche d'une demande. `pathname` est
     l'adresse publique, `base` le préfixe réel du back-office. */
  const isActive = (href: string) =>
    href === base
      ? pathname === base || pathname.startsWith(`${base}/messages`)
      : pathname.startsWith(href);

  return (
    <nav aria-label="Back-office" className="-mb-px flex gap-1 overflow-x-auto">
      {items.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium transition-colors ${
              active
                ? "border-brand text-white"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            {item.label}
            {item.badge ? (
              <span className="grid min-w-5 place-items-center rounded-full bg-brand px-1.5 text-xs font-semibold text-brand-foreground">
                {item.badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
