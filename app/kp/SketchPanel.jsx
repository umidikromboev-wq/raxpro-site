'use client';

import { useRef, useState } from 'react';
import { ActionButton, Msg, api } from './ui';

// Набросок из блокнота → заполненная форма.
//
// Замерщик фотографирует лист с контуром склада и подписанными метрами.
// Раньше менеджер переносил это руками и обводил контур мышью; здесь снимок
// читает модель со зрением, а менеджер только сверяет прочитанное со снимком —
// снимок и распознанное лежат рядом именно для этого.

const ZONE_RU = {
  packing: 'упаковка',
  loading: 'приёмка',
  passage: 'проезд',
  office: 'офис',
  stairs: 'лестница',
  other: 'занятый участок',
};

const CONFIDENCE = {
  high: { tone: 'ok', text: 'Прочитано уверенно' },
  medium: { tone: 'warn', text: 'Часть чисел выведена — сверьте' },
  low: { tone: 'bad', text: 'Прочитано неуверенно — проверьте каждое число' },
};

export default function SketchPanel({ keys, onApply, onNeedKeys }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);
  const inputRef = useRef(null);

  // Мост на подписку владельца — такой же источник, как ключ компании:
  // пока RaxPro не подключил свой, набросок читает машина владельца.
  const bridge = keys?.bridge?.alive ? keys.bridge : null;
  const hasKey = keys?.anthropic?.connected || keys?.google?.connected || Boolean(bridge);
  const onlyBridge = Boolean(bridge) && !keys?.anthropic?.connected && !keys?.google?.connected;

  function take(f) {
    setError('');
    setResult(null);
    if (!f) return;
    if (!/^image\/(jpeg|png|webp)$/.test(f.type)) {
      setError('Нужен JPG, PNG или WEBP. Скриншот из галереи телефона подойдёт.');
      return;
    }
    if (f.size > 6 * 1024 * 1024) {
      setError('Файл тяжелее 6 МБ. Уменьшите разрешение снимка и повторите.');
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      setFile(f);
      setPreview(fr.result);
    };
    fr.onerror = () => setError('Не удалось прочитать файл');
    fr.readAsDataURL(f);
  }

  async function recognise() {
    if (!preview) throw new Error('Сначала выберите снимок наброска');
    setBusy(true);
    setError('');
    try {
      const data = await api('/api/kp/sketch', {
        method: 'POST',
        body: JSON.stringify({ image: preview }),
      });
      setResult(data.sketch);
      return 'Прочитано';
    } finally {
      setBusy(false);
    }
  }

  function apply() {
    if (!result) return;
    onApply(result);
    return 'Перенесено в форму';
  }

  function reset() {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <p style={{ margin: 0, fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.55 }}>
        Сфотографируйте лист замерщика: контур помещения, подписанные метры,
        колонны и ворота. Генератор снимет с него геометрию и посчитает раскладку.
      </p>

      {onlyBridge && (
        <Msg tone="warn">
          Ключей компании ещё нет — набросок читает Claude на подписке владельца.
          Работает, пока его компьютер включён.
        </Msg>
      )}

      {!hasKey && (
        <Msg tone="warn">
          Не подключён ключ ИИ.{' '}
          <button
            type="button"
            onClick={onNeedKeys}
            style={{ color: 'var(--accent)', textDecoration: 'underline', background: 'none', border: 0, padding: 0, cursor: 'pointer', font: 'inherit' }}
          >
            Открыть «Ключи ИИ»
          </button>
        </Msg>
      )}

      <label
        className="kp-drop"
        data-over={over ? '1' : '0'}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); take(e.dataTransfer.files?.[0]); }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => take(e.target.files?.[0])}
          aria-label="Фотография наброска"
        />
        <span style={{ fontSize: 12.5 }}>
          {file ? file.name : 'Перетащите фото наброска или нажмите, чтобы выбрать'}
        </span>
      </label>

      {preview && (
        <>
          <img className="kp-sketch-preview" src={preview} alt="Загруженный набросок" />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <ActionButton
              onClick={recognise}
              disabled={!hasKey}
              busyLabel="Читаю набросок…"
              doneLabel="Прочитано"
              onError={setError}
            >
              Прочитать набросок
            </ActionButton>
            <button type="button" className="kp-btn kp-btn--ghost kp-btn--sm" onClick={reset}>
              Убрать
            </button>
          </div>
        </>
      )}

      {busy && <div className="kp-progress" aria-hidden="true"><span /></div>}
      {error && <Msg tone="bad">{error}</Msg>}

      {result && (
        <div className="kp-panel" style={{ borderColor: 'var(--accent)' }}>
          <div className="kp-panel__head" style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
            <span>Что распознано</span>
            <span className={`kp-badge kp-badge--${CONFIDENCE[result.confidence].tone}`}>
              {CONFIDENCE[result.confidence].text}
            </span>
          </div>
          <div className="kp-panel__body" style={{ gap: 8 }}>
            <p style={{ margin: 0, fontSize: 13 }}>
              <b>{(result.width / 1000).toFixed(1)} × {(result.depth / 1000).toFixed(1)} м</b>
              {result.ceiling ? <> · потолок {(result.ceiling / 1000).toFixed(1)} м</> : null}
              {' · '}контур {result.polygon.length} углов
              {' · '}колонн {result.columns.length}
              {' · '}ворот {result.docks.length}
            </p>

            {(result.rows?.length > 0 || result.zones?.length > 0) && (
              <p style={{ margin: 0, fontSize: 12 }}>
                {result.rows?.length > 0 ? (
                  <>рядов на листе: <b>{result.rows.length}</b>
                    {result.rows.some((r) => r.sections.length) ? <> (секции расписаны у {result.rows.filter((r) => r.sections.length).length})</> : null}
                    {result.mode === 'perimeter' ? ' · вдоль стен' : result.mode === 'rows' ? ' · прогонами' : ''}
                    {result.sectionWidth ? <> · шаг {(result.sectionWidth / 1000).toFixed(2)} м</> : null}
                    {result.rowDepth ? <> · глубина ряда {(result.rowDepth / 1000).toFixed(2)} м</> : null}
                    {result.aisle ? <> · проход {(result.aisle / 1000).toFixed(1)} м</> : null}
                  </>
                ) : null}
                {result.zones?.length > 0 ? (
                  <>
                    {result.rows?.length > 0 ? <br /> : null}
                    свободные зоны: {result.zones.map((z) => z.name || ZONE_RU[z.kind]).join(', ')} — стеллажами не занимаются
                  </>
                ) : null}
              </p>
            )}

            {(result.productKey || result.levels || result.beam || result.client) && (
              <p style={{ margin: 0, fontSize: 11.5, color: 'var(--muted)' }}>
                {result.client ? <>клиент: {result.client}; </> : null}
                {result.productKey ? <>тип: {result.productKey}; </> : null}
                {result.levels ? <>ярусов: {result.levels}; </> : null}
                {result.beam ? <>балка: {result.beam} мм</> : null}
              </p>
            )}

            {result.readings.length > 0 && (
              <details>
                <summary style={{ cursor: 'pointer', fontSize: 11.5, color: 'var(--muted)' }}>
                  Прочитанные надписи · {result.readings.length}
                </summary>
                <ul style={{ margin: '8px 0 0', paddingLeft: 16, fontSize: 11.5, color: 'var(--ink-2)', lineHeight: 1.6 }}>
                  {result.readings.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </details>
            )}

            {result.warnings.map((w, i) => <Msg key={i} tone="warn">{w}</Msg>)}

            <ActionButton onClick={apply} doneLabel="Перенесено" onError={setError}>
              Перенести в форму и посчитать
            </ActionButton>

            <p style={{ margin: 0, fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.5 }}>
              Сверьте числа со снимком выше. По этому наброску уйдёт счёт клиенту —
              распознавание помогает, но отвечает за документ менеджер.
              Читал: {result.provider === 'anthropic' ? 'Claude' : 'Gemini'}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
