import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { demoSelection, demoTrip } from "@/mocks/trip";
import { renderWithQueryClient } from "@/test/render";
import { BookingPage } from "./BookingPage";

// The sheet only shows below the desktop breakpoint, but jsdom doesn't apply
// CSS, so it's always in the DOM here.
function renderSheet() {
  renderWithQueryClient(
    <BookingPage trip={demoTrip} initialSelection={demoSelection} />,
  );
  const sheet = () =>
    within(screen.getByRole("region", { name: "Booking summary" }));
  return { sheet, user: userEvent.setup() };
}

// The sheet keeps both its collapsed row and its card in the DOM so it can
// animate between them; the closed one is aria-hidden. Text can match in
// both, so this finds the copy the passenger can see.
function visibleText(
  sheet: ReturnType<typeof within>,
  text: string,
): HTMLElement {
  const match = sheet
    .getAllByText(text)
    .find((element: HTMLElement) => !element.closest('[aria-hidden="true"]'));
  if (!match) throw new Error(`No visible "${text}" in the sheet`);
  return match;
}

it("starts collapsed with the route, total and Request", () => {
  const { sheet } = renderSheet();

  expect(visibleText(sheet(), "Cambridge to Milton")).toBeVisible();
  expect(sheet().getByText("CA$14.94 total")).toBeVisible();
  expect(sheet().getByRole("button", { name: "Request" })).toBeEnabled();
  expect(
    sheet().getByRole("button", { name: "Show price details" }),
  ).toHaveAttribute("aria-expanded", "false");
  // The full card is there for the toggle to reveal, but hidden.
  expect(
    sheet().queryByRole("region", { name: "Cambridge to Milton" }),
  ).not.toBeInTheDocument();
});

it("expands to the full price card and collapses again", async () => {
  const { sheet, user } = renderSheet();

  await user.click(sheet().getByRole("button", { name: "Show price details" }));

  const card = within(
    sheet().getByRole("region", { name: "Cambridge to Milton" }),
  );
  expect(card.getByText("Monday, October 5 at 6:15pm")).toBeVisible();
  expect(card.getByRole("textbox", { name: "Promo code" })).toBeVisible();
  expect(card.getByText("CA$14.94")).toBeVisible();
  expect(card.getByRole("button", { name: "Request to Book" })).toBeEnabled();
  expect(sheet().queryByRole("button", { name: "Request" })).toBeNull();

  await user.click(sheet().getByRole("button", { name: "Hide price details" }));
  expect(sheet().getByRole("button", { name: "Request" })).toBeVisible();
});

it("collapses with Escape", async () => {
  const { sheet, user } = renderSheet();

  await user.click(sheet().getByRole("button", { name: "Show price details" }));
  await user.keyboard("{Escape}");

  expect(
    sheet().getByRole("button", { name: "Show price details" }),
  ).toHaveAttribute("aria-expanded", "false");
});

it("follows the passenger's stop choices", async () => {
  const { sheet, user } = renderSheet();

  await user.click(screen.getByRole("button", { name: /^Mississauga/ }));

  expect(visibleText(sheet(), "Cambridge to Mississauga")).toBeVisible();
  expect(sheet().getByText("CA$19.94 total")).toBeVisible();
});

it("keeps whichever part is closed out of reach while it animates", async () => {
  const { sheet, user } = renderSheet();
  const panelOf = (button: HTMLElement) =>
    button.closest("[aria-hidden]") as HTMLElement;
  const collapsedRequest = sheet().getByRole("button", { name: "Request" });

  // Collapsed: the card's button is there for the animation, but inert.
  const requestButton = screen
    .getAllByRole("button", { name: "Request to Book", hidden: true })
    .find((button) =>
      sheet().queryAllByRole("button", { hidden: true }).includes(button),
    )!;
  expect(panelOf(requestButton)).toHaveAttribute("inert");
  expect(panelOf(collapsedRequest)).not.toHaveAttribute("inert");

  await user.click(sheet().getByRole("button", { name: "Show price details" }));

  expect(panelOf(requestButton)).not.toHaveAttribute("inert");
  expect(panelOf(collapsedRequest)).toHaveAttribute("inert");
});
