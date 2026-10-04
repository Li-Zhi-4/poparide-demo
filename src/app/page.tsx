import { BookingPage } from "@/components/booking/BookingPage";
import { demoSelection, demoTrip } from "@/mocks/trip";

export default function Home() {
  return <BookingPage trip={demoTrip} initialSelection={demoSelection} />;
}
