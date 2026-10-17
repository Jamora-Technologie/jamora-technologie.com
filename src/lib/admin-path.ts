/**
 * Où vit le back-office.
 *
 * Les pages sont toujours écrites sous `src/app/admin/`, mais l'adresse
 * PUBLIQUE se règle par deux variables d'environnement :
 *
 *   ADMIN_PATH  segment secret, ex. « gestion-k7x2q9mfv4 » (défaut : « admin »)
 *   ADMIN_HOST  sous-domaine dédié, ex. « admin.jamora-technologie.com »
 *
 * `proxy.ts` fait la traduction entre l'adresse publique et la route
 * interne. Tout lien ou redirection du back-office doit passer par
 * `adminUrl()` : écrire « /admin/... » en dur casserait dès que le segment
 * secret est activé.
 *
 * Module pur, sans `server-only` : le proxy l'importe aussi.
 */

const DEFAULT_SEGMENT = "admin";

/** Lettres, chiffres, tiret, souligné : 3 à 64 caractères. Pas de « # » ni de « / ». */
const SEGMENT = /^[a-zA-Z0-9][a-zA-Z0-9_-]{2,63}$/;

let warned = false;

export function adminSegment(): string {
  const raw = (process.env.ADMIN_PATH ?? "").trim().replace(/^\/+|\/+$/g, "");
  if (!raw) return DEFAULT_SEGMENT;
  if (SEGMENT.test(raw)) return raw;

  /* Une valeur invalide ne doit pas ouvrir une porte inattendue : on
     retombe sur le défaut et on le signale une fois dans les journaux. */
  if (!warned) {
    warned = true;
    console.warn(
      "[admin] ADMIN_PATH invalide (3 à 64 caractères : lettres, chiffres, - et _). Valeur ignorée.",
    );
  }
  return DEFAULT_SEGMENT;
}

/** Préfixe public, sans barre finale : « /admin » ou « /gestion-k7x2q9mfv4 ». */
export function adminBase(): string {
  return `/${adminSegment()}`;
}

/** Adresse publique d'une page du back-office : `adminUrl("/login")`, `adminUrl()`. */
export function adminUrl(path = ""): string {
  return `${adminBase()}${path}`;
}

/** Nom d'hôte dédié au back-office, en minuscules et sans port, ou `null`. */
export function adminHost(): string | null {
  const raw = (process.env.ADMIN_HOST ?? "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/[/:].*$/, "");
  return raw || null;
}

/** Origine complète du back-office, pour les liens placés dans les e-mails. */
export function adminOrigin(siteUrl: string): string {
  const host = adminHost();
  return host ? `https://${host}` : siteUrl;
}
