'use client';

import { useEffect, useMemo, useState } from 'react';
import { PRODUCTS, getProduct } from '@/lib/rack/catalog';
import { buildKp, fmtSum } from '@/lib/rack/kp';
import { palletPositions } from '@/lib/rack/spec';
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
    try {
      const raw = localStorage.getItem('raxpro-kp-draft');
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
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem('raxpro-kp-draft', JSON.stringify(draft)); } catch {}
  }, [client, productKey, lang, geometry, unitPrices, discountPercent, discountReason,
      discountNote, paymentKey, deliveryHours, extraNote]);

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
        extraNote,
      }),
    [client, productKey, lang, geometry, unitPrices, discountPercent, discountReason,
     discountNote, paymentKey, deliveryHours, extraNote, planImage, renderImage,
     sizeCode, framePrice, product]
  );

  const blockers = kp.issues.filter((i) => i.severity === 'block');
  const warnings = kp.issues.filter((i) => i.severity === 'warn');
  const positions = geometry.palletsPerLevel ? palletPositions(geometry) : null;

  function readFile(file, set) {
    if (!file) return set(null);
    const fr = new FileReader();
    fr.onload = () => set(fr.result);
    fr.readAsDataURL(file);
  }

  return (
    <div className="mx-auto grid max-w-[1600px] gap-6 p-6 lg:grid-cols-[400px_1fr] print:block print:p-0">
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
          <Verdict blockers={blockers} warnings={warnings} onPrint={() => window.print()} />
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
          <Field label="Язык документа">
            <div className="flex gap-2">
              {['ru', 'uz'].map((l) => (
                <button key={l} onClick={() => setLang(l)}
                  className={`flex-1 border px-3 py-1.5 text-sm ${lang === l ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300 bg-white'}`}>
                  {l === 'ru' ? 'Русский' : 'Oʻzbekcha'}
                </button>
              ))}
            </div>
          </Field>
          <p className="text-[11px] text-neutral-500">{product.notesRu}</p>
        </Panel>

        <Panel title="2 · Геометрия">
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
          <Panel title="3 · Прайс за секцию">
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
          <Panel title="3 · Цены за единицу, сум">
            <Row>
              {kp.spec.map((l) => (
                <NumField key={l.item} label={l.labelRu} value={unitPrices[l.item] ?? 0}
                  onChange={(v) => setUnitPrices({ ...unitPrices, [l.item]: v })} />
              ))}
            </Row>
          </Panel>
        )}

        <Panel title="4 · Скидка">
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

        <Panel title="5 · Условия">
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

        <Panel title="6 · План и рендер">
          <Field label="План объекта">
            <input type="file" accept="image/*" className="text-xs"
              onChange={(e) => readFile(e.target.files?.[0], setPlanImage)} />
          </Field>
          <Field label="Рендер расстановки">
            <input type="file" accept="image/*" className="text-xs"
              onChange={(e) => readFile(e.target.files?.[0], setRenderImage)} />
          </Field>
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
          <button onClick={exportJson} className="underline-offset-2 hover:underline">
            выгрузить JSON в реестр
          </button>
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
      <KpPreview kp={kp} planImage={planImage} renderImage={renderImage} />
    </div>
  );
}
