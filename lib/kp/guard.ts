// Один вход для всех маршрутов кабинета.
//
// Раньше каждый маршрут сам разбирал cookie и сам решал, что считать доступом.
// Из-за этого cookie с Path=/kp не доходила до /api/kp/pdf, и «Скачать PDF»
// молча отдавал 401. Теперь проверка одна, и ошибка наружу уходит короткой —
// внутренние подробности остаются в логах сервера, а не в ответе.

import { readSessionToken, SessionClaims } from "./secret";

export const SESSION_COOKIE = "kp_session";

export function sessionFrom(req: Request): SessionClaims | null {
  const raw = req.headers.get("cookie") || "";
  const match = raw.match(/(?:^|;\s*)kp_session=([^;]+)/);
  if (!match) return null;
  try {
    return readSessionToken(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

export function requireSession(req: Request): SessionClaims {
  const claims = sessionFrom(req);
  if (!claims) throw new HttpError(401, "Нужен вход в кабинет");
  return claims;
}

export function requireOwner(req: Request): SessionClaims {
  const claims = requireSession(req);
  if (claims.role !== "owner") throw new HttpError(403, "Действие доступно владельцу кабинета");
  return claims;
}

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/** Наружу уходит только заранее написанный человеческий текст. Стек, имя
 *  файла и текст ошибки провайдера остаются на сервере. */
export function fail(e: unknown, fallback = "Не получилось выполнить действие"): Response {
  if (e instanceof HttpError) {
    return Response.json({ error: e.message }, { status: e.status });
  }
  console.error("[kp]", e);
  return Response.json({ error: fallback }, { status: 500 });
}

export function sessionCookie(token: string): string {
  const parts = [
    `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=43200",
  ];
  if (process.env.NODE_ENV === "production") parts.push("Secure");
  return parts.join("; ");
}

export function clearCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
