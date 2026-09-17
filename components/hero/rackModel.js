// One geometry model drives both the scene and its illustrated capacity.
export const ROOM = { width: 17, depth: 13, height: 7.4 };
export const BAY_WIDTH = 2.3;
export const RACK_DEPTH = 1.3;
export const PALLETS_PER_BAY = 2;
export const PALLET_HEIGHT = 0.14;
export const COLUMN = { x: 5.65, z: 0, width: 0.65 };

export function rackModel() {
  const bays = [];
  for (let i = 0; i < 4; i++) bays.push({ x: -6.2 + i * BAY_WIDTH, z: -3.6, rot: 0, levels: 3, height: 6.3 });
  for (let i = 0; i < 3; i++) bays.push({ x: 4.1, z: -2.1 + i * BAY_WIDTH, rot: Math.PI / 2, levels: 2, height: 4.65 });
  const point = (b, u, v) => b.rot === 0 ? [b.x + u, b.z + v] : [b.x - v, b.z + u];
  const frames = [];
  const seen = new Set();
  const beams = [];
  const slots = [];
  for (const [bi, b] of bays.entries()) {
    for (const u of [0, BAY_WIDTH]) {
      const [x, z] = point(b, u, 0);
      const key = `${x.toFixed(3)}:${z.toFixed(3)}:${b.rot}`;
      if (!seen.has(key)) { frames.push({ x, z, rot: b.rot, height: b.height }); seen.add(key); }
    }
    for (let l = 1; l <= b.levels; l++) {
      const y = l * 1.7;
      for (const v of [0.04, RACK_DEPTH - 0.04]) {
        const [x, z] = point(b, BAY_WIDTH / 2, v);
        beams.push({ x, y, z, rot: b.rot, level: l, front: v > RACK_DEPTH / 2 });
      }
    }
    for (let l = 0; l <= b.levels; l++) {
      for (let k = 0; k < PALLETS_PER_BAY; k++) {
        const [x, z] = point(b, (k + 0.5) * BAY_WIDTH / PALLETS_PER_BAY, RACK_DEPTH / 2);
        slots.push({ x, y: l * 1.7 + (l ? 0.09 : 0), z, rot: b.rot, level: l,
          height: 0.66 + ((bi + k + l) % 3) * 0.09, variant: (bi * 2 + k + l) % 5 });
      }
    }
  }
  beams.sort((a, b) => a.level - b.level);
  slots.sort((a, b) => a.level - b.level);
  return { bays, frames, beams, slots, point };
}

export function countPositions() { return rackModel().slots.length; }
export function floorPositions() { return rackModel().slots.filter((s) => s.level === 0).length; }
