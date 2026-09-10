"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { brand, footer } from "@/lib/content";
import logoMark from "@/assets/img/logo/logo-mark.png";

/** Filigrane géant qui défile en bas du footer, balayé par une lueur. */
function Filigrane() {
  const mot = (
    <span
      className="animate-shimmer bg-clip-text px-8 font-heading text-[11vw] font-black leading-none tracking-tight text-transparent"
      style={{
        backgroundImage:
          "linear-gradient(100deg, rgba(163,230,53,0.10) 25%, rgba(163,230,53,0.75) 45%, rgba(163,230,53,0.10) 65%)",
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
      {/* Le bas des lettres est volontairement rogné par le bord du bloc. */}
      <div
        className="flex w-max translate-y-[16%] animate-marquee"
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
    <footer className="px-4 pb-4 sm:px-6 lg:px-10">
      <div
        className="relative isolate overflow-hidden rounded-[2rem] sm:rounded-[2.5rem]"
        style={{
          /* Clair en haut, puis fondu vers le noir du site : le footer se
             raccorde à la page sans rupture. */
          backgroundImage:
            "linear-gradient(180deg, #f7fee7 0%, #a3e635 7%, #3f6212 26%, #0e1a07 58%, #050505 100%)",
        }}
      >
        <Filigrane />

        <div className="relative z-10 px-6 pb-16 pt-14 sm:px-10 sm:pb-24 sm:pt-16">
          {/* Panneau de verre dépoli portant tout le contenu */}
          <div className="rounded-[1.75rem] border border-white/15 bg-white/[0.07] p-8 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:p-12">
            <div className="flex flex-col items-center text-center">
              <Link
                href="/"
                className="flex items-center gap-3 font-heading text-2xl font-semibold text-white transition-transform hover:scale-[1.03] sm:text-3xl"
              >
                <Image src={logoMark} alt="" className="h-9 w-auto sm:h-11" />
                {brand.fullName}
              </Link>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75">
                {footer.description}
              </p>
            </div>

            <div className="my-10 h-px bg-white/15" />

            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {footer.columns.map((column) => (
                <nav key={column.title} aria-label={column.title}>
                  <p className="font-heading text-xs font-semibold uppercase tracking-[0.15em] text-brand">
                    {column.title}
                  </p>
                  <ul className="mt-5 space-y-3">
                    {column.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-base text-white/70 transition-colors hover:text-white"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}

              <div>
                <p className="font-heading text-xs font-semibold uppercase tracking-[0.15em] text-brand">
                  {footer.contactTitle}
                </p>
                <ul className="mt-5 space-y-4 text-base text-white/70">
                  <li>
                    <a
                      href={`mailto:${brand.email}`}
                      className="group flex items-start gap-3 transition-colors hover:text-white"
                    >
                      <Mail className="mt-1 h-4 w-4 shrink-0" />
                      <span className="group-hover:underline">{brand.email}</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href={brand.phoneHref}
                      className="group flex items-center gap-3 transition-colors hover:text-white"
                    >
                      <Phone className="h-4 w-4 shrink-0" />
                      <span className="group-hover:underline">{brand.phone}</span>
                    </a>
                  </li>
                  <li className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 shrink-0" />
                    {brand.location}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col-reverse items-center justify-between gap-4 text-sm text-white/60 sm:flex-row">
            <p>
              © {new Date().getFullYear()} {brand.fullName}. Tous droits réservés.
            </p>
            <p>{brand.domain}</p>
          </div>
        </div>

        {/* Réserve la place du filigrane sous le contenu */}
        <div className="h-[8vw] sm:h-[9vw]" />
      </div>
    </footer>
  );
}
