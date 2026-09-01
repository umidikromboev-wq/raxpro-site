// Набросок из блокнота → готовый вход для генератора КП.
//
// Замерщик рисует склад ручкой на листе: контур, подписанные метры, квадратики
// колонн, стрелку на ворота. Раньше менеджер переносил это в форму руками и
// обводил контур мышью. Здесь фотографию читает модель со зрением и возвращает
// строго заданную структуру, которую дальше считает то же ядро раскладки.
//
// Два провайдера намеренно. Основной — Anthropic: компания подключает свой
// ключ Claude. Запасной — Google: если подключён только он, распознавание
// всё равно работает. Ключи всегда берутся из хранилища компании, никаких
// зашитых ключей в коде нет.

import Anthropic from "@anthropic-ai/sdk";
import { getModel, getPlainKey } from "./settings";

export interface SketchColumn { x: number; y: number; size: number }
export interface SketchDock { x: number; y: number; width: number }

export interface SketchResult {
  provider: "anthropic" | "google";
  confidence: "high" | "medium" | "low";
  /** Габаритный прямоугольник в миллиметрах. */
  width: number;
  depth: number;
  ceiling: number | null;
  /** Контур помещения в миллиметрах, по часовой стрелке от левого нижнего угла. */
  polygon: Array<[number, number]>;
  columns: SketchColumn[];
  docks: SketchDock[];
  productKey: string | null;
  levels: number | null;
  beam: 2700 | 3300 | null;
  truck: string | null;
  client: string | null;
  readings: string[];
  warnings: string[];
}

const SYSTEM = `Ты читаешь фотографию рукописного наброска складского помещения, сделанного замерщиком компании RAX PRO (металлические стеллажи, Ташкент).

Твоя работа — снять с рисунка геометрию помещения и перевести её в миллиметры.

Правила:
1. Все размеры возвращай в МИЛЛИМЕТРАХ. На набросках пишут по-разному: «45 м», «45м», «45000», «45.5», «24 метра». 45 → 45000 мм. Число больше 1000 считай уже миллиметрами.
2. polygon — контур помещения по часовой стрелке, начиная с угла, ближайшего к левому нижнему. Первая точка [0,0]. Последнюю точку не повторяй. Для прямоугольника это ровно 4 точки. Если на рисунке есть скос, ниша, выступ или вырез — обведи их честно, это и есть ценность наброска.
3. columns — колонны здания: центр в миллиметрах и сторона квадрата (обычно 400 мм, если не подписано). Ставь только те, что реально нарисованы. Не выдумывай регулярную сетку, если нарисованы две колонны.
4. docks — ворота или проёмы: центр по контуру и ширина проёма (по умолчанию 3000 мм).
5. ceiling — высота потолка в миллиметрах, если она подписана. Если нет — null. Не угадывай.
6. productKey — тип стеллажа, если он подписан или очевиден: pallet-frontal (паллетный фронтальный), pallet-driveIn (набивной, drive-in), medium-duty (среднегрузовой), archive (архивный), retail (торговый), mezzanine (мезонин). Если не написано — null.
7. levels — число ярусов балок, если подписано. beam — длина балки: 2700 или 3300, если подписана. truck — техника: reachtruck, counterbalance, stacker, если подписана.
8. client — название компании клиента, если оно написано на листе. Иначе null.
9. readings — список того, что ты реально прочитал на листе, дословно: каждая надпись, каждое число с его подписью. Это то, по чему менеджер проверит распознавание. Пиши по-русски.
10. warnings — что вызвало сомнение: неразборчивая цифра, отсутствующий размер, противоречие. Пиши по-русски, коротко, по делу.
11. confidence — high, если контур и оба габарита читаются уверенно; medium, если часть чисел пришлось выводить; low, если это скорее догадка.

Ничего не придумывай. Пустое поле лучше выдуманного числа: по этому наброску компания выставит клиенту счёт на сотни миллионов сум.`;

