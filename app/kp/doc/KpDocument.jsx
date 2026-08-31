'use client';

import { fmtSum } from '@/lib/rack/pricing';
import { specLabel, specUnit } from '@/lib/rack/spec';
import { COMPANY, SCOPE } from '@/lib/rack/company';
import { CLIENTS, FOUNDER, certificates, coverFor, facts, galleryFor, pillars } from '@/lib/rack/profile';
import { fmtDate } from '@/lib/rack/kp';
import LayoutPlan from '../LayoutPlan';
import RackScene from '../RackScene';
import { CostBar, DocRoot, Figure, Kicker, Reveal, Sheet, Stat, statSize } from './parts';

// Документ, который увидит клиент.
//
// Порядок страниц идёт от вопроса клиента, а не от структуры Word-шаблона:
// «что я получу и за сколько» → «из чего это состоит» → «как встанет
// в моём помещении» → «почём каждая позиция» → «кто это делает» → «условия».
// В фактических КП RaxPro сумма и объём лежали на девятой странице,
// а первые восемь были про поставщика.

export default function KpDocument({ kp, planImage, renderImage, layout, onCaptureRender }) {
  const { meta, product, spec, price, positions } = kp;
  const lang = meta.lang;
  const L = lang === 'uz';
  const t = (ru, uz) => (L ? uz : ru);
  const s = (id) => kp.sections.find((x) => x.id === id);
  const byList = price.mode === 'sectionList';

  const cover = coverFor(product.key);
  const gallery = galleryFor(product.key, 4);
  const productName = L ? product.uz.name : product.ru.name;
  const hero = renderImage || null;

  return (
    <DocRoot>
      {/* ————————————————————————————— 1 · обложка */}
      <Sheet tone="dark" flush>
        <div className="kp-cover__media">
          <img src={cover.file} alt="" width={cover.w} height={cover.h} loading="eager" fetchPriority="high" />
        </div>
        <div className="kp-cover__scrim" />
        <div className="kp-cover__body">
          <header className="flex items-start justify-between">
            <div>
              <p className="kp-h3" style={{ fontSize: 20, letterSpacing: '0.02em' }}>RAX PRO</p>
              <p className="kp-mono" style={{ marginTop: 5, color: 'rgba(243,241,238,.62)' }}>
                {L ? COMPANY.legalUz : COMPANY.legalRu} · {L ? 'STIR' : 'ИНН'} {COMPANY.inn}
              </p>
            </div>
            <p className="kp-mono" style={{ color: 'var(--accent)' }}>{meta.number}</p>
          </header>

          <div style={{ marginTop: 'auto' }}>
            <Reveal delay={80}>
              <Kicker>{t('Коммерческое предложение', 'Tijorat taklifi')}</Kicker>
              <h1 className="kp-mega">{productName}</h1>
            </Reveal>

            <Reveal delay={200}>
              <div style={{ marginTop: 22, display: 'flex', gap: 40, flexWrap: 'wrap' }}>
                <Line k={t('Кому', 'Kimga')} v={meta.client} />
                <Line k={t('Дата', 'Sana')} v={fmtDate(meta.date)} />
                <Line k={t('Действует до', 'Amal qiladi')} v={fmtDate(meta.validUntil)} />
              </div>
            </Reveal>
          </div>

          <Reveal delay={320} style={{ marginTop: 34 }}>
            <div
              style={{
                borderTop: '1px solid rgba(243,241,238,.22)',
                paddingTop: 16,
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
                gap: 18,
              }}
            >
              <CoverStat
                label={positions != null ? t('Паллето-мест', 'Palet oʻrinlari') : t('Секций', 'Seksiya')}
                value={positions != null ? positions : kp.geometry.sections}
              />
              <CoverStat
                label={t('Итого с НДС, сум', 'Jami QQS bilan, soʻm')}
                value={fmtSum(price.totalWithVat, lang).replace(/\s?(сум|soʻm)$/, '')}
                accent
              />
              <CoverStat
                label={t('Поставка и монтаж', 'Yetkazish va montaj')}
                value={meta.deliveryHours}
                suffix={t('часов', 'soat')}
              />
            </div>
          </Reveal>
        </div>
      </Sheet>

      {/* ————————————————————————————— 2 · предложение за минуту */}
      <Sheet>
        <PageHead meta={meta} t={t} L={L} />

        <Reveal>
          <Kicker>{t('Предложение', 'Taklif')}</Kicker>
          <h2 className="kp-h1">
            {t('Что вы получаете', 'Siz nima olasiz')}
          </h2>
        </Reveal>

        <Reveal delay={90}>
          <p className="kp-lede" style={{ marginTop: 16 }}>
            {s('intro').body[5]}
          </p>
        </Reveal>

        <Reveal delay={150}>
          <div
            style={{
              marginTop: 26,
              display: 'grid',
              // Средняя ячейка шире: в ней живёт сумма, а она у RaxPro
              // доходит до миллиарда и в равной колонке ломается на две строки.
              gridTemplateColumns: '0.8fr 1.4fr 0.8fr',
              gap: 1,
              background: 'var(--line)',
              border: '1px solid var(--line)',
            }}
          >
            <StatCell>
              <Stat
                label={positions != null ? t('Паллето-мест', 'Palet oʻrinlari') : t('Секций', 'Seksiya')}
                value={positions != null ? positions : kp.geometry.sections}
              />
            </StatCell>
            <StatCell tone="accent">
              <Stat
                label={t('Итого с НДС', 'Jami QQS bilan')}
                value={fmtSum(price.totalWithVat, lang).replace(/\s?(сум|soʻm)$/, '')}
                suffix={t('сум', 'soʻm')}
                accent
              />
            </StatCell>
            <StatCell>
              <Stat
                label={t('Срок', 'Muddat')}
                value={meta.deliveryHours}
                suffix={t('часов', 'soat')}
              />
            </StatCell>
          </div>
        </Reveal>

        {price.perPalletPosition != null && (
          <Reveal delay={200}>
            <p className="kp-note" style={{ marginTop: 12, borderLeft: '2px solid var(--accent)', paddingLeft: 10 }}>
              {t('Цена за одно паллето-место', 'Bitta palet oʻrni narxi')}:{' '}
              <b style={{ color: 'var(--ink)' }}>{fmtSum(price.perPalletPosition, lang)}</b>.{' '}
              {t(
                'По этой величине предложение сравнивается с любым другим поставщиком — сумма без объёма не сравнима ни с чем.',
                'Bu koʻrsatkich boʻyicha taklifni istalgan yetkazib beruvchi bilan solishtirish mumkin.'
              )}
            </p>
          </Reveal>
        )}

        <Reveal delay={250} style={{ marginTop: 30 }}>
          <Kicker>{t('Что входит в поставку', 'Yetkazib berishga nimalar kiradi')}</Kicker>
          <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px 26px', margin: 0, padding: 0, listStyle: 'none' }}>
            {SCOPE[lang].map((line) => (
              <li key={line} style={{ display: 'flex', gap: 9 }}>
                <span style={{ marginTop: 7, width: 5, height: 5, flex: 'none', background: 'var(--accent)' }} />
                <span className="kp-body">{line}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={300} style={{ marginTop: 'auto', paddingTop: 28 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 18, borderTop: '1px solid var(--line)', paddingTop: 16 }}>
            {pillars(lang).map((p) => (
              <div key={p.title}>
                <p className="kp-h3" style={{ fontSize: 14 }}>{p.title}</p>
                <p className="kp-note" style={{ marginTop: 5 }}>{p.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Sheet>

      {/* ————————————————————————————— 3 · решение */}
      <Sheet>
        <PageHead meta={meta} t={t} L={L} />

        <Reveal>
          <Kicker>{t('Решение', 'Yechim')}</Kicker>
          <h2 className="kp-h2">{productName}</h2>
        </Reveal>

        <Reveal delay={80} style={{ marginTop: 18 }}>
          <table className="kp-table">
            <tbody>
              {s('product').body.map((line) => {
                const [k, ...rest] = line.split(': ');
                return (
                  <tr key={line}>
                    <td style={{ width: '36%', color: 'var(--muted)' }}>{k}</td>
                    <td style={{ fontWeight: 500 }}>{rest.join(': ')}</td>
                  </tr>
                );
              })}
              <tr>
                <td style={{ width: '36%', color: 'var(--muted)' }}>{t('Конфигурация', 'Konfiguratsiya')}</td>
                <td style={{ fontWeight: 500 }}>
                  {kp.geometry.rows} {t('ряд(ов)', 'qator')} · {kp.geometry.sections} {t('секций', 'seksiya')} ·{' '}
                  {kp.geometry.levels} {t('яруса балок', 'yarus balka')}
                </td>
              </tr>
            </tbody>
          </table>
        </Reveal>

        <Reveal delay={140} style={{ marginTop: 24 }}>
          <Figure
            src={hero || cover.file}
            width={hero ? undefined : cover.w}
            height={hero ? undefined : cover.h}
            ratio={hero ? '16 / 10' : '4 / 3'}
            caption={
              hero
                ? t('Расстановка на вашем объекте, визуализация по расчёту.', 'Obyektingizdagi joylashuv, hisob boʻyicha vizualizatsiya.')
                : L ? cover.uz : cover.ru
            }
          />
        </Reveal>
      </Sheet>

      {/* ————————————————————————————— 4 · план */}
      {(layout || planImage) && (
        <Sheet>
          <PageHead meta={meta} t={t} L={L} />
          <Reveal>
            <Kicker>{planImage ? t('План объекта', 'Obyekt rejasi') : t('План расстановки', 'Joylashuv rejasi')}</Kicker>
            <h2 className="kp-h2">
              {t('Как это встанет у вас', 'Sizda qanday joylashadi')}
            </h2>
          </Reveal>

          <Reveal delay={90} style={{ marginTop: 18 }}>
            {planImage ? (
              <img src={planImage} alt="" style={{ width: '100%', border: '1px solid var(--line)' }} />
            ) : (
              <LayoutPlan room={layout.room} layout={layout} lang={lang} />
            )}
          </Reveal>

          {layout && !planImage && (
            <div className="kp-screen-only" style={{ marginTop: 20 }}>
              <Kicker>{t('Интерактивная модель', 'Interaktiv model')}</Kicker>
              <RackScene room={layout.room} layout={layout} height={400} onCapture={onCaptureRender} />
              <p className="kp-note" style={{ marginTop: 8 }}>
                {onCaptureRender
                  ? 'Поставьте нужный ракурс и нажмите «Снять кадр в КП» — он встанет на лист «Решение». '
                  : ''}
                {t(
                  `В модели ровно ${layout.sections} секций и ${layout.levels} яруса — те же, что в спецификации.`,
                  `Modelda aynan ${layout.sections} seksiya va ${layout.levels} yarus — spetsifikatsiyadagidek.`
                )}
              </p>
            </div>
          )}

          <p className="kp-note" style={{ marginTop: 14 }}>
            {planImage
              ? t(
                  `На плане: ${kp.geometry.rows} ряд(ов), ${kp.geometry.sections} секций, ${kp.geometry.levels} яруса балок.`,
                  `Rejada: ${kp.geometry.rows} qator, ${kp.geometry.sections} seksiya, ${kp.geometry.levels} yarus balka.`
                )
              : t(
                  'Расстановка рассчитана под габариты вашего помещения, колонны и ширину прохода под выбранную технику. Точные отметки уточняются после замера.',
                  'Joylashuv binoyingiz oʻlchamlari, ustunlar va tanlangan texnika uchun yoʻlak kengligiga qarab hisoblangan. Aniq belgilar oʻlchovdan soʻng aniqlanadi.'
                )}
          </p>
        </Sheet>
      )}

      {/* ————————————————————————————— 5 · спецификация */}
      <Sheet>
        <PageHead meta={meta} t={t} L={L} />
        <Reveal>
          <Kicker>{t('Спецификация и стоимость', 'Spetsifikatsiya va narx')}</Kicker>
          <h2 className="kp-h2">{t('Из чего складывается сумма', 'Summa nimadan tashkil topadi')}</h2>
        </Reveal>

        <Reveal delay={80} style={{ marginTop: 18 }}>
          <table className="kp-table">
            <thead>
              <tr>
                <th>{t('Наименование', 'Nomi')}</th>
                <th style={{ textAlign: 'right' }}>{t('Ед.', 'Birlik')}</th>
                <th style={{ textAlign: 'right' }}>{t('Кол-во', 'Soni')}</th>
                {!byList && <th style={{ textAlign: 'right' }}>{t('Цена', 'Narx')}</th>}
                {!byList && <th style={{ textAlign: 'right' }}>{t('Сумма', 'Summa')}</th>}
              </tr>
            </thead>
            <tbody>
              {spec.map((line, i) => {
                const row = price.rows[i];
                return (
                  <tr key={line.item}>
                    <td>{specLabel(line, lang)}</td>
                    <td className="num" style={{ color: 'var(--dim)' }}>{specUnit(line, lang)}</td>
                    <td className="num">{line.qty}</td>
                    {!byList && <td className="num" style={{ color: 'var(--muted)' }}>{fmtSum(row?.unitPrice ?? 0, lang)}</td>}
                    {!byList && <td className="num" style={{ fontWeight: 500 }}>{fmtSum(row?.sum ?? 0, lang)}</td>}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Reveal>

        <Reveal delay={140} style={{ marginTop: 26, display: 'flex', gap: 30, alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          {positions != null ? (
            <div style={{ borderLeft: '2px solid var(--accent)', paddingLeft: 12 }}>
              <p className="kp-stat__label">{t('Паллето-мест', 'Palet oʻrinlari')}</p>
              <p className="kp-stat__value" style={{ fontSize: 28 }}>{positions}</p>
              <p className="kp-note">
                {fmtSum(price.perPalletPosition ?? 0, lang)} {t('за место', 'bir oʻrin uchun')}
              </p>
            </div>
          ) : <span />}

          <dl style={{ width: '100%', maxWidth: 320, margin: 0 }}>
            {byList && price.sectionPrice != null && (
              <Total
                k={`${t('Секций', 'Seksiya')} ${price.sections} × ${fmtSum(price.sectionPrice, lang)}`}
                v={fmtSum(price.subtotal, lang)}
              />
            )}
            {price.discountPercent > 0 && <Total k={t('Сумма', 'Summa')} v={fmtSum(price.subtotal, lang)} />}
            {price.discountPercent > 0 && (
              <Total
                k={`${t('Скидка', 'Chegirma')} ${price.discountPercent} %${kp.discountReason ? ` — ${kp.discountReason}` : ''}`}
                v={`− ${fmtSum(price.discountAmount, lang)}`}
              />
            )}
            <Total k={t('Итого без НДС', 'Jami QQSsiz')} v={fmtSum(price.totalNoVat, lang)} />
            <Total k={t('НДС 12 %', 'QQS 12 %')} v={fmtSum(price.vat, lang)} />
            <Total k={t('Итого с НДС', 'Jami QQS bilan')} v={fmtSum(price.totalWithVat, lang)} strong />
          </dl>
        </Reveal>

        {!byList && price.rows?.length > 1 && (
          <Reveal delay={200} style={{ marginTop: 'auto', paddingTop: 30 }}>
            <Kicker>{t('За что вы платите', 'Nima uchun toʻlaysiz')}</Kicker>
            <CostBar
              lang={lang}
              items={spec.map((line, i) => ({
                label: specLabel(line, lang),
                sum: price.rows[i]?.sum ?? 0,
              })).filter((x) => x.sum > 0)}
            />
            <p className="kp-note" style={{ marginTop: 12 }}>
              {t(
                'Структура суммы, а не только итог: видно, что вы покупаете металл конструкции, а не сопутствующие мелочи. Ни одной строки «прочее» в этом расчёте нет.',
                'Summaning tarkibi, faqat yakuni emas: siz konstruksiya metallini sotib olayotganingiz koʻrinadi. Bu hisobda birorta «boshqa xarajatlar» qatori yoʻq.'
              )}
            </p>
          </Reveal>
        )}
      </Sheet>

      {/* ————————————————————————————— 6 · компания */}
      <Sheet>
        <PageHead meta={meta} t={t} L={L} />
        <Reveal>
          <Kicker>{t('О компании', 'Kompaniya haqida')}</Kicker>
          <h2 className="kp-h2">{t('Кто выполнит работу', 'Ishni kim bajaradi')}</h2>
        </Reveal>

        <Reveal delay={80} style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '150px 1fr', gap: 22, alignItems: 'start' }}>
          <Figure src={FOUNDER.photo} width={640} height={640} ratio="1 / 1" alt="" />
          <div>
            <p className="kp-lede" style={{ fontSize: 16, color: 'var(--ink)' }}>
              «{FOUNDER.quote[lang]}»
            </p>
            <p className="kp-note" style={{ marginTop: 12 }}>
              <b style={{ color: 'var(--ink)' }}>{FOUNDER.name[lang]}</b>
              <br />
              {FOUNDER.role[lang]}
            </p>
          </div>
        </Reveal>

        <Reveal delay={150} style={{ marginTop: 26 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 16, borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', padding: '16px 0' }}>
            {facts(lang, meta.date).map((f) => (
              <div key={f.k}>
                <p className="kp-stat__label">{f.k}</p>
                <p className="kp-stat__value" style={{ fontSize: 24 }}>{f.v}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={200} style={{ marginTop: 24 }}>
          <p className="kp-body">
            {t(
              `Производство — завод ${COMPANY.factory.name}, ${COMPANY.factory.country.ru}. Технология RollForm, холоднокатаная сталь, порошковая окраска.`,
              `Ishlab chiqarish — ${COMPANY.factory.name} zavodi, ${COMPANY.factory.country.uz}. RollForm texnologiyasi, sovuq prokat poʻlat, kukunli boʻyoq.`
            )}
          </p>
        </Reveal>

        <Reveal delay={240} style={{ marginTop: 20 }}>
          <Kicker>{t('Сертификаты завода', 'Zavod sertifikatlari')}</Kicker>
          <div className="kp-certs">
            {certificates(lang).map((c) => (
              <div key={c.code}>
                <p>{t('Действует до 2028', '2028-yilgacha amal qiladi')}</p>
                <p>
                  <b>{c.code}</b>
                  {c.subject}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={250} style={{ marginTop: 'auto', paddingTop: 26 }}>
          <Kicker>{t('Нам доверили склады', 'Omborlarini bizga ishonganlar')}</Kicker>
          <div className="kp-clients">
            {CLIENTS.map((c) => <span key={c}>{c}</span>)}
          </div>
        </Reveal>
      </Sheet>

      {/* ————————————————————————————— 7 · работы */}
      <Sheet>
        <PageHead meta={meta} t={t} L={L} />
        <Reveal>
          <Kicker>{t('Наши объекты', 'Bizning obyektlar')}</Kicker>
          <h2 className="kp-h2">
            {t(`Больше ${COMPANY.objectsCount} сданных объектов`, `${COMPANY.objectsCount} dan ortiq topshirilgan obyekt`)}
          </h2>
        </Reveal>

        <Reveal delay={90} style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {gallery.map((g, i) => (
            <Figure
              key={g.file}
              src={g.file}
              width={g.w}
              height={g.h}
              ratio="4 / 3"
              caption={L ? g.uz : g.ru}
              eager={i === 0}
            />
          ))}
        </Reveal>

        <Reveal delay={160} style={{ marginTop: 'auto', paddingTop: 24 }}>
          <p className="kp-note" style={{ borderTop: '1px solid var(--line)', paddingTop: 14 }}>
            {t(
              'Все снимки — объекты, смонтированные бригадами RAX PRO. Приедем на любой из них вместе с вами, если нужно посмотреть конструкцию вживую.',
              'Barcha suratlar — RAX PRO brigadalari montaj qilgan obyektlar. Konstruksiyani jonli koʻrish uchun ularning istalganiga siz bilan birga boramiz.'
            )}
          </p>
        </Reveal>
      </Sheet>

      {/* ————————————————————————————— 8 · условия */}
      <Sheet>
        <PageHead meta={meta} t={t} L={L} />
        <Reveal>
          <Kicker>{t('Условия', 'Shartlar')}</Kicker>
          <h2 className="kp-h2">{t('На чём договариваемся', 'Nimaga kelishamiz')}</h2>
        </Reveal>

        <Reveal delay={80} style={{ marginTop: 18 }}>
          <table className="kp-table">
            <tbody>
              {s('terms').body.map((line) => {
                const [k, ...rest] = line.split(': ');
                return (
                  <tr key={line}>
                    <td style={{ width: '36%', color: 'var(--muted)' }}>{k}</td>
                    <td>{rest.join(': ')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Reveal>

        <Reveal delay={120} style={{ marginTop: 24 }}>
          <Kicker>{t('Доставка и монтаж', 'Yetkazib berish va oʻrnatish')}</Kicker>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {s('delivery').body.map((line) => (
              <li key={line} className="kp-body" style={{ display: 'flex', gap: 9, marginBottom: 4 }}>
                <span style={{ marginTop: 7, width: 5, height: 5, flex: 'none', background: 'var(--accent)' }} />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        {s('note') && (
          <Reveal delay={150} style={{ marginTop: 22 }}>
            <Kicker>{s('note').title}</Kicker>
            <p className="kp-body">{s('note').body[0]}</p>
          </Reveal>
        )}

        {s('next') && (
          <Reveal delay={180} style={{ marginTop: 24 }}>
            <div style={{ background: 'var(--accent-soft)', borderLeft: '2px solid var(--accent)', padding: '14px 16px' }}>
              <p className="kp-stat__label" style={{ color: 'var(--accent)' }}>{s('next').title}</p>
              <p className="kp-body" style={{ marginTop: 6, color: 'var(--ink)' }}>{s('next').body[0]}</p>
              <p style={{ marginTop: 4, fontWeight: 600 }}>{s('next').body[1]}</p>
            </div>
          </Reveal>
        )}

        <Reveal delay={220} style={{ marginTop: 24 }}>
          <Kicker>{s('contacts').title}</Kicker>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {s('contacts').body.map((line) => (
              <li key={line} className="kp-body">{line}</li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={260} style={{ marginTop: 'auto', paddingTop: 36 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
            {s('signatures').body.map((line) => (
              <div key={line}>
                <div style={{ height: 42, borderBottom: '1px solid var(--ink)' }} />
                <p className="kp-note" style={{ marginTop: 6 }}>{line}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Sheet>
    </DocRoot>
  );
}

/* ————————————————————————————————————————— элементы */

function PageHead({ meta, t, L }) {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        borderBottom: '1.5px solid var(--ink)',
        paddingBottom: 8,
        marginBottom: 28,
      }}
    >
      <p className="kp-h3" style={{ fontSize: 15, letterSpacing: '0.02em' }}>RAX PRO</p>
      <p className="kp-mono" style={{ color: 'var(--muted)' }}>
        {meta.number} · {L ? 'Kimga' : 'Кому'}: {meta.client} · {fmtDate(meta.date)}
      </p>
    </header>
  );
}

function CoverStat({ label, value, suffix, accent }) {
  return (
    <div>
      <p className="kp-stat__label" style={{ color: 'rgba(243,241,238,.55)' }}>{label}</p>
      <p
        className="kp-stat__value"
        style={{ fontSize: Math.min(28, statSize(value)), color: accent ? 'var(--accent)' : '#f3f1ee' }}
      >
        {value}
        {suffix ? <span className="kp-stat__suffix" style={{ color: 'rgba(243,241,238,.55)' }}>{suffix}</span> : null}
      </p>
    </div>
  );
}

function Line({ k, v }) {
  return (
    <div>
      <p className="kp-stat__label" style={{ color: 'rgba(243,241,238,.55)' }}>{k}</p>
      <p style={{ marginTop: 4, fontSize: 15, fontWeight: 500 }}>{v}</p>
    </div>
  );
}

function StatCell({ children, tone }) {
  return (
    <div style={{ background: tone === 'accent' ? 'var(--accent-soft)' : 'var(--sheet)', padding: '16px 16px 18px' }}>
      {children}
    </div>
  );
}

function Total({ k, v, strong }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 16,
        padding: '5px 0',
        borderBottom: strong ? '1.5px solid var(--ink)' : '1px solid var(--line-2)',
        color: strong ? 'var(--ink)' : 'var(--muted)',
        fontWeight: strong ? 600 : 400,
      }}
    >
      <dt>{k}</dt>
      <dd style={{ margin: 0, flex: 'none', fontVariantNumeric: 'tabular-nums' }}>{v}</dd>
    </div>
  );
}
