// Раскладка склада: из габаритов помещения — в число рядов, секций и ярусов.
//
// Это та работа, из-за которой КП у RaxPro готовилось днями: менеджер ждал,
// пока проектировщик разложит стеллажи в 3ds Max. Ядро перенесено с проверенной
// Python-версии (research/rack-calc/calc_v2_polygon.py). Все размеры в миллиметрах.

export const WALL_GAP = 300;        // зазор до стены
export const CEILING_RESERVE = 500; // запас под спринклеры и балки перекрытия
export const LOAD_CLEARANCE = 150;  // зазор над грузом при постановке паллеты
export const BEAM_HEIGHT = 120;     // высота профиля балки
export const FRAME_STEP = 100;      // рамы выпускаются с шагом 100 мм
export const COLUMN_BUFFER = 150;   // зазор вокруг колонны здания
/** Максимальная высота рамы, которую завод реально поставлял:
 *  в фактических КП встречаются 3000, 4000, 5000 и 6000 мм. Выше — не считаем,
 *  иначе расчёт под 10-метровый потолок выдаёт раму 7100 мм, которой нет. */
export const MAX_FRAME_HEIGHT = 6000;

export const TRUCKS = {
  reachtruck: { aisle: 2900, ru: "Ричтрак", uz: "Richtrak" },
  stacker: { aisle: 2500, ru: "Штабелёр", uz: "Shtabelyor" },
  counterbal: { aisle: 3800, ru: "Вилочный погрузчик", uz: "Vilkali yuklagich" },
} as const;
export type TruckKey = keyof typeof TRUCKS;

export const BEAMS: Record<number, { pallets: number; capacity: number }> = {
  2700: { pallets: 3, capacity: 3000 },
  3300: { pallets: 4, capacity: 2700 },
};

export class DesignError extends Error {}

export interface Room {
  width: number;   // по X
  depth: number;   // по Y
  ceiling: number;
  columns?: Array<{ x: number; y: number; size: number }>;
  palletHeight: number;
  palletLoad: number;
  truck: TruckKey;
  beam: number;
  rackDepth: number; // глубина ряда: у RaxPro встречаются 1050 и 1100
}

export interface Bay { x: number; y: number; w: number; h: number; row: number }

export interface Layout {
  orientation: 0 | 90;
  bays: Bay[];
  rows: number;
  sections: number;
  levels: number;    // ярусов балок, пол не считается
  frameHeight: number;
  aisle: number;
  positions: number; // паллето-мест, включая пол
  cappedByFrame: boolean; // ярусы срезаны пределом высоты рамы, а не потолком
  fillRatio: number;
}

/** Сколько ярусов балок помещается под потолок и какая нужна высота рамы. */
export function levelsFor(ceiling: number, palletHeight: number) {
  const pitch = palletHeight + LOAD_CLEARANCE + BEAM_HEIGHT;
  const avail = ceiling - CEILING_RESERVE;
  let lv = 0;
  while ((lv + 1) * pitch + palletHeight <= avail) lv++;
  if (lv < 1)
    throw new DesignError(
      `Потолок ${(ceiling / 1000).toFixed(1)} м не вмещает ни одного яруса ` +
        `при высоте паллеты ${(palletHeight / 1000).toFixed(1)} м`
    );
  let frameHeight = Math.ceil((lv * pitch) / FRAME_STEP) * FRAME_STEP;
  if (frameHeight + palletHeight > avail) {
    lv--;
    frameHeight = Math.ceil((lv * pitch) / FRAME_STEP) * FRAME_STEP;
  }
  // рама выше MAX_FRAME_HEIGHT заводом не выпускалась — срезаем ярусы
  while (lv > 1 && frameHeight > MAX_FRAME_HEIGHT) {
    lv--;
    frameHeight = Math.ceil((lv * pitch) / FRAME_STEP) * FRAME_STEP;
  }
  if (frameHeight > MAX_FRAME_HEIGHT)
    throw new DesignError(
      `Даже один ярус требует раму ${frameHeight} мм — выше предела ${MAX_FRAME_HEIGHT} мм. ` +
        `Проверьте высоту паллеты.`
    );
  return { levels: lv, frameHeight, cappedByFrame: frameHeight === MAX_FRAME_HEIGHT || lv * pitch > MAX_FRAME_HEIGHT };
}

type Rect = { x: number; y: number; w: number; h: number };
const overlaps = (a: Rect, o: Rect) =>
  !(a.x + a.w <= o.x || o.x + o.w <= a.x || a.y + a.h <= o.y || o.y + o.h <= a.y);

