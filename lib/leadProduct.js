// Тип стеллажей в форме заявки подставляется сам: покупатель нажал
// «Купить в 1 клик» на карточке товара или пришёл со страницы направления —
// он уже выбрал тип, и выбирать его второй раз в селекте незачем.
// Строки обязаны совпадать с options в components/LeadForm.jsx, иначе
// менеджер получит заявку с типом, которого нет в списке.
const BY_DIRECTION = {
  "palletnye-stellazhi": { ru: "Паллетные (Mega) стеллажи", uz: "Palletli (Mega) stellajlar" },
  "srednegruzovye-stellazhi": { ru: "Среднегрузовые стеллажи", uz: "Oʻrta yuklamali stellajlar" },
  "arhivnye-stellazhi": { ru: "Архивные стеллажи", uz: "Arxiv stellajlari" },
  "torgovye-stellazhi": { ru: "Торговые стеллажи", uz: "Savdo stellajlari" },
};

/** Значение селекта «Тип стеллажей». Для набивных и мезонина в списке пункта
 *  нет — тогда возвращаем название товара, форма добавит его отдельной строкой. */
export function leadProductFor(lang, { directionSlug, fallback } = {}) {
  const L = lang === "uz" ? "uz" : "ru";
  const known = BY_DIRECTION[directionSlug];
  return known ? known[L] : fallback || "";
}
