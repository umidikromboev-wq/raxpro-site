// Мост на связи? Читает heartbeat из хранилища кабинета и печатает возраст.
// Запуск: node --import ./lib/rack/ts-hook-register.mjs tools/kp-bridge/status.mjs
// Код выхода 0 — мак отметился меньше минуты назад, 1 — нет.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { readJson } from '../../lib/kp/store.ts';

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  const text = readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
  for (const line of text.split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)="?([^"\n]*)"?$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const beat = await readJson('bridge/alive.json').catch(() => null);
if (!beat?.at) { console.log('мост: heartbeat не найден'); process.exit(1); }
const age = Math.round((Date.now() - Date.parse(beat.at)) / 1000);
const alive = age < 60;
console.log(`мост: ${alive ? 'на связи' : 'НЕ на связи'} · последняя отметка ${age} с назад (${beat.at})`);
process.exit(alive ? 0 : 1);
