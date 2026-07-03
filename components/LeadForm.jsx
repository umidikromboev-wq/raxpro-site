'use client';
import { useState } from 'react';
import { SITE } from '../lib/site';
import { IcoCheck } from './Icons';

export default function LeadForm({ compact = false }) {
  const [f, setF] = useState({ name: '', phone: '', product: '', message: '' });
  const [state, setState] = useState('idle'); // idle | sending | ok | err
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
        <h3 className="text-xl font-bold text-navy-800">Заявка принята!</h3>
        <p className="text-slate-600 mt-2">Свяжемся с вами в ближайшее время для бесплатного замера и расчёта.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={`rounded-xl2 bg-white border border-cloud-200 shadow-card ${compact ? 'p-5' : 'p-6 sm:p-7'}`}>
      <div className="grid sm:grid-cols-2 gap-3">
        <input value={f.name} onChange={set('name')} placeholder="Ваше имя" className={field} />
        <input value={f.phone} onChange={set('phone')} required type="tel" placeholder="Телефон *" className={field} />
      </div>
      <select value={f.product} onChange={set('product')} className={`${field} mt-3 ${f.product ? 'text-ink' : 'text-slate-400'}`}>
        <option value="">Тип стеллажей (необязательно)</option>
        <option className="text-ink">Паллетные (Mega) стеллажи</option>
        <option className="text-ink">Среднегрузовые стеллажи</option>
        <option className="text-ink">Архивные стеллажи</option>
        <option className="text-ink">Торговые стеллажи</option>
        <option className="text-ink">Не знаю — нужна консультация</option>
      </select>
      {!compact && (
        <textarea value={f.message} onChange={set('message')} rows={3} placeholder="Комментарий: объём, размеры, задача…" className={`${field} mt-3`} />
      )}
      <button
        disabled={state === 'sending'}
        className="w-full mt-4 bg-brand-grad text-white font-bold py-3.5 rounded-xl disabled:opacity-60 shadow-glow hover:brightness-110"
      >
        {state === 'sending' ? 'Отправляем…' : 'Получить бесплатный расчёт'}
      </button>
      {state === 'err' && (
        <p className="text-red-600 text-sm mt-2 text-center">Ошибка отправки. Позвоните: {SITE.phoneMainHuman}</p>
      )}
      <p className="text-slate-400 text-xs mt-3 text-center">Нажимая кнопку, вы соглашаетесь на обработку персональных данных</p>
    </form>
  );
}
