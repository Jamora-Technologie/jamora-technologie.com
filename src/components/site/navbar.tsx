"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { brand, navLinks } from "@/lib/content";
import logoMark from "@/assets/img/logo/logo-mark.png";
import { easeOutExpo } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const left = navLinks.slice(0, 2);
const right = navLinks.slice(2);

function NavItem({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative text-[15px] transition-colors hover:text-brand",
        active ? "text-brand" : "text-white/80",
      )}
    >
      {label}
      {active && (
        <motion.span
          layoutId="nav-active"
          className="absolute -bottom-1.5 left-0 h-0.5 w-full rounded-full bg-brand"
        />
      )}
    </Link>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // La barre se densifie une fois qu'on a quitté le haut de page.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href.startsWith("/#") ? false : pathname === href;

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: easeOutExpo }}
      className="fixed inset-x-0 top-4 z-50 px-4 sm:px-6 lg:px-10"
    >
      <nav
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between gap-6 rounded-full px-6 py-4 ring-1 transition-all duration-300 sm:px-10 sm:py-5",
          scrolled
            ? "bg-ink/90 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.9)] ring-white/15 backdrop-blur-xl"
            : "bg-ink/95 ring-white/10 backdrop-blur",
        )}
      >
        <div className="hidden flex-1 items-center gap-9 md:flex">
          {left.map((item) => (
            <NavItem key={item.href} {...item} active={isActive(item.href)} />
          ))}
        </div>

        {/*
          Le pictogramme fourni est blanc sur fond transparent : il se pose
          directement sur la barre sombre, sans cadre porteur.
        */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex shrink-0 items-center gap-2.5 font-heading text-lg font-semibold whitespace-nowrap text-white sm:text-xl"
        >
          <Image
            src={logoMark}
            alt=""
            priority
            className="h-7 w-auto sm:h-8"
          />
          {brand.fullName}
        </Link>

        <div className="hidden flex-1 items-center justify-end gap-9 md:flex">
          {right.map((item) => (
            <NavItem key={item.href} {...item} active={isActive(item.href)} />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          className="text-white md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: easeOutExpo }}
            className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-3xl bg-ink/95 p-4 ring-1 ring-white/10 backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block rounded-2xl px-4 py-3.5 text-base transition-colors hover:bg-white/5 hover:text-brand",
                      isActive(item.href) ? "text-brand" : "text-white/80",
                    )}
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
