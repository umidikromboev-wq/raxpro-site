'use client';

import { useEffect, useMemo, useState } from 'react';
import { KON_COPY, TRUCK_LABELS } from './konCopy';
import { compute, DEFAULT_INPUT } from '@/lib/rack/konstruktor';
import { getProduct } from '@/lib/rack/catalog';
import { DesignError } from '@/lib/rack/layout';
import ResultPanel from './ResultPanel';
import { IcoArrow, IcoPallet, IcoLayers, IcoArchive, IcoShop } from '../Icons';
import LeadForm from '../LeadForm';

// Три шага, одно состояние. Расчёт идёт на каждое изменение — как в
// конфигураторах мебели, где цена меняется под пальцем, а не по кнопке.

const TYPE_ICONS = { pallet: IcoPallet, medium: IcoLayers, archive: IcoArchive, retail: IcoShop, unknown: null };
const M = 1000;
const LIMITS = {
  width: [6, 200], depth: [4, 200], ceiling: [2.5, 14], colStep: [3, 30],
  palletLoad: [100, 1000], palletHeight: [600, 2400],
  levels: [1, 4], sections: [1, 60], rows: [1, 20],
};
const GUIDE_KEY = 'raxpro-konstruktor-guide';

function clamp(v, [lo, hi]) { return Math.min(hi, Math.max(lo, v)); }

function initialFromQuery(search) {
  const type = search?.get('type');
  const ok = ['pallet', 'medium', 'archive', 'retail', 'unknown'];
  const base = { ...DEFAULT_INPUT, room: { ...DEFAULT_INPUT.room }, section: { ...DEFAULT_INPUT.section } };
  if (ok.includes(type)) base.type = type;
  if (base.type === 'medium') base.section.sizeCode = 'MD-2500-2000-600-5';
  if (base.type === 'archive') base.section.sizeCode = 'AR-2000-1000-400-5';
  if (base.type !== 'pallet') base.mode = 'section';
  return base;
}

