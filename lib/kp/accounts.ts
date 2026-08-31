// Сотрудники кабинета.
//
// Раньше вход был один общий пароль: в реестре нельзя было увидеть, кто выпустил
// КП, а уволенному сотруднику пароль меняли всей компании. Здесь у каждого свой
// вход, пароль хранится только как scrypt-хеш, а роль решает, кто может менять
// ключи и заводить людей.

import { hashPassword, newId, newSalt, passwordMatches } from "./secret";
import { readJson, writeJson } from "./store";

const USERS_PATH = "accounts/users.json";

export type Role = "owner" | "manager";

export interface KpUser {
  id: string;
  login: string;
  name: string;
  role: Role;
  salt: string;
  hash: string;
  createdAt: string;
  disabled?: boolean;
}

export interface PublicUser {
  id: string;
  login: string;
  name: string;
  role: Role;
  createdAt: string;
  disabled: boolean;
}

export function toPublic(u: KpUser): PublicUser {
  return {
    id: u.id,
    login: u.login,
    name: u.name,
    role: u.role,
    createdAt: u.createdAt,
    disabled: Boolean(u.disabled),
  };
}

export async function listUsers(): Promise<KpUser[]> {
  return (await readJson<KpUser[]>(USERS_PATH)) ?? [];
}

async function saveUsers(users: KpUser[]): Promise<void> {
  await writeJson(USERS_PATH, users);
}

export function normalizeLogin(login: string): string {
  return String(login || "").trim().toLowerCase();
}

/** Первый вход. Пока сотрудников нет, владельцем становится тот, кто знает
 *  KP_PASSWORD — переменную окружения, которая и раньше открывала генератор.
 *  После этого KP_PASSWORD больше ничего не открывает: дальше только логины. */
async function bootstrapOwner(password: string): Promise<KpUser | null> {
  const expected = process.env.KP_PASSWORD;
  if (!expected || password !== expected) return null;
  const owner: KpUser = {
    id: newId("u_"),
    login: "admin",
    name: "Администратор",
    role: "owner",
    salt: newSalt(),
    hash: "",
    createdAt: new Date().toISOString(),
  };
  owner.hash = hashPassword(password, owner.salt);
  await saveUsers([owner]);
  return owner;
}

export async function authenticate(login: string, password: string): Promise<KpUser | null> {
  if (typeof password !== "string" || !password) return null;
  const users = await listUsers();

  if (users.length === 0) return bootstrapOwner(password);

  const wanted = normalizeLogin(login) || "admin";
  const user = users.find((u) => normalizeLogin(u.login) === wanted);
  if (!user || user.disabled) return null;
  if (!passwordMatches(password, user.salt, user.hash)) return null;
  return user;
}

export async function createUser(input: {
  login: string;
  name: string;
  password: string;
  role: Role;
}): Promise<PublicUser> {
  const login = normalizeLogin(input.login);
  if (!/^[a-z0-9._-]{3,32}$/.test(login)) {
    throw new Error("Логин: 3–32 символа, латиница, цифры, точка, дефис, подчёркивание");
  }
  if (String(input.password || "").length < 8) {
    throw new Error("Пароль короче 8 символов");
  }
  const name = String(input.name || "").trim().slice(0, 80) || login;
  const role: Role = input.role === "owner" ? "owner" : "manager";

  const users = await listUsers();
  if (users.some((u) => normalizeLogin(u.login) === login)) {
    throw new Error("Такой логин уже есть");
  }
  const salt = newSalt();
  const user: KpUser = {
    id: newId("u_"),
    login,
    name,
    role,
    salt,
    hash: hashPassword(input.password, salt),
    createdAt: new Date().toISOString(),
  };
  await saveUsers([...users, user]);
  return toPublic(user);
}

export async function setPassword(userId: string, password: string): Promise<void> {
  if (String(password || "").length < 8) throw new Error("Пароль короче 8 символов");
  const users = await listUsers();
  const next = users.map((u) => {
    if (u.id !== userId) return u;
    const salt = newSalt();
    return { ...u, salt, hash: hashPassword(password, salt) };
  });
  await saveUsers(next);
}

export async function removeUser(userId: string): Promise<void> {
  const users = await listUsers();
  const target = users.find((u) => u.id === userId);
  if (!target) return;
  const ownersLeft = users.filter((u) => u.role === "owner" && u.id !== userId).length;
  if (target.role === "owner" && ownersLeft === 0) {
    throw new Error("Нельзя удалить последнего владельца кабинета");
  }
  await saveUsers(users.filter((u) => u.id !== userId));
}
