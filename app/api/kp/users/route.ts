export const runtime = "nodejs";

// Сотрудники кабинета. Заводит и удаляет только владелец; свой пароль
// сотрудник меняет сам.

import { createUser, listUsers, removeUser, setPassword, toPublic } from "@/lib/kp/accounts";
import { fail, requireOwner, requireSession } from "@/lib/kp/guard";
import { storeConfigured } from "@/lib/kp/store";

export async function GET(req: Request) {
  try {
    requireSession(req);
    if (!storeConfigured()) return Response.json({ users: [] });
    const users = await listUsers();
    return Response.json({ users: users.map(toPublic) });
  } catch (e) {
    return fail(e, "Не удалось получить список сотрудников");
  }
}

export async function POST(req: Request) {
  try {
    requireOwner(req);
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const user = await createUser({
      login: String(body.login ?? ""),
      name: String(body.name ?? ""),
      password: String(body.password ?? ""),
      role: body.role === "owner" ? "owner" : "manager",
    });
    return Response.json({ ok: true, user });
  } catch (e) {
    if (e instanceof Error && !(e as { status?: number }).status) {
      return Response.json({ error: e.message }, { status: 400 });
    }
    return fail(e, "Не удалось завести сотрудника");
  }
}

export async function PATCH(req: Request) {
  try {
    const claims = requireSession(req);
    const body = (await req.json().catch(() => ({}))) as { userId?: unknown; password?: unknown };
    const userId = typeof body.userId === "string" && body.userId ? body.userId : claims.uid;
    // Чужой пароль меняет только владелец.
    if (userId !== claims.uid && claims.role !== "owner") {
      return Response.json({ error: "Менять чужой пароль может только владелец кабинета" }, { status: 403 });
    }
    await setPassword(userId, String(body.password ?? ""));
    return Response.json({ ok: true });
  } catch (e) {
    if (e instanceof Error && /пароль/i.test(e.message) && !(e as { status?: number }).status) {
      return Response.json({ error: e.message }, { status: 400 });
    }
    return fail(e, "Не удалось изменить пароль");
  }
}

export async function DELETE(req: Request) {
  try {
    const claims = requireOwner(req);
    const userId = new URL(req.url).searchParams.get("id") || "";
    if (userId === claims.uid) {
      return Response.json({ error: "Нельзя удалить самого себя" }, { status: 400 });
    }
    await removeUser(userId);
    return Response.json({ ok: true });
  } catch (e) {
    if (e instanceof Error && !(e as { status?: number }).status) {
      return Response.json({ error: e.message }, { status: 400 });
    }
    return fail(e, "Не удалось удалить сотрудника");
  }
}
