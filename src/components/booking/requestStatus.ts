/** Where the passenger's Booking Request is, as far as the page is concerned. */
export type RequestStatus = "idle" | "sending" | "sent";

/** Button text for each status; `idleLabel` differs between card and navbar. */
export function requestButtonLabel(status: RequestStatus, idleLabel: string) {
  if (status === "sending") return "Sending…";
  if (status === "sent") return "Request sent";
  return idleLabel;
}
