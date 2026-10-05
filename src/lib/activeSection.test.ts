import { pickActiveSection, type SectionPosition } from "./activeSection";

type Id = "overview" | "about" | "policies";

// Section tops at a given scroll position, matching the page's layout.
function positions(scrollY: number): SectionPosition<Id>[] {
  return [
    { id: "overview", top: 500 - scrollY },
    { id: "about", top: 1330 - scrollY },
    { id: "policies", top: 2010 - scrollY },
  ];
}

const pick = (scrollY: number, atBottom = false) =>
  pickActiveSection(positions(scrollY), { line: 300, atBottom });

it("starts on the first section before any is reached", () => {
  expect(pick(0)).toBe("overview");
});

it("highlights the section most recently scrolled up to the line", () => {
  expect(pick(400)).toBe("overview");
  expect(pick(1100)).toBe("about");
});

it("goes back as the passenger scrolls up", () => {
  expect(pick(1100)).toBe("about");
  expect(pick(900)).toBe("overview");
});

it("highlights the last section at the bottom of the page", () => {
  // Policies is too short to scroll up to the line.
  expect(pick(1412)).toBe("about");
  expect(pick(1412, true)).toBe("policies");
});

it("returns nothing when there are no sections", () => {
  expect(
    pickActiveSection<Id>([], { line: 300, atBottom: false }),
  ).toBeUndefined();
});

it("prefers the earlier section when several sit at the same height", () => {
  // e.g. before layout, when every section reports a top of 0.
  const stacked: SectionPosition<Id>[] = [
    { id: "overview", top: 0 },
    { id: "about", top: 0 },
    { id: "policies", top: 0 },
  ];
  expect(pickActiveSection(stacked, { line: 300, atBottom: false })).toBe(
    "overview",
  );
});
