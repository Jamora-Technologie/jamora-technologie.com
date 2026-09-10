"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { brand, footer } from "@/lib/content";
import logoLockup from "@/assets/img/logo/logo-lockup.png";

export function Footer() {
  return (
    <footer className="px-4 pb-4 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl rounded-[2rem] bg-brand px-6 py-14 text-brand-foreground sm:rounded-[2.5rem] sm:px-12 sm:py-16">
        {/* Bloc de marque centré */}
        <div className="flex flex-col items-center text-center">
          <Link href="/" aria-label={brand.fullName} className="inline-block">
            {/*
              Le logo est noir sur fond blanc. `mix-blend-multiply` fait
              disparaître ce blanc dans le vert du footer : blanc × fond = fond,
              tandis que le lettrage noir reste intact.
            */}
            <Image
              src={logoLockup}
              alt=""
              className="h-12 w-auto mix-blend-multiply transition-transform hover:scale-[1.03] sm:h-14"
            />
          </Link>
          <p className="mt-6 max-w-xl text-base leading-relaxed opacity-70">
            {footer.description}
          </p>
        </div>

        <div className="my-12 h-px bg-brand-foreground/15" />

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
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
