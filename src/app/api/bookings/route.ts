import type { NextRequest } from "next/server";
import { parseSimulation } from "@/lib/simulate";
import type { BookingConfirmation } from "@/lib/types";
import { validateBookingRequest } from "@/lib/validateBookingRequest";
import { simulateLatency } from "@/mocks/latency";
import { demoTrip } from "@/mocks/trip";

const HOUR_MS = 60 * 60 * 1000;

export async function POST(request: NextRequest) {
  const simulation = parseSimulation(
    request.nextUrl.searchParams.get("simulate"),
  );
  await simulateLatency(simulation, 800);

  if (simulation === "booking-error") {
    return Response.json(
      { error: "We couldn’t reach the driver just now. Please try again." },
      { status: 503 },
    );
  }

  const body: unknown = await request.json().catch(() => null);
  const result = validateBookingRequest(demoTrip, body);
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: result.status });
  }

  // Nothing is stored: this is a demo, so every request starts fresh.
  const confirmation: BookingConfirmation = {
    id: crypto.randomUUID(),
    status: "pending",
    quote: result.quote,
    expiresAt: new Date(
      Date.now() + result.request.responseWindowHours * HOUR_MS,
    ).toISOString(),
  };
  return Response.json(confirmation, { status: 201 });
}
