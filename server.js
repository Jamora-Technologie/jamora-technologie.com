/**
 * Point d'entrée pour Phusion Passenger (hébergement Node.js o2switch).
 *
 * cPanel demande un fichier de démarrage `.js` : `next start` étant une
 * commande, on lance le serveur Next par son API programmatique.
 *
 * Passenger pratique le « reverse port binding » : il intercepte l'appel
 * à `listen()` et route le trafic par une socket Unix. Le port annoncé
 * ici n'est donc qu'une valeur de repli pour un démarrage manuel.
 */
const http = require("node:http");
const next = require("next");

const port = Number(process.env.PORT) || 3000;
const hostname = process.env.HOSTNAME || "0.0.0.0";

/* Le répertoire courant de Passenger ne correspond pas toujours à la racine
   de l'application. On le fixe ici : le dossier `data/` (demandes, réglages)
   est résolu depuis `process.cwd()`, et ne doit pas changer d'emplacement. */
process.chdir(__dirname);

/* `dir` est explicite pour la même raison. `hostname` et `port` indiquent à
   Next où il tourne : après une action serveur qui redirige (la connexion du
   back-office, par exemple), il va chercher lui-même la page cible par une
   requête interne. Sans ces valeurs, elle partait vers un port par défaut
   et échouait, ce que Next rattrape mais signale dans les journaux. */
const app = next({
  dev: false,
  dir: __dirname,
  hostname: hostname === "0.0.0.0" ? "localhost" : hostname,
  port,
});
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    http
      .createServer((req, res) => {
        handle(req, res);
      })
      .listen(port, hostname, () => {
        console.log(`Jamora Technologie en écoute sur ${hostname}:${port}`);
      });
  })
  .catch((error) => {
    console.error("Échec du démarrage de Next :", error);
    process.exit(1);
  });
