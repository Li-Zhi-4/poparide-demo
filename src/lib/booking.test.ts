import { demoTrip } from "@/mocks/trip";
import {
  clampSeats,
  isValidSelection,
  quote,
  seatsAvailable,
  selectStop,
  selectionFromStopIds,
} from "./booking";
import type { StopSelection } from "./types";

// demoTrip stops: 0 London, 1 Cambridge, 2 Milton, 3 Mississauga, 4 Toronto
const LONDON = 0;
const CAMBRIDGE = 1;
const MILTON = 2;
const MISSISSAUGA = 3;
const TORONTO = 4;

describe("quote", () => {
  it("prices Cambridge to Milton at $12 + $2.94 fee, as in the design", () => {
    expect(quote(demoTrip, { pickup: CAMBRIDGE, dropoff: MILTON }, 1)).toEqual({
      seats: 1,
      subtotalCents: 1200,
      bookingFeeCents: 294,
      totalCents: 1494,
    });
  });

  it("sums every leg ridden: Cambridge to Mississauga is $17 a seat", () => {
    const { subtotalCents } = quote(
      demoTrip,
      { pickup: CAMBRIDGE, dropoff: MISSISSAUGA },
      1,
    );
    expect(subtotalCents).toBe(1700);
  });

  it("multiplies fare and booking fee by the number of seats", () => {
    expect(quote(demoTrip, { pickup: LONDON, dropoff: TORONTO }, 2)).toEqual({
      seats: 2,
      subtotalCents: 6600,
      bookingFeeCents: 588,
      totalCents: 7188,
    });
  });

  it.each([0, -1, 1.5])("rejects %p seats", (seats) => {
    expect(() =>
      quote(demoTrip, { pickup: CAMBRIDGE, dropoff: MILTON }, seats),
    ).toThrow(RangeError);
  });

  it("rejects a drop-off that isn't after the pick-up", () => {
    expect(() =>
      quote(demoTrip, { pickup: MILTON, dropoff: MILTON }, 1),
    ).toThrow(RangeError);
    expect(() =>
      quote(demoTrip, { pickup: MILTON, dropoff: CAMBRIDGE }, 1),
    ).toThrow(RangeError);
  });
});

describe("seatsAvailable", () => {
  it("is the seat count of the only leg for a one-leg ride", () => {
    expect(
      seatsAvailable(demoTrip, { pickup: CAMBRIDGE, dropoff: MILTON }),
    ).toBe(3);
  });

  it("is limited by the fullest leg on the way", () => {
    // Milton → Mississauga has only 2 seats left.
    expect(
      seatsAvailable(demoTrip, { pickup: CAMBRIDGE, dropoff: TORONTO }),
    ).toBe(2);
  });
});

describe("isValidSelection", () => {
  it.each<[StopSelection, boolean]>([
    [{ pickup: 0, dropoff: 4 }, true],
    [{ pickup: 2, dropoff: 2 }, false],
    [{ pickup: 3, dropoff: 1 }, false],
    [{ pickup: -1, dropoff: 2 }, false],
    [{ pickup: 0, dropoff: 5 }, false],
  ])("%p → %p", (selection, expected) => {
    expect(isValidSelection(demoTrip.stops.length, selection)).toBe(expected);
  });
});

describe("selectStop", () => {
  const cambridgeToMississauga = { pickup: CAMBRIDGE, dropoff: MISSISSAUGA };

  it("moves the pick-up when a stop before it is clicked", () => {
    expect(selectStop(cambridgeToMississauga, LONDON)).toEqual({
      pickup: LONDON,
      dropoff: MISSISSAUGA,
    });
  });

  it("moves the drop-off when a stop after it is clicked", () => {
    expect(selectStop(cambridgeToMississauga, TORONTO)).toEqual({
      pickup: CAMBRIDGE,
      dropoff: TORONTO,
    });
  });

  it("leaves the selection alone when a badged stop is clicked", () => {
    expect(selectStop(cambridgeToMississauga, CAMBRIDGE)).toBe(
      cambridgeToMississauga,
    );
    expect(selectStop(cambridgeToMississauga, MISSISSAUGA)).toBe(
      cambridgeToMississauga,
    );
  });

  it("moves the nearer badge for a stop in between", () => {
    const londonToMississauga = { pickup: LONDON, dropoff: MISSISSAUGA };
    // Milton is 2 from London and 1 from Mississauga.
    expect(selectStop(londonToMississauga, MILTON)).toEqual({
      pickup: LONDON,
      dropoff: MILTON,
    });
    // Cambridge is 1 from London and 2 from Mississauga.
    expect(selectStop(londonToMississauga, CAMBRIDGE)).toEqual({
      pickup: CAMBRIDGE,
      dropoff: MISSISSAUGA,
    });
  });

  it("moves the pick-up on a tie", () => {
    // Milton is 1 from Cambridge and 1 from Mississauga.
    expect(selectStop(cambridgeToMississauga, MILTON)).toEqual({
      pickup: MILTON,
      dropoff: MISSISSAUGA,
    });
  });

  it("always produces a valid selection, from any selection and any click", () => {
    const stopCount = demoTrip.stops.length;
    for (let pickup = 0; pickup < stopCount; pickup++) {
      for (let dropoff = pickup + 1; dropoff < stopCount; dropoff++) {
        for (let index = 0; index < stopCount; index++) {
          const next = selectStop({ pickup, dropoff }, index);
          expect(isValidSelection(stopCount, next)).toBe(true);
          expect(next.pickup).not.toBe(stopCount - 1);
          expect(next.dropoff).not.toBe(0);
        }
      }
    }
  });
});

describe("clampSeats", () => {
  it("keeps the count between 1 and the seats available", () => {
    expect(clampSeats(3, 2)).toBe(2);
    expect(clampSeats(0, 3)).toBe(1);
    expect(clampSeats(2, 3)).toBe(2);
  });

  it("returns 0 when nothing is available", () => {
    expect(clampSeats(1, 0)).toBe(0);
  });
});

describe("selectionFromStopIds", () => {
  it("finds the searched stops", () => {
    expect(selectionFromStopIds(demoTrip, "cambridge", "milton")).toEqual({
      pickup: CAMBRIDGE,
      dropoff: MILTON,
    });
  });

  it.each([
    ["an unknown stop", "ottawa", "milton"],
    ["stops in the wrong order", "milton", "cambridge"],
  ])("falls back to the whole trip for %s", (_, from, to) => {
    expect(selectionFromStopIds(demoTrip, from, to)).toEqual({
      pickup: LONDON,
      dropoff: TORONTO,
    });
  });
});
