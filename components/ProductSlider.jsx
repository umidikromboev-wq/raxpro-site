'use client';
import { useRef, useState } from 'react';
import { IcoArrow } from './Icons';

export default function ProductSlider({ items }) {
  const ref = useRef(null);
  const [idx, setIdx] = useState(0);

  function scrollTo(dir) {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector('[data-card]');
    const step = card ? card.offsetWidth + 20 : 340;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  }

  function onScroll() {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector('[data-card]');
    const step = card ? card.offsetWidth + 20 : 340;
    setIdx(Math.round(el.scrollLeft / step));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="text-sm font-semibold text-slate-500">
          <span className="text-navy-800">{String(Math.min(idx + 1, items.length)).padStart(2, '0')}</span>
          {' / '}{String(items.length).padStart(2, '0')}
        </div>
        <div className="flex gap-2">
          <button onClick={() => scrollTo(-1)} aria-label="Назад" className="w-11 h-11 grid place-items-center rounded-full border border-cloud-200 text-navy-700 hover:bg-navy-700 hover:text-white hover:border-navy-700 transition">
            <IcoArrow className="w-5 h-5 rotate-180" />
          </button>
          <button onClick={() => scrollTo(1)} aria-label="Вперёд" className="w-11 h-11 grid place-items-center rounded-full border border-cloud-200 text-navy-700 hover:bg-navy-700 hover:text-white hover:border-navy-700 transition">
            <IcoArrow className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div ref={ref} onScroll={onScroll} className="flex gap-5 overflow-x-auto snap-x-mandatory no-scrollbar pb-2">
        {items.map((p) => (
          <article
            key={p.t}
            data-card
            className="snap-start shrink-0 w-[280px] sm:w-[320px] rounded-xl2 overflow-hidden bg-white border border-cloud-200 shadow-card hover:shadow-card-hover transition group"
          >
            <div className="aspect-[4/3] overflow-hidden bg-cloud-100">
              <img src={p.img} alt={p.t} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg text-navy-800">{p.t}</h3>
              <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">{p.d}</p>
              <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 bg-sky-600/10 rounded-full px-3 py-1">
                {p.load}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
