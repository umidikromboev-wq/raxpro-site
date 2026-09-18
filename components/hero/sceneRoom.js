// Помещение: пол с разметкой, две стены, ворота, окна, колонна.
// Стены стоят по дальним сторонам (−x и −z), камера смотрит из +x +z — ничего не перекрывают.

import { ROOM, COLUMN } from './rackModel.js';
import { floorMarkingTexture, wallTexture, gateTexture, bannerTexture } from './sceneAssets.js';

const WALL = 0.25;
/** Жёлтые линии прохода: вдоль фронта длинного ряда и вдоль короткого плеча. */
const AISLE_LINES = [[-6.4, -1.9, 2.9, -1.9], [2.4, -2.2, 2.4, 4.9]];
const WINDOW_Y = 5.7;

export function buildRoom(THREE, scene, part, slogan = 'Стеллажи под ваш бизнес') {
  part([ROOM.width, 0.22, ROOM.depth], 'floor', [0, -0.13, 0]);
  // Земля вокруг цеха в цвет фона страницы: на телефоне камера перспективная и край плиты попадает в кадр.
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshStandardMaterial({ color: 0x0b4f80, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2; ground.position.y = -0.26; ground.receiveShadow = true; scene.add(ground);
  const marks = new THREE.Mesh(
    new THREE.PlaneGeometry(ROOM.width, ROOM.depth),
    new THREE.MeshStandardMaterial({ map: floorMarkingTexture(THREE, ROOM, AISLE_LINES), transparent: true, roughness: 0.95, polygonOffset: true, polygonOffsetFactor: -1 }),
  );
  marks.rotation.x = -Math.PI / 2; marks.position.y = 0.002; marks.receiveShadow = true; scene.add(marks);

  const wall = (width, height) => new THREE.MeshStandardMaterial({ map: wallTexture(THREE, width, height), roughness: 0.9 });
  const back = new THREE.Mesh(new THREE.BoxGeometry(ROOM.width + WALL, ROOM.height, WALL), wall(ROOM.width, ROOM.height));
  back.position.set(-WALL / 2, ROOM.height / 2 - 0.02, -ROOM.depth / 2 - WALL / 2);
  const left = new THREE.Mesh(new THREE.BoxGeometry(WALL, ROOM.height, ROOM.depth), wall(ROOM.depth, ROOM.height));
  left.position.set(-ROOM.width / 2 - WALL / 2, ROOM.height / 2 - 0.02, 0);
  for (const mesh of [back, left]) { mesh.receiveShadow = true; scene.add(mesh); }

  const gate = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 4.6), new THREE.MeshStandardMaterial({ map: gateTexture(THREE), roughness: 0.6, metalness: 0.2 }));
  gate.position.set(4.6, 2.3, -ROOM.depth / 2 + 0.012); scene.add(gate);

  const glass = new THREE.MeshStandardMaterial({ color: 0xcfe9ff, emissive: 0x9fd0ff, emissiveIntensity: 0.55, roughness: 0.2, metalness: 0.1 });
  for (const z of [-4.6, -2.4, -0.2, 2.0, 4.2]) {
    const pane = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.9), glass);
    pane.position.set(-ROOM.width / 2 + 0.012, WINDOW_Y, z); pane.rotation.y = Math.PI / 2; scene.add(pane);
  }
  for (const x of [-6.6, -4.4, -2.2, 0, 2.2]) {
    const pane = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.9), glass);
    pane.position.set(x, WINDOW_Y, -ROOM.depth / 2 + 0.012); scene.add(pane);
  }

  const banner = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 1.6), new THREE.MeshStandardMaterial({ map: bannerTexture(THREE, slogan), roughness: 0.8 }));
  banner.position.set(-3.4, 4.6, -ROOM.depth / 2 + 0.03); scene.add(banner);

  // Дверь для персонала в левой стене и огнетушитель у ворот — мелочи, по которым цех читается как рабочий.
  const door = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 2.1), new THREE.MeshStandardMaterial({ color: 0x1b3b8f, roughness: 0.6 }));
  door.position.set(-ROOM.width / 2 + 0.012, 1.05, 3.6); door.rotation.y = Math.PI / 2; scene.add(door);
  const handle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, 0.14), new THREE.MeshStandardMaterial({ color: 0xd6dde3, roughness: 0.3, metalness: 0.7 }));
  handle.position.set(-ROOM.width / 2 + 0.05, 1.0, 3.25); scene.add(handle);
  part([0.18, 0.55, 0.18], 'extinguisher', [1.6, 0.95, -ROOM.depth / 2 + 0.16]);
  part([0.5, 0.75, 0.06], 'extinguisherSign', [1.6, 1.75, -ROOM.depth / 2 + 0.04]);

  part([COLUMN.width, ROOM.height, COLUMN.width], 'column', [COLUMN.x, ROOM.height / 2, COLUMN.z]);
  part([0.76, 0.85, 0.76], 'dark', [COLUMN.x, 0.43, COLUMN.z]);
  for (let i = 0; i < 3; i++) part([0.12, 0.75, 0.025], 'yellow', [COLUMN.x - 0.23 + i * 0.23, 0.44, COLUMN.z + 0.395], null, [0, 0, -0.22]);
}
