// node --test components/hero/timeline.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  STAGES, span, stagger, dropOffset, panelOpacity, sceneState, DROP_HEIGHT,
} from "./timeline.js";

test("stages cover the scroll without gaps and in order", () => {
  assert.equal(STAGES.draft.from, 0);
  assert.equal(STAGES.draft.to, STAGES.build.from);
  assert.equal(STAGES.build.to, STAGES.load.from);
  assert.ok(STAGES.load.to <= 1);
});

test("span clamps and maps linearly", () => {
  assert.equal(span(-1, 0, 1), 0);
  assert.equal(span(0.5, 0, 1), 0.5);
  assert.equal(span(2, 0, 1), 1);
  assert.ok(Math.abs(span(0.3, 0.2, 0.4) - 0.5) < 1e-9);
});

test("stagger: first item starts at 0, last item ends exactly at 1", () => {
  const n = 12;
  assert.equal(stagger(0, 0, n), 0);
  assert.ok(stagger(0.05, 0, n) > 0);
  assert.equal(stagger(1, n - 1, n), 1);
  assert.ok(stagger(0.6, n - 1, n) < 1);
  // every item is fully placed at the end
  for (let i = 0; i < n; i++) assert.equal(stagger(1, i, n), 1);
});

test("dropOffset goes from DROP_HEIGHT to 0", () => {
  assert.equal(dropOffset(0), DROP_HEIGHT);
  assert.ok(Math.abs(dropOffset(1)) < 1e-9);
  assert.ok(dropOffset(0.5) < DROP_HEIGHT && dropOffset(0.5) > 0);
});

test("panels never overlap: at most one panel above 0.5 at any p", () => {
  for (let p = 0; p <= 1; p += 0.005) {
    const on = ["draft", "build", "load"].filter((s) => panelOpacity(p, s) > 0.5);
    assert.ok(on.length <= 1, `p=${p.toFixed(3)} panels ${on}`);
  }
});

test("sceneState: everything is in place at the end and nothing at the start", () => {
  const a = sceneState(0);
  assert.equal(a.people, 1);
  assert.equal(a.intro, 1);
  assert.equal(a.frames, 0);
  assert.equal(a.beams, 0);
  assert.equal(a.load, 0);
  const z = sceneState(1);
  assert.equal(z.people, 0);
  assert.equal(z.intro, 0);
  assert.equal(z.frames, 1);
  assert.equal(z.beams, 1);
  assert.equal(z.load, 1);
  assert.equal(z.draftAlpha, 0);
  assert.equal(z.panels.load, 1);
});

test("beams start only after frames are down", () => {
  const mid = sceneState(STAGES.build.from + (STAGES.build.to - STAGES.build.from) * 0.3);
  assert.ok(mid.frames > 0.8);
  assert.equal(mid.beams, 0);
});

