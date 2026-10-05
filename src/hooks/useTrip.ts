"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTrip, type ApiError } from "@/lib/api";
import type { Simulation } from "@/lib/simulate";
import type { Trip } from "@/lib/types";

export function useTrip(id: string, simulation?: Simulation) {
  return useQuery<Trip, ApiError>({
    queryKey: ["trip", id, simulation],
    queryFn: () => fetchTrip(id, simulation),
    // Retry a server hiccup once; a 404 won't fix itself.
    retry: (failureCount, error) => error.status >= 500 && failureCount < 1,
  });
}
