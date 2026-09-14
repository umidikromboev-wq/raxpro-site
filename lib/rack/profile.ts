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

/** Снимки сданных объектов. Порядок внутри продукта — от самого сильного
 *  кадра: первый идёт на обложку, остальные — в галерею листа «наши объекты».
 *  Источник — рабочий архив RaxPro в Telegram; в переписке отдельно
 *  подтверждено, что это «asl rasmi» — реальные объекты, а не рендеры. */
export const CASES: CaseShot[] = [
  { file: P + "hero-01.jpg", w: 1280, h: 960, product: "pallet-frontal",
    ru: "Паллетные стеллажи, распределительный склад, четыре ряда в пролёт",
    uz: "Palet stellajlari, taqsimlash ombori, bir oraliqda toʻrt qator" },
  { file: P + "pallet-01.jpg", w: 960, h: 1280, product: "pallet-frontal",
    ru: "Паллетные стеллажи с загрузкой, холодный склад дистрибуции",
    uz: "Yuklangan palet stellajlari, sovuq distributsiya ombori" },
  { file: P + "pallet-02.jpg", w: 960, h: 1280, product: "pallet-frontal",
    ru: "Паллетные стеллажи под готовую продукцию, производственный склад",
    uz: "Tayyor mahsulot uchun palet stellajlari, ishlab chiqarish ombori" },
  { file: P + "pallet-03.jpg", w: 1280, h: 960, product: "pallet-frontal",
    ru: "Пять ярусов под потолок цеха, монтаж закончен",
    uz: "Sex shipigacha besh yarus, montaj yakunlangan" },
  { file: P + "pallet-04.jpg", w: 960, h: 1280, product: "pallet-frontal",
    ru: "Паллетные стеллажи в обход колонн склада",
    uz: "Ombor ustunlarini aylanib oʻtgan palet stellajlari" },
  { file: P + "pallet-05.jpg", w: 1200, h: 896, product: "pallet-frontal",
    ru: "Паллетные стеллажи с сетчатым ограждением проходов",
    uz: "Oʻtish yoʻllari toʻrli toʻsiq bilan yopilgan palet stellajlari" },
  { file: P + "driveIn-01.jpg", w: 853, h: 1280, product: "pallet-driveIn",
    ru: "Набивные стеллажи drive-in, высотное хранение",
    uz: "Drive-in zich joylashuvli stellajlar, balandlikda saqlash" },
  { file: P + "driveIn-02.jpg", w: 853, h: 1280, product: "pallet-driveIn",
    ru: "Проезд погрузчика внутри набивного блока, отбойники по низу рам",
    uz: "Zich blok ichida pogruzchik yoʻli, ramalar pastida himoya toʻsiqlari" },
  { file: P + "driveIn-03.jpg", w: 1280, h: 853, product: "pallet-driveIn",
    ru: "Набивной блок на всю высоту склада",
    uz: "Ombor balandligi boʻyicha zich blok" },
  { file: P + "driveIn-04.jpg", w: 853, h: 1280, product: "pallet-driveIn",
    ru: "Направляющие и опорные консоли набивного стеллажа",
    uz: "Zich stellajning yoʻnaltiruvchi va tayanch konsollari" },
  { file: P + "medium-01.jpg", w: 960, h: 1280, product: "medium-duty",
    ru: "Среднегрузовые стеллажи в холодильной камере",
    uz: "Sovutkich kamerasida oʻrta yuklamali stellajlar" },
  { file: P + "medium-02.jpg", w: 1280, h: 960, product: "medium-duty",
    ru: "Среднегрузовые стеллажи в торговом складе, сборка на месте",
    uz: "Savdo omborida oʻrta yuklamali stellajlar, joyida yigʻilgan" },
  { file: P + "medium-03.jpg", w: 960, h: 1280, product: "medium-duty",
    ru: "Два ряда среднегрузовых стеллажей вдоль камеры хранения",
    uz: "Saqlash kamerasi boʻylab ikki qator oʻrta yuklamali stellaj" },
  { file: P + "medium-04.jpg", w: 1280, h: 543, product: "medium-duty",
    ru: "Среднегрузовые стеллажи в помещении с готовой отделкой",
    uz: "Pardozlangan xonada oʻrta yuklamali stellajlar" },
  { file: P + "retail-01.jpg", w: 1020, h: 764, product: "retail",
    ru: "Торговый зал перед открытием: пристенные и островные ряды",
    uz: "Ochilish oldidan savdo zali: devoriy va orolcha qatorlar" },
  { file: P + "retail-02.jpg", w: 960, h: 1280, product: "retail",
    ru: "Торговые стеллажи с выкладкой бытовой химии",
    uz: "Maishiy kimyo terilgan savdo stellajlari" },
  { file: P + "retail-03.jpg", w: 960, h: 1280, product: "retail",
    ru: "Монтаж торгового оборудования в магазине у дома",
    uz: "Uy yonidagi doʻkonda savdo jihozlari montaji" },
  { file: P + "archive-01.jpg", w: 1280, h: 960, product: "archive",
    ru: "Архивные стеллажи по периметру помещения",
    uz: "Xona perimetri boʻylab arxiv stellajlari" },
  { file: P + "archive-02.jpg", w: 960, h: 1280, product: "archive",
    ru: "Архивные стеллажи с коробами, шесть полок в секции",
    uz: "Quti bilan arxiv stellajlari, seksiyada olti polka" },
  { file: P + "archive-03.jpg", w: 1280, h: 1280, product: "archive",
    ru: "Архивные стеллажи в офисе, сборка без сварки",
    uz: "Ofisda arxiv stellajlari, payvandsiz yigʻilgan" },
  { file: P + "mezzanine-01.jpg", w: 1018, h: 664, product: "mezzanine",
    ru: "Мезонин с лестницей и ограждением второго уровня",
    uz: "Zinapoya va ikkinchi daraja toʻsigʻi bilan mezonin" },
  { file: P + "mezzanine-02.jpg", w: 1280, h: 672, product: "mezzanine",
    ru: "Мезонинная система на всю длину склада",
    uz: "Ombor uzunligi boʻyicha mezonin tizimi" },
];

/** Кадр под конкретный продукт — обложка КП должна показывать то,
 *  что клиент покупает, а не абстрактный склад. */
export function coverFor(productKey: string): CaseShot {
  return CASES.find((c) => c.product === productKey) ?? CASES[0];
}

/** Кадры на страницу работ. Первый снимок продукта уже стоит на обложке —
 *  здесь он пропускается, иначе клиент дважды видит одну и ту же картинку. */
export function galleryFor(productKey: string, count = 4): CaseShot[] {
  const own = CASES.filter((c) => c.product === productKey).slice(1);
  const rest = CASES.filter((c) => c.product !== productKey);
  return [...own, ...rest].slice(0, count);
}

/** Объекты в цифрах.
 *
 *  Взяты из выпущенных спецификаций RaxPro (research/tg-group/**) и сходятся
 *  с формулами ядра: секции = балки / (ярусы × 2), ряды = рамы − секции.
 *  Имён заказчиков и сумм здесь нет намеренно — подтверждения на публикацию
 *  этих данных у нас нет, а геометрия из собственной спецификации проверяема.
 *  Числа продублированы в lib/rack/regression.mjs: если формула поедет,
 *  тест упадёт раньше, чем цифра уйдёт клиенту. */
export interface ProjectRow {
  product: string;
  sections: number;
  tiers: number;
  frames: number;
  beams: number;
  /** Паллето-места для паллетных систем, полки — для среднегрузовых. */
  capacity: number;
  unit: "pallets" | "shelves";
}

export const PROJECTS: ProjectRow[] = [
  { product: "pallet-frontal", sections: 101, tiers: 3, frames: 111, beams: 606, capacity: 1212, unit: "pallets" },
  { product: "medium-duty",    sections: 54,  tiers: 5, frames: 63,  beams: 540, capacity: 270,  unit: "shelves" },
  { product: "pallet-frontal", sections: 31,  tiers: 2, frames: 40,  beams: 124, capacity: 279,  unit: "pallets" },
  { product: "medium-duty",    sections: 10,  tiers: 4, frames: 13,  beams: 80,  capacity: 40,   unit: "shelves" },
  { product: "pallet-frontal", sections: 5,   tiers: 2, frames: 6,   beams: 20,  capacity: 45,   unit: "pallets" },
];

