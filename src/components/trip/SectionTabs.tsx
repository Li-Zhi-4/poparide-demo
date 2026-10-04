export const sections = [
  { id: "overview", label: "Overview" },
  { id: "vehicle", label: "Vehicle" },
  { id: "about", label: "About" },
  { id: "policies", label: "Policies" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

/** In-page links styled as the Figma tabs. */
export function SectionTabs({ active = "overview" }: { active?: SectionId }) {
  return (
    <nav aria-label="Trip sections">
      <ul className="flex h-9 gap-2 border-b border-neutral-200">
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
