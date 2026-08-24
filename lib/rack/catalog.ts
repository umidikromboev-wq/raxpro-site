// Продуктовая линейка RaxPro. Источник — тематическая выгрузка из группы
// «Raxpro & Prototype AI» (6 тем = 6 продуктов, 22–24.08.2026) плюс семь
// фактических КП. Цены и типоразмеры — те, что дал Муродбек текстом;
// где цены нет, продукт помечен priceMode: "project" и генератор
// не выпустит КП без ручной цены.

export type PriceMode = "list" | "range" | "project";

/** Как считается сумма.
 *  components  — по позициям спецификации (паллетный: в КП есть цены за единицу).
 *  sectionList — по прайсу за секцию (среднегрузовой, архивный: в их КП колонка
 *                «Цена» пустая, стоит только ИТОГО — компания продаёт секциями).
 *
 *  Модель sectionList выведена из прайса и проверена на нём же:
 *      цена секции = 2 × рама(высота) + ярусы × ярус(длина балки)
 *  Четвёртая строка прайса в вывод не участвовала и сошлась в ноль.
 *  Ряд из N секций делит рамы между соседями, поэтому
 *      сумма = N × цена секции − (N − ряды) × цена рамы
 *  На КП BLOOMSHOP это даёт 219 847 158 против 219 847 178 в документе. */
export type PricingModel = "components" | "sectionList";

export interface SizeVariant {
  code: string;
  h: number;      // высота рамы, мм
  w: number;      // длина балки / ширина секции, мм
  d: number;      // глубина, мм
  levels: number; // ярусов (полок) в секции
  price?: number; // сум за отдельно стоящую секцию в сборе, без НДС
}

export interface Product {
  key: string;
  topicId: number;                  // тема в группе — чтобы возвращаться к первоисточнику
  ru: { name: string; short: string };
  uz: { name: string; short: string };
  priceMode: PriceMode;
  pricingModel: PricingModel;
  /** Цена рамы по высоте, сум. Нужна модели sectionList. */
  framePrices?: Record<number, number>;
  priceRange?: [number, number];
  loadPerLevelKg: [number, number];  // вилка нагрузки на ярус
  bayStepMm: number[];               // применяемые шаги секции
  depthMm: number[];
  sizes: SizeVariant[];
  /** Из каких позиций собирается спецификация. Порядок = порядок строк в КП. */
  bom: BomItem[];
  hasModel3d: boolean;
  hasReferenceKp: boolean;
  notesRu: string;
}

export type BomItem =
  | "frame"       // рама в сборе
  | "beam"        // балка
  | "lock"        // замок
  | "anchor"      // анкер
  | "deck"        // настил
  | "panel"       // панель
  | "guard";      // защитник (отбойник стойки)

