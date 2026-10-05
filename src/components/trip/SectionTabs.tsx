import type { Ref } from "react";

export const sections = [
  { id: "overview", label: "Overview" },
  { id: "about", label: "About" },
  { id: "policies", label: "Policies" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

export const sectionIds: readonly SectionId[] = sections.map((s) => s.id);

type SectionTabsProps = {
  active?: SectionId;
  /** Called when a tab is clicked, before the browser scrolls to it. */
  onNavigate?: (id: SectionId) => void;
  /**
   * "inline" is the 36px strip under the map. "bar" fills the 64px navbar
   * once that strip has scrolled away; the navbar supplies the bottom border.
   */
  variant?: "inline" | "bar";
  ref?: Ref<HTMLElement>;
};

/** In-page links styled as the Figma tabs. */
export function SectionTabs({
  active = "overview",
  onNavigate,
  variant = "inline",
  ref,
}: SectionTabsProps) {
  return (
    <nav
      ref={ref}
      aria-label="Trip sections"
      className={variant === "bar" ? "h-full" : undefined}
    >
      <ul
        className={`flex gap-2 ${variant === "inline" ? "h-9 border-b border-neutral-200" : "h-full"}`}
      >
        {sections.map(({ id, label }) => {
          const isActive = id === active;
          return (
            <li key={id} className="flex flex-col">
              <a
                href={`#${id}`}
                onClick={() => onNavigate?.(id)}
                aria-current={isActive ? "location" : undefined}
                className={`flex flex-1 items-center px-4 pt-1 pb-0.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-orange-primary ${isActive ? "font-bold text-orange-primary" : "font-semibold text-neutral-500 hover:text-blue-primary"}`}
              >
                {/* A hidden bold copy reserves the active width, so tabs don't shift as the highlight moves. */}
                <span className="grid">
                  <span className="col-start-1 row-start-1">{label}</span>
                  <span
                    aria-hidden
                    className="invisible col-start-1 row-start-1 font-bold"
                  >
                    {label}
                  </span>
                </span>
              </a>
              <span
                className={`h-0.75 rounded-full transition-colors ${isActive ? "bg-orange-primary" : ""}`}
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
