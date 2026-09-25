// «Популярные категории» по сферам с картинками (Муродбек 25.09, как на prostellaj.uz).
// Подписи и адреса — из меню «Продукция», обложки — те же, что у посадочных страниц.
import { PRODUCT_MENU } from "../lib/landings/menu";
import { href } from "../lib/lang";

const POPULAR = [
  ["/stellazhi/na-sklad", "/landings/use-na-sklad.jpg"],
  ["/stellazhi/dlya-pvz", "/landings/use-dlya-pvz.jpg"],
  ["/napravleniya/torgovye-stellazhi/produktovyj-magazin", "/landings/retail-produktovyj-magazin.jpg"],
  ["/napravleniya/torgovye-stellazhi/apteka", "/landings/retail-apteka.jpg"],
  ["/stellazhi/dlya-dokumentov", "/landings/use-dlya-dokumentov.jpg"],
  ["/stellazhi/dlya-sto", "/landings/use-dlya-sto.jpg"],
  ["/stellazhi/dlya-garazha", "/landings/use-dlya-garazha.jpg"],
  ["/napravleniya/mezonin", "/products/gen/mezzanine-1.jpg"],
];

const T = {
  ru: { title: "Популярные категории", all: "Все категории" },
  uz: { title: "Ommabop toifalar", all: "Barcha toifalar" },
};

export default function PopularCategories({ lang }) {
  const L = lang === "uz" ? "uz" : "ru";
  const menu = PRODUCT_MENU[L];
  const labels = Object.fromEntries(menu.groups.flatMap((g) => g.items.map(([label, path]) => [path, label])));
  return (
    <section aria-labelledby="popular-title" className="mt-14">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <h2 id="popular-title" className="font-display font-medium text-2xl sm:text-3xl text-navy-800 tracking-tight">{T[L].title}</h2>
        <a href={href(L, menu.all.path)} className="text-sky-600 font-medium hover:text-sky-700">{T[L].all} →</a>
      </div>
      <ul className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {POPULAR.filter(([path]) => labels[path]).map(([path, img]) => (
          <li key={path}>
            <a href={href(L, path)} className="group relative block aspect-[4/3] rounded-xl2 overflow-hidden bg-cloud-100">
              <img src={img} alt="" loading="lazy" decoding="async" width={600} height={450} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <span className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-900/10 to-transparent" />
              <span className="absolute left-3 right-3 bottom-3 text-white font-semibold leading-snug text-sm sm:text-base">{labels[path]}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