export const PRODUCTS: Product[] = [
  {
    key: "pallet-frontal",
    topicId: 8,
    ru: { name: "Паллетный стеллаж (фронтальный)", short: "Паллетный фронтальный" },
    uz: { name: "Frontal paletli stellaj", short: "Frontal paletli" },
    priceMode: "range",
    pricingModel: "components",
    priceRange: [7_000_000, 28_000_000],
    loadPerLevelKg: [2000, 3000],
    bayStepMm: [2500, 2700, 3300],
    depthMm: [1050, 1100],
    sizes: [
      { code: "PF-3000-2700-1050-2", h: 3000, w: 2700, d: 1050, levels: 2 },
      { code: "PF-4000-2700-1050-3", h: 4000, w: 2700, d: 1050, levels: 3, price: 7_032_128 },
      { code: "PF-4600-2700-1050-3", h: 4600, w: 2700, d: 1050, levels: 3 },
      { code: "PF-5000-2700-1050-3", h: 5000, w: 2700, d: 1050, levels: 3 },
      { code: "PF-6000-2700-1050-4", h: 6000, w: 2700, d: 1050, levels: 4 },
    ],
    bom: ["frame", "beam", "lock", "anchor", "guard"],
    hasModel3d: true,
    hasReferenceKp: true,
    notesRu:
      "Прямой доступ погрузчиком к каждой паллете. Секция 2700 мм = 3 европаллеты 1200×800. " +
      "Высоты рам из фактических КП: 3000, 4000, 5000, 6000 мм.",
  },
  {
    key: "pallet-driveIn",
    topicId: 10,
    ru: { name: "Паллетный стеллаж (набивной, drive-in)", short: "Набивной" },
    uz: { name: "Kirib chiqiladigan paletli stellaj (drive-in)", short: "Drive-in" },
    priceMode: "project",
    pricingModel: "components",
    loadPerLevelKg: [1000, 1500],
    bayStepMm: [1200],
    depthMm: [2700, 4000, 5400],
    sizes: [{ code: "PD-4000-1200", h: 4000, w: 1200, d: 2700, levels: 3 }],
    bom: ["frame", "beam", "lock", "anchor", "guard"],
    hasModel3d: false,
    hasReferenceKp: false,
    notesRu:
      "Каждый набивной стеллаж проектируется и считается индивидуально (msg 118, 208). " +
      "Колонна каждые 120 см — по ширине паллеты, глубина канала кратна 2700 мм.",
  },
  {
    key: "medium-duty",
    topicId: 2,
    ru: { name: "Среднегрузовой стеллаж", short: "Среднегрузовой" },
    uz: { name: "Oʻrta yuklama stellaj", short: "Oʻrta yuklama" },
    priceMode: "list",
    pricingModel: "sectionList",
    framePrices: { 2000: 1_260_832, 2500: 1_536_100 },
    loadPerLevelKg: [300, 400],
    bayStepMm: [1500, 1700, 2000],
    depthMm: [600],
    sizes: [
      { code: "MD-2000-1500-600-4", h: 2000, w: 1500, d: 600, levels: 4, price: 3_691_650 },
      { code: "MD-2000-2000-600-4", h: 2000, w: 2000, d: 600, levels: 4, price: 4_344_966 },
      { code: "MD-2500-1500-600-5", h: 2500, w: 1500, d: 600, levels: 5, price: 4_534_682 },
      { code: "MD-2500-2000-600-5", h: 2500, w: 2000, d: 600, levels: 5, price: 5_351_327 },
    ],
    bom: ["frame", "beam", "deck", "anchor"],
    hasModel3d: true,
    hasReferenceKp: true,
    notesRu:
      "Прайс от 22.08.2026 (msg 78). 3D-файл покрывает 2×2, 2×2.5, 1.5×2, 1.5×2.5 м. " +
      "Настил: 5 листов на ярус секции — проверено на КП BLOOMSHOP и Star Distribution.",
  },
  {
    key: "archive",
    topicId: 12,
    ru: { name: "Архивный стеллаж", short: "Архивный" },
    uz: { name: "Arxiv stellaj", short: "Arxiv" },
    priceMode: "list",
    pricingModel: "sectionList",
    framePrices: { 2000: 300_000 },
    loadPerLevelKg: [80, 100],
    bayStepMm: [1000],
    depthMm: [300, 400],
    sizes: [
      { code: "AR-2000-1000-400-3", h: 2000, w: 1000, d: 400, levels: 3, price: 1_000_000 },
      { code: "AR-2000-1000-400-4", h: 2000, w: 1000, d: 400, levels: 4, price: 1_200_000 },
      { code: "AR-2000-1000-400-5", h: 2000, w: 1000, d: 400, levels: 5, price: 1_400_000 },
      { code: "AR-2000-1000-400-6", h: 2000, w: 1000, d: 400, levels: 6, price: 1_600_000 },
    ],
    bom: ["frame", "beam", "deck"],
    hasModel3d: true,
    hasReferenceKp: true,
    notesRu:
      "Прайс от 22.08.2026 (msg 91), цена за комплект. КП Rapid Sales: 30 комплектов = 42 000 000 сум.",
  },
  {
    key: "retail",
    topicId: 6,
    ru: { name: "Торговый стеллаж", short: "Торговый" },
    uz: { name: "Savdo stellaji", short: "Savdo stellaji" },
    priceMode: "project",
    pricingModel: "components",
    loadPerLevelKg: [100, 150],
    bayStepMm: [900, 1200],
    depthMm: [400, 500, 600],
    sizes: [
      { code: "RT-2000-900-500-5", h: 2000, w: 900, d: 500, levels: 5 },
      { code: "RT-2200-1200-600-6", h: 2200, w: 1200, d: 600, levels: 6 },
    ],
    bom: ["frame", "beam", "deck"],
    hasModel3d: true,
    hasReferenceKp: false,
    notesRu:
      "Цены в группе не дали — генератор потребует ввести вручную. Планировки: " +
      "пристенный ряд + островные двусторонние, проход 120 см, кассовая и овощная зоны.",
  },
  {
    key: "mezzanine",
    topicId: 14,
    ru: { name: "Мезонин", short: "Мезонин" },
    uz: { name: "Mezanin", short: "Mezanin" },
    priceMode: "project",
    pricingModel: "components",
    loadPerLevelKg: [300, 500],
    bayStepMm: [2700],
    depthMm: [1050],
    sizes: [],
    bom: ["frame", "beam", "deck", "anchor", "guard"],
    hasModel3d: false,
    hasReferenceKp: false,
    notesRu: "Каждый мезонин проектируется индивидуально (msg 100, 105). Ни 3D, ни КП в группе нет.",
  },
];

export function getProduct(key: string): Product {
  const p = PRODUCTS.find((x) => x.key === key);
  if (!p) throw new Error(`Неизвестный продукт: ${key}`);
  return p;
}

export const BOM_LABELS: Record<BomItem, { ru: string; uz: string; unit: { ru: string; uz: string } }> = {
  frame: { ru: "Рама стеллажа в сборе", uz: "Stellaj ramasi (yigʻilgan)", unit: { ru: "шт", uz: "dona" } },
  beam:  { ru: "Балка", uz: "Balka", unit: { ru: "шт", uz: "dona" } },
  lock:  { ru: "Замок балки", uz: "Balka qulfi", unit: { ru: "шт", uz: "dona" } },
  anchor:{ ru: "Анкер 120×12 мм", uz: "Anker 120×12 mm", unit: { ru: "шт", uz: "dona" } },
  deck:  { ru: "Настил", uz: "Nastil", unit: { ru: "шт", uz: "dona" } },
  panel: { ru: "Панель", uz: "Panel", unit: { ru: "шт", uz: "dona" } },
  guard: { ru: "Защита стойки", uz: "Ustun himoyachisi", unit: { ru: "шт", uz: "dona" } },
};
