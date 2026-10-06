"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/** How long the sheet takes to slide open or shut. */
const SHEET_MS = 500;

type BookingSheetProps = {
  route: string;
  /** Formatted total, or null when no seats are left for the chosen stops. */
  total: string | null;
  onRequest: () => void;
  requestLabel: string;
  requestDisabled: boolean;
  /** The full price card, shown when the sheet is expanded. */
  details: ReactNode;
};

/**
 * The mobile stand-in for the price card: pinned to the bottom of the
 * screen, collapsed to route + total + Request, and expandable with the
 * round tab on its top edge to show the full card.
 *
 * The collapsed row and the card each sit in a grid row that animates
 * between 0fr and 1fr, so the sheet's height (and with it its top edge)
 * glides between the two sizes whatever their content.
 */
export function BookingSheet({
  route,
  total,
  onRequest,
  requestLabel,
  requestDisabled,
  details,
}: BookingSheetProps) {
  const [expanded, setExpanded] = useState(false);
  // While moving, content is clipped to the animating height. Once settled
  // it isn't, so focus outlines and tooltips can reach past the edges.
  const [moving, setMoving] = useState(false);
  const settleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const detailsId = useId();

  useEffect(() => () => clearTimeout(settleTimer.current), []);

  function setOpen(open: boolean) {
    if (open === expanded) return;
    setExpanded(open);
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    setMoving(true);
    clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => setMoving(false), SHEET_MS + 50);
  }

  return (
    <section
      aria-label="Booking summary"
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
      className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-mobile rounded-t-card border-t border-neutral-200 bg-white px-8 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-sheet desktop:hidden"
    >
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={detailsId}
        aria-label={expanded ? "Hide price details" : "Show price details"}
        onClick={() => setOpen(!expanded)}
        className="absolute -top-4.75 left-1/2 flex size-9 -translate-x-1/2 items-center justify-center rounded-full border border-neutral-200 bg-blue-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-primary"
      >
        <Icon
          name="chevron-down-white"
          box={24}
          // duration-500 matches SHEET_MS, so the chevron turns as the sheet moves.
          className={`transition-transform duration-500 ease-sheet motion-reduce:transition-none ${expanded ? "" : "rotate-180"}`}
        />
      </button>

      <SheetPanel open={!expanded} clip={moving || expanded}>
        <div className="flex items-center gap-2">
          <div className="flex min-w-0 flex-1 flex-col">
            <p className="text-xl font-bold">{route}</p>
            <p className="text-base text-blue-secondary">
              {total ? `${total} total` : "No seats left"}
            </p>
          </div>
          <Button
            className="h-9"
            disabled={!total || requestDisabled}
            onClick={onRequest}
          >
            {requestLabel}
          </Button>
        </div>
      </SheetPanel>

      <SheetPanel id={detailsId} open={expanded} clip={moving || !expanded}>
        {details}
      </SheetPanel>
    </section>
  );
}

/**
 * A part of the sheet that grows from nothing to its natural height. When
 * closed it's inert and aria-hidden as well, so it can't be focused or read
 * while it has no height.
 */
function SheetPanel({
  id,
  open,
  clip,
  children,
}: {
  id?: string;
  open: boolean;
  clip: boolean;
  children: ReactNode;
}) {
  return (
    <div
      id={id}
      inert={!open}
      aria-hidden={!open}
      style={{ transitionDuration: `${SHEET_MS}ms` }}
      className={`grid transition-[grid-template-rows,opacity] ease-sheet motion-reduce:transition-none ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
    >
      <div className={`min-h-0 ${clip ? "overflow-hidden" : ""}`}>
        {children}
      </div>
    </div>
  );
}
