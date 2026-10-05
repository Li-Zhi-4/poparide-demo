"use client";

import { useMutation } from "@tanstack/react-query";
import { createBooking, type ApiError } from "@/lib/api";
import type { Simulation } from "@/lib/simulate";
import type { BookingConfirmation, BookingRequest } from "@/lib/types";

export function useRequestBooking(simulation?: Simulation) {
  return useMutation<BookingConfirmation, ApiError, BookingRequest>({
    mutationFn: (request) => createBooking(request, simulation),
  });
}
