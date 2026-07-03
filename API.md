# API SIGNAL — contrat de publication

# API SIGNAL — contrat de publication

> **Chemin de l'endpoint selon l'hébergement :**
> - InfinityFree (PHP/MySQL) → `/api/articles.php`
> - Vercel (Node/Postgres) → `/api/articles`
>
> Le contrat ci-dessous (méthodes, champs, réponses) est **identique** dans
> les deux cas — seule l'URL change.

Cette API est le point d'entrée que l'automatisation utilisera pour publier
des articles sur le site. Elle est volontairement minimale : un seul
endpoint, deux méthodes.

## Lire les articles — `GET /api/articles`

Public, sans authentification. Utilisé par le site lui-même.

| Paramètre  | Description                              |
|------------|-------------------------------------------|
| `category` | Filtre par catégorie exacte                |
| `slug`     | Retourne un seul article                   |
| `limit`    | Nombre max d'articles (défaut 100, max 200)|

```bash
curl "https://votre-site.vercel.app/api/articles"
curl "https://votre-site.vercel.app/api/articles?category=Startups&limit=5"
```

## Publier un article — `POST /api/articles`

Protégé par clé API. C'est cet appel que l'automatisation de génération de
contenu devra faire à chaque nouvel article détecté/rédigé.

**En-têtes requis :**
```
Content-Type: application/json
Authorization: Bearer <ARTICLES_API_KEY>
```

**Corps de la requête :**

| Champ           | Type            | Obligatoire | Notes                                                        |
|------------------|-----------------|:-----------:|----------------------------------------------------------------|
| `slug`           | string          | ✔           | Normalisé automatiquement (minuscules, tirets)                 |
| `title`          | string          | ✔           |                                                                  |
| `category`       | string          | ✔           | `Intelligence Artificielle`, `Startups`, `Deep Tech`, `Growth & Data` |
| `excerpt`        | string          | ✔           | Chapô, ~1-2 phrases                                             |
| `content`        | string[]        | ✔           | Tableau de paragraphes (pas de HTML)                            |
| `signalScore`    | number 0-100    |             | Défaut 70 — score de pertinence/buzz                            |
| `readTime`       | number (min)    |             | Défaut 4                                                        |
| `author`         | string          |             | Défaut `"Automatisation SIGNAL"`                                |
| `autoPublished`  | boolean         |             | Défaut `true` — affiche le badge "Auto-publié"                 |
| `tags`           | string[]        |             | Défaut `[]`, alimente le bandeau défilant                      |
| `featured`       | boolean         |             | Défaut `false` — un seul article en avant sur la home           |
| `publishedAt`    | ISO 8601        |             | Défaut : maintenant                                             |

Publier deux fois le même `slug` **met à jour** l'article existant (pas de doublon).

```bash
curl -X POST "https://votre-site.vercel.app/api/articles" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ARTICLES_API_KEY" \
  -d '{
    "slug": "exemple-de-slug",
    "title": "Titre de l'\''article",
    "category": "Startups",
    "excerpt": "Résumé court en une ou deux phrases.",
    "content": ["Premier paragraphe.", "Deuxième paragraphe."],
    "signalScore": 88,
    "readTime": 5,
    "tags": ["exemple", "test"]
  }'
```

**Réponses :**
- `201` → `{ "ok": true, "slug": "..." }`
- `400` → champ manquant ou invalide
- `401` → clé API absente ou incorrecte
- `500` → erreur serveur (voir logs Vercel)

## Ce que fera l'automatisation, concrètement

Le script `scripts/seed.mjs` de ce dépôt est un exemple minimal et complet
d'appel à cet endpoint — c'est exactement ce que l'automatisation de
génération de contenu appellera à chaque nouvel article, avec un `slug`,
un `title`, etc. générés dynamiquement au lieu d'être lus dans un fichier JSON.
