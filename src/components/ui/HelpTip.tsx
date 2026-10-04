import { useId } from "react";
import { Icon } from "./Icon";

/**
 * The (?) icon from the design. Shows its explanation on hover and on
 * keyboard focus, and screen readers get the same text via aria-describedby.
 */
export function HelpTip({
  label,
  children,
}: {
  label: string;
  children: string;
}) {
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
        className="invisible absolute bottom-full left-1/2 z-20 mb-2 w-60 -translate-x-1/2 rounded-control bg-blue-primary px-3 py-2 text-sm font-normal text-white opacity-0 transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100"
      >
        {children}
      </span>
    </span>
  );
}
