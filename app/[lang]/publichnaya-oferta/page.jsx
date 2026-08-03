import PolicyPage from '../../../components/PolicyPage';
import { getPolicy } from '../../../lib/policies';
import { normalizeLang } from '../../../lib/i18n';
import { alternatesFor } from '../../../lib/lang';

const SLUG = 'publichnaya-oferta';

export async function generateMetadata({ params }) {
  const L = normalizeLang((await params).lang);
  const c = getPolicy(SLUG)[L];
  return {
    title: c.seoTitle,
    description: c.seoDesc,
    alternates: alternatesFor(`/${SLUG}`, L),
  };
}

export default async function Page({ params }) {
  const L = normalizeLang((await params).lang);
  return <PolicyPage lang={L} slug={SLUG} content={getPolicy(SLUG)[L]} />;
}
