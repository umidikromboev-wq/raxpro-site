// Компания в коммерческом предложении: кто мы, что сделали, кому.
//
// Раньше эти страницы собирались в Word и расходились между документами —
// у одного КП «150 клиентов», у другого «300». Здесь факты лежат один раз,
// картинки — реальные снимки сданных объектов из рабочего архива, а не стоки.

import { COMPANY, FOUNDED_YEAR, Lang } from "./company";

export interface CaseShot {
  file: string;
  w: number;
  h: number;
  product: string;
  ru: string;
  uz: string;
}

const P = "/kp/cases/";

/** Снимки сданных объектов. Порядок — от самого сильного кадра. */
export const CASES: CaseShot[] = [
  { file: P + "hero-01.jpg", w: 1300, h: 975, product: "pallet-frontal",
    ru: "Паллетные стеллажи, склад дистрибуции, Ташкент",
    uz: "Palet stellajlari, distributsiya ombori, Toshkent" },
  { file: P + "pallet-02.jpg", w: 1400, h: 1050, product: "pallet-frontal",
    ru: "Паллетные стеллажи под готовую продукцию, производственный склад",
    uz: "Tayyor mahsulot uchun palet stellajlari, ishlab chiqarish ombori" },
  { file: P + "pallet-01.jpg", w: 960, h: 1280, product: "pallet-frontal",
    ru: "Паллетные стеллажи в холодном складе дистрибуции",
    uz: "Sovuq distributsiya omborida palet stellajlari" },
  { file: P + "driveIn-01.jpg", w: 853, h: 1280, product: "pallet-driveIn",
    ru: "Набивные стеллажи drive-in, высотное хранение",
    uz: "Drive-in zich joylashuvli stellajlar, balandlikda saqlash" },
  { file: P + "medium-01.jpg", w: 1200, h: 1600, product: "medium-duty",
    ru: "Среднегрузовые стеллажи в холодильной камере",
    uz: "Sovutkich kamerasida oʻrta yuklamali stellajlar" },
  { file: P + "medium-02.jpg", w: 1280, h: 960, product: "medium-duty",
    ru: "Среднегрузовые стеллажи на антресольном этаже",
    uz: "Antresol qavatda oʻrta yuklamali stellajlar" },
  { file: P + "retail-02.jpg", w: 1280, h: 960, product: "retail",
    ru: "Торговое оборудование, зал магазина",
    uz: "Savdo jihozlari, doʻkon zali" },
  { file: P + "retail-01.jpg", w: 960, h: 1280, product: "retail",
    ru: "Торговые стеллажи под весовой товар",
    uz: "Vaznli tovar uchun savdo stellajlari" },
  { file: P + "archive-01.jpg", w: 1280, h: 960, product: "archive",
    ru: "Архивные стеллажи в офисном помещении",
    uz: "Ofis binosida arxiv stellajlari" },
  { file: P + "mezzanine-01.jpg", w: 1018, h: 664, product: "mezzanine",
    ru: "Мезонин с лестницей и складскими ярусами",
    uz: "Zinapoyali va ombor yaruslari bilan mezonin" },
];

/** Кадр под конкретный продукт — обложка КП должна показывать то,
 *  что клиент покупает, а не абстрактный склад. */
export function coverFor(productKey: string): CaseShot {
  return CASES.find((c) => c.product === productKey) ?? CASES[0];
}

/** Ещё три кадра на страницу работ: сначала по продукту, потом остальные. */
export function galleryFor(productKey: string, count = 4): CaseShot[] {
  const own = CASES.filter((c) => c.product === productKey);
  const rest = CASES.filter((c) => c.product !== productKey);
  return [...own, ...rest].slice(0, count);
}

/** Клиенты. Список согласован с RaxPro; выводится набором, а не логотипами:
 *  логотипов в едином качестве на всех нет, а разнокалиберные картинки
 *  на премиальном листе выглядят хуже, чем чистый типографский набор. */
export const CLIENTS = [
  "Uzum", "Ishonch", "Asaxiy", "Makro", "Prizma", "Dom Stroy", "JAC Motors",
  "Discover Invest", "IT Park", "Ankara Picnic", "Sayqal", "Bloom", "Super Pack",
] as const;

export const FOUNDER = {
  photo: "/brand/founder.jpg",
  name: { ru: COMPANY.director.ru, uz: COMPANY.director.uz },
  role: { ru: "Основатель и директор RAX PRO", uz: "RAX PRO asoschisi va direktori" },
  quote: {
    ru: "Стеллаж — это не товар со склада, а конструкция под ваш пол, ваш потолок и вашу технику. Поэтому мы сначала считаем расстановку и паллето-места, и только потом называем сумму.",
    uz: "Stellaj — ombordan olingan tovar emas, balki sizning polingiz, shipingiz va texnikangizga moʻljallangan konstruksiya. Shuning uchun avval joylashuv va palet oʻrinlarini hisoblaymiz, keyin summani aytamiz.",
  },
};

export interface Fact { k: string; v: string; note?: string }

export function facts(lang: Lang, now: Date = new Date()): Fact[] {
  const uz = lang === "uz";
  const year = String(FOUNDED_YEAR);
  return [
    { k: uz ? "Bozorda" : "На рынке", v: uz ? `${year}-yildan` : `с ${year} года` },
    { k: uz ? "Sanoqli obyektlar" : "Сданных объектов", v: `${COMPANY.objectsCount}+` },
    { k: uz ? "Mijoz kompaniyalar" : "Компаний-клиентов", v: `${COMPANY.clientsCount}+` },
    { k: uz ? "Kafolat" : "Гарантия", v: `${COMPANY.warrantyMonths} ${uz ? "oy" : "месяцев"}` },
  ];
}

/** Из чего складывается предложение. Каждый пункт — то, чего в старых КП
 *  не было и о чём клиент спрашивал по телефону. */
export function pillars(lang: Lang) {
  const uz = lang === "uz";
  return [
    {
      title: uz ? "Loyihalash" : "Проектирование",
      body: uz
        ? "Oʻlchov, ustunlar va texnika hisobga olingan joylashuv, palet oʻrinlari soni — kelishuvgacha."
        : "Замер, расстановка с учётом колонн и техники, число паллето-мест — до сделки.",
    },
    {
      title: uz ? "Ishlab chiqarish" : "Производство",
      body: uz
        ? `${COMPANY.factory.name} zavodi, ${COMPANY.factory.country.uz}. RollForm texnologiyasi, kukunli boʻyoq.`
        : `Завод ${COMPANY.factory.name}, ${COMPANY.factory.country.ru}. Технология RollForm, порошковая окраска.`,
    },
    {
      title: uz ? "Montaj" : "Монтаж",
      body: uz
        ? "Oʻz brigadalarimiz, polga ankerlash, xodimlarni ruxsat etilgan yuk boʻyicha oʻqitish."
        : "Свои бригады, анкеровка к полу, инструктаж персонала по допустимым нагрузкам.",
    },
    {
      title: uz ? "Kafolat" : "Гарантия",
      body: uz
        ? `${COMPANY.warrantyMonths} oy. Sertifikatlar: ${COMPANY.certificates.join(", ")}.`
        : `${COMPANY.warrantyMonths} месяцев. Сертификаты: ${COMPANY.certificates.join(", ")}.`,
    },
  ];
}
