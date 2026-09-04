// Мост на подписку владельца.
//
// Зачем он есть. Кабинет умеет две вещи за деньги провайдера: читать
// фотографию наброска и собирать кадр расстановки. В бою это ключи компании
// (см. settings.ts) — так и останется, когда RaxPro подключит свои. Но пока
// ключей нет, показывать кабинет с двумя мёртвыми кнопками нельзя, а покупать
// баланс ради демонстрации — тем более. Поэтому есть третий путь: работу
// выполняет машина владельца, на его подписке Claude и его аккаунте Higgsfield.
//
// Как устроено. Никаких открытых портов и туннелей: обе стороны ходят в уже
// существующее blob-хранилище кабинета. Сервер кладёт задание в bridge/jobs/,
// воркер на маке его забирает, выполняет и кладёт ответ в bridge/out/. Мак
// делает только исходящие соединения — снаружи он невидим.
//
// Мост — временный. Появился ключ провайдера — settings.ts выигрывает,
// и эта ветка больше не вызывается.

import { listPrefix, readJson, removeBlob, storeConfigured, writeJson } from "./store";

export type BridgeKind = "sketch" | "image";

export interface BridgeJob {
  id: string;
  kind: BridgeKind;
  payload: unknown;
  createdAt: string;
}

export interface BridgeAnswer {
  id: string;
  ok: boolean;
  data?: unknown;
  error?: string;
  finishedAt: string;
}

const JOBS = "bridge/jobs/";
const OUT = "bridge/out/";
const HEARTBEAT = "bridge/alive.json";

/** Мост включён владельцем. Без флага кабинет ведёт себя как у клиента:
 *  нет ключа — нет функции. */
export function bridgeEnabled(): boolean {
  return process.env.KP_BRIDGE === "1" && storeConfigured();
}

/** Воркер на маке отметился за последнюю минуту. Мак выключили или закрыли
 *  крышку — кнопка должна честно сказать это заранее, а не через две минуты
 *  ожидания при клиенте. */
export async function bridgeAlive(): Promise<boolean> {
  if (!bridgeEnabled()) return false;
  const beat = await readJson<{ at?: string }>(HEARTBEAT).catch(() => null);
  if (!beat?.at) return false;
  return Date.now() - Date.parse(beat.at) < 60_000;
}

export class BridgeError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.status = status;
  }
}

/** Отдать работу маку владельца и дождаться ответа. */
export async function bridgeCall<T>(
  kind: BridgeKind,
  payload: unknown,
  timeoutMs = 100_000
): Promise<T> {
  if (!bridgeEnabled()) throw new BridgeError("Мост выключен", 412);
  if (!(await bridgeAlive())) {
    throw new BridgeError(
      "Компьютер владельца сейчас не на связи — распознавание и генерация недоступны. Подключите свой ключ в разделе «Ключи ИИ».",
      503
    );
  }

  const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const job: BridgeJob = { id, kind, payload, createdAt: new Date().toISOString() };
  await writeJson(`${JOBS}${id}.json`, job);

  const deadline = Date.now() + timeoutMs;
  try {
    while (Date.now() < deadline) {
      await sleep(1200);
      const answer = await readJson<BridgeAnswer>(`${OUT}${id}.json`).catch(() => null);
      if (!answer) continue;
      await removeBlob(`${OUT}${id}.json`).catch(() => {});
      if (!answer.ok) throw new BridgeError(answer.error || "Мост вернул ошибку");
      return answer.data as T;
    }
  } finally {
    // Задание, до которого не дошли руки, чистим за собой: иначе воркер
    // возьмёт его через час и потратит генерацию впустую.
    await removeBlob(`${JOBS}${id}.json`).catch(() => {});
  }
  throw new BridgeError("Компьютер владельца не ответил вовремя. Повторите.", 504);
}

/** Сторона воркера: забрать задания. Экспортируется здесь, чтобы очередь
 *  описывалась в одном файле, а не расходилась двумя копиями. */
export async function bridgeTake(): Promise<BridgeJob[]> {
  const names = await listPrefix(JOBS);
  const jobs: BridgeJob[] = [];
  for (const name of names) {
    const job = await readJson<BridgeJob>(name).catch(() => null);
    await removeBlob(name).catch(() => {});
    if (job?.id && job.kind) jobs.push(job);
  }
  return jobs;
}

export async function bridgeAnswer(id: string, answer: Omit<BridgeAnswer, "id" | "finishedAt">): Promise<void> {
  await writeJson(`${OUT}${id}.json`, { id, ...answer, finishedAt: new Date().toISOString() });
}

export async function bridgeBeat(): Promise<void> {
  await writeJson(HEARTBEAT, { at: new Date().toISOString() });
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
