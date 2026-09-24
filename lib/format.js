// «7032128» → «7 032 128 сум». Неразрывные пробелы, чтобы цена не рвалась
// по строкам в карточке. Отдельный файл: клиентским компонентам не нужно
// тянуть весь каталог ради форматирования.
export function formatPrice(value, lang = "ru") {
  const digits = String(Math.round(value)).replace(
    /\B(?=(\d{3})+(?!\d))/g,
    "\u00a0",
  );
  return `${digits}\u00a0${lang === "uz" ? "soʻm" : "сум"}`;
}
