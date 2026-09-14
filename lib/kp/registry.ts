// Реестр выпущенных КП.
//
// До этого документ жил в localStorage браузера менеджера: закрыл вкладку —
// потерял, ушёл сотрудник — ушли и его предложения. Здесь каждое КП лежит
// в хранилище компании со своим номером, автором и датой, его можно открыть,
// отредактировать и выпустить заново.

import { newId } from "./secret";
import { listPrefix, readJson, removeBlob, writeJson } from "./store";

const INDEX_PATH = "kp/index.json";
const docPath = (id: string) => `kp/docs/${id}.json`;

export type DocStatus = "draft" | "issued" | "won" | "lost";

export interface DocMeta {
  id: string;
  number: string;
  client: string;
  productKey: string;
  productName: string;
  lang: "ru" | "uz";
  total: number;
  positions: number | null;
  status: DocStatus;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

/** state — весь ввод формы. Документ пересобирается ядром из него же,
 *  поэтому храним вход, а не отрендеренные страницы. */
export interface DocRecord extends DocMeta {
  state: Record<string, unknown>;
}

export async function listDocs(): Promise<DocMeta[]> {
  const index = await readJson<DocMeta[]>(INDEX_PATH);
  if (index) return index.sort(byUpdated);
  return rebuildIndex();
}

/** Индекс восстанавливается из самих документов: он ускоряет список,
 *  но не является источником правды — потеря индекса не теряет КП. */
export async function rebuildIndex(): Promise<DocMeta[]> {
  const paths = await listPrefix("kp/docs/");
  const metas: DocMeta[] = [];
  for (const p of paths) {
    const doc = await readJson<DocRecord>(p);
    if (doc?.id) metas.push(stripState(doc));
  }
  metas.sort(byUpdated);
  await writeJson(INDEX_PATH, metas);
  return metas;
}

export async function readDoc(id: string): Promise<DocRecord | null> {
  if (!isSafeId(id)) return null;
  return readJson<DocRecord>(docPath(id));
}

export async function saveDoc(input: {
  id?: string;
  number: string;
  client: string;
  productKey: string;
  productName: string;
  lang: "ru" | "uz";
  total: number;
  positions: number | null;
  status?: DocStatus;
  authorId: string;
  authorName: string;
  state: Record<string, unknown>;
}): Promise<DocRecord> {
  const now = new Date().toISOString();
  const existing = input.id && isSafeId(input.id) ? await readDoc(input.id) : null;

  const record: DocRecord = {
    id: existing?.id ?? newId("kp_"),
    number: input.number,
    client: input.client,
    productKey: input.productKey,
    productName: input.productName,
    lang: input.lang,
    total: input.total,
    positions: input.positions,
    status: input.status ?? existing?.status ?? "draft",
    // Автор не переписывается при правке чужого КП — видно, кто его сделал.
    authorId: existing?.authorId ?? input.authorId,
    authorName: existing?.authorName ?? input.authorName,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    state: input.state,
  };

  await writeJson(docPath(record.id), record);
  await upsertIndex(stripState(record));
  return record;
}

export async function setStatus(id: string, status: DocStatus): Promise<DocRecord | null> {
  const doc = await readDoc(id);
  if (!doc) return null;
  const next: DocRecord = { ...doc, status, updatedAt: new Date().toISOString() };
  await writeJson(docPath(id), next);
  await upsertIndex(stripState(next));
  return next;
}

export async function deleteDoc(id: string): Promise<void> {
  if (!isSafeId(id)) return;
  await removeBlob(docPath(id));
  const index = (await readJson<DocMeta[]>(INDEX_PATH)) ?? [];
  await writeJson(INDEX_PATH, index.filter((m) => m.id !== id));
}

async function upsertIndex(meta: DocMeta): Promise<void> {
  const index = (await readJson<DocMeta[]>(INDEX_PATH)) ?? [];
  const next = [meta, ...index.filter((m) => m.id !== meta.id)];
  next.sort(byUpdated);
  await writeJson(INDEX_PATH, next);
}

function stripState(doc: DocRecord): DocMeta {
  const { state, ...meta } = doc;
  void state;
  return meta;
}

function byUpdated(a: DocMeta, b: DocMeta): number {
  return b.updatedAt.localeCompare(a.updatedAt);
}

/** Идентификатор приходит из адреса, а превращается в путь в хранилище:
 *  всё, кроме букв, цифр и трёх безопасных знаков, отбрасывается. */
export function isSafeId(id: string): boolean {
  return typeof id === "string" && /^kp_[A-Za-z0-9_-]{6,32}$/.test(id);
}
