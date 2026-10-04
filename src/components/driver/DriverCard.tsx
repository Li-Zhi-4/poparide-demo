import Image from "next/image";
import type { Driver, PreferenceKind } from "@/lib/types";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ReviewList } from "./ReviewList";

const preferenceIcon: Record<PreferenceKind, IconName> = {
  "no-strong-scents": "no-strong-scents",
  "chat-ok": "chat-ok",
};

export function DriverCard({ driver }: { driver: Driver }) {
  return (
    <section
      id="about"
      aria-labelledby="about-driver"
      className="flex scroll-mt-22 flex-col gap-4"
    >
      <h2 id="about-driver" className="text-xl font-bold">
        About the Driver
      </h2>

      <div className="flex items-center gap-6">
        <div className="relative size-21 shrink-0">
          <Image
            src={driver.avatarUrl}
            alt=""
            width={84}
            height={84}
            className="size-full rounded-full object-cover"
          />
          {driver.verified && (
            <span className="absolute top-0 left-15">
              <Icon name="verified" box={24} />
              <span className="sr-only">Verified driver</span>
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xl font-bold">{driver.name}</p>
          <p className="flex items-center gap-2 text-base font-semibold">
            <Icon name="star" box={18} />
            <span>
              <span className="sr-only">Rated </span>
              {driver.rating.toFixed(1)} • {driver.ridesDriven} driven
            </span>
          </p>
        </div>
      </div>

      <ul
        className="flex gap-6 text-base font-semibold"
        aria-label="Preferences"
      >
        {driver.preferences.map((pref) => (
          <li key={pref.kind} className="flex items-center gap-2">
            <Icon name={preferenceIcon[pref.kind]} box={24} />
            {pref.label}
          </li>
        ))}
      </ul>

      <ReviewList reviews={driver.reviews} total={driver.reviewCount} />
    </section>
  );
}
