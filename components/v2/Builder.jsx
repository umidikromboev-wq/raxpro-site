import WarehouseBuilder from "./WarehouseBuilder";
import { Kicker } from "./Kicker";

export default function Builder({ lang, t }) {
  const b = t.builder;
  return (
    <section id="3d" className="v2-section bg-steel-950 text-white">
      <div className="v2-wrap">
        <div className="grid gap-6 lg:grid-cols-[1.1fr,1fr] lg:items-end">
          <div>
            <Kicker light>{b.kicker}</Kicker>
            <h2 className="v2-h2 mt-4 text-white">{b.title}</h2>
          </div>
          <p className="text-white/70 text-lg leading-relaxed">{b.text}</p>
        </div>
        <div className="mt-10">
          <WarehouseBuilder lang={lang} t={b} />
        </div>
      </div>
    </section>
  );
}
