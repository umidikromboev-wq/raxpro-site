import { sceneState, stagger, dropOffset } from './timeline.js';
import { rackModel, ROOM, COLUMN, BAY_WIDTH, RACK_DEPTH, floorPositions } from './rackModel.js';
import { cartonTexture, textSprite, createWorker } from './sceneAssets.js';
export { countPositions } from './rackModel.js';

export function createRackScene(THREE, canvas, lang = 'ru') {
  const model = rackModel();
  const floorCount = floorPositions();
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'default' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const camera = new THREE.OrthographicCamera(-12, 12, 12, -12, 0.1, 120);
  scene.add(new THREE.HemisphereLight(0xe9f4ff, 0x68829b, 2.2));
  const sun = new THREE.DirectionalLight(0xfff3dd, 4.2);
  sun.position.set(-7, 17, 10); sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -15, right: 15, top: 15, bottom: -15, near: 1, far: 55 });
  sun.shadow.normalBias = 0.04; sun.shadow.bias = -0.0002;
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0xc7eaff, 1.8); fill.position.set(9, 7, -10); scene.add(fill);
  const material = (color, roughness = 0.7, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
  const mats = {
    steel: material(0xb5c5cf, 0.32, 0.65), beam: material(0x0876c3, 0.32, 0.38),
    dark: material(0x263746), wood: material(0xa98860), hole: material(0x33434d),
    box: new THREE.MeshStandardMaterial({ map: cartonTexture(THREE), roughness: 0.95 }),
    yellow: material(0xf5cf39), floor: material(0x8399a9, 0.98), column: material(0xb7bcb9, 0.98),
  };

  // Batch repeated parts by dimensions/material, retaining per-part timeline ownership.
  const batches = new Map();
  function part(size, name, position, owner = null, rotation = [0, 0, 0]) {
    const key = `${name}:${size.join(',')}`;
    if (!batches.has(key)) batches.set(key, { size, name, items: [] });
    batches.get(key).items.push({ position, owner, quaternion: new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation, 'YXZ')) });
  }
  function framePart(f, size, name, u, y, v, owner, tilt = 0) {
    const x = f.x + u * Math.cos(f.rot) - v * Math.sin(f.rot);
    const z = f.z + u * Math.sin(f.rot) + v * Math.cos(f.rot);
    part(size, name, [x, y, z], owner, [tilt, -f.rot, 0]);
  }
  part([ROOM.width, 0.22, ROOM.depth], 'floor', [0, -0.13, 0]);
  part([COLUMN.width, ROOM.height, COLUMN.width], 'column', [COLUMN.x, ROOM.height / 2, COLUMN.z]);
  part([0.76, 0.85, 0.76], 'dark', [COLUMN.x, 0.43, COLUMN.z]);
  for (let i = 0; i < 3; i++) part([0.12, 0.75, 0.025], 'yellow', [COLUMN.x - 0.23 + i * 0.23, 0.44, COLUMN.z + 0.395], null, [0, 0, -0.22]);

  const floorLines = [];
  function floorSegment(x, z, xx, zz) { floorLines.push(x, 0.005, z, xx, 0.005, zz); }
  const fw = ROOM.width / 2 - 0.15, fd = ROOM.depth / 2 - 0.15;
  floorSegment(-fw, -fd, fw, -fd); floorSegment(fw, -fd, fw, fd);
  floorSegment(fw, fd, -fw, fd); floorSegment(-fw, fd, -fw, -fd);
  // Reference footprint stays visible as the scene gains storage above it.
  for (let x = -8; x <= 8; x += 1) floorSegment(x, fd - 0.07, x, fd + 0.07);
  const footprint = new THREE.LineSegments(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xf4f8ff, transparent: true, opacity: 0.65 }));
  footprint.geometry.setAttribute('position', new THREE.Float32BufferAttribute(floorLines, 3)); scene.add(footprint);

  const draftPoints = [];
  function line(a, b) { draftPoints.push(...a, ...b); }
  model.frames.forEach((f, i) => {
    const owner = { stage: 'frames', index: i, count: model.frames.length, window: 0.48 };
    for (const v of [0, RACK_DEPTH]) {
      framePart(f, [0.11, f.height, 0.095], 'steel', 0, f.height / 2, v, owner);
      framePart(f, [0.3, 0.05, 0.24], 'steel', 0, 0.04, v, owner);
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
  model.slots.forEach((s, i) => {
    const owner = { stage: 'load', index: i, count: model.slots.length, window: 0.22 };
    const place = (size, name, u, y, v) => part(size, name,
      [s.x + u * Math.cos(s.rot) - v * Math.sin(s.rot), s.y + y, s.z + u * Math.sin(s.rot) + v * Math.cos(s.rot)], owner, [0, -s.rot, 0]);
    for (const u of [-0.38, 0, 0.38]) place([0.12, 0.1, 1.16], 'wood', u, 0.05, 0);
    for (const v of [-0.48, -0.24, 0, 0.24, 0.48]) place([1.03, 0.04, 0.18], 'wood', 0, 0.12, v);
    // Several smaller cartons read as goods rather than one solid block per pallet.
    for (const u of [-0.245, 0.245]) for (const v of [-0.275, 0.275]) {
      place([0.47, s.height, 0.52], 'box', u, 0.14 + s.height / 2, v);
    }
  });

  const floorBase = mats.floor.color.clone();
  const blueprintFloor = new THREE.Color(0x163653);
  const animatedBatches = [];
  const dummy = new THREE.Object3D();
  for (const batch of batches.values()) {
    const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(...batch.size), mats[batch.name], batch.items.length);
    mesh.frustumCulled = false;
    mesh.castShadow = !['floor', 'hole'].includes(batch.name); mesh.receiveShadow = true;
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

  const measure = new THREE.Group(); scene.add(measure);
  const measurePoints = [-7, 0.06, 5.1, 5, 0.06, 5.1, -7, 0.06, 4.8, -7, 0.06, 5.4, 5, 0.06, 4.8, 5, 0.06, 5.4];
  const measureGeo = new THREE.BufferGeometry(); measureGeo.setAttribute('position', new THREE.Float32BufferAttribute(measurePoints, 3));
  const measureMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true });
  measure.add(new THREE.LineSegments(measureGeo, measureMat));
  const dimensionLabel = textSprite(THREE, lang === 'uz' ? 'Sizning omboringiz' : 'Ваше помещение');
  dimensionLabel.position.set(-1, 0.45, 5.7); measure.add(dimensionLabel);
  const workerA = createWorker(THREE), workerB = createWorker(THREE, 1);
  scene.add(workerA.group, workerB.group);
  workerA.group.position.set(-2.5, 0, 2.5); workerA.group.rotation.y = 0.5;
  workerB.group.position.set(-0.5, 0, 3.3); workerB.group.rotation.y = -1.8;
  const workerMaterials = new Set();
  for (const w of [workerA, workerB]) w.group.traverse((o) => {
    if (o.material) { o.material.transparent = true; workerMaterials.add(o.material); }
  });

  let aspect = 1, lastProgress = -1;
  function cameraLayout(progress) {
    // A restrained dolly preserves the footprint comparison and leaves room for falling parts.
    const end = Math.max(0, (progress - 0.94) / 0.06);
    const span = Math.max(9.7, 12.4 / aspect) * (1 + end * 0.04);
    camera.left = -span * aspect; camera.right = span * aspect; camera.top = span; camera.bottom = -span;
    camera.position.set(18, 18, 25); camera.lookAt(0, 1.8, 0); camera.updateProjectionMatrix();
  }
  function update(progress, time) {
    const s = sceneState(progress);
    if (progress !== lastProgress) {
      mats.floor.color.copy(floorBase).lerp(blueprintFloor, s.draftDraw * s.draftAlpha * 0.9);
      for (const batch of animatedBatches) {
        batch.items.forEach((item, i) => {
          const o = item.owner;
          const t = o ? stagger(s[o.stage], o.index, o.count, o.window) : 1;
          dummy.position.set(item.position[0], item.position[1] + (t <= 0 ? -60 : dropOffset(t)), item.position[2]);
          dummy.quaternion.copy(item.quaternion); dummy.updateMatrix(); batch.mesh.setMatrixAt(i, dummy.matrix);
        });
        batch.mesh.instanceMatrix.needsUpdate = true;
      }
      // Draw the current segment progressively, instead of popping whole lines into view.
      draftArray.set(draftPoints);
      const segment = s.draftDraw * draftPoints.length / 6;
      const whole = Math.floor(segment), fraction = segment - whole, offset = whole * 6;
      if (offset + 5 < draftArray.length) for (let axis = 0; axis < 3; axis++) {
        draftArray[offset + 3 + axis] = draftArray[offset + axis] + (draftPoints[offset + 3 + axis] - draftArray[offset + axis]) * fraction;
      }
      draftGeo.setDrawRange(0, Math.min(draftArray.length / 3, (whole + 1) * 2));
      draftGeo.attributes.position.needsUpdate = true;
      draftMat.opacity = s.draftAlpha; draft.visible = s.draftDraw > 0 && s.draftAlpha > 0.01;
      cameraLayout(progress);
      lastProgress = progress;
      canvas.dataset.stage = s.stage; canvas.dataset.progress = progress.toFixed(4);
    }
    const intro = Math.min(time / 3.8, 1);
    workerA.group.visible = workerB.group.visible = s.people > 0.01;
    for (const m of workerMaterials) m.opacity = s.people;
    workerA.arms[1].rotation.x = -0.35 - Math.sin(intro * Math.PI) * 0.45;
    workerB.arms[0].rotation.x = -0.35 - Math.sin(intro * Math.PI) * 0.55;
    workerB.group.position.x = 0.1 - Math.min(1, intro * 2) * 0.6;
    workerA.plan.position.z = 0.4 + Math.sin(intro * Math.PI) * 0.19;
    workerA.plan.rotation.y = Math.sin(intro * Math.PI) * 0.12;
    measure.visible = s.people > 0.01;
    measureMat.opacity = s.people * Math.min(time / 1.2, 1);
    dimensionLabel.material.opacity = s.people * Math.min(time / 1.2, 1);
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
    sun.shadow.dispose(); renderer.dispose();
  }
  return { update, resize, render: () => renderer.render(scene, camera), dispose, positions: model.slots.length };
}
