'use client';
import { useState } from 'react';
import { IcoRuler, IcoDraft, IcoFactory, IcoWrench, IcoShield, IcoWeight, IcoTruck, IcoLayers, IcoClock, IcoCheck, IcoPin } from './Icons';

// Порядок иконок = порядок вопросов в lib/i18n (ru и uz совпадают):
// цена · нагрузка · гарантия · замер и монтаж · рассрочка · сроки · регионы ·
// пол и анкеры · что нужно для расчёта · документы · колонны и техника · докупка · оплата
const ICONS = [IcoPriceTag, IcoWeight, IcoShield, IcoRuler, IcoCard, IcoClock, IcoPin, IcoAnchor, IcoDraft, IcoDoc, IcoFactory, IcoLayers, IcoWallet];

function IcoPriceTag(p) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 13 11 22 2 13V2h11l9 9-2 2Z" /><circle cx="7.5" cy="7.5" r="1.5" /></svg>; }
function IcoCard(p) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20M6 15h4" /></svg>; }
function IcoAnchor(p) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 8v13M5 13a7 7 0 0 0 14 0M3 21h18" /><circle cx="12" cy="5" r="2.5" /></svg>; }
function IcoDoc(p) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" /><path d="M14 2v6h6M8 13h8M8 17h6" /></svg>; }
function IcoWallet(p) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 7a2 2 0 0 1 2-2h13v4H5a2 2 0 0 1-2-2Z" /><path d="M3 7v10a2 2 0 0 0 2 2h16v-8H5a2 2 0 0 1-2-2Z" /><circle cx="17" cy="15" r="1" /></svg>; }

export default function Faq({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="mt-10 grid md:grid-cols-2 gap-4">
      {items.map((it, i) => {
        const isOpen = open === i;
        const Ico = ICONS[i % ICONS.length] || IcoCheck;
        return (
          <div key={it.q} className={`rounded-xl2 border bg-white transition ${isOpen ? 'border-sky-300 shadow-card' : 'border-cloud-200 hover:border-sky-200'}`}>
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="w-full flex items-center gap-4 text-left px-5 py-4"
            >
              <span className={`shrink-0 w-11 h-11 rounded-xl grid place-items-center transition ${isOpen ? 'bg-sky-500 text-white' : 'bg-sky-50 text-sky-600'}`}>
                <Ico className="w-5 h-5" />
              </span>
              <span className="flex-1 font-medium text-navy-800 leading-snug">{it.q}</span>
              <span className={`shrink-0 w-8 h-8 rounded-full border border-cloud-200 grid place-items-center text-sky-600 transition ${isOpen ? 'rotate-45 bg-sky-500 text-white border-sky-500' : ''}`}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
              </span>
            </button>
            <div className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <div className="overflow-hidden">
                <p className="text-slate-600 leading-relaxed px-5 pb-5 pl-[80px]">{it.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
