#!/usr/bin/env node
/**
 * Prépare les identifiants du back-office.
 *
 * Il écrit trois lignes à copier dans les variables d'environnement du
 * serveur (cPanel → Setup Node.js App). Le mot de passe lui-même n'est
 * jamais affiché ni enregistré : on n'en conserve qu'une empreinte scrypt,
 * qui ne permet pas de retrouver le mot de passe d'origine.
 *
 * Usage :
 *   npm run admin:setup
 *   npm run admin:setup -- --email vous@exemple.com
 *   printf '%s' "$MOT_DE_PASSE" | npm run admin:setup -- --email vous@exemple.com
 *
 * Le dernier mode lit le mot de passe sur l'entrée standard : il évite de
 * le laisser dans l'historique du terminal.
 */
import { randomBytes, scrypt } from "node:crypto";
import readline from "node:readline";

const N = 16384;
const R = 8;
const P = 1;
const KEY_LENGTH = 64;
const MIN_LENGTH = 12;

function argValue(name) {
  const index = process.argv.indexOf(name);
  return index > -1 ? process.argv[index + 1] : undefined;
}

/** Saisie masquée en terminal interactif ; lecture simple si l'entrée est redirigée. */
function askHidden(question) {
  return new Promise((resolve) => {
    if (!process.stdin.isTTY) {
      let data = "";
      process.stdin.setEncoding("utf8");
      process.stdin.on("data", (chunk) => (data += chunk));
      process.stdin.on("end", () => resolve(data.replace(/\r?\n$/, "")));
      return;
    }
    process.stdout.write(question);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");
    let value = "";
    const onData = (char) => {
      if (char === "\u0003") process.exit(130); // Ctrl-C
      if (char === "\r" || char === "\n") {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdin.off("data", onData);
        process.stdout.write("\n");
        return resolve(value);
      }
      if (char === "\u007f" || char === "\b") value = value.slice(0, -1);
      else value += char;
    };
    process.stdin.on("data", onData);
  });
}

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    }),
  );
}

function hash(password) {
  const salt = randomBytes(16);
  return new Promise((resolve, reject) =>
    scrypt(password, salt, KEY_LENGTH, { N, r: R, p: P, maxmem: 256 * N * R }, (error, key) =>
      error ? reject(error) : resolve(`scrypt:${N}:${salt.toString("hex")}:${key.toString("hex")}`),
    ),
  );
}

let email = argValue("--email");
if (!email) {
  if (!process.stdin.isTTY) {
    console.error("Indiquez l'adresse avec --email quand le mot de passe est redirigé.");
    process.exit(1);
  }
  email = await ask("Adresse e-mail de connexion : ");
}
if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
  console.error("Adresse e-mail invalide.");
  process.exit(1);
}

const password = await askHidden(`Mot de passe (${MIN_LENGTH} caractères minimum) : `);
if (password.length < MIN_LENGTH) {
  console.error(`Trop court : ${MIN_LENGTH} caractères minimum.`);
  process.exit(1);
}
if (process.stdin.isTTY) {
  const again = await askHidden("Confirmez le mot de passe : ");
  if (again !== password) {
    console.error("Les deux saisies diffèrent.");
    process.exit(1);
  }
}

const passwordHash = await hash(password);
const secret = randomBytes(48).toString("base64url");

console.log(`
À copier dans les variables d'environnement du serveur :

ADMIN_EMAIL=${email}
ADMIN_PASSWORD_HASH=${passwordHash}
SESSION_SECRET=${secret}

Remarques :
  - Si SESSION_SECRET existe déjà, gardez l'ancienne valeur : la changer
    déconnecte tout le monde. Changer le hash, lui, déconnecte aussi les
    sessions ouvertes, ce qui est voulu après un changement de mot de passe.
  - Ne collez jamais ces valeurs dans un fichier versionné.
`);
