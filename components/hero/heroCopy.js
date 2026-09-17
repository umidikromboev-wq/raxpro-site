// Тексты скролл-героя. Все факты и цифры — только те, что уже опубликованы
// на raxpro.uz (lib/i18n.js, lib/directions.js). Новых чисел здесь не бывает;
// единственное расчётное значение — паллето-места показанной модели,
// его подставляет сцена и подписывает как расчёт.

export const HERO_COPY = {
  ru: {
    eyebrow: "Системы хранения · Ташкент",
    title: "Правильный проект стеллажа экономит вам деньги",
    text:
      "Замеряем, проектируем и монтируем бесплатно по Ташкенту. Листайте — покажем, как это работает.",
    cta1: "Бесплатный замер за 24 часа",
    cta2: "Смотреть направления",
    scrollHint: "Листайте",
    stages: {
      draft: {
        kicker: "Замер и проект · бесплатно",
        title: "Проект до покупки — деньги остаются у вас",
        facts: [
          { n: "24 ч", l: "замер и проект бесплатно" },
          { n: "1000+", l: "реализованных проектов" },
          { n: "0 сум", l: "выезд, замер и монтаж по Ташкенту" },
        ],
      },
      build: {
        kicker: "Конструкция",
        title: "Металл 1 сорта, который служит десятилетиями",
        facts: [
          { n: "до 4 т", l: "нагрузка на ярус" },
          { n: "Zn + RAL", l: "оцинковка и порошковая краска" },
          { n: "10 лет", l: "гарантии по документу — единственные на рынке" },
        ],
      },
      load: {
        kicker: "Вместимость",
        title: "Каждый ярус — товар, который иначе лежал бы на полу",
        facts: [
          { n: "{positions}", l: "паллето-мест в этой модели (расчёт)" },
          { n: "+60 %", l: "плотность хранения в системах Drive-in" },
          { n: "100 кг – 4 т", l: "под любой товар" },
        ],
      },
    },
  },
  uz: {
    eyebrow: "Saqlash tizimlari · Toshkent",
    title: "Toʻgʻri loyihalangan stellaj pulingizni tejaydi",
    text:
      "Toshkent boʻylab oʻlchov, loyiha va montaj bepul. Pastga suring — qanday ishlashini koʻrsatamiz.",
    cta1: "24 soatda bepul oʻlchov",
    cta2: "Yoʻnalishlarni koʻrish",
    scrollHint: "Pastga suring",
    stages: {
      draft: {
        kicker: "Oʻlchov va loyiha · bepul",
        title: "Xariddan oldingi loyiha — pul sizda qoladi",
        facts: [
          { n: "24 soat", l: "oʻlchov va loyiha bepul" },
          { n: "1000+", l: "amalga oshirilgan loyiha" },
          { n: "0 soʻm", l: "Toshkent boʻylab chiqish, oʻlchov va montaj" },
        ],
      },
      build: {
        kicker: "Konstruksiya",
        title: "Oʻn yillab xizmat qiladigan 1-nav metall",
        facts: [
          { n: "4 t gacha", l: "har bir yarusga yuk" },
          { n: "Zn + RAL", l: "rux qoplama va kukunli boʻyoq" },
          { n: "10 yil", l: "hujjat asosida kafolat — bozorda yagona" },
        ],
      },
      load: {
        kicker: "Sigʻim",
        title: "Har bir yarus — aks holda polda yotadigan tovar",
        facts: [
          { n: "{positions}", l: "ushbu modeldagi pallet oʻrni (hisob)" },
          { n: "+60 %", l: "Drive-in tizimlarida saqlash zichligi" },
          { n: "100 kg – 4 t", l: "har qanday tovar uchun" },
        ],
      },
    },
  },
};

export const STAGE_ORDER = ["draft", "build", "load"];
