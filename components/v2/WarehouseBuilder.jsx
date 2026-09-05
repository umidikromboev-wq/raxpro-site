"use client";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { design, roomWithColumns, DesignError, TRUCKS } from "@/lib/rack/layout";
import { SITE } from "../../lib/site";
import { IcoArrow } from "../Icons";

// Публичный «собери склад»: то же ядро раскладки и та же сцена, что в кабинете КП.
// Без цен и без входа — только геометрия и заявка с её цифрами.
const RackScene = dynamic(() => import("@/app/kp/RackScene"), { ssr: false });

const DEFAULTS = { width: 24, depth: 12, ceiling: 6, pallet: 1.5, load: 800, truck: "stacker" };
const LIMITS = {
  width: [4, 120], depth: [4, 120], ceiling: [2.5, 14], pallet: [0.8, 2.4], load: [100, 1000],
};

function clamp(v, [lo, hi]) {
  const n = Number(v);
  if (!Number.isFinite(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}

function toRoom(f) {
  return roomWithColumns({
    width: Math.round(f.width * 1000),
    depth: Math.round(f.depth * 1000),
    ceiling: Math.round(f.ceiling * 1000),
    palletHeight: Math.round(f.pallet * 1000),
    palletLoad: Math.round(f.load),
    truck: f.truck,
    beam: 2700,
    rackDepth: 1050,
  });
}

export default function WarehouseBuilder({ lang = "ru", t }) {
  const [form, setForm] = useState(DEFAULTS);
  const [applied, setApplied] = useState(DEFAULTS);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Пересчёт — по кнопке или через 500 мс после последнего ввода, чтобы сцена
  // не пересобиралась на каждую нажатую цифру.
  useEffect(() => {
    const id = setTimeout(() => setApplied(form), 500);
    return () => clearTimeout(id);
  }, [form]);

  const result = useMemo(() => {
    try {
      const room = toRoom(applied);
      return { room, layout: design(room), error: "" };
    } catch (e) {
      return { room: null, layout: null, error: e instanceof DesignError ? e.message : String(e?.message || e) };
    }
  }, [applied]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const fix = (k) => () => setForm((f) => ({ ...f, [k]: clamp(f[k], LIMITS[k]) }));

  const fields = [
    { k: "width", label: t.width, step: 0.5 },
    { k: "depth", label: t.depth, step: 0.5 },
    { k: "ceiling", label: t.ceiling, step: 0.1 },
    { k: "pallet", label: t.pallet, step: 0.1 },
    { k: "load", label: t.load, step: 50 },
  ];

  const L = result.layout;
  const nums = L
    ? [
        { n: L.rows, l: t.rows },
        { n: L.sections, l: t.sections },
        { n: L.levels, l: t.levels },
        { n: L.positions, l: t.positions },
      ]
    : [];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr),360px]">
      <div className="relative overflow-hidden bg-steel-950 border border-white/10 min-h-[320px] sm:min-h-[460px] lg:self-start">
        {mounted && result.room && result.layout ? (
          <RackScene room={result.room} layout={result.layout} height={460} />
        ) : (
          <p className="absolute inset-0 grid place-items-center text-sm text-white/60 px-6 text-center">
            {result.error ? t.error + result.error : t.loading}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          {fields.map((f) => (
            <label key={f.k} className="flex flex-col gap-1">
              <span className="text-[11px] uppercase tracking-wider text-white/55">{f.label}</span>
              <input
                type="number"
                inputMode="decimal"
                step={f.step}
                min={LIMITS[f.k][0]}
                max={LIMITS[f.k][1]}
                value={form[f.k]}
                onChange={set(f.k)}
                onBlur={fix(f.k)}
                className="v2-input font-num text-2xl tabular-nums"
              />
            </label>
          ))}
          <label className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wider text-white/55">{t.truck}</span>
            <select value={form.truck} onChange={set("truck")} className="v2-input text-base">
              {Object.keys(TRUCKS).map((k) => (
                <option key={k} value={k} className="text-steel-900">
                  {t.trucks[k]} · {TRUCKS[k].aisle / 1000} m
                </option>
              ))}
            </select>
          </label>
        </div>

        {L ? (
          <dl className="grid grid-cols-2 gap-px bg-white/10 border border-white/10">
            {nums.map((x) => (
              <div key={x.l} className="bg-steel-900 p-4">
                <dd className="font-num text-5xl leading-none tabular-nums text-white">{x.n}</dd>
                <dt className="mt-1 text-xs uppercase tracking-wider text-white/55">{x.l}</dt>
              </div>
            ))}
            <div className="col-span-2 bg-steel-900 px-4 py-3 text-sm text-white/65 flex flex-wrap gap-x-5 gap-y-1">
              <span>{t.frame} {L.frameHeight} mm</span>
              <span>{t.aisle} {(L.aisle / 1000).toFixed(1)} m</span>
              <span>{Math.round(L.fillRatio * 100)} % {t.fill}</span>
            </div>
          </dl>
        ) : (
          <p className="text-sm text-beam-400 border border-beam-500/40 bg-beam-500/10 p-3">{t.error}{result.error}</p>
        )}

        <LeadMini lang={lang} t={t} form={applied} layout={L} />
        <p className="text-xs text-white/40">{t.hint}</p>
      </div>
    </div>
  );
}

function LeadMini({ lang, t, form, layout }) {
  const [open, setOpen] = useState(false);
  const [c, setC] = useState({ name: "", phone: "" });
  const [state, setState] = useState("idle");

  async function submit(e) {
    e.preventDefault();
    if (!c.phone.trim()) return;
    setState("sending");
    const summary = layout
      ? `${form.width}×${form.depth} м, потолок ${form.ceiling} м, паллета ${form.pallet} м / ${form.load} кг, ${t.trucks[form.truck]}\n` +
        `→ ${layout.rows} ${t.rows}, ${layout.sections} ${t.sections}, ${layout.levels} ${t.levels}, ${layout.positions} ${t.positions}, рама ${layout.frameHeight} мм`
      : "";
    try {
      const r = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: c.name,
          phone: c.phone,
          product: "3D-расчёт с сайта",
          message: `🧱 3D-РАСЧЁТ (${lang}):\n${summary}`,
        }),
      });
      setState(r.ok ? "ok" : "err");
    } catch {
      setState("err");
    }
  }

  if (!open)
    return (
      <button type="button" onClick={() => setOpen(true)} className="v2-btn v2-btn--beam w-full">
        {t.cta} <IcoArrow className="h-5 w-5" />
      </button>
    );

  if (state === "ok") return <p className="text-sm text-white/85 border border-white/15 p-4">{t.form.ok}</p>;

  return (
    <form onSubmit={submit} className="flex flex-col gap-2 border border-white/15 p-4">
      <p className="text-sm font-semibold text-white">{t.form.title}</p>
      <input value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} placeholder={t.form.name} className="v2-input" autoComplete="name" />
      <input value={c.phone} onChange={(e) => setC({ ...c, phone: e.target.value })} placeholder={t.form.phone} className="v2-input" type="tel" required autoComplete="tel" />
      <button type="submit" disabled={state === "sending"} className="v2-btn v2-btn--beam w-full disabled:opacity-60">
        {state === "sending" ? t.form.sending : t.form.submit}
      </button>
      {state === "err" && (
        <p className="text-xs text-beam-400">
          {t.form.err} <a href={`tel:${SITE.landline}`} className="underline">{SITE.landlineHuman}</a>
        </p>
      )}
    </form>
  );
}
