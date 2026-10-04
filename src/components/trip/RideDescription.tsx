export function RideDescription({ description }: { description: string }) {
  return (
    <section className="flex flex-col gap-2" aria-labelledby="ride-description">
      <h2 id="ride-description" className="text-xl font-bold">
        Ride Description
      </h2>
      <p className="text-base whitespace-pre-line text-blue-secondary">
        {description}
      </p>
    </section>
  );
}
