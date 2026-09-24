// Вторая комната героя — магазин за перегородкой склада (эксперимент Умида 24.09):
// торговые стеллажи как на фото каталога RaxPro — светлые гондолы с перфорированной
// спинкой, цоколем и ценниками. Гондолы падают вместе с рамами склада, полки —
// с балками, товар — вместе с загрузкой паллет. Всё через тот же part(),
// поэтому одинаковые детали складываются в InstancedMesh.

import { ROOM } from './rackModel.js';
import { wallTexture, bannerTexture, tileTexture } from './sceneAssets.js';

const WALL = 0.25;
export const SHOP = { x0: ROOM.width / 2 + WALL, width: 8.5, depth: ROOM.depth };
const SHOP_CX = SHOP.x0 + SHOP.width / 2;
const PARTITION_H = 2.6;
const DOOR = [0.4, 2.8];
const GONDOLA_H = 2.0;
const SHELF_DEPTH = 0.42;
const SHELF_Y = [0.12, 0.55, 0.98, 1.41];
// Центр обеих комнат по x — на него смотрит камера.
export const SCENE_CENTER_X = (-ROOM.width / 2 + SHOP.x0 + SHOP.width) / 2;

// Витрины: вдоль задней стены односторонняя, в зале два двусторонних острова.
const GONDOLAS = [
  { x: SHOP.x0 + 2.75, z: -SHOP.depth / 2 + 0.5, length: 4.7, sides: [1] },
  { x: SHOP_CX - 0.3, z: -2.3, length: 5.0, sides: [-1, 1] },
  { x: SHOP_CX - 0.3, z: 1.2, length: 5.0, sides: [-1, 1] },
];

// Товар — фиксированный набор форм, иначе каждая коробка стала бы отдельной партией.
const GOODS = [
  { size: [0.2, 0.3, 0.07], name: 'goodsBlue' }, { size: [0.2, 0.3, 0.07], name: 'goodsYellow' },
  { size: [0.16, 0.22, 0.16], name: 'goodsRed' }, { size: [0.045, 0.27], name: 'goodsOil', shape: 'cyl' },
  { size: [0.05, 0.12], name: 'goodsGreen', shape: 'cyl' }, { size: [0.18, 0.2, 0.12], name: 'goodsWhite' },
  { size: [0.05, 0.12], name: 'goodsRed', shape: 'cyl' }, { size: [0.22, 0.26, 0.09], name: 'goodsOrange' },
];

// Детерминированный «случай»: одинаковая раскладка на сервере скриншотов и у посетителя.
function rand(seed) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function buildShopShell(THREE, scene, part, slogan) {
  const floor = new THREE.MeshStandardMaterial({ map: tileTexture(THREE, [SHOP.width / 1.2, SHOP.depth / 1.2]), roughness: 0.55, metalness: 0.02 });
  const slab = new THREE.Mesh(new THREE.BoxGeometry(SHOP.width, 0.22, SHOP.depth), floor);
  slab.position.set(SHOP_CX, -0.13, 0); slab.receiveShadow = true; scene.add(slab);

  const wall = (w, h) => new THREE.MeshStandardMaterial({ map: wallTexture(THREE, w, h), roughness: 0.9 });
  const back = new THREE.Mesh(new THREE.BoxGeometry(SHOP.width + WALL, ROOM.height, WALL), wall(SHOP.width, ROOM.height));
  back.position.set(SHOP_CX + WALL / 2 - WALL / 2, ROOM.height / 2 - 0.02, -SHOP.depth / 2 - WALL / 2);
  back.receiveShadow = true; scene.add(back);

  // Низкая перегородка с проёмом: видно обе комнаты, и понятно, что это одно помещение.
  const px = ROOM.width / 2 + WALL / 2;
  const pieces = [[-SHOP.depth / 2, DOOR[0]], [DOOR[1], SHOP.depth / 2]];
  for (const [z0, z1] of pieces) {
    const len = z1 - z0;
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(WALL, PARTITION_H, len), wall(len, PARTITION_H));
    mesh.position.set(px, PARTITION_H / 2 - 0.02, (z0 + z1) / 2);
    mesh.castShadow = mesh.receiveShadow = true; scene.add(mesh);
  }

  const banner = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 1.3), new THREE.MeshStandardMaterial({ map: bannerTexture(THREE, slogan), roughness: 0.8 }));
  banner.position.set(SHOP_CX, 3.7, -SHOP.depth / 2 + 0.03); scene.add(banner);

}

