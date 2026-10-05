/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import type { BookingConfirmation } from "@/lib/types";
import { demoTrip } from "@/mocks/trip";
import { POST as postBooking } from "./bookings/route";
import { GET as getTrip } from "./trips/[id]/route";

// Skip the demo's artificial delay.
jest.mock("@/mocks/latency", () => ({
  simulateLatency: () => Promise.resolve(),
}));

const origin = "http://localhost:3000";

function tripRequest(id: string, query = "") {
  return getTrip(new NextRequest(`${origin}/api/trips/${id}${query}`), {
    params: Promise.resolve({ id }),
  });
}

function bookingRequest(body: unknown, query = "") {
  return postBooking(
    new NextRequest(`${origin}/api/bookings${query}`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  );
}

describe("GET /api/trips/[id]", () => {
  it("returns the trip", async () => {
    const response = await tripRequest(demoTrip.id);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(demoTrip);
  });

  it("404s for an unknown trip", async () => {
    const response = await tripRequest("nope");
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "Trip not found." });
  });

  it("can simulate an outage", async () => {
    const response = await tripRequest(demoTrip.id, "?simulate=trip-error");
    expect(response.status).toBe(503);
  });
});

describe("POST /api/bookings", () => {
  const valid = {
    tripId: demoTrip.id,
    pickupStopId: "cambridge",
    dropoffStopId: "milton",
    seats: 2,
    responseWindowHours: 12,
    message: "See you there",
  };

  it("creates a pending request priced by the server", async () => {
    const before = Date.now();
    const response = await bookingRequest(valid);
    const body = (await response.json()) as BookingConfirmation;

    expect(response.status).toBe(201);
    expect(body).toMatchObject({
      status: "pending",
      quote: { seats: 2, totalCents: 2 * 1200 + 2 * 294 },
    });
    // Expires once the driver's 12-hour response window has passed.
    const expires = new Date(body.expiresAt).getTime() - before;
    expect(expires).toBeGreaterThanOrEqual(12 * 60 * 60 * 1000);
    expect(expires).toBeLessThan(12 * 60 * 60 * 1000 + 5000);
  });

  it("rejects requests the page would never send", async () => {
    const response = await bookingRequest({ ...valid, seats: 5 });
    expect(response.status).toBe(409);
  });

  it("rejects a body that isn't JSON", async () => {
    const response = await postBooking(
      new NextRequest(`${origin}/api/bookings`, { method: "POST", body: "{" }),
    );
    expect(response.status).toBe(400);
  });

  it("can simulate a failure", async () => {
    const response = await bookingRequest(valid, "?simulate=booking-error");
    expect(response.status).toBe(503);
  });
});
