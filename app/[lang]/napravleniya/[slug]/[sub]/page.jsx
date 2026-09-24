import { notFound } from "next/navigation";
import { alternatesFor, LANGS } from "../../../../../lib/lang";
import { normalizeLang } from "../../../../../lib/i18n";
import { getDirection } from "../../../../../lib/directions";
import { LANDINGS, LANDING_UI, getLanding } from "../../../../../lib/landings";
import { leadProductFor } from "../../../../../lib/leadProduct";
import LandingPage from "../../../../../components/landing/LandingPage";

// Подкатегории направления: /napravleniya/torgovye-stellazhi/apteka и т. п.
export const dynamicParams = false;

const SUBS = LANDINGS.filter((l) => l.parent);

export function generateStaticParams() {
  return LANGS.flatMap((lang) => SUBS.map((l) => ({ lang, slug: l.parent, sub: l.slug })));
}

function resolve(slug, sub) {
  return getLanding(`/napravleniya/${slug}/${sub}`);
}

export async function generateMetadata({ params }) {
  const { slug, sub, lang } = await params;
  const landing = resolve(slug, sub);
  if (!landing) return { title: "Страница не найдена | RAXPRO" };
  const L = normalizeLang(lang);
  const c = landing[L];
  return {
    title: c.seoTitle,
    description: c.seoDesc,
    alternates: alternatesFor(landing.path, L),
    openGraph: { title: c.seoTitle, description: c.seoDesc, type: "website", images: [landing.cover] },
  };
}

export default async function SubLandingPage({ params }) {
  const { slug, sub, lang } = await params;
  const landing = resolve(slug, sub);
  const parent = getDirection(slug);
  if (!landing || !parent) notFound();
  const L = normalizeLang(lang);
  const ui = LANDING_UI[L];
  const crumbs = [
    { name: ui.home, path: "/" },
    { name: ui.dirs, path: "/napravleniya" },
    { name: parent[L].short, path: `/napravleniya/${slug}` },
    { name: landing[L].short, path: landing.path },
  ];
  const siblings = SUBS.filter((l) => l.parent === slug && l.slug !== landing.slug);
  return (
    <LandingPage
      lang={L}
      landing={landing}
      crumbs={crumbs}
      siblings={siblings}
      leadProduct={leadProductFor(L, { directionSlug: slug, fallback: landing[L].name })}
    />
  );
}
