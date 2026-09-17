/** A decoded image plus the rectangle inside it that holds one frame. */
export type Source = {
  readonly bitmap: ImageBitmap;
  readonly sx: number;
  readonly sy: number;
  readonly sw: number;
  readonly sh: number;
};

/** One resolution of the sequence, however its bytes happen to be packaged. */
export interface Tier {
  /** Resolves once every byte of the tier is in. */
  readonly complete: Promise<void>;
  /** The exact frame, or undefined while it is still on its way. */
  get(index: number): Source | undefined;
  /** Any decoded frame near `index` — a stand-in, never a blank canvas. */
  nearest(index: number): Source | undefined;
  /** Warms frames the scrubber is about to reach; earlier entries win. */
  prefetch(indices: readonly number[]): void;
  /** Resolves once `eager` frames are in; the rest keep streaming behind it. */
  load(eager: number, playheadOf: () => number, onProgress: ProgressFn): Promise<void>;
  destroy(): void;
}

export type ProgressFn = (loaded: number, total: number) => void;

/** Ties break forward: the camera usually keeps travelling the way it was. */
const BACKWARD_PENALTY = 1.5;
/** A transient network hiccup should not cost the sequence a unit permanently. */
const MAX_FETCH_ATTEMPTS = 3;

/**
 * Shared machinery for both tiers: fetch the units nearest the playhead first,
 * decode them under a priority queue, and keep a bounded LRU of the results.
 *
 * A "unit" is whatever one HTTP request buys — a single frame for the full
 * tier, an atlas of twelve for the preview tier.
 */
export abstract class UnitTier implements Tier {
  private readonly blobs: (Blob | undefined)[];
  /** Insertion-ordered — the first key is the least recently used. */
  private readonly bitmaps = new Map<number, ImageBitmap>();
  private readonly decoding = new Set<number>();
  private readonly unfetched = new Set<number>();
  /** unit → priority; 0 is the unit the canvas needs right now. */
  private readonly queue = new Map<number, number>();
  private readonly attempts = new Map<number, number>();
  private inFlight = 0;
  private cancelled = false;

  private markComplete!: () => void;
  readonly complete = new Promise<void>((resolve) => {
    this.markComplete = resolve;
  });

  protected constructor(
    protected readonly frameCount: number,
    private readonly unitCount: number,
    private readonly urlOf: (unit: number) => string,
    private readonly cacheSize: number,
    private readonly concurrency: number,
    private readonly maxDecodes: number,
  ) {
    this.blobs = new Array(unitCount).fill(undefined);
  }

  /** Which HTTP unit holds `index`. */
  protected abstract unitOf(index: number): number;
  /** Where inside a decoded unit the frame for `index` sits. */
  protected abstract rect(bitmap: ImageBitmap, index: number): Omit<Source, 'bitmap'>;

  get(index: number): Source | undefined {
    if (index < 0 || index >= this.frameCount) return undefined;
    const unit = this.unitOf(index);

    const hit = this.bitmaps.get(unit);
    if (hit) {
      this.bitmaps.delete(unit);
      this.bitmaps.set(unit, hit);
      return { bitmap: hit, ...this.rect(hit, index) };
    }
    this.enqueue(unit, 0);
    return undefined;
  }

  nearest(index: number): Source | undefined {
    for (let offset = 1; offset < this.frameCount; offset++) {
      const before = this.decoded(index - offset);
      if (before) return before;
      const after = this.decoded(index + offset);
      if (after) return after;
    }
    return undefined;
  }

  private decoded(index: number): Source | undefined {
    if (index < 0 || index >= this.frameCount) return undefined;
    const bitmap = this.bitmaps.get(this.unitOf(index));
    return bitmap ? { bitmap, ...this.rect(bitmap, index) } : undefined;
  }

  prefetch(indices: readonly number[]): void {
    indices.forEach((index, rank) => {
      if (index < 0 || index >= this.frameCount) return;
      const unit = this.unitOf(index);
      if (!this.bitmaps.has(unit)) this.enqueue(unit, rank + 1);
    });
  }

