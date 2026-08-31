'use client';

import { useEffect, useRef, useState } from 'react';

/* Кирпичи документа. Всё оформление живёт в document.css — здесь только
 * структура и семантика, чтобы лист одинаково собирался на экране и в PDF. */

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

export function Stat({ label, value, suffix, accent = false }) {
  return (
    <div>
      <p className="kp-stat__label">{label}</p>
      <p className={`kp-stat__value ${accent ? 'kp-stat__value--accent' : ''}`}>
        {value}
        {suffix ? <span className="kp-stat__suffix">{suffix}</span> : null}
      </p>
    </div>
  );
}

export function Figure({ src, alt = '', caption, width, height, ratio, eager = false, className = '' }) {
  return (
    <figure className={`kp-figure ${className}`}>
      <div style={ratio ? { aspectRatio: ratio } : undefined}>
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : undefined}
          decoding={eager ? 'sync' : 'async'}
        />
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

/** Блок, который проявляется при прокрутке. В печати и при выключенных
 *  анимациях гасится целиком — правило в document.css, здесь только флаг. */
export function Reveal({ children, delay = 0, as: Tag = 'div', className = '', style, ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
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
export function DocRoot({ children, className = '' }) {
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
      style={{ '--kp-fit': fit }}
    >
      {children}
    </div>
  );
}
