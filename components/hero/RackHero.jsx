'use client';

import { useEffect, useRef, useState } from 'react';
import { HERO_COPY, STAGE_ORDER } from './heroCopy';
import { countPositions, floorPositions, ROOM } from './rackModel';
import { IcoArrow, IcoRuler, IcoClock } from '../Icons';

// Иконки чипов первого экрана — по порядку copy.chips: замер · срок монтажа · рассрочка.
function IcoCard(p) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20M6 15h4" /></svg>; }
const CHIP_ICONS = [IcoRuler, IcoClock, IcoCard];
const Actions = ({ copy, ctaHref, cta2Href, innerRef, className = '' }) => (
  <div className={`rack-actions ${className}`} ref={innerRef}>
    <a className="rack-cta" href={ctaHref}><span>{copy.cta1}</span><i aria-hidden="true"><IcoArrow className="w-4 h-4" /></i></a>
    <a className="rack-secondary" href={cta2Href}>{copy.cta2}</a>
  </div>
);

// three.js и сцена едут одним файлом вне бандла Next (scripts/build-three.mjs →
// public/vendor): esbuild оставляет от three только нужные классы (499 КБ вместо
// 706), а постоянный адрес даёт предзагрузку с самого HTML — раньше import()
// стартовал только после гидрации. Правил сцену — `npm run build:three`.
const HERO_BUNDLE_URL = '/vendor/rax-hero.js';
const STOPS = [0, 0.23, 0.57, 1];
// Телефон: сцена собирается сама, без скролла. Вперёд ~6 с, пауза на готовом складе,
// быстрый откат и снова. Заголовки стадий и таймлайн идут по тому же прогрессу.
// Было 11 с на прямой ход и 15,5 с на круг — человек уходил вниз, не дождавшись
// собранного склада (Умид, 22.09). Теперь весь круг ~9 с, и дольше всего держится
// кадр, ради которого всё: полный стеллаж.
const AUTO = { forward: 6000, hold: 2200, back: 800, rest: 400 };
const AUTO_TOTAL = AUTO.forward + AUTO.hold + AUTO.back + AUTO.rest;
const easeInOutSine = (t) => 0.5 - 0.5 * Math.cos(Math.PI * t);
function autoProgress(ms) {
  const t = ms % AUTO_TOTAL;
  if (t < AUTO.forward) return easeInOutSine(t / AUTO.forward);
  if (t < AUTO.forward + AUTO.hold) return 1;
  if (t < AUTO.forward + AUTO.hold + AUTO.back) return 1 - easeInOutSine((t - AUTO.forward - AUTO.hold) / AUTO.back);
  return 0;
}
/** Сколько мс от начала цикла даёт нужный прогресс на прямом ходе. */
const autoTimeFor = (p) => (Math.acos(1 - 2 * Math.min(1, Math.max(0, p))) / Math.PI) * AUTO.forward;
export default function RackHero({ lang = 'ru', ctaHref = '#zayavka', cta2Href = '#katalog' }) {
  const copy = HERO_COPY[lang] || HERO_COPY.ru;
  const positions = countPositions(), floor = floorPositions();
  const sectionRef = useRef(null), canvasRef = useRef(null), introRef = useRef(null), stageActionsRef = useRef(null);
  const panels = useRef({}), navigationRef = useRef(null), capacityRef = useRef(null), filledRef = useRef(null);
  const measureRef = useRef(null), jumpRef = useRef(null);
  // Раскладка «live» рендерится сразу на сервере: интро и таймлайн на месте, стадии скрыты,
  // холст прозрачный, пока сцена не собрана (`ready`). Раньше стартовали со «static» — на секунду
  // загрузки three.js показывались постер-картинка и все четыре стадии столбиком, потом всё
  // перескакивало в 3D. «static» теперь только запасной режим: reduced-motion или WebGL упал.
  const [mode, setMode] = useState('live');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current, section = sectionRef.current;
    if (!canvas || !section) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches) { setMode('static'); return; }
    // До 1024px сцена маленькая, под текстом, и собирается сама (см. CSS @media 1023px)
    const auto = window.matchMedia('(max-width: 1023px)').matches;
    let disposed = false, api = null, raf = 0, observer = null;
    let lastProgress = -1, visible = true;
    let start = performance.now();
    const setNavigation = (p) => {
      const current = p < 0.055 ? 0 : p < 0.28 ? 1 : p < 0.66 ? 2 : 3;
      navigationRef.current?.querySelectorAll('button').forEach((button, index) => {
        button.dataset.active = String(index === current);
        button.dataset.done = String(index < current);
        if (index === current) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current');
      });
    };
    const progress = () => {
      const rect = section.getBoundingClientRect();
      const travel = section.offsetHeight - section.querySelector('.rack-sticky').offsetHeight;
      return Math.min(1, Math.max(0, -rect.top / Math.max(1, travel)));
    };
    const show = (element, opacity) => {
      if (!element) return;
      element.style.opacity = String(opacity);
      element.style.transform = `translateY(${(1 - opacity) * 16}px)`;
      element.inert = opacity < 0.5;
      element.setAttribute('aria-hidden', String(opacity < 0.5));
      element.style.visibility = opacity <= 0.001 ? 'hidden' : 'visible';
    };
    const loop = () => {
      raf = 0;
      if (!api || disposed || !visible || document.hidden) return;
      const p = progress();
      const state = api.update(p, (performance.now() - start) / 1000);
      api.render();
      if (Math.abs(p - lastProgress) > 0.00001) {
        show(introRef.current, state.intro);
        show(stageActionsRef.current, 1 - state.intro);
        for (const key of STAGE_ORDER) show(panels.current[key], state.panels[key]);
        setNavigation(p);
        if (capacityRef.current) {
          capacityRef.current.style.opacity = String(state.panels.load);
          capacityRef.current.style.setProperty('--filled', `${state.filled / positions * 100}%`);
        }
        if (filledRef.current) filledRef.current.textContent = String(state.filled).padStart(2, '0');
        lastProgress = p;
      }
      if (state.introMoving) raf = requestAnimationFrame(loop);
    };
    // Телефон: прогресс идёт от времени, интро не гаснет, стадии сменяются под моделью
    const loopAuto = () => {
      raf = 0;
      if (!api || disposed || !visible || document.hidden) return;
      const now = performance.now();
      const p = autoProgress(now - start);
      const state = api.update(p, (now - start) / 1000);
      api.render();
      show(measureRef.current, state.intro);
      for (const key of STAGE_ORDER) show(panels.current[key], state.panels[key]);
      setNavigation(p);
      raf = requestAnimationFrame(loopAuto);
    };
    const tick = auto ? loopAuto : loop;
    const kick = () => { if (!raf && !disposed) raf = requestAnimationFrame(tick); };
    jumpRef.current = auto ? (index) => { start = performance.now() - autoTimeFor(STOPS[index]); kick(); } : null;
    const resize = () => {
      if (!api) return;
      api.resize(canvas.clientWidth, canvas.clientHeight); lastProgress = -1; kick();
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf); raf = 0;
      api?.dispose(); api = null;
      show(introRef.current, 1);
      for (const panel of Object.values(panels.current)) show(panel, 1);
      if (!disposed) { setMode('static'); setReady(false); }
    };
    const contextLost = (event) => { event.preventDefault(); stop(); };
    const motionChanged = () => { if (motion.matches) stop(); };
    let intersection = null;
    (async () => {
      try {
        const { THREE, RoomEnvironment, createRackScene } = await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ HERO_BUNDLE_URL);
        if (disposed) return;
        api = createRackScene(THREE, canvas, lang, { RoomEnvironment });
        start = performance.now();
        setReady(true);
        observer = new ResizeObserver(resize); observer.observe(canvas);
        intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) kick(); });
        intersection.observe(section);
        if (!auto) window.addEventListener('scroll', kick, { passive: true });
        document.addEventListener('visibilitychange', kick);
        canvas.addEventListener('webglcontextlost', contextLost);
        motion.addEventListener('change', motionChanged);
        resize();
      } catch (error) {
        console.warn('RAXPRO: 3D unavailable, showing the accessible static hero.', error);
        stop();
      }
    })();
    return () => {
      disposed = true; stop(); observer?.disconnect(); intersection?.disconnect();
      window.removeEventListener('scroll', kick); document.removeEventListener('visibilitychange', kick);
      canvas.removeEventListener('webglcontextlost', contextLost); motion.removeEventListener('change', motionChanged);
    };
  }, [lang, positions]);

  const jump = (index) => {
    if (jumpRef.current) { jumpRef.current(index); return; }
    const section = sectionRef.current;
    const travel = section.offsetHeight - section.querySelector('.rack-sticky').offsetHeight;
    const top = window.scrollY + section.getBoundingClientRect().top + travel * STOPS[index];
    const event = new CustomEvent('raxpro:scroll-to', { cancelable: true, detail: { top } });
    if (window.dispatchEvent(event)) window.scrollTo({ top, behavior: 'instant' });
  };
  // Масштаб модели и «во сколько раз больше» — из rackModel, чтобы цифры не расходились со сценой.
  const fmt = (v) => String(v).replace(".", ",");
  const ratio = fmt(Math.round(positions / floor * 10) / 10);
  const room = `${ROOM.width} × ${ROOM.depth} м`.replace(' м', lang === 'uz' ? ' m' : ' м');
  const height = `${fmt(ROOM.height)} ${lang === 'uz' ? 'm' : 'м'}`;
  const number = (value) => value
    .replace('{positions}', String(positions)).replace('{floor}', String(floor)).replace('{upper}', String(positions - floor))
    .replace('{ratio}', ratio).replace('{room}', room).replace('{height}', height);

  return (
    <section ref={sectionRef} className="rack-hero" data-mode={mode} data-ready={ready ? 'true' : 'false'} aria-label={copy.eyebrow}>
      {/* React поднимает <link> в <head>: браузер начинает качать three.js с первых байт HTML */}
      <link rel="modulepreload" href={HERO_BUNDLE_URL} />
      <div className="rack-sticky">
        <div className="rack-viewport">
          <img className="rack-poster" src="/works/hero.jpg" alt="" width="1600" height="1200" aria-hidden="true" />
          <canvas ref={canvasRef} aria-hidden="true" />
          <div className="rack-shade" aria-hidden="true" />
        </div>
        <div className="rack-editorial">
          <div className="rack-intro" ref={introRef}>
            <div className="rack-segments" role="group" aria-label={copy.eyebrow}>
              <span className="rack-kicker">{copy.eyebrow}</span>
              {/* Чип без своей страницы ведёт в форму заявки — туда же, куда главная кнопка */}
              {copy.segments.map((s) => <a key={s.label} href={s.href ? `/${lang}${s.href}` : ctaHref}>{s.label}</a>)}
            </div>
            <h1>{copy.title} <em>{copy.titleAccent}</em></h1>
            <p className="rack-description">{copy.text}</p>
            <Actions copy={copy} ctaHref={ctaHref} cta2Href={cta2Href} className="rack-actions--intro" />
            <ul className="rack-chips">
              {copy.chips.map((chip, index) => { const Ico = CHIP_ICONS[index] || IcoRuler; return <li key={chip}><Ico className="rack-chip-ico" />{chip}</li>; })}
            </ul>
            <p className="rack-price">{copy.price}</p>
          </div>
          <div className="rack-stages">
          <div className="rack-stage rack-stage--measure" ref={measureRef}>
            <span className="rack-kicker">{copy.stages.measure.kicker}</span>
            <h2>{copy.stages.measure.title}</h2>
            <p className="rack-description">{copy.stages.measure.text}</p>
            <dl className="rack-facts">
              {copy.stages.measure.facts.map((fact) => (
                <div key={fact.l}><dt>{fact.l}</dt><dd>{fact.n}</dd></div>
              ))}
            </dl>
          </div>
          {STAGE_ORDER.map((key) => (
            <div key={key} className="rack-stage" ref={(element) => { panels.current[key] = element; }}>
              <span className="rack-kicker">{copy.stages[key].kicker}</span>
              <h2>{number(copy.stages[key].title)}</h2>
              <p className="rack-description">{number(copy.stages[key].text)}</p>
              <dl className="rack-facts">
                {copy.stages[key].facts.map((fact) => (
                  <div key={fact.l}><dt>{fact.l}</dt><dd>{number(fact.n)}</dd></div>
                ))}
              </dl>
            </div>
          ))}
          </div>
          <Actions copy={copy} ctaHref={ctaHref} cta2Href={cta2Href} innerRef={stageActionsRef} className="rack-actions--stages" />
        </div>
        <div className="rack-capacity" ref={capacityRef} aria-hidden="true">
          <span className="rack-capacity-label">{copy.loaded}</span>
          <div><strong ref={filledRef}>00</strong><span> / {positions}</span></div>
          <div className="rack-capacity-bar"><i /></div>
          <span className="rack-capacity-scale">{number(copy.scale)}</span>
        </div>
        <div className="rack-footer">
          <nav ref={navigationRef} className="rack-navigation" aria-label={copy.navigation}>
            {copy.labels.map((label, index) => <button type="button" key={label} onClick={() => jump(index)} data-active={index === 0 ? 'true' : 'false'} data-done="false"><i /><span>0{index + 1}</span>{label}</button>)}
          </nav>
          <span className="rack-scroll-hint">{copy.scrollHint}<span aria-hidden="true">↓</span></span>
        </div>
      </div>
    </section>
  );
}
