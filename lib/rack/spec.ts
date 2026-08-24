// Спецификация комплекта: из геометрии склада — в строки таблицы КП.
//
// Формулы восстановлены из семи фактических КП и сходятся на всех, где есть
// и раскладка, и таблица (см. spec.test.ts). Считать «на глаз», как считали
// раньше, больше не нужно: у Lion Print так появилась балка 33 000 мм
// в документе на 843 млн сум.

import { BomItem, BOM_LABELS, Product } from "./catalog";
import type { Lang } from "./company";

export interface Geometry {
  /** Число отдельных линий стеллажа (ряд = непрерывная линия секций). */
  rows: number;
  /** Суммарное число секций во всех рядах. */
  sections: number;
  /** Ярусов балок в секции. Нижний уровень — пол, балками не считается. */
  levels: number;
  /** Анкеров на раму: 4 = 2 на пятку, 8 = 4 на пятку. У RaxPro встречались обе. */
  anchorsPerFrame: 4 | 8;
  /** Настилов на один ярус секции. Для среднегрузового — 5. */
  decksPerLevel: number;
  /** Паллето-мест на ярус секции (для паллетных: 2700 мм = 3 шт). */
  palletsPerLevel: number;
  /** Считать ли нижний уровень (пол) как место хранения. */
  countGroundLevel: boolean;
}

export interface SpecLine {
  item: BomItem;
  labelRu: string;
  labelUz: string;
  unitRu: string;
  unitUz: string;
  qty: number;
  /** Как получено число — попадает в служебную выкладку, не в КП клиента. */
  formula: string;
}

export function frames(g: Geometry) { return g.sections + g.rows; }
export function beams(g: Geometry) { return g.sections * g.levels * 2; }
export function locks(g: Geometry) { return beams(g) * 2; }
export function anchors(g: Geometry) { return frames(g) * g.anchorsPerFrame; }
export function decks(g: Geometry) { return g.sections * g.levels * g.decksPerLevel; }
export function guards(g: Geometry) { return frames(g); }

/** Паллето-мест — величина, которой не было ни в одном КП RaxPro,
 *  хотя только она сравнима между поставщиками. */
export function palletPositions(g: Geometry): number {
  const tiers = g.levels + (g.countGroundLevel ? 1 : 0);
  return g.sections * tiers * g.palletsPerLevel;
}

export function buildSpec(product: Product, g: Geometry): SpecLine[] {
  const calc: Record<BomItem, () => { qty: number; formula: string }> = {
    frame:  () => ({ qty: frames(g),  formula: `секции ${g.sections} + ряды ${g.rows}` }),
    beam:   () => ({ qty: beams(g),   formula: `секции ${g.sections} × ярусы ${g.levels} × 2` }),
    lock:   () => ({ qty: locks(g),   formula: `балки ${beams(g)} × 2` }),
    anchor: () => ({ qty: anchors(g), formula: `рамы ${frames(g)} × ${g.anchorsPerFrame}` }),
    deck:   () => ({ qty: decks(g),   formula: `секции ${g.sections} × ярусы ${g.levels} × ${g.decksPerLevel}` }),
    panel:  () => ({ qty: decks(g),   formula: `секции ${g.sections} × ярусы ${g.levels} × ${g.decksPerLevel}` }),
    guard:  () => ({ qty: guards(g),  formula: `по одной на раму: ${frames(g)}` }),
  };

  return product.bom.map((item) => {
    const { qty, formula } = calc[item]();
    const l = BOM_LABELS[item];
    return {
      item,
      labelRu: l.ru, labelUz: l.uz,
      unitRu: l.unit.ru, unitUz: l.unit.uz,
      qty, formula,
    };
  });
}

export function specLabel(line: SpecLine, lang: Lang) {
  return lang === "uz" ? line.labelUz : line.labelRu;
}
export function specUnit(line: SpecLine, lang: Lang) {
  return lang === "uz" ? line.unitUz : line.unitRu;
}

/** Обратный ход: из готовой таблицы КП восстановить геометрию.
 *  Нужен, чтобы прогонять старые КП через генератор и сверять. */
export function geometryFromCounts(o: {
  frames: number; beams: number; levels: number; anchors?: number;
}): Pick<Geometry, "rows" | "sections" | "levels" | "anchorsPerFrame"> {
  const sections = o.beams / (o.levels * 2);
  const rows = o.frames - sections;
  const anchorsPerFrame = o.anchors && o.anchors / o.frames === 8 ? 8 : 4;
  return { rows, sections, levels: o.levels, anchorsPerFrame };
}
