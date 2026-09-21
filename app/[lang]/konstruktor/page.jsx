import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Konstruktor from "../../../components/konstruktor/Konstruktor";
import { KON_COPY } from "../../../components/konstruktor/konCopy";
import { alternatesFor } from "../../../lib/lang";
import { normalizeLang } from "../../../lib/i18n";
import { Eyebrow } from "../../../components/Section";
import "../../../components/konstruktor/konstruktor.css";

// Публичный конструктор склада. Тот же движок, что в генераторе КП,
// но без пароля и с входом, который понимает клиент, а не проектировщик.

const META = {
  ru: {
    title: "Конструктор стеллажей онлайн: план, 3D и цена | RAXPRO",
    description:
      "Спроектируйте склад за три шага: введите помещение или секции — получите паллетомест, план расстановки, 3D-модель, спецификацию и расчётную цену до звонка менеджеру.",
  },
  uz: {
    title: "Onlayn stellaj konstruktori: reja, 3D va narx | RAXPRO",
    description:
      "Omboringizni uch qadamda loyihalang: xona yoki seksiyalarni kiriting — pallet oʻrinlari, joylashuv rejasi, 3D model, spetsifikatsiya va hisobiy narxni menejerga qoʻngʻiroqdan oldin oling.",
  },
};

export async function generateMetadata({ params }) {
  const L = normalizeLang((await params).lang);
  return { ...META[L], alternates: alternatesFor("/konstruktor", L) };
}

export default async function Page({ params }) {
  const L = normalizeLang((await params).lang);
  const c = KON_COPY[L];
  return (
    <div className="bg-white text-ink">
      <Header lang={L} />
      <main className="kon-page">
        <header className="kon-hero">
          <Eyebrow>{c.eyebrow}</Eyebrow>
          <h1>{c.title}</h1>
          <p>{c.lead}</p>
        </header>
        <Konstruktor lang={L} />
      </main>
      <Footer lang={L} />
    </div>
  );
}
