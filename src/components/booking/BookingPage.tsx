"use client";

import { useState } from "react";
import { formatDeparture, formatMoney } from "@/lib/format";
import type { Simulation } from "@/lib/simulate";
import type {
  BookingConfirmation,
  BookingRequest,
  StopSelection,
  Trip,
} from "@/lib/types";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useRequestBooking } from "@/hooks/useRequestBooking";
import { useScrolledPast } from "@/hooks/useScrolledPast";
import { DriverCard } from "@/components/driver/DriverCard";
import { Navbar } from "@/components/layout/Navbar";
import { Policies } from "@/components/trip/Policies";
import { RideDescription } from "@/components/trip/RideDescription";
import { RouteMap } from "@/components/trip/RouteMap";
import { SectionTabs, sectionIds } from "@/components/trip/SectionTabs";
import { StopTimeline } from "@/components/trip/StopTimeline";
import { TripHeader } from "@/components/trip/TripHeader";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { BookingOptions } from "./BookingOptions";
import { BookingResultDialog } from "./BookingResultDialog";
import { BookingSheet } from "./BookingSheet";
import { DemoLinks } from "./DemoLinks";
import { MessageField } from "./MessageField";
import { PriceCard } from "./PriceCard";
import { requestButtonLabel, type RequestStatus } from "./requestStatus";
import { useBookingForm } from "./useBookingForm";

type BookingPageProps = {
  trip: Trip;
  initialSelection: StopSelection;
  simulation?: Simulation;
};

type Outcome =
  | { kind: "sent"; confirmation: BookingConfirmation }
  | { kind: "error"; message: string };

