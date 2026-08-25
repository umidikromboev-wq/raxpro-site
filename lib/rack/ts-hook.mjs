// Загружает .ts как обычный модуль: типы срезаются, код исполняется.
import { transform } from 'sucrase';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export async function resolve(spec, ctx, next) {
  try { return await next(spec, ctx); }
  catch (e) {
    if (spec.startsWith('.') && !spec.endsWith('.ts')) return next(spec + '.ts', ctx);
    throw e;
  }
}

export async function load(url, ctx, next) {
  if (!url.endsWith('.ts')) return next(url, ctx);
  const src = readFileSync(fileURLToPath(url), 'utf8');
  const { code } = transform(src, { transforms: ['typescript'], filePath: url });
  return { format: 'module', source: code, shortCircuit: true };
}
