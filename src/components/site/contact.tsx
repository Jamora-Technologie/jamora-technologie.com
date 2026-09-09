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
      className="relative overflow-hidden px-4 pt-16 sm:px-6 lg:px-10"
    >
      <div className="mx-auto grid max-w-6xl items-end gap-10 lg:grid-cols-2">
        <Reveal className="pb-10 lg:pb-20">
          <h2 className="font-heading text-3xl font-semibold sm:text-4xl lg:text-[2.75rem]">
            {contact.title}
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/55">
            {contact.body}
          </p>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
            }}
            className="mt-8 flex max-w-md items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] p-1.5"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={contact.placeholder}
              aria-label={contact.placeholder}
              className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm text-white outline-none placeholder:text-white/40"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-brand px-5 py-2 text-sm font-medium text-brand-foreground transition-transform hover:scale-[1.03]"
            >
              {contact.cta}
            </button>
          </form>
          {sent && (
            <p className="mt-3 text-xs text-brand">
              Merci ! Nous revenons vers vous très vite.
            </p>
          )}
        </Reveal>

        <Reveal delay={0.1} className="relative">
          <div className="relative mx-auto h-[320px] w-full max-w-md sm:h-[420px]">
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