  async load(eager: number, playheadOf: () => number, onProgress: ProgressFn): Promise<void> {
    const eagerUnits = Math.max(1, this.unitOf(Math.min(eager, this.frameCount - 1)) + 1);
    const all = Array.from({ length: this.unitCount }, (_, i) => i);
    let done = 0;

    const fetchOne = async (unit: number) => {
      if (this.cancelled) return;
      try {
        const res = await fetch(this.urlOf(unit));
        if (!res.ok) throw new Error(`${res.status}`);
        this.blobs[unit] = await res.blob();
        done += 1;
        if (!this.cancelled) onProgress(done, this.unitCount);
      } catch (err) {
        // One dropped request must not cost the sequence a frame — or, for an
        // atlas, twelve of them — for the rest of the visit. Retry a few times,
        // then give up and let the scrubber fall back to a neighbour.
        const attempts = (this.attempts.get(unit) ?? 0) + 1;
        this.attempts.set(unit, attempts);
        if (attempts < MAX_FETCH_ATTEMPTS && !this.cancelled) {
          this.unfetched.add(unit);
          return;
        }
        console.error('[hero] fetch failed', this.urlOf(unit), err);
        done += 1;
        if (!this.cancelled) onProgress(done, this.unitCount);
      }
    };

    await pooled(all.slice(0, eagerUnits), this.concurrency, fetchOne);
    if (this.cancelled) return;

    for (const unit of all.slice(eagerUnits)) this.unfetched.add(unit);
    const worker = async () => {
      while (!this.cancelled) {
        const next = this.takeNearest(playheadOf());
        if (next === undefined) {
          // A peer may be about to hand a failed unit back for another try.
          if (this.inFlight === 0) return;
          await new Promise((resolve) => setTimeout(resolve, 50));
          continue;
        }
        this.inFlight += 1;
        try {
          await fetchOne(next);
        } finally {
          this.inFlight -= 1;
        }
      }
    };
    // Deliberately not awaited: the hero is revealed on the eager units and the
    // rest stream in behind it.
    void Promise.all(Array.from({ length: this.concurrency }, worker)).then(this.markComplete);
  }

  private takeNearest(playheadFrame: number): number | undefined {
    const playhead = this.unitOf(Math.min(Math.max(playheadFrame, 0), this.frameCount - 1));
    let best: number | undefined;
    let bestCost = Infinity;
    for (const unit of this.unfetched) {
      const delta = unit - playhead;
      const cost = delta >= 0 ? delta : -delta * BACKWARD_PENALTY;
      if (cost < bestCost) {
        bestCost = cost;
        best = unit;
      }
    }
    if (best !== undefined) this.unfetched.delete(best);
    return best;
  }

  /**
   * Decoding is the scarce resource once the bytes are cached. Queue by
   * priority and keep only a few in flight, or the unit the canvas needs this
   * instant waits behind a batch of speculative prefetches.
   */
  private enqueue(unit: number, priority: number): void {
    if (this.bitmaps.has(unit) || this.decoding.has(unit)) return;
    const queued = this.queue.get(unit);
    if (queued === undefined || priority < queued) this.queue.set(unit, priority);
    this.pump();
  }

  private pump(): void {
    while (this.decoding.size < this.maxDecodes && this.queue.size > 0) {
      let best = -1;
      let bestPriority = Infinity;
      for (const [unit, priority] of this.queue) {
        if (priority < bestPriority) {
          bestPriority = priority;
          best = unit;
        }
      }
      this.queue.delete(best);
      // A unit whose bytes have not landed is dropped; the next tick re-queues it.
      if (this.blobs[best]) void this.decode(best);
    }
  }

  private async decode(unit: number): Promise<void> {
    const blob = this.blobs[unit];
    if (!blob || this.decoding.has(unit) || this.bitmaps.has(unit)) return;

    this.decoding.add(unit);
    try {
      const bitmap = await createImageBitmap(blob);
      if (this.cancelled) {
        bitmap.close();
        return;
      }
      this.bitmaps.set(unit, bitmap);
      this.evict();
    } catch (err) {
      console.error('[hero] decode failed', this.urlOf(unit), err);
    } finally {
      this.decoding.delete(unit);
      if (!this.cancelled) this.pump();
    }
  }

  private evict(): void {
    while (this.bitmaps.size > this.cacheSize) {
      const oldest = this.bitmaps.keys().next().value as number | undefined;
      if (oldest === undefined) return;
      this.bitmaps.get(oldest)?.close();
      this.bitmaps.delete(oldest);
    }
  }

  destroy(): void {
    this.cancelled = true;
    for (const bitmap of this.bitmaps.values()) bitmap.close();
    this.bitmaps.clear();
    this.queue.clear();
  }
}

/** Runs `task` over `items` with a bounded number of in-flight requests. */
export async function pooled<T>(
  items: readonly T[],
  limit: number,
  task: (item: T) => Promise<void>,
): Promise<void> {
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      await task(items[cursor++]);
    }
  });
  await Promise.all(workers);
}
