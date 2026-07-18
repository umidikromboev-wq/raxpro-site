import React from "react";
import { cookies } from "next/headers";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { T, normalizeLang } from "../../lib/i18n";

import { Eyebrow } from "../../components/Section";
import Reveal from "../../components/Reveal";
import { IcoArrow } from "../../components/Icons";

export default async function Page() {
  const store = await cookies();
  const L = normalizeLang(store.get("lang")?.value);
  const t = T[L];

  // Ma'lumotlar to'g'ridan-to'g'ri i18n ichidan keladi
  const currentSpecialists = t.specialists || [];

  return (
    <div className="bg-white text-ink">
      <Header lang={L} />

      {/* METRICS */}
      <section className="relative bg-navy-900 text-white overflow-hidden notch-tr">
        <div className="absolute inset-0 grid-lines opacity-30" />
        <div className="relative w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16">
          <div className="grid lg:grid-cols-[1fr,1.5fr] gap-10 items-center">
            <div>
              <Eyebrow light>{t.numsEyebrow}</Eyebrow>
              <h2 className="mt-4 font-display font-medium text-3xl sm:text-4xl">
                {t.numsTitle}
              </h2>
              <p className="mt-3 text-cloud-200/75 max-w-md">{t.numsText}</p>
              <a
                href="#zayavka"
                className="inline-flex items-center gap-2 mt-6 bg-white text-navy-900 font-bold px-6 py-3 rounded-xl hover:bg-sky-400 hover:text-white transition"
              >
                {t.numsCta} <IcoArrow className="w-5 h-5" />
              </a>
            </div>

            <Reveal
              as="div"
              variant="fade"
              stagger={70}
              className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-white/10 rounded-xl2 overflow-hidden border border-white/10"
            >
              {t.stats?.map((s, idx) => (
                <div key={s.l || idx} className="bg-navy-900 p-6">
                  <div className="font-display font-medium text-4xl sm:text-5xl text-sky-400 leading-none">
                    {s.n}
                    <span className="text-2xl text-sky-300 ml-1">{s.s}</span>
                  </div>
                  <div className="text-cloud-200/70 text-sm mt-2 leading-snug">
                    {s.l}
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* SPECIALISTS SECTION */}
      <section className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20 bg-white">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-display font-medium text-3xl sm:text-4xl text-navy-800 tracking-tight">
            {t.teamTitle}
          </h2>
          <p className="mt-4 text-slate-500 text-sm sm:text-base leading-relaxed">
            {t.teamText}
          </p>
        </div>

        {/* Grid cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentSpecialists.map((person, idx) => (
            <Reveal key={person.id || idx} delay={idx * 80}>
              <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden group shadow-sm">
                <img
                  src={person.img || "/images/command.png"}
                  alt={person.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Ism tugmasi - Faqat chap burchakda turishi uchun to'g'irlandi */}
                {/* Ism tugmasi - Chetga yopishib qolishini oldini olish uchun qayta sozlandi */}
                <div className="absolute bottom-0 left-0 z-30 p-5 w-full pointer-events-none">
                  <div className="bg-white text-navy-900 font-medium text-sm sm:text-base py-3 px-5 rounded-2xl shadow-lg inline-block w-max max-w-full truncate pointer-events-auto">
                    {person.name}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Slider Navigations */}
        <div
          className="flex items-center justify-center mt-12"
          style={{ gap: "24px" }}
        >
          {/* Chapga o'q */}
          <button
            className="rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600 transition shrink-0 shadow-sm"
            style={{ width: "48px", height: "48px" }}
          >
            <IcoArrow className="w-5 h-5 rotate-180" />
          </button>

          {/* Karusel nuqtalari */}
          <div
            className="flex items-center justify-center shrink-0"
            style={{ gap: "12px", minWidth: "max-content" }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "#00a2eb",
                flexShrink: 0,
                display: "block",
              }}
            />
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#c2d3e2",
                flexShrink: 0,
                display: "block",
              }}
            />
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#c2d3e2",
                flexShrink: 0,
                display: "block",
              }}
            />
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#c2d3e2",
                flexShrink: 0,
                display: "block",
              }}
            />
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#c2d3e2",
                flexShrink: 0,
                display: "block",
              }}
            />
          </div>

          {/* O'ngga o'q — Ichidagi o'q rangi ham border bilan bir xil rangga o'tkazildi */}
          <button
            className="rounded-full bg-white flex items-center justify-center hover:bg-sky-50 transition shrink-0"
            style={{
              width: "48px",
              height: "48px",
              border: "2px solid #00a2eb",
              color: "#00a2eb",
            }}
          >
            <IcoArrow className="w-5 h-5" style={{ color: "#00a2eb" }} />
          </button>
        </div>
      </section>

      <Footer lang={L} />
    </div>
  );
}
