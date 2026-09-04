// Раскладка склада: из контура помещения — в число рядов, секций и ярусов.
//
// Это та работа, из-за которой КП у RaxPro готовилось днями: менеджер ждал,
// пока проектировщик разложит стеллажи в 3ds Max. Ядро перенесено с проверенной
// Python-версии (research/rack-calc/calc_v2_polygon.py) и повторяет её числа.
//
// Помещение задаётся контуром, а не парой габаритов: у Toshkent.uz стена
// скошена, в других объектах — выступы и ворота. Прямоугольник здесь просто
// частный случай контура, отдельной ветки под него нет.
//
// Все размеры в миллиметрах.

export const WALL_GAP = 300;        // зазор до стены
export const CEILING_RESERVE = 500; // запас под спринклеры и балки перекрытия
export const LOAD_CLEARANCE = 150;  // зазор над грузом при постановке паллеты
export const BEAM_HEIGHT = 120;     // высота профиля балки
export const FRAME_STEP = 100;      // рамы выпускаются с шагом 100 мм
export const COLUMN_BUFFER = 150;   // зазор вокруг колонны здания
export const DOCK_BUFFER = 2500;    // свободная зона перед воротами
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

export type Point = [number, number];
export type LayoutMode = "auto" | "rows" | "perimeter";

export interface Room {
  width: number;   // габарит по X — используется, если контур не задан
  depth: number;   // габарит по Y
  ceiling: number;
  /** Контур помещения. Пусто — берётся прямоугольник width × depth. */
  polygon?: Point[];
  columns?: Array<{ x: number; y: number; size: number }>;
  /** Ворота и зоны погрузки: перед ними держится свободное место. */
  docks?: Array<{ x: number; y: number; w: number; h: number }>;
  /** Участки, отмеченные на листе замера как занятые: упаковка, лестница,
   *  приёмка, офис. Границу нарисовал замерщик, поэтому запаса вокруг
   *  не добавляем — блокируется ровно то, что отмечено. */
  keepouts?: Array<{ x: number; y: number; w: number; h: number; name?: string }>;
  palletHeight: number;
  palletLoad: number;
  truck: TruckKey;
  beam: number;
  rackDepth: number; // глубина ряда: у RaxPro встречаются 1050 и 1100
  mode?: LayoutMode;
  /** Предел высоты рамы. Меняется только в регрессии против Python-версии. */
  maxFrameHeight?: number;
}

export interface Bay { x: number; y: number; w: number; h: number; row: number }

export interface Layout {
  orientation: 0 | 90 | -1; // -1 — пристенная раскладка по периметру
  bays: Bay[];
  rows: number;
  sections: number;
  levels: number;    // ярусов балок, пол не считается
  frameHeight: number;
  aisle: number;
  positions: number; // паллето-мест, включая пол
  cappedByFrame: boolean;
  fillRatio: number;
  polygon: Point[];
}

/* ————————————————————————————————————————— геометрия */

export function polyContains(poly: Point[], x: number, y: number) {
  let inside = false;
  for (let i = 0, n = poly.length; i < n; i++) {
    const [x1, y1] = poly[i];
    const [x2, y2] = poly[(i + 1) % n];
    if (y1 > y !== y2 > y) {
      const xin = ((x2 - x1) * (y - y1)) / (y2 - y1) + x1;
      if (x < xin) inside = !inside;
    }
  }
  return inside;
}

/** Прямоугольник целиком внутри контура: проверяем углы и середины рёбер. */
function rectInside(poly: Point[], x: number, y: number, w: number, h: number) {
  const x1 = x + w, y1 = y + h;
  const pts: Point[] = [
    [x, y], [x1, y], [x1, y1], [x, y1],
    [(x + x1) / 2, y], [(x + x1) / 2, y1],
    [x, (y + y1) / 2], [x1, (y + y1) / 2],
  ];
  return pts.every(([px, py]) => polyContains(poly, px, py));
}

type Rect = { x: number; y: number; w: number; h: number };
const overlaps = (a: Rect, o: Rect) =>
  !(a.x + a.w <= o.x || o.x + o.w <= a.x || a.y + a.h <= o.y || o.y + o.h <= a.y);

export function polyBounds(poly: Point[]) {
  const xs = poly.map((p) => p[0]);
  const ys = poly.map((p) => p[1]);
  return { minx: Math.min(...xs), miny: Math.min(...ys), maxx: Math.max(...xs), maxy: Math.max(...ys) };
}

export function polyArea(poly: Point[]) {
  let s = 0;
  for (let i = 0, n = poly.length; i < n; i++) {
    const [x1, y1] = poly[i];
    const [x2, y2] = poly[(i + 1) % n];
    s += x1 * y2 - x2 * y1;
  }
  return Math.abs(s) / 2;
}

