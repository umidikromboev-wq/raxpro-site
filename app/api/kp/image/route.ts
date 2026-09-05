export const runtime = "nodejs";
export const maxDuration = 120;

// Картинка для КП на аккаунте компании.
//
// Кадр строится не «нарисуй красивый склад», а по посчитанной раскладке: те же
// ряды, ярусы и техника, что в спецификации. Иначе на листе «Решение» стоит
// склад, которого нет в смете, — так уже было в их старых КП.

import { fail, requireSession } from "@/lib/kp/guard";
import { bridgeAlive, bridgeCall, bridgeEnabled, BridgeError } from "@/lib/kp/bridge";
import { getPlainKey } from "@/lib/kp/settings";
import { GOOGLE_IMAGE_MODELS } from "@/lib/kp/models";

export async function POST(req: Request) {
  try {
    requireSession(req);

    const key = await getPlainKey("google");
    if (!key && !bridgeEnabled()) {
      return Response.json(
        { error: "Не подключён ключ Google. Откройте «Ключи» и добавьте его." },
        { status: 412 }
      );
    }

    const body = (await req.json().catch(() => ({}))) as {
      rows?: unknown; sections?: unknown; levels?: unknown;
      width?: unknown; depth?: unknown; ceiling?: unknown;
      truck?: unknown; product?: unknown;
    };

    const prompt = buildPrompt({
      rows: clampInt(body.rows, 1, 60, 6),
      sections: clampInt(body.sections, 1, 400, 40),
      levels: clampInt(body.levels, 1, 6, 3),
      width: clampInt(body.width, 3000, 400_000, 45_000),
      depth: clampInt(body.depth, 3000, 400_000, 24_000),
      ceiling: clampInt(body.ceiling, 2500, 30_000, 10_500),
      truck: typeof body.truck === "string" ? body.truck.slice(0, 40) : "reachtruck",
      product: typeof body.product === "string" ? body.product.slice(0, 80) : "паллетные стеллажи",
    });

    // Ключа компании нет — кадр рисует Higgsfield на аккаунте владельца.
    // Тот же промпт, тот же ответ формата data:URL: кабинет разницы не видит.
    if (!key) return viaBridge(prompt);

    try {
      return Response.json({ ok: true, image: await viaGoogle(key, prompt) });
    } catch (e) {
      if (!(e instanceof ImageError)) throw e;
      // Ключ компании отказал по своей вине — лимит, баланс, доступ, модель.
      // Если мак владельца на связи, кадр рисует мост: менеджеру нужен кадр в КП,
      // а не совет пополнить чужой баланс в AI Studio.
      if (bridgeEnabled() && (await bridgeAlive())) {
        console.warn("[kp/image] ключ Google отказал, кадр рисует мост:", e.message);
        return viaBridge(prompt);
      }
      return Response.json({ error: e.message }, { status: e.status });
    }
  } catch (e) {
    return fail(e, "Не удалось собрать изображение");
  }
}

class ImageError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function viaBridge(prompt: string): Promise<Response> {
  try {
    const image = await bridgeCall<string>("image", { prompt });
    return Response.json({ ok: true, image });
  } catch (e) {
    if (e instanceof BridgeError) return Response.json({ error: e.message }, { status: e.status });
    throw e;
  }
}

async function viaGoogle(key: string, prompt: string): Promise<string> {
  // Картиночные модели Google уезжают из каталога вместе с поколением,
  // и тогда рабочая кнопка внезапно отвечает 404. Поэтому список, а не
  // одна модель: на 404 берётся следующая, остальные ошибки — настоящие.
  let res: Response | null = null;
  for (const model of GOOGLE_IMAGE_MODELS) {
    try {
      res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(110_000),
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseModalities: ["IMAGE"],
              imageConfig: { aspectRatio: "16:9", imageSize: "2K" },
            },
          }),
        }
      );
    } catch {
      throw new ImageError(504, "Google не ответил за две минуты. Повторите.");
    }
    if (res.status !== 404) break;
  }
  if (!res) throw new ImageError(502, "Google не ответил. Повторите через минуту.");

  if (!res.ok) {
    if (res.status === 400 || res.status === 401 || res.status === 403) {
      throw new ImageError(502, "Ключ Google не принят. Проверьте его в разделе «Ключи».");
    }
    if (res.status === 429) {
      throw new ImageError(502, "Лимит Google исчерпан или кончились кредиты аккаунта. Проверьте баланс в AI Studio.");
    }
    if (res.status === 404) {
      throw new ImageError(502, "Google не даёт этому ключу картиночные модели. Включите их в проекте AI Studio.");
    }
    console.error("[kp/image]", res.status, await res.text().catch(() => ""));
    throw new ImageError(502, "Google вернул ошибку. Повторите через минуту.");
  }

  const data = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ inlineData?: { data?: string; mimeType?: string } }> } }>;
  };
  const part = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
  if (!part?.inlineData?.data) throw new ImageError(502, "Модель не вернула изображение. Повторите.");

  return `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`;
}

const TRUCK_RU: Record<string, string> = {
  reachtruck: "ричтрак",
  counterbalance: "фронтальный погрузчик",
  stacker: "штабелёр",
  vna: "узкопроходный штабелёр",
};

function buildPrompt(o: {
  rows: number; sections: number; levels: number;
  width: number; depth: number; ceiling: number;
  truck: string; product: string;
}): string {
  return [
    "Фотореалистичный интерьер современного складского комплекса, широкоугольный кадр от пола, высота камеры 1,7 м.",
    `Помещение ${(o.width / 1000).toFixed(0)} на ${(o.depth / 1000).toFixed(0)} метров, потолок ${(o.ceiling / 1000).toFixed(1)} м, светлые стены, наливной бетонный пол с разметкой проездов.`,
    `В кадре ${o.rows} параллельных ряда металлических стеллажей (${o.product}), в каждом ярусе видно ${o.levels} уровня балок с паллетами.`,
    "Рамы стеллажей — синяя порошковая окраска, балки — оранжевые, ровно как на объектах RAX PRO; груз на европаллетах в стретч-плёнке.",
    `В проходе — ${TRUCK_RU[o.truck] || "ричтрак"}.`,
    "Освещение: линейные светодиодные светильники под потолком, нейтральный белый свет, мягкие тени, без пересветов.",
    "Стиль: промышленная архитектурная фотография, полный кадр в фокусе, без людей, без текста, без логотипов, без водяных знаков.",
  ].join(" ");
}

function clampInt(v: unknown, lo: number, hi: number, fallback: number): number {
  const n = Math.round(Number(v));
  if (!Number.isFinite(n)) return fallback;
  return Math.min(hi, Math.max(lo, n));
}
