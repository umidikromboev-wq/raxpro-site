export const runtime = 'nodejs';

const STATUS = {
  'st:new': '🟠 Новый',
  'st:work': '🔵 В работе',
  'st:call': '📞 Созвон',
  'st:deal': '✅ Сделка',
  'st:reject': '❌ Отказ',
};

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

async function tg(token, method, body) {
  return fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function POST(req) {
  const token = process.env.TG_BOT_TOKEN;
  const secret = process.env.TG_WEBHOOK_SECRET;

  // защита: Telegram присылает секрет в заголовке
  if (secret && req.headers.get('x-telegram-bot-api-secret-token') !== secret) {
    return new Response('forbidden', { status: 403 });
  }

  try {
    const update = await req.json();
    const cb = update.callback_query;
    if (!token || !cb || !cb.data || !STATUS[cb.data]) {
      return Response.json({ ok: true });
    }

    const label = STATUS[cb.data];
    const who = cb.from?.first_name || 'менеджер';
    const time = new Date().toLocaleString('ru-RU', {
      timeZone: 'Asia/Tashkent',
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
    });

    const lines = (cb.message?.text || '').split('\n');
    const idx = lines.findIndex((l) => l.startsWith('Статус:'));
    const statusLine =
      cb.data === 'st:new'
        ? 'Статус: 🟠 Новый'
        : `Статус: ${label} · ${who} · ${time}`;
    if (idx >= 0) lines[idx] = statusLine;
    else lines.push(statusLine);

    await tg(token, 'editMessageText', {
      chat_id: cb.message.chat.id,
      message_id: cb.message.message_id,
      text: lines.join('\n'),
      reply_markup: STATUS_KEYBOARD,
    });

    await tg(token, 'answerCallbackQuery', {
      callback_query_id: cb.id,
      text: `Статус: ${label}`,
    });

    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ ok: true });
  }
}

export async function GET() {
  return Response.json({ ok: true, service: 'raxpro leads bot webhook' });
}
