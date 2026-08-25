// Регрессия раскладки против проверенной Python-версии
// (research/rack-calc/calc_v2_polygon.py — то же ядро, что считало склады
// при разборе КП). Порт обязан давать ровно те же секции и ряды.
//
// Запуск: node --import ./lib/rack/ts-hook-register.mjs lib/rack/layout.regression.mjs
import { design, columnGrid } from './layout.ts';

const NO_CAP = 99999; // в Python предела высоты рамы не было

const base = {
  ceiling: 10500, palletHeight: 1500, palletLoad: 800,
  truck: 'reachtruck', beam: 2700, rackDepth: 1100,
  maxFrameHeight: NO_CAP,
};

let fail = 0;
const ok = (c, m) => { if (!c) { console.log('  FAIL ' + m); fail++; } else console.log('  ok   ' + m); };

console.log('ТЕСТ 1: прямоугольник 45×24, 6 колонн, одни ворота');
const cols = [];
for (const x of [9000, 22000, 35000]) for (const y of [7000, 17000]) cols.push({ x, y, size: 400 });
const t1 = design({
  ...base, width: 45000, depth: 24000,
  columns: cols, docks: [{ x: 0, y: 10000, w: 300, h: 4000 }],
});
ok(t1.orientation === 0, `ориентация ${t1.orientation}° = 0°`);
ok(t1.rows === 9, `рядов ${t1.rows} = 9`);
ok(t1.sections === 133, `секций ${t1.sections} = 133`);
ok(t1.levels === 4, `ярусов ${t1.levels} = 4`);
ok(t1.positions === 1995, `паллето-мест ${t1.positions} = 1995`);
ok(Math.round(t1.fillRatio * 100) === 37, `заполнение ${Math.round(t1.fillRatio * 100)} % = 37 %`);

console.log('\nТЕСТ 2: склад со скошенной стеной, как у Toshkent.uz');
const t2 = design({
  ...base, ceiling: 9000, width: 28200, depth: 11200,
  polygon: [[0, 0], [28200, 0], [28200, 11200], [6000, 11200], [0, 6000]],
  columns: [{ x: 14000, y: 5000, size: 400 }],
});
ok(t2.rows === 4, `рядов ${t2.rows} = 4`);
ok(t2.sections === 38, `секций ${t2.sections} = 38`);
ok(t2.positions === 456, `паллето-мест ${t2.positions} = 456`);

console.log('\nТЕСТ 3: низкий потолок должен блокировать расчёт');
try { design({ ...base, width: 45000, depth: 24000, ceiling: 1800 }); ok(false, 'не заблокировано'); }
catch (e) { ok(/не вмещает ни одного яруса/.test(e.message), `заблокировано: ${e.message}`); }

console.log('\nТЕСТ 4: перегруз балки должен блокировать расчёт');
try { design({ ...base, width: 45000, depth: 24000, palletLoad: 1400 }); ok(false, 'не заблокировано'); }
catch (e) { ok(/Перегруз балки/.test(e.message), `заблокировано: ${e.message}`); }

console.log('\nТЕСТ 5: предел высоты рамы 6000 мм срезает ярус');
const t5 = design({ ...base, width: 45000, depth: 24000, maxFrameHeight: 6000 });
ok(t5.levels === 3 && t5.frameHeight <= 6000, `ярусов ${t5.levels}, рама ${t5.frameHeight} мм`);
ok(t5.cappedByFrame === true, 'помечено, что ярусы срезаны рамой, а не потолком');

console.log(fail ? `\n${fail} проверок упало` : '\nвсе проверки прошли');
process.exit(fail ? 1 : 0);
