'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PRODUCTS, getProduct } from '@/lib/rack/catalog';
import { buildKp, fmtSum } from '@/lib/rack/kp';
import { palletPositions } from '@/lib/rack/spec';
import { design, roomWithColumns, DesignError, TRUCKS } from '@/lib/rack/layout';
import LayoutPlan from './LayoutPlan';
import PlanEditor from './PlanEditor';
import { encodeShare } from '@/lib/rack/share';
import { UNIT_PRICE_DEFAULTS, PRESETS, EMPTY_GEOMETRY } from './defaults';
import KpDocument from './doc/KpDocument';
import SketchPanel from './SketchPanel';
import { ActionButton, Field, Msg, NumField, Panel, Row, Verdict, api } from './ui';

const DEFAULT_ROOM = {
  width: 45000, depth: 24000, ceiling: 10500,
  palletHeight: 1500, palletLoad: 800,
  truck: 'reachtruck', beam: 2700, rackDepth: 1050,
  colStepX: 12000, colStepY: 12000, colSize: 400,
};

export default function KpGenerator({ user, keys, openDoc, openNonce, onNeedKeys }) {
  const [docId, setDocId] = useState(null);
  const [client, setClient] = useState('');
  const [productKey, setProductKey] = useState('pallet-frontal');
  const [lang, setLang] = useState('ru');
  const [geometry, setGeometry] = useState(EMPTY_GEOMETRY);
  const [unitPrices, setUnitPrices] = useState(UNIT_PRICE_DEFAULTS['pallet-frontal']);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountReason, setDiscountReason] = useState('');
  const [discountNote, setDiscountNote] = useState('');
  const [paymentKey, setPaymentKey] = useState('split5050');
  const [deliveryHours, setDeliveryHours] = useState(48);
  const [extraNote, setExtraNote] = useState('');
  const [room, setRoom] = useState(DEFAULT_ROOM);
  const [layout, setLayout] = useState(null);
  const [layoutError, setLayoutError] = useState('');
  // Откуда берётся форма помещения: прямоугольник, обводка по фото
  // или распознанный набросок из блокнота.
  const [roomMode, setRoomMode] = useState('rect');
  const [planDraft, setPlanDraft] = useState(null);
  const [sketchRoom, setSketchRoom] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [error, setError] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [sizeCode, setSizeCode] = useState('');
  const [framePrice, setFramePrice] = useState(0);
  const [benchmark, setBenchmark] = useState(null);
  const [planImage, setPlanImage] = useState(null);
  const [renderImage, setRenderImage] = useState(null);
  const [savedAt, setSavedAt] = useState(null);
  const hydrated = useRef(false);

  const product = getProduct(productKey);

  const draft = useMemo(
    () => ({
      docId, client, productKey, lang, geometry, unitPrices, discountPercent,
      discountReason, discountNote, paymentKey, deliveryHours, extraNote,
      sizeCode, framePrice, room, hasLayout: Boolean(layout),
      planImage, renderImage,
    }),
    [docId, client, productKey, lang, geometry, unitPrices, discountPercent, discountReason,
     discountNote, paymentKey, deliveryHours, extraNote, sizeCode, framePrice, room, layout,
     planImage, renderImage]
  );

  // Черновик переживает перезагрузку: менеджер собирает КП не за один заход,
  // а раньше любой промах по вкладке стирал введённое.
  useEffect(() => {
    try {
      const raw = localStorage.getItem('raxpro-kp-draft');
      if (raw) applyState(JSON.parse(raw));
    } catch {}
    hydrated.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem('raxpro-kp-draft', JSON.stringify(draft));
    } catch {}
  }, [draft]);

  // Открытие КП из реестра.
  useEffect(() => {
    if (!openDoc) return;
    applyState({ ...openDoc.state, docId: openDoc.id });
    setSavedAt(openDoc.updatedAt);
    setShareUrl('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openNonce]);

  const applyState = useCallback((d) => {
    if (!d || typeof d !== 'object') return;
    if (d.docId !== undefined) setDocId(d.docId);
    if (d.client != null) setClient(d.client);
    if (d.productKey) setProductKey(d.productKey);
    if (d.lang) setLang(d.lang);
    if (d.geometry) setGeometry(d.geometry);
    if (d.unitPrices) setUnitPrices(d.unitPrices);
    if (d.discountPercent != null) setDiscountPercent(d.discountPercent);
    if (d.discountReason != null) setDiscountReason(d.discountReason);
    if (d.discountNote != null) setDiscountNote(d.discountNote);
    if (d.paymentKey) setPaymentKey(d.paymentKey);
    if (d.deliveryHours != null) setDeliveryHours(d.deliveryHours);
    if (d.extraNote != null) setExtraNote(d.extraNote);
    if (d.sizeCode) setSizeCode(d.sizeCode);
    if (d.framePrice != null) setFramePrice(d.framePrice);
    if (d.room) setRoom({ ...DEFAULT_ROOM, ...d.room });
    if (d.planImage !== undefined) setPlanImage(d.planImage);
    if (d.renderImage !== undefined) setRenderImage(d.renderImage);
    if (d.room && d.hasLayout) {
      try {
        const r = d.room.polygon ? d.room : roomWithColumns(d.room);
        setLayout({ ...design(r), room: r });
      } catch {
        setLayout(null);
      }
    }
  }, []);

  const kp = useMemo(
    () =>
      buildKp({
        client: client || '—',
        productKey,
        lang,
        geometry,
        price: {
          unitPrices,
          ...(product.pricingModel === 'sectionList'
            ? { sectionPrice: product.sizes.find((x) => x.code === sizeCode)?.price ?? 0, framePrice, sizeCode }
            : {}),
          discountPercent: Number(discountPercent) || 0,
          discountReason: discountReason || undefined,
          discountNote,
        },
        paymentKey,
        deliveryHours: Number(deliveryHours) || 0,
        planImage,
        renderImage,
        hasComputedPlan: Boolean(layout),
        extraNote,
      }),
    [client, productKey, lang, geometry, unitPrices, discountPercent, discountReason,
     discountNote, paymentKey, deliveryHours, extraNote, planImage, renderImage,
     sizeCode, framePrice, product, layout]
  );

  const blockers = kp.issues.filter((i) => i.severity === 'block');
  const warnings = kp.issues.filter((i) => i.severity === 'warn');
  const positions = geometry.palletsPerLevel ? palletPositions(geometry) : null;

  /* ————————————————————————————————— действия */

  async function saveToRegistry() {
    const data = await api('/api/kp/docs', {
      method: 'POST',
      body: JSON.stringify({
        id: docId || undefined,
        number: kp.meta.number,
        client: client || '—',
        productKey,
        productName: lang === 'uz' ? product.uz.name : product.ru.name,
        lang,
        total: kp.price.totalWithVat,
        positions,
        state: { ...draft, date: kp.meta.date.toISOString() },
      }),
    });
    setDocId(data.doc.id);
    setSavedAt(data.doc.updatedAt);
    return docId ? 'Обновлено' : 'Сохранено';
  }

  async function downloadPdf() {
    const res = await fetch('/api/kp/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...draft, number: kp.meta.number, date: kp.meta.date.toISOString() }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j.error || `Сервер ответил ${res.status}`);
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${kp.meta.number}.pdf`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    return 'Скачано';
  }

  // Ссылка для клиента: документ едет во фрагменте адреса, хранилище не нужно.
  async function makeShareLink() {
    const hash = await encodeShare({
      client, productKey, lang, geometry, unitPrices,
      discountPercent: Number(discountPercent) || 0,
      discountReason, discountNote, paymentKey,
      deliveryHours: Number(deliveryHours) || 0,
      extraNote, sizeCode, framePrice,
      room, hasLayout: Boolean(layout),
      date: kp.meta.date.toISOString(),
    });
    const url = `${location.origin}/tp#${hash}`;
    setShareUrl(url);
    try {
      await navigator.clipboard.writeText(url);
      return 'Скопирована';
    } catch {
      return 'Готова';
    }
  }

  async function generateImage() {
    if (!layout) throw new Error('Сначала посчитайте раскладку — кадр строится по ней');
    const data = await api('/api/kp/image', {
      method: 'POST',
      body: JSON.stringify({
        rows: layout.rows,
        sections: layout.sections,
        levels: layout.levels,
        width: layout.room.width,
        depth: layout.room.depth,
        ceiling: layout.room.ceiling,
        truck: layout.room.truck,
        product: lang === 'uz' ? product.uz.name : product.ru.name,
      }),
    });
    setRenderImage(data.image);
    return 'Кадр в документе';
  }

  function exportScene() {
    if (!layout) return;
    const payload = {
      number: kp.meta.number,
      client: client || '—',
      room: layout.room,
      layout: {
        levels: layout.levels, frameHeight: layout.frameHeight, positions: layout.positions,
        rows: layout.rows, sections: layout.sections, bays: layout.bays,
      },
    };
    download(`${kp.meta.number}.scene.json`, JSON.stringify(payload, null, 2));
  }

  function switchProduct(key) {
    setProductKey(key);
    setUnitPrices(UNIT_PRICE_DEFAULTS[key] || {});
    const p = getProduct(key);
    const first = p.sizes.find((x) => x.price) || p.sizes[0];
    setSizeCode(first?.code || '');
    setFramePrice(first && p.framePrices ? p.framePrices[first.h] || 0 : 0);
    setGeometry((g) => ({
      ...g,
      decksPerLevel: p.bom.includes('deck') ? 5 : 0,
      palletsPerLevel: key.startsWith('pallet') ? 3 : 0,
      countGroundLevel: key.startsWith('pallet'),
    }));
  }

  function applyPreset(id) {
    const p = PRESETS.find((x) => x.id === id);
    if (!p) return;
    setProductKey(p.productKey);
    setUnitPrices(UNIT_PRICE_DEFAULTS[p.productKey] || {});
    setGeometry(p.geometry);
    setClient(p.label.split(' · ')[0]);
    setDiscountPercent(0);
    setDiscountReason('');
    if (p.sizeCode) {
      setSizeCode(p.sizeCode);
      const prod = getProduct(p.productKey);
      const v = prod.sizes.find((x) => x.code === p.sizeCode);
      setFramePrice(v && prod.framePrices ? prod.framePrices[v.h] || 0 : 0);
    }
    setBenchmark({ label: p.label, total: p.total, note: p.note });
  }

  function newDoc() {
    setDocId(null);
    setSavedAt(null);
    setClient('');
    setGeometry(EMPTY_GEOMETRY);
    setLayout(null);
    setSketchRoom(null);
    setPlanDraft(null);
    setRoomMode('rect');
    setRoom(DEFAULT_ROOM);
    setPlanImage(null);
    setRenderImage(null);
    setShareUrl('');
    setBenchmark(null);
    setExtraNote('');
    setDiscountPercent(0);
    setDiscountReason('');
    setDiscountNote('');
    setError('');
  }

  const calcLayout = useCallback(
    (overrideRoom) => {
      setLayoutError('');
      try {
        const base = overrideRoom || room;
        const shape =
          roomMode === 'sketch' && sketchRoom ? sketchRoom
          : roomMode === 'draft' && planDraft?.geometry ? planDraft.geometry
          : null;
        const r = shape
          ? { ...base, width: shape.width, depth: shape.depth, polygon: shape.polygon, columns: shape.columns, docks: shape.docks }
          : roomWithColumns(base);
        const l = design(r);
        setLayout({ ...l, room: r });
        setGeometry((g) => ({
          ...g,
          rows: l.rows,
          sections: l.sections,
          levels: l.levels,
          palletsPerLevel: Math.round(l.positions / (l.sections * (l.levels + 1))) || 3,
          countGroundLevel: true,
        }));
        setBenchmark(null);
      } catch (e) {
        setLayout(null);
        setLayoutError(e instanceof DesignError ? e.message : String(e?.message || e));
      }
    },
    [room, roomMode, sketchRoom, planDraft]
  );

  /** Распознанный набросок переносится в форму целиком — вплоть до имени
   *  клиента, если оно написано на листе, — и сразу считается раскладка. */
  function applySketch(s) {
    const docks = (s.docks || []).map((d) => ({
      x: Math.max(0, d.x - d.width / 2),
      y: Math.max(0, d.y - 500),
      w: d.width,
      h: 1000,
    }));
    const shape = { width: s.width, depth: s.depth, polygon: s.polygon, columns: s.columns || [], docks };
    setSketchRoom(shape);
    setRoomMode('sketch');
    if (s.client && !client.trim()) setClient(s.client);
    if (s.productKey && s.productKey !== productKey) switchProduct(s.productKey);

    const nextRoom = {
      ...room,
      width: s.width,
      depth: s.depth,
      ...(s.ceiling ? { ceiling: s.ceiling } : {}),
      ...(s.beam ? { beam: s.beam } : {}),
      ...(s.truck && TRUCKS[s.truck] ? { truck: s.truck } : {}),
    };
    setRoom(nextRoom);

    try {
      const r = { ...nextRoom, width: shape.width, depth: shape.depth, polygon: shape.polygon, columns: shape.columns, docks: shape.docks };
      const l = design(r);
      setLayout({ ...l, room: r });
      setGeometry((g) => ({
        ...g,
        rows: l.rows,
        sections: l.sections,
        levels: s.levels ?? l.levels,
        palletsPerLevel: Math.round(l.positions / (l.sections * (l.levels + 1))) || 3,
        countGroundLevel: true,
      }));
      setLayoutError('');
    } catch (e) {
      setLayout(null);
      setLayoutError(
        e instanceof DesignError
          ? `Набросок прочитан, но раскладка не строится: ${e.message}`
          : String(e?.message || e)
      );
    }
  }

  function readFile(file, set) {
    if (!file) return set(null);
    if (file.size > 4 * 1024 * 1024) {
      setError('Картинка тяжелее 4 МБ — уменьшите её, иначе КП не сохранится в реестр.');
      return;
    }
    const fr = new FileReader();
    fr.onload = () => set(fr.result);
    fr.onerror = () => setError('Не удалось прочитать файл');
    fr.readAsDataURL(file);
  }

  /* ————————————————————————————————— разметка */

  return (
    <div
      style={{
        display: 'grid',
        gap: 20,
        gridTemplateColumns: 'minmax(0, 1fr)',
        padding: 'clamp(12px, 2.4vw, 24px)',
        maxWidth: 1640,
        margin: '0 auto',
      }}
      className="kp-editor"
    >
      {editorOpen && (
        <div className="kp-app__chrome" style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', flexDirection: 'column', background: 'var(--paper)', padding: 14 }}>
          <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <p className="kp-label">RAX PRO</p>
              <h2 style={{ margin: 0, fontSize: 17, letterSpacing: '-0.02em' }}>Обводка склада по фото</h2>
            </div>
            <button className="kp-btn" onClick={() => setEditorOpen(false)}>Готово</button>
          </div>
          <div style={{ minHeight: 0, flex: 1, overflow: 'auto' }}>
            <PlanEditor value={planDraft} onChange={setPlanDraft} height={Math.max(420, (typeof window !== 'undefined' ? window.innerHeight : 900) - 240)} />
          </div>
        </div>
      )}

      <div className="kp-editor__grid" style={{ display: 'grid', gap: 20 }}>
        {/* ——————————————————————— форма */}
        <div className="kp-app__side" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ position: 'sticky', top: 52, zIndex: 20, background: 'var(--paper)', paddingBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
              <div>
                <p className="kp-label">{docId ? 'Правка КП' : 'Новое КП'}</p>
                <h1 style={{ margin: 0, fontSize: 19, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  {kp.meta.number}
                </h1>
              </div>
              <button className="kp-btn kp-btn--ghost kp-btn--sm" onClick={newDoc}>Новое</button>
            </div>
            {savedAt && (
              <p style={{ margin: '6px 0 0', fontSize: 11, color: 'var(--muted)' }}>
                В реестре · сохранено {new Date(savedAt).toLocaleString('ru-RU')}
              </p>
            )}
            <Verdict
              blockers={blockers}
              warnings={warnings}
              onPrint={() => window.print()}
              onPdf={downloadPdf}
              onSave={saveToRegistry}
              saveLabel={docId ? 'Обновить в реестре' : 'Сохранить в реестр'}
              onError={setError}
            />
            {error && <Msg tone="bad" style={{ marginTop: 8 }}>{error}</Msg>}
          </div>

          <Panel title="Набросок из блокнота">
            <SketchPanel keys={keys} onApply={applySketch} onNeedKeys={onNeedKeys} />
          </Panel>

          <Panel title="Пресеты из реальных КП">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {PRESETS.map((p) => (
                <button key={p.id} className="kp-btn kp-btn--ghost kp-btn--sm" onClick={() => applyPreset(p.id)}>
                  {p.label}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="1 · Клиент и продукт">
            <Field label="Клиент">
              <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="ООО «Название»" className="inp" />
            </Field>
            <Field label="Продукт">
              <select value={productKey} onChange={(e) => switchProduct(e.target.value)} className="inp">
                {PRODUCTS.map((p) => (
                  <option key={p.key} value={p.key}>
                    {p.ru.name}{p.priceMode === 'project' ? ' — цена под проект' : ''}
                  </option>
                ))}
              </select>
            </Field>
            <div>
              <p className="kp-label">Язык документа</p>
              <div style={{ display: 'flex', gap: 6 }}>
                {['ru', 'uz'].map((l) => (
                  <button
                    key={l}
                    className={`kp-btn kp-btn--sm ${lang === l ? '' : 'kp-btn--ghost'}`}
                    style={{ flex: 1 }}
                    onClick={() => setLang(l)}
                  >
                    {l === 'ru' ? 'Русский' : 'Oʻzbekcha'}
                  </button>
                ))}
              </div>
            </div>
            <p style={{ margin: 0, fontSize: 11.5, color: 'var(--muted)' }}>{product.notesRu}</p>
          </Panel>

          {productKey.startsWith('pallet') && (
            <Panel title="2 · Помещение — раскладка считается сама">
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {[['rect', 'Прямоугольник'], ['draft', 'Обвести по фото'], ['sketch', 'По наброску']].map(([id, label]) => (
                  <button
                    key={id}
                    className={`kp-btn kp-btn--sm ${roomMode === id ? '' : 'kp-btn--ghost'}`}
                    style={{ flex: '1 1 90px' }}
                    onClick={() => setRoomMode(id)}
                    disabled={id === 'sketch' && !sketchRoom}
                    title={id === 'sketch' && !sketchRoom ? 'Сначала прочитайте набросок в панели выше' : undefined}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {roomMode === 'draft' && (
                <>
                  <button className="kp-btn kp-btn--accent kp-btn--block" onClick={() => setEditorOpen(true)}>
                    {planDraft?.geometry ? 'Открыть обводку' : 'Обвести склад по фото'}
                  </button>
                  {planDraft?.geometry ? (
                    <Msg tone="ok">
                      Контур: {planDraft.geometry.polygon.length} углов ·{' '}
                      {(planDraft.geometry.width / 1000).toFixed(1)} × {(planDraft.geometry.depth / 1000).toFixed(1)} м ·
                      колонн {planDraft.geometry.columns.length} · ворот {planDraft.geometry.docks.length}
                    </Msg>
                  ) : (
                    <Msg tone="warn">Пока контур не обведён, раскладка считается по прямоугольнику ниже.</Msg>
                  )}
                </>
              )}

              {roomMode === 'sketch' && sketchRoom && (
                <Msg tone="ok">
                  С наброска: {sketchRoom.polygon.length} углов ·{' '}
                  {(sketchRoom.width / 1000).toFixed(1)} × {(sketchRoom.depth / 1000).toFixed(1)} м ·
                  колонн {sketchRoom.columns.length} · ворот {sketchRoom.docks.length}
                </Msg>
              )}

              <Row>
                {roomMode === 'rect' && <NumField label="Ширина, мм" value={room.width} onChange={(v) => setRoom({ ...room, width: v })} />}
                {roomMode === 'rect' && <NumField label="Глубина, мм" value={room.depth} onChange={(v) => setRoom({ ...room, depth: v })} />}
                <NumField label="Потолок, мм" value={room.ceiling} onChange={(v) => setRoom({ ...room, ceiling: v })} />
              </Row>
              <Row>
                <Field label="Техника">
                  <select value={room.truck} className="inp" onChange={(e) => setRoom({ ...room, truck: e.target.value })}>
                    {Object.entries(TRUCKS).map(([k, v]) => (
                      <option key={k} value={k}>{v.ru} — проход {(v.aisle / 1000).toFixed(1)} м</option>
                    ))}
                  </select>
                </Field>
                <Field label="Длина балки">
                  <select value={room.beam} className="inp" onChange={(e) => setRoom({ ...room, beam: Number(e.target.value) })}>
                    <option value={2700}>2700 мм — 3 паллеты</option>
                    <option value={3300}>3300 мм — 4 паллеты</option>
                  </select>
                </Field>
              </Row>
              <Row>
                <NumField label="Высота паллеты, мм" value={room.palletHeight} onChange={(v) => setRoom({ ...room, palletHeight: v })} />
                <NumField label="Вес паллеты, кг" value={room.palletLoad} onChange={(v) => setRoom({ ...room, palletLoad: v })} />
                <NumField label="Глубина ряда, мм" value={room.rackDepth} onChange={(v) => setRoom({ ...room, rackDepth: v })} />
              </Row>
              {roomMode === 'rect' && (
                <Row>
                  <NumField label="Шаг колонн X, мм" value={room.colStepX} onChange={(v) => setRoom({ ...room, colStepX: v })} />
                  <NumField label="Шаг колонн Y, мм" value={room.colStepY} onChange={(v) => setRoom({ ...room, colStepY: v })} />
                  <NumField label="Колонна, мм" value={room.colSize} onChange={(v) => setRoom({ ...room, colSize: v })} />
                </Row>
              )}
              <button className="kp-btn kp-btn--accent kp-btn--block" onClick={() => calcLayout()}>
                Рассчитать раскладку
              </button>
              {layoutError && <Msg tone="bad">{layoutError}</Msg>}
              {layout && (
                <div style={{ border: '1px solid var(--line)', background: 'var(--panel)', padding: 8 }}>
                  <LayoutPlan room={layout.room} layout={layout} compact />
                  <p style={{ margin: '6px 0 0', fontSize: 11.5, color: 'var(--ink-2)' }}>
                    {layout.rows} ряд(ов) · {layout.sections} секций · {layout.levels} яруса ·{' '}
                    рама {layout.frameHeight} мм · заполнение {(layout.fillRatio * 100).toFixed(0)} %
                  </p>
                  {layout.cappedByFrame && (
                    <Msg tone="warn" style={{ marginTop: 6 }}>
                      Ярусы ограничены высотой рамы 6000 мм, а не потолком. Под такой потолок
                      имеет смысл считать мезонин — второй уровень хранения.
                    </Msg>
                  )}
                </div>
              )}
            </Panel>
          )}

          <Panel title="3 · Геометрия">
            <Row>
              <NumField label="Рядов" value={geometry.rows} onChange={(v) => setGeometry({ ...geometry, rows: v })} />
              <NumField label="Секций всего" value={geometry.sections} onChange={(v) => setGeometry({ ...geometry, sections: v })} />
              <NumField label="Ярусов балок" value={geometry.levels} onChange={(v) => setGeometry({ ...geometry, levels: v })} />
            </Row>
            <Row>
              <Field label="Анкеров на раму">
                <select value={geometry.anchorsPerFrame} className="inp" onChange={(e) => setGeometry({ ...geometry, anchorsPerFrame: Number(e.target.value) })}>
                  <option value={4}>4 — 2 на пятку</option>
                  <option value={8}>8 — 4 на пятку</option>
                </select>
              </Field>
              {product.bom.includes('deck') && (
                <NumField label="Настилов на ярус" value={geometry.decksPerLevel} onChange={(v) => setGeometry({ ...geometry, decksPerLevel: v })} />
              )}
              {productKey.startsWith('pallet') && (
                <NumField label="Паллет на ярус" value={geometry.palletsPerLevel} onChange={(v) => setGeometry({ ...geometry, palletsPerLevel: v })} />
              )}
            </Row>
            {productKey.startsWith('pallet') && (
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                <input type="checkbox" checked={geometry.countGroundLevel} onChange={(e) => setGeometry({ ...geometry, countGroundLevel: e.target.checked })} />
                Пол считается местом хранения
              </label>
            )}
            {positions != null && (
              <Msg tone="ok">
                Паллето-мест: <b>{positions}</b>
                {kp.price.perPalletPosition ? <> · {fmtSum(kp.price.perPalletPosition)} за место</> : null}
              </Msg>
            )}
          </Panel>

          {product.pricingModel === 'sectionList' ? (
            <Panel title="4 · Прайс за секцию">
              <Field label="Типоразмер из прайса">
                <select
                  value={sizeCode}
                  className="inp"
                  onChange={(e) => {
                    const c = e.target.value;
                    setSizeCode(c);
                    const v = product.sizes.find((x) => x.code === c);
                    setFramePrice(v && product.framePrices ? product.framePrices[v.h] || 0 : 0);
                    if (v) setGeometry((g) => ({ ...g, levels: v.levels }));
                  }}
                >
                  {product.sizes.map((v) => (
                    <option key={v.code} value={v.code}>
                      {v.h}×{v.w}×{v.d}, {v.levels} полок — {v.price ? fmtSum(v.price) : 'цены нет'}
                    </option>
                  ))}
                </select>
              </Field>
              <NumField label="Цена рамы, сум" value={framePrice} onChange={setFramePrice} />
              <p style={{ margin: 0, fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.5 }}>
                Сумма = секции × прайс − (секции − ряды) × цена рамы. Соседние секции делят раму,
                поэтому ряд дешевле, чем столько же отдельных стеллажей.
              </p>
            </Panel>
          ) : (
            <Panel title="4 · Цены за единицу, сум">
              <Row>
                {kp.spec.map((l) => (
                  <NumField key={l.item} label={l.labelRu} value={unitPrices[l.item] ?? 0} onChange={(v) => setUnitPrices({ ...unitPrices, [l.item]: v })} />
                ))}
              </Row>
            </Panel>
          )}

          <Panel title="5 · Скидка">
            <Row>
              <NumField label="Процент" value={discountPercent} onChange={setDiscountPercent} />
              <Field label="Причина">
                <select value={discountReason} className="inp" onChange={(e) => setDiscountReason(e.target.value)}>
                  <option value="">— не выбрана —</option>
                  <option value="volume">за объём заказа</option>
                  <option value="prepay">за 100 % предоплату</option>
                  <option value="deadline">при подписании до даты</option>
                  <option value="repeat">постоянному клиенту</option>
                  <option value="manual">решение директора</option>
                </select>
              </Field>
            </Row>
            <Field label="Комментарий к скидке">
              <input value={discountNote} onChange={(e) => setDiscountNote(e.target.value)} className="inp" />
            </Field>
          </Panel>

          <Panel title="6 · Условия">
            <Field label="Оплата">
              <select value={paymentKey} onChange={(e) => setPaymentKey(e.target.value)} className="inp">
                <option value="prepay100">100 % предоплата за 5 банковских дней</option>
                <option value="split5050">50 % / 50 % после монтажа</option>
                <option value="installment">50 % + рассрочка 3 месяца</option>
              </select>
            </Field>
            <NumField label="Срок поставки, часов" value={deliveryHours} onChange={setDeliveryHours} />
            <Field label="Дополнительно (только то, что уникально для клиента)">
              <textarea value={extraNote} onChange={(e) => setExtraNote(e.target.value)} rows={3} className="inp" />
            </Field>
          </Panel>

          <Panel title="7 · Картинки в документе">
            <p style={{ margin: 0, fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.5 }}>
              План генератор рисует сам после расчёта раскладки. Обложку и страницу работ
              он берёт из архива объектов. Сюда — только свой чертёж или свой рендер.
            </p>
            <ActionButton
              variant="ghost"
              onClick={generateImage}
              disabled={!layout || !keys?.google?.connected}
              busyLabel="Собираю кадр…"
              doneLabel="Кадр в документе"
              onError={setError}
              title={!keys?.google?.connected ? 'Нужен ключ Google в разделе «Ключи ИИ»' : undefined}
            >
              Собрать изображение по раскладке
            </ActionButton>
            <Field label="Свой план склада (вид сверху)">
              <input type="file" accept="image/png,image/jpeg" className="inp" onChange={(e) => readFile(e.target.files?.[0], setPlanImage)} />
            </Field>
            {planImage && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Msg tone="ok" style={{ flex: 1, margin: 0 }}>Загружен — заменит нарисованный план.</Msg>
                <button className="kp-btn kp-btn--ghost kp-btn--sm" onClick={() => setPlanImage(null)}>Убрать</button>
              </div>
            )}
            <Field label="Рендер: как это будет выглядеть">
              <input type="file" accept="image/png,image/jpeg" className="inp" onChange={(e) => readFile(e.target.files?.[0], setRenderImage)} />
            </Field>
            {renderImage && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Msg tone="ok" style={{ flex: 1, margin: 0 }}>Встанет на лист «Решение».</Msg>
                <button className="kp-btn kp-btn--ghost kp-btn--sm" onClick={() => setRenderImage(null)}>Убрать</button>
              </div>
            )}
          </Panel>

          {benchmark && (
            <Msg>
              Эталон из фактического КП «{benchmark.label.split(' · ')[0]}»: <b>{fmtSum(benchmark.total)}</b>.
              Расчёт сейчас: <b>{fmtSum(kp.price.totalNoVat)}</b>{' '}
              <span style={{ color: Math.abs(kp.price.totalNoVat / benchmark.total - 1) > 0.05 ? 'var(--bad)' : 'var(--ok)' }}>
                ({kp.price.totalNoVat >= benchmark.total ? '+' : '−'}
                {Math.abs((kp.price.totalNoVat / benchmark.total - 1) * 100).toFixed(1)} %)
              </span>. Расхождение больше 5 % означает, что цены пора обновить.
              {benchmark.note && <> Примечание: {benchmark.note}.</>}
            </Msg>
          )}

          <Panel title="Отправить клиенту">
            <ActionButton
              block
              disabled={blockers.length > 0}
              onClick={makeShareLink}
              busyLabel="Собираю ссылку…"
              doneLabel="Ссылка скопирована"
              onError={setError}
            >
              Ссылка для клиента
            </ActionButton>
            {shareUrl && (
              <>
                <p style={{ margin: 0, wordBreak: 'break-all', fontFamily: 'ui-monospace, monospace', fontSize: 10.5, color: 'var(--muted)', lineHeight: 1.5 }}>
                  {shareUrl}
                </p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <a className="kp-btn kp-btn--ghost kp-btn--sm" href={shareUrl} target="_blank" rel="noreferrer">Открыть как клиент</a>
                  <ActionButton
                    size="sm"
                    variant="ghost"
                    onClick={async () => { await navigator.clipboard.writeText(shareUrl); return 'Скопировано'; }}
                    onError={setError}
                  >
                    Скопировать
                  </ActionButton>
                </div>
                <p style={{ margin: 0, fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.5 }}>
                  Открывается без пароля и не зависит ни от какой базы: предложение целиком
                  лежит в самой ссылке.
                </p>
              </>
            )}
            <div style={{ display: 'flex', gap: 10, fontSize: 11, color: 'var(--muted)' }}>
              {layout && <button onClick={exportScene} style={linkBtn}>сцена для Blender</button>}
              <button
                onClick={() => download(`${kp.meta.number}.json`, JSON.stringify({ number: kp.meta.number, issuedAt: new Date().toISOString(), draft, spec: kp.spec, price: kp.price, positions: kp.positions }, null, 2))}
                style={linkBtn}
              >
                выгрузить JSON
              </button>
            </div>
          </Panel>

          <details className="kp-panel" open>
            <summary style={{ cursor: 'pointer', padding: '9px 12px', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)' }}>
              Замечания приёмки · {kp.issues.length}
            </summary>
            <div className="kp-panel__body" style={{ gap: 6 }}>
              {kp.issues.length === 0 && <Msg tone="ok">Замечаний нет.</Msg>}
              {blockers.map((i, n) => <Msg key={'b' + n} tone="bad">{i.message}</Msg>)}
              {warnings.map((i, n) => <Msg key={'w' + n} tone="warn">{i.message}</Msg>)}
            </div>
          </details>
        </div>

        {/* ——————————————————————— документ */}
        <div style={{ minWidth: 0 }}>
          <KpDocument
            kp={kp}
            planImage={planImage}
            renderImage={renderImage}
            layout={layout}
            onCaptureRender={setRenderImage}
          />
        </div>
      </div>

    </div>
  );
}

const linkBtn = {
  background: 'none',
  border: 0,
  padding: 0,
  font: 'inherit',
  color: 'var(--muted)',
  textDecoration: 'underline',
  textUnderlineOffset: 2,
  cursor: 'pointer',
};

function download(name, text) {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
