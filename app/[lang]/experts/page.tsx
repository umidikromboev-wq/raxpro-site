import React from "react";
import { alternatesFor, href, absHref, LANGS } from "../../../lib/lang";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { T, normalizeLang } from "../../../lib/i18n";
import { IcoArrow } from "../../../components/Icons";
import SpecialistsSection from "../../../components/SpecialistsSection";

const EXPERTS_META = {
  ru: {
    title: 'Специалисты RAXPRO — команда инженеров и монтажников | Ташкент',
    description:
      'Кто проектирует, комплектует и монтирует ваши стеллажи: инженеры, замерщики и монтажные бригады RAXPRO. Сертификаты ISO, гарантия 10 лет, 1000+ выполненных проектов.',
  },
  uz: {
    title: 'RAXPRO mutaxassislari — muhandis va montajchilar jamoasi | Toshkent',
    description:
      'Stellajlaringizni kim loyihalaydi, butlaydi va oʻrnatadi: RAXPRO muhandislari, oʻlchovchilari va montaj brigadalari. ISO sertifikatlari, 10 yil kafolat, 1000+ loyiha.',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const L = normalizeLang((await params).lang) as 'ru' | 'uz';
  return { ...EXPERTS_META[L], alternates: alternatesFor('/experts', L) };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const L = normalizeLang((await params).lang);
  const t = T[L];

  // Sertifikatlar uchun testiviy ma'lumotlar massivi

  return (
    <div className="bg-white text-ink">
      <Header lang={L} />

      {/* Первый экран: только текст, без коллажа (правка 22.09 — «просто и понятно») */}
      <section className="w-full bg-cloud-50 px-5 sm:px-8 lg:px-14 2xl:px-24 pt-36 sm:pt-44 pb-14 sm:pb-20">
        <div className="max-w-3xl">
          <h1 className="font-display font-medium text-4xl sm:text-5xl lg:text-[56px] leading-[1.05] tracking-tight text-navy-900">
            <span className="text-sky-500">RaxPro</span>{" "}
            {t.raxProTitle || (L === "uz" ? "Muhandislari va Mutaxassislari" : "Инженеры и Специалисты")}
          </h1>
          <p className="mt-5 sm:mt-6 max-w-xl text-slate-500 text-base sm:text-lg leading-relaxed">
            {t.raxProText ||
              (L === "uz"
                ? "RAX PRO mutaxassislari bilan ombor va savdo stellajlari bo‘yicha professional maslahat oling. Loyihalash, o‘lchov, ombordan yetkazish va montaj xizmatlari."
                : "Получите профессиональную консультацию по складским и торговым стеллажам от специалистов RAX PRO. Проектирование, замер, поставка со склада и монтаж.")}
          </p>
          <a
            href={href(L, "/#zayavka")}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-navy-900 font-bold px-6 py-3.5 transition"
          >
            {t.raxProCta || (L === "uz" ? "Konsultatsiyaga yozilish" : "Записаться на консультацию")}
            <IcoArrow className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* SPECIALISTS SECTION */}
      <SpecialistsSection t={t} />

      <Footer lang={L} />
    </div>
  );
}
