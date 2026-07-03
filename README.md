# SIGNAL — déploiement avec base de données

> **Coût :** 0 €. Le site (plan Hobby de Vercel) et la base de données (plan
> gratuit de Neon) tiennent tous les deux dans une offre gratuite — aucune
> carte bancaire requise. Seule restriction : le plan Hobby est réservé à un
> usage non commercial (démo, test, projet personnel) ; s'il génère des
> revenus un jour, il faudra passer sur le plan Pro de Vercel.

Le site fonctionne déjà seul (données de démonstration embarquées dans
`js/articles-data.js`). Ce README explique comment brancher la vraie base de
données pour que le site devienne **écrivable** par une automatisation.

## 1. Déployer le projet sur Vercel

Si ce n'est pas déjà fait : importez ce dossier comme projet Vercel (preset
**Other**, aucune commande de build nécessaire — les fichiers `api/*.js` sont
détectés automatiquement comme fonctions serverless dès qu'un `package.json`
est présent à la racine, ce qui est le cas ici).

## 2. Créer la base de données

Vercel ne gère plus sa propre offre "Postgres" en direct : elle passe désormais
par le **Marketplace**, avec **Neon** comme fournisseur recommandé. Le flux
reste tout aussi simple :

Dans le dashboard Vercel du projet : **Storage → Marketplace Database
Providers → Neon → Add Integration** (choisissez *Create New Neon Account*
si vous n'avez pas déjà de compte Neon). Une fois créée, connectez la base au
projet : Vercel injecte automatiquement les variables d'environnement
(`DATABASE_URL` notamment) — rien à copier à la main. Le plan gratuit de
Neon est largement suffisant pour ce site de test.

## 3. Créer la table `articles`

Deux façons de faire, au choix :

**A. Depuis le dashboard** — bouton **Open in Neon** sur la base, onglet
**SQL Editor**, collez le contenu de `sql/schema.sql` et exécutez.

**B. En local**, après avoir récupéré les variables d'environnement :
```bash
vercel env pull .env.local
psql "$(grep '^DATABASE_URL=' .env.local | cut -d= -f2- | tr -d '"')" -f sql/schema.sql
```

## 4. Définir la clé API de publication

Dashboard du projet → **Settings → Environment Variables** → ajoutez :
```
ARTICLES_API_KEY = <une chaîne longue et aléatoire>
```
Générez-en une avec `openssl rand -hex 32`. C'est cette clé que
l'automatisation utilisera pour publier — gardez-la secrète, ne la mettez
jamais dans le code du site (elle n'est utilisée que côté serveur, dans
`api/articles.js`).

Redéployez ensuite le projet pour que la nouvelle variable soit prise en
compte (**Deployments → ⋯ → Redeploy**).

## 5. Installer les dépendances et publier les articles de test

```bash
npm install
SITE_URL=https://votre-site.vercel.app ARTICLES_API_KEY=votre_clé npm run seed
```

Ce script publie les 6 articles de démonstration via `POST /api/articles` —
exactement comme le fera l'automatisation plus tard. Rechargez le site : les
articles viennent maintenant de la base, plus du fichier statique.

## 6. Vérifier que tout est branché

```bash
curl https://votre-site.vercel.app/api/articles
```
Doit retourner `{ "articles": [...] }`. Si le site affiche encore les
articles de démonstration alors que la base est vide, c'est normal : c'est
le repli automatique décrit ci-dessous.

## Comportement de repli

`js/main.js` essaie d'abord `/api/articles`. Si l'appel échoue (base pas
encore créée, clé pas encore configurée, test en local hors Vercel...), le
site retombe silencieusement sur les articles statiques de
`js/articles-data.js`, avec un avertissement dans la console. Le site reste
donc toujours consultable, à n'importe quelle étape du branchement.

## Étape suivante

Voir `API.md` pour le contrat exact de `POST /api/articles` — c'est ce que
votre pipeline de détection/génération de contenu devra appeler à chaque
nouvel article.
