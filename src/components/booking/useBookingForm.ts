"use client";

import { useState } from "react";
import { clampSeats, quote, seatsAvailable } from "@/lib/booking";
import type { StopSelection, Trip } from "@/lib/types";

/** All of the passenger's choices on the page, plus the price they produce. */
export function useBookingForm(trip: Trip, initialSelection: StopSelection) {
  const [selection, setSelectionState] = useState(initialSelection);
  const [seats, setSeats] = useState(1);
  const [responseWindowHours, setResponseWindowHours] = useState(24);
  const [message, setMessage] = useState("");

  const maxSeats = seatsAvailable(trip, selection);

  function setSelection(next: StopSelection) {
    setSelectionState(next);
    // Keep the seat count valid when a fuller leg joins the ride.
    setSeats((current) => clampSeats(current, seatsAvailable(trip, next)));
  }

  return {
    selection,
    setSelection,
    seats,
    setSeats,
    maxSeats,
    responseWindowHours,
    setResponseWindowHours,
    message,
    setMessage,
    quote: maxSeats > 0 ? quote(trip, selection, seats) : null,
  };
}
