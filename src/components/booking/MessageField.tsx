import { useId } from "react";
import { HelpTip } from "@/components/ui/HelpTip";

type MessageFieldProps = {
  driverName: string;
  value: string;
  onChange: (value: string) => void;
};

export function MessageField({
  driverName,
  value,
  onChange,
}: MessageFieldProps) {
  const id = useId();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-start desktop:flex-row desktop:items-center desktop:justify-between">
        <label htmlFor={id} className="text-xl font-bold">
          Message to {driverName} (optional)
        </label>
        <span className="flex items-center gap-2 text-base font-semibold">
          Private message
          <HelpTip label="About private messages" desktopAlign="end">
            {`Only ${driverName} can read this. Share anything that helps them decide, like why you’re travelling.`}
          </HelpTip>
        </span>
      </div>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. I’m visiting my friends for the weekend and would love a ride with you!"
        className="h-30 resize-none rounded-control border border-blue-border bg-blue-surface p-4 text-base placeholder:text-blue-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-primary"
      />
    </div>
  );
}