export function rectPolygon(width: number, depth: number): Point[] {
  return [[0, 0], [width, 0], [width, depth], [0, depth]];
}

/* ————————————————————————————————————————— ярусность */

export function levelsFor(ceiling: number, palletHeight: number, maxFrame = MAX_FRAME_HEIGHT) {
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
  let cappedByFrame = false;
  while (lv > 1 && frameHeight > maxFrame) {
    lv--;
    frameHeight = Math.ceil((lv * pitch) / FRAME_STEP) * FRAME_STEP;
    cappedByFrame = true;
  }
  if (frameHeight > maxFrame)
    throw new DesignError(
      `Даже один ярус требует раму ${frameHeight} мм — выше предела ${maxFrame} мм. ` +
        `Проверьте высоту паллеты.`
    );
  return { levels: lv, frameHeight, cappedByFrame };
}

/* ————————————————————————————————————————— раскладка */

function obstaclesOf(room: Room, swap: boolean): Rect[] {
  const cols = (room.columns ?? []).map((c) => {
    const cx = swap ? c.y : c.x;
    const cy = swap ? c.x : c.y;
    return {
      x: cx - c.size / 2 - COLUMN_BUFFER,
      y: cy - c.size / 2 - COLUMN_BUFFER,
      w: c.size + 2 * COLUMN_BUFFER,
      h: c.size + 2 * COLUMN_BUFFER,
    };
  });
  const docks = (room.docks ?? []).map((d) => {
    const dx = swap ? d.y : d.x;
    const dy = swap ? d.x : d.y;
    const dw = swap ? d.h : d.w;
    const dh = swap ? d.w : d.h;
    return {
      x: dx - DOCK_BUFFER, y: dy - DOCK_BUFFER,
      w: dw + 2 * DOCK_BUFFER, h: dh + 2 * DOCK_BUFFER,
    };
  });
  const keepouts = (room.keepouts ?? []).map((k) => ({
    x: swap ? k.y : k.x,
    y: swap ? k.x : k.y,
    w: swap ? k.h : k.w,
    h: swap ? k.w : k.h,
  }));
  return [...cols, ...docks, ...keepouts];
}

/** Одна конфигурация рядов. Ориентация задана поворотом контура, offset — сдвиг сетки. */
function tryRows(room: Room, poly: Point[], obstacles: Rect[], offset: number, aisle: number, bay: number) {
  const { minx, miny, maxx, maxy } = polyBounds(poly);
  const bays: Bay[] = [];
  let row = 0;
  const limit = maxy - WALL_GAP;
  let y = miny + WALL_GAP + offset;

  while (y + room.rackDepth <= limit) {
    // Ряд обслуживается только если с лицевой стороны есть проход нужной ширины
    // либо ряд стоит спиной к стене. Иначе паллету туда не поставить.
    const roomAfter = limit - (y + 2 * room.rackDepth);
    const double = y + 2 * room.rackDepth <= limit && roomAfter >= aisle;
    for (const d of double ? [0, room.rackDepth] : [0]) {
      const ry = y + d;
      let x = minx + WALL_GAP;
      while (x + bay <= maxx - WALL_GAP) {
        const b: Bay = { x, y: ry, w: bay, h: room.rackDepth, row };
        if (rectInside(poly, x, ry, bay, room.rackDepth) && !obstacles.some((o) => overlaps(b, o)))
          bays.push(b);
        x += bay;
      }
      row++;
    }
    y += double ? 2 * room.rackDepth + aisle : room.rackDepth + aisle;
  }
  return bays;
}

/** Ряды вдоль стен, центр остаётся под проезд. Так собран склад Toshkent.uz —
 *  стеллажи буквой П по периметру, включая скошенную стену. */
