import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";

/**
 * Stockage persistant : un fichier JSON par collection, dans `data/`.
 *
 * Pourquoi pas SQLite ou MySQL : l'hébergement mutualisé d'o2switch tourne
 * sur une glibc trop ancienne pour les modules natifs (c'est déjà la raison
 * du build en WebAssembly), et le volume attendu — quelques demandes par
 * semaine — ne justifie pas un serveur de base de données. Un fichier JSON
 * se sauvegarde par simple copie et se lit à l'œil nu en cas de pépin.
 *
 * Trois garanties maintenues ici :
 *  - les écritures d'un même fichier sont sérialisées (file d'attente),
 *    sinon deux demandes simultanées s'écraseraient mutuellement ;
 *  - un verrou de fichier étend cette garantie ENTRE processus : le site et
 *    le back-office peuvent tourner dans deux applications Node qui partagent
 *    le même dossier de données (voir DEPLOIEMENT.md) ;
 *  - chaque écriture passe par un fichier temporaire puis un `rename`,
 *    atomique : une coupure en plein milieu ne laisse jamais un JSON tronqué.
 */

/** `DATA_DIR` permet de sortir les données du dossier du projet. */
const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(process.cwd(), "data");

const queues = new Map<string, Promise<unknown>>();

const LOCK_FILE = ".lock";
/** Un verrou plus vieux que ça est celui d'un processus mort : on le reprend. */
const LOCK_STALE_MS = 10_000;
const LOCK_TIMEOUT_MS = 8_000;
const LOCK_RETRY_MS = 25;

/**
 * Verrou inter-processus : la création exclusive (`wx`) d'un fichier est
 * atomique, donc un seul processus à la fois peut la réussir. Les autres
 * réessaient jusqu'à l'obtenir, ou jusqu'à ce que le verrou soit périmé.
 */
async function withLock<T>(task: () => Promise<T>): Promise<T> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const lock = path.join(DATA_DIR, LOCK_FILE);
  const deadline = Date.now() + LOCK_TIMEOUT_MS;

  for (;;) {
    try {
      const handle = await fs.open(lock, "wx");
      await handle.close();
      break;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      try {
        const { mtimeMs } = await fs.stat(lock);
        if (Date.now() - mtimeMs > LOCK_STALE_MS) {
          await fs.unlink(lock).catch(() => undefined);
          continue;
        }
      } catch {
        continue; // le verrou vient d'être libéré : on retente aussitôt
      }
      if (Date.now() > deadline) throw new Error("Verrou des données indisponible.");
      await new Promise((resolve) => setTimeout(resolve, LOCK_RETRY_MS));
    }
  }

  try {
    return await task();
  } finally {
    await fs.unlink(lock).catch(() => undefined);
  }
}

function enqueue<T>(file: string, task: () => Promise<T>): Promise<T> {
  const previous = queues.get(file) ?? Promise.resolve();
  /* On enchaîne même si la tâche précédente a échoué : une erreur ne doit
     pas bloquer toutes les écritures suivantes. */
  const next = previous.then(task, task);
  queues.set(
    file,
    next.catch(() => undefined),
  );
  return next;
}

async function readFile<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf8");
    return JSON.parse(raw) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return fallback;
    /* Un JSON corrompu est signalé plutôt que remplacé en silence par la
       valeur de repli : la prochaine écriture effacerait les données. */
    throw error;
  }
}

async function writeFile(file: string, data: unknown): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const target = path.join(DATA_DIR, file);
  const temp = `${target}.${randomBytes(6).toString("hex")}.tmp`;
  await fs.writeFile(temp, JSON.stringify(data, null, 2), { mode: 0o600 });
  await fs.rename(temp, target);
}

/** Lecture seule, sans passer par la file : pas de risque d'incohérence. */
export function readCollection<T>(file: string, fallback: T): Promise<T> {
  return readFile(file, fallback);
}

/**
 * Lecture-modification-écriture atomique : `mutate` reçoit la valeur
 * courante, retourne la nouvelle, et rien d'autre ne peut s'intercaler.
 */
export function updateCollection<T, R = void>(
  file: string,
  fallback: T,
  mutate: (current: T) => { next: T; result: R },
): Promise<R> {
  return enqueue(file, () =>
    withLock(async () => {
      const current = await readFile(file, fallback);
      const { next, result } = mutate(current);
      await writeFile(file, next);
      return result;
    }),
  );
}
