// Раскладка мезонина: плита второго уровня на колоннах.
//
// Мезонин — единственный тип линейки, который не раскладывается рядами и
// секциями. Он продаётся площадью: сетка колонн, главные и второстепенные
// балки, настил в квадратных метрах, ограждение по открытому краю и лестницы.
// Поэтому у него своя геометрия и своя форма спецификации — DeckGeometry, а
// не Geometry из spec.ts.
//
// Всё, что здесь посчитано, — черновик. Ни одного КП на мезонин и ни одного
// чертежа в группе нет (тема 14, msg 100, 105): каждый проектировался
// индивидуально. Числа взяты из LAYOUT_RULES["mezzanine"] и перечислены в
// assumed — приёмка обязана показать их менеджеру, а RaxPro поправить в
// кабинете после первого настоящего чертежа.
//
// Все размеры в миллиметрах, площади — в квадратных метрах.

import { CEILING_RESERVE, DesignError, polyArea, rectPolygon, type Point, type Room } from "./layout";
import { ruleFor } from "./layoutRules";

export interface DeckGeometry {
  /** Площадь плиты, м². */
  areaM2: number;
  /** Колонн всего. */
  columns: number;
  /** Сетка: шаг по фронту × шаг между главными балками. */
  grid: [number, number];
  /** Главные балки — несут плиту, идут по длинной стороне сетки. */
  mainBeams: number;
  /** Второстепенные балки — держат настил между главными. */
  subBeams: number;
  /** Настил, м². Равен площади плиты: считается по площади, а не листами. */
  deckM2: number;
  /** Ограждение по открытому краю, погонных метров. */
  railingM: number;
  /** Лестниц. */
  stairs: number;
  /** Чистая высота под плитой и над ней. */
  clearBelow: number;
  clearAbove: number;
  /** Высота верха плиты от пола. */
  deckLevel: number;
}

export interface DeckLayout {
  geometry: DeckGeometry;
  /** Позиции колонн для плана и сцены. */
  columnPoints: Array<{ x: number; y: number }>;
  polygon: Point[];
  /** Допущения, попавшие в этот расчёт. */
  assumed: string[];
}

/**
 * Разложить мезонин в помещении.
 *
 * Плита занимает помещение целиком за вычетом зазора до стен. Высота делится
 * на два яруса: под плитой и над ней — обоим нужна чистая высота из правил,
 * плюс толщина самой конструкции и запас под потолком.
 */
export function designDeck(room: Room & { deckArea?: Point[] }): DeckLayout {
  const key = room.productKey ?? "mezzanine";
  const rule = ruleFor(key);
  if (rule.engine !== "deck")
    throw new DesignError(`«${key}» — не плиточный тип, его раскладывает design().`);

  const clear = rule.clearHeight ?? 2400;
  const thickness = rule.deckThickness ?? 300;
  const grid = rule.columnGrid ?? [2700, 4500];
  const gap = rule.wallGap;

  // Потолок обязан вместить два чистых яруса, конструкцию плиты и запас
  // под спринклеры. Иначе мезонин не имеет смысла — проще поставить стеллаж.
  const need = clear * 2 + thickness + CEILING_RESERVE;
  if (room.ceiling < need)
    throw new DesignError(
      `Потолок ${(room.ceiling / 1000).toFixed(1)} м не вмещает мезонин: нужно ` +
        `${(need / 1000).toFixed(1)} м — по ${(clear / 1000).toFixed(1)} м чистых снизу и сверху, ` +
        `${thickness} мм конструкция плиты и ${CEILING_RESERVE} мм под потолком.`
    );

  const poly = room.deckArea?.length
    ? room.deckArea
    : rectPolygon(room.width - 2 * gap, room.depth - 2 * gap);
  const areaM2 = polyArea(poly) / 1_000_000;
  if (areaM2 <= 0) throw new DesignError("Площадь плиты нулевая — проверьте контур.");

  // Сетка колонн по габаритам плиты. Колонны стоят и по краям, поэтому
  // шагов на один меньше, чем колонн в линии.
  const w = room.deckArea?.length ? boundsWidth(poly) : room.width - 2 * gap;
  const d = room.deckArea?.length ? boundsDepth(poly) : room.depth - 2 * gap;
  const nx = Math.max(2, Math.round(w / grid[0]) + 1);
  const ny = Math.max(2, Math.round(d / grid[1]) + 1);

  const columnPoints: Array<{ x: number; y: number }> = [];
  const stepX = w / (nx - 1);
  const stepY = d / (ny - 1);
  const ox = room.deckArea?.length ? Math.min(...poly.map((p) => p[0])) : gap;
  const oy = room.deckArea?.length ? Math.min(...poly.map((p) => p[1])) : gap;
  for (let i = 0; i < nx; i++)
    for (let j = 0; j < ny; j++)
      columnPoints.push({ x: Math.round(ox + i * stepX), y: Math.round(oy + j * stepY) });

  // Главные балки идут между колоннами вдоль длинной стороны сетки,
  // второстепенные — поперёк, по одной на каждый пролёт настила.
  const mainBeams = nx * (ny - 1);
  const subBeams = ny * (nx - 1);

  // Ограждение по всему периметру плиты: где плита примыкает к стене,
  // ограждение не нужно, но проём под лестницу его добавляет обратно —
  // считаем периметр целиком, это черновик в запас.
  const railingM = perimeter(poly) / 1000;

  const stairs = Math.max(1, Math.ceil(areaM2 / (rule.stairPerM2 ?? 300)));

  return {
    geometry: {
      areaM2: Math.round(areaM2 * 10) / 10,
      columns: columnPoints.length,
      grid: [Math.round(stepX), Math.round(stepY)],
      mainBeams,
      subBeams,
      deckM2: Math.round(areaM2 * 10) / 10,
      railingM: Math.round(railingM * 10) / 10,
      stairs,
      clearBelow: clear,
      clearAbove: clear,
      deckLevel: clear + thickness,
    },
    columnPoints,
    polygon: poly,
    assumed: rule.assumed,
  };
}

function boundsWidth(poly: Point[]) {
  const xs = poly.map((p) => p[0]);
  return Math.max(...xs) - Math.min(...xs);
}
function boundsDepth(poly: Point[]) {
  const ys = poly.map((p) => p[1]);
  return Math.max(...ys) - Math.min(...ys);
}
function perimeter(poly: Point[]) {
  let s = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x1, y1] = poly[i];
    const [x2, y2] = poly[(i + 1) % poly.length];
    s += Math.hypot(x2 - x1, y2 - y1);
  }
  return s;
}
