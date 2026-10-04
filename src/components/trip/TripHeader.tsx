export function TripHeader({ from, to }: { from: string; to: string }) {
  return (
    <div className="font-bold">
      <p className="text-base text-neutral-500 uppercase">Request to Book</p>
      <h1 className="text-3xl text-neutral-900">
        {from} to {to}
      </h1>
    </div>
  );
}
