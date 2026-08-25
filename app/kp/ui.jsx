'use client';

import { Children, cloneElement, isValidElement, useId } from 'react';

export function Panel({ title, tone = 'plain', children }) {
  const border =
    tone === 'block' ? 'border-red-400' : tone === 'warn' ? 'border-amber-400' : tone === 'ok' ? 'border-emerald-400' : 'border-cloud-300';
  return (
    <section className={`border ${border} bg-white`}>
      <h2 className="border-b border-cloud-200 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {title}
      </h2>
      <div className="space-y-3 p-3">{children}</div>
    </section>
  );
}

/** Подпись связывается с полем через for/id, а не только вложением:
 *  так поле находят и скринридер, и автотесты — вложенный label
 *  не даёт имени элементу <select>. */
export function Field({ label, children }) {
  const id = useId();
  const only = Children.only(children);
  const control =
    isValidElement(only) && (only.type === 'input' || only.type === 'select' || only.type === 'textarea')
      ? cloneElement(only, { id })
      : only;
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-[10px] uppercase tracking-wide text-slate-400">
        {label}
      </label>
      {control}
    </div>
  );
}

export function NumField({ label, value, onChange }) {
  return (
    <Field label={label}>
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} className="inp" />
    </Field>
  );
}

export function Row({ children }) {
  return <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3">{children}</div>;
}

/** Вердикт приёмки. Всегда на виду: в старом процессе ошибку замечали
 *  уже после отправки клиенту, а не до печати. */
export function Verdict({ blockers, warnings, onPrint, onPdf, pdfBusy }) {
  const blocked = blockers.length > 0;
  return (
    <div
      className={`mt-3 flex items-center gap-3 border px-3 py-2 ${
        blocked ? 'border-red-300 bg-red-50' : warnings.length ? 'border-amber-300 bg-amber-50' : 'border-emerald-300 bg-emerald-50'
      }`}
    >
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${
          blocked ? 'bg-red-500' : warnings.length ? 'bg-amber-500' : 'bg-emerald-500'
        }`}
      />
      <p className="flex-1 text-[11px] leading-tight">
        {blocked ? (
          <span className="text-red-800">
            <b>{blockers.length}</b> {plural(blockers.length, 'блокирующее замечание', 'блокирующих замечания', 'блокирующих замечаний')}
          </span>
        ) : warnings.length ? (
          <span className="text-amber-900">
            Готово к выпуску · <b>{warnings.length}</b> {plural(warnings.length, 'предупреждение', 'предупреждения', 'предупреждений')}
          </span>
        ) : (
          <span className="text-emerald-800">Готово к выпуску, замечаний нет</span>
        )}
      </p>
      <div className="flex shrink-0 gap-1.5">
        <button
          disabled={blocked || pdfBusy}
          onClick={onPdf}
          className="bg-ink px-3 py-1.5 text-[11px] text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {pdfBusy ? 'Собираю…' : 'Скачать PDF'}
        </button>
        <button
          disabled={blocked}
          onClick={onPrint}
          title="Открыть диалог печати"
          className="border border-ink px-2 py-1.5 text-[11px] text-ink transition hover:bg-cloud-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Печать
        </button>
      </div>
    </div>
  );
}

function plural(n, one, few, many) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}
