// three.js-сцена скролл-героя. Получает `THREE` снаружи (динамический импорт
// живёт в компоненте), рисует помещение с колонной, Г-образный стеллаж разной
// высоты, человечков замера, белые линии проекта, падающие рамы и балки,
// паллеты с коробками. Сама ничего не решает: состояние приходит из timeline.js.

import { sceneState, stagger, dropOffset } from "./timeline.js";

// ——— геометрия помещения и стеллажа (метры)
const ROOM = { w: 24, d: 16, h: 7.5 };
const COLUMN = { x: 17.6, z: 8.2, size: 0.6 }; // в 0,8 м от внешней стороны плеча B — стеллаж огибает её
const BAY_W = 2.7;
const RACK_D = 1.1;

// Г-образный ряд: плечо A вдоль X на 4 яруса, плечо B вдоль Z на 3 яруса,
// огибает колонну. Секции разной высоты — то, что просил Умид.
const LEG_A = { x0: 2.2, z0: 3.0, bays: 5, levels: 4, frameH: 6.0, rot: 0 };
const LEG_B = { x0: LEG_A.x0 + LEG_A.bays * BAY_W, z0: LEG_A.z0 + RACK_D, bays: 3, levels: 3, frameH: 4.6, rot: Math.PI / 2 };

const COLORS = {
  bg: 0x052a4d,
  floor: 0x083559,
  grid: 0x0f4a80,
  column: 0x23507c,
  upright: 0x1d5aa8,
  brace: 0x14396b,
  beam: 0xf07c12,
  pallet: 0x7a5630,
  box: [0xc49f6d, 0xad8654, 0xd4b184],
  draft: 0xffffff,
  measure: 0x26b8f2,
  person: 0xe6f4ff,
};

const PALLETS_PER_BAY = 2;

/** Секции обоих плеч в одном списке, с локальной системой координат. */
function buildBays() {
  const bays = [];
  for (const leg of [LEG_A, LEG_B]) {
    for (let i = 0; i < leg.bays; i++) {
      const along = i * BAY_W;
      const x = leg.rot === 0 ? leg.x0 + along : leg.x0;
      const z = leg.rot === 0 ? leg.z0 : leg.z0 + along;
      bays.push({ x, z, rot: leg.rot, levels: leg.levels, frameH: leg.frameH, leg, i });
    }
  }
  return bays;
}

/** Точка в мировых координатах из локальных (вдоль секции u, поперёк v). */
function local(bay, u, v) {
  if (bay.rot === 0) return [bay.x + u, bay.z + v];
  return [bay.x + v, bay.z + u];
}

/** Рамы: по одной на стык секций, не по две. */
function buildFrames(bays) {
  const map = new Map();
  for (const b of bays) {
    for (const u of [0, BAY_W]) {
      const [x, z] = local(b, u, 0);
      const key = `${x.toFixed(2)}|${z.toFixed(2)}|${b.rot}`;
      const prev = map.get(key);
      if (!prev || prev.frameH < b.frameH) map.set(key, { x, z, rot: b.rot, frameH: b.frameH, order: map.size });
    }
  }
  return [...map.values()];
}

function makeTextSprite(THREE, text, { size = 64, color = "#e6f4ff", pad = 10 } = {}) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  ctx.font = `600 ${size}px system-ui, -apple-system, sans-serif`;
  const w = Math.ceil(ctx.measureText(text).width) + pad * 2;
  const h = size + pad * 2;
  canvas.width = w;
  canvas.height = h;
  ctx.font = `600 ${size}px system-ui, -apple-system, sans-serif`;
  ctx.fillStyle = "rgba(5,42,77,0.75)";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = color;
  ctx.textBaseline = "middle";
  ctx.fillText(text, pad, h / 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
  const sp = new THREE.Sprite(mat);
  const scale = 0.012;
  sp.scale.set(w * scale, h * scale, 1);
  return sp;
}

