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
//   … --from /tmp/sketch-01.json     прогнать уже распознанное, без обращения к модели

import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { SYSTEM, SCHEMA, normalize } from './sketch.ts';
import { toRoom } from './sketch.room.mjs';
import { design } from '../rack/layout.ts';

const CLAUDE = path.join(process.env.HOME, '.local/bin/claude');

const args = process.argv.slice(2);
const flag = (name) => { const i = args.indexOf(name); return i < 0 ? null : args[i + 1]; };
const from = flag('--from');
const image = args.find((a, i) => !a.startsWith('--') && !['--save', '--model', '--from'].includes(args[i - 1]));
if (!image && !from) { console.error('укажите файл наброска или --from <json>'); process.exit(2); }
const abs = image ? path.resolve(image) : null;

let raw;
if (from) {
  // Повтор по уже распознанному: проверять правки в normalize() и раскладке
  // не имеет смысла ценой нового прочтения листа.
  raw = JSON.parse(readFileSync(from, 'utf8'));
  console.log(`Распознанное из файла: ${from}\n`);
} else {

const prompt = `${SYSTEM}

Прочитай изображение по пути ${abs} инструментом Read и верни результат.

Ответ — ТОЛЬКО JSON-объект, без пояснений и без markdown-ограды, строго по этой схеме:
${JSON.stringify(SCHEMA, null, 1)}`;

const model = flag('--model');
// Читателю наброска нужен ровно один инструмент — Read. Остальные закрыты
// намеренно: 02.09.2026 прогон с --dangerously-skip-permissions из папки
// проекта подхватил SessionStart-контекст, «продолжил работу» и сам сделал
// коммит. Отсюда три предохранителя: белый список инструментов, чёрный
// список пишущих, и запуск из /tmp — чтобы не подтянулись CLAUDE.md и хуки
// проекта. TELEGRAM_BOT_TOKEN гасим по той же причине, что и в
// ~/.claude/bin/claude_headless.sh: иначе фоновый claude отбирает поллер.
const cli = [
  '-p', prompt,
  '--output-format', 'json',
  '--allowedTools', 'Read',
  '--disallowedTools', 'Bash,Write,Edit,NotebookEdit,Task,WebFetch,WebSearch',
];
if (model) cli.push('--model', model);

console.log(`Набросок: ${abs}`);
console.log(`Провайдер: подписка Claude${model ? ` (${model})` : ''} — денег не стоит\n`);

const t0 = Date.now();
const run = spawnSync(CLAUDE, cli, {
  encoding: 'utf8',
  maxBuffer: 32 * 1024 * 1024,
  cwd: os.tmpdir(),
  env: { ...process.env, TELEGRAM_BOT_TOKEN: '' },
});
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
try {
  raw = JSON.parse(text.slice(start, end + 1));
} catch (e) {
  console.error('JSON не парсится: ' + e.message + '\n' + text.slice(start, start + 2000));
  process.exit(1);
}

console.log(`Прочитано за ${((Date.now() - t0) / 1000).toFixed(1)} с\n`);
}

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
