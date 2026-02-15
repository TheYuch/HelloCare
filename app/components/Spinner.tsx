type SpinnerSize = "sm" | "md" | "lg";

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-[3px]",
};

interface SpinnerProps {
  size?: SpinnerSize;
}

export function Spinner({ size = "md" }: SpinnerProps) {
  return (
    <div
      className={`rounded-full border-neutral-400 border-t-neutral-900 animate-spin ${sizeClasses[size]}`}
      role="status"
      aria-label="Loading"
    />
  );
}
