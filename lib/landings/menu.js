// Выпадающее меню «Продукция» в шапке. Только подписи и пути: Header —
// клиентский компонент, тянуть в браузер тексты всех страниц незачем.
// Подписи совпадают с `short` в lib/directions.js и lib/landings/retail.js.
const T = "/napravleniya/torgovye-stellazhi";

export const PRODUCT_MENU = {
  ru: {
    all: { label: "Все виды стеллажей", path: "/napravleniya" },
    groups: [
      {
        title: "По типу",
        items: [
          ["Паллетные стеллажи", "/napravleniya/palletnye-stellazhi"],
          ["Среднегрузовые стеллажи", "/napravleniya/srednegruzovye-stellazhi"],
          ["Архивные стеллажи", "/napravleniya/arhivnye-stellazhi"],
          ["Торговые стеллажи", T],
          ["Набивные стеллажи", "/napravleniya/nabivnye-stellazhi"],
        ],
      },
      {
        title: "Торговые по типу магазина",
        items: [
          ["Продуктовый магазин", `${T}/produktovyj-magazin`],
          ["Магазин косметики", `${T}/kosmetika`],
          ["Аптека", `${T}/apteka`],
          ["Магазин электроники", `${T}/magazin-elektroniki`],
          ["Хозтовары", `${T}/hoztovary`],
          ["Бытовая техника", `${T}/bytovaya-tehnika`],
          ["Гипермаркет", `${T}/gipermarket`],
          ["Минимаркет", `${T}/minimarket`],
        ],
      },
    ],
  },
  uz: {
    all: { label: "Stellajlarning barcha turlari", path: "/napravleniya" },
    groups: [
      {
        title: "Turi boʻyicha",
        items: [
          ["Palletli stellajlar", "/napravleniya/palletnye-stellazhi"],
          ["Oʻrta yuklamali stellajlar", "/napravleniya/srednegruzovye-stellazhi"],
          ["Arxiv stellajlari", "/napravleniya/arhivnye-stellazhi"],
          ["Savdo stellajlari", T],
          ["Zich stellajlar", "/napravleniya/nabivnye-stellazhi"],
        ],
      },
      {
        title: "Doʻkon turi boʻyicha savdo",
        items: [
          ["Oziq-ovqat doʻkoni", `${T}/produktovyj-magazin`],
          ["Kosmetika doʻkoni", `${T}/kosmetika`],
          ["Dorixona", `${T}/apteka`],
          ["Texnika doʻkoni", `${T}/magazin-elektroniki`],
          ["Xoʻjalik mollari", `${T}/hoztovary`],
          ["Maishiy texnika", `${T}/bytovaya-tehnika`],
          ["Gipermarket", `${T}/gipermarket`],
          ["Minimarket", `${T}/minimarket`],
        ],
      },
    ],
  },
};

// Пункт шапки, к которому крепится выпадашка.
export const MENU_ANCHOR = "/#napravleniya";
