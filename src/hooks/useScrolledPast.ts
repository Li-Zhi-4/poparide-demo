"use client";

import { useEffect, useRef, useState } from "react";

/**
 * True once the referenced element has scrolled up behind a fixed band of
 * `offsetTop` px at the top of the viewport (e.g. a sticky navbar). Uses
 * IntersectionObserver, so nothing runs on every scroll event.
 */
export function useScrolledPast<T extends Element>(offsetTop: number) {
  const ref = useRef<T>(null);
  const [scrolledPast, setScrolledPast] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        // Out of view *above* the band, not below the fold.
        setScrolledPast(
          !entry.isIntersecting && entry.boundingClientRect.top < offsetTop,
        );
      },
      { rootMargin: `-${offsetTop}px 0px 0px 0px` },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [offsetTop]);

  return [ref, scrolledPast] as const;
}
