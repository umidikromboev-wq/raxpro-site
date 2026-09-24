"use client";
// Выбор числа полок с пересчётом цены (ТЗ 24.09, этап 3). Одна карточка —
// несколько вариантов из lib/products (variants). Цена только из прайса.
//
// mode="card"  — в сетке каталога: кнопки «Купить»/«Подробнее» ведут на
//                страницу товара с ?polki=N.
// mode="page"  — на странице товара: выбор пишется в адрес (?polki=N, его же
//                указывает фид Merchant Center) и рассылается событием
//                VARIANT_EVENT — форма заявки подхватывает выбранный вариант.
import { useEffect, useState } from "react";
import { formatPrice } from "../lib/format";

export const VARIANT_EVENT = "raxpro:variant";
export const VARIANT_PARAM = "polki";

const T = {
  ru: { shelves: "Количество полок", sku: "Артикул" },
  uz: { shelves: "Polkalar soni", sku: "Artikul" },
};

/** Фото варианта: картинки товара помечены data-variant-img={slug}. */
function showImage(slug, v) {
  if (!slug || !v?.image) return;
  document.querySelectorAll(`img[data-variant-img="${slug}"]`).forEach((img) => {
    img.src = v.image;
  });
}

/** Вариант из адреса страницы, если он есть в списке. */
export function levelsFromUrl(variants) {
  if (typeof window === "undefined") return null;
  const n = Number(new URLSearchParams(window.location.search).get(VARIANT_PARAM));
  return variants.some((v) => v.levels === n) ? n : null;
}

function Chips({ variants, value, onChange, lang }) {
  return (
    <div role="radiogroup" aria-label={T[lang].shelves} className="flex flex-wrap gap-2">
      {variants.map((v) => {
        const isOn = v.levels === value;
        return (
          <button
            key={v.levels}
            type="button"
            role="radio"
            aria-checked={isOn}
            onClick={() => onChange(v.levels)}
            className={`min-w-[44px] h-11 px-3 rounded-xl border font-semibold tabular-nums transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-500 ${isOn ? "bg-navy-900 border-navy-900 text-white" : "bg-white border-cloud-200 text-navy-800 hover:border-sky-400"}`}
          >
            {v.levels}
          </button>
        );
      })}
    </div>
  );
}

/**
 * @param {{ variants: {levels:number, sku:string, price:number}[], defaultLevels: number,
 *   lang: "ru"|"uz", mode?: "card"|"page", productHref?: string, slug?: string,
 *   labels?: { from?: string, buy?: string, more?: string } }} props
 */
export default function ShelfPicker({ variants, defaultLevels, lang = "ru", mode = "card", productHref = "", slug = "", labels = {} }) {
  const [levels, setLevels] = useState(defaultLevels);
  const current = variants.find((v) => v.levels === levels) || variants[0];
  const t = T[lang];

  useEffect(() => {
    if (mode !== "page") return;
    const fromUrl = levelsFromUrl(variants);
    if (!fromUrl) return;
    setLevels(fromUrl);
    showImage(slug, variants.find((v) => v.levels === fromUrl));
  }, [mode, variants, slug]);

  const choose = (n) => {
    setLevels(n);
    showImage(slug, variants.find((v) => v.levels === n));
    if (mode !== "page") return;
    const url = new URL(window.location.href);
    url.searchParams.set(VARIANT_PARAM, String(n));
    window.history.replaceState(null, "", url);
    window.dispatchEvent(new CustomEvent(VARIANT_EVENT, { detail: { levels: n } }));
  };

  if (mode === "page") {
    return (
      <div>
        <div className="text-sm text-slate-500 mb-2">{t.shelves}</div>
        <Chips variants={variants} value={current.levels} onChange={choose} lang={lang} />
        <div aria-live="polite" className="font-display font-medium text-4xl text-navy-800 mt-5 tabular-nums">
          {formatPrice(current.price, lang)}
        </div>
        <div className="mt-1 text-xs text-slate-400">{t.sku}: {current.sku}</div>
      </div>
    );
  }

  const target = `${productHref}?${VARIANT_PARAM}=${current.levels}`;
  return (
    <div>
      <div className="text-xs text-slate-400 mb-2">{t.shelves}</div>
      <Chips variants={variants} value={current.levels} onChange={choose} lang={lang} />
      <div aria-live="polite" className="mt-4 font-display font-medium text-2xl text-navy-800 tabular-nums">
        {formatPrice(current.price, lang)}
      </div>
      <div className="mt-4 flex flex-wrap gap-2.5">
        <a href={`${target}#zayavka`} className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 bg-navy-900 text-white hover:bg-sky-600 font-semibold px-5 py-3 rounded-xl transition">
          {labels.buy}
        </a>
        <a href={target} className="inline-flex items-center justify-center gap-2 border border-navy-900/15 text-navy-800 hover:border-sky-500 hover:text-sky-600 font-semibold px-5 py-3 rounded-xl transition">
          {labels.more}
        </a>
      </div>
    </div>
  );
}