/** Одна попытка раскладки при заданной ориентации и смещении сетки. */
function tryLayout(room: Room, W: number, D: number, offset: number, aisle: number, bay: number, obstacles: Rect[]) {
  const bays: Bay[] = [];
  let row = 0;
  const limit = D - WALL_GAP;
  let y = WALL_GAP + offset;

  while (y + room.rackDepth <= limit) {
    // Ряд обслуживается только если с лицевой стороны есть проход нужной ширины
    // либо ряд стоит спиной к стене. Иначе паллету туда не поставить.
    const roomAfter = limit - (y + 2 * room.rackDepth);
    const double = y + 2 * room.rackDepth <= limit && roomAfter >= aisle;
    for (const d of double ? [0, room.rackDepth] : [0]) {
      const ry = y + d;
      let x = WALL_GAP;
      while (x + bay <= W - WALL_GAP) {
        const b: Bay = { x, y: ry, w: bay, h: room.rackDepth, row };
        if (!obstacles.some((o) => overlaps(b, o))) bays.push(b);
        x += bay;
      }
      row++;
    }
    y += double ? 2 * room.rackDepth + aisle : room.rackDepth + aisle;
  }
  return bays;
}

export function design(room: Room): Layout {
  const beam = BEAMS[room.beam];
  if (!beam) throw new DesignError(`Неизвестный типоразмер балки: ${room.beam} мм`);
  if (room.palletLoad * beam.pallets > beam.capacity)
    throw new DesignError(
      `Перегруз балки: ${beam.pallets} × ${room.palletLoad} кг = ` +
        `${beam.pallets * room.palletLoad} кг при паспортных ${beam.capacity} кг`
    );

  const { levels, frameHeight, cappedByFrame } = levelsFor(room.ceiling, room.palletHeight);
  const aisle = TRUCKS[room.truck].aisle;

  let best: { bays: Bay[]; orientation: 0 | 90; positions: number } | null = null;

  for (const orientation of [0, 90] as const) {
    const W = orientation === 0 ? room.width : room.depth;
    const D = orientation === 0 ? room.depth : room.width;
    // колонны разворачиваем вместе с системой координат
    const obstacles: Rect[] = (room.columns ?? []).map((c) => {
      const cx = orientation === 0 ? c.x : c.y;
      const cy = orientation === 0 ? c.y : c.x;
      return {
        x: cx - c.size / 2 - COLUMN_BUFFER,
        y: cy - c.size / 2 - COLUMN_BUFFER,
        w: c.size + 2 * COLUMN_BUFFER,
        h: c.size + 2 * COLUMN_BUFFER,
      };
    });

    for (let offset = 0; offset < 2 * room.rackDepth + aisle; offset += 500) {
      const raw = tryLayout(room, W, D, offset, aisle, room.beam, obstacles);
      if (!raw.length) continue;
      // возвращаем в координаты помещения, чтобы план рисовался в его габаритах
      const bays =
        orientation === 0
          ? raw
          : raw.map((b) => ({ x: b.y, y: b.x, w: b.h, h: b.w, row: b.row }));
      const positions = bays.length * (levels + 1) * beam.pallets;
      if (!best || positions > best.positions) best = { bays, orientation, positions };
    }
  }

  if (!best)
    throw new DesignError(
      `Помещение ${(room.width / 1000).toFixed(1)}×${(room.depth / 1000).toFixed(1)} м ` +
        `не вмещает ни одного ряда с проходом ${(aisle / 1000).toFixed(1)} м ` +
        `под «${TRUCKS[room.truck].ru.toLowerCase()}»`
    );

  const rows = new Set(best.bays.map((b) => b.row)).size;
  const area = room.width * room.depth;

  return {
    orientation: best.orientation,
    bays: best.bays,
    rows,
    sections: best.bays.length,
    levels,
    frameHeight,
    aisle,
    positions: best.positions,
    cappedByFrame,
    fillRatio: best.bays.reduce((s, b) => s + b.w * b.h, 0) / area,
  };
}

/** Сетка колонн здания — самый частый случай в узбекских складах. */
export function columnGrid(width: number, depth: number, stepX: number, stepY: number, size = 400) {
  const cols: Array<{ x: number; y: number; size: number }> = [];
  for (let x = stepX; x < width; x += stepX)
    for (let y = stepY; y < depth; y += stepY) cols.push({ x, y, size });
  return cols;
}
