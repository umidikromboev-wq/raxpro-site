// Регрессия по всем шести типам стеллажей.
// Запуск: node --import ./lib/rack/ts-hook-register.mjs lib/rack/types.regression.mjs
//
// Что проверяется. Не конкретные числа — они черновые у половины типов и
// поедут, как только RaxPro пришлёт цены и чертежи. Проверяются инварианты,
// которые ломаться не должны ни при какой правке правил:
//
//   1. каждый тип вообще считается и отдаёт непустую спецификацию;
//   2. проход соответствует тому, кто обслуживает тип, а не ричтраку по умолчанию;
//   3. непаллетные типы не выдают паллетомест, паллетные — выдают;
//   4. набивной с самым глубоким каналом плотнее фронтального в том же помещении;
//   5. каждое черновое число объявлено в assumptions, а не спрятано в расчёте;
//   6. запреты типа доезжают до приёмки.

import { designFor } from './designer.ts';
import { MOVERS } from './layoutRules.ts';

const ROOM = {
  width: 36000, depth: 30000, ceiling: 8000,
  palletHeight: 1500, palletLoad: 800, truck: 'reachtruck',
};

const CASES = [
  { key: 'pallet-frontal', extra: { beam: 2700, rackDepth: 1100 }, engine: 'rows', mover: 'reachtruck', pallets: true, factual: true },
  { key: 'pallet-driveIn', extra: { beam: 1200, rackDepth: 5400, channelDepth: 5400 }, engine: 'channels', mover: 'reachtruck', pallets: true, factual: false },
  { key: 'medium-duty', extra: { beam: 2000, rackDepth: 600, palletsPerBay: 0, fixedSize: { h: 2000, levels: 4 } }, engine: 'rows', mover: 'person', pallets: false, factual: false },
  { key: 'archive', extra: { beam: 1000, rackDepth: 400, palletsPerBay: 0, fixedSize: { h: 2000, levels: 5 } }, engine: 'rows', mover: 'person', pallets: false, factual: false },
  { key: 'retail', extra: { beam: 1200, rackDepth: 500, palletsPerBay: 0, fixedSize: { h: 2200, levels: 6 } }, engine: 'rows', mover: 'shopper', pallets: false, factual: false },
  { key: 'mezzanine', extra: { beam: 2700, rackDepth: 1050 }, engine: 'deck', mover: 'person', pallets: false, factual: false },
];

let fail = 0;
const ok = (c, m) => { if (!c) { console.log('  FAIL ' + m); fail++; } else console.log('  ok   ' + m); };

const results = {};

for (const c of CASES) {
  console.log('\n' + c.key);
  let r;
  try {
    r = designFor({ ...ROOM, productKey: c.key, ...c.extra });
  } catch (e) {
    console.log('  FAIL не посчитался: ' + e.message);
    fail++;
    continue;
  }
  results[c.key] = r;

  ok(r.engine === c.engine, `движок ${r.engine} = ${c.engine}`);
  ok(r.spec.length > 0, `спецификация непустая: ${r.spec.length} позиций`);
  ok(r.spec.every((l) => Number.isFinite(l.qty) && l.qty > 0), 'все количества положительные и конечные');
  ok(r.spec.every((l) => l.formula && l.formula.length > 3), 'у каждой позиции есть выкладка');

  if (c.engine !== 'deck') {
    // Архивный проход — свой, из правил типа; остальные берутся из MOVERS.
    const want = c.key === 'archive' ? 800 : MOVERS[c.mover].aisle;
    ok(r.layout.aisle === want, `проход ${r.layout.aisle} = ${want} мм под «${MOVERS[c.mover].ru.toLowerCase()}»`);
  }

  if (c.pallets) {
    ok(r.positions > 0, `паллетомест ${r.positions}`);
    ok(r.shelves === null, 'полки не считаются: тип паллетный');
  } else {
    ok(r.positions === null, 'паллетомест нет — и правильно, тип непаллетный');
  }

  ok(Array.isArray(r.forbid) && r.forbid.length > 0, `запретов типа: ${r.forbid.length}`);
  ok(
    c.factual ? r.assumptions.length === 0 : r.assumptions.length > 0,
    c.factual
      ? 'расчёт целиком на фактах RaxPro'
      : `черновых допущений объявлено: ${r.assumptions.length}`
  );
}

console.log('\nПлотность набивного против фронтального');
const f = results['pallet-frontal'];
const d = results['pallet-driveIn'];
if (f && d) {
  const gain = d.positions / f.positions;
  ok(gain > 1, `набивной ×${gain.toFixed(2)} к фронтальному — плотнее, как и должен`);
  console.log(`  инфо  фронтальный ${f.positions} мест, набивной ${d.positions} мест`);
  console.log('  инфо  выигрыш скромный: сравнение идёт с ричтраком (проход 2,9 м).');
  console.log('        Против вилочного (3,8 м) он больше — это довод для КП.');
}

console.log('\nОтказы вместо неверных чисел');
const must = [
  ['мезонин под низким потолком', { productKey: 'mezzanine', ceiling: 4000, beam: 2700, rackDepth: 1050 }],
  ['набивной с непаспортной глубиной', { productKey: 'pallet-driveIn', beam: 1200, rackDepth: 3000, channelDepth: 3000 }],
];
for (const [name, extra] of must) {
  try {
    designFor({ ...ROOM, ...extra });
    ok(false, `${name}: расчёт прошёл, а должен был отказать`);
  } catch (e) {
    ok(true, `${name}: ${e.message.slice(0, 70)}…`);
  }
}

console.log(fail ? `\n${fail} проверок упало` : '\nвсе проверки прошли');
process.exit(fail ? 1 : 0);