function perimeterRows(room: Room, poly: Point[], obstacles: Rect[], bay: number, depth: number) {
  const bays: Bay[] = [];
  const n = poly.length;
  for (let i = 0; i < n; i++) {
    const [x1, y1] = poly[i];
    const [x2, y2] = poly[(i + 1) % n];
    const ex = x2 - x1, ey = y2 - y1;
    const seg = Math.hypot(ex, ey);
    if (seg < bay) continue;
    const ux = ex / seg, uy = ey / seg;
    let nx = -uy, ny = ux;
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    if (!polyContains(poly, mx + nx * depth * 0.5, my + ny * depth * 0.5)) { nx = -nx; ny = -ny; }
    if (!polyContains(poly, mx + nx * depth * 0.5, my + ny * depth * 0.5)) continue;

    const count = Math.floor((seg - 2 * WALL_GAP) / bay);
    for (let k = 0; k < count; k++) {
      const t = WALL_GAP + k * bay;
      const cx0 = x1 + ux * t, cy0 = y1 + uy * t;
      const pts: Point[] = [
        [cx0, cy0],
        [cx0 + ux * bay, cy0 + uy * bay],
        [cx0 + ux * bay + nx * depth, cy0 + uy * bay + ny * depth],
        [cx0 + nx * depth, cy0 + ny * depth],
      ];
      // Углы секции лежат ровно на стене — стягиваем их внутрь, иначе точка
      // на ребре не считается принадлежащей контуру.
      const ccx = pts.reduce((s, p) => s + p[0], 0) / 4;
      const ccy = pts.reduce((s, p) => s + p[1], 0) / 4;
      const EPS = 0.04;
      if (!pts.every(([px, py]) => polyContains(poly, px + (ccx - px) * EPS, py + (ccy - py) * EPS)))
        continue;
      const bxs = pts.map((p) => p[0]);
      const bys = pts.map((p) => p[1]);
      const r: Bay = {
        x: Math.min(...bxs), y: Math.min(...bys),
        w: Math.max(...bxs) - Math.min(...bxs),
        h: Math.max(...bys) - Math.min(...bys),
        row: i,
      };
      if (obstacles.some((o) => overlaps(r, o))) continue;
      bays.push(r);
    }
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

  const poly = room.polygon?.length ? room.polygon : rectPolygon(room.width, room.depth);
  const { levels, frameHeight, cappedByFrame } = levelsFor(
    room.ceiling, room.palletHeight, room.maxFrameHeight ?? MAX_FRAME_HEIGHT
  );
  const aisle = TRUCKS[room.truck].aisle;
  const mode: LayoutMode = room.mode ?? "auto";
  const tiers = levels + 1;

  let best: { bays: Bay[]; orientation: Layout["orientation"]; positions: number } | null = null;

  if (mode === "auto" || mode === "perimeter") {
    const pb = perimeterRows(room, poly, obstaclesOf(room, false), room.beam, room.rackDepth);
    if (pb.length) best = { bays: pb, orientation: -1, positions: pb.length * tiers * beam.pallets };
  }

  if (mode !== "perimeter") {
    for (const swap of [false, true]) {
      const p: Point[] = swap ? poly.map(([x, y]) => [y, x] as Point) : poly;
      const obstacles = obstaclesOf(room, swap);
      for (let offset = 0; offset < 2 * room.rackDepth + aisle; offset += 500) {
        const raw = tryRows(room, p, obstacles, offset, aisle, room.beam);
        if (!raw.length) continue;
        const bays = swap
          ? raw.map((b) => ({ x: b.y, y: b.x, w: b.h, h: b.w, row: b.row }))
          : raw;
        const positions = bays.length * tiers * beam.pallets;
        if (!best || positions > best.positions)
          best = { bays, orientation: swap ? 90 : 0, positions };
      }
    }
  }

  if (!best)
    throw new DesignError(
      `Контур не вмещает ни одного ряда с проходом ${(aisle / 1000).toFixed(1)} м ` +
        `под «${TRUCKS[room.truck].ru.toLowerCase()}»`
    );

  const area = polyArea(poly);
  return {
    orientation: best.orientation,
    bays: best.bays,
    rows: new Set(best.bays.map((b) => b.row)).size,
    sections: best.bays.length,
    levels,
    frameHeight,
    aisle,
    positions: best.positions,
    cappedByFrame,
    fillRatio: area ? best.bays.reduce((s, b) => s + b.w * b.h, 0) / area : 0,
    polygon: poly,
  };
}

/** Помещение с развёрнутой сеткой колонн.
 *  Единственный способ получить Room для design(): и у менеджера, и на странице
 *  клиента раскладка обязана строиться из одного и того же входа. Пока колонны
 *  разворачивались только в форме, ссылка на КП давала 60 секций вместо 58. */
export function roomWithColumns(form: Room & {
  colStepX?: number; colStepY?: number; colSize?: number;
}): Room {
  const { colStepX, colStepY, colSize } = form;
  const columns = form.columns?.length
    ? form.columns
    : colStepX && colStepY
      ? columnGrid(form.width, form.depth, colStepX, colStepY, colSize ?? 400)
      : [];
  return { ...form, columns };
}

/** Сетка колонн здания — самый частый случай в узбекских складах. */
export function columnGrid(width: number, depth: number, stepX: number, stepY: number, size = 400) {
  const cols: Array<{ x: number; y: number; size: number }> = [];
  for (let x = stepX; x < width; x += stepX)
    for (let y = stepY; y < depth; y += stepY) cols.push({ x, y, size });
  return cols;
}
