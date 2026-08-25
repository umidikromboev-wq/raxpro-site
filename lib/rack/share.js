// Онлайн-ссылка на КП.
//
// Хранилище для этого не нужно. Документ полностью определяется несколькими
// десятками чисел: габариты помещения, геометрия, цены и условия. Раскладка
// со всеми секциями пересчитывается по ним детерминированно тем же ядром,
// что считало её у менеджера, — поэтому в ссылку едет только вход, а не
// массив из полутора сотен секций.
//
// Данные лежат во фрагменте адреса (после #). Фрагмент не уходит на сервер:
// цены клиента не попадают ни в логи Vercel, ни в реферер.

const B64URL = { '+': '-', '/': '_' };

function toBase64Url(bytes) {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/[+/]/g, (c) => B64URL[c]).replace(/=+$/, '');
}

function fromBase64Url(str) {
  const s = str.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(s + '='.repeat((4 - (s.length % 4)) % 4));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function squeeze(bytes, mode) {
  const Stream = mode === 'deflate' ? CompressionStream : DecompressionStream;
  const stream = new Blob([bytes]).stream().pipeThrough(new Stream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/** Что именно едет в ссылке. Ничего лишнего: всё остальное вычислимо. */
export function sharePayload(state) {
  const p = {
    v: 1,
    c: state.client,
    p: state.productKey,
    l: state.lang,
    g: state.geometry,
    u: state.unitPrices,
    d: state.discountPercent || 0,
    dr: state.discountReason || '',
    dn: state.discountNote || '',
    pk: state.paymentKey,
    dh: state.deliveryHours,
    n: state.extraNote || '',
    sc: state.sizeCode || '',
    fp: state.framePrice || 0,
    t: state.date || null,
  };
  // Помещение нужно только там, где раскладка считалась: по нему
  // восстанавливаются план и модель.
  if (state.room && state.hasLayout) p.r = state.room;
  return p;
}

export async function encodeShare(state) {
  const json = JSON.stringify(sharePayload(state));
  const bytes = new TextEncoder().encode(json);
  return toBase64Url(await squeeze(bytes, 'deflate'));
}

export async function decodeShare(hash) {
  const bytes = await squeeze(fromBase64Url(hash), 'inflate');
  const p = JSON.parse(new TextDecoder().decode(bytes));
  if (p.v !== 1) throw new Error('Ссылка сделана другой версией генератора');
  return {
    client: p.c,
    productKey: p.p,
    lang: p.l,
    geometry: p.g,
    unitPrices: p.u,
    discountPercent: p.d,
    discountReason: p.dr,
    discountNote: p.dn,
    paymentKey: p.pk,
    deliveryHours: p.dh,
    extraNote: p.n,
    sizeCode: p.sc,
    framePrice: p.fp,
    date: p.t,
    room: p.r || null,
  };
}
