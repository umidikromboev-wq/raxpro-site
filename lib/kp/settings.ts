// Ключи ИИ-сервисов компании.
//
// Кабинет уезжает RaxPro, поэтому в продукте нет ни одного чужого ключа:
// компания подключает свой аккаунт Anthropic (распознавание набросков) и свой
// аккаунт Google (генерация изображений). Ключ приходит один раз, проверяется
// живым запросом к провайдеру и ложится в хранилище зашифрованным.
// Обратно в браузер уходит только подсказка вида «sk-ant-…7f2a».

import { decryptSecret, encryptSecret, maskKey } from "./secret";
import { defaultModel, isKnownModel } from "./models";
import { readJson, writeJson } from "./store";

const SETTINGS_PATH = "accounts/settings.json";

export type ProviderKey = "anthropic" | "google";

export interface StoredKey {
  enc: string;
  hint: string;
  ok: boolean;
  checkedAt: string;
  checkNote?: string;
  updatedBy: string;
  updatedAt: string;
}

export interface OrgSettings {
  anthropic?: StoredKey;
  google?: StoredKey;
  /** Выбранные модели. Хранятся рядом с ключами: у компании свой счёт,
   *  и переключение модели — их решение, а не наша константа. */
  models?: Partial<Record<ProviderKey, string>>;
}

export interface PublicKeyState {
  connected: boolean;
  model?: string;
  hint?: string;
  ok?: boolean;
  checkedAt?: string;
  checkNote?: string;
  updatedBy?: string;
}

export async function readSettings(): Promise<OrgSettings> {
  return (await readJson<OrgSettings>(SETTINGS_PATH)) ?? {};
}

export function publicState(k?: StoredKey, model?: string): PublicKeyState {
  if (!k) return { connected: false, model };
  return {
    connected: true,
    model,
    hint: k.hint,
    ok: k.ok,
    checkedAt: k.checkedAt,
    checkNote: k.checkNote,
    updatedBy: k.updatedBy,
  };
}

/** Модель, которой работает провайдер прямо сейчас. */
export async function getModel(provider: ProviderKey): Promise<string> {
  const settings = await readSettings();
  const chosen = settings.models?.[provider];
  return isKnownModel(provider, chosen) ? chosen : defaultModel(provider);
}

export async function saveModel(provider: ProviderKey, model: string): Promise<string> {
  if (!isKnownModel(provider, model)) throw new Error("Неизвестная модель");
  const settings = await readSettings();
  await writeJson(SETTINGS_PATH, { ...settings, models: { ...settings.models, [provider]: model } });
  return model;
}

/** Расшифрованный ключ. Живёт только внутри серверного запроса. */
export async function getPlainKey(provider: ProviderKey): Promise<string | null> {
  const settings = await readSettings();
  const stored = settings[provider];
  if (!stored) return null;
  try {
    return decryptSecret(stored.enc);
  } catch {
    return null;
  }
}

export async function saveKey(
  provider: ProviderKey,
  rawKey: string,
  who: string
): Promise<PublicKeyState> {
  const key = String(rawKey || "").trim();
  if (!key) throw new Error("Пустой ключ");
  if (key.length > 400) throw new Error("Это не похоже на ключ доступа");
  // Ключ уходит в заголовок HTTP. Любой символ вне ASCII роняет сам fetch,
  // и менеджер видел «не удалось связаться с провайдером» вместо правды:
  // он скопировал ключ вместе с кириллицей или переносом строки.
  if (!/^[\x21-\x7e]+$/.test(key)) {
    throw new Error(
      "В ключе есть посторонние символы — пробел, перенос строки или кириллица. Скопируйте ключ целиком из консоли провайдера."
    );
  }

  const model = await getModel(provider);
  const check = await checkKey(provider, key, model);
  const settings = await readSettings();
  const stored: StoredKey = {
    enc: encryptSecret(key),
    hint: maskKey(key),
    ok: check.ok,
    checkNote: check.note,
    checkedAt: new Date().toISOString(),
    updatedBy: who,
    updatedAt: new Date().toISOString(),
  };
  await writeJson(SETTINGS_PATH, { ...settings, [provider]: stored });
  return publicState(stored, model);
}

/** Перепроверка уже сохранённого ключа. Ключ мог протухнуть или упереться
 *  в лимит через месяц после подключения — кнопка должна отвечать правду
 *  на сегодня, а не показывать проверку годовой давности. */
