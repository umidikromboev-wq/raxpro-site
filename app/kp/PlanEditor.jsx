'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

// Обводка склада по фотографии драфта.
//
// Замерщик рисует набросок на бумаге, фотографирует и подкладывает сюда.
// Дальше обводит контур по фото, ставит колонны и ворота — и раскладка
// считается уже по настоящей форме помещения, а не по прямоугольнику.
//
// Почему обводка, а не автоматическое распознавание: карандашный набросок
// без масштаба читается машиной с ошибками, а рядом в том же документе стоит
// точная смета. Ошибка в контуре — ошибка в числе секций и в сумме.
// Обводка занимает минуту и даёт точность.

const TOOLS = [
  { id: 'outline', label: 'Контур', hint: 'Кликайте по углам помещения. Замкнуть — клик по первой точке.' },
  { id: 'column', label: 'Колонна', hint: 'Клик — колонна здания. Раскладка обойдёт её с зазором.' },
  { id: 'dock', label: 'Ворота', hint: 'Протяните прямоугольник по воротам. Перед ними останется свободная зона.' },
  { id: 'erase', label: 'Убрать', hint: 'Клик по колонне или воротам — удалить. Контур сбрасывается кнопкой.' },
];

const SNAP_MM = 100;

export default function PlanEditor({ value, onChange, height = 460 }) {
  const wrapRef = useRef(null);
  const [box, setBox] = useState({ w: 900, h: height });
  const [photo, setPhoto] = useState(value?.photo || null);
  const [opacity, setOpacity] = useState(0.55);
  const [tool, setTool] = useState('outline');

  // Масштаб: сколько миллиметров в одном пикселе картинки.
  // Без него фото — просто картинка: у наброска нет размеров.
  const [mmPerPx, setMmPerPx] = useState(value?.mmPerPx || 0);
  const [calib, setCalib] = useState([]);       // две точки эталонного отрезка
  const [calibMeters, setCalibMeters] = useState('');

  const [outline, setOutline] = useState(value?.outlinePx || []);
  const [closed, setClosed] = useState(Boolean(value?.closed));
  const [columns, setColumns] = useState(value?.columnsPx || []);
  const [docks, setDocks] = useState(value?.docksPx || []);
  const [dragDock, setDragDock] = useState(null);

  useEffect(() => {
    const ro = new ResizeObserver(([e]) => {
      setBox({ w: e.contentRect.width, h: height });
    });
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [height]);

  const snap = (v) => (mmPerPx ? Math.round((v * mmPerPx) / SNAP_MM) * (SNAP_MM / mmPerPx) : v);

  const toLocal = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  function handleClick(e) {
    const p = toLocal(e);

    if (calib.length < 2 && !mmPerPx) {
      setCalib((c) => (c.length >= 2 ? [p] : [...c, p]));
      return;
    }
    if (tool === 'outline') {
      if (closed) return;
      if (outline.length >= 3) {
        const [f] = outline;
        if (Math.hypot(f.x - p.x, f.y - p.y) < 14) { setClosed(true); return; }
      }
      setOutline((o) => [...o, { x: snap(p.x), y: snap(p.y) }]);
      return;
    }
    if (tool === 'column') { setColumns((c) => [...c, p]); return; }
    if (tool === 'erase') {
      const ci = columns.findIndex((c) => Math.hypot(c.x - p.x, c.y - p.y) < 12);
      if (ci >= 0) { setColumns((c) => c.filter((_, i) => i !== ci)); return; }
      const di = docks.findIndex((d) => p.x >= d.x && p.x <= d.x + d.w && p.y >= d.y && p.y <= d.y + d.h);
      if (di >= 0) setDocks((d) => d.filter((_, i) => i !== di));
    }
  }

  function applyCalibration() {
    const m = parseFloat(String(calibMeters).replace(',', '.'));
    if (!(m > 0) || calib.length < 2) return;
    const px = Math.hypot(calib[0].x - calib[1].x, calib[0].y - calib[1].y);
    if (px < 4) return;
    setMmPerPx((m * 1000) / px);
    setCalib([]);
  }

  // Контур и препятствия в миллиметрах, с началом координат в левом верхнем углу.
  const geometry = useMemo(() => {
    if (!mmPerPx || outline.length < 3 || !closed) return null;
    const minX = Math.min(...outline.map((p) => p.x));
    const minY = Math.min(...outline.map((p) => p.y));
    const mm = (v) => Math.round(v * mmPerPx);
    const polygon = outline.map((p) => [mm(p.x - minX), mm(p.y - minY)]);
    const xs = polygon.map((p) => p[0]);
    const ys = polygon.map((p) => p[1]);
    return {
      polygon,
      width: Math.max(...xs),
      depth: Math.max(...ys),
      columns: columns.map((c) => ({ x: mm(c.x - minX), y: mm(c.y - minY), size: 400 })),
      docks: docks.map((d) => ({ x: mm(d.x - minX), y: mm(d.y - minY), w: mm(d.w), h: mm(d.h) })),
    };
  }, [outline, closed, columns, docks, mmPerPx]);

  useEffect(() => {
    onChange?.({
      geometry,
      photo, mmPerPx, closed,
      outlinePx: outline, columnsPx: columns, docksPx: docks,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geometry, photo, mmPerPx, closed]);

  function readPhoto(file) {
    if (!file) return;
    const fr = new FileReader();
    fr.onload = () => {
      setPhoto(fr.result);
      setMmPerPx(0); setCalib([]); setOutline([]); setClosed(false);
      setColumns([]); setDocks([]);
    };
    fr.readAsDataURL(file);
  }

  const needScale = !mmPerPx;
  const activeHint = needScale
    ? 'Сначала задайте масштаб: кликните две точки на фото, между которыми знаете расстояние, и впишите его в метрах.'
    : TOOLS.find((t) => t.id === tool)?.hint;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <label className="cursor-pointer border border-cloud-300 bg-white px-2 py-1 text-[11px] hover:border-ink">
          {photo ? 'Заменить фото драфта' : 'Фото драфта'}
          <input type="file" accept="image/png,image/jpeg" className="hidden"
            onChange={(e) => readPhoto(e.target.files?.[0])} />
        </label>

        {photo && !needScale && TOOLS.map((t) => (
          <button key={t.id} onClick={() => setTool(t.id)}
            className={`border px-2 py-1 text-[11px] ${
              tool === t.id ? 'border-ink bg-ink text-white' : 'border-cloud-300 bg-white hover:border-ink'
            }`}>
            {t.label}
          </button>
        ))}

        {photo && closed && (
          <button onClick={() => { setOutline([]); setClosed(false); }}
            className="border border-cloud-300 bg-white px-2 py-1 text-[11px] hover:border-ink">
            Обвести заново
          </button>
        )}

        {photo && (
          <label className="ml-auto flex items-center gap-2 text-[11px] text-slate-500">
            Фото
            <input type="range" min="0" max="1" step="0.05" value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))} className="w-20" />
          </label>
        )}
      </div>

      {photo && needScale && (
        <div className="flex flex-wrap items-end gap-2 border border-sky-600 bg-cloud-50 p-2">
          <p className="w-full text-[11px] text-ink">
            Отметьте на фото отрезок с известной длиной — стену, пролёт между колоннами
            или размерную линию с наброска. Кликов: {calib.length} из 2.
          </p>
          <label className="text-[10px] uppercase tracking-wide text-slate-500">
            Длина отрезка, м
            <input value={calibMeters} onChange={(e) => setCalibMeters(e.target.value)}
              placeholder="28" className="inp mt-1 w-24" />
          </label>
          <button onClick={applyCalibration} disabled={calib.length < 2 || !calibMeters}
            className="bg-sky-700 px-3 py-1.5 text-[11px] text-white disabled:opacity-40">
            Задать масштаб
          </button>
          {calib.length > 0 && (
            <button onClick={() => setCalib([])}
              className="border border-cloud-300 bg-white px-2 py-1.5 text-[11px]">
              Сбросить точки
            </button>
          )}
        </div>
      )}

      <div ref={wrapRef} className="relative border border-cloud-300 bg-white" style={{ height }}>
        {!photo ? (
          <p className="grid h-full place-items-center px-6 text-center text-[12px] leading-relaxed text-slate-500">
            Сфотографируйте набросок замерщика и загрузите его сюда.<br />
            Дальше обведите контур помещения по фото — раскладка посчитается по нему,
            а не по прямоугольнику.
          </p>
        ) : (
          <svg
            width="100%" height={height}
            onClick={handleClick}
            onPointerDown={(e) => { if (tool === 'dock' && !needScale) setDragDock({ ...toLocal(e), w: 0, h: 0 }); }}
            onPointerMove={(e) => {
              if (!dragDock) return;
              const p = toLocal(e);
              setDragDock((d) => ({ ...d, w: p.x - d.x, h: p.y - d.y }));
            }}
            onPointerUp={() => {
              if (!dragDock) return;
              const d = dragDock;
              const r = { x: Math.min(d.x, d.x + d.w), y: Math.min(d.y, d.y + d.h), w: Math.abs(d.w), h: Math.abs(d.h) };
              if (r.w > 6 && r.h > 6) setDocks((v) => [...v, r]);
              setDragDock(null);
            }}
            style={{ cursor: needScale ? 'crosshair' : tool === 'erase' ? 'not-allowed' : 'crosshair', display: 'block' }}
          >
            <image href={photo} x="0" y="0" width={box.w} height={height}
              opacity={opacity} preserveAspectRatio="xMidYMid meet" />

            {/* эталонный отрезок */}
            {calib.length > 0 && (
              <g stroke="#0166B3" strokeWidth="2" fill="#0166B3">
                {calib.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4" />)}
                {calib.length === 2 && <line x1={calib[0].x} y1={calib[0].y} x2={calib[1].x} y2={calib[1].y} />}
              </g>
            )}

            {/* контур */}
            {outline.length > 0 && (
              <>
                <polyline
                  points={outline.map((p) => `${p.x},${p.y}`).join(' ') + (closed ? ` ${outline[0].x},${outline[0].y}` : '')}
                  fill={closed ? 'rgba(1,102,179,.08)' : 'none'} stroke="#0166B3" strokeWidth="2"
                />
                {outline.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r={i === 0 && !closed ? 6 : 4}
                    fill={i === 0 && !closed ? '#fff' : '#0166B3'} stroke="#0166B3" strokeWidth="2" />
                ))}
              </>
            )}

            {columns.map((c, i) => (
              <rect key={i} x={c.x - 6} y={c.y - 6} width="12" height="12"
                fill="#8FA3B4" stroke="#3A4E63" strokeWidth="1.5" />
            ))}

            {docks.map((d, i) => (
              <rect key={i} x={d.x} y={d.y} width={d.w} height={d.h}
                fill="rgba(194,87,8,.18)" stroke="#C25708" strokeWidth="1.5" />
            ))}
            {dragDock && (
              <rect
                x={Math.min(dragDock.x, dragDock.x + dragDock.w)}
                y={Math.min(dragDock.y, dragDock.y + dragDock.h)}
                width={Math.abs(dragDock.w)} height={Math.abs(dragDock.h)}
                fill="rgba(194,87,8,.14)" stroke="#C25708" strokeDasharray="4 3" strokeWidth="1.5"
              />
            )}
          </svg>
        )}
      </div>

      <p className="text-[11px] leading-snug text-slate-600">{activeHint}</p>

      {geometry && (
        <p className="border border-cloud-300 bg-white px-3 py-2 text-[11px]">
          Контур обведён: <b>{geometry.polygon.length}</b> углов ·{' '}
          габарит <b>{(geometry.width / 1000).toFixed(1)} × {(geometry.depth / 1000).toFixed(1)} м</b> ·
          колонн <b>{geometry.columns.length}</b> · ворот <b>{geometry.docks.length}</b>
        </p>
      )}
    </div>
  );
}
