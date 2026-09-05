import { REVIEWS, localizeReview } from "../../lib/reviews";
import { SITE } from "../../lib/site";
import Reveal from "../Reveal";
import { Kicker } from "./Kicker";
import { IcoArrow } from "../Icons";

export default function Reviews({ lang, t }) {
  const r = t.reviews;
  const items = REVIEWS.map((x) => localizeReview(x, lang)).slice(0, 6);
  return (
    <section className="v2-section bg-galv-50 text-steel-900">
      <div className="v2-wrap">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Kicker>{r.kicker}</Kicker>
            <h2 className="v2-h2 mt-4">{r.title}</h2>
          </div>
          <a href={SITE.reviewsChannel} target="_blank" rel="noopener" className="inline-flex items-center gap-2 font-semibold text-sky-700 hover:text-beam-600">
            {r.all} <IcoArrow className="h-4 w-4" />
          </a>
        </div>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((x, i) => (
            <li key={x.id}>
              <Reveal delay={(i % 3) * 80} className="h-full">
                <blockquote className="h-full flex flex-col bg-white border border-galv-200 p-6">
                  <span aria-hidden="true" className="font-num text-6xl leading-[0.6] text-beam-500">“</span>
                  <p className="mt-3 text-lg leading-relaxed">{x.text}</p>
                  <footer className="mt-auto pt-5 text-sm">
                    <div className="font-semibold">{x.name}</div>
                    <div className="text-steel-700/65">{x.role}</div>
                  </footer>
                </blockquote>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
