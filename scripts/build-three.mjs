// Собирает three.js и сцену 3D-героя в один самостоятельный файл public/vendor/rax-hero.js.
// Зачем не через Next: Turbopack не отсекает неиспользуемые экспорты three
// (тянул все 706 КБ), а esbuild оставляет только нужные классы. Плюс у файла
// постоянный адрес — layout предзагружает его с самого HTML, параллельно
// с бандлом страницы, а не после гидрации.
// Запуск: `npm run build:three` (входит в prebuild).
import { build } from 'esbuild';
import { statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { readFileSync } from 'node:fs';

const out = 'public/vendor/rax-hero.js';
await build({
  entryPoints: ['components/hero/three.js'],
  bundle: true,
  format: 'esm',
  minify: true,
  target: ['es2020'],
  outfile: out,
  legalComments: 'none',
  logLevel: 'error',
});
const raw = statSync(out).size;
const gz = gzipSync(readFileSync(out)).length;
console.log(`${out}: ${(raw / 1024).toFixed(0)} KB, gzip ${(gz / 1024).toFixed(0)} KB`);
