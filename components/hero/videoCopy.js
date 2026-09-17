// Тексты видео-героя: те же панели, что у 3D-версии (heroCopy), но факты
// последней стадии другие — в видео стеллаж нарисован, а не рассчитан
// моделью, поэтому паллето-места из rackModel сюда не подставляются.
// Цифры — только те, что уже опубликованы на raxpro.uz (lib/articles.js).

import { HERO_COPY } from "./heroCopy";

const LOAD_FACTS = {
  ru: [
    { n: "до 4 т", l: "нагрузка на один ярус паллетного стеллажа" },
    { n: "+60 %", l: "плотность хранения у Drive-in против фронтальных" },
  ],
  uz: [
    { n: "4 t gacha", l: "pallet stellaji bir yarusiga yuklama" },
    { n: "+60 %", l: "Drive-in saqlash zichligi frontal stellajlarga nisbatan" },
  ],
};

const MODEL_NOTE = {
  ru: "Иллюстрация: стеллаж и загрузка показаны условно. Проект и вместимость считаются под ваш объект.",
  uz: "Namuna: stellaj va yuklama shartli koʻrsatilgan. Loyiha va sigʻim obyektingizga qarab hisoblanadi.",
};

export function videoCopy(lang) {
  const base = HERO_COPY[lang] || HERO_COPY.ru;
  const key = HERO_COPY[lang] ? lang : "ru";
  return {
    ...base,
    modelNote: MODEL_NOTE[key],
    stages: { ...base.stages, load: { ...base.stages.load, facts: LOAD_FACTS[key] } },
  };
}
