'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Calculator from './Calculator';

// Опросник «Рассчитайте стоимость» живёт в поп-апе (правка Умида 22.09): вопросы
// не соревнуются с остальной страницей за внимание, и один и тот же опросник
// открывается с любой кнопки — из блока на главной, из футера, из шапки.
//
// Кнопки остаются обычными ссылками на `#kalkulyator`: без JS якорь доводит до
// блока, с JS модалка перехватывает клик на всём документе. Поэтому новый CTA
// не требует ничего, кроме href — достаточно указать `#kalkulyator`.
// Программно: `window.dispatchEvent(new Event('rax:calc'))`.

const T = {
  ru: { title: 'Расчёт стоимости', sub: 'Меньше минуты · ответим за 5 минут', close: 'Закрыть' },
  uz: { title: 'Narxni hisoblash', sub: 'Bir daqiqadan kam · 5 daqiqada javob beramiz', close: 'Yopish' },
};

const OPEN_EVENT = 'rax:calc';
const isCalcLink = (el) => el?.tagName === 'A' && (el.getAttribute('href') || '').endsWith('#kalkulyator');

function IcoClose(p) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...p}><path d="M6 6l12 12M18 6L6 18" /></svg>;
}

export default function CalcModal({ lang = 'ru' }) {
  const L = lang === 'uz' ? 'uz' : 'ru';
  const t = T[L];
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const openerRef = useRef(null);

  const close = useCallback(() => {
    setOpen(false);
    // Возвращаем фокус на кнопку, с которой открыли, — иначе с клавиатуры
    // читатель после закрытия оказывается в начале страницы.
    openerRef.current?.focus?.();
    openerRef.current = null;
  }, []);

  useEffect(() => {
    const openFrom = (el) => { openerRef.current = el || null; setOpen(true); };
    const onClick = (e) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = e.target.closest?.('a');
      if (!isCalcLink(link)) return;
      // Перехват на фазе захвата: плавный скролл (components/SmoothScroll) тоже
      // слушает клики по якорям и иначе увёл бы страницу к блоку под модалкой.
      e.preventDefault();
      e.stopPropagation();
      openFrom(link);
    };
    const onEvent = () => openFrom(null);
    document.addEventListener('click', onClick, true);
    window.addEventListener(OPEN_EVENT, onEvent);
    // Пришли по ссылке вида /ru#kalkulyator — открываем сразу.
    if (window.location.hash === '#kalkulyator') openFrom(null);
    return () => { document.removeEventListener('click', onClick, true); window.removeEventListener(OPEN_EVENT, onEvent); };
  }, []);

  useEffect(() => {
    if (!open) return;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;
      // Фокус не должен уходить из окна: список полей короткий, ловим по краям.
      const items = panelRef.current?.querySelectorAll('a[href], button:not([disabled]), input, select, textarea');
      if (!items?.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    const focusTimer = setTimeout(() => {
      panelRef.current?.querySelector('button, input')?.focus?.();
    }, 60);
    return () => { body.style.overflow = prevOverflow; document.removeEventListener('keydown', onKey); clearTimeout(focusTimer); };
  }, [open, close]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div className="calc-modal fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <button type="button" aria-label={t.close} onClick={close} className="absolute inset-0 bg-navy-900/70 backdrop-blur-sm cursor-default" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.title}
        data-lenis-prevent
        className="calc-modal-panel relative w-full sm:max-w-xl max-h-[92svh] sm:max-h-[88svh] overflow-y-auto overscroll-contain rounded-t-[1.75rem] sm:rounded-xl2 bg-white shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 bg-white/95 backdrop-blur px-6 sm:px-8 pt-5 pb-4 border-b border-cloud-200">
          <div>
            <h2 className="font-display font-medium text-xl text-navy-900 leading-tight">{t.title}</h2>
            <p className="text-slate-500 text-sm mt-0.5">{t.sub}</p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label={t.close}
            className="shrink-0 w-10 h-10 -mr-2 grid place-items-center rounded-full text-slate-400 hover:text-navy-900 hover:bg-cloud-100 transition"
          >
            <IcoClose className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 sm:p-6">
          <Calculator lang={L} bare />
        </div>
      </div>
    </div>,
    document.body,
  );
}
