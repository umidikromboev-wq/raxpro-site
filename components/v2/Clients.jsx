import LogoMarquee from "../LogoMarquee";
import { CLIENT_LOGOS } from "../../lib/site";

export default function Clients({ t }) {
  return (
    <section aria-label={t.clients} className="bg-white border-b border-galv-200 py-8">
      <div className="v2-wrap">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-steel-700/60">{t.clients}</p>
      </div>
      <div className="mt-5">
        <LogoMarquee logos={CLIENT_LOGOS} />
      </div>
    </section>
  );
}
