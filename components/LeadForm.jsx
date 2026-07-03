'use client';
import { useState } from 'react';
import { SITE } from '../lib/site';
import { IcoCheck } from './Icons';

const FT = {
  ru: {
    name: 'Ваше имя', phone: 'Телефон *', selectDefault: 'Тип стеллажей (необязательно)',
    options: ['Паллетные (Mega) стеллажи', 'Среднегрузовые стеллажи', 'Архивные стеллажи', 'Торговые стеллажи', 'Не знаю — нужна консультация'],
    comment: 'Комментарий: объём, размеры, задача…', submit: 'Получить бесплатный расчёт', sending: 'Отправляем…',
    okTitle: 'Заявка принята!', okText: 'Свяжемся с вами в ближайшее время для бесплатного замера и расчёта.',
    err: 'Ошибка отправки. Позвоните:', consent: 'Нажимая кнопку, вы соглашаетесь на обработку персональных данных',
    altContact: 'Не любите звонки? Напишите в',
  },
  uz: {
    name: 'Ismingiz', phone: 'Telefon *', selectDefault: 'Stellaj turi (ixtiyoriy)',
    options: ['Palletli (Mega) stellajlar', 'Oʻrta yuklamali stellajlar', 'Arxiv stellajlari', 'Savdo stellajlari', 'Bilmayman — konsultatsiya kerak'],
    comment: 'Izoh: hajm, oʻlchamlar, vazifa…', submit: 'Bepul hisob-kitob olish', sending: 'Yuborilmoqda…',
    okTitle: 'Ariza qabul qilindi!', okText: 'Bepul oʻlchov va hisob-kitob uchun tez orada siz bilan bogʻlanamiz.',
    err: 'Yuborishda xatolik. Qoʻngʻiroq qiling:', consent: 'Tugmani bosish orqali shaxsiy maʼlumotlarni qayta ishlashga rozilik bildirasiz',
    altContact: 'Qoʻngʻiroqni yoqtirmaysizmi? Yozing:',
  },
};

export default function LeadForm({ compact = false, lang = 'ru' }) {
  const t = FT[lang === 'uz' ? 'uz' : 'ru'];
  const [f, setF] = useState({ name: '', phone: '', product: '', message: '' });
  const [state, setState] = useState('idle');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    if (!f.phone.trim()) return;
    setState('sending');
    try {
      const r = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(f),
      });
      setState(r.ok ? 'ok' : 'err');
      if (r.ok) setF({ name: '', phone: '', product: '', message: '' });
    } catch {
      setState('err');
    }
  }

  const field =
    'w-full bg-cloud-50 border border-cloud-200 rounded-xl px-4 py-3 text-ink outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 placeholder:text-slate-400 transition';

  if (state === 'ok') {
    return (
      <div className="rounded-xl2 bg-white border border-cloud-200 p-8 text-center shadow-card">
        <div className="w-14 h-14 mx-auto rounded-full bg-green-50 grid place-items-center text-green-600 mb-3">
          <IcoCheck className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-navy-800">{t.okTitle}</h3>
        <p className="text-slate-600 mt-2">{t.okText}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={`rounded-xl2 bg-white border border-cloud-200 shadow-card ${compact ? 'p-5' : 'p-6 sm:p-7'}`}>
      <div className="grid sm:grid-cols-2 gap-3">
        <input value={f.name} onChange={set('name')} placeholder={t.name} className={field} />
        <input value={f.phone} onChange={set('phone')} required type="tel" placeholder={t.phone} className={field} />
      </div>
      <select value={f.product} onChange={set('product')} className={`${field} mt-3 ${f.product ? 'text-ink' : 'text-slate-400'}`}>
        <option value="">{t.selectDefault}</option>
        {t.options.map((o) => <option key={o} className="text-ink">{o}</option>)}
      </select>
      {!compact && (
        <textarea value={f.message} onChange={set('message')} rows={3} placeholder={t.comment} className={`${field} mt-3`} />
      )}
      <button
        disabled={state === 'sending'}
        className="w-full mt-4 bg-brand-grad text-white font-bold py-3.5 rounded-xl disabled:opacity-60 shadow-glow hover:brightness-110"
      >
        {state === 'sending' ? t.sending : t.submit}
      </button>
      {state === 'err' && (
        <p className="text-red-600 text-sm mt-2 text-center">{t.err} {SITE.phoneMainHuman}</p>
      )}
      <p className="text-slate-400 text-xs mt-3 text-center">{t.consent}</p>
      <div className="mt-3 pt-3 border-t border-cloud-100 text-center text-sm text-slate-500">
        {t.altContact}{' '}
        <a href={SITE.telegram} target="_blank" rel="noopener noreferrer" className="font-semibold text-sky-600 hover:text-sky-700">Telegram</a>
        {' · '}
        <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="font-semibold text-green-600 hover:text-green-700">WhatsApp</a>
      </div>
    </form>
  );
}