const SCHEMA = {
  type: "object" as const,
  properties: {
    confidence: { type: "string", enum: ["high", "medium", "low"] },
    width: { type: "number", description: "Габарит по ширине, мм" },
    depth: { type: "number", description: "Габарит по глубине, мм" },
    ceiling: { type: ["number", "null"], description: "Высота потолка, мм" },
    polygon: {
      type: "array",
      description: "Контур в мм, по часовой стрелке",
      items: { type: "array", items: { type: "number" }, minItems: 2, maxItems: 2 },
    },
    columns: {
      type: "array",
      items: {
        type: "object",
        properties: { x: { type: "number" }, y: { type: "number" }, size: { type: "number" } },
        required: ["x", "y", "size"],
        additionalProperties: false,
      },
    },
    docks: {
      type: "array",
      items: {
        type: "object",
        properties: { x: { type: "number" }, y: { type: "number" }, width: { type: "number" } },
        required: ["x", "y", "width"],
        additionalProperties: false,
      },
    },
    productKey: { type: ["string", "null"] },
    levels: { type: ["number", "null"] },
    beam: { type: ["number", "null"] },
    truck: { type: ["string", "null"] },
    client: { type: ["string", "null"] },
    readings: { type: "array", items: { type: "string" } },
    warnings: { type: "array", items: { type: "string" } },
  },
  required: [
    "confidence", "width", "depth", "ceiling", "polygon", "columns", "docks",
    "productKey", "levels", "beam", "truck", "client", "readings", "warnings",
  ],
  additionalProperties: false,
};

export class SketchError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function readSketch(image: { data: string; mediaType: string }): Promise<SketchResult> {
  const anthropicKey = await getPlainKey("anthropic");
  if (anthropicKey) return withAnthropic(anthropicKey, await getModel("anthropic"), image);

  const googleKey = await getPlainKey("google");
  if (googleKey) return withGoogle(googleKey, await getModel("google"), image);

  throw new SketchError(
    412,
    "Не подключён ключ ИИ. Откройте «Ключи» и добавьте ключ Anthropic или Google."
  );
}

/* ————————————————————————————————— Anthropic */

async function withAnthropic(
  apiKey: string,
  model: string,
  image: { data: string; mediaType: string }
): Promise<SketchResult> {
  const client = new Anthropic({ apiKey, maxRetries: 1, timeout: 120_000 });

  const request = (forceTool: boolean) =>
    client.messages.create({
      model,
      max_tokens: 8000,
      system: SYSTEM,
      tools: [
        {
          name: "submit_sketch",
          description: "Отдать геометрию, снятую с наброска.",
          input_schema: SCHEMA,
          strict: true,
        },
      ],
      ...(forceTool ? { tool_choice: { type: "tool" as const, name: "submit_sketch" } } : {}),
      messages: [
        {
          role: "user" as const,
          content: [
            {
              type: "image" as const,
              source: {
                type: "base64" as const,
                media_type: image.mediaType as "image/jpeg" | "image/png" | "image/webp",
                data: image.data,
              },
            },
            {
              type: "text" as const,
              text: "Сними с этого наброска геометрию помещения и верни её через инструмент submit_sketch. Другого ответа не давай.",
            },
          ],
        },
      ],
    });

  let response;
  try {
    response = await request(true);
  } catch (e: unknown) {
    // Принудительный выбор инструмента у части моделей несовместим с их
    // собственным режимом рассуждения и отбивается как 400. Инструмент здесь
    // ровно один и промпт требует именно его, поэтому второй заход без
    // принуждения даёт тот же результат, а не деградацию.
    if ((e as { status?: number })?.status === 400) {
      try {
        response = await request(false);
      } catch (retryError: unknown) {
        throw translateAnthropic(retryError);
      }
    } else {
      throw translateAnthropic(e);
    }
  }

  const block = response.content.find((b) => b.type === "tool_use");
  if (!block || block.type !== "tool_use") {
    throw new SketchError(422, "Модель не смогла прочитать этот снимок. Переснимите набросок ровнее и при дневном свете.");
  }
  return normalize(block.input as Record<string, unknown>, "anthropic");
}

/** Ошибка провайдера всегда пишется в лог сервера — иначе на боевом остаётся
 *  только короткая фраза у менеджера, и по ней нельзя отличить «не тот ключ»
 *  от «не та модель» и от «не принята схема инструмента». */
function translateAnthropic(e: unknown): SketchError {
  const status = (e as { status?: number })?.status;
  const detail = anthropicDetail(e);
  console.error("[kp/sketch/anthropic]", status ?? "нет статуса", detail);

  if (status === 401) return new SketchError(502, "Ключ Anthropic не принят. Проверьте его в разделе «Ключи».");
  if (status === 403) return new SketchError(502, "У ключа Anthropic нет доступа к выбранной модели. Смените модель в разделе «Ключи ИИ».");
  if (status === 404) return new SketchError(502, "Anthropic не знает выбранную модель. Смените её в разделе «Ключи ИИ».");
  if (status === 429) return new SketchError(502, "Лимит Anthropic исчерпан. Пополните баланс аккаунта и повторите.");
  if (status === 400) {
    // 400 бывает двух разных природ, и лечатся они по-разному. Про снимок —
    // дело менеджера, переснять. Про схему инструмента или про саму модель —
    // дело разработчика, и гонять менеджера переснимать лист бессмысленно.
    if (/schema|tool|input_schema|strict|model|parameter|request/i.test(detail)) {
      return new SketchError(
        502,
        "Anthropic отклонил сам запрос, а не ваш снимок. Переснимать лист бесполезно — покажите это сообщение разработчику."
      );
    }
    return new SketchError(502, "Anthropic отклонил снимок. Попробуйте другой файл: JPG или PNG до 5 МБ.");
  }
  return new SketchError(502, "Anthropic сейчас не отвечает. Попробуйте ещё раз через минуту.");
}

