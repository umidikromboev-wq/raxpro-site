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
    photo: "Фото или чертёж помещения",
    photoHint: "JPG, PNG или PDF до 10 МБ — так расчёт точнее",
    photoRemove: "Убрать",
    fast: "Ответим за 5 минут в рабочее время",
    tgFirst: "Написать в Telegram",
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
    photo: "Xona surati yoki chizmasi",
    photoHint: "JPG, PNG yoki PDF, 10 MB gacha — hisob-kitob aniqroq boʻladi",
    photoRemove: "Olib tashlash",
    fast: "Ish vaqtida 5 daqiqada javob beramiz",
    tgFirst: "Telegramga yozish",
  },
};

const MAX_FILE = 10 * 1024 * 1024;

// withPhoto — поле для фото/чертежа помещения (уходит в Telegram документом).
// context — текст, который клиент не пишет, но менеджер должен видеть:
// конфигурация из конструктора, ссылка на расчёт.
export default function LeadForm({
  compact = false, lang = "ru", withPhoto = false,
  initialProduct = "", context = "", submitLabel = "",
}) {
  const router = useRouter();
  const t = FT[lang === "uz" ? "uz" : "ru"];
  const [f, setF] = useState({
    name: "",
    phone: "+998 ",
    product: initialProduct,
    message: "",
  });
  const [file, setFile] = useState(null);
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
      const message = context ? `${f.message}\n\n${context}`.trim() : f.message;
      let r;
      if (file) {
        const fd = new FormData();
        fd.append("name", f.name);
        fd.append("phone", f.phone);
        fd.append("product", f.product);
        fd.append("message", message);
        fd.append("file", file);
        r = await fetch("/api/lead", { method: "POST", body: fd });
      } else {
        r = await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...f, message, phone: f.phone }),
        });
      }

      if (r.ok) {
        setF({ name: "", phone: "+998 ", product: "", message: "" });
        setFile(null);
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

      {withPhoto && (
        <label className={`${field} mt-3 flex items-center gap-3 cursor-pointer`}>
          <input
            type="file"
            accept="image/*,.pdf"
            className="sr-only"
            onChange={(e) => {
              const picked = e.target.files?.[0] || null;
              setFile(picked && picked.size <= MAX_FILE ? picked : null);
            }}
          />
          <span className="w-9 h-9 rounded-lg bg-white border border-cloud-200 grid place-items-center text-sky-600 shrink-0" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h3l2-2h6l2 2h3v12H4z" /><circle cx="12" cy="13" r="3.5" /></svg>
          </span>
          <span className="min-w-0 flex-1">
            <span className={`block text-sm font-semibold ${file ? "text-ink" : "text-slate-500"} truncate`}>{file ? file.name : t.photo}</span>
            <span className="block text-xs text-slate-400">{t.photoHint}</span>
          </span>
          {file && (
            <button type="button" className="text-xs font-semibold text-slate-400 hover:text-red-600" onClick={(e) => { e.preventDefault(); setFile(null); }}>
              {t.photoRemove}
            </button>
          )}
        </label>
      )}

      <button
        disabled={state === "sending"}
        className="btn-11 w-full mt-4 bg-brand-grad text-white font-bold py-3.5 rounded-xl disabled:opacity-60 shadow-glow hover:brightness-110"
      >
        {state === "sending" ? t.sending : submitLabel || t.submit}
      </button>
      <p className="mt-2 text-center text-xs font-semibold text-sky-700 inline-flex w-full justify-center items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" /> {t.fast}
      </p>

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
