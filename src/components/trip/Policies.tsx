export function Policies({
  driverName,
  responseWindowHours,
}: {
  driverName: string;
  responseWindowHours: number;
}) {
  return (
    <section
      id="policies"
      aria-label="Policies"
      className="flex scroll-mt-22 gap-16 text-base"
    >
      <div className="flex flex-1 flex-col gap-4">
        <h2 className="text-xl font-bold">Cancellation Policy</h2>
        <div className="flex flex-col gap-2">
          <p>
            <strong>Full refund</strong> if your Booking Request{" "}
            <strong>
              is declined by the driver, if you withdraw it, or it expires.
            </strong>
          </p>
          <p>
            If your Booking Request is approved,{" "}
            <strong>100% refund (less booking fee)</strong> if you cancel your
            booking more than 24 hours before departure, and a{" "}
            <strong>50% refund (less booking fee)</strong> if you cancel your
            booking less than 24 hours before departure.
          </p>
          <a href="#policies" className="self-start font-bold underline">
            Cancellation policy
          </a>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <h2 className="text-xl font-bold">Payment Policy</h2>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1 rounded-control border border-warning-border bg-warning-surface px-4 py-3 leading-5">
            <p className="font-bold">
              You won’t be charged until your Booking Request is approved by the
              driver.{" "}
              <a href="#policies" className="underline">
                More info
              </a>
            </p>
            <p className="text-blue-secondary">
              {driverName} has {responseWindowHours} hours to approve your
              Booking Request.
            </p>
          </div>
          <p className="font-bold">
            By booking, you agree to our{" "}
            <a href="#policies" className="underline">
              Terms of Service
            </a>
            ,{" "}
            <a href="#policies" className="underline">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="#policies" className="underline">
              Passenger Cancellation Policy
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
