import { sceneState, stagger, dropOffset, easeOutCubic, smoothstep, span as spanOf, STAGES } from './timeline.js';
import { rackModel, ROOM, BAY_WIDTH, RACK_DEPTH, floorPositions } from './rackModel.js';
import { cartonTexture, wrapTexture, loadLabelTexture, textSprite, createWorker, WORKER } from './sceneAssets.js';
import { buildRoom } from './sceneRoom.js';
import { addRackDetails, addPalletLoad, addPalletJack, addFloorPallets } from './sceneProps.js';
export { countPositions } from './rackModel.js';

const SLIDE_DISTANCE = 7;
const JACK_AT = [-1.6, 0.9];
const LEFT_WALL_X = -ROOM.width / 2;
const LABEL_TEXT = { ru: ['до 4 т / ярус', 'Ваше помещение', '17 м', '13 м', '2,3 м', '6,3 м', '1,3 м'], uz: ['4 t gacha / yarus', 'Sizning omboringiz', '17 m', '13 m', '2,3 m', '6,3 m', '1,3 m'] };

export function createRackScene(THREE, canvas, lang = 'ru', { RoomEnvironment } = {}) {
  const model = rackModel();
  const floorCount = floorPositions();
  const text = LABEL_TEXT[lang] || LABEL_TEXT.ru;
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'default' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const camera = new THREE.OrthographicCamera(-12, 12, 12, -12, 0.1, 120);
  if (RoomEnvironment) {
    // Отражения на металле: без окружения сталь и краска выглядят как пластилин.
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.5;
    pmrem.dispose();
  }
  scene.add(new THREE.HemisphereLight(0xe9f4ff, 0x68829b, RoomEnvironment ? 1.4 : 2.2));
  const sun = new THREE.DirectionalLight(0xfff3dd, 4.0);
  sun.position.set(-7, 17, 10); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 60 });
  sun.shadow.normalBias = 0.04; sun.shadow.bias = -0.0002;
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0xc7eaff, 1.6); fill.position.set(9, 7, -10); scene.add(fill);
  const material = (color, roughness = 0.7, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
  // Цвета стеллажа — по фото RaxPro с сайта: синие стойки, оранжевые балки, жёлтые пятки, оцинкованные раскосы.
  const mats = {
    steel: material(0xb5c5cf, 0.32, 0.65), upright: material(0x1b3b8f, 0.42, 0.35), beam: material(0xf59b1a, 0.38, 0.3),
    foot: material(0xf2c318, 0.5, 0.2), guard: material(0xf2c318, 0.5, 0.1), hole: material(0x0d1f4a),
    dark: material(0x263746), wood: material(0xa98860), yellow: material(0xf5cf39),
    box: new THREE.MeshStandardMaterial({ map: cartonTexture(THREE), roughness: 0.95 }),
    wrap: new THREE.MeshStandardMaterial({ map: wrapTexture(THREE), roughness: 0.28, metalness: 0.05 }),
    drum: material(0x2b62b8, 0.35, 0.3), label: new THREE.MeshStandardMaterial({ map: loadLabelTexture(THREE, text[0]), roughness: 0.5 }),
    jackBody: material(0xf0731a, 0.45, 0.25), floor: material(0x8399a9, 0.98), column: material(0xb7bcb9, 0.98),
    extinguisher: material(0xd12b2b, 0.4, 0.3), extinguisherSign: material(0xe03030, 0.7),
  };

  // Одинаковые детали складываются в InstancedMesh; владелец (owner) говорит, на каком этапе деталь падает на место.
  const batches = new Map();
  function part(size, name, position, owner = null, rotation = [0, 0, 0], shape = 'box') {
    const key = `${name}:${shape}:${size.join(',')}`;
    if (!batches.has(key)) batches.set(key, { size, name, shape, items: [] });
    batches.get(key).items.push({ position, owner, quaternion: new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation, 'YXZ')) });
  }
  function framePart(f, size, name, u, y, v, owner, tilt = 0) {
    const x = f.x + u * Math.cos(f.rot) - v * Math.sin(f.rot);
    const z = f.z + u * Math.sin(f.rot) + v * Math.cos(f.rot);
    part(size, name, [x, y, z], owner, [tilt, -f.rot, 0]);
  }
  buildRoom(THREE, scene, part);

  const draftPoints = [];
  function line(a, b) { draftPoints.push(...a, ...b); }
  model.frames.forEach((f, i) => {
    const owner = { stage: 'frames', index: i, count: model.frames.length, window: 0.48 };
    for (const v of [0, RACK_DEPTH]) {
      framePart(f, [0.11, f.height, 0.095], 'upright', 0, f.height / 2, v, owner);
      framePart(f, [0.3, 0.05, 0.24], 'foot', 0, 0.04, v, owner);
      for (let y = 0.27; y < f.height - 0.1; y += 0.21) framePart(f, [0.035, 0.06, 0.006], 'hole', 0, y, v + 0.05, owner);
      const x = f.x - Math.sin(f.rot) * v, z = f.z + Math.cos(f.rot) * v;
      line([x, 0.06, z], [x, f.height, z]);
    }
    const far = [f.x - Math.sin(f.rot) * RACK_DEPTH, f.z + Math.cos(f.rot) * RACK_DEPTH];
    line([f.x, f.height, f.z], [far[0], f.height, far[1]]);
    line([f.x, 0.05, f.z], [far[0], 0.05, far[1]]);
    const braceCount = Math.floor(f.height / 1.2);
    for (let j = 0; j < braceCount; j++) {
      const y = 0.45 + j * 1.1;
      framePart(f, [0.045, 0.045, RACK_DEPTH], 'steel', 0, y, RACK_DEPTH / 2, owner);
      line([f.x, y, f.z], [far[0], y + 1.1, far[1]]);
      const diagonal = Math.hypot(1.1, RACK_DEPTH);
      framePart(f, [0.04, 0.04, diagonal], 'steel', 0, y + 0.55, RACK_DEPTH / 2, owner, (j % 2 ? 1 : -1) * Math.atan2(1.1, RACK_DEPTH));
    }
  });
  model.beams.forEach((b, i) => {
    const owner = { stage: 'beams', index: i, count: model.beams.length, window: 0.32 };
    part([BAY_WIDTH - 0.1, 0.17, 0.085], 'beam', [b.x, b.y, b.z], owner, [0, -b.rot, 0]);
    for (const side of [-1, 1]) {
      const dx = side * (BAY_WIDTH / 2 - 0.075) * Math.cos(b.rot);
      const dz = side * (BAY_WIDTH / 2 - 0.075) * Math.sin(b.rot);
      part([0.065, 0.31, 0.12], 'beam', [b.x + dx, b.y, b.z + dz], owner, [0, -b.rot, 0]);
    }
    line([b.x - Math.cos(b.rot) * BAY_WIDTH / 2, b.y, b.z - Math.sin(b.rot) * BAY_WIDTH / 2],
      [b.x + Math.cos(b.rot) * BAY_WIDTH / 2, b.y, b.z + Math.sin(b.rot) * BAY_WIDTH / 2]);
  });
  addRackDetails(part, framePart, model);
  model.slots.forEach((s, i) => addPalletLoad(part, { stage: 'load', index: i, count: model.slots.length, window: 0.22 }, s));
  addFloorPallets(part);
  addPalletJack(part, JACK_AT[0], JACK_AT[1]);

  const floorBase = mats.floor.color.clone();
  const blueprintFloor = new THREE.Color(0x163653);
  const animatedBatches = [];
  const dummy = new THREE.Object3D();
  for (const batch of batches.values()) {
    const geometry = batch.shape === 'cyl'
      ? new THREE.CylinderGeometry(batch.size[0], batch.size[0], batch.size[1], 18)
      : new THREE.BoxGeometry(...batch.size);
    const mesh = new THREE.InstancedMesh(geometry, mats[batch.name], batch.items.length);
    mesh.frustumCulled = false;
    mesh.castShadow = !['floor', 'hole', 'label'].includes(batch.name); mesh.receiveShadow = true;
    for (const [i, item] of batch.items.entries()) {
      dummy.position.set(...item.position); dummy.quaternion.copy(item.quaternion); dummy.updateMatrix(); mesh.setMatrixAt(i, dummy.matrix);
    }
    if (batch.items.some((item) => item.owner)) animatedBatches.push({ ...batch, mesh });
    scene.add(mesh);
  }
  const draftGeo = new THREE.BufferGeometry();
  const draftArray = new Float32Array(draftPoints);
  draftGeo.setAttribute('position', new THREE.BufferAttribute(draftArray, 3));
  const draftMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95, depthTest: false });
  const draft = new THREE.LineSegments(draftGeo, draftMat); draft.renderOrder = 2; draft.frustumCulled = false; scene.add(draft);
  // Размеры на чертеже: ширина секции, высота рамы, глубина — из модели стеллажа.
  const firstBay = model.bays[1], firstFrame = model.frames[0];
  const draftLabels = [
    [text[4], [firstBay.x + BAY_WIDTH / 2, 1.7 + 0.42, firstBay.z + RACK_DEPTH + 0.2]],
    [text[5], [firstFrame.x - 0.9, firstFrame.height * 0.55, firstFrame.z + RACK_DEPTH + 0.3]],
    [text[6], [firstFrame.x, firstFrame.height + 0.35, firstFrame.z + RACK_DEPTH / 2]],
  ].map(([label, position]) => { const sprite = textSprite(THREE, label, 0.62, '700 120px sans-serif'); sprite.position.set(...position); scene.add(sprite); return sprite; });

  // Замер: размерные линии по двум сторонам помещения с цифрами и подписью.
  const measure = new THREE.Group(); scene.add(measure);
  const fx = ROOM.width / 2 - 0.2, fz = ROOM.depth / 2 - 0.2, m = 0.5;
  const measurePoints = [
    -fx, 0.06, fz + m, fx, 0.06, fz + m, -fx, 0.06, fz + m - 0.3, -fx, 0.06, fz + m + 0.3, fx, 0.06, fz + m - 0.3, fx, 0.06, fz + m + 0.3,
    fx + m, 0.06, -fz, fx + m, 0.06, fz, fx + m - 0.3, 0.06, -fz, fx + m + 0.3, 0.06, -fz, fx + m - 0.3, 0.06, fz, fx + m + 0.3, 0.06, fz,
  ];
  const measureGeo = new THREE.BufferGeometry(); measureGeo.setAttribute('position', new THREE.Float32BufferAttribute(measurePoints, 3));
  const measureMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true });
  measure.add(new THREE.LineSegments(measureGeo, measureMat));
  const measureLabels = [
    [text[1], [-1.5, 2.45, 2.9], 0.9], [text[2], [0.5, 0.5, fz + 1.05], 0.62], [text[3], [fx + 1.3, 0.5, 0], 0.62],
  ].map(([label, position, height]) => { const sprite = textSprite(THREE, label, height, height < 0.8 ? '700 120px sans-serif' : undefined); sprite.position.set(...position); measure.add(sprite); return sprite; });

  const workerA = createWorker(THREE, WORKER.SURVEYOR_PLAN), workerB = createWorker(THREE, WORKER.SURVEYOR_LASER);
  const installer = createWorker(THREE, WORKER.INSTALLER), operator = createWorker(THREE, WORKER.OPERATOR);
  scene.add(workerA.group, workerB.group, installer.group, operator.group);
  workerA.group.position.set(-2.5, 0, 2.5); workerA.group.rotation.y = 0.5;
  workerB.group.position.set(-0.5, 0, 3.3); workerB.group.rotation.y = -Math.PI / 2;
  installer.group.position.set(-3.4, 0, -0.9); installer.group.rotation.y = 2.75;
  operator.group.position.set(JACK_AT[0] + 1.45, 0, JACK_AT[1]); operator.group.rotation.y = -Math.PI / 2;
  const materialsOf = (worker) => {
    const set = new Set();
    worker.group.traverse((o) => { if (o.material) { o.material.transparent = true; set.add(o.material); } });
    return set;
  };
  const people = [
    { worker: workerA, materials: materialsOf(workerA), key: 'people' }, { worker: workerB, materials: materialsOf(workerB), key: 'people' },
    { worker: installer, materials: materialsOf(installer), key: 'installer' }, { worker: operator, materials: materialsOf(operator), key: 'jack' },
  ];
  // Луч дальномера: от прибора в руке до левой стены, с точкой на стене.
  const laserGeo = new THREE.BufferGeometry(); laserGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(6), 3));
  const laserMat = new THREE.LineBasicMaterial({ color: 0xff3b30, transparent: true, depthTest: false });
  const laser = new THREE.LineSegments(laserGeo, laserMat); laser.renderOrder = 3; laser.frustumCulled = false; measure.add(laser);
  const laserDot = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0xff3b30, transparent: true, depthTest: false })); laserDot.scale.set(0.16, 0.16, 1); measure.add(laserDot);
  const toolPosition = new THREE.Vector3();

  let aspect = 1, lastProgress = -1;
  function cameraLayout(progress) {
    const end = Math.max(0, (progress - 0.94) / 0.06);
    let span, target;
    if (aspect < 1) {
      // Портрет: сначала близко к замерщикам, по мере сборки камера отъезжает, чтобы стеллаж занял всю ширину.
      const grow = smoothstep(spanOf(progress, 0, STAGES.draft.to));
      span = (5.4 + 2.5 * grow) / aspect * (1 + end * 0.03);
      target = [-1.6 + 1.0 * grow, 4.0 + 0.6 * grow, 2.6 - 3.0 * grow];
    } else {
      span = Math.max(9.7, 12.4 / aspect) * (1 + end * 0.04);
      target = [0, 1.8, 0];
    }
    camera.left = -span * aspect; camera.right = span * aspect; camera.top = span; camera.bottom = -span;
    camera.position.set(target[0] + 18, target[1] + 18, target[2] + 25); camera.lookAt(...target); camera.updateProjectionMatrix();
  }
  function placeItem(item, t) {
    const o = item.owner;
    const slide = o.motion === 'slide' ? (1 - easeOutCubic(t)) * SLIDE_DISTANCE : 0;
    const lift = o.motion === 'slide' ? 0 : dropOffset(t);
    dummy.position.set(item.position[0] + slide, t <= 0 ? -60 : item.position[1] + lift, item.position[2]);
    dummy.quaternion.copy(item.quaternion); dummy.updateMatrix();
  }
  function update(progress, time) {
    const s = sceneState(progress);
    if (progress !== lastProgress) {
      mats.floor.color.copy(floorBase).lerp(blueprintFloor, s.draftDraw * s.draftAlpha * 0.9);
      for (const batch of animatedBatches) {
        batch.items.forEach((item, i) => {
          const o = item.owner;
          placeItem(item, o ? stagger(s[o.stage], o.index, o.count, o.window) : 1);
          batch.mesh.setMatrixAt(i, dummy.matrix);
        });
        batch.mesh.instanceMatrix.needsUpdate = true;
      }
      // Текущий отрезок чертежа дорисовывается постепенно, а не появляется целиком.
      draftArray.set(draftPoints);
      const segment = s.draftDraw * draftPoints.length / 6;
      const whole = Math.floor(segment), fraction = segment - whole, offset = whole * 6;
      if (offset + 5 < draftArray.length) for (let axis = 0; axis < 3; axis++) {
        draftArray[offset + 3 + axis] = draftArray[offset + axis] + (draftPoints[offset + 3 + axis] - draftArray[offset + axis]) * fraction;
      }
      draftGeo.setDrawRange(0, Math.min(draftArray.length / 3, (whole + 1) * 2));
      draftGeo.attributes.position.needsUpdate = true;
      draftMat.opacity = s.draftAlpha; draft.visible = s.draftDraw > 0 && s.draftAlpha > 0.01;
      for (const sprite of draftLabels) { sprite.material.opacity = s.labels * s.draftAlpha; sprite.visible = sprite.material.opacity > 0.01; }
      operator.group.position.x = JACK_AT[0] + 1.45 + (1 - s.jack) * SLIDE_DISTANCE;
      cameraLayout(progress);
      lastProgress = progress;
      canvas.dataset.stage = s.stage; canvas.dataset.progress = progress.toFixed(4);
    }
    const intro = Math.min(time / 3.8, 1);
    for (const { worker, materials, key } of people) {
      const presence = s[key];
      worker.group.visible = presence > 0.01;
      for (const m of materials) m.opacity = presence;
    }
    workerA.arms[1].rotation.x = -0.35 - Math.sin(intro * Math.PI) * 0.45;
    workerB.group.position.x = 0.1 - Math.min(1, intro * 2) * 0.6;
    workerA.plan.position.z = 0.4 + Math.sin(intro * Math.PI) * 0.19;
    workerA.plan.rotation.y = Math.sin(intro * Math.PI) * 0.12;
    measure.visible = s.people > 0.01;
    const reveal = s.people * Math.min(time / 1.2, 1);
    measureMat.opacity = reveal;
    for (const sprite of measureLabels) sprite.material.opacity = reveal;
    workerB.group.updateMatrixWorld(true);
    workerB.tool.getWorldPosition(toolPosition);
    laserGeo.attributes.position.set([toolPosition.x, toolPosition.y, toolPosition.z, LEFT_WALL_X + 0.03, toolPosition.y, toolPosition.z]);
    laserGeo.attributes.position.needsUpdate = true;
    laserDot.position.set(LEFT_WALL_X + 0.03, toolPosition.y, toolPosition.z);
    laserMat.opacity = laserDot.material.opacity = reveal * (0.75 + 0.25 * Math.sin(time * 9));
    const filled = model.slots.filter((_, i) => stagger(s.load, i, model.slots.length, 0.22) >= 0.99).length;
    return { ...s, filled, floorPositions: floorCount, introMoving: intro < 1 && s.people > 0.01 };
  }
  function resize(w, h) {
    aspect = w / Math.max(h, 1); renderer.setSize(w, h, false);
    cameraLayout(lastProgress < 0 ? 0 : lastProgress);
  }
  function dispose() {
    const geometries = new Set(), materials = new Set(Object.values(mats)), textures = new Set();
    scene.traverse((o) => { if (o.geometry) geometries.add(o.geometry); if (o.material) materials.add(o.material); });
    for (const m of materials) { if (m.map) textures.add(m.map); m.dispose(); }
    for (const g of geometries) g.dispose();
    for (const t of textures) t.dispose();
    if (scene.environment) scene.environment.dispose();
    sun.shadow.dispose(); renderer.dispose();
  }
  return { update, resize, render: () => renderer.render(scene, camera), dispose, positions: model.slots.length };
}
