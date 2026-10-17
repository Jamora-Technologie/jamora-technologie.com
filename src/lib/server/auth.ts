import "server-only";
import { createHash, scrypt, timingSafeEqual } from "node:crypto";

/**
 * Vérification des identifiants de l'administrateur.
 *
 * Aucun mot de passe en clair n'existe nulle part : la variable
 * `ADMIN_PASSWORD_HASH` contient une empreinte scrypt, produite par
 * `npm run admin:setup`. Format : `scrypt:<N>:<sel hex>:<hash hex>`.
 */

const KEY_LENGTH = 64;
/** Paramètres par défaut de Node ; r et p sont fixes, N voyage dans l'empreinte. */
const R = 8;
const P = 1;

export function isAuthConfigured(): boolean {
  return Boolean(
    process.env.ADMIN_EMAIL &&
      process.env.ADMIN_PASSWORD_HASH &&
      process.env.SESSION_SECRET &&
      process.env.SESSION_SECRET.length >= 32,
  );
}

function derive(password: string, salt: Buffer, n: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(
      password,
      salt,
      KEY_LENGTH,
      { N: n, r: R, p: P, maxmem: 256 * n * R },
      (error, key) => (error ? reject(error) : resolve(key)),
    );
  });
}

/** Empreinte de longueur fixe : permet de comparer deux chaînes sans fuite de durée. */
function digest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

/** Hash factice, de même coût que le vrai, pour égaliser les temps de réponse. */
const DUMMY = "scrypt:16384:00000000000000000000000000000000:" + "00".repeat(KEY_LENGTH);

export async function verifyCredentials(
  email: string,
  password: string,
): Promise<boolean> {
  const adminEmail = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const stored = process.env.ADMIN_PASSWORD_HASH ?? "";
  if (!adminEmail || !stored) return false;

  const emailOk = timingSafeEqual(
    digest(email.trim().toLowerCase()),
    digest(adminEmail),
  );

  /* On calcule toujours l'empreinte, même si l'e-mail est faux : sans cela,
     une réponse rapide révélerait que l'adresse n'est pas la bonne. */
  const [scheme, nRaw, saltHex, hashHex] = (emailOk ? stored : DUMMY).split(":");
  const n = Number(nRaw);
  if (scheme !== "scrypt" || !Number.isInteger(n) || n < 1024 || !saltHex || !hashHex) {
    return false;
  }

  try {
    const expected = Buffer.from(hashHex, "hex");
    const actual = await derive(password, Buffer.from(saltHex, "hex"), n);
    return (
      expected.length === actual.length &&
      timingSafeEqual(expected, actual) &&
      emailOk
    );
  } catch {
    return false;
  }
}
