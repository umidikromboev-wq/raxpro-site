'use client';

import { useState } from 'react';
import { ActionButton, Msg, api } from './ui';

// Ключи ИИ-сервисов компании.
//
// Продукт уезжает RaxPro, поэтому в нём нет ни одного чужого ключа: компания
// подключает свой аккаунт Anthropic и свой аккаунт Google. Ключ уходит на
// сервер один раз, проверяется живым запросом к провайдеру и ложится
// в хранилище зашифрованным. Обратно приходит только подсказка «sk-ant-…7f2a»:
// прочитать ключ из браузера нельзя даже владельцу.

const PROVIDERS = [
  {
    id: 'anthropic',
    title: 'Anthropic · Claude',
    what: 'Читает фотографию наброска из блокнота и превращает её в геометрию склада.',
    where: 'console.anthropic.com → Settings → API keys',
    href: 'https://console.anthropic.com/settings/keys',
    placeholder: 'sk-ant-api03-…',
  },
  {
    id: 'google',
    title: 'Google · Gemini',
    what: 'Собирает изображение расстановки для листа «Решение» и подстраховывает распознавание наброска, если ключа Claude нет.',
    where: 'aistudio.google.com → Get API key',
    href: 'https://aistudio.google.com/apikey',
    placeholder: 'AIza…',
  },
];

export default function Keys({ user, keys, choices, onChanged }) {
  const [error, setError] = useState('');
  const isOwner = user.role === 'owner';

  return (
    <main style={{ maxWidth: 780, margin: '0 auto', padding: 'clamp(14px, 3vw, 26px)' }}>
      <p className="kp-label">Настройки</p>
      <h1 style={{ margin: 0, fontSize: 'clamp(22px, 3vw, 32px)', letterSpacing: '-0.025em', lineHeight: 1.1 }}>
        Ключи ИИ-сервисов
      </h1>
      <p style={{ margin: '10px 0 0', fontSize: 13, color: 'var(--muted)', lineHeight: 1.55, maxWidth: '62ch' }}>
        Кабинет работает на аккаунтах RAX PRO. Ключи хранятся зашифрованными на сервере,
        в браузер не возвращаются и в исходном коде не лежат. Счета за распознавание
        и генерацию приходят напрямую вам от провайдера.
      </p>

      {!isOwner && (
        <Msg tone="warn" style={{ marginTop: 16 }}>
          Менять ключи может владелец кабинета. Здесь вы видите только их состояние.
        </Msg>
      )}
      {error && <Msg tone="bad" style={{ marginTop: 16 }}>{error}</Msg>}

      {keys?.bridge?.enabled && (
        <div className="kp-panel" style={{ marginTop: 18 }}>
          <div className="kp-panel__head">
            Временный режим — подписка владельца{' '}
            <span style={{ color: keys.bridge.alive ? 'var(--ok, #2f9e5f)' : 'var(--muted)' }}>
              · {keys.bridge.alive ? 'на связи' : 'не на связи'}
            </span>
          </div>
          <div className="kp-panel__body" style={{ gap: 8 }}>
            <p style={{ margin: 0, fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.55 }}>
              Пока своих ключей у компании нет, набросок читает и картинку собирает
              компьютер владельца на его личной подписке. Это режим показа: работает,
              пока его машина включена, и не рассчитан на нескольких менеджеров сразу.
              Как только вы подключите ключи ниже, кабинет перестанет от него зависеть.
            </p>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gap: 14, marginTop: 20 }}>
        {PROVIDERS.map((p) => (
          <ProviderCard
            key={p.id}
            provider={p}
            state={keys[p.id] || { connected: false }}
            models={choices?.[p.id] || []}
            canEdit={isOwner}
            onChanged={onChanged}
            onError={setError}
          />
        ))}
      </div>

      <div className="kp-panel" style={{ marginTop: 22 }}>
        <div className="kp-panel__head">Что будет, если ключ не подключён</div>
        <div className="kp-panel__body" style={{ gap: 8 }}>
          <p style={{ margin: 0, fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.55 }}>
            Генератор, расчёт, PDF и ссылка клиенту работают без всякого ИИ — это ядро,
            и оно ни от чего внешнего не зависит. Без ключей выключаются ровно две кнопки:
            «Прочитать набросок» и «Собрать изображение».
          </p>
        </div>
      </div>
    </main>
  );
}

