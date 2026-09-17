// Таймлайн видео-героя: прогресс 0..1 → кадр секвенции и состояние текста.
// Мастер — четыре клипа по 5 с (замер → чертёж → сборка → загрузка),
// 480 кадров, поэтому границы этапов стоят на четвертях.

import { span, smoothstep } from "./timeline";

export const FRAME_COUNT = 480;
export const MOBILE_FRAME_COUNT = 240;

export const VIDEO_STAGES = {
  draft: { from: 0.25, to: 0.5 },
  build: { from: 0.5, to: 0.75 },
  load: { from: 0.75, to: 1.0 },
};

// Заголовок первого экрана уходит, как только начинается чертёж.
export const INTRO_FADE = { from: 0.03, to: 0.14 };

export function framePath(index, dir) {
  return `/seq/${dir}/f_${String(index).padStart(4, "0")}.avif`;
}

export function atlasPath(atlas, dir) {
  return `/seq/${dir}lo/a_${String(atlas).padStart(3, "0")}.avif`;
}

/** Прозрачность панели этапа: вход в первой пятой стадии, последняя остаётся. */
export function videoPanelOpacity(p, stage) {
  const s = VIDEO_STAGES[stage];
  if (!s) return 0;
  const len = s.to - s.from;
  const enter = span(p, s.from, s.from + len * 0.2);
  const leave = stage === "load" ? 1 : 1 - span(p, s.to - len * 0.08, s.to);
  return Math.min(smoothstep(enter), smoothstep(leave));
}

export function videoState(p) {
  return {
    intro: 1 - smoothstep(span(p, INTRO_FADE.from, INTRO_FADE.to)),
    panels: {
      draft: videoPanelOpacity(p, "draft"),
      build: videoPanelOpacity(p, "build"),
      load: videoPanelOpacity(p, "load"),
    },
  };
}
