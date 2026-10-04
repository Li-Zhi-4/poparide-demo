import Image from "next/image";

export function RouteMap() {
  return (
    <Image
      src="/images/route-map.png"
      alt="Map of the route from London to Toronto"
      width={1084}
      height={431}
      sizes="(min-width: 58rem) 542px, 100vw"
      priority
      className="aspect-3012/1198 w-full rounded-card border border-neutral-200 object-cover"
    />
  );
}
