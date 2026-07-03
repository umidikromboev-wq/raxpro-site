'use client';
import { useState } from 'react';

export default function Faq({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="mt-10 max-w-3xl divide-y divide-cloud-200 border-y border-cloud-200">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q}>
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="w-full flex items-center justify-between gap-4 text-left py-5"
            >
              <span className="font-medium text-lg text-navy-800">{it.q}</span>
              <span className={`shrink-0 w-8 h-8 rounded-full border border-cloud-200 grid place-items-center text-sky-600 transition ${isOpen ? 'rotate-45 bg-sky-500 text-white border-sky-500' : ''}`}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
              </span>
            </button>
            <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] pb-5' : 'grid-rows-[0fr]'}`}>
              <div className="overflow-hidden">
                <p className="text-slate-600 leading-relaxed pr-12">{it.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
