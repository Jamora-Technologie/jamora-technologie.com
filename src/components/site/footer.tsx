"use client";

import { useState } from "react";
import { brand, footer } from "@/lib/content";
import {
  Burst,
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  XIcon,
} from "@/components/site/decor";

const socials = [
  { Icon: FacebookIcon, label: "Facebook" },
  { Icon: XIcon, label: "X" },
  { Icon: LinkedinIcon, label: "LinkedIn" },
  { Icon: InstagramIcon, label: "Instagram" },
];

export function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="px-4 pb-4 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl rounded-[2rem] bg-brand px-6 py-12 text-brand-foreground sm:rounded-[2.5rem] sm:px-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_2fr_1.2fr] lg:gap-x-14">
          <div>
            <div className="flex items-center gap-2 font-heading text-2xl font-semibold">
              <Burst className="h-6 w-6" />
              {brand.name}
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed opacity-70">
              {footer.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footer.columns.map((column) => (
              <div key={column.title}>
                <p className="font-heading text-xs font-semibold uppercase tracking-wide">
                  {column.title}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#top"
                        className="text-sm opacity-70 transition-opacity hover:opacity-100"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <p className="font-heading text-xs font-semibold uppercase tracking-wide">
              {footer.newsletterTitle}
            </p>
            <p className="mt-4 text-sm leading-relaxed opacity-70">
              {footer.newsletterBody}
            </p>
            <form
              onSubmit={(event) => event.preventDefault()}
              className="mt-5 space-y-2"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Votre adresse e-mail"
                aria-label="Votre adresse e-mail"
                className="w-full rounded-lg bg-white/70 px-4 py-2.5 text-sm text-brand-foreground outline-none placeholder:text-brand-foreground/45 focus:bg-white"
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                {footer.newsletterCta}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col-reverse items-center justify-between gap-4 border-t border-brand-foreground/15 pt-6 sm:flex-row">
          <p className="text-xs opacity-70">
            © {new Date().getFullYear()} {brand.fullName}. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            {socials.map(({ Icon, label }) => (
              <a
                key={label}
                href="#top"
                aria-label={label}
                className="opacity-70 transition-opacity hover:opacity-100"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