export function BookingPage({
  trip,
  initialSelection,
  simulation,
}: BookingPageProps) {
  const form = useBookingForm(trip, initialSelection);
  const booking = useRequestBooking(simulation);
  // What the result dialog shows; null while it's closed.
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  // 64px = the sticky navbar's height. Once the page's tabs slide under it,
  // the navbar shows the tabs; once the price card's button does, the summary.
  const [tabsRef, tabsHidden] = useScrolledPast<HTMLElement>(64);
  const [requestButtonRef, requestButtonHidden] =
    useScrolledPast<HTMLButtonElement>(64);
  const [activeSection, selectSection] = useActiveSection(sectionIds, 64);

  const pickup = trip.stops[form.selection.pickup];
  const dropoff = trip.stops[form.selection.dropoff];
  if (!pickup || !dropoff) throw new Error("Selection is outside the trip");

  const pickupStopId = pickup.id;
  const dropoffStopId = dropoff.id;
  const route = `${pickup.city} to ${dropoff.city}`;
  const departure = formatDeparture(pickup.departsAt);
  const requestStatus: RequestStatus = booking.isPending
    ? "sending"
    : booking.isSuccess
      ? "sent"
      : "idle";

  function send(request: BookingRequest) {
    booking.mutate(request, {
      onSuccess: (confirmation) => setOutcome({ kind: "sent", confirmation }),
      onError: (error) => setOutcome({ kind: "error", message: error.message }),
    });
  }

  function requestBooking() {
    if (!form.quote || requestStatus !== "idle") return;
    send({
      tripId: trip.id,
      pickupStopId,
      dropoffStopId,
      seats: form.seats,
      responseWindowHours: form.responseWindowHours,
      message: form.message,
    });
  }

  // Changing anything after a request has been sent starts a new request.
  function edit<T>(update: (value: T) => void) {
    return (value: T) => {
      update(value);
      if (booking.isSuccess) booking.reset();
    };
  }

  const total = form.quote
    ? formatMoney(form.quote.totalCents, { withCurrency: true })
    : null;

  // The desktop sidebar card and the mobile sheet show the same card; only
  // one is ever displayed. The desktop one is watched for the navbar summary.
  const priceCard = (variant: "card" | "sheet") => (
    <PriceCard
      variant={variant}
      from={pickup.city}
      to={dropoff.city}
      departure={departure}
      quote={form.quote}
      onRequest={requestBooking}
      requestStatus={requestStatus}
      requestButtonRef={variant === "card" ? requestButtonRef : undefined}
    />
  );

  return (
    <>
      <Navbar
        tabs={
          <SectionTabs
            variant="bar"
            active={activeSection}
            onNavigate={selectSection}
          />
        }
        showTabs={tabsHidden}
        showSummary={requestButtonHidden}
        summary={{
          route,
          total,
          onRequest: requestBooking,
          requestLabel: requestButtonLabel(requestStatus, "Request"),
          requestDisabled: requestStatus !== "idle",
        }}
      />
      <BookingResultDialog
        open={outcome !== null}
        onClose={() => {
          setOutcome(null);
          // Clear a failed attempt so the buttons are ready to try again.
          if (booking.isError) booking.reset();
        }}
        result={
          outcome?.kind === "sent"
            ? {
                kind: "sent",
                confirmation: outcome.confirmation,
                route,
                departure,
                driverName: trip.driver.name,
                responseWindowHours: form.responseWindowHours,
              }
            : outcome?.kind === "error"
              ? {
                  kind: "error",
                  message: outcome.message,
                  onRetry: () => booking.variables && send(booking.variables),
                  retrying: booking.isPending,
                }
              : null
        }
      />
      {/*
       * Mobile-first: one column capped at 640px, with the map, stop rows,
       * tabs and dividers running edge to edge and everything else inset by
       * a 16px gutter. From the desktop breakpoint it becomes the Figma row
       * with the price card in a sticky sidebar.
       */}
      <main className="mx-auto max-w-mobile pb-32 desktop:max-w-page desktop:pb-16">
        {/* The price card is sticky within this grid, so it stops at About the Driver. */}
        <div className="pt-6 desktop:grid desktop:grid-cols-[minmax(0,var(--container-main))_var(--container-sidebar)] desktop:justify-between desktop:pt-16">
          <div className="flex flex-col gap-3 desktop:gap-6">
            <TripHeader from={pickup.city} to={dropoff.city} />
            <div className="flex flex-col gap-2">
              <RouteMap />
              <SectionTabs
                ref={tabsRef}
                active={activeSection}
                onNavigate={selectSection}
              />
            </div>
            <div id="overview" className="flex scroll-mt-22 flex-col gap-4">
              <StopTimeline
                stops={trip.stops}
                legs={trip.legs}
                seatsOffered={trip.seatsOffered}
                selection={form.selection}
                seats={form.seats}
                onSelectionChange={edit(form.setSelection)}
              />
              <div className={`flex flex-col gap-4 ${gutter}`}>
                <BookingOptions
                  seats={form.seats}
                  maxSeats={form.maxSeats}
                  onSeatsChange={edit(form.setSeats)}
                  responseWindowHours={form.responseWindowHours}
                  onResponseWindowChange={edit(form.setResponseWindowHours)}
                />
                <RideDescription description={trip.description} />
              </div>
            </div>
          </div>

          <aside className="max-desktop:hidden">
            <div className="sticky top-22 flex flex-col gap-4">
              {priceCard("card")}
              <DemoLinks />
            </div>
          </aside>
        </div>

        <div className="flex flex-col gap-6 pt-6">
          <hr className="border-neutral-200" />
          <div className={`flex flex-col gap-6 desktop:gap-4 ${gutter}`}>
            <div className="flex flex-col gap-6 desktop:flex-row desktop:items-start desktop:gap-16">
              <div className="min-w-0 flex-1">
                <DriverCard driver={trip.driver} />
              </div>
              <VehicleCard vehicle={trip.vehicle} />
            </div>
            <MessageField
              driverName={trip.driver.name}
              value={form.message}
              onChange={edit(form.setMessage)}
            />
          </div>
          <hr className="border-neutral-200" />
          <div className={gutter}>
            <Policies
              driverName={trip.driver.name}
              responseWindowHours={form.responseWindowHours}
            />
          </div>
        </div>
      </main>

      <BookingSheet
        route={route}
        total={total}
        onRequest={requestBooking}
        requestLabel={requestButtonLabel(requestStatus, "Request")}
        requestDisabled={requestStatus !== "idle"}
        details={
          <div className="flex flex-col gap-4">
            {priceCard("sheet")}
            <DemoLinks />
          </div>
        }
      />
    </>
  );
}

/** Mobile inset; desktop content already sits inside the 928px page. */
const gutter = "px-4 desktop:px-0";
