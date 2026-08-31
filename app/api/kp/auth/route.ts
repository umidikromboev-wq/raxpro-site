export const runtime = "nodejs";

// Вход в кабинет. У каждого сотрудника свой логин, поэтому в реестре видно,
// кто выпустил КП, а увольнение сотрудника не заставляет менять пароль всей
// компании. Первый вход — по KP_PASSWORD: он заводит владельца кабинета.

import { authenticate } from "@/lib/kp/accounts";
import { clearCookie, fail, sessionCookie, sessionFrom } from "@/lib/kp/guard";
import { makeSessionToken, secretConfigured } from "@/lib/kp/secret";
import { storeConfigured } from "@/lib/kp/store";

export async function GET(req: Request) {
  const claims = sessionFrom(req);
  return Response.json({
    user: claims ? { id: claims.uid, login: claims.login, name: claims.name, role: claims.role } : null,
    ready: secretConfigured() && storeConfigured(),
  });
}

export async function POST(req: Request) {
  try {
    if (!secretConfigured() || !storeConfigured()) {
      return Response.json(
        { error: "Кабинет ещё не настроен: на сервере нет KP_SECRET или хранилища." },
        { status: 503 }
      );
    }

    const body = (await req.json().catch(() => ({}))) as { login?: unknown; password?: unknown };
    const login = typeof body.login === "string" ? body.login : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!password) return Response.json({ error: "Введите пароль" }, { status: 400 });

    const user = await authenticate(login, password);
    if (!user) {
      // Один и тот же текст на неверный логин и на неверный пароль:
      // иначе форма подсказывает, какие логины существуют.
      return Response.json({ error: "Логин или пароль не подходят" }, { status: 401 });
    }

    const token = makeSessionToken({
      uid: user.id,
      login: user.login,
      name: user.name,
      role: user.role,
    });
    const res = Response.json({
      ok: true,
      user: { id: user.id, login: user.login, name: user.name, role: user.role },
    });
    res.headers.append("Set-Cookie", sessionCookie(token));
    return res;
  } catch (e) {
    return fail(e, "Не удалось войти. Попробуйте ещё раз.");
  }
}

export async function DELETE() {
  const res = Response.json({ ok: true });
  res.headers.append("Set-Cookie", clearCookie());
  return res;
}
