import { notFound } from "next/navigation";
import { alternatesFor } from "../../lib/lang";
import { normalizeLang } from "../../lib/i18n";
import { LANDINGS, LANDING_UI, getLanding } from "../../lib/landings";
import { leadProductFor } from "../../lib/leadProduct";
import LandingPage from "./LandingPage";

// Страница-посадка с фиксированным адресом (мезонин, монтаж, гарантия):
// метаданные и рендер из реестра LANDINGS, хлебные крошки — через раздел.
const SECTION = {
  dirs: { path: "/napravleniya", name: (ui) => ui.dirs },
  uslugi: { path: "/uslugi", name: (_, L) => (L === "uz" ? "Xizmatlar" : "Услуги") },
  pokupatelyam: { path: "/pokupatelyam", name: (_, L) => (L === "uz" ? "Xaridorlarga" : "Покупателям") },
};

export async function landingMetadata(path, params) {
  const landing = getLanding(path);
  if (!landing) return {};
  const L = normalizeLang((await params).lang);
  const c = landing[L];
  return {
    title: c.seoTitle,
    description: c.seoDesc,
    alternates: alternatesFor(path, L),
    openGraph: { title: c.seoTitle, description: c.seoDesc, type: "website", images: [landing.cover] },
  };
}

export async function renderLanding(path, params) {
  const landing = getLanding(path);
  if (!landing) notFound();
  const L = normalizeLang((await params).lang);
  const ui = LANDING_UI[L];
  const sec = SECTION[landing.section];
  const crumbs = [
    { name: ui.home, path: "/" },
    { name: sec.name(ui, L), path: sec.path },
    { name: landing[L].short, path },
  ];
  const siblings = LANDINGS.filter((l) => l.section === landing.section && l.path !== path);
  return (
    <LandingPage
      lang={L}
      landing={landing}
      crumbs={crumbs}
      siblings={siblings}
      leadProduct={leadProductFor(L, { fallback: landing[L].name })}
    />
  );
}
