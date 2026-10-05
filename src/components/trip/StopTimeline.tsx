import { selectStop } from "@/lib/booking";
import { formatStopTime } from "@/lib/format";
import type { Leg, Stop, StopSelection } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { SeatIndicator } from "./SeatIndicator";

type StopTimelineProps = {
  stops: Stop[];
  legs: Leg[];
  seatsOffered: number;
  selection: StopSelection;
  seats: number;
  onSelectionChange: (selection: StopSelection) => void;
};

type DotKind = "outside" | "endpoint" | "between";

export function StopTimeline({
  stops,
  legs,
  seatsOffered,
  selection,
  seats,
  onSelectionChange,
}: StopTimelineProps) {
  const { pickup, dropoff } = selection;

  return (
    <ol aria-label="Stops — choose your pick-up and drop-off">
      {stops.map((stop, index) => {
        const leg = legs[index]; // undefined for the final stop
        const isPickup = index === pickup;
        const isDropoff = index === dropoff;
        const dot: DotKind =
          isPickup || isDropoff
            ? "endpoint"
            : index > pickup && index < dropoff
              ? "between"
              : "outside";
        const next = selectStop(selection, index);
        const action =
          next === selection
            ? isPickup
              ? "Your pick-up"
              : "Your drop-off"
            : next.pickup !== pickup
              ? "Set as pick-up"
              : "Set as drop-off";

        return (
          <li key={stop.id}>
            <button
              type="button"
              onClick={() => onSelectionChange(next)}
              className="flex h-25 w-full items-center gap-3 rounded-card px-4 text-left transition-colors hover:bg-blue-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-primary"
            >
              <TimelineMarker
                dot={dot}
                lineAbove={index > pickup && index <= dropoff}
                lineBelow={index >= pickup && index < dropoff}
              />

              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="flex items-center gap-2">
                  <span className="text-xl leading-7 font-bold text-neutral-900">
                    {stop.city}
                  </span>
                  {isPickup && <Badge>Pick-up</Badge>}
                  {isDropoff && <Badge>Drop-off</Badge>}
                </span>
                <span className="flex flex-col gap-1 text-sm text-neutral-500">
                  <span className="flex items-center gap-1">
                    <Icon name="pin" box={16} />
                    {stop.address}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="calendar" box={16} />
                    {formatStopTime(stop.departsAt)}
                  </span>
                </span>
                <span className="sr-only">{action}</span>
              </span>

              {leg ? (
                <SeatIndicator
                  offered={seatsOffered}
                  available={leg.seatsAvailable}
                  mine={index >= pickup && index < dropoff ? seats : 0}
                />
              ) : (
                <span className="w-17.75" />
              )}
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function TimelineMarker({
  dot,
  lineAbove,
  lineBelow,
}: {
  dot: DotKind;
  lineAbove: boolean;
  lineBelow: boolean;
}) {
  return (
    <span
      aria-hidden
      className="flex h-full w-7 shrink-0 flex-col items-center"
    >
      <span
        className={`w-0.5 flex-1 rounded-b-full ${lineAbove ? "bg-orange-primary" : ""}`}
      />
      <span className="relative size-7">
        {dot === "endpoint" && (
          <span className="absolute top-1/2 left-1/2 size-2.5 -translate-1/2 rounded-full bg-orange-primary blur-[4px]" />
        )}
        <span
          className={`absolute top-1/2 left-1/2 size-3 -translate-1/2 rounded-full border border-orange-primary ${dot === "between" ? "bg-orange-primary" : ""}`}
        />
        {dot === "endpoint" && (
          <span className="absolute top-1/2 left-1/2 size-2 -translate-1/2 rounded-full bg-orange-primary" />
        )}
      </span>
      <span
        className={`w-0.5 flex-1 rounded-t-full ${lineBelow ? "bg-orange-primary" : ""}`}
      />
    </span>
  );
}
