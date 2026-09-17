import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rackModel, countPositions, floorPositions, ROOM, PALLET_HEIGHT } from './rackModel.js';
import { sceneState, stagger } from './timeline.js';

test('displayed capacity equals actual pallet positions in the scene', () => {
  const { slots } = rackModel();
  assert.equal(countPositions(), slots.length);
  assert.equal(floorPositions(), 14);
  assert.equal(countPositions(), 50);
  assert.equal(new Set(slots.map(s => `${s.x}:${s.y}:${s.z}`)).size, slots.length);
});

test('all cargo fits within the room and clears the shelf above it', () => {
  for (const s of rackModel().slots) {
    assert.ok(Math.abs(s.x) + 0.7 < ROOM.width / 2);
    assert.ok(Math.abs(s.z) + 0.7 < ROOM.depth / 2);
    assert.ok(s.y + PALLET_HEIGHT + s.height < ROOM.height);
    assert.ok(PALLET_HEIGHT + s.height < 1.7 - 0.17);
  }
});

test('reverse scroll unloads and disassembles without history-dependent state', () => {
  const positions = countPositions();
  const filled = (p) => {
    const s = sceneState(p);
    return Array.from({length:positions}, (_,i) => stagger(s.load,i,positions,.22)).filter(t=>t >= .99).length;
  };
  assert.equal(filled(1), positions);
  assert.ok(filled(.85) > 0 && filled(.85) < positions);
  assert.equal(filled(.6), 0);
  assert.equal(sceneState(0).beams, 0);
});
