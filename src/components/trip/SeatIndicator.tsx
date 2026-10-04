type SeatIndicatorProps = {
  /** Seats the driver offers in total. */
  offered: number;
  /** Seats still free on this leg. */
  available: number;
  /** Seats this passenger is booking on this leg (0 if they're not riding it). */
  mine: number;
};

type SeatState = "taken" | "mine" | "free";

const circleClass: Record<SeatState, string> = {
  taken: "border-solid border-neutral-500 text-neutral-500",
  mine: "border-solid border-orange-primary text-orange-primary",
  free: "border-dashed border-orange-primary text-orange-primary",
};

export function SeatIndicator({
  offered,
  available,
  mine,
}: SeatIndicatorProps) {
  const taken = offered - available;
  const seats: SeatState[] = Array.from({ length: offered }, (_, i) =>
    i < taken ? "taken" : i < taken + mine ? "mine" : "free",
  );

  return (
    <div className="flex flex-col items-center gap-1">
      <p className="flex h-7 items-center gap-1 font-semibold text-neutral-500">
        <span aria-hidden className="text-2xl text-neutral-900">
          {available}
        </span>
        <span aria-hidden className="text-xs">
          / available
        </span>
        <span className="sr-only">
          {available} of {offered} seats available
        </span>
      </p>
      <div className="flex gap-1.25" aria-hidden>
        {seats.map((state, i) => (
          <span
            key={i}
            className={`flex size-4 items-center justify-center rounded-full border bg-white ${circleClass[state]}`}
          >
            {/* The seat glyph is a PNG mask from Figma, tinted with currentColor. */}
            <span className="size-3 bg-current mask-[url(/icons/seat.png)] mask-contain mask-center mask-no-repeat" />
          </span>
        ))}
      </div>
    </div>
  );
}
