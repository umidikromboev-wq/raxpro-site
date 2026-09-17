// Небольшие процедурные ассеты сцены: текстуры на canvas и фигурки людей.
// Ни моделей, ни загрузок — всё рисуется кодом, чтобы герой весил столько же, сколько three.js.

function canvasTexture(THREE, width, height, draw, repeat) {
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  draw(canvas.getContext('2d'), width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  if (repeat) { texture.wrapS = texture.wrapT = THREE.RepeatWrapping; texture.repeat.set(...repeat); }
  return texture;
}

/** Картонная коробка: шов, этикетка со штрихкодом, стрелки «верх». */
export function cartonTexture(THREE) {
  return canvasTexture(THREE, 256, 256, (ctx) => {
    ctx.fillStyle = '#cfad80'; ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = '#b79266'; ctx.fillRect(121, 0, 14, 256);
    ctx.strokeStyle = '#937450'; ctx.lineWidth = 2; ctx.strokeRect(2, 2, 252, 252);
    ctx.fillStyle = '#eee8dc'; ctx.fillRect(23, 148, 71, 57);
    ctx.fillStyle = '#423d36';
    for (let i = 0; i < 25; i++) ctx.fillRect(29 + i * 2.3, 156, i % 3 === 0 ? 2 : 1, 27);
    ctx.font = '8px sans-serif'; ctx.fillText('RAXPRO / STORAGE', 29, 196);
    ctx.font = '22px sans-serif'; ctx.fillText('↑ ↑', 177, 208);
  });
}

/** Стретч-плёнка: светлый блок с полосами натяжения по кругу. */
export function wrapTexture(THREE) {
  return canvasTexture(THREE, 128, 256, (ctx, w, h) => {
    ctx.fillStyle = '#d9e4ed'; ctx.fillRect(0, 0, w, h);
    for (let y = 6; y < h; y += 20) {
      ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y + 5); ctx.stroke();
      ctx.strokeStyle = 'rgba(110,135,160,0.28)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, y + 9); ctx.lineTo(w, y + 13); ctx.stroke();
    }
  });
}

/** Табличка нагрузки на балке первого яруса. Цифра — с сайта («до 4 т на ярус»). */
export function loadLabelTexture(THREE, text) {
  return canvasTexture(THREE, 256, 96, (ctx, w, h) => {
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#1b3b8f'; ctx.fillRect(0, 0, w, 26);
    ctx.fillStyle = '#ffffff'; ctx.font = '700 17px sans-serif'; ctx.fillText('RAXPRO', 12, 19);
    ctx.fillStyle = '#1b2430'; ctx.font = '700 38px sans-serif'; ctx.fillText(text, 12, 72);
  });
}

/** Бетонный пол: неоднородность, швы плит и жёлтая разметка прохода. Прозрачно там, где пусто. */
export function floorMarkingTexture(THREE, room, aisleLines) {
  const px = 64;
  return canvasTexture(THREE, room.width * px, room.depth * px, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < 3200; i++) {
      const tone = 40 + Math.random() * 35;
      ctx.fillStyle = `rgba(${tone | 0},${tone + 14 | 0},${tone + 28 | 0},${(Math.random() * 0.08).toFixed(3)})`;
      ctx.fillRect(Math.random() * w, Math.random() * h, 3 + Math.random() * 16, 3 + Math.random() * 16);
    }
    ctx.strokeStyle = 'rgba(45,62,78,0.38)'; ctx.lineWidth = 3;
    for (let x = 0; x <= room.width; x += 3.4) { ctx.beginPath(); ctx.moveTo(x * px, 0); ctx.lineTo(x * px, h); ctx.stroke(); }
    for (let z = 0; z <= room.depth; z += 3.25) { ctx.beginPath(); ctx.moveTo(0, z * px); ctx.lineTo(w, z * px); ctx.stroke(); }
    ctx.strokeStyle = '#f0c419'; ctx.lineWidth = 7;
    for (const [x0, z0, x1, z1] of aisleLines) {
      ctx.beginPath();
      ctx.moveTo((x0 + room.width / 2) * px, (z0 + room.depth / 2) * px);
      ctx.lineTo((x1 + room.width / 2) * px, (z1 + room.depth / 2) * px);
      ctx.stroke();
    }
  });
}

/** Сэндвич-панель стены: вертикальные швы через метр и тёмный цоколь. */
export function wallTexture(THREE, widthMeters, heightMeters) {
  const px = 32;
  return canvasTexture(THREE, widthMeters * px, heightMeters * px, (ctx, w, h) => {
    ctx.fillStyle = '#d5dee6'; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(90,110,130,0.38)'; ctx.lineWidth = 2;
    for (let x = 0; x <= widthMeters; x += 1) { ctx.beginPath(); ctx.moveTo(x * px, 0); ctx.lineTo(x * px, h); ctx.stroke(); }
    ctx.fillStyle = '#3b4a58'; ctx.fillRect(0, h - 0.6 * px, w, 0.6 * px);
  });
}

/** Секционные ворота: ламели и синяя рама. */
export function gateTexture(THREE) {
  return canvasTexture(THREE, 256, 288, (ctx, w, h) => {
    for (let y = 0; y < h; y += 16) { ctx.fillStyle = y % 32 ? '#b9cad7' : '#9cb0c0'; ctx.fillRect(0, y, w, 16); }
    ctx.strokeStyle = '#1b3b8f'; ctx.lineWidth = 14; ctx.strokeRect(0, 0, w, h);
  });
}

