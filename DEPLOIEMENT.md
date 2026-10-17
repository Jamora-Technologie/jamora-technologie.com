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
npm run build:webpack
```

**`build:webpack`, et non `build`.** Le serveur o2switch tourne sur une
glibc antérieure à 2.29, alors que le binaire natif de Next en exige au
moins cette version. Next se rabat donc sur ses bindings WebAssembly —
or Turbopack, utilisé par `npm run build`, réclame impérativement les
bindings natifs et s'arrête. Webpack, lui, fonctionne avec le WASM.
Le build est plus lent (quelques minutes), le résultat est identique.

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
npm run build:webpack
```

Puis **Restart** dans cPanel. Un redémarrage est indispensable : Passenger
garde le code en mémoire.

---

## 7. Back-office et alertes e-mail

Le formulaire de contact enregistre chaque demande dans `data/messages.json`
et envoie une alerte par e-mail. Un back-office protégé par mot de passe
permet de les lire, de modifier quelques informations du site (coordonnées,
chiffres clés) et de tester l'envoi des alertes.

Tout se règle par **variables d'environnement**, dans cPanel →
*Setup Node.js App* → *Environment variables*, puis **Restart**. Aucune de
ces valeurs n'est versionnée : le modèle est dans [`.env.example`](.env.example).

### 7.1 Identifiants du back-office

À faire **en local**, pas sur le serveur, et sans jamais communiquer le
résultat par message :

```bash
npm run admin:setup
```

Le script demande l'adresse e-mail et le mot de passe (12 caractères
minimum, saisie masquée), puis affiche trois lignes à copier dans cPanel :

| Variable | Rôle |
| --- | --- |
| `ADMIN_EMAIL` | identifiant de connexion |
| `ADMIN_PASSWORD_HASH` | empreinte scrypt du mot de passe — le mot de passe lui-même n'est stocké nulle part |
| `SESSION_SECRET` | clé qui signe les sessions (64 caractères) |

Changer `ADMIN_PASSWORD_HASH` déconnecte toutes les sessions ouvertes, ce
qui est voulu après un changement de mot de passe. Changer `SESSION_SECRET`
fait de même. Un redémarrage de l'application, lui, ne déconnecte personne.

### 7.2 Alertes e-mail

1. cPanel → **Comptes de messagerie** : créez une boîte dédiée aux alertes
   (par exemple `alertes@jamora-technologie.com`).
2. Sur cette boîte, *Configurer les clients de messagerie* affiche le serveur
   sortant et le port : reportez-les ci-dessous.

| Variable | Valeur |
| --- | --- |
| `SMTP_HOST` | serveur sortant, en général `mail.jamora-technologie.com` — **à confirmer dans cPanel** |
| `SMTP_PORT` | `465` (TLS) ou `587` |
| `SMTP_USER` | l'adresse complète de la boîte |
| `SMTP_PASS` | son mot de passe |
| `NOTIFY_TO` | qui reçoit les alertes (plusieurs adresses : séparées par des virgules) |
| `MAIL_FROM` | facultatif ; par défaut, la boîte `SMTP_USER` |

Dans le back-office, l'onglet **Alertes e-mail** affiche cette configuration
(le mot de passe reste masqué) et propose un **e-mail de test** : c'est la
vérification à faire juste après le déploiement. En cas d'échec, le message
d'erreur indique si ce sont les identifiants, l'hôte ou le port qui sont en cause.

Une demande est **toujours enregistrée avant** l'envoi de l'alerte : si le
SMTP est en panne, rien n'est perdu, et la fiche de la demande signale que
l'alerte n'est pas partie.

### 7.3 Adresse du back-office

Par défaut le back-office vit sur `/admin` du site public. Deux variables
permettent de l'éloigner. Elles peuvent s'employer ensemble ou séparément :

| Variable | Exemple | Effet |
| --- | --- | --- |
| `ADMIN_PATH` | `gestion-k7x2q9mfv4` | l'adresse devient `/gestion-k7x2q9mfv4` ; `/admin` répond 404 |
| `ADMIN_HOST` | `admin.jamora-technologie.com` | le back-office n'est servi que sur ce sous-domaine ; le domaine public répond 404 |

Pour un segment, générez une valeur aléatoire :

```bash
echo "gestion-$(openssl rand -hex 6)"
```

