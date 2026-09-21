// Публичный конструктор: вход клиента → тот же движок, что считает КП.
//
// Отличие от генератора КП — только вход. Там менеджер обводит контур по
// драфту замерщика и правит цены; здесь клиент задаёт прямоугольник, сетку
// колонн и одни ворота, а цены берутся из прайса и стартовых значений.
// Раскладка, спецификация и сумма — из layout.ts / spec.ts / pricing.ts,
// поэтому клиент по конструктору и клиент по ссылке от менеджера видят
// одни и те же числа. Новых цифр здесь не появляется.

import { getProduct, Product } from "./catalog";
import { design, roomWithColumns, polyArea, rectPolygon, BEAMS, TRUCKS, Layout, Room, TruckKey, DesignError } from "./layout";
import { buildSpec, palletPositions, Geometry, SpecLine } from "./spec";
import { priceKp, PriceResult } from "./pricing";

export type KonType = "pallet" | "medium" | "archive" | "retail" | "unknown";
export type KonMode = "room" | "section";

/** Стартовые цены за единицу — те же, что в кабинете менеджера (app/kp/defaults.js). */
export const PUBLIC_UNIT_PRICES: Record<string, Partial<Record<SpecLine["item"], number>>> = {
  "pallet-frontal": { frame: 2_870_000, beam: 747_000, lock: 8_000, anchor: 5_600, guard: 331_000 },
};

export const PRODUCT_BY_TYPE: Record<KonType, string | null> = {
  pallet: "pallet-frontal",
  medium: "medium-duty",
  archive: "archive",
  retail: "retail",
  unknown: null,
};

/** Помещение так, как его знает клиент: прямоугольник, сетка колонн, одни ворота. */
export interface RoomInput {
  width: number;
  depth: number;
  ceiling: number;
  hasColumns: boolean;
  colStepX: number;
  colStepY: number;
  hasDock: boolean;
  truck: TruckKey;
  palletLoad: number;
  palletHeight: number;
}

export interface SectionInput {
  levels: number;
  beam: number;     // длина балки, мм
  sections: number; // секций в ряду
  rows: number;
  sizeCode?: string; // среднегрузовой / архивный — типоразмер из прайса
}

export interface KonInput {
  type: KonType;
  mode: KonMode;
  room: RoomInput;
  section: SectionInput;
}

export interface KonResult {
  product: Product;
  geometry: Geometry;
  spec: SpecLine[];
  price: PriceResult | null;
  positions: number | null;
  /** м² под стеллажами и площадь помещения — только для режима «помещение». */
  areaM2: number | null;
  rackAreaM2: number | null;
  frameHeight: number;
  room: Room | null;
  layout: Layout | null;
  /** Размер секции для карточки итога. */
  size: { h: number; w: number; d: number };
}

export const DEFAULT_INPUT: KonInput = {
  type: "pallet",
  mode: "room",
  room: {
    width: 24000, depth: 18000, ceiling: 7000,
    hasColumns: true, colStepX: 12000, colStepY: 9000,
    hasDock: true, truck: "reachtruck", palletLoad: 800, palletHeight: 1500,
  },
  section: { levels: 3, beam: 2700, sections: 10, rows: 1, sizeCode: "MD-2500-2000-600-5" },
};

/** Вес паллеты выбирает балку: 2700 мм держит 3 × 1000 кг, 3300 мм — 4 × 675 кг. */
export function beamForLoad(palletLoad: number): number {
  const fits = Object.entries(BEAMS)
    .filter(([, b]) => palletLoad * b.pallets <= b.capacity)
    .map(([mm]) => Number(mm));
  if (!fits.length) throw new DesignError(`Паллета ${palletLoad} кг тяжелее паспортной нагрузки любой балки`);
  return Math.max(...fits);
}