function ProviderCard({ provider, state, models, canEdit, onChanged, onError }) {
  const [value, setValue] = useState('');
  const [local, setLocal] = useState('');

  const badge = !state.connected
    ? { cls: '', text: 'Не подключён' }
    : state.ok
      ? { cls: 'kp-badge--ok', text: 'Работает' }
      : { cls: 'kp-badge--bad', text: 'Не отвечает' };

  async function save() {
    const key = value.trim();
    if (!key) throw new Error('Введите ключ');
    const data = await api('/api/kp/settings', {
      method: 'POST',
      body: JSON.stringify({ provider: provider.id, key }),
    });
    setValue('');
    setLocal(data.state?.checkNote || '');
    await onChanged();
    if (data.state && data.state.ok === false) {
      throw new Error(data.state.checkNote || 'Провайдер не принял ключ');
    }
    return 'Ключ проверен';
  }

  async function recheck() {
    // Ключ мог протухнуть или упереться в лимит через месяц после подключения:
    // кнопка спрашивает провайдера заново, а не показывает старую отметку.
    const data = await api('/api/kp/settings', {
      method: 'POST',
      body: JSON.stringify({ provider: provider.id, recheck: true }),
    });
    await onChanged();
    if (data.state && data.state.ok === false) {
      throw new Error(data.state.checkNote || 'Провайдер не принял ключ');
    }
    return 'Ключ работает';
  }

  async function changeModel(model) {
    setLocal('');
    try {
      const data = await api('/api/kp/settings', {
        method: 'POST',
        body: JSON.stringify({ provider: provider.id, model }),
      });
      await onChanged();
      if (data.state && data.state.connected && data.state.ok === false) {
        onError(data.state.checkNote || 'Провайдер не принял эту модель');
      } else if (data.state?.checkNote) {
        setLocal(data.state.checkNote);
      }
    } catch (e) {
      onError(e.message);
    }
  }

  async function disconnect() {
    await api(`/api/kp/settings?provider=${provider.id}`, { method: 'DELETE' });
    await onChanged();
    return 'Отключён';
  }

  return (
    <section className="kp-panel">
      <div className="kp-panel__head" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <span>{provider.title}</span>
        <span className={`kp-badge ${badge.cls}`}>{badge.text}</span>
      </div>
      <div className="kp-panel__body">
        <p style={{ margin: 0, fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.55 }}>{provider.what}</p>

        {state.connected && (
          <div style={{ fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.6 }}>
            Ключ: <code style={{ color: 'var(--ink)' }}>{state.hint}</code>
            {state.updatedBy ? <> · подключил {state.updatedBy}</> : null}
            {state.checkedAt ? <> · проверен {new Date(state.checkedAt).toLocaleString('ru-RU')}</> : null}
            {state.checkNote ? <><br />{state.checkNote}</> : null}
          </div>
        )}

        {models.length > 0 && (
          <div>
            <label className="kp-label" htmlFor={`model-${provider.id}`}>Модель</label>
            <select
              id={`model-${provider.id}`}
              className="inp"
              value={state.model || models[0].id}
              disabled={!canEdit}
              onChange={(e) => changeModel(e.target.value)}
            >
              {models.map((m) => (
                <option key={m.id} value={m.id}>{m.title} — {m.note}</option>
              ))}
            </select>
            <p style={{ margin: '6px 0 0', fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.5 }}>
              Счёт за работу приходит вам от провайдера, поэтому выбор модели — ваш.
              После смены ключ проверяется заново: доступ к моделям у ключей разный.
            </p>
          </div>
        )}

        {canEdit && (
          <>
            <div>
              <label className="kp-label" htmlFor={`key-${provider.id}`}>
                {state.connected ? 'Заменить ключ' : 'Вставьте ключ'}
              </label>
              <input
                id={`key-${provider.id}`}
                className="inp"
                type="password"
                autoComplete="off"
                spellCheck={false}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={provider.placeholder}
              />
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <ActionButton
                onClick={save}
                disabled={!value.trim()}
                busyLabel="Проверяю у провайдера…"
                doneLabel="Ключ проверен"
                onError={onError}
              >
                Сохранить и проверить
              </ActionButton>
              {state.connected && (
                <>
                  <ActionButton variant="ghost" onClick={recheck} busyLabel="Смотрю…" onError={onError}>
                    Обновить состояние
                  </ActionButton>
                  <ActionButton variant="danger" onClick={disconnect} busyLabel="Отключаю…" onError={onError}>
                    Отключить
                  </ActionButton>
                </>
              )}
            </div>
            {local && <Msg tone="ok">{local}</Msg>}
          </>
        )}

        <p style={{ margin: 0, fontSize: 11.5, color: 'var(--muted)' }}>
          Где взять:{' '}
          <a href={provider.href} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>
            {provider.where}
          </a>
        </p>
      </div>
    </section>
  );
}
