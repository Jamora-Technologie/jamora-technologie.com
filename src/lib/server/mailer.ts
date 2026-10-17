import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { adminOrigin, adminUrl } from "@/lib/admin-path";
import { brand, seo } from "@/lib/content";
import type { Message } from "@/lib/server/messages";

/**
 * Alertes e-mail, par SMTP.
 *
 * Configuration (variables d'environnement, jamais dans le dépôt) :
 *   SMTP_HOST     serveur sortant, ex. mail.jamora-technologie.com
 *   SMTP_PORT     465 (TLS implicite, défaut) ou 587 (STARTTLS)
 *   SMTP_SECURE   « true » / « false » ; par défaut vrai si le port est 465
 *   SMTP_USER     boîte mail complète, créée dans cPanel
 *   SMTP_PASS     son mot de passe
 *   MAIL_FROM     expéditeur affiché ; défaut : la boîte SMTP_USER
 *   NOTIFY_TO     destinataire(s) des alertes, séparés par des virgules
 */

export type MailResult = { ok: true } | { ok: false; error: string };

type MailerGlobal = { __jtMailer?: { signature: string; transport: Transporter } };

function notifyTo(): string {
  return (process.env.NOTIFY_TO ?? "").trim();
}

export function isMailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && notifyTo());
}

/** Résumé sans secret, destiné à l'écran « Alertes e-mail ». */
export function mailSummary() {
  return {
    configured: isMailConfigured(),
    host: process.env.SMTP_HOST ?? "",
    port: process.env.SMTP_PORT ?? "465",
    user: process.env.SMTP_USER ?? "",
    to: notifyTo(),
    from: process.env.MAIL_FROM ?? process.env.SMTP_USER ?? "",
  };
}

function transport(): Transporter {
  const port = Number(process.env.SMTP_PORT) || 465;
  const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE === "true"
    : port === 465;
  const user = process.env.SMTP_USER;
  const signature = [
    process.env.SMTP_HOST,
    port,
    secure,
    user,
    process.env.SMTP_PASS,
  ].join("|");

  /* Réutilisé d'une requête à l'autre, mais reconstruit si la configuration
     a changé : évite de rouvrir une connexion TLS à chaque message. */
  const cache = globalThis as MailerGlobal;
  if (cache.__jtMailer?.signature === signature) return cache.__jtMailer.transport;

  const created = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    /* Sans identifiant (serveur de test local), pas d'authentification. */
    auth: user ? { user, pass: process.env.SMTP_PASS ?? "" } : undefined,
    /* Délais courts : un SMTP injoignable ne doit pas figer l'envoi. */
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
  cache.__jtMailer = { signature, transport: created };
  return created;
}

