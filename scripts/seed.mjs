// scripts/seed.mjs
// ---------------------------------------------------------------------------
// Publie les articles de data/seed-articles.json sur l'API déployée, en
// passant par POST /api/articles — exactement comme le fera l'automatisation
// plus tard. Sert de test de bout en bout ET de modèle d'intégration.
//
// Usage :
//   SITE_URL=https://votre-site.vercel.app ARTICLES_API_KEY=xxxx node scripts/seed.mjs
// ---------------------------------------------------------------------------

import { readFile } from 'node:fs/promises';

const SITE_URL = process.env.SITE_URL;
const API_KEY = process.env.ARTICLES_API_KEY;
const API_PATH = process.env.API_PATH || '/api/articles';

if (!SITE_URL || !API_KEY) {
  console.error('Variables manquantes. Utilisation :');
  console.error('  SITE_URL=https://votre-site.vercel.app ARTICLES_API_KEY=xxxx node scripts/seed.mjs');
  process.exit(1);
}

const raw = await readFile(new URL('../data/seed-articles.json', import.meta.url), 'utf8');
const articles = JSON.parse(raw);

let ok = 0;
let failed = 0;

for (const article of articles) {
  const endpoint = `${SITE_URL.replace(/\/$/, '')}${API_PATH}`;
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(article),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    console.log(`✔ publié : ${article.slug}`);
    ok++;
  } catch (err) {
    console.error(`✘ échec : ${article.slug} — ${err.message}`);
    failed++;
  }
}

console.log(`\n${ok} article(s) publié(s), ${failed} échec(s).`);
process.exit(failed ? 1 : 0);
