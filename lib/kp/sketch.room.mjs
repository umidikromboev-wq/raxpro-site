// Перенос распознанного наброска в комнату для ядра раскладки.
//
// Копия того, что делает applySketch() в KpGenerator: ворота приходят центром,
// а ядру нужен прямоугольник. Вынесено отдельно, потому что копий стало две
// (регрессия и локальный прогон), и 02.09.2026 одна из них потеряла
// `rackDepth` — design() молча не нашёл ни одного ряда и отказался считать
// исправную комнату 50 × 19,5 м. Одно место — одна правда.

export function toRoom(s, extra = {}) {
  const docks = (s.docks || []).map((d) => ({
    x: Math.max(0, d.x - d.width / 2),
    y: Math.max(0, d.y - 500),
    w: d.width,
    h: 1000,
  }));
  return {
    ceiling: s.ceiling ?? 10500,
    palletHeight: 1500,
    palletLoad: 800,
    truck: s.truck ?? 'reachtruck',
    beam: s.beam ?? 2700,
    rackDepth: 1050,
    width: s.width,
    depth: s.depth,
    polygon: s.polygon,
    columns: s.columns,
    docks,
    ...extra,
  };
}
