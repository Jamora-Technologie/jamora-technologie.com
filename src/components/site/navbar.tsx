"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { brand, navLinks } from "@/lib/content";
import { Burst } from "@/components/site/decor";
import { easeOutExpo } from "@/components/motion/reveal";

const left = navLinks.slice(0, 2);
const right = navLinks.slice(2);

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="relative text-sm text-white/80 transition-colors hover:text-brand"
    >
      {label}
    </Link>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: easeOutExpo }}
      className="absolute inset-x-0 top-4 z-50 px-4 sm:px-6 lg:px-10"
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-6 rounded-full bg-ink/95 px-5 py-3 ring-1 ring-white/10 backdrop-blur sm:px-8">
        <div className="hidden flex-1 items-center gap-8 md:flex">
          {left.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </div>

        <Link
          href="#top"
          className="flex items-center gap-2 font-heading text-lg font-semibold text-white"
        >
          <Burst className="h-5 w-5 text-brand" />
          {brand.name}
        </Link>

        <div className="hidden flex-1 items-center justify-end gap-8 md:flex">
          {right.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          className="text-white md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: easeOutExpo }}
            className="mx-auto mt-2 max-w-5xl overflow-hidden rounded-3xl bg-ink/95 p-4 ring-1 ring-white/10 backdrop-blur md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-brand"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
