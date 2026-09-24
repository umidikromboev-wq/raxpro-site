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

/** Коробка второго типа: тёмнее, с бумажным скотчем крест-накрест и маркировкой «хрупкое». */
export function cartonTapeTexture(THREE) {
  return canvasTexture(THREE, 256, 256, (ctx) => {
    ctx.fillStyle = '#b8935f'; ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = '#e8d9b8'; ctx.fillRect(110, 0, 36, 256); ctx.fillRect(0, 110, 256, 36);
    ctx.strokeStyle = '#8a6a40'; ctx.lineWidth = 2; ctx.strokeRect(2, 2, 252, 252);
    ctx.fillStyle = '#2b2b2b'; ctx.font = '700 20px sans-serif'; ctx.fillText('FRAGILE', 20, 40);
    ctx.font = '26px sans-serif'; ctx.fillText('♻', 214, 236);
  });
}

/** Баннер RAXPRO на стене цеха: синее поле, белая монограмма-стеллаж и слоган. */
export function bannerTexture(THREE, slogan) {
  return canvasTexture(THREE, 1024, 256, (ctx, w, h) => {
    ctx.fillStyle = '#1b3b8f'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    for (const y of [70, 122, 174]) ctx.fillRect(70, y, 120, 14);
    ctx.fillRect(70, 70, 14, 118); ctx.fillRect(176, 70, 14, 118);
    ctx.font = '700 96px sans-serif'; ctx.fillText('RAXPRO', 240, 138);
    ctx.font = '500 40px sans-serif'; ctx.fillStyle = '#b9e4f7'; ctx.fillText(slogan, 244, 200);
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
    ctx.fillStyle = '#7f97ab'; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(60,80,100,0.42)'; ctx.lineWidth = 2;
    for (let x = 0; x <= widthMeters; x += 1) { ctx.beginPath(); ctx.moveTo(x * px, 0); ctx.lineTo(x * px, h); ctx.stroke(); }
    ctx.fillStyle = '#3b4a58'; ctx.fillRect(0, h - 0.6 * px, w, 0.6 * px);
  });
}

/** Секционные ворота: ламели и синяя рама. */
/** Плитка торгового зала: светлая, с тонкими швами — магазин читается светлее склада. */
export function tileTexture(THREE, repeat) {
  return canvasTexture(THREE, 128, 128, (ctx, w, h) => {
    ctx.fillStyle = '#e9eef2'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(8, 8, w / 2, h / 3);
    ctx.strokeStyle = '#b9c5cf'; ctx.lineWidth = 3; ctx.strokeRect(0, 0, w, h);
  }, repeat);
}

/** Перфорированная спинка торговой гондолы: светлый лист с рядами отверстий. */
export function pegboardTexture(THREE, repeat) {
  return canvasTexture(THREE, 64, 64, (ctx, w, h) => {
    ctx.fillStyle = '#eef1f4'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#8f9ba6';
    for (let y = 8; y < h; y += 16) for (let x = 8; x < w; x += 16) { ctx.beginPath(); ctx.arc(x, y, 2.6, 0, Math.PI * 2); ctx.fill(); }
  }, repeat);
}

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

/** Сигнальный жилет: цвет по варианту, две светоотражающие полосы и молния. */
function vestTexture(THREE, color) {
  return canvasTexture(THREE, 128, 128, (ctx, w, h) => {
    ctx.fillStyle = color; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#e9edf0';
    for (const y of [58, 84]) { ctx.fillRect(0, y, w, 9); ctx.fillStyle = '#c7ced4'; ctx.fillRect(0, y + 3, w, 3); ctx.fillStyle = '#e9edf0'; }
    ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.fillRect(62, 0, 4, h);
  });
}

