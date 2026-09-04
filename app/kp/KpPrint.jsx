'use client';

import { useEffect, useState } from 'react';
import KpDocument from './doc/KpDocument';
import { kpFromState, layoutFromState } from './buildFromState';

const PRINT_KEY = 'raxpro-kp-print';

// Документ без обвязки: эту страницу открывает сервер в headless-браузере,
// чтобы выпустить PDF. Форма, вкладки и кнопки сюда не попадают вовсе —
// иначе они уезжали бы в файл клиенту.

export default function KpPrint() {
  const [state, setState] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PRINT_KEY);
      if (!raw) {
        setError('Нет данных для печати');
        return;
      }
      setState(JSON.parse(raw));
    } catch {
      setError('Не удалось прочитать данные для печати');
    }
  }, []);

  if (error) return <main style={{ padding: 40 }}>{error}</main>;
  if (!state) return <main style={{ padding: 40 }}>Готовлю документ…</main>;

  const layout = layoutFromState(state);
  const kp = kpFromState(state, layout);

  return (
    <KpDocument
      kp={kp}
      layout={layout}
      planImage={state.planImage || null}
      renderImage={state.renderImage || null}
      print
    />
  );
}
