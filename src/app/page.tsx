import { TripScreen } from "@/components/booking/TripScreen";
import { parseSimulation } from "@/lib/simulate";
import { demoSearch } from "@/mocks/trip";

export default async function Home({ searchParams }: PageProps<"/">) {
  // ?simulate=slow | trip-error | booking-error shows the other states.
  const { simulate } = await searchParams;
  return (
    <TripScreen
      tripId={demoSearch.tripId}
      from={demoSearch.from}
      to={demoSearch.to}
      simulation={parseSimulation(simulate)}
    />
  );
}
