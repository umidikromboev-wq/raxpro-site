import FaqList from "../Faq";
import { Kicker } from "./Kicker";

export default function Faq({ t, items }) {
  return (
    <section className="v2-section bg-white text-steel-900">
      <div className="v2-wrap grid gap-8 lg:grid-cols-[1fr,2fr]">
        <div>
          <Kicker>{t.faq.kicker}</Kicker>
          <h2 className="v2-h2 mt-4">{t.faq.title}</h2>
        </div>
        <FaqList items={items} />
      </div>
    </section>
  );
}
