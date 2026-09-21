'use client';
import { useEffect, useRef, useState } from 'react';
import { IcoArrow } from './Icons';

// Кейсы: фото слева, карточка деталей справа, стрелки — к следующему.
// Данные приходят из lib/cases.js уже локализованными; здесь только показ.

const UI = {
  ru: { kicker: 'Кейс', prev: 'Предыдущий кейс', next: 'Следующий кейс', cta: 'Хочу так же', photos: 'Фото объекта' },
  uz: { kicker: 'Keys', prev: 'Oldingi keys', next: 'Keyingi keys', cta: 'Menga ham shunday', photos: 'Obyekt suratlari' },
};

const SWIPE_PX = 48;

export default function CaseSlider({ items, lang = 'ru' }) {
  const u = UI[lang] || UI.ru;
  const [i, setI] = useState(0);
  const [shot, setShot] = useState(0);
  const n = items.length;
  const c = items[i];
  const photos = [c.img, ...(c.gallery || [])];
  const touchX = useRef(null);

  const go = (d) => { setI((v) => (v + d + n) % n); setShot(0); };

  // Стрелки клавиатуры, когда фокус внутри блока
  const rootRef = useRef(null);
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    };
    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  }, [n]);

  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > SWIPE_PX) go(dx < 0 ? 1 : -1);
  };

  const num = (v) => String(v).padStart(2, '0');

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      className="case-slider group/case relative rounded-xl2 border border-cloud-200 bg-white overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
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
          {/* Миниатюры галереи проекта */}
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
            {num(i + 1)} / {num(n)}
          </div>
        </div>

        {/* Карточка деталей */}
        <div key={c.key} className="flex flex-col p-6 sm:p-8 lg:p-10 animate-fadeup">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              [ {num(i + 1)} / {u.kicker} ]
            </span>
            {c.logo ? (
              <img src={c.logo} alt={c.client} width={120} height={40} loading="lazy" decoding="async" className="h-8 w-auto max-w-[140px] object-contain" />
            ) : (
              <span className="text-sm font-bold text-navy-800 text-right">{c.client}</span>
            )}
          </div>

          <h3 className="font-display font-medium text-2xl sm:text-3xl lg:text-[34px] leading-[1.1] tracking-tight text-navy-900 mt-6 text-balance">
            {c.title}
          </h3>

          <div className="mt-6 flex items-start gap-3">
            <span className="w-2 h-2 mt-2 shrink-0 bg-sky-500" aria-hidden="true" />
            <p className="text-navy-800 text-lg leading-snug max-w-md">{c.lead}</p>
          </div>

          <dl className="mt-7 divide-y divide-cloud-200 border-t border-cloud-200">
            {c.rows.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[120px,1fr] sm:grid-cols-[150px,1fr] gap-4 py-3.5">
                <dt className="text-sm text-slate-500">{k}:</dt>
                <dd className="text-sm sm:text-[15px] text-navy-900 leading-relaxed">{v}</dd>
              </div>
            ))}
          </dl>

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
  );
}
