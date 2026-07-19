"use client";
import { useEffect, useState } from "react";
import { SITE } from "../lib/site";
import { NAV_T, T, normalizeLang } from "../lib/i18n";
import { IcoTg, IcoPhone } from "./Icons";

export default function Header({ lang = "ru" }) {
  const L = normalizeLang(lang);
  const nav = NAV_T[L];
  const tr = T[L];
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function switchLang(next) {
    if (next === L) return;
    document.cookie = `lang=${next};path=/;max-age=31536000`;
    window.location.reload();
  }

  const LangToggle = ({ className = "" }) => (
    <div
      className={`flex items-center rounded-lg border border-white/20 overflow-hidden text-sm ${className}`}
    >
      {["ru", "uz"].map((l) => (
        <button
          key={l}
          onClick={() => switchLang(l)}
          className={`px-2.5 py-1.5 font-semibold uppercase transition ${L === l ? "bg-white text-navy-800" : "text-white/80 hover:text-white"}`}
        >
          {l}
        </button>
      ))}
    </div>
  );

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-10 mt-3">
        <div
          className={`relative bg-navy-900/90 flex items-center gap-4 h-16 rounded-2xl px-4 sm:px-5 border transition-all ${scrolled ? "bg-navy-900/90 backdrop-blur-md border-white/10 shadow-band" : "bg-navy-900/90 backdrop-blur-md border-white/15"}`}
        >
          <a
            href="/"
            className="flex items-center shrink-0"
            aria-label="RAXPRO"
          >
            <img
              src="/brand/raxpro-logo-white.png"
              alt="RAXPRO"
              className="h-8 w-auto"
            />
          </a>

          <nav className="hidden xl:flex flex-1 items-center justify-center gap-6 text-[15px] font-normal text-white/85">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="hover:text-sky-300 transition-colors whitespace-nowrap"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5 ml-auto xl:ml-0 shrink-0">
            <LangToggle className="hidden sm:flex" />
            <a
              href={`tel:${SITE.phoneMain}`}
              className="hidden 2xl:flex items-center gap-2 text-white font-medium text-[15px] hover:text-sky-300 whitespace-nowrap"
            >
              <IcoPhone className="w-4 h-4 text-sky-300" />
              {SITE.phoneMainHuman}
            </a>
            <a
              href={SITE.telegram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              className="hidden sm:grid place-items-center w-10 h-10 rounded-xl bg-white/12 border border-white/15 text-white hover:bg-sky-500 hover:border-sky-500 transition"
            >
              <IcoTg className="w-5 h-5" />
            </a>
            <a
              href="#zayavka"
              className="hidden lg:inline-flex text-sm font-medium px-5 py-2.5 rounded-xl bg-white/12 border border-white/20 text-white hover:bg-white hover:text-navy-800 transition backdrop-blur-sm whitespace-nowrap"
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
              {nav.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="py-3 text-white/90 font-medium"
                >
                  {n.label}
                </a>
              ))}
            </nav>
            <div className="mt-3 flex items-center justify-between gap-2">
              <a
                href={`tel:${SITE.phoneMain}`}
                className="flex items-center gap-2 font-medium text-white"
              >
                <IcoPhone className="w-4 h-4 text-sky-300" />{" "}
                {SITE.phoneMainHuman}
              </a>
              <LangToggle />
            </div>
            <a
              href="#zayavka"
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
