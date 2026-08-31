// Регрессия распознавания наброска — всё, кроме самого вызова модели.
//
// Ответ модели — внешние данные, и именно на них ломается путь «фото → КП»:
// метры приезжают вместо миллиметров, контур не сходится с подписанными
// габаритами, колонна вылезает за стену, ворота приходят центром, а раскладке
// нужен прямоугольник. Здесь проверяется вся эта дорога — normalize() из
// sketch.ts, тот же перенос в форму, что делает applySketch() в кабинете,
// и то же ядро design(), что считает документ.
//
// Живой вызов провайдера сюда не входит намеренно: он стоит денег и требует
// ключа компании. Ломается же обычно не он.
//
// Запуск: node --import ./lib/rack/ts-hook-register.mjs lib/kp/sketch.regression.mjs

import { normalize } from './sketch.ts';
import { design } from '../rack/layout.ts';

let fail = 0;
const ok = (c, m) => { if (!c) { console.log('  FAIL ' + m); fail++; } else console.log('  ok   ' + m); };

/** Перенос распознанного в форму — копия того, что делает applySketch()
 *  в KpGenerator: ворота приходят центром, а ядру нужен прямоугольник. */
function toRoom(s, extra = {}) {
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

/* ————————————————————————————————— 1 · склад со срезанным углом */
// Именно так модель отвечает на набросок: метры, а не миллиметры,
// потому что замерщик пишет «30 м».
console.log('ТЕСТ 1: 30 × 19,5 м со срезанным углом, 4 колонны, двое ворот');
const raw1 = {
  confidence: 'high',
  width: 30, depth: 19.5, ceiling: 9,
  polygon: [[0, 0], [30, 0], [30, 14], [24, 19.5], [0, 19.5]],
  columns: [
    { x: 8, y: 6.5, size: 0.4 },
    { x: 16, y: 6.5, size: 0.4 },
    { x: 8, y: 13, size: 0.4 },
    { x: 16, y: 13, size: 0.4 },
  ],
  docks: [{ x: 10, y: 0, width: 5 }, { x: 22, y: 0, width: 5 }],
  productKey: 'pallet-frontal', levels: null, beam: 2.7, truck: 'reachtruck',
  client: 'Ozod Savdo',
  readings: ['30 м', '19,5 м', 'потолок 9 м', 'ворота 5 м'],
  warnings: [],
};
const s1 = normalize(raw1, 'anthropic');
ok(s1.width === 30000 && s1.depth === 19500, `метры переведены в мм: ${s1.width}×${s1.depth}`);
ok(s1.ceiling === 9000, `потолок 9 м → ${s1.ceiling} мм`);
ok(s1.polygon.length === 5, `контур со срезом сохранён: ${s1.polygon.length} углов`);
ok(s1.columns.length === 4, `колонн ${s1.columns.length}`);
ok(s1.columns.every((c) => c.size === 400), 'сторона колонны 0,4 м → 400 мм');
ok(s1.docks.length === 2, `ворот ${s1.docks.length}`);
ok(s1.beam === 2700, `балка 2.7 → ${s1.beam}`);
ok(s1.productKey === 'pallet-frontal', 'тип стеллажа принят');
ok(s1.client === 'Ozod Savdo', 'клиент прочитан с листа');

const l1 = design(toRoom(s1));
ok(l1.rows >= 2 && l1.sections > 0, `раскладка строится: ${l1.rows} ряд(ов), ${l1.sections} секций, ${l1.positions} мест`);
ok(l1.levels >= 1, `ярусов ${l1.levels} при потолке ${s1.ceiling} мм`);
console.log(`       → ${l1.rows} ряд(ов) · ${l1.sections} секций · ${l1.levels} яруса · ${l1.positions} паллето-мест`);

/* ————————————————————————————————— 2 · модель уже ответила в мм */
console.log('ТЕСТ 2: те же данные, но модель ответила в миллиметрах');
const s2 = normalize({ ...raw1, width: 30000, depth: 19500, ceiling: 9000,
  polygon: raw1.polygon.map(([x, y]) => [x * 1000, y * 1000]),
  columns: raw1.columns.map((c) => ({ x: c.x * 1000, y: c.y * 1000, size: 400 })),
  docks: raw1.docks.map((d) => ({ x: d.x * 1000, y: d.y * 1000, width: d.width * 1000 })),
}, 'google');
ok(s2.width === s1.width && s2.depth === s1.depth, 'габариты те же, что из метров');
const l2 = design(toRoom(s2));
ok(l2.sections === l1.sections && l2.rows === l1.rows, `раскладка совпала: ${l2.rows}/${l2.sections}`);

/* ————————————————————————————————— 3 · контур главнее подписи */
console.log('ТЕСТ 3: подписанная ширина спорит с обведённым контуром');
const s3 = normalize({ ...raw1, width: 26, polygon: raw1.polygon }, 'anthropic');
ok(s3.width === 30000, `габарит взят с контура (${s3.width}), а не с подписи 26 м`);
ok(s3.warnings.some((w) => /расход/i.test(w)), 'о расхождении сказано менеджеру');

/* ————————————————————————————————— 4 · мусор отбрасывается, а не считается */
console.log('ТЕСТ 4: мусор в ответе модели');
const s4 = normalize({
  ...raw1,
  ceiling: 240,                                   // 240 м потолка не бывает
  columns: [...raw1.columns, { x: 400, y: 6, size: 0.4 }], // колонна за стеной
  polygon: [],                                    // контур не распознан
}, 'anthropic');
ok(s4.ceiling === null, 'потолок вне диапазона отброшен');
ok(s4.warnings.some((w) => /потолк/i.test(w)), 'о потолке предупреждено');
ok(s4.columns.length === 4, `колонна за пределами помещения выброшена: осталось ${s4.columns.length}`);
ok(s4.polygon.length === 4, 'без контура взят прямоугольник по габаритам');
ok(s4.warnings.some((w) => /контур/i.test(w)), 'о подстановке прямоугольника предупреждено');

/* ————————————————————————————————— 5 · нечитаемый набросок не превращается в счёт */
console.log('ТЕСТ 5: с листа не читаются габариты');
let threw = false;
try {
  normalize({ ...raw1, width: 0, depth: 0, polygon: [] }, 'anthropic');
} catch (e) {
  threw = /не читаются габариты/i.test(e.message);
}
ok(threw, 'генератор отказывается считать, а не придумывает размеры');

/* ————————————————————————————————— 6 · L-образный склад */
console.log('ТЕСТ 6: L-образный склад 32 × 21 м с вырезом');
const s6 = normalize({
  ...raw1,
  width: 32, depth: 21,
  polygon: [[0, 0], [32, 0], [32, 12], [18, 12], [18, 21], [0, 21]],
  columns: [], docks: [{ x: 16, y: 0, width: 4 }],
}, 'anthropic');
ok(s6.polygon.length === 6, `вырез сохранён: ${s6.polygon.length} углов`);
const l6 = design(toRoom(s6));
ok(l6.sections > 0, `раскладка по L-форме: ${l6.rows} ряд(ов), ${l6.sections} секций, ${l6.positions} мест`);
console.log(`       → ${l6.rows} ряд(ов) · ${l6.sections} секций · ${l6.positions} паллето-мест`);

console.log(fail ? `\nПРОВАЛЕНО: ${fail}` : '\nВСЁ ЗЕЛЁНОЕ');
process.exit(fail ? 1 : 0);