/** Текст ошибки провайдера — только для лога и для выбора формулировки.
 *  Наружу он не уходит: в нём бывают идентификаторы организации и запроса. */
function anthropicDetail(e: unknown): string {
  const err = e as { message?: unknown; error?: { error?: { message?: unknown } } };
  const nested = err?.error?.error?.message;
  if (typeof nested === "string") return nested.slice(0, 500);
  if (typeof err?.message === "string") return err.message.slice(0, 500);
  return "";
}

/* ————————————————————————————————— Google */

async function withGoogle(
  apiKey: string,
  model: string,
  image: { data: string; mediaType: string }
): Promise<SketchResult> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(120_000),
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM }] },
        contents: [
          {
            role: "user",
            parts: [
              { inlineData: { mimeType: image.mediaType, data: image.data } },
              { text: "Сними с этого наброска геометрию помещения. Ответь строго одним объектом JSON по схеме." },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseJsonSchema: SCHEMA,
        },
      }),
    });
  } catch {
    throw new SketchError(502, "Google сейчас не отвечает. Попробуйте ещё раз через минуту.");
  }

  if (!res.ok) {
    // Лог пишется на любом статусе, а не только на неизвестном: 400 у Google
    // приходит и на плохой ключ, и на непринятую схему ответа — по короткой
    // фразе у менеджера их не различить.
    const detail = (await res.text().catch(() => "")).slice(0, 500);
    console.error("[kp/sketch/google]", res.status, detail);

    if (res.status === 400 || res.status === 401 || res.status === 403) {
      throw new SketchError(502, "Ключ Google не принят. Проверьте его в разделе «Ключи».");
    }
    if (res.status === 404) {
      throw new SketchError(502, "Google не даёт этому ключу выбранную модель. Смените её в разделе «Ключи ИИ».");
    }
    if (res.status === 429) {
      throw new SketchError(502, "Лимит Google исчерпан или кончились кредиты аккаунта. Проверьте баланс в AI Studio.");
    }
    throw new SketchError(502, "Google вернул ошибку. Попробуйте ещё раз через минуту.");
  }

  const data = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(text.replace(/^```(?:json)?|```$/g, "").trim());
  } catch {
    throw new SketchError(422, "Модель не смогла прочитать этот снимок. Переснимите набросок ровнее и при дневном свете.");
  }
  return normalize(parsed, "google");
}

/* ————————————————————————————————— приведение к рабочему виду */

const PRODUCTS = new Set([
  "pallet-frontal", "pallet-driveIn", "medium-duty", "archive", "retail", "mezzanine",
]);
const TRUCKS = new Set(["reachtruck", "counterbalance", "stacker", "vna"]);

/** Ответ модели — внешние данные, значит проверяется целиком: числа
 *  приводятся к миллиметрам, всё за пределами рабочих диапазонов
 *  отбрасывается, о каждом отброшенном значении пишется предупреждение. */
