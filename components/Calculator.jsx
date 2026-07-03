'use client';
import { useState } from 'react';
import { SITE } from '../lib/site';
import { IcoArrow, IcoCheck, IcoPallet, IcoLayers, IcoArchive, IcoShop, IcoClock } from './Icons';

const STEPS_BY_LANG = {
  ru: [
    { key: 'type', q: 'Какой тип стеллажей нужен?', options: [
      { v: 'Паллетные (Mega)', Ico: IcoPallet }, { v: 'Среднегрузовые', Ico: IcoLayers },
      { v: 'Архивные', Ico: IcoArchive }, { v: 'Торговые', Ico: IcoShop },
      { v: 'Не знаю — нужна консультация', Ico: IcoClock } ] },
    { key: 'place', q: 'Где будете использовать?', options: [
      { v: 'Склад' }, { v: 'Магазин / торговый зал' }, { v: 'Производство' }, { v: 'Архив / офис' }, { v: 'Маркетплейс (склад селлера)' }, { v: 'Другое' } ] },
    { key: 'load', q: 'Нагрузка на ярус?', options: [
      { v: 'до 300 кг' }, { v: '300–800 кг' }, { v: '800–1500 кг' }, { v: 'до 4 тонн' }, { v: 'Не знаю' } ] },
    { key: 'volume', q: 'Примерный объём?', options: [
      { v: '1–5 секций' }, { v: '5–20 секций' }, { v: '20–50 секций' }, { v: '50+ секций / большой склад' }, { v: 'Не знаю' } ] },
  ],
  uz: [
    { key: 'type', q: 'Qanday turdagi stellaj kerak?', options: [
      { v: 'Palletli (Mega)', Ico: IcoPallet }, { v: 'Oʻrta yuklamali', Ico: IcoLayers },
      { v: 'Arxiv', Ico: IcoArchive }, { v: 'Savdo', Ico: IcoShop },
      { v: 'Bilmayman — konsultatsiya kerak', Ico: IcoClock } ] },
    { key: 'place', q: 'Qayerda foydalanasiz?', options: [
      { v: 'Ombor' }, { v: 'Doʻkon / savdo zali' }, { v: 'Ishlab chiqarish' }, { v: 'Arxiv / ofis' }, { v: 'Marketpleys (sotuvchi ombori)' }, { v: 'Boshqa' } ] },
    { key: 'load', q: 'Har bir qavatga yuklama?', options: [
      { v: '300 kg gacha' }, { v: '300–800 kg' }, { v: '800–1500 kg' }, { v: '4 tonnagacha' }, { v: 'Bilmayman' } ] },
    { key: 'volume', q: 'Taxminiy hajm?', options: [
      { v: '1–5 seksiya' }, { v: '5–20 seksiya' }, { v: '20–50 seksiya' }, { v: '50+ seksiya / katta ombor' }, { v: 'Bilmayman' } ] },
  ],
};

const CT = {
  ru: { step: 'Шаг', of: 'из', back: '← Назад', contactQ: 'Куда прислать расчёт?',
    contactSub: 'Оставьте телефон — менеджер посчитает стоимость и ответит за 5 минут. Ни к чему не обязывает.',
    name: 'Ваше имя', phone: 'Телефон *', submit: 'Получить расчёт', sending: 'Отправляем…',
    okTitle: 'Заявка принята!', okText: 'Менеджер подготовит расчёт и свяжется с вами — обычно отвечаем в течение 5 минут. Замер и проект — бесплатно, за 24 часа.',
    callOr: 'Или позвоните:', err: 'Ошибка. Позвоните:', consent: 'Нажимая кнопку, вы соглашаетесь на обработку персональных данных' },
  uz: { step: 'Bosqich', of: '/', back: '← Orqaga', contactQ: 'Hisobni qayerga yuboraylik?',
    contactSub: 'Telefon qoldiring — menejer narxni hisoblab, 5 daqiqada javob beradi. Hech narsaga majbur qilmaydi.',
    name: 'Ismingiz', phone: 'Telefon *', submit: 'Hisobni olish', sending: 'Yuborilmoqda…',
    okTitle: 'Ariza qabul qilindi!', okText: 'Menejer hisob-kitobni tayyorlab, siz bilan bogʻlanadi — odatda 5 daqiqada javob beramiz. Oʻlchov va loyiha — bepul, 24 soatda.',
    callOr: 'Yoki qoʻngʻiroq qiling:', err: 'Xatolik. Qoʻngʻiroq qiling:', consent: 'Tugmani bosish orqali shaxsiy maʼlumotlarni qayta ishlashga rozilik bildirasiz' },
};

export default function Calculator({ lang = 'ru' }) {
  const L = lang === 'uz' ? 'uz' : 'ru';
  const STEPS = STEPS_BY_LANG[L];
  const c = CT[L];
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
        <h3 className="font-display font-medium text-2xl text-navy-800">{c.okTitle}</h3>
        <p className="text-slate-600 mt-2 max-w-md mx-auto">{c.okText}</p>
        <a href={`tel:${SITE.phoneMain}`} className="inline-flex mt-5 items-center gap-2 text-navy-700 font-semibold hover:text-sky-600">
          {c.callOr} {SITE.phoneMainHuman}
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
            {c.step} {Math.min(step + 1, total)} {c.of} {total}
          </span>
          {step > 0 && state !== 'sending' && (
            <button onClick={() => setStep((s) => s - 1)} className="text-sm text-slate-400 hover:text-navy-700">{c.back}</button>
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
                  className={`flex items-center gap-3 text-left rounded-xl border px-4 py-4 transition ${
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
            <h3 className="font-display font-medium text-xl sm:text-2xl text-navy-800">{c.contactQ}</h3>
            <p className="text-slate-500 text-sm mt-2">{c.contactSub}</p>
            <div className="mt-5 space-y-3">
              <input
                value={contact.name}
                onChange={(e) => setContact({ ...contact, name: e.target.value })}
                placeholder={c.name}
                className="w-full bg-cloud-50 border border-cloud-200 rounded-xl px-4 py-3 text-ink outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 placeholder:text-slate-400"
              />
              <input
                value={contact.phone}
                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                required
                type="tel"
                placeholder={c.phone}
                className="w-full bg-cloud-50 border border-cloud-200 rounded-xl px-4 py-3 text-ink outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 placeholder:text-slate-400"
              />
            </div>
            <button
              disabled={state === 'sending'}
              className="w-full mt-4 bg-brand-grad text-white font-bold py-4 rounded-xl shadow-glow hover:brightness-110 disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {state === 'sending' ? c.sending : <>{c.submit} <IcoArrow className="w-5 h-5" /></>}
            </button>
            {state === 'err' && <p className="text-red-600 text-sm mt-2 text-center">{c.err} {SITE.phoneMainHuman}</p>}
            <p className="text-slate-400 text-xs mt-3 text-center">{c.consent}</p>
          </form>
        )}
      </div>
    </div>
  );
}
