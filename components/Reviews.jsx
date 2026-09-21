'use client';
import { useState } from 'react';
import { IcoQuote } from './Icons';

// Один блок отзывов: видеоинтервью лентой, ниже — цитаты из переписок и
// голосовых с фото объекта. Данные уже локализованы (lib/reviews.js).

const UI = {
  ru: {
    videos: 'Видеоотзывы', play: 'Смотреть отзыв', voice: 'Голосовое сообщение', chat: 'Из переписки',
    more: (n) => `Показать ещё ${n}`, less: 'Свернуть', photo: 'Фото объекта', count: (n) => `${n} отзыва`,
  },
  uz: {
    videos: 'Videosharhlar', play: 'Sharhni koʻrish', voice: 'Ovozli xabar', chat: 'Yozishmadan',
    more: (n) => `Yana ${n} tasini koʻrsatish`, less: 'Yigʻish', photo: 'Obyekt surati', count: (n) => `${n} ta sharh`,
  },
};

const INITIAL_TEXT = 9;

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
    <figure className="break-inside-avoid mb-5 rounded-xl2 bg-white border border-cloud-200 shadow-card overflow-hidden">
      {r.photos?.[0] && (
        <div className="relative aspect-[4/3] bg-cloud-100">
          <img src={r.photos[0]} alt={`${u.photo} — ${r.name}`} width={800} height={600} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <IcoQuote className="w-8 h-8 text-sky-500/30" />
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            <Badge className="w-3.5 h-3.5" /> {r.kind === 'voice' ? u.voice : u.chat}
          </span>
        </div>
        <blockquote className="mt-3 text-slate-700 leading-relaxed">{r.text}</blockquote>
        <figcaption className="mt-5 pt-4 border-t border-cloud-200 flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-brand-grad text-white grid place-items-center font-display font-medium shrink-0">{r.name.charAt(0)}</span>
          <span className="min-w-0">
            <span className="block font-bold text-navy-800 leading-tight truncate">{r.name}</span>
            <span className="block text-slate-400 text-sm mt-0.5 truncate">{r.role}</span>
          </span>
        </figcaption>
      </div>
    </figure>
  );
}

export default function Reviews({ items, lang = 'ru' }) {
  const u = UI[lang] || UI.ru;
  const [all, setAll] = useState(false);
  const videos = items.filter((r) => r.kind === 'video');
  const texts = items.filter((r) => r.kind !== 'video');
  const shown = all ? texts : texts.slice(0, INITIAL_TEXT);
  const hidden = texts.length - shown.length;

  return (
    <div>
      {/* Видео — горизонтальная лента со снапом; на десктопе видно 4–5 карточек */}
      <div className="mt-10">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 mb-4">{u.videos} · {videos.length}</div>
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3 -mx-5 px-5 sm:mx-0 sm:px-0 scrollbar-none">
          {videos.map((r) => <VideoCard key={r.id} r={r} u={u} />)}
        </div>
      </div>

      {/* Переписки и голосовые — masonry в 3 колонки */}
      <div className="mt-10 columns-1 sm:columns-2 lg:columns-3 gap-5">
        {shown.map((r) => <TextCard key={r.id} r={r} u={u} />)}
      </div>
      {texts.length > INITIAL_TEXT && (
        <div className="flex justify-center mt-2">
          <button type="button" onClick={() => setAll((v) => !v)} className="btn-11 inline-flex items-center gap-2 border border-navy-800 text-navy-800 font-semibold px-6 py-3 rounded-xl hover:bg-navy-800 hover:text-white transition">
            {all ? u.less : u.more(hidden)}
          </button>
        </div>
      )}
    </div>
  );
}
