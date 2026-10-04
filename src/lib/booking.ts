import type { Leg, Quote, StopSelection, Trip } from "./types";

export function isValidSelection(
  stopCount: number,
  { pickup, dropoff }: StopSelection,
): boolean {
  return (
    Number.isInteger(pickup) &&
    Number.isInteger(dropoff) &&
    pickup >= 0 &&
    dropoff < stopCount &&
    pickup < dropoff
  );
}

/** The legs a passenger rides between their pick-up and drop-off stops. */
export function legsFor(trip: Trip, selection: StopSelection): Leg[] {
  if (!isValidSelection(trip.stops.length, selection)) {
    throw new RangeError(
      `Invalid stop selection ${selection.pickup}→${selection.dropoff}`,
    );
  }
  return trip.legs.slice(selection.pickup, selection.dropoff);
}

/** Seats are only free for the whole ride if every leg has them. */
export function seatsAvailable(trip: Trip, selection: StopSelection): number {
  return Math.min(...legsFor(trip, selection).map((leg) => leg.seatsAvailable));
}

export function quote(
  trip: Trip,
  selection: StopSelection,
  seats: number,
): Quote {
  if (!Number.isInteger(seats) || seats < 1) {
    throw new RangeError(`Seats must be a positive integer, got ${seats}`);
  }
  const pricePerSeat = legsFor(trip, selection).reduce(
    (sum, leg) => sum + leg.priceCents,
    0,
  );
  const subtotalCents = pricePerSeat * seats;
  const bookingFeeCents = trip.bookingFeeCentsPerSeat * seats;
  return {
    seats,
    subtotalCents,
    bookingFeeCents,
    totalCents: subtotalCents + bookingFeeCents,
  };
}

/**
 * Applies a click on the stop at `index` by moving whichever badge is nearest:
 * a stop before the pick-up becomes the pick-up, a stop after the drop-off
 * becomes the drop-off, and a stop in between moves the closer badge (the
 * pick-up on a tie). Because of this, the last stop can never become the
 * pick-up and the first stop can never become the drop-off.
 */
export function selectStop(
  selection: StopSelection,
  index: number,
): StopSelection {
  const { pickup, dropoff } = selection;
  if (index < pickup) return { pickup: index, dropoff };
  if (index > dropoff) return { pickup, dropoff: index };
  if (index === pickup || index === dropoff) return selection;
  return index - pickup <= dropoff - index
    ? { pickup: index, dropoff }
    : { pickup, dropoff: index };
}

/** Keeps a seat count within 1…max (or 0 when nothing is available). */
export function clampSeats(seats: number, max: number): number {
  return Math.min(Math.max(seats, 1), max);
}
