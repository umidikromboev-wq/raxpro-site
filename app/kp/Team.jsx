'use client';

import { useCallback, useEffect, useState } from 'react';
import { ActionButton, Msg, api } from './ui';

// Сотрудники кабинета. Общий пароль на всех не давал ответить на вопрос
// «кто выпустил это КП» и заставлял менять пароль всей компании при увольнении.

export default function Team({ user }) {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ login: '', name: '', password: '', role: 'manager' });
  const [myPassword, setMyPassword] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const data = await api('/api/kp/users');
      setUsers(data.users || []);
    } catch (e) {
      setUsers([]);
      setError(e.message);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function create() {
    await api('/api/kp/users', { method: 'POST', body: JSON.stringify(form) });
    setForm({ login: '', name: '', password: '', role: 'manager' });
    await load();
    return 'Сотрудник заведён';
  }

  async function remove(id) {
    await api(`/api/kp/users?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    await load();
    return 'Удалён';
  }

  async function changeMine() {
    await api('/api/kp/users', { method: 'PATCH', body: JSON.stringify({ password: myPassword }) });
    setMyPassword('');
    return 'Пароль изменён';
  }

  return (
    <main style={{ maxWidth: 780, margin: '0 auto', padding: 'clamp(14px, 3vw, 26px)' }}>
      <p className="kp-label">Кабинет</p>
      <h1 style={{ margin: 0, fontSize: 'clamp(22px, 3vw, 32px)', letterSpacing: '-0.025em', lineHeight: 1.1 }}>
        Сотрудники
      </h1>
      <p style={{ margin: '10px 0 0', fontSize: 13, color: 'var(--muted)', lineHeight: 1.55, maxWidth: '62ch' }}>
        У каждого свой вход — в реестре видно, кто выпустил документ. Пароли хранятся
        только как необратимый хеш: восстановить чужой пароль нельзя, можно задать новый.
      </p>

      {error && <Msg tone="bad" style={{ marginTop: 16 }}>{error}</Msg>}

      <section className="kp-panel" style={{ marginTop: 20 }}>
        <div className="kp-panel__head">Кто работает в кабинете</div>
        <div className="kp-rows">
          {users === null && <p style={{ padding: 16, fontSize: 12.5, color: 'var(--muted)' }}>Загружаю…</p>}
          {users?.map((u, i) => (
            <div
              className="kp-row"
              key={u.id}
              style={{ '--row-delay': `${Math.min(i, 10) * 30}ms`, gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr) auto' }}
            >
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{u.name}</p>
                <p style={{ margin: '3px 0 0', fontSize: 11.5, color: 'var(--muted)' }}>
                  логин {u.login} · с {new Date(u.createdAt).toLocaleDateString('ru-RU')}
                </p>
              </div>
              <span className={`kp-badge ${u.role === 'owner' ? 'kp-badge--ok' : ''}`} style={{ justifySelf: 'start' }}>
                {u.role === 'owner' ? 'владелец' : 'менеджер'}
              </span>
              <div>
                {u.id !== user.id && (
                  <ActionButton size="sm" variant="danger" onClick={() => remove(u.id)} busyLabel="Удаляю…" onError={setError}>
                    Удалить
                  </ActionButton>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="kp-panel" style={{ marginTop: 16 }}>
        <div className="kp-panel__head">Завести сотрудника</div>
        <div className="kp-panel__body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 10 }}>
            <div>
              <label className="kp-label" htmlFor="nu-name">Имя</label>
              <input id="nu-name" className="inp" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ганиходжаева Шахзода" />
            </div>
            <div>
              <label className="kp-label" htmlFor="nu-login">Логин</label>
              <input id="nu-login" className="inp" value={form.login} onChange={(e) => setForm({ ...form, login: e.target.value })} placeholder="shahzoda" />
            </div>
            <div>
              <label className="kp-label" htmlFor="nu-pass">Пароль</label>
              <input id="nu-pass" className="inp" type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="не короче 8 символов" />
            </div>
            <div>
              <label className="kp-label" htmlFor="nu-role">Роль</label>
              <select id="nu-role" className="inp" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="manager">Менеджер — делает КП</option>
                <option value="owner">Владелец — ещё и ключи с людьми</option>
              </select>
            </div>
          </div>
          <ActionButton
            onClick={create}
            disabled={!form.login.trim() || form.password.length < 8}
            busyLabel="Завожу…"
            onError={setError}
          >
            Завести
          </ActionButton>
          <p style={{ margin: 0, fontSize: 11.5, color: 'var(--muted)' }}>
            Пароль показан открытым намеренно: его нужно передать сотруднику один раз,
            прочитать его потом будет уже нельзя.
          </p>
        </div>
      </section>

      <section className="kp-panel" style={{ marginTop: 16 }}>
        <div className="kp-panel__head">Мой пароль</div>
        <div className="kp-panel__body">
          <div>
            <label className="kp-label" htmlFor="my-pass">Новый пароль</label>
            <input id="my-pass" className="inp" type="password" value={myPassword} onChange={(e) => setMyPassword(e.target.value)} autoComplete="new-password" />
          </div>
          <ActionButton onClick={changeMine} disabled={myPassword.length < 8} busyLabel="Меняю…" onError={setError}>
            Сменить пароль
          </ActionButton>
        </div>
      </section>
    </main>
  );
}
