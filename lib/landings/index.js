// Посадочные страницы по структуре Prostellaj (ТЗ 24.09.2026).
// Главную и DIRECTIONS не трогаем: главная рендерит карточки из DIRECTIONS,
// поэтому новые страницы живут в своём реестре.
import { RETAIL_LANDINGS } from "./retail";
import { USE_LANDINGS } from "./use";
import { SERVICE_LANDINGS } from "./service";

export const LANDINGS = [...RETAIL_LANDINGS, ...USE_LANDINGS, ...SERVICE_LANDINGS];

export function getLanding(path) {
  return LANDINGS.find((l) => l.path === path) || null;
}

export function useLandings() {
  return USE_LANDINGS;
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
    hubUse: "Стеллажи по назначению",
    useOthers: "Стеллажи для других задач",
    byGroup: {
      use: { points: "Что важно для этой задачи", formTitle: "Посчитаем стеллажи под ваше помещение" },
      type: { points: "Как это устроено", formTitle: "Рассчитаем мезонин под ваш склад", others: "Другие виды стеллажей" },
      service: { points: "Как мы монтируем", price: "По Ташкенту — бесплатно", cta: "Оставить заявку", formTitle: "Назначим замер и монтаж" },
      buyers: { points: "Как устроена гарантия", price: "10 лет по договору", cta: "Задать вопрос", formTitle: "Остались вопросы по гарантии?" },
    },
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
    products: "Katalogdagi tayyor mahsulotlar",
    toProduct: "Koʻrish",
    others: "Savdo stellajlarining boshqa turlari",
    reviews: "Mijozlar fikrlari",
    reviewsText: "Ombor va doʻkon egalarining videolari va soʻzlari.",
    faq: "Koʻp beriladigan savollar",
    formTitle: "Zalingiz uchun stellajlarni hisoblaymiz",
    formText: "Telefon raqamingizni qoldiring — menejer ish vaqtida qoʻngʻiroq qiladi, oʻlchamlarni aniqlaydi va bepul oʻlchovni belgilaydi.",
    hubTitle: "Stellajlarning barcha turlari",
    hubText: "Toshkentdagi omborimizdan ombor va savdo stellajlari: montaj, shartnoma boʻyicha 10 yil kafolat.",
    hubTrade: "Doʻkon turi boʻyicha savdo stellajlari",
    hubUse: "Vazifasi boʻyicha stellajlar",
    useOthers: "Boshqa vazifalar uchun stellajlar",
    byGroup: {
      use: { points: "Bu vazifa uchun nima muhim", formTitle: "Xonangiz uchun stellajlarni hisoblaymiz" },
      type: { points: "Qanday tuzilgan", formTitle: "Omboringiz uchun mezoninni hisoblaymiz", others: "Stellajlarning boshqa turlari" },
      service: { points: "Qanday montaj qilamiz", price: "Toshkent boʻylab — bepul", cta: "Ariza qoldirish", formTitle: "Oʻlchov va montajni belgilaymiz" },
      buyers: { points: "Kafolat qanday ishlaydi", price: "Shartnoma boʻyicha 10 yil", cta: "Savol berish", formTitle: "Kafolat boʻyicha savollar qoldimi?" },
    },
  },
};
