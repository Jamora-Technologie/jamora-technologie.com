# Mise en ligne sur o2switch

Le site tourne en **application Node.js** derrière Phusion Passenger.
Le point d'entrée est [`server.js`](server.js), à la racine du projet :
cPanel exige un fichier `.js` de démarrage, et `next start` est une
commande, pas un fichier.

> **Le build doit se faire sur le serveur**, pas en local. Next et sharp
> embarquent des binaires natifs propres à la plateforme : un `.next`
> construit sur macOS ne fonctionnerait pas sur le Linux d'o2switch.
> Ces binaires sont pré-compilés, le blocage des compilateurs chez
> o2switch n'est donc pas un obstacle.

---

## 1. Le domaine

Chez le registrar de `jamora-technologie.com`, faites pointer le domaine
vers o2switch, au choix :

- **Serveurs de noms** (recommandé) : `ns1.o2switch.net` et `ns2.o2switch.net`
- **ou enregistrement A** vers l'IP partagée de votre hébergement : `109.234.162.10`

Puis dans cPanel → **Domaines**, ajoutez `jamora-technologie.com` s'il
n'y figure pas déjà.

Le certificat HTTPS est délivré automatiquement par AutoSSL. S'il tarde :
cPanel → **SSL/TLS Status** → *Run AutoSSL*.

---

## 2. Récupérer le code sur le serveur

En SSH (le Terminal de cPanel est bridé en mémoire, préférez un client SSH) :

```bash
cd ~
git clone https://github.com/Jamora-Technologie/jamora-technologie.com.git jamora-technologie
```

Si cPanel a déjà créé le dossier de l'application, `git clone` refusera
d'écrire dedans. Passez alors par un dossier intermédiaire :

```bash
cd ~
git clone https://github.com/Jamora-Technologie/jamora-technologie.com.git jamora-tmp
cp -a jamora-tmp/. jamora-technologie/
rm -rf jamora-tmp
```

Le dossier est à la racine de l'hébergement, **en dehors de
`public_html`** — c'est ce qu'attend o2switch pour le code source.

---

## 3. Créer l'application dans cPanel

cPanel → **Langages** → **NodeJS** → *Setup Node.js App* → **Create Application**

| Champ | Valeur |
| --- | --- |
| Node.js version | **24** — la LTS disponible chez o2switch (minimum requis : 20.9) |
| Application mode | **Production** |
| Application root | `jamora-technologie` |
| Application URL | `jamora-technologie.com` (racine du domaine) |
| Application startup file | `server.js` |

Aucune variable d'environnement n'est nécessaire : le site n'en consomme
aucune. *Application mode* renseigne déjà `NODE_ENV=production`.

---

## 4. Installer les dépendances et construire

cPanel affiche, en haut de la fiche de l'application, une commande
`source .../activate` : elle entre dans l'environnement Node isolé.
Copiez-la, puis :

```bash
source ~/nodevenv/jamora-technologie/24/bin/activate
cd ~/jamora-technologie
npm install --include=dev
npm run build
```

**`--include=dev` n'est pas optionnel.** Le mode « Production » de cPanel
exporte `NODE_ENV=production`, que npm interprète comme un `--omit=dev`
implicite. Or Tailwind et TypeScript sont en `devDependencies` et servent
au build : sans ce drapeau, `npm run build` échoue sur un module
introuvable.

Si le build manque de mémoire :

```bash
NODE_OPTIONS=--max-old-space-size=2048 npm run build
```

---

## 5. Démarrer

cPanel → *Setup Node.js App* → **Restart** sur l'application.

Le site répond alors sur `https://jamora-technologie.com`.

---

## 6. Déployer une mise à jour

```bash
source ~/nodevenv/jamora-technologie/24/bin/activate
cd ~/jamora-technologie
git pull
npm install --include=dev
npm run build
```

Puis **Restart** dans cPanel. Un redémarrage est indispensable : Passenger
garde le code en mémoire.

---

## Points de vigilance

- **Ne touchez pas au `.htaccess`** généré dans le dossier du domaine :
  c'est lui qui relie l'URL à l'application Node.
- **Le rush vidéo** `src/assets/movie/*.mov` est exclu du dépôt. Seule la
  version web `public/movie/jtech.mp4` (4,7 Mo) est versionnée, et elle
  suffit au site.
- **`allowedDevOrigins`** dans [`next.config.ts`](next.config.ts) ne sert
  qu'au développement en réseau local ; il est sans effet en production.
- **Après un changement de version de Node** dans cPanel, relancez
  `npm install` : les binaires natifs sont liés à la version. Le chemin
  d'activation change aussi, `.../nodevenv/jamora-technologie/<version>/...`.
