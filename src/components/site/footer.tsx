"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { brand, footer } from "@/lib/content";
import logoMark from "@/assets/img/logo/logo-mark.png";

/** Filigrane géant qui défile au pied du footer, balayé par une lueur. */
function Filigrane() {
  const mot = (
    <span
      className="animate-shimmer bg-clip-text px-8 font-heading text-[10vw] font-black leading-none tracking-tight text-transparent"
      style={{
        backgroundImage:
          "linear-gradient(100deg, rgba(163,230,53,0.08) 25%, rgba(163,230,53,0.6) 45%, rgba(163,230,53,0.08) 65%)",
        backgroundSize: "200% 100%",
      }}
    >
      {brand.fullName}
    </span>
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 select-none overflow-hidden"
    >
      {/* Le bas des lettres est volontairement rogné par le bord de la page. */}
      <div
        className="flex w-max translate-y-[18%] animate-marquee"
        style={{ ["--marquee-duration" as string]: "30s" }}
      >
        <div className="flex shrink-0">{mot}</div>
        <div className="flex shrink-0">{mot}</div>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden">
      {/*
        Le dégradé démarre sur le noir exact de la page : le footer n'a
        ni bord ni coin, il émerge simplement du fond au fil du défilement.
      */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(180deg, #050505 0%, #101c09 22%, #2c4a10 52%, #101c09 80%, #050505 100%)",
        }}
      />
      {/* Halo vert diffus, qui donne au raccord son épaisseur */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(70% 60% at 50% 40%, rgba(163,230,53,0.16) 0%, rgba(163,230,53,0) 70%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 pb-[9vw] pt-16 sm:px-10 lg:px-12">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-12">
          <div className="col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-heading text-xl font-semibold text-white transition-transform hover:scale-[1.02]"
            >
              <Image src={logoMark} alt="" className="h-8 w-auto" />
              {brand.fullName}
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              {footer.description}
            </p>
          </div>

          {footer.columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="font-heading text-xs font-semibold uppercase tracking-[0.15em] text-brand">
                {column.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/65 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="col-span-2 lg:col-span-1">
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.15em] text-brand">
              {footer.contactTitle}
            </p>
            <ul className="mt-4 space-y-3 text-sm text-white/65">
              <li>
                <a
                  href={`mailto:${brand.email}`}
                  className="group flex items-start gap-2.5 transition-colors hover:text-white"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                  <span className="group-hover:underline">{brand.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={brand.phoneHref}
                  className="group flex items-center gap-2.5 transition-colors hover:text-white"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  <span className="group-hover:underline">{brand.phone}</span>
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 shrink-0" />
                {brand.location}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} {brand.fullName}. Tous droits réservés.
          </p>
        </div>
      </div>

      <Filigrane />
    </footer>
  );
}
