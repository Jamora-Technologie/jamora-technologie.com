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

/* `dir` est explicite : le répertoire courant de Passenger ne correspond
   pas toujours à la racine de l'application. */
const app = next({ dev: false, dir: __dirname });
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
