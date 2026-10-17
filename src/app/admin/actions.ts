"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { adminBase, adminUrl } from "@/lib/admin-path";
import { isAuthConfigured, verifyCredentials } from "@/lib/server/auth";
import { verifySession } from "@/lib/server/dal";
import { clear, clientIp, hit } from "@/lib/server/rate-limit";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  createSessionToken,
} from "@/lib/server/session-token";
import {
  deleteMessage,
  setStatus,
  type MessageStatus,
} from "@/lib/server/messages";
import {
  resetSection,
  saveSection,
  validateContact,
  validateExperience,
  validateStats,
  type FieldErrors,
  type SectionKey,
} from "@/lib/server/settings";
import { sendTestMail } from "@/lib/server/mailer";
import { clean } from "@/lib/server/validation";

/*
 * Toute action ci-dessous est un point d'accès public : n'importe qui peut
 * l'appeler en forgeant une requête. Chacune commence donc par
 * `verifySession()`, sauf `login`, qui est précisément la porte d'entrée.
 */

/*
 * Convention de ce fichier : `revalidatePath` désigne la ROUTE interne
 * (« /admin »), tandis que `redirect` et les cookies utilisent l'adresse
 * PUBLIQUE (`adminUrl()`), qui peut porter un segment secret.
 */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/* ------------------------------ Connexion ------------------------------ */

/**
 * `Secure` interdit l'envoi du cookie en HTTP : indispensable en production
 * (le site est en HTTPS), mais inutilisable pour essayer une version de
 * production en local sur http://localhost, où certains navigateurs ne
 * conservent pas un cookie `Secure`. On l'omet donc uniquement pour une
 * adresse locale ; tout autre hôte, y compris le vrai site, le garde.
 */
function shouldUseSecureCookie(requestHeaders: Headers): boolean {
  if (process.env.NODE_ENV !== "production") return false;
  const host = (
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    ""
  )
    .split(",")[0]
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, "");
  const isLocal =
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host === "127.0.0.1" ||
    host === "[::1]";
  return !isLocal;
}

export type LoginState = { error?: string };

const LOGIN_LIMIT = { limit: 8, windowMs: 15 * 60 * 1000 };

export async function login(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!isAuthConfigured()) {
    return {
      error:
        "Le back-office n'est pas configuré sur ce serveur (variables ADMIN_EMAIL, ADMIN_PASSWORD_HASH et SESSION_SECRET manquantes).",
    };
  }

  const key = `login:${clientIp(await headers())}`;
  const gate = hit(key, LOGIN_LIMIT.limit, LOGIN_LIMIT.windowMs);
  if (!gate.ok) {
    return {
      error: `Trop de tentatives. Réessayez dans ${Math.ceil(gate.retryAfterSec / 60)} min.`,
    };
  }

  const email = clean(formData.get("email")).slice(0, 254);
  const password = String(formData.get("password") ?? "").slice(0, 200);

  if (!(await verifyCredentials(email, password))) {
    /* Une pause freine l'essai en rafale, en plus de la limite ci-dessus. */
    await wait(500);
    return { error: "Adresse e-mail ou mot de passe incorrect." };
  }

  const token = createSessionToken(email.toLowerCase());
  if (!token) return { error: "Session impossible : SESSION_SECRET invalide." };

  clear(key);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: shouldUseSecureCookie(await headers()),
    sameSite: "lax",
    /* Limité au préfixe du back-office : le cookie ne circule jamais sur les
       pages publiques, et son chemin suit le segment secret éventuel. */
    path: adminBase(),
    maxAge: SESSION_MAX_AGE,
  });
  redirect(adminUrl());
}

export async function logout(): Promise<void> {
  (await cookies()).delete({ name: SESSION_COOKIE, path: adminBase() });
  redirect(adminUrl("/login"));
}

/* ------------------------------- Demandes ------------------------------ */

const STATUSES: MessageStatus[] = ["new", "read", "archived"];

export async function changeStatus(formData: FormData): Promise<void> {
  await verifySession();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as MessageStatus;
  if (!UUID.test(id) || !STATUSES.includes(status)) return;

  await setStatus(id, status);
  /* Le compteur du menu vit dans le layout : on le rafraîchit. */
  revalidatePath("/admin", "layout");
}

export async function removeMessage(formData: FormData): Promise<void> {
  await verifySession();
  const id = String(formData.get("id") ?? "");
  if (!UUID.test(id)) return;

  await deleteMessage(id);
  revalidatePath("/admin", "layout");
  redirect(adminUrl());
}

/* ------------------------------- Contenu ------------------------------- */

export type SettingsState = {
  status: "idle" | "success" | "error";
  errors?: FieldErrors;
  /** Saisie à réafficher : React vide le formulaire après chaque action. */
  values?: Record<string, string>;
};

/** Reprend telles quelles les valeurs saisies, pour les réafficher sur erreur. */
function echo(formData: FormData, keys: string[]): Record<string, string> {
  return Object.fromEntries(keys.map((k) => [k, String(formData.get(k) ?? "")]));
}

/** Le site public est statique : on le régénère après chaque enregistrement. */
function refreshSite() {
  revalidatePath("/", "layout");
}

export async function saveContact(
  _previous: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  await verifySession();
  const { data, errors } = validateContact({
    email: formData.get("email"),
    phone: formData.get("phone"),
    location: formData.get("location"),
  });
  if (!data) {
    return { status: "error", errors, values: echo(formData, ["email", "phone", "location"]) };
  }
  await saveSection("contact", data);
  refreshSite();
  return { status: "success" };
}

export async function saveStats(
  _previous: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  await verifySession();
  const items = [0, 1, 2, 3].map((i) => ({
    value: formData.get(`value${i}`),
    suffix: formData.get(`suffix${i}`),
    label: formData.get(`label${i}`),
  }));
  const { data, errors } = validateStats(items);
  if (!data) {
    const keys = [0, 1, 2, 3].flatMap((i) => [`value${i}`, `suffix${i}`, `label${i}`]);
    return { status: "error", errors, values: echo(formData, keys) };
  }
  await saveSection("stats", data);
  refreshSite();
  return { status: "success" };
}

export async function saveExperience(
  _previous: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  await verifySession();
  const { data, errors } = validateExperience({
    value: formData.get("value"),
    label: formData.get("label"),
  });
  if (!data) {
    return { status: "error", errors, values: echo(formData, ["value", "label"]) };
  }
  await saveSection("experience", data);
  refreshSite();
  return { status: "success" };
}

const SECTIONS: SectionKey[] = ["contact", "stats", "experience"];

export async function resetSettings(formData: FormData): Promise<void> {
  await verifySession();
  const section = String(formData.get("section") ?? "") as SectionKey;
  if (!SECTIONS.includes(section)) return;
  await resetSection(section);
  refreshSite();
  revalidatePath("/admin/contenu");
}

/* -------------------------------- Alertes ------------------------------- */

export type TestMailState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function envoyerTest(): Promise<TestMailState> {
  await verifySession();
  const result = await sendTestMail();
  return result.ok
    ? { status: "success" }
    : { status: "error", message: result.error };
}
