-- SIGNAL — schéma de la base d'articles
-- À exécuter une fois dans l'onglet "Query" de Vercel Postgres (dashboard),
-- ou via `psql "$POSTGRES_URL" -f sql/schema.sql` en local.

CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content JSONB NOT NULL,              -- tableau de paragraphes : ["p1", "p2", ...]
  signal_score INTEGER NOT NULL DEFAULT 70,
  read_time INTEGER NOT NULL DEFAULT 4,
  author TEXT NOT NULL DEFAULT 'Automatisation SIGNAL',
  auto_published BOOLEAN NOT NULL DEFAULT true,
  tags TEXT[] NOT NULL DEFAULT '{}',
  featured BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles (category);
