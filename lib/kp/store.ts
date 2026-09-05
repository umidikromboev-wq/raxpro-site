// Хранилище кабинета — приватный Vercel Blob.
//
// Почему не база: кабинету нужны десятки документов в год, а не миллионы строк.
// Приватный blob-store не отдаёт файлы по прямой ссылке — читать их может
// только сервер по токену BLOB_READ_WRITE_TOKEN, которого нет в браузере.
// Схему мигрировать не нужно, и клиент, забрав проект себе, не наследует
// ни одной внешней базы, которую надо администрировать.

import { del, get, list, put } from "@vercel/blob";

export function storeConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function assertStore() {
  if (!storeConfigured()) {
    throw new Error("Хранилище не подключено: нет BLOB_READ_WRITE_TOKEN");
  }
}

export async function readJson<T>(pathname: string): Promise<T | null> {
  assertStore();
  try {
    const res = await get(pathname, { access: "private", useCache: false });
    if (!res) return null;
    const text = await new Response(res.stream).text();
    return JSON.parse(text) as T;
  } catch (e: unknown) {
    if (isNotFound(e)) return null;
    throw e;
  }
}

export async function writeJson(pathname: string, data: unknown): Promise<void> {
  assertStore();
  await put(pathname, JSON.stringify(data), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
}

/** Двоичный файл в приватном хранилище: снимок 3D-модели, который мост
 *  отдаёт генератору кадра. Наружу его показывает маршрут `/api/kp/ref/<id>`,
 *  сам файл остаётся закрытым, как и всё остальное в кабинете. */
export async function putBinary(pathname: string, data: Buffer, contentType: string): Promise<void> {
  assertStore();
  await put(pathname, data, {
    access: "private",
    contentType,
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 0,
  });
}

export async function readBinary(pathname: string): Promise<{ body: ReadableStream<Uint8Array>; contentType: string } | null> {
  assertStore();
  try {
    const res = await get(pathname, { access: "private", useCache: false });
    if (!res || res.statusCode !== 200) return null;
    return { body: res.stream, contentType: res.blob.contentType || "application/octet-stream" };
  } catch (e: unknown) {
    if (isNotFound(e)) return null;
    throw e;
  }
}

export async function removeBlob(pathname: string): Promise<void> {
  assertStore();
  try {
    await del(pathname);
  } catch (e: unknown) {
    if (!isNotFound(e)) throw e;
  }
}

export async function listPrefix(prefix: string): Promise<string[]> {
  assertStore();
  const out: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix, cursor, limit: 500 });
    for (const b of page.blobs) out.push(b.pathname);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return out;
}

function isNotFound(e: unknown): boolean {
  const name = (e as { name?: string })?.name ?? "";
  const message = (e as { message?: string })?.message ?? "";
  return name === "BlobNotFoundError" || /not found|does not exist/i.test(message);
}
