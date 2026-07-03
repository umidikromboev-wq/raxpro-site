'use client';
import { useState } from 'react';
import { IcoArrow } from './Icons';

export default function ProductSlider({ items }) {
  const [i, setI] = useState(0);
  const n = items.length;
  const p = items[i];
  const go = (d) => setI((v) => (v + d + n) % n);

  return (
    <div className="relative rounded-xl2 bg-navy-900 text-white overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-20" />
      <div className="relative grid md:grid-cols-2 gap-6 p-6 sm:p-8 items-stretch">
        {/* Left: dots + text */}
        <div className="flex flex-col">
          <div className="flex gap-1.5">
            {items.map((_, k) => (
              <span key={k} className={`h-1.5 rounded-full transition-all ${k === i ? 'w-6 bg-sky-400' : 'w-1.5 bg-white/25'}`} />
            ))}
          </div>
          <h3 className="font-display font-medium text-2xl sm:text-3xl mt-6">{p.t}</h3>
          <p className="text-cloud-200/75 mt-3 max-w-sm leading-relaxed">{p.d}</p>
          <div className="mt-4 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-sky-300 bg-white/5 rounded-full px-3.5 py-1.5">
            {p.load}
          </div>
          <a href="#zayavka" className="mt-auto pt-6 inline-flex items-center gap-2 self-start bg-white text-navy-900 font-bold px-6 py-3 rounded-xl hover:bg-sky-400 transition">
            Перейти <IcoArrow className="w-5 h-5" />
          </a>
        </div>

        {/* Right: image — fixed, capped height so it crops top/bottom and the block fits one screen */}
        <div className="relative rounded-xl overflow-hidden bg-white/5 h-52 sm:h-60 md:h-[300px]">
          <img key={p.img} src={p.img} alt={p.t} className="absolute inset-0 w-full h-full object-cover animate-fadeup" />
        </div>
      </div>

      {/* Controls */}
      <div className="relative flex items-center justify-between px-7 sm:px-9 pb-7">
        <div className="flex gap-2">
          <button onClick={() => go(-1)} aria-label="Назад" className="w-11 h-11 grid place-items-center rounded-lg border border-white/25 text-white hover:bg-white hover:text-navy-900 transition">
            <IcoArrow className="w-5 h-5 rotate-180" />
          </button>
          <button onClick={() => go(1)} aria-label="Вперёд" className="w-11 h-11 grid place-items-center rounded-lg border border-white/25 text-white hover:bg-white hover:text-navy-900 transition">
            <IcoArrow className="w-5 h-5" />
          </button>
        </div>
        <div className="text-sm font-semibold text-cloud-200/70">
          <span className="text-white">{String(i + 1).padStart(2, '0')}</span> / {String(n).padStart(2, '0')}
        </div>
      </div>
    </div>
  );
}
