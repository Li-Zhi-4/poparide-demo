import type { Simulation } from "@/lib/simulate";

/** A short pause so loading states are visible, as with a real backend. */
export function simulateLatency(
  simulation: Simulation | undefined,
  ms: number,
) {
  const delay = simulation === "slow" ? 3000 : ms;
  return new Promise((resolve) => setTimeout(resolve, delay));
}
