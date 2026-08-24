// Цены за единицу по позициям. Взяты обратным счётом из фактических КП:
// сумма КП / количество по позиции. Это стартовые значения — менеджер
// правит их в форме, а generator фиксирует то, что реально ушло клиенту.
//
// Источник обратного счёта — research/tg-group/**, разбор от 25.08.2026.

export const UNIT_PRICE_DEFAULTS = {
  'pallet-frontal': { frame: 2_870_000, beam: 747_000, lock: 8_000, anchor: 5_600, guard: 331_000 },
  'pallet-driveIn': { frame: 0, beam: 0, lock: 0, anchor: 5_600, guard: 331_000 },
  'medium-duty':    { frame: 1_180_000, beam: 168_000, deck: 62_000, anchor: 5_600 },
  'archive':        { frame: 420_000, beam: 74_000, deck: 46_000 },
  'retail':         { frame: 0, beam: 0, deck: 0 },
  'mezzanine':      { frame: 0, beam: 0, deck: 0, anchor: 5_600, guard: 331_000 },
};

// Пресеты «как в реальных КП» — чтобы менеджер начинал не с пустого листа
// и мог проверить генератор на документе, который уже уходил клиенту.
export const PRESETS = [
  {
    id: 'fathulla',
    label: 'Fathulla · паллетный · 31 секция',
    productKey: 'pallet-frontal',
    geometry: { rows: 9, sections: 31, levels: 2, anchorsPerFrame: 4, decksPerLevel: 0, palletsPerLevel: 3, countGroundLevel: true },
    total: 172_711_892,
  },
  {
    id: 'doniyor',
    label: 'Doniyor · паллетный · 101 секция',
    productKey: 'pallet-frontal',
    geometry: { rows: 10, sections: 101, levels: 3, anchorsPerFrame: 8, decksPerLevel: 0, palletsPerLevel: 3, countGroundLevel: true },
    total: 814_686_000,
  },
  {
    id: 'bloomshop',
    label: 'BLOOMSHOP · среднегрузовой · 54 секции',
    productKey: 'medium-duty',
    geometry: { rows: 9, sections: 54, levels: 5, anchorsPerFrame: 4, decksPerLevel: 5, palletsPerLevel: 0, countGroundLevel: false },
    sizeCode: 'MD-2500-2000-600-5',
    total: 219_847_178,          // сумма до скидки 15 %, как в таблице КП
    note: 'в КП скидка 15 % → 186 870 000',
  },
  {
    id: 'star',
    label: 'Star Distribution · среднегрузовой · 10 секций',
    productKey: 'medium-duty',
    geometry: { rows: 3, sections: 10, levels: 4, anchorsPerFrame: 4, decksPerLevel: 5, palletsPerLevel: 0, countGroundLevel: false },
    sizeCode: 'MD-2000-2000-600-4',
    total: 28_000_000,           // круглое число: похоже, уже с уступкой
    note: 'круглая сумма — вероятно, уже с уступкой',
  },
];

export const EMPTY_GEOMETRY = {
  rows: 1, sections: 10, levels: 3,
  anchorsPerFrame: 4, decksPerLevel: 5,
  palletsPerLevel: 3, countGroundLevel: true,
};
