export const runtime = 'nodejs';

const STATUS_KEYBOARD = {
  inline_keyboard: [
    [
      { text: '🔵 В работе', callback_data: 'st:work' },
      { text: '📞 Созвон', callback_data: 'st:call' },
    ],
    [
      { text: '✅ Сделка', callback_data: 'st:deal' },
      { text: '❌ Отказ', callback_data: 'st:reject' },
    ],
    [{ text: '🟠 Новый', callback_data: 'st:new' }],
  ],
};

export async function POST(req) {
  try {
    const { name, phone, product, message } = await req.json();
    if (!phone || String(phone).trim().length < 5) {
      return Response.json({ error: 'phone required' }, { status: 400 });
    }

    const token = process.env.TG_BOT_TOKEN;
    const chatId = process.env.LEAD_CHAT_ID;
    if (!token || !chatId) {
      return Response.json({ error: 'not configured' }, { status: 500 });
    }

    const time = new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' });
    const text = [
      '🟠 НОВАЯ ЗАЯВКА · RAXPRO',
      '━━━━━━━━━━━━━━━━━━',
      `👤 Имя: ${name || '—'}`,
      `📞 Телефон: ${phone}`,
      product ? `📦 Тип: ${product}` : null,
      message ? `📝 ${message}` : null,
      '🌐 Источник: сайт RAXPRO',
      `🕒 ${time}`,
      '━━━━━━━━━━━━━━━━━━',
      'Статус: 🟠 Новый',
    ].filter(Boolean).join('\n');

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, reply_markup: STATUS_KEYBOARD }),
    });
    const data = await res.json();
    if (!data.ok) {
      return Response.json({ error: 'delivery failed' }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: 'failed' }, { status: 500 });
  }
}
