import type { IsoDateTime } from "./types";

// Trips are in Ontario. Pinning the zone keeps server and browser output
// identical, so there's no hydration mismatch for visitors in other zones.
const TIME_ZONE = "America/Toronto";

const money = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
});

/** "$12.00", or "CA$12.00" with `withCurrency`. */
export function formatMoney(
  cents: number,
  { withCurrency = false }: { withCurrency?: boolean } = {},
): string {
  const amount = money.format(cents / 100);
  return withCurrency ? `CA${amount}` : amount;
}

const weekdayShortMonth = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  weekday: "long",
  month: "short",
  day: "numeric",
});

const weekdayLongMonth = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  weekday: "long",
  month: "long",
  day: "numeric",
});

const longDate = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  month: "long",
  day: "numeric",
  year: "numeric",
});

const clock = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  hour: "numeric",
  minute: "2-digit",
});

// Built from parts because ICU versions disagree on the space before "PM"
// (a narrow no-break space in newer ones), which would differ between Node
// and some browsers.
function clockParts(iso: IsoDateTime) {
  const parts = clock.formatToParts(new Date(iso));
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return {
    time: `${part("hour")}:${part("minute")}`,
    period: part("dayPeriod"),
  };
}

/** "Monday, Oct 5 at 6:15 PM" — used on the stop timeline. */
export function formatStopTime(iso: IsoDateTime): string {
  const { time, period } = clockParts(iso);
  return `${weekdayShortMonth.format(new Date(iso))} at ${time} ${period}`;
}

/** "Monday, October 5 at 6:15pm" — used in the price card. */
export function formatDeparture(iso: IsoDateTime): string {
  const { time, period } = clockParts(iso);
  return `${weekdayLongMonth.format(new Date(iso))} at ${time}${period.toLowerCase()}`;
}

/** "September 21, 2025" — used on reviews. */
export function formatDate(iso: IsoDateTime): string {
  return longDate.format(new Date(iso));
}
