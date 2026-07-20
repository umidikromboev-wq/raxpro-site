"use client";

import React, { useState } from "react";
import { Star, ArrowLeft, ArrowRight, Plus } from "lucide-react";

export default function OpinionsSlider({ L, translations }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Birinchi komponentdagi ma'lumotlar bazasi
  const opinionsData = [
    {
      id: 1,
      name: "Nigora",
      name_ru: "Нигора",
      role: "Hamkor",
      role_ru: "Партнер",
      rating: 4.8,
      image: "/opinions/opinion1.jpg",
      text: "RAX PRO bilan hamkorlik davomida mahsulot sifati, o‘z vaqtida yetkazib berish va professional yondashuvdan to‘liq mamnun bo‘ldik. Jamoa har bir loyihaga mas'uliyat bilan yondashadi va ishonchli yechimlarni taklif qiladi. Kelgusida ham hamkorligimizni davom ettirishni rejalashtirganmiz.",
      text_ru:
        "В ходе сотрудничества с RAX PRO мы остались полностью довольны качеством продукции, своевременной доставкой и профессиональным подходом. Команда с высокой ответственностью подходит к каждому проекту и предлагает надежные решения. Мы планируем продолжать наше сотрудничество и в будущем.",
    },
    {
      id: 2,
      name: "Madina Karimova",
      name_ru: "Мадина Каримова",
      role: "Mijoz",
      role_ru: "Клиент",
      rating: 5.0,
      image: "/opinions/opinion8.jpg",
      text: "RAX PRO jamoasini erishilgan muvaffaqiyatlar bilan chin dildan tabriklayman. Ayniqsa, loyiha menejeri Bekzod Omonovga alohida rahmat. Juda xushmuomala va o‘z kasbining fidoyisi bo‘lgan mutaxassis ekanlar.",
      text_ru:
        "От всего сердца поздравляю команду RAX PRO с достигнутыми успехами. В частности, хочу отдельно поблагодарить проект-менеджера Бекзода Омонова. Он очень вежливый и преданный своему делу специалист.",
    },
    {
      id: 3,
      name: "Azizbek Tursunov",
      name_ru: "Азизбек Турсунов",
      role: "Hamkor",
      role_ru: "Партнер",
      rating: 4.9,
      image: "/opinions/opinion3.jpg",
      text: "RAX PRO bilan hamkorlik qilayotganimizga 2 yil bo‘ldi. Ish o‘z vaqtida va yuqori sifatda bajariladi. Barcha xodimlarga va rahbariyatga minnatdorchilik bildiraman! Qozog‘iston Respublikasi, Aqtau shahridan salomlar! Do‘stligimiz va hamkorligimiz abadiy bo‘lsin.",
      text_ru:
        "Уже 2 года сотрудничаем с RAX PRO. Вся работа выполняется в срок и на высоком уровне. Выражаю благодарность всему персоналу и руководству! Привет из Республики Казахстан, город Актау! Пусть наша дружба и сотрудничество будут вечными.",
    },
    {
      id: 4,
      name: "Ali Murodov",
      name_ru: "Али Муродов",
      role: "Mijoz",
      role_ru: "Клиент",
      rating: 4.7,
      image: "/opinions/opinion4.jpg",
      text: "RAX PRO jamoasiga ulkan muvaffaqiyatlar tilayman. Ayniqsa, texnik mutaxassis Ahmad Eshonqulovga rahmat. Avval boshqa joyda yechimini topa olmagan murakkab topshirig‘imizni qisqa muddatda hal qilib berishdi. Mana 2 yil bo‘ldi, tizim barqaror ishlamoqda.",
      text_ru:
        "Желаю команде RAX PRO больших успехов. Особенно хочу поблагодарить технического специалиста Ахмада Эшонкулова. Нашу сложную задачу, которую не смогли решить в другом месте, они решили в кратчайшие сроки. Вот уже 2 года система работает стабильно.",
    },
    {
      id: 5,
      name: "Farrux Olimov",
      name_ru: "Фаррух Олимов",
      role: "Hamkor",
      role_ru: "Партнер",
      rating: 5.0,
      image: "/opinions/opinion2.jpg",
      text: "RAX PRO xizmat ko‘rsatish sifatiga gap bo‘lishi mumkin emas. O‘zim shaxsan hamkorlik qilib bunga guvoh bo‘ldim. Xalqaro ekspertlar xulosasi va RAX PRO taqdim etgan yechimlar bir xil darajada yuqori chiqdi. To‘liq ishonsa bo‘ladi.",
      text_ru:
        "К качеству услуг RAX PRO нет никаких претензий. Я сам лично убедился в этом в ходе сотрудничества. Заключения международных экспертов и решения RAX PRO оказались на одинаково высоком уровне. Можно полностью доверять.",
    },
    {
      id: 6,
      name: "Bahrom Xamidov",
      name_ru: "Бахром Хамидов",
      role: "Mijoz",
      role_ru: "Клиент",
      rating: 4.9,
      image: "/opinions/opinion5.jpg",
      text: "RAX PRO kompaniyasiga katta rahmat. Ko‘p yillardan buyon to‘g‘ri yechim topilmagan texnik muammomizga ularning malakali mutaxassislari aniq va tushunarli yechim berishdi. Uzoq izlanishlardan so‘ng faqat shu jamoadan aniq natija oldik.",
      text_ru:
        "Большое спасибо компании RAX PRO. Их квалифицированные специалисты дали четкое и понятное решение нашей технической проблемы, которую не могли решить много лет. После долгих поисков мы получили точный результат только от этой команды.",
    },
    {
      id: 7,
      name: "Jasur Ahrorov",
      name_ru: "Жасур Ахроров",
      role: "Mijoz",
      role_ru: "Клиент",
      rating: 4.8,
      image: "/opinions/opinion6.jpg",
      text: "Assalomu alaykum. RAX PRO bilan birinchi marta ishlasak ham, xodimlarining muomalasi va mas'uliyati juda yoqdi. Bizning kompaniya loyihasini juda qisqa muddatda muvaffaqiyatli amalga oshirib berishdi. Barcha mutaxassislarga rahmat!",
      text_ru:
        "Ассалому алейкум. Хотя мы впервые работаем с RAX PRO, отношение и ответственность сотрудников нам очень понравились. Они в кратчайшие сроки успешно реализовали проект нашей компании. Спасибо всем специалистам!",
    },
    {
      id: 8,
      name: "Murod Rizayev",
      name_ru: "Мурод Ризаев",
      role: "Hamkor",
      role_ru: "Партнер",
      rating: 5.0,
      image: "/opinions/opinion7.jpg",
      text: "RAX PRO jamoasiga o‘z tashakkurimni bildirmoqchiman. Loyihamiz boshiqdan oxirigacha tajribali mutaxassislar nazoratida bo‘ldi. Birinchi kundan boshlab barcha masalalar tezkorlik bilan hal etildi. RAX PRO bilan hamkorlik qilishdan juda mamnunmiz.",
      text_ru:
        "Хочу выразить огромную благодарность команде RAX PRO. Наш проект от начала до конца находился под контролем опытных специалистов. С первого дня все вопросы решались оперативно. Мы очень довольны сотрудничеством с RAX PRO.",
    },
    {
      id: 9,
      name: "Sardor Rahimov",
      name_ru: "Сардор Рахимов",
      role: "Mijoz",
      role_ru: "Клиент",
      rating: 4.9,
      image: "/opinions/opinion9.jpg",
      text: "RAX PRO juda ham ajoyib kompaniya ekan, ham sifatli, ham narxlari hamyonbop. Mutaxassislarning muomalasi va bilimi juda yuqori darajada. Bizga ajratilgan menejerga alohida rahmat, o‘z ishining ustasi.",
      text_ru:
        "RAX PRO — действительно замечательная компания, с отличным качеством и доступными ценами. Отношение и знания специалистов на высшем уровне. Отдельное спасибо выделенному нам менеджеру, настоящий мастер своего дела.",
    },
  ];

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === opinionsData.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? opinionsData.length - 1 : prev - 1));
  };

  const activeOpinion = opinionsData[activeIndex];

  return (
    <section
      id="opinions"
      style={{
        width: "100%",
        fontFamily: "Montserrat, sans-serif",
        backgroundColor: "#FFFFFF",
        paddingTop: "40px",
        paddingBottom: "40px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @media (min-width: 768px) {
            .opinions-section { padding-top: 64px !important; padding-bottom: 64px !important; }
            .opinions-title { text-align: left !important; }
            .opinions-eyebrow { justify-content: flex-start !important; }
            .opinions-flex-row { flex-direction: row !important; justify-content: space-between !important; }
            .opinions-card { flex-direction: row !important; gap: 80px !important; }
            .opinions-img-box { width: 390px !important; }
            .opinions-img { height: 440px !important; }
            .opinions-stars { font-size: 32px !important; }
            .opinions-text { font-size: 25px !important; line-height: 145% !important; }
            .opinions-footer { flex-direction: row !important; justify-content: space-between !important; align-items: flex-end !important; }
            .opinions-name { font-size: 30px !important; }
            .opinions-desktop-only { display: flex !important; }
          }
          @media (min-width: 1024px) {
            .opinions-card { gap: 112px !important; }
          }
        `,
        }}
      />
      <div style={{ position: "relative", zIndex: 10 }}>
        {/* Container style */}
        <div
          style={{
            marginLeft: "auto",
            marginRight: "auto",
            maxWidth: "1320px",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          {/* Top row */}
          <div
            className="opinions-flex-row"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              marginBottom: "40px",
            }}
          >
            <div>
              <h2 className="opinions-title font-display font-medium text-3xl sm:text-4xl text-navy-800 tracking-tight">
                {L === "uz" ? (
                  <>Ishonchli Hamkorlar Fikri</>
                ) : (
                  <>Мнения надежных партнеров</>
                )}
              </h2>
              <p className="mt-2 text-slate-500 text-sm sm:text-base leading-relaxed">
                {L === "uz" ? "Mijozlarimiz fikri" : "Отзывы пациентов"}
              </p>
            </div>
          </div>

          {/* Card Body */}
          <div
            className="opinions-card"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "40px",
              alignItems: "center",
              transition: "all 0.5s ease",
            }}
          >
            <div className="opinions-img-box" style={{ width: "100%" }}>
              <img
                src={activeOpinion.image}
                alt={activeOpinion.name}
                className="opinions-img"
                style={{
                  width: "100%",
                  height: "380px",
                  objectFit: "cover",
                  borderRadius: "18px",
                  transition: "all 0.5s ease",
                }}
              />
            </div>

            <div
              style={{
                flex: "1 1 0%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "between",
                width: "100%",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        style={{
                          width: "20px",
                          height: "20px",
                          fill: "#F6B73C",
                          color: "#F6B73C",
                        }}
                      />
                    ))}
                  </div>
                  <span
                    className="opinions-stars"
                    style={{ fontSize: "28px", color: "#173F3B" }}
                  >
                    {activeOpinion.rating}
                  </span>
                </div>

                <p
                  className="opinions-text"
                  style={{
                    fontWeight: 500,
                    color: "#727272",
                    fontStyle: "italic",
                    fontSize: "16px",
                    lineHeight: "150%",
                    maxWidth: "700px",
                    margin: 0,
                    transition: "all 0.5s ease",
                  }}
                >
                  {L === "uz" ? activeOpinion.text : activeOpinion.text_ru}
                </p>
              </div>

              <div
                className="opinions-footer"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                  marginTop: "32px",
                }}
              >
                <div>
                  <h3
                    className="opinions-name"
                    style={{
                      fontSize: "24px",
                      fontWeight: 500,
                      color: "#1B1B1B",
                      lineHeight: "120%",
                      margin: 0,
                    }}
                  >
                    {L === "uz" ? activeOpinion.name : activeOpinion.name_ru}
                  </h3>
                  <p
                    style={{
                      color: "#5C5C5C",
                      fontWeight: 500,
                      fontSize: "20px",
                      margin: 0,
                      marginTop: "4px",
                    }}
                  >
                    {L === "uz" ? activeOpinion.role : activeOpinion.role_ru}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "16px",
                  }}
                >
                  <button
                    type="button"
                    onClick={prevSlide}
                    style={{
                      width: "56px",
                      height: "56px",
                      cursor: "pointer",
                      borderRadius: "50%",
                      backgroundColor: "transparent",
                      border: "2px solid #26B8F2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      outline: "none",
                      transition: "transform 0.2s",
                    }}
                  >
                    <ArrowLeft
                      style={{
                        width: "28px",
                        height: "28px",
                        color: "#26B8F2",
                      }}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={nextSlide}
                    style={{
                      width: "56px",
                      height: "56px",
                      cursor: "pointer",
                      borderRadius: "50%",
                      backgroundColor: "#26B8F2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "none",
                      outline: "none",
                      transition: "transform 0.2s",
                    }}
                  >
                    <ArrowRight
                      style={{
                        width: "28px",
                        height: "28px",
                        color: "white",
                      }}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
