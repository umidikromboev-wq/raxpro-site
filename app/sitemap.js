import { ARTICLES } from '../lib/articles';
import { DIRECTIONS } from '../lib/directions';

const BASE = 'https://raxpro.uz';

export default function sitemap() {
  const now = new Date('2026-07-02');
  const pages = [
    { url: `${BASE}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/blog`, changeFrequency: 'weekly', priority: 0.8 },
  ];
  const dirs = DIRECTIONS.map((d) => ({
    url: `${BASE}/napravleniya/${d.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));
  const posts = ARTICLES.map((a) => ({
    url: `${BASE}/blog/${a.slug}`,
    lastModified: new Date(a.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));
  return [...pages.map((p) => ({ ...p, lastModified: now })), ...dirs, ...posts];
}
