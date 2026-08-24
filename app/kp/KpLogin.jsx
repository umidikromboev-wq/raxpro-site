'use client';
import { useState } from 'react';

export default function KpLogin({ configured }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const res = await fetch('/api/kp/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json().catch(() => ({}));
    if (data.ok) location.reload();
    else setError(data.error || 'Не удалось войти');
    setBusy(false);
  }

  return (
    <main className="min-h-screen grid place-items-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm border border-neutral-300 bg-white p-8">
        <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">RAX PRO</p>
        <h1 className="mt-2 text-xl font-semibold">Генератор коммерческих предложений</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Внутренний инструмент. Содержит цены и скидки — доступ по паролю.
        </p>

        {!configured && (
          <p className="mt-4 border border-amber-400 bg-amber-50 p-3 text-sm text-amber-900">
            На сервере не задан <code>KP_PASSWORD</code>. Добавьте переменную в Vercel и передеплойте.
          </p>
        )}

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          autoFocus
          className="mt-6 w-full border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-900"
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <button
          disabled={busy || !configured}
          className="mt-4 w-full bg-neutral-900 px-4 py-2 text-white disabled:opacity-40"
        >
          {busy ? 'Проверяю…' : 'Войти'}
        </button>
      </form>
    </main>
  );
}
