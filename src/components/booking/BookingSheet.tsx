"use client";

import { useId, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

type BookingSheetProps = {
  route: string;
  /** Formatted total, or null when no seats are left for the chosen stops. */
  total: string | null;
  onReserve: () => void;
  reserveLabel: string;
  reserveDisabled: boolean;
  /** The full price card, shown when the sheet is expanded. */
  details: ReactNode;
};

/**
 * The mobile stand-in for the price card: pinned to the bottom of the
 * screen, collapsed to route + total + Reserve, and expandable with the
 * round tab on its top edge to show the full card.
 */
export function BookingSheet({
  route,
  total,
  onReserve,
  reserveLabel,
  reserveDisabled,
  details,
}: BookingSheetProps) {
  const [expanded, setExpanded] = useState(false);
  const detailsId = useId();

  return (
    <section
      aria-label="Booking summary"
      onKeyDown={(e) => {
        if (e.key === "Escape") setExpanded(false);
      }}
      className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-mobile rounded-t-card border-t border-neutral-200 bg-white px-8 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-sheet desktop:hidden"
    >
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={detailsId}
        aria-label={expanded ? "Hide price details" : "Show price details"}
        onClick={() => setExpanded((open) => !open)}
        className="absolute -top-4.75 left-1/2 flex size-9 -translate-x-1/2 items-center justify-center rounded-full border border-neutral-200 bg-blue-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-primary"
      >
        <Icon
          name="chevron-down-white"
          box={24}
          className={`transition-transform duration-200 motion-reduce:transition-none ${expanded ? "" : "rotate-180"}`}
        />
      </button>

      <div hidden={expanded} className="flex items-center gap-2">
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="text-xl font-bold">{route}</p>
          <p className="text-base text-blue-secondary">
            {total ? `${total} total` : "No seats left"}
          </p>
        </div>
        <Button
          className="h-9"
          disabled={!total || reserveDisabled}
          onClick={onReserve}
        >
          {reserveLabel}
        </Button>
      </div>

      <div id={detailsId} hidden={!expanded}>
        {details}
      </div>
    </section>
  );
}
