import type { Ref } from "react";

export const sections = [
  { id: "overview", label: "Overview" },
  { id: "vehicle", label: "Vehicle" },
  { id: "about", label: "About" },
  { id: "policies", label: "Policies" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

type SectionTabsProps = {
  active?: SectionId;
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
                aria-current={isActive ? "location" : undefined}
                className={`flex flex-1 items-center px-4 pt-1 pb-0.5 text-sm focus-visible:outline-2 focus-visible:outline-orange-primary ${isActive ? "font-bold text-orange-primary" : "font-semibold text-neutral-500 hover:text-blue-primary"}`}
              >
                {label}
              </a>
              <span
                className={`h-0.75 rounded-full ${isActive ? "bg-orange-primary" : ""}`}
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
