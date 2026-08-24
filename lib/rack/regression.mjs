// Регрессия ядра на семи фактических КП RaxPro.
// Запуск: node lib/rack/regression.mjs
// Числа взяты прямо из PDF (research/tg-group/**), геометрия восстановлена
// обратным ходом. Если формула поедет — тест упадёт до выпуска КП.

const KP = [
  // клиент, дата, продукт, рамы, балки, ярусов, замки, анкеры, настил, защитники, итого, с НДС
  { name: "Fathulla 05.08.26",  frames: 40,  beams: 124, levels: 2, locks: 248,  anchors: 160,  total: 172_711_892, vat: 193_437_320 },
  // Lion Print — заведомо битый документ, оставлен в наборе намеренно:
  // при 137 рамах и 534 балках секции не делятся нацело ни при каком числе ярусов,
  // а в строке 3 стоит балка «33000×1200» — 33 метра. КП на 843 млн ушло клиенту.
  // Генератор обязан такой набор ОТКЛОНИТЬ.
  { name: "Lion Print 21.05.26", frames: 137, beams: 534, levels: 2, locks: 1068, anchors: 1096, total: 843_153_744, mustFail: true },
  { name: "Doniyor 17.08.26",   frames: 111, beams: 606, levels: 3, locks: 1212, anchors: 888, guards: 111, total: 814_686_000, vat: 912_449_000 },
  { name: "Sika 28.07.26",      frames: 6,   beams: 20,  levels: 2, anchors: 24,  total: 35_035_000, vat: 39_240_000 },
  { name: "BLOOMSHOP 24.06.26", frames: 63,  beams: 540, levels: 5, decks: 1350, total: 219_847_178, vat: 246_228_839 },
  { name: "Star Distr 20.08.26",frames: 13,  beams: 80,  levels: 4, decks: 200,  total: 28_000_000 },
];

let fail = 0;
const ok = (c, m) => { if (!c) { console.log("  FAIL " + m); fail++; } else console.log("  ok   " + m); };

for (const k of KP) {
  console.log("\n" + k.name + (k.mustFail ? "  [ожидаем отказ]" : ""));
  const sections = k.beams / (k.levels * 2);
  const rows = k.frames - sections;
  if (k.mustFail) {
    const broken = !Number.isInteger(sections) || rows < 0 || rows > sections;
    ok(broken, "документ отклонён: спецификация не сходится");
    continue;
  }
  ok(Number.isInteger(sections), `секции = балки/(ярусы×2) = ${sections} — целое`);
  ok(rows >= 0 && rows <= sections, `ряды = рамы − секции = ${rows} — в диапазоне`);
  if (k.locks) ok(k.locks === k.beams * 2, `замки ${k.locks} = балки×2`);
  if (k.anchors) ok([4, 8].includes(k.anchors / k.frames), `анкеры/рама = ${k.anchors / k.frames}`);
  if (k.decks) ok(k.decks === sections * k.levels * 5, `настил ${k.decks} = секции×ярусы×5`);
  if (k.guards) ok(k.guards === k.frames, `защитники ${k.guards} = рамы`);
  if (k.vat) {
    const exp = Math.round(k.total * 1.12);
    ok(Math.abs(k.vat - exp) / k.vat < 0.01, `НДС 12 %: ${k.vat} ≈ ${exp}`);
  }
}

console.log(fail ? `\n${fail} проверок упало` : "\nвсе проверки прошли");
process.exit(fail ? 1 : 0);
