export type SectionPosition<Id extends string> = {
  id: Id;
  /** Distance from the top of the viewport to the section's top, in px. */
  top: number;
};

type PickOptions<Id extends string> = {
  /** A section is "reached" once its top has scrolled up to this line. */
  line: number;
  /** At the bottom of the page the last section wins, even if it's short. */
  atBottom: boolean;
  /** The current active section, kept when it ties with others. */
  current: Id;
};

/**
 * Which section tab should be highlighted for a scroll position.
 *
 * It's the section most recently scrolled up to `line`. Sections that start
 * at the same height (Vehicle and About sit side by side) tie: the current
 * one stays active if it's among them, so a tab the passenger clicked stays
 * highlighted; otherwise the last in tab order wins.
 */
export function pickActiveSection<Id extends string>(
  sections: SectionPosition<Id>[],
  { line, atBottom, current }: PickOptions<Id>,
): Id {
  const first = sections[0];
  const last = sections[sections.length - 1];
  if (!first || !last) return current;
  if (atBottom) return last.id;

  const reached = sections.filter((s) => s.top <= line);
  if (reached.length === 0) return first.id;

  const lowest = Math.max(...reached.map((s) => s.top));
  const tied = reached.filter((s) => Math.abs(s.top - lowest) < 1);
  if (tied.some((s) => s.id === current)) return current;
  return tied[tied.length - 1]!.id;
}
