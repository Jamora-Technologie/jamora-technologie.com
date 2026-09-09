"use client";

import Image from "next/image";
import { useState } from "react";
import { contact } from "@/lib/content";
import { Reveal } from "@/components/motion/reveal";

export function Contact() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section
      id="contact"
      className="relative scroll-mt-32 overflow-hidden px-4 pt-20 sm:px-6 lg:px-10"
    >
      <div className="mx-auto grid max-w-7xl items-end gap-12 lg:grid-cols-2">
        <Reveal className="pb-10 lg:pb-20">
          <h2 className="font-heading text-4xl font-semibold sm:text-5xl lg:text-[3.25rem]">
            {contact.title}
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-white/55">
            {contact.body}
          </p>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
            }}
            className="mt-9 flex max-w-lg items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] p-2"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={contact.placeholder}
              aria-label={contact.placeholder}
              className="min-w-0 flex-1 bg-transparent px-5 py-2.5 text-base text-white outline-none placeholder:text-white/40"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-brand px-6 py-2.5 text-base font-medium text-brand-foreground transition-transform hover:scale-[1.03]"
            >
              {contact.cta}
            </button>
          </form>
          {sent && (
            <p className="mt-3 text-sm text-brand">
              Merci ! Nous revenons vers vous très vite.
            </p>
          )}
        </Reveal>

        <Reveal delay={0.1} className="relative">
          <div className="relative mx-auto h-[360px] w-full max-w-lg sm:h-[480px]">
            <Image
              src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=80"
              alt="Une collaboratrice prête à échanger sur votre projet"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="rounded-t-[3rem] object-cover object-top"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
