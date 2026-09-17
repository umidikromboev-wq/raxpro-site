'use client';

// Вариант 2б первого экрана: тот же 4K-мастер, но одним MP4, который мотается
// через video.currentTime (как у mascan-travel). Файл скачивается целиком
// в blob — тогда перемотка в любую точку не ждёт буфера. DOM и классы те же,
// что у RackHero и VideoHero, чтобы сравнивать честно.
//
// Движение: единственный фильтр сглаживания — Lenis страницы. Следующая
// перемотка ставится только после того, как закончилась предыдущая: иначе
// Safari копит очередь seek'ов и отстаёт.

import { useEffect, useRef, useState } from 'react';
import { STAGE_ORDER } from './heroCopy';
import { videoCopy } from './videoCopy';
import { VIDEO_STAGES, videoState } from './videoTimeline';
import { IcoArrow } from '../Icons';

const MOBILE_QUERY = '(max-width: 1023px)';
const SRC_DESKTOP = '/seq/hero_1920.mp4';
const SRC_MOBILE = '/seq/hero_1280.mp4';
/** Разница времени, меньше которой перемотку не ставим (полкадра при 24 fps). */
const SEEK_EPSILON = 1 / 48;
/** Последние миллисекунды ролика не мотаем: там некоторые браузеры отдают чёрный кадр. */
const TAIL_GUARD = 0.05;
/** Если blob не скачался за это время — играем прямо с URL, как получится. */
const BLOB_TIMEOUT_MS = 25000;
const STOPS = [0, VIDEO_STAGES.draft.from, VIDEO_STAGES.build.from, VIDEO_STAGES.load.from];

async function fetchAsBlobUrl(src, onProgress, signal) {
  const res = await fetch(src, { signal });
  if (!res.ok || !res.body) throw new Error(`video ${res.status}`);
  const total = Number(res.headers.get('Content-Length')) || 0;
  const reader = res.body.getReader();
  const chunks = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    onProgress(total ? received / total : 0.5);
  }
  return URL.createObjectURL(new Blob(chunks, { type: 'video/mp4' }));
}

export default function VideoHeroMp4({ lang = 'ru', ctaHref = '#kalkulyator', cta2Href = '#napravleniya' }) {
  const copy = videoCopy(lang);
  const sectionRef = useRef(null), videoRef = useRef(null), introRef = useRef(null), loadRef = useRef(null);
  const panels = useRef({}), navigationRef = useRef(null);
  const [mode, setMode] = useState('static');

  // Загрузка ролика целиком, потом live.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const src = window.matchMedia(MOBILE_QUERY).matches ? SRC_MOBILE : SRC_DESKTOP;
    const controller = new AbortController();
    let disposed = false, blobUrl = null;
    const timer = setTimeout(() => controller.abort(), BLOB_TIMEOUT_MS);
    const start = (url) => {
      if (disposed) return;
      video.src = url;
      video.load();
      const ready = () => {
        if (disposed || video.readyState < 2) return;
        video.removeEventListener('loadeddata', ready);
        video.removeEventListener('canplay', ready);
        video.pause();
        video.currentTime = 0;
        setMode('live');
      };
      video.addEventListener('loadeddata', ready);
      video.addEventListener('canplay', ready);
      // Короткий play/pause прогревает декодер на iOS, иначе первый seek молчит.
      const warm = video.play();
      if (warm?.then) warm.then(() => video.pause()).catch(() => {});
    };
    fetchAsBlobUrl(src, (fraction) => {
      if (loadRef.current) loadRef.current.style.transform = `scaleX(${fraction})`;
    }, controller.signal)
      .then((url) => { clearTimeout(timer); blobUrl = url; start(url); })
      .catch((error) => {
        clearTimeout(timer);
        console.warn('RAXPRO: hero video blob failed, streaming from URL.', error);
        start(src);
      });
    return () => {
      disposed = true; clearTimeout(timer); controller.abort();
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, []);

  // Прокрутка → время ролика.
  useEffect(() => {
    const video = videoRef.current, section = sectionRef.current;
    if (mode !== 'live' || !video || !section) return undefined;
    const duration = video.duration;
    if (!Number.isFinite(duration) || duration <= 0) return undefined;
    let raf = 0, lastProgress = -1, pending = null, revealed = false;

    const readScroll = () => {
      const travel = section.offsetHeight - section.querySelector('.rack-sticky').offsetHeight;
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
    const seekTo = (time) => {
      if (video.seeking) { pending = time; return; }
      if (Math.abs(video.currentTime - time) < SEEK_EPSILON) return;
      pending = null;
      video.currentTime = time;
    };
    const onSeeked = () => {
      if (!revealed) { revealed = true; video.style.opacity = '1'; }
      if (pending !== null) { const t = pending; pending = null; seekTo(t); }
    };
    const tick = () => {
      raf = 0;
      const p = readScroll();
      seekTo(Math.min(p * duration, duration - TAIL_GUARD));
      updateText(p);
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(tick); };
    video.addEventListener('seeked', onSeeked);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    document.addEventListener('visibilitychange', schedule);
    video.currentTime = 0.001;
    schedule();
    return () => {
      video.removeEventListener('seeked', onSeeked);
      window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule);
      document.removeEventListener('visibilitychange', schedule);
      if (raf) cancelAnimationFrame(raf);
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
    <section ref={sectionRef} className="rack-hero rack-hero--video rack-hero--mp4" data-mode={mode} aria-label={copy.eyebrow}>
      <div className="rack-sticky">
        <div className="rack-viewport">
          <img className="rack-poster" src="/seq/poster.jpg" alt="" width="1600" height="900" aria-hidden="true" fetchPriority="high" />
          <video ref={videoRef} className="rack-video" muted playsInline preload="auto" aria-hidden="true" />
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
