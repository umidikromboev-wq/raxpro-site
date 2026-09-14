export const runtime = "nodejs";
export const maxDuration = 120;

// Готовый PDF одной кнопкой.
//
// Раньше менеджер жал «Печать» и сам выбирал «Сохранить как PDF»: поля, масштаб
// и колонтитулы у каждого получались свои, и один документ выглядел по-разному
// у разных сотрудников. Здесь та же страница /kp открывается в headless-браузере
// на сервере с фиксированными полями, поэтому все КП выходят одинаковыми.

import { fail, requireSession, SESSION_COOKIE } from "@/lib/kp/guard";

const PRINT_KEY = "raxpro-kp-print";

type Browser = { newPage: () => Promise<Page>; close: () => Promise<void> };
type Page = {
  setCookie: (c: Record<string, unknown>) => Promise<void>;
  evaluateOnNewDocument: (fn: (k: string, d: string) => void, k: string, d: string) => Promise<void>;
  goto: (url: string, opts: Record<string, unknown>) => Promise<unknown>;
  waitForSelector: (sel: string, opts: Record<string, unknown>) => Promise<unknown>;
  evaluate: <T>(fn: () => T | Promise<T>) => Promise<T>;
  pdf: (opts: Record<string, unknown>) => Promise<Buffer>;
};

async function launch(): Promise<Browser> {
  // На Vercel — собранный под serverless chromium. Локально — обычный Chrome,
  // который уже стоит на машине: тащить второй бинарник в dev незачем.
  if (process.env.VERCEL) {
    const chromium = (await import("@sparticuz/chromium")).default;
    const puppeteer = await import("puppeteer-core");
    return puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    }) as unknown as Promise<Browser>;
  }
  const puppeteer = await import("puppeteer-core");
  const local = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    process.env.CHROME_PATH,
  ].filter(Boolean) as string[];
  const fs = await import("node:fs");
  const executablePath = local.find((p) => fs.existsSync(p));
  if (!executablePath) throw new Error("Локальный Chrome не найден — задайте CHROME_PATH");
  return puppeteer.launch({ executablePath, headless: true }) as unknown as Promise<Browser>;
}

type ImageReport = { total: number; loaded: number; missing: string[]; waitedMs: number };

/** Выполняется внутри страницы: все картинки переводятся в eager, документ
 *  прокручивается лист за листом (ленивые снимки иначе не стартуют без
 *  прокрутки), затем ждём загрузку и декодирование каждой. */
function waitForImages(): Promise<ImageReport> {
  const CAP_MS = 45000;
  const STEP_MS = 120;
  const started = Date.now();
  const imgs = Array.from(document.images);
  imgs.forEach((img) => {
    img.loading = "eager";
  });
  const pages = Array.from(document.querySelectorAll(".kp-page"));
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const allDone = () => imgs.every((img) => img.complete);
  const finish = async (): Promise<ImageReport> => {
    await Promise.all(imgs.map((img) => img.decode().catch(() => undefined)));
    const missing = imgs
      .filter((img) => !img.complete || img.naturalWidth === 0)
      .map((img) => (img.getAttribute("src") || "").slice(0, 80));
    return { total: imgs.length, loaded: imgs.length - missing.length, missing, waitedMs: Date.now() - started };
  };
  return (async () => {
    for (const p of pages) {
      p.scrollIntoView();
      await sleep(STEP_MS);
    }
    window.scrollTo(0, 0);
    while (!allDone() && Date.now() - started < CAP_MS) await sleep(STEP_MS);
    return finish();
  })();
}

function parseImageReport(raw: unknown): ImageReport {
  const r = (raw ?? {}) as Partial<ImageReport>;
  return {
    total: Number(r.total) || 0,
    loaded: Number(r.loaded) || 0,
    missing: Array.isArray(r.missing) ? r.missing.map(String) : [],
    waitedMs: Number(r.waitedMs) || 0,
  };
}

export async function POST(req: Request) {
  let browser: Browser | undefined;
  try {
    requireSession(req);

    let payload: Record<string, unknown>;
    try {
      payload = (await req.json()) as Record<string, unknown>;
    } catch {
      return Response.json({ error: "Не разобрал данные КП" }, { status: 400 });
    }
    const fileName = String(payload?.number || "KP").replace(/[^\w.-]/g, "") + ".pdf";

    // Сессия менеджера передаётся в headless-браузер как есть: страница /kp
    // закрыта тем же входом, и без cookie сервер откроет форму входа.
    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader.match(/(?:^|;\s*)kp_session=([^;]+)/)?.[1] ?? "";
    const origin = new URL(req.url).origin;

    browser = await launch();
    const page = await browser.newPage();
    await page.setCookie({ name: SESSION_COOKIE, value: token, url: origin, path: "/" });

    const json = JSON.stringify(payload);
    await page.evaluateOnNewDocument(
      (key: string, data: string) => {
        try {
          window.localStorage.setItem(key, data);
        } catch {}
      },
      PRINT_KEY,
      json
    );

    await page.goto(`${origin}/kp?print=1`, { waitUntil: "networkidle0", timeout: 60000 });
    await page.waitForSelector(".kp-doc[data-ready='1'] .kp-page", { timeout: 25000 });
    // шрифты Google подгружаются отдельно — без ожидания в PDF уезжает вёрстка
    await page.evaluate(() => document.fonts.ready);
    // и картинки: networkidle0 срабатывает раньше, чем начнут грузиться снимки
    // объектов и портрет, и на их месте в файл уходил серый прямоугольник.
    const images = parseImageReport(await page.evaluate(waitForImages));

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
      preferCSSPageSize: true,
    });

    return new Response(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store",
        // Отчёт для приёмки: сколько картинок дождались и какие не пришли.
        "X-KP-Images": `${images.loaded}/${images.total}`,
        "X-KP-Images-Missing": images.missing.join(",") || "-",
        "X-KP-Images-Wait-Ms": String(images.waitedMs),
      },
    });
  } catch (e) {
    return fail(e, "Не удалось собрать PDF. Попробуйте ещё раз — первый запуск браузера занимает до полуминуты.");
  } finally {
    await browser?.close().catch(() => {});
  }
}
