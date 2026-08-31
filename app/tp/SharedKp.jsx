'use client';

import { useEffect, useState } from 'react';
import { decodeShare } from '@/lib/rack/share';
import KpDocument from '../kp/doc/KpDocument';
import { kpFromState, layoutFromState } from '../kp/buildFromState';

// КП по ссылке. Всё, что нужно для документа, приезжает во фрагменте адреса,
// раскладка пересчитывается тем же ядром — поэтому клиент видит ровно то же,
// что менеджер, и ссылка не протухает вместе с чьей-то базой.

export default function SharedKp() {
  const [state, setState] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const hash = location.hash.replace(/^#/, '');
    if (!hash) {
      setError('Ссылка неполная — похоже, при пересылке потерялась её часть после знака #.');
      return;
    }
    decodeShare(hash)
      .then((s) => setState({ ...s, hasLayout: Boolean(s.room) }))
      .catch(() => setError('Не удалось прочитать предложение по этой ссылке.'));
  }, []);

  if (error) {
    return (
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
        <div style={{ maxWidth: 420, textAlign: 'center' }}>
          <p style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em' }}>RAX PRO</p>
          <p style={{ marginTop: 12, fontSize: 14, color: '#69727e', lineHeight: 1.6 }}>{error}</p>
          <p style={{ marginTop: 16, fontSize: 14 }}>
            Напишите нам, и мы пришлём предложение заново:{' '}
            <a style={{ color: '#cf5a1b' }} href="tel:+998785551555">+998 78 555 1 555</a>
          </p>
        </div>
      </main>
    );
  }

  if (!state) {
    return (
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <p style={{ fontSize: 13, color: '#69727e' }}>Открываем предложение…</p>
      </main>
    );
  }

  const layout = layoutFromState(state);
  const kp = kpFromState(state, layout);

  return (
    <main style={{ padding: 'clamp(10px, 3vw, 34px) clamp(8px, 3vw, 24px)' }}>
      <KpDocument kp={kp} layout={layout} planImage={null} renderImage={null} />

      <div
        className="kp-screen-only"
        style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 26, flexWrap: 'wrap' }}
      >
        <button onClick={() => window.print()} className="tp-btn tp-btn--solid">
          Сохранить в PDF
        </button>
        <a href="tel:+998785551555" className="tp-btn">Позвонить: +998 78 555 1 555</a>
      </div>
    </main>
  );
}