function gondola(part, g, gi) {
  const frameOwner = { stage: 'frames', index: gi, count: GONDOLAS.length, window: 0.6 };
  const width = g.sides.length === 2 ? SHELF_DEPTH * 2 + 0.1 : SHELF_DEPTH + 0.08;
  const spineZ = g.sides.length === 2 ? g.z : g.z - SHELF_DEPTH / 2;
  const x0 = g.x - g.length / 2;
  part([g.length, 0.12, width], 'gondolaBase', [g.x, 0.06, g.z], frameOwner);
  part([g.length, GONDOLA_H - 0.12, 0.03], 'pegboard', [g.x, 0.12 + (GONDOLA_H - 0.12) / 2, spineZ], frameOwner);
  const bays = Math.round(g.length / 1.0);
  for (let i = 0; i <= bays; i++) part([0.05, GONDOLA_H, 0.06], 'gondola', [x0 + i * g.length / bays, GONDOLA_H / 2, spineZ], frameOwner);
  part([g.length, 0.06, 0.06], 'gondola', [g.x, GONDOLA_H, spineZ], frameOwner);

  const shelves = [];
  for (const side of g.sides) {
    for (const [li, y] of SHELF_Y.entries()) {
      const z = spineZ + side * (SHELF_DEPTH / 2 + 0.03);
      shelves.push({ y, z, side, li });
    }
  }
  shelves.forEach((s, si) => {
    const owner = { stage: 'beams', index: gi * 8 + si, count: GONDOLAS.length * 8, window: 0.35 };
    const shelfY = s.y + (s.li === 0 ? 0.02 : 0);
    part([g.length - 0.04, 0.03, SHELF_DEPTH], 'gondola', [g.x, shelfY, s.z], owner);
    // Ценникодержатель по переднему краю полки.
    part([g.length - 0.04, 0.045, 0.012], 'priceStrip', [g.x, shelfY - 0.005, s.z + s.side * SHELF_DEPTH / 2], owner);
  });
  return shelves.map((s) => ({ ...s, x0: x0 + 0.08, length: g.length - 0.16, gi }));
}

export function addShopRacks(part) {
  const shelves = GONDOLAS.flatMap((g, gi) => gondola(part, g, gi));
  const items = [];
  shelves.forEach((s, si) => {
    // На полке — блоки одного товара, как выкладывают в магазине: 4–7 фейсингов подряд.
    let x = s.x0, seed = si * 31 + 7;
    while (x < s.x0 + s.length - 0.25) {
      const kind = GOODS[Math.floor(rand(seed++) * GOODS.length)];
      const facings = 4 + Math.floor(rand(seed++) * 4);
      const w = kind.shape === 'cyl' ? kind.size[0] * 2 + 0.015 : kind.size[0] + 0.012;
      const h = kind.shape === 'cyl' ? kind.size[1] : kind.size[1];
      const d = kind.shape === 'cyl' ? kind.size[0] * 2 : kind.size[2];
      const rows = Math.max(1, Math.floor((SHELF_DEPTH - 0.04) / (d + 0.02)) - 1);
      for (let f = 0; f < facings && x + w < s.x0 + s.length; f++, x += w) {
        for (let r = 0; r < Math.min(rows, 2); r++) {
          const z = s.z + s.side * (SHELF_DEPTH / 2 - 0.04 - d / 2 - r * (d + 0.02));
          items.push({ kind, pos: [x + w / 2, s.y + 0.035 + h / 2, z] });
        }
      }
      x += 0.05;
    }
  });
  items.forEach((it, i) => {
    const owner = { stage: 'load', index: i, count: items.length, window: 0.25 };
    part(it.kind.size, it.kind.name, it.pos, owner, [0, 0, 0], it.kind.shape);
  });

  // Касса у выхода в торговый зал: стойка, лента, монитор.
  const cashOwner = { stage: 'frames', index: GONDOLAS.length - 1, count: GONDOLAS.length, window: 0.6 };
  const cx = SHOP.x0 + 2.0, cz = 4.4;
  part([2.4, 0.9, 0.75], 'counter', [cx, 0.45, cz], cashOwner);
  part([1.6, 0.04, 0.5], 'dark', [cx - 0.3, 0.92, cz], cashOwner);
  part([0.36, 0.26, 0.04], 'dark', [cx + 0.75, 1.2, cz - 0.1], cashOwner, [0, -0.5, 0]);
  part([0.06, 0.28, 0.06], 'gondola', [cx + 0.75, 1.02, cz - 0.1], cashOwner);
  addShopExtras(part, cashOwner);
  return items.length;
}

