'use client';

import { useEffect, useRef, useState } from 'react';
import { HERO_COPY, STAGE_ORDER } from './heroCopy';
import { countPositions, floorPositions } from './rackModel';
import { IcoArrow } from '../Icons';

const STOPS = [0, 0.23, 0.57, 1];
export default function RackHero({ lang = 'ru', ctaHref = '#kalkulyator', cta2Href = '#zayavka' }) {
  const copy = HERO_COPY[lang] || HERO_COPY.ru;
  const positions = countPositions(), floor = floorPositions();
  const sectionRef = useRef(null), canvasRef = useRef(null), introRef = useRef(null);
  const panels = useRef({}), navigationRef = useRef(null), capacityRef = useRef(null), filledRef = useRef(null);
  // Server-rendered content is fully readable before WebGL progressively enhances it.
  const [mode, setMode] = useState('static');

  useEffect(() => {
    const canvas = canvasRef.current, section = sectionRef.current;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!canvas || !section || motion.matches) return;
    let disposed = false, api = null, raf = 0, observer = null;
    let lastProgress = -1, visible = true;
    let start = performance.now();
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
        for (const key of STAGE_ORDER) show(panels.current[key], state.panels[key]);
        const current = p < 0.055 ? 0 : p < 0.28 ? 1 : p < 0.66 ? 2 : 3;
        navigationRef.current?.querySelectorAll('button').forEach((button, index) => {
          button.dataset.active = String(index === current);
          button.dataset.done = String(index < current);
          if (index === current) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current');
        });
        if (capacityRef.current) {
          capacityRef.current.style.opacity = String(state.panels.load);
          capacityRef.current.style.setProperty('--filled', `${state.filled / positions * 100}%`);
        }
        if (filledRef.current) filledRef.current.textContent = String(state.filled).padStart(2, '0');
        lastProgress = p;
      }
      if (state.introMoving) raf = requestAnimationFrame(loop);
    };
    const kick = () => { if (!raf && !disposed) raf = requestAnimationFrame(loop); };
    const resize = () => {
      if (!api) return;
      api.resize(canvas.clientWidth, canvas.clientHeight); lastProgress = -1; kick();
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf); raf = 0;
      api?.dispose(); api = null;
      show(introRef.current, 1);
      for (const panel of Object.values(panels.current)) show(panel, 1);
      if (!disposed) setMode('static');
    };
    const contextLost = (event) => { event.preventDefault(); stop(); };
    const motionChanged = () => { if (motion.matches) stop(); };
    let intersection = null;
    (async () => {
      try {
        const [THREE, { createRackScene }, { RoomEnvironment }] = await Promise.all([
          import('three'), import('./rackScene'), import('three/examples/jsm/environments/RoomEnvironment.js'),
        ]);
        if (disposed) return;
        api = createRackScene(THREE, canvas, lang, { RoomEnvironment });
        start = performance.now();
        setMode('live');
        observer = new ResizeObserver(resize); observer.observe(canvas);
        intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) kick(); });
        intersection.observe(section);
        window.addEventListener('scroll', kick, { passive: true });
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
    const section = sectionRef.current;
    const travel = section.offsetHeight - section.querySelector('.rack-sticky').offsetHeight;
    const top = window.scrollY + section.getBoundingClientRect().top + travel * STOPS[index];
    const event = new CustomEvent('raxpro:scroll-to', { cancelable: true, detail: { top } });
    if (window.dispatchEvent(event)) window.scrollTo({ top, behavior: 'instant' });
  };
  const number = (value) => value.replace('{positions}', String(positions)).replace('{floor}', String(floor)).replace('{upper}', String(positions - floor));

  return (
    <section ref={sectionRef} className="rack-hero" data-mode={mode} aria-label={copy.eyebrow}>
      <div className="rack-sticky">
        <div className="rack-viewport">
          <img className="rack-poster" src="/works/hero.jpg" alt="" width="1600" height="1200" aria-hidden="true" />
          <canvas ref={canvasRef} aria-hidden="true" />
          <div className="rack-shade" aria-hidden="true" />
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
                  <div key={fact.l}><dt>{fact.l}</dt><dd>{number(fact.n)}</dd></div>
                ))}
              </dl>
            </div>
          ))}
          <div className="rack-actions">
            <a className="rack-cta" href={ctaHref}>{copy.cta1}<IcoArrow className="w-4 h-4" /></a>
            <a className="rack-secondary" href={cta2Href}>{copy.cta2}<span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div className="rack-capacity" ref={capacityRef} aria-hidden="true">
          <span className="rack-capacity-label">{copy.loaded}</span>
          <div><strong ref={filledRef}>00</strong><span> / {positions}</span></div>
          <div className="rack-capacity-bar"><i /></div>
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
