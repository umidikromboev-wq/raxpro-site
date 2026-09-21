// Capacity is an illustration calculated from rackModel, not a promised customer saving.
export const HERO_COPY = {
  ru: {
    eyebrow: 'Стеллажи под ваш бизнес', title: 'Больше товара.\nНа той же площади.',
    text: 'Спроектируем систему хранения под ваше помещение, товары и нагрузку. От первого замера до готового стеллажа.',
    cta1: 'Спроектировать склад онлайн', cta2: 'Оставить заявку',
    scrollHint: 'Листайте — соберём ваш склад', free: 'Замер и проект по Ташкенту — бесплатно',
    perPosition: 'от {price} сум за паллетоместо · расчётная, без НДС',
    introFacts: [{ n: '1000+', l: 'реализованных проектов' }, { n: 'до 4 т', l: 'нагрузка на ярус' }, { n: 'с 2021', l: 'на рынке систем хранения' }],
    navigation: 'Этапы создания стеллажа', labels: ['Замер', 'Проект', 'Сборка', 'Вместимость'],
    modelNote: 'Иллюстрация планировки. Вместимость рассчитывается под ваш объект.',
    loaded: 'мест заполнено', total: 'мест в этой модели',
    stages: {
      draft: { kicker: '01 / Проектирование', title: 'Экономия начинается\nс проекта.', text: 'Учитываем колонны, высоту и проходы. Используем пространство, за которое вы уже платите.',
        facts: [{ n: '0 сум', l: 'замер и проект по Ташкенту' }, { n: '24 ч', l: 'на подготовку бесплатного расчёта' }] },
      build: { kicker: '02 / Производство и монтаж', title: 'Прочность\nв каждой детали.', text: 'Сталь первого сорта, защитное покрытие и конструкция под вашу нагрузку. Каждая деталь — на своём месте.',
        facts: [{ n: 'Zn + RAL', l: 'оцинковка и порошковая краска' }, { n: '10 лет', l: 'гарантии по документу' }] },
      load: { kicker: '03 / Готовая система', title: 'Площадь та же.\nМеста больше.', text: 'Поднимаем хранение на ярусы. Проход остаётся свободным, товар — доступным.',
        facts: [{ n: '{floor}', l: 'мест на полу под стеллажами' }, { n: '+{upper}', l: 'мест на ярусах в этой модели' }] },
    },
  },
  uz: {
    eyebrow: 'Biznesingiz uchun stellajlar', title: 'Koʻproq tovar.\nOʻsha maydonda.',
    text: 'Xonangiz, tovarlaringiz va yuklamangizga mos saqlash tizimini loyihalaymiz. Birinchi oʻlchovdan tayyor stellajgacha.',
    cta1: 'Omborni onlayn loyihalash', cta2: 'Ariza qoldirish',
    scrollHint: 'Pastga suring — omborni yigʻamiz', free: 'Toshkent boʻylab oʻlchov va loyiha — bepul',
    perPosition: '{price} soʻmdan bir pallet oʻrni · hisobiy, QQSsiz',
    introFacts: [{ n: '1000+', l: 'amalga oshirilgan loyiha' }, { n: '4 t gacha', l: 'har bir qavatga yuklama' }, { n: '2021 dan', l: 'saqlash tizimlari bozorida' }],
    navigation: 'Stellaj yaratish bosqichlari', labels: ['Oʻlchov', 'Loyiha', 'Yigʻish', 'Sigʻim'],
    modelNote: 'Joylashuv namunasi. Sigʻim obyektga qarab hisoblanadi.', loaded: 'joy toʻldirildi', total: 'ushbu modeldagi joylar',
    stages: {
      draft: { kicker: '01 / Loyihalash', title: 'Tejash loyihadan\nboshlanadi.', text: 'Ustunlar, balandlik va yoʻlaklarni hisobga olamiz. Siz haq toʻlayotgan maydondan foydalanamiz.',
        facts: [{ n: '0 soʻm', l: 'Toshkent boʻylab oʻlchov va loyiha' }, { n: '24 soat', l: 'bepul hisobni tayyorlash' }] },
      build: { kicker: '02 / Ishlab chiqarish va montaj', title: 'Har bir detalda\nmustahkamlik.', text: 'Birinchi navli poʻlat, himoya qoplamasi va yuklamangizga mos konstruksiya. Har bir detal oʻz oʻrnida.',
        facts: [{ n: 'Zn + RAL', l: 'rux qoplama va kukunli boʻyoq' }, { n: '10 yil', l: 'hujjat asosida kafolat' }] },
      load: { kicker: '03 / Tayyor tizim', title: 'Maydon oʻsha.\nJoylar koʻproq.', text: 'Tovarlarni yaruslarga joylaymiz. Yoʻlak ochiq, tovarlar esa qulay joyda qoladi.',
        facts: [{ n: '{floor}', l: 'stellajlar ostidagi pol joylari' }, { n: '+{upper}', l: 'ushbu modeldagi yarus joylari' }] },
    },
  },
};
export const STAGE_ORDER = ['draft', 'build', 'load'];
