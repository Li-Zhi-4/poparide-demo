import { Button } from "@/components/ui/Button";

const block = "motion-safe:animate-pulse rounded-control bg-neutral-200";

/** Placeholder in the shape of the page while the trip loads. */
export function TripSkeleton() {
  return (
    <main
      aria-busy
      className="mx-auto max-w-mobile pt-6 desktop:grid desktop:max-w-page desktop:grid-cols-[minmax(0,var(--container-main))_var(--container-sidebar)] desktop:justify-between desktop:pt-16"
    >
      <p role="status" className="sr-only">
        Loading trip…
      </p>
      <div aria-hidden className="flex flex-col gap-3 desktop:gap-6">
        <div className="flex flex-col gap-2 px-4 desktop:px-0">
          <div className={`h-4 w-28 desktop:h-5 desktop:w-36 ${block}`} />
          <div className={`h-8 w-64 desktop:h-10 desktop:w-80 ${block}`} />
        </div>
        <div
          className={`aspect-3012/1198 w-full rounded-none desktop:rounded-card ${block}`}
        />
        <div className="flex flex-col">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="flex h-25 items-center gap-3 px-4">
              <div className={`size-3 rounded-full ${block}`} />
              <div className="flex flex-1 flex-col gap-2">
                <div className={`h-6 w-32 ${block}`} />
                <div className={`h-4 w-56 max-w-full ${block}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        aria-hidden
        className="flex h-95 flex-col gap-6 rounded-card border border-blue-border p-5 max-desktop:hidden"
      >
        <div className={`h-6 w-48 ${block}`} />
        <div className={`h-9 w-full ${block}`} />
        <div className={`h-24 w-full ${block}`} />
        <div className={`mt-auto h-9 w-full ${block}`} />
      </div>
    </main>
  );
}

export function TripError({
  message,
  onRetry,
  retrying,
}: {
  message: string;
  onRetry: () => void;
  retrying: boolean;
}) {
  return (
    <main className="mx-auto flex max-w-md flex-col items-center gap-4 pt-32 text-center">
      <div role="alert" className="flex flex-col gap-2">
        <h1 className="text-xl font-bold">We couldn’t load this trip</h1>
        <p className="text-base text-blue-secondary">{message}</p>
      </div>
      <Button onClick={onRetry} disabled={retrying}>
        {retrying ? "Trying again…" : "Try again"}
      </Button>
    </main>
  );
}
