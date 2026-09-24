// Посадочные страницы по структуре Prostellaj (ТЗ 24.09.2026).
// Главную и DIRECTIONS не трогаем: главная рендерит карточки из DIRECTIONS,
// поэтому новые страницы живут в своём реестре.
import { RETAIL_LANDINGS } from "./retail";

export const LANDINGS = [...RETAIL_LANDINGS];

export function getLanding(path) {
  return LANDINGS.find((l) => l.path === path) || null;
}

export function retailSubs() {
  return RETAIL_LANDINGS;
}

export const LANDING_UI = {
  ru: {
    home: "Главная",
    dirs: "Стеллажи",
    trade: "Торговые стеллажи",
    price: "Цена по проекту · замер бесплатно",
    cta: "Рассчитать стоимость",
    cases: "Реализованные проекты",
    casesText: "Объекты, где стеллажи RAXPRO уже работают.",
    points: "Что важно именно для вашего магазина",
    specs: "Параметры",
    products: "Готовые позиции в каталоге",
    toProduct: "Смотреть",
    others: "Другие виды торговых стеллажей",
    reviews: "Отзывы клиентов",
    reviewsText: "Видео и слова владельцев складов и магазинов.",
    faq: "Частые вопросы",
    formTitle: "Посчитаем стеллажи под ваш зал",
    formText: "Оставьте телефон — менеджер перезвонит в рабочее время, уточнит размеры и назначит бесплатный замер.",
    hubTitle: "Все виды стеллажей",
    hubText: "Складские и торговые стеллажи со склада в Ташкенте: монтаж, гарантия 10 лет по договору.",
    hubTrade: "Торговые стеллажи по типу магазина",
  },
  uz: {
    home: "Bosh sahifa",
    dirs: "Stellajlar",
    trade: "Savdo stellajlari",
    price: "Narx loyiha boʻyicha · oʻlchov bepul",
    cta: "Narxini hisoblash",
    cases: "Amalga oshirilgan loyihalar",
    casesText: "RAXPRO stellajlari allaqachon ishlayotgan obyektlar.",
    points: "Aynan sizning doʻkoningiz uchun nima muhim",
    specs: "Parametrlar",
    products: "Katalogdagi tayyor pozitsiyalar",
    toProduct: "Koʻrish",
    others: "Savdo stellajlarining boshqa turlari",
    reviews: "Mijozlar fikrlari",
    reviewsText: "Ombor va doʻkon egalarining videolari va soʻzlari.",
    faq: "Koʻp beriladigan savollar",
    formTitle: "Zalingiz uchun stellajlarni hisoblaymiz",
    formText: "Telefon raqamingizni qoldiring — menejer ish vaqtida qoʻngʻiroq qiladi, oʻlchamlarni aniqlaydi va bepul oʻlchovni belgilaydi.",
    hubTitle: "Stellajlarning barcha turlari",
    hubText: "Toshkentdagi ombordan ombor va savdo stellajlari: oʻrnatish, shartnoma boʻyicha 10 yil kafolat.",
    hubTrade: "Doʻkon turi boʻyicha savdo stellajlari",
  },
};
