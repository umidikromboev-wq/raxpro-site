'use client';
import { useState } from 'react';
import { SITE } from '../lib/site';
import { IcoArrow, IcoCheck, IcoPallet, IcoLayers, IcoArchive, IcoShop, IcoClock } from './Icons';

const STEPS = [
  {
    key: 'type',
    q: 'Какой тип стеллажей нужен?',
    options: [
      { v: 'Паллетные (Mega)', Ico: IcoPallet },
      { v: 'Среднегрузовые', Ico: IcoLayers },
      { v: 'Архивные', Ico: IcoArchive },
      { v: 'Торговые', Ico: IcoShop },
      { v: 'Не знаю — нужна консультация', Ico: IcoClock },
    ],
  },
  {
    key: 'place',
    q: 'Где будете использовать?',
    options: [
      { v: 'Склад' }, { v: 'Магазин / торговый зал' }, { v: 'Производство' },
      { v: 'Архив / офис' }, { v: 'Маркетплейс (склад селлера)' }, { v: 'Другое' },
    ],
  },
  {
    key: 'load',
    q: 'Нагрузка на ярус?',
    options: [
      { v: 'до 300 кг' }, { v: '300–800 кг' }, { v: '800–1500 кг' }, { v: 'до 3.5 тонны' }, { v: 'Не знаю' },
    ],
  },
  {
    key: 'volume',
    q: 'Примерный объём?',
    options: [
      { v: '1–5 секций' }, { v: '5–20 секций' }, { v: '20–50 секций' }, { v: '50+ секций / большой склад' }, { v: 'Не знаю' },
    ],
  },
];

export default function Calculator() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [contact, setContact] = useState({ name: '', phone: '' });
  const [state, setState] = useState('idle');

  const total = STEPS.length + 1; // + contact
  const progress = Math.round(((step) / total) * 100);

  function pick(key, v) {
    setAnswers((a) => ({ ...a, [key]: v }));
    setTimeout(() => setStep((s) => s + 1), 150);
  }

  async function submit(e) {
    e.preventDefault();
    if (!contact.phone.trim()) return;
    setState('sending');
    const summary = STEPS.map((s) => `${s.q} — ${answers[s.key] || '—'}`).join('\n');
    try {
      const r = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contact.name,
          phone: contact.phone,
          product: answers.type || 'Калькулятор',
          message: `📊 РАСЧЁТ ЧЕРЕЗ КАЛЬКУЛЯТОР:\n${summary}`,
        }),
      });
      setState(r.ok ? 'ok' : 'err');
    } catch {
      setState('err');
    }
  }

  if (state === 'ok') {
    return (
      <div className="rounded-xl2 bg-white border border-cloud-200 shadow-card p-8 sm:p-10 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-brand-grad grid place-items-center text-white mb-4 shadow-glow">
          <IcoCheck className="w-9 h-9" />
        </div>
        <h3 className="font-display font-medium text-2xl text-navy-800">Заявка принята!</h3>
        <p className="text-slate-600 mt-2 max-w-md mx-auto">
          Менеджер подготовит расчёт и свяжется с вами — обычно отвечаем в течение 5 минут. Замер и проект — бесплатно, за 24 часа.
        </p>
        <a href={`tel:${SITE.phoneMain}`} className="inline-flex mt-5 items-center gap-2 text-navy-700 font-semibold hover:text-sky-600">
          Или позвоните: {SITE.phoneMainHuman}
        </a>
      </div>
    );
  }

  const isContact = step >= STEPS.length;
  const cur = STEPS[step];

  return (
    <div className="rounded-xl2 bg-white border border-cloud-200 shadow-card overflow-hidden">
      {/* Progress */}
      <div className="h-1.5 bg-cloud-100">
        <div className="h-full bg-brand-grad transition-all" style={{ width: `${Math.max(progress, 8)}%` }} />
      </div>

      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between mb-5">
          <span className="text-xs font-semibold uppercase tracking-wide text-sky-600">
            Шаг {Math.min(step + 1, total)} из {total}
          </span>
          {step > 0 && state !== 'sending' && (
            <button onClick={() => setStep((s) => s - 1)} className="text-sm text-slate-400 hover:text-navy-700">← Назад</button>
          )}
        </div>

        {!isContact && (
          <div>
            <h3 className="font-display font-medium text-xl sm:text-2xl text-navy-800">{cur.q}</h3>
            <div className="grid sm:grid-cols-2 gap-3 mt-5">
              {cur.options.map((o) => (
                <button
                  key={o.v}
                  onClick={() => pick(cur.key, o.v)}
                  className={`flex items-center gap-3 text-left rounded-xl border px-4 py-3.5 transition ${
                    answers[cur.key] === o.v
                      ? 'border-sky-500 bg-sky-500/5 text-navy-800'
                      : 'border-cloud-200 hover:border-sky-400 hover:bg-cloud-50 text-slate-700'
                  }`}
                >
                  {o.Ico && <span className="w-9 h-9 rounded-lg bg-navy-900/6 text-navy-700 grid place-items-center shrink-0"><o.Ico className="w-5 h-5" /></span>}
                  <span className="font-medium">{o.v}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {isContact && (
          <form onSubmit={submit}>
            <h3 className="font-display font-medium text-xl sm:text-2xl text-navy-800">Куда прислать расчёт?</h3>
            <p className="text-slate-500 text-sm mt-2">Оставьте телефон — менеджер посчитает стоимость и ответит за 5 минут. Ни к чему не обязывает.</p>
            <div className="mt-5 space-y-3">
              <input
                value={contact.name}
                onChange={(e) => setContact({ ...contact, name: e.target.value })}
                placeholder="Ваше имя"
                className="w-full bg-cloud-50 border border-cloud-200 rounded-xl px-4 py-3 text-ink outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 placeholder:text-slate-400"
              />
              <input
                value={contact.phone}
                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                required
                type="tel"
                placeholder="Телефон *"
                className="w-full bg-cloud-50 border border-cloud-200 rounded-xl px-4 py-3 text-ink outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 placeholder:text-slate-400"
              />
            </div>
            <button
              disabled={state === 'sending'}
              className="w-full mt-4 bg-brand-grad text-white font-bold py-3.5 rounded-xl shadow-glow hover:brightness-110 disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {state === 'sending' ? 'Отправляем…' : <>Получить расчёт <IcoArrow className="w-5 h-5" /></>}
            </button>
            {state === 'err' && <p className="text-red-600 text-sm mt-2 text-center">Ошибка. Позвоните: {SITE.phoneMainHuman}</p>}
            <p className="text-slate-400 text-xs mt-3 text-center">Нажимая кнопку, вы соглашаетесь на обработку персональных данных</p>
          </form>
        )}
      </div>
    </div>
  );
}
