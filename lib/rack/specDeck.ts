// Спецификация мезонина.
//
// Единственный тип линейки, который продаётся не секциями, а площадью.
// В спецификации нет ни рам, ни ярусов: колонны, две очереди балок, настил
// в квадратных метрах, ограждение в погонных метрах и лестничные марши.
// Поэтому строка настила здесь приходит в м², а не в штуках — единица
// переопределяется на месте, а не берётся из BOM_LABELS.
//
// Весь файл — черновик. Ни одного КП и ни одного чертежа мезонина в группе
// нет (тема 14, msg 100, 105). Формулы выведены из геометрии плиты, а не из
// фактического документа, и обязаны пройти через приёмку как допущения.

import { BOM_LABELS, type Product } from "./catalog";
import type { DeckGeometry } from "./layoutDeck";
import type { SpecLine } from "./spec";

/** Анкеров на пятку колонны мезонина: нагрузка идёт точечно, поэтому
 *  берём восемь, а не четыре, как у рамы стеллажа. Черновик. */
export const DECK_ANCHORS_PER_COLUMN = 8;

export function buildDeckSpec(product: Product, g: DeckGeometry): SpecLine[] {
  const calc: Partial<Record<string, () => { qty: number; formula: string; unit?: [string, string] }>> = {
    column: () => ({
      qty: g.columns,
      formula: `сетка ${g.grid[0]} × ${g.grid[1]} мм на площадь ${g.areaM2} м²`,
    }),
    mainBeam: () => ({
      qty: g.mainBeams,
      formula: "пролёты сетки вдоль главной оси",
    }),
    subBeam: () => ({
      qty: g.subBeams,
      formula: "пролёты сетки поперёк главной оси",
    }),
    deck: () => ({
      qty: g.deckM2,
      formula: `площадь плиты ${g.deckM2} м²`,
      unit: ["м²", "m²"],
    }),
    railing: () => ({
      qty: g.railingM,
      formula: `периметр плиты ${g.railingM} п.м.`,
    }),
    stair: () => ({
      qty: g.stairs,
      formula: `одна на 300 м² плиты: ${g.areaM2} м² → ${g.stairs}`,
    }),
    anchor: () => ({
      qty: g.columns * DECK_ANCHORS_PER_COLUMN,
      formula: `колонны ${g.columns} × ${DECK_ANCHORS_PER_COLUMN}`,
    }),
  };

  return product.bom.map((item) => {
    const f = calc[item];
    if (!f) throw new Error(`Позиция «${item}» не считается спецификацией мезонина.`);
    const { qty, formula, unit } = f();
    const l = BOM_LABELS[item];
    return {
      item,
      labelRu: l.ru,
      labelUz: l.uz,
      unitRu: unit?.[0] ?? l.unit.ru,
      unitUz: unit?.[1] ?? l.unit.uz,
      qty,
      formula,
    };
  });
}

/** Что в этой спецификации придумано. Уходит в приёмку дословно. */
export function deckAssumptions(g: DeckGeometry): string[] {
  return [
    `сетка колонн ${g.grid[0]} × ${g.grid[1]} мм`,
    "главные балки — по пролётам вдоль оси, второстепенные — поперёк",
    "ограждение считается по всему периметру плиты, включая примыкание к стене",
    `${DECK_ANCHORS_PER_COLUMN} анкеров на пятку колонны`,
    `лестниц ${g.stairs}: одна на 300 м² плиты`,
  ];
}
