import { ARTICLES } from '../lib/articles';
import { DIRECTIONS } from '../lib/directions';
import { LANGS, LANG_DEFAULT } from '../lib/i18n';
import { absHref } from '../lib/lang';

// У каждой страницы два адреса — /ru/… и /uz/…. Каждая запись несёт полный
// взаимный набор hreflang, чтобы поисковик связал версии между собой,
// а не счёл их дублями.
function entry(path, lastModified, changeFrequency, priority) {
  const languages = Object.fromEntries(LANGS.map((l) => [l, absHref(l, path)]));
  const alternates = { languages: { ...languages, 'x-default': absHref(LANG_DEFAULT, path) } };
  return LANGS.map((lang) => ({
    url: absHref(lang, path),
    lastModified,
    changeFrequency,
    priority,
    alternates,
  }));
}

export default function sitemap() {
  const now = new Date('2026-07-29');
  return [
    ...entry('/', now, 'weekly', 1),
    ...entry('/blog', now, 'weekly', 0.8),
    ...entry('/experts', now, 'monthly', 0.6),
    ...DIRECTIONS.flatMap((d) => entry(`/napravleniya/${d.slug}`, now, 'monthly', 0.9)),
    ...ARTICLES.flatMap((a) => entry(`/blog/${a.slug}`, new Date(a.date), 'monthly', 0.7)),
  ];
}
