/**
 * jsdom has no IntersectionObserver. This stand-in records every observer so
 * tests can fire entries with `triggerIntersection`.
 */
type Callback = IntersectionObserverCallback;
const observers = new Set<{
  callback: Callback;
  instance: IntersectionObserver;
}>();

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds = [];
  private record: { callback: Callback; instance: IntersectionObserver };

  constructor(callback: Callback) {
    this.record = { callback, instance: this };
  }
  observe() {
    observers.add(this.record);
  }
  unobserve() {
    observers.delete(this.record);
  }
  disconnect() {
    observers.delete(this.record);
  }
  takeRecords() {
    return [];
  }
}

globalThis.IntersectionObserver = MockIntersectionObserver;

export function triggerIntersection(
  entry: Pick<IntersectionObserverEntry, "isIntersecting"> & {
    top: number;
  },
) {
  for (const { callback, instance } of observers) {
    callback(
      [
        {
          isIntersecting: entry.isIntersecting,
          boundingClientRect: { top: entry.top } as DOMRectReadOnly,
        } as IntersectionObserverEntry,
      ],
      instance,
    );
  }
}