/** Объекты клиента наверху: сначала того же типа, что и в этом КП. */
export function projectsFor(productKey: string, count = 5): ProjectRow[] {
  const own = PROJECTS.filter((r) => r.product === productKey);
  const rest = PROJECTS.filter((r) => r.product !== productKey);
  return [...own, ...rest].slice(0, count);
}

export function projectLabel(row: ProjectRow, lang: Lang) {
  const uz = lang === "uz";
  const names: Record<string, { ru: string; uz: string }> = {
    "pallet-frontal": { ru: "Паллетные, фронтальные", uz: "Palet, frontal" },
    "pallet-driveIn": { ru: "Паллетные, набивные", uz: "Palet, zich" },
    "medium-duty": { ru: "Среднегрузовые", uz: "Oʻrta yuklamali" },
    archive: { ru: "Архивные", uz: "Arxiv" },
    retail: { ru: "Торговые", uz: "Savdo" },
    mezzanine: { ru: "Мезонин", uz: "Mezonin" },
  };
  const n = names[row.product];
  return uz ? n?.uz ?? row.product : n?.ru ?? row.product;
}

export function capacityLabel(row: ProjectRow, lang: Lang) {
  const uz = lang === "uz";
  if (row.unit === "pallets") return uz ? "palet oʻrni" : "паллето-мест";
  return uz ? "polka" : "полок";
}

/** Производственная цепочка. Завод сознательно не назван: RaxPro просили
 *  не показывать его в клиентских документах до эксклюзивного соглашения
 *  (Хуршидбек Касимов, рабочая группа, 29.08.2026). */
export function production(lang: Lang) {
  const uz = lang === "uz";
  return [
    {
      title: uz ? "Metall" : "Металл",
      body: uz
        ? "Sovuq prokat va rux qoplamali poʻlat, sertifikatlangan zavod partnyori."
        : "Холоднокатаная и оцинкованная сталь, сертифицированный завод-партнёр.",
    },
    {
      title: uz ? "Profillash" : "Профилирование",
      body: uz
        ? "RollForm liniyasi: rama va boʻlkalar bir oʻtishda, yarus qadamiga perforatsiya."
        : "Линия RollForm: рамы и балки за один проход, перфорация под шаг яруса.",
    },
    {
      title: uz ? "Qoplama" : "Покрытие",
      body: uz
        ? "Kukunli boʻyoq pechda quritish bilan — ombor namligida ham qirralar ochilmaydi."
        : "Порошковая окраска с запеканием — кромки не вскрываются во влажном складе.",
    },
  ];
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

/** Сертификаты завода — не строкой в подвале, а блоком.
 *  В фактических КП они были опечаткой «ISO g001» во всех семи документах;
 *  здесь у каждого есть предмет, а не только номер. */
export function certificates(lang: Lang) {
  const uz = lang === "uz";
  const subjects: Record<string, { ru: string; uz: string }> = {
    "ISO 9001:2015": { ru: "Система менеджмента качества", uz: "Sifat menejmenti tizimi" },
    "ISO 14001:2015": { ru: "Экологический менеджмент", uz: "Ekologik menejment" },
    "ISO 45001:2018": { ru: "Охрана труда и безопасность", uz: "Mehnat muhofazasi va xavfsizlik" },
  };
  return COMPANY.certificates.map((code) => ({
    code,
    subject: uz ? subjects[code]?.uz ?? "" : subjects[code]?.ru ?? "",
  }));
}

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
        ? "Sertifikatlangan zavod partnyori, RollForm texnologiyasi, sovuq prokat poʻlat, kukunli boʻyoq."
        : "Сертифицированный завод-партнёр, технология RollForm, холоднокатаная сталь, порошковая окраска.",
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
