export const runtime = "nodejs";
export const maxDuration = 30;

// Ключи ИИ-сервисов компании: подключить, проверить, отключить.
//
// Наружу ключ не возвращается никогда — только подсказка «sk-ant-…7f2a» и
// результат последней проверки. Менять ключи может владелец кабинета.

import { fail, requireOwner, requireSession } from "@/lib/kp/guard";
import {
  clearKey, getModel, publicState, readSettings, recheckKey, saveKey, saveModel,
  type ProviderKey,
} from "@/lib/kp/settings";
import { modelsFor } from "@/lib/kp/models";
import { secretConfigured } from "@/lib/kp/secret";
import { storeConfigured } from "@/lib/kp/store";

const PROVIDERS: ProviderKey[] = ["anthropic", "google"];

function isProvider(v: unknown): v is ProviderKey {
  return typeof v === "string" && PROVIDERS.includes(v as ProviderKey);
}

export async function GET(req: Request) {
  try {
    requireSession(req);
    if (!secretConfigured() || !storeConfigured()) {
      return Response.json({
        anthropic: { connected: false },
        google: { connected: false },
        choices: { anthropic: modelsFor("anthropic"), google: modelsFor("google") },
        ready: false,
      });
    }
    const s = await readSettings();
    return Response.json({
      anthropic: publicState(s.anthropic, await getModel("anthropic")),
      google: publicState(s.google, await getModel("google")),
      // Список моделей отдаётся сервером, а не зашит в браузере: сменится
      // поколение — правится один файл, а не собранный бандл у клиента.
      choices: { anthropic: modelsFor("anthropic"), google: modelsFor("google") },
      ready: true,
    });
  } catch (e) {
    return fail(e, "Не удалось прочитать настройки");
  }
}

export async function POST(req: Request) {
  try {
    const claims = requireOwner(req);
    const body = (await req.json().catch(() => ({}))) as {
      provider?: unknown;
      key?: unknown;
      model?: unknown;
      recheck?: unknown;
    };
    if (!isProvider(body.provider)) {
      return Response.json({ error: "Неизвестный сервис" }, { status: 400 });
    }
    // Смена модели — отдельное действие: ключ при этом не трогается,
    // но проверка гоняется заново, потому что доступ к моделям разный.
    if (typeof body.model === "string") {
      const model = await saveModel(body.provider, body.model);
      const state = await recheckKey(body.provider).catch(() => null);
      return Response.json({ ok: true, provider: body.provider, model, state: state ?? { connected: false, model } });
    }
    if (body.recheck === true) {
      const state = await recheckKey(body.provider);
      return Response.json({ ok: true, provider: body.provider, state });
    }
    if (typeof body.key !== "string" || !body.key.trim()) {
      return Response.json({ error: "Введите ключ" }, { status: 400 });
    }
    const state = await saveKey(body.provider, body.key, claims.name || claims.login);
    return Response.json({ ok: true, provider: body.provider, state });
  } catch (e) {
    if (e instanceof Error && /ключ|модел/i.test(e.message) && !(e as { status?: number }).status) {
      return Response.json({ error: e.message }, { status: 400 });
    }
    return fail(e, "Не удалось сохранить ключ");
  }
}

export async function DELETE(req: Request) {
  try {
    requireOwner(req);
    const provider = new URL(req.url).searchParams.get("provider");
    if (!isProvider(provider)) {
      return Response.json({ error: "Неизвестный сервис" }, { status: 400 });
    }
    await clearKey(provider);
    return Response.json({ ok: true, provider, state: { connected: false } });
  } catch (e) {
    return fail(e, "Не удалось отключить ключ");
  }
}
