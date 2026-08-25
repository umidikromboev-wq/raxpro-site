'use client';

import { useEffect, useRef, useState } from 'react';

// Интерактивная модель склада. Читает ту же раскладку, что план и спецификация:
// если в КП стоит 141 секция, в модели их ровно 141, а не «похоже на правду».
// Именно на этом обжигалась генерация картинок с нуля — модель рисовала
// шесть рядов вместо восьми рядом с точной сметой.
//
// three грузится динамически: 600 КБ не должны висеть на форме, пока
// менеджер не открыл модель.

const MM = 0.001;

export default function RackScene({ room, layout, height = 460 }) {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [shell, setShell] = useState(false);
  const [pallets, setPallets] = useState(true);

  useEffect(() => {
    if (!room || !layout) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      let THREE;
      try {
        THREE = await import('three');
      } catch {
        setError('Не удалось загрузить 3D-движок');
        return;
      }
      if (disposed) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const L = room.width * MM;      // длина помещения по X
      const W = room.depth * MM;      // глубина по Z
      const H = room.ceiling * MM;
      const bayW = room.beam * MM;
      const rackD = room.rackDepth * MM;
      const frameH = layout.frameHeight * MM;
      const levels = layout.levels;
      const pitch = frameH / levels;

      // Кадр подбирается под габариты помещения, а не задаётся числом:
      // склад 10×8 и склад 45×24 иначе выглядят одинаково мелко.
      const span = Math.max(L, W);
      const fitDist = (span / 2) / Math.tan((45 * Math.PI) / 360) * 0.95;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x121821);
      // Туман только прячет дальнюю стену, а не съедает саму расстановку.
      scene.fog = new THREE.Fog(0x121821, fitDist * 1.15, fitDist * 3.2);

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;

      const cam = new THREE.PerspectiveCamera(45, 1, 0.1, Math.max(L, W) * 8);
      const target = new THREE.Vector3(L / 2, frameH * 0.35, W / 2);

      // Свет: контраст важнее яркости — иначе синие стойки сливаются в кашу.
      scene.add(new THREE.HemisphereLight(0xb8ccdd, 0x2c3238, 0.85));
      scene.add(new THREE.AmbientLight(0xffffff, 0.22));
      const sun = new THREE.DirectionalLight(0xfff3e0, 1.6);
      sun.position.set(L * 0.75, H * 2.4, -W * 0.6);
      scene.add(sun);
      const fill = new THREE.DirectionalLight(0xcfe0f0, 0.55);
      fill.position.set(-L * 0.3, H * 1.3, W * 1.4);
      scene.add(fill);

      // пол
      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(L, W),
        new THREE.MeshStandardMaterial({ color: 0x5f666d, roughness: 0.9, metalness: 0.05 })
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.set(L / 2, 0, W / 2);
      scene.add(floor);

      // оболочка здания: нормали внутрь, снаружи стены отбраковываются сами,
      // поэтому обзор не перекрывается, а изнутри помещение выглядит закрытым
      const shellGroup = new THREE.Group();
      const wmat = new THREE.MeshStandardMaterial({ color: 0x8d949b, roughness: 0.97, side: THREE.FrontSide });
      const wall = (w, h, x, y, z, ry) => {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wmat);
        m.position.set(x, y, z);
        m.rotation.y = ry;
        shellGroup.add(m);
      };
      wall(L, H, L / 2, H / 2, 0, 0);
      wall(L, H, L / 2, H / 2, W, Math.PI);
      wall(W, H, 0, H / 2, W / 2, Math.PI / 2);
      wall(W, H, L, H / 2, W / 2, -Math.PI / 2);
      const trussMat = new THREE.MeshStandardMaterial({ color: 0x565d64, roughness: 0.62, metalness: 0.5 });
      for (let i = 0; i <= Math.floor(L / 4.5); i++) {
        const t = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.42, W), trussMat);
        t.position.set(i * 4.5, H - 0.32, W / 2);
        shellGroup.add(t);
      }
      shellGroup.visible = false;
      scene.add(shellGroup);

      // колонны здания
      if (room.columns?.length) {
        const cmat = new THREE.MeshStandardMaterial({ color: 0x9aa4ad, roughness: 0.9 });
        const cmesh = new THREE.InstancedMesh(
          new THREE.BoxGeometry(1, H, 1), cmat, room.columns.length
        );
        const d = new THREE.Object3D();
        room.columns.forEach((c, i) => {
          d.position.set(c.x * MM, H / 2, c.y * MM);
          d.scale.set(c.size * MM, 1, c.size * MM);
          d.updateMatrix();
          cmesh.setMatrixAt(i, d.matrix);
        });
        cmesh.instanceMatrix.needsUpdate = true;
        scene.add(cmesh);
      }

      // ——— стеллажи из реальных секций
      const bays = layout.bays.map((b) => ({ x: b.x * MM, z: b.y * MM }));
      const dummy = new THREE.Object3D();
      const instanced = (geo, mat, n) => {
        const m = new THREE.InstancedMesh(geo, mat, Math.max(n, 1));
        scene.add(m);
        return m;
      };
      const put = (mesh, i, x, y, z, sy) => {
        dummy.position.set(x, y, z);
        dummy.scale.set(1, sy ?? 1, 1);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      };

      // стойки: одна на стык соседних секций, а не по две
      const uprightKeys = new Set();
      for (const b of bays) {
        uprightKeys.add(`${b.x.toFixed(3)}|${b.z.toFixed(3)}`);
        uprightKeys.add(`${(b.x + bayW).toFixed(3)}|${b.z.toFixed(3)}`);
      }
      const ups = [...uprightKeys].map((s) => s.split('|').map(Number));

      const upMesh = instanced(
        new THREE.BoxGeometry(0.105, frameH, 0.105),
        new THREE.MeshStandardMaterial({ color: 0x1d5aa8, roughness: 0.42, metalness: 0.35 }),
        ups.length * 2
      );
      ups.forEach(([px, pz], i) => {
        put(upMesh, i * 2, px, frameH / 2, pz + 0.07);
        put(upMesh, i * 2 + 1, px, frameH / 2, pz + rackD - 0.07);
      });
      upMesh.instanceMatrix.needsUpdate = true;

      const braceMesh = instanced(
        new THREE.BoxGeometry(0.05, 0.05, Math.max(rackD - 0.14, 0.1)),
        new THREE.MeshStandardMaterial({ color: 0x14396b, roughness: 0.55, metalness: 0.3 }),
        ups.length * 5
      );
      let bi = 0;
      ups.forEach(([px, pz]) => {
        for (let k = 1; k <= 5; k++) put(braceMesh, bi++, px, (frameH * k) / 6, pz + rackD / 2);
      });
      braceMesh.instanceMatrix.needsUpdate = true;

      const beamMesh = instanced(
        new THREE.BoxGeometry(bayW, 0.12, 0.05),
        new THREE.MeshStandardMaterial({ color: 0xf07c12, roughness: 0.38, metalness: 0.3 }),
        bays.length * levels * 2
      );
      let mi = 0;
      for (const b of bays) {
        for (let l = 1; l <= levels; l++) {
          const y = l * pitch;
          put(beamMesh, mi++, b.x + bayW / 2, y, b.z + 0.09);
          put(beamMesh, mi++, b.x + bayW / 2, y, b.z + rackD - 0.09);
        }
      }
      beamMesh.instanceMatrix.needsUpdate = true;

      // ——— паллеты: столько мест, сколько в спецификации
      const perBay = Math.max(1, Math.round(layout.positions / (bays.length * (levels + 1))));
      const step = bayW / perBay;
      const slots = [];
      for (const b of bays) {
        for (let l = 0; l <= levels; l++) {
          const y = l === 0 ? 0 : l * pitch + 0.06;
          for (let k = 0; k < perBay; k++) {
            slots.push({ x: b.x + step * (k + 0.5), y, z: b.z + rackD / 2 });
          }
        }
      }
      // Детерминированное заполнение 55 %: полностью забитый склад прячет
      // саму конструкцию, а её клиент и покупает.
      const filled = slots.filter((_, i) => ((i * 2654435761) % 1000) / 1000 < 0.55);

      const palMesh = instanced(
        new THREE.BoxGeometry(step * 0.9, 0.14, rackD * 0.9),
        new THREE.MeshStandardMaterial({ color: 0x7a5630, roughness: 0.93 }),
        filled.length
      );
      const boxMesh = instanced(
        new THREE.BoxGeometry(step * 0.86, 1.0, rackD * 0.84),
        new THREE.MeshStandardMaterial({ color: 0xc09a68, roughness: 0.9 }),
        filled.length
      );
      const tints = [new THREE.Color(0xc49f6d), new THREE.Color(0xad8654), new THREE.Color(0xd4b184)];
      filled.forEach((s, i) => {
        put(palMesh, i, s.x, s.y + 0.07, s.z);
        put(boxMesh, i, s.x, s.y + 0.14 + 0.5, s.z, 0.85 + (i % 7) / 20);
        boxMesh.setColorAt(i, tints[i % 3]);
      });
      palMesh.instanceMatrix.needsUpdate = true;
      boxMesh.instanceMatrix.needsUpdate = true;
      if (boxMesh.instanceColor) boxMesh.instanceColor.needsUpdate = true;

      // ——— орбита
      let az = -0.72;
      let el = 0.34;
      let dist = fitDist;
      const applyCam = () => {
        el = Math.max(0.04, Math.min(1.45, el));
        dist = Math.max(3, Math.min(fitDist * 2.6, dist));
        cam.position.set(
          target.x + dist * Math.cos(el) * Math.cos(az),
          target.y + dist * Math.sin(el),
          target.z + dist * Math.cos(el) * Math.sin(az)
        );
        cam.lookAt(target);
      };

      const resize = () => {
        const w = canvas.clientWidth || 640;
        const h = canvas.clientHeight || height;
        renderer.setSize(w, h, false);
        cam.aspect = w / h;
        cam.updateProjectionMatrix();
      };

      let drag = null;
      const onDown = (e) => { drag = { x: e.clientX, y: e.clientY }; canvas.setPointerCapture?.(e.pointerId); };
      const onMove = (e) => {
        if (!drag) return;
        az -= (e.clientX - drag.x) * 0.006;
        el += (e.clientY - drag.y) * 0.005;
        drag = { x: e.clientX, y: e.clientY };
        applyCam();
      };
      const onUp = () => { drag = null; };
      const onWheel = (e) => { e.preventDefault(); dist *= 1 + Math.sign(e.deltaY) * 0.08; applyCam(); };

      canvas.addEventListener('pointerdown', onDown);
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      canvas.addEventListener('wheel', onWheel, { passive: false });
      window.addEventListener('resize', resize);

      resize();
      applyCam();

      let raf = 0;
      const loop = () => { renderer.render(scene, cam); raf = requestAnimationFrame(loop); };
      loop();
      setReady(true);

      stateRef.current = { shellGroup, palletGroup: [palMesh, boxMesh] };

      cleanup = () => {
        cancelAnimationFrame(raf);
        canvas.removeEventListener('pointerdown', onDown);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        canvas.removeEventListener('wheel', onWheel);
        window.removeEventListener('resize', resize);
        scene.traverse((o) => {
          o.geometry?.dispose?.();
          if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose?.());
          else o.material?.dispose?.();
        });
        renderer.dispose();
      };
    })();

    return () => { disposed = true; cleanup(); };
  }, [room, layout, height]);

  useEffect(() => {
    const s = stateRef.current;
    if (s?.shellGroup) s.shellGroup.visible = shell;
  }, [shell, ready]);

  useEffect(() => {
    const s = stateRef.current;
    s?.palletGroup?.forEach((m) => { m.visible = pallets; });
  }, [pallets, ready]);

  if (!room || !layout) return null;

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height, display: 'block', background: '#0d1116', cursor: 'grab' }}
        aria-label="Интерактивная модель склада"
      />
      {error && (
        <p className="absolute inset-0 grid place-items-center text-sm text-white/70">{error}</p>
      )}
      <div className="absolute left-3 top-3 flex gap-2 text-[11px]">
        <Toggle on={shell} onClick={() => setShell((v) => !v)}>Здание</Toggle>
        <Toggle on={pallets} onClick={() => setPallets((v) => !v)}>Груз</Toggle>
      </div>
      <p className="absolute bottom-3 right-3 text-[10px] text-white/45">
        тянуть — поворот · колесо — приближение
      </p>
    </div>
  );
}

function Toggle({ on, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`border px-2 py-1 backdrop-blur transition ${
        on ? 'border-white/60 bg-white/15 text-white' : 'border-white/20 bg-black/30 text-white/60'
      }`}
    >
      {children}
    </button>
  );
}
