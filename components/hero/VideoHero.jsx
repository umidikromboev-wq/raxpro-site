'use client';

// Вариант 2 первого экрана: отрендеренное фотореалистичное видео (замер →
// чертёж → сборка → загрузка), нарезанное на кадры и промотанное скроллом.
// DOM и классы те же, что у 3D-версии (RackHero), чтобы сравнивать честно.
//
// Движение: единственный фильтр сглаживания — Lenis страницы. Холст идёт за
// прокруткой напрямую; в покое рисуемая позиция плавно доезжает до целого
// кадра (smoothstep за SETTLE_MS), а не прыгает.

import { useEffect, useRef, useState } from 'react';
import { STAGE_ORDER } from './heroCopy';
import { videoCopy } from './videoCopy';
import { FrameStore } from './seq/frameStore';
import { FRAME_COUNT, MOBILE_FRAME_COUNT, VIDEO_STAGES, atlasPath, framePath, videoState } from './videoTimeline';
import { IcoArrow } from '../Icons';

const MOBILE_QUERY = '(max-width: 1023px)';
const EAGER_FRAMES = 28;
const PREFETCH_AHEAD = 12;
const MAX_DPR = 2;
const UPGRADE_POLL_MS = 220;
/** Ожидание декодирования первого кадра после прихода байтов. */
const FIRST_FRAME_POLL_MS = 100;
const FIRST_FRAME_TRIES = 80;
/** Прокрутка не менялась столько мс → покой, начинаем доезд до целого кадра. */
const REST_MS = 90;
const SETTLE_MS = 180;
/** Доля ширины кадра, которую держим в центре при обрезке cover. */
const ANCHOR_DESKTOP = 0.5;
const ANCHOR_MOBILE = 0.6;
const STOPS = [0, VIDEO_STAGES.draft.from, VIDEO_STAGES.build.from, VIDEO_STAGES.load.from];

const smoothstep = (t) => { const x = t < 0 ? 0 : t > 1 ? 1 : t; return x * x * (3 - 2 * x); };

function drawCover(ctx, frame, width, height, anchor) {
  const scale = Math.max(width / frame.sw, height / frame.sh);
  const dw = frame.sw * scale, dh = frame.sh * scale;
  ctx.drawImage(frame.bitmap, frame.sx, frame.sy, frame.sw, frame.sh, (width - dw) * anchor, (height - dh) / 2, dw, dh);
}

