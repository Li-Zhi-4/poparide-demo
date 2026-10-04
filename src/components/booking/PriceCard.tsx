"use client";

import { useId, useState } from "react";
import { formatMoney } from "@/lib/format";
import type { Quote } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { HelpTip } from "@/components/ui/HelpTip";

type PriceCardProps = {
  from: string;
  to: string;
  departure: string;
  /** Null when no seats are available for the chosen stops. */
  quote: Quote | null;
  onRequest: () => void;
};

export function PriceCard({
  from,
  to,
  departure,
  quote,
  onRequest,
}: PriceCardProps) {
  return (
    <section
      aria-labelledby="price-card-title"
      className="flex flex-col gap-6 rounded-card border border-blue-border bg-white p-5"
    >
      <div className="flex flex-col gap-2">
        <h2 id="price-card-title" className="text-xl font-bold">
          {from} to {to}
        </h2>
        <p className="text-base text-blue-secondary">{departure}</p>
      </div>

      <PromoCode />

      <hr className="border-neutral-200" />

      {quote ? (
        <dl className="flex flex-col gap-2 text-lg text-blue-secondary">
          <div className="flex justify-between">
            <dt>
              {quote.seats} {quote.seats === 1 ? "seat" : "seats"}
            </dt>
            <dd>{formatMoney(quote.subtotalCents)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="flex items-center gap-1">
              Booking fee
              <HelpTip label="About the booking fee">
                Charged per seat. Refunded in full if your request is declined,
                withdrawn or expires.
              </HelpTip>
            </dt>
            <dd>{formatMoney(quote.bookingFeeCents)}</dd>
          </div>
          <div className="flex justify-between font-bold">
            <dt>Total</dt>
            <dd>{formatMoney(quote.totalCents, { withCurrency: true })}</dd>
          </div>
        </dl>
      ) : (
        <p className="text-lg text-blue-secondary">
          No seats are left for these stops. Try a different pick-up or
          drop-off.
        </p>
      )}

      <hr className="border-neutral-200" />

      <Button fullWidth disabled={!quote} onClick={onRequest}>
        Request to Book
      </Button>
    </section>
  );
}

function PromoCode() {
  const inputId = useId();
  const messageId = useId();
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  return (
    <form
      className="flex flex-col gap-1"
      onSubmit={(e) => {
        e.preventDefault();
        setMessage(`“${code.trim()}” isn’t a valid promo code.`);
      }}
    >
      <div className="flex h-9 items-center justify-between rounded-control border border-blue-border bg-blue-surface px-3 py-1 text-sm focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-orange-primary">
        <label htmlFor={inputId} className="sr-only">
          Promo code
        </label>
        <input
          id={inputId}
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setMessage(null);
          }}
          placeholder="Enter promo code (optional)"
          aria-describedby={message ? messageId : undefined}
          className="min-w-0 flex-1 bg-transparent placeholder:text-blue-secondary focus:outline-none"
        />
        <button
          type="submit"
          disabled={!code.trim()}
          className="font-bold disabled:cursor-default"
        >
          Apply
        </button>
      </div>
      {message && (
        <p id={messageId} role="status" className="text-sm text-blue-secondary">
          {message}
        </p>
      )}
    </form>
  );
}
