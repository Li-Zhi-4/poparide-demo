import type { ReactNode } from "react";

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-control bg-orange-primary px-2 py-0.5 text-xs font-medium text-neutral-50">
      {children}
    </span>
  );
}
