"use client";

import { formatDeparture } from "@/lib/format";
import type { StopSelection, Trip } from "@/lib/types";
import { DriverCard } from "@/components/driver/DriverCard";
import { Policies } from "@/components/trip/Policies";
import { RideDescription } from "@/components/trip/RideDescription";
import { RouteMap } from "@/components/trip/RouteMap";
import { SectionTabs } from "@/components/trip/SectionTabs";
import { StopTimeline } from "@/components/trip/StopTimeline";
import { TripHeader } from "@/components/trip/TripHeader";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { BookingOptions } from "./BookingOptions";
import { MessageField } from "./MessageField";
import { PriceCard } from "./PriceCard";
import { useBookingForm } from "./useBookingForm";

type BookingPageProps = {
  trip: Trip;
  initialSelection: StopSelection;
};

export function BookingPage({ trip, initialSelection }: BookingPageProps) {
  const form = useBookingForm(trip, initialSelection);
  const pickup = trip.stops[form.selection.pickup];
  const dropoff = trip.stops[form.selection.dropoff];
  if (!pickup || !dropoff) throw new Error("Selection is outside the trip");

  return (
    <main className="mx-auto max-w-page pb-16">
      {/* The price card is sticky within this grid, so it stops at About the Driver. */}
      <div className="grid grid-cols-[minmax(0,var(--container-main))_var(--container-sidebar)] justify-between pt-16">
        <div className="flex flex-col gap-6">
          <TripHeader from={pickup.city} to={dropoff.city} />
          <div className="flex flex-col gap-2">
            <RouteMap />
            <SectionTabs />
          </div>
          <div id="overview" className="flex scroll-mt-22 flex-col gap-4">
            <StopTimeline
              stops={trip.stops}
              legs={trip.legs}
              seatsOffered={trip.seatsOffered}
              selection={form.selection}
              seats={form.seats}
              onSelectionChange={form.setSelection}
            />
            <BookingOptions
              seats={form.seats}
              maxSeats={form.maxSeats}
              onSeatsChange={form.setSeats}
              responseWindowHours={form.responseWindowHours}
              onResponseWindowChange={form.setResponseWindowHours}
            />
            <RideDescription description={trip.description} />
          </div>
        </div>

        <aside>
          <div className="sticky top-22">
            <PriceCard
              from={pickup.city}
              to={dropoff.city}
              departure={formatDeparture(pickup.departsAt)}
              quote={form.quote}
              onRequest={() => {}}
            />
          </div>
        </aside>
      </div>

      <div className="flex flex-col gap-6 pt-6">
        <hr className="border-neutral-200" />
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-16">
            <div className="min-w-0 flex-1">
              <DriverCard driver={trip.driver} />
            </div>
            <VehicleCard vehicle={trip.vehicle} />
          </div>
          <MessageField
            driverName={trip.driver.name}
            value={form.message}
            onChange={form.setMessage}
          />
        </div>
        <hr className="border-neutral-200" />
        <Policies
          driverName={trip.driver.name}
          responseWindowHours={form.responseWindowHours}
        />
      </div>
    </main>
  );
}
