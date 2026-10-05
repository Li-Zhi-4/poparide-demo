"use client";

import { useId } from "react";
import { formatMoney } from "@/lib/format";
import type { BookingConfirmation } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";

type BookingResultDialogProps = {
  open: boolean;
  onClose: () => void;
  result:
    | {
        kind: "sent";
        confirmation: BookingConfirmation;
        route: string;
        departure: string;
        driverName: string;
        responseWindowHours: number;
      }
    | { kind: "error"; message: string; onRetry: () => void; retrying: boolean }
    | null;
};

export function BookingResultDialog({
  open,
  onClose,
  result,
}: BookingResultDialogProps) {
  const titleId = useId();

  return (
    <Dialog
      open={open && result !== null}
      onClose={onClose}
      labelledBy={titleId}
    >
      {result?.kind === "sent" && (
        <div className="flex flex-col gap-4">
          <h2 id={titleId} className="text-xl font-bold">
            Request sent to {result.driverName}
          </h2>
          <p className="text-base">
            {result.driverName} has {result.responseWindowHours} hours to
            respond. You won’t be charged until your request is approved.
          </p>
          <dl className="flex flex-col gap-1 rounded-control bg-blue-surface p-4 text-base">
            <div className="flex justify-between gap-4">
              <dt className="text-blue-secondary">Trip</dt>
              <dd className="text-right font-semibold">{result.route}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-blue-secondary">Departs</dt>
              <dd className="text-right font-semibold">{result.departure}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-blue-secondary">Seats</dt>
              <dd className="text-right font-semibold">
                {result.confirmation.quote.seats}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-blue-secondary">Total</dt>
              <dd className="text-right font-semibold">
                {formatMoney(result.confirmation.quote.totalCents, {
                  withCurrency: true,
                })}
              </dd>
            </div>
          </dl>
          <Button fullWidth onClick={onClose} autoFocus>
            Done
          </Button>
        </div>
      )}

      {result?.kind === "error" && (
        <div className="flex flex-col gap-4">
          <h2 id={titleId} className="text-xl font-bold">
            Your request wasn’t sent
          </h2>
          <p className="text-base">{result.message}</p>
          <div className="flex gap-2">
            <Button
              fullWidth
              onClick={result.onRetry}
              disabled={result.retrying}
              autoFocus
            >
              {result.retrying ? "Sending…" : "Try again"}
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-control border border-blue-border px-4 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-primary"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </Dialog>
  );
}
