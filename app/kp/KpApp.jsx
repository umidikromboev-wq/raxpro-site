'use client';

import { useCallback, useEffect, useState } from 'react';
import KpGenerator from './KpGenerator';
import Registry from './Registry';
import Keys from './Keys';
import Team from './Team';
import { api } from './ui';

// Кабинет целиком. Одна страница, четыре режима — так у сотрудника нет
// состояния «я где-то не там»: реестр, документ, ключи и люди всегда рядом.

const TABS = [
  { id: 'doc', label: 'Документ' },
  { id: 'registry', label: 'Реестр' },
  { id: 'keys', label: 'Ключи ИИ' },
  { id: 'team', label: 'Сотрудники' },
];

export default function KpApp({ user }) {
  const [tab, setTab] = useState('doc');
  const [openDoc, setOpenDoc] = useState(null);
  const [openNonce, setOpenNonce] = useState(0);
  const [keys, setKeys] = useState({ anthropic: { connected: false }, google: { connected: false } });
  const [choices, setChoices] = useState({ anthropic: [], google: [] });

  const loadKeys = useCallback(async () => {
    try {
      const data = await api('/api/kp/settings');
      setKeys({ anthropic: data.anthropic, google: data.google });
      if (data.choices) setChoices(data.choices);
    } catch {
      // Отсутствие настроек не должно ломать вход: кабинет работает и без ИИ.
    }
  }, []);

  useEffect(() => { loadKeys(); }, [loadKeys]);

  const openInEditor = useCallback((doc) => {
    setOpenDoc(doc);
    setOpenNonce((n) => n + 1);
    setTab('doc');
  }, []);

  async function logout() {
    try {
      await api('/api/kp/auth', { method: 'DELETE' });
    } finally {
      location.reload();
    }
  }

  return (
    <div className="kp-app">
      <header className="kp-topbar kp-app__chrome">
        <p className="kp-brand">
          RAX PRO
          <small>Кабинет КП</small>
        </p>

        <nav className="kp-tabs" role="tablist" aria-label="Разделы кабинета">
          {TABS.filter((t) => t.id !== 'team' || user.role === 'owner').map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              className="kp-tab"
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="kp-badge" title={user.role === 'owner' ? 'Владелец кабинета' : 'Менеджер'}>
            {user.name}
          </span>
          <button className="kp-btn kp-btn--ghost kp-btn--sm" onClick={logout}>Выйти</button>
        </div>
      </header>

      <div hidden={tab !== 'doc'}>
        <KpGenerator
          user={user}
          keys={keys}
          openDoc={openDoc}
          openNonce={openNonce}
          onSavedToRegistry={() => {}}
          onNeedKeys={() => setTab('keys')}
        />
      </div>

      {tab === 'registry' && <Registry user={user} onOpen={openInEditor} />}
      {tab === 'keys' && <Keys user={user} keys={keys} choices={choices} onChanged={loadKeys} />}
      {tab === 'team' && user.role === 'owner' && <Team user={user} />}
    </div>
  );
}
