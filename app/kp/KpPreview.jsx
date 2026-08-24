'use client';

import { fmtSum } from '@/lib/rack/pricing';
import { specLabel, specUnit } from '@/lib/rack/spec';
import { COMPANY, SCOPE } from '@/lib/rack/company';
import LayoutPlan from './LayoutPlan';

// Документ, который увидит клиент.
//
// Порядок страниц выстроен от вопроса клиента, а не от структуры Word-шаблона:
// «что я получу и за сколько» → «из чего это состоит» → «как это встанет
// в моём помещении» → «почём каждая позиция» → «на каких условиях».
// В фактических КП RaxPro сумма и объём лежали на девятой странице,
// а первые восемь были про поставщика.

export default function KpPreview({ kp, planImage, renderImage, layout }) {
  const { meta, product, spec, price, positions } = kp;
  const byList = price.mode === 'sectionList';
  const lang = meta.lang;
  const L = lang === 'uz';
  const s = (id) => kp.sections.find((x) => x.id === id);
  const t = (ru, uz) => (L ? uz : ru);

  return (
    <div className="space-y-6 print:space-y-0">
      {/* ————————————————————————————— 1. Титул: главное за пять секунд */}
      <Sheet>
        <Head meta={meta} lang={lang} />

        <h1 className="mt-10 font-display text-[28px] leading-[1.15] text-ink">
          {t(product.ru.name, product.uz.name)}
          {meta.client && meta.client !== '—' && (
            <span className="block text-[15px] font-normal text-slate-500">
              {t('для', 'uchun')} {meta.client}
            </span>
          )}
        </h1>

        <div className="mt-8 grid grid-cols-3 gap-px border border-cloud-300 bg-cloud-300">
          <Big
            label={positions != null ? t('Паллето-мест', 'Palet oʻrinlari') : t('Секций', 'Seksiya')}
            value={positions != null ? positions : kp.geometry.sections}
          />
          <Big
            label={t('Итого с НДС', 'Jami QQS bilan')}
            value={fmtSum(price.totalWithVat, lang).replace(/\s?(сум|soʻm)$/, '')}
            suffix={t('сум', 'soʻm')}
            accent
          />
          <Big
            label={t('Поставка и монтаж', 'Yetkazish va montaj')}
            value={meta.deliveryHours}
            suffix={t('часов', 'soat')}
          />
        </div>

        {price.perPalletPosition != null && (
          <p className="mt-3 text-[12px] text-slate-500">
            {t('Цена за одно паллето-место', 'Bitta palet oʻrni narxi')}:{' '}
            <b className="text-ink">{fmtSum(price.perPalletPosition, lang)}</b>.{' '}
            {t(
              'По этой величине предложение сравнивается с любым другим поставщиком.',
              'Bu koʻrsatkich boʻyicha taklifni istalgan yetkazib beruvchi bilan solishtirish mumkin.'
            )}
          </p>
        )}

        <div className="mt-10 space-y-3 text-[13px] leading-relaxed text-slate-700">
          {s('intro').body.slice(4).map((line, i) => (line ? <p key={i}>{line}</p> : null))}
        </div>

        <SheetTitle className="mt-8">{t('Что входит в поставку', 'Yetkazib berishga nimalar kiradi')}</SheetTitle>
        <ul className="grid gap-x-6 gap-y-1.5 text-[13px] text-slate-700 sm:grid-cols-2">
          {SCOPE[lang].map((line, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-[7px] h-[5px] w-[5px] shrink-0 bg-sky-500" />
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <FactStrip lang={lang} />
      </Sheet>

      {/* ————————————————————————————— 2. Решение: что именно и что входит */}
      <Sheet>
        <SheetTitle>{t('Решение', 'Yechim')}</SheetTitle>
        <table className="w-full border-collapse text-[13px]">
          <tbody>
            {s('product').body.map((line, i) => {
              const [k, ...rest] = line.split(': ');
              return (
                <tr key={i} className="border-b border-cloud-200">
                  <td className="w-[38%] py-2 pr-4 text-slate-500">{k}</td>
                  <td className="py-2 font-medium text-ink">{rest.join(': ')}</td>
                </tr>
              );
            })}
            <tr className="border-b border-cloud-200">
              <td className="py-2 pr-4 text-slate-500">{t('Конфигурация', 'Konfiguratsiya')}</td>
              <td className="py-2 font-medium text-ink">
                {kp.geometry.rows} {t('ряд(ов)', 'qator')} · {kp.geometry.sections} {t('секций', 'seksiya')} ·{' '}
                {kp.geometry.levels} {t('яруса балок', 'yarus balka')}
              </td>
            </tr>
          </tbody>
        </table>

        {renderImage && (
          <figure className="mt-8">
            <img src={renderImage} alt="" className="w-full border border-cloud-300 object-cover" />
            <figcaption className="mt-1.5 text-[11px] text-slate-500">
              {t('Расстановка на вашем объекте, визуализация.', 'Obyektingizdagi joylashuv, vizualizatsiya.')}
            </figcaption>
          </figure>
        )}
      </Sheet>

      {/* ————————————————————————————— 3. План */}
      {layout && !planImage && (
        <Sheet>
          <SheetTitle>{t('План расстановки', 'Joylashuv rejasi')}</SheetTitle>
          <LayoutPlan room={layout.room} layout={layout} lang={lang} />
          <p className="mt-3 text-[11px] leading-snug text-slate-500">
            {t(
              'Расстановка рассчитана под габариты вашего помещения, колонны и ширину прохода под выбранную технику. Точные отметки уточняются после замера.',
              'Joylashuv binoyingiz oʻlchamlari, ustunlar va tanlangan texnika uchun yoʻlak kengligiga qarab hisoblangan. Aniq belgilar oʻlchovdan soʻng aniqlanadi.'
            )}
          </p>
        </Sheet>
      )}
      {planImage && (
        <Sheet>
          <SheetTitle>{t('План объекта', 'Obyekt rejasi')}</SheetTitle>
          <img src={planImage} alt="" className="w-full border border-cloud-300" />
          <p className="mt-2 text-[11px] text-slate-500">
            {t(
              `На плане: ${kp.geometry.rows} ряд(ов), ${kp.geometry.sections} секций, ${kp.geometry.levels} яруса балок.`,
              `Rejada: ${kp.geometry.rows} qator, ${kp.geometry.sections} seksiya, ${kp.geometry.levels} yarus balka.`
            )}
          </p>
        </Sheet>
      )}

      {/* ————————————————————————————— 4. Спецификация */}
      <Sheet>
        <SheetTitle>{t('Спецификация и стоимость', 'Spetsifikatsiya va narx')}</SheetTitle>
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr className="border-b-2 border-ink text-left text-[10px] uppercase tracking-wider text-slate-500">
              <th className="py-2 font-medium">{t('Наименование', 'Nomi')}</th>
              <th className="py-2 text-right font-medium">{t('Ед.', 'Birlik')}</th>
              <th className="py-2 text-right font-medium">{t('Кол-во', 'Soni')}</th>
              {!byList && <th className="py-2 text-right font-medium">{t('Цена', 'Narx')}</th>}
              {!byList && <th className="py-2 text-right font-medium">{t('Сумма', 'Summa')}</th>}
            </tr>
          </thead>
          <tbody>
            {spec.map((line, i) => {
              const row = price.rows[i];
              return (
                <tr key={line.item} className="border-b border-cloud-200">
                  <td className="py-2 text-ink">{specLabel(line, lang)}</td>
                  <td className="py-2 text-right text-slate-400">{specUnit(line, lang)}</td>
                  <td className="py-2 text-right tabular-nums">{line.qty}</td>
                  {!byList && <td className="py-2 text-right tabular-nums text-slate-600">{fmtSum(row?.unitPrice ?? 0, lang)}</td>}
                  {!byList && <td className="py-2 text-right font-medium tabular-nums">{fmtSum(row?.sum ?? 0, lang)}</td>}
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          {positions != null ? (
            <div className="border-l-2 border-sky-500 pl-3 text-[12px]">
              <p className="text-slate-500">{t('Паллето-мест', 'Palet oʻrinlari')}</p>
              <p className="font-display text-[22px] leading-tight text-ink tabular-nums">{positions}</p>
              <p className="text-slate-500">
                {fmtSum(price.perPalletPosition ?? 0, lang)} {t('за место', 'bir oʻrin uchun')}
              </p>
            </div>
          ) : <div />}

          <dl className="w-full max-w-xs space-y-1 text-[13px]">
            {byList && price.sectionPrice != null && (
              <Line
                k={`${t('Секций', 'Seksiya')} ${price.sections} × ${fmtSum(price.sectionPrice, lang)}`}
                v={fmtSum(price.subtotal, lang)}
              />
            )}
            {price.discountPercent > 0 && (
              <Line k={t('Сумма', 'Summa')} v={fmtSum(price.subtotal, lang)} />
            )}
            {price.discountPercent > 0 && (
              <Line
                k={`${t('Скидка', 'Chegirma')} ${price.discountPercent} %${kp.discountReason ? ` — ${kp.discountReason}` : ''}`}
                v={`− ${fmtSum(price.discountAmount, lang)}`}
              />
            )}
            <Line k={t('Итого без НДС', 'Jami QQSsiz')} v={fmtSum(price.totalNoVat, lang)} />
            <Line k={t('НДС 12 %', 'QQS 12 %')} v={fmtSum(price.vat, lang)} />
            <Line k={t('Итого с НДС', 'Jami QQS bilan')} v={fmtSum(price.totalWithVat, lang)} strong />
          </dl>
        </div>
      </Sheet>

      {/* ————————————————————————————— 5. Условия и подписи */}
      <Sheet>
        <SheetTitle>{t('Условия', 'Shartlar')}</SheetTitle>
        <dl className="text-[13px]">
          {s('terms').body.map((line, i) => {
            const [k, ...rest] = line.split(': ');
            return (
              <div key={i} className="flex gap-4 border-b border-cloud-200 py-2">
                <dt className="w-[38%] shrink-0 text-slate-500">{k}</dt>
                <dd className="text-ink">{rest.join(': ')}</dd>
              </div>
            );
          })}
        </dl>

        <SheetTitle className="mt-9">{t('Доставка и монтаж', 'Yetkazib berish va oʻrnatish')}</SheetTitle>
        <ul className="space-y-1 text-[13px] text-slate-700">
          {s('delivery').body.map((line, i) => <li key={i}>— {line}</li>)}
        </ul>

        {s('note') && (
          <>
            <SheetTitle className="mt-9">{s('note').title}</SheetTitle>
            <p className="text-[13px] text-slate-700">{s('note').body[0]}</p>
          </>
        )}

        <SheetTitle className="mt-9">{s('contacts').title}</SheetTitle>
        <ul className="space-y-1 text-[13px] text-slate-700">
          {s('contacts').body.map((line, i) => <li key={i}>{line}</li>)}
        </ul>

        {s('next') && (
          <div className="mt-9 border-l-2 border-sky-500 bg-cloud-50 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-700">{s('next').title}</p>
            <p className="mt-1.5 text-[13px] text-ink">{s('next').body[0]}</p>
            <p className="mt-1 text-[13px] font-medium text-ink">{s('next').body[1]}</p>
          </div>
        )}

        <div className="mt-12 grid grid-cols-2 gap-10 text-[12px]">
          {s('signatures').body.map((line, i) => (
            <div key={i}>
              <div className="h-12 border-b border-slate-400" />
              <p className="mt-1 text-slate-500">{line}</p>
            </div>
          ))}
        </div>
      </Sheet>
    </div>
  );
}

/* ————————————————————————————————————————— элементы */

function Sheet({ children }) {
  return (
    <article className="kp-page mx-auto flex w-full max-w-[210mm] flex-col border border-cloud-300 bg-white p-[16mm] text-ink shadow-card print:min-h-0 print:max-w-none print:border-0 print:p-0 print:shadow-none lg:min-h-[297mm]">
      {children}
    </article>
  );
}

function SheetTitle({ children, className = '' }) {
  return (
    <h3 className={`mb-3 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 ${className}`}>
      <span className="h-[2px] w-6 bg-sky-500" />
      {children}
    </h3>
  );
}

function Head({ meta, lang }) {
  const L = lang === 'uz';
  return (
    <header className="flex items-start justify-between border-b border-ink pb-3">
      <div>
        <p className="font-display text-[17px] font-bold leading-none tracking-tight text-ink">RAX PRO</p>
        <p className="mt-1 text-[9px] uppercase tracking-[0.24em] text-sky-700">
          {L ? 'Tijorat taklifi' : 'Коммерческое предложение'}
        </p>
      </div>
      <div className="text-right text-[10px] leading-relaxed text-slate-500">
        <p className="font-mono text-[10px] text-sky-700">{meta.number}</p>
        <p>{L ? 'Kimga' : 'Кому'}: <b className="text-ink">{meta.client}</b></p>
        <p>{L ? 'Sana' : 'Дата'}: {fmtDateShort(meta.date)}</p>
        <p>{L ? 'Amal qiladi' : 'Действует до'}: {fmtDateShort(meta.validUntil)}</p>
      </div>
    </header>
  );
}

function Big({ label, value, suffix, accent }) {
  return (
    <div className={`bg-white px-4 py-4 ${accent ? 'bg-cloud-50' : ''}`}>
      <p className="text-[9px] uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className={`mt-1 font-display text-[24px] leading-none tabular-nums ${accent ? 'text-sky-700' : 'text-ink'}`}>
        {value}
        {suffix && <span className="ml-1 text-[11px] font-normal text-slate-500">{suffix}</span>}
      </p>
    </div>
  );
}

function FactStrip({ lang }) {
  const L = lang === 'uz';
  const facts = [
    [L ? 'Zavod' : 'Завод', COMPANY.factory.name.replace(/ \(.*\)/, '')],
    [L ? 'Kafolat' : 'Гарантия', `${COMPANY.warrantyMonths} ${L ? 'oy' : 'месяцев'}`],
    [L ? 'Sertifikatlar' : 'Сертификаты', COMPANY.certificates.map((c) => c.split(':')[0]).join(' · ')],
    [L ? 'Mijozlar' : 'Клиентов', `${COMPANY.clientsCount}+`],
  ];
  return (
    <dl className="mt-auto grid grid-cols-2 gap-x-6 gap-y-2 border-t border-cloud-200 pt-4 text-[11px] sm:grid-cols-4">
      {facts.map(([k, v]) => (
        <div key={k}>
          <dt className="text-slate-400">{k}</dt>
          <dd className="text-ink">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Line({ k, v, strong }) {
  return (
    <div className={`flex justify-between gap-4 border-b border-cloud-200 py-1 ${strong ? 'border-ink font-semibold text-ink' : 'text-slate-600'}`}>
      <dt>{k}</dt>
      <dd className="shrink-0 tabular-nums">{v}</dd>
    </div>
  );
}

function fmtDateShort(d) {
  const p = (n) => String(n).padStart(2, '0');
  const dt = d instanceof Date ? d : new Date(d);
  return `${p(dt.getDate())}.${p(dt.getMonth() + 1)}.${dt.getFullYear()}`;
}
