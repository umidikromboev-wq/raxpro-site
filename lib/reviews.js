// Клиентские отзывы. Тексты — дословные цитаты из переписок в @RaxPro_otziv,
// переведённые по смыслу. Скриншоты не публикуем: в них видны телефоны и другие
// персональные данные (требование конфиденциальности + правила Google Ads).
// Оригиналы переписок остаются в Telegram-канале отзывов.

export const REVIEWS = [
  {
    id: 'hafiza',
    name: 'Хафиза Н.',
    nameUz: 'Hafiza N.',
    role: 'Стеллажи для склада',
    roleUz: 'Ombor uchun stellajlar',
    text: 'Оплатили полностью — всё собрали и установили. Огромное спасибо, пусть ваше дело процветает.',
    textUz: 'Toʻliq toʻladik — hammasini yigʻib, oʻrnatib berishdi. Katta rahmat, baraka toping.',
  },
  {
    id: 'sklad-tashkent',
    name: 'Клиент из Ташкента',
    nameUz: 'Toshkentlik mijoz',
    role: 'Стеллажи для кладовой',
    roleUz: 'Omborxona uchun stellajlar',
    text: 'Спасибо большое, приехали и установили. Получилось даже лучше, чем я ожидал. Буду рекомендовать всем родным и друзьям.',
    textUz: 'Rahmat katta, oʻrnatib ketishdi. Kutganimdan ham zoʻr narsa ekan. Hamma qarindosh va oʻrtoqlarimga tavsiya qilaman.',
  },
  {
    id: 'shahob',
    name: 'Шахоб',
    nameUz: 'Shahob',
    role: 'Паллетные стеллажи',
    roleUz: 'Palletli stellajlar',
    text: 'Огромное спасибо. Получилось отлично — склад теперь загружен полностью.',
    textUz: 'Katta rahmat. Zoʻr boʻldi — ombor endi toʻliq ishlayapti.',
  },
  {
    id: 'nazim',
    name: 'Назим ака',
    nameUz: 'Nazim aka',
    role: 'Среднегрузовые стеллажи',
    roleUz: 'Oʻrta yuklamali stellajlar',
    text: 'Доброе утро. Товар получили, спасибо. Хотим дозаказать ещё комплект полок.',
    textUz: 'Xayrli tong. Mahsulotni oldik, rahmat. Yana bir komplekt javon buyurtma qilmoqchimiz.',
  },
  {
    id: 'montaj',
    name: 'Клиент RAXPRO',
    nameUz: 'RAXPRO mijozi',
    role: 'Торговые стеллажи',
    roleUz: 'Savdo stellajlari',
    text: 'Стеллажи уже установили — да, всё понравилось. Спасибо большое за работу.',
    textUz: 'Stellajlar oʻrnatildi — ha, hammasi yoqdi. Ishingiz uchun katta rahmat.',
  },
  {
    id: 'povtor',
    name: 'Постоянный клиент',
    nameUz: 'Doimiy mijoz',
    role: 'Повторный заказ',
    roleUz: 'Takroriy buyurtma',
    text: 'Спасибо большое. Обязательно порекомендую вас — будем работать дальше.',
    textUz: 'Katta rahmat. Albatta tavsiya qilaman — yana hamkorlik qilamiz.',
  },
];

/** @returns {{name: string, role: string, text: string, id: string}} */
export function localizeReview(r, lang) {
  return lang === 'uz'
    ? { id: r.id, name: r.nameUz, role: r.roleUz, text: r.textUz }
    : { id: r.id, name: r.name, role: r.role, text: r.text };
}
