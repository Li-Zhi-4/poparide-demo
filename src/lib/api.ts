import type { Simulation } from "./simulate";
import type { BookingConfirmation, BookingRequest, Trip } from "./types";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, init);
  } catch {
    throw new ApiError("You seem to be offline. Check your connection.", 0);
  }
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      typeof body === "object" && body !== null && "error" in body
        ? String(body.error)
        : `Something went wrong (${response.status}).`;
    throw new ApiError(message, response.status);
  }
  return body as T;
}

function withSimulation(path: string, simulation?: Simulation) {
  return simulation ? `${path}?simulate=${simulation}` : path;
}

export function fetchTrip(id: string, simulation?: Simulation) {
  return request<Trip>(
    withSimulation(`/api/trips/${encodeURIComponent(id)}`, simulation),
  );
}

export function createBooking(body: BookingRequest, simulation?: Simulation) {
  return request<BookingConfirmation>(
    withSimulation("/api/bookings", simulation),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
}
