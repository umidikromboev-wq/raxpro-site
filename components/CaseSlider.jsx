'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { IcoArrow, IcoQuote } from './Icons';
import { SEGMENTS } from '../lib/cases';

// Кейсы как истории клиентов (разбор 22.09): чипсы-фильтры по типу бизнеса,
// один кейс крупно (фото · задача → решение → цифры → цитата → «Хочу так же»),
// под ним — превью остальных, чтобы было видно, что кейсов много.
// Данные приходят из lib/cases.js уже локализованными; здесь только показ.

const UI = {
  ru: {
    kicker: 'Кейс', all: 'Все', prev: 'Предыдущий кейс', next: 'Следующий кейс', cta: 'Хочу так же',
    photos: 'Фото объекта', task: 'Задача', solution: 'Решение', more: 'Другие кейсы',
    seg: { warehouse: 'Склад', shop: 'Магазин', marketplace: 'Маркетплейс', production: 'Производство' },
  },
  uz: {
    kicker: 'Keys', all: 'Barchasi', prev: 'Oldingi keys', next: 'Keyingi keys', cta: 'Menga ham shunday',
    photos: 'Obyekt suratlari', task: 'Vazifa', solution: 'Yechim', more: 'Boshqa keyslar',
    seg: { warehouse: 'Ombor', shop: 'Doʻkon', marketplace: 'Marketpleys', production: 'Ishlab chiqarish' },
  },
};

const SWIPE_PX = 48;

