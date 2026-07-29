// Язык живёт в пути: /ru/... и /uz/... — у каждой языковой версии свой адрес,
// который можно проиндексировать, дать ссылкой и открыть без cookie.
// Раньше язык переключался cookie на одном и том же URL, поэтому в индекс
// попадала только русская версия.
import { LANGS, LANG_DEFAULT, normalizeLang } from './i18n';

export const SITE_ORIGIN = 'https://raxpro.uz';

export { LANGS, LANG_DEFAULT, normalizeLang };

// Внутренняя ссылка с языковым префиксом: href('uz', '/blog') → '/uz/blog'.
export function href(lang, path = '/') {
  const L = normalizeLang(lang);
  if (!path || path === '/') return `/${L}`;
  return `/${L}${path.startsWith('/') ? path : `/${path}`}`;
}

// Абсолютный адрес страницы на конкретном языке.
export function absHref(lang, path = '/') {
  return `${SITE_ORIGIN}${href(lang, path)}`;
}

// canonical + взаимные hreflang для пути БЕЗ языкового префикса ('/', '/blog').
export function alternatesFor(path, lang) {
  const languages = Object.fromEntries(LANGS.map((l) => [l, absHref(l, path)]));
  return {
    canonical: absHref(lang, path),
    languages: { ...languages, 'x-default': absHref(LANG_DEFAULT, path) },
  };
}

// Тот же путь на другом языке — для переключателя в шапке.
export function switchLangPath(pathname, lang) {
  const rest = String(pathname || '/').replace(/^\/(ru|uz)(?=\/|$)/, '') || '/';
  return href(lang, rest);
}
