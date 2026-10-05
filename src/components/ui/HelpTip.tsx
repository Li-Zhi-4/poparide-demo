import { useId } from "react";
import { Icon } from "./Icon";

type HelpTipProps = {
  label: string;
  children: string;
  /**
   * Where the tooltip sits from the desktop breakpoint up. "end" lines its
   * right edge up with the icon, for icons at the right edge of the page.
   */
  desktopAlign?: "center" | "end";
};

/**
 * The (?) icon from the design. Shows its explanation on hover and on
 * keyboard focus, and screen readers get the same text via aria-describedby.
 * The tooltip takes no space until shown, so it can't widen the page.
 */
export function HelpTip({
  label,
  children,
  desktopAlign = "center",
}: HelpTipProps) {
  const id = useId();
  return (
    <span className="group relative inline-flex">
      <button
        type="button"
        aria-label={label}
        aria-describedby={id}
        className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-primary"
      >
        <Icon name="help" box={18} />
      </button>
      <span
        id={id}
        role="tooltip"
        className={`absolute bottom-full left-1/2 z-20 mb-2 hidden w-60 -translate-x-1/2 rounded-control bg-blue-primary px-3 py-2 text-sm font-normal text-white group-focus-within:block group-hover:block ${desktopAlign === "end" ? "desktop:right-0 desktop:left-auto desktop:translate-x-0" : ""}`}
      >
        {children}
      </span>
    </span>
  );
}
