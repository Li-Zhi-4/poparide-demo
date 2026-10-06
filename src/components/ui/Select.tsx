import type { ComponentProps } from "react";
import { Icon } from "./Icon";

type SelectProps = ComponentProps<"select">;

/** A native select styled like the Figma field, so keyboard and screen reader behaviour come for free. */
export function Select({ className = "", children, ...props }: SelectProps) {
  return (
    <div className={`relative shrink-0 ${className}`}>
      <select
        className="h-13.5 w-full appearance-none rounded-control border border-blue-border bg-blue-surface py-2 pr-9 pl-4 text-sm text-blue-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-primary"
        {...props}
      >
        {children}
      </select>
      <Icon
        name="chevron-down"
        box={18}
        className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2"
      />
    </div>
  );
}
