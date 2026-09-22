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
  ru: { from: "от", perSection: "сум / секция", byProject: "цена по проекту", forWhom: "Для кого", design: "Спроектировать этот тип", engineer: "Рассчитать с инженером", request: "Оставить заявку", more: "Узнать подробнее", moreShort: "Подробнее" },
  uz: { from: "", perSection: "soʻmdan / seksiya", byProject: "narx loyiha boʻyicha", forWhom: "Kimlar uchun", design: "Shu turni loyihalash", engineer: "Muhandis bilan hisoblash", request: "Ariza qoldirish", more: "Batafsil bilish", moreShort: "Batafsil" },
};

export const SIZES_T = {
  ru: { title: "Типоразмеры из прайса", size: "Секция В×Ш×Г, мм", levels: "Ярусов", price: "Цена, сум", byRequest: "по расчёту", note: "Цена секции без НДС. Высота, ярусы и длина балки подбираются под товар и потолок — конструктор делает это сам.", noteNoPrice: "Высота, ярусы и длина балки подбираются под товар и потолок — конструктор делает это сам. Цена секции — в каталоге и в расчёте под ваше помещение." },
  uz: { title: "Narxnomadagi oʻlchamlar", size: "Seksiya B×K×Ch, mm", levels: "Yarus", price: "Narx, soʻm", byRequest: "hisob boʻyicha", note: "Seksiya narxi QQSsiz. Balandlik, yarus va balka uzunligi tovar va shiftga qarab tanlanadi — konstruktor buni oʻzi qiladi.", noteNoPrice: "Balandlik, yarus va balka uzunligi tovar va shiftga qarab tanlanadi — konstruktor buni oʻzi qiladi. Seksiya narxi katalogda va sizning xonangiz uchun hisobda." },
};

/** Цена секции, которую мы публикуем, живёт в lib/products.js: она же уходит
 *  в фид Merchant Center и стоит на карточке товара. В lib/rack/catalog лежит
 *  прайс завода для КП, и по среднегрузовым он разошёлся с публичной ценой
 *  (2000×2000×600 на 4 яруса: 4 344 966 по прайсу против 3 620 000 на сайте).
 *  Пока расхождение не разобрано с клиентом, две цены за одну и ту же секцию
 *  на сайте не появляются: если прайс спорит с каталогом, колонка цены по
 *  этому продукту гаснет, остаётся геометрия. */
function priceListAgreesWithCatalog(product, slug) {
  return product.sizes.every((v) => {
    const sold = PRODUCTS.find(
      (p) => p.directionSlug === slug && p.dims && p.levels === v.levels &&
        p.dims.h === v.h && p.dims.w === v.w && p.dims.d === v.d,
    );
    if (!sold || typeof sold.price !== "number" || v.price == null) return true;
    return sold.price === v.price;
  });
}

/** Таблица типоразмеров направления — из lib/rack/catalog, где живёт прайс. */
export function directionSizes(slug) {
  const key = RACK_KEY[slug];
  const product = key && RACK_PRODUCTS.find((p) => p.key === key);
  if (!product) return null;
  const showPrice = priceListAgreesWithCatalog(product, slug);
  // Нагрузка не выводится: вилки в catalog (из КП) и в directions (с сайта)
  // расходятся для архивных, и до таблицы нагрузок от клиента показываем
  // только цену и геометрию.
  return {
    rows: product.sizes.map((v) => ({ code: v.code, size: `${v.h}×${v.w}×${v.d}`, levels: v.levels, price: showPrice ? v.price ?? null : null })),
  };
}

/** «Для кого» мезонина — в lib/products его нет, направления тоже нет. */
const MEZZANINE_USE_CASES = {
  ru: "Склады с высокими потолками, зоны комплектации e-commerce, производства, которым нужна площадь без стройки.",
  uz: "Shifti baland omborlar, e-commerce buyurtma yigʻish zonalari, qurilishsiz maydon kerak boʻlgan ishlab chiqarishlar.",
};

/** Шестая карточка главной: мезонин считается только по проекту, ведёт к инженеру. */
function mezzanineCard(L, t) {
  const p = PRODUCTS.find((x) => x.slug === "mezonin");
  if (!p) return null;
  const specs = p[L].specs.filter((sp) => /Нагрузка|yuklama|Комплект|Komplekt/i.test(sp.k)).slice(0, 2);
  return {
    slug: p.slug,
    price: t.byProject,
    specs,
    useCases: MEZZANINE_USE_CASES[L],
    cta: { href: "#zayavka", label: t.request },
    more: t.more,
    moreShort: t.moreShort,
    forWhom: t.forWhom,
  };
}

export function directionCards(lang) {
  const L = lang === "uz" ? "uz" : "ru";
  const t = DIR_CARD_T[L];
  const cards = DIRECTIONS.map((d) => {
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
      cta: { href: "#zayavka", label: t.request },
      more: t.more,
      moreShort: t.moreShort,
      forWhom: t.forWhom,
    };
  });
  const mezzanine = mezzanineCard(L, t);
  return mezzanine ? [...cards, mezzanine] : cards;
}
