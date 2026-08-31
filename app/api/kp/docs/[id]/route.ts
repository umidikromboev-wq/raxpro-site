export const runtime = "nodejs";

// Одно КП из реестра: открыть, сменить статус, удалить.

import { fail, requireSession } from "@/lib/kp/guard";
import { deleteDoc, isSafeId, readDoc, setStatus, type DocStatus } from "@/lib/kp/registry";

const STATUSES: DocStatus[] = ["draft", "issued", "won", "lost"];

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, ctx: Ctx) {
  try {
    requireSession(req);
    const { id } = await ctx.params;
    if (!isSafeId(id)) return Response.json({ error: "КП не найдено" }, { status: 404 });
    const doc = await readDoc(id);
    if (!doc) return Response.json({ error: "КП не найдено" }, { status: 404 });
    return Response.json({ doc });
  } catch (e) {
    return fail(e, "Не удалось открыть КП");
  }
}

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    requireSession(req);
    const { id } = await ctx.params;
    const body = (await req.json().catch(() => ({}))) as { status?: unknown };
    if (!STATUSES.includes(body.status as DocStatus)) {
      return Response.json({ error: "Неизвестный статус" }, { status: 400 });
    }
    const doc = await setStatus(id, body.status as DocStatus);
    if (!doc) return Response.json({ error: "КП не найдено" }, { status: 404 });
    const { state, ...meta } = doc;
    void state;
    return Response.json({ ok: true, doc: meta });
  } catch (e) {
    return fail(e, "Не удалось изменить статус");
  }
}

export async function DELETE(req: Request, ctx: Ctx) {
  try {
    const claims = requireSession(req);
    const { id } = await ctx.params;
    const doc = await readDoc(id);
    if (!doc) return Response.json({ ok: true });
    // Чужое КП удаляет только владелец кабинета: менеджер не должен
    // случайно стереть предложение коллеги из общего списка.
    if (doc.authorId !== claims.uid && claims.role !== "owner") {
      return Response.json({ error: "Удалить чужое КП может только владелец кабинета" }, { status: 403 });
    }
    await deleteDoc(id);
    return Response.json({ ok: true });
  } catch (e) {
    return fail(e, "Не удалось удалить КП");
  }
}
