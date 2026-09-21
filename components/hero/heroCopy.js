// Capacity is an illustration calculated from rackModel, not a promised customer saving.
export const HERO_COPY = {
  ru: {
    eyebrow: 'Системы хранения · Ташкент', title: 'Стеллажи и системы хранения', titleAccent: 'полного цикла',
    text: 'Производим и монтируем стеллажи любого типа по всему Узбекистану. Нагрузка до 4 тонн · гарантия 10 лет · бесплатный замер за 24 часа.',
    cta1: 'Рассчитать стоимость за 1 минуту', cta2: 'Смотреть каталог',
    chips: ['До 300 м² под ключ за 1 день', 'Гарантия 10 лет по документу', 'Отвечаем за 5 минут', 'Рассрочка и лизинг'],
    price: 'Проекты от 1,2 млн сум · бесплатный расчёт за 24 часа',
    scrollHint: 'Листайте — соберём ваш склад',
    navigation: 'Этапы создания стеллажа', labels: ['Замер', 'Проект', 'Сборка', 'Вместимость'],
    loaded: 'мест заполнено', total: 'мест в этой модели',
    stages: {
      draft: { kicker: '01 / Проектирование', title: 'Экономия начинается\nс проекта.', text: 'Учитываем колонны, высоту и проходы. Используем пространство, за которое вы уже платите.',
        facts: [{ n: '0 сум', l: 'замер и проект по Ташкенту' }, { n: '24 ч', l: 'на подготовку бесплатного расчёта' }] },
      build: { kicker: '02 / Производство и монтаж', title: 'Прочность\nв каждой детали.', text: 'Сталь первого сорта, защитное покрытие и конструкция под вашу нагрузку. Каждая деталь — на своём месте.',
        facts: [{ n: 'до 4 т', l: 'нагрузка на ярус' }, { n: '10 лет', l: 'гарантии по документу' }] },
      load: { kicker: '03 / Готовая система', title: 'Площадь та же.\nМеста больше.', text: 'Поднимаем хранение на ярусы. Проход остаётся свободным, товар — доступным.',
        facts: [{ n: '{floor}', l: 'мест на полу под стеллажами' }, { n: '+{upper}', l: 'мест на ярусах в этой модели' }] },
    },
  },
  uz: {
    eyebrow: 'Saqlash tizimlari · Toshkent', title: 'Stellajlar va saqlash tizimlari —', titleAccent: 'toʻliq sikl',
    text: 'Butun Oʻzbekiston boʻylab istalgan turdagi stellajlarni ishlab chiqaramiz va oʻrnatamiz. Yuk koʻtarish 4 tonnagacha · 10 yil kafolat · 24 soatda bepul oʻlchov.',
    cta1: 'Narxni 1 daqiqada hisoblang', cta2: 'Katalogni koʻrish',
    chips: ['Kuniga 300 m² gacha kalit topshirish', 'Hujjat asosida 10 yil kafolat', '5 daqiqada javob beramiz', 'Boʻlib toʻlash va lizing'],
    price: 'Loyihalar 1,2 mln soʻmdan · 24 soatda bepul hisob-kitob',
    scrollHint: 'Pastga suring — omborni yigʻamiz',
    navigation: 'Stellaj yaratish bosqichlari', labels: ['Oʻlchov', 'Loyiha', 'Yigʻish', 'Sigʻim'],
    loaded: 'joy toʻldirildi', total: 'ushbu modeldagi joylar',
    stages: {
      draft: { kicker: '01 / Loyihalash', title: 'Tejash loyihadan\nboshlanadi.', text: 'Ustunlar, balandlik va yoʻlaklarni hisobga olamiz. Siz haq toʻlayotgan maydondan foydalanamiz.',
        facts: [{ n: '0 soʻm', l: 'Toshkent boʻylab oʻlchov va loyiha' }, { n: '24 soat', l: 'bepul hisobni tayyorlash' }] },
      build: { kicker: '02 / Ishlab chiqarish va montaj', title: 'Har bir detalda\nmustahkamlik.', text: 'Birinchi navli poʻlat, himoya qoplamasi va yuklamangizga mos konstruksiya. Har bir detal oʻz oʻrnida.',
        facts: [{ n: '4 t gacha', l: 'bir yarusga yuklama' }, { n: '10 yil', l: 'hujjat asosida kafolat' }] },
      load: { kicker: '03 / Tayyor tizim', title: 'Maydon oʻsha.\nJoylar koʻproq.', text: 'Tovarlarni yaruslarga joylaymiz. Yoʻlak ochiq, tovarlar esa qulay joyda qoladi.',
        facts: [{ n: '{floor}', l: 'stellajlar ostidagi pol joylari' }, { n: '+{upper}', l: 'ushbu modeldagi yarus joylari' }] },
    },
  },
};
export const STAGE_ORDER = ['draft', 'build', 'load'];
