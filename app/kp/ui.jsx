'use client';

import { Children, cloneElement, isValidElement, useCallback, useId, useRef, useState } from 'react';

export function Panel({ title, tone = 'plain', children, right }) {
  const border =
    tone === 'block' ? 'rgba(179,55,44,.5)' : tone === 'warn' ? 'rgba(154,100,19,.5)' : tone === 'ok' ? 'rgba(47,122,82,.45)' : 'var(--line)';
  return (
    <section className="kp-panel" style={{ borderColor: border }}>
      <div className="kp-panel__head" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <span>{title}</span>
        {right}
      </div>
      <div className="kp-panel__body">{children}</div>
    </section>
  );
}

/** Подпись связывается с полем через for/id, а не только вложением:
 *  так поле находят и скринридер, и автотесты — вложенный label
 *  не даёт имени элементу <select>. */
export function Field({ label, hint, children }) {
  const id = useId();
  const only = Children.only(children);
  const control =
    isValidElement(only) && (only.type === 'input' || only.type === 'select' || only.type === 'textarea')
      ? cloneElement(only, { id })
      : only;
  return (
    <div>
      <label htmlFor={id} className="kp-label">{label}</label>
      {control}
      {hint ? <p className="kp-msg" style={{ marginTop: 6 }}>{hint}</p> : null}
    </div>
  );
}

export function NumField({ label, value, onChange, min, max }) {
  return (
    <Field label={label}>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="inp"
      />
    </Field>
  );
}

export function Row({ children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 10 }}>{children}</div>;
}

export function Msg({ tone = 'plain', children, style }) {
  if (!children) return null;
  return <p className={`kp-msg kp-msg--${tone}`} style={style}>{children}</p>;
}

/** Кнопка с настоящими состояниями: ожидание, успех, ошибка.
 *
 *  Сделана так, потому что кабинет уезжает клиенту: кнопка, которая ничего
 *  не отвечает на нажатие, читается как сломанная и заканчивается звонком.
 *  onClick может вернуть промис — тогда состояние ведётся само. Строка,
 *  возвращённая из onClick, становится сообщением об успехе. */
export function ActionButton({
  children,
  onClick,
  disabled,
  variant = '',
  size = '',
  block = false,
  busyLabel = 'Минуту…',
  doneLabel = 'Готово',
  title,
  onError,
}) {
  const [state, setState] = useState('idle');
  const [note, setNote] = useState('');
  const timer = useRef(null);

  const run = useCallback(async () => {
    if (state === 'busy') return;
    setState('busy');
    setNote('');
    try {
      const result = await onClick?.();
      setState('done');
      setNote(typeof result === 'string' ? result : '');
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setState('idle'), 2200);
    } catch (e) {
      setState('idle');
      const message = e?.message || 'Не получилось';
      setNote('');
      onError?.(message);
    }
  }, [onClick, state, onError]);

  const cls = [
    'kp-btn',
    variant ? `kp-btn--${variant}` : '',
    size ? `kp-btn--${size}` : '',
    block ? 'kp-btn--block' : '',
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={cls}
      onClick={run}
      disabled={disabled || state === 'busy'}
      title={title}
      aria-busy={state === 'busy'}
    >
      {state === 'busy' && <span className="kp-spin" aria-hidden="true" />}
      {state === 'busy' ? busyLabel : state === 'done' ? (note || doneLabel) : children}
    </button>
  );
}

/** Вердикт приёмки. Всегда на виду: в старом процессе ошибку замечали
 *  уже после отправки клиенту, а не до печати. */
export function Verdict({ blockers, warnings, onPrint, onPdf, onSave, saveLabel = 'Сохранить в реестр', onError }) {
  const blocked = blockers.length > 0;
  const tone = blocked ? 'bad' : warnings.length ? 'warn' : 'ok';
  return (
    <div
      style={{
        marginTop: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexWrap: 'wrap',
        border: '1px solid var(--line)',
        borderLeftWidth: 3,
        borderLeftColor: tone === 'bad' ? 'var(--bad)' : tone === 'warn' ? 'var(--warn)' : 'var(--ok)',
        background: 'var(--panel)',
        padding: '8px 10px',
      }}
    >
      <p style={{ flex: '1 1 160px', margin: 0, fontSize: 11.5, lineHeight: 1.3 }}>
        {blocked ? (
          <span style={{ color: 'var(--bad)' }}>
            <b>{blockers.length}</b>{' '}
            {plural(blockers.length, 'блокирующее замечание', 'блокирующих замечания', 'блокирующих замечаний')}
          </span>
        ) : warnings.length ? (
          <span style={{ color: 'var(--warn)' }}>
            Готово к выпуску · <b>{warnings.length}</b>{' '}
            {plural(warnings.length, 'предупреждение', 'предупреждения', 'предупреждений')}
          </span>
        ) : (
          <span style={{ color: 'var(--ok)' }}>Готово к выпуску, замечаний нет</span>
        )}
      </p>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <ActionButton size="sm" variant="ghost" onClick={onSave} busyLabel="Сохраняю…" doneLabel="Сохранено" onError={onError}>
          {saveLabel}
        </ActionButton>
        <ActionButton size="sm" disabled={blocked} onClick={onPdf} busyLabel="Собираю PDF…" doneLabel="Скачано" onError={onError}>
          Скачать PDF
        </ActionButton>
        <button type="button" className="kp-btn kp-btn--ghost kp-btn--sm" disabled={blocked} onClick={onPrint} title="Открыть диалог печати">
          Печать
        </button>
      </div>
    </div>
  );
}

export function plural(n, one, few, many) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}

/** Единая обёртка над fetch: ошибка приходит человеческим текстом,
 *  а не «Unexpected token < in JSON». */
export async function api(url, options = {}) {
  let res;
  try {
    res = await fetch(url, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    });
  } catch {
    throw new Error('Нет связи с сервером. Проверьте интернет и повторите.');
  }
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    if (!res.ok) throw new Error(`Сервер ответил ${res.status}`);
  }
  if (!res.ok) throw new Error(data.error || `Сервер ответил ${res.status}`);
  return data;
}
