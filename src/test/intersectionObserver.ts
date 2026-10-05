/**
 * jsdom has no IntersectionObserver. This stand-in records what each observer
 * watches so tests can fire entries with `triggerIntersection`.
 */
type Observation = {
  callback: IntersectionObserverCallback;
  instance: IntersectionObserver;
  target: Element;
};
const observations = new Set<Observation>();

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds = [];

  constructor(private callback: IntersectionObserverCallback) {}

  observe(target: Element) {
    observations.add({ callback: this.callback, instance: this, target });
  }
  unobserve(target: Element) {
    for (const o of observations) {
      if (o.instance === this && o.target === target) observations.delete(o);
    }
  }
  disconnect() {
    for (const o of observations) {
      if (o.instance === this) observations.delete(o);
    }
  }
  takeRecords() {
    return [];
  }
}

globalThis.IntersectionObserver = MockIntersectionObserver;

/**
 * Fires an entry for every observed element, or only for `target` if given.
 * `top` is the element's distance from the top of the viewport.
 */
export function triggerIntersection(
  entry: { isIntersecting: boolean; top: number },
  target?: Element,
) {
  for (const o of observations) {
    if (target && o.target !== target) continue;
    o.callback(
      [
        {
          target: o.target,
          isIntersecting: entry.isIntersecting,
          boundingClientRect: { top: entry.top } as DOMRectReadOnly,
        } as IntersectionObserverEntry,
      ],
      o.instance,
    );
  }
}
