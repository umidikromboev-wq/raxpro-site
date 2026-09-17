"use client";

import { useEffect, useRef, useState } from "react";
import { HERO_COPY, STAGE_ORDER } from "./heroCopy";
import { countPositions } from "./rackScene";
import { sceneState } from "./timeline";
import { IcoArrow, IcoCheck } from "../Icons";

// Скролл-герой: один three.js-холст закреплён на 4,5 экрана прокрутки.
// Замер играет сам при открытии, дальше всё ведёт скролл: белые линии
// проекта → падают рамы и балки → паллеты и коробки → камера отъезжает.
// Тексты — обычный DOM (h1 и факты читаются поисковиком), холст — декорация.
//
// Единственный фильтр сглаживания — Lenis на самой странице; сцена привязана
// к сглаженной прокрутке напрямую, второй пружины нет (см. скилл scroll-scrub-motion).

const HERO_LENGTH_VH = 450;
const HERO_LENGTH_VH_MOBILE = 380;
const TUNING = process.env.NEXT_PUBLIC_HERO_TUNING === "1";

export default function RackHero({ lang = "ru", chips = [], ctaHref = "#kalkulyator", cta2Href = "#napravleniya" }) {
  const copy = HERO_COPY[lang] || HERO_COPY.ru;
  const positions = countPositions();
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const introRef = useRef(null);
  const hintRef = useRef(null);
  const panelRefs = useRef({});
  const [mode, setMode] = useState("loading"); // loading | live | static

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (calm || !gl) {
      setMode("static");
      return;
    }

    let disposed = false;
    let api = null;
    let raf = 0;
    let lastProgress = -1;
    let lastScrollAt = performance.now();
    const t0 = performance.now();

    const progressNow = () => {
      const rect = section.getBoundingClientRect();
      const travel = section.offsetHeight - window.innerHeight;
      if (travel <= 0) return 0;
      return Math.min(1, Math.max(0, -rect.top / travel));
    };

    const applyDom = (p, s) => {
      const intro = introRef.current;
      if (intro) {
        intro.style.opacity = s.intro.toFixed(3);
        intro.style.transform = `translate3d(0, ${((1 - s.intro) * 24).toFixed(1)}px, 0)`;
        intro.style.pointerEvents = s.intro > 0.3 ? "auto" : "none";
      }
      const hint = hintRef.current;
      if (hint) hint.style.opacity = s.intro.toFixed(3);
      for (const key of STAGE_ORDER) {
        const el = panelRefs.current[key];
        if (!el) continue;
        const o = s.panels[key];
        el.style.opacity = o.toFixed(3);
        el.style.transform = `translate3d(0, ${((1 - o) * 18).toFixed(1)}px, 0)`;
        el.style.pointerEvents = o > 0.5 ? "auto" : "none";
        el.setAttribute("aria-hidden", o < 0.5 ? "true" : "false");
      }
      if (TUNING) canvas.dataset.head = p.toFixed(5);
    };

    const inView = () => {
      const r = section.getBoundingClientRect();
      return r.bottom > 0 && r.top < window.innerHeight;
    };

    const loop = () => {
      raf = 0;
      if (disposed || !api) return;
      const now = performance.now();
      const p = progressNow();
      const time = (now - t0) / 1000;
      const changed = Math.abs(p - lastProgress) > 1e-5;
      const s = api.update(p, time);
      api.render();
      if (changed) {
        lastProgress = p;
        lastScrollAt = now;
        applyDom(p, s);
      }
      // Пока человечки в кадре — сцена живёт по времени. Дальше рисуем только
      // по прокрутке, чтобы холст не жёг процессор, когда никто не листает.
      const alive = s.people > 0.01 && inView();
      if (alive || now - lastScrollAt < 120) raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const resize = () => {
      if (!api) return;
      const w = canvas.clientWidth || 1;
      const h = canvas.clientHeight || 1;
      api.resize(w, h);
      lastProgress = -1;
      kick();
    };

    let ro = null;
    (async () => {
      let THREE;
      try {
        THREE = await import("three");
      } catch {
        if (!disposed) setMode("static");
        return;
      }
      if (disposed) return;
      const { createRackScene } = await import("./rackScene");
      if (disposed) return;
      api = createRackScene(THREE, canvas);
      resize();
      ro = new ResizeObserver(resize);
      ro.observe(canvas);
      window.addEventListener("scroll", kick, { passive: true });
      setMode("live");
      kick();
    })();

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", kick);
      ro?.disconnect();
      api?.dispose();
    };
  }, []);

  const isStatic = mode === "static";
  const staticState = sceneState(1);

  return (
    <section
      ref={sectionRef}
      className="relative bg-navy-900 text-white rack-hero"
      style={{ height: isStatic ? "auto" : undefined }}
      aria-label={copy.title}
    >
      <div className={isStatic ? "relative min-h-svh overflow-hidden" : "sticky top-0 h-svh overflow-hidden"}>
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full transition-opacity duration-700"
          style={{ opacity: mode === "live" ? 1 : 0 }}
        />
        {isStatic && (
          <img
            src="/works/hero.jpg"
            alt=""
            aria-hidden="true"
            width={1600}
            height={1200}
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/80 via-navy-900/25 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-900/80 to-transparent pointer-events-none" />

        {/* Первый экран: заголовок и кнопки. Уходят, когда начинается чертёж. */}
        <div
          ref={introRef}
          className="absolute inset-x-0 bottom-0 w-full px-5 sm:px-8 lg:px-14 2xl:px-24 pb-16 sm:pb-20"
          style={{ willChange: "opacity, transform" }}
        >
          <div className="animate-fadeup max-w-3xl">
            <span className="rack-kicker">{copy.eyebrow}</span>
            <h1 className="mt-5 font-display font-medium text-4xl sm:text-5xl lg:text-[3.7rem] leading-[1.06] tracking-[-0.015em] [text-wrap:balance]">
              {copy.title}
            </h1>
            <p className="mt-5 text-lg text-cloud-200/85 max-w-xl leading-relaxed">{copy.text}</p>
            <div className="flex flex-wrap gap-3 mt-7">
              <a
                href={ctaHref}
                className="btn-11 inline-flex items-center gap-2 bg-brand-grad text-white font-bold px-7 py-3.5 rounded-xl shadow-glow hover:brightness-110"
              >
                {copy.cta1} <IcoArrow className="w-5 h-5" />
              </a>
              <a
                href={cta2Href}
                className="inline-flex items-center gap-2 border border-white/30 hover:bg-white hover:text-navy-800 text-white px-7 py-3.5 rounded-xl font-semibold backdrop-blur-sm"
              >
                {copy.cta2}
              </a>
            </div>
            {chips.length > 0 && (
              <div className="flex flex-wrap gap-x-7 gap-y-2 mt-8 text-sm text-cloud-200/80">
                {chips.map((c) => (
                  <span key={c} className="inline-flex items-center gap-1.5">
                    <IcoCheck className="w-4 h-4 text-sky-400" /> {c}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {!isStatic && (
          <div
            ref={hintRef}
            aria-hidden="true"
            className="absolute bottom-6 right-6 lg:right-14 flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-cloud-200/70"
          >
            {copy.scrollHint}
            <span className="rack-hint-line" />
          </div>
        )}

        {/* Панели этапов: справа на широком экране, снизу на телефоне. */}
        {STAGE_ORDER.map((key) => {
          const st = copy.stages[key];
          const o = isStatic ? 1 : 0;
          return (
            <div
              key={key}
              ref={(el) => {
                panelRefs.current[key] = el;
              }}
              aria-hidden={isStatic ? "false" : "true"}
              className={
                isStatic
                  ? "relative w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-10 border-t border-white/10"
                  : "absolute left-5 right-5 bottom-28 sm:bottom-10 lg:left-auto lg:right-14 2xl:right-24 lg:top-1/2 lg:-translate-y-1/2 lg:bottom-auto lg:w-[400px]"
              }
              style={isStatic ? undefined : { opacity: o, willChange: "opacity, transform" }}
            >
              <div className="rack-panel">
                <span className="rack-kicker">{st.kicker}</span>
                <h2 className="mt-3 font-display font-medium text-2xl lg:text-[2rem] leading-[1.08] tracking-[-0.015em] [text-wrap:balance]">
                  {st.title}
                </h2>
                <ul className="mt-5 divide-y divide-white/10">
                  {st.facts.map((f) => (
                    <li key={f.l} className="flex items-baseline gap-4 py-3">
                      <span className="font-display font-medium text-2xl lg:text-3xl text-sky-300 tabular-nums whitespace-nowrap">
                        {f.n.replace("{positions}", String(positions))}
                      </span>
                      <span className="text-sm text-cloud-200/80 leading-snug">{f.l}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
      {!isStatic && <div aria-hidden="true" style={{ height: `calc(${HERO_LENGTH_VH}svh - 100svh)` }} className="rack-hero-track" />}
      {TUNING && <span hidden data-static-stage={staticState.stage} />}
    </section>
  );
}

export { HERO_LENGTH_VH, HERO_LENGTH_VH_MOBILE };
