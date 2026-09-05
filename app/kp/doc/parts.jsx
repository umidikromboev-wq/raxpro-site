'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';

/* Кирпичи документа. Всё оформление живёт в document.css — здесь только
 * структура и семантика, чтобы лист одинаково собирался на экране и в PDF. */

/** Режим печати. В headless-браузере нет прокрутки: картинка с loading="lazy"
 *  ниже первого экрана не начинает грузиться вовсе, и в PDF на её месте
 *  оставался серый прямоугольник — ровно на листе с нашими объектами.
 *  Флаг ставит DocRoot, читает Figure. */
const PrintContext = createContext(false);

export function Sheet({ children, tone = 'light', flush = false, className = '' }) {
  return (
    <article
      className={[
        'kp-page',
        tone === 'dark' ? 'kp-page--dark' : '',
        flush ? 'kp-page--flush' : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      {children}
    </article>
  );
}

export function Kicker({ children, className = '' }) {
  return <p className={`kp-kicker ${className}`}>{children}</p>;
}

export function Rule({ ink = false, className = '' }) {
  return <hr className={`kp-rule ${ink ? 'kp-rule--ink' : ''} ${className}`} />;
}

/** Кегль цифры зависит от её длины.
 *
 *  У RaxPro суммы бывают и 28 000 000, и 1 264 488 960. На фиксированном
 *  кегле миллиард переносился на вторую строку и разваливал ячейку —
 *  ровно на той цифре, ради которой клиент открыл документ. */
export function statSize(value) {
  const len = String(value ?? '').length;
  if (len >= 15) return 22;
  if (len >= 13) return 25;
  if (len >= 11) return 28;
  if (len >= 9) return 31;
  return 34;
}

export function Stat({ label, value, suffix, accent = false, size }) {
  return (
    <div>
      <p className="kp-stat__label">{label}</p>
      <p
        className={`kp-stat__value ${accent ? 'kp-stat__value--accent' : ''}`}
        style={{ fontSize: size ?? statSize(value) }}
      >
        {value}
        {suffix ? <span className="kp-stat__suffix">{suffix}</span> : null}
      </p>
    </div>
  );
}

/** Доля каждой позиции в сумме — одной полосой.
 *
 *  Таблица отвечает «сколько стоит каждая позиция», полоса — «за что вы
 *  на самом деле платите». В фактических КП RaxPro этого не было, и клиент
 *  торговался по общей сумме, потому что структуру не видел. Цвет один:
 *  крупнейшая доля — акцентом, остальные — градацией графита. */
export function CostBar({ items, lang = 'ru' }) {
  const total = items.reduce((s, i) => s + i.sum, 0);
  if (!total) return null;
  const max = Math.max(...items.map((i) => i.sum));
  const tint = (i) => `rgba(20, 24, 29, ${0.72 - Math.min(i, 5) * 0.11})`;

  return (
    <div>
      <div className="kp-costbar" role="img"
        aria-label={items.map((i) => `${i.label} ${Math.round((i.sum / total) * 100)}%`).join(', ')}>
        {items.map((i, n) => (
          <span
            key={i.label}
            style={{
              width: `${(i.sum / total) * 100}%`,
              background: i.sum === max ? 'var(--accent)' : tint(n),
            }}
          />
        ))}
      </div>
      <ul className="kp-costbar__legend">
        {items.map((i, n) => (
          <li key={i.label}>
            <span className="kp-costbar__dot" style={{ background: i.sum === max ? 'var(--accent)' : tint(n) }} />
            <span className="kp-costbar__name">{i.label}</span>
            <b>{((i.sum / total) * 100).toFixed(1).replace('.', lang === 'uz' ? '.' : ',')} %</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Figure({ src, alt = '', caption, width, height, ratio, eager = false, className = '' }) {
  const forced = useContext(PrintContext) || eager;
  return (
    <figure className={`kp-figure ${className}`}>
      <div style={ratio ? { aspectRatio: ratio } : undefined}>
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={forced ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : undefined}
          decoding={forced ? 'sync' : 'async'}
        />
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

/** Реестр блоков, ждущих проявки. IntersectionObserver один пропускает блок,
 *  который пролистали быстрее одного кадра, — тогда кадр не появлялся никогда.
 *  Поэтому геометрия проверяется ещё и по прокрутке любого контейнера
 *  (capture ловит и окно, и превью кабинета) в общем rAF-цикле. */
const pending = new Set();
let sweepQueued = false;
let listening = false;
/** Ниже этой доли экрана блок считается ещё не показанным. */
const VIEW_SHARE = 0.96;
/** Страховка: что бы ни случилось с наблюдателем, документ читаем целиком. */
const SAFETY_MS = 4000;

function sweep() {
  sweepQueued = false;
  const vh = window.innerHeight;
  for (const entry of pending) {
    const r = entry.el.getBoundingClientRect();
    if (r.top < vh * VIEW_SHARE || r.bottom < 0) entry.show();
  }
}
function scheduleSweep() {
  if (sweepQueued) return;
  sweepQueued = true;
  requestAnimationFrame(sweep);
}
function listenScroll() {
  if (listening || typeof window === 'undefined') return;
  listening = true;
  window.addEventListener('scroll', scheduleSweep, { passive: true, capture: true });
  window.addEventListener('resize', scheduleSweep, { passive: true });
}

/** Блок, который проявляется при прокрутке. То, что на экране при загрузке,
 *  видно сразу; в печати и при выключенных анимациях гасится целиком —
 *  правило в document.css, здесь только флаг. */
export function Reveal({ children, delay = 0, as: Tag = 'div', className = '', style, ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setShown(true);
      return;
    }

    let io = null;
    let timer = 0;
    const entry = {
      el,
      show() {
        setShown(true);
        pending.delete(entry);
        io?.disconnect();
        clearTimeout(timer);
      },
    };

    if (el.getBoundingClientRect().top < window.innerHeight * VIEW_SHARE) {
      entry.show();
      return;
    }

    pending.add(entry);
    listenScroll();
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) entry.show();
        },
        { rootMargin: '0px 0px -4% 0px', threshold: 0.01 }
      );
      io.observe(el);
    }
    timer = setTimeout(entry.show, SAFETY_MS);

    return () => {
      pending.delete(entry);
      io?.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <Tag
      ref={ref}
      data-shown={shown ? '1' : '0'}
      className={`kp-reveal ${className}`}
      style={{ '--reveal-delay': `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Ширина листа A4 в пикселях при 96 dpi. Лист жёстко 210 мм: числа внутри
 *  него заданы в пикселях, чтобы PDF и экран не расходились. */
const SHEET_PX = 794;

/** Корень документа.
 *
 *  Ставит data-ready после монтирования — по этому флагу запускается наезд
 *  камеры на обложке, один раз и без дёрганья.
 *
 *  И считает --kp-fit: во сколько раз лист надо ужать, чтобы он целиком влез
 *  в свой контейнер. Клиент открывает ссылку с телефона, и переверстать лист
 *  под 320 px нельзя — это тот же документ, который менеджер распечатает.
 *  Поэтому лист не ломается по колонкам, а масштабируется целиком.
 *  Меряется родитель, а не сам корень: собственную ширину корня уже искажает
 *  применённый к нему zoom, и замер зациклился бы. */
export function DocRoot({ children, print = false, className = '' }) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);
  const [fit, setFit] = useState(1);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host || typeof ResizeObserver === 'undefined') return;

    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const style = getComputedStyle(host);
        const inner =
          host.clientWidth -
          parseFloat(style.paddingLeft || 0) -
          parseFloat(style.paddingRight || 0);
        if (!Number.isFinite(inner) || inner <= 0) return;
        // Округление до сотых: без него ResizeObserver дёргает состояние
        // на долях пикселя и лист мерцает при любом изменении ширины.
        const next = Math.min(1, Math.round((inner / SHEET_PX) * 100) / 100);
        setFit((prev) => (Math.abs(prev - next) < 0.005 ? prev : next));
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`kp-doc ${className}`}
      data-ready={ready ? '1' : '0'}
      data-print={print ? '1' : '0'}
      style={{ '--kp-fit': fit }}
    >
      <PrintContext.Provider value={print}>{children}</PrintContext.Provider>
    </div>
  );
}
