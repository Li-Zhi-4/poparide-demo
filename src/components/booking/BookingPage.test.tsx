import { act, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { demoSelection, demoTrip } from "@/mocks/trip";
import { triggerIntersection } from "@/test/intersectionObserver";
import { renderWithQueryClient } from "@/test/render";
import { BookingPage } from "./BookingPage";

function renderPage() {
  renderWithQueryClient(
    <BookingPage trip={demoTrip} initialSelection={demoSelection} />,
  );
  const stop = (city: string) =>
    screen.getByRole("button", { name: new RegExp(`^${city}`) });
  const priceCard = () => within(screen.getByRole("region", { name: /to/ }));
  return { stop, priceCard, user: userEvent.setup() };
}

it("starts on the searched trip, Cambridge to Milton for CA$14.94", () => {
  const { priceCard } = renderPage();
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "Cambridge to Milton",
  );
  expect(priceCard().getByText("CA$14.94")).toBeInTheDocument();
});

it("selecting Cambridge to Mississauga gives $17", async () => {
  const { stop, priceCard, user } = renderPage();

  await user.click(stop("Mississauga"));

  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "Cambridge to Mississauga",
  );
  expect(priceCard().getByText("$17.00")).toBeInTheDocument();
  expect(priceCard().getByText("CA$19.94")).toBeInTheDocument();
  expect(stop("Mississauga")).toHaveTextContent("Drop-off");
  expect(stop("Milton")).not.toHaveTextContent("Drop-off");
});

it("moves the pick-up when an earlier stop is clicked", async () => {
  const { stop, user } = renderPage();

  await user.click(stop("London"));

  expect(stop("London")).toHaveTextContent("Pick-up");
  expect(stop("Cambridge")).not.toHaveTextContent("Pick-up");
});

it("caps seats at the fullest leg and keeps the count valid", async () => {
  const { stop, priceCard, user } = renderPage();
  const seats = screen.getByRole("combobox", { name: "Seats required" });

  await user.selectOptions(seats, "3");
  expect(priceCard().getByText("3 seats")).toBeInTheDocument();

  // Milton → Mississauga only has 2 seats left.
  await user.click(stop("Toronto"));

  expect(seats).toHaveValue("2");
  expect(within(seats).getAllByRole("option")).toHaveLength(2);
  expect(priceCard().getByText("2 seats")).toBeInTheDocument();
});

it("works from the keyboard", async () => {
  const { stop, user } = renderPage();

  stop("Toronto").focus();
  await user.keyboard("{Enter}");

  expect(stop("Toronto")).toHaveTextContent("Drop-off");
});

// The elements the navbar watches, and helpers to scroll them past it.
const requestButton = () =>
  within(screen.getByRole("region", { name: /to/ })).getByRole("button", {
    name: "Request to Book",
  });
const pageTabs = () =>
  screen
    .getAllByRole("navigation", { name: "Trip sections" })
    .find((nav) => !nav.closest("header"))!;
const scrollPast = (element: Element) =>
  act(() => triggerIntersection({ isIntersecting: false, top: -40 }, element));
const scrollBack = (element: Element) =>
  act(() => triggerIntersection({ isIntersecting: true, top: 300 }, element));

describe("navbar summary", () => {
  const summary = () => screen.getByTestId("navbar-summary");

  it("stays hidden while the price card's button is on screen", () => {
    renderPage();
    expect(summary()).toHaveAttribute("inert");
  });

  it("stays hidden when the button is below the fold, not scrolled past", () => {
    renderPage();
    act(() =>
      triggerIntersection(
        { isIntersecting: false, top: 2000 },
        requestButton(),
      ),
    );
    expect(summary()).toHaveAttribute("inert");
  });

  it("shows route, total and Reserve once the button scrolls under the navbar", () => {
    renderPage();
    scrollPast(requestButton());

    expect(summary()).not.toHaveAttribute("inert");
    expect(within(summary()).getByText("Cambridge to Milton")).toBeVisible();
    expect(within(summary()).getByText("CA$14.94 total")).toBeVisible();
    expect(
      within(summary()).getByRole("button", { name: "Reserve" }),
    ).toBeEnabled();
  });

  it("follows the passenger's choices", async () => {
    const { stop, user } = renderPage();
    scrollPast(requestButton());

    await user.click(stop("Mississauga"));

    expect(
      within(summary()).getByText("Cambridge to Mississauga"),
    ).toBeVisible();
    expect(within(summary()).getByText("CA$19.94 total")).toBeVisible();
  });

  it("hides again when the price card scrolls back into view", () => {
    renderPage();
    scrollPast(requestButton());
    scrollBack(requestButton());
    expect(summary()).toHaveAttribute("inert");
  });
});

describe("navbar tabs", () => {
  const logo = () => screen.getByTestId("navbar-logo");
  const navbarTabs = () => screen.getByTestId("navbar-tabs");

  it("shows the logo until the page's tabs scroll away", () => {
    renderPage();
    expect(logo()).not.toHaveAttribute("inert");
    expect(navbarTabs()).toHaveAttribute("inert");
  });

  it("swaps the logo for the tabs once the page's tabs slide under the navbar", () => {
    renderPage();
    scrollPast(pageTabs());

    expect(logo()).toHaveAttribute("inert");
    expect(navbarTabs()).not.toHaveAttribute("inert");
    expect(
      within(navbarTabs())
        .getAllByRole("link")
        .map((link) => link.getAttribute("href")),
    ).toEqual(["#overview", "#vehicle", "#about", "#policies"]);
  });

  it("keeps the summary independent of the tabs", () => {
    renderPage();
    scrollPast(pageTabs());
    expect(screen.getByTestId("navbar-summary")).toHaveAttribute("inert");

    scrollPast(requestButton());
    expect(screen.getByTestId("navbar-summary")).not.toHaveAttribute("inert");
    expect(navbarTabs()).not.toHaveAttribute("inert");
  });

  it("brings the logo back when scrolling up past the page's tabs", () => {
    renderPage();
    scrollPast(pageTabs());
    scrollBack(pageTabs());
    expect(logo()).not.toHaveAttribute("inert");
    expect(navbarTabs()).toHaveAttribute("inert");
  });
});

describe("active tab", () => {
  // Both the page's tabs and the navbar's should agree.
  const expectActive = (name: string) => {
    const active = screen.getAllByRole("link", { current: "location" });
    expect(active).toHaveLength(2);
    active.forEach((link) => expect(link).toHaveAccessibleName(name));
  };

  it("starts on Overview", () => {
    renderPage();
    expectActive("Overview");
  });

  it("highlights a clicked tab", async () => {
    const { user } = renderPage();
    await user.click(within(pageTabs()).getByRole("link", { name: "Vehicle" }));
    expectActive("Vehicle");
  });
});
