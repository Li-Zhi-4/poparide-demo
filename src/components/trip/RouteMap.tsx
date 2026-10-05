import Image from "next/image";

export function RouteMap() {
  return (
    <Image
      src="/images/route-map.png"
      alt="Map of the route from London to Toronto"
      width={1084}
      height={431}
      sizes="(min-width: 60rem) 542px, min(100vw, 640px)"
      priority
      // Edge to edge on mobile, a bordered card on desktop.
      className="aspect-3012/1198 w-full object-cover desktop:rounded-card desktop:border desktop:border-neutral-200"
    />
  );
}
