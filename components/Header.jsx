'use client';
import { useEffect, useState } from 'react';
import { SITE, NAV } from '../lib/site';
import { IcoPhone, IcoTg } from './Icons';

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
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 mt-3">
        {/* Floating frosted glass bar — nav in normal flow (flex-1) so it never overlaps actions */}
        <div className={`relative flex items-center gap-4 h-16 rounded-2xl px-4 sm:px-5 border transition-all ${scrolled ? 'bg-navy-900/90 backdrop-blur-md border-white/10 shadow-band' : 'bg-white/10 backdrop-blur-md border-white/15'}`}>
          {/* Logo */}
          <a href="/" className="flex items-center shrink-0" aria-label="RAXPRO — на главную">
            <img src="/brand/raxpro-logo-white.png" alt="RAXPRO" className="h-8 w-auto" />
          </a>

          {/* Centered nav (fills middle, cannot overlap) */}
          <nav className="hidden xl:flex flex-1 items-center justify-center gap-7 text-[15px] font-normal text-white/85">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="hover:text-sky-300 transition-colors whitespace-nowrap">{n.label}</a>
            ))}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-2.5 ml-auto xl:ml-0 shrink-0">
            <a href={`tel:${SITE.phoneMain}`} className="hidden 2xl:flex items-center gap-2 text-white font-medium text-[15px] hover:text-sky-300 whitespace-nowrap">
              <IcoPhone className="w-4 h-4 text-sky-300" />
              {SITE.phoneMainHuman}
            </a>
            <a href={SITE.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="hidden sm:grid place-items-center w-10 h-10 rounded-xl bg-white/12 border border-white/15 text-white hover:bg-sky-500 hover:border-sky-500 transition">
              <IcoTg className="w-5 h-5" />
            </a>
            <a href="#zayavka" className="hidden sm:inline-flex text-sm font-medium px-5 py-2.5 rounded-xl bg-white/12 border border-white/20 text-white hover:bg-white hover:text-navy-800 transition backdrop-blur-sm whitespace-nowrap">
              Консультация
            </a>
            <button onClick={() => setOpen((v) => !v)} className="xl:hidden w-10 h-10 grid place-items-center rounded-xl bg-white/12 border border-white/15 text-white" aria-label="Меню">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="xl:hidden mt-2 rounded-2xl bg-navy-900/95 backdrop-blur-md border border-white/10 px-4 py-4">
            <nav className="flex flex-col divide-y divide-white/10">
              {NAV.map((n) => (
                <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="py-3 text-white/90 font-medium">{n.label}</a>
              ))}
            </nav>
            <div className="mt-3 flex flex-col gap-2">
              <a href={`tel:${SITE.phoneMain}`} className="flex items-center gap-2 font-medium text-white py-1">
                <IcoPhone className="w-4 h-4 text-sky-300" /> {SITE.phoneMainHuman}
              </a>
              <a href="#zayavka" onClick={() => setOpen(false)} className="bg-brand-grad text-white text-center font-semibold px-5 py-3 rounded-xl">Консультация</a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
