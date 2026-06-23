export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const { name, phone, product, message } = await req.json();
    if (!phone || String(phone).trim().length < 5) {
      return Response.json({ error: 'phone required' }, { status: 400 });
    }
    const token = process.env.TG_BOT_TOKEN;
    const chatId = process.env.LEAD_CHAT_ID;
    const text = [
      '🟠 *Новая заявка — RAXPRO сайт*',
      `👤 Имя: ${name || '—'}`,
      `📞 Телефон: ${phone}`,
      product ? `📦 Тип: ${product}` : null,
      message ? `📝 ${message}` : null,
      `🕒 ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' })}`,
    ].filter(Boolean).join('\n');

    if (token && chatId) {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
      });
    }
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: 'failed' }, { status: 500 });
  }
}
