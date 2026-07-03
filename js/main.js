/**
 * SIGNAL — Rendu
 * Rend la home (grille d'articles) et la page article à partir de ARTICLES.
 * Aucune dépendance externe : conçu pour rester lisible par un pipeline
 * d'automatisation qui n'aurait à toucher que articles-data.js.
 */

const CATEGORY_CLASS = {
  "Intelligence Artificielle": "cat-ia",
  "Startups": "cat-startups",
  "Deep Tech": "cat-deeptech",
  "Growth & Data": "cat-growth"
};

function relativeTime(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.round(diffMs / 60000);
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `il y a ${h} h`;
  const d = Math.round(h / 24);
  return `il y a ${d} j`;
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

function signalMeter(score) {
  return `
    <div class="signal-meter" role="img" aria-label="Score signal ${score} sur 100">
      <div class="signal-meter__bar"><div class="signal-meter__fill" style="width:${score}%"></div></div>
      <span class="signal-meter__value">${score}</span>
    </div>`;
}

function categoryTag(cat) {
  const cls = CATEGORY_CLASS[cat] || "cat-default";
  return `<span class="tag ${cls}">${cat}</span>`;
}

function autoBadge(article) {
  if (!article.autoPublished) return "";
  return `<span class="badge-auto"><span class="badge-auto__dot"></span>Auto-publié</span>`;
}

function articleCard(article) {
  return `
    <article class="card">
      <a class="card__link" href="article.html?slug=${article.slug}">
        <div class="card__top">
          ${categoryTag(article.category)}
          ${autoBadge(article)}
        </div>
        <h3 class="card__title">${article.title}</h3>
        <p class="card__excerpt">${article.excerpt}</p>
        <div class="card__meta">
          <span>${formatDate(article.publishedAt)} · ${relativeTime(article.publishedAt)}</span>
          <span>${article.readTime} min de lecture</span>
        </div>
        ${signalMeter(article.signalScore)}
      </a>
    </article>`;
}

async function fetchArticles() {
  try {
    const res = await fetch("/api/articles");
    if (!res.ok) throw new Error(`API a répondu ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data.articles) && data.articles.length > 0) {
      return data.articles;
    }
    throw new Error("aucun article en base");
  } catch (err) {
    // L'API n'est pas encore branchée (base non créée, exécution locale hors
    // Vercel, etc.) : on retombe sur le jeu de données statique embarqué,
    // pour que le site reste consultable pendant la mise en place du backend.
    console.warn("[SIGNAL] /api/articles indisponible, utilisation des données locales :", err.message);
    return typeof ARTICLES !== "undefined" ? ARTICLES : [];
  }
}

function renderHome(articles) {
  if (!articles.length) {
    const grid = document.getElementById("article-grid");
    if (grid) grid.innerHTML = `<p class="empty-state">Aucun article publié pour l'instant. Le pipeline n'a encore rien détecté.</p>`;
    return;
  }
  const featured = articles.find(a => a.featured) || articles[0];
  const rest = articles.filter(a => a.id !== featured.id);

  const featuredEl = document.getElementById("featured-slot");
  if (featuredEl) {
    featuredEl.innerHTML = `
      <a class="featured-card" href="article.html?slug=${featured.slug}">
        <div class="featured-card__glow" aria-hidden="true"></div>
        <div class="featured-card__top">
          ${categoryTag(featured.category)}
          ${autoBadge(featured)}
        </div>
        <h2 class="featured-card__title">${featured.title}</h2>
        <p class="featured-card__excerpt">${featured.excerpt}</p>
        <div class="featured-card__meta">
          <span>${formatDate(featured.publishedAt)} · ${relativeTime(featured.publishedAt)}</span>
          <span>${featured.readTime} min de lecture</span>
        </div>
        ${signalMeter(featured.signalScore)}
      </a>`;
  }

  const grid = document.getElementById("article-grid");
  if (grid) {
    grid.innerHTML = rest.map(articleCard).join("");
  }

  const ticker = document.getElementById("ticker-track");
  if (ticker) {
    const tags = [...new Set(articles.flatMap(a => a.tags))].map(t => t.toUpperCase());
    const loopContent = [...tags, ...tags].map(t => `<span class="ticker__item">${t}</span><span class="ticker__sep">◆</span>`).join("");
    ticker.innerHTML = loopContent;
  }

  const countEl = document.getElementById("article-count");
  if (countEl) countEl.textContent = articles.length;

  revealOnScroll();
}

function renderArticle(articles) {
  if (!articles.length) {
    const root = document.getElementById("article-root");
    if (root) root.innerHTML = `<p class="empty-state">Aucun article publié pour l'instant.</p>`;
    return;
  }
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  const article = articles.find(a => a.slug === slug) || articles[0];
  if (!article) return;

  document.title = `${article.title} — SIGNAL`;

  const root = document.getElementById("article-root");
  if (!root) return;

  const related = articles.filter(a => a.category === article.category && a.id !== article.id).slice(0, 2);

  root.innerHTML = `
    <div class="article-meta-top">
      ${categoryTag(article.category)}
      ${autoBadge(article)}
      <span class="article-meta-top__date">${formatDate(article.publishedAt)} · ${relativeTime(article.publishedAt)}</span>
    </div>
    <h1 class="article-title">${article.title}</h1>
    <p class="article-excerpt">${article.excerpt}</p>
    <div class="article-info-row">
      <span>Par ${article.author}</span>
      <span>${article.readTime} min de lecture</span>
      ${signalMeter(article.signalScore)}
    </div>
    <div class="article-body">
      ${article.content.map(p => `<p>${p}</p>`).join("")}
    </div>
    <div class="article-tags">
      ${article.tags.map(t => `<span class="tag-pill">#${t}</span>`).join("")}
    </div>
    ${related.length ? `
      <div class="related">
        <h3 class="related__title">À lire aussi dans ${article.category}</h3>
        <div class="related__grid">${related.map(articleCard).join("")}</div>
      </div>` : ""}
  `;
}

function revealOnScroll() {
  const items = document.querySelectorAll(".card, .featured-card");
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach(el => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(el => io.observe(el));
}

document.addEventListener("DOMContentLoaded", async () => {
  const page = document.body.dataset.page;
  const articles = await fetchArticles();

  if (page === "home") renderHome(articles);
  if (page === "article") renderArticle(articles);

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
