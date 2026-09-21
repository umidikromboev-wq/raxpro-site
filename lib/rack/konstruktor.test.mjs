import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compute, DEFAULT_INPUT, beamForLoad, referencePerPalletPosition, shareStateFrom } from './konstruktor.ts';
import { design } from './layout.ts';

test('вес паллеты выбирает балку по паспортной нагрузке', () => {
  assert.equal(beamForLoad(500), 3300);
  assert.equal(beamForLoad(800), 2700);
  assert.equal(beamForLoad(1000), 2700);
  assert.throws(() => beamForLoad(1200));
});

test('режим «помещение» даёт те же числа, что ядро раскладки напрямую', () => {
  const r = compute(DEFAULT_INPUT);
  const l = design(r.room);
  assert.equal(r.geometry.sections, l.sections);
  assert.equal(r.geometry.rows, l.rows);
  assert.equal(r.positions, l.positions);
  assert.ok(r.price.totalNoVat > 0);
  assert.equal(r.price.perPalletPosition, Math.round(r.price.totalNoVat / r.positions));
  assert.ok(r.rackAreaM2 < r.areaM2);
});

test('режим «секция», паллетный: 10 секций × 3 яруса × 3 паллеты + пол', () => {
  const r = compute({ ...DEFAULT_INPUT, mode: 'section', section: { levels: 3, beam: 2700, sections: 10, rows: 1 } });
  assert.equal(r.positions, 10 * 4 * 3);
  assert.equal(r.spec.find((l) => l.item === 'frame').qty, 11);
  assert.equal(r.spec.find((l) => l.item === 'beam').qty, 60);
  assert.equal(r.frameHeight, 4000);
});

test('среднегрузовой считается по прайсу за секцию с общими рамами', () => {
  const r = compute({ ...DEFAULT_INPUT, type: 'medium', mode: 'section', section: { levels: 5, beam: 2000, sections: 10, rows: 1, sizeCode: 'MD-2500-2000-600-5' } });
  assert.equal(r.price.mode, 'sectionList');
  assert.equal(r.price.subtotal, 10 * 5_351_327 - 9 * 1_536_100);
  assert.equal(r.positions, null);
});

test('архивный: цена комплекта из прайса', () => {
  const r = compute({ ...DEFAULT_INPUT, type: 'archive', mode: 'section', section: { levels: 5, beam: 1000, sections: 1, rows: 30, sizeCode: 'AR-2000-1000-400-5' } });
  assert.equal(r.price.subtotal, 30 * 1_400_000);
});

test('опорная цена за паллетоместо — из ядра, а не из головы', () => {
  const p = referencePerPalletPosition();
  assert.ok(p > 500_000 && p < 800_000, String(p));
});

test('состояние для ссылки /tp воспроизводит раскладку', () => {
  const r = compute(DEFAULT_INPUT);
  const s = shareStateFrom(DEFAULT_INPUT, r, 'ru');
  assert.equal(s.hasLayout, true);
  assert.equal(s.room.beam, r.room.beam);
  assert.equal(s.geometry.sections, r.geometry.sections);
});
