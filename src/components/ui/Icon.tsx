import Image from "next/image";

// Intrinsic sizes of the SVGs exported from Figma. Each sits centred in a
// square frame (`box`) the way it does in the design, so layout matches even
// though the glyphs themselves aren't square.
const icons = {
  pin: { width: 11.6667, height: 14.3333 },
  calendar: { width: 13, height: 14.3333 },
  help: { width: 16, height: 16 },
  "chevron-down": { width: 11, height: 6.5 },
  "chevron-down-white": { width: 14, height: 8 },
  verified: { width: 22.0061, height: 21.9983 },
  star: { width: 16, height: 15.265 },
  "no-strong-scents": { width: 21, height: 21 },
  "chat-ok": { width: 19, height: 19 },
  "back-seats": { width: 21, height: 17 },
  luggage: { width: 21, height: 19 },
  "no-winter-tires": { width: 24, height: 24 },
  "no-bikes": { width: 24, height: 24 },
  pets: { width: 20.9939, height: 20.9989 },
} as const;

export type IconName = keyof typeof icons;

type IconProps = {
  name: IconName;
  /** Size of the square frame around the glyph, in px. */
  box: 16 | 18 | 24;
  className?: string;
};

const boxClass = { 16: "size-4", 18: "size-4.5", 24: "size-6" } as const;

export function Icon({ name, box, className = "" }: IconProps) {
  const { width, height } = icons[name];
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center ${boxClass[box]} ${className}`}
    >
      <Image src={`/icons/${name}.svg`} alt="" width={width} height={height} />
    </span>
  );
}
