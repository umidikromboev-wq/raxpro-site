"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SITE } from "../lib/site";
import { href } from "../lib/lang";
import { IcoTg } from "./Icons";
import { isWorkingHours, nextWorkingDay } from "../lib/workingHours";

const FT = {
  ru: {
    name: "Ваше имя",
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
    comment: "Объём, размеры, задача — что знаете",
    addDetails: "+ Добавить детали",
    submit: "Получить бесплатный расчёт",
    sending: "Отправляем…",
    err: "Ошибка отправки. Позвоните:",
    consent: "Нажимая кнопку, вы соглашаетесь на обработку персональных данных —",
    consentLink: "политика конфиденциальности",
    altContact: "Не любите звонки? Напишите нам",
    photo: "Фото или чертёж помещения",
    photoHint: "JPG, PNG или PDF до 10 МБ — так расчёт точнее",
    photoRemove: "Убрать",
    fast: "Ответим за 5 минут",
    offHours: { today: "Сейчас нерабочее время — ответим сегодня с 9:00", tomorrow: "Сейчас нерабочее время — ответим завтра с 9:00", monday: "Сейчас нерабочее время — ответим в понедельник с 9:00" },
    tgFirst: "Написать в Telegram",
  },
  uz: {
    name: "Ismingiz",
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
    comment: "Hajm, oʻlchamlar, vazifa — bilganingizni yozing",
    addDetails: "+ Tafsilot qoʻshish",
    submit: "Bepul hisob-kitob olish",
    sending: "Yuborilmoqda…",
    err: "Yuborishda xatolik. Qoʻngʻiroq qiling:",
    consent:
      "Tugmani bosish orqali shaxsiy maʼlumotlarni qayta ishlashga rozilik bildirasiz —",
    consentLink: "maxfiylik siyosati",
    altContact: "Qoʻngʻiroqni yoqtirmaysizmi? Bizga yozing",
    photo: "Xona surati yoki chizmasi",
    photoHint: "JPG, PNG yoki PDF, 10 MB gacha — hisob-kitob aniqroq boʻladi",
    photoRemove: "Olib tashlash",
    fast: "5 daqiqada javob beramiz",
    offHours: { today: "Hozir ish vaqti emas — bugun 9:00 dan javob beramiz", tomorrow: "Hozir ish vaqti emas — ertaga 9:00 dan javob beramiz", monday: "Hozir ish vaqti emas — dushanba 9:00 dan javob beramiz" },
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
  const [isDetailsOpen, setDetailsOpen] = useState(false);
  // Ловушка для ботов: поле не видно людям, заполненное — заявка молча отбрасывается.
  const [trap, setTrap] = useState("");
  // Статус «ответим за 5 минут / нерабочее время» считается на клиенте,
  // чтобы серверный HTML не расходился с часами посетителя.
  const [hours, setHours] = useState(null);
  useEffect(() => {
    const now = new Date();
    setHours(isWorkingHours(now) ? "open" : nextWorkingDay(now));
  }, []);

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
    if (!f.phone.trim()) return;

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
        fd.append("website", trap);
        fd.append("file", file);
        r = await fetch("/api/lead", { method: "POST", body: fd });
      } else {
        r = await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...f, message, phone: f.phone, website: trap }),
        });
      }

      if (r.ok) {
        track("lead_submit", { product: f.product || "" });
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

  const track = (event, data = {}) => {
    if (typeof window === "undefined") return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, lang, ...data });
  };

  const fastLine = hours === "open" ? t.fast : hours ? t.offHours[hours] : t.fast;

  const field =
    "w-full bg-cloud-50 border border-cloud-200 rounded-xl px-4 py-3 text-ink outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 placeholder:text-slate-400 transition";

  return (
    <form
      onSubmit={submit}
      className={`relative rounded-xl2 bg-white border border-cloud-200 shadow-card ${compact ? "p-5" : "p-6 sm:p-7"}`}
    >
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          value={f.name}
          onChange={set("name")}
          autoComplete="name"
          placeholder={t.name}
          className={field}
        />
        <input
          value={f.phone}
          onChange={handlePhoneChange}
          required
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder={t.phone}
          className={`${field} ${state === "phone_invalid" ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`}
        />
      </div>

      {state === "phone_invalid" && (
        <p className="text-red-600 text-xs mt-1.5 px-1 font-medium">
          ⚠️ {t.phoneErr}
        </p>
      )}

      <div className="relative mt-3">
        <select
          value={f.product}
          onChange={set("product")}
          className={`${field} appearance-none pr-10 ${f.product ? "text-ink" : "text-slate-400"}`}
        >
          <option value="">{t.selectDefault}</option>
          {/* Подставленный тип может не совпасть со списком (набивные, мезонин,
              конфигурация из конструктора) — тогда показываем его отдельной
              строкой, иначе селект молча откатывался бы на плейсхолдер. */}
          {f.product && !t.options.includes(f.product) && (
            <option value={f.product} className="text-ink">{f.product}</option>
          )}
          {t.options.map((o) => (
            <option key={o} value={o} className="text-ink">
              {o}
            </option>
          ))}
        </select>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"><path d="m6 9 6 6 6-6" /></svg>
      </div>

      {!compact && !isDetailsOpen && (
        <button type="button" onClick={() => setDetailsOpen(true)} className="mt-3 text-sm font-semibold text-sky-600 hover:text-sky-700">
          {t.addDetails}
        </button>
      )}
      {!compact && isDetailsOpen && (
        <textarea
          value={f.message}
          onChange={set("message")}
          rows={3}
          autoFocus
          placeholder={t.comment}
          className={`${field} mt-3`}
        />
      )}

      {/* honeypot */}
      <div className="absolute -left-[9999px] top-0 w-px h-px overflow-hidden" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
        </label>
      </div>

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
        <span className={`w-1.5 h-1.5 rounded-full ${hours && hours !== "open" ? "bg-amber-400" : "bg-emerald-500"}`} aria-hidden="true" /> {fastLine}
      </p>

      {state === "err" && (
        <p className="text-red-600 text-sm mt-2 text-center">
          {t.err} {SITE.phoneMainHuman}
        </p>
      )}

      <p className="text-slate-400 text-xs mt-3 text-center">
        {t.consent}{" "}
        <a href={href(lang, "/politika-konfidencialnosti")} className="underline hover:text-navy-800">{t.consentLink}</a>
      </p>

      {/* Telegram — второй по важности путь, поэтому кнопка, а не строка мелким (WhatsApp убран 22.09) */}
      <div className="mt-4 pt-4 border-t border-cloud-100">
        <div className="text-center text-xs text-slate-500">{t.altContact}</div>
        <a
          href={SITE.telegram}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("lead_messenger_click", { messenger: "telegram" })}
          className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-sky-200 bg-sky-50 text-sky-700 font-semibold text-sm py-2.5 hover:bg-sky-100 transition"
        >
          <IcoTg className="w-4 h-4" /> Telegram
        </a>
      </div>
    </form>
  );
}