/** Плоская фигурка замерщика: голова, корпус, ноги. Без лица, в цвете бренда. */
function makePersonSprite(THREE, variant) {
  const W = 96, H = 192;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#e6f4ff";
  ctx.beginPath();
  ctx.arc(W / 2, 26, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.roundRect(W / 2 - 22, 50, 44, 70, 12);
  ctx.fill();
  ctx.fillStyle = "#26b8f2";
  ctx.beginPath();
  ctx.roundRect(W / 2 - 22, 50, 44, 22, [12, 12, 0, 0]);
  ctx.fill();
  ctx.fillStyle = "#e6f4ff";
  ctx.beginPath();
  ctx.roundRect(W / 2 - 20, 122, 16, 62, 6);
  ctx.roundRect(W / 2 + 4, 122, 16, 62, 6);
  ctx.fill();
  if (variant === 0) {
    // планшет в руках
    ctx.fillStyle = "#26b8f2";
    ctx.fillRect(W / 2 + 18, 74, 26, 34);
  } else {
    // рулетка
    ctx.fillStyle = "#f0c23a";
    ctx.beginPath();
    ctx.arc(W / 2 - 30, 92, 11, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
  sp.scale.set(1.1, 2.2, 1); // чуть крупнее человека: фигурка стилизованная, издалека должна читаться
  sp.center.set(0.5, 0);
  return sp;
}

/** Паллето-мест в показанной модели: секции × (ярусы + пол) × паллет в секции. */
export function countPositions() {
  return buildBays().reduce((n, b) => n + (b.levels + 1) * PALLETS_PER_BAY, 0);
}

export function createRackScene(THREE, canvas) {
  const bays = buildBays();
  const frames = buildFrames(bays);
  const positions = countPositions();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(COLORS.bg);
  scene.fog = new THREE.Fog(COLORS.bg, 34, 70);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const cam = new THREE.PerspectiveCamera(42, 1, 0.1, 200);
  const rackCenter = new THREE.Vector3(LEG_A.x0 + (LEG_A.bays * BAY_W) * 0.6, 0, LEG_A.z0 + 3.2);

  // свет: контраст важнее яркости, иначе синие стойки сливаются
  scene.add(new THREE.HemisphereLight(0xb8ccdd, 0x1a2530, 0.9));
  scene.add(new THREE.AmbientLight(0xffffff, 0.2));
  const sun = new THREE.DirectionalLight(0xfff3e0, 1.7);
  sun.position.set(ROOM.w * 0.7, ROOM.h * 2.6, -ROOM.d * 0.5);
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0xcfe0f0, 0.5);
  fill.position.set(-ROOM.w * 0.3, ROOM.h * 1.2, ROOM.d * 1.4);
  scene.add(fill);

  // ——— пол с сеткой чертежа
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(ROOM.w, ROOM.d),
    new THREE.MeshStandardMaterial({ color: COLORS.floor, roughness: 0.95, metalness: 0.02 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(ROOM.w / 2, 0, ROOM.d / 2);
  scene.add(floor);
  const grid = new THREE.GridHelper(Math.max(ROOM.w, ROOM.d), Math.max(ROOM.w, ROOM.d), COLORS.grid, COLORS.grid);
  grid.position.set(ROOM.w / 2, 0.005, ROOM.d / 2);
  grid.material.opacity = 0.35;
  grid.material.transparent = true;
  scene.add(grid);

  // колонна, которую огибает стеллаж
  const column = new THREE.Mesh(
    new THREE.BoxGeometry(COLUMN.size, ROOM.h, COLUMN.size),
    new THREE.MeshStandardMaterial({ color: COLORS.column, roughness: 0.9 })
  );
  column.position.set(COLUMN.x, ROOM.h / 2, COLUMN.z);
  scene.add(column);

  // ——— замер: размерные линии, подписи, человечки
  const measureGroup = new THREE.Group();
  scene.add(measureGroup);
  const mLines = [];
  const seg = (a, b) => mLines.push(...a, ...b);
  const y0 = 0.05;
  const tick = 0.35;
  // длина помещения
  seg([1, y0, ROOM.d - 1.2], [ROOM.w - 1, y0, ROOM.d - 1.2]);
  seg([1, y0, ROOM.d - 1.2 - tick], [1, y0, ROOM.d - 1.2 + tick]);
  seg([ROOM.w - 1, y0, ROOM.d - 1.2 - tick], [ROOM.w - 1, y0, ROOM.d - 1.2 + tick]);
  // глубина помещения
  seg([1.2, y0, 1], [1.2, y0, ROOM.d - 1]);
  seg([1.2 - tick, y0, 1], [1.2 + tick, y0, 1]);
  seg([1.2 - tick, y0, ROOM.d - 1], [1.2 + tick, y0, ROOM.d - 1]);
  // высота у колонны
  seg([COLUMN.x + 0.9, 0, COLUMN.z], [COLUMN.x + 0.9, ROOM.h, COLUMN.z]);
  seg([COLUMN.x + 0.9 - tick, 0, COLUMN.z], [COLUMN.x + 0.9 + tick, 0, COLUMN.z]);
  seg([COLUMN.x + 0.9 - tick, ROOM.h, COLUMN.z], [COLUMN.x + 0.9 + tick, ROOM.h, COLUMN.z]);
  const mGeo = new THREE.BufferGeometry();
  mGeo.setAttribute("position", new THREE.Float32BufferAttribute(mLines, 3));
  const mMat = new THREE.LineBasicMaterial({ color: COLORS.measure, transparent: true, opacity: 0.9 });
  const measureLines = new THREE.LineSegments(mGeo, mMat);
  measureGroup.add(measureLines);
  const totalMeasureVerts = mLines.length / 3;

  const labels = [
    { t: `${ROOM.w * 1000} мм`, x: ROOM.w / 2, y: 0.9, z: ROOM.d - 1.2 },
    { t: `${ROOM.d * 1000} мм`, x: 1.2, y: 0.9, z: ROOM.d / 2 },
    { t: `H ${ROOM.h * 1000} мм`, x: COLUMN.x + 1.8, y: ROOM.h * 0.55, z: COLUMN.z },
  ].map((l) => {
    const sp = makeTextSprite(THREE, l.t);
    sp.position.set(l.x, l.y, l.z);
    measureGroup.add(sp);
    return sp;
  });

  const people = [
    { sp: makePersonSprite(THREE, 0), from: [4, ROOM.d - 3.2], to: [9, ROOM.d - 3.2], phase: 0 },
    { sp: makePersonSprite(THREE, 1), from: [2.4, 3], to: [2.4, ROOM.d - 4], phase: 1.7 },
    { sp: makePersonSprite(THREE, 1), from: [COLUMN.x + 2.2, COLUMN.z + 1.5], to: [COLUMN.x + 2.2, COLUMN.z - 1.5], phase: 3.1 },
  ];
  people.forEach((p) => measureGroup.add(p.sp));

  // ——— белые линии проекта: сначала рамы, потом балки снизу вверх
  const dLines = [];
  const dSeg = (a, b) => dLines.push(...a, ...b);
  for (const f of frames) {
    const [x1, z1] = f.rot === 0 ? [f.x, f.z] : [f.x, f.z];
    const [x2, z2] = f.rot === 0 ? [f.x, f.z + RACK_D] : [f.x + RACK_D, f.z];
    dSeg([x1, 0, z1], [x1, f.frameH, z1]);
    dSeg([x2, 0, z2], [x2, f.frameH, z2]);
    dSeg([x1, f.frameH, z1], [x2, f.frameH, z2]);
  }
  const maxLevels = Math.max(...bays.map((b) => b.levels));
  for (let l = 1; l <= maxLevels; l++) {
    for (const b of bays) {
      if (l > b.levels) continue;
      const y = (b.frameH / b.levels) * l;
      const [ax, az] = local(b, 0, 0.05);
      const [bx, bz] = local(b, BAY_W, 0.05);
      const [cx, cz] = local(b, 0, RACK_D - 0.05);
      const [dx, dz] = local(b, BAY_W, RACK_D - 0.05);
      dSeg([ax, y, az], [bx, y, bz]);
      dSeg([cx, y, cz], [dx, y, dz]);
    }
  }
  const dGeo = new THREE.BufferGeometry();
  dGeo.setAttribute("position", new THREE.Float32BufferAttribute(dLines, 3));
  const dMat = new THREE.LineBasicMaterial({ color: COLORS.draft, transparent: true, opacity: 0.85 });
  const draftLines = new THREE.LineSegments(dGeo, dMat);
  scene.add(draftLines);
  const totalDraftVerts = dLines.length / 3;

  // ——— реальные детали (инстансы)
  const dummy = new THREE.Object3D();
  const instanced = (geo, mat, n) => {
    const m = new THREE.InstancedMesh(geo, mat, Math.max(n, 1));
    m.frustumCulled = false;
    scene.add(m);
    return m;
  };
  const put = (mesh, i, x, y, z, rot = 0, sy = 1) => {
    dummy.position.set(x, y, z);
    dummy.rotation.set(0, rot, 0);
    dummy.scale.set(1, sy, 1);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  };

  const uprightMesh = instanced(
    new THREE.BoxGeometry(0.1, 1, 0.1),
    new THREE.MeshStandardMaterial({ color: COLORS.upright, roughness: 0.42, metalness: 0.35 }),
    frames.length * 2
  );
  const braceMesh = instanced(
    new THREE.BoxGeometry(0.05, 0.05, RACK_D - 0.12),
    new THREE.MeshStandardMaterial({ color: COLORS.brace, roughness: 0.55, metalness: 0.3 }),
    frames.length * 4
  );
  // элементы рам: {x, z, rot, frameH, order}
  const frameItems = frames.map((f, i) => {
    const [x1, z1] = [f.x, f.z];
    const [x2, z2] = f.rot === 0 ? [f.x, f.z + RACK_D] : [f.x + RACK_D, f.z];
    return { ...f, idx: i, posts: [[x1, z1], [x2, z2]], mid: [(x1 + x2) / 2, (z1 + z2) / 2] };
  });

  const beamItems = [];
  for (let l = 1; l <= maxLevels; l++) {
    for (const b of bays) {
      if (l > b.levels) continue;
      const y = (b.frameH / b.levels) * l;
      for (const v of [0.08, RACK_D - 0.08]) {
        const [x, z] = local(b, BAY_W / 2, v);
        beamItems.push({ x, y, z, rot: b.rot });
      }
    }
  }
  const beamMesh = instanced(
    new THREE.BoxGeometry(BAY_W - 0.1, 0.12, 0.05),
    new THREE.MeshStandardMaterial({ color: COLORS.beam, roughness: 0.38, metalness: 0.3 }),
    beamItems.length
  );

  // паллеты и коробки: снизу вверх, ряд за рядом
  const slotItems = [];
  const step = BAY_W / PALLETS_PER_BAY;
  for (let l = 0; l <= maxLevels; l++) {
    for (const b of bays) {
      if (l > b.levels) continue;
      const y = l === 0 ? 0 : (b.frameH / b.levels) * l + 0.06;
      for (let k = 0; k < PALLETS_PER_BAY; k++) {
        const [x, z] = local(b, step * (k + 0.5), RACK_D / 2);
        slotItems.push({ x, y, z, rot: b.rot, sy: 0.8 + ((l * 7 + k * 3 + b.i) % 5) / 12 });
      }
    }
  }
  const palletMesh = instanced(
    new THREE.BoxGeometry(step * 0.9, 0.14, RACK_D * 0.9),
    new THREE.MeshStandardMaterial({ color: COLORS.pallet, roughness: 0.93 }),
    slotItems.length
  );
  const boxMesh = instanced(
    new THREE.BoxGeometry(step * 0.84, 1.0, RACK_D * 0.82),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }),
    slotItems.length
  );
  const tints = COLORS.box.map((c) => new THREE.Color(c));
  slotItems.forEach((_, i) => boxMesh.setColorAt(i, tints[i % tints.length]));
  if (boxMesh.instanceColor) boxMesh.instanceColor.needsUpdate = true;

  const HIDDEN_Y = -50; // деталь, которая ещё «не упала», прячется под полом

  function layoutFrames(local) {
    frameItems.forEach((f, i) => {
      const t = stagger(local, i, frameItems.length, 0.5);
      const dy = t <= 0 ? HIDDEN_Y : dropOffset(t);
      f.posts.forEach(([x, z], k) => put(uprightMesh, i * 2 + k, x, f.frameH / 2 + dy, z, 0, f.frameH));
      for (let k = 0; k < 4; k++) {
        put(braceMesh, i * 4 + k, f.mid[0], (f.frameH * (k + 1)) / 5 + dy, f.mid[1], f.rot);
      }
    });
    uprightMesh.instanceMatrix.needsUpdate = true;
    braceMesh.instanceMatrix.needsUpdate = true;
  }

  function layoutBeams(local) {
    beamItems.forEach((b, i) => {
      const t = stagger(local, i, beamItems.length, 0.35);
      const dy = t <= 0 ? HIDDEN_Y : dropOffset(t);
      put(beamMesh, i, b.x, b.y + dy, b.z, b.rot);
    });
    beamMesh.instanceMatrix.needsUpdate = true;
  }

  function layoutLoad(local) {
    slotItems.forEach((s, i) => {
      const t = stagger(local, i, slotItems.length, 0.3);
      const dy = t <= 0 ? HIDDEN_Y : dropOffset(t);
      put(palletMesh, i, s.x, s.y + 0.07 + dy, s.z, s.rot);
      put(boxMesh, i, s.x, s.y + 0.14 + 0.5 * s.sy + dy, s.z, s.rot, s.sy);
    });
    palletMesh.instanceMatrix.needsUpdate = true;
    boxMesh.instanceMatrix.needsUpdate = true;
  }

  function layoutMeasure(time, alpha) {
    // линии замера вытягиваются первые 2.5 с после загрузки
    const drawn = Math.min(1, time / 2.5);
    measureLines.geometry.setDrawRange(0, Math.floor(totalMeasureVerts * drawn));
    mMat.opacity = 0.9 * alpha;
    labels.forEach((sp, i) => {
      const show = Math.min(1, Math.max(0, (time - 0.8 - i * 0.6) / 0.5));
      sp.material.opacity = show * alpha;
    });
    people.forEach((p) => {
      const cycle = 6;
      const u = ((time + p.phase) % cycle) / cycle;
      const k = u < 0.5 ? u * 2 : 2 - u * 2; // туда и обратно
      const x = p.from[0] + (p.to[0] - p.from[0]) * k;
      const z = p.from[1] + (p.to[1] - p.from[1]) * k;
      p.sp.position.set(x, Math.abs(Math.sin((time + p.phase) * 6)) * 0.06, z);
      p.sp.material.opacity = alpha;
    });
    measureGroup.visible = alpha > 0.01;
  }

  // На телефоне текст занимает низ экрана, поэтому сцену поднимаем:
  // доля высоты кадра, на которую уезжает вверх центр стеллажа.
  const PORTRAIT_LIFT = 0.16;
  const target = new THREE.Vector3();

  function applyCamera(c) {
    // Полувысота видимого кадра на расстоянии цели — через неё сдвиги в долях
    // экрана переводятся в метры.
    const halfH = Math.tan(THREE.MathUtils.degToRad(cam.fov) / 2) * c.dist;
    const shift = portrait ? 0 : c.shift || 0;
    const lift = portrait ? PORTRAIT_LIFT : 0;
    // Вектор «вправо» камеры в плоскости пола; сцена уходит вправо, если цель уходит влево.
    const rx = Math.sin(c.az);
    const rz = -Math.cos(c.az);
    const side = -shift * 2 * halfH * cam.aspect;
    target.set(
      rackCenter.x + rx * side,
      c.ty - (lift * 2 * halfH) / Math.cos(c.el),
      rackCenter.z + rz * side
    );
    cam.position.set(
      target.x + c.dist * Math.cos(c.el) * Math.cos(c.az),
      target.y + c.dist * Math.sin(c.el),
      target.z + c.dist * Math.cos(c.el) * Math.sin(c.az)
    );
    cam.lookAt(target);
  }

  let portrait = false;

  /** Прогресс скролла и время (с) → сцена. */
  function update(progress, time) {
    const s = sceneState(progress);
    layoutMeasure(time, s.people);
    draftLines.geometry.setDrawRange(0, Math.floor(totalDraftVerts * s.draftDraw));
    dMat.opacity = 0.85 * s.draftAlpha;
    draftLines.visible = s.draftAlpha > 0.01 && s.draftDraw > 0;
    layoutFrames(s.frames);
    layoutBeams(s.beams);
    layoutLoad(s.load);
    const c = { ...s.camera };
    if (portrait) c.dist *= 1.7; // на вертикальном экране стеллаж должен влезть целиком
    applyCamera(c);
    return s;
  }

  function resize(w, h) {
    renderer.setSize(w, h, false);
    cam.aspect = w / h;
    portrait = h > w;
    cam.updateProjectionMatrix();
  }

  function render() {
    renderer.render(scene, cam);
  }

  function dispose() {
    scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m) => {
          if (m.map) m.map.dispose();
          m.dispose();
        });
      }
    });
    renderer.dispose();
  }

  return { update, resize, render, dispose, positions, counts: { frames: frames.length, beams: beamItems.length, slots: slotItems.length } };
}
