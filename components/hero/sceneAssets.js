// Small reusable procedural assets; no external models or texture downloads.
export function cartonTexture(THREE) {
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#cfad80'; ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = '#b79266'; ctx.fillRect(121, 0, 14, 256);
  ctx.strokeStyle = '#937450'; ctx.lineWidth = 2; ctx.strokeRect(2, 2, 252, 252);
  ctx.fillStyle = '#eee8dc'; ctx.fillRect(23, 148, 71, 57);
  ctx.fillStyle = '#423d36';
  for (let i = 0; i < 25; i++) ctx.fillRect(29 + i * 2.3, 156, i % 3 === 0 ? 2 : 1, 27);
  ctx.font = '8px sans-serif'; ctx.fillText('RAXPRO / STORAGE', 29, 196);
  ctx.font = '22px sans-serif'; ctx.fillText('↑ ↑', 177, 208);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function textSprite(THREE, text) {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 96;
  const ctx = canvas.getContext('2d');
  ctx.font = '500 36px sans-serif'; ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff'; ctx.fillText(text, 256, 60);
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map, transparent: true, depthTest: false }));
  sprite.scale.set(3.8, 0.71, 1);
  return sprite;
}

export function createWorker(THREE, variant = 0) {
  const group = new THREE.Group();
  const mat = (color) => new THREE.MeshStandardMaterial({ color, roughness: 0.8 });
  const navy = mat(0x183b67), vest = mat(variant ? 0x248ac0 : 0xd7e356);
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
  add(new THREE.SphereGeometry(0.18, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), white, 0, 1.46, 0);
  add(new THREE.CylinderGeometry(0.205, 0.205, 0.035, 20), white, 0, 1.46, 0.015);
  for (const x of [-0.115, 0.115]) {
    add(new THREE.BoxGeometry(0.15, 0.64, 0.18), navy, x, 0.46, 0);
    add(new THREE.BoxGeometry(0.18, 0.12, 0.3), dark, x, 0.09, 0.055);
  }
  const arms = [];
  for (const side of [-1, 1]) {
    const arm = new THREE.Group(); arm.position.set(side * 0.27, 1.22, 0);
    add(new THREE.CylinderGeometry(0.075, 0.065, 0.3, 10), navy, 0, -0.13, 0, arm);
    const forearm = add(new THREE.CylinderGeometry(0.06, 0.05, 0.29, 10), skin, 0, -0.27, 0.1, arm);
    forearm.rotation.x = -0.95;
    add(new THREE.SphereGeometry(0.065, 10, 8), skin, 0, -0.35, 0.22, arm);
    arm.rotation.x = -0.35; group.add(arm); arms.push(arm);
  }
  const plan = new THREE.Group();
  add(new THREE.BoxGeometry(0.6, 0.025, 0.43), white, 0, 0, 0, plan);
  const ink = mat(0x4787b7);
  for (let i = 0; i < 4; i++) add(new THREE.BoxGeometry(0.4, 0.004, 0.013), ink, 0, 0.018, -0.12 + i * 0.07, plan);
  plan.position.set(0, 0.99, 0.4); plan.rotation.x = 0.13; group.add(plan);
  plan.visible = variant === 0;
  return { group, arms, plan };
}
