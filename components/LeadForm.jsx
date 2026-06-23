'use client';
import { useState } from 'react';

export default function LeadForm({ compact = false }) {
  const [f, setF] = useState({ name: '', phone: '', product: '', message: '' });
  const [state, setState] = useState('idle'); // idle | sending | ok | err
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    if (!f.phone.trim()) return;
    setState('sending');
    try {
      const r = await fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) });
      setState(r.ok ? 'ok' : 'err');
      if (r.ok) setF({ name: '', phone: '', product: '', message: '' });
    } catch { setState('err'); }
  }

  if (state === 'ok') {
    return (
      <div className="rounded-2xl bg-ink-800 border border-ink-600 p-8 text-center">
        <div className="text-4xl mb-2">✅</div>
        <h3 className="text-xl font-bold">Заявка принята!</h3>
        <p className="text-steel-300 mt-2">Свяжемся с вами в ближайшее время для бесплатного замёра и расчёта.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={`rounded-2xl bg-ink-800 border border-ink-600 ${compact ? 'p-5' : 'p-6 sm:p-8'}`}>
      <div className="grid sm:grid-cols-2 gap-3">
        <input value={f.name} onChange={set('name')} placeholder="Ваше имя"
          className="bg-ink-900 border border-ink-600 rounded-xl px-4 py-3 outline-none focus:border-orange-500 placeholder:text-steel-400" />
        <input value={f.phone} onChange={set('phone')} required type="tel" placeholder="Телефон *"
          className="bg-ink-900 border border-ink-600 rounded-xl px-4 py-3 outline-none focus:border-orange-500 placeholder:text-steel-400" />
      </div>
      <select value={f.product} onChange={set('product')}
        className="w-full mt-3 bg-ink-900 border border-ink-600 rounded-xl px-4 py-3 outline-none focus:border-orange-500 text-steel-300">
        <option value="">Тип стеллажей (необязательно)</option>
        <option>Паллетные (Mega) стеллажи</option>
        <option>Среднегрузовые стеллажи</option>
        <option>Архивные стеллажи</option>
        <option>Торговые стеллажи</option>
        <option>Не знаю — нужна консультация</option>
      </select>
      {!compact && (
        <textarea value={f.message} onChange={set('message')} rows={3} placeholder="Комментарий: объём, размеры, задача…"
          className="w-full mt-3 bg-ink-900 border border-ink-600 rounded-xl px-4 py-3 outline-none focus:border-orange-500 placeholder:text-steel-400" />
      )}
      <button disabled={state === 'sending'}
        className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl disabled:opacity-60">
        {state === 'sending' ? 'Отправляем…' : 'Получить бесплатный расчёт'}
      </button>
      {state === 'err' && <p className="text-red-400 text-sm mt-2 text-center">Ошибка. Позвоните: +998 55 055 55 75</p>}
      <p className="text-steel-400 text-xs mt-3 text-center">Нажимая кнопку, вы соглашаетесь на обработку данных</p>
    </form>
  );
}
