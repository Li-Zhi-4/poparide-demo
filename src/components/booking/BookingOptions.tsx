import { useId } from "react";
import { HelpTip } from "@/components/ui/HelpTip";
import { Select } from "@/components/ui/Select";

export const responseWindows = [6, 12, 24, 48] as const;

type BookingOptionsProps = {
  seats: number;
  maxSeats: number;
  onSeatsChange: (seats: number) => void;
  responseWindowHours: number;
  onResponseWindowChange: (hours: number) => void;
};

export function BookingOptions({
  seats,
  maxSeats,
  onSeatsChange,
  responseWindowHours,
  onResponseWindowChange,
}: BookingOptionsProps) {
  const seatsId = useId();
  const responseId = useId();
  const responseHintId = useId();

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label htmlFor={seatsId} className="text-xl font-bold">
            Seats required
          </label>
          <HelpTip label="About seats">
            The number of seats you need for this ride, up to the seats free on
            every part of your trip.
          </HelpTip>
        </div>
        <Select
          id={seatsId}
          className="w-38.25"
          value={seats}
          disabled={maxSeats === 0}
          onChange={(e) => onSeatsChange(Number(e.target.value))}
        >
          {maxSeats === 0 ? (
            <option value={0}>No seats left</option>
          ) : (
            Array.from({ length: maxSeats }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "seat" : "seats"}
              </option>
            ))
          )}
        </Select>
      </div>

      <div className="flex items-start gap-9">
        <div className="flex flex-1 flex-col gap-2">
          <label htmlFor={responseId} className="text-xl font-bold">
            How soon do you need a response?
          </label>
          <p id={responseHintId} className="text-base">
            Choose the time the driver has to respond to your Booking Request,
            beyond which it will expire automatically.
          </p>
        </div>
        <Select
          id={responseId}
          aria-describedby={responseHintId}
          value={responseWindowHours}
          onChange={(e) => onResponseWindowChange(Number(e.target.value))}
        >
          {responseWindows.map((hours) => (
            <option key={hours} value={hours}>
              Within {hours} hours
            </option>
          ))}
        </Select>
      </div>
    </>
  );
}
