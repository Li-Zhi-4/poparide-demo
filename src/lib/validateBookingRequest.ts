import { RESPONSE_WINDOWS, quote, seatsAvailable } from "./booking";
import type { BookingRequest, Quote, Trip } from "./types";

const MAX_MESSAGE_LENGTH = 1000;

type ValidationResult =
  | { ok: true; request: BookingRequest; quote: Quote }
  | { ok: false; status: 400 | 404 | 409 | 422; error: string };

function isBookingRequest(body: unknown): body is BookingRequest {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.tripId === "string" &&
    typeof b.pickupStopId === "string" &&
    typeof b.dropoffStopId === "string" &&
    typeof b.seats === "number" &&
    typeof b.responseWindowHours === "number" &&
    typeof b.message === "string"
  );
}

/**
 * Server-side checks for a Booking Request. The page already prevents most
 * of these, but the API can't trust the client, so it re-checks against the
 * same booking rules and recomputes the price itself.
 */
export function validateBookingRequest(
  trip: Trip,
  body: unknown,
): ValidationResult {
  if (!isBookingRequest(body)) {
    return { ok: false, status: 400, error: "That request was incomplete." };
  }
  if (body.tripId !== trip.id) {
    return { ok: false, status: 404, error: "This trip no longer exists." };
  }

  const selection = {
    pickup: trip.stops.findIndex((s) => s.id === body.pickupStopId),
    dropoff: trip.stops.findIndex((s) => s.id === body.dropoffStopId),
  };
  if (
    selection.pickup < 0 ||
    selection.dropoff < 0 ||
    selection.pickup >= selection.dropoff
  ) {
    return {
      ok: false,
      status: 422,
      error: "Choose a pick-up stop before your drop-off stop.",
    };
  }
  if (
    !(RESPONSE_WINDOWS as readonly number[]).includes(body.responseWindowHours)
  ) {
    return { ok: false, status: 422, error: "Choose a valid response time." };
  }
  if (body.message.length > MAX_MESSAGE_LENGTH) {
    return {
      ok: false,
      status: 422,
      error: `Keep your message under ${MAX_MESSAGE_LENGTH} characters.`,
    };
  }

  const available = seatsAvailable(trip, selection);
  if (!Number.isInteger(body.seats) || body.seats < 1) {
    return { ok: false, status: 422, error: "Choose at least one seat." };
  }
  if (body.seats > available) {
    return {
      ok: false,
      status: 409,
      error:
        available === 0
          ? "There are no seats left for these stops."
          : `Only ${available} ${available === 1 ? "seat is" : "seats are"} left for these stops.`,
    };
  }

  return { ok: true, request: body, quote: quote(trip, selection, body.seats) };
}
