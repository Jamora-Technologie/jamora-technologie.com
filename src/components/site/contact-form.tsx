"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Send } from "lucide-react";
import { contactPage } from "@/lib/content";
import { easeOutExpo } from "@/components/motion/reveal";

const fieldClass =
  "w-full rounded-2xl border border-white/12 bg-white/[0.03] px-5 py-4 text-base text-white outline-none transition-colors placeholder:text-white/35 focus:border-brand/60 focus:bg-white/[0.05]";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: easeOutExpo }}
      className="rounded-[2rem] bg-[#0d0d0d] p-7 ring-1 ring-white/10 sm:p-10"
    >
      <form
        onSubmit={(event) => {
          // Pas encore de backend : on confirme visuellement sans rien envoyer.
          event.preventDefault();
          setSent(true);
        }}
        className="grid gap-4 sm:grid-cols-2"
      >
        <input
          required
          name="name"
          autoComplete="name"
          placeholder={contactPage.fields.name}
          aria-label={contactPage.fields.name}
          className={fieldClass}
        />
        <input
          required
          type="email"
          name="email"
          autoComplete="email"
          placeholder={contactPage.fields.email}
          aria-label={contactPage.fields.email}
          className={fieldClass}
        />
        <input
          name="company"
          autoComplete="organization"
          placeholder={contactPage.fields.company}
          aria-label={contactPage.fields.company}
          className={fieldClass}
        />
        <input
          required
          name="subject"
          placeholder={contactPage.fields.subject}
          aria-label={contactPage.fields.subject}
          className={fieldClass}
        />
        <textarea
          required
          name="message"
          rows={6}
          placeholder={contactPage.fields.message}
          aria-label={contactPage.fields.message}
          className={`${fieldClass} resize-y sm:col-span-2`}
        />

        <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2.5 rounded-full bg-brand px-7 py-3.5 text-base font-medium text-brand-foreground transition-transform hover:scale-[1.03]"
          >
            {contactPage.submit}
            <Send className="h-4 w-4" />
          </button>

          {sent && (
            <motion.p
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 text-sm text-brand"
            >
              <Check className="h-4 w-4" />
              {contactPage.success}
            </motion.p>
          )}
        </div>
      </form>
    </motion.div>
  );
}
