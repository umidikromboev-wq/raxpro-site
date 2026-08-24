export const runtime = 'nodejs';

// Кабинет менеджера закрыт паролем: КП содержит закупочные цены и скидки,
// а страница живёт на публичном домене. Пароль задаётся KP_PASSWORD в Vercel.

export async function POST(req) {
  const { password } = await req.json().catch(() => ({}));
  const expected = process.env.KP_PASSWORD;

  if (!expected) {
    return Response.json({ ok: false, error: 'KP_PASSWORD не задан на сервере' }, { status: 500 });
  }
  if (typeof password !== 'string' || password !== expected) {
    return Response.json({ ok: false, error: 'Неверный пароль' }, { status: 401 });
  }

  const res = Response.json({ ok: true });
  res.headers.append(
    'Set-Cookie',
    `kp_auth=${encodeURIComponent(expected.slice(0, 8))}; Path=/kp; HttpOnly; SameSite=Lax; Max-Age=43200${
      process.env.NODE_ENV === 'production' ? '; Secure' : ''
    }`
  );
  return res;
}

export async function DELETE() {
  const res = Response.json({ ok: true });
  res.headers.append('Set-Cookie', 'kp_auth=; Path=/kp; HttpOnly; Max-Age=0');
  return res;
}
