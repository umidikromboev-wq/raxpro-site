'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';

// Buttery inertial scroll (Awwwards-grade feel). Disabled for reduced-motion.
// Also intercepts in-page anchor links so #hash navigation glides via Lenis.
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });

    let raf = 0;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onClick = (e) => {
      const a = e.target.closest?.('a[href^="#"]');
      if (!a) return;
      const hash = a.getAttribute('href');
      if (!hash || hash.length < 2) return;
      const el = document.querySelector(hash);
      if (!el) return;
      e.preventDefault();
      // Прыжок через всю страницу (кнопка первого экрана → форма внизу, ~17 000 px)
      // плавной прокруткой не доезжает: Lenis обрывает её от любого касания или
      // колеса, и человек остаётся посреди страницы — на направлениях. Далеко —
      // переносим сразу; близко — плавно, но на время анимации ввод заблокирован,
      // чтобы она не оборвалась на полпути.
      const far = Math.abs(el.getBoundingClientRect().top) > window.innerHeight * 3;
      lenis.scrollTo(el, far
        ? { offset: -72, force: true, immediate: true }
        : { offset: -72, force: true, lock: true, duration: 1.2 });
    };
    document.addEventListener('click', onClick);
    // Scene navigation must interrupt the same Lenis instance that owns wheel easing.
    const onSceneScroll = (event) => {
      if (!Number.isFinite(event.detail?.top)) return;
      event.preventDefault();
      lenis.scrollTo(event.detail.top, { immediate: true, force: true });
    };
    window.addEventListener('raxpro:scroll-to', onSceneScroll);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('click', onClick);
      window.removeEventListener('raxpro:scroll-to', onSceneScroll);
      lenis.destroy();
    };
  }, []);

  return null;
}
