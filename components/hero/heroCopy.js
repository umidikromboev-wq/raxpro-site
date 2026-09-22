// Capacity is an illustration calculated from rackModel, not a promised customer saving.
// Правила текста героя: каждый факт звучит один раз (гарантия — в описании, «5 минут» — в шапке),
// единица — паллетоместо, один срок на обещание: конструктор — 1 минута, точный расчёт — 24 ч.
export const HERO_COPY = {
  ru: {
    eyebrow: 'Стеллажи для',
    segments: [{ label: 'Склад', type: 'pallet' }, { label: 'Магазин', type: 'retail' }, { label: 'Архив-гараж', type: 'archive' }, { label: 'Набивной', href: '/napravleniya/nabivnye-stellazhi' }, { label: 'Мезонин', href: '/katalog/mezonin' }],
    title: 'Больше товара', titleAccent: 'на той же площади склада.',
    text: 'Импортные стеллажи с сертифицированного завода-партнёра: 150 тонн на складе в Ташкенте — привезём завтра. Проектируем и монтируем по всему Узбекистану. Нагрузка до 4 тонн · гарантия 10 лет по договору.',
    cta1: 'Узнать вместимость моего склада', cta2: 'Смотреть каталог',
    chips: ['150 тонн на складе — привезём завтра', 'Бесплатный замер и проект', 'Рассрочка и лизинг'],
    price: 'Проекты от 1,2 млн сум · расчёт в конструкторе за 1 минуту',
    scrollHint: 'Листайте — соберём ваш склад',
    navigation: 'Этапы создания стеллажа', labels: ['Замер', 'Проект', 'Сборка', 'Вместимость'],
    loaded: 'паллетомест занято', scale: 'Склад {room} · потолок {height}',
    stages: {
      // «Замер» показывается только на телефоне: там стадии сменяются сами, и первая не должна быть пустой
      measure: { kicker: '01 / Замер', title: 'Замер бесплатно.\nПриедем за 24 часа.', text: 'Меряем помещение, высоту, проёмы и нагрузку на пол — и сразу считаем, сколько паллет поместится.',
        facts: [{ n: '24 ч', l: 'выезд замерщика по Ташкенту' }, { n: '0 сум', l: 'замер и проект' }] },
      draft: { kicker: '02 / Проект', title: 'Экономия начинается\nс проекта.', text: 'Учитываем колонны, высоту и проходы. Используем пространство, за которое вы уже платите.',
        facts: [{ n: '0 сум', l: 'замер и проект по Ташкенту' }, { n: '24 ч', l: 'на точный расчёт после замера' }] },
      build: { kicker: '03 / Сборка', title: 'Прочность\nв каждой детали.', text: 'Сталь первого сорта, защитное покрытие и конструкция под вашу нагрузку. Каждая деталь — на своём месте.',
        facts: [{ n: 'до 4 т', l: 'нагрузка на ярус' }, { n: '10 лет', l: 'гарантии по договору' }] },
      load: { kicker: '04 / Вместимость', title: 'Площадь та же.\nТовара в {ratio} раза больше.', text: 'Склад {room} с потолком {height}: без стеллажей на полу помещается {floor} паллет, со стеллажами — {positions} паллетомест. Проход остаётся свободным.',
        facts: [{ n: '{floor}', l: 'паллет на полу без стеллажей' }, { n: '{positions}', l: 'паллетомест со стеллажами' }, { n: '×{ratio}', l: 'больше на той же площади' }] },
    },
  },
  uz: {
    eyebrow: 'Stellajlar:',
    segments: [{ label: 'Ombor', type: 'pallet' }, { label: 'Doʻkon', type: 'retail' }, { label: 'Arxiv-garaj', type: 'archive' }, { label: 'Drive-in', href: '/napravleniya/nabivnye-stellazhi' }, { label: 'Mezonin', href: '/katalog/mezonin' }],
    title: 'Oʻsha maydonda —', titleAccent: 'koʻproq tovar.',
    text: 'Sertifikatlangan hamkor zavoddan import stellajlar: Toshkent omborida 150 tonna — ertaga yetkazamiz. Butun Oʻzbekiston boʻylab loyihalaymiz va oʻrnatamiz. Yuk koʻtarish 4 tonnagacha · shartnoma boʻyicha 10 yil kafolat.',
    cta1: 'Omborim sigʻimini bilish', cta2: 'Katalogni koʻrish',
    chips: ['Omborda 150 tonna — ertaga yetkazamiz', 'Bepul oʻlchov va loyiha', 'Boʻlib toʻlash va lizing'],
    price: 'Loyihalar 1,2 mln soʻmdan · konstruktorda 1 daqiqada hisob-kitob',
    scrollHint: 'Pastga suring — omborni yigʻamiz',
    navigation: 'Stellaj yaratish bosqichlari', labels: ['Oʻlchov', 'Loyiha', 'Yigʻish', 'Sigʻim'],
    loaded: 'pallet joyi band', scale: 'Ombor {room} · shift {height}',
    stages: {
      measure: { kicker: '01 / Oʻlchov', title: 'Oʻlchov bepul.\n24 soatda kelamiz.', text: 'Xona, balandlik, oʻtish joylari va polga yuklamani oʻlchaymiz — va darhol nechta pallet sigʻishini hisoblaymiz.',
        facts: [{ n: '24 soat', l: 'Toshkent boʻylab oʻlchovchi chiqishi' }, { n: '0 soʻm', l: 'oʻlchov va loyiha' }] },
      draft: { kicker: '02 / Loyiha', title: 'Tejash loyihadan\nboshlanadi.', text: 'Ustunlar, balandlik va yoʻlaklarni hisobga olamiz. Siz haq toʻlayotgan maydondan foydalanamiz.',
        facts: [{ n: '0 soʻm', l: 'Toshkent boʻylab oʻlchov va loyiha' }, { n: '24 soat', l: 'oʻlchovdan keyin aniq hisob-kitob' }] },
      build: { kicker: '03 / Yigʻish', title: 'Har bir detalda\nmustahkamlik.', text: 'Birinchi navli poʻlat, himoya qoplamasi va yuklamangizga mos konstruksiya. Har bir detal oʻz oʻrnida.',
        facts: [{ n: '4 t gacha', l: 'bir yarusga yuklama' }, { n: '10 yil', l: 'shartnoma boʻyicha kafolat' }] },
      load: { kicker: '04 / Sigʻim', title: 'Maydon oʻsha.\nTovar {ratio} barobar koʻp.', text: '{room} ombor, shift {height}: stellajsiz polga {floor} pallet sigʻadi, stellajlar bilan — {positions} pallet joyi. Yoʻlak ochiq qoladi.',
        facts: [{ n: '{floor}', l: 'stellajsiz poldagi palletlar' }, { n: '{positions}', l: 'stellajlar bilan pallet joylari' }, { n: '×{ratio}', l: 'oʻsha maydonda koʻproq' }] },
    },
  },
};
export const STAGE_ORDER = ['draft', 'build', 'load'];