/** Подпись в сцене: холст по размеру текста, высота задаётся в метрах сцены, тёмная обводка читается и на светлой стене. */
export function textSprite(THREE, text, height = 0.7, font = '500 120px sans-serif') {
  const probe = document.createElement('canvas').getContext('2d');
  probe.font = font;
  const padding = 40, h = 192, w = Math.ceil(probe.measureText(text).width) + padding * 2;
  const map = canvasTexture(THREE, w, h, (ctx) => {
    ctx.font = font; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round'; ctx.lineWidth = 16; ctx.strokeStyle = 'rgba(7,59,103,0.85)';
    ctx.strokeText(text, w / 2, h / 2 + 6);
    ctx.fillStyle = '#ffffff'; ctx.fillText(text, w / 2, h / 2 + 6);
  });
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map, transparent: true, depthTest: false }));
  sprite.scale.set(height * w / h, height, 1);
  return sprite;
}

export const WORKER = { SURVEYOR_PLAN: 0, SURVEYOR_LASER: 1, INSTALLER: 2, OPERATOR: 3 };

/**
 * Фигурка работника. Варианты: замерщик с планшетом-планом, замерщик с лазерным
 * дальномером (tool — точка, откуда идёт луч), монтажник с киянкой, оператор рохли.
 */
export function createWorker(THREE, variant = WORKER.SURVEYOR_PLAN) {
  const group = new THREE.Group();
  const mat = (color) => new THREE.MeshStandardMaterial({ color, roughness: 0.8 });
  const vestColor = [0xd7e356, 0x248ac0, 0xf0731a, 0xf0731a][variant];
  const navy = mat(0x183b67), vest = mat(vestColor);
  const skin = mat(0xd6a981), white = mat(0xf4f4ed), dark = mat(0x202b35);
  const add = (geometry, material, x, y, z, parent = group) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z); mesh.castShadow = true; parent.add(mesh); return mesh;
  };
  add(new THREE.BoxGeometry(0.41, 0.49, 0.24), vest, 0, 1.04, 0);
  add(new THREE.BoxGeometry(0.43, 0.065, 0.25), white, 0, 0.96, 0);
  add(new THREE.BoxGeometry(0.07, 0.47, 0.255), white, -0.12, 1.04, 0);
  add(new THREE.BoxGeometry(0.07, 0.47, 0.255), white, 0.12, 1.04, 0);
  add(new THREE.SphereGeometry(0.155, 16, 12), skin, 0, 1.43, 0);
  const helmet = variant >= WORKER.INSTALLER ? mat(0xf5cf39) : white;
  add(new THREE.SphereGeometry(0.18, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), helmet, 0, 1.46, 0);
  add(new THREE.CylinderGeometry(0.205, 0.205, 0.035, 20), helmet, 0, 1.46, 0.015);
  for (const x of [-0.115, 0.115]) {
    add(new THREE.BoxGeometry(0.15, 0.64, 0.18), navy, x, 0.46, 0);
    add(new THREE.BoxGeometry(0.18, 0.12, 0.3), dark, x, 0.09, 0.055);
  }
  const arms = [];
  const hands = [];
  for (const side of [-1, 1]) {
    const arm = new THREE.Group(); arm.position.set(side * 0.27, 1.22, 0);
    add(new THREE.CylinderGeometry(0.075, 0.065, 0.3, 10), navy, 0, -0.13, 0, arm);
    const forearm = add(new THREE.CylinderGeometry(0.06, 0.05, 0.29, 10), skin, 0, -0.27, 0.1, arm);
    forearm.rotation.x = -0.95;
    hands.push(add(new THREE.SphereGeometry(0.065, 10, 8), skin, 0, -0.35, 0.22, arm));
    arm.rotation.x = variant === WORKER.OPERATOR ? -1.15 : -0.35;
    group.add(arm); arms.push(arm);
  }
  const plan = new THREE.Group();
  add(new THREE.BoxGeometry(0.6, 0.025, 0.43), white, 0, 0, 0, plan);
  const ink = mat(0x4787b7);
  for (let i = 0; i < 4; i++) add(new THREE.BoxGeometry(0.4, 0.004, 0.013), ink, 0, 0.018, -0.12 + i * 0.07, plan);
  plan.position.set(0, 0.99, 0.4); plan.rotation.x = 0.13; group.add(plan);
  plan.visible = variant === WORKER.SURVEYOR_PLAN;
  let tool = null;
  if (variant === WORKER.SURVEYOR_LASER) {
    tool = add(new THREE.BoxGeometry(0.07, 0.05, 0.13), dark, 0, -0.36, 0.28, arms[1]);
    arms[1].rotation.x = -1.35;
  }
  if (variant === WORKER.INSTALLER) {
    const mallet = new THREE.Group();
    add(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8), mat(0xa98860), 0, 0, 0, mallet);
    add(new THREE.CylinderGeometry(0.07, 0.07, 0.16, 12), dark, 0, 0.25, 0, mallet).rotation.z = Math.PI / 2;
    mallet.position.set(0, -0.36, 0.24); mallet.rotation.x = 0.4; arms[1].add(mallet);
  }
  return { group, arms, hands, plan, tool };
}
