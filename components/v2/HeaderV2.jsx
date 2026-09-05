"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SITE } from "../../lib/site";
import { V2 } from "../../lib/v2-copy";
import { href, switchLangPath, normalizeLang } from "../../lib/lang";
import { IcoPhone } from "../Icons";

// Шапка v2: прозрачная поверх героя, стальная плашка после прокрутки.
// Меню — якоря главной; язык — обычные ссылки на тот же путь.
export default function HeaderV2({ lang = "ru" }) {
  const L = normalizeLang(lang);
  const t = V2[L];
  const pathname = usePathname();
  const home = href(L, "/");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [open]);

  const Lang = () => (
    <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider">
      {["ru", "uz"].map((l) => (
        <a
          key={l}
          href={switchLangPath(pathname, l)}
          hrefLang={l}
          className={`px-2 py-1 rounded ${L === l ? "bg-white text-steel-900" : "text-white/70 hover:text-white"}`}
        >
          {l}
        </a>
      ))}
    </div>
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-colors duration-300 ${scrolled || open ? "bg-steel-950/92 backdrop-blur-md border-b border-white/10" : "bg-transparent"}`}
      >
        <div className="v2-wrap flex h-16 lg:h-[72px] items-center justify-between gap-6">
          <a href={home} aria-label="RAXPRO" className="flex items-center gap-3 shrink-0">
            <img src="/brand/raxpro-logo-white.png" alt="RAXPRO" width={140} height={36} loading="eager" decoding="async" className="h-8 w-auto" />
          </a>

          <nav aria-label="Основное меню" className="hidden lg:flex items-center gap-7 text-[15px] text-white/85">
            {t.nav.map((n) => (
              <a key={n.href} href={home + n.href} className="hover:text-white">
                {n.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-5">
            <Lang />
            <a href={`tel:${SITE.landline}`} className="font-num text-2xl tracking-wide text-white tabular-nums hover:text-beam-400">
              {SITE.landlineHuman}
            </a>
            <a href={home + "#zayavka"} className="v2-btn v2-btn--beam">
              {t.cta}
            </a>
          </div>

          <div className="flex lg:hidden items-center gap-3">
            <a href={`tel:${SITE.landline}`} aria-label={t.call} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white">
              <IcoPhone className="h-5 w-5" />
            </a>
            <button
              type="button"
              aria-expanded={open}
              aria-label="Меню"
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white"
            >
              <span className="relative block h-3 w-5">
                <span className={`absolute inset-x-0 top-0 h-0.5 bg-current transition ${open ? "translate-y-[5px] rotate-45" : ""}`} />
                <span className={`absolute inset-x-0 bottom-0 h-0.5 bg-current transition ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 top-16 bg-steel-950 text-white">
          <div className="v2-wrap flex h-full flex-col py-8">
            <nav className="flex flex-col gap-1">
              {t.nav.map((n, i) => (
                <a
                  key={n.href}
                  href={home + n.href}
                  onClick={() => setOpen(false)}
                  className="font-display text-[2.6rem] leading-[1.05] uppercase tracking-tight py-2 border-b border-white/10 flex items-baseline gap-4"
                >
                  <span className="font-num text-base text-beam-400 tabular-nums">0{i + 1}</span>
                  {n.label}
                </a>
              ))}
            </nav>
            <div className="mt-auto flex items-center justify-between gap-4">
              <Lang />
              <a href={`tel:${SITE.landline}`} className="font-num text-3xl tabular-nums">{SITE.landlineHuman}</a>
            </div>
            <a href={home + "#zayavka"} onClick={() => setOpen(false)} className="v2-btn v2-btn--beam mt-5 w-full">
              {t.cta}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
