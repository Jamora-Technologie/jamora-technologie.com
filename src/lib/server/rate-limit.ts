import "server-only";

/**
 * Limiteur à fenêtre fixe, en mémoire.
 *
 * Suffisant pour un site à faible trafic sur un seul processus : le compteur
 * repart à zéro au redémarrage, ce qui est acceptable ici. Le `Map` vit sur
 * `globalThis` pour survivre au rechargement à chaud en développement.
 */

type Bucket = { count: number; resetAt: number };

const store: Map<string, Bucket> =
  (globalThis as { __jtLimits?: Map<string, Bucket> }).__jtLimits ??
  ((globalThis as { __jtLimits?: Map<string, Bucket> }).__jtLimits = new Map());

export function hit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();

  /* Purge opportuniste : évite que la table grossisse indéfiniment. */
  if (store.size > 2000) {
    for (const [k, b] of store) if (b.resetAt <= now) store.delete(k);
  }

  const bucket = store.get(key);
  if (!bucket || bucket.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }
  bucket.count += 1;
  return {
    ok: bucket.count <= limit,
    retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000),
  };
}

/** Réinitialise un compteur : appelé après une connexion réussie. */
export function clear(key: string): void {
  store.delete(key);
}

/**
 * Adresse du visiteur. On lit la DERNIÈRE entrée de `x-forwarded-for` : c'est
 * celle que le serveur frontal ajoute lui-même, alors que les précédentes
 * peuvent être forgées par le client pour échapper à la limite.
 */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const parts = forwarded.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length) return parts[parts.length - 1];
  }
  return headers.get("x-real-ip") ?? "inconnue";
}
