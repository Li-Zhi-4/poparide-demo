"use client";

import { selectionFromStopIds } from "@/lib/booking";
import type { Simulation } from "@/lib/simulate";
import { useTrip } from "@/hooks/useTrip";
import { Navbar } from "@/components/layout/Navbar";
import { BookingPage } from "./BookingPage";
import { TripError, TripSkeleton } from "./TripStatus";

type TripScreenProps = {
  tripId: string;
  /** Stop ids the passenger searched for. */
  from: string;
  to: string;
  simulation?: Simulation;
};

/** Loads the trip, then hands it to the page; owns the loading and error states. */
export function TripScreen({ tripId, from, to, simulation }: TripScreenProps) {
  const {
    data: trip,
    error,
    refetch,
    isFetching,
  } = useTrip(tripId, simulation);

  if (error) {
    return (
      <>
        <Navbar />
        <TripError
          message={error.message}
          onRetry={() => void refetch()}
          retrying={isFetching}
        />
      </>
    );
  }
  if (!trip) {
    return (
      <>
        <Navbar />
        <TripSkeleton />
      </>
    );
  }
  return (
    <BookingPage
      trip={trip}
      initialSelection={selectionFromStopIds(trip, from, to)}
      simulation={simulation}
    />
  );
}
