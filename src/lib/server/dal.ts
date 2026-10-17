import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminUrl } from "@/lib/admin-path";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/server/session-token";

/**
 * Couche d'accès aux données : seul point d'entrée pour savoir QUI est
 * connecté. Le proxy fait un premier tri sur le cookie, mais il ne suffit
 * pas : un layout n'est pas réévalué à chaque navigation, et une action
 * serveur est un point d'accès public. Chaque page et chaque action du
 * back-office doit donc appeler `verifySession()` elle-même.
 */

export async function getSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

/** Redirige vers la connexion si la session est absente ou périmée. */
export const verifySession = cache(async () => {
  const session = await getSession();
  if (!session) redirect(adminUrl("/login"));
  return session;
});
