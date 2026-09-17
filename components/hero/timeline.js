// Чистая логика скролл-героя: прогресс 0..1 → состояние каждого объекта.
// Ни three.js, ни DOM — только числа, поэтому это тестируется без браузера.
//
// Последовательность Умида, буквально: замер (играет сам до скролла) →
// белые линии проекта → падают рамы и каждая балка → появляются паллеты
// и коробки → камера отъезжает → список брендов.

export const STAGES = {
  draft: { from: 0.0, to: 0.28 },
  build: { from: 0.28, to: 0.66 },
  load: { from: 0.66, to: 0.96 },
};

// Человечки замера уходят из кадра, когда чертёж уже рисуется.
export const PEOPLE_FADE = { from: 0.05, to: 0.18 };
// Заголовок и кнопки первого экрана уступают место панелям этапов.
export const INTRO_FADE = { from: 0.02, to: 0.12 };
// Белые линии гаснут, пока на их место встают реальные детали.
export const DRAFT_FADE = { from: 0.4, to: 0.62 };

// Внутри стадии сборки: сначала рамы, потом балки.
export const BUILD_SPLIT = 0.34;

export const DROP_HEIGHT = 9; // метров над своим местом, откуда падает деталь

export function clamp01(x) {
  return x < 0 ? 0 : x > 1 ? 1 : x;
}

/** Локальный прогресс 0..1 внутри отрезка [from, to]. */
export function span(p, from, to) {
  if (to <= from) return p >= to ? 1 : 0;
  return clamp01((p - from) / (to - from));
}

export function easeOutCubic(t) {
  const x = clamp01(t);
  return 1 - Math.pow(1 - x, 3);
}

export function smoothstep(t) {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

/**
 * Каскад: у каждого из `count` элементов своё окно длиной `window` (доля от
 * общего локального прогресса). Первый стартует в 0, последний заканчивает
 * ровно в 1 — ни один элемент не остаётся недопавшим в конце стадии.
 */
export function stagger(local, index, count, window = 0.45) {
  if (count <= 1 || local >= 1) return clamp01(local);
  const w = clamp01(window);
  const start = (index / (count - 1)) * (1 - w);
  return clamp01((local - start) / w);
}

/** Смещение по Y для падающей детали: 1 → висит наверху, 0 → на месте. */
export function dropOffset(itemLocal) {
  return (1 - easeOutCubic(itemLocal)) * DROP_HEIGHT;
}

/**
 * Прозрачность текстовой панели этапа: плавно входит в первой трети стадии,
 * держится, уходит в последней десятой. Соседние панели не пересекаются.
 */
export function panelOpacity(p, stage) {
  const s = STAGES[stage];
  if (!s) return 0;
  const enter = span(p, s.from, s.from + (s.to - s.from) * 0.22);
  // Последняя панель остаётся до конца: цифры вместимости должны дожить
  // до момента, когда холст открепляется и уходит вверх.
  const leave = stage === "load" ? 1 : 1 - span(p, s.to - (s.to - s.from) * 0.1, s.to);
  return Math.min(smoothstep(enter), smoothstep(leave));
}

/** Какая стадия активна при прогрессе p (для aria и отладки). */
export function activeStage(p) {
  if (p < STAGES.build.from) return "draft";
  if (p < STAGES.load.from) return "build";
  return "load";
}

// Облёт камеры: ключевые кадры по прогрессу, между ними smoothstep.
// az — азимут (рад), el — высота (рад), dist — расстояние до цели, ty — высота цели,
// shift — сдвиг кадра в долях ширины экрана: плюс уводит сцену вправо от
// заголовка на первом экране, минус освобождает правый край под панели этапов.
const CAMERA_KEYS = [
  { p: 0.0, az: -0.95, el: 0.6, dist: 34, ty: 1.2, shift: 0.16 },
  { p: 0.28, az: -0.78, el: 0.44, dist: 27, ty: 1.8, shift: -0.08 },
  { p: 0.66, az: -0.58, el: 0.3, dist: 21, ty: 2.4, shift: -0.1 },
  { p: 0.96, az: -0.72, el: 0.28, dist: 23, ty: 2.2, shift: -0.1 },
  { p: 1.0, az: -0.86, el: 0.34, dist: 28, ty: 2.0, shift: -0.08 },
];

export function cameraAt(p) {
  const x = clamp01(p);
  let a = CAMERA_KEYS[0];
  let b = CAMERA_KEYS[CAMERA_KEYS.length - 1];
  for (let i = 0; i < CAMERA_KEYS.length - 1; i++) {
    if (x >= CAMERA_KEYS[i].p && x <= CAMERA_KEYS[i + 1].p) {
      a = CAMERA_KEYS[i];
      b = CAMERA_KEYS[i + 1];
      break;
    }
  }
  const t = smoothstep(span(x, a.p, b.p));
  const mix = (k) => a[k] + (b[k] - a[k]) * t;
  return { az: mix("az"), el: mix("el"), dist: mix("dist"), ty: mix("ty"), shift: mix("shift") };
}

/**
 * Полное состояние сцены в точке p. Сцена только раскладывает эти числа
 * по объектам, сама ничего не решает.
 */
export function sceneState(p) {
  const x = clamp01(p);
  const build = span(x, STAGES.build.from, STAGES.build.to);
  return {
    stage: activeStage(x),
    people: 1 - smoothstep(span(x, PEOPLE_FADE.from, PEOPLE_FADE.to)),
    intro: 1 - smoothstep(span(x, INTRO_FADE.from, INTRO_FADE.to)),
    draftDraw: easeOutCubic(span(x, STAGES.draft.from, STAGES.draft.to)),
    draftAlpha: 1 - smoothstep(span(x, DRAFT_FADE.from, DRAFT_FADE.to)),
    frames: span(build, 0, BUILD_SPLIT),
    beams: span(build, BUILD_SPLIT, 1),
    load: span(x, STAGES.load.from, STAGES.load.to),
    camera: cameraAt(x),
    panels: {
      draft: panelOpacity(x, "draft"),
      build: panelOpacity(x, "build"),
      load: panelOpacity(x, "load"),
    },
  };
}
