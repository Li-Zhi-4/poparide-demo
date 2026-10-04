import {
  formatDate,
  formatDeparture,
  formatMoney,
  formatStopTime,
} from "./format";

describe("formatMoney", () => {
  it("formats cents as dollars", () => {
    expect(formatMoney(1200)).toBe("$12.00");
    expect(formatMoney(294)).toBe("$2.94");
  });

  it("adds the currency for totals", () => {
    expect(formatMoney(1494, { withCurrency: true })).toBe("CA$14.94");
  });
});

describe("dates", () => {
  const departure = "2026-10-05T18:15:00-04:00";

  it("formats stop times with a plain space before PM", () => {
    expect(formatStopTime(departure)).toBe("Monday, Oct 5 at 6:15 PM");
  });

  it("formats the price card departure", () => {
    expect(formatDeparture(departure)).toBe("Monday, October 5 at 6:15pm");
  });

  it("uses Toronto time whatever the input offset", () => {
    expect(formatStopTime("2026-10-05T22:15:00Z")).toBe(
      "Monday, Oct 5 at 6:15 PM",
    );
  });

  it("formats review dates", () => {
    expect(formatDate("2025-09-21T12:00:00-04:00")).toBe("September 21, 2025");
  });
});
