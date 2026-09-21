// Карточка направления на главной: цена «от», нагрузка, высота, «для кого»
// и кнопка в конструктор. Все числа — из lib/products.js (прайс клиента)
// и lib/directions.js (спецификации); здесь ничего не придумывается.
import { DIRECTIONS } from "./directions";
import { PRODUCTS } from "./products";

/** Тип конструктора для направления. Торговые и набивные считает инженер. */
const KON_TYPE = {
  "palletnye-stellazhi": "pallet",
  "srednegruzovye-stellazhi": "medium",
  "arhivnye-stellazhi": "archive",
  "torgovye-stellazhi": "retail",
};

export const DIR_CARD_T = {
  ru: { from: "от", perSection: "сум / секция", byProject: "цена по проекту", forWhom: "Для кого", design: "Спроектировать этот тип", engineer: "Рассчитать с инженером", more: "Подробнее" },
  uz: { from: "", perSection: "soʻmdan / seksiya", byProject: "narx loyiha boʻyicha", forWhom: "Kimlar uchun", design: "Shu turni loyihalash", engineer: "Muhandis bilan hisoblash", more: "Batafsil" },
};

export function directionCards(lang) {
  const L = lang === "uz" ? "uz" : "ru";
  const t = DIR_CARD_T[L];
  return DIRECTIONS.map((d) => {
    const prices = PRODUCTS.filter((p) => p.directionSlug === d.slug).map((p) => p.price);
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
