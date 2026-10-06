/** ISO 8601 timestamp with offset, e.g. "2026-10-05T18:15:00-04:00". */
export type IsoDateTime = string;

export type Stop = {
  id: string;
  city: string;
  address: string;
  departsAt: IsoDateTime;
};

/**
 * The stretch of road between two neighbouring stops. A trip with n stops has
 * n - 1 legs, and `legs[i]` runs from `stops[i]` to `stops[i + 1]`.
 */
export type Leg = {
  priceCents: number;
  seatsAvailable: number;
};

export type PreferenceKind = "no-strong-scents" | "chat-ok";

export type Preference = {
  kind: PreferenceKind;
  label: string;
};

export type Review = {
  id: string;
  author: { name: string; avatarUrl: string };
  route: string;
  date: IsoDateTime;
  rating: number;
  body: string;
};

export type Driver = {
  name: string;
  avatarUrl: string;
  verified: boolean;
  rating: number;
  ridesDriven: number;
  preferences: Preference[];
  reviewCount: number;
  /** The most recent reviews; `reviewCount` is the full total. */
  reviews: Review[];
};

export type VehicleFeatureKind =
  "back-seats" | "luggage" | "winter-tires" | "skis" | "bikes" | "pets";

export type VehicleFeature = {
  kind: VehicleFeatureKind;
  label: string;
  allowed: boolean;
};

export type Vehicle = {
  name: string;
  imageUrl: string;
  features: VehicleFeature[];
};

export type Trip = {
  id: string;
  stops: Stop[];
  legs: Leg[];
  /** Passenger seats the driver offers; each leg's `seatsAvailable` ≤ this. */
  seatsOffered: number;
  bookingFeeCentsPerSeat: number;
  description: string;
  driver: Driver;
  vehicle: Vehicle;
};

/** Indexes into `Trip.stops`. Always `pickup < dropoff`. */
export type StopSelection = {
  pickup: number;
  dropoff: number;
};

export type Quote = {
  seats: number;
  subtotalCents: number;
  bookingFeeCents: number;
  totalCents: number;
};

export type BookingRequest = {
  tripId: string;
  pickupStopId: string;
  dropoffStopId: string;
  seats: number;
  responseWindowHours: number;
  message: string;
};

/** What the API returns once a Booking Request has been sent to the driver. */
export type BookingConfirmation = {
  id: string;
  status: "pending";
  quote: Quote;
  /** When the request expires if the driver hasn't responded. */
  expiresAt: IsoDateTime;
};
