import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { BookingConfirmation, BookingRequest } from "@/lib/types";
import { demoSearch, demoTrip } from "@/mocks/trip";
import { mockFetch, renderWithQueryClient } from "@/test/render";
import { TripScreen } from "./TripScreen";

const confirmation: BookingConfirmation = {
  id: "booking-1",
  status: "pending",
  quote: {
    seats: 1,
    subtotalCents: 1200,
    bookingFeeCents: 294,
    totalCents: 1494,
  },
  expiresAt: "2026-10-06T18:00:00Z",
};

function renderScreen() {
  renderWithQueryClient(<TripScreen {...demoSearch} />);
  return userEvent.setup();
}

const tripLoaded = () =>
  screen.findByRole("heading", { level: 1, name: "Cambridge to Milton" });

describe("loading the trip", () => {
  it("shows a loading state, then the trip from the API", async () => {
    const fetchMock = mockFetch(() => ({ status: 200, body: demoTrip }));
    renderScreen();

    expect(screen.getByRole("status")).toHaveTextContent("Loading trip");
    await tripLoaded();
    expect(fetchMock).toHaveBeenCalledWith(
      `/api/trips/${demoTrip.id}`,
      undefined,
    );
  });

  it("starts on the searched stops", async () => {
    mockFetch(() => ({ status: 200, body: demoTrip }));
    renderScreen();
    await tripLoaded();
    expect(
      screen.getByRole("button", { name: /^Cambridge/ }),
    ).toHaveTextContent("Pick-up");
  });

  it("shows the API's error and recovers on retry", async () => {
    let fail = true;
    mockFetch(() =>
      fail
        ? { status: 503, body: { error: "Our servers are having trouble." } }
        : { status: 200, body: demoTrip },
    );
    const user = renderScreen();

    // useTrip retries a 5xx once (after ~1s) before giving up.
    expect(
      await screen.findByRole("alert", {}, { timeout: 3000 }),
    ).toHaveTextContent("Our servers are having trouble.");

    fail = false;
    await user.click(screen.getByRole("button", { name: "Try again" }));
    await tripLoaded();
  });
});

describe("requesting a booking", () => {
  function api(booking: { status: number; body: unknown }) {
    return mockFetch((url) =>
      url.startsWith("/api/bookings")
        ? booking
        : { status: 200, body: demoTrip },
    );
  }

  it("sends the passenger's choices and confirms", async () => {
    const fetchMock = api({ status: 201, body: confirmation });
    const user = renderScreen();
    await tripLoaded();

    await user.type(
      screen.getByRole("textbox", { name: /Message to Sara/ }),
      "Hi!",
    );
    await user.click(screen.getByRole("button", { name: "Request to Book" }));

    const dialog = await screen.findByRole("dialog", {
      name: "Request sent to Sara",
    });
    expect(within(dialog).getByText("CA$14.94")).toBeInTheDocument();

    const [, init] = fetchMock.mock.calls.at(-1)!;
    expect(JSON.parse(String(init?.body))).toEqual<BookingRequest>({
      tripId: demoTrip.id,
      pickupStopId: "cambridge",
      dropoffStopId: "milton",
      seats: 1,
      responseWindowHours: 24,
      message: "Hi!",
    });

    await user.click(within(dialog).getByRole("button", { name: "Done" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    // The price card, the navbar and the mobile sheet all show it (CSS picks
    // which are visible, and jsdom doesn't apply it).
    const sentButtons = screen.getAllByRole("button", { name: "Request sent" });
    expect(sentButtons).toHaveLength(3);
    sentButtons.forEach((button) => expect(button).toBeDisabled());
  });

  it("lets the passenger send a new request after changing their stops", async () => {
    api({ status: 201, body: confirmation });
    const user = renderScreen();
    await tripLoaded();

    await user.click(screen.getByRole("button", { name: "Request to Book" }));
    await user.click(await screen.findByRole("button", { name: "Done" }));
    await user.click(screen.getByRole("button", { name: /^Mississauga/ }));

    expect(
      screen.getByRole("button", { name: "Request to Book" }),
    ).toBeEnabled();
  });

  it("explains a failure and can try again", async () => {
    const fetchMock = api({
      status: 503,
      body: { error: "We couldn’t reach the driver just now." },
    });
    const user = renderScreen();
    await tripLoaded();

    await user.click(screen.getByRole("button", { name: "Request to Book" }));
    const dialog = await screen.findByRole("dialog", {
      name: "Your request wasn’t sent",
    });
    expect(dialog).toHaveTextContent("We couldn’t reach the driver just now.");

    fetchMock.mockClear();
    await user.click(within(dialog).getByRole("button", { name: "Try again" }));
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/bookings",
      expect.objectContaining({ method: "POST" }),
    );
  });
});
