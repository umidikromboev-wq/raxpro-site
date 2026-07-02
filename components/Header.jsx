'use client';
import { useEffect, useState } from 'react';
import { SITE, NAV } from '../lib/site';
import { IcoPhone } from './Icons';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all ${scrolled ? 'bg-white/95 backdrop-blur border-b border-cloud-200 shadow-[0_2px_20px_-12px_rgba(13,42,77,.4)]' : 'bg-white/80 backdrop-blur border-b border-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[68px] flex items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-2.5 shrink-0" aria-label="RAXPRO — на главную">
          <img src="/brand/raxpro-logo.png" alt="RAXPRO" className="h-9 w-auto" />
        </a>

        <nav className="hidden lg:flex items-center gap-7 text-[15px] font-medium text-slate-700">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="hover:text-navy-700 transition-colors">{n.label}</a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href={`tel:${SITE.phoneMain}`} className="hidden sm:flex items-center gap-2 text-navy-800 font-bold text-[15px] hover:text-sky-600">
            <IcoPhone className="w-4 h-4 text-gold-500" />
            {SITE.phoneMainHuman}
          </a>
          <a href="#zayavka" className="hidden sm:inline-flex bg-navy-700 hover:bg-navy-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-card">
            Консультация
          </a>
          <button onClick={() => setOpen((v) => !v)} className="lg:hidden w-10 h-10 grid place-items-center rounded-lg border border-cloud-200 text-navy-800" aria-label="Меню">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t border-cloud-200 px-4 sm:px-6 py-4">
          <nav className="flex flex-col divide-y divide-cloud-100">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="py-3 text-slate-700 font-medium">{n.label}</a>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2">
            <a href={`tel:${SITE.phoneMain}`} className="flex items-center gap-2 font-bold text-navy-800 py-1">
              <IcoPhone className="w-4 h-4 text-gold-500" /> {SITE.phoneMainHuman}
            </a>
            <a href="#zayavka" onClick={() => setOpen(false)} className="bg-navy-700 text-white text-center font-semibold px-5 py-3 rounded-lg">Консультация</a>
          </div>
        </div>
      )}
    </header>
  );
}
