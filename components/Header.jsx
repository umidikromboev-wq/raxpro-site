"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SITE } from "../lib/site";
import { NAV_T, T, normalizeLang } from "../lib/i18n";

// Обещание из отчёта по нише: срок ответа стоит рядом с телефоном, а не в подвале.
const FAST = { ru: "Ответим за 5 минут", uz: "5 daqiqada javob beramiz" };
import { IcoTg, IcoPhone } from "./Icons";
import { href, switchLangPath } from "../lib/lang";
import { PRODUCT_MENU, MENU_ANCHOR } from "../lib/landings/menu";
import CatalogSearch from "./CatalogSearch";

export default function Header({ lang = "ru" }) {
  const L = normalizeLang(lang);
  const nav = NAV_T[L];
  const menu = PRODUCT_MENU[L];
  const tr = T[L];
  const pathname = usePathname();
  const home = href(L, "/");
  // Пункты-якоря ведут на главную своего языка, разделы — на её подстраницы.
  const navHref = (h) => (h.startsWith("/#") ? home + h.slice(1) : href(L, h));
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Телефон: меню прячется, пока листают вниз, и возвращается на первом же движении вверх
  // (Умид, 22.09). На десктопе шапка всегда на месте. Открытое меню не прячем.
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 1023px)");
    const HIDE_AFTER = 80; // px от верха — выше шапка не прячется
    const STEP = 6; // px — мелкие дрожания пальца не переключают
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      if (mobile.matches) {
        if (y < HIDE_AFTER) setHidden(false);
        else if (y - last > STEP) setHidden(true);
        else if (last - y > STEP) setHidden(false);
      } else {
        setHidden(false);
      }
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Переключатель — обычные ссылки на тот же путь с другим языковым
  // префиксом: их видит поисковик и можно открыть в новой вкладке.
  const LangToggle = ({ className = "" }) => (
    <div
      className={`flex items-center rounded-lg border border-white/20 overflow-hidden text-sm ${className}`}
    >
      {["ru", "uz"].map((l) => (
        <a
          key={l}
          href={switchLangPath(pathname, l)}
          hrefLang={l}
          className={`px-2.5 py-1.5 font-semibold uppercase transition ${L === l ? "bg-white text-navy-800" : "text-white/80 hover:text-white"}`}
        >
          {l}
        </a>
      ))}
    </div>
  );

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-transform duration-300 ease-out ${hidden && !open ? "-translate-y-[120%]" : "translate-y-0"}`}>
      <div className="w-full px-4 sm:px-6 lg:px-10 mt-3">
        <div
          className={`relative bg-navy-900/90 flex items-center gap-4 h-16 rounded-2xl px-4 sm:px-5 border transition-all ${scrolled ? "bg-navy-900/90 backdrop-blur-md border-white/10 shadow-band" : "bg-navy-900/90 backdrop-blur-md border-white/15"}`}
        >
          <a
            href={home}
            className="flex items-center shrink-0"
            aria-label="RAXPRO"
          >
            <img loading="eager" decoding="async"
              src="/brand/raxpro-logo-white.png"
              alt="RAXPRO"
              width={790}
              height={363}
              className="h-8 w-auto"
            />
          </a>

          {/* gap ужат: в меню появился «Каталог», при gap-6 восьмой пункт
              наезжал на телефон на 1440. */}
          <nav className="hidden xl:flex flex-1 items-center justify-center gap-4 2xl:gap-5 text-[14px] 2xl:text-[15px] font-normal text-white/85">
            {nav.map((n) =>
              n.href === MENU_ANCHOR ? (
                <DesktopMenu key={n.href} label={n.label} href={navHref(n.href)} menu={menu} L={L} />
              ) : (
                <a
                  key={n.href}
                  href={navHref(n.href)}
                  className="hover:text-sky-300 transition-colors whitespace-nowrap"
                >
                  {n.label}
                </a>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2.5 ml-auto xl:ml-0 shrink-0">
            <LangToggle className="hidden sm:flex" />
            <a
              href={`tel:${SITE.phoneMain}`}
              className="hidden 2xl:flex items-center gap-2 text-white font-medium text-[15px] hover:text-sky-300 whitespace-nowrap"
            >
              <IcoPhone className="w-4 h-4 text-sky-300" />
              <span className="flex flex-col leading-tight">
                {SITE.phoneMainHuman}
                <span className="text-[11px] font-normal text-sky-200/90">{FAST[L]}</span>
              </span>
            </a>
            <CatalogSearch menu={menu} L={L} />
            <a
              href={SITE.telegram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              className="grid place-items-center w-10 h-10 rounded-xl bg-white/12 border border-white/15 text-white hover:bg-sky-500 hover:border-sky-500 transition"
            >
              <IcoTg className="w-5 h-5" />
            </a>
            <a
              href={home + "#zayavka"}
              className="btn-11 hidden lg:inline-flex text-sm font-medium px-5 py-2.5 rounded-xl bg-white/12 !border !border-white/20 text-white hover:bg-white hover:text-navy-800 transition backdrop-blur-sm whitespace-nowrap"
            >
              {tr.consult}
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              className="xl:hidden w-10 h-10 grid place-items-center rounded-xl bg-white/12 border border-white/15 text-white"
              aria-label="Menu"
            >
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                {open ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <div className="xl:hidden mt-2 rounded-2xl bg-navy-900/95 backdrop-blur-md border border-white/10 px-4 py-4">
            <nav className="flex flex-col divide-y divide-white/10">
              {nav.map((n) =>
                n.href === MENU_ANCHOR ? (
                  <details key={n.href} className="group/m py-3">
                    <summary className="list-none flex items-center justify-between text-white/90 font-medium cursor-pointer [&::-webkit-details-marker]:hidden">
                      {n.label}
                      <span aria-hidden className="text-white/60 transition group-open/m:rotate-180">▾</span>
                    </summary>
                    <div className="mt-2 pl-3 flex flex-col">
                      <a href={href(L, menu.all.path)} onClick={() => setOpen(false)} className="py-2 text-sky-300 font-medium">{menu.all.label}</a>
                      {menu.groups.map((g) => (
                        <div key={g.title} className="mt-2">
                          <div className="text-[11px] uppercase tracking-wider text-white/45">{g.title}</div>
                          {g.items.map(([label, path]) => (
                            <a key={path} href={href(L, path)} onClick={() => setOpen(false)} className="block py-1.5 text-white/85">{label}</a>
                          ))}
                        </div>
                      ))}
                    </div>
                  </details>
                ) : (
                  <a
                    key={n.href}
                    href={navHref(n.href)}
                    onClick={() => setOpen(false)}
                    className="py-3 text-white/90 font-medium"
                  >
                    {n.label}
                  </a>
                ),
              )}
            </nav>
            <div className="mt-3 flex items-center justify-between gap-2">
              <a
                href={`tel:${SITE.phoneMain}`}
                className="flex items-center gap-2 font-medium text-white"
              >
                <IcoPhone className="w-4 h-4 text-sky-300" />{" "}
                <span className="flex flex-col leading-tight">
                  {SITE.phoneMainHuman}
                  <span className="text-[11px] font-normal text-sky-200/90">{FAST[L]}</span>
                </span>
              </a>
              <LangToggle />
            </div>
            <a
              href={home + "#zayavka"}
              onClick={() => setOpen(false)}
              className="mt-3 block bg-brand-grad text-white text-center font-semibold px-5 py-3 rounded-xl"
            >
              {tr.consult}
            </a>
          </div>
        )}
      </div>
    </header>
  );
}

// Выпадашка «Продукция»: открывается наведением и с клавиатуры (focus-within),
// сам пункт по-прежнему ведёт на блок направлений главной.
function DesktopMenu({ label, href: to, menu, L }) {
  return (
    <div className="relative group/dd">
      <a href={to} aria-haspopup="true" className="inline-flex items-center gap-1 hover:text-sky-300 transition-colors whitespace-nowrap">
        {label}
        <span aria-hidden className="text-[10px] opacity-70 transition group-hover/dd:rotate-180">▾</span>
      </a>
      <div className="invisible opacity-0 translate-y-1 group-hover/dd:visible group-hover/dd:opacity-100 group-hover/dd:translate-y-0 group-focus-within/dd:visible group-focus-within/dd:opacity-100 group-focus-within/dd:translate-y-0 transition absolute left-1/2 -translate-x-1/2 top-full pt-4">
        <div className="w-[820px] max-w-[calc(100vw-2rem)] rounded-2xl bg-navy-900 border border-white/10 shadow-band p-6 grid grid-cols-3 gap-6">
          {menu.groups.map((g) => (
            <div key={g.title}>
              <div className="text-[11px] uppercase tracking-wider text-white/45 mb-2">{g.title}</div>
              <ul className="space-y-1.5">
                {g.items.map(([text, path]) => (
                  <li key={path}><a href={href(L, path)} className="text-white/85 hover:text-sky-300">{text}</a></li>
                ))}
              </ul>
            </div>
          ))}
          <a href={href(L, menu.all.path)} className="col-span-3 border-t border-white/10 pt-4 text-sky-300 font-medium hover:text-sky-200">{menu.all.label} →</a>
        </div>
      </div>
    </div>
  );
}
