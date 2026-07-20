import React from "react";
import { cookies } from "next/headers";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { T, normalizeLang } from "../../lib/i18n";
import { Eyebrow } from "../../components/Section";
import Reveal from "../../components/Reveal";
import { IcoArrow } from "../../components/Icons";
import SpecialistsSection from "../../components/SpecialistsSection";

export default async function Page() {
  const store = await cookies();
  const L = normalizeLang(store.get("lang")?.value);
  const t = T[L];

  // Sertifikatlar uchun testiviy ma'lumotlar massivi

  return (
    <div className="bg-white text-ink">
      <Header lang={L} />

      <section
        style={{
          width: "100%",
          backgroundColor: "#f4f6f9",
          paddingTop: "149px",
          paddingBottom: "40px",
          overflow: "hidden",
        }}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .rax-btn:hover {
            transform: scale(1.03) !important;
          }
          .rax-btn:active {
            transform: scale(0.98) !important;
          }
          @media (min-width: 768px) {
            .rax-section { padding-top: 64px !important; padding-bottom: 64px !important; }
            .rax-container { padding-left: 32px !important; padding-right: 32px !important; }
            .rax-row { flex-direction: row !important; align-items: center !important; justify-content: space-between !important; gap: 48px !important; }
            .rax-text-col { max-width: 643px !important; align-items: flex-start !important; text-align: left !important; gap: 29px !important; }
            .rax-title { font-size: 48px !important; }
            .rax-desc { font-size: 21px !important; }
            .rax-btn { font-size: 15px !important; }
            .rax-mobile-images { display: none !important; }
            .rax-desktop-images { display: flex !important; gap: 30px !important; margin-left: auto !important; }
          }
        `,
          }}
        />

        <div
          className="rax-container"
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            maxWidth: "1320px",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          <div
            className="rax-row"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "40px",
            }}
          >
            {/* Text Column */}
            <div
              className="rax-text-col"
              style={{
                width: "100%",
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "24px",
              }}
            >
              <h2
                className="rax-title"
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "28px",
                  fontWeight: 600,
                  lineHeight: 1.2,
                  letterSpacing: "-0.03em",
                  color: "#22282B",
                  margin: 0,
                }}
              >
                <span style={{ color: "#26B8F2" }}>RAX PRO</span>{" "}
                {t.raxProTitle ||
                  (L === "uz"
                    ? "Muhandislari va Mutaxassislari"
                    : "Инженеры и Специалисты")}
              </h2>

              <p
                className="rax-desc"
                style={{
                  maxWidth: "565px",
                  fontSize: "15px",
                  fontWeight: 500,
                  lineHeight: 1.3,
                  letterSpacing: "-0.02em",
                  color: "#909DA2",
                  margin: 0,
                }}
              >
                {t.raxProText ||
                  (L === "uz"
                    ? "RAX PRO mutaxassislari bilan ombor va savdo stellajlari bo‘yicha professional maslahat oling. Loyihalash, o‘lchov, ishlab chiqarish va montaj xizmatlari."
                    : "Получите профессиональную консультацию по складским и торговым стеллажам от специалистов RAX PRO. Проектирование, замер, производство и монтаж.")}
              </p>

              <a
                href="https://raxpro.uz/#kontakty"
                className="rax-btn"
                style={{
                  display: "inline-flex",
                  width: "fit-content",
                  alignItems: "center",
                  gap: "8px",
                  borderRadius: "9999px",
                  background: "linear-gradient(to right, #1E88E5, #42A5F5)",
                  paddingLeft: "24px",
                  paddingRight: "24px",
                  paddingTop: "12px",
                  paddingBottom: "12px",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "white",
                  textDecoration: "none",
                  boxShadow:
                    "0 4px 6px -1px rgba(66, 165, 245, 0.2), 0 2px 4px -1px rgba(66, 165, 245, 0.15)",
                  transition: "transform 0.3s ease",
                }}
              >
                {t.raxProCta ||
                  (L === "uz"
                    ? "Konsultatsiyaga yozilish"
                    : "Записаться на консультацию")}
                <span aria-hidden="true">→</span>
              </a>
            </div>

            {/* Images - Mobile */}
            <div
              className="rax-mobile-images"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "14px",
                width: "calc(100% + 48px)",
                marginLeft: "-24px",
                marginRight: "-24px",
                marginTop: "8px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "28px",
                  transform: "translateX(-12px)",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "235/153",
                    overflow: "hidden",
                    borderRadius: "20px",
                  }}
                >
                  <img
                    src="/images/head1.png"
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "235/153",
                    overflow: "hidden",
                    borderRadius: "20px",
                  }}
                >
                  <img
                    src="/images/head2.png"
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "28px",
                  paddingTop: "36px",
                  transform: "translateX(12px)",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "235/153",
                    overflow: "hidden",
                    borderRadius: "20px",
                  }}
                >
                  <img
                    src="/images/head3.png"
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "235/153",
                    overflow: "hidden",
                    borderRadius: "20px",
                  }}
                >
                  <img
                    src="/images/head4.png"
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Images - Desktop */}
            <div className="rax-desktop-images" style={{ display: "none" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "40px",
                }}
              >
                <div
                  style={{
                    width: "411px",
                    height: "231px",
                    overflow: "hidden",
                    borderRadius: "25px",
                  }}
                >
                  <img
                    src="/images/head1.png"
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div
                  style={{
                    width: "411px",
                    height: "231px",
                    overflow: "hidden",
                    borderRadius: "25px",
                  }}
                >
                  <img
                    src="/images/head2.png"
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "40px",
                  paddingTop: "37px",
                  transform: "translateX(20px)",
                }}
              >
                <div
                  style={{
                    width: "411px",
                    height: "231px",
                    overflow: "hidden",
                    borderRadius: "25px",
                  }}
                >
                  <img
                    src="/images/head3.png"
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div
                  style={{
                    width: "411px",
                    height: "231px",
                    overflow: "hidden",
                    borderRadius: "25px",
                  }}
                >
                  <img
                    src="/images/head4.png"
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METRICS SECTION */}
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
                href="https://raxpro.uz/#kontakty"
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
      <SpecialistsSection t={t} />

      <Footer lang={L} />
    </div>
  );
}
