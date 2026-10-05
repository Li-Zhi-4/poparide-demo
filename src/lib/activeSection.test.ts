import { pickActiveSection, type SectionPosition } from "./activeSection";

type Id = "overview" | "vehicle" | "about" | "policies";

// Section tops at a given scroll position, matching the page's layout:
// Vehicle and About start at the same height.
function positions(scrollY: number): SectionPosition<Id>[] {
  return [
    { id: "overview", top: 500 - scrollY },
    { id: "vehicle", top: 1330 - scrollY },
    { id: "about", top: 1330 - scrollY },
    { id: "policies", top: 2010 - scrollY },
  ];
}

const pick = (scrollY: number, current: Id = "overview", atBottom = false) =>
  pickActiveSection(positions(scrollY), { line: 300, atBottom, current });

it("starts on the first section before any is reached", () => {
  expect(pick(0, "overview")).toBe("overview");
});

it("highlights the section most recently scrolled up to the line", () => {
  expect(pick(400)).toBe("overview");
  expect(pick(1100)).toBe("about");
});

it("picks About for the side-by-side row when scrolling into it", () => {
  expect(pick(1100, "overview")).toBe("about");
});

it("keeps Vehicle highlighted in that row after it was clicked", () => {
  expect(pick(1100, "vehicle")).toBe("vehicle");
});

it("moves on from a clicked tab once its section is left behind", () => {
  expect(pick(400, "vehicle")).toBe("overview");
});

it("highlights the last section at the bottom of the page", () => {
  // Policies is too short to scroll up to the line.
  expect(pick(1412, "about", true)).toBe("policies");
});

it("keeps the current section if there are no sections", () => {
  expect(
    pickActiveSection<Id>([], { line: 300, atBottom: false, current: "about" }),
  ).toBe("about");
});
