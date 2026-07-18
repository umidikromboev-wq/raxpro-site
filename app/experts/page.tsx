import React from "react";
import { cookies } from "next/headers";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { T, EXTRA, normalizeLang } from "../../lib/i18n";

export default async function Home() {
  const store = await cookies();
  const L = normalizeLang(store.get("lang")?.value);

  return (
    <div className="bg-[#f4f7fa] text-[#1c2e4a] min-h-screen font-sans overflow-x-hidden">
      {/* Navbar shu Header komponenti ichida */}
      <Header lang={L} />
      <div className="w-full min-h-[85vh] flex items-center justify-center bg-[#f5f7fa] px-4 md:px-12 py-12">
        <div className="flex flex-col space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15] text-[#16233f]">
            <span className="text-[#2fb6f5]">RAX PRO</span> Muhandislari va
            Mutaxassislari
          </h1>
          <p className="text-[#98a2b3] text-base md:text-lg leading-relaxed max-w-md">
            RAX PRO mutaxassislari bilan ombor va savdo stellajlari bo'yicha
            professional maslahat oling. Loyihalash, o'lchov, ishlab chiqarish
            va montaj xizmatlari.
          </p>
          <div className="pt-2">
            <button className="flex items-center gap-3 bg-gradient-to-r from-[#3fc2ff] to-[#0072e5] text-white font-medium text-sm md:text-base px-7 py-4 rounded-full hover:opacity-90 transition-all shadow-md">
              <span>Kansultatsiyaga yozilish</span>
              <span className="flex items-center justify-center w-6 h-6">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>
        <div></div>
      </div>
      <Footer lang={L} />{" "}
    </div>
  );
}
