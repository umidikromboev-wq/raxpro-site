'use client';

import { useEffect, useState } from 'react';
import { Msg, api } from './ui';

export default function KpLogin({ ready, hasUsers }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  // Пока React не подхватил форму, «Войти» отправила бы её нативно: страница
  // перезагружалась бы без входа, и сотрудник читал бы это как сломанную
  // кнопку. Поля без name, так что пароль в адрес не утекал, но кнопка
  // всё равно молчала. Ждём монтирования явно.
  const [ready2, setReady2] = useState(false);
  useEffect(() => setReady2(true), []);

  async function submit(e) {
    e.preventDefault();
    if (!ready2) return;
    setBusy(true);
    setError('');
    try {
      await api('/api/kp/auth', {
        method: 'POST',
        body: JSON.stringify({ login, password }),
      });
      location.reload();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <main className="kp-app kp-login">
      <form onSubmit={submit}>
        <p className="kp-brand">
          RAX PRO
          <small>Кабинет коммерческих предложений</small>
        </p>

        <h1 style={{ marginTop: 22, fontSize: 22, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
          {hasUsers ? 'Вход для сотрудников' : 'Первый вход'}
        </h1>
        <p style={{ marginTop: 8, fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.5 }}>
          {hasUsers
            ? 'Инструмент содержит закупочные цены и скидки. Логин выдаёт владелец кабинета.'
            : 'Введите пароль, заданный на сервере в KP_PASSWORD, — он заведёт владельца кабинета с логином admin. После этого сотрудников заводите в разделе «Сотрудники».'}
        </p>

        {!ready && (
          <Msg tone="warn" style={{ marginTop: 16 }}>
            Кабинет не настроен: на сервере нет переменных <code>KP_SECRET</code> или{' '}
            <code>BLOB_READ_WRITE_TOKEN</code>. Добавьте их в Vercel и передеплойте.
          </Msg>
        )}

        {hasUsers && (
          <div style={{ marginTop: 18 }}>
            <label className="kp-label" htmlFor="kp-login">Логин</label>
            <input
              id="kp-login"
              className="inp"
              value={login}
              autoComplete="username"
              onChange={(e) => setLogin(e.target.value)}
              placeholder="admin"
            />
          </div>
        )}

        <div style={{ marginTop: 12 }}>
          <label className="kp-label" htmlFor="kp-password">Пароль</label>
          <input
            id="kp-password"
            className="inp"
            type="password"
            value={password}
            autoFocus
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <Msg tone="bad" style={{ marginTop: 12 }}>{error}</Msg>}

        <button
          className="kp-btn kp-btn--block"
          style={{ marginTop: 18 }}
          disabled={busy || !ready || !ready2}
          aria-busy={busy}
        >
          {busy && <span className="kp-spin" aria-hidden="true" />}
          {busy ? 'Проверяю…' : ready2 ? 'Войти' : 'Загружаю…'}
        </button>
      </form>
    </main>
  );
}
