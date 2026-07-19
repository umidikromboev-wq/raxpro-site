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
      role: "Bemor",
      role_ru: "Пациент",
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
      role: "Bemor",
      role_ru: "Пациент",
      rating: 5.0,
      image: "/opinions/opinion8.jpg",
      text: "“Hilol Med klinikasi barcha xodimlarini kirib kelgan Yangi yil bilan chin dildan tabriklaymiz. Shu qatoriya revmatolog Bekzod Omonovni alohida tabriklayman. Juda xushmuomala va o‘z kasbining fidoyisi bo‘lgan shifokor ekanlar.”",
      text_ru:
        "«От всего сердца поздравляем весь коллектив клиники Hilol Med с Новым годом. В частности, хочу отдельно поздравить ревматолога Бекзода Омонова. Он очень вежливый и преданный своему делу врач.»",
    },
    {
      id: 3,
      name: "Azizbek Tursunov",
      name_ru: "Азизбек Турсунов",
      role: "Bemor",
      role_ru: "Пациент",
      rating: 4.9,
      image: "/opinions/opinion3.jpg",
      text: "“Hilol Med klinikasida profilaktika va davolanish muolajalarini olayotganimga 2 yil bo‘ldi. Allohga shukur, hammasi juda yaxshi. Shifokorlar, hamshiralar va barcha xodimlarni bayram bilan tabriklayman! Xalq xizmatida charchamanglar, davo izlab kelganlar sog‘-salomat bo‘lishsin. Qozog‘iston Respublikasi, Aqtau shahridan salomlar! Do‘stligimiz abadiy bo‘lsin.”",
      text_ru:
        "«Уже 2 года проходят профилактику и лечение в клинике Hilol Med. Слава Аллаху, всё отлично. Поздравляю врачей, медсестёр и весь персонал с праздником! Желаю сил в вашем благородном труде на благо народа, и пусть все, кто приходит за исцелением, выздоравливают. Привет из Республики Казахстан, город Актау! Пусть наша дружба будет вечной.»",
    },
    {
      id: 4,
      name: "Ali Murodov",
      name_ru: "Али Муродов",
      role: "Bemor",
      role_ru: "Пациент",
      rating: 4.7,
      image: "/opinions/opinion4.jpg",
      text: "“Hilol Med xodimlarini bayram bilan tabriklayman. Ayniqsa, Ahmad Eshonqulovga sihat-salomatlik va ulkan muvaffaqiyatlar tilayman. Ilgari ko‘zlarim pirpirab qolar edi, davosi yo‘q deb o‘ylagandim, lekin shu shifokor meni davoladi va hozir o‘zimni juda yaxshi his qilyapman. Mana 2 yil bo‘ldi, kasallik qaytalanmadi. Ahmad aka kabi shifokorlar ko‘paysin!”",
      text_ru:
        "«Поздравляю сотрудников Hilol Med с праздником. Особенно хочу пожелать крепкого здоровья и больших успехов Ахмаду Эшонкулову. Раньше у меня постоянно подёргивались глаза, я думала, что это неизлечимо, но он вылечил меня, и сейчас я чувствую себя отлично. Вот уже 2 года болезнь не возвращается. Побольше бы таких врачей, как Ахмад aka!»",
    },
    {
      id: 5,
      name: "Farrux Olimov",
      name_ru: "Фаррух Олимов",
      role: "Bemor",
      role_ru: "Панциент",
      rating: 5.0,
      image: "/opinions/opinion2.jpg",
      text: "“Klinikaga gap bo‘lishi mumkin emas. O‘zim farzandimni olib borib bunga guvoh bo‘ldim. Katta professorlarning tashxis va tekshiruv natijalari bilan Hilol Med niki deyarli bir xil chiqdi. To‘liq ishonsa bo‘ladi. Shifokorlariga gap yo‘q, ayniqsa bolalar nevropatologi Daminov Doniyor Shokirovichga kattakon rahmat!”",
      text_ru:
        "«К клинике нет никаких претензий. Я сам водил своего ребёнка и убедился в этом. Результаты обследования и диагнозы крупных профессоров практически совпали с результатами в Hilol Med. Можно полностью доверять. Врачи отличные, особенно выражаю огромную благодарность детскому невропатологу Даминову Дониёру Шокировичу!»",
    },
    {
      id: 6,
      name: "Bahrom Xamidov",
      name_ru: "Бахром Хамидов",
      role: "Bemor",
      role_ru: "Пациент",
      rating: 4.9,
      image: "/opinions/opinion5.jpg",
      text: "“Hilol Med klinikasiga katta rahmat. Ko‘p yillardan beri aniq tashxisi qo‘yilmagan kasalligim haqida o‘ylab, ikkilanib yurardim. Malakali nevropatolog Ahmad Eshonqulov MRT natijalarimni ko‘rib, aniq va tushunarli javob berdilar. 7 yil deganda faqat shu shifokordan aniq tashxis va javob oldim, kattakon rahmat!”",
      text_ru:
        "«Большое спасибо клинике Hilol Med. Много лет я сомневалась и переживала из-за болезни, диагноз которой не могли точно определить. Квалифицированный невропатолог Ахмад Эшонкулов изучил результаты МРТ и дал четкий, понятный ответ. За 7 лет я только от этого врача получила точный диагноз, спасибо вам огромное!»",
    },
    {
      id: 7,
      name: "Jasur Ahrorov",
      name_ru: "Жасур Ахроров",
      role: "Bemor",
      role_ru: "Пациент",
      rating: 4.8,
      image: "/opinions/opinion6.jpg",
      text: "“Assalomu alaykum. Men ham bugun Hilol Med Center qabuliga keldim. Shifokorlar va hamshiralar juda yaxshi, muomalalariga gap yo‘q. Bitta xolamiz anchadan beri oyoqqa turolmay yurgan edilar, shu yerga kelib davolanib, oyoqqa turib ketdilar. Barcha shifokor va hamshiralarga rahmat, qo‘lingiz dard ko‘rmasin!”",
      text_ru:
        "«Ассалому алейкум. Я сегодня тоже побывал на приёме в Hilol Med Center. Врачи и медсестры очень хорошие, их отношение на высшем уровне. Наша тётя долгое время не могла встать на ноги, но после лечения здесь она снова начала ходить. Спасибо всем врачам и медсестрам, пусть ваши руки никогда не знают боли!»",
    },
    {
      id: 8,
      name: "Murod Rizayev",
      name_ru: "Мурод Ризаев",
      role: "Bemor",
      role_ru: "Пациент",
      rating: 5.0,
      image: "/opinions/opinion7.jpg",
      text: "“Hilol Med jamoasiga o‘z tashakkurimni bildirmoqchiman. Klinikaning o‘ziga juda ham charchab, holsiz bo‘lib borgandim, u yerdan qushdek yengil bo‘lib chiqib ketdim. Muzaffarjon boshchiligidagi bir guruh shifokorlar hammasi oyoqqa turib, davo choralarini ko‘rishdi. Alloh rozi bo‘lsin hammalaridan. Tanamdagi og‘riq kuchini sizlarga tasavvur qilib berolmayman, lekin birinchi kunning o‘zidanoq og‘riqlarim pasaya boshladi. Mana, o‘n kun o‘tib uyga keldim. Oilamiz nomidan ham rahmat aytaman. Martabalari bundan ham baland bo‘lsin, qo‘li yengil hamshiralarga, farroshu orastabonlarga mingdan-ming rahmat!”",
      text_ru:
        "«Хочу выразить огромную благодарность команде Hilol Med. Я пришла в клинику очень уставшей и обессиленной, а ушла легкой, как птица. Группа врачей во главе с Музаффаржоном приложила все усилия для моего лечения, пусть Аллах будет доволен ими. Не могу передать словами ту боль, что была в теле, но с первого же дня она начала стихать. Спустя 10 дней я вернулась домой. Благодарю от имени всей нашей семьи. Пусть ваш авторитет растет, огромное спасибо медсестрам за их легкие руки и всему техническому персоналу за чистоту!»",
    },
    {
      id: 9,
      name: "Sardor Rahimov",
      name_ru: "Сардор Рахимов",
      role: "Bemor",
      role_ru: "Пациент",
      rating: 4.9,
      image: "/opinions/opinion9.jpg",
      text: "“Hilol Med juda ham ajoyib klinika ekan, ham sifatli, ham narxlari hamyonbop. Shifokorlarining muomalasi juda zo‘r. Sobit akaga katta rahmat, ham xushmuomala, ham juda bilimli, zo‘r shifokor ekanlar. Alloh rozi bo‘lsin sizdan.”",
      text_ru:
        "«Hilol Med — действительно замечательная клиника, очень хорошая и доступная по ценам. Отношение врачей на высшем уровне. Большое спасибо Собит aka, он очень приятный в общении и высококвалифицированный, отличный доктор. Пусть Аллах будет доволен вами.»",
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
            .opinions-title { font-size: 48px !important; text-align: left !important; }
            .opinions-eyebrow { font-size: 20px !important; justify-content: flex-start !important; }
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
            .opinions-title { font-size: 56px !important; }
            .opinions-eyebrow { font-size: 24px !important; }
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <p
                  className="opinions-eyebrow"
                  style={{
                    display: "flex",
                    fontWeight: 500,
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    color: "#1E293B",
                    fontSize: "12px",
                    marginBottom: "8px",
                    width: "100%",
                  }}
                >
                  {L === "uz" ? "Mijozlarimiz fikri" : "Отзывы пациентов"}
                </p>
              </div>

              <h2
                className="opinions-title"
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 600,
                  fontSize: "26px",
                  textAlign: "center",
                  color: "#1E293B",
                  maxWidth: "1000px",
                  marginLeft: "auto",
                  marginRight: "auto",
                  margin: 0,
                }}
              >
                {L === "uz" ? (
                  <>Ishonchli Hamkorlar Fikri</>
                ) : (
                  <>Мнения надежных партнеров</>
                )}
              </h2>
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
