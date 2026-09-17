// Детали, по которым стеллаж узнают как настоящий: отбойники стоек, таблички нагрузки,
// разный товар на паллетах, рохля с паллетой и пара паллет на полу.

import { RACK_DEPTH } from './rackModel.js';

export function addRackDetails(part, framePart, model) {
  model.frames.forEach((f, i) => {
    const owner = { stage: 'frames', index: i, count: model.frames.length, window: 0.48 };
    framePart(f, [0.34, 0.4, 0.3], 'guard', 0, 0.2, RACK_DEPTH + 0.19, owner);
  });
  model.beams.forEach((b, i) => {
    if (b.level !== 1 || !b.front) return;
    const owner = { stage: 'beams', index: i, count: model.beams.length, window: 0.32 };
    const out = [-Math.sin(b.rot) * 0.06, Math.cos(b.rot) * 0.06];
    const along = [Math.cos(b.rot) * 0.72, Math.sin(b.rot) * 0.72];
    part([0.5, 0.19, 0.02], 'label', [b.x + out[0] + along[0], b.y - 0.01, b.z + out[1] + along[1]], owner, [0, -b.rot, 0]);
  });
}

/** Паллета с грузом. variant 0..4: 1 и 4 — блок в стретч-плёнке, 2 — бочки, остальное — коробки. */
export function addPalletLoad(part, owner, s) {
  const place = (size, name, u, y, v, shape) => part(size, name,
    [s.x + u * Math.cos(s.rot) - v * Math.sin(s.rot), s.y + y, s.z + u * Math.sin(s.rot) + v * Math.cos(s.rot)], owner, [0, -s.rot, 0], shape);
  for (const u of [-0.38, 0, 0.38]) place([0.12, 0.1, 1.16], 'wood', u, 0.05, 0);
  for (const v of [-0.48, -0.24, 0, 0.24, 0.48]) place([1.03, 0.04, 0.18], 'wood', 0, 0.12, v);
  if (s.variant === 1 || s.variant === 4) { place([1.0, s.height, 1.1], 'wrap', 0, 0.14 + s.height / 2, 0); return; }
  if (s.variant === 2) {
    for (const u of [-0.26, 0.26]) for (const v of [-0.28, 0.28]) place([0.25, s.height * 0.95], 'drum', u, 0.14 + s.height * 0.475, v, 'cyl');
    return;
  }
  for (const u of [-0.245, 0.245]) for (const v of [-0.275, 0.275]) place([0.47, s.height, 0.52], 'box', u, 0.14 + s.height / 2, v);
}

/** Рохля с паллетой: въезжает в проход со стороны ворот (по +x), вилы смотрят на −x. */
export function addPalletJack(part, x, z) {
  const owner = { stage: 'jack', index: 0, count: 1, window: 1, motion: 'slide' };
  const p = (size, name, dx, y, dz, rotation) => part(size, name, [x + dx, y, z + dz], owner, rotation);
  for (const dz of [-0.27, 0.27]) p([1.15, 0.07, 0.16], 'jackBody', -0.45, 0.09, dz);
  p([0.5, 0.42, 0.62], 'jackBody', 0.35, 0.3, 0);
  for (const dz of [-0.22, 0.22]) p([0.2, 0.2, 0.08], 'dark', 0.42, 0.1, dz);
  p([0.06, 1.05, 0.06], 'dark', 0.85, 0.75, 0, [0, 0, -0.55]);
  p([0.05, 0.05, 0.34], 'dark', 1.12, 1.18, 0);
  addPalletLoad(part, owner, { x: x - 0.45, y: 0.13, z, rot: 0, height: 0.78, variant: 0 });
}

/** Две паллеты на полу у ворот — приезжают первыми, когда начинается загрузка. */
export function addFloorPallets(part) {
  const owner = { stage: 'load', index: 0, count: 1, window: 1 };
  addPalletLoad(part, owner, { x: 7.1, y: 0, z: -4.6, rot: 0.2, height: 0.72, variant: 1 });
  addPalletLoad(part, owner, { x: 7.3, y: 0, z: -3.1, rot: -0.1, height: 0.66, variant: 0 });
}
