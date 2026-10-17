import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Jeton de session sans état : `payload.signature`, signé en HMAC-SHA256.
 *
 * Ce module est volontairement pur (aucun accès disque, aucun `cookies()`),
 * car il est partagé par `proxy.ts` et par la couche d'accès aux données.
 * Pas de `import "server-only"` ici : le proxy ne tourne pas dans le graphe
 * des composants serveur, où ce garde-fou ne se résout pas.
 */

export const SESSION_COOKIE = "jt_admin";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 jours, en secondes

type Payload = {
  /** Identifiant de l'administrateur (son e-mail). */
  sub: string;
  /** Expiration, en millisecondes. */
  exp: number;
  /** Empreinte du mot de passe courant : le changer invalide les sessions. */
  v: string;
};

export type Session = { sub: string; exp: number };

function secret(): string | null {
  const value = process.env.SESSION_SECRET;
  /* 32 caractères minimum : en dessous, la signature se devine par force
     brute. On refuse plutôt que de signer avec une clé faible. */
  return value && value.length >= 32 ? value : null;
}

function sign(data: string, key: string): string {
  return createHmac("sha256", key).update(data).digest("base64url");
}

function passwordFingerprint(key: string): string {
  return createHmac("sha256", key)
    .update(process.env.ADMIN_PASSWORD_HASH ?? "")
    .digest("base64url")
    .slice(0, 16);
}

export function createSessionToken(sub: string, now = Date.now()): string | null {
  const key = secret();
  if (!key) return null;
  const payload: Payload = {
    sub,
    exp: now + SESSION_MAX_AGE * 1000,
    v: passwordFingerprint(key),
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body, key)}`;
}

export function verifySessionToken(
  token: string | undefined,
  now = Date.now(),
): Session | null {
  const key = secret();
  if (!key || !token) return null;

  const [body, signature, extra] = token.split(".");
  if (!body || !signature || extra !== undefined) return null;

  const expected = Buffer.from(sign(body, key));
  const received = Buffer.from(signature);
  /* `timingSafeEqual` exige deux tampons de même longueur. */
  if (
    expected.length !== received.length ||
    !timingSafeEqual(expected, received)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as Payload;
    if (typeof payload.sub !== "string" || typeof payload.exp !== "number") {
      return null;
    }
    if (payload.exp <= now) return null;
    if (payload.v !== passwordFingerprint(key)) return null;
    return { sub: payload.sub, exp: payload.exp };
  } catch {
    return null;
  }
}