export default function VideoHero({ lang = 'ru', ctaHref = '#kalkulyator', cta2Href = '#napravleniya' }) {
  const copy = videoCopy(lang);
  const sectionRef = useRef(null), canvasRef = useRef(null), introRef = useRef(null), loadRef = useRef(null);
  const panels = useRef({}), navigationRef = useRef(null);
  const storeRef = useRef(null), countRef = useRef(FRAME_COUNT), anchorRef = useRef(ANCHOR_DESKTOP);
  const [mode, setMode] = useState('static');

  // Загрузка секвенции: превью-атласы, потом полные кадры.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const isMobile = window.matchMedia(MOBILE_QUERY).matches;
    const dir = isMobile ? 'm' : 'd';
    countRef.current = isMobile ? MOBILE_FRAME_COUNT : FRAME_COUNT;
    anchorRef.current = isMobile ? ANCHOR_MOBILE : ANCHOR_DESKTOP;
    const store = new FrameStore(countRef.current, (a) => atlasPath(a, dir), (i) => framePath(i, dir));
    storeRef.current = store;
    let disposed = false;
    store.load(EAGER_FRAMES, (loaded, total) => {
      if (loadRef.current) loadRef.current.style.transform = `scaleX(${loaded / total})`;
    }).then(async () => {
      // Байты первых атласов пришли, но декодируются они чуть позже. Живой режим
      // только когда первый кадр реально готов: иначе остаёмся на постере,
      // а не показываем чёрный холст.
      for (let i = 0; i < FIRST_FRAME_TRIES && !disposed && !store.frame(0); i++) {
        await new Promise((resolve) => { setTimeout(resolve, FIRST_FRAME_POLL_MS); });
      }
      if (disposed) return;
      if (store.frame(0)) setMode('live');
      else console.warn('RAXPRO: video hero frames missing, showing the static hero.');
    })
      .catch((error) => { console.warn('RAXPRO: video hero unavailable, showing the static hero.', error); });
    return () => { disposed = true; store.destroy(); storeRef.current = null; };
  }, []);

  // Прокрутка → кадр.
  useEffect(() => {
    const canvas = canvasRef.current, section = sectionRef.current, store = storeRef.current;
    if (mode !== 'live' || !canvas || !section || !store) return undefined;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return undefined;
    ctx.imageSmoothingQuality = 'high';
    const last = countRef.current - 1, anchor = anchorRef.current;
    let target = 0, previous = 0, raf = 0, upgrade = 0, drawn = null, onExactFrame = false, lastProgress = -1;
    let restSince = 0, settleFrom = 0, settleStart = 0, settling = false, revealed = false;

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingQuality = 'high';
      drawn = null; onExactFrame = false; lastProgress = -1;
    };
    const readScroll = () => {
      const sticky = section.querySelector('.rack-sticky');
      const travel = section.offsetHeight - sticky.offsetHeight;
      const scrolled = -section.getBoundingClientRect().top;
      return travel > 0 ? Math.min(Math.max(scrolled / travel, 0), 1) : 0;
    };
    const show = (element, opacity) => {
      if (!element) return;
      element.style.opacity = String(opacity);
      element.style.transform = `translateY(${(1 - opacity) * 16}px)`;
      element.inert = opacity < 0.5;
      element.setAttribute('aria-hidden', String(opacity < 0.5));
      element.style.visibility = opacity <= 0.001 ? 'hidden' : 'visible';
    };
    const paint = (index, blend) => {
      const width = canvas.clientWidth, height = canvas.clientHeight;
      const base = store.frame(index);
      if (!base) return false;
      drawCover(ctx, base, width, height, anchor);
      canvas.dataset.tier = base.full ? 'full' : 'preview';
      if (!revealed) { revealed = true; canvas.style.opacity = '1'; }
      if (blend > 0.01 && index < last) {
        const next = store.frame(index + 1);
        // Смешиваем только внутри одного яруса качества: превью поверх резкого кадра — «мыло».
        if (next?.exact && next.full === base.full) {
          ctx.globalAlpha = blend; drawCover(ctx, next, width, height, anchor); ctx.globalAlpha = 1;
        }
      }
      return base.exact && base.full;
    };
    const updateText = (p) => {
      if (Math.abs(p - lastProgress) < 0.0005) return;
      lastProgress = p;
      const state = videoState(p);
      show(introRef.current, state.intro);
      for (const key of STAGE_ORDER) show(panels.current[key], state.panels[key]);
      const current = p < STOPS[1] ? 0 : p < STOPS[2] ? 1 : p < STOPS[3] ? 2 : 3;
      navigationRef.current?.querySelectorAll('button').forEach((button, index) => {
        button.dataset.active = String(index === current);
        if (index === current) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current');
      });
    };

    const tick = (now) => {
      raf = 0;
      const p = readScroll();
      const moving = p !== target;
      if (moving) { target = p; restSince = now; settling = false; }
      const exact = target * last;
      // Покой определяем по прокрутке, а не по «камера догнала цель».
      let rendered = exact;
      if (!moving && now - restSince >= REST_MS) {
        if (!settling) { settling = true; settleFrom = exact; settleStart = now; }
        const whole = Math.round(exact);
        rendered = settleFrom + (whole - settleFrom) * smoothstep((now - settleStart) / SETTLE_MS);
        if (Math.abs(rendered - whole) < 0.002) rendered = whole;
      }
      const index = Math.min(last, Math.floor(rendered)), blend = rendered - index;
      const changed = !drawn || drawn.index !== index || Math.abs(drawn.blend - blend) > 0.01;
      let painted = onExactFrame;
      if (changed || !onExactFrame) { painted = paint(index, blend); if (painted) drawn = { index, blend }; }
      onExactFrame = painted;

      const direction = target >= previous ? 1 : -1;
      previous = target;
      store.setPlayhead(Math.round(target * last));
      store.prefetch(Array.from({ length: PREFETCH_AHEAD }, (_, i) => index + direction * (i + 1)));
      updateText(target);

      const settled = !moving && rendered === Math.round(exact) && now - restSince >= REST_MS;
      if (!settled) schedule();
      else if (!painted) upgrade = window.setTimeout(schedule, UPGRADE_POLL_MS);
    };
    const schedule = () => {
      if (upgrade) { clearTimeout(upgrade); upgrade = 0; }
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const resize = () => { sizeCanvas(); schedule(); };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    sizeCanvas(); schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    document.addEventListener('visibilitychange', schedule);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', schedule); document.removeEventListener('visibilitychange', schedule);
      if (raf) cancelAnimationFrame(raf); if (upgrade) clearTimeout(upgrade);
    };
  }, [mode]);

  const jump = (index) => {
    const section = sectionRef.current;
    const travel = section.offsetHeight - section.querySelector('.rack-sticky').offsetHeight;
    const top = window.scrollY + section.getBoundingClientRect().top + travel * STOPS[index];
    const event = new CustomEvent('raxpro:scroll-to', { cancelable: true, detail: { top } });
    if (window.dispatchEvent(event)) window.scrollTo({ top, behavior: 'instant' });
  };

  return (
    <section ref={sectionRef} className="rack-hero rack-hero--video" data-mode={mode} aria-label={copy.eyebrow}>
      <div className="rack-sticky">
        <div className="rack-viewport">
          <img className="rack-poster" src="/seq/poster.jpg" alt="" width="1600" height="900" aria-hidden="true" fetchPriority="high" />
          <canvas ref={canvasRef} aria-hidden="true" />
          <div className="rack-scrim" aria-hidden="true" />
        </div>
        <div className="rack-editorial">
          <div className="rack-intro" ref={introRef}>
            <span className="rack-kicker">{copy.eyebrow}</span>
            <h1>{copy.title}</h1>
            <p className="rack-description">{copy.text}</p>
          </div>
          {STAGE_ORDER.map((key) => (
            <div key={key} className="rack-stage" ref={(element) => { panels.current[key] = element; }}>
              <span className="rack-kicker">{copy.stages[key].kicker}</span>
              <h2>{copy.stages[key].title}</h2>
              <p className="rack-description">{copy.stages[key].text}</p>
              <dl className="rack-facts">
                {copy.stages[key].facts.map((fact) => (
                  <div key={fact.l}><dt>{fact.l}</dt><dd>{fact.n}</dd></div>
                ))}
              </dl>
            </div>
          ))}
          <div className="rack-actions">
            <a className="rack-cta" href={ctaHref}>{copy.cta1}<IcoArrow className="w-4 h-4" /></a>
            <span className="rack-free">{copy.free}</span>
            <a className="rack-secondary" href={cta2Href}>{copy.cta2}<span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div className="rack-footer">
          <nav ref={navigationRef} className="rack-navigation" aria-label={copy.navigation}>
            {copy.labels.map((label, index) => <button type="button" key={label} onClick={() => jump(index)} data-active={index === 0 ? 'true' : 'false'}><span>0{index + 1}</span>{label}<i /></button>)}
          </nav>
          <p className="rack-model-note">{copy.modelNote}</p>
          <span className="rack-scroll-hint">{copy.scrollHint}<span aria-hidden="true">↓</span></span>
        </div>
        <div className="rack-load" aria-hidden="true"><i ref={loadRef} /></div>
      </div>
    </section>
  );
}