Évitez tout ce qui se devine (dates, nom de l'entreprise). Et n'écrivez
**pas** de `#` : tout ce qui suit un `#` reste dans le navigateur et n'est
jamais envoyé au serveur, il ne peut donc pas faire partie d'une adresse.
Seuls les lettres, chiffres, `-` et `_` sont acceptés (3 à 64 caractères).

> **Ces réglages réduisent le bruit, ils ne protègent pas.** Une adresse
> secrète écarte les robots qui testent `/admin`, mais elle finit toujours
> par fuiter (historique du navigateur, e-mail transféré, capture d'écran).
> La protection réelle est le mot de passe, la session signée et la limite
> de tentatives. Le back-office est de toute façon `noindex`, et son adresse
> n'est volontairement **pas** dans `robots.txt` : ce fichier est public.

Avec `ADMIN_HOST`, la racine du sous-domaine répond aussi 404 : il faut
connaître l'adresse complète, par exemple
`https://admin.jamora-technologie.com/gestion-k7x2q9mfv4`.

### 7.4 Mettre le back-office sur un sous-domaine (o2switch)

1. cPanel → **Domaines** : créez le sous-domaine `admin.jamora-technologie.com`.
   Son certificat HTTPS vient d'AutoSSL (cPanel → *SSL/TLS Status* →
   *Run AutoSSL* s'il tarde). **Le HTTPS est obligatoire** : le cookie de
   session est marqué `Secure` et ne circule pas en HTTP.
2. Il faut ensuite que ce sous-domaine atteigne l'application. cPanel n'accepte
   qu'une seule *Application URL* par application, et la documentation
   d'o2switch ne précise pas si deux applications peuvent partager le même
   dossier. **À essayer, dans cet ordre :**

   **a. Même dossier.** *Setup Node.js App* → *Create Application* avec
   `Application root` = `jamora-technologie`, `Application URL` =
   `admin.jamora-technologie.com`, même fichier `server.js`, mêmes variables.
   Si cPanel l'accepte, vous n'avez rien d'autre à faire.

   **b. Second dossier**, si cPanel refuse la première option :

   ```bash
   cd ~
   git clone https://github.com/Jamora-Technologie/jamora-technologie.com.git jamora-admin
   source ~/nodevenv/jamora-technologie/24/bin/activate
   cd ~/jamora-admin && npm install --include=dev && npm run build:webpack
   ```

   puis créez l'application avec `Application root` = `jamora-admin`.
   **Les deux applications doivent alors partager le même dossier de
   données.** Créez-le hors des deux projets et indiquez-le dans les deux :

   ```bash
   mkdir -p ~/jamora-data
   ```

   `DATA_DIR=/home/<votre-compte>/jamora-data` (chemin absolu) dans les deux
   applications. Dans cette configuration, un enregistrement fait dans le
   back-office atteint le site public en une minute au plus : les deux
   processus ne partagent pas leur cache, le site se régénère donc de
   lui-même toutes les 60 secondes.

3. Dans **les deux** applications, définissez les mêmes `ADMIN_HOST` et
   `ADMIN_PATH` : c'est ce qui fait répondre 404 au domaine public.

À chaque mise à jour du code, si vous avez choisi la variante **b**, répétez
la procédure du §6 dans `jamora-admin` également.

### 7.5 Vérifications après déploiement

| Adresse | Résultat attendu |
| --- | --- |
| `https://jamora-technologie.com/admin` | 404 |
| `https://jamora-technologie.com/<segment>` | 404 |
| `https://admin.jamora-technologie.com/` | 404 |
| `https://admin.jamora-technologie.com/<segment>` | écran de connexion |
| onglet **Alertes e-mail** → *e-mail de test* | message reçu |
| formulaire de la page Contact | demande visible dans le back-office + alerte reçue |

### 7.6 Données personnelles

`data/messages.json` contient les noms, adresses e-mail et messages des
visiteurs. Le dossier est exclu de Git (`/data/`) et les fichiers sont créés
en lecture réservée au compte. Sauvegardez-le par simple copie, et
supprimez les demandes dont vous n'avez plus l'usage depuis le back-office.

---

## Vérifier l'optimisation des images

`sharp`, qui redimensionne les images côté serveur, est lui aussi un
module natif soumis à la même contrainte de glibc. Après le build :

```bash
node -e "require('sharp'); console.log('sharp opérationnel')"
```

Si la commande échoue sur une erreur `GLIBC`, ajoutez dans
[`next.config.ts`](next.config.ts) :

```ts
images: { unoptimized: true },
```

Les images sont alors servies telles quelles, sans redimensionnement.
Il faut dans ce cas les optimiser en amont : les portraits d'équipe
pèsent 2,5 Mo à eux seuls en taille d'origine, pour un affichage en
220 × 460 px.

---

## Points de vigilance

- **Ne touchez pas au `.htaccess`** généré dans le dossier du domaine :
  c'est lui qui relie l'URL à l'application Node.
- **Le rush vidéo** `src/assets/movie/*.mov` est exclu du dépôt. Seule la
  version web `public/movie/jtech.mp4` (4,7 Mo) est versionnée, et elle
  suffit au site.
- **`allowedDevOrigins`** dans [`next.config.ts`](next.config.ts) ne sert
  qu'au développement en réseau local ; il est sans effet en production.
- **Le script `build` (Turbopack) ne fonctionne pas sur ce serveur.**
  Utilisez toujours `build:webpack`. `build` reste utilisable en local,
  où il est nettement plus rapide.
- **Après un changement de version de Node** dans cPanel, relancez
  `npm install` : les binaires natifs sont liés à la version. Le chemin
  d'activation change aussi, `.../nodevenv/jamora-technologie/<version>/...`.
- **Le dossier `data/` ne doit jamais être supprimé lors d'un déploiement.**
  Il contient les demandes reçues et les réglages modifiés dans le
  back-office. `git pull` n'y touche pas ; en revanche, ne recréez pas le
  dossier de l'application de zéro sans l'avoir sauvegardé.
