import type { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button"> & {
  fullWidth?: boolean;
};

export function Button({
  fullWidth = false,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`flex items-center justify-center rounded-control bg-blue-primary px-4 py-2 text-sm font-medium text-neutral-50 transition-colors hover:bg-blue-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-primary disabled:opacity-50 ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    />
  );
}
