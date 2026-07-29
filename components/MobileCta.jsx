'use client';
import { useEffect, useState } from 'react';
import { SITE } from '../lib/site';
import { IcoPhone, IcoArrow } from './Icons';

const T = {
  ru: { calc: 'Рассчитать', call: 'Позвонить' },
  uz: { calc: 'Hisoblash', call: 'Qoʻngʻiroq' },
};

// Нижняя панель на телефоне: с длинных страниц до формы далеко, а звонок и
// расчёт — два действия, ради которых сюда и приходят. Появляется после
// первого экрана, чтобы не перекрывать заголовок.
export default function MobileCta({ lang = 'ru', calcHref = '#kalkulyator' }) {
  const t = T[lang === 'uz' ? 'uz' : 'ru'];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`sm:hidden fixed inset-x-0 bottom-0 z-40 px-3 pb-3 pt-2 bg-navy-900/95 backdrop-blur-md border-t border-white/10 transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex gap-2.5">
        <a
          href={calcHref}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-grad text-white font-bold px-4 py-3 rounded-xl"
        >
          {t.calc} <IcoArrow className="w-4 h-4" />
        </a>
        <a
          href={`tel:${SITE.phoneMain}`}
          aria-label={t.call}
          className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/25 text-white font-semibold"
        >
          <IcoPhone className="w-5 h-5 text-sky-300" /> {t.call}
        </a>
      </div>
    </div>
  );
}