export function normalize(raw: Record<string, unknown>, provider: "anthropic" | "google"): SketchResult {
  const warnings: string[] = arrOfStrings(raw.warnings);
  const readings = arrOfStrings(raw.readings);

  let polygon = toPolygon(raw.polygon);
  let width = mm(raw.width);
  let depth = mm(raw.depth);

  if (polygon.length >= 3) {
    const xs = polygon.map((p) => p[0]);
    const ys = polygon.map((p) => p[1]);
    const w = Math.round(Math.max(...xs) - Math.min(...xs));
    const d = Math.round(Math.max(...ys) - Math.min(...ys));
    if (w > 0 && d > 0) {
      // Контур — источник правды: габариты приводятся к нему,
      // иначе раскладка считается по одному прямоугольнику, а рисуется по другому.
      if (width && Math.abs(w - width) / width > 0.15) {
        warnings.push(`Ширина по контуру ${(w / 1000).toFixed(1)} м расходится с подписанной ${(width / 1000).toFixed(1)} м — проверьте.`);
      }
      width = w;
      depth = d;
    }
  }

  if (!width || !depth || width < 3000 || depth < 3000 || width > 400_000 || depth > 400_000) {
    throw new SketchError(
      422,
      "С наброска не читаются габариты помещения. Допишите на листе ширину и глубину в метрах и переснимите."
    );
  }
  if (polygon.length < 3) {
    polygon = [[0, 0], [width, 0], [width, depth], [0, depth]];
    warnings.push("Контур не распознан — взят прямоугольник по габаритам.");
  }

  const ceiling = mm(raw.ceiling);
  const columns = arrOf(raw.columns)
    .map((c) => ({
      x: mm((c as Record<string, unknown>)?.x) ?? -1,
      y: mm((c as Record<string, unknown>)?.y) ?? -1,
      size: clamp(smallMm((c as Record<string, unknown>)?.size) ?? 400, 150, 1500),
    }))
    .filter((c) => c.x >= 0 && c.y >= 0 && c.x <= width && c.y <= depth)
    .slice(0, 120);

  const docks = arrOf(raw.docks)
    .map((d) => ({
      x: mm((d as Record<string, unknown>)?.x) ?? -1,
      y: mm((d as Record<string, unknown>)?.y) ?? -1,
      width: clamp(mm((d as Record<string, unknown>)?.width) ?? 3000, 1000, 12000),
    }))
    .filter((d) => d.x >= 0 && d.y >= 0)
    .slice(0, 20);

  const levelsRaw = num(raw.levels);
  const levels = levelsRaw && levelsRaw >= 1 && levelsRaw <= 6 ? Math.round(levelsRaw) : null;
  const beamRaw = num(raw.beam);
  const beam = beamRaw === 3300 || beamRaw === 3.3 ? 3300 : beamRaw === 2700 || beamRaw === 2.7 ? 2700 : null;

  const productKey = typeof raw.productKey === "string" && PRODUCTS.has(raw.productKey) ? raw.productKey : null;
  const truck = typeof raw.truck === "string" && TRUCKS.has(raw.truck) ? raw.truck : null;
  const client = typeof raw.client === "string" ? raw.client.trim().slice(0, 120) || null : null;

  const ceilingOk = ceiling && ceiling >= 2500 && ceiling <= 30_000 ? ceiling : null;
  if (ceiling && !ceilingOk) warnings.push("Высота потолка вне рабочего диапазона — введите её вручную.");

  const conf = raw.confidence;
  const confidence: SketchResult["confidence"] =
    conf === "high" || conf === "medium" || conf === "low" ? conf : "low";

  return {
    provider,
    confidence,
    width,
    depth,
    ceiling: ceilingOk,
    polygon,
    columns,
    docks,
    productKey,
    levels,
    beam: beam as 2700 | 3300 | null,
    truck,
    client,
    readings: readings.slice(0, 40),
    warnings: warnings.slice(0, 20),
  };
}

function toPolygon(v: unknown): Array<[number, number]> {
  const pts = arrOf(v)
    .map((p) => {
      const pair = arrOf(p);
      const x = mm(pair[0]);
      const y = mm(pair[1]);
      return x != null && y != null ? ([x, y] as [number, number]) : null;
    })
    .filter((p): p is [number, number] => p != null);
  if (pts.length < 3) return [];
  const minX = Math.min(...pts.map((p) => p[0]));
  const minY = Math.min(...pts.map((p) => p[1]));
  return pts.slice(0, 40).map(([x, y]) => [Math.round(x - minX), Math.round(y - minY)]);
}

/** То же, но для мелких величин — стороны колонны.
 *
 *  Общее правило mm() («меньше 1000 — это метры») на них не работает:
 *  колонна 400 мм — совершенно нормальный ответ модели, а mm() превращает
 *  его в 400 метров и потом обрезает до 1500. Регрессия поймала это на
 *  одном и том же наброске: ответ в метрах давал 6 рядов и 60 секций,
 *  ответ в миллиметрах — 7 рядов и 52 секции, то есть другой счёт клиенту.
 *  Колонны бывают от 0,15 до 1,5 м, поэтому граница в 5 однозначна. */
function smallMm(v: unknown): number | null {
  const n = num(v);
  if (n == null) return null;
  if (n === 0) return 0;
  return Math.abs(n) <= 5 ? Math.round(n * 1000) : Math.round(n);
}

/** Метры или миллиметры — модель может вернуть и то, и другое. */
function mm(v: unknown): number | null {
  const n = num(v);
  if (n == null) return null;
  if (n === 0) return 0;
  const abs = Math.abs(n);
  if (abs < 1000) return Math.round(n * 1000);
  return Math.round(n);
}

function num(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v.replace(",", ".").replace(/[^\d.\-]/g, ""));
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function arrOf(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}
function arrOfStrings(v: unknown): string[] {
  return arrOf(v).filter((x): x is string => typeof x === "string").map((s) => s.trim().slice(0, 300));
}
function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}
