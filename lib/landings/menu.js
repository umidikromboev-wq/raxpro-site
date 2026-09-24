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
          ["Мезонины", "/napravleniya/mezonin"],
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
      {
        title: "По назначению",
        items: [
          ["На склад", "/stellazhi/na-sklad"],
          ["Для ПВЗ", "/stellazhi/dlya-pvz"],
          ["Для коробок", "/stellazhi/dlya-korobok"],
          ["Для документов", "/stellazhi/dlya-dokumentov"],
          ["Для офиса", "/stellazhi/dlya-ofisa"],
          ["Для подсобки", "/stellazhi/dlya-podsobki"],
          ["Хозяйственные", "/stellazhi/hozyajstvennye"],
          ["Для библиотек", "/stellazhi/dlya-bibliotek"],
          ["Для шин", "/stellazhi/dlya-shin"],
          ["Для СТО", "/stellazhi/dlya-sto"],
          ["Для гаража", "/stellazhi/dlya-garazha"],
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
          ["Mezoninlar", "/napravleniya/mezonin"],
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
      {
        title: "Vazifasi boʻyicha",
        items: [
          ["Omborga", "/stellazhi/na-sklad"],
          ["Topshirish punktiga", "/stellazhi/dlya-pvz"],
          ["Qutilar uchun", "/stellazhi/dlya-korobok"],
          ["Hujjatlar uchun", "/stellazhi/dlya-dokumentov"],
          ["Ofis uchun", "/stellazhi/dlya-ofisa"],
          ["Orqa xona uchun", "/stellazhi/dlya-podsobki"],
          ["Xoʻjalik", "/stellazhi/hozyajstvennye"],
          ["Kutubxona uchun", "/stellazhi/dlya-bibliotek"],
          ["Shinalar uchun", "/stellazhi/dlya-shin"],
          ["STO uchun", "/stellazhi/dlya-sto"],
          ["Garaj uchun", "/stellazhi/dlya-garazha"],
        ],
      },
    ],
  },
};

// Пункт шапки, к которому крепится выпадашка.
export const MENU_ANCHOR = "/#napravleniya";
