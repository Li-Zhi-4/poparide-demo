import { Navbar } from "@/components/layout/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="mx-auto grid max-w-page grid-cols-[minmax(0,var(--container-main))_var(--container-sidebar)] justify-between pt-16">
        <div>
          <p className="text-base font-bold text-neutral-500 uppercase">
            Request to Book
          </p>
          <h1 className="text-3xl font-bold text-neutral-900">
            Cambridge to Milton
          </h1>
        </div>
      </main>
    </>
  );
}
