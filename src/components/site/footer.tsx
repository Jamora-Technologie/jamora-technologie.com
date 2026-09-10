"use client";

import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { brand, footer } from "@/lib/content";
import { Burst } from "@/components/site/decor";

export function Footer() {
  return (
    <footer className="px-4 pb-4 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-brand px-6 py-14 text-brand-foreground sm:rounded-[2.5rem] sm:px-12 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          <div>
            <Link
              href="/"
              className="flex items-center gap-2.5 font-heading text-2xl font-semibold"
            >
              <Burst className="h-7 w-7" />
              {brand.fullName}
            </Link>
            <p className="mt-4 max-w-xs text-base leading-relaxed opacity-70">
              {footer.description}
            </p>
          </div>

          {footer.columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="font-heading text-xs font-semibold uppercase tracking-[0.15em]">
                {column.title}
              </p>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-base opacity-70 transition-opacity hover:opacity-100"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Coordonnées directes : e-mail et téléphone actionnables */}
          <div>
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.15em]">
              {footer.contactTitle}
            </p>
            <ul className="mt-5 space-y-4 text-base">
              <li>
                <a
                  href={`mailto:${brand.email}`}
                  className="group flex items-start gap-3 opacity-70 transition-opacity hover:opacity-100"
                >
                  <Mail className="mt-1 h-4 w-4 shrink-0" />
                  <span className="group-hover:underline">{brand.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={brand.phoneHref}
                  className="group flex items-center gap-3 opacity-70 transition-opacity hover:opacity-100"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  <span className="group-hover:underline">{brand.phone}</span>
                </a>
              </li>
              <li className="flex items-center gap-3 opacity-70">
                <MapPin className="h-4 w-4 shrink-0" />
                {brand.location}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse items-center justify-between gap-4 border-t border-brand-foreground/15 pt-6 sm:flex-row">
          <p className="text-sm opacity-70">
            © {new Date().getFullYear()} {brand.fullName}. Tous droits réservés.
          </p>
          <p className="text-sm opacity-70">{brand.domain}</p>
        </div>
      </div>
    </footer>
  );
}