export function roomFromInput(r: RoomInput): Room {
  const beam = beamForLoad(r.palletLoad);
  const base: Room & { colStepX?: number; colStepY?: number; colSize?: number } = {
    width: r.width, depth: r.depth, ceiling: r.ceiling,
    palletHeight: r.palletHeight, palletLoad: r.palletLoad,
    truck: r.truck, beam, rackDepth: 1050,
    colStepX: r.hasColumns ? r.colStepX : undefined,
    colStepY: r.hasColumns ? r.colStepY : undefined,
    colSize: 400,
    // Одни ворота по центру ближней стены — самый частый случай; перед ними
    // ядро само держит зону разгрузки DOCK_BUFFER.
    docks: r.hasDock ? [{ x: r.width / 2 - 2000, y: r.depth - 200, w: 4000, h: 200 }] : [],
  };
  return roomWithColumns(base);
}

function geometryFor(product: Product, s: { rows: number; sections: number; levels: number; beam: number }): Geometry {
  const isPallet = product.key.startsWith("pallet");
  return {
    rows: s.rows,
    sections: s.sections,
    levels: s.levels,
    anchorsPerFrame: 4,
    decksPerLevel: isPallet ? 0 : product.key === "medium-duty" ? 5 : 1,
    palletsPerLevel: isPallet ? BEAMS[s.beam]?.pallets ?? 3 : 0,
    countGroundLevel: isPallet,
  };
}

function priceFor(product: Product, spec: SpecLine[], positions: number | null, sizeCode?: string): PriceResult | null {
  if (product.pricingModel === "sectionList") {
    const size = product.sizes.find((x) => x.code === sizeCode) ?? product.sizes.find((x) => x.price);
    if (!size?.price) return null;
    return priceKp(spec, {
      unitPrices: {},
      sectionPrice: size.price,
      framePrice: product.framePrices?.[size.h] ?? 0,
      sizeCode: size.code,
    });
  }
  const unitPrices = PUBLIC_UNIT_PRICES[product.key];
  if (!unitPrices) return null;
  return priceKp(spec, { unitPrices }, positions ?? undefined);
}

/** Синтетическое помещение под режим «по секции»: только чтобы нарисовать
 *  3D и план. На спецификацию и цену оно не влияет. */
function syntheticLayout(s: SectionInput, size: { h: number; w: number; d: number }, levels: number, product: Product): { room: Room; layout: Layout } {
  const isPallet = product.key.startsWith("pallet");
  const aisle = isPallet ? TRUCKS.reachtruck.aisle : 1200;
  const gap = 1000;
  const width = s.sections * size.w + gap * 2;
  const depth = s.rows * size.d + Math.max(0, s.rows - 1) * aisle + gap * 2;
  const bays = [];
  for (let r = 0; r < s.rows; r++)
    for (let i = 0; i < s.sections; i++)
      bays.push({ x: gap + i * size.w, y: gap + r * (size.d + aisle), w: size.w, h: size.d, row: r });
  const room: Room = {
    width, depth, ceiling: size.h + 1000,
    palletHeight: 1500, palletLoad: 800, truck: "reachtruck",
    beam: size.w, rackDepth: size.d, columns: [], docks: [],
  };
  const positions = isPallet ? s.sections * s.rows * (levels + 1) * (BEAMS[size.w]?.pallets ?? 3) : 0;
  const layout: Layout = {
    orientation: 0, bays, rows: s.rows, sections: s.sections * s.rows, levels,
    frameHeight: size.h, aisle, positions, cappedByFrame: false,
    fillRatio: bays.reduce((a, b) => a + b.w * b.h, 0) / (width * depth),
    polygon: rectPolygon(width, depth),
  };
  return { room, layout };
}

