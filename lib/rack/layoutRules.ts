// Раздел 3 паспорта типа: как стеллаж ставится в помещении.
//
// Зачем файл появился. До него ядро знало один способ расстановки — ряды под
// технику, как у паллетного фронтального, — и молча применяло его ко всем
// шести типам. Архивный стеллаж получал проход 2,9 м под ричтрак, а мезонин
// раскладывался рядами, хотя это плита второго уровня. Цифры выходили
// правдоподобные и неверные.
//
// Теперь у каждого типа свои правила, и из них читают все: движок раскладки
// (design), промпт для модели, спецификация и приёмка.
//
// Про черновые числа. Часть правил взята из фактических КП и тем группы —
// они помечены source: "факт". Часть придумана, чтобы генератор заработал
// на всех типах уже сейчас (решение Умида 22.09: «что не хватает — придумай,
// потом клиент сам изменит»). Такие помечены source: "черновик" и перечислены
// в assumed. Приёмка обязана предупредить менеджера, если в КП уехало хоть
// одно черновое число, а кабинет — дать RaxPro их переписать.
//
// Все размеры в миллиметрах.

/** Техника и её проход. Живёт здесь, а не в layout.ts: правила раскладки —
 *  нижний слой, движок раскладки читает их, а не наоборот. layout.ts
 *  перевыставляет TRUCKS наружу, поэтому прежние импорты не менялись. */
export const TRUCKS = {
  reachtruck: { aisle: 2900, ru: "Ричтрак", uz: "Richtrak" },
  stacker: { aisle: 2500, ru: "Штабелёр", uz: "Shtabelyor" },
  counterbal: { aisle: 3800, ru: "Вилочный погрузчик", uz: "Vilkali yuklagich" },
} as const;
export type TruckKey = keyof typeof TRUCKS;

/** Каким движком раскладывается тип. Не косметика: у каждого своя геометрия. */
export type LayoutEngine =
  /** Ряды секций с проходом. Паллетный фронтальный, среднегрузовой, архивный, торговый. */
  | "rows"
  /** Блок каналов, техника въезжает внутрь. Набивной. */
  | "channels"
  /** Плита второго уровня на колоннах. Мезонин. */
  | "deck";

/** Кто обслуживает стеллаж — от этого ширина прохода. */
export type Mover = TruckKey | "person" | "shopper";

export interface MoverSpec {
  aisle: number;
  ru: string;
  uz: string;
  source: "факт" | "черновик";
}

/** Ширины проходов. Техника — из TRUCKS, там числа из фактических расчётов.
 *  Человек и покупатель в TRUCKS не лезут и не должны: это не техника. */
export const MOVERS: Record<Mover, MoverSpec> = {
  reachtruck: { aisle: TRUCKS.reachtruck.aisle, ru: TRUCKS.reachtruck.ru, uz: TRUCKS.reachtruck.uz, source: "факт" },
  stacker: { aisle: TRUCKS.stacker.aisle, ru: TRUCKS.stacker.ru, uz: TRUCKS.stacker.uz, source: "факт" },
  counterbal: { aisle: TRUCKS.counterbal.aisle, ru: TRUCKS.counterbal.ru, uz: TRUCKS.counterbal.uz, source: "факт" },
  // Черновик: человек с тележкой разворачивается в 1000 мм, вдвоём не
  // расходится. Архивный проход уже — там ходят без тележки.
  person: { aisle: 1000, ru: "Человек с тележкой", uz: "Aravachali odam", source: "черновик" },
  // 1200 мм — из темы «Торговый стеллаж» в группе: «проход 120 см».
  shopper: { aisle: 1200, ru: "Покупатель с корзиной", uz: "Savatli xaridor", source: "факт" },
};

export interface LayoutRule {
  engine: LayoutEngine;
  /** Кто обслуживает. Первый — по умолчанию; остальные менеджер может выбрать. */
  movers: Mover[];
  /** Ряды ставятся спиной к спине (двойной ряд между проходами). */
  backToBack: boolean;
  /** Зазор до стены. У прохода вдоль стены бывает свой. */
  wallGap: number;
  /** Допустимые глубины ряда — дублировать catalog.depthMm здесь не нужно,
   *  но у канальных и плиточных типов глубина означает другое, поэтому
   *  смысл величины фиксируется тут. */
  depthMeans: "ряд" | "канал" | "плита";

  /* ——— только channels (набивной) */
  /** Глубина канала кратна этому: паллета 1200 + зазор. */
  channelStep?: number;
  /** Шаг стоек внутри канала по глубине. */
  innerFrameStep?: number;
  /** Сколько паллет в глубину помещается в канал каждой из паспортных глубин. */
  channelDepths?: Array<{ mm: number; pallets: number }>;

  /* ——— только deck (мезонин) */
  /** Сетка колонн плиты: шаг по балке × шаг между главными балками. */
  columnGrid?: [number, number];
  /** Чистая высота под плитой и над ней. */
  clearHeight?: number;
  /** Толщина конструкции плиты: балки + настил. */
  deckThickness?: number;
  /** Одна лестница на столько м² плиты. */
  stairPerM2?: number;

  /** Что для этого типа запрещено. Человеческим языком — уходит в приёмку
   *  и в промпт модели дословно. */
  forbid: string[];
  /** Какие поля правила придуманы, а не взяты из фактов RaxPro. */
  assumed: string[];
  notes: string;
}

