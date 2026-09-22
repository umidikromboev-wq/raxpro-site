// Спецификация набивного стеллажа.
//
// Формулы рядного типа здесь не работают. У фронтального паллета лежит на
// поперечной балке, поэтому балок = секции × ярусы × 2. У набивного паллета
// лежит на двух направляющих, идущих вдоль канала, а балка остаётся только
// верхней связью между стойками. Считать набивной формулами фронтального —
// это ошибка в сторону занижения: в спецификации не хватит половины металла.
//
// Черновик. Эталонного КП на набивной в группе нет (тема 10). Сверить формулы
// не с чем, поэтому каждая строка ниже помечена в assumptions(), и приёмка
// обязана показать этот список менеджеру перед выпуском.

import { BOM_LABELS, type Product } from "./catalog";
import type { ChannelLayout } from "./layoutChannels";
import type { SpecLine } from "./spec";

export interface ChannelGeometry {
  /** Каналов всего. */
  channels: number;
  /** Паллет в глубину одного канала. */
  deep: number;
  /** Ярусов направляющих. Пол — не ярус, на него ставят прямо. */
  levels: number;
  /** Стоек по глубине канала с одной стороны: пролётов + 1. */
  framesPerSide: number;
  anchorsPerFrame: 4 | 8;
}

export function channelGeometry(layout: ChannelLayout, anchorsPerFrame: 4 | 8 = 4): ChannelGeometry {
  return {
    channels: layout.channels.length,
    deep: layout.deep,
    levels: layout.levels,
    framesPerSide: layout.framesPerChannel,
    anchorsPerFrame,
  };
}

/** Рамы: стойки стоят по обе стороны канала, соседние каналы делят стойку. */
export function channelFrames(g: ChannelGeometry) {
  return (g.channels + 1) * g.framesPerSide;
}
/** Направляющие: по две на канал на каждый ярус — паллета лежит краями. */
export function channelRails(g: ChannelGeometry) {
  return g.channels * g.levels * 2;
}
/** Верхняя связь между стойками: по одной на пролёт канала. */
export function channelBeams(g: ChannelGeometry) {
  return g.channels * (g.framesPerSide - 1);
}
export function channelLocks(g: ChannelGeometry) {
  return (channelRails(g) + channelBeams(g)) * 2;
}
export function channelAnchors(g: ChannelGeometry) {
  return channelFrames(g) * g.anchorsPerFrame;
}
/** Защита ставится на въезде: по стойке с каждой стороны устья канала. */
export function channelGuards(g: ChannelGeometry) {
  return (g.channels + 1) * 2;
}
/** Паллетомест: глубина × ярусы, плюс пол. */
export function channelPositions(g: ChannelGeometry) {
  return g.channels * g.deep * (g.levels + 1);
}

export function buildChannelSpec(product: Product, g: ChannelGeometry): SpecLine[] {
  const calc: Partial<Record<string, () => { qty: number; formula: string }>> = {
    frame: () => ({
      qty: channelFrames(g),
      formula: `(каналы ${g.channels} + 1) × стойки по глубине ${g.framesPerSide}`,
    }),
    rail: () => ({
      qty: channelRails(g),
      formula: `каналы ${g.channels} × ярусы ${g.levels} × 2`,
    }),
    beam: () => ({
      qty: channelBeams(g),
      formula: `каналы ${g.channels} × пролёты ${g.framesPerSide - 1} (верхняя связь)`,
    }),
    lock: () => ({
      qty: channelLocks(g),
      formula: `(направляющие ${channelRails(g)} + балки ${channelBeams(g)}) × 2`,
    }),
    anchor: () => ({
      qty: channelAnchors(g),
      formula: `рамы ${channelFrames(g)} × ${g.anchorsPerFrame}`,
    }),
    guard: () => ({
      qty: channelGuards(g),
      formula: `устье канала: (каналы ${g.channels} + 1) × 2`,
    }),
  };

  return product.bom.map((item) => {
    const f = calc[item];
    if (!f) throw new Error(`Позиция «${item}» не считается канальной спецификацией.`);
    const { qty, formula } = f();
    const l = BOM_LABELS[item];
    return { item, labelRu: l.ru, labelUz: l.uz, unitRu: l.unit.ru, unitUz: l.unit.uz, qty, formula };
  });
}

/** Что в этой спецификации придумано. Уходит в приёмку дословно. */
export function channelAssumptions(): string[] {
  return [
    "рамы: соседние каналы делят стойку — (каналы + 1) × стойки по глубине",
    "направляющие: по две на канал на каждый ярус",
    "балка считается только верхней связью, по одной на пролёт",
    "защита ставится на устье каждого канала с двух сторон",
  ];
}
