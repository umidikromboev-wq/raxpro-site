'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { fmtSum } from '@/lib/rack/pricing';
import { ActionButton, Msg, api, plural } from './ui';

// Реестр выпущенных КП. До этого документ жил в localStorage браузера:
// закрыл вкладку — потерял, ушёл сотрудник — ушли и его предложения.

const STATUS = {
  draft: { label: 'Черновик', dot: '' },
  issued: { label: 'Отправлено', dot: 'issued' },
  won: { label: 'Выиграно', dot: 'won' },
  lost: { label: 'Проиграно', dot: 'lost' },
};

export default function Registry({ user, onOpen }) {
  const [docs, setDocs] = useState(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const load = useCallback(async () => {
    setError('');
    try {
      const data = await api('/api/kp/docs');
      setDocs(data.docs || []);
    } catch (e) {
      setDocs([]);
      setError(e.message);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (docs || []).filter((d) => {
      if (filter === 'mine') {
        if (d.authorId !== user.id) return false;
      } else if (filter !== 'all' && d.status !== filter) {
        return false;
      }
      if (!q) return true;
      return `${d.client} ${d.number} ${d.productName} ${d.authorName}`.toLowerCase().includes(q);
    });
  }, [docs, query, filter, user.id]);

  const sum = shown.reduce((s, d) => s + (d.total || 0), 0);

  async function openDoc(id) {
    const data = await api(`/api/kp/docs/${id}`);
    onOpen(data.doc);
    return 'Открыто';
  }

  async function changeStatus(id, status) {
    await api(`/api/kp/docs/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
    setDocs((list) => list.map((d) => (d.id === id ? { ...d, status } : d)));
  }

  async function remove(id) {
    await api(`/api/kp/docs/${id}`, { method: 'DELETE' });
    setDocs((list) => list.filter((d) => d.id !== id));
    return 'Удалено';
  }

  return (
    <main style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(14px, 3vw, 26px)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <p className="kp-label">Реестр</p>
          <h1 style={{ margin: 0, fontSize: 'clamp(22px, 3vw, 32px)', letterSpacing: '-0.025em', lineHeight: 1.1 }}>
            Коммерческие предложения
          </h1>
          {docs && (
            <p style={{ margin: '8px 0 0', fontSize: 12.5, color: 'var(--muted)' }}>
              {shown.length} {plural(shown.length, 'документ', 'документа', 'документов')} · на сумму {fmtSum(sum)}
            </p>
          )}
        </div>
        <button className="kp-btn kp-btn--ghost kp-btn--sm" onClick={load}>Обновить</button>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 18 }}>
        <input
          className="inp"
          style={{ maxWidth: 280 }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Клиент, номер, продукт"
          aria-label="Поиск по реестру"
        />
        <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {[['all', 'Все'], ['mine', 'Мои'], ['draft', 'Черновики'], ['issued', 'Отправленные'], ['won', 'Выигранные']].map(
            ([id, label]) => (
              <button
                key={id}
                className="kp-tab"
                aria-selected={filter === id}
                onClick={() => setFilter(id)}
              >
                {label}
              </button>
            )
          )}
        </div>
      </div>

      {error && <Msg tone="bad" style={{ marginTop: 14 }}>{error}</Msg>}

      <div className="kp-panel" style={{ marginTop: 16 }}>
        {docs === null && <p style={{ padding: 20, fontSize: 12.5, color: 'var(--muted)' }}>Открываю реестр…</p>}

        {docs !== null && shown.length === 0 && (
          <div style={{ padding: '34px 20px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 14 }}>
              {docs.length === 0 ? 'Пока ни одного КП' : 'Ничего не нашлось по этому запросу'}
            </p>
            <p style={{ margin: '8px 0 0', fontSize: 12.5, color: 'var(--muted)' }}>
              {docs.length === 0
                ? 'Соберите документ во вкладке «Документ» и нажмите «Сохранить в реестр».'
                : 'Измените запрос или снимите фильтр.'}
            </p>
          </div>
        )}

        <div className="kp-rows">
          {shown.map((d, i) => (
            <div className="kp-row" key={d.id} style={{ '--row-delay': `${Math.min(i, 12) * 28}ms` }}>
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 500, letterSpacing: '-0.01em' }}>{d.client}</p>
                <p style={{ margin: '3px 0 0', fontSize: 11.5, color: 'var(--muted)' }}>
                  {d.productName} · {d.number}
                </p>
              </div>

              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>{fmtSum(d.total)}</p>
                <p style={{ margin: '3px 0 0', fontSize: 11.5, color: 'var(--muted)' }}>
                  {d.positions != null ? `${d.positions} паллето-мест · ` : ''}
                  {d.authorName}
                </p>
              </div>

              <div>
                <label className="kp-label" htmlFor={`st-${d.id}`} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className={`kp-dot kp-dot--${STATUS[d.status]?.dot || ''}`} />
                  Статус
                </label>
                <select
                  id={`st-${d.id}`}
                  className="inp"
                  value={d.status}
                  onChange={(e) => changeStatus(d.id, e.target.value).catch((err) => setError(err.message))}
                >
                  {Object.entries(STATUS).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <ActionButton size="sm" onClick={() => openDoc(d.id)} busyLabel="Открываю…" onError={setError}>
                  Открыть
                </ActionButton>
                {(d.authorId === user.id || user.role === 'owner') && (
                  <ActionButton
                    size="sm"
                    variant="danger"
                    onClick={() => remove(d.id)}
                    busyLabel="Удаляю…"
                    onError={setError}
                  >
                    Удалить
                  </ActionButton>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p style={{ marginTop: 12, fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.5 }}>
        В реестре хранится ввод формы, а не готовые страницы: открытое через год КП пересчитается
        тем же ядром и покажет ту же сумму, что и в день выпуска. Дату документа при этом
        генератор не меняет.
      </p>
    </main>
  );
}
