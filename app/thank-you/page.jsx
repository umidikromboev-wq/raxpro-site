import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { T, normalizeLang } from "../../lib/i18n";
import { cookies } from "next/headers";

export default async function ThankYouPage() {
  const store = await cookies();
  const L = normalizeLang(store.get("lang")?.value);
  const t = T[L];

  return (
    <>
      <Header lang={L} />

      {/* Fon rangi configdagi och brend rangiga (cloud.50 -> #f2f8fd) o'tkazildi */}
      <div className="min-h-screen bg-navy-800 flex items-center justify-center px-4 py-[160px] font-sans">
        <div className="max-w-md w-full bg-white rounded-[2rem] shadow-card p-8 sm:p-12 text-center relative overflow-hidden group">
          {/* Orqa fondagi yengil dekorativ effektlar */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#bce7fb]/30 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#e8f2fb]/50 rounded-full blur-xl pointer-events-none" />

          {/* Muvaffaqiyat belgisi (Success Icon) */}
          <div className="mx-auto w-20 h-20 bg-[#e8f2fb] rounded-full flex items-center justify-center mb-8 text-[#00a2eb] relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
              className="w-10 h-10 animate-fadeup"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>

          {/* Dinamik sarlavha */}
          <h1 className="font-display font-medium text-2xl sm:text-3xl text-navy-900 tracking-tight mb-4">
            {t.thankYouTitle || "Arizangiz qabul qilindi!"}
          </h1>

          {/* Dinamik tavsif */}
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-8">
            {t.thankYouDesc ||
              "Bizga ishonch bildirganingiz uchun rahmat. Mutaxassislarimiz tez orada siz bilan bog‘lanishadi."}
          </p>

          {/* Bosh sahifaga qaytish tugmasi */}
          <a
            href="/"
            className="inline-flex items-center justify-center w-full py-4 px-6 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-medium text-base shadow-glow hover:shadow-lg transition-all duration-300 transform active:scale-[0.98]"
          >
            {t.backToHome || "Bosh sahifaga qaytish"}
          </a>

          {/* Qo'shimcha aloqa qismi */}
          <div className="mt-8 pt-6 border-t border-cloud-100">
            <p className="text-xs text-slate-400">
              {t.haveQuestions || "Shoshilinch savollar bormi?"}{" "}
              <a
                href="tel:+998"
                className="text-sky-500 hover:underline font-medium ml-1"
              >
                {t.callUs || "Bizga qo‘ng‘iroq qiling"}
              </a>
            </p>
          </div>
        </div>
      </div>

      <Footer lang={L} />
    </>
  );
}
