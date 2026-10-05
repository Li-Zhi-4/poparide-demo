export type SectionPosition<Id extends string> = {
  id: Id;
  /** Distance from the top of the viewport to the section's top, in px. */
  top: number;
};

type PickOptions = {
  /** A section is "reached" once its top has scrolled up to this line. */
  line: number;
  /** At the bottom of the page the last section wins, even if it's short. */
  atBottom: boolean;
};

/**
 * Which section tab should be highlighted for a scroll position: the section
 * most recently scrolled up to `line` (the lowest one that has reached it,
 * the earlier one on a tie), the first one before any has, and the last one
 * at the bottom of the page. `sections` are in page order. Returns undefined
 * only if there are no sections.
 */
export function pickActiveSection<Id extends string>(
  sections: SectionPosition<Id>[],
  { line, atBottom }: PickOptions,
): Id | undefined {
  if (atBottom) return sections.at(-1)?.id;
  let active = sections[0];
  for (const section of sections) {
    if (section.top <= line && active && section.top > active.top) {
      active = section;
    }
  }
  return active?.id;
}
