/**
 * Demo-only switches, set with `?simulate=` on the page URL, so reviewers can
 * see the loading and error states without breaking anything.
 */
export const SIMULATIONS = ["slow", "trip-error", "booking-error"] as const;

export type Simulation = (typeof SIMULATIONS)[number];

export function parseSimulation(value: unknown): Simulation | undefined {
  return SIMULATIONS.find((s) => s === value);
}
