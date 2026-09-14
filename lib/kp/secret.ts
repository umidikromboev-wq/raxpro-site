// Шифрование и подписи для кабинета.
//
// Продукт уезжает клиенту, поэтому ни один секрет не лежит в репозитории и ни
// один не уходит в браузер. Ключи Anthropic и Google клиента хранятся только
// в зашифрованном виде (AES-256-GCM), мастер-ключ живёт в переменной окружения
// KP_SECRET на Vercel. Потерян KP_SECRET — ключи не расшифровать, и это
// правильное поведение: расшифровать их не сможет и тот, кто получил дамп
// хранилища.

import crypto from "node:crypto";

const VERSION = "v1";

/** Мастер-ключ. Разные назначения разводятся по контекстам, чтобы один и тот же
 *  байтовый ключ не использовался и для шифра, и для подписи сессии. */
function derive(context: string): Buffer {
  const raw = process.env.KP_SECRET;
  if (!raw || raw.length < 24) {
    throw new Error("KP_SECRET не задан на сервере");
  }
  return crypto.createHmac("sha256", raw).update(`raxpro-kp/${context}`).digest();
}

export function secretConfigured(): boolean {
  const raw = process.env.KP_SECRET;
  return Boolean(raw && raw.length >= 24);
}

/** Шифрует строку. Формат: v1.<iv>.<tag>.<ciphertext>, всё в base64url. */
export function encryptSecret(plain: string): string {
  const key = derive("secrets");
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const data = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [VERSION, b64(iv), b64(tag), b64(data)].join(".");
}

export function decryptSecret(packed: string): string {
  const [v, ivS, tagS, dataS] = String(packed).split(".");
  if (v !== VERSION || !ivS || !tagS || !dataS) throw new Error("Испорченная запись ключа");
  const key = derive("secrets");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, unb64(ivS));
  decipher.setAuthTag(unb64(tagS));
  return Buffer.concat([decipher.update(unb64(dataS)), decipher.final()]).toString("utf8");
}

/* ————————————————————————————————— пароли */

export function newSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

/** scrypt, а не голый sha256: подбор по словарю становится дорогим. */
export function hashPassword(password: string, salt: string): string {
  const pepper = derive("password").toString("hex");
  return crypto.scryptSync(`${password}${pepper}`, salt, 32).toString("hex");
}

export function passwordMatches(password: string, salt: string, hash: string): boolean {
  const given = Buffer.from(hashPassword(password, salt), "hex");
  const known = Buffer.from(hash, "hex");
  if (given.length !== known.length) return false;
  return crypto.timingSafeEqual(given, known);
}

/* ————————————————————————————————— сессия */

export interface SessionClaims {
  uid: string;
  login: string;
  name: string;
  role: "owner" | "manager";
  exp: number;
}

const SESSION_TTL_MS = 12 * 60 * 60 * 1000;

export function makeSessionToken(claims: Omit<SessionClaims, "exp">): string {
  const body: SessionClaims = { ...claims, exp: Date.now() + SESSION_TTL_MS };
  const payload = b64(Buffer.from(JSON.stringify(body), "utf8"));
  return `${payload}.${signature(payload)}`;
}

export function readSessionToken(token: string | undefined | null): SessionClaims | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = signature(payload);
  if (sig.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const claims = JSON.parse(unb64(payload).toString("utf8")) as SessionClaims;
    if (!claims?.uid || typeof claims.exp !== "number" || claims.exp < Date.now()) return null;
    return claims;
  } catch {
    return null;
  }
}

function signature(payload: string): string {
  return b64(crypto.createHmac("sha256", derive("session")).update(payload).digest());
}

/* ————————————————————————————————— мелочь */

/** Подсказка о ключе для интерфейса. Полный ключ не возвращается никогда. */
export function maskKey(key: string): string {
  const s = String(key).trim();
  if (s.length <= 12) return "••••";
  return `${s.slice(0, 7)}…${s.slice(-4)}`;
}

export function newId(prefix = ""): string {
  return prefix + crypto.randomBytes(9).toString("base64url");
}

function b64(buf: Buffer): string {
  return buf.toString("base64url");
}
function unb64(s: string): Buffer {
  return Buffer.from(s, "base64url");
}
