// Рендер КП в PDF. Использование: node render.js [kp.html] [out.pdf]
const path = require('path');
const fs = require('fs');

const IN  = process.argv[2] || 'kp.html';
const OUT = process.argv[3] || 'КП.pdf';

// локальный chrome-headless-shell от Playwright (ищем любую версию)
function findShell() {
  const base = process.env.HOME + '/Library/Caches/ms-playwright';
  if (!fs.existsSync(base)) return null;
  const dir = fs.readdirSync(base).find(d => d.startsWith('chromium_headless_shell'));
  if (!dir) return null;
  const p = `${base}/${dir}/chrome-headless-shell-mac-arm64/chrome-headless-shell`;
  return fs.existsSync(p) ? p : null;
}

(async () => {
  let chromium;
  for (const m of ['playwright', 'playwright-core',
                   '/Users/umidikromboev/Downloads/Проекты/euromed-deck/node_modules/playwright-core']) {
    try { chromium = require(m).chromium; break; } catch (e) {}
  }
  if (!chromium) { console.error('Нет playwright. npm i -g playwright-core'); process.exit(1); }

  const shell = findShell();
  const b = await chromium.launch(shell ? { executablePath: shell } : {});
  const p = await b.newPage();
  await p.goto('file://' + path.resolve(IN), { waitUntil: 'networkidle' });
  await p.waitForTimeout(2500);           // ждём веб-шрифты, иначе метрики поедут
  await p.pdf({ path: OUT, format: 'A4', printBackground: true, preferCSSPageSize: true });
  await b.close();
  console.log('OK →', OUT);
})();
