// Сбор реальных экранов для презентаций: старый сайт против нового.
//
// Запуск: node deck/shots.mjs [old|new|all]
// Кладёт в deck/shots/<группа>/NN-<имя>.png
//
// Почему поблочно, а не одной простынёй: в презентации каждый блок живёт на
// своей полосе рядом с объяснением, зачем он нужен. Полная простыня тоже
// снимается — для полосы «до и после».

import { chromium } from '/Users/umidikromboev/.claude/tools/site-qa/node_modules/playwright/index.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const OLD = 'https://raxpro.uz';
const NEW = 'https://raxpro-site-git-feat-site-v3-umid-s-projects.vercel.app';
const OUT = path.join(process.cwd(), 'deck/shots');

const DESKTOP = { width: 1600, height: 1000 };
const PHONE = { width: 390, height: 844 };

const which = process.argv[2] || 'all';

/** Дать странице догрузить шрифты, картинки и доиграть reveal-анимации. */
async function settle(page, ms = 2500) {
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => r())));
  await page.waitForTimeout(ms);
}

/** Прокрутить всю страницу до низа и вернуться: иначе lazy-картинки и
 *  IntersectionObserver-блоки останутся пустыми на снимке. */
async function wakeLazy(page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 180));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);
}

/** Убрать с кадра всё, что висит поверх страницы: липкую шапку и кнопку чата.
 *  Иначе на снимке блока из середины страницы поперёк лежит меню. */
async function hideOverlays(page) {
  await page.addStyleTag({
    content: `
      header, [class*="sticky"], [class*="fixed"] { position: static !important; }
      header[class*="fixed"], header[class*="sticky"] { display: none !important; }
      [class*="z-[9"], [class*="z-50"] { display: none !important; }
    `,
  }).catch(() => {});
  await page.evaluate(() => {
    for (const el of document.querySelectorAll('body *')) {
      const s = getComputedStyle(el);
      if (s.position === 'fixed' || s.position === 'sticky') el.style.setProperty('display', 'none', 'important');
    }
  });
  await page.waitForTimeout(400);
}

async function shootSections(page, dir, prefix) {
  const boxes = await page.evaluate(() => {
    const out = [];
    let i = 0;
    for (const el of document.querySelectorAll('body > div > section, body > div > header, body > div > footer, main > section')) {
      const r = el.getBoundingClientRect();
      if (r.height < 120) continue;
      const id = el.id || el.getAttribute('aria-labelledby') || `block-${i}`;
      el.setAttribute('data-shot', String(i));
      out.push({ i, id, h: Math.round(r.height) });
      i++;
    }
    return out;
  });
  for (const b of boxes) {
    const el = await page.$(`[data-shot="${b.i}"]`);
    if (!el) continue;
    const name = `${prefix}${String(b.i).padStart(2, '0')}-${b.id.replace(/[^a-z0-9-]/gi, '_')}.png`;
    await el.scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(700);
    await el.screenshot({ path: path.join(dir, name) }).catch((e) => console.log('  пропуск', name, e.message));
    console.log('  ✓', name, `${b.h}px`);
  }
  return boxes;
}

async function run() {
  const browser = await chromium.launch();

  const jobs = [];
  if (which === 'all' || which === 'old') {
    jobs.push({ group: 'old', url: `${OLD}/ru`, sections: true, full: true, phone: true });
  }
  if (which === 'all' || which === 'new') {
    jobs.push({ group: 'new', url: `${NEW}/ru`, sections: true, full: true, phone: true });
    jobs.push({ group: 'hero', url: `${NEW}/ru`, heroOnly: true, name: '01-hero-3d' });
    jobs.push({ group: 'hero', url: `${NEW}/ru?hero=video`, heroOnly: true, name: '02-hero-video' });
    jobs.push({ group: 'hero', url: `${NEW}/ru?hero=mp4`, heroOnly: true, name: '03-hero-mp4' });
    for (const [n, p] of [
      ['01-katalog', '/ru/katalog'], ['02-konstruktor', '/ru/konstruktor'],
      ['03-napravleniya', '/ru/napravleniya/palletnye-stellazhi'],
      ['04-otzyvy', '/ru/otzyvy'], ['05-experts', '/ru/experts'], ['06-uz', '/uz'],
    ]) jobs.push({ group: 'pages', url: NEW + p, full: true, name: n });
  }

  const manifest = [];
  for (const job of jobs) {
    const dir = path.join(OUT, job.group);
    mkdirSync(dir, { recursive: true });
    console.log(`\n▸ ${job.group}  ${job.url}`);

    const ctx = await browser.newContext({ viewport: DESKTOP, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    try {
      await page.goto(job.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await settle(page, 3000);

      if (job.heroOnly) {
        await page.screenshot({ path: path.join(dir, `${job.name}.png`) });
        console.log('  ✓', job.name);
      } else {
        await wakeLazy(page);
        if (job.sections) {
          await hideOverlays(page);
          const boxes = await shootSections(page, dir, '');
          manifest.push({ group: job.group, url: job.url, blocks: boxes });
        }
        if (job.full) {
          const nm = job.name ? `${job.name}-full.png` : 'zz-full.png';
          await page.screenshot({ path: path.join(dir, nm), fullPage: true });
          console.log('  ✓', nm);
        }
      }

      if (job.phone) {
        const pctx = await browser.newContext({ viewport: PHONE, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
        const pp = await pctx.newPage();
        await pp.goto(job.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await settle(pp, 3000);
        await pp.screenshot({ path: path.join(dir, 'zz-phone-hero.png') });
        await wakeLazy(pp);
        await pp.screenshot({ path: path.join(dir, 'zz-phone-full.png'), fullPage: true });
        console.log('  ✓ телефон 390');
        await pctx.close();
      }
    } catch (e) {
      console.log('  ОШИБКА:', e.message);
    }
    await ctx.close();
  }

  writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
  await browser.close();
  console.log('\nготово →', OUT);
}

run();
