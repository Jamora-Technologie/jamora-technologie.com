"use client";

import { useActionState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Check, Loader2, Send } from "lucide-react";
import { contactPage } from "@/lib/content";
import { easeOutExpo } from "@/components/motion/reveal";
import {
  envoyerMessage,
  type ContactState,
  type ContactValues,
} from "@/app/actions/contact";

const fieldClass =
  "w-full rounded-2xl border border-white/12 bg-white/[0.03] px-5 py-4 text-base text-white outline-none transition-colors placeholder:text-white/35 focus:border-brand/60 focus:bg-white/[0.05] aria-[invalid=true]:border-red-400/60";

const initial: ContactState = { status: "idle" };

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 text-sm text-red-300">
      {message}
    </p>
  );
}

export function ContactForm() {
  const [state, formAction, pending] = useActionState(envoyerMessage, initial);
  /*
    Heure d'arrivée sur le formulaire : le serveur écarte un envoi
    instantané, signe d'un robot. Elle est posée au montage, côté client
    uniquement (la page est prérendue, une valeur calculée au rendu serait
    figée à l'heure du build) et ajoutée au FormData à l'envoi plutôt que
    dans un champ caché, car React vide les champs après chaque action.
  */
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const values: Partial<ContactValues> = state.values ?? {};
  const errors = state.errors ?? {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: easeOutExpo }}
      className="rounded-[2rem] bg-[#0d0d0d] p-7 ring-1 ring-white/10 sm:p-10"
    >
      {state.status === "success" ? (
        <div
          role="status"
          className="flex flex-col items-center gap-4 py-10 text-center"
        >
          <span className="grid h-14 w-14 place-items-center rounded-full bg-brand text-brand-foreground">
            <Check className="h-7 w-7" />
          </span>
          <p className="max-w-md font-heading text-xl font-medium text-white">
            {contactPage.success}
          </p>
        </div>
      ) : (
        <form
          action={(formData) => {
            formData.set("startedAt", String(startedAt.current));
            formAction(formData);
          }}
          className="grid gap-4 sm:grid-cols-2"
        >
          <div>
            <input
              required
              name="name"
              autoComplete="name"
              defaultValue={values.name}
              placeholder={contactPage.fields.name}
              aria-label={contactPage.fields.name}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "err-name" : undefined}
              className={fieldClass}
            />
            <FieldError id="err-name" message={errors.name} />
          </div>
          <div>
            <input
              required
              type="email"
              name="email"
              autoComplete="email"
              defaultValue={values.email}
              placeholder={contactPage.fields.email}
              aria-label={contactPage.fields.email}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "err-email" : undefined}
              className={fieldClass}
            />
            <FieldError id="err-email" message={errors.email} />
          </div>
          <div>
            <input
              name="company"
              autoComplete="organization"
              defaultValue={values.company}
              placeholder={contactPage.fields.company}
              aria-label={contactPage.fields.company}
              aria-invalid={Boolean(errors.company)}
              aria-describedby={errors.company ? "err-company" : undefined}
              className={fieldClass}
            />
            <FieldError id="err-company" message={errors.company} />
          </div>
          <div>
            <input
              required
              name="subject"
              defaultValue={values.subject}
              placeholder={contactPage.fields.subject}
              aria-label={contactPage.fields.subject}
              aria-invalid={Boolean(errors.subject)}
              aria-describedby={errors.subject ? "err-subject" : undefined}
              className={fieldClass}
            />
            <FieldError id="err-subject" message={errors.subject} />
          </div>
          <div className="sm:col-span-2">
            <textarea
              required
              name="message"
              rows={6}
              defaultValue={values.message}
              placeholder={contactPage.fields.message}
              aria-label={contactPage.fields.message}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "err-message" : undefined}
              className={`${fieldClass} resize-y`}
            />
            <FieldError id="err-message" message={errors.message} />
          </div>

          {/* Champ piège : hors écran, ignoré des lecteurs d'écran et du clavier. */}
          <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>
              Ne pas remplir
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          {state.notice && (
            <p
              role="alert"
              className="flex items-start gap-2.5 rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200 sm:col-span-2"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {state.notice}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-2.5 rounded-full bg-brand px-7 py-3.5 text-base font-medium text-brand-foreground transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
            >
              {pending ? "Envoi en cours" : contactPage.submit}
              {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
}
