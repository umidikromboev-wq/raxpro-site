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
import { toRoom, sketchShape } from './sketch.room.mjs';
import { design } from '../rack/layout.ts';

let fail = 0;
const ok = (c, m) => { if (!c) { console.log('  FAIL ' + m); fail++; } else console.log('  ok   ' + m); };

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

/* ————————————————————————————————— 7 · лист замера с расстановкой */
// Настоящий лист (research/sketches/sketch-01.jpg): не пустая коробка,
// а прогоны с подписями «A blok 26.6 metr» и зона упаковки.
console.log('ТЕСТ 7: лист с рядами, зоной упаковки и глубиной 215 см');
const s7 = normalize({
  ...raw1,
  rows: [
    { name: 'A blok', start: [1.5, 3], end: [28.1, 3], depth: 2.15, sections: [] },
    { name: 'B blok', start: [1, 9], end: [29, 9], depth: 2.15, sections: [] },
  ],
  zones: [{ name: 'Qadoqlash zonasi', kind: 'packing', polygon: [[0, 15], [10, 15], [10, 19.5], [0, 19.5]] }],
  sectionWidth: 2.7, rowDepth: 2.15, aisle: 3, mode: 'rows',
}, 'anthropic');
ok(s7.rows.length === 2, `оба прогона прочитаны: ${s7.rows.length}`);
ok(s7.rows[0].length === 26600, `длина «A blok» в мм: ${s7.rows[0].length}`);
ok(s7.rows[0].axis === 'x' && s7.rows[0].double, 'ось по X, ряд спаренный');
ok(s7.sectionWidth === 2700 && s7.beam === 2700, 'шаг секции стал длиной балки');
ok(s7.rowDepth === 2150 && s7.aisle === 3000 && s7.mode === 'rows', 'глубина, проход и режим прочитаны');
ok(s7.zones.length === 1 && s7.zones[0].kind === 'packing', 'зона упаковки отмечена');

const shape7 = sketchShape(s7);
ok(shape7.rackDepth === 1075, `глубина одного стеллажа из спаренного ряда: ${shape7.rackDepth}`);
ok(shape7.keepouts.length === 1 && shape7.keepouts[0].w === 10000, 'зона превращена в занятый прямоугольник');

/* ————————————————————————————————— 8 · зона реально убирает секции из счёта */
console.log('ТЕСТ 8: зона упаковки уменьшает счёт, а не украшает чертёж');
const withZone = design(toRoom(s7));
const withoutZone = design(toRoom({ ...s7, zones: [] }));
ok(withZone.sections < withoutZone.sections,
  `с зоной ${withZone.sections} секций против ${withoutZone.sections} без неё`);

/* ————————————————————————————————— 9 · пристенная раскладка и мусорные ряды */
console.log('ТЕСТ 9: лист с расстановкой вдоль стен, часть данных — мусор');
const s9 = normalize({
  ...raw1,
  rows: [
    { name: 'Zina', start: [0, 0], end: [0.3, 0], depth: null, sections: [] },   // 300 мм — не ряд
    { name: null, start: [0, 0], end: null, depth: null, sections: [] },          // без конца
    { name: '1-qator', start: [0, 0], end: [8.1, 0], depth: 1.05, sections: [2.7, 2.7, 2.7] },
  ],
  zones: [
    { name: 'Zina', kind: 'stairs', polygon: [[0, 0], [3, 0], [3, 3], [0, 3]] },
    { name: 'мимо', kind: 'other', polygon: [[100, 100], [120, 100], [120, 120]] }, // вне помещения
  ],
  sectionWidth: null, rowDepth: null, aisle: null, mode: 'perimeter',
}, 'anthropic');
ok(s9.rows.length === 1 && s9.rows[0].name === '1-qator', `мусорные ряды выброшены: осталось ${s9.rows.length}`);
ok(s9.rows[0].sections.length === 3 && !s9.rows[0].double, 'секции ряда прочитаны, ряд одиночный');
ok(s9.sectionWidth === 2700, 'шаг секции взят по согласным между собой секциям');
ok(s9.rowDepth === 1050, 'глубина ряда взята по медиане рядов');
ok(s9.zones.length === 1 && s9.zones[0].kind === 'stairs', 'зона за пределами помещения выброшена');
ok(sketchShape(s9).mode === 'perimeter', 'режим «вдоль стен» доехал до ядра');
const l9 = design(toRoom(s9));
ok(l9.orientation === -1, `ядро посчитало пристенную раскладку: ${l9.rows} ряд(ов), ${l9.sections} секций`);

/* ————————————————————————————————— 10 · сдвинутое начало координат */
// Модель иногда отдаёт контур не от нуля. Раньше сдвигался только контур,
// колонны и зоны оставались на месте — и уезжали относительно стен.
console.log('ТЕСТ 10: контур начинается не в нуле');
const s10 = normalize({
  ...raw1,
  polygon: [[10, 5], [40, 5], [40, 24.5], [10, 24.5]],
  columns: [{ x: 18, y: 11.5, size: 0.4 }],
  docks: [{ x: 20, y: 5, width: 5 }],
  rows: [{ name: 'A', start: [11.5, 8], end: [38, 8], depth: 1.05, sections: [] }],
  zones: [{ name: 'Zina', kind: 'stairs', polygon: [[10, 5], [13, 5], [13, 8], [10, 8]] }],
}, 'anthropic');
ok(s10.polygon[0][0] === 0 && s10.polygon[0][1] === 0, 'контур приведён к нулю');
ok(s10.columns.length === 1 && s10.columns[0].x === 8000 && s10.columns[0].y === 6500, 'колонна переехала вместе с контуром');
ok(s10.rows.length === 1 && s10.rows[0].start[0] === 1500, 'ряд переехал вместе с контуром');
ok(s10.zones.length === 1 && s10.zones[0].polygon[0][0] === 0, 'зона переехала вместе с контуром');
ok(design(toRoom(s10)).sections > 0, 'раскладка после сдвига считается');

/* ————————————————————————————————— 11 · шаг секции, которого нет в прайсе */
console.log('ТЕСТ 11: на листе шаг 240 см — такой балки не выпускают');
const s11 = normalize({ ...raw1, beam: null, sectionWidth: 2.4 }, 'anthropic');
ok(s11.sectionWidth === 2400, 'шаг секции прочитан как есть');
ok(s11.beam === null, 'балка не выдумана');
ok(s11.warnings.some((w) => /прайсе нет/i.test(w)), 'менеджеру сказано, что такой балки нет');

/* ————————————————————————————————— 12 · разнобой секций не усредняется */
// Живой лист research/sketches/sketch-02.jpg: вдоль разных стен 270, 200 и 150 см.
// Медиана давала 2000 — числа, которого на плане нет ни как шаг, ни как балка.
console.log('ТЕСТ 12: на разных стенах разный шаг секции');
const s12 = normalize({
  ...raw1, beam: null, sectionWidth: null,
  rows: [
    { name: null, start: [0, 0], end: [7, 0], depth: null, sections: [2.7, 2.7, 1.5] },
    { name: null, start: [0, 0], end: [7.5, 0], depth: null, sections: [2, 2, 2, 2] },
  ],
}, 'anthropic');
ok(s12.sectionWidth === null, 'общий шаг не выдуман');
ok(s12.beam === null, 'балка не выдумана');
ok(s12.warnings.some((w) => /разный/i.test(w)), 'менеджеру сказано задать шаг руками');

console.log(fail ? `\nПРОВАЛЕНО: ${fail}` : '\nВСЁ ЗЕЛЁНОЕ');
process.exit(fail ? 1 : 0);
