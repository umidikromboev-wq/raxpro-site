// Перенос распознанного наброска в комнату для ядра раскладки.
//
// Копия того, что делает applySketch() в KpGenerator: ворота приходят центром,
// а ядру нужен прямоугольник. Вынесено отдельно, потому что копий стало две
// (регрессия и локальный прогон), и 02.09.2026 одна из них потеряла
// `rackDepth` — design() молча не нашёл ни одного ряда и отказался считать
// исправную комнату 50 × 19,5 м. Одно место — одна правда.

/** Всё, что набросок говорит о геометрии: контур, препятствия, режим.
 *  Кабинет подмешивает это в комнату целиком (`{...base, ...shape}`) —
 *  выборочный перенос полей уже стоил один потерянный rackDepth. */
export function sketchShape(s) {
  const docks = (s.docks || []).map((d) => ({
    x: Math.max(0, d.x - d.width / 2),
    y: Math.max(0, d.y - 500),
    w: d.width,
    h: 1000,
  }));

  // Зона с листа — многоугольник; ядру нужен прямоугольник, поэтому берём
  // её габаритную коробку. Упаковку и лестницу стеллажами не занимают.
  const keepouts = (s.zones || [])
    .map((z) => {
      const xs = (z.polygon || []).map((p) => p[0]);
      const ys = (z.polygon || []).map((p) => p[1]);
      if (xs.length < 3) return null;
      const x = Math.min(...xs);
      const y = Math.min(...ys);
      const w = Math.max(...xs) - x;
      const h = Math.max(...ys) - y;
      return w > 0 && h > 0 ? { x, y, w, h, name: z.name ?? null } : null;
    })
    .filter(Boolean);

  const shape = {
    width: s.width,
    depth: s.depth,
    polygon: s.polygon,
    columns: s.columns,
    docks,
    rackDepth: rackDepthOf(s),
  };
  if (keepouts.length) shape.keepouts = keepouts;
  if (s.mode === 'rows' || s.mode === 'perimeter') shape.mode = s.mode;
  return shape;
}

/** На листе замера пишут глубину всего прогона: «215 sm» — это спаренный ряд
 *  из двух стеллажей по 1050–1100. Ядру нужна глубина одного. */
export function rackDepthOf(s) {
  const d = s.rowDepth;
  if (!d) return 1050;
  if (d > 1600) return Math.round(d / 2);
  return d >= 600 && d <= 1600 ? Math.round(d) : 1050;
}

export function toRoom(s, extra = {}) {
  return {
    ceiling: s.ceiling ?? 10500,
    palletHeight: 1500,
    palletLoad: 800,
    truck: s.truck ?? 'reachtruck',
    beam: s.beam ?? 2700,
    ...sketchShape(s),
    ...extra,
  };
}
