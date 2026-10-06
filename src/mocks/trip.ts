import type { StopSelection, Trip } from "@/lib/types";

/** Placeholder trip matching the Figma frame. Content is illustrative only. */
export const demoTrip: Trip = {
  id: "london-toronto-oct-5",
  stops: [
    {
      id: "london",
      city: "London",
      address: "22 Pinebush Rd, N1R 8K5",
      departsAt: "2026-10-05T17:00:00-04:00",
    },
    {
      id: "cambridge",
      city: "Cambridge",
      address: "22 Pinebush Rd, N1R 8K5",
      departsAt: "2026-10-05T18:15:00-04:00",
    },
    {
      id: "milton",
      city: "Milton",
      address: "91 James Snow Pkwy N, L9T 0R3",
      departsAt: "2026-10-05T19:00:00-04:00",
    },
    {
      id: "mississauga",
      city: "Mississauga",
      address: "100 City Centre Dr, L5B 2C9",
      departsAt: "2026-10-05T19:45:00-04:00",
    },
    {
      id: "toronto",
      city: "Toronto",
      address: "65 Front St W, M5J 1E6",
      departsAt: "2026-10-05T20:15:00-04:00",
    },
  ],
  legs: [
    { priceCents: 1000, seatsAvailable: 3 }, // London → Cambridge
    { priceCents: 1200, seatsAvailable: 3 }, // Cambridge → Milton
    { priceCents: 500, seatsAvailable: 2 }, // Milton → Mississauga
    { priceCents: 600, seatsAvailable: 3 }, // Mississauga → Toronto
  ],
  seatsOffered: 3,
  bookingFeeCentsPerSeat: 294,
  description:
    "The Millennium Falcon is the ship that made the Kessel Run in less than twelve parsecs.",
  driver: {
    name: "Han Solo",
    avatarUrl: "/images/avatars/han-solo.png",
    verified: true,
    rating: 2.4,
    ridesDriven: 23,
    preferences: [
      { kind: "no-strong-scents", label: "No strong scents" },
      { kind: "chat-ok", label: "I don’t mind a chat" },
    ],
    reviewCount: 23,
    reviews: [
      {
        id: "review-1",
        author: {
          name: "Lando Calrissian",
          avatarUrl: "/images/avatars/lando-calrissian.png",
        },
        route: "London to Guelph",
        date: "2025-09-21T12:00:00-04:00",
        rating: 4.1,
        body: "The fastest hunk of junk in the galaxy!",
      },
      {
        id: "review-2",
        author: {
          name: "Luke Skywalker",
          avatarUrl: "/images/avatars/luke-skywalker.png",
        },
        route: "London to Guelph",
        date: "2025-09-21T12:00:00-04:00",
        rating: 1.4,
        body: "What a piece of junk!",
      },
      {
        id: "review-3",
        author: {
          name: "Princess Leia",
          avatarUrl: "/images/avatars/princess-leia.png",
        },
        route: "London to Guelph",
        date: "2025-09-21T12:00:00-04:00",
        rating: 3.4,
        body: "You scruffy-looking nerf herder!",
      },
    ],
  },
  vehicle: {
    name: "Millennium Falcon",
    imageUrl: "/images/vehicle.png",
    features: [
      { kind: "back-seats", label: "Max 2 people in the back", allowed: true },
      { kind: "luggage", label: "Small luggage ok", allowed: true },
      { kind: "winter-tires", label: "No winter tires", allowed: false },
      { kind: "skis", label: "No skis / snowboards", allowed: false },
      { kind: "bikes", label: "No bikes", allowed: false },
      { kind: "pets", label: "Pets ok", allowed: true },
    ],
  },
};

/** Cambridge → Milton, as searched. */
export const demoSelection: StopSelection = { pickup: 1, dropoff: 2 };

/** The same search as stop ids, the way a search results link would pass it. */
export const demoSearch = {
  tripId: demoTrip.id,
  from: "cambridge",
  to: "milton",
};
