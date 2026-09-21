// Карточка направления на главной: цена «от», нагрузка, высота, «для кого»
// и кнопка в конструктор. Все числа — из lib/products.js (прайс клиента)
// и lib/directions.js (спецификации); здесь ничего не придумывается.
import { DIRECTIONS } from "./directions";
import { PRODUCTS } from "./products";
import { PRODUCTS as RACK_PRODUCTS } from "./rack/catalog";

/** Тип конструктора для направления. Торговые и набивные считает инженер. */
const KON_TYPE = {
  "palletnye-stellazhi": "pallet",
  "srednegruzovye-stellazhi": "medium",
  "arhivnye-stellazhi": "archive",
  "torgovye-stellazhi": "retail",
};

/** Продукт движка lib/rack — оттуда типоразмеры из прайса. */
const RACK_KEY = {
  "palletnye-stellazhi": "pallet-frontal",
  "srednegruzovye-stellazhi": "medium-duty",
  "arhivnye-stellazhi": "archive",
};

export const DIR_CARD_T = {
  ru: { from: "от", perSection: "сум / секция", byProject: "цена по проекту", forWhom: "Для кого", design: "Спроектировать этот тип", engineer: "Рассчитать с инженером", more: "Подробнее" },
  uz: { from: "", perSection: "soʻmdan / seksiya", byProject: "narx loyiha boʻyicha", forWhom: "Kimlar uchun", design: "Shu turni loyihalash", engineer: "Muhandis bilan hisoblash", more: "Batafsil" },
};

export const SIZES_T = {
  ru: { title: "Типоразмеры из прайса", size: "Секция В×Ш×Г, мм", levels: "Ярусов", price: "Цена, сум", byRequest: "по расчёту", note: "Цена секции без НДС. Высота, ярусы и длина балки подбираются под товар и потолок — конструктор делает это сам." },
  uz: { title: "Narxnomadagi oʻlchamlar", size: "Seksiya B×K×Ch, mm", levels: "Yarus", price: "Narx, soʻm", byRequest: "hisob boʻyicha", note: "Seksiya narxi QQSsiz. Balandlik, yarus va balka uzunligi tovar va shiftga qarab tanlanadi — konstruktor buni oʻzi qiladi." },
};

/** Таблица типоразмеров направления — из lib/rack/catalog, где живёт прайс. */
export function directionSizes(slug) {
  const key = RACK_KEY[slug];
  const product = key && RACK_PRODUCTS.find((p) => p.key === key);
  if (!product) return null;
  // Нагрузка не выводится: вилки в catalog (из КП) и в directions (с сайта)
  // расходятся для архивных, и до таблицы нагрузок от клиента показываем
  // только цену и геометрию.
  return {
    rows: product.sizes.map((v) => ({ code: v.code, size: `${v.h}×${v.w}×${v.d}`, levels: v.levels, price: v.price ?? null })),
  };
}

export function directionCards(lang) {
  const L = lang === "uz" ? "uz" : "ru";
  const t = DIR_CARD_T[L];
  return DIRECTIONS.map((d) => {
    const prices = PRODUCTS.filter((p) => p.directionSlug === d.slug && typeof p.price === "number").map((p) => p.price);
    const minPrice = prices.length ? Math.min(...prices) : null;
    const specs = d[L].specs.slice(0, 2);
    const type = KON_TYPE[d.slug];
    return {
      slug: d.slug,
      price: minPrice
        ? `${t.from} ${minPrice.toLocaleString("ru-RU")} ${t.perSection}`.trim()
        : t.byProject,
      specs,
      useCases: d[L].useCases,
      cta: type ? { href: `/${L}/konstruktor?type=${type}`, label: t.design } : { href: "#zayavka", label: t.engineer },
      more: t.more,
      forWhom: t.forWhom,
    };
  });
}
