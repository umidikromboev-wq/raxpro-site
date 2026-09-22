// Рабочие часы RaxPro: Пн–Сб 9:00–18:00 по Ташкенту (UTC+5, без перевода часов).
// Используется формой заявки: «ответим за 5 минут» показываем только в эти часы.

const TZ = 'Asia/Tashkent';
const OPEN_HOUR = 9;
const CLOSE_HOUR = 18;
const SUNDAY = 0;
const SATURDAY = 6;

function tashkentParts(date) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: TZ, hour12: false, weekday: 'short', hour: 'numeric' })
    .formatToParts(date)
    .reduce((acc, p) => ({ ...acc, [p.type]: p.value }), {});
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.weekday);
  const hour = Number(parts.hour) % 24;
  return { weekday, hour };
}

export function isWorkingHours(date = new Date()) {
  const { weekday, hour } = tashkentParts(date);
  if (weekday === SUNDAY) return false;
  return hour >= OPEN_HOUR && hour < CLOSE_HOUR;
}

/** 'today' | 'tomorrow' | 'monday' — когда ответим, если сейчас нерабочее время. */
export function nextWorkingDay(date = new Date()) {
  const { weekday, hour } = tashkentParts(date);
  if (weekday === SUNDAY) return 'monday';
  if (hour < OPEN_HOUR) return 'today';
  if (weekday === SATURDAY) return 'monday';
  return 'tomorrow';
}