// Детали, по которым зал читается как магазин: холодильник со стеклом и бутылками
// вдоль перегородки, промо-выкладка на паллете у входа, корзины у кассы.
function addShopExtras(part, owner) {
  // Холодильник у задней стены, стеклом к залу (+z): бутылки видно сквозь двери.
  const fx0 = SHOP.x0 + 5.45, fx1 = SHOP.x0 + SHOP.width - 0.35, fLen = fx1 - fx0, fxc = (fx0 + fx1) / 2;
  const fz = -SHOP.depth / 2 + 0.45;
  part([fLen, 2.15, 0.8], 'fridge', [fxc, 1.075, fz], owner);
  part([fLen, 0.3, 0.06], 'counter', [fxc, 2.0, fz + 0.38], owner);
  const loadOwner = (i, n) => ({ stage: 'load', index: i, count: n, window: 0.5 });
  const bottles = [];
  for (const y of [0.3, 0.72, 1.14, 1.56]) for (let x = fx0 + 0.15; x < fx1 - 0.1; x += 0.12) bottles.push([y, x]);
  bottles.forEach(([y, x], i) => part([0.04, 0.3], ['goodsBlue', 'goodsWhite', 'goodsGreen', 'goodsOrange'][Math.floor(i / 7) % 4], [x, y + 0.15, fz + 0.2], loadOwner(i, bottles.length), [0, 0, 0], 'cyl'));
  for (const y of [0.25, 0.67, 1.09, 1.51]) part([fLen - 0.1, 0.025, 0.6], 'gondola', [fxc, y, fz + 0.05], owner);
  // Стеклянные двери: полупрозрачные, с рамками через каждые ~0,7 м.
  part([fLen - 0.08, 1.75, 0.02], 'film', [fxc, 0.98, fz + 0.41], owner);
  for (let k = 0; k <= 4; k++) part([0.04, 1.8, 0.04], 'gondolaBase', [fx0 + k * fLen / 4, 0.98, fz + 0.42], owner);

  // Промо-выкладка: паллета с коробками акционного товара у входа из склада.
  const px = SHOP.x0 + 1.6, pz = 3.4;
  for (const u of [-0.38, 0, 0.38]) part([0.12, 0.1, 1.0], 'wood', [px + u, 0.05, pz], owner);
  part([1.0, 0.04, 1.0], 'wood', [px, 0.12, pz], owner);
  const promo = [];
  for (let l = 0; l < 3; l++) for (const u of [-0.24, 0.24]) for (const v of [-0.24, 0.24]) if (!(l === 2 && u > 0 && v > 0)) promo.push([u, 0.14 + 0.15 + l * 0.3, v]);
  promo.forEach(([u, y, v], i) => part([0.44, 0.28, 0.44], i % 3 ? 'goodsYellow' : 'goodsRed', [px + u, y, pz + v], loadOwner(i, promo.length)));
  part([0.9, 0.5, 0.03], 'priceStrip', [px, 1.35, pz + 0.52], owner);

  // Стопка корзин покупателей у кассы.
  for (let i = 0; i < 4; i++) part([0.42, 0.06, 0.32], 'goodsRed', [SHOP.x0 + 3.9, 0.05 + i * 0.07, 5.5], owner);
}