export default function Konstruktor({ lang = 'ru' }) {
  const c = KON_COPY[lang] || KON_COPY.ru;
  const [input, setInput] = useState(() => initialFromQuery(null));
  const [step, setStep] = useState(1);
  const [guide, setGuide] = useState(false);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get('type')) { setInput(initialFromQuery(q)); if (q.get('type') === 'pallet' || q.get('type') === 'medium' || q.get('type') === 'archive') setStep(2); }
    try { if (!localStorage.getItem(GUIDE_KEY)) setGuide(true); } catch { /* приватный режим */ }
  }, []);

  const closeGuide = () => { setGuide(false); try { localStorage.setItem(GUIDE_KEY, '1'); } catch { /* ок */ } };

  const setRoom = (k, v) => setInput((s) => ({ ...s, room: { ...s.room, [k]: v } }));
  const setSection = (k, v) => setInput((s) => ({ ...s, section: { ...s.section, [k]: v } }));
  const setType = (type) => setInput((s) => ({
    ...s, type,
    mode: type === 'pallet' ? s.mode : 'section',
    section: {
      ...s.section,
      sizeCode: type === 'medium' ? 'MD-2500-2000-600-5' : type === 'archive' ? 'AR-2000-1000-400-5' : s.section.sizeCode,
    },
  }));

  const calc = useMemo(() => {
    if (input.type === 'retail' || input.type === 'unknown') return { result: null, error: null };
    try { return { result: compute(input), error: null }; }
    catch (e) { return { result: null, error: e instanceof DesignError ? e.message : (e?.message || String(e)) }; }
  }, [input]);

  const needsEngineer = input.type === 'retail' || input.type === 'unknown';
  const product = needsEngineer ? null : getProduct(input.type === 'pallet' ? 'pallet-frontal' : input.type === 'medium' ? 'medium-duty' : 'archive');

  return (
    <div className="kon" data-step={step}>
      {guide && (
        <div className="kon-guide" role="dialog" aria-labelledby="kon-guide-title">
          <div className="kon-guide__box">
            <p className="kon-kicker">{c.eyebrow}</p>
            <h2 id="kon-guide-title">{c.guide.t}</h2>
            <ol>{c.guide.items.map((s) => <li key={s}>{s}</li>)}</ol>
            <button type="button" className="kon-btn kon-btn--solid" onClick={closeGuide} autoFocus>{c.guide.skip}</button>
          </div>
        </div>
      )}

      <ol className="kon-steps" aria-label={c.title}>
        {c.steps.map((s, i) => (
          <li key={s} data-active={step === i + 1} data-done={step > i + 1}>
            <button type="button" onClick={() => (i + 1 < step || (i + 1 === 2) || (i + 1 === 3 && !needsEngineer && calc.result)) && setStep(i + 1)}>
              <span>0{i + 1}</span>{s}
            </button>
          </li>
        ))}
      </ol>

      {step === 1 && (
        <section className="kon-panel" aria-labelledby="kon-s1">
          <h2 id="kon-s1" className="kon-h">{c.steps[0]}</h2>
          <div className="kon-types">
            {c.types.map((t) => {
              const Ico = TYPE_ICONS[t.key];
              return (
                <button type="button" key={t.key} className="kon-type" data-on={input.type === t.key} onClick={() => setType(t.key)}>
                  <span className="kon-type__ico">{Ico ? <Ico className="w-6 h-6" /> : <span aria-hidden="true">?</span>}</span>
                  <b>{t.t}</b>
                  <small>{t.d}</small>
                </button>
              );
            })}
          </div>
          <div className="kon-nav">
            <button type="button" className="kon-btn kon-btn--solid" onClick={() => setStep(2)}>{c.next} <IcoArrow className="w-4 h-4" /></button>
          </div>
        </section>
      )}

      {step === 2 && needsEngineer && (
        <section className="kon-panel" aria-labelledby="kon-eng">
          <h2 id="kon-eng" className="kon-h">{c.engineer.t}</h2>
          <p className="kon-p">{c.engineer.d}</p>
          <div className="kon-lead">
            <LeadForm lang={lang} withPhoto initialProduct={c.types.find((t) => t.key === input.type)?.t} submitLabel={c.engineer.cta} />
          </div>
          <div className="kon-nav"><button type="button" className="kon-btn" onClick={() => setStep(1)}>← {c.back}</button></div>
        </section>
      )}

      {step === 2 && !needsEngineer && (
        <section className="kon-panel" aria-labelledby="kon-s2">
          <h2 id="kon-s2" className="kon-h">{c.steps[1]}</h2>
          {input.type === 'pallet' && (
            <div className="kon-modes" role="radiogroup">
              {c.modes.map((m) => (
                <button type="button" role="radio" aria-checked={input.mode === m.key} key={m.key} className="kon-mode" data-on={input.mode === m.key} onClick={() => setInput((s) => ({ ...s, mode: m.key }))}>
                  <b>{m.t}</b><small>{m.d}</small>
                </button>
              ))}
            </div>
          )}

          {input.type === 'pallet' && input.mode === 'room' && (
            <div className="kon-form">
              <Num label={c.room.width} value={input.room.width / M} step={0.5} lim={LIMITS.width} onChange={(v) => setRoom('width', v * M)} />
              <Num label={c.room.depth} value={input.room.depth / M} step={0.5} lim={LIMITS.depth} onChange={(v) => setRoom('depth', v * M)} />
              <Num label={c.room.ceiling} value={input.room.ceiling / M} step={0.1} lim={LIMITS.ceiling} onChange={(v) => setRoom('ceiling', v * M)} />
              <label className="kon-check"><input type="checkbox" checked={input.room.hasColumns} onChange={(e) => setRoom('hasColumns', e.target.checked)} /> {c.room.columns}</label>
              {input.room.hasColumns && (
                <>
                  <Num label={c.room.colStepX} value={input.room.colStepX / M} step={0.5} lim={LIMITS.colStep} onChange={(v) => setRoom('colStepX', v * M)} />
                  <Num label={c.room.colStepY} value={input.room.colStepY / M} step={0.5} lim={LIMITS.colStep} onChange={(v) => setRoom('colStepY', v * M)} />
                </>
              )}
              <label className="kon-check"><input type="checkbox" checked={input.room.hasDock} onChange={(e) => setRoom('hasDock', e.target.checked)} /> {c.room.dock}</label>
              <label className="kon-field">
                <span>{c.room.truck}</span>
                <select value={input.room.truck} onChange={(e) => setRoom('truck', e.target.value)}>
                  {Object.entries(TRUCK_LABELS[lang] || TRUCK_LABELS.ru).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <small>{c.room.truckHint}</small>
              </label>
              <Num label={c.room.palletLoad} value={input.room.palletLoad} step={50} lim={LIMITS.palletLoad} onChange={(v) => setRoom('palletLoad', v)} />
              <Num label={c.room.palletHeight} value={input.room.palletHeight} step={50} lim={LIMITS.palletHeight} onChange={(v) => setRoom('palletHeight', v)} />
            </div>
          )}

          {(input.type !== 'pallet' || input.mode === 'section') && (
            <div className="kon-form">
              {input.type === 'pallet' ? (
                <>
                  <Num label={c.section.levels} value={input.section.levels} step={1} lim={LIMITS.levels} onChange={(v) => setSection('levels', v)} />
                  <label className="kon-field">
                    <span>{c.section.beam}</span>
                    <select value={input.section.beam} onChange={(e) => setSection('beam', Number(e.target.value))}>
                      {Object.entries(c.section.beams).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </label>
                </>
              ) : (
                <label className="kon-field kon-field--wide">
                  <span>{c.section.size}</span>
                  <select value={input.section.sizeCode} onChange={(e) => setSection('sizeCode', e.target.value)}>
                    {product.sizes.filter((s) => s.price).map((s) => (
                      <option key={s.code} value={s.code}>{`${s.h / M} × ${s.w / M} × ${s.d / M} м · ${s.levels} ${lang === 'uz' ? 'yarus' : 'ярусов'}`}</option>
                    ))}
                  </select>
                </label>
              )}
              <Num label={c.section.sections} value={input.section.sections} step={1} lim={LIMITS.sections} onChange={(v) => setSection('sections', v)} />
              <Num label={c.section.rows} value={input.section.rows} step={1} lim={LIMITS.rows} onChange={(v) => setSection('rows', v)} />
            </div>
          )}

          {calc.error && <p className="kon-err" role="alert">{c.result.err}{calc.error}</p>}
          {calc.result && <MiniTotal r={calc.result} c={c} lang={lang} />}

          <div className="kon-nav">
            <button type="button" className="kon-btn" onClick={() => setStep(1)}>← {c.back}</button>
            <button type="button" className="kon-btn kon-btn--solid" disabled={!calc.result} onClick={() => setStep(3)}>{c.next} <IcoArrow className="w-4 h-4" /></button>
          </div>
        </section>
      )}

      {step === 3 && calc.result && (
        <ResultPanel lang={lang} input={input} result={calc.result} onBack={() => setStep(2)} />
      )}
    </div>
  );
}

function Num({ label, value, step, lim, onChange }) {
  const [raw, setRaw] = useState(String(value));
  useEffect(() => { setRaw(String(value)); }, [value]);
  const commit = () => {
    const n = Number(String(raw).replace(',', '.'));
    if (!Number.isFinite(n)) { setRaw(String(value)); return; }
    const v = clamp(n, lim);
    setRaw(String(v)); onChange(v);
  };
  return (
    <label className="kon-field">
      <span>{label}</span>
      <span className="kon-num">
        <button type="button" aria-label="−" onClick={() => onChange(clamp(+(value - step).toFixed(2), lim))}>−</button>
        <input inputMode="decimal" value={raw} onChange={(e) => setRaw(e.target.value)} onBlur={commit} onKeyDown={(e) => e.key === 'Enter' && commit()} />
        <button type="button" aria-label="+" onClick={() => onChange(clamp(+(value + step).toFixed(2), lim))}>+</button>
      </span>
    </label>
  );
}

function MiniTotal({ r, c, lang }) {
  const fmt = (n) => Math.round(n).toLocaleString('ru-RU');
  return (
    <dl className="kon-mini">
      {r.positions != null && <div><dd>{r.positions}</dd><dt>{c.result.positions}</dt></div>}
      <div><dd>{r.geometry.sections}</dd><dt>{c.result.sections}</dt></div>
      <div><dd>{r.geometry.levels}</dd><dt>{c.result.levels}</dt></div>
      {r.price && <div><dd>{fmt(r.price.totalNoVat)}</dd><dt>{lang === 'uz' ? 'soʻm, QQSsiz' : 'сум, без НДС'}</dt></div>}
    </dl>
  );
}