export default function CaseSlider({ items, lang = 'ru' }) {
  const u = UI[lang] || UI.ru;
  const [seg, setSeg] = useState('all');
  const [key, setKey] = useState(items[0]?.key);
  const [shot, setShot] = useState(0);
  const touchX = useRef(null);
  const rootRef = useRef(null);

  const list = useMemo(() => (seg === 'all' ? items : items.filter((c) => c.segment === seg)), [items, seg]);
  const n = list.length;
  const i = Math.max(0, list.findIndex((c) => c.key === key));
  const c = list[i] || list[0];
  const photos = [c.img, ...(c.gallery || [])];

  const pick = (k) => { setKey(k); setShot(0); };
  const go = (d) => pick(list[(i + d + n) % n].key);
  const choose = (s) => { setSeg(s); const first = (s === 'all' ? items : items.filter((x) => x.segment === s))[0]; if (first) pick(first.key); };

  // Стрелки клавиатуры, когда фокус внутри блока
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    };
    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  });

  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > SWIPE_PX) go(dx < 0 ? 1 : -1);
  };

  const num = (v) => String(v).padStart(2, '0');
  const chip = (active) => `shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${active ? 'bg-navy-900 text-white' : 'bg-white border border-cloud-200 text-navy-800 hover:border-sky-300'}`;

  return (
    <div className="case-block">
      {/* Чипсы: тип бизнеса клиента — как сегменты на первом экране */}
      <div className="flex gap-2 overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0 pb-1 scrollbar-none" role="tablist" aria-label={u.more}>
        <button type="button" role="tab" aria-selected={seg === 'all'} onClick={() => choose('all')} className={chip(seg === 'all')}>{u.all} · {items.length}</button>
        {SEGMENTS.map((s) => {
          const cnt = items.filter((x) => x.segment === s).length;
          return cnt > 0 && (
            <button key={s} type="button" role="tab" aria-selected={seg === s} onClick={() => choose(s)} className={chip(seg === s)}>{u.seg[s]} · {cnt}</button>
          );
        })}
      </div>

      <div
        ref={rootRef}
        tabIndex={0}
        className="case-slider group/case relative mt-5 rounded-xl2 border border-cloud-200 bg-white overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        aria-roledescription="carousel"
      >
        <div className="grid lg:grid-cols-[minmax(0,0.9fr),minmax(0,1.1fr)]">
          {/* Фото */}
          <div className="relative bg-cloud-100 aspect-[4/3] lg:aspect-auto lg:min-h-[560px]">
            <img
              key={`${c.key}-${shot}`}
              src={photos[shot]}
              alt={`${c.client} — ${c.title}`}
              width={1050}
              height={1400}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover animate-fadeup"
            />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-navy-900/60 to-transparent pointer-events-none" />
            {photos.length > 1 && (
              <div className="absolute left-4 bottom-4 flex gap-2" aria-label={u.photos}>
                {photos.map((src, k) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setShot(k)}
                    aria-label={`${u.photos} ${k + 1}`}
                    aria-pressed={k === shot}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition ${k === shot ? 'border-white' : 'border-white/30 opacity-75 hover:opacity-100'}`}
                  >
                    <img src={src} alt="" width={112} height={112} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div className="absolute top-4 left-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90 bg-navy-900/55 backdrop-blur rounded-full px-3 py-1.5">
              {num(i + 1)} / {num(n)} · {u.seg[c.segment]}
            </div>
          </div>

          {/* История клиента */}
          <div key={c.key} className="flex flex-col p-6 sm:p-8 lg:p-10 animate-fadeup">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                [ {num(i + 1)} / {u.kicker} ] · <span className="text-navy-800">{c.client}</span>
              </span>
              {c.logo && (
                <img src={c.logo} alt={c.client} width={120} height={40} loading="lazy" decoding="async" className="h-8 w-auto max-w-[140px] object-contain" />
              )}
            </div>

            <h3 className="font-display font-medium text-2xl sm:text-3xl lg:text-[34px] leading-[1.1] tracking-tight text-navy-900 mt-5 text-balance">
              {c.title}
            </h3>

            <dl className="mt-6 space-y-3 text-[15px] leading-relaxed">
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
                <dt className="sm:w-[84px] shrink-0 font-bold text-navy-900">{u.task}:</dt>
                <dd className="text-slate-600">{c.task}</dd>
              </div>
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-3">
                <dt className="sm:w-[84px] shrink-0 font-bold text-navy-900">{u.solution}:</dt>
                <dd className="text-slate-600">{c.solution}</dd>
              </div>
            </dl>

            {/* Цифры в ряд — как в bento, только на реальном объекте */}
            <div className={`mt-7 grid gap-3 ${c.stats.length >= 4 ? 'grid-cols-2 sm:grid-cols-4' : c.stats.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
              {c.stats.map(([v, l]) => (
                <div key={l} className="rounded-xl bg-cloud-50 border border-cloud-200 px-3 sm:px-4 py-3.5">
                  <div className="font-display font-medium text-2xl sm:text-[28px] leading-none text-navy-900 tracking-tight whitespace-nowrap">{v}</div>
                  <div className="mt-1.5 text-xs text-slate-500 leading-snug">{l}</div>
                </div>
              ))}
            </div>

            {c.quote && (
              <blockquote className="mt-6 flex gap-3">
                <IcoQuote className="w-7 h-7 text-sky-500/40 shrink-0" />
                <div>
                  <p className="text-navy-800 leading-snug">«{c.quote.text}»</p>
                  <footer className="mt-1.5 text-sm text-slate-500">— {c.quote.who}</footer>
                </div>
              </blockquote>
            )}

            <div className="mt-auto pt-8 flex items-center justify-between gap-4">
              <div className="flex gap-2">
                <button type="button" onClick={() => go(-1)} aria-label={u.prev} className="w-12 h-12 grid place-items-center rounded-full border border-navy-800/25 text-navy-900 hover:bg-navy-900 hover:text-white transition">
                  <IcoArrow className="w-5 h-5 rotate-180" />
                </button>
                <button type="button" onClick={() => go(1)} aria-label={u.next} className="w-12 h-12 grid place-items-center rounded-full border border-navy-800/25 text-navy-900 hover:bg-navy-900 hover:text-white transition">
                  <IcoArrow className="w-5 h-5" />
                </button>
              </div>
              <a href="#zayavka" className="inline-flex items-center gap-2 text-sm font-bold text-navy-900 border-b-2 border-sky-500 pb-0.5 hover:text-sky-600 transition">
                {u.cta} <IcoArrow className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Превью остальных кейсов: видно, что их много, и можно перейти сразу в нужный */}
      {n > 1 && (
        <div className="mt-5 flex gap-3 overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0 pb-2 snap-x scrollbar-none" aria-label={u.more}>
          {list.map((x, k) => (
            <button
              key={x.key}
              type="button"
              onClick={() => pick(x.key)}
              aria-pressed={x.key === c.key}
              className={`snap-start shrink-0 w-[150px] sm:w-[170px] text-left rounded-xl overflow-hidden border transition ${x.key === c.key ? 'border-navy-900 ring-2 ring-navy-900/10' : 'border-cloud-200 hover:border-sky-300'}`}
            >
              <div className="relative aspect-[4/3] bg-cloud-100">
                <img src={x.img} alt="" width={340} height={255} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
                <span className="absolute top-2 left-2 text-[10px] font-semibold text-white bg-navy-900/60 rounded-full px-2 py-0.5">{num(k + 1)}</span>
              </div>
              <div className="px-3 py-2.5">
                <div className="text-xs font-bold text-navy-900 truncate">{x.client}</div>
                <div className="text-[11px] text-slate-500 truncate">{u.seg[x.segment]}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
