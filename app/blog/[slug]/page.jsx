import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import LeadForm from "../../../components/LeadForm";
import { getArticle, getAllArticles, localize } from "../../../lib/articles";
import { normalizeLang, BLOG_UI, MONTHS } from "../../../lib/i18n";
import { IcoArrow, IcoClock, IcoCheck } from "../../../components/Icons";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let a = getArticle(slug);
  if (!a) return { title: "Статья не найдена | RAXPRO" };
  const L = normalizeLang((await cookies()).get("lang")?.value);
  a = localize(a, L);
  return {
    title: `${a.title} | RAXPRO`,
    description: a.excerpt,
    keywords: a.keywords?.join(", "),
    alternates: { canonical: `/blog/${a.slug}` },
    openGraph: {
      title: a.title,
      description: a.excerpt,
      type: "article",
      images: [a.cover],
    },
  };
}

function formatDate(d, lang) {
  const [y, m, day] = d.split("-");
  return `${parseInt(day, 10)} ${MONTHS[lang][parseInt(m, 10) - 1]} ${y}`;
}

function Block({ b, cta }) {
  // Matnli kontentni HTML sifatida chiqarish uchun yordamchi funksiya
  const renderHtml = (content) => ({ __html: content });

  if (b.t === "p") {
    return <p dangerouslySetInnerHTML={renderHtml(b.c)} />;
  }

  if (b.t === "h2") {
    return <h2 dangerouslySetInnerHTML={renderHtml(b.c)} />;
  }

  if (b.t === "h3") {
    return <h3 dangerouslySetInnerHTML={renderHtml(b.c)} />;
  }

  if (b.t === "ul") {
    // b.c massivining birinchi elementi sarlavha, qolganlari li bo'lsa
    return (
      <ul>
        {b.c.map((li, i) => (
          <li key={i} dangerouslySetInnerHTML={renderHtml(li)} />
        ))}
      </ul>
    );
  }

  if (b.t === "cta") {
    return (
      <div className="not-prose my-8 rounded-xl2 bg-navy-900 text-white p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="flex-1">
          <p
            className="text-cloud-200/90 leading-relaxed"
            dangerouslySetInnerHTML={renderHtml(b.c)}
          />
        </div>
        <a
          href="/#zayavka"
          className="inline-flex items-center gap-2 bg-sky-400 hover:bg-sky-600 text-navy-900 font-bold px-6 py-3 rounded-xl shrink-0"
        >
          {cta} <IcoArrow className="w-5 h-5" />
        </a>
      </div>
    );
  }

  return null;
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  let a = getArticle(slug);
  if (!a) notFound();
  const L = normalizeLang((await cookies()).get("lang")?.value);
  const ui = BLOG_UI[L];
  a = localize(a, L);
  const related = getAllArticles()
    .filter((x) => x.slug !== a.slug)
    .slice(0, 3)
    .map((r) => localize(r, L));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.excerpt,
    image: a.cover,
    datePublished: a.date,
    author: { "@type": "Organization", name: "RAXPRO" },
    publisher: { "@type": "Organization", name: "RAXPRO" },
  };

  return (
    <div className="bg-white text-ink">
      <Header lang={L} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO */}
      <section className="relative pt-24 bg-navy-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={a.cover}
            alt={a.title}
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-900/70 to-navy-900" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-16">
          <nav className="text-sm text-cloud-200/60 mb-4">
            <a href="/" className="hover:text-sky-400">
              {ui.home}
            </a>{" "}
            <span className="mx-1">/</span>
            <a href="/blog" className="hover:text-sky-400">
              {" "}
              {ui.news}
            </a>{" "}
            <span className="mx-1">/</span>
            <span className="text-cloud-200"> {ui.article}</span>
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <span className="font-semibold text-sky-400">{a.category}</span>
            <span className="text-cloud-200/70 inline-flex items-center gap-1">
              <IcoClock className="w-4 h-4" /> {a.readMins} {ui.min}
            </span>
            <span className="text-cloud-200/70">{formatDate(a.date, L)}</span>
          </div>
          <h1 className="font-display font-medium text-3xl sm:text-4xl tracking-tight mt-4 leading-tight">
            {a.title}
          </h1>
          <p className="mt-4 text-lg text-cloud-200/85 leading-relaxed">
            {a.excerpt}
          </p>
        </div>
      </section>

      {/* BODY */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-14">
        <div className="prose-article">
          {a.body.map((b, i) => (
            <Block key={i} b={b} cta={ui.leaveReq} />
          ))}
        </div>
      </article>

      {/* CTA FORM */}
      <section id="zayavka" className="bg-cloud-50 border-y border-cloud-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 grid sm:grid-cols-[1fr,0.9fr] gap-8 items-center">
          <div>
            <h2 className="font-display font-medium text-2xl sm:text-3xl text-navy-800 tracking-tight">
              {ui.needCalc}
            </h2>
            <p className="text-slate-600 mt-2">{ui.needCalcText}</p>
          </div>
          <LeadForm compact lang={L} />
        </div>
      </section>

      {/* RELATED */}
      <section className="w-full px-5 sm:px-8 lg:px-14 2xl:px-24 py-14">
        <h2 className="font-display font-medium text-2xl text-navy-800 tracking-tight">
          {ui.alsoRead}
        </h2>
        <div className="grid sm:grid-cols-3 gap-5 mt-6">
          {related.map((r) => (
            <a
              key={r.slug}
              href={`/blog/${r.slug}`}
              className="group block rounded-xl2 overflow-hidden bg-white border border-cloud-200 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition"
            >
              <div className="aspect-[16/9] overflow-hidden bg-cloud-100">
                <img
                  src={r.cover}
                  alt={r.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-5">
                <span className="text-xs font-semibold text-sky-600">
                  {r.category}
                </span>
                <h3 className="font-bold text-navy-800 mt-1.5 leading-snug group-hover:text-sky-600">
                  {r.title}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </section>

      <Footer lang={L} />
    </div>
  );
}
