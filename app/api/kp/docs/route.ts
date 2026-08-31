export const runtime = "nodejs";
export const maxDuration = 30;

// Реестр КП: список и сохранение.
//
// Сохраняется вход формы, а не отрендеренные страницы: документ пересобирается
// тем же ядром, что считало его у менеджера, поэтому открытое через год КП
// пересчитается по актуальным формулам и покажет ту же сумму.

import { fail, requireSession } from "@/lib/kp/guard";
import { listDocs, saveDoc, type DocStatus } from "@/lib/kp/registry";
import { secretConfigured } from "@/lib/kp/secret";
import { storeConfigured } from "@/lib/kp/store";

const STATUSES: DocStatus[] = ["draft", "issued", "won", "lost"];

export async function GET(req: Request) {
  try {
    requireSession(req);
    if (!storeConfigured() || !secretConfigured()) return Response.json({ docs: [], ready: false });
    return Response.json({ docs: await listDocs(), ready: true });
  } catch (e) {
    return fail(e, "Не удалось открыть реестр");
  }
}

export async function POST(req: Request) {
  try {
    const claims = requireSession(req);
    if (!storeConfigured() || !secretConfigured()) {
      return Response.json({ error: "Хранилище кабинета не подключено" }, { status: 503 });
    }

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const state = body.state;
    if (!state || typeof state !== "object" || Array.isArray(state)) {
      return Response.json({ error: "Нет данных документа" }, { status: 400 });
    }
    // Документ целиком — это форма менеджера. Ограничение по объёму отсекает
    // случай, когда в состояние попала картинка на несколько мегабайт.
    const size = JSON.stringify(state).length;
    if (size > 4_000_000) {
      return Response.json(
        { error: "Документ слишком большой. Уменьшите загруженные картинки." },
        { status: 413 }
      );
    }

    const doc = await saveDoc({
      id: typeof body.id === "string" ? body.id : undefined,
      number: str(body.number, 40) || "KP",
      client: str(body.client, 160) || "—",
      productKey: str(body.productKey, 40),
      productName: str(body.productName, 120),
      lang: body.lang === "uz" ? "uz" : "ru",
      total: Number(body.total) || 0,
      positions: body.positions == null ? null : Number(body.positions) || 0,
      status: STATUSES.includes(body.status as DocStatus) ? (body.status as DocStatus) : undefined,
      authorId: claims.uid,
      authorName: claims.name || claims.login,
      state: state as Record<string, unknown>,
    });

    const { state: _omit, ...meta } = doc;
    void _omit;
    return Response.json({ ok: true, doc: meta });
  } catch (e) {
    return fail(e, "Не удалось сохранить КП");
  }
}

function str(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}
