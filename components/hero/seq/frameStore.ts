import { Source, Tier, UnitTier } from './tier';

/**
 * The hero sequence is ~50 MB of full-resolution frames. On anything slower
 * than office fibre they cannot all arrive before a visitor scrolls past them,
 * and a frame that has not arrived means the camera stands still.
 *
 * So the sequence ships twice: a ~9 MB preview tier that lands in seconds and
 * guarantees the camera always moves, and the full tier that streams in behind
 * it and replaces the preview frame by frame. The scrubber draws the sharpest
 * frame it has for the index it wants, and never waits.
 *
 * The preview tier is packed into sprite atlases of twelve frames. Its bytes
 * were never the problem — its 480 round trips were.
 */

export const ATLAS_COLS = 4;
export const ATLAS_ROWS = 3;
const PER_ATLAS = ATLAS_COLS * ATLAS_ROWS;

/** Full frames are ~110 KB and saturate the link; atlases are latency-bound. */
const FULL_CONCURRENCY = 6;
const PREVIEW_CONCURRENCY = 12;
/** A decoded 2560px frame costs ~15 MB; an atlas of twelve about the same. */
const FULL_CACHE = 40;
const PREVIEW_CACHE = 8;
/** Full frames decode in ~33ms; an atlas costs one decode for twelve frames. */
const FULL_DECODES = 8;
const PREVIEW_DECODES = 4;

/** One request per frame. */
class FrameTier extends UnitTier {
  constructor(count: number, urlOf: (i: number) => string) {
    super(count, count, urlOf, FULL_CACHE, FULL_CONCURRENCY, FULL_DECODES);
  }

  protected unitOf(index: number): number {
    return index;
  }

  protected rect(bitmap: ImageBitmap): Omit<Source, 'bitmap'> {
    return { sx: 0, sy: 0, sw: bitmap.width, sh: bitmap.height };
  }
}

/** One request per atlas of twelve frames, laid out left to right, top to bottom. */
class AtlasTier extends UnitTier {
  constructor(count: number, urlOf: (atlas: number) => string) {
    super(
      count,
      Math.ceil(count / PER_ATLAS),
      urlOf,
      PREVIEW_CACHE,
      PREVIEW_CONCURRENCY,
      PREVIEW_DECODES,
    );
  }

  protected unitOf(index: number): number {
    return Math.floor(index / PER_ATLAS);
  }

  protected rect(bitmap: ImageBitmap, index: number): Omit<Source, 'bitmap'> {
    const sw = bitmap.width / ATLAS_COLS;
    const sh = bitmap.height / ATLAS_ROWS;
    const cell = index % PER_ATLAS;
    return { sx: (cell % ATLAS_COLS) * sw, sy: Math.floor(cell / ATLAS_COLS) * sh, sw, sh };
  }
}

export type Frame = Source & {
  /** False when this is a neighbouring frame standing in for one still in flight. */
  readonly exact: boolean;
  /** False when this is the preview tier standing in for a full-resolution frame. */
  readonly full: boolean;
};

export class FrameStore {
  private readonly preview: Tier;
  private readonly full: Tier;
  private playhead = 0;

  constructor(count: number, atlasUrl: (a: number) => string, fullUrl: (i: number) => string) {
    this.preview = new AtlasTier(count, atlasUrl);
    this.full = new FrameTier(count, fullUrl);
  }

  /** Where the scroll is heading — both tiers download outward from here. */
  setPlayhead(index: number): void {
    this.playhead = index;
  }

  /** Resolves when the preview's opening atlases are in, so the hero can show. */
  async load(eager: number, onProgress: (loaded: number, total: number) => void): Promise<void> {
    const at = () => this.playhead;
    const revealed = this.preview.load(eager, at, onProgress);
    // The full tier only starts once the preview is fully down. Running both at
    // once lets the 110 KB frames starve the atlases, and the camera stalls
    // waiting for quality it did not need yet.
    void this.preview.complete.then(() => this.full.load(eager, at, () => {}));
    await revealed;
  }

  /** The sharpest frame available for `index`, or a neighbour, or nothing. */
  frame(index: number): Frame | undefined {
    const full = this.full.get(index);
    if (full) return { ...full, exact: true, full: true };

    const preview = this.preview.get(index);
    if (preview) return { ...preview, exact: true, full: false };

    const nearest = this.full.nearest(index) ?? this.preview.nearest(index);
    return nearest ? { ...nearest, exact: false, full: false } : undefined;
  }

  prefetch(indices: readonly number[]): void {
    this.preview.prefetch(indices);
    this.full.prefetch(indices);
  }

  destroy(): void {
    this.preview.destroy();
    this.full.destroy();
  }
}
