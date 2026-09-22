// Раскладка набивного стеллажа (drive-in): блок каналов вместо рядов.
//
// Чем он отличается от фронтального. У фронтального между рядами проход, и
// техника берёт любую паллету. У набивного проходов внутри блока нет вовсе:
// техника въезжает в канал и ставит паллеты одну за другой вглубь. Поэтому
// плотность выше в полтора-два раза, а выгрузка идёт в обратном порядке —
// последняя заехала, первая выехала. Один канал = один товар.
//
// Что здесь придумано. Геометрия канала взята из фактов: шаг стойки 1200 мм
// по ширине паллеты и паспортные глубины 2700 / 4000 / 5400 мм читаются как
// 2, 3 и 4 паллеты в глубину (тема 10, msg 118, 208). Придумано распределение
// каналов по помещению и ширина магистрального проезда перед блоком —
// ни одного КП на набивной в группе нет. Эти допущения перечислены в
// LAYOUT_RULES["pallet-driveIn"].assumed и обязаны попасть в приёмку.
//
// Все размеры в миллиметрах.

import {
  CEILING_RESERVE, DesignError, levelsFor, MAX_FRAME_HEIGHT,
  polyArea, rectPolygon, type Bay, type Layout, type Point, type Room,
} from "./layout";
import { aisleFor, ruleFor } from "./layoutRules";

/** Ширина канала берётся из единственного документированного числа набивного:
 *  «колонна каждые 120 см — по ширине паллеты» (тема 10). Выдумывать свой
 *  зазор поверх факта не стали. */
export const CHANNEL_WIDTH_FALLBACK = 1200;
/** Проезд перед блоком — техника должна развернуться и войти в канал.
 *  Берём проход её же класса: уже него она не развернётся. Черновик. */
export const APPROACH_FACTOR = 1;

export interface Channel {
  /** Левый ближний угол канала. */
  x: number;
  y: number;
  /** Ширина канала (по фронту) и глубина (внутрь блока). */
  w: number;
  depth: number;
  /** Паллет в глубину. */
  deep: number;
  /** Номер блока — блоки разделены магистральным проездом. */
  block: number;
}

export interface ChannelLayout extends Layout {
  channels: Channel[];
  /** Паллет в глубину одного канала. */
  deep: number;
  /** Стоек по глубине канала с каждой стороны. */
  framesPerChannel: number;
}

/**
 * Разложить помещение каналами.
 *
 * Блок каналов ставится фронтом к проезду. Каналы идут вплотную друг к другу —
 * в этом весь смысл набивного. Между блоками остаётся проезд той же ширины,
 * что и подход, иначе техника не войдёт в канал второго блока.
 */
export function designChannels(room: Room & { channelDepth?: number }): ChannelLayout {
  const key = room.productKey ?? "pallet-driveIn";
  const rule = ruleFor(key);
  if (rule.engine !== "channels")
    throw new DesignError(`«${key}» — не канальный тип, его раскладывает design().`);

  const depths = rule.channelDepths ?? [];
  const wanted = room.channelDepth ?? room.rackDepth;
  const chosen = depths.find((d) => d.mm === wanted);
  if (!chosen)
    throw new DesignError(
      `Глубина канала ${wanted} мм не из паспортных: ` +
        depths.map((d) => `${d.mm} (${d.pallets} палл.)`).join(", ")
    );

  // Паллетной таблицы балок здесь нет и быть не может: у набивного «балка»
  // шириной 1200 мм — это шаг канала, а не несущий профиль под три паллеты.
  // Грузоподъёмность канала задаётся направляющей и проверяется по паспорту
  // типа (catalog.loadPerLevelKg), а не по BEAMS.
  const { levels, frameHeight, cappedByFrame } = levelsFor(
    room.ceiling, room.palletHeight, room.maxFrameHeight ?? MAX_FRAME_HEIGHT
  );
  if (frameHeight + CEILING_RESERVE > room.ceiling)
    throw new DesignError(`Рама ${frameHeight} мм не встаёт под потолок ${room.ceiling} мм.`);

  const poly = room.polygon?.length ? room.polygon : rectPolygon(room.width, room.depth);
  const aisle = Math.round(aisleFor(key, room.mover) * APPROACH_FACTOR);
  const gap = rule.wallGap;

  // Проезд обслуживает блоки с обеих сторон: [блок][проезд][блок][блок][проезд]…
  // Считать по проезду на каждый блок — терять до четверти глубины склада.
  const usableY = room.depth - 2 * gap;
  const fits = (b: number) => b * chosen.mm + Math.ceil(b / 2) * aisle <= usableY;
  let blocks = 0;
  while (fits(blocks + 1)) blocks++;
  if (blocks < 1)
    throw new DesignError(
      `Глубина помещения ${(room.depth / 1000).toFixed(1)} м не вмещает канал ` +
        `${(chosen.mm / 1000).toFixed(1)} м с проездом ${(aisle / 1000).toFixed(1)} м.`
    );

  const chWidth = rule.innerFrameStep ?? CHANNEL_WIDTH_FALLBACK;
  const perBlock = Math.floor((room.width - 2 * gap) / chWidth);
  if (perBlock < 1)
    throw new DesignError(`Ширина помещения не вмещает ни одного канала ${chWidth} мм.`);

  const channels: Channel[] = [];
  const bays: Bay[] = [];
  // Пары блоков стоят спиной к спине, проезд — перед каждой парой.
  let cursor = gap;
  const blockY: number[] = [];
  for (let b = 0; b < blocks; b++) {
    if (b % 2 === 0) cursor += aisle;
    blockY.push(cursor);
    cursor += chosen.mm;
  }
  for (let b = 0; b < blocks; b++) {
    const y = blockY[b];
    for (let i = 0; i < perBlock; i++) {
      const x = gap + i * chWidth;
      channels.push({ x, y, w: chWidth, depth: chosen.mm, deep: chosen.pallets, block: b });
      // Каждая паллета в глубину — своя «секция» для спецификации и плана:
      // стойки стоят через 1200 мм, и рам считается именно столько.
      for (let d = 0; d < chosen.pallets; d++)
        bays.push({
          x, y: y + d * (rule.innerFrameStep ?? 1200),
          w: chWidth, h: rule.innerFrameStep ?? 1200, row: b,
        });
    }
  }

  const tiers = levels + 1;
  // Паллетомест: каждый канал держит deep × ярусы (включая пол) паллет.
  const positions = channels.length * chosen.pallets * tiers;
  const area = polyArea(poly);

  return {
    orientation: 0,
    bays,
    rows: blocks,
    sections: channels.length,
    levels,
    frameHeight,
    aisle,
    positions,
    shelves: 0,
    cappedByFrame,
    fillRatio: area ? channels.reduce((s, c) => s + c.w * c.depth, 0) / area : 0,
    polygon: poly,
    channels,
    deep: chosen.pallets,
    framesPerChannel: chosen.pallets + 1,
  };
}

/** Плотность против фронтального: главный довод в КП на набивной. */
export function densityGain(channel: ChannelLayout, frontalPositions: number): number | null {
  if (!frontalPositions) return null;
  return channel.positions / frontalPositions;
}
