import LeadForm from "../LeadForm";
import { Kicker } from "./Kicker";
import { IcoTg, IcoPhone, IcoPin } from "../Icons";

export default function Contact({ lang, t, loc }) {
  const c = t.contact;
  return (
    <section id="zayavka" className="v2-section bg-steel-950 text-white">
      <div className="v2-wrap grid gap-12 lg:grid-cols-[1fr,1fr]">
        <div id="kontakty">
          <Kicker light>{c.kicker}</Kicker>
          <h2 className="v2-h2 mt-4 text-white">{c.title}</h2>
          <p className="mt-4 text-white/70 text-lg">{c.text}</p>

          <dl className="mt-10 grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-wider text-white/50 flex items-center gap-2"><IcoPhone className="h-4 w-4" /> {c.phones}</dt>
              <dd className="mt-2 flex flex-col gap-1 font-num text-3xl tabular-nums">
                <a href={`tel:${loc.landline}`} className="hover:text-beam-400">{loc.landlineHuman}</a>
                <a href={`tel:${loc.phoneMain}`} className="hover:text-beam-400">{loc.phoneMainHuman}</a>
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-white/50 flex items-center gap-2"><IcoTg className="h-4 w-4" /> Telegram</dt>
              <dd className="mt-2 flex flex-col gap-1 text-lg">
                <a href={loc.telegram} target="_blank" rel="noopener" className="hover:text-beam-400">@raxpro</a>
                <a href={loc.whatsapp} target="_blank" rel="noopener" className="hover:text-beam-400">WhatsApp</a>
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-white/50 flex items-center gap-2"><IcoPin className="h-4 w-4" /> {c.address}</dt>
              <dd className="mt-2 text-white/85">{loc.addressCity}, {loc.address}<br /><span className="text-white/55">{loc.landmark}</span></dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-white/50">{c.hours}</dt>
              <dd className="mt-2 text-white/85">{loc.hours}</dd>
            </div>
          </dl>
        </div>
        <div className="bg-white text-steel-900 p-5 sm:p-8">
          <LeadForm lang={lang} />
        </div>
      </div>
    </section>
  );
}
