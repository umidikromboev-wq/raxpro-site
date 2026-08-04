"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SITE } from "../lib/site";

const FT = {
  ru: {
    name: "Ваше имя *",
    phone: "Телефон (например: +998 90 123 45 67) *",
    phoneErr: "Введите корректный номер Узбекистана (+998 XX XXX XX XX)",
    selectDefault: "Тип стеллажей (необязательно)",
    options: [
      "Паллетные (Mega) стеллажи",
      "Среднегрузовые стеллажи",
      "Архивные стеллажи",
      "Торговые стеллажи",
      "Не знаю — нужна консультация",
    ],
    comment: "Комментарий: объём, размеры, задача…",
    submit: "Получить бесплатный расчёт",
    sending: "Отправляем…",
    err: "Ошибка отправки. Позвоните:",
    consent: "Нажимая кнопку, вы соглашаетесь на обработку персональных данных",
    altContact: "Не любите звонки? Напишите в",
  },
  uz: {
    name: "Ismingiz *",
    phone: "Telefon (masalan: +998 90 123 45 67) *",
    phoneErr:
      "Oʻzbekiston telefon raqamini toʻgʻri kiriting (+998 XX XXX XX XX)",
    selectDefault: "Stellaj turi (ixtiyoriy)",
    options: [
      "Palletli (Mega) stellajlar",
      "Oʻrta yuklamali stellajlar",
      "Arxiv stellajlari",
      "Savdo stellajlari",
      "Bilmayman — konsultatsiya kerak",
    ],
    comment: "Izoh: hajm, oʻlchamlar, vazifa…",
    submit: "Bepul hisob-kitob olish",
    sending: "Yuborilmoqda…",
    err: "Yuborishda xatolik. Qoʻngʻiroq qiling:",
    consent:
      "Tugmani bosish orqali shaxsiy maʼlumotlarni qayta ishlashga rozilik bildirasiz",
    altContact: "Qoʻngʻiroqni yoqtirmaysizmi? Yozing:",
  },
};

export default function LeadForm({ compact = false, lang = "ru" }) {
  const router = useRouter();
  const t = FT[lang === "uz" ? "uz" : "ru"];
  const [f, setF] = useState({
    name: "",
    phone: "+998 ",
    product: "",
    message: "",
  });
  const [state, setState] = useState("idle");

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  // Raqamni +998 XX XXX XX XX formatiga o'tkazuvchi funksiya (Mask)
  const formatPhone = (value) => {
    // Faqat raqamlarni ajratib olamiz
    let digits = value.replace(/\D/g, "");

    // Agar foydalanuvchi barcha raqamlarni o'chirib tashlasa, +998 ni saqlab qolamiz
    if (!digits.startsWith("998")) {
      digits = "998" + digits;
    }

    // Maksimal 12 ta raqam (998 + 9 ta raqam)
    digits = digits.slice(0, 12);

    // Formatlash logic: +998 93 002 95 71
    let formatted = "+998";
    if (digits.length > 3) formatted += " " + digits.slice(3, 5);
    if (digits.length > 5) formatted += " " + digits.slice(5, 8);
    if (digits.length > 8) formatted += " " + digits.slice(8, 10);
    if (digits.length > 10) formatted += " " + digits.slice(10, 12);

    return formatted;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setF({ ...f, phone: formatted });

    if (state === "phone_invalid") {
      setState("idle");
    }
  };

  async function submit(e) {
    e.preventDefault();
    if (!f.name.trim() || !f.phone.trim()) return;

    // Tekshirish uchun faqat raqamlarni olamiz
    const digitsOnly = f.phone.replace(/\D/g, "");

    // O'zbekiston raqami to'liq kiritilganini tekshirish (998 + 9 ta raqam = 12 ta raqam)
    if (digitsOnly.length !== 12) {
      setState("phone_invalid");
      return;
    }

    setState("sending");

    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...f,
          phone: f.phone, // Formatlangan holda yuboriladi: +998 93 002 95 71
        }),
      });

      if (r.ok) {
        setF({ name: "", phone: "+998 ", product: "", message: "" });
        setState("idle");
        router.push(`/thank-you?lang=${lang}`);
      } else {
        setState("err");
      }
    } catch {
      setState("err");
    }
  }

  const field =
    "w-full bg-cloud-50 border border-cloud-200 rounded-xl px-4 py-3 text-ink outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 placeholder:text-slate-400 transition";

  return (
    <form
      onSubmit={submit}
      className={`rounded-xl2 bg-white border border-cloud-200 shadow-card ${compact ? "p-5" : "p-6 sm:p-7"}`}
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          value={f.name}
          onChange={set("name")}
          required
          placeholder={t.name}
          className={field}
        />
        <input
          value={f.phone}
          onChange={handlePhoneChange}
          required
          type="tel"
          placeholder={t.phone}
          className={`${field} ${state === "phone_invalid" ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`}
        />
      </div>

      {state === "phone_invalid" && (
        <p className="text-red-600 text-xs mt-1.5 px-1 font-medium">
          ⚠️ {t.phoneErr}
        </p>
      )}

      <select
        value={f.product}
        onChange={set("product")}
        className={`${field} mt-3 ${f.product ? "text-ink" : "text-slate-400"}`}
      >
        <option value="">{t.selectDefault}</option>
        {t.options.map((o) => (
          <option key={o} value={o} className="text-ink">
            {o}
          </option>
        ))}
      </select>

      {!compact && (
        <textarea
          value={f.message}
          onChange={set("message")}
          rows={3}
          placeholder={t.comment}
          className={`${field} mt-3`}
        />
      )}

      <button
        disabled={state === "sending"}
        className="btn-11 w-full mt-4 bg-brand-grad text-white font-bold py-3.5 rounded-xl disabled:opacity-60 shadow-glow hover:brightness-110"
      >
        {state === "sending" ? t.sending : t.submit}
      </button>

      {state === "err" && (
        <p className="text-red-600 text-sm mt-2 text-center">
          {t.err} {SITE.phoneMainHuman}
        </p>
      )}

      <p className="text-slate-400 text-xs mt-3 text-center">{t.consent}</p>

      <div className="mt-3 pt-3 border-t border-cloud-100 text-center text-sm text-slate-500">
        {t.altContact}{" "}
        <a
          href={SITE.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-sky-600 hover:text-sky-700"
        >
          Telegram
        </a>
        {" · "}
        <a
          href={SITE.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-green-600 hover:text-green-700"
        >
          WhatsApp
        </a>
      </div>
    </form>
  );
}