export function compute(input: KonInput): KonResult {
  const key = PRODUCT_BY_TYPE[input.type];
  if (!key) throw new DesignError("Для этого типа расчёт делает инженер");
  const product = getProduct(key);
  const isPallet = product.key.startsWith("pallet");

  if (isPallet && input.mode === "room") {
    const room = roomFromInput(input.room);
    const layout = design(room);
    const geometry = geometryFor(product, { rows: layout.rows, sections: layout.sections, levels: layout.levels, beam: room.beam });
    const spec = buildSpec(product, geometry);
    const positions = palletPositions(geometry);
    const area = polyArea(layout.polygon) / 1e6;
    return {
      product, geometry, spec, positions,
      price: priceFor(product, spec, positions),
      areaM2: area, rackAreaM2: area * layout.fillRatio,
      frameHeight: layout.frameHeight, room, layout,
      size: { h: layout.frameHeight, w: room.beam, d: room.rackDepth },
    };
  }

  const s = input.section;
  const size = isPallet
    ? { h: frameHeightFor(s.levels), w: s.beam, d: 1050 }
    : (() => {
        const v = product.sizes.find((x) => x.code === s.sizeCode) ?? product.sizes[0];
        return { h: v.h, w: v.w, d: v.d };
      })();
  const levels = isPallet
    ? s.levels
    : (product.sizes.find((x) => x.code === s.sizeCode) ?? product.sizes[0]).levels;
  const geometry = geometryFor(product, { rows: s.rows, sections: s.sections * s.rows, levels, beam: size.w });
  const spec = buildSpec(product, geometry);
  const positions = isPallet ? palletPositions(geometry) : null;
  const { room, layout } = syntheticLayout(s, size, levels, product);
  return {
    product, geometry, spec, positions,
    price: priceFor(product, spec, positions, s.sizeCode),
    areaM2: null, rackAreaM2: (layout.bays.reduce((a, b) => a + b.w * b.h, 0)) / 1e6,
    frameHeight: size.h, room, layout, size,
  };
}

/** Высота рамы по числу ярусов — из фактических КП: 2 → 3000, 3 → 4000, 4 → 6000. */
export function frameHeightFor(levels: number): number {
  return ({ 1: 3000, 2: 3000, 3: 4000, 4: 6000 } as Record<number, number>)[levels] ?? 6000;
}

/** «От N сум за паллетоместо» для первого экрана. Опорная конфигурация —
 *  один ряд 10 секций на 4 яруса, балка 2700: самое дешёвое место из тех,
 *  что завод реально поставлял. Цена без НДС, помечается как расчётная. */
export function referencePerPalletPosition(): number {
  const r = compute({
    ...DEFAULT_INPUT,
    type: "pallet", mode: "section",
    section: { levels: 4, beam: 2700, sections: 10, rows: 1 },
  });
  return r.price?.perPalletPosition ?? 0;
}

/** Состояние генератора КП для ссылки /tp#… — тем же кодом, что у менеджера. */
export function shareStateFrom(input: KonInput, result: KonResult, lang: "ru" | "uz") {
  const product = result.product;
  const size = product.pricingModel === "sectionList"
    ? product.sizes.find((x) => x.code === input.section.sizeCode) ?? product.sizes[0]
    : null;
  const roomForShare = result.room && input.mode === "room" && product.key.startsWith("pallet")
    ? {
        width: input.room.width, depth: input.room.depth, ceiling: input.room.ceiling,
        palletHeight: input.room.palletHeight, palletLoad: input.room.palletLoad,
        truck: input.room.truck, beam: result.room.beam, rackDepth: result.room.rackDepth,
        colStepX: input.room.hasColumns ? input.room.colStepX : 0,
        colStepY: input.room.hasColumns ? input.room.colStepY : 0,
        colSize: 400,
        docks: result.room.docks,
      }
    : null;
  return {
    client: lang === "uz" ? "Onlayn hisob-kitob" : "Предварительный расчёт",
    productKey: product.key,
    lang,
    geometry: result.geometry,
    unitPrices: PUBLIC_UNIT_PRICES[product.key] ?? {},
    discountPercent: 0,
    paymentKey: "split5050",
    deliveryHours: 48,
    sizeCode: size?.code ?? "",
    framePrice: size ? product.framePrices?.[size.h] ?? 0 : 0,
    date: new Date().toISOString(),
    room: roomForShare,
    hasLayout: Boolean(roomForShare),
  };
}

export function fmtM2(n: number | null): string {
  return n == null ? "—" : Math.round(n).toLocaleString("ru-RU");
}
