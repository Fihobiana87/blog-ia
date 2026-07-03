// api/articles.js
// ---------------------------------------------------------------------------
// GET  /api/articles                 → liste des articles (lecture publique)
// GET  /api/articles?category=IA     → filtrée par catégorie
// GET  /api/articles?slug=mon-slug   → un seul article
// POST /api/articles                 → publie ou met à jour un article
//      Header requis : Authorization: Bearer <ARTICLES_API_KEY>
//      C'est CE endpoint que l'automatisation appellera pour publier.
// ---------------------------------------------------------------------------

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

const REQUIRED_FIELDS = ['slug', 'title', 'category', 'excerpt', 'content'];
const ALLOWED_CATEGORIES = ['Intelligence Artificielle', 'Startups', 'Deep Tech', 'Growth & Data'];

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'GET') return handleGet(req, res);
  if (req.method === 'POST') return handlePost(req, res);

  res.setHeader('Allow', 'GET, POST, OPTIONS');
  return res.status(405).json({ error: 'Méthode non autorisée.' });
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

async function handleGet(req, res) {
  try {
    const { category, slug, limit } = req.query;
    const max = Math.min(Number(limit) || 100, 200);

    let rows;
    if (slug) {
      rows = await sql`SELECT * FROM articles WHERE slug = ${slug} LIMIT 1`;
    } else if (category) {
      rows = await sql`
        SELECT * FROM articles
        WHERE category = ${category}
        ORDER BY published_at DESC
        LIMIT ${max}`;
    } else {
      rows = await sql`
        SELECT * FROM articles
        ORDER BY published_at DESC
        LIMIT ${max}`;
    }

    const articles = rows.map(rowToArticle);
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=30, stale-while-revalidate=60');
    return res.status(200).json({ articles });
  } catch (err) {
    console.error('[GET /api/articles]', err);
    return res.status(500).json({ error: 'Erreur serveur lors de la lecture des articles.' });
  }
}

async function handlePost(req, res) {
  const token = (req.headers.authorization || '').replace('Bearer ', '').trim();
  if (!process.env.ARTICLES_API_KEY || token !== process.env.ARTICLES_API_KEY) {
    return res.status(401).json({ error: 'Clé API manquante ou invalide.' });
  }

  const body = typeof req.body === 'string' ? safeJson(req.body) : req.body || {};
  const missing = REQUIRED_FIELDS.filter((f) => !body[f]);
  if (missing.length) {
    return res.status(400).json({ error: `Champs manquants : ${missing.join(', ')}` });
  }
  if (!Array.isArray(body.content) || body.content.length === 0) {
    return res.status(400).json({ error: '"content" doit être un tableau non vide de paragraphes.' });
  }
  if (!ALLOWED_CATEGORIES.includes(body.category)) {
    return res.status(400).json({ error: `"category" doit être l'une de : ${ALLOWED_CATEGORIES.join(', ')}` });
  }

  const slug = slugify(body.slug);
  const {
    title,
    category,
    excerpt,
    content,
    signalScore = 70,
    readTime = 4,
    author = 'Automatisation SIGNAL',
    autoPublished = true,
    tags = [],
    featured = false,
    publishedAt = new Date().toISOString(),
  } = body;

  try {
    await sql`
      INSERT INTO articles (
        slug, title, category, excerpt, content,
        signal_score, read_time, author, auto_published, tags, featured, published_at
      ) VALUES (
        ${slug}, ${title}, ${category}, ${excerpt}, ${JSON.stringify(content)}::jsonb,
        ${clamp(signalScore, 0, 100)}, ${readTime}, ${author}, ${autoPublished}, ${tags}, ${featured}, ${publishedAt}
      )
      ON CONFLICT (slug) DO UPDATE SET
        title          = EXCLUDED.title,
        category       = EXCLUDED.category,
        excerpt        = EXCLUDED.excerpt,
        content        = EXCLUDED.content,
        signal_score   = EXCLUDED.signal_score,
        read_time      = EXCLUDED.read_time,
        author         = EXCLUDED.author,
        auto_published = EXCLUDED.auto_published,
        tags           = EXCLUDED.tags,
        featured       = EXCLUDED.featured,
        published_at   = EXCLUDED.published_at;
    `;
    return res.status(201).json({ ok: true, slug });
  } catch (err) {
    console.error('[POST /api/articles]', err);
    return res.status(500).json({ error: "Erreur serveur lors de l'écriture de l'article." });
  }
}

function rowToArticle(row) {
  return {
    id: String(row.id),
    slug: row.slug,
    title: row.title,
    category: row.category,
    excerpt: row.excerpt,
    content: row.content,
    signalScore: row.signal_score,
    readTime: row.read_time,
    publishedAt: row.published_at,
    author: row.author,
    autoPublished: row.auto_published,
    tags: row.tags || [],
    featured: row.featured,
  };
}

function slugify(input) {
  return String(input)
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function clamp(n, min, max) {
  const v = Number(n);
  if (Number.isNaN(v)) return min;
  return Math.max(min, Math.min(max, v));
}

function safeJson(str) {
  try { return JSON.parse(str); } catch { return {}; }
}
