import Image from "next/image";
import type { Vehicle, VehicleFeatureKind } from "@/lib/types";
import { Icon, type IconName } from "@/components/ui/Icon";

const featureIcon: Record<VehicleFeatureKind, IconName> = {
  "back-seats": "back-seats",
  luggage: "luggage",
  "winter-tires": "no-winter-tires",
  skis: "no-winter-tires",
  bikes: "no-bikes",
  pets: "pets",
};

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <section
      id="vehicle"
      aria-labelledby="vehicle-name"
      className="w-sidebar shrink-0 scroll-mt-22 overflow-hidden rounded-card border border-blue-border bg-white"
    >
      {/* Figma crops the square product shot to its top two-thirds. */}
      <Image
        src={vehicle.imageUrl}
        alt={vehicle.name}
        width={378}
        height={378}
        sizes="322px"
        className="aspect-3/2 w-full border border-neutral-200 object-cover object-top"
      />
      <div className="flex flex-col gap-2 p-5">
        <h2 id="vehicle-name" className="text-xl font-bold">
          {vehicle.name}
        </h2>
        <ul className="flex flex-col gap-1 text-base font-semibold">
          {vehicle.features.map((feature) => (
            <li
              key={feature.kind}
              className={`flex items-center gap-2 ${feature.allowed ? "" : "text-neutral-400"}`}
            >
              <Icon name={featureIcon[feature.kind]} box={24} />
              {feature.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
