import { demoTrip } from "@/mocks/trip";
import type { BookingRequest } from "./types";
import { validateBookingRequest } from "./validateBookingRequest";

const valid: BookingRequest = {
  tripId: demoTrip.id,
  pickupStopId: "cambridge",
  dropoffStopId: "milton",
  seats: 1,
  responseWindowHours: 24,
  message: "",
};

it("accepts a valid request and prices it on the server", () => {
  expect(validateBookingRequest(demoTrip, valid)).toEqual({
    ok: true,
    request: valid,
    quote: {
      seats: 1,
      subtotalCents: 1200,
      bookingFeeCents: 294,
      totalCents: 1494,
    },
  });
});

it.each<[string, unknown, number]>([
  ["a missing body", null, 400],
  ["a missing field", { ...valid, seats: undefined }, 400],
  ["another trip", { ...valid, tripId: "nope" }, 404],
  ["an unknown stop", { ...valid, pickupStopId: "ottawa" }, 422],
  [
    "stops in the wrong order",
    { ...valid, pickupStopId: "milton", dropoffStopId: "cambridge" },
    422,
  ],
  ["the same stop twice", { ...valid, dropoffStopId: "cambridge" }, 422],
  ["an unlisted response time", { ...valid, responseWindowHours: 3 }, 422],
  ["zero seats", { ...valid, seats: 0 }, 422],
  ["a fractional seat", { ...valid, seats: 1.5 }, 422],
  ["a very long message", { ...valid, message: "x".repeat(1001) }, 422],
])("rejects %s", (_, body, status) => {
  const result = validateBookingRequest(demoTrip, body);
  expect(result.ok).toBe(false);
  expect(result).toMatchObject({ status });
});

it("rejects more seats than the fullest leg has, with a useful message", () => {
  // Cambridge → Toronto crosses Milton → Mississauga, which has 2 seats left.
  expect(
    validateBookingRequest(demoTrip, {
      ...valid,
      dropoffStopId: "toronto",
      seats: 3,
    }),
  ).toEqual({
    ok: false,
    status: 409,
    error: "Only 2 seats are left for these stops.",
  });
});
