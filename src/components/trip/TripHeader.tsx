export function TripHeader({ from, to }: { from: string; to: string }) {
  return (
    <div className="px-4 font-bold desktop:px-0">
      <p className="text-xs text-neutral-500 uppercase desktop:text-base">
        Request to Book
      </p>
      <h1 className="text-2xl text-neutral-900 desktop:text-3xl">
        {from} to {to}
      </h1>
    </div>
  );
}