export async function recheckKey(provider: ProviderKey): Promise<PublicKeyState> {
  const settings = await readSettings();
  const stored = settings[provider];
  if (!stored) throw new Error("Ключ не подключён");

  let plain: string;
  try {
    plain = decryptSecret(stored.enc);
  } catch {
    throw new Error("Ключ не читается: сменился KP_SECRET. Подключите ключ заново.");
  }

  const model = await getModel(provider);
  const check = await checkKey(provider, plain, model);
  const next: StoredKey = {
    ...stored,
    ok: check.ok,
    checkNote: check.note,
    checkedAt: new Date().toISOString(),
  };
  await writeJson(SETTINGS_PATH, { ...settings, [provider]: next });
  return publicState(next, model);
}

export async function clearKey(provider: ProviderKey): Promise<void> {
  const settings = await readSettings();
  const next = { ...settings };
  delete next[provider];
  await writeJson(SETTINGS_PATH, next);
}

/** Проверка живым запросом — именно тем, который делает продукт.
 *
 *  Списком моделей проверять нельзя, и это выяснилось на боевом ключе:
 *  `GET /v1/models` у обоих провайдеров отвечает 200 при нулевом балансе,
 *  а `generateContent` на том же ключе тут же возвращает 429 «prepayment
 *  credits are depleted». Кнопка «Проверить» сказала бы «работает», а
 *  распознавание наброска упало бы у менеджера при клиенте. Поэтому здесь
 *  делается настоящая, но крошечная генерация на той самой модели, которой
 *  потом читается набросок. Стоит доли цента и отвечает правду. */
export async function checkKey(
  provider: ProviderKey,
  key: string,
  model: string = defaultModel(provider)
): Promise<{ ok: boolean; note: string }> {
  try {
    if (provider === "anthropic") {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        signal: AbortSignal.timeout(25000),
        body: JSON.stringify({
          model,
          max_tokens: 16,
          messages: [{ role: "user", content: "ping" }],
        }),
      });
      if (res.ok) return { ok: true, note: `Ключ работает, модель ${model} отвечает` };
      const detail = await errorText(res);
      if (res.status === 401) return { ok: false, note: "Anthropic не принял ключ: неверный или отозван" };
      if (res.status === 403) return { ok: false, note: "У ключа нет доступа к этой модели" };
      if (res.status === 429) return { ok: false, note: "Лимит Anthropic исчерпан. Пополните баланс аккаунта." };
      if (res.status === 400 && /credit|balance/i.test(detail)) {
        return { ok: false, note: "На аккаунте Anthropic нет средств — пополните баланс." };
      }
      if (res.status === 404) {
        return { ok: false, note: `Anthropic не знает модель ${model} на этом ключе. Выберите другую в списке выше.` };
      }
      return { ok: false, note: `Anthropic ответил ${res.status}` };
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(25000),
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: "ping" }] }],
          generationConfig: { maxOutputTokens: 16 },
        }),
      }
    );
    if (res.ok) return { ok: true, note: `Ключ работает, модель ${model} отвечает` };
    const detail = await errorText(res);
    if (res.status === 429) {
      return {
        ok: false,
        note: /credit|quota/i.test(detail)
          ? "На аккаунте Google кончились кредиты или квота — пополните в AI Studio."
          : "Лимит Google исчерпан. Проверьте квоты аккаунта.",
      };
    }
    if (res.status === 400 || res.status === 401 || res.status === 403) {
      return { ok: false, note: "Google не принял ключ: неверный, отозван или не включён Generative Language API" };
    }
    if (res.status === 404) {
      return { ok: false, note: `Google не даёт этому ключу модель ${model}. Выберите другую в списке выше.` };
    }
    return { ok: false, note: `Google ответил ${res.status}` };
  } catch (e: unknown) {
    const msg = (e as { name?: string })?.name === "TimeoutError"
      ? "Провайдер не ответил за 25 секунд"
      : "Не удалось связаться с провайдером";
    return { ok: false, note: msg };
  }
}

/** Тело ошибки провайдера читается только чтобы отличить «нет денег»
 *  от «нет доступа». Наружу оно не уходит: в ответе провайдера бывают
 *  идентификаторы организации и запроса. */
async function errorText(res: Response): Promise<string> {
  try {
    return (await res.text()).slice(0, 2000);
  } catch {
    return "";
  }
}
