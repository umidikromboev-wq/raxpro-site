export const runtime = 'nodejs';

import { PRODUCTS, formatPrice } from '../../../lib/products';

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

const BY_SKU = Object.fromEntries(PRODUCTS.map((p) => [p.sku, p]));

/**
 * Пересобираем заказ из каталога на сервере: цены и названия берём из
 * lib/products, а из тела запроса — только артикул и количество.
 * Клиент не может прислать свою цену.
 * @param {Array<{sku?: string, qty?: number}>} raw
 * @returns {{ lines: Array<{ sku: string, name: string, qty: number, price: number }>, total: number }}
 */
function rebuildOrder(raw) {
  const lines = [];
  for (const item of Array.isArray(raw) ? raw : []) {
    const product = BY_SKU[item?.sku];
    if (!product) continue;
    const qty = Math.min(999, Math.max(1, Math.round(Number(item.qty) || 1)));
    lines.push({ sku: product.sku, name: product.ru.name, qty, price: product.price });
  }
  const total = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  return { lines, total };
}

function orderNumber(now) {
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const tail = String(Math.floor(Math.random() * 9000) + 1000);
  return `RX-${yy}${mm}${dd}-${tail}`;
}

async function sendToTelegram(order) {
  const token = process.env.TG_BOT_TOKEN;
  const chatId = process.env.LEAD_CHAT_ID;
  if (!token || !chatId) return false;

  const time = new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' });
  const positions = order.lines
    .map((l, i) => `${i + 1}. ${l.name}\n   ${l.sku} · ${l.qty} шт × ${formatPrice(l.price)} = ${formatPrice(l.price * l.qty)}`)
    .join('\n');

  const text = [
    `🛒 ЗАКАЗ ИЗ КАТАЛОГА · ${order.orderNo}`,
    '━━━━━━━━━━━━━━━━━━',
    `👤 Имя: ${order.name || '—'}`,
    `📞 Телефон: ${order.phone}`,
    order.city ? `📍 Адрес: ${order.city}` : null,
    order.comment ? `📝 ${order.comment}` : null,
    '──────────────────',
    positions,
    '──────────────────',
    `💰 Итого: ${formatPrice(order.total)}`,
    `🌐 Источник: корзина сайта (${order.lang === 'uz' ? 'UZ' : 'RU'})`,
    `🕒 ${time}`,
    '━━━━━━━━━━━━━━━━━━',
    'Статус: 🟠 Новый',
  ]
    .filter(Boolean)
    .join('\n');

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, reply_markup: STATUS_KEYBOARD }),
  });
  const data = await res.json();
  return Boolean(data.ok);
}

async function sendToBitrix(order) {
  const base = process.env.BITRIX_WEBHOOK_URL;
  if (!base) return false;

  const url = `${base.replace(/\/$/, '')}/crm.lead.add.json`;
  const comments = [
    `Заказ ${order.orderNo} из каталога сайта`,
    ...order.lines.map((l) => `${l.name} (${l.sku}) — ${l.qty} шт × ${formatPrice(l.price)}`),
    `Итого: ${formatPrice(order.total)}`,
    order.city ? `Адрес доставки: ${order.city}` : null,
    order.comment ? `Комментарий: ${order.comment}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  const fields = {
    TITLE: `Заказ ${order.orderNo} с сайта RAXPRO — ${order.name || order.phone}`,
    NAME: order.name || '',
    SOURCE_ID: 'WEB',
    SOURCE_DESCRIPTION: 'Корзина raxpro.uz',
    OPPORTUNITY: order.total,
    CURRENCY_ID: 'UZS',
    COMMENTS: comments,
    PHONE: [{ VALUE: order.phone, VALUE_TYPE: 'WORK' }],
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields, params: { REGISTER_SONET_EVENT: 'Y' } }),
  });
  const data = await res.json();
  return Boolean(data.result);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const phone = String(body.phone || '').trim();
    if (phone.length < 5) {
      return Response.json({ error: 'phone required' }, { status: 400 });
    }

    const { lines, total } = rebuildOrder(body.items);
    if (lines.length === 0) {
      return Response.json({ error: 'empty order' }, { status: 400 });
    }

    const order = {
      orderNo: orderNumber(new Date()),
      name: String(body.name || '').slice(0, 120),
      phone: phone.slice(0, 40),
      city: String(body.city || '').slice(0, 200),
      comment: String(body.comment || '').slice(0, 1000),
      lang: body.lang === 'uz' ? 'uz' : 'ru',
      lines,
      total,
    };

    // Две независимые доставки: падение одной не должно терять заказ.
    const [tg, bx] = await Promise.allSettled([sendToTelegram(order), sendToBitrix(order)]);
    const telegramOk = tg.status === 'fulfilled' && tg.value === true;
    const bitrixOk = bx.status === 'fulfilled' && bx.value === true;

    if (!telegramOk && !bitrixOk) {
      return Response.json({ error: 'delivery failed' }, { status: 502 });
    }

    return Response.json({
      ok: true,
      orderNo: order.orderNo,
      telegram: telegramOk,
      bitrix: bitrixOk,
    });
  } catch {
    return Response.json({ error: 'failed' }, { status: 500 });
  }
}
