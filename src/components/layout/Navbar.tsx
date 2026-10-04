import Image from "next/image";
import { Button } from "@/components/ui/Button";

export type NavbarSummary = {
  route: string;
  /** Formatted total, or null when no seats are left for the chosen stops. */
  total: string | null;
  onReserve: () => void;
};

type NavbarProps = {
  summary?: NavbarSummary;
  /** Show the summary once the price card's own button has scrolled away. */
  showSummary?: boolean;
};

export function Navbar({ summary, showSummary = false }: NavbarProps) {
  return (
    <header className="sticky top-0 z-10 h-16 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-full max-w-page items-center justify-between">
        <Image
          src="/images/poparide-logo.png"
          alt="Poparide"
          width={151}
          height={46}
          priority
        />
        {summary && (
          <div
            // inert keeps the hidden summary out of the tab order and away
            // from screen readers, not just invisible.
            inert={!showSummary}
            data-testid="navbar-summary"
            className={`flex items-center gap-4 transition duration-200 motion-reduce:transition-none ${showSummary ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"}`}
          >
            <div className="flex flex-col">
              <p className="text-base font-bold">{summary.route}</p>
              <p className="text-sm text-blue-secondary">
                {summary.total ? `${summary.total} total` : "No seats left"}
              </p>
            </div>
            <Button
              className="h-9"
              disabled={!summary.total}
              onClick={summary.onReserve}
            >
              Reserve
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