/** Лицо: глаза и брови на светлой коже — читается даже с размера ногтя. */
function faceTexture(THREE) {
  return canvasTexture(THREE, 128, 128, (ctx, w, h) => {
    ctx.fillStyle = '#d6a981'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#2a2320';
    for (const x of [50, 78]) { ctx.beginPath(); ctx.ellipse(x, 66, 4, 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(x - 7, 54, 14, 3); }
    ctx.strokeStyle = '#b8846a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(64, 80, 8, 0.3, Math.PI - 0.3); ctx.stroke();
  });
}

/**
 * Фигурка работника, 1,8 м, из капсул: круглые плечи и конечности, жилет с полосами,
 * каска с козырьком, перчатки, ботинки. Варианты: замерщик с планшетом-планом,
 * замерщик с лазерным дальномером (tool — точка, откуда идёт луч), монтажник с киянкой,
 * оператор рохли. Возвращает узлы для анимации: голова, руки, ноги, торс.
 */
export function createWorker(THREE, variant = WORKER.SURVEYOR_PLAN) {
  const group = new THREE.Group();
  const mat = (color, roughness = 0.75) => new THREE.MeshStandardMaterial({ color, roughness });
  const vestColor = ['#d7e356', '#248ac0', '#f0731a', '#f0731a'][variant];
  const vest = new THREE.MeshStandardMaterial({ map: vestTexture(THREE, vestColor), roughness: 0.8 });
  const navy = mat(0x183b67), skin = mat(0xd6a981), shirt = mat(variant === WORKER.OPERATOR ? 0x2b3f55 : 0xe8ebe6), dark = mat(0x202b35);
  const glove = mat(variant >= WORKER.INSTALLER ? 0xf5cf39 : 0x3a4653, 0.9);
  const helmetMat = mat(variant >= WORKER.INSTALLER ? 0xf5cf39 : 0xf4f4ed, 0.35);
  const add = (geometry, material, x, y, z, parent = group) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z); mesh.castShadow = true; parent.add(mesh); return mesh;
  };
  const capsule = (r, len, seg = 8) => new THREE.CapsuleGeometry(r, len, 4, seg);

  const legs = [];
  for (const x of [-0.11, 0.11]) {
    const leg = new THREE.Group(); leg.position.set(x, 0.86, 0);
    add(capsule(0.085, 0.5), navy, 0, -0.32, 0, leg);
    const boot = add(new THREE.BoxGeometry(0.17, 0.13, 0.3), dark, 0, -0.78, 0.05, leg);
    add(new THREE.BoxGeometry(0.18, 0.05, 0.32), mat(0x101820), 0, -0.82, 0.05, leg);
    boot.castShadow = true;
    group.add(leg); legs.push(leg);
  }
  const torso = new THREE.Group(); torso.position.set(0, 0.9, 0); group.add(torso);
  add(new THREE.CylinderGeometry(0.2, 0.17, 0.2, 14), navy, 0, 0.02, 0, torso);
  const body = add(capsule(0.215, 0.32, 14), vest, 0, 0.3, 0, torso);
  body.scale.z = 0.72;
  add(new THREE.CylinderGeometry(0.065, 0.075, 0.12, 10), skin, 0, 0.62, 0, torso);
  const head = new THREE.Group(); head.position.set(0, 0.7, 0); torso.add(head);
  const face = add(new THREE.SphereGeometry(0.14, 20, 14), new THREE.MeshStandardMaterial({ map: faceTexture(THREE), roughness: 0.7 }), 0, 0.12, 0, head);
  face.rotation.y = -Math.PI / 2;
  add(new THREE.SphereGeometry(0.165, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), helmetMat, 0, 0.13, 0, head);
  add(new THREE.CylinderGeometry(0.185, 0.19, 0.03, 20), helmetMat, 0, 0.13, 0.02, head);
  add(new THREE.BoxGeometry(0.03, 0.02, 0.2), helmetMat, 0, 0.29, 0, head);
  const brim = add(new THREE.CylinderGeometry(0.2, 0.2, 0.02, 20, 1, false, -0.7, 1.4), helmetMat, 0, 0.13, 0.05, head);
  brim.rotation.y = Math.PI;
  const arms = [], hands = [];
  for (const side of [-1, 1]) {
    const arm = new THREE.Group(); arm.position.set(side * 0.26, 0.52, 0); torso.add(arm);
    add(new THREE.SphereGeometry(0.085, 12, 10), vest, 0, 0.02, 0, arm);
    add(capsule(0.062, 0.2), shirt, 0, -0.15, 0, arm);
    const elbow = new THREE.Group(); elbow.position.set(0, -0.28, 0); elbow.rotation.x = -0.95; arm.add(elbow);
    add(capsule(0.052, 0.2), skin, 0, -0.13, 0, elbow);
    hands.push(add(new THREE.SphereGeometry(0.068, 12, 10), glove, 0, -0.27, 0, elbow));
    arm.rotation.x = variant === WORKER.OPERATOR ? -1.15 : -0.35;
    arm.userData.elbow = elbow;
    arms.push(arm);
  }
  const plan = new THREE.Group();
  add(new THREE.BoxGeometry(0.6, 0.025, 0.43), mat(0xf4f4ed), 0, 0, 0, plan);
  const ink = mat(0x4787b7);
  for (let i = 0; i < 4; i++) add(new THREE.BoxGeometry(0.4, 0.004, 0.013), ink, 0, 0.018, -0.12 + i * 0.07, plan);
  add(new THREE.BoxGeometry(0.004, 0.004, 0.3), ink, -0.15, 0.018, 0, plan);
  plan.position.set(0, 0.99, 0.4); plan.rotation.x = 0.13; group.add(plan);
  plan.visible = variant === WORKER.SURVEYOR_PLAN;
  let tool = null;
  if (variant === WORKER.SURVEYOR_LASER) {
    const elbow = arms[1].userData.elbow;
    tool = add(new THREE.BoxGeometry(0.07, 0.05, 0.14), dark, 0, -0.3, 0.06, elbow);
    add(new THREE.BoxGeometry(0.05, 0.02, 0.03), mat(0xff3b30, 0.4), 0, -0.29, 0.14, elbow);
    arms[1].rotation.x = -1.35;
  }
  if (variant === WORKER.INSTALLER) {
    const mallet = new THREE.Group();
    add(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8), mat(0xa98860), 0, 0, 0, mallet);
    add(new THREE.CylinderGeometry(0.07, 0.07, 0.16, 12), dark, 0, 0.25, 0, mallet).rotation.z = Math.PI / 2;
    mallet.position.set(0, -0.3, 0.1); mallet.rotation.x = 0.4; arms[1].userData.elbow.add(mallet);
  }
  return { group, arms, hands, legs, torso, head, plan, tool };
}
