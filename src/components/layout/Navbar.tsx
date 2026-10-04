import Image from "next/image";

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 h-16 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-full max-w-page items-center justify-between">
        <Image
          src="/images/poparide-logo.png"
          alt="Poparide"
          width={151}
          height={46}
          priority
        />
      </div>
    </header>
  );
}
