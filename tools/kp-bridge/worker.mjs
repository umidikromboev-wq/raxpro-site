// Воркер моста: выполняет работу кабинета на машине владельца.
//
// Кабинет в бою кладёт задание в blob-хранилище, воркер его забирает,
// выполняет на подписке Claude (чтение наброска) и на аккаунте Higgsfield
// (кадр расстановки) и кладёт ответ обратно. Наружу воркер не слушает ни
// одного порта — только исходящие соединения, поэтому мак остаётся невидим.
//
// Запуск:
//   node --import ./lib/rack/ts-hook-register.mjs tools/kp-bridge/worker.mjs
// Токен хранилища берётся из .env.local (BLOB_READ_WRITE_TOKEN).

import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import { bridgeAnswer, bridgeBeat, bridgeTake } from '../../lib/kp/bridge.ts';
import { SYSTEM, SCHEMA } from '../../lib/kp/sketch.ts';

const CLAUDE = path.join(process.env.HOME, '.local/bin/claude');
const POLL_MS = 1500;
const BEAT_MS = 20_000;

// Инструменты закрыты по тому же принципу, что и в sketch.local.mjs: воркер
// крутится часами без присмотра, и «claude, продолжи работу» в чужой папке
// здесь стоило бы дороже всего. Из /tmp он не видит ни CLAUDE.md, ни хуков.
const READ_ONLY = 'Bash,Write,Edit,NotebookEdit,Task,WebFetch,WebSearch';
const HF_TOOLS = [
  'mcp__claude_ai_Higgsfield__generate_image',
  'mcp__claude_ai_Higgsfield__jobs_wait',
  'mcp__claude_ai_Higgsfield__job_status',
  'mcp__claude_ai_Higgsfield__show_generation_by_ids',
].join(',');

loadEnv();

console.log('Мост запущен. Задания забираются из хранилища кабинета.');
console.log('Останов — Ctrl+C. Пока окно открыто, кабинет на raxpro.uz умеет читать наброски и рисовать кадр.\n');

await beat();
setInterval(beat, BEAT_MS);


for (;;) {
  try {
    const jobs = await bridgeTake();
    for (const job of jobs) await run(job);
  } catch (e) {
    console.error('[мост]', e?.message || e);
  }
  await sleep(POLL_MS);
}

async function run(job) {
  const t0 = Date.now();
  console.log(`→ ${job.kind} ${job.id}`);
  try {
    const data = job.kind === 'sketch' ? await doSketch(job.payload) : await doImage(job.payload);
    await bridgeAnswer(job.id, { ok: true, data });
    console.log(`✓ ${job.kind} ${job.id} за ${((Date.now() - t0) / 1000).toFixed(1)} с`);
  } catch (e) {
    const error = e?.message || 'Не удалось выполнить';
    await bridgeAnswer(job.id, { ok: false, error });
    console.error(`✗ ${job.kind} ${job.id}: ${error}`);
  }
}

/* ————————————————————————————— набросок → геометрия */

async function doSketch(payload) {
  const { data, mediaType } = payload || {};
  if (!data) throw new Error('В задании нет снимка');
  const ext = mediaType === 'image/png' ? 'png' : mediaType === 'image/webp' ? 'webp' : 'jpg';
  const file = path.join(os.tmpdir(), `kp-sketch-${Date.now()}.${ext}`);
  writeFileSync(file, Buffer.from(data, 'base64'));
  try {
    const text = await claude(
      `${SYSTEM}\n\nПрочитай изображение по пути ${file} инструментом Read и верни результат.\n\n` +
        `Ответ — ТОЛЬКО JSON-объект, без пояснений и без markdown-ограды, строго по этой схеме:\n` +
        JSON.stringify(SCHEMA, null, 1),
      ['--allowedTools', 'Read', '--disallowedTools', READ_ONLY.replace('Bash,', '')]
    );
    return firstJson(text);
  } finally {
    try { unlinkSync(file); } catch {}
  }
}

/* ————————————————————————————— промпт → кадр расстановки */

async function doImage(payload) {
  const prompt = String(payload?.prompt || '').slice(0, 4000);
  if (!prompt) throw new Error('В задании нет промпта');
  const text = await claude(
    `Сгенерируй ОДНО изображение через Higgsfield по этому описанию. Соотношение сторон 16:9.\n\n` +
      `Описание: ${prompt}\n\n` +
      `Дождись готовности и верни ТОЛЬКО прямой URL картинки одной строкой, без пояснений и разметки.`,
    ['--allowedTools', HF_TOOLS, '--disallowedTools', READ_ONLY]
  );
  const url = (text.match(/https?:\/\/\S+?\.(?:png|jpe?g|webp)/i) || [])[0];
  if (!url) throw new Error('Higgsfield не вернул картинку');

  // В кабинет уходит data:URL, а не ссылка на CDN: документ должен жить,
  // когда ссылка провайдера протухнет.
  const res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
  if (!res.ok) throw new Error(`Картинка не скачалась (${res.status})`);
  const raw = Buffer.from(await res.arrayBuffer());

  // Higgsfield отдаёт кадр под 8 МБ. В КП он живёт шириной около 900 px,
  // поэтому ужимаем до 1600 px JPEG — иначе документ и PDF раздуваются
  // на порядок, а через хранилище такое задание ходит десятки секунд.
  const jpeg = await sharp(raw).resize({ width: 1600, withoutEnlargement: true }).jpeg({ quality: 82 }).toBuffer();
  return `data:image/jpeg;base64,${jpeg.toString('base64')}`;
}

/* ————————————————————————————— служебное */

// Асинхронно, не spawnSync: чтение наброска идёт ~3 минуты, и синхронный
// вызов замораживал heartbeat — через минуту кабинет считал мост мёртвым
// и отдавал клиенту ошибку ключа, хотя мак в этот момент работал.
function claude(prompt, extra) {
  return new Promise((resolve, reject) => {
    const child = spawn(CLAUDE, ['-p', prompt, '--output-format', 'json', ...extra], {
      cwd: os.tmpdir(),
      env: { ...process.env, TELEGRAM_BOT_TOKEN: '' },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.setEncoding('utf8').on('data', (d) => { stdout += d; });
    child.stderr.setEncoding('utf8').on('data', (d) => { stderr += d; });
    child.on('error', (e) => reject(new Error(`claude не запустился: ${e.message}`)));
    child.on('close', (status) => {
      if (status !== 0) return reject(new Error(cut(stderr || stdout) || 'claude вернул ошибку'));
      let out;
      try { out = JSON.parse(stdout); } catch { return reject(new Error('не разобрал ответ claude')); }
      if (out.is_error) return reject(new Error(cut(out.result) || 'claude ответил ошибкой'));
      resolve(String(out.result || ''));
    });
  });
}

function firstJson(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start < 0 || end < start) throw new Error('в ответе нет JSON');
  return JSON.parse(text.slice(start, end + 1));
}

function loadEnv() {
  if (process.env.BLOB_READ_WRITE_TOKEN) return;
  const file = path.join(process.cwd(), '.env.local');
  let text = '';
  try { text = readFileSync(file, 'utf8'); } catch { throw new Error('нет .env.local — запустите `vercel env pull`'); }
  for (const line of text.split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)="?([^"\n]*)"?$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error('в .env.local нет BLOB_READ_WRITE_TOKEN');
}

/** Отметка «мак на связи»: кабинет по ней решает, включать ли кнопки. */
async function beat() {
  try { await bridgeBeat(); } catch (e) { console.error('[мост] нет связи с хранилищем:', e?.message || e); }
}

function cut(s) { return String(s || '').trim().slice(0, 300); }
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }
