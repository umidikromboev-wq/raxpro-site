// Один вход в проектирование: тип → раскладка → спецификация.
//
// До него каждый вызывающий сам решал, что делать с типом: конструктор знал
// только паллетный, кабинет — паллетный и прайсовые, а набивной и мезонин не
// считались нигде. Теперь движок выбирается по паспорту типа
// (layoutRules.engine), и снаружи все шесть типов выглядят одинаково.
//
// Что здесь важно не потерять: assumptions. У половины типов часть чисел
// придумана, и этот список — единственное место, где они собираются вместе,
// чтобы приёмка показала их менеджеру, а не спрятала в расчёте.

import { getProduct, type Product } from "./catalog";
import { design, DesignError, type Layout, type Room } from "./layout";
import { assumptionsFor, ruleFor, type LayoutEngine, type Mover } from "./layoutRules";
import { designChannels, type ChannelLayout } from "./layoutChannels";
import { designDeck, type DeckLayout } from "./layoutDeck";
import { buildSpec, type Geometry, type SpecLine } from "./spec";
import { buildChannelSpec, channelAssumptions, channelGeometry, channelPositions } from "./specChannels";
import { buildDeckSpec, deckAssumptions } from "./specDeck";

export interface DesignInput extends Room {
  productKey: string;
  mover?: Mover;
  anchorsPerFrame?: 4 | 8;
  /** Настилов на ярус секции: у среднегрузового 5, у прочих рядных 1. */
  decksPerLevel?: number;
  /** Глубина канала для набивного, мм. */
  channelDepth?: number;
}

export interface DesignResult {
  product: Product;
  engine: LayoutEngine;
  /** Рядная или канальная раскладка. У мезонина её нет — у него плита. */
  layout: Layout | ChannelLayout | null;
  /** Плита мезонина. У остальных null. */
  deck: DeckLayout | null;
  spec: SpecLine[];
  /** Паллетомест. null там, где паллет не бывает: архив, торговый, мезонин. */
  positions: number | null;
  /** Полок — величина непаллетных рядных типов. */
  shelves: number | null;
  /** Черновые числа, попавшие в этот расчёт. Приёмка показывает их списком. */
  assumptions: string[];
  /** Запреты типа — уходят в приёмку и в промпт модели дословно. */
  forbid: string[];
}

export function designFor(input: DesignInput): DesignResult {
  const product = getProduct(input.productKey);
  const rule = ruleFor(input.productKey);
  const base = assumptionsFor(input.productKey, input.mover);

  if (rule.engine === "deck") {
    const deck = designDeck(input);
    return {
      product,
      engine: "deck",
      layout: null,
      deck,
      spec: buildDeckSpec(product, deck.geometry),
      positions: null,
      shelves: null,
      assumptions: [...base, ...deckAssumptions(deck.geometry)],
      forbid: rule.forbid,
    };
  }

  if (rule.engine === "channels") {
    const layout = designChannels(input);
    const g = channelGeometry(layout, input.anchorsPerFrame ?? 4);
    return {
      product,
      engine: "channels",
      layout,
      deck: null,
      spec: buildChannelSpec(product, g),
      positions: channelPositions(g),
      shelves: null,
      assumptions: [...base, ...channelAssumptions()],
      forbid: rule.forbid,
    };
  }

  const layout = design(input);
  const isPallet = product.key.startsWith("pallet");
  const geometry: Geometry = {
    rows: layout.rows,
    sections: layout.sections,
    levels: layout.levels,
    anchorsPerFrame: input.anchorsPerFrame ?? 4,
    decksPerLevel: input.decksPerLevel ?? (product.key === "medium-duty" ? 5 : 1),
    palletsPerLevel: isPallet ? (input.palletsPerBay ?? 3) : 0,
    countGroundLevel: isPallet,
  };
  return {
    product,
    engine: "rows",
    layout,
    deck: null,
    spec: buildSpec(product, geometry),
    positions: isPallet ? layout.positions : null,
    shelves: isPallet ? null : layout.shelves,
    assumptions: base,
    forbid: rule.forbid,
  };
}

/** Нет ни одного чернового числа — расчёт целиком на фактах RaxPro. */
export function isFactual(r: DesignResult): boolean {
  return r.assumptions.length === 0;
}

export { DesignError };
