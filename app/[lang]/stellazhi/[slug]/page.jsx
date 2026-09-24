import { notFound } from "next/navigation";
import { alternatesFor, LANGS } from "../../../../lib/lang";
import { normalizeLang } from "../../../../lib/i18n";
import { LANDING_UI, getLanding, useLandings } from "../../../../lib/landings";
import { leadProductFor } from "../../../../lib/leadProduct";
import LandingPage from "../../../../components/landing/LandingPage";

// Стеллажи по назначению: /stellazhi/na-sklad, /stellazhi/dlya-garazha и т. п.
// (раздел «по назначению» как у Prostellaj, ТЗ 24.09, этап 5).
export const dynamicParams = false;

export function generateStaticParams() {
  return LANGS.flatMap((lang) => useLandings().map((l) => ({ lang, slug: l.slug })));
}

export async function generateMetadata({ params }) {
  const { slug, lang } = await params;
  const landing = getLanding(`/stellazhi/${slug}`);
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

export default async function UseLandingPage({ params }) {
  const { slug, lang } = await params;
  const landing = getLanding(`/stellazhi/${slug}`);
  if (!landing) notFound();
  const L = normalizeLang(lang);
  const ui = LANDING_UI[L];
  const crumbs = [
    { name: ui.home, path: "/" },
    { name: ui.dirs, path: "/napravleniya" },
    { name: landing[L].short, path: landing.path },
  ];
  const siblings = useLandings().filter((l) => l.slug !== landing.slug);
  return (
    <LandingPage
      lang={L}
      landing={landing}
      crumbs={crumbs}
      siblings={siblings}
      siblingsTitle={ui.useOthers}
      leadProduct={leadProductFor(L, { directionSlug: landing.dir, fallback: landing[L].name })}
    />
  );
}
