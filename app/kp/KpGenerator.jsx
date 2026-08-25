'use client';

import { useEffect, useMemo, useState } from 'react';
import { PRODUCTS, getProduct } from '@/lib/rack/catalog';
import { buildKp, fmtSum } from '@/lib/rack/kp';
import { palletPositions } from '@/lib/rack/spec';
import { design, roomWithColumns, DesignError, TRUCKS } from '@/lib/rack/layout';
import LayoutPlan from './LayoutPlan';
import PlanEditor from './PlanEditor';
import RackScene from './RackScene';
import { encodeShare } from '@/lib/rack/share';
import { UNIT_PRICE_DEFAULTS, PRESETS, EMPTY_GEOMETRY } from './defaults';
import KpPreview from './KpPreview';
import { Field, NumField, Row, Panel, Verdict } from './ui';

export default function KpGenerator() {
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
  const [room, setRoom] = useState({
    width: 45000, depth: 24000, ceiling: 10500,
    palletHeight: 1500, palletLoad: 800,
    truck: 'reachtruck', beam: 2700, rackDepth: 1050,
    colStepX: 12000, colStepY: 12000, colSize: 400,
  });
  const [layout, setLayout] = useState(null);
  const [layoutError, setLayoutError] = useState('');
  // Откуда берётся форма помещения: прямоугольник или обводка по фото драфта.
  const [roomMode, setRoomMode] = useState('rect');
  const [planDraft, setPlanDraft] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  // Режим печати: страницу открывает сервер, форма не нужна — только документ.
  const [printMode, setPrintMode] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfError, setPdfError] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [shareCopied, setShareCopied] = useState(false);
  const [sizeCode, setSizeCode] = useState('');
  const [framePrice, setFramePrice] = useState(0);
  const [benchmark, setBenchmark] = useState(null);
  const [planImage, setPlanImage] = useState(null);
  const [renderImage, setRenderImage] = useState(null);

  const product = getProduct(productKey);

  // Черновик переживает перезагрузку: менеджер собирает КП не за один заход,
  // а раньше любой промах по вкладке стирал введённое.
  const draft = { client, productKey, lang, geometry, unitPrices, discountPercent,
                  discountReason, discountNote, paymentKey, deliveryHours, extraNote };

  useEffect(() => {
    const isPrint = new URLSearchParams(location.search).get('print') === '1';
    try {
      const raw = isPrint
        ? localStorage.getItem('raxpro-kp-print')
        : localStorage.getItem('raxpro-kp-draft');
      if (!raw) return;
      const d = JSON.parse(raw);
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
      if (d.room) setRoom(d.room);
      if (d.layout) setLayout(d.layout);
      if (d.planImage) setPlanImage(d.planImage);
      if (d.renderImage) setRenderImage(d.renderImage);
      if (isPrint) setPrintMode(true);
    } catch {}
  }, []);

  useEffect(() => {
    if (printMode) return;
    try { localStorage.setItem('raxpro-kp-draft', JSON.stringify(draft)); } catch {}
  }, [client, productKey, lang, geometry, unitPrices, discountPercent, discountReason,
      discountNote, paymentKey, deliveryHours, extraNote]);

  async function downloadPdf() {
    setPdfBusy(true);
    setPdfError('');
    try {
      const res = await fetch('/api/kp/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...draft, sizeCode, framePrice, room, layout,
          planImage, renderImage, number: kp.meta.number,
        }),
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
      URL.revokeObjectURL(url);
    } catch (e) {
      setPdfError(e.message || String(e));
    } finally {
      setPdfBusy(false);
    }
  }

  // Ссылка для клиента: документ едет во фрагменте адреса, хранилище не нужно.
  async function makeShareLink() {
    try {
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
      setShareCopied(false);
      try {
        await navigator.clipboard.writeText(url);
        setShareCopied(true);
      } catch {}
    } catch (e) {
      setShareUrl('');
      setPdfError(`Не удалось собрать ссылку: ${e.message}`);
    }
  }

  // Сцена для Blender: те же числа, что план, модель и смета.
  // Раньше числа для рендера были зашиты в скрипт отдельно, и картинка
  // показывала один склад, пока смета считала другой.
  function exportScene() {
    if (!layout) return;
    const payload = {
      number: kp.meta.number,
      client: client || '—',
      room: layout.room,
      layout: {
        levels: layout.levels,
        frameHeight: layout.frameHeight,
        positions: layout.positions,
        rows: layout.rows,
        sections: layout.sections,
        bays: layout.bays,
      },
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `${kp.meta.number}.scene.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportJson() {
    const payload = { number: kp.meta.number, issuedAt: new Date().toISOString(), draft,
                      spec: kp.spec, price: kp.price, positions: kp.positions };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url; a.download = `${kp.meta.number}.json`; a.click();
    URL.revokeObjectURL(url);
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
            ? { sectionPrice: product.sizes.find((x) => x.code === sizeCode)?.price ?? 0,
                framePrice, sizeCode }
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

  function calcLayout() {
    setLayoutError('');
    try {
      const fromDraft = roomMode === 'draft' && planDraft?.geometry;
      const r = fromDraft
        ? {
            ...room,
            width: planDraft.geometry.width,
            depth: planDraft.geometry.depth,
            polygon: planDraft.geometry.polygon,
            columns: planDraft.geometry.columns,
            docks: planDraft.geometry.docks,
          }
        : roomWithColumns(room);
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
  }

  function readFile(file, set) {
    if (!file) return set(null);
    const fr = new FileReader();
    fr.onload = () => set(fr.result);
    fr.readAsDataURL(file);
  }

  if (printMode) {
    return (
      <div className="mx-auto max-w-[210mm] print:max-w-none">
        <KpPreview kp={kp} planImage={planImage} renderImage={renderImage} layout={layout}
        onCaptureRender={printMode ? undefined : setRenderImage} />
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-[1600px] gap-6 p-6 lg:grid-cols-[400px_1fr] print:block print:p-0">
      {editorOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-cloud-50 p-4 print:hidden">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-sky-700">RAX PRO</p>
              <h2 className="font-display text-lg leading-tight">Обводка склада по драфту</h2>
            </div>
            <button onClick={() => setEditorOpen(false)}
              className="bg-ink px-4 py-2 text-sm text-white hover:bg-sky-700">
              Готово
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-auto">
            <PlanEditor value={planDraft} onChange={setPlanDraft} height={Math.max(420, (typeof window !== 'undefined' ? window.innerHeight : 900) - 260)} />
          </div>
        </div>
      )}
      {/* ——————————————————————— форма */}
      <div className="space-y-4 print:hidden lg:h-[calc(100vh-3rem)] lg:overflow-y-auto lg:pr-2">
        <header className="sticky top-0 z-20 -mx-1 bg-cloud-50/95 px-1 pb-3 pt-1 backdrop-blur">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-sky-700">RAX PRO</p>
              <h1 className="font-display text-lg leading-tight text-ink">Генератор КП</h1>
            </div>
            <button
              onClick={() => fetch('/api/kp/auth', { method: 'DELETE' }).then(() => location.reload())}
              className="text-[11px] text-slate-400 underline-offset-2 hover:underline">выйти</button>
          </div>
          <Verdict
            blockers={blockers}
            warnings={warnings}
            onPrint={() => window.print()}
            onPdf={downloadPdf}
            pdfBusy={pdfBusy}
          />
          {pdfError && (
            <p className="mt-2 border-l-2 border-red-500 pl-2 text-[11px] text-red-700">{pdfError}</p>
          )}
        </header>

        <Panel title="Пресеты из реальных КП">
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button key={p.id} onClick={() => applyPreset(p.id)}
                className="border border-neutral-300 bg-white px-2 py-1 text-[11px] hover:border-neutral-900">
                {p.label}
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="1 · Клиент и продукт">
          <Field label="Клиент">
            <input value={client} onChange={(e) => setClient(e.target.value)}
              placeholder="ООО «Название»" className="inp" />
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
            <p className="mb-1 block text-[10px] uppercase tracking-wide text-slate-400">Язык документа</p>
            <div className="flex gap-2">
              {['ru', 'uz'].map((l) => (
                <button key={l} onClick={() => setLang(l)}
                  className={`flex-1 border px-3 py-1.5 text-sm ${lang === l ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300 bg-white'}`}>
                  {l === 'ru' ? 'Русский' : 'Oʻzbekcha'}
                </button>
              ))}
            </div>
          </div>
          <p className="text-[11px] text-slate-500">{product.notesRu}</p>
        </Panel>

        {productKey.startsWith('pallet') && (
          <Panel title="2 · Помещение — раскладка считается сама">
            <div className="flex gap-2">
              {[
                ['rect', 'Прямоугольник'],
                ['draft', 'Обвести по драфту'],
              ].map(([id, label]) => (
                <button key={id} onClick={() => setRoomMode(id)}
                  className={`flex-1 border px-3 py-1.5 text-[12px] ${
                    roomMode === id ? 'border-ink bg-ink text-white' : 'border-cloud-300 bg-white hover:border-ink'
                  }`}>
                  {label}
                </button>
              ))}
            </div>

            {roomMode === 'draft' && (
              <>
                <button onClick={() => setEditorOpen(true)}
                  className="w-full bg-sky-700 px-4 py-2 text-sm text-white hover:bg-sky-800">
                  {planDraft?.geometry ? 'Открыть обводку' : 'Обвести склад по фото'}
                </button>
                {planDraft?.geometry ? (
                  <p className="border border-cloud-300 bg-white px-3 py-2 text-[11px]">
                    Контур: <b>{planDraft.geometry.polygon.length}</b> углов ·{' '}
                    <b>{(planDraft.geometry.width / 1000).toFixed(1)} × {(planDraft.geometry.depth / 1000).toFixed(1)} м</b> ·
                    колонн <b>{planDraft.geometry.columns.length}</b> · ворот <b>{planDraft.geometry.docks.length}</b>
                  </p>
                ) : (
                  <p className="border-l-2 border-amber-500 pl-2 text-[11px] text-amber-800">
                    Пока контур не обведён, раскладка считается по прямоугольнику ниже.
                  </p>
                )}
              </>
            )}

            <Row>
              {roomMode === 'rect' && (
                <NumField label="Ширина, мм" value={room.width} onChange={(v) => setRoom({ ...room, width: v })} />
              )}
              {roomMode === 'rect' && (
                <NumField label="Глубина, мм" value={room.depth} onChange={(v) => setRoom({ ...room, depth: v })} />
              )}
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
            <button onClick={calcLayout} className="w-full bg-sky-700 px-4 py-2 text-sm text-white hover:bg-sky-800">
              Рассчитать раскладку
            </button>
            {layoutError && <p className="border-l-2 border-red-500 pl-2 text-xs text-red-700">{layoutError}</p>}
            {layout && (
              <div className="border border-cloud-300 bg-white p-2">
                <LayoutPlan room={layout.room} layout={layout} compact />
                <p className="mt-1 text-[11px] text-slate-600">
                  {layout.rows} ряд(ов) · {layout.sections} секций · {layout.levels} яруса ·{' '}
                  рама {layout.frameHeight} мм · заполнение {(layout.fillRatio * 100).toFixed(0)} %
                </p>
                {layout.cappedByFrame && (
                  <p className="mt-1 border-l-2 border-amber-500 pl-2 text-[11px] text-amber-800">
                    Ярусы ограничены высотой рамы 6000 мм, а не потолком. Под такой потолок
                    имеет смысл считать мезонин — второй уровень хранения.
                  </p>
                )}
              </div>
            )}
          </Panel>
        )}

        <Panel title="3 · Геометрия">
          <Row>
            <NumField label="Рядов" value={geometry.rows}
              onChange={(v) => setGeometry({ ...geometry, rows: v })} />
            <NumField label="Секций всего" value={geometry.sections}
              onChange={(v) => setGeometry({ ...geometry, sections: v })} />
            <NumField label="Ярусов балок" value={geometry.levels}
              onChange={(v) => setGeometry({ ...geometry, levels: v })} />
          </Row>
          <Row>
            <Field label="Анкеров на раму">
              <select value={geometry.anchorsPerFrame} className="inp"
                onChange={(e) => setGeometry({ ...geometry, anchorsPerFrame: Number(e.target.value) })}>
                <option value={4}>4 — 2 на пятку</option>
                <option value={8}>8 — 4 на пятку</option>
              </select>
            </Field>
            {product.bom.includes('deck') && (
              <NumField label="Настилов на ярус" value={geometry.decksPerLevel}
                onChange={(v) => setGeometry({ ...geometry, decksPerLevel: v })} />
            )}
            {productKey.startsWith('pallet') && (
              <NumField label="Паллет на ярус" value={geometry.palletsPerLevel}
                onChange={(v) => setGeometry({ ...geometry, palletsPerLevel: v })} />
            )}
          </Row>
          {productKey.startsWith('pallet') && (
            <label className="flex items-center gap-2 text-xs text-neutral-700">
              <input type="checkbox" checked={geometry.countGroundLevel}
                onChange={(e) => setGeometry({ ...geometry, countGroundLevel: e.target.checked })} />
              Пол считается местом хранения
            </label>
          )}
          {positions != null && (
            <p className="border border-neutral-300 bg-white px-3 py-2 text-sm">
              Паллето-мест: <b>{positions}</b>
              {kp.price.perPalletPosition ? <> · {fmtSum(kp.price.perPalletPosition)} за место</> : null}
            </p>
          )}
        </Panel>

        {product.pricingModel === 'sectionList' ? (
          <Panel title="4 · Прайс за секцию">
            <Field label="Типоразмер из прайса">
              <select value={sizeCode} className="inp"
                onChange={(e) => {
                  const c = e.target.value;
                  setSizeCode(c);
                  const v = product.sizes.find((x) => x.code === c);
                  setFramePrice(v && product.framePrices ? product.framePrices[v.h] || 0 : 0);
                  if (v) setGeometry((g) => ({ ...g, levels: v.levels }));
                }}>
                {product.sizes.map((v) => (
                  <option key={v.code} value={v.code}>
                    {v.h}×{v.w}×{v.d}, {v.levels} полок — {v.price ? fmtSum(v.price) : 'цены нет'}
                  </option>
                ))}
              </select>
            </Field>
            <NumField label="Цена рамы, сум" value={framePrice} onChange={setFramePrice} />
            <p className="text-[11px] leading-snug text-slate-500">
              Сумма = секции × прайс − (секции − ряды) × цена рамы. Соседние секции делят раму,
              поэтому ряд дешевле, чем столько же отдельных стеллажей. Цена рамы выведена
              из прайса и проверена на КП BLOOMSHOP.
            </p>
          </Panel>
        ) : (
          <Panel title="4 · Цены за единицу, сум">
            <Row>
              {kp.spec.map((l) => (
                <NumField key={l.item} label={l.labelRu} value={unitPrices[l.item] ?? 0}
                  onChange={(v) => setUnitPrices({ ...unitPrices, [l.item]: v })} />
              ))}
            </Row>
          </Panel>
        )}

        <Panel title="5 · Скидка">
          <Row>
            <NumField label="Процент" value={discountPercent} onChange={setDiscountPercent} />
            <Field label="Причина">
              <select value={discountReason} className="inp"
                onChange={(e) => setDiscountReason(e.target.value)}>
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

        <Panel title="7 · Свои картинки — по желанию">
          <p className="text-[11px] leading-snug text-slate-600">
            Оба поля необязательные. План генератор рисует сам, как только нажат
            «Рассчитать раскладку». Загружайте сюда, только если есть свой чертёж
            или готовый рендер. Формат — JPG или PNG, годится обычный экспорт
            из 3ds Max или скриншот.
          </p>
          <Field label="Свой план склада (вид сверху)">
            <input type="file" accept="image/png,image/jpeg" className="text-xs"
              onChange={(e) => readFile(e.target.files?.[0], setPlanImage)} />
          </Field>
          {planImage && <p className="text-[11px] text-emerald-700">Загружен — заменит нарисованный план.</p>}
          <Field label="Рендер: как это будет выглядеть">
            <input type="file" accept="image/png,image/jpeg" className="text-xs"
              onChange={(e) => readFile(e.target.files?.[0], setRenderImage)} />
          </Field>
          {renderImage && <p className="text-[11px] text-emerald-700">Загружен — встанет на лист «Решение».</p>}
          {layout && (
            <p className="text-[11px] leading-snug text-slate-500">
              Фотореалистичный рендер собирает Blender: нажмите «сцена для Blender»
              ниже и прогоните <span className="font-mono">render_kp.sh</span> —
              получите три кадра, любой из них сюда.
            </p>
          )}
        </Panel>

        {benchmark && (
          <p className="border border-cloud-300 bg-white px-3 py-2 text-[11px] leading-snug text-slate-600">
            Эталон из фактического КП «{benchmark.label.split(' · ')[0]}»:{' '}
            <b className="text-ink">{fmtSum(benchmark.total)}</b>. Расчёт сейчас:{' '}
            <b className="text-ink">{fmtSum(kp.price.totalNoVat)}</b>{' '}
            <span className={Math.abs(kp.price.totalNoVat / benchmark.total - 1) > 0.05 ? 'text-red-600' : 'text-emerald-700'}>
              ({kp.price.totalNoVat >= benchmark.total ? '+' : '−'}
              {Math.abs((kp.price.totalNoVat / benchmark.total - 1) * 100).toFixed(1)} %)
            </span>
            . Расхождение больше 5 % означает, что цены пора обновить.
            {benchmark.note && <> Примечание: {benchmark.note}.</>}
          </p>
        )}

        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span className="font-mono text-sky-700">{kp.meta.number}</span>
          <span className="flex gap-3">
            {layout && (
              <button onClick={exportScene} className="underline-offset-2 hover:underline">
                сцена для Blender
              </button>
            )}
            <button onClick={exportJson} className="underline-offset-2 hover:underline">
              JSON в реестр
            </button>
          </span>
        </div>

        <div className="border border-cloud-300 bg-white p-3">
          <button
            onClick={makeShareLink}
            disabled={blockers.length > 0}
            className="w-full border border-ink px-3 py-2 text-[12px] text-ink transition hover:bg-cloud-100 disabled:opacity-40"
          >
            Ссылка для клиента
          </button>
          {shareUrl && (
            <>
              <p className="mt-2 break-all font-mono text-[10px] leading-snug text-slate-500">{shareUrl}</p>
              <p className="mt-1 text-[11px] text-slate-600">
                {shareCopied ? 'Скопирована в буфер. ' : ''}
                Открывается без пароля, живёт вечно и не зависит ни от какой базы:
                предложение целиком лежит в самой ссылке.
              </p>
            </>
          )}
        </div>

        <details className="border border-cloud-300 bg-white" open>
          <summary className="cursor-pointer px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
            Замечания приёмки · {kp.issues.length}
          </summary>
          <ul className="space-y-1.5 p-3 text-xs">
            {kp.issues.length === 0 && <li className="text-emerald-700">Замечаний нет.</li>}
            {blockers.map((i, n) => (
              <li key={'b' + n} className="border-l-2 border-red-500 pl-2 text-red-700">{i.message}</li>
            ))}
            {warnings.map((i, n) => (
              <li key={'w' + n} className="border-l-2 border-amber-500 pl-2 text-amber-800">{i.message}</li>
            ))}
          </ul>
        </details>
      </div>

      {/* ——————————————————————— документ */}
      <KpPreview kp={kp} planImage={planImage} renderImage={renderImage} layout={layout}
        onCaptureRender={printMode ? undefined : setRenderImage} />
    </div>
  );
}
