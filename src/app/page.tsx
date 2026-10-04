import { BookingPage } from "@/components/booking/BookingPage";
import { Navbar } from "@/components/layout/Navbar";
import { demoSelection, demoTrip } from "@/mocks/trip";

export default function Home() {
  return (
    <>
      <Navbar />
      <BookingPage trip={demoTrip} initialSelection={demoSelection} />
    </>
  );
}
