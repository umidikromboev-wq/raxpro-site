export const runtime = 'nodejs';
export const maxDuration = 60;

// Готовый PDF одной кнопкой.
//
// Раньше менеджер жал «Печать» и сам выбирал «Сохранить как PDF»: поля,
// масштаб и колонтитулы у каждого получались свои, и один и тот же документ
// выглядел по-разному у разных сотрудников. Здесь тот же самый /kp
// открывается в headless-браузере на сервере с фиксированными полями,
// поэтому все КП выходят одинаковыми.

const PRINT_KEY = 'raxpro-kp-print';

async function launch() {
  // На Vercel — собранный под serverless chromium. Локально — обычный Chrome,
  // который уже стоит на машине: тащить второй бинарник в dev незачем.
  if (process.env.VERCEL) {
    const chromium = (await import('@sparticuz/chromium')).default;
    const puppeteer = await import('puppeteer-core');
    return puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }
  const puppeteer = await import('puppeteer-core');
  const local = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    process.env.CHROME_PATH,
  ].filter(Boolean);
  const fs = await import('node:fs');
  const executablePath = local.find((p) => fs.existsSync(p));
  if (!executablePath) throw new Error('Локальный Chrome не найден — задайте CHROME_PATH');
  return puppeteer.launch({ executablePath, headless: true });
}

export async function POST(req) {
  const expected = process.env.KP_PASSWORD;
  const cookie = req.headers.get('cookie') || '';
  const authed = expected && cookie.includes(`kp_auth=${encodeURIComponent(expected.slice(0, 8))}`);
  if (!authed) return Response.json({ error: 'Нет доступа' }, { status: 401 });

  let payload;
  try {
    payload = await req.json();
  } catch {
    return Response.json({ error: 'Не разобрал данные КП' }, { status: 400 });
  }
  const fileName = String(payload?.number || 'KP').replace(/[^\w.-]/g, '') + '.pdf';

  const origin = new URL(req.url).origin;
  let browser;
  try {
    browser = await launch();
    const page = await browser.newPage();

    await page.setCookie({
      name: 'kp_auth',
      value: encodeURIComponent(expected.slice(0, 8)),
      url: origin,
      path: '/',
    });

    const json = JSON.stringify(payload);
    await page.evaluateOnNewDocument(
      (key, data) => {
        try { window.localStorage.setItem(key, data); } catch {}
      },
      PRINT_KEY,
      json
    );

    await page.goto(`${origin}/kp?print=1`, { waitUntil: 'networkidle0', timeout: 45000 });
    await page.waitForSelector('.kp-page', { timeout: 20000 });
    // шрифты Google подгружаются отдельно — без ожидания в PDF уезжает вёрстка
    await page.evaluate(() => document.fonts.ready);

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '14mm', right: '14mm', bottom: '14mm', left: '14mm' },
      preferCSSPageSize: true,
    });

    return new Response(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (e) {
    return Response.json(
      { error: `Не удалось собрать PDF: ${e?.message || e}` },
      { status: 500 }
    );
  } finally {
    await browser?.close().catch(() => {});
  }
}
