'use client';
import { useState } from 'react';
import { SITE } from '../lib/site';
import { IcoTg, IcoPhone } from './Icons';

function IcoWa(p) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 20zm4.5-6c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8 1-.3.2-.5.1a6.5 6.5 0 0 1-1.9-1.2 7.2 7.2 0 0 1-1.3-1.7c-.1-.2 0-.4.1-.5l.4-.4.2-.4v-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11 11 0 0 0 4.3 3.8c.6.3 1.1.4 1.5.5a3.5 3.5 0 0 0 1.6.1 2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .1-1.2c0-.1-.2-.2-.4-.3z" />
    </svg>
  );
}

export default function FloatingContact() {
  const [open, setOpen] = useState(false);

  const items = [
    { label: 'Telegram', href: SITE.telegram, Ico: IcoTg, bg: 'bg-sky-500' },
    { label: 'WhatsApp', href: SITE.whatsapp, Ico: IcoWa, bg: 'bg-green-500' },
    { label: 'Позвонить', href: `tel:${SITE.phoneMain}`, Ico: IcoPhone, bg: 'bg-navy-700' },
  ];

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {open && (
        <div className="flex flex-col items-end gap-2.5 animate-fadeup">
          {items.map((it) => (
            <a
              key={it.label}
              href={it.href}
              target={it.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5"
            >
              <span className="bg-white text-navy-800 text-sm font-semibold px-3 py-1.5 rounded-lg shadow-card opacity-0 group-hover:opacity-100 transition">
                {it.label}
              </span>
              <span className={`w-12 h-12 rounded-full grid place-items-center text-white shadow-card ${it.bg} hover:scale-105 transition`}>
                <it.Ico className="w-6 h-6" />
              </span>
            </a>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Связаться"
        className="w-14 h-14 rounded-full bg-brand-grad text-white grid place-items-center shadow-glow hover:brightness-110 transition"
      >
        {open ? (
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-11.9 7.6L3 21l1.9-6A8.4 8.4 0 1 1 21 11.5z" /></svg>
        )}
      </button>
    </div>
  );
}
