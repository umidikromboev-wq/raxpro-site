"use client";
// Поиск по каталогу в шапке (Муродбек 25.09, «как у Prostellaj»): кнопка-лупа
// есть на всех страницах, панель ищет по пунктам меню «Продукция» — типы,
// торговые по магазину и «по назначению». Индекс — те же подписи, что в меню.
import { useEffect, useMemo, useRef, useState } from "react";
import { href } from "../lib/lang";

const T = {
  ru: { open: "Поиск по каталогу", ph: "Что ищете? Например: гараж, аптека, паллетный", empty: "Ничего не нашли — оставьте заявку, подберём", catalog: "Каталог с ценами", close: "Закрыть" },
  uz: { open: "Katalog boʻyicha qidiruv", ph: "Nima qidiryapsiz? Masalan: garaj, dorixona, palletli", empty: "Hech narsa topilmadi — ariza qoldiring, tanlab beramiz", catalog: "Narxlar bilan katalog", close: "Yopish" },
};
const MAX_RESULTS = 10;

// Регистр и разные апострофы узбекского не должны мешать поиску.
const norm = (s) => s.toLowerCase().replace(/[ʻʼ'`‘’]/g, "").replace(/ё/g, "е");

export default function CatalogSearch({ menu, L }) {
  const t = T[L];
  const [isOpen, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const input = useRef(null);

  const index = useMemo(
    () => [
      { label: t.catalog, group: "", path: "/katalog" },
      ...menu.groups.flatMap((g) => g.items.map(([label, path]) => ({ label, group: g.title, path }))),
    ],
    [menu, t.catalog],
  );

  const found = useMemo(() => {
    const words = norm(q).split(/\s+/).filter(Boolean);
    if (words.length === 0) return index.slice(0, MAX_RESULTS);
    return index.filter((it) => words.every((w) => norm(`${it.label} ${it.group}`).includes(w))).slice(0, MAX_RESULTS);
  }, [q, index]);

  useEffect(() => {
    if (!isOpen) return;
    input.current?.focus();
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t.open}
        aria-expanded={isOpen}
        className="grid place-items-center w-10 h-10 rounded-xl bg-white/12 border border-white/15 text-white hover:bg-sky-500 hover:border-sky-500 transition"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-white border border-cloud-200 shadow-band p-4 sm:p-5 z-10">
          <div className="flex items-center gap-2">
            <input
              ref={input}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t.ph}
              aria-label={t.open}
              className="flex-1 min-w-0 h-12 px-4 rounded-xl border border-cloud-200 text-navy-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500"
            />
            <button type="button" onClick={() => setOpen(false)} className="h-12 px-4 rounded-xl text-slate-500 hover:text-navy-900" aria-label={t.close}>
              ✕
            </button>
          </div>
          <ul className="mt-3 max-h-[60vh] overflow-y-auto divide-y divide-cloud-100">
            {found.map((it) => (
              <li key={it.path}>
                <a href={href(L, it.path)} className="flex items-baseline justify-between gap-3 py-2.5 px-1 text-navy-900 hover:text-sky-600">
                  <span className="font-medium">{it.label}</span>
                  {it.group && <span className="text-xs text-slate-400 text-right">{it.group}</span>}
                </a>
              </li>
            ))}
            {found.length === 0 && (
              <li className="py-3 px-1 text-slate-500">
                <a href={href(L, "/#zayavka")} className="hover:text-sky-600">{t.empty}</a>
              </li>
            )}
          </ul>
        </div>
      )}
    </>
  );
}
