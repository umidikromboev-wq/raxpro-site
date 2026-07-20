"use client";

import React, { useState } from "react";
import Reveal from "./Reveal";
import { IcoArrow } from "./Icons";

export default function SpecialistsSection({ t }) {
  const specialists = t?.specialists || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Desktopda bir vaqtda 4 ta ko'rinadi
  const itemsPerPage = 4;
  const maxIndex = Math.max(0, specialists.length - itemsPerPage);

  // Oxirgi va birinchi slayd holatlarini aniqlaymiz
  const isAtStart = currentIndex === 0;
  const isAtEnd = currentIndex === maxIndex;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  return (
    <section className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-16 sm:py-20 bg-white">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="font-display font-medium text-3xl sm:text-4xl text-navy-800 tracking-tight">
          {t?.teamTitle}
        </h2>
        <p className="mt-4 text-slate-500 text-sm sm:text-base leading-relaxed">
          {t?.teamText}
        </p>
      </div>

      {/* --- MOBIL KO'RINISH (Pastma-past, 1 ustun) --- */}
      <div className="grid grid-cols-1 gap-6 sm:hidden w-full">
        {specialists.map((person, idx) => (
          <div key={person.id || idx} className="w-full">
            <Reveal delay={(idx % 4) * 80}>
              <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden group shadow-sm">
                <img
                  src={person.img || "/images/command.png"}
                  alt={person.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 z-30 p-5 w-full pointer-events-none">
                  <div className="bg-white text-navy-900 font-medium text-sm py-3 px-5 rounded-2xl shadow-lg inline-block w-max max-w-full truncate pointer-events-auto">
                    {person.name}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        ))}
      </div>

      {/* --- DESKTOP/TABLET KO'RINISH (Slider) --- */}
      <div className="hidden sm:block overflow-hidden w-full">
        <div
          className="flex transition-transform duration-500 ease-out gap-6"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
          }}
        >
          {specialists.map((person, idx) => (
            <div
              key={person.id || idx}
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] shrink-0"
            >
              <Reveal delay={(idx % itemsPerPage) * 80}>
                <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden group shadow-sm">
                  <img
                    src={person.img || "/images/command.png"}
                    alt={person.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 z-30 p-5 w-full pointer-events-none">
                    <div className="bg-white text-navy-900 font-medium text-sm sm:text-base py-3 px-5 rounded-2xl shadow-lg inline-block w-max max-w-full truncate pointer-events-auto">
                      {person.name}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>

      {/* Slider Navigations (Desktop va Tabletda) */}
      <div className="hidden sm:flex items-center justify-center mt-12 gap-6">
        {/* Prev Button: O'ng tarafga surilganda to'liq ko'k bo'ladi, boshida bo'lsa ochiq (outline) turadi */}
        <button
          onClick={handlePrev}
          type="button"
          aria-label="Previous"
          className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 cursor-pointer outline-none transition-all duration-300 ${
            !isAtStart
              ? "bg-[#00a2eb] text-white border-2 border-[#00a2eb] shadow-md"
              : "bg-white text-[#00a2eb] border-2 border-[#00a2eb] hover:bg-sky-50"
          }`}
        >
          <IcoArrow className="w-5 h-5 rotate-180 fill-current" />
        </button>

        {/* Dots */}
        <div className="flex items-center justify-center shrink-0 gap-3 min-w-max">
          {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setCurrentIndex(dotIdx)}
              type="button"
              aria-label={`Go to slide ${dotIdx + 1}`}
              style={{
                width: currentIndex === dotIdx ? "10px" : "8px",
                height: currentIndex === dotIdx ? "10px" : "8px",
                borderRadius: "50%",
                backgroundColor:
                  currentIndex === dotIdx ? "#00a2eb" : "#c2d3e2",
                flexShrink: 0,
                border: "none",
                padding: 0,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>

        {/* Next Button: Boshida yoki o'ngga surilishi kerak bo'lganda to'liq ko'k bo'ladi, oxiriga yetganda ochiq bo'ladi */}
        <button
          onClick={handleNext}
          type="button"
          aria-label="Next"
          className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 cursor-pointer outline-none transition-all duration-300 ${
            !isAtEnd
              ? "bg-[#00a2eb] text-white border-2 border-[#00a2eb] shadow-md"
              : "bg-white text-[#00a2eb] border-2 border-[#00a2eb] hover:bg-sky-50"
          }`}
        >
          <IcoArrow className="w-5 h-5 fill-current" />
        </button>
      </div>
    </section>
  );
}
