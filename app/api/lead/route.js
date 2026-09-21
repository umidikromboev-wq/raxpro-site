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

/**
 * Send the lead to the Telegram bot as a card with status buttons.
 * @param {{ name?: string, phone: string, product?: string, message?: string }} lead
 * @returns {Promise<boolean>} true if delivered
 */
async function sendToTelegram(lead) {
  const token = process.env.TG_BOT_TOKEN;
  const chatId = process.env.LEAD_CHAT_ID;
  if (!token || !chatId) return false;

  const time = new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' });
  const text = [
    '🟠 НОВАЯ ЗАЯВКА · RAXPRO',
    '━━━━━━━━━━━━━━━━━━',
    `👤 Имя: ${lead.name || '—'}`,
    `📞 Телефон: ${lead.phone}`,
    lead.product ? `📦 Тип: ${lead.product}` : null,
    lead.message ? `📝 ${lead.message}` : null,
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
  return Boolean(data.ok);
}

/**
 * Create the lead in Bitrix24 CRM via an incoming webhook (crm.lead.add).
 * The webhook URL is a secret and must come from BITRIX_WEBHOOK_URL.
 * @param {{ name?: string, phone: string, product?: string, message?: string }} lead
 * @returns {Promise<boolean>} true if the lead was created
 */
async function sendToBitrix(lead) {
  const base = process.env.BITRIX_WEBHOOK_URL;
  if (!base) return false;

  const url = `${base.replace(/\/$/, '')}/crm.lead.add.json`;
  const comments = [
    lead.product ? `Тип стеллажа: ${lead.product}` : null,
    lead.message ? `Сообщение: ${lead.message}` : null,
    'Источник: сайт raxpro.uz',
  ].filter(Boolean).join('\n');

  const fields = {
    TITLE: `Заявка с сайта RAXPRO — ${lead.name || lead.phone}`,
    NAME: lead.name || '',
    SOURCE_ID: 'WEB',
    SOURCE_DESCRIPTION: 'Сайт raxpro.uz',
    COMMENTS: comments,
    PHONE: [{ VALUE: lead.phone, VALUE_TYPE: 'WORK' }],
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields, params: { REGISTER_SONET_EVENT: 'Y' } }),
  });
  const data = await res.json();
  return Boolean(data.result);
}

const MAX_FILE = 10 * 1024 * 1024;
const FILE_TYPES = /^(image\/(jpeg|png|webp|heic|heif)|application\/pdf)$/;

/**
 * Forward the customer's photo or drawing to the same Telegram chat as a document,
 * so the manager sees the room next to the lead card. Failure here never blocks the lead.
 * @param {File} file
 * @param {{ name?: string, phone: string }} lead
 */
async function sendFileToTelegram(file, lead) {
  const token = process.env.TG_BOT_TOKEN;
  const chatId = process.env.LEAD_CHAT_ID;
  if (!token || !chatId || !file) return false;
  const fd = new FormData();
  fd.append('chat_id', chatId);
  fd.append('caption', `📐 Помещение к заявке: ${lead.name || '—'} · ${lead.phone}`);
  fd.append('document', file, file.name || 'room');
  const res = await fetch(`https://api.telegram.org/bot${token}/sendDocument`, { method: 'POST', body: fd });
  const data = await res.json();
  return Boolean(data.ok);
}

/** Lead body arrives as JSON from the plain form or as multipart when a file is attached. */
async function readLead(req) {
  const type = req.headers.get('content-type') || '';
  if (type.includes('multipart/form-data')) {
    const fd = await req.formData();
    const raw = fd.get('file');
    const file = raw && typeof raw === 'object' && raw.size > 0 && raw.size <= MAX_FILE && FILE_TYPES.test(raw.type) ? raw : null;
    return {
      name: String(fd.get('name') || ''),
      phone: String(fd.get('phone') || ''),
      product: String(fd.get('product') || ''),
      message: String(fd.get('message') || ''),
      file,
    };
  }
  const { name, phone, product, message } = await req.json();
  return { name, phone, product, message, file: null };
}

export async function POST(req) {
  try {
    const { name, phone, product, message, file } = await readLead(req);
    if (!phone || String(phone).trim().length < 5) {
      return Response.json({ error: 'phone required' }, { status: 400 });
    }

    const lead = { name, phone, product, message: String(message || '').slice(0, 3000) };

    // Deliver to both destinations independently so one failure never loses a lead.
    const [tg, bx] = await Promise.allSettled([
      sendToTelegram(lead),
      sendToBitrix(lead),
    ]);
    if (file) await sendFileToTelegram(file, lead).catch(() => false);
    const telegramOk = tg.status === 'fulfilled' && tg.value === true;
    const bitrixOk = bx.status === 'fulfilled' && bx.value === true;

    if (!telegramOk && !bitrixOk) {
      return Response.json({ error: 'delivery failed' }, { status: 502 });
    }

    return Response.json({ ok: true, telegram: telegramOk, bitrix: bitrixOk });
  } catch (e) {
    return Response.json({ error: 'failed' }, { status: 500 });
  }
}
