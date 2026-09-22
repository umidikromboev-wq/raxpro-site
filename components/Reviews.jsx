'use client';
import { useState } from 'react';
import { IcoQuote, IcoArrow } from './Icons';

// Блок отзывов: видеоинтервью лентой, ниже — цитаты из переписок и голосовых.
// Только текст, без фото объектов — карточки одной высоты ритма. Данные уже
// локализованы (lib/reviews.js). С `allHref` блок работает как витрина для
// главной: показывает всё, что передали, и ведёт на страницу всех отзывов.

// «31 отзыв» / «22 отзыва» / «5 отзывов»
function plural(n, [one, few, many]) {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}

const UI = {
  ru: {
    videos: 'Видеоотзывы', texts: 'Из переписок и голосовых', play: 'Смотреть отзыв',
    voice: 'Голосовое сообщение', chat: 'Из переписки',
    all: (n) => `Все ${n} ${plural(n, ['отзыв', 'отзыва', 'отзывов'])}`, allNote: 'Видео, переписки и голосовые — без купюр',
  },
  uz: {
    videos: 'Videosharhlar', texts: 'Yozishmalar va ovozli xabarlardan', play: 'Sharhni koʻrish',
    voice: 'Ovozli xabar', chat: 'Yozishmadan',
    all: (n) => `Barcha ${n} ta sharh`, allNote: 'Video, yozishma va ovozli xabarlar — toʻliq',
  },
};

function IcoPlay(p) { return <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M8 5.5v13l11-6.5z" /></svg>; }
function IcoMic(p) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" {...p}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>; }
function IcoChat(p) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 5h16v11H8l-4 4z" /></svg>; }

function VideoCard({ r, u }) {
  const [on, setOn] = useState(false);
  return (
    <figure className="snap-start shrink-0 w-[236px] sm:w-[260px]">
      <div className="relative aspect-[9/16] rounded-xl2 overflow-hidden bg-navy-900">
        {on ? (
          <video src={r.video} poster={r.poster} controls autoPlay playsInline preload="metadata" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <button type="button" onClick={() => setOn(true)} aria-label={`${u.play}: ${r.name}`} className="group absolute inset-0 w-full h-full text-left">
            <img src={r.poster} alt="" width={720} height={1280} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
            <span className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/20 to-transparent" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/95 text-navy-900 grid place-items-center shadow-card group-hover:scale-105 transition">
              <IcoPlay className="w-7 h-7 ml-1" />
            </span>
            <span className="absolute inset-x-0 bottom-0 p-4 text-white">
              <span className="block font-bold leading-tight">{r.name}</span>
              <span className="block text-white/70 text-xs mt-1">{r.role}</span>
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-4">«{r.text}»</figcaption>
    </figure>
  );
}

function TextCard({ r, u }) {
  const Badge = r.kind === 'voice' ? IcoMic : IcoChat;
  return (
    <figure className="h-full flex flex-col rounded-xl2 bg-white border border-cloud-200 shadow-card p-6">
      <div className="flex items-center justify-between">
        <IcoQuote className="w-8 h-8 text-sky-500/30" />
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
          <Badge className="w-3.5 h-3.5" /> {r.kind === 'voice' ? u.voice : u.chat}
        </span>
      </div>
      <blockquote className="mt-3 text-slate-700 leading-relaxed flex-1">{r.text}</blockquote>
      <figcaption className="mt-5 pt-4 border-t border-cloud-200 flex items-center gap-3">
        <span className="w-10 h-10 rounded-full bg-brand-grad text-white grid place-items-center font-display font-medium shrink-0">{r.name.charAt(0)}</span>
        <span className="min-w-0">
          <span className="block font-bold text-navy-800 leading-tight truncate">{r.name}</span>
          <span className="block text-slate-400 text-sm mt-0.5 truncate">{r.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export default function Reviews({ items, lang = 'ru', allHref, total }) {
  const u = UI[lang] || UI.ru;
  const videos = items.filter((r) => r.kind === 'video');
  const texts = items.filter((r) => r.kind !== 'video');

  return (
    <div>
      {/* Видео — горизонтальная лента со снапом; на десктопе видно 4–5 карточек */}
      {videos.length > 0 && (
        <div className="mt-10">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 mb-4">{u.videos} · {videos.length}</div>
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3 -mx-5 px-5 scroll-pl-5 sm:mx-0 sm:px-0 sm:scroll-pl-0 scrollbar-none">
            {videos.map((r) => <VideoCard key={r.id} r={r} u={u} />)}
          </div>
        </div>
      )}

      {/* Переписки и голосовые — на телефоне слайдер (одна карточка на экран),
          с sm ровная сетка, карточки одной высоты в ряду */}
      {texts.length > 0 && (
        <div className="mt-10">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 mb-4">{u.texts} · {texts.length}</div>
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 overflow-x-auto sm:overflow-visible snap-x snap-mandatory pb-3 sm:pb-0 -mx-5 px-5 scroll-pl-5 sm:mx-0 sm:px-0 sm:scroll-pl-0 scrollbar-none">
            {texts.map((r) => (
              <div key={r.id} className="snap-start shrink-0 w-[82vw] max-w-[360px] sm:shrink sm:w-auto sm:max-w-none">
                <TextCard r={r} u={u} />
              </div>
            ))}
          </div>
        </div>
      )}

      {allHref && (
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
          <a href={allHref} className="btn-11 inline-flex items-center justify-center gap-2 bg-navy-900 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-navy-800 transition">
            {u.all(total ?? items.length)} <IcoArrow className="w-4 h-4" />
          </a>
          <span className="text-sm text-slate-500">{u.allNote}</span>
        </div>
      )}
    </div>
  );
}
