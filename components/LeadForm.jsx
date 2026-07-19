"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SITE } from "../lib/site";

const FT = {
  ru: {
    name: "Ваше имя",
    phone: "Телефон (например: +998 90 123 45 67) *",
    phoneErr: "Введите корректный номер Узбекистана (+998XXXXXXXXX)",
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
    name: "Ismingiz",
    phone: "Telefon (masalan: +998 90 123 45 67) *",
    phoneErr: "Oʻzbekiston telefon raqamini toʻgʻri kiriting (+998XXXXXXXXX)",
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
  const [f, setF] = useState({ name: "", phone: "", product: "", message: "" });
  const [state, setState] = useState("idle");

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  // Telefon inputida faqat raqamlar, probel va "+" belgisini qoldirish
  const handlePhoneChange = (e) => {
    let val = e.target.value;
    // Faqat raqamlar, "+" va bo'shliqlarni qoldiramiz, qolgan harflarni o'chiramiz
    val = val.replace(/[^0-9+\s-]/g, "");
    setF({ ...f, phone: val });
  };

  async function submit(e) {
    e.preventDefault();
    if (!f.phone.trim()) return;

    // Telefon raqamidan faqat raqamlar va boshidagi "+" ni qoldirib tozalaymiz
    const cleanPhone = f.phone.replace(/[^0-9+]/g, "");

    // O'zbekiston raqamlari formati uchun qat'iy tekshiruv (RegEx)
    // +998 bilan boshlangan 9 ta raqam yoki shunchaki 998 bilan boshlangan 9 ta raqam
    const uzbPhoneRegex = /^(\+?998)\d{9}$/;

    if (!uzbPhoneRegex.test(cleanPhone)) {
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
          phone: cleanPhone.startsWith("+") ? cleanPhone : `+${cleanPhone}`, // Har doim + belgi bilan yuboradi
        }),
      });

      if (r.ok) {
        setF({ name: "", phone: "", product: "", message: "" });
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
        className="w-full mt-4 bg-brand-grad text-white font-bold py-3.5 rounded-xl disabled:opacity-60 shadow-glow hover:brightness-110"
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
