"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { pickActiveSection } from "@/lib/activeSection";

/** How long scrolling has to stop before a tab click's scroll counts as done. */
const SCROLL_IDLE_MS = 150;

/**
 * Tracks which section the passenger is reading, for the section tabs.
 *
 * Recomputed at most once per frame while scrolling. Clicking a tab
 * highlights it straight away and pauses tracking until the scroll it
 * starts has finished, so the highlight doesn't flick through every
 * section on the way.
 */
export function useActiveSection<Id extends string>(
  ids: readonly Id[],
  navbarHeight: number,
) {
  const [active, setActive] = useState<Id>(ids[0]!);
  const lockedRef = useRef(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const unlockWhenIdle = useCallback(() => {
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      lockedRef.current = false;
    }, SCROLL_IDLE_MS);
  }, []);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const sections = ids.flatMap((id) => {
        const element = document.getElementById(id);
        return element
          ? [{ id, top: element.getBoundingClientRect().top }]
          : [];
      });
      const next = pickActiveSection(sections, {
        // A third of the way down, and never above where a tab click lands
        // a section (navbar + 24px, see scroll-mt-22).
        line: Math.max(navbarHeight + 24, window.innerHeight / 3),
        // Only once they've scrolled, or a page that fits the window would
        // start on the last tab.
        atBottom:
          window.scrollY > 0 &&
          window.scrollY + window.innerHeight >=
            document.documentElement.scrollHeight - 2,
      });
      if (next) setActive(next);
    };

    const onScroll = () => {
      if (lockedRef.current) {
        unlockWhenIdle();
        return;
      }
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(idleTimer.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids, navbarHeight, unlockWhenIdle]);

  /** For tab clicks: highlight `id` now and let the scroll finish first. */
  const select = useCallback(
    (id: Id) => {
      setActive(id);
      lockedRef.current = true;
      // Unlock even if the page doesn't need to scroll at all.
      unlockWhenIdle();
    },
    [unlockWhenIdle],
  );

  return [active, select] as const;
}
