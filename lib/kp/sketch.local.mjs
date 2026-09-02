// Распознавание наброска БЕЗ ключа API — через подписку Claude.
//
// Зачем. В бою `/api/kp/sketch` ходит в api.anthropic.com ключом компании:
// счёт выставляется RAX PRO, и это правильно. Но чтобы ПРОВЕРИТЬ распознавание,
// покупать баланс не нужно: локально тот же снимок читает Claude Code, а он
// оплачен подпиской Умида. Промпт и схема берутся из sketch.ts — те же самые,
// поэтому проверка говорит о боевом пути, а не о своей копии.
//
// Что здесь НЕ покрыто: сам HTTP-вызов провайдера (ветки 401/429/400) и
// tool_use-ответ Anthropic. Покрыто главное — читается ли лист и переживает ли
// прочитанное дорогу до раскладки.
//
// Запуск:
//   node --import ./lib/rack/ts-hook-register.mjs lib/kp/sketch.local.mjs research/sketches/sketch-01.jpg
//   … --save /tmp/sketch-01.json     сохранить распознанное
//   … --model sonnet                 модель подписки (по умолчанию — текущая)

import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { SYSTEM, SCHEMA, normalize } from './sketch.ts';
import { design } from '../rack/layout.ts';

const HEADLESS = path.join(process.env.HOME, '.claude/bin/claude_headless.sh');

const args = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(name); return i < 0 ? null : args[i + 1]; };
const image = args.find((a) => !a.startsWith('--') && args[args.indexOf(a) - 1] !== '--save' && args[args.indexOf(a) - 1] !== '--model');
if (!image) { console.error('укажите файл наброска'); process.exit(2); }
const abs = path.resolve(image);

/** Копия переноса из applySketch() в KpGenerator: ворота приходят центром,
 *  а ядру раскладки нужен прямоугольник. Держать синхронно с sketch.regression.mjs. */
function toRoom(s) {
  return {
    ceiling: s.ceiling ?? 10500,
    palletHeight: 1500,
    palletLoad: 800,
    truck: s.truck ?? 'reachtruck',
    beam: s.beam ?? 2700,
    width: s.width,
    depth: s.depth,
    polygon: s.polygon,
    columns: s.columns,
    docks: (s.docks || []).map((d) => ({
      x: Math.max(0, d.x - d.width / 2),
      y: Math.max(0, d.y - 500),
      w: d.width,
      h: 1000,
    })),
  };
}

const prompt = `${SYSTEM}

Прочитай изображение по пути ${abs} инструментом Read и верни результат.

Ответ — ТОЛЬКО JSON-объект, без пояснений и без markdown-ограды, строго по этой схеме:
${JSON.stringify(SCHEMA, null, 1)}`;

const model = flag('--model');
const cli = ['--output-format', 'json', '--allowedTools', 'Read'];
if (model) cli.push('--model', model);

console.log(`Набросок: ${abs}`);
console.log(`Провайдер: подписка Claude${model ? ` (${model})` : ''} — денег не стоит\n`);

const t0 = Date.now();
const run = spawnSync(HEADLESS, [prompt, ...cli], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
if (run.status !== 0) {
  console.error(run.stderr || run.stdout || 'claude вернул ошибку');
  process.exit(1);
}

let text;
try {
  text = JSON.parse(run.stdout).result;
} catch {
  console.error('не разобрал ответ claude:\n' + run.stdout.slice(0, 2000));
  process.exit(1);
}

// Модель иногда оборачивает JSON в ```json — вырезаем первый объект.
const start = text.indexOf('{');
const end = text.lastIndexOf('}');
if (start < 0 || end < start) { console.error('в ответе нет JSON:\n' + text.slice(0, 2000)); process.exit(1); }
let raw;
try {
  raw = JSON.parse(text.slice(start, end + 1));
} catch (e) {
  console.error('JSON не парсится: ' + e.message + '\n' + text.slice(start, start + 2000));
  process.exit(1);
}

console.log(`Прочитано за ${((Date.now() - t0) / 1000).toFixed(1)} с\n`);

// Дальше — ровно боевой путь: та же normalize() и то же ядро design().
const s = normalize(raw, 'anthropic');

console.log(`Уверенность: ${s.confidence}`);
console.log(`Помещение:   ${(s.width / 1000).toFixed(1)} × ${(s.depth / 1000).toFixed(1)} м` +
  (s.ceiling ? `, потолок ${(s.ceiling / 1000).toFixed(1)} м` : ', потолок не подписан'));
console.log(`Контур:      ${s.polygon.length} углов · колонн ${s.columns.length} · ворот ${s.docks.length}`);
console.log(`С листа:     стеллаж ${s.productKey ?? '—'} · ярусов ${s.levels ?? '—'} · балка ${s.beam ?? '—'} · техника ${s.truck ?? '—'} · клиент ${s.client ?? '—'}`);

console.log('\nЧто прочитано на листе:');
for (const r of s.readings) console.log('  · ' + r);
if (s.warnings.length) {
  console.log('\nСомнения:');
  for (const w of s.warnings) console.log('  ! ' + w);
}

// Сохраняем ДО раскладки: распознанное ценно само по себе, а design()
// имеет право отказаться — это ответ ядра, а не сбой проверки.
const save = flag('--save');
if (save) { writeFileSync(save, JSON.stringify(s, null, 1)); console.log(`\nСохранено: ${save}`); }

try {
  const l = design(toRoom(s));
  console.log(`\nРаскладка: ${l.rows} ряд(ов) · ${l.sections} секций · ${l.positions} паллето-мест`);
} catch (e) {
  console.log(`\nРаскладка: ядро отказалось считать — ${e.message}`);
  console.log('  (распознавание при этом отработало: смотри размеры и контур выше)');
}
