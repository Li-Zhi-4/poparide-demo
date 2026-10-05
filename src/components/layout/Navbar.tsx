import Image from "next/image";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";

export type NavbarSummary = {
  route: string;
  /** Formatted total, or null when no seats are left for the chosen stops. */
  total: string | null;
  onReserve: () => void;
  /** Overrides "Reserve", e.g. while the request is sending. */
  reserveLabel?: string;
  reserveDisabled?: boolean;
};

type NavbarProps = {
  summary?: NavbarSummary;
  /** Show the summary once the price card's own button has scrolled away. */
  showSummary?: boolean;
  /** Section tabs that take the logo's place once the page's own tabs scroll away. */
  tabs?: ReactNode;
  showTabs?: boolean;
};

// Hidden layers are inert as well as transparent, so they're out of the tab
// order and away from screen readers.
function layerClass(visible: boolean) {
  return `transition duration-200 motion-reduce:transition-none ${visible ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"}`;
}

export function Navbar({
  summary,
  showSummary = false,
  tabs,
  showTabs = false,
}: NavbarProps) {
  const tabsVisible = Boolean(tabs) && showTabs;

  return (
    <header className="sticky top-0 z-10 h-16 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-full max-w-page items-center justify-between">
        {/* Logo and tabs share one grid cell, so swapping them doesn't shift anything. */}
        <div className="grid h-full items-center">
          <div
            inert={tabsVisible}
            data-testid="navbar-logo"
            className={`col-start-1 row-start-1 ${layerClass(!tabsVisible)}`}
          >
            <Image
              src="/images/poparide-logo.png"
              alt="Poparide"
              width={151}
              height={46}
              priority
            />
          </div>
          {tabs && (
            <div
              inert={!tabsVisible}
              data-testid="navbar-tabs"
              className={`col-start-1 row-start-1 h-full ${layerClass(tabsVisible)}`}
            >
              {tabs}
            </div>
          )}
        </div>

        {summary && (
          <div
            inert={!showSummary}
            data-testid="navbar-summary"
            className={`flex items-center gap-4 ${layerClass(showSummary)}`}
          >
            <div className="flex flex-col">
              <p className="text-base font-bold">{summary.route}</p>
              <p className="text-sm text-blue-secondary">
                {summary.total ? `${summary.total} total` : "No seats left"}
              </p>
            </div>
            <Button
              className="h-9"
              disabled={!summary.total || summary.reserveDisabled}
              onClick={summary.onReserve}
            >
              {summary.reserveLabel ?? "Reserve"}
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