function from(): string {
  /* L'expéditeur doit être la boîte authentifiée : sinon la plupart des
     serveurs rejettent le message ou le classent en courrier indésirable. */
  if (process.env.MAIL_FROM) return process.env.MAIL_FROM;
  if (process.env.SMTP_USER) return `"${brand.fullName}" <${process.env.SMTP_USER}>`;
  return `"${brand.fullName}" <no-reply@jamora-technologie.com>`;
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** Mise en page d'e-mail : styles en ligne, car les clients mail ignorent les feuilles de style. */
function layout(title: string, bodyHtml: string, cta?: { label: string; href: string }) {
  const button = cta
    ? `<p style="margin:28px 0 0"><a href="${escapeHtml(cta.href)}" style="display:inline-block;background:#a3e635;color:#0a0f04;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:999px">${escapeHtml(cta.label)}</a></p>`
    : "";
  return `<!doctype html><html lang="fr"><body style="margin:0;background:#f4f4f1;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden" cellpadding="0" cellspacing="0">
<tr><td style="background:#0d0d0d;padding:20px 28px"><span style="color:#a3e635;font-weight:700;font-size:15px;letter-spacing:.04em">${escapeHtml(brand.fullName.toUpperCase())}</span></td></tr>
<tr><td style="padding:28px">
<h1 style="margin:0 0 18px;font-size:20px;line-height:1.3">${escapeHtml(title)}</h1>
${bodyHtml}${button}
</td></tr></table></td></tr></table></body></html>`;
}

function row(label: string, value: string): string {
  return `<tr><td style="padding:6px 14px 6px 0;color:#6b6b66;font-size:13px;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td><td style="padding:6px 0;font-size:14px">${value}</td></tr>`;
}

export async function sendNewMessageAlert(m: Message): Promise<MailResult> {
  if (!isMailConfigured()) return { ok: false, error: "SMTP non configuré." };

  const lien = `${adminOrigin(seo.siteUrl)}${adminUrl(`/messages/${m.id}`)}`;
  const subject = `Nouvelle demande : ${m.subject}`.slice(0, 160);

  const text = [
    `Nouvelle demande reçue via le formulaire de contact.`,
    ``,
    `De      : ${m.name} <${m.email}>`,
    m.company ? `Société : ${m.company}` : null,
    `Sujet   : ${m.subject}`,
    ``,
    m.message,
    ``,
    `Ouvrir dans le back-office : ${lien}`,
    `(Répondre à cet e-mail écrit directement à ${m.name}.)`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const html = layout(
    "Nouvelle demande de contact",
    `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px">
${row("De", `${escapeHtml(m.name)} &lt;<a href="mailto:${escapeHtml(m.email)}" style="color:#3f6212">${escapeHtml(m.email)}</a>&gt;`)}
${m.company ? row("Société", escapeHtml(m.company)) : ""}
${row("Sujet", `<strong>${escapeHtml(m.subject)}</strong>`)}
</table>
<div style="border-left:3px solid #a3e635;background:#f7f9f2;padding:14px 16px;border-radius:0 8px 8px 0;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapeHtml(m.message)}</div>
<p style="margin:18px 0 0;font-size:12px;color:#6b6b66">Répondre à cet e-mail écrit directement à ${escapeHtml(m.name)}.</p>`,
    { label: "Ouvrir dans le back-office", href: lien },
  );

  try {
    await transport().sendMail({
      from: from(),
      to: notifyTo(),
      /* Répondre depuis la messagerie écrit au visiteur, pas à soi-même. */
      replyTo: { name: m.name, address: m.email },
      subject,
      text,
      html,
    });
    return { ok: true };
  } catch (error) {
    return { ok: false, error: describe(error) };
  }
}

export async function sendTestMail(): Promise<MailResult> {
  if (!isMailConfigured()) {
    return { ok: false, error: "SMTP_HOST ou NOTIFY_TO manquant." };
  }
  try {
    await transport().sendMail({
      from: from(),
      to: notifyTo(),
      subject: "Test des alertes - Jamora Technologie",
      text:
        "Ce message confirme que les alertes e-mail du back-office fonctionnent.\n" +
        "Vous recevrez le même type de message à chaque nouvelle demande.",
      html: layout(
        "Les alertes e-mail fonctionnent",
        `<p style="margin:0;font-size:14px;line-height:1.6">Ce message confirme que le back-office peut vous écrire. Vous recevrez le même type de message à chaque nouvelle demande du formulaire de contact.</p>`,
        { label: "Ouvrir le back-office", href: `${adminOrigin(seo.siteUrl)}${adminUrl()}` },
      ),
    });
    return { ok: true };
  } catch (error) {
    return { ok: false, error: describe(error) };
  }
}

/** Message d'erreur lisible, borné, sans jamais exposer d'identifiant. */
function describe(error: unknown): string {
  const e = error as { code?: string; responseCode?: number; message?: string };
  const hints: Record<string, string> = {
    EAUTH: "Identifiants SMTP refusés (SMTP_USER / SMTP_PASS).",
    ECONNECTION: "Connexion au serveur SMTP impossible (hôte ou port).",
    ETIMEDOUT: "Le serveur SMTP ne répond pas (délai dépassé).",
    ESOCKET: "Erreur de connexion TLS : vérifiez le port et SMTP_SECURE.",
    EENVELOPE: "Adresse d'expéditeur ou de destinataire refusée.",
  };
  const base = (e.code && hints[e.code]) || e.message || "Échec d'envoi.";
  return base.replace(/\s+/g, " ").slice(0, 200);
}