export const LAYOUT_RULES: Record<string, LayoutRule> = {
  "pallet-frontal": {
    engine: "rows",
    movers: ["reachtruck", "stacker", "counterbal"],
    backToBack: true,
    wallGap: 300,
    depthMeans: "ряд",
    forbid: [
      "Ряд без прохода с лицевой стороны — паллету туда не поставить.",
      "Рама выше 6000 мм: таких завод не поставлял.",
    ],
    assumed: [],
    notes: "База линейки. Правила сверены на семи фактических КП.",
  },

  "pallet-driveIn": {
    engine: "channels",
    movers: ["reachtruck", "stacker"],
    backToBack: false,
    wallGap: 300,
    depthMeans: "канал",
    // Паспортные глубины 2700 / 4000 / 5400 читаются как 2, 3 и 4 паллеты
    // в глубину с зазорами — отсюда шаг канала.
    channelStep: 1200,
    innerFrameStep: 1200,
    channelDepths: [
      { mm: 2700, pallets: 2 },
      { mm: 4000, pallets: 3 },
      { mm: 5400, pallets: 4 },
    ],
    forbid: [
      "Проход между соседними каналами: их и не должно быть — в этом смысл набивного.",
      "Разный товар в одном канале: выгрузка идёт в обратном порядке (FILO).",
      "Канал глубже четырёх паллет: техника не достаёт дальний ряд.",
    ],
    assumed: ["распределение каналов по блоку", "магистральный проход перед блоком"],
    notes:
      "Стойка каждые 1200 мм по глубине — по ширине паллеты (тема 10, msg 118, 208). " +
      "Техника въезжает внутрь канала, паллеты лежат на направляющих.",
  },

  "medium-duty": {
    engine: "rows",
    movers: ["person"],
    backToBack: true,
    wallGap: 300,
    depthMeans: "ряд",
    forbid: ["Проход под технику: на среднегрузовой паллету не ставят, его обслуживает человек."],
    assumed: ["ширина прохода 1000 мм"],
    notes: "Ручная укладка, настил 5 листов на ярус секции.",
  },

  archive: {
    engine: "rows",
    movers: ["person"],
    backToBack: true,
    // Черновик: в архиве ходят без тележки, поэтому проход уже общего.
    wallGap: 200,
    depthMeans: "ряд",
    forbid: ["Ярус выше вытянутой руки без стремянки — верхний ряд коробов должен доставаться."],
    assumed: ["ширина прохода 800 мм", "зазор до стены 200 мм"],
    notes: "Продаётся комплектом, а не позициями. Глубина 300–400 мм под короб.",
  },

  retail: {
    engine: "rows",
    movers: ["shopper"],
    backToBack: true,
    wallGap: 300,
    depthMeans: "ряд",
    forbid: [
      "Островной ряд длиной во весь зал без разрыва: покупателю негде срезать.",
      "Проход у кассовой линии уже 1500 мм.",
    ],
    assumed: ["длина островного ряда", "ширина прохода у кассы 1500 мм"],
    notes:
      "Пристенный контур плюс островные двусторонние ряды, проход 120 см, " +
      "кассовая и овощная зоны (тема 6).",
  },

  mezzanine: {
    engine: "deck",
    movers: ["person"],
    backToBack: false,
    wallGap: 300,
    depthMeans: "плита",
    // Всё ниже — черновик: ни одного КП и ни одного чертежа мезонина в группе нет.
    columnGrid: [2700, 4500],
    clearHeight: 2400,
    deckThickness: 300,
    stairPerM2: 300,
    forbid: [
      "Плита без расчёта нагрузки на пол: мезонин передаёт вес точечно, через пятки колонн.",
      "Одна лестница на плиту больше 300 м²: нужен второй путь эвакуации.",
      "Плита вплотную к спринклерам: под перекрытием остаётся рабочий зазор.",
    ],
    assumed: [
      "сетка колонн 2700 × 4500",
      "чистая высота 2400 мм",
      "толщина конструкции плиты 300 мм",
      "одна лестница на 300 м²",
    ],
    notes:
      "Каждый мезонин проектируется индивидуально (тема 14, msg 100, 105). " +
      "Ни 3D, ни эталонного КП нет — числа черновые до первого чертежа от RaxPro.",
  },
};

export function ruleFor(productKey: string): LayoutRule {
  const r = LAYOUT_RULES[productKey];
  if (!r) throw new Error(`Нет правил раскладки для типа: ${productKey}`);
  return r;
}

/** Ширина прохода для типа и выбранного обслуживающего. */
export function aisleFor(productKey: string, mover?: Mover): number {
  const rule = ruleFor(productKey);
  const m = mover && rule.movers.includes(mover) ? mover : rule.movers[0];
  // Архивный уже общего человеческого прохода: у него свой, из assumed.
  if (productKey === "archive" && m === "person") return 800;
  return MOVERS[m].aisle;
}

/** Все черновые допущения, которые попали в расчёт этого типа.
 *  Приёмка выводит их списком: менеджер должен знать, что подтверждает. */
export function assumptionsFor(productKey: string, mover?: Mover): string[] {
  const rule = ruleFor(productKey);
  const out = [...rule.assumed];
  const m = mover && rule.movers.includes(mover) ? mover : rule.movers[0];
  if (MOVERS[m].source === "черновик" && !out.some((a) => a.includes("прохода")))
    out.push(`ширина прохода ${MOVERS[m].aisle} мм для «${MOVERS[m].ru.toLowerCase()}»`);
  return out;
}

/** Движок раскладки ещё не написан — честный отказ вместо неверных чисел. */
export function engineReady(engine: LayoutEngine): boolean {
  return engine === "rows" || engine === "channels" || engine === "deck";
}
