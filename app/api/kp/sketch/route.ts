export const runtime = "nodejs";
export const maxDuration = 120;

// Распознавание наброска из блокнота.
//
// Приходит фотография листа, уходит геометрия помещения в миллиметрах. Ключ
// берётся из хранилища компании — своего ключа у продукта нет и быть не должно.

import { fail, requireSession } from "@/lib/kp/guard";
import { readSketch, SketchError } from "@/lib/kp/sketch";

const MAX_BYTES = 6 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(req: Request) {
  try {
    requireSession(req);

    const body = (await req.json().catch(() => ({}))) as { image?: unknown };
    if (typeof body.image !== "string" || !body.image.startsWith("data:")) {
      return Response.json({ error: "Не пришёл файл наброска" }, { status: 400 });
    }

    const match = body.image.match(/^data:([\w/+.-]+);base64,([A-Za-z0-9+/=]+)$/);
    if (!match) {
      return Response.json({ error: "Формат файла не поддержан. Нужен JPG, PNG или WEBP." }, { status: 400 });
    }
    const [, mediaType, data] = match;
    if (!ALLOWED.has(mediaType)) {
      return Response.json({ error: "Формат файла не поддержан. Нужен JPG, PNG или WEBP." }, { status: 400 });
    }
    // base64 весит на треть больше исходника — считаем реальные байты.
    if ((data.length * 3) / 4 > MAX_BYTES) {
      return Response.json({ error: "Снимок тяжелее 6 МБ. Сфотографируйте лист покрупнее, но с меньшим разрешением." }, { status: 413 });
    }

    const result = await readSketch({ data, mediaType });
    return Response.json({ ok: true, sketch: result });
  } catch (e) {
    if (e instanceof SketchError) {
      return Response.json({ error: e.message }, { status: e.status });
    }
    return fail(e, "Не удалось прочитать набросок");
  }
}
