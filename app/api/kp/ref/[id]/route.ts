export const runtime = "nodejs";

// Снимок 3D-модели для генератора кадра.
//
// Единственный маршрут кабинета без сессии, и это осознанно: картинку забирает
// не браузер менеджера, а генератор изображений на стороне провайдера, который
// куки кабинета не носит. Наружу уходит только то, что мост сам туда положил
// минуту назад: серый каркас склада без цен, имён и контактов. Идентификатор
// случайный, файл удаляется сразу после генерации.

import { readBinary } from "@/lib/kp/store";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  if (!/^[a-z0-9]{8,40}$/.test(id)) return new Response("Не найдено", { status: 404 });

  try {
    const file = await readBinary(`bridge/ref/${id}.jpg`);
    if (!file) return new Response("Не найдено", { status: 404 });
    return new Response(file.body, {
      headers: {
        "Content-Type": file.contentType,
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex",
      },
    });
  } catch {
    return new Response("Не найдено", { status: 404 });
  }
}
