'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { KON_COPY, TRUCK_LABELS } from './konCopy';
import { shareStateFrom } from '@/lib/rack/konstruktor';
import { encodeShare } from '@/lib/rack/share';
import { specLabel, specUnit } from '@/lib/rack/spec';
import RackScene from '@/app/kp/RackScene';
import LayoutPlan from '@/app/kp/LayoutPlan';
import LeadForm from '../LeadForm';
import { IcoArrow } from '../Icons';

// Экран результата: один экран — 3D и план сверху, цифры и спецификация под
// ними, липкий итог внизу на телефоне. Всё, что здесь показано, пришло из
// lib/rack; панель ничего не считает сама.

const M = 1000;

export default function ResultPanel({ lang, input, result, onBack }) {
  const c = (KON_COPY[lang] || KON_COPY.ru).result;
  const r = result;
  const fmt = (n) => Math.round(n).toLocaleString('ru-RU');
  const sum = (n) => `${fmt(n)} ${lang === 'uz' ? 'soʻm' : 'сум'}`;
  const [link, setLink] = useState('');
  const [copied, setCopied] = useState(false);
  const leadRef = useRef(null);

  useEffect(() => {
    let alive = true;
    encodeShare(shareStateFrom(input, r, lang))
      .then((code) => { if (alive) setLink(`${location.origin}/tp#${code}`); })
      .catch(() => { if (alive) setLink(''); });
    return () => { alive = false; };
  }, [input, r, lang]);

  const summary = useMemo(() => configSummary(input, r, lang), [input, r, lang]);

  const copy = async () => {
    if (!link) return;
    try { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { window.prompt(c.share, link); }
  };
  const toLead = () => leadRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const isPallet = r.product.key.startsWith('pallet');
  const facts = [
    r.positions != null && { n: r.positions, l: c.positions },
    { n: r.geometry.sections, l: c.sections },
    { n: r.geometry.rows, l: c.rows },
    { n: r.geometry.levels, l: c.levels },
    { n: `${r.frameHeight / M} м`, l: c.frame },
    r.rackAreaM2 != null && { n: fmt(r.rackAreaM2), l: c.rackArea },
    r.areaM2 != null && { n: fmt(r.areaM2), l: c.area },
    r.layout && r.areaM2 != null && { n: `${Math.round(r.layout.fillRatio * 100)} %`, l: c.fill },
  ].filter(Boolean);

  return (
    <section className="kon-result" aria-labelledby="kon-s3">
      <div className="kon-result__head">
        <button type="button" className="kon-btn" onClick={onBack}>← {KON_COPY[lang]?.back || 'Назад'}</button>
        <h2 id="kon-s3" className="kon-h">{r.product[lang === 'uz' ? 'uz' : 'ru'].name}</h2>
      </div>

      <div className="kon-visual">
        <figure className="kon-scene">
          <RackScene room={r.room} layout={r.layout} height={420} lang={lang} figure />
          <figcaption>{c.scene} · {c.sceneHint}</figcaption>
        </figure>
        <figure className="kon-plan">
          <LayoutPlan room={r.room} layout={r.layout} lang={lang} compact />
          <figcaption>{c.plan}</figcaption>
        </figure>
      </div>

      <dl className="kon-facts">
        {facts.map((f) => <div key={f.l}><dd>{f.n}</dd><dt>{f.l}</dt></div>)}
      </dl>
      {isPallet && <p className="kon-note">{c.floorNote}</p>}

      <div className="kon-price">
        {r.price ? (
          <>
            <div className="kon-price__main">
              <span className="kon-kicker">{c.price}</span>
              <strong>{sum(r.price.totalNoVat)}</strong>
              <small>{c.noVat} · {c.withVat}: {sum(r.price.totalWithVat)}</small>
            </div>
            {r.price.perPalletPosition != null && (
              <div className="kon-price__per">
                <strong>{sum(r.price.perPalletPosition)}</strong>
                <small>{c.perPosition}</small>
              </div>
            )}
          </>
        ) : (
          <p className="kon-p">{c.byEngineer}</p>
        )}
        <p className="kon-note">{c.note}</p>
      </div>

      <div className="kon-spec">
        <h3 className="kon-h3">{c.spec}</h3>
        <table>
          <thead><tr><th>#</th><th>{lang === 'uz' ? 'Nomi' : 'Наименование'}</th><th>{c.qty}</th><th>{c.unit}</th></tr></thead>
          <tbody>
            {r.spec.map((l, i) => (
              <tr key={l.item}><td>{i + 1}</td><td>{specLabel(l, lang)}</td><td>{l.qty}</td><td>{specUnit(l, lang)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="kon-actions">
        <a className="kon-btn" href={link || '#'} target="_blank" rel="noopener noreferrer" aria-disabled={!link}>{c.pdf}</a>
        <button type="button" className="kon-btn" onClick={copy} disabled={!link}>{copied ? c.copied : c.share}</button>
        <button type="button" className="kon-btn kon-btn--solid" onClick={toLead}>{c.call} <IcoArrow className="w-4 h-4" /></button>
      </div>

      <div className="kon-lead" ref={leadRef} id="zamer">
        <div className="kon-lead__text">
          <span className="kon-kicker">{c.callHint}</span>
          <h3 className="kon-h">{c.leadTitle}</h3>
          <p className="kon-p">{c.leadText}</p>
          <pre className="kon-summary">{summary}</pre>
        </div>
        <LeadForm lang={lang} withPhoto initialProduct={r.product[lang === 'uz' ? 'uz' : 'ru'].short} context={summary + (link ? `\n${link}` : '')} submitLabel={c.call} />
      </div>

      <div className="kon-sticky" aria-hidden="true">
        <div>
          {r.positions != null && <><strong>{r.positions}</strong> {c.positions} · </>}
          {r.price && <><strong>{fmt(r.price.totalNoVat)}</strong> {lang === 'uz' ? 'soʻm' : 'сум'}</>}
        </div>
        <button type="button" className="kon-btn kon-btn--solid" onClick={toLead}>{c.sticky.cta}</button>
      </div>
    </section>
  );
}

/** Конфигурация текстом — уходит менеджеру в заявке, чтобы он видел
 *  готовую спецификацию, а не «хочу стеллажи». */
function configSummary(input, r, lang) {
  const uz = lang === 'uz';
  const lines = [];
  lines.push(`${uz ? 'Konstruktor' : 'Конструктор'}: ${r.product[uz ? 'uz' : 'ru'].name}`);
  if (input.mode === 'room' && r.room) {
    const rm = input.room;
    lines.push(`${uz ? 'Xona' : 'Помещение'}: ${rm.width / M} × ${rm.depth / M} × ${rm.ceiling / M} м` +
      (rm.hasColumns ? `, ${uz ? 'ustunlar' : 'колонны'} ${rm.colStepX / M}×${rm.colStepY / M} м` : '') +
      (rm.hasDock ? `, ${uz ? 'darvoza' : 'ворота'}` : ''));
    lines.push(`${uz ? 'Texnika' : 'Техника'}: ${(TRUCK_LABELS[lang] || TRUCK_LABELS.ru)[rm.truck]}, ${uz ? 'pallet' : 'паллета'} ${rm.palletLoad} кг / ${rm.palletHeight} мм`);
  }
  lines.push(`${uz ? 'Seksiya' : 'Секция'}: ${r.size.h}×${r.size.w}×${r.size.d} мм, ${r.geometry.levels} ${uz ? 'yarus' : 'ярусов'}`);
  lines.push(`${uz ? 'Qatorlar' : 'Ряды'}: ${r.geometry.rows}, ${uz ? 'seksiyalar' : 'секций'}: ${r.geometry.sections}` +
    (r.positions != null ? `, ${uz ? 'pallet oʻrni' : 'паллетомест'}: ${r.positions}` : ''));
  if (r.price) lines.push(`${uz ? 'Hisobiy narx' : 'Расчётная цена'}: ${Math.round(r.price.totalNoVat).toLocaleString('ru-RU')} ${uz ? 'soʻm QQSsiz' : 'сум без НДС'}`);
  return lines.join('\n');
}
