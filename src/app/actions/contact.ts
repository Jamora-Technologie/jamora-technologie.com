"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { contactPage } from "@/lib/content";
import { addMessage, setNotified } from "@/lib/server/messages";
import { isMailConfigured, sendNewMessageAlert } from "@/lib/server/mailer";
import { clientIp, hit } from "@/lib/server/rate-limit";
import { clean, isEmail } from "@/lib/server/validation";

export type ContactValues = {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
};

export type ContactState = {
  status: "idle" | "success" | "error";
  /** Message général (limite atteinte, panne serveur…). */
  notice?: string;
  /** Erreurs par champ. */
  errors?: Partial<Record<keyof ContactValues, string>>;
  /** Saisie à réafficher : React vide le formulaire après chaque action. */
  values?: ContactValues;
};

/** Un humain ne remplit pas ce formulaire en moins de 2 secondes. */
const MIN_FILL_MS = 2000;
const PER_IP = { limit: 5, windowMs: 60 * 60 * 1000 };
const GLOBAL = { limit: 40, windowMs: 60 * 60 * 1000 };

/** Les sauts de ligne du message sont conservés, contrairement aux autres champs. */
function cleanMessage(value: unknown): string {
  return typeof value === "string"
    ? value.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim()
    : "";
}

export async function envoyerMessage(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const values: ContactValues = {
    name: clean(formData.get("name")),
    email: clean(formData.get("email")),
    company: clean(formData.get("company")),
    subject: clean(formData.get("subject")),
    message: cleanMessage(formData.get("message")),
  };

  /* Champ piège : invisible pour une personne, rempli par la plupart des
     robots. On répond « succès » pour ne pas leur apprendre qu'ils ont été
     repérés, mais rien n'est enregistré. */
  if (clean(formData.get("website"))) return { status: "success" };

  const startedAt = Number(formData.get("startedAt"));
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS) {
    return { status: "error", notice: contactPage.errors.tooFast, values };
  }

  const ip = clientIp(await headers());
  const perIp = hit(`contact:${ip}`, PER_IP.limit, PER_IP.windowMs);
  const global = hit("contact:*", GLOBAL.limit, GLOBAL.windowMs);
  if (!perIp.ok || !global.ok) {
    return { status: "error", notice: contactPage.errors.rate, values };
  }

  const errors: ContactState["errors"] = {};
  if (values.name.length < 2 || values.name.length > 100) {
    errors.name = contactPage.errors.name;
  }
  if (!isEmail(values.email)) errors.email = contactPage.errors.email;
  if (values.company.length > 120) errors.company = contactPage.errors.company;
  if (values.subject.length < 3 || values.subject.length > 150) {
    errors.subject = contactPage.errors.subject;
  }
  if (values.message.length < 10 || values.message.length > 5000) {
    errors.message = contactPage.errors.message;
  }
  if (Object.keys(errors).length) return { status: "error", errors, values };

  let saved;
  try {
    saved = await addMessage(values);
  } catch (error) {
    console.error("[contact] enregistrement impossible :", error);
    return { status: "error", notice: contactPage.errors.generic, values };
  }

  /* L'alerte part après la réponse : le visiteur n'attend pas le SMTP, et
     un serveur mail lent ou en panne ne dégrade jamais le formulaire. */
  after(async () => {
    if (!isMailConfigured()) {
      await setNotified(saved.id, "disabled");
      return;
    }
    const result = await sendNewMessageAlert(saved);
    if (result.ok) {
      await setNotified(saved.id, "sent");
    } else {
      console.error("[contact] alerte e-mail non envoyée :", result.error);
      await setNotified(saved.id, "failed", result.error);
    }
  });

  return { status: "success" };
}
